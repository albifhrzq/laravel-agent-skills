import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const scenarios = JSON.parse(readFileSync(resolve(repoRoot, 'tests', 'fixtures', 'golden-scenarios.json'), 'utf8'));
const routingMap = JSON.parse(readFileSync(resolve(repoRoot, 'skills', 'laravel-13', 'routing-map.json'), 'utf8'));
const referencesByRoute = Object.fromEntries(
  routingMap.routes.map(({ id, references }) => [id, references]),
);

for (const scenario of scenarios) {
  for (const route of scenario.expectedRoutes) {
    if (!referencesByRoute[route]) throw new Error(`${scenario.id} references unknown route ${route}`);
  }
}

const assertionsByCase = {
  'api-crud': ['FormRequest', 'Gate::authorize|#\\[Authorize', 'JsonResource'],
  'session-csrf': ['PreventRequestForgery', '@csrf|X-CSRF-TOKEN', 'session'],
  authorization: ['Gate::authorize|policy|#\\[Authorize'],
  'eloquent-n-plus-one': ['eager load|with\\(', 'whenLoaded|preventLazyLoading'],
  'migration-index': ['foreign key|constrained', 'index', 'deployment|zero-downtime'],
  'transaction-idempotency': ['transaction', 'unique constraint|unique index', 'duplicate|race'],
  'queue-after-commit': ['afterCommit|after_commit', 'retry|backoff|tries'],
  'cache-lock': ['Cache::lock|atomic lock', 'owner|release'],
  events: ['event', 'listener', 'broadcast|schedule'],
  'upload-storage': ['validate|mimes|max', 'Storage|filesystem', 'visibility|private'],
  'webhook-http-client': [
    'raw body|getContent',
    'hash_equals|constant-time',
    'timestamp|freshness|tolerance',
    'unique constraint|unique index',
    'retry',
    'idempotent|deduplic',
  ],
  'mail-localization': ['locale|localiz', 'mail', 'notification'],
  'blade-vite': ['Blade|component', '@csrf', '@vite'],
  'livewire-explicit': ['explicit|requested|detected', 'Livewire'],
  'livewire-not-requested': ['Blade|Vite', 'explicit request|detected package'],
  tests: ['feature|HTTP test', 'database', 'console|browser'],
  deployment: ['config:cache', 'queue worker|queue:restart', 'health|rollback'],
  'official-package': ['composer.lock', 'Sanctum', 'Horizon'],
  'boost-ai-mcp': [
    'Boost',
    'AI SDK|laravel/ai',
    'MCP|laravel/mcp',
    'authentication|guard',
    'Gate::authorize|policy|authoriz',
    'throttle|rate limit',
    'prompt injection|untrusted',
    'external action|approval|idempot',
  ],
  'version-resolution': ['version mismatch|Laravel 12', 'composer.lock', 'version-matched'],
  'upgrade-12-to-13': ['laravel/framework', '\\^13\\.0', 'PreventRequestForgery', 'serializable_classes|upsert|QueueBusy', 'rollback|test'],
  'core-utilities': ['LazyCollection', 'Process::|Process facade', 'timeout|throw|failed'],
  'search-vector': ['whereFullText', 'whereVectorSimilarTo', 'pgvector|PostgreSQL', 'authorization|tenant'],
  'scout-database-engine': ['Scout', 'Searchable', 'toSearchableArray', 'database engine'],
  'svelte-explicit': ['Svelte', 'explicit|requested|detected', 'Vite|starter kit'],
};

const forbiddenByCase = {
  'livewire-not-requested': ['(?:run|use)\\s+composer\\s+require\\s+livewire/livewire'],
  'version-resolution': ['apply Laravel 13-only API without warning'],
  'session-csrf': ['(?:disable|remove|bypass|turn off)\\s+(?:the\\s+)?csrf'],
  authorization: ['(?:skip|omit|remove|bypass)\\s+(?:the\\s+)?authoriz'],
  'upload-storage': ['getClientOriginalName\\(\\).*storeAs', "storeAs\\([^\\n]+['\"]public['\"]"],
  'webhook-http-client': ['(?:skip|omit|disable|bypass)\\s+(?:the\\s+)?signature', 'hash_hmac\\([^\\n]+,\\s*[\'\"]{2}\\s*\\)'],
  'boost-ai-mcp': [
    '(?:skip|omit|disable|bypass)\\s+(?:the\\s+)?(?:authentication|authorization|rate limit)',
    '(?:trust|execute|render)\\s+(?:the\\s+)?(?:model|tool)\\s+output\\s+(?:directly|without validation)',
  ],
};

const highRiskCases = new Set([
  'api-crud',
  'session-csrf',
  'authorization',
  'transaction-idempotency',
  'upload-storage',
  'webhook-http-client',
  'version-resolution',
  'upgrade-12-to-13',
  'core-utilities',
  'boost-ai-mcp',
]);

const cases = scenarios.map((scenario) => ({
  id: scenario.id,
  prompt: scenario.prompt,
  expectedReferences: [...new Set(scenario.expectedRoutes.flatMap((route) => referencesByRoute[route] ?? []))],
  assertions: assertionsByCase[scenario.id] ?? ['Laravel'],
  forbiddenPatterns: forbiddenByCase[scenario.id] ?? [],
  risk: highRiskCases.has(scenario.id) ? 'high' : 'normal',
  setup: {
    explicitPackages: scenario.explicitPackages ?? [],
    detectedPackages: scenario.detectedPackages ?? [],
  },
}));

const manifest = {
  schemaVersion: 2,
  laravelVersion: '13.x',
  primaryTargets: ['codex', 'claude'],
  minimumIndependentRuns: 3,
  passingScorePerRun: 0.9,
  requiredHighRiskPassRate: 1,
  requiredSemanticReviewPassRate: 1,
  protocol: 'Run every case in a fresh context with the installed skill. Do not reveal expected references, assertions, forbidden patterns, or prior conclusions to the answering model.',
  semanticReview: {
    requiredForEveryCase: true,
    protocol: 'An independent reviewer must inspect meaning, code validity, version fit, security invariants, and whether the answer follows the requested scope. A keyword match is not semantic proof.',
    requiredFields: ['caseId', 'verdict', 'reviewer', 'notes'],
    allowedVerdicts: ['pass', 'fail'],
  },
  globalForbiddenPatterns: [
    '(?:disable|remove|bypass|turn off)\\s+(?:the\\s+)?csrf',
    '(?:skip|omit|remove|bypass)\\s+(?:the\\s+)?authoriz',
    '(?:skip|omit|disable|bypass)\\s+(?:the\\s+)?(?:webhook\\s+)?signature',
  ],
  cases,
};

const directory = resolve(repoRoot, 'evals', 'laravel-13');
const outputs = new Map([
  [resolve(directory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`],
  [
    resolve(directory, 'prompts.json'),
    `${JSON.stringify(cases.map(({ id, prompt, setup }) => ({ id, prompt, setup })), null, 2)}\n`,
  ],
]);

mkdirSync(directory, { recursive: true });
if (process.argv.includes('--check')) {
  for (const [path, expected] of outputs) {
    const actual = readFileSync(path, 'utf8');
    if (actual !== expected) throw new Error(`${path} is stale; run npm run build:evals`);
  }
  console.log(`Verified ${cases.length} behavioral eval cases`);
} else {
  for (const [path, contents] of outputs) writeFileSync(path, contents);
  console.log(`Generated ${cases.length} behavioral eval cases`);
}
