# Repository Guidance

This repository contains reusable agent skills for Laravel projects.

## Scope

Keep this repository focused on Laravel and Laravel-adjacent engineering workflows:

- Laravel API design.
- Laravel backend architecture.
- Laravel testing.
- Laravel queues and jobs.
- Laravel database and migrations.
- Laravel deployment and DevOps.
- Security practices relevant to Laravel applications.

Avoid adding unrelated framework skills unless they directly support Laravel projects.

## Skill Structure

Each skill should live under:

```text
skills/<skill-name>/
├── SKILL.md
├── README.md
├── AGENTS.md
├── metadata.json
└── rules/
```

A small skill may omit `rules/`, but mature skills should split detailed guidance into rule files.

## Writing Standards

- Be practical and implementation-oriented.
- Prefer Laravel-native examples over generic examples.
- Include incorrect and correct patterns when useful.
- Mention trade-offs when rules depend on project context.
- Avoid over-prescribing when Laravel has multiple valid approaches.
- Make security, testing, and backward compatibility explicit.

## Compatibility

Target the latest Laravel major version used by the skill metadata. For Laravel 13 skills, assume PHP 8.3+ unless the skill says otherwise.

## Definition of Done

A new skill is ready when it includes:

- Clear `SKILL.md` metadata and trigger description.
- A README with install instructions.
- A compiled `AGENTS.md` or equivalent full guide.
- Rule files for important areas.
- Practical Laravel code examples.
