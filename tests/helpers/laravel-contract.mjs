import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

export const REPO_ROOT = resolve(import.meta.dirname, '..', '..');
export const MASTER_ROOT = resolve(REPO_ROOT, 'skills', 'laravel-13');

export function assertExists(path, message = `Required path is missing: ${relative(REPO_ROOT, path)}`) {
  assert.ok(existsSync(path), message);
}

export function readText(path) {
  assertExists(path);
  return readFileSync(path, 'utf8');
}

export function readJson(path) {
  const source = readText(path);

  try {
    return JSON.parse(source);
  } catch (error) {
    assert.fail(`${relative(REPO_ROOT, path)} is not valid JSON: ${error.message}`);
  }
}

export function listFiles(root, predicate = () => true) {
  assertExists(root);

  return readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(root, entry.name);
      return entry.isDirectory() ? listFiles(path, predicate) : [path];
    })
    .filter(predicate)
    .sort();
}

export function listMarkdown(root) {
  return listFiles(root, (path) => path.endsWith('.md'));
}

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  assert.ok(match, 'SKILL.md must start with YAML frontmatter');

  const values = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf(':');
    assert.notEqual(separator, -1, `Unsupported frontmatter line: ${rawLine}`);
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^(["'])(.*)\1$/, '$2');
    values[key] = value;
  }

  return values;
}

export function relativeToMaster(path) {
  return relative(MASTER_ROOT, path).replaceAll('\\', '/');
}

export function canonicalGuideInputs() {
  const skill = resolve(MASTER_ROOT, 'SKILL.md');
  const rules = listMarkdown(resolve(MASTER_ROOT, 'rules'));
  const references = listMarkdown(resolve(MASTER_ROOT, 'references'));
  return [skill, ...rules, ...references];
}

export function renderCompiledGuide() {
  const sections = canonicalGuideInputs().map((path) => {
    const name = relativeToMaster(path);
    return `<!-- BEGIN: ${name} -->\n${readText(path).trim()}\n<!-- END: ${name} -->`;
  });

  return [
    '# Laravel 13 Compiled Agent Guide',
    '',
    '<!-- GENERATED FILE: run npm run build:agents; do not edit directly. -->',
    '',
    ...sections.flatMap((section, index) => index === 0 ? [section] : ['', section]),
    '',
  ].join('\n');
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function collectMarkdownLinks(markdown) {
  return [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map((match) => match[1].trim())
    .filter((target) => target && !target.startsWith('#') && !/^[a-z]+:/i.test(target));
}

export function collectPhpFences(markdown, path) {
  const lines = markdown.split('\n');
  const fences = [];

  for (let index = 0; index < lines.length; index += 1) {
    const opening = lines[index].match(/^```php(?:\s+([^\s]+))?\s*$/i);
    if (!opening) continue;

    const start = index + 1;
    const code = [];
    index += 1;
    while (index < lines.length && lines[index] !== '```') {
      code.push(lines[index]);
      index += 1;
    }

    assert.ok(index < lines.length, `${relative(REPO_ROOT, path)}:${start} has an unclosed PHP fence`);
    fences.push({ classification: opening[1] ?? null, code: code.join('\n'), line: start });
  }

  return fences;
}

export function matchRoutes(routingMap, scenario) {
  const prompt = scenario.prompt.toLowerCase();
  const explicitPackages = new Set(scenario.explicitPackages ?? []);
  const detectedPackages = new Set(scenario.detectedPackages ?? []);

  if (
    scenario.detectedVersion
    && scenario.detectedVersion !== routingMap.laravelVersion
    && scenario.requestedVersion === routingMap.laravelVersion
  ) {
    return [routingMap.versionGate?.mismatchRoute ?? 'foundation'];
  }

  const matchesTrigger = (trigger, candidatePrompt = prompt) => {
    const escaped = trigger
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\s+');
    const leadingBoundary = /^[a-z0-9]/i.test(trigger) ? '(^|[^a-z0-9])' : '';
    const trailingBoundary = /[a-z0-9]$/i.test(trigger) ? '(?=$|[^a-z0-9])' : '';
    return new RegExp(`${leadingBoundary}${escaped}${trailingBoundary}`, 'i').test(candidatePrompt);
  };

  const matchesRouteTrigger = (route, trigger) => {
    const ignoredPhrases = route.ignoredTriggerPhrases?.[trigger] ?? [];
    const candidatePrompt = ignoredPhrases.reduce((value, phrase) => {
      const escaped = phrase
        .toLowerCase()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\s+/g, '\\s+');
      return value.replace(new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, 'gi'), ' ');
    }, prompt);

    return matchesTrigger(trigger, candidatePrompt);
  };

  return routingMap.routes
    .filter((route) => route.triggers.some((trigger) => matchesRouteTrigger(route, trigger)))
    .filter((route) => {
      if (!route.requiresExplicitRequest) return true;
      return (route.packages ?? []).some((name) => explicitPackages.has(name) || detectedPackages.has(name));
    })
    .map((route) => route.id);
}

export function countLines(value) {
  return value === '' ? 0 : value.split('\n').length;
}

export function assertDirectory(path, message) {
  assertExists(path, message);
  assert.ok(statSync(path).isDirectory(), message ?? `${relative(REPO_ROOT, path)} must be a directory`);
}
