import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const masterRoot = resolve(repoRoot, 'skills', 'laravel-13');
const pages = JSON.parse(readFileSync(resolve(repoRoot, 'tests', 'fixtures', 'laravel-13-doc-pages.json'), 'utf8'));
const sourceLock = JSON.parse(readFileSync(resolve(masterRoot, 'source-lock.json'), 'utf8'));
const normalizedInventory = `${[...pages].sort().join('\n')}\n`;
const sourceInventorySha256 = createHash('sha256').update(normalizedInventory).digest('hex');

if (sourceInventorySha256 !== sourceLock.sources.docs.inventorySha256) {
  throw new Error('Local documentation inventory does not match source-lock.json');
}

const routed = new Set([
  'ai-sdk', 'billing', 'boost', 'cashier-paddle', 'dusk', 'envoy', 'folio', 'fortify',
  'homestead', 'horizon', 'mcp', 'mix', 'mongodb', 'octane', 'passport', 'pennant',
  'pint', 'precognition', 'prompts', 'pulse', 'reverb', 'sail', 'sanctum', 'scout',
  'socialite', 'starter-kits', 'telescope', 'valet',
]);
const excluded = new Set(['contributions', 'documentation', 'license', 'readme']);

const referenceByPage = {
  'version-grounding.md': ['installation', 'lifecycle', 'releases', 'upgrade'],
  'architecture-configuration.md': ['configuration', 'container', 'facades', 'providers', 'structure'],
  'collections-strings-processes.md': ['collections', 'contracts', 'helpers', 'processes', 'strings'],
  'routing-middleware-controllers.md': ['controllers', 'lifecycle', 'middleware', 'routing'],
  'requests-validation-responses.md': ['requests', 'responses', 'validation'],
  'api-resources-errors-pagination.md': ['eloquent-resources', 'pagination'],
  'authentication-authorization.md': ['authentication', 'authorization', 'passwords', 'verification'],
  'sessions-cookies-csrf.md': ['csrf', 'session'],
  'security-rate-limiting-encryption.md': ['encryption', 'hashing', 'rate-limiting'],
  'migrations-schema-seeding.md': ['eloquent-factories', 'migrations', 'seeding'],
  'eloquent-models-relationships.md': ['eloquent', 'eloquent-collections', 'eloquent-mutators', 'eloquent-relationships', 'eloquent-serialization'],
  'queries-performance.md': ['database', 'pagination', 'queries'],
  'search-vector-reranking.md': ['search', 'scout'],
  'transactions-concurrency-idempotency.md': ['concurrency', 'database'],
  'cache-redis-locks.md': ['cache', 'redis'],
  'queues-jobs.md': ['queues'],
  'events-broadcasting-scheduling.md': ['artisan', 'broadcasting', 'events', 'scheduling'],
  'filesystem-http-webhooks.md': ['filesystem', 'http-client'],
  'mail-notifications-localization.md': ['localization', 'mail', 'notifications'],
  'blade-views-components.md': ['blade', 'urls', 'views'],
  'frontend-vite-starter-kits.md': ['frontend', 'starter-kits', 'vite'],
  'testing-quality.md': ['console-tests', 'database-testing', 'dusk', 'http-tests', 'mocking', 'testing'],
  'errors-logging-observability.md': ['context', 'errors', 'logging'],
  'deployment-operations.md': ['deployment', 'envoy', 'homestead', 'octane', 'sail', 'valet'],
  'official-packages.md': ['billing', 'cashier-paddle', 'folio', 'fortify', 'horizon', 'mix', 'mongodb', 'packages', 'passport', 'pennant', 'pint', 'precognition', 'prompts', 'pulse', 'reverb', 'sanctum', 'scout', 'socialite', 'telescope'],
  'boost-ai-mcp.md': ['ai', 'ai-sdk', 'boost', 'mcp'],
};

function referencesFor(slug) {
  return Object.entries(referenceByPage)
    .filter(([, slugs]) => slugs.includes(slug))
    .map(([file]) => `references/${file}`);
}

const output = {
  schemaVersion: 1,
  laravelVersion: '13.x',
  sourceCommit: sourceLock.sources.docs.commit,
  sourceInventorySha256,
  generatedAt: sourceLock.verifiedAt,
  pages: pages.map((slug) => {
    if (excluded.has(slug)) {
      return {
        slug,
        classification: 'out-of-scope',
        reason: 'Repository or documentation-maintenance material; it does not define application engineering behavior.',
      };
    }
    const references = referencesFor(slug);
    if (references.length === 0) throw new Error(`No reference route for Laravel documentation page: ${slug}`);
    return { slug, classification: routed.has(slug) ? 'routed' : 'deep', references };
  }),
};

const outputPath = resolve(masterRoot, 'coverage-map.json');
const contents = `${JSON.stringify(output, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (readFileSync(outputPath, 'utf8') !== contents) {
    throw new Error('coverage-map.json is stale; run npm run build:coverage');
  }
  console.log(`Verified ${output.pages.length} Laravel 13 documentation pages`);
} else {
  writeFileSync(outputPath, contents);
  console.log(`Mapped ${output.pages.length} Laravel 13 documentation pages`);
}
