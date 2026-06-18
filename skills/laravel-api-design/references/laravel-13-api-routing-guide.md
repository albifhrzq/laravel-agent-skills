# Laravel 13 API Routing Guide

Guide for designing Laravel 13 API routes that are predictable, version-aware, and safe for long-lived clients.

## When to Use

Use this guide when creating or reviewing:

- `routes/api.php`
- API route prefixes and versioning
- `Route::apiResource` controllers
- nested resources
- route model binding
- scoped bindings
- state-transition endpoints
- route tests and `route:list` checks

## Laravel 13 API Setup

Laravel 13 API routing may be enabled with:

```bash
php artisan install:api
```

Under the documented Laravel API setup:

- `routes/api.php` is created for stateless API routes.
- API routes are assigned to the `api` middleware group.
- API routes automatically receive the `/api` URI prefix.
- The API prefix can be customized in `bootstrap/app.php`.

## Important Prefix Rule

Inside default `routes/api.php`, use `v1`, not `api/v1`.

```php
// routes/api.php
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

This produces:

```text
/api/v1/products
```

Avoid this in default `routes/api.php`:

```php
Route::prefix('api/v1')->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

It can accidentally produce:

```text
/api/api/v1/products
```

## Resource Naming

Use plural nouns and stable resource names:

```text
/users
/shops
/products
/orders
/order-items
```

Avoid verb-heavy route names:

```text
/createProduct
/cancelOrderNow
/update-status-product
```

## API Resource Controllers

Use `Route::apiResource()` for standard CRUD APIs. It excludes HTML form routes such as `create` and `edit`.

```php
Route::apiResource('products', ProductController::class);
```

For nested resources, keep nesting shallow:

```php
Route::apiResource('shops.products', ShopProductController::class)->shallow();
```

## State Transition Endpoints

Do not hide domain actions behind query parameters or generic update endpoints.

Prefer explicit transition resources:

```php
Route::post('orders/{order}/cancellation', [OrderCancellationController::class, 'store']);
Route::post('orders/{order}/confirmation-attempts', [OrderConfirmationAttemptController::class, 'store']);
Route::post('products/{product}/publication', [ProductPublicationController::class, 'store']);
Route::delete('products/{product}/publication', [ProductPublicationController::class, 'destroy']);
```

Avoid:

```php
Route::post('orders/{order}?action=cancel', [OrderController::class, 'update']);
Route::post('orders/{order}/cancel-order-now', [OrderController::class, 'cancel']);
```

## Route Model Binding

Route model binding is useful, but it does not replace authorization.

Good pattern:

```php
public function show(Product $product): ProductResource
{
    $this->authorize('view', $product);

    return ProductResource::make($product);
}
```

For nested resources, protect parent-child relationships:

```php
Route::apiResource('shops.products', ShopProductController::class)->scoped();
```

When using nested resources such as `/shops/{shop}/products/{product}`, make sure the product belongs to the shop and the authenticated user can access that shop.

## Guard Boundaries

Keep route groups clear:

```php
Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:api'])
    ->group(function () {
        // Sanctum routes
    });
```

For JWT projects, use the project-approved JWT guard and do not mix Sanctum/JWT/session auth in the same route group unless the project explicitly supports multiple guards.

## Route Review Checklist

Before accepting route changes, verify:

- `routes/api.php` does not duplicate `/api` prefix.
- Public or long-lived APIs are versioned intentionally.
- Resource names are plural nouns.
- `Route::apiResource()` is used for standard CRUD.
- Nested resources are shallow unless deeper nesting is justified.
- State transitions are explicit endpoints.
- Route model binding is paired with policy/gate checks.
- Parent-child ownership is enforced for nested resources.
- `php artisan route:list --path=api` output matches the expected URL contract.
- Feature tests cover happy path, unauthorized, forbidden, and not found cases.
