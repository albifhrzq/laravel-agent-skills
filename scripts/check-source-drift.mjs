import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = resolve(import.meta.dirname, '..');
const lock = JSON.parse(readFileSync(resolve(repoRoot, 'skills', 'laravel-13', 'source-lock.json'), 'utf8'));
const localPages = JSON.parse(readFileSync(resolve(repoRoot, 'tests', 'fixtures', 'laravel-13-doc-pages.json'), 'utf8'));

let drift = false;
let unavailable = false;
const GIT_TIMEOUT_MS = 60_000;

function gitError(result, fallback) {
  return result.error?.message || result.stderr?.trim() || fallback;
}

function lsRemote(repository, reference) {
  const result = spawnSync('git', ['ls-remote', repository, reference], {
    encoding: 'utf8',
    timeout: GIT_TIMEOUT_MS,
    killSignal: 'SIGKILL',
  });

  if (result.status !== 0) {
    unavailable = true;
    console.error(`Unable to inspect ${repository} ${reference}: ${gitError(result, 'git ls-remote failed')}`);
    return [];
  }

  return result.stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [commit, ref] = line.trim().split(/\s+/);
      return { commit, ref };
    });
}

const integrityTargets = [
  ['docs', `${lock.sources.docs.repository}.git`, `refs/heads/${lock.sources.docs.branch}`],
  ['framework', `${lock.sources.framework.repository}.git`, `refs/tags/${lock.sources.framework.version}`],
  ['skeleton', `${lock.sources.skeleton.repository}.git`, `refs/heads/${lock.sources.skeleton.branch}`],
];

for (const [name, repository, reference] of integrityTargets) {
  const [remote] = lsRemote(repository, reference);
  if (!remote) {
    unavailable = true;
    console.error(`${name}: ${reference} was not returned by the remote`);
    continue;
  }

  const expected = lock.sources[name].commit;
  if (remote.commit !== expected) {
    drift = true;
    console.error(`${name}: drift detected; locked=${expected} current=${remote.commit}`);
  } else {
    console.log(`${name}: ${remote.commit} (locked integrity verified)`);
  }
}

function compareVersions(left, right) {
  const leftParts = left.split('.').map(Number);
  const rightParts = right.split('.').map(Number);

  for (let index = 0; index < 3; index += 1) {
    const difference = leftParts[index] - rightParts[index];
    if (difference !== 0) return difference;
  }

  return 0;
}

const frameworkTags = lsRemote(
  `${lock.sources.framework.repository}.git`,
  'refs/tags/v13.*',
).flatMap(({ commit, ref }) => {
  const match = ref.match(/^refs\/tags\/v(13\.\d+\.\d+)$/);
  return match ? [{ version: match[1], tag: `v${match[1]}`, commit }] : [];
});

const latestFramework = frameworkTags.sort((left, right) => compareVersions(right.version, left.version))[0];
if (!latestFramework) {
  unavailable = true;
  console.error('framework: no stable v13 tags were returned');
} else if (
  latestFramework.tag !== lock.sources.framework.version
  || latestFramework.commit !== lock.sources.framework.commit
) {
  drift = true;
  console.error(
    `framework: newer or changed stable release; locked=${lock.sources.framework.version}@${lock.sources.framework.commit} latest=${latestFramework.tag}@${latestFramework.commit}`,
  );
} else {
  console.log(`framework: ${latestFramework.tag} is the latest stable v13 release`);
}

function normalizedInventory(slugs) {
  return `${[...new Set(slugs)].sort().join('\n')}\n`;
}

const docsCheckout = mkdtempSync(resolve(tmpdir(), 'laravel-docs-inventory-'));
try {
  const initialize = spawnSync('git', ['-C', docsCheckout, 'init', '--quiet'], {
    encoding: 'utf8',
    timeout: GIT_TIMEOUT_MS,
    killSignal: 'SIGKILL',
  });
  if (initialize.status !== 0) throw new Error(gitError(initialize, 'git init failed'));

  const fetchDocs = spawnSync('git', [
    '-C', docsCheckout, 'fetch', '--quiet', '--depth=1',
    `${lock.sources.docs.repository}.git`, lock.sources.docs.commit,
  ], { encoding: 'utf8', timeout: GIT_TIMEOUT_MS, killSignal: 'SIGKILL' });
  if (fetchDocs.status !== 0) throw new Error(gitError(fetchDocs, 'git fetch failed'));

  const listTree = spawnSync('git', [
    '-C', docsCheckout, 'ls-tree', '--name-only', lock.sources.docs.commit,
  ], { encoding: 'utf8', timeout: GIT_TIMEOUT_MS, killSignal: 'SIGKILL' });
  if (listTree.status !== 0) throw new Error(gitError(listTree, 'git ls-tree failed'));

  const remotePages = listTree.stdout
    .trim()
    .split('\n')
    .filter((path) => path.endsWith('.md'))
    .map((path) => path.slice(0, -3).toLowerCase())
    .sort();
  const localInventory = normalizedInventory(localPages);
  const remoteInventory = normalizedInventory(remotePages);
  const remoteHash = createHash('sha256').update(remoteInventory).digest('hex');

  if (remoteHash !== lock.sources.docs.inventorySha256 || remoteInventory !== localInventory) {
    drift = true;
    const missingLocally = remotePages.filter((slug) => !localPages.includes(slug));
    const missingRemotely = localPages.filter((slug) => !remotePages.includes(slug));
    console.error(
      `docs inventory: mismatch; locked=${lock.sources.docs.inventorySha256} remote=${remoteHash} missingLocally=${missingLocally.join(',') || '-'} missingRemotely=${missingRemotely.join(',') || '-'}`,
    );
  } else {
    console.log(`docs inventory: ${remotePages.length} root pages match locked SHA and SHA-256`);
  }
} catch (error) {
  unavailable = true;
  console.error(`docs inventory: unable to verify source tree: ${error.message}`);
} finally {
  rmSync(docsCheckout, { recursive: true, force: true });
}

if (unavailable) process.exitCode = 2;
else if (drift) process.exitCode = 1;
