# Laravel 13 API Production Checklist

Checklist for reviewing Laravel 13 API changes before they are treated as production-ready.

## Scope

Use this checklist when reviewing major API work, auth changes, public endpoints, marketplace/seller flows, order flows, external integrations, or deployment-impacting changes.

## Documentation Grounding

- Context7 Laravel 13 docs were checked when framework behavior matters.
- Official Laravel docs were checked when Context7 is unavailable.
- Selected JWT or identity provider docs were checked when JWT behavior changes.
- Project-level `AGENTS.md` was respected.

## Routing

- `routes/api.php` does not duplicate the `/api` prefix.
- Public or long-lived APIs are versioned intentionally.
- Routes use resource names, not controller method names.
- `Route::apiResource()` is used for standard CRUD endpoints.
- State transitions use explicit endpoints.
- Nested routes are shallow unless deeper nesting is justified.
- Route model binding is paired with policy/gate checks.
- Scoped binding or ownership checks protect nested resources.
- `php artisan route:list --path=api` matches the intended contract.

## Controllers and Business Logic

- Controllers are thin.
- Business workflows are in actions, services, jobs, domain classes, or model methods where appropriate.
- Controllers use typed FormRequest classes for non-trivial requests.
- Controllers return Resources or documented response objects.

## Validation

- FormRequest classes validate create/update/filter/sort/auth-sensitive requests.
- Controllers use `validated()` or `safe()` data.
- Partial updates do not overwrite omitted fields.
- Array and string inputs have bounds.
- Filters and sorts are allowlisted.
- Validation failures use the project error envelope.

## Responses

- JsonResource, ResourceCollection, or JSON:API Resources are used intentionally.
- Response fields are stable and documented.
- Relationship fields use `whenLoaded()`.
- Aggregate fields use preloaded aggregate helpers.
- Paginated responses preserve `meta` and `links`.
- Internal-only fields are not exposed accidentally.

## Auth and Authorization

- Auth strategy is explicit per route group.
- Sanctum, JWT, Passport, session, or external provider usage is not mixed accidentally.
- Policies/gates protect resource actions.
- Tenant/shop/account ownership is checked.
- 401 and 403 behavior is consistent.
- Auth-sensitive endpoints are rate-limited.

## JWT

- Selected JWT package or provider is documented.
- Guard and provider are clear.
- Credential lifetime is defined.
- Refresh behavior is defined.
- Logout/invalidation behavior is defined.
- Claims strategy is documented.
- Expired, invalid, missing, and revoked credential errors are mapped.
- JWT lifecycle has feature tests.

## Pagination, Filtering, Sorting

- Collection endpoints are paginated.
- Maximum `per_page` is enforced.
- Filters are allowlisted.
- Sorts are allowlisted.
- Default ordering is stable.
- Index impact is considered for large tables.
- Cursor pagination is considered for large feeds.

## Rate Limiting

- Normal API routes have a reasonable limiter.
- Login/refresh/reset/verification endpoints have stricter limiters.
- Expensive search/export endpoints have appropriate limits.
- 429 responses use the project error envelope.
- Public API rate limits are documented.

## Idempotency and Webhooks

- Retry-sensitive operations define idempotency behavior.
- Duplicate requests are handled safely.
- Conflict behavior is defined.
- Webhook events are verified according to provider rules.
- Webhook provider event IDs are deduplicated when available.
- Heavy webhook work is queued.
- Queue jobs are retry-safe.

## Error Handling

- API requests render JSON errors.
- Known domain exceptions map to stable error codes.
- Validation errors include field details.
- Unexpected errors do not expose internals.
- Request ID or correlation ID is included when the project supports it.

## Testing

- Success path is tested.
- 401, 403, 404, 409, 422, and 429 paths are tested where relevant.
- Resource JSON paths are asserted.
- Internal-only fields are not exposed in tests.
- Pagination metadata is tested.
- JWT lifecycle is tested when JWT changes.
- Idempotency/webhook behavior is tested when side effects change.

## Documentation

- OpenAPI or API docs are updated for contract changes.
- Auth requirements are documented.
- Request and response examples match implementation.
- Error codes are documented.
- Pagination/filter/sort behavior is documented.
- Deprecation or versioning notes are included when needed.

## Deployment Impact

- Config/env changes are documented.
- Queue, cache, storage, or scheduler changes are documented.
- Database migration rollback risk is considered.
- Index changes are included for new heavy filters/sorts.
- Backward compatibility is considered for existing clients.
