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

## Maintenance Rule

Before updating a guide, check Context7 Laravel 13 documentation when available. For JWT-specific behavior, also check the selected JWT package or identity-provider documentation.
