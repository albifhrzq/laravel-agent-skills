---
name: laravel-database-design
description: Laravel 13 database design knowledge base for migrations, schema design, Eloquent relationships, constraints, indexes, query performance, factories, seeders, soft deletes, transactions, and zero-downtime migration safety. Use when designing tables, reviewing migrations, modeling relationships, or optimizing Laravel database access.
license: MIT
metadata:
  author: albifhrzq
  version: "1.0.0"
  framework: Laravel
  laravelVersion: "13.x"
  phpVersion: "8.3+"
---

# Laravel Database Design

Production-oriented Laravel 13 database design knowledge base.

This skill has two layers:

- `rules/` for short guardrails and acceptance criteria.
- `references/` for longer implementation guides, examples, trade-offs, and edge cases.

## Source of Truth

Before changing Laravel database behavior, check:

1. Project root `AGENTS.md`.
2. Context7 Laravel 13 docs when available.
3. Official Laravel 13 documentation.
4. Existing database conventions in the repository.
5. Existing migrations, models, factories, seeders, and tests.

## When to Apply

Use this skill when the task involves:

- creating or reviewing migrations
- designing table structure
- choosing primary keys and foreign keys
- adding constraints
- adding indexes
- modeling Eloquent relationships
- deciding soft delete behavior
- creating factories or seeders
- changing high-volume tables
- optimizing queries
- using transactions or row locks
- planning zero-downtime migration safety

## Quick Rule Index

| Priority | Category | Impact | Rule files |
|---|---|---:|---|
| 1 | Migration safety | CRITICAL | `rules/migration-safety.md` |
| 2 | Schema design | CRITICAL | `rules/schema-design.md` |
| 3 | Relationships | CRITICAL | `rules/eloquent-relationships.md` |
| 4 | Constraints | CRITICAL | `rules/constraints-integrity.md` |
| 5 | Indexes | HIGH | `rules/index-query-performance.md` |
| 6 | Data changes | HIGH | `rules/data-migration-seeding.md` |
| 7 | Transactions | HIGH | `rules/transactions-concurrency.md` |
| 8 | Zero downtime | HIGH | `rules/zero-downtime-migrations.md` |

## Reference Guide Index

Read these when the task needs implementation detail beyond a checklist:

| Topic | Reference file |
|---|---|
| Migrations & schema | `references/laravel-13-migrations-schema-guide.md` |
| Eloquent relationships | `references/laravel-13-eloquent-relationships-guide.md` |
| Indexes & query performance | `references/laravel-13-index-query-performance-guide.md` |
| Data integrity & constraints | `references/laravel-13-data-integrity-guide.md` |
| Transactions & concurrency | `references/laravel-13-transactions-concurrency-guide.md` |
| Production checklist | `references/laravel-13-database-production-checklist.md` |

## Laravel Database Defaults

Prefer these defaults unless the project explicitly defines another convention:

- Keep migrations small and reviewable.
- Use explicit foreign keys for important relationships.
- Use constraints for data integrity, not only application validation.
- Add indexes for common filter, sort, and join paths.
- Use Eloquent relationships with return types.
- Use casts for dates, enums, JSON arrays, booleans, and value-like fields.
- Avoid unbounded queries on large tables.
- Use transactions for multi-write domain operations.
- Separate schema migrations from large data backfills when production risk is high.
- Consider zero-downtime migration patterns for large or critical tables.

## Files to Read

Start with `AGENTS.md` for the compiled guide. Then read `rules/_sections.md` for rule order and `references/README.md` for detailed guide selection.
