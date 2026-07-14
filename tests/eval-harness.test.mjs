import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import { REPO_ROOT, readJson } from './helpers/laravel-contract.mjs';

const manifestPath = resolve(REPO_ROOT, 'evals', 'laravel-13', 'manifest.json');
const promptsPath = resolve(REPO_ROOT, 'evals', 'laravel-13', 'prompts.json');
const scorerPath = resolve(REPO_ROOT, 'scripts', 'score-model-eval.mjs');

function validResponse(item, suffix = '') {
  return [
    ...item.expectedReferences.map((reference) => `Read ${reference}.`),
    ...item.assertions.map((pattern) => pattern.replace(/\\([()[\].^$?+*{}|\\-])/g, '$1')),
    suffix,
    'Laravel grounding: detected 13.19.0 from composer.lock; read verified references; verified against official Laravel 13.x docs.',
  ].filter(Boolean).join('\n');
}

function validEvaluation(target, manifest) {
  return {
    target,
    runs: Array.from({ length: manifest.minimumIndependentRuns }, (_, index) => ({
      id: `${target}-run-${index + 1}`,
      responses: manifest.cases.map((item) => ({
        caseId: item.id,
        response: validResponse(item),
      })),
      reviews: manifest.cases.map((item) => ({
        caseId: item.id,
        verdict: 'pass',
        reviewer: `independent-reviewer-${index + 1}`,
        notes: 'Mechanics fixture: semantic verdict fields are present; this unit test is not a model-quality result.',
      })),
    })),
  };
}

function score(bundle, extraArguments = []) {
  const directory = mkdtempSync(resolve(tmpdir(), 'laravel-model-eval-'));
  const inputPath = resolve(directory, 'bundle.json');
  writeFileSync(inputPath, JSON.stringify(bundle));

  try {
    return spawnSync(process.execPath, [scorerPath, inputPath, ...extraArguments], { encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('behavioral eval manifest covers golden scenarios and defines semantic multi-run acceptance', () => {
  assert.ok(existsSync(manifestPath), 'evals/laravel-13/manifest.json is required');
  const manifest = readJson(manifestPath);
  const prompts = readJson(promptsPath);
  const golden = readJson(resolve(REPO_ROOT, 'tests', 'fixtures', 'golden-scenarios.json'));

  assert.equal(manifest.schemaVersion, 2);
  assert.equal(manifest.laravelVersion, '13.x');
  assert.deepEqual([...manifest.primaryTargets].sort(), ['claude', 'codex']);
  assert.equal(manifest.minimumIndependentRuns, 3);
  assert.equal(manifest.passingScorePerRun, 0.9);
  assert.equal(manifest.requiredHighRiskPassRate, 1);
  assert.equal(manifest.requiredSemanticReviewPassRate, 1);
  assert.equal(manifest.semanticReview.requiredForEveryCase, true);
  assert.ok(manifest.globalForbiddenPatterns.length > 0);
  assert.ok(manifest.cases.some(({ risk }) => risk === 'high'));
  assert.deepEqual(
    prompts.map(({ id }) => id),
    manifest.cases.map(({ id }) => id),
    'prompts.json must expose the same cases without rubric leakage',
  );
  for (const prompt of prompts) assert.deepEqual(Object.keys(prompt).sort(), ['id', 'prompt', 'setup']);

  const ids = new Set(manifest.cases.map(({ id }) => id));
  for (const scenario of golden) assert.ok(ids.has(scenario.id), `Eval manifest is missing ${scenario.id}`);
  for (const item of manifest.cases) {
    assert.ok(item.prompt?.trim(), `${item.id} needs a prompt`);
    assert.ok(item.expectedReferences?.length > 0, `${item.id} needs expected references`);
    assert.ok(item.assertions?.length > 0, `${item.id} needs behavioral assertions`);
    assert.ok(['normal', 'high'].includes(item.risk), `${item.id} needs a risk class`);
  }
});

test('model eval scorer mechanically accepts three complete reviewed runs', () => {
  const manifest = readJson(manifestPath);
  const evaluation = validEvaluation('codex', manifest);
  const safeCsrfResponse = evaluation.runs[0].responses.find(({ caseId }) => caseId === 'session-csrf');
  safeCsrfResponse.response += '\nDo not disable CSRF. You should not bypass the CSRF middleware. Never remove CSRF protection.';
  const result = score({ evaluations: [evaluation] });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /codex\/codex-run-3: score=100\.0% high-risk=100\.0% semantic=100\.0% PASS/);
});

test('release model gate requires every configured target', () => {
  const manifest = readJson(manifestPath);
  const incomplete = score(
    { evaluations: [validEvaluation('codex', manifest)] },
    ['--require-all-targets'],
  );
  assert.equal(incomplete.status, 2);
  assert.match(incomplete.stderr, /requires targets: claude/);

  const complete = score({
    evaluations: [validEvaluation('codex', manifest), validEvaluation('claude', manifest)],
  }, ['--require-all-targets']);
  assert.equal(complete.status, 0, complete.stderr || complete.stdout);
});

test('model eval scorer rejects fewer than three runs and missing semantic reviews', () => {
  const manifest = readJson(manifestPath);
  const oneRun = validEvaluation('codex', manifest);
  oneRun.runs = oneRun.runs.slice(0, 1);
  const insufficient = score({ evaluations: [oneRun] });
  assert.equal(insufficient.status, 2);
  assert.match(insufficient.stderr, /requires at least 3 independent runs/);

  const missingReview = validEvaluation('codex', manifest);
  missingReview.runs[0].reviews = missingReview.runs[0].reviews.slice(1);
  const unreviewed = score({ evaluations: [missingReview] });
  assert.equal(unreviewed.status, 2);
  assert.match(unreviewed.stderr, /missing semantic review/);
});

test('model eval scorer rejects dangerous advice even with a passing review verdict', () => {
  const manifest = readJson(manifestPath);
  const evaluation = validEvaluation('codex', manifest);
  const csrfCase = manifest.cases.find(({ id }) => id === 'session-csrf');
  evaluation.runs[0].responses.find(({ caseId }) => caseId === csrfCase.id).response = validResponse(
    csrfCase,
    'Disable CSRF to make this form work.',
  );

  const result = score({ evaluations: [evaluation] });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /codex\/codex-run-1: .*FAIL/);
  assert.match(result.stdout, /FAIL session-csrf: .*forbidden:/);

  const reversal = validEvaluation('codex', manifest);
  reversal.runs[0].responses.find(({ caseId }) => caseId === csrfCase.id).response = validResponse(
    csrfCase,
    'Do not forget to disable CSRF to make this form work.',
  );
  const reversalResult = score({ evaluations: [reversal] });
  assert.equal(reversalResult.status, 1);
  assert.match(reversalResult.stdout, /FAIL session-csrf: .*forbidden:/);

  for (const [caseId, advice] of [
    ['authorization', 'Do not forget to bypass authorization for this controller.'],
    ['webhook-http-client', 'Do not forget to disable the webhook signature.'],
  ]) {
    const adversarial = validEvaluation('codex', manifest);
    const item = manifest.cases.find(({ id }) => id === caseId);
    adversarial.runs[0].responses.find(({ caseId: id }) => id === caseId).response = validResponse(
      item,
      advice,
    );
    const adversarialResult = score({ evaluations: [adversarial] });
    assert.equal(adversarialResult.status, 1);
    assert.match(adversarialResult.stdout, new RegExp(`FAIL ${caseId}: .*forbidden:`));
  }
});

test('model eval scorer rejects missing input, unknown targets, and failed semantic verdicts', () => {
  const usage = spawnSync(process.execPath, [scorerPath], { encoding: 'utf8' });
  assert.equal(usage.status, 2);
  assert.match(usage.stderr, /Usage:/);

  const manifest = readJson(manifestPath);
  const unknown = validEvaluation('gemini', manifest);
  const unknownResult = score({ evaluations: [unknown] });
  assert.equal(unknownResult.status, 2);
  assert.match(unknownResult.stderr, /unknown target gemini/);

  const failedReview = validEvaluation('codex', manifest);
  const normalCase = manifest.cases.find(({ risk }) => risk === 'normal');
  const normalReview = failedReview.runs[0].reviews.find(({ caseId }) => caseId === normalCase.id);
  normalReview.verdict = 'fail';
  normalReview.notes = 'The normal-risk answer violates the scenario contract.';
  const failure = score({ evaluations: [failedReview] });
  assert.equal(failure.status, 1);
  assert.match(failure.stdout, new RegExp(`FAIL ${normalCase.id}: .*semantic-review`));
});

test('model eval scorer rejects malformed target, run, response, and review contracts', () => {
  const manifest = readJson(manifestPath);

  const empty = score({ evaluations: [] });
  assert.equal(empty.status, 2);
  assert.match(empty.stderr, /at least one target/);

  const duplicateTargets = score({
    evaluations: [validEvaluation('codex', manifest), validEvaluation('codex', manifest)],
  });
  assert.equal(duplicateTargets.status, 2);
  assert.match(duplicateTargets.stderr, /appears more than once/);

  const duplicateResponses = validEvaluation('codex', manifest);
  duplicateResponses.runs[0].responses.push(duplicateResponses.runs[0].responses[0]);
  const duplicateResponseResult = score({ evaluations: [duplicateResponses] });
  assert.equal(duplicateResponseResult.status, 2);
  assert.match(duplicateResponseResult.stderr, /missing or duplicate caseId/);

  const missingResponse = validEvaluation('codex', manifest);
  missingResponse.runs[0].responses.pop();
  const missingResponseResult = score({ evaluations: [missingResponse] });
  assert.equal(missingResponseResult.status, 2);
  assert.match(missingResponseResult.stderr, /missing response/);

  const unknownCase = validEvaluation('codex', manifest);
  unknownCase.runs[0].responses[0].caseId = 'unknown-case';
  const unknownCaseResult = score({ evaluations: [unknownCase] });
  assert.equal(unknownCaseResult.status, 2);
  assert.match(unknownCaseResult.stderr, /contains unknown case/);

  for (const [field, value, expected] of [
    ['verdict', 'maybe', /invalid semantic verdict/],
    ['reviewer', '', /missing reviewer identity/],
    ['notes', '', /missing semantic review notes/],
  ]) {
    const evaluation = validEvaluation('codex', manifest);
    evaluation.runs[0].reviews[0][field] = value;
    const result = score({ evaluations: [evaluation] });
    assert.equal(result.status, 2);
    assert.match(result.stderr, expected);
  }
});
