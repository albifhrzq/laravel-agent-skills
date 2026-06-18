# Laravel API Design Rule Sections

Rules should be read in this order:

1. `laravel-docs-grounding.md` - source-of-truth and Context7/official-docs lookup rule.
2. `api-route-installation.md` - Laravel 13 API routing defaults and `install:api` guidance.
3. `route-design.md` - resource-oriented route design and state-transition endpoints.
4. `request-validation.md` - FormRequest validation and request authorization.
5. `api-resource-response.md` - JsonResource and ResourceCollection response contracts.
6. `error-envelope.md` - safe and consistent API errors.
7. `auth-authorization.md` - authentication, policies, guards, and tenant/shop checks.
8. `pagination-filtering-sorting.md` - bounded and allowlisted collection queries.
9. `idempotency-and-side-effects.md` - retry-safe side-effecting operations.
10. `rate-limiting.md` - Laravel rate limiters by endpoint risk.
11. `openapi-and-tests.md` - API documentation and feature test expectations.
