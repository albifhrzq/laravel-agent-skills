import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const argumentsList = process.argv.slice(2);
const requireAllTargets = argumentsList.includes('--require-all-targets');
const inputPath = argumentsList.find((argument) => !argument.startsWith('--'));

if (!inputPath) {
  console.error('Usage: npm run eval:model -- path/to/evaluation-bundle.json [--require-all-targets]');
  process.exit(2);
}

const manifest = JSON.parse(readFileSync(resolve(repoRoot, 'evals', 'laravel-13', 'manifest.json'), 'utf8'));
const input = JSON.parse(readFileSync(resolve(inputPath), 'utf8'));
const evaluations = input.evaluations;

function failContract(message) {
  console.error(`Invalid evaluation bundle: ${message}`);
  process.exit(2);
}

if (!Array.isArray(evaluations) || evaluations.length === 0) {
  failContract('evaluations must contain at least one target');
}

const allowedTargets = new Set(manifest.primaryTargets);
const seenTargets = new Set();
for (const evaluation of evaluations) {
  if (!allowedTargets.has(evaluation.target)) failContract(`unknown target ${evaluation.target ?? '<missing>'}`);
  if (seenTargets.has(evaluation.target)) failContract(`target ${evaluation.target} appears more than once`);
  seenTargets.add(evaluation.target);
}

if (requireAllTargets) {
  const missingTargets = manifest.primaryTargets.filter((target) => !seenTargets.has(target));
  if (missingTargets.length > 0) failContract(`release gate requires targets: ${missingTargets.join(', ')}`);
}

const expectedCaseIds = new Set(manifest.cases.map(({ id }) => id));
const allRunIds = new Set();
const targetResults = [];

function uniqueMap(items, key, label) {
  const map = new Map();
  for (const item of items ?? []) {
    const value = item?.[key];
    if (!value || map.has(value)) failContract(`${label} contains a missing or duplicate ${key}`);
    map.set(value, item);
  }
  return map;
}

function containsUnsafeMatch(response, pattern) {
  const expression = new RegExp(pattern, 'ig');
  let match;

  while ((match = expression.exec(response)) !== null) {
    const prefix = response.slice(Math.max(0, match.index - 60), match.index);
    const negated = /(?:\bnever|\bdo\s+not|\bdon't|\bshould\s+not|\bshouldn't|\bmust\s+not|\bmustn't|\bcannot|\bcan't)(?:\s+(?:ever|directly|silently|simply|just)){0,2}\s*$/i.test(prefix);
    if (!negated) return true;
    if (match[0] === '') expression.lastIndex += 1;
  }

  return false;
}

for (const evaluation of evaluations) {
  if (!Array.isArray(evaluation.runs) || evaluation.runs.length < manifest.minimumIndependentRuns) {
    failContract(`${evaluation.target} requires at least ${manifest.minimumIndependentRuns} independent runs`);
  }

  const runResults = [];
  for (const run of evaluation.runs) {
    if (typeof run.id !== 'string' || run.id.trim() === '') failContract(`${evaluation.target} has a run without an id`);
    const globalRunId = `${evaluation.target}:${run.id}`;
    if (allRunIds.has(globalRunId)) failContract(`duplicate run id ${globalRunId}`);
    allRunIds.add(globalRunId);

    const responses = uniqueMap(run.responses, 'caseId', `${globalRunId} responses`);
    const reviews = uniqueMap(run.reviews, 'caseId', `${globalRunId} reviews`);
    const suppliedResponseIds = new Set(responses.keys());
    const suppliedReviewIds = new Set(reviews.keys());
    for (const suppliedId of [...suppliedResponseIds, ...suppliedReviewIds]) {
      if (!expectedCaseIds.has(suppliedId)) failContract(`${globalRunId} contains unknown case ${suppliedId}`);
    }
    for (const expectedId of expectedCaseIds) {
      if (!responses.has(expectedId)) failContract(`${globalRunId} is missing response for ${expectedId}`);
    }

    const caseResults = manifest.cases.map((item) => {
      const response = responses.get(item.id).response;
      const review = reviews.get(item.id);
      if (!review) failContract(`${globalRunId} is missing semantic review for ${item.id}`);
      if (!manifest.semanticReview.allowedVerdicts.includes(review.verdict)) {
        failContract(`${globalRunId}/${item.id} has invalid semantic verdict`);
      }
      if (typeof review.reviewer !== 'string' || review.reviewer.trim() === '') {
        failContract(`${globalRunId}/${item.id} is missing reviewer identity`);
      }
      if (typeof review.notes !== 'string' || review.notes.trim() === '') {
        failContract(`${globalRunId}/${item.id} is missing semantic review notes`);
      }

      const checks = [
        { name: 'grounding', passed: /Laravel grounding:/i.test(response) },
        ...item.expectedReferences.map((reference) => ({
          name: `reference:${reference}`,
          passed: response.toLowerCase().includes(reference.toLowerCase()),
        })),
        ...item.assertions.map((pattern) => ({
          name: `assertion:${pattern}`,
          passed: new RegExp(pattern, 'i').test(response),
        })),
        ...[...(manifest.globalForbiddenPatterns ?? []), ...(item.forbiddenPatterns ?? [])].map((pattern) => ({
          name: `forbidden:${pattern}`,
          passed: !containsUnsafeMatch(response, pattern),
        })),
        { name: 'semantic-review', passed: review.verdict === 'pass' },
      ];

      return { id: item.id, risk: item.risk, passed: checks.every(({ passed }) => passed), checks };
    });

    const passed = caseResults.filter(({ passed }) => passed).length;
    const score = passed / caseResults.length;
    const highRisk = caseResults.filter(({ risk }) => risk === 'high');
    const highRiskPassRate = highRisk.filter(({ passed }) => passed).length / highRisk.length;
    const semanticReviewPassRate = caseResults.filter(({ checks }) => (
      checks.find(({ name }) => name === 'semantic-review')?.passed
    )).length / caseResults.length;
    const passedGate = score >= manifest.passingScorePerRun
      && highRiskPassRate >= manifest.requiredHighRiskPassRate
      && semanticReviewPassRate >= manifest.requiredSemanticReviewPassRate;

    runResults.push({ id: run.id, score, highRiskPassRate, semanticReviewPassRate, passed: passedGate, cases: caseResults });
  }

  targetResults.push({ target: evaluation.target, passed: runResults.every(({ passed }) => passed), runs: runResults });
}

for (const target of targetResults) {
  for (const run of target.runs) {
    console.log(
      `${target.target}/${run.id}: score=${(run.score * 100).toFixed(1)}% high-risk=${(run.highRiskPassRate * 100).toFixed(1)}% semantic=${(run.semanticReviewPassRate * 100).toFixed(1)}% ${run.passed ? 'PASS' : 'FAIL'}`,
    );
    for (const item of run.cases.filter(({ passed }) => !passed)) {
      const failedChecks = item.checks.filter(({ passed }) => !passed).map(({ name }) => name);
      console.log(`  FAIL ${item.id}: ${failedChecks.join(', ')}`);
    }
  }
}

if (!targetResults.every(({ passed }) => passed)) process.exitCode = 1;
