# Laravel 13 Authentication and Authorization

## Contents

- Separate identity authentication from action authorization.
- Use guards, providers, starter kits, and packages only when detected.
- Authorize every protected action against its concrete resource.
- Handle login, logout, password, and session transitions securely.
- Correct the default Laravel 13 controller authorization assumption.

## Applies To

Use this reference for guards, providers, `Auth`, gates, policies, controller
authorization attributes, login, logout, password reset, email verification,
password confirmation, and protected routes.

Read the session and CSRF reference for browser authentication.

Read the package router before using Fortify, Sanctum, Passport, Socialite, or a
starter kit.

## Verified Laravel 13 Behavior

Authentication identifies the current user through a configured guard and user
provider.

Authorization decides whether that user may perform a particular action.

Laravel supplies gates and policies for authorization.

`Gate::authorize(...)` throws an authorization exception when denied, which
Laravel converts to an HTTP 403 response.

Laravel 13 supplies the controller
`Illuminate\Routing\Attributes\Controllers\Authorize` attribute.

The default Laravel 13 application controller is empty. Calling
`$this->authorize(...)` without explicitly adding `AuthorizesRequests` will
fail. [claim:AUTHZ-DEFAULT]

The framework still provides
`Illuminate\Foundation\Auth\Access\AuthorizesRequests` for projects that choose
to use the trait.

Laravel can automatically discover policies that follow documented naming and
location conventions; projects can also register mappings explicitly.

After a successful manual `Auth::attempt(...)`, the session should be
regenerated to prevent session fixation.

An application logout flow logs out the guard, invalidates the session, and
regenerates the CSRF token.

Passwords passed to `Auth::attempt(...)` are plain incoming credentials; the
guard compares them with the stored hash.

Starter kits use Fortify for authentication features, but starter kits and
Fortify are not required by Laravel core.

## Correct Pattern

Protect the route and authorize the resource:

```php runnable
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

final class PublishPostController extends Controller
{
    public function __invoke(Post $post): RedirectResponse
    {
        Gate::authorize('publish', $post);

        $post->publish();

        return to_route('posts.show', $post);
    }
}
```

Define policy methods around business actions:

```php illustrative
namespace App\Policies;

use App\Models\Post;
use App\Models\User;

final class PostPolicy
{
    public function publish(User $user, Post $post): bool
    {
        return $user->id === $post->author_id
            && $post->published_at === null;
    }
}
```

Laravel 13 controller attributes are an alternative:

```php illustrative
use App\Models\Post;
use Illuminate\Routing\Attributes\Controllers\Authorize;

#[Authorize('publish', 'post')]
public function __invoke(Post $post): RedirectResponse
{
    $post->publish();

    return to_route('posts.show', $post);
}
```

For manual session authentication:

```php illustrative
if (Auth::attempt($credentials)) {
    $request->session()->regenerate();

    return redirect()->intended('dashboard');
}
```

For logout:

```php illustrative
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();

return redirect('/');
```

Use `Hash::make` for stored application passwords and `Hash::check` when a
manual comparison is genuinely required.

Apply authentication middleware for identity, then authorize the specific
resource in a policy, gate, middleware, or Laravel 13 authorization attribute.

Use password confirmation for especially sensitive account operations when the
project's authentication design supports it.

Preserve generic login failure messages to avoid turning authentication into an
account-enumeration oracle.

## Incorrect Pattern

```php illustrative
public function destroy(Post $post): RedirectResponse
{
    // The default Laravel 13 base controller does not define this method.
    $this->authorize('delete', $post);

    $post->delete();

    return back();
}
```

The authorization call becomes valid only when the project explicitly uses the
`AuthorizesRequests` trait.

Do not treat `auth` middleware as resource authorization.

Do not trust a user or role ID submitted by the client.

Do not authorize only the UI button.

Do not place authorization solely inside validation rules or model fillable
configuration.

Do not store plain passwords or encrypt passwords reversibly.

Do not log credentials, password reset tokens, session IDs, personal access
tokens, or authorization headers.

Do not add Sanctum, Passport, Socialite, Fortify, or a starter kit merely because
an authentication task exists.

Do not mix guards implicitly; identify which guard supplies the actor.

## Failure Modes

- A controller uses `$this->authorize` but its base class is the empty skeleton.
- A policy exists but is not discovered or registered.
- A policy receives the wrong model because a route parameter name changed.
- An admin bypass in `before` returns the wrong value and blocks later checks.
- A list endpoint filters records but a detail endpoint omits authorization.
- Login succeeds without session regeneration.
- Logout clears the guard but retains the old session and CSRF token.
- A password reset or verification URL is logged or exposed.
- A test authenticates with a guard different from production middleware.
- SPA cookie authentication is implemented without the matching Sanctum flow.
- Token scopes are mistaken for complete domain authorization.
- A long-lived worker retains an authenticated or tenant context.

Trace the guard, provider, middleware, route binding, gate/policy, session, and
response together.

## Trade-offs

Gates are concise for actions not centered on one model.

Policies group model-centered abilities and improve discoverability.

Controller attributes are expressive in Laravel 13 but couple controllers to
version-specific syntax.

The `AuthorizesRequests` trait supports familiar controller calls, while
`Gate::authorize` works with the default skeleton and exposes the dependency.

Session authentication is convenient for first-party browser applications.

Personal access tokens and OAuth solve different client and delegation needs;
choose only from the actual threat model and installed packages.

Starter kits accelerate common flows but introduce a specific UI and package
architecture.

## Version and Package Boundaries

`#[Authorize]` is Laravel 13 syntax.

The empty application controller is verified against the pinned Laravel 13
skeleton; a project may intentionally customize it.

Fortify is headless authentication backend behavior.

Sanctum supports SPA cookie authentication and personal access tokens.

Passport supplies OAuth2 behavior.

Socialite supplies third-party OAuth login integrations.

Starter kits currently add Fortify and one selected frontend stack; load their
exact docs only when detected or explicitly requested.

Package version evidence comes from `composer.lock`, not the framework major.

## Testing

Test guests, authenticated non-owners, owners, privileged roles, missing
resources, and tenant boundaries.

Use the real policy wiring in feature tests.

Test login success regenerates the session and failure preserves a generic
message.

Test logout invalidates access to protected routes.

Test password reset and verification links for valid, invalid, altered, and
expired signatures or tokens.

Test rate limits for login, password reset, verification resend, and other
sensitive endpoints.

Assert a denied action does not write to the database or dispatch side effects:

```php illustrative
$this->actingAs($otherUser)
    ->delete("/posts/{$post->id}")
    ->assertForbidden();

$this->assertDatabaseHas('posts', ['id' => $post->id]);
```

Run package-specific tests only when the corresponding authentication package
is installed.

## Grounding

- Authentication:
  https://laravel.com/docs/13.x/authentication
- Authorization:
  https://laravel.com/docs/13.x/authorization
- Password hashing:
  https://laravel.com/docs/13.x/hashing
- Password reset:
  https://laravel.com/docs/13.x/passwords
- Email verification:
  https://laravel.com/docs/13.x/verification
- Empty base controller:
  https://github.com/laravel/laravel/blob/43f3606336468af53f85aa6c993ce72041c63a61/app/Http/Controllers/Controller.php
- `AuthorizesRequests` trait:
  https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Foundation/Auth/Access/AuthorizesRequests.php

Framework authentication and authorization behavior is `official`. Role names,
permission models, and admin bypass rules are `project-convention`.
