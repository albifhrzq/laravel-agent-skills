# Repository Guidance

This repository contains reusable agent skills for Laravel projects.

## Scope

Keep this repository focused on Laravel and Laravel-adjacent engineering workflows:

- Laravel API design.
- Laravel backend architecture.
- Laravel HTTP session, cookies, CSRF, authentication, and authorization.
- Laravel core UI with Blade, views, components, forms, URLs, and Vite.
- Laravel testing.
- Laravel queues and jobs.
- Laravel database and migrations.
- Laravel deployment and DevOps.
- Version-aware routing for official Laravel and detected UI packages.
- Security practices relevant to Laravel applications.

Avoid adding unrelated framework skills unless they directly support Laravel projects.

## Documentation Grounding

For Laravel-specific guidance, check documentation before editing rules:

1. Resolve the installed framework and package versions and inspect project code, configuration, tests, and instructions.
2. Use the pinned official Laravel sources in the skill's `source-lock.json`.
3. Use Laravel Boost search when it is installed and available.
4. Use Context7 Laravel docs and live official docs as version-aware freshness checks.
5. Mark project conventions, derived recommendations, and package behavior separately from official framework behavior.

## Skill Structure

The canonical Laravel 13 master skill should live under:

```text
skills/<skill-name>/
├── SKILL.md
├── README.md
├── AGENTS.md
├── metadata.json
├── source-lock.json
├── coverage-map.json
├── provenance.json
├── routing-map.json
├── rules/
└── references/
```

The master skill also owns source locks, routing, coverage, provenance, and
compiled references. Lightweight workflow skills such as reviewer and tracer
contain `SKILL.md` plus `agents/openai.yaml`; they do not duplicate the master
knowledge artifacts, and they must resolve and depend on the installed master
skill.

## Writing Standards

- Be practical and implementation-oriented.
- Prefer Laravel-native examples over generic examples.
- Include incorrect and correct patterns when useful.
- Mention trade-offs when rules depend on project context.
- Avoid over-prescribing when Laravel has multiple valid approaches.
- Make security, testing, and backward compatibility explicit.
- Do not guess Laravel behavior that can be checked in the current docs.

## Compatibility

Target the latest Laravel major version used by the skill metadata. For Laravel 13 skills, assume PHP 8.3+ unless the skill says otherwise.

## Definition of Done

A new skill is ready when it includes:

- Clear `SKILL.md` metadata and trigger description.
- A README with install instructions.
- A compiled `AGENTS.md` or equivalent full guide.
- Rule files for important areas.
- Practical Laravel code examples.
- Documentation/source grounding notes.
- Complete topic routing and official-documentation coverage.
- Structural, source, snippet, install, drift, and behavioral validation.
