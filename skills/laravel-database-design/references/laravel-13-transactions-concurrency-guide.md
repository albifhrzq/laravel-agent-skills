# Laravel 13 Transactions & Concurrency Guide

Guide for designing consistent multi-write operations in Laravel.

## When to Use

Use this guide when creating or reviewing:

- order confirmation/cancellation
- inventory updates
- wallet-like or balance-affecting actions
- imports
- webhook processing
- queue jobs that write data
- idempotent operations
- concurrent user actions

## Core Rule

When multiple writes must succeed or fail together, use a transaction.

```php
DB::transaction(function () use ($order) {
    // validate current state
    // update order
    // update related rows
    // record domain event
});
```

## State Checks

Before changing state, check current state inside the transaction when concurrency matters.

Example questions:

- Is the order already cancelled?
- Has the payment already been processed?
- Is the inventory still available?
- Has this webhook event already been handled?

## Side Effects

Avoid external side effects inside long transactions.

Prefer:

```text
transaction commits database state
then job/event performs external side effect
```

If a job depends on committed data, dispatch after commit according to the project queue strategy.

## Row Locks

For concurrent updates to the same row or aggregate, consider row locks or state-machine constraints. Keep locked sections short.

## Retry Safety

Any operation that can be retried should avoid duplicate side effects.

Use idempotency keys or event deduplication for:

- payment callbacks
- order state changes
- imports
- notifications
- external provider events

## Review Checklist

- Multi-write operation is transactional.
- Current state is checked before transition.
- External calls are not performed inside long transactions.
- Queue/job dispatch timing is intentional.
- Retry behavior is defined.
- Tests cover duplicate/concurrent-like behavior when practical.
