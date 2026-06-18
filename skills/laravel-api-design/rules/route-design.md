---
title: Design Laravel API Routes Around Resources and State Transitions
impact: CRITICAL
impactDescription: Stable route contracts make APIs predictable and easier to secure.
tags: laravel, api, routes, rest, versioning
---

# Design Laravel API Routes Around Resources and State Transitions

## Rule

Use resource-oriented, versioned API routes. Prefer `Route::apiResource()` for standard CRUD resources and explicit sub-resource controllers for state transitions or side effects.

In `routes/api.php`, remember that Laravel's default API routing setup already applies the `/api` URI prefix. Use `v1`, not `api/v1`, unless routing has been intentionally customized in `bootstrap/app.php`.

## Prefer

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('shops.products', ShopProductController::class)->shallow();
    Route::post('orders/{order}/cancellation', [OrderCancellationController::class, 'store']);
    Route::post('orders/{order}/confirmation-attempts', [OrderConfirmationAttemptController::class, 'store']);
});
```

Under Laravel's default API route prefix, this produces `/api/v1/...` URLs.

## Avoid

```php
Route::post('createProduct', [ProductController::class, 'createProduct']);
Route::post('orders/{order}/cancel-order-now', [OrderController::class, 'cancel']);
Route::post('orders/{order}?action=cancel', [OrderController::class, 'update']);

// Usually wrong inside routes/api.php when default API prefix is active:
Route::prefix('api/v1')->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

## Laravel Guidance

- Put public or long-lived APIs under `/api/v1` at the actual URL level, but in default `routes/api.php` this normally means `Route::prefix('v1')`.
- Use plural nouns: `users`, `shops`, `products`, `orders`.
- Keep nesting shallow. Prefer one parent level, two only when it materially improves authorization or context.
- Use route model binding, but do not leak models without policy checks.
- Use scoped bindings when child resources must belong to the parent.
- Use dedicated controllers for transition resources, such as `OrderCancellationController`, `OrderShipmentController`, or `ProductPublicationController`.
- Use `POST /resource/{id}/transition-resource` for non-idempotent actions and `DELETE /resource/{id}/transition-resource` when removing a state or relationship.

## Acceptance Criteria

A route change is acceptable when the route is predictable, version-aware, documented, covered by policy/middleware, does not duplicate the `/api` prefix accidentally, and has a feature test for the happy path plus authorization failure.
