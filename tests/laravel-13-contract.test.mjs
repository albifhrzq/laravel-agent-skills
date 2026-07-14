import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import {
  MASTER_ROOT,
  REPO_ROOT,
  assertDirectory,
  assertExists,
  canonicalGuideInputs,
  collectMarkdownLinks,
  collectPhpFences,
  countLines,
  listMarkdown,
  matchRoutes,
  parseFrontmatter,
  readJson,
  readText,
  relativeToMaster,
  renderCompiledGuide,
  sha256,
} from './helpers/laravel-contract.mjs';

const EXPECTED_SOURCE_LOCK = {
  docs: '6d8246ff751a299421520660979cc34a2b255bc9',
  framework: '514502b38e11bd676ecf83b271c9452cc7500f16',
  skeleton: '43f3606336468af53f85aa6c993ce72041c63a61',
};

const REQUIRED_REFERENCE_SECTIONS = [
  '## Applies To',
  '## Verified Laravel 13 Behavior',
  '## Correct Pattern',
  '## Incorrect Pattern',
  '## Failure Modes',
  '## Trade-offs',
  '## Version and Package Boundaries',
  '## Testing',
  '## Grounding',
];

test('canonical structure exposes one broad Laravel 13 master skill', () => {
  assertDirectory(MASTER_ROOT, 'skills/laravel-13 must be the canonical v2 master skill');

  const requiredFiles = [
    'SKILL.md',
    'README.md',
    'AGENTS.md',
    'metadata.json',
    'source-lock.json',
    'coverage-map.json',
    'provenance.json',
    'routing-map.json',
    'agents/openai.yaml',
  ];
  for (const file of requiredFiles) assertExists(resolve(MASTER_ROOT, file));
  assertDirectory(resolve(MASTER_ROOT, 'rules'));
  assertDirectory(resolve(MASTER_ROOT, 'references'));
  assert.ok(listMarkdown(resolve(MASTER_ROOT, 'rules')).length > 0, 'rules/ must not be empty');
  assert.ok(listMarkdown(resolve(MASTER_ROOT, 'references')).length > 0, 'references/ must not be empty');

  const skill = readText(resolve(MASTER_ROOT, 'SKILL.md'));
  const frontmatter = parseFrontmatter(skill);
  assert.deepEqual(Object.keys(frontmatter).sort(), ['description', 'name']);
  assert.equal(frontmatter.name, 'laravel-13');
  assert.match(frontmatter.description, /^Use when\b/i);
  assert.ok(frontmatter.description.length <= 1024, 'frontmatter description exceeds 1024 characters');
  for (const trigger of [
    'laravel', 'composer', 'artisan', 'route', 'controller', 'session', 'csrf',
    'blade', 'vite', 'eloquent', 'migration', 'queue', 'test', 'deployment', 'traceback',
  ]) {
    assert.ok(
      frontmatter.description.toLowerCase().includes(trigger),
      `Broad skill description must include the ${trigger} trigger`,
    );
  }
  assert.ok(countLines(skill) <= 500, 'SKILL.md must stay below the 500-line progressive-disclosure limit');

  const metadata = readJson(resolve(MASTER_ROOT, 'metadata.json'));
  assert.equal(metadata.name, 'laravel-13');
  assert.equal(metadata.version, '2.0.0');
  assert.equal(metadata.framework, 'Laravel');
  assert.equal(metadata.laravelVersion, '13.x');
  assert.equal(metadata.phpVersion, '8.3+');
  assert.equal(metadata.type, 'master');
  assert.equal(metadata.license, 'MIT');

  const readme = readText(resolve(MASTER_ROOT, 'README.md'));
  assert.match(readme, /npx skills add albifhrzq\/laravel-agent-skills --skill laravel-13/);
  assert.match(readText(resolve(MASTER_ROOT, 'agents/openai.yaml')), /laravel-13/i);

  const packageJson = readJson(resolve(REPO_ROOT, 'package.json'));
  const packageLock = readJson(resolve(REPO_ROOT, 'package-lock.json'));
  assert.equal(packageLock.packages[''].engines.node, packageJson.engines.node);

  for (const path of canonicalGuideInputs().slice(1)) {
    assert.ok(
      skill.includes(relativeToMaster(path)),
      `SKILL.md must link directly to ${relativeToMaster(path)} for one-level progressive disclosure`,
    );
  }
});

test('runtime contract is version-aware, project-first, explicit-stack-only, and visible', () => {
  const skill = readText(resolve(MASTER_ROOT, 'SKILL.md'));
  const composerLock = skill.indexOf('composer.lock');
  const composerJson = skill.indexOf('composer.json');
  assert.ok(composerLock >= 0 && composerJson > composerLock, 'Version detection must prefer composer.lock over composer.json');
  assert.match(skill, /Laravel grounding:/);
  assert.match(skill, /version mismatch|detected version|not Laravel 13/i);
  assert.match(skill, /project (?:convention|code|configuration|tests?).*(?:wins|precedence|first)/i);
  assert.match(skill, /correctness|security|incompatib/i);
  assert.match(skill, /explicit(?:ly)? request/i);
  for (const stack of ['Livewire', 'Inertia', 'Flux', 'React', 'Vue', 'Svelte', 'Tailwind']) {
    assert.ok(skill.includes(stack), `UI package boundary must mention ${stack}`);
  }
  for (const source of ['Boost', 'Context7', 'official Laravel']) {
    assert.match(skill, new RegExp(source, 'i'));
  }
  assert.match(skill, /source-lock\.json/);
  assert.match(skill, /routing-map\.json/);
});

test('source lock, complete docs coverage, and provenance are machine-verifiable', () => {
  const sourceLock = readJson(resolve(MASTER_ROOT, 'source-lock.json'));
  assert.equal(sourceLock.schemaVersion, 1);
  assert.match(sourceLock.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  for (const [name, commit] of Object.entries(EXPECTED_SOURCE_LOCK)) {
    const source = sourceLock.sources?.[name];
    assert.ok(source, `source-lock.json is missing sources.${name}`);
    assert.equal(source.commit, commit, `sources.${name} is not locked to the verified baseline`);
    assert.equal(source.license, 'MIT');
    assert.match(source.repository, /^https:\/\/github\.com\/laravel\//);
  }
  assert.equal(sourceLock.sources.framework.version, 'v13.19.0');
  assert.equal(sourceLock.sources.docs.branch, '13.x');
  assert.equal(sourceLock.sources.skeleton.branch, '13.x');

  const expectedPages = readJson(resolve(REPO_ROOT, 'tests/fixtures/laravel-13-doc-pages.json')).sort();
  const inventoryHash = sha256(`${expectedPages.join('\n')}\n`);
  assert.equal(sourceLock.sources.docs.inventorySha256, inventoryHash);
  const coverage = readJson(resolve(MASTER_ROOT, 'coverage-map.json'));
  assert.equal(coverage.schemaVersion, 1);
  assert.equal(coverage.laravelVersion, '13.x');
  assert.equal(coverage.sourceCommit, EXPECTED_SOURCE_LOCK.docs);
  assert.equal(coverage.sourceInventorySha256, inventoryHash);
  assert.equal(coverage.generatedAt, sourceLock.verifiedAt);
  assert.equal(coverage.pages.length, new Set(coverage.pages.map(({ slug }) => slug)).size, 'Coverage slugs must be unique');
  assert.deepEqual(coverage.pages.map(({ slug }) => slug).sort(), expectedPages);

  for (const page of coverage.pages) {
    assert.ok(['deep', 'routed', 'out-of-scope'].includes(page.classification), `${page.slug} has an invalid classification`);
    if (page.classification === 'out-of-scope') {
      assert.ok(page.reason?.trim(), `${page.slug} needs a reason when out-of-scope`);
      continue;
    }
    assert.ok(page.references?.length > 0, `${page.slug} must route to at least one reference`);
    for (const reference of page.references) assertExists(resolve(MASTER_ROOT, reference));
  }

  const semanticCoverage = {
    collections: ['references/collections-strings-processes.md', [/LazyCollection/, /higher[- ]order/i, /mutat/i]],
    contracts: ['references/collections-strings-processes.md', [/Illuminate\\Contracts/, /bind|singleton|scoped/]],
    helpers: ['references/collections-strings-processes.md', [/data_get/, /e\(\$value\)/, /retry\(/]],
    processes: ['references/collections-strings-processes.md', [/Process::run/, /timeout/, /preventStrayProcesses/]],
    strings: ['references/collections-strings-processes.md', [/Stringable/, /Str::markdown/, /Str::isUrl/]],
    search: ['references/search-vector-reranking.md', [/whereFullText/, /whereVectorSimilarTo/, /ensureVectorExtensionExists/, /rerank/i]],
    installation: ['references/version-grounding.md', [/laravel new/, /database\/database\.sqlite/]],
    upgrade: ['references/version-grounding.md', [
      /\^13\.0/,
      /CACHE_PREFIX.*REDIS_PREFIX.*SESSION_COOKIE/s,
      /Container::call/,
      /dispatchAfterResponse/,
      /markEmailAsUnverified/,
      /non-empty.*uniqueBy/s,
      /Instantiating a model while.*booting/s,
      /Response::throw/,
      /DeleteWhenMissingModels/,
      /JobAttempted::\$exceptionOccurred/,
      /withScheduling/,
      /PreventRequestForgery.*Sec-Fetch-Site/s,
      /Js::from/,
      /polyfill-php85/,
      /pagination::bootstrap-3/,
    ]],
  };
  for (const [slug, [reference, patterns]] of Object.entries(semanticCoverage)) {
    const page = coverage.pages.find((item) => item.slug === slug);
    assert.equal(page?.classification, 'deep', `${slug} must remain deep only with semantic coverage`);
    assert.ok(page.references.includes(reference), `${slug} must route to ${reference}`);
    const markdown = readText(resolve(MASTER_ROOT, reference));
    for (const pattern of patterns) assert.match(markdown, pattern, `${reference} is too shallow for ${slug}`);
  }

  const provenance = readJson(resolve(MASTER_ROOT, 'provenance.json'));
  assert.equal(provenance.schemaVersion, 1);
  assert.equal(provenance.verifiedAt, sourceLock.verifiedAt);
  const frameworkSourceId = `laravel-framework-${sourceLock.sources.framework.version.replace(/^v/, '')}`;
  assert.equal(
    provenance.sources['laravel-docs-13'].url,
    `${sourceLock.sources.docs.repository}/tree/${sourceLock.sources.docs.commit}`,
  );
  assert.equal(
    provenance.sources[frameworkSourceId].url,
    `${sourceLock.sources.framework.repository}/tree/${sourceLock.sources.framework.commit}`,
  );
  assert.ok(
    provenance.files['references/search-vector-reranking.md'].sources.includes(frameworkSourceId),
    'Source-verified search signatures must cite the pinned framework source',
  );
  assert.ok(
    provenance.files['references/search-vector-reranking.md'].sources.includes('installed-package-docs'),
    'Scout and AI SDK claims must cite installed package documentation',
  );
  assert.equal(
    provenance.sources['laravel-skeleton-13'].url,
    `${sourceLock.sources.skeleton.repository}/tree/${sourceLock.sources.skeleton.commit}`,
  );
  const governedFiles = [
    ...listMarkdown(resolve(MASTER_ROOT, 'rules')),
    ...listMarkdown(resolve(MASTER_ROOT, 'references')),
  ];
  for (const path of governedFiles) {
    const name = relativeToMaster(path);
    const record = provenance.files?.[name];
    assert.ok(record, `provenance.json must govern ${name}`);
    assert.ok(
      ['official', 'derived', 'project-convention', 'package-specific', 'mixed'].includes(record.classification),
      `${name} has an invalid provenance classification`,
    );
    if (record.classification === 'mixed') {
      assert.deepEqual(record.components, ['official', 'derived', 'project-convention']);
    }
    assert.ok(record.sources?.length > 0, `${name} must cite at least one source identifier`);
    for (const sourceId of record.sources) {
      assert.ok(provenance.sources[sourceId], `${name} cites unknown source ${sourceId}`);
    }
    assert.equal(record.contentSha256, sha256(readText(path)), `${name} provenance digest is stale`);
    assert.match(record.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);

    const markdown = readText(path);
    for (const line of markdown.split('\n').filter((value) => /\b(?:MUST|NEVER)\b/.test(value))) {
      const marker = line.match(/\[claim:([A-Z0-9-]+)\]/);
      assert.ok(marker, `${name} normative line needs a [claim:ID] marker: ${line}`);
      assert.ok(provenance.claims?.[marker?.[1]], `${name} cites unknown claim ${marker?.[1]}`);
    }
  }

  for (const path of listMarkdown(resolve(MASTER_ROOT, 'references'))) {
    const markdown = readText(path);
    assert.ok(
      countLines(markdown.trimEnd()) <= 800,
      `${relativeToMaster(path)} exceeds the 800-line reference limit`,
    );
    for (const heading of REQUIRED_REFERENCE_SECTIONS) {
      assert.ok(markdown.includes(heading), `${relativeToMaster(path)} is missing ${heading}`);
    }
    if (countLines(markdown) > 100) {
      assert.ok(markdown.includes('## Contents'), `${relativeToMaster(path)} exceeds 100 lines and needs a contents section`);
    }
  }
});

test('generated guide has no drift from canonical skill, rules, and references', () => {
  const agentsPath = resolve(MASTER_ROOT, 'AGENTS.md');
  assert.equal(readText(agentsPath), renderCompiledGuide());
});

test('generated coverage, eval, and provenance artifacts have no drift', () => {
  for (const script of [
    'scripts/build-coverage-map.mjs',
    'scripts/build-eval-manifest.mjs',
    'scripts/build-provenance.mjs',
  ]) {
    const result = spawnSync(process.execPath, [resolve(REPO_ROOT, script), '--check'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  }
});

test('generated workflow agents have no drift from canonical workflow skills', () => {
  for (const name of ['laravel-code-reviewer', 'laravel-code-tracer']) {
    const source = readText(resolve(REPO_ROOT, 'skills', name, 'SKILL.md'));
    const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    assert.ok(match, `skills/${name}/SKILL.md has invalid frontmatter`);
    const description = match[1]
      .split('\n')
      .find((line) => line.startsWith('description: '))
      ?.slice('description: '.length);
    assert.ok(description, `skills/${name}/SKILL.md has no description`);

    const expected = [
      '---',
      `name: ${name}`,
      `description: ${description}`,
      'model: inherit',
      'readonly: true',
      'is_background: false',
      '---',
      '',
      `<!-- GENERATED FROM skills/${name}/SKILL.md; do not edit directly. -->`,
      '',
      match[2].trim(),
      '',
    ].join('\n');

    assert.equal(readText(resolve(REPO_ROOT, 'agents', name, 'SKILL.md')), expected);
  }
});

test('breaking migration removes standalone design skills and binds reviewer and tracer to master', () => {
  for (const legacy of ['laravel-api-design', 'laravel-database-design']) {
    assert.equal(
      existsSync(resolve(REPO_ROOT, 'skills', legacy)),
      false,
      `Breaking v2 must remove the standalone ${legacy} skill`,
    );
  }

  const workflows = [
    'skills/laravel-code-reviewer/SKILL.md',
    'skills/laravel-code-tracer/SKILL.md',
    'agents/laravel-code-reviewer/SKILL.md',
    'agents/laravel-code-tracer/SKILL.md',
  ];
  for (const file of workflows) {
    const markdown = readText(resolve(REPO_ROOT, file));
    assert.match(markdown, /laravel-13\/SKILL\.md/i, `${file} must depend on the master skill`);
    assert.match(markdown, /composer\.lock/i, `${file} must resolve the installed Laravel version`);
    assert.match(markdown, /Laravel grounding:/i, `${file} must preserve visible grounding`);
    assert.doesNotMatch(markdown, /laravel-(?:api|database)-design/i, `${file} still references a removed standalone skill`);
  }

  for (const name of ['laravel-code-reviewer', 'laravel-code-tracer']) {
    const metadata = readText(resolve(REPO_ROOT, 'skills', name, 'agents', 'openai.yaml'));
    assert.match(metadata, new RegExp(name, 'i'));
    assert.match(metadata, /allow_implicit_invocation:\s*true/);
  }
});

test('PHP snippets are explicitly classified and runnable snippets pass php -l', () => {
  const files = canonicalGuideInputs();
  let runnableCount = 0;

  for (const path of files) {
    const fences = collectPhpFences(readText(path), path);
    if (relativeToMaster(path).startsWith('references/')) {
      assert.ok(fences.length > 0, `${relativeToMaster(path)} must contain a practical PHP example`);
    }

    for (const fence of fences) {
      assert.ok(
        ['runnable', 'illustrative'].includes(fence.classification),
        `${relative(REPO_ROOT, path)}:${fence.line} must be fenced as php runnable or php illustrative`,
      );
      if (fence.classification !== 'runnable') continue;
      runnableCount += 1;
      const directory = mkdtempSync(resolve(tmpdir(), 'laravel-skill-snippet-'));
      const snippetPath = resolve(directory, 'snippet.php');
      const source = fence.code.includes('<?php') ? fence.code : `<?php\n${fence.code}`;
      writeFileSync(snippetPath, source);
      const result = spawnSync('php', ['-l', snippetPath], { encoding: 'utf8' });
      rmSync(directory, { recursive: true, force: true });
      assert.equal(
        result.status,
        0,
        `${relativeToMaster(path)}:${fence.line} is not valid PHP:\n${result.stdout}${result.stderr}`,
      );
    }
  }

  assert.ok(runnableCount > 0, 'The master skill must include at least one runnable PHP snippet');
});

test('install smoke preserves a self-contained skill with valid relative links', () => {
  assertDirectory(MASTER_ROOT, 'Cannot install a missing skills/laravel-13 master skill');
  const temporaryHome = mkdtempSync(resolve(tmpdir(), 'laravel-skill-install-'));
  const installed = resolve(temporaryHome, '.agents', 'skills', 'laravel-13');

  try {
    cpSync(MASTER_ROOT, installed, { recursive: true });
    for (const file of ['SKILL.md', 'README.md', 'AGENTS.md', 'metadata.json', 'source-lock.json']) {
      assertExists(resolve(installed, file), `Installed skill is missing ${file}`);
    }
    assert.equal(parseFrontmatter(readText(resolve(installed, 'SKILL.md'))).name, 'laravel-13');

    for (const path of listMarkdown(installed)) {
      for (const link of collectMarkdownLinks(readText(path))) {
        const target = decodeURIComponent(link.split('#')[0]);
        if (!target || target.startsWith('/')) continue;
        assertExists(
          resolve(dirname(path), target),
          `Broken installed link in ${relative(installed, path)}: ${link}`,
        );
      }
    }
  } finally {
    rmSync(temporaryHome, { recursive: true, force: true });
  }
});

test('static golden scenarios route deterministically and honor explicit UI package boundaries', () => {
  const routingMap = readJson(resolve(MASTER_ROOT, 'routing-map.json'));
  const scenarios = readJson(resolve(REPO_ROOT, 'tests/fixtures/golden-scenarios.json'));
  assert.equal(routingMap.schemaVersion, 1);
  assert.equal(routingMap.laravelVersion, '13.x');
  assert.equal(routingMap.routes.length, new Set(routingMap.routes.map(({ id }) => id)).size, 'Route IDs must be unique');

  for (const route of routingMap.routes) {
    assert.ok(route.triggers?.length > 0, `${route.id} needs static trigger terms`);
    assert.ok(route.references?.length > 0, `${route.id} needs at least one reference`);
    for (const path of route.references) assertExists(resolve(MASTER_ROOT, path));
  }

  for (const scenario of scenarios) {
    const actualRoutes = matchRoutes(routingMap, scenario);
    for (const route of scenario.expectedRoutes) {
      assert.ok(actualRoutes.includes(route), `${scenario.id} did not select expected route ${route}; got ${actualRoutes.join(', ')}`);
    }
    for (const route of scenario.forbiddenRoutes ?? []) {
      assert.ok(!actualRoutes.includes(route), `${scenario.id} must not select ${route} without explicit request or detected package`);
    }
    assert.deepEqual(
      actualRoutes.sort(),
      [...new Set([...(scenario.expectedRoutes ?? []), ...(scenario.allowedRoutes ?? [])])].sort(),
      `${scenario.id} selected unrelated routes`,
    );
  }

  const scoutCoverage = readJson(resolve(MASTER_ROOT, 'coverage-map.json')).pages
    .find(({ slug }) => slug === 'scout');
  assert.ok(scoutCoverage.references.includes('references/search-vector-reranking.md'));
});
