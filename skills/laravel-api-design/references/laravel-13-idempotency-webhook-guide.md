# Laravel 13 Idempotency & Webhook Guide

Guide for designing retry-safe Laravel API operations and webhook handlers.

## When to Use

Use this guide when creating or reviewing:

- order state transitions
- checkout flows
- wallet or balance-affecting actions
- import endpoints
- external integrations
- webhook receivers
- queue-based side effects
- duplicate request handling

## Core Rule

Any endpoint that creates an irreversible side effect must define retry behavior.

Examples of side effects:

- creating an order
- confirming an order
- cancelling an order
- updating inventory
- sending notification
- starting an import
- accepting an external event

## Idempotency Design

For sensitive writes, define:

- idempotency key source
- operation name
- actor or tenant scope
- request fingerprint
- status
- stored response or result reference
- expiry window
- conflict behavior

## Example Flow

```text
1. Client sends state-changing request with an idempotency key.
2. Server creates or locks an idempotency record for actor + operation + key.
3. Server compares request fingerprint if the key already exists.
4. If completed, return the stored result.
5. If new, perform the operation in a transaction.
6. Store the result and mark the operation complete.
```

## Conflict Behavior

If the same key is reused with a different request body, return `409 CONFLICT` using the project error envelope.

```json
{
  "error": {
    "code": "IDEMPOTENCY_CONFLICT",
    "message": "This operation key was already used with a different request."
  }
}
```

## Transactions

Use database transactions for critical state changes.

```php
DB::transaction(function () use ($request) {
    // lock idempotency record
    // validate current domain state
    // perform domain update
    // store result reference
});
```

Avoid dispatching external side effects before the transaction is committed.

## Queues and Side Effects

For queued work:

- make jobs safe to retry
- use stable job identifiers when available
- avoid duplicate external calls
- record processing state
- dispatch after commit when the job depends on committed database state

## Webhook Handling

Webhook receivers should:

- authenticate or verify the event according to provider docs
- deduplicate provider event IDs
- store a minimal event record
- process heavy work asynchronously
- return a quick success response after accepting the event
- handle out-of-order events when the provider can send them

## Webhook Event State

Track event processing state:

```text
received
accepted
processing
processed
ignored
failed
```

This makes retries and debugging safer.

## Do Not Trust Payload Alone

When a webhook changes important state, consider verifying the current state from the system of record or checking local domain constraints before applying the change.

## Testing Checklist

Test:

- first request succeeds
- duplicate request with same key returns same result
- same key with different body returns 409
- webhook duplicate event is ignored or returns safe success
- queue retry does not duplicate side effects
- invalid webhook verification fails safely
- state conflict returns project error envelope

## Review Checklist

Before accepting idempotency or webhook changes, verify:

- retry behavior is documented
- duplicate detection is implemented
- database transaction boundaries are clear
- queue jobs are retry-safe
- webhook provider event ID is stored when available
- conflict behavior is tested
- error responses follow the API contract
