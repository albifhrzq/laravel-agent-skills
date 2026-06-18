# Laravel API Design

Laravel 13 API design skill for Codex, Claude Code, Cursor, Windsurf, and other agent tools that consume `SKILL.md` style instructions.

This skill is intended to complement generic REST guidance with Laravel-native implementation patterns.

## Install

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-api-design
```

Or copy this folder into your repository:

```text
.agents/skills/laravel-api-design/
```

## What It Covers

- RESTful route design with Laravel routing conventions.
- `Route::apiResource`, shallow nesting, route model binding, and scoped bindings.
- FormRequest validation and request-level authorization checks.
- JsonResource and ResourceCollection response contracts.
- Consistent success and error response envelopes.
- Policy/gate based authorization.
- Token/JWT lifecycle design.
- Rate limiting per user, guard, IP, role, or API scope.
- Cursor/offset pagination, filtering, sorting, and safe query allowlists.
- Idempotent state transitions for payments, orders, webhooks, and external integrations.
- OpenAPI documentation and feature tests.

## Recommended Pairing

Use this together with Laravel-specific project guidance in your root `AGENTS.md`.

## Project-Specific Guidance

For a real product, add a root `AGENTS.md` that defines your API contract, auth model, roles, route prefixes, response envelope, and testing command. This skill gives Laravel defaults, but the project contract should win when it is explicit.
