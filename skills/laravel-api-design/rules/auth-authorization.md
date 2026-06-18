---
title: Enforce Laravel API Auth and Authorization Explicitly
impact: CRITICAL
impactDescription: API access must be protected at the correct boundary and resource level.
tags: laravel, api, auth, authorization, policies, gates, jwt, sanctum
---

# Enforce Laravel API Auth and Authorization Explicitly

## Rule

Protect API endpoints with explicit authentication middleware and resource-level authorization. Do not rely on hidden controller assumptions or frontend-only checks.

## Prefer

```php
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('shops.products', ShopProductController::class)->shallow();
});
```

```php
public function update(UpdateProductRequest $request, Product $product): ProductResource
{
    $this->authorize('update', $product);

    // update via action/service
}
```

## Laravel Guidance

- Use `auth:sanctum`, Passport, JWT, or a project-approved guard consistently.
- Define token expiry, refresh behavior, revocation, logout, and compromised-token handling.
- Use policies for resource access: view, create, update, delete, restore, forceDelete, and domain-specific abilities.
- For marketplace-style APIs, verify tenant/shop/seller ownership server-side.
- Do not trust `shop_id`, `user_id`, `role`, or `is_admin` from the request payload.
- Use middleware for broad access constraints and policies for resource-level decisions.
- Avoid embedding permission logic repeatedly in controllers.

## Role and Tenant Checks

For seller/shop APIs, always check both:

1. The authenticated user has the required role/capability.
2. The resource belongs to a shop/tenant the user can manage.

## Acceptance Criteria

Every protected endpoint declares auth middleware, every resource mutation has policy/gate coverage, token lifecycle is documented, and feature tests cover unauthorized and forbidden cases separately.
