---
name: laravel-13
description: Use when any task involves Laravel, composer, artisan, route, controller, session, CSRF, Blade, Vite, Eloquent, migration, queue, test, deployment, traceback, configuration, security, API, database, UI, package, or production behavior; provides a Laravel 13 source-grounded router for implementation, debugging, tracing, review, and operations.
---

# Laravel 13

Use this skill as the default engineering knowledge base for every Laravel task. It is a router, not a replacement for inspecting the target repository.

## Core contract

1. Resolve the installed Laravel version before choosing framework APIs.
2. Read project instructions, code, configuration, and tests before applying defaults.
3. Load only the references selected by the routing table.
4. Verify exact syntax against version-matched official sources when uncertainty remains.
5. Finish every Laravel answer with a compact grounding line.

Do not infer that a project uses Laravel 13 merely because this skill was selected.

## Version resolution

Resolve in this order:

1. `composer.lock`: inspect the installed `laravel/framework` version.
2. `composer.json`: inspect its constraint only when the lock is absent or incomplete.
3. `php artisan --version` or installed framework source when commands are safe to run.
4. The user's explicit version for greenfield work.

If the detected version is not Laravel 13, report a version mismatch and stop applying Laravel 13-only APIs. Use documentation for the detected version or ask for direction when the intended upgrade is unclear. Read [references/version-grounding.md](references/version-grounding.md) for the full decision process.

## Precedence

Project convention wins when it is explicit, internally consistent, tested, secure, and compatible with the installed version. Project code, configuration, tests, and `AGENTS.md` come first; this skill supplies defaults where the project is silent.

An explicit user request may change a valid project convention or introduce an optional UI/package stack. It does not make a correctness, security, or version incompatibility defect safe. Report those conflicts before proceeding.

Read [rules/project-precedence.md](rules/project-precedence.md) and [rules/source-and-version.md](rules/source-and-version.md).

## Source lookup order

Use this order for exact Laravel behavior:

1. Installed framework source, application code, configuration, and tests.
2. The pinned official docs, framework, and skeleton in [source-lock.json](source-lock.json).
3. Relevant reference files in this skill.
4. Laravel Boost `search-docs` when Boost is installed and available.
5. Context7 library `/laravel/docs/__branch__13.x`.
6. Live [official Laravel documentation](https://laravel.com/docs/13.x) as a freshness check.

Package behavior must be checked against the installed package version and its primary documentation. Never silently generalize a package API into Laravel core.

## Routing workflow

1. Read [routing-map.json](routing-map.json) or use the table below.
2. Read every selected reference completely before changing code.
3. Add adjacent references when the execution path crosses domains.
4. Use [coverage-map.json](coverage-map.json) to locate less common official topics.

| Concern | Required references |
|---|---|
| Version, upgrade, structure, container, configuration | [version-grounding](references/version-grounding.md), [architecture and configuration](references/architecture-configuration.md) |
| Collection, LazyCollection, helpers, strings, contracts, Process facade | [collections, strings, processes](references/collections-strings-processes.md) |
| Route, middleware, controller, request lifecycle | [routing, middleware, controllers](references/routing-middleware-controllers.md) |
| FormRequest, validation, request, response | [requests, validation, responses](references/requests-validation-responses.md) |
| REST API, resource, JSON:API, error contract, pagination | [API resources and contracts](references/api-resources-errors-pagination.md) |
| Authentication, policy, gate, password, verification | [authentication and authorization](references/authentication-authorization.md) |
| Session, cookie, CSRF, browser form | [sessions, cookies, CSRF](references/sessions-cookies-csrf.md) |
| Encryption, hashing, rate limit, sensitive data | [security and rate limiting](references/security-rate-limiting-encryption.md) |
| Migration, schema, constraint, seed, factory | [migrations, schema, seeding](references/migrations-schema-seeding.md) |
| Model, relationship, cast, serialization | [Eloquent models and relationships](references/eloquent-models-relationships.md) |
| Query, index, N+1, pagination, database performance | [queries and performance](references/queries-performance.md) |
| Full-text search, vector similarity, embeddings, reranking | [search, vectors, reranking](references/search-vector-reranking.md) |
| Transaction, lock, concurrency, idempotency | [transactions and concurrency](references/transactions-concurrency-idempotency.md) |
| Cache, Redis, atomic lock | [cache, Redis, locks](references/cache-redis-locks.md) |
| Queue, job, retry, batch, chain | [queues and jobs](references/queues-jobs.md) |
| Event, listener, broadcast, console, schedule | [events, broadcasting, scheduling](references/events-broadcasting-scheduling.md) |
| File, upload, HTTP client, webhook | [filesystem, HTTP, webhooks](references/filesystem-http-webhooks.md) |
| Mail, notification, localization | [mail, notifications, localization](references/mail-notifications-localization.md) |
| Blade, view, component, slot, form, URL | [Blade, views, components](references/blade-views-components.md) |
| Frontend assets, Vite, starter kit | [frontend, Vite, starter kits](references/frontend-vite-starter-kits.md) |
| Unit, feature, HTTP, database, console, browser test | [testing and quality](references/testing-quality.md) |
| Exception, logging, context, observability | [errors, logging, observability](references/errors-logging-observability.md) |
| Deploy, config cache, worker, performance | [deployment and operations](references/deployment-operations.md) |
| Sanctum, Passport, Horizon, Octane, first-party package | [official packages](references/official-packages.md) |
| Boost, AI SDK, MCP, agentic development | [Boost, AI, MCP](references/boost-ai-mcp.md) |

## UI boundary

Blade, views, components, forms, URLs, Vite, and the starter-kit boundary are core coverage. Livewire, Inertia, Flux, React, Vue, Svelte, and Tailwind package-specific guidance is loaded only when the dependency is detected or the user explicitly requests it. When neither is true, remain with core Blade/Vite patterns and do not select a package on the user's behalf.

Read [rules/ui-package-boundary.md](rules/ui-package-boundary.md).

## Security and verification

Treat authentication, authorization, session, CSRF, uploads, mass assignment, SQL construction, serialization, secrets, webhooks, and rate limits as security boundaries. Read [rules/security-baseline.md](rules/security-baseline.md).

Before completion:

- run the smallest relevant test first, then the broader project suite;
- inspect migrations and side effects for rollback, retry, and deployment risk;
- verify framework/package syntax from primary sources when not proven locally;
- distinguish verified behavior, inference, and project convention;
- never claim a command passed without fresh output.

Read [rules/verification-and-grounding.md](rules/verification-and-grounding.md).

## Required answer footer

End every Laravel response with one line in this form:

```text
Laravel grounding: detected 13.19.0 from composer.lock; read references/sessions-cookies-csrf.md; verified against official Laravel 13.x docs.
```

Replace each field with the evidence actually used. If the version cannot be established, say `detected version unknown` and identify the missing evidence.
