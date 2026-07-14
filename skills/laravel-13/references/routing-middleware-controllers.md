# Laravel 13 Routing, Middleware, and Controllers

## Contents

- Trace a request from route registration through middleware and controller.
- Register routes and middleware in the Laravel 13 application structure.
- Use route model binding and controller authorization safely.
- Apply Laravel 13 controller attributes only when version evidence permits.
- Preserve route contracts, ordering, names, and cache compatibility.

## Applies To

Use this reference for `routes/*.php`, `bootstrap/app.php`, controllers,
middleware, route groups, route model binding, signed URLs, subdomains, and
request-lifecycle tracing.

Read adjacent authentication, validation, session, or API references whenever
the route crosses those boundaries.

Inspect registered routes before adding a new endpoint:

```shell
php artisan route:list
```

Run the command only when dependencies are installed and the project can boot
safely.

## Verified Laravel 13 Behavior

The pinned Laravel 13 skeleton registers `routes/web.php`, console routes, and a
health endpoint from `bootstrap/app.php`.

A fresh skeleton does not establish that `routes/api.php` exists. API routing
may be added by project code or an installation command and can involve optional
packages.

Routes in `web.php` receive the `web` middleware group, including cookies,
session startup, shared validation errors, and request-forgery protection.

Middleware aliases, groups, priority, prepend, append, replace, and exclusions
are configured through the middleware callback in `bootstrap/app.php`.

Laravel supports implicit and explicit route model binding.

Scoped bindings can constrain a nested model to its parent relation.

Laravel 13 prioritizes routes with an explicit domain before routes without a
domain. This differs from earlier registration-precedence behavior.

Laravel 13 provides controller `#[Middleware]` and `#[Authorize]` attributes.

The Laravel 13 application skeleton's base
`App\Http\Controllers\Controller` is empty. It does not automatically expose
`$this->authorize()`. [claim:AUTHZ-DEFAULT]

`Gate::authorize(...)` is the default controller-safe authorization call.

The `AuthorizesRequests` trait still supplies `authorize` when a project
explicitly adds it to its controller hierarchy.

## Correct Pattern

Keep route declarations focused on transport concerns and delegate validated,
authorized work to an action or controller.

```php illustrative
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')
    ->name('posts.')
    ->group(function (): void {
        Route::patch('/posts/{post}', [PostController::class, 'update'])
            ->name('update');
    });
```

Authorize the bound resource explicitly:

```php runnable
namespace App\Http\Controllers;

use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

final class PostController extends Controller
{
    public function update(
        UpdatePostRequest $request,
        Post $post,
    ): RedirectResponse {
        Gate::authorize('update', $post);

        $post->update($request->validated());

        return to_route('posts.show', $post);
    }
}
```

When an attribute is clearer and Laravel 13 is proven:

```php illustrative
use App\Models\Post;
use Illuminate\Routing\Attributes\Controllers\Authorize;

#[Authorize('update', 'post')]
public function update(Post $post)
{
    // The request reaches this body only after authorization.
}
```

Use an explicit middleware class for reusable cross-cutting behavior.

Keep middleware ordering visible when order affects authentication, session,
bindings, localization, or throttling.

Name routes used by redirects, links, signed URLs, and frontend route helpers.

Use route model binding for identity lookup, then policies for action-level
authorization.

Use `scopeBindings()` or custom bindings when nested resources must belong to
their parent.

Return 404 for missing route-bound resources; do not leak whether an
unauthorized resource exists unless the project contract intentionally differs.

Place webhook endpoints outside the `web` middleware group when practical, then
apply the integration's signature verification and rate controls.

Keep route closures cache-safe or prefer controller actions in applications
that use route caching.

## Incorrect Pattern

```php illustrative
final class PostController extends Controller
{
    public function update(Request $request, Post $post)
    {
        // Invalid for the default Laravel 13 skeleton:
        $this->authorize('update', $post);

        $post->update($request->all());
    }
}
```

The example above assumes an authorization trait the skeleton does not provide,
skips a declared validation boundary, and passes untrusted input wholesale.

Do not protect only the navigation link while leaving the controller action
unauthorized.

Do not use GET routes for state changes.

Do not trust a route parameter merely because implicit binding produced a
model.

Do not define a broad dynamic route before understanding its effect on more
specific routes.

Do not assume registration order controls domain-route precedence in Laravel
13.

Do not exclude session, CSRF, bindings, or throttling middleware globally to fix
one route.

Do not introduce `routes/api.php`, Sanctum, or an SPA stack unless the project
already uses it or the user explicitly requests it.

## Failure Modes

- A route name change breaks redirects, emails, signed URLs, or frontend builds.
- A parameter rename breaks implicit binding or `#[Authorize]` argument lookup.
- A custom binding returns a model outside the authenticated tenant.
- Middleware order causes bindings to run before tenant context is established.
- An API endpoint is accidentally placed in `web.php` and gains session/CSRF
  semantics the client cannot satisfy.
- A browser endpoint is placed outside `web` and loses session or CSRF
  protection.
- A route cache build fails because registration depends on runtime state.
- Catch-all and fallback routes shadow intended endpoints.
- Domain routes match differently after upgrading to Laravel 13.
- Controller attributes are copied into an older framework.
- A middleware exclusion in tests hides the production behavior under review.

Trace `route:list` output, the application builder, middleware groups, model
binding, policy, controller, response, and side effects before diagnosing only
the controller body.

## Trade-offs

Controller attributes colocate behavior but require Laravel 13 and can make
route-level policy less visible.

Route middleware is explicit in route definitions; controller attributes travel
with the controller.

Implicit binding is concise; explicit binding offers tighter lookup control.

Nested scoped binding prevents cross-parent lookup but may require conventional
relationship names or custom keys.

Resource controllers provide predictable routes but can expose unused actions
unless constrained.

Route closures are convenient for small endpoints; controller actions are
easier to reuse, cache, authorize, and test at scale.

## Version and Package Boundaries

`#[Middleware]` and `#[Authorize]` in this reference are Laravel 13 APIs.

Older Laravel projects should use the syntax documented for their installed
version.

Sanctum, Passport, Fortify, Folio, Precognition, Reverb, and third-party route
packages have separate route and middleware contracts.

Laravel's starter kits add routes and packages beyond the base skeleton.

Route-domain precedence changed in Laravel 13 and deserves an upgrade regression
test.

## Testing

Write feature tests for success, unauthenticated, unauthorized, invalid input,
missing model, and cross-parent or cross-tenant lookup.

Assert route names and HTTP methods used by public consumers.

Test middleware rather than disabling it when middleware behavior is the task.

Add an upgrade regression test for domain and non-domain routes that could both
match.

Verify route caching in deployment-oriented projects:

```shell
php artisan route:cache
php artisan route:list
```

Clear the cache after a disposable local verification if the project workflow
does not retain generated caches.

Test signed routes for valid, expired, and modified signatures.

Use policy fakes sparingly; at least one integration test should exercise the
real gate or policy wiring.

## Grounding

- Routing:
  https://laravel.com/docs/13.x/routing
- Middleware:
  https://laravel.com/docs/13.x/middleware
- Controllers:
  https://laravel.com/docs/13.x/controllers
- Authorization:
  https://laravel.com/docs/13.x/authorization
- Laravel 13 upgrade route behavior:
  https://laravel.com/docs/13.x/upgrade
- Empty base controller in the pinned skeleton:
  https://github.com/laravel/laravel/blob/43f3606336468af53f85aa6c993ce72041c63a61/app/Http/Controllers/Controller.php
- Authorization trait in the pinned framework:
  https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Foundation/Auth/Access/AuthorizesRequests.php

Framework facts are `official`; route naming and layering recommendations are
`project-convention` unless required by an explicit public contract.
