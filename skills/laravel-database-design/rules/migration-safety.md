---
title: Design Laravel Migrations for Safety and Reviewability
impact: CRITICAL
impactDescription: Unsafe migrations can break production data, deployments, or rollback paths.
tags: laravel, database, migrations, schema, production
---

# Design Laravel Migrations for Safety and Reviewability

## Rule

Migrations must be small, intentional, and safe for the target environment. Do not mix unrelated schema changes, heavy data backfills, and risky production operations in one migration unless explicitly justified.

## Prefer

- One purpose per migration.
- Clear table and column names.
- Reversible `down()` methods when practical.
- Separate schema changes from large data backfills.
- Indexes for new high-use foreign keys, filters, and sorts.
- Production rollout plan for high-volume tables.

## Avoid

- Huge migrations that do schema change and data migration together.
- Dropping or renaming columns without compatibility planning.
- Changing column types on large tables without production risk review.
- Adding non-null columns without defaults/backfill strategy.
- Running unbounded data updates inside normal deploy migrations.

## Acceptance Criteria

A migration is acceptable when its purpose is clear, rollback risk is understood, production impact is considered, constraints/indexes are intentional, and tests or seed data reflect the new schema when needed.
