# Laravel Agent Skills

A source-grounded Laravel 13 skill pack for Codex, Claude Code, Cursor, Windsurf, and other agents that support `SKILL.md` skills.

## Canonical skill

`laravel-13` is the single v2 knowledge base for Laravel backend and frontend work: architecture, HTTP/API, authentication, authorization, session, CSRF, database, Eloquent, queues, cache, integrations, testing, deployment, Blade, Vite, core UI, and installed first-party packages.

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-13
```

It detects the installed framework version and reads project conventions before applying Laravel 13 defaults. Twenty-six detailed references are selected through a deterministic routing map and grounded in pinned official sources. Core Blade/Vite UI is included; optional stacks such as Livewire, Inertia, React, Vue, Svelte, and Tailwind are loaded only when detected or explicitly requested.

## Optional workflow skills

The tracer and reviewer require `laravel-13` to be installed alongside them:

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-13
npx skills add albifhrzq/laravel-agent-skills --skill laravel-code-tracer
npx skills add albifhrzq/laravel-agent-skills --skill laravel-code-reviewer
```

| Skill | Purpose |
|---|---|
| `laravel-13` | Canonical Laravel 13 knowledge, source resolution, and topic routing. |
| `laravel-code-tracer` | Read-only end-to-end Laravel execution tracing. |
| `laravel-code-reviewer` | Read-only evidence-based Laravel review. |

## Source and verification model

- Project version, code, configuration, tests, and valid conventions have precedence.
- `skills/laravel-13/source-lock.json` pins official docs, framework, and application skeleton revisions.
- `coverage-map.json` maps all official Laravel 13 documentation pages.
- `provenance.json` classifies rules and references.
- `routing-map.json` controls progressive disclosure and optional-package boundaries.
- Context7 and Laravel Boost provide version-aware lookup; live docs are used as freshness checks.

Run the local validation suite:

```bash
npm test
npm run test:coverage
npm run test:fixture:security
npm run test:fixture:sqlite
npm run check:generated
npm run check:source-drift
```

The source verifier checks pinned branch/tag integrity, the latest stable
Laravel 13 release, and the exact 103-page documentation inventory. Scheduled
CI also exercises the database fixture on MySQL and PostgreSQL.

Behavioral model responses use a separate semantic review and at least three
fresh runs per target. See `evals/laravel-13/README.md`; the strict release
command requires both configured primary targets.

Regenerate compiled artifacts after editing canonical rules or references:

```bash
npm run build
```

## Repository boundaries

The repository remains Laravel-focused. Optional UI and first-party package guidance is loaded only when detected in the target project or explicitly requested by the user.

## License

MIT
