# Changelog

All notable changes to this repository will be documented in this file.

This project follows a practical versioning style per skill. Versions are recorded in each skill's `metadata.json` and `SKILL.md`.

## 2026-06-18

### Added

- Added `laravel-database-design` skill version `1.0.0`.
  - Migrations and schema design guidance.
  - Eloquent relationship guidance.
  - Data integrity and constraints guidance.
  - Index and query performance guidance.
  - Data migration, factories, and seeders guidance.
  - Transactions and concurrency guidance.
  - Zero-downtime migration guidance.
  - Database production checklist.

- Added `laravel-code-tracer` as a Codex-visible skill wrapper.
  - Traces Laravel execution flow from route, command, job, event, or webhook to response or side effect.

- Added `laravel-code-reviewer` as a Codex-visible skill wrapper.
  - Reviews Laravel code changes for correctness, API contract stability, validation, authorization, security, performance, tests, docs, and production readiness.

- Added `agents/` versions of:
  - `laravel-code-tracer`
  - `laravel-code-reviewer`

### Changed

- Updated root `README.md` to include:
  - `laravel-database-design`
  - Codex install commands for all current skills
  - manual copy paths
  - generalized skill layout

## laravel-api-design 1.2.0

### Added

- Expanded `references/` knowledge base.
- Added production-focused references for:
  - error handling
  - pagination and filtering
  - rate limiting
  - idempotency and webhooks
  - API testing
  - OpenAPI documentation
  - production checklist

### Changed

- Updated `SKILL.md`, `AGENTS.md`, and `metadata.json` to version `1.2.0`.
- Updated reference guide index.

## laravel-api-design 1.1.0

### Added

- Added `references/` layer to mirror mature agent-skill knowledge-base structure.
- Added initial reference guides:
  - API routing
  - FormRequest validation
  - API resources
  - auth and authorization
  - JWT auth

### Changed

- Updated `SKILL.md` to explain the two-layer structure:
  - `rules/`
  - `references/`

## laravel-api-design 1.0.2

### Added

- Added JWT lifecycle as a first-class concern.
- Added `rules/jwt-token-lifecycle.md`.
- Added JWT guidance to `SKILL.md`, `AGENTS.md`, `README.md`, and `metadata.json`.

## laravel-api-design 1.0.1

### Added

- Added Laravel 13 documentation grounding.
- Added Context7 / official Laravel docs lookup guidance.
- Added API route installation guidance.
- Added references to Laravel 13 API route prefix behavior.

## laravel-api-design 1.0.0

### Added

- Initial Laravel 13 API design skill.
- Added rules for:
  - route design
  - request validation
  - API resource responses
  - error envelope
  - auth and authorization
  - pagination/filtering/sorting
  - idempotency and side effects
  - rate limiting
  - OpenAPI and tests
