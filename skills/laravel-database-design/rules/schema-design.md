---
title: Model Tables and Columns Explicitly
impact: CRITICAL
impactDescription: Good schema design keeps Laravel APIs stable, queryable, and safe to evolve.
tags: laravel, database, schema, columns, modeling
---

# Model Tables and Columns Explicitly

## Rule

Design database tables around domain concepts, not only current UI forms. Column types, nullability, timestamps, soft deletes, and naming should express real business meaning.

## Prefer

- Plural table names matching Laravel conventions.
- Foreign key columns named after the relationship, such as `user_id`, `shop_id`, `order_id`.
- `timestamps()` for normal domain records.
- `softDeletes()` only when restore/history behavior is actually needed.
- Precise numeric types for money, counters, and quantities.
- Enums or constrained strings only when lifecycle and future changes are understood.
- JSON columns only for flexible metadata, not core relational data.

## Avoid

- Ambiguous column names like `type`, `status2`, `data`, or `flag` without documentation.
- Nullable columns without a clear reason.
- JSON columns used to avoid designing relationships.
- Soft deletes on tables where uniqueness, reporting, or history semantics are not considered.
- Storing derived values without refresh/update rules.

## Acceptance Criteria

A schema design is acceptable when table purpose, column meaning, nullability, relationship ownership, timestamps, soft delete behavior, and expected query patterns are clear.
