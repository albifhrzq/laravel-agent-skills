---
name: laravel-api-design
description: Laravel 13 API design knowledge base for REST endpoints, API route setup, FormRequest validation, API Resources, JSON:API Resources, policies, Sanctum/JWT token auth, rate limiting, pagination, error envelopes, OpenAPI docs, and production-ready API contracts. Use when designing, reviewing, or implementing Laravel API routes/controllers/resources/tests.
license: MIT
metadata:
  author: albifhrzq
  version: "1.1.0"
  framework: Laravel
  laravelVersion: "13.x"
  phpVersion: "8.3+"
---

# Laravel API Design

Production-oriented Laravel 13 API design knowledge base. This skill has two layers:

- `rules/` for short guardrails and acceptance criteria.
- `references/` for longer implementation guides, examples, trade-offs, and edge cases.

## Source of Truth

Before changing Laravel-specific API behavior, check the project `AGENTS.md` and the official Laravel 13 documentation. If Context7 MCP is available in the coding-agent environment, fetch the relevant Laravel docs through Context7 first. For JWT-specific work, also check the selected JWT package documentation, such as `tymon/jwt-auth`, `lcobucci/jwt`, a maintained fork, or the external identity provider docs.

## When to Apply

Use this skill when the task involves:

- Designing new Laravel API endpoints.
- Enabling or reviewing Laravel API routing setup.
- Reviewing route/controller/FormRequest/API Resource changes.
- Building marketplace, forum, seller, shop, order, payment, or admin APIs.
- Changing API response contracts, validation, pagination, filtering, sorting, auth, authorization, or rate limits.
- Designing Sanctum or JWT authentication flows.
- Adding OpenAPI documentation or API feature tests.

## Quick Rule Index

| Priority | Category | Impact | Rule files |
|---|---|---:|---|
| 1 | Documentation grounding | CRITICAL | `rules/laravel-docs-grounding.md` |
| 2 | Laravel API setup | HIGH | `rules/api-route-installation.md` |
| 3 | Route design | CRITICAL | `rules/route-design.md` |
| 4 | Validation | CRITICAL | `rules/request-validation.md` |
| 5 | Response contract | CRITICAL | `rules/api-resource-response.md`, `rules/error-envelope.md` |
| 6 | Auth & authorization | CRITICAL | `rules/auth-authorization.md` |
| 7 | JWT lifecycle | CRITICAL | `rules/jwt-token-lifecycle.md` |
| 8 | Querying collections | HIGH | `rules/pagination-filtering-sorting.md` |
| 9 | Side effects | HIGH | `rules/idempotency-and-side-effects.md` |
| 10 | Abuse prevention | HIGH | `rules/rate-limiting.md` |
| 11 | Documentation & tests | HIGH | `rules/openapi-and-tests.md` |

## Reference Guide Index

Read these when the task needs implementation detail beyond a checklist:

| Topic | Reference file |
|---|---|
| API routing | `references/laravel-13-api-routing-guide.md` |
| FormRequest validation | `references/laravel-13-form-request-validation-guide.md` |
| API resources | `references/laravel-13-api-resource-guide.md` |
| Auth & authorization | `references/laravel-13-auth-authorization-guide.md` |
| JWT auth | `references/laravel-13-jwt-auth-guide.md` |

## Laravel API Defaults

Prefer these defaults unless the project already defines a different API contract:

- Use Laravel 13 API routing defaults correctly: `routes/api.php` already receives the `/api` prefix when API routing is enabled.
- Version public or long-lived APIs with `v1` inside `routes/api.php`, producing `/api/v1/...` under Laravel defaults.
- Use plural nouns for resources: `/users`, `/shops`, `/products`, `/orders`.
- Keep controllers thin; delegate business logic to actions/services.
- Use FormRequest classes for validation and authorization-adjacent request checks.
- Use JsonResource and ResourceCollection for response transformation.
- Consider Laravel 13 JSON:API Resources when the project intentionally follows the JSON:API specification.
- Use policies/gates for resource authorization; avoid scattered manual permission checks.
- Choose one primary API auth strategy per route group: Sanctum, JWT, Passport, session, or external provider.
- For JWT, define guard, lifetime, refresh, invalidation/logout, error mapping, and tests explicitly.
- Use Laravel pagination metadata consistently.
- Use explicit state-transition endpoints for actions with side effects.
- Require idempotency for order, checkout, wallet, import, and external webhook flows.
- Add feature tests for every important endpoint contract.

## Files to Read

Start with `AGENTS.md` for the compiled guide. Then read `rules/_sections.md` for rule order and `references/README.md` for detailed guide selection.
