import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';

import { MASTER_ROOT, collectPhpFences, matchRoutes, readJson } from './helpers/laravel-contract.mjs';

test('JSON helper reports invalid generated artifacts clearly', () => {
  const directory = mkdtempSync(resolve(tmpdir(), 'laravel-contract-json-'));
  const path = resolve(directory, 'invalid.json');
  writeFileSync(path, '{ invalid');

  try {
    assert.throws(() => readJson(path), /is not valid JSON/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('PHP fence collector rejects unclosed snippets', () => {
  assert.throws(
    () => collectPhpFences('```php runnable\n<?php\nreturn true;', import.meta.filename),
    /unclosed PHP fence/,
  );
});

test('router ignores only the ambiguous phrase while preserving compound concerns', () => {
  const routing = readJson(resolve(MASTER_ROOT, 'routing-map.json'));
  const cases = [
    ['database tests', ['quality']],
    ['Write database tests for a migration.', ['data', 'quality']],
    ['Deploy production queue workers.', ['operations']],
    ['Review queue worker retry and afterCommit behavior.', ['async', 'operations']],
    ['composer.lock version check for the Process facade.', ['foundation', 'core-utilities']],
    ['Use Str::markdown for this trusted rendering boundary.', ['core-utilities']],
    ['Review an authorization policy and a queue retry policy.', ['http-security', 'async']],
    ['collections, strings, and processes', ['core-utilities']],
    ['queues, jobs, events, and listeners', ['async']],
    [
      'views, components, sessions, cookies, migrations, and relationships',
      ['http-security', 'data', 'ui-core'],
    ],
    ['Validate a string input for an API contract with a FormRequest.', ['http-api']],
  ];

  for (const [prompt, expected] of cases) {
    assert.deepEqual(matchRoutes(routing, { prompt }), expected, prompt);
  }
});
