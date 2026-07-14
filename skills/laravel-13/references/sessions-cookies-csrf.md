# Laravel 13 Sessions, Cookies, and CSRF

## Contents

- Configure session storage and cookie properties from project evidence.
- Regenerate and invalidate sessions at authentication boundaries.
- Protect browser state changes with Laravel 13 request-forgery middleware.
- Handle concurrent session writes with route-level session blocking.
- Keep webhooks, SPAs, and API authentication in their correct boundaries.

## Applies To

Use this reference for browser authentication, forms, cookies, flash data,
session-backed state, session drivers, CSRF tokens, `XSRF-TOKEN`, AJAX requests,
logout, concurrent requests, and webhook exclusions.

Read authentication together with this reference for login and logout.

Read Blade guidance for form directives and package guidance for Sanctum SPAs.

## Verified Laravel 13 Behavior

Laravel sessions provide state across otherwise stateless HTTP requests.

Laravel 13 documents `database` as the default session driver. The active
project configuration remains authoritative.

The database driver requires a sessions table. Laravel provides
`php artisan make:session-table` when one is absent.

Redis session storage requires a configured Redis client and connection.

Laravel regenerates session IDs in its starter-kit and Fortify authentication
flows. Manual authentication should call `regenerate()` after success.

`invalidate()` regenerates the session ID and removes session data.

Laravel's session cache scopes cache entries to one session and cleans them up
with that session.

Requests sharing a session execute concurrently by default. Concurrent writes
can lose session data.

Route `->block(...)` acquires a session lock when the configured cache driver
supports atomic locks.

Session blocking is unavailable with the `cookie` session driver.

Laravel 13 renamed its CSRF middleware to
`Illuminate\Foundation\Http\Middleware\PreventRequestForgery`.
`VerifyCsrfToken` and `ValidateCsrfToken` remain deprecated aliases.
[claim:L13-CSRF]

`PreventRequestForgery` is included in the `web` middleware group.

It first checks the browser's `Sec-Fetch-Site` header. A same-origin request is
accepted without token validation.

When origin verification is unavailable or does not pass, Laravel falls back to
traditional session-token validation by default.

CSRF tokens change when the session is regenerated.

CSRF middleware is automatically disabled while running Laravel tests.

## Correct Pattern

Include a CSRF token in every browser form that changes state:

```php illustrative
// Equivalent Blade form:
// <form method="POST" action="/profile">
//     @csrf
//     @method('PATCH')
// </form>

Route::patch('/profile', UpdateProfileController::class)
    ->middleware('auth');
```

In actual Blade, use the framework directives:

```blade
<form method="POST" action="{{ route('profile.update') }}">
    @csrf
    @method('PATCH')

    <button type="submit">Save</button>
</form>
```

Regenerate after manual login:

```php runnable
if (Auth::attempt($credentials)) {
    $request->session()->regenerate();

    return redirect()->intended('dashboard');
}
```

Invalidate the session and renew the CSRF token at logout:

```php illustrative
Auth::logout();

$request->session()->invalidate();
$request->session()->regenerateToken();

return redirect('/');
```

Use session blocking only on endpoints that can concurrently overwrite session
state:

```php illustrative
Route::post('/checkout/step', SaveCheckoutStepController::class)
    ->block(lockSeconds: 10, waitSeconds: 10);
```

Configure cookies through `config/session.php` and environment-backed config.
Review `secure`, `http_only`, `same_site`, domain, path, lifetime, and encryption
against the deployment topology.

Keep state-changing endpoints on non-GET methods.

Prefer placing third-party webhooks outside the `web` middleware group. If an
exclusion is necessary, configure it narrowly:

```php illustrative
use Illuminate\Foundation\Configuration\Middleware;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->preventRequestForgery(except: [
        'webhooks/stripe',
    ]);
})
```

Pair every CSRF-exempt webhook with signature verification, replay controls,
authorization, validation, and rate controls appropriate to the provider.

For legacy AJAX, Laravel accepts `X-CSRF-TOKEN`.

Laravel also provides an encrypted `XSRF-TOKEN` cookie for clients that set the
`X-XSRF-TOKEN` header on same-origin requests.

## Incorrect Pattern

```php illustrative
->withMiddleware(function (Middleware $middleware): void {
    $middleware->preventRequestForgery(except: ['*']);
})
```

Do not disable request-forgery protection globally to make a browser form pass.

Do not use deprecated `VerifyCsrfToken` in new Laravel 13 middleware exclusions
or test references.

Do not use GET for logout, deletion, payment, preference changes, or any other
state mutation.

Do not treat a CSRF exemption as webhook authentication.

Do not log session IDs, CSRF tokens, authentication cookies, or full cookie
headers.

Do not set `originOnly: true` as a generic hardening toggle.

Do not enable `allowSameSite: true` without an explicit cross-subdomain trust
decision.

Do not store large permanent business objects in the session.

Do not assume session locking works with the cookie driver.

Do not add Sanctum merely because a JavaScript client exists.

## Failure Modes

- A form omits `@csrf` and receives a 419 response.
- An old middleware class is excluded in tests while Laravel 13 executes the new
  class.
- A manual login keeps the pre-authentication session ID.
- Logout removes the guard but keeps session data or the old CSRF token.
- Two concurrent requests overwrite each other's session writes.
- A session lock waits or times out because an endpoint holds it during slow I/O.
- The database session driver is configured without a sessions table.
- Cookie domain or SameSite settings prevent authentication across subdomains.
- A secure cookie is not sent in a non-HTTPS local environment.
- A proxy or incorrect trusted-host configuration changes perceived origin.
- An `originOnly` deployment fails for non-HTTPS or older clients.
- A webhook is CSRF-exempt but accepts forged requests.
- Tests pass because Laravel disables CSRF middleware automatically.

Diagnose middleware group, cookie attributes, session driver, cache driver,
proxy/HTTPS behavior, request headers, and the exact route before changing
security controls.

## Trade-offs

Database sessions are operationally visible and shared across nodes but add
database traffic.

Redis sessions are fast and shared but add infrastructure and eviction
considerations.

Cookie sessions avoid server-side storage but cannot use session blocking and
increase cookie payload.

Session locking prevents lost writes but serializes requests and can increase
latency.

Origin verification improves modern-browser protection; token fallback supports
older, insecure-development, and non-browser conditions.

Same-site allowance supports trusted subdomains but broadens the accepted
origin relationship.

## Version and Package Boundaries

`PreventRequestForgery` and its origin-aware behavior are Laravel 13 behavior.

Older middleware names are deprecated aliases in Laravel 13 and may be primary
names in older framework versions.

The `Sec-Fetch-Site` header is available only from supporting browsers and is
sent over secure connections.

Sanctum defines the CSRF and authentication flow for first-party SPAs. Load its
version-specific documentation only when installed or explicitly requested.

Session cache and driver capabilities depend on the installed framework,
configured cache store, and infrastructure.

Cookie behavior depends on browser policy, HTTPS termination, reverse proxies,
and domain topology.

## Testing

Test authenticated browser forms with session and CSRF middleware active.

Because Laravel disables CSRF middleware during tests, add a focused test that
explicitly runs the middleware when request-forgery behavior itself matters.

Test manual login for session regeneration.

Test logout for invalidated protected access and renewed session state.

Test flash data for one subsequent request.

Test concurrent session writes or the selected `block(...)` behavior when the
workflow depends on it.

Test cookie attributes in a browser or HTTP-level environment matching HTTPS and
proxy configuration.

Test webhook signature failure, stale timestamp, replay, malformed payload, and
successful verification independently from CSRF.

Test an invalid or missing token path and assert the project's expected 419
response.

## Grounding

- Sessions:
  https://laravel.com/docs/13.x/session
- CSRF and origin verification:
  https://laravel.com/docs/13.x/csrf
- Authentication session regeneration and logout:
  https://laravel.com/docs/13.x/authentication
- Middleware configuration:
  https://laravel.com/docs/13.x/middleware
- Laravel 13 upgrade impact:
  https://laravel.com/docs/13.x/upgrade
- Pinned `PreventRequestForgery` source:
  https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Foundation/Http/Middleware/PreventRequestForgery.php

Framework behavior is `official`. Webhook verification policy, cross-subdomain
trust, and session storage selection are `project-convention` or
`derived-security` decisions.
