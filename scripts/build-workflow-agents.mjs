import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const workflows = ['laravel-code-reviewer', 'laravel-code-tracer'];

for (const name of workflows) {
  const sourcePath = resolve(repoRoot, 'skills', name, 'SKILL.md');
  const source = readFileSync(sourcePath, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${sourcePath} has invalid frontmatter`);

  const description = match[1]
    .split('\n')
    .find((line) => line.startsWith('description: '))
    ?.slice('description: '.length);
  if (!description) throw new Error(`${sourcePath} has no description`);

  const output = [
    '---',
    `name: ${name}`,
    `description: ${description}`,
    'model: inherit',
    'readonly: true',
    'is_background: false',
    '---',
    '',
    '<!-- GENERATED FROM skills/' + name + '/SKILL.md; do not edit directly. -->',
    '',
    match[2].trim(),
    '',
  ].join('\n');

  const outputDirectory = resolve(repoRoot, 'agents', name);
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(resolve(outputDirectory, 'SKILL.md'), output);
  console.log(`Generated agents/${name}/SKILL.md`);
}
