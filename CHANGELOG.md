# Changelog

All notable changes to this repository will be documented in this file.

This project follows a practical versioning style per skill. Versions are recorded in each skill's `metadata.json` and `SKILL.md`.

## 2026-07-13 — v2.0.0

### Added

- Added the canonical `laravel-13` full-stack master skill.
- Added source locking, full Laravel 13 documentation coverage, provenance, deterministic routing, compiled-guide drift detection, snippet linting, install smoke, and static golden scenarios.
- Added deep coverage for session, CSRF, Blade, Vite, core UI, queues, cache, integrations, testing, deployment, and official package routing.
- Added dedicated deep references for Collections, helpers, strings, contracts, Process, full-text search, vector similarity, embeddings, reranking, and Laravel 12-to-13 upgrades.
- Added a booted Laravel Testbench fixture with runtime tests for CSRF, session rotation, Gate authorization, private uploads, webhook HMAC, rate limiting, encryption, and hashing.
- Added a multi-run behavioral evaluation gate with independent semantic review, mandatory high-risk cases, and Codex/Claude target validation.
- Added source-backed documentation inventory hashing, latest stable Laravel 13 release detection, generated-artifact checks, dependency audits, and SHA-pinned GitHub Actions.

### Changed

- Updated the official framework baseline to Laravel `v13.19.0`.
- Made reviewer and tracer version-aware dependencies of the master skill and generated their agent copies from canonical skill sources.
- Corrected authorization examples for the empty Laravel 13 base controller and removed package-specific APIs from core defaults.
- Included core Blade/Vite UI by default while keeping Livewire, Inertia, Flux, React, Vue, Svelte, Tailwind, and other optional stacks detection- or request-gated.
- Conservatively classified mixed official, derived, and project-convention reference files in machine-readable provenance.

### Removed

- Removed standalone `laravel-api-design` and `laravel-database-design` skills in favor of the v2 master skill.

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
