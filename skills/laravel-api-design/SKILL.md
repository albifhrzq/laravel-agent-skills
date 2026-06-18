---
name: laravel-api-design
description: Laravel 13 API design patterns for REST endpoints, FormRequest validation, API Resources, policies, token auth, rate limiting, pagination, error envelopes, OpenAPI docs, and production-ready API contracts. Use when designing, reviewing, or implementing Laravel API routes/controllers/resources/tests.
license: MIT
metadata:
  author: albifhrzq
  version: "1.0.0"
  framework: Laravel
  laravelVersion: "13.x"
  phpVersion: "8.3+"
---

# Laravel API Design

Production-oriented API design guidance for Laravel 13 applications. This skill translates generic REST API patterns into Laravel-native implementation rules: `routes/api.php`, `Route::apiResource`, FormRequest validation, JsonResource/ResourceCollection responses, policies, guards, rate limiters, pagination, filters, idempotency, OpenAPI documentation, and feature tests.

## When to Apply

Use this skill when the task involves:

- Designing new Laravel API endpoints.
- Reviewing route/controller/FormRequest/API Resource changes.
- Building marketplace, forum, seller, shop, order, payment, or admin APIs.
- Changing API response contracts, validation, pagination, filtering, sorting, auth, authorization, or rate limits.
- Adding OpenAPI documentation or API feature tests.

## Priority Rules

| Priority | Category | Impact | Rule files |
|---|---|---:|---|
| 1 | Route design | CRITICAL | `route-design.md` |
| 2 | Validation | CRITICAL | `request-validation.md` |
| 3 | Response contract | CRITICAL | `api-resource-response.md`, `error-envelope.md` |
| 4 | Auth & authorization | CRITICAL | `auth-authorization.md` |
| 5 | Querying collections | HIGH | `pagination-filtering-sorting.md` |
| 6 | Side effects | HIGH | `idempotency-and-side-effects.md` |
| 7 | Abuse prevention | HIGH | `rate-limiting.md` |
| 8 | Documentation & tests | HIGH | `openapi-and-tests.md` |

## Laravel API Defaults

Prefer these defaults unless the project already defines a different API contract:

- Version APIs with `/api/v1` from the beginning for public or long-lived consumers.
- Use plural nouns for resources: `/users`, `/shops`, `/products`, `/orders`.
- Keep controllers thin; delegate business logic to actions/services.
- Use FormRequest classes for validation and authorization-adjacent request checks.
- Use JsonResource and ResourceCollection for response transformation.
- Use policies/gates for resource authorization; avoid scattered manual permission checks.
- Use Laravel pagination metadata consistently.
- Use explicit state-transition endpoints for actions with side effects.
- Require idempotency for payment, order, checkout, wallet, and external webhook flows.
- Add feature tests for every important endpoint contract.

## Files to Read

Start with `AGENTS.md` for the full compiled guide, then read the rule files in `rules/` when working on a specific area.
