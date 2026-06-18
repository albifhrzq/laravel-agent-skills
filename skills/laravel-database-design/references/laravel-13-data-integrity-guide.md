# Laravel 13 Data Integrity Guide

Guide for enforcing data correctness in Laravel database design.

## When to Use

Use this guide when creating or reviewing:

- foreign keys
- unique constraints
- nullable columns
- delete behavior
- status fields
- ownership rules
- soft deletes
- domain invariants

## Application Validation Is Not Enough

FormRequest validation helps at the API boundary, but important invariants should also be protected by the database.

Examples:

```php
$table->foreignId('shop_id')->constrained()->cascadeOnDelete();
$table->unique(['shop_id', 'slug']);
$table->string('email')->unique();
```

## Delete Behavior

Choose delete behavior intentionally:

```text
cascadeOnDelete  = child should be deleted with parent
restrictOnDelete = parent cannot be deleted while child exists
nullOnDelete     = child can remain without parent
```

For order, payment, audit, or reporting records, cascade delete is often risky unless the domain explicitly allows it.

## Nullable Columns

A nullable column should mean something.

Good reasons:

- value is not known yet
- value is optional by domain
- value is being backfilled during rollout
- relationship can genuinely be absent

Bad reasons:

- avoiding validation
- avoiding workflow design
- hiding inconsistent state

## Uniqueness

Use unique constraints for domain uniqueness.

Examples:

```php
$table->unique(['shop_id', 'slug']);
$table->unique(['provider', 'provider_event_id']);
```

When soft deletes interact with uniqueness, define the strategy explicitly.

## Status Fields

For status columns, document lifecycle transitions.

Example:

```text
draft -> published -> archived
pending -> paid -> cancelled -> refunded
```

Do not add statuses without deciding allowed transitions and tests.

## Review Checklist

- Foreign keys exist for important relationships.
- Delete behavior is intentional.
- Nullable columns have domain meaning.
- Unique constraints protect business invariants.
- Status lifecycle is documented.
- Soft delete behavior is understood.
- Tests cover duplicate and invalid relationship cases where relevant.
