---
title: Plan Zero-Downtime Migrations for Critical Tables
impact: HIGH
impactDescription: Some schema changes require phased rollout to avoid downtime or broken deployments.
tags: laravel, database, migrations, zero-downtime, production
---

# Plan Zero-Downtime Migrations for Critical Tables

## Rule

For large or critical production tables, use phased migration patterns. Do not assume a schema change is safe just because it works locally.

## Prefer Phased Changes

Example pattern:

```text
1. Add nullable column or new table.
2. Deploy code that writes both old and new shape when needed.
3. Backfill data safely in chunks.
4. Switch reads to the new shape.
5. Add constraints / not-null rules after data is valid.
6. Remove old column only after clients and code no longer depend on it.
```

## High-Risk Changes

Treat these as production-sensitive:

- renaming columns
- dropping columns
- changing column types
- adding non-null columns to large tables
- adding heavy indexes to large tables
- changing foreign key behavior
- rewriting large amounts of data

## Acceptance Criteria

A production-sensitive migration is acceptable when rollout phases, rollback strategy, data backfill, app compatibility, and deployment timing are considered.
