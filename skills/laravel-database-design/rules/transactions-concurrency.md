---
title: Use Transactions for Multi-Write Consistency
impact: HIGH
impactDescription: Multi-write operations can leave inconsistent data without transactions and concurrency planning.
tags: laravel, database, transactions, concurrency, consistency
---

# Use Transactions for Multi-Write Consistency

## Rule

Use database transactions for domain operations that must succeed or fail together. Consider row locks, retries, and idempotency for concurrent writes.

## Prefer

```php
DB::transaction(function () use ($order) {
    // validate current state
    // update order
    // update related rows
    // store audit/domain event record
});
```

Use transactions for:

- order confirmation/cancellation
- inventory changes
- balance or wallet-like operations
- imports that create multiple related rows
- webhook processing that changes domain state

## Avoid

- Multiple related writes without a transaction.
- Dispatching irreversible side effects before transaction success.
- Updating state without checking current state.
- Ignoring duplicate/retry behavior.
- Long transactions that perform external HTTP calls.

## Acceptance Criteria

A transaction-sensitive change is acceptable when write boundaries, retry behavior, side effects, and concurrency risks are explicit and tested where practical.
