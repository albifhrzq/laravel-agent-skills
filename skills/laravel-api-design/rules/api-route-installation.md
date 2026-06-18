---
title: Use Laravel 13 API Routing Defaults Correctly
impact: HIGH
impactDescription: Laravel 13 API routes have framework defaults that should not be duplicated or guessed.
tags: laravel, api, routing, install-api, sanctum
---

# Use Laravel 13 API Routing Defaults Correctly

## Rule

When a Laravel 13 project needs a stateless API, prefer Laravel's documented API setup flow and do not duplicate the `/api` prefix manually inside `routes/api.php` unless the project has intentionally customized routing.

## Laravel 13 Defaults

- `php artisan install:api` enables API routing support for a new application.
- The command installs Sanctum and creates `routes/api.php`.
- Routes in `routes/api.php` are stateless.
- Routes in `routes/api.php` are assigned to the `api` middleware group.
- The `/api` URI prefix is automatically applied to API routes.
- The API prefix can be customized in `bootstrap/app.php` routing configuration.

## Prefer

```php
// routes/api.php
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

This produces routes under `/api/v1/products` when Laravel's default API prefix is active.

## Avoid

```php
// routes/api.php
Route::prefix('api/v1')->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

This can accidentally produce `/api/api/v1/products` when the default API prefix is already active.

## Acceptance Criteria

Before changing API route prefixes, inspect `bootstrap/app.php`, `routes/api.php`, and `php artisan route:list --path=api` output when available.
