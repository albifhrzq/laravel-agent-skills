---
title: Enforce Data Integrity in the Database
impact: CRITICAL
impactDescription: Application validation is not enough for important business invariants.
tags: laravel, database, constraints, foreign-keys, integrity
---

# Enforce Data Integrity in the Database

## Rule

Important data relationships and uniqueness rules should be enforced at the database level, not only in Laravel validation.

## Prefer

```php
$table->foreignId('shop_id')->constrained()->cascadeOnDelete();
$table->foreignId('user_id')->constrained()->restrictOnDelete();
$table->string('email')->unique();
$table->unique(['shop_id', 'slug']);
```

Choose delete behavior intentionally:

```text
cascadeOnDelete()  = child should disappear with parent
restrictOnDelete() = parent cannot be deleted while child exists
nullOnDelete()     = child can remain without parent
```

## Avoid

- Foreign key columns without foreign key constraints for important relationships.
- Unique rules only in FormRequest when duplicates would corrupt data.
- Cascading deletes without considering audit/history/reporting needs.
- Nullable foreign keys without domain reason.
- Soft delete uniqueness conflicts without a defined strategy.

## Acceptance Criteria

A data integrity change is acceptable when foreign keys, uniqueness, nullable behavior, delete behavior, and application validation all agree with the domain model.
