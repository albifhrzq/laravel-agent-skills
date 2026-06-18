---
title: Apply API Rate Limiting by Risk and Consumer Type
impact: HIGH
impactDescription: Rate limiting protects login, write, search, and expensive endpoints from abuse.
tags: laravel, api, rate-limiting, throttle, abuse-prevention
---

# Apply API Rate Limiting by Risk and Consumer Type

## Rule

Use Laravel rate limiters deliberately. Do not rely on a single generic throttle for every endpoint when the API has login, search, upload, checkout, webhook, or admin flows.

## Prefer

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip().'|'.$request->input('email'));
});
```

```php
Route::post('auth/login', LoginController::class)->middleware('throttle:login');
Route::middleware(['auth:sanctum', 'throttle:api'])->group(...);
```

## Laravel Guidance

- Use stricter limits for login, password reset, OTP, email verification, checkout, upload, and expensive search.
- Use separate limits for authenticated and unauthenticated consumers.
- Consider per-role or per-plan limits for public APIs.
- Include useful rate-limit headers if the project exposes public API consumers.
- Return consistent `429` error envelopes.
- Do not rate-limit trusted provider webhooks only by IP unless provider IP ranges are stable and maintained.
- Combine rate limiting with validation, authorization, logging, and abuse monitoring.

## Acceptance Criteria

High-risk endpoints have explicit throttles, tests cover `429` behavior where practical, and the API returns a safe consistent rate-limit error response.
