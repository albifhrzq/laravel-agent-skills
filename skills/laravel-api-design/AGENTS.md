# Laravel API Design - Complete Reference

**Version:** 1.0.0  
**Target:** Laravel 13.x, PHP 8.3+  
**License:** MIT

## Purpose

Use this guide when designing, reviewing, or implementing Laravel API endpoints. The goal is not just to make routes work, but to keep API contracts stable, testable, secure, and easy for clients to consume.

## Core Principles

1. API routes should expose resources and explicit state transitions, not controller implementation details.
2. Controllers should stay thin. Business logic belongs in actions, services, domain classes, jobs, or model methods where appropriate.
3. Validation must be centralized in FormRequest classes for non-trivial endpoints.
4. Response shape must be intentional and consistent. Use JsonResource and ResourceCollection.
5. Authorization must be enforced through policies, gates, middleware, or FormRequest `authorize()`, not scattered ad-hoc `if` checks.
6. Collection endpoints must define pagination, filtering, sorting, and safe allowlists.
7. Side-effecting operations must be designed for retries and idempotency.
8. API contracts must be covered by feature tests and documentation.

## Recommended Route Shape

```php
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:api'])
    ->group(function () {
        Route::apiResource('products', ProductController::class);
        Route::post('orders/{order}/cancellation', [OrderCancellationController::class, 'store']);
    });
```

Prefer plural nouns and stable route names. Use nested resources only when the parent relationship matters for authorization or creation.

## Recommended Controller Shape

```php
final class ProductController
{
    public function index(ProductIndexRequest $request): ProductCollection
    {
        $products = Product::query()
            ->with(['shop'])
            ->allowedFilters($request->validated('filters', []))
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return new ProductCollection($products);
    }

    public function store(StoreProductRequest $request, CreateProductAction $createProduct): ProductResource
    {
        $product = $createProduct->execute($request->user(), $request->validated());

        return ProductResource::make($product);
    }
}
```

## Response Contract

Prefer one explicit project-wide contract. A common default is:

```json
{
  "data": {},
  "meta": {},
  "links": {}
}
```

For errors:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "email": ["The email field is required."]
    },
    "request_id": "req_01H..."
  }
}
```

Do not expose exception class names, stack traces, SQL errors, token values, or internal service details in production responses.

## Rule Files

- `rules/route-design.md`
- `rules/request-validation.md`
- `rules/api-resource-response.md`
- `rules/error-envelope.md`
- `rules/auth-authorization.md`
- `rules/pagination-filtering-sorting.md`
- `rules/idempotency-and-side-effects.md`
- `rules/rate-limiting.md`
- `rules/openapi-and-tests.md`

## Review Checklist

Before accepting API changes, verify:

- Routes are versioned when needed.
- Endpoints use resource naming or explicit transition resources.
- Controllers do not contain large business workflows.
- Validation is in FormRequest classes.
- Policies/gates/middleware protect resources.
- Responses use resources/collections, not raw model dumps.
- Pagination/filter/sort parameters are documented and allowlisted.
- Side effects are idempotent or intentionally non-idempotent with justification.
- Errors are safe and consistent.
- Feature tests cover success, validation failure, authorization failure, not found, and important edge cases.
- OpenAPI docs or API docs are updated when the contract changes.
