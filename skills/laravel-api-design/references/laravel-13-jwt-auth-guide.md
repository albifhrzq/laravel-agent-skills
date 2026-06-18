# Laravel 13 JWT Auth Guide

Guide for designing JWT authentication in Laravel 13 APIs.

## When to Use

Use this guide when creating or reviewing:

- JWT login endpoints
- authenticated user endpoints
- refresh flows
- logout or invalidation behavior
- JWT guard configuration
- custom JWT claims
- external JWT provider validation
- JWT error mapping
- JWT feature tests

## Core Rule

Do not add JWT authentication by only creating a login endpoint. Define the full lifecycle:

- selected package or provider
- guard and provider
- credential lifetime
- refresh behavior
- invalidation behavior
- error responses
- tests

## Package Choices

Common approaches:

```text
tymon/jwt-auth or maintained forks = Laravel guard-oriented JWT auth
lcobucci/jwt = lower-level JWT creation and validation primitives
external provider = validate JWTs from another identity system
```

Do not mix JWT libraries without a migration plan.

## Guard Boundary

A JWT API should have a clear guard boundary.

Example route group:

```php
Route::prefix('v1')
    ->middleware(['auth:api', 'throttle:api'])
    ->group(function () {
        Route::get('me', [AuthenticatedUserController::class, 'show']);
    });
```

The meaning of `auth:api` depends on `config/auth.php`. Confirm the project guard driver before editing routes.

## Auth Endpoints

Typical JWT API endpoints:

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Keep naming consistent with the project route style.

## Login Response Contract

Define one response shape and keep it stable.

Example shape:

```json
{
  "data": {
    "access_token": "...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

Do not expose extra internal auth details that clients do not need.

## Refresh Strategy

Document refresh behavior before implementation:

- Can expired credentials be refreshed?
- Is there a refresh window?
- Does refresh rotate the credential?
- Does refresh invalidate the previous credential?
- What status code is returned when refresh fails?

## Logout / Invalidation

Define what logout means:

```text
current credential only
all user sessions
all credentials for the current device
all credentials for the account
```

The chosen behavior must be documented and tested.

## Claims Strategy

Keep claims minimal and stable.

Common claim decisions:

- subject
- issuer
- audience
- issued-at
- expiry
- not-before
- unique identifier
- role/capability snapshot, only when the stale-data risk is understood

Do not rely only on role claims for critical authorization. Use policies/gates and database-backed checks when permissions can change.

## Error Mapping

Map JWT failures into the project error envelope.

Recommended machine-readable codes:

```text
AUTH_REQUIRED
TOKEN_EXPIRED
TOKEN_INVALID
TOKEN_REVOKED
FORBIDDEN
```

Keep messages safe and avoid leaking implementation details.

## Rate Limiting

Rate-limit auth-sensitive endpoints separately:

- login
- refresh
- password reset
- verification
- resend code/email

Use stricter limits than normal API read endpoints.

## Testing Matrix

JWT feature tests should cover:

- login success
- login failure
- authenticated user lookup
- missing credential
- invalid credential
- expired credential
- revoked or invalidated credential
- refresh success
- refresh failure
- logout behavior
- authenticated but forbidden action

## Review Checklist

Before accepting JWT changes, verify:

- selected JWT package or provider is documented
- guard configuration is clear
- lifetime and refresh behavior are explicit
- logout/invalidation behavior is explicit
- JWT errors use the project error envelope
- policies/gates still protect resources
- auth-sensitive endpoints are rate-limited
- tests cover the lifecycle, not only login
