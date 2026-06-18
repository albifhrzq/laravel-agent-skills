# Laravel API Design - Complete Reference

**Version:** 1.1.0  
**Target:** Laravel 13.x, PHP 8.3+  
**License:** MIT

## Purpose

Use this guide when designing, reviewing, or implementing Laravel API endpoints. The goal is not just to make routes work, but to keep API contracts stable, testable, secure, and easy for clients to consume.

This skill has two layers:

- `rules/` contains concise guardrails and acceptance criteria.
- `references/` contains longer implementation guides, examples, trade-offs, and review checklists.

## Source of Truth

When working on Laravel-specific behavior, use this order:

1. Project-level `AGENTS.md` when it defines explicit local conventions.
2. Context7 Laravel 13 documentation when Context7 MCP is available.
3. Official Laravel 13 documentation.
4. Existing code patterns in the repository.

For JWT-specific behavior, also check the selected JWT package or identity provider documentation before changing guard config, credential lifetime, refresh, invalidation, claims, or error behavior.

## Reference Guides

Read the relevant reference guide when the task needs more than a short rule:

- `references/laravel-13-api-routing-guide.md`
- `references/laravel-13-form-request-validation-guide.md`
- `references/laravel-13-api-resource-guide.md`
- `references/laravel-13-auth-authorization-guide.md`
- `references/laravel-13-jwt-auth-guide.md`

## Core Principles

1. API routes should expose resources and explicit state transitions, not controller implementation details.
2. Controllers should stay thin. Business logic belongs in actions, services, domain classes, jobs, or model methods where appropriate.
3. Validation should be centralized in FormRequest classes for non-trivial endpoints.
4. Response shape must be intentional and consistent. Use JsonResource, ResourceCollection, or Laravel 13 JSON:API Resources when the project follows JSON:API.
5. Authorization must be enforced through policies, gates, middleware, or FormRequest `authorize()`, not scattered ad-hoc `if` checks.
6. Collection endpoints must define pagination, filtering, sorting, and safe allowlists.
7. Side-effecting operations must be designed for retries and idempotency.
8. API contracts must be covered by feature tests and documentation.
9. Authentication strategy must be explicit per route group: Sanctum, JWT, Passport, session, or external provider.

## Laravel 13 API Routing Reminder

Laravel 13 API routing can be enabled with `php artisan install:api`. Under the documented default setup, routes in `routes/api.php` are stateless, assigned to the `api` middleware group, and automatically receive the `/api` URI prefix. Do not add another `api` prefix inside `routes/api.php` unless `bootstrap/app.php` has intentionally customized routing.

## Recommended Route Shape

```php
// routes/api.php
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:api'])
    ->group(function () {
        Route::apiResource('products', ProductController::class);
        Route::post('orders/{order}/cancellation', [OrderCancellationController::class, 'store']);
    });
```

With Laravel's default API prefix, this produces `/api/v1/products`.

For JWT route groups, use the project-approved JWT guard and keep the route group clearly separated from Sanctum/session route groups unless the project explicitly supports multiple guards.

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

## Authentication Contract

For JWT APIs, document these before implementation:

- Guard and provider.
- Access credential lifetime.
- Refresh strategy and refresh lifetime.
- Logout / invalidation behavior.
- Claims strategy and stale-permission risk.
- Error mapping for expired, invalid, missing, and revoked credentials.
- Feature tests for login, refresh, logout, authenticated user lookup, and unauthorized / forbidden cases.

## Response Contract

Prefer one explicit project-wide contract. A common default is:

```json
{
  "data": {},
  "meta": {},
  "links": {}
}
```

For paginated resource responses, Laravel includes pagination `meta` and `links` data. If the project follows the JSON:API specification, prefer Laravel 13 JSON:API Resources instead of inventing a custom JSON:API-like shape.

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

Do not expose exception class names, stack traces, SQL errors, credential values, token values, auth headers, or internal service details in production responses.

## Rule Files

- `rules/laravel-docs-grounding.md`
- `rules/api-route-installation.md`
- `rules/route-design.md`
- `rules/request-validation.md`
- `rules/api-resource-response.md`
- `rules/error-envelope.md`
- `rules/auth-authorization.md`
- `rules/jwt-token-lifecycle.md`
- `rules/pagination-filtering-sorting.md`
- `rules/idempotency-and-side-effects.md`
- `rules/rate-limiting.md`
- `rules/openapi-and-tests.md`

## Review Checklist

Before accepting API changes, verify:

- Context7 or Laravel 13 docs were checked for Laravel-specific behavior.
- Selected JWT package docs were checked when JWT behavior changes.
- Relevant `references/` guide was read when the task is more than a small edit.
- `routes/api.php` does not accidentally duplicate the `/api` prefix.
- Routes are versioned when needed.
- Endpoints use resource naming or explicit transition resources.
- Controllers do not contain large business workflows.
- Validation is in FormRequest classes.
- Policies/gates/middleware protect resources.
- JWT guard, lifetime, refresh, invalidation, and error mapping are explicit when JWT is used.
- Responses use resources/collections, not raw model dumps.
- Pagination/filter/sort parameters are documented and allowlisted.
- Side effects are idempotent or intentionally non-idempotent with justification.
- Errors are safe and consistent.
- Feature tests cover success, validation failure, authorization failure, not found, and important edge cases.
- OpenAPI docs or API docs are updated when the contract changes.
