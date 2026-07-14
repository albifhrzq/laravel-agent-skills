import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const masterRoot = resolve(repoRoot, 'skills', 'laravel-13');
const sourceLock = JSON.parse(readFileSync(resolve(masterRoot, 'source-lock.json'), 'utf8'));
const verifiedAt = sourceLock.verifiedAt;
const frameworkSourceId = `laravel-framework-${sourceLock.sources.framework.version.replace(/^v/, '')}`;

function markdownFiles(root) {
  return readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(root, entry.name);
      return entry.isDirectory() ? markdownFiles(path) : [path];
    })
    .filter((path) => path.endsWith('.md'))
    .sort();
}

const docs = ['laravel-docs-13'];
const docsAndFramework = ['laravel-docs-13', frameworkSourceId];
const docsFrameworkSkeleton = ['laravel-docs-13', frameworkSourceId, 'laravel-skeleton-13'];
const fileMetadata = {
  'rules/project-precedence.md': { classification: 'project-convention', sources: docs },
  'rules/security-baseline.md': { classification: 'derived', sources: docsAndFramework },
  'rules/source-and-version.md': { classification: 'derived', sources: docsFrameworkSkeleton },
  'rules/ui-package-boundary.md': { classification: 'project-convention', sources: [...docs, 'installed-package-docs'] },
  'rules/verification-and-grounding.md': { classification: 'derived', sources: docsFrameworkSkeleton },
  'references/api-resources-errors-pagination.md': { classification: 'mixed', sources: docsAndFramework },
  'references/architecture-configuration.md': { classification: 'mixed', sources: docsFrameworkSkeleton },
  'references/authentication-authorization.md': { classification: 'mixed', sources: docsFrameworkSkeleton },
  'references/blade-views-components.md': { classification: 'mixed', sources: docsAndFramework },
  'references/boost-ai-mcp.md': { classification: 'package-specific', sources: [...docs, 'installed-package-docs'] },
  'references/cache-redis-locks.md': { classification: 'mixed', sources: docsAndFramework },
  'references/collections-strings-processes.md': { classification: 'mixed', sources: docsAndFramework },
  'references/deployment-operations.md': { classification: 'mixed', sources: docsFrameworkSkeleton },
  'references/eloquent-models-relationships.md': { classification: 'mixed', sources: docsAndFramework },
  'references/errors-logging-observability.md': { classification: 'mixed', sources: docsAndFramework },
  'references/events-broadcasting-scheduling.md': { classification: 'mixed', sources: docsAndFramework },
  'references/filesystem-http-webhooks.md': {
    classification: 'mixed',
    sources: [...docsAndFramework, 'owasp-file-upload', 'owasp-ssrf'],
  },
  'references/frontend-vite-starter-kits.md': {
    classification: 'mixed',
    sources: [...docsFrameworkSkeleton, 'installed-package-docs'],
  },
  'references/mail-notifications-localization.md': { classification: 'mixed', sources: docsAndFramework },
  'references/migrations-schema-seeding.md': { classification: 'mixed', sources: docsAndFramework },
  'references/official-packages.md': { classification: 'package-specific', sources: [...docs, 'installed-package-docs'] },
  'references/queries-performance.md': { classification: 'mixed', sources: docsAndFramework },
  'references/queues-jobs.md': { classification: 'mixed', sources: docsAndFramework },
  'references/requests-validation-responses.md': { classification: 'mixed', sources: docsAndFramework },
  'references/routing-middleware-controllers.md': { classification: 'mixed', sources: docsAndFramework },
  'references/search-vector-reranking.md': {
    classification: 'mixed',
    sources: [...docsAndFramework, 'installed-package-docs'],
  },
  'references/security-rate-limiting-encryption.md': { classification: 'mixed', sources: docsAndFramework },
  'references/sessions-cookies-csrf.md': { classification: 'mixed', sources: docsFrameworkSkeleton },
  'references/testing-quality.md': { classification: 'mixed', sources: docsAndFramework },
  'references/transactions-concurrency-idempotency.md': { classification: 'mixed', sources: docsAndFramework },
  'references/version-grounding.md': { classification: 'mixed', sources: docsFrameworkSkeleton },
};

const governed = [
  ...markdownFiles(resolve(masterRoot, 'rules')),
  ...markdownFiles(resolve(masterRoot, 'references')),
];

const files = Object.fromEntries(governed.map((path) => {
  const name = relative(masterRoot, path).replaceAll('\\', '/');
  const contents = readFileSync(path, 'utf8');
  const metadata = fileMetadata[name];
  if (!metadata) throw new Error(`Missing explicit provenance metadata for ${name}`);
  const { classification, sources } = metadata;
  return [name, {
    classification,
    ...(classification === 'mixed'
      ? { components: ['official', 'derived', 'project-convention'] }
      : {}),
    sources,
    contentSha256: createHash('sha256').update(contents).digest('hex'),
    verifiedAt,
  }];
}));

const staleMetadata = Object.keys(fileMetadata).filter((name) => !Object.hasOwn(files, name));
if (staleMetadata.length > 0) {
  throw new Error(`Provenance metadata names missing files: ${staleMetadata.join(', ')}`);
}

const provenance = {
  schemaVersion: 1,
  verifiedAt,
  sources: {
    'laravel-docs-13': {
      type: 'official',
      url: `${sourceLock.sources.docs.repository}/tree/${sourceLock.sources.docs.commit}`,
    },
    [frameworkSourceId]: {
      type: 'official',
      url: `${sourceLock.sources.framework.repository}/tree/${sourceLock.sources.framework.commit}`,
    },
    'laravel-skeleton-13': {
      type: 'official',
      url: `${sourceLock.sources.skeleton.repository}/tree/${sourceLock.sources.skeleton.commit}`,
    },
    'installed-package-docs': {
      type: 'package-specific',
      rule: 'Resolve the installed package and version before opening its primary documentation.',
    },
    'owasp-file-upload': {
      type: 'derived-security',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html',
    },
    'owasp-ssrf': {
      type: 'derived-security',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html',
    },
  },
  claims: {
    'VERSION-DETECT': { classification: 'derived', sources: ['laravel-skeleton-13', frameworkSourceId] },
    'PROJECT-PRECEDENCE': { classification: 'project-convention', sources: ['laravel-docs-13'] },
    'SECURITY-OVERRIDE': { classification: 'derived', sources: ['laravel-docs-13'] },
    'EXPLICIT-UI': { classification: 'project-convention', sources: ['laravel-docs-13', 'installed-package-docs'] },
    'L13-CSRF': { classification: 'official', sources: ['laravel-docs-13', frameworkSourceId] },
    'AUTHZ-DEFAULT': { classification: 'official', sources: ['laravel-skeleton-13', 'laravel-docs-13'] },
    'GROUNDING-VISIBLE': { classification: 'project-convention', sources: ['laravel-docs-13'] },
    'SOURCE-VERIFY': { classification: 'derived', sources: ['laravel-docs-13', frameworkSourceId] }
  },
  files,
};

const outputPath = resolve(masterRoot, 'provenance.json');
const contents = `${JSON.stringify(provenance, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (readFileSync(outputPath, 'utf8') !== contents) {
    throw new Error('provenance.json is stale; run npm run build:provenance');
  }
  console.log(`Verified provenance for ${governed.length} files`);
} else {
  writeFileSync(outputPath, contents);
  console.log(`Generated provenance for ${governed.length} files`);
}
