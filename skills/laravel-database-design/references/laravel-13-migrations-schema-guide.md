# Laravel 13 Migrations & Schema Guide

Guide for designing Laravel migrations and table schemas that are safe to review, deploy, and evolve.

## When to Use

Use this guide when creating or reviewing:

- new tables
- altered tables
- column additions/removals
- foreign keys
- timestamps and soft deletes
- schema dumps
- production-sensitive migrations

## Migration Design Principles

A migration should have one clear purpose. Keep unrelated table changes in separate migrations when that improves reviewability and rollback reasoning.

Good migration intent examples:

```text
create_products_table
add_status_to_orders_table
add_shop_id_index_to_products_table
create_order_events_table
```

Avoid migrations that mix many unrelated changes.

## Column Choices

Choose column types based on domain meaning:

```php
$table->id();
$table->foreignId('shop_id')->constrained();
$table->string('name', 120);
$table->unsignedBigInteger('price');
$table->string('status', 40)->index();
$table->json('metadata')->nullable();
$table->timestamp('published_at')->nullable();
$table->timestamps();
$table->softDeletes();
```

## Nullability

Make nullable columns intentional.

Use nullable when:

- the value is truly optional
- the value is filled later in a workflow
- legacy data must be backfilled gradually

Avoid nullable when it only hides incomplete design.

## Foreign Keys

Use foreign keys for important relationships.

```php
$table->foreignId('shop_id')->constrained()->cascadeOnDelete();
$table->foreignId('user_id')->constrained()->restrictOnDelete();
```

Choose delete behavior intentionally:

```text
cascadeOnDelete  = child record should disappear with parent
restrictOnDelete = parent cannot be removed while child exists
nullOnDelete     = child can remain after parent is removed
```

## Timestamps and Soft Deletes

Use `timestamps()` for normal domain records.

Use `softDeletes()` only when restore/history semantics are needed and uniqueness/reporting implications are understood.

## Schema Dumps

For long-running projects with many old migrations, Laravel supports schema dumping. Use schema dump only as a maintenance optimization, not as a replacement for understanding current schema.

## Review Checklist

- Migration has one clear purpose.
- Column types match domain meaning.
- Nullability is intentional.
- Foreign keys and delete behavior are explicit.
- Indexes exist for expected query paths.
- Large production changes have rollout plan.
- Tests/factories/seeders are updated when schema changes affect them.
