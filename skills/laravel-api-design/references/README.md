# Laravel API Design References

Detailed Laravel 13 API guides for agents. These files complement the short rule files in `rules/`.

Use this folder when the task needs more than a checklist: implementation patterns, examples, trade-offs, edge cases, and review guidance.

## Reference Guides

| Topic | File | When to Use |
|---|---|---|
| API Routing | `laravel-13-api-routing-guide.md` | API route setup, `/api` prefix, versioning, `Route::apiResource`, nested resources, route model binding. |
| FormRequest Validation | `laravel-13-form-request-validation-guide.md` | Validation rules, `authorize()`, `validated()`, `safe()`, input normalization, filter validation. |
| API Resources | `laravel-13-api-resource-guide.md` | `JsonResource`, `ResourceCollection`, conditional fields, `whenLoaded`, pagination metadata, JSON:API decision points. |
| Auth & Authorization | `laravel-13-auth-authorization-guide.md` | Guards, middleware, policies, gates, role/tenant checks, Sanctum abilities, forbidden vs unauthenticated behavior. |
| JWT Auth | `laravel-13-jwt-auth-guide.md` | JWT package selection, guard boundaries, lifetime, refresh, invalidation, claims, error mapping, and tests. |
| Error Handling | `laravel-13-error-handling-guide.md` | `withExceptions`, JSON error rendering, status code mapping, error envelopes, request IDs. |
| Pagination & Filtering | `laravel-13-pagination-filtering-guide.md` | `paginate`, `simplePaginate`, `cursorPaginate`, filter/sort allowlists, index awareness. |
| Rate Limiting | `laravel-13-rate-limiting-guide.md` | `RateLimiter::for`, `throttle:*`, auth-sensitive limits, 429 error responses. |
| Idempotency & Webhooks | `laravel-13-idempotency-webhook-guide.md` | Retry-safe writes, idempotency keys, duplicate handling, webhook events, queue side effects. |
| API Testing | `laravel-13-api-testing-guide.md` | JSON test helpers, success/failure matrix, auth tests, resource tests, idempotency tests. |
| OpenAPI Documentation | `laravel-13-openapi-documentation-guide.md` | API docs, request/response examples, auth docs, error code docs, versioning/deprecation notes. |
| Production Checklist | `laravel-13-production-checklist.md` | Final review checklist before API work is treated as production-ready. |

## Maintenance Rule

Before updating a guide, check Context7 Laravel 13 documentation when available. For JWT-specific behavior, also check the selected JWT package or identity-provider documentation.
