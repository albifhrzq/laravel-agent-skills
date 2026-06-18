# Laravel API Design

Laravel 13 API design skill for Codex, Claude Code, Cursor, Windsurf, and other agent tools that consume `SKILL.md` style instructions.

This skill complements generic REST guidance with Laravel-native implementation patterns and should be maintained against Laravel 13 documentation.

## Install

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-api-design
```

Or copy this folder into your repository:

```text
.agents/skills/laravel-api-design/
```

## What It Covers

- Context7 / official Laravel 13 documentation grounding.
- Laravel 13 API route setup with `php artisan install:api`.
- Correct `routes/api.php` prefix usage; avoid accidental `/api/api/v1` routes.
- RESTful route design with Laravel routing conventions.
- `Route::apiResource`, shallow nesting, route model binding, and scoped bindings.
- FormRequest validation and request-level authorization checks.
- JsonResource, ResourceCollection, and Laravel 13 JSON:API Resource guidance.
- Consistent success and error response envelopes.
- Policy/gate based authorization.
- Token/JWT/Sanctum lifecycle design.
- Rate limiting per user, guard, IP, role, or API scope.
- Cursor/offset pagination, filtering, sorting, and safe query allowlists.
- Idempotent state transitions for orders, webhooks, imports, notifications, and external integrations.
- OpenAPI documentation and feature tests.

## Recommended Pairing

Use this together with Laravel-specific project guidance in your root `AGENTS.md`.

## Project-Specific Guidance

For a real product, add a root `AGENTS.md` that defines your API contract, auth model, roles, route prefixes, response envelope, and testing command. This skill gives Laravel defaults, but the project contract should win when it is explicit.

## Source Lookup

When Context7 MCP is available, fetch Laravel 13 docs through Context7 before editing Laravel-specific API behavior. If Context7 is not available, use the official Laravel 13 docs directly.
