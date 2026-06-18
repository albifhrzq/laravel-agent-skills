# Laravel 13 Index & Query Performance Guide

Guide for designing database indexes and query patterns for Laravel APIs.

## When to Use

Use this guide when creating or reviewing:

- collection endpoints
- filters and sorts
- high-volume tables
- dashboard/admin queries
- feed/timeline queries
- joins and relationship loading
- slow query fixes

## Index Design

Create indexes based on real query paths.

```php
$table->index('status');
$table->index(['shop_id', 'status']);
$table->index(['shop_id', 'created_at']);
$table->unique(['shop_id', 'slug']);
```

## Common Index Targets

- foreign keys used in joins
- fields used in filters
- fields used in sort order
- composite filter + sort combinations
- unique domain keys
- cursor pagination columns

## Query Review

Before adding a filter or sort to an API, check:

- table size now and expected growth
- whether filter column is indexed
- whether sort column is indexed
- whether a composite index is needed
- whether the query uses eager loading
- whether pagination is bounded

## Avoid N+1 Queries

Use eager loading intentionally:

```php
Product::query()
    ->with(['shop'])
    ->latest()
    ->paginate(15);
```

Avoid relationship access in loops without eager loading.

## Large Result Sets

Avoid:

```php
Product::all();
```

Prefer bounded or streaming patterns:

```php
Product::query()->paginate(50);
Product::query()->cursorPaginate(50);
Product::query()->chunkById(500, function ($products) {
    // process chunk
});
```

## Pagination Choice

```text
paginate()        = total count needed
simplePaginate()  = total count not needed
cursorPaginate()  = large feed / infinite scroll / stable cursor use case
```

## Review Checklist

- Filters are allowlisted.
- Sorts are allowlisted.
- Default ordering is stable.
- Pagination is bounded.
- Foreign keys and common filters have indexes.
- Composite indexes match real query paths.
- N+1 risk is reviewed.
- Large table operations use chunking or cursor strategies.
