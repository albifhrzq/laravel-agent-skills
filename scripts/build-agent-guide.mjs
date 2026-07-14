import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const masterRoot = resolve(repoRoot, 'skills', 'laravel-13');

function markdownFiles(root) {
  return readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(root, entry.name);
      return entry.isDirectory() ? markdownFiles(path) : [path];
    })
    .filter((path) => path.endsWith('.md') && statSync(path).isFile())
    .sort();
}

const inputs = [
  resolve(masterRoot, 'SKILL.md'),
  ...markdownFiles(resolve(masterRoot, 'rules')),
  ...markdownFiles(resolve(masterRoot, 'references')),
];

const sections = inputs.map((path) => {
  const name = relative(masterRoot, path).replaceAll('\\', '/');
  const body = readFileSync(path, 'utf8').trim();
  return `<!-- BEGIN: ${name} -->\n${body}\n<!-- END: ${name} -->`;
});

const output = [
  '# Laravel 13 Compiled Agent Guide',
  '',
  '<!-- GENERATED FILE: run npm run build:agents; do not edit directly. -->',
  '',
  ...sections.flatMap((section, index) => index === 0 ? [section] : ['', section]),
  '',
].join('\n');

writeFileSync(resolve(masterRoot, 'AGENTS.md'), output);
console.log(`Compiled ${inputs.length} canonical inputs into skills/laravel-13/AGENTS.md`);
