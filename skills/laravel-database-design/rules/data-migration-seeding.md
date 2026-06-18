---
title: Separate Schema Changes from Data Changes
impact: HIGH
impactDescription: Large data changes inside deploy migrations can create downtime and rollback risk.
tags: laravel, database, seeders, factories, data-migration
---

# Separate Schema Changes from Data Changes

## Rule

Use factories and seeders for predictable local/test data. Treat production data backfills as operational work, not casual migration code.

## Prefer

- Factories for tests.
- Seeders for local/dev baseline data.
- Dedicated backfill commands or jobs for large production data changes.
- Chunked processing for large tables.
- Idempotent backfills that can resume safely.

## Avoid

- Production-scale data updates inside normal schema migrations.
- Seeders that assume production data shape.
- Factories that produce invalid domain data.
- Backfills that cannot be retried.
- Loading all records into memory.

## Acceptance Criteria

A data change is acceptable when its target environment is clear, it is safe to retry, it is bounded or chunked, and tests/factories/seeders match the new schema expectations.
