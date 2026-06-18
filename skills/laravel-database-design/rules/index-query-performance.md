---
title: Design Indexes from Real Query Paths
impact: HIGH
impactDescription: Missing or wrong indexes make Laravel APIs slow and expensive at scale.
tags: laravel, database, indexes, performance, queries
---

# Design Indexes from Real Query Paths

## Rule

Indexes should be based on actual query patterns: joins, filters, sorts, uniqueness, and high-volume access paths.

## Prefer

- Index foreign keys used in joins and filters.
- Composite indexes for common filter + sort combinations.
- Unique indexes for domain uniqueness.
- Cursor-friendly indexes for large feeds.
- Query review when adding collection filters or sorts.

Laravel schema examples:

```php
$table->index('status');
$table->index(['shop_id', 'status']);
$table->index(['shop_id', 'created_at']);
$table->unique(['shop_id', 'slug']);
```

## Avoid

- Adding indexes randomly without query need.
- Sorting large tables by unindexed columns.
- Allowing arbitrary `orderBy()` from request input.
- Using `all()` on large tables.
- Relying on eager loading after an N+1 problem has already shipped.

## Acceptance Criteria

An index change is acceptable when the target query path is known, the column order is justified, write overhead is considered, and tests or review notes cover the API/query that needs it.
