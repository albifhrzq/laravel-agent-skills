# Laravel 13 Rate Limiting Guide

Guide for applying Laravel rate limiting to API endpoints based on risk and consumer type.

## When to Use

Use this guide when creating or reviewing:

- `RateLimiter::for()` definitions
- `throttle:*` middleware
- login limits
- refresh limits
- search limits
- write endpoint limits
- public API limits
- rate-limit error response shape

## Core Rule

Do not use one generic rate limit for every endpoint when the API has very different risk profiles.

High-risk endpoints should have stricter limits than normal read endpoints.

## Laravel RateLimiter

Define named limiters with `RateLimiter::for()`.

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
```

Attach with middleware:

```php
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    // API routes
});
```

## Endpoint Risk Levels

Suggested categories:

```text
low risk     = normal authenticated reads
medium risk  = search, exports, listing with expensive filters
high risk    = login, refresh, password reset, uploads, checkout, state transitions
critical     = admin actions, financial/order-critical actions, public write endpoints
```

## Auth-Sensitive Endpoints

Use separate limiters for:

- login
- refresh
- password reset
- email/phone verification
- resend verification
- invitation acceptance

Example:

```php
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip().'|'.strtolower((string) $request->input('email')));
});
```

## User vs IP Keys

Common limiter keys:

```text
authenticated user ID
IP address
user ID + route name
IP + submitted identifier for login
tenant/shop ID + route group
API consumer ID
```

Pick keys based on abuse scenario.

## Custom 429 Response

Return the project error envelope for rate limits.

```php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)
        ->by($request->user()?->id ?: $request->ip())
        ->response(function (Request $request, array $headers) {
            return response()->json([
                'error' => [
                    'code' => 'RATE_LIMITED',
                    'message' => 'Too many requests.',
                ],
            ], 429, $headers);
        });
});
```

## Public APIs

For public or partner APIs, document:

- limit window
- quota unit
- response headers
- burst behavior
- per-key or per-consumer limits
- what clients should do on 429

## Testing Checklist

Test:

- protected route uses expected limiter
- excessive requests return 429
- response uses project error envelope
- login or refresh has stricter limiter than normal API routes
- authenticated and unauthenticated limiter keys behave correctly when practical

## Review Checklist

Before accepting rate limit changes, verify:

- high-risk endpoints have explicit limiters
- limiter key is appropriate
- 429 response shape is consistent
- auth-sensitive endpoints are stricter
- public API limits are documented
- tests cover important rate-limited flows
