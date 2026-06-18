# Laravel 13 Auth & Authorization Guide

Guide for designing authentication and authorization boundaries in Laravel 13 APIs.

## When to Use

Use this guide when creating or reviewing:

- protected API route groups
- guard selection
- Sanctum routes
- JWT routes
- policies and gates
- role checks
- tenant/shop ownership checks
- 401 vs 403 behavior
- auth-related feature tests

## Authentication vs Authorization

Authentication answers:

```text
Who is making the request?
```

Authorization answers:

```text
Is this authenticated actor allowed to do this action on this resource?
```

Do not treat authentication as authorization. A valid user still needs policy/gate checks for sensitive resources.

## Guard Boundaries

Choose the auth strategy per route group.

Examples:

```php
Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:api'])
    ->group(function () {
        // Sanctum API routes
    });
```

```php
Route::prefix('v1')
    ->middleware(['auth:api', 'throttle:api'])
    ->group(function () {
        // JWT or Passport API routes, depending on config/auth.php
    });
```

Do not mix Sanctum, JWT, Passport, and session auth inside the same route group unless the project deliberately supports multiple guards.

## Policies

Use policies for resource-level decisions.

```php
public function update(UpdateProductRequest $request, Product $product): ProductResource
{
    $this->authorize('update', $product);

    // update via action/service
}
```

Policy examples should cover actions such as:

- view
- create
- update
- delete
- restore
- forceDelete
- publish
- cancel
- manage

## FormRequest authorize()

Use FormRequest `authorize()` for request-level checks, especially when the request itself should be rejected before controller execution.

```php
public function authorize(): bool
{
    return $this->user()->can('create', Product::class);
}
```

For resource updates, policy checks may still be repeated in the controller/action when that improves clarity.

## Role and Tenant Checks

For marketplace-style APIs, check both:

1. The actor has the role or capability.
2. The target resource belongs to a tenant/shop/account the actor can manage.

Example risk:

```text
A seller can update products, but only products inside their own shop.
```

Route model binding alone is not enough. Pair it with scoped binding or explicit ownership checks.

## Sanctum Abilities

For token-style Sanctum usage, consider token abilities for route-level capability checks.

Example design questions:

- Does this token represent a browser session or API token?
- Does the route require a specific ability?
- Are abilities checked in middleware, policy, or both?
- What happens when the user has the role but the token does not have the ability?

## 401 vs 403

Use status codes consistently:

- `401 Unauthorized`: the request is not authenticated.
- `403 Forbidden`: the request is authenticated but not allowed.

Do not return `404` to hide resources unless the project has a deliberate resource hiding policy.

## Error Contract

Auth and authorization failures should use the project error envelope.

Example:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not allowed to perform this action."
  }
}
```

## Test Checklist

For protected endpoints, test:

- unauthenticated request returns 401
- authenticated but unauthorized request returns 403
- owner/authorized user succeeds
- user from another tenant/shop is denied
- route with required ability denies token without ability
- policy is applied to create, update, delete, and state transitions

## Review Checklist

Before accepting auth changes, verify:

- guard strategy is explicit
- route group middleware is correct
- policies/gates exist for resource actions
- tenant/shop ownership is enforced
- FormRequest authorization is not hiding complex policy logic
- status codes are consistent
- tests cover 401 and 403 separately
