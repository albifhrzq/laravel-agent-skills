---
title: Design Side-Effecting API Operations for Idempotency and Retries
impact: HIGH
impactDescription: Order, webhook, import, notification, and external integration endpoints must be safe under retries.
tags: laravel, api, idempotency, orders, queues, webhooks, integrations
---

# Design Side-Effecting API Operations for Idempotency and Retries

## Rule

Any endpoint that creates irreversible side effects must define retry behavior and idempotency. This is required for checkout, order transitions, webhooks, imports, notifications, and external service calls.

## Prefer

```http
POST /api/v1/orders/123/confirmation-attempts
Idempotency-Key: order_01H...
```

```php
DB::transaction(function () use ($request, $order) {
    $key = $request->header('Idempotency-Key');

    $record = IdempotencyRecord::query()
        ->lockForUpdate()
        ->firstOrCreate([
            'user_id' => $request->user()->id,
            'key' => $key,
            'operation' => 'order.confirmation_attempt',
        ]);

    if ($record->completed_at) {
        return $record->stored_response;
    }

    // perform operation once, then store response/result
});
```

## Laravel Guidance

- Require `Idempotency-Key` for order, checkout, wallet, webhook, import, and external-write endpoints.
- Store idempotency records with user/scope, operation name, request hash, status, response, and expiry.
- Use database transactions and row locks for critical flows.
- Dispatch jobs after commit when side effects depend on committed data.
- Make queued jobs idempotent too; API idempotency alone is not enough.
- Webhook handlers should deduplicate provider event IDs.
- Return the same response for safe duplicate requests with the same key and payload.
- Return `409 CONFLICT` when the same key is reused with a different payload.

## Avoid

Do not perform irreversible updates, notifications, or external writes without transactions, retry handling, provider/request identifiers, or duplicate protection.

## Acceptance Criteria

Side-effecting endpoints document retry behavior, persist idempotency records where needed, handle duplicate requests safely, and have tests for first request, duplicate same payload, and duplicate conflicting payload.
