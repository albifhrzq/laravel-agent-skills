# Laravel 13 Compiled Agent Guide

<!-- GENERATED FILE: run npm run build:agents; do not edit directly. -->

<!-- BEGIN: SKILL.md -->
---
name: laravel-13
description: Use when any task involves Laravel, composer, artisan, route, controller, session, CSRF, Blade, Vite, Eloquent, migration, queue, test, deployment, traceback, configuration, security, API, database, UI, package, or production behavior; provides a Laravel 13 source-grounded router for implementation, debugging, tracing, review, and operations.
---

# Laravel 13

Use this skill as the default engineering knowledge base for every Laravel task. It is a router, not a replacement for inspecting the target repository.

## Core contract

1. Resolve the installed Laravel version before choosing framework APIs.
2. Read project instructions, code, configuration, and tests before applying defaults.
3. Load only the references selected by the routing table.
4. Verify exact syntax against version-matched official sources when uncertainty remains.
5. Finish every Laravel answer with a compact grounding line.

Do not infer that a project uses Laravel 13 merely because this skill was selected.

## Version resolution

Resolve in this order:

1. `composer.lock`: inspect the installed `laravel/framework` version.
2. `composer.json`: inspect its constraint only when the lock is absent or incomplete.
3. `php artisan --version` or installed framework source when commands are safe to run.
4. The user's explicit version for greenfield work.

If the detected version is not Laravel 13, report a version mismatch and stop applying Laravel 13-only APIs. Use documentation for the detected version or ask for direction when the intended upgrade is unclear. Read [references/version-grounding.md](references/version-grounding.md) for the full decision process.

## Precedence

Project convention wins when it is explicit, internally consistent, tested, secure, and compatible with the installed version. Project code, configuration, tests, and `AGENTS.md` come first; this skill supplies defaults where the project is silent.

An explicit user request may change a valid project convention or introduce an optional UI/package stack. It does not make a correctness, security, or version incompatibility defect safe. Report those conflicts before proceeding.

Read [rules/project-precedence.md](rules/project-precedence.md) and [rules/source-and-version.md](rules/source-and-version.md).

## Source lookup order

Use this order for exact Laravel behavior:

1. Installed framework source, application code, configuration, and tests.
2. The pinned official docs, framework, and skeleton in [source-lock.json](source-lock.json).
3. Relevant reference files in this skill.
4. Laravel Boost `search-docs` when Boost is installed and available.
5. Context7 library `/laravel/docs/__branch__13.x`.
6. Live [official Laravel documentation](https://laravel.com/docs/13.x) as a freshness check.

Package behavior must be checked against the installed package version and its primary documentation. Never silently generalize a package API into Laravel core.

## Routing workflow

1. Read [routing-map.json](routing-map.json) or use the table below.
2. Read every selected reference completely before changing code.
3. Add adjacent references when the execution path crosses domains.
4. Use [coverage-map.json](coverage-map.json) to locate less common official topics.

| Concern | Required references |
|---|---|
| Version, upgrade, structure, container, configuration | [version-grounding](references/version-grounding.md), [architecture and configuration](references/architecture-configuration.md) |
| Collection, LazyCollection, helpers, strings, contracts, Process facade | [collections, strings, processes](references/collections-strings-processes.md) |
| Route, middleware, controller, request lifecycle | [routing, middleware, controllers](references/routing-middleware-controllers.md) |
| FormRequest, validation, request, response | [requests, validation, responses](references/requests-validation-responses.md) |
| REST API, resource, JSON:API, error contract, pagination | [API resources and contracts](references/api-resources-errors-pagination.md) |
| Authentication, policy, gate, password, verification | [authentication and authorization](references/authentication-authorization.md) |
| Session, cookie, CSRF, browser form | [sessions, cookies, CSRF](references/sessions-cookies-csrf.md) |
| Encryption, hashing, rate limit, sensitive data | [security and rate limiting](references/security-rate-limiting-encryption.md) |
| Migration, schema, constraint, seed, factory | [migrations, schema, seeding](references/migrations-schema-seeding.md) |
| Model, relationship, cast, serialization | [Eloquent models and relationships](references/eloquent-models-relationships.md) |
| Query, index, N+1, pagination, database performance | [queries and performance](references/queries-performance.md) |
| Full-text search, vector similarity, embeddings, reranking | [search, vectors, reranking](references/search-vector-reranking.md) |
| Transaction, lock, concurrency, idempotency | [transactions and concurrency](references/transactions-concurrency-idempotency.md) |
| Cache, Redis, atomic lock | [cache, Redis, locks](references/cache-redis-locks.md) |
| Queue, job, retry, batch, chain | [queues and jobs](references/queues-jobs.md) |
| Event, listener, broadcast, console, schedule | [events, broadcasting, scheduling](references/events-broadcasting-scheduling.md) |
| File, upload, HTTP client, webhook | [filesystem, HTTP, webhooks](references/filesystem-http-webhooks.md) |
| Mail, notification, localization | [mail, notifications, localization](references/mail-notifications-localization.md) |
| Blade, view, component, slot, form, URL | [Blade, views, components](references/blade-views-components.md) |
| Frontend assets, Vite, starter kit | [frontend, Vite, starter kits](references/frontend-vite-starter-kits.md) |
| Unit, feature, HTTP, database, console, browser test | [testing and quality](references/testing-quality.md) |
| Exception, logging, context, observability | [errors, logging, observability](references/errors-logging-observability.md) |
| Deploy, config cache, worker, performance | [deployment and operations](references/deployment-operations.md) |
| Sanctum, Passport, Horizon, Octane, first-party package | [official packages](references/official-packages.md) |
| Boost, AI SDK, MCP, agentic development | [Boost, AI, MCP](references/boost-ai-mcp.md) |

## UI boundary

Blade, views, components, forms, URLs, Vite, and the starter-kit boundary are core coverage. Livewire, Inertia, Flux, React, Vue, Svelte, and Tailwind package-specific guidance is loaded only when the dependency is detected or the user explicitly requests it. When neither is true, remain with core Blade/Vite patterns and do not select a package on the user's behalf.

Read [rules/ui-package-boundary.md](rules/ui-package-boundary.md).

## Security and verification

Treat authentication, authorization, session, CSRF, uploads, mass assignment, SQL construction, serialization, secrets, webhooks, and rate limits as security boundaries. Read [rules/security-baseline.md](rules/security-baseline.md).

Before completion:

- run the smallest relevant test first, then the broader project suite;
- inspect migrations and side effects for rollback, retry, and deployment risk;
- verify framework/package syntax from primary sources when not proven locally;
- distinguish verified behavior, inference, and project convention;
- never claim a command passed without fresh output.

Read [rules/verification-and-grounding.md](rules/verification-and-grounding.md).

## Required answer footer

End every Laravel response with one line in this form:

```text
Laravel grounding: detected 13.19.0 from composer.lock; read references/sessions-cookies-csrf.md; verified against official Laravel 13.x docs.
```

Replace each field with the evidence actually used. If the version cannot be established, say `detected version unknown` and identify the missing evidence.
<!-- END: SKILL.md -->

<!-- BEGIN: rules/project-precedence.md -->
# Project Precedence

Follow project `AGENTS.md`, code, configuration, tests, response contracts, and established naming when they are valid and compatible. [claim:PROJECT-PRECEDENCE]

An explicit user request may authorize a change to those conventions. It cannot remove the obligation to disclose correctness, security, data-loss, or version-compatibility risks. [claim:SECURITY-OVERRIDE]

Label guidance as a Laravel default, package behavior, derived practice, or project convention instead of blending them.
<!-- END: rules/project-precedence.md -->

<!-- BEGIN: rules/security-baseline.md -->
# Security Baseline

Validate untrusted input at the boundary, authorize the specific action and resource, preserve CSRF protection for browser-session state changes, parameterize database access, constrain uploads, verify webhook authenticity, and avoid exposing secrets or sensitive model attributes.

Laravel 13 uses `PreventRequestForgery` as its request-forgery middleware; older CSRF middleware names are deprecated aliases. [claim:L13-CSRF]

The default Laravel 13 application controller does not provide `$this->authorize()` automatically. Prefer `Gate::authorize()`, controller authorization attributes, or explicitly add and document the required trait. [claim:AUTHZ-DEFAULT]
<!-- END: rules/security-baseline.md -->

<!-- BEGIN: rules/source-and-version.md -->
# Source and Version Resolution

Resolve the installed framework version before selecting framework APIs. `composer.lock` is stronger evidence than `composer.json`; runtime and installed source can confirm the result. [claim:VERSION-DETECT]

Use the project's installed source and tests first. Use `source-lock.json` for the reproducible Laravel 13 baseline, then Boost, Context7, or live official docs for freshness.

If the project is not on Laravel 13, report the mismatch and switch to version-matched evidence. Do not backport or upgrade implicitly.
<!-- END: rules/source-and-version.md -->

<!-- BEGIN: rules/ui-package-boundary.md -->
# UI Package Boundary

Treat Blade, views, components, forms, URLs, and Vite as core Laravel UI coverage.

Load or introduce Livewire, Inertia, Flux, React, Vue, Svelte, or Tailwind-specific patterns only when the dependency is detected in the project or explicitly requested by the user. [claim:EXPLICIT-UI]

Do not replace a working project stack merely because another stack is popular.
<!-- END: rules/ui-package-boundary.md -->

<!-- BEGIN: rules/verification-and-grounding.md -->
# Verification and Grounding

Run focused tests before broad suites. Review the final diff and verify every claim of success from fresh command output.

Every Laravel response ends with a `Laravel grounding:` line containing the detected version, references read, and primary source checked. [claim:GROUNDING-VISIBLE]

When exact syntax is uncertain, verify it from installed source or version-matched primary documentation before proposing it. [claim:SOURCE-VERIFY]
<!-- END: rules/verification-and-grounding.md -->

<!-- BEGIN: references/api-resources-errors-pagination.md -->
# Laravel 13 API Resources, Errors, and Pagination

## Contents

- Define an explicit HTTP and serialization contract.
- Transform models with standard or JSON:API resources.
- Prevent relationship serialization from creating N+1 queries.
- Select pagination semantics from product and database needs.
- Centralize error rendering without inventing an undocumented Laravel default.

## Applies To

Use this reference for JSON APIs, `JsonResource`, `ResourceCollection`,
Laravel 13 JSON:API resources, status codes, error documents, pagination,
conditional attributes, links, metadata, and exception rendering.

Read the request reference for validation and the query reference for eager
loading, stable ordering, and database performance.

Treat every published response shape as a compatibility surface.

## Verified Laravel 13 Behavior

Standard resources extend
`Illuminate\Http\Resources\Json\JsonResource`.

Resources provide explicit transformation between Eloquent models and outgoing
JSON.

`whenLoaded(...)` conditionally serializes a relationship only when the
controller or query has already loaded it.

Paginated resource collections include pagination links and metadata.

Laravel provides `paginate`, `simplePaginate`, and `cursorPaginate` with
different count, navigation, and ordering characteristics.

Validation exceptions can render JSON automatically when the request expects
JSON.

The pinned Laravel 13 skeleton calls `shouldRenderJsonWhen` for paths matching
`api/*` or requests that expect JSON. Existing applications may customize this
behavior.

Laravel 13 introduces first-party JSON:API resources.

JSON:API resources extend
`Illuminate\Http\Resources\JsonApi\JsonApiResource` and can be generated with
`php artisan make:resource PostResource --json-api`.

They support resource types and IDs, attributes, relationships, includes,
sparse fieldsets, links, metadata, lazy attributes, and the
`application/vnd.api+json` content type.

Laravel's JSON:API resources serialize responses; they do not automatically
implement arbitrary filter and sort query semantics.

## Correct Pattern

Define a standard resource with only intended public fields:

```php runnable
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'published_at' => $this->published_at?->toAtomString(),
            'author' => UserResource::make(
                $this->whenLoaded('author')
            ),
        ];
    }
}
```

Load relationships in the query layer:

```php illustrative
public function index(): AnonymousResourceCollection
{
    $posts = Post::query()
        ->with('author')
        ->latest('id')
        ->paginate(25);

    return PostResource::collection($posts);
}
```

For a JSON:API contract, use the Laravel 13 resource type explicitly:

```php illustrative
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\JsonApi\JsonApiResource;

final class PostResource extends JsonApiResource
{
    public $attributes = [
        'title',
        'body',
        'created_at',
    ];

    public $relationships = [
        'author' => UserResource::class,
    ];

    public function toType(Request $request): string
    {
        return 'posts';
    }
}
```

Select pagination deliberately:

- Use `paginate` when the client needs total counts and page numbers.
- Use `simplePaginate` when next/previous navigation is enough.
- Use `cursorPaginate` for large or frequently changing ordered datasets.

Provide deterministic ordering before cursor pagination and include a unique
tie-breaker where the business sort is not unique.

Use framework exception handling for authentication, authorization, missing
models, throttling, and validation unless the published API contract requires a
custom renderer.

When customizing errors, preserve correct status codes and avoid exposing
exception messages, SQL, paths, credentials, or stack traces.

Document whether an API uses Laravel's standard resource JSON, JSON:API, or a
project-specific envelope. These contracts are not interchangeable.

## Incorrect Pattern

```php illustrative
return response()->json([
    'success' => true,
    'data' => $post->toArray(),
    'error' => null,
]);
```

The example serializes the model implicitly and asserts an envelope that Laravel
does not require.

Do not expose raw Eloquent models as a long-lived public contract.

Do not access an unloaded relationship inside every resource item.

Do not call `load(...)` from each resource transformation.

Do not return authorization, validation, or server failures with HTTP 200.

Do not leak exception messages in production error documents.

Do not change error or pagination keys for one endpoint when clients rely on a
shared project contract.

Do not advertise JSON:API compliance while returning a custom envelope or the
wrong media type.

Do not accept arbitrary `include`, sort, or filter values without an allowlist
and query-cost controls.

Do not use cursor pagination without stable ordering.

## Failure Modes

- A resource accesses a relationship that was not eager loaded and causes N+1
  queries.
- A resource returns a hidden or sensitive model attribute.
- A renamed resource key breaks mobile or third-party clients.
- A paginator count query becomes the dominant endpoint cost.
- Offset pagination duplicates or skips records during concurrent inserts.
- Cursor pagination uses a nullable or non-unique ordering expression.
- JSON content negotiation returns an HTML redirect to an API client.
- A global exception renderer changes browser responses unintentionally.
- A custom error handler catches too broadly and masks programming defects.
- A JSON:API include creates an unbounded relationship graph.
- Sparse fieldsets cause expensive attributes to execute before selection.
- Resource auto-discovery chooses an unexpected class after a rename.

Measure queries and response size with realistic collections.

## Trade-offs

Standard `JsonResource` is flexible and works well for project-defined JSON.

`JsonApiResource` supplies specification-oriented structure but commits the API
to JSON:API media types and semantics.

Page-number pagination supports totals but requires count queries.

Simple pagination reduces query work but omits total pages.

Cursor pagination scales well for ordered streams but does not support arbitrary
page jumps.

Global error consistency helps clients; aggressive wrapping can erase useful
framework semantics.

Conditional resources protect query cost but require controllers to declare
which relationships they load.

## Version and Package Boundaries

First-party `JsonApiResource` is Laravel 13 behavior. Do not use its namespace or
generator flag in older projects without matching official documentation.

Third-party query builders and JSON:API packages have separate request parsing,
filter, sort, schema, and error contracts.

Sanctum and Passport affect authentication, not the resource transformation
itself.

Database driver and index support determine pagination performance.

Frontend consumers may require a pre-existing envelope; project contract wins
when it is secure and tested.

## Testing

Assert exact public keys, types, date formats, links, metadata, and status codes.

Assert sensitive attributes are absent.

Test empty, single-item, multi-page, last-page, and invalid-cursor behavior.

Use query-count assertions or a profiler to detect N+1 regressions.

Test JSON negotiation with and without `Accept` headers according to the public
contract.

For JSON:API, assert the media type, resource `type`, string `id`, attributes,
relationships, sparse fieldsets, includes, links, and maximum include depth.

Test representative framework exceptions:

```php illustrative
$this->getJson('/api/posts/999999')
    ->assertNotFound();

$this->actingAs($viewer)
    ->patchJson("/api/posts/{$post->id}", ['title' => 'Changed'])
    ->assertForbidden();
```

Run response-contract tests before changing a shared resource or exception
renderer.

## Grounding

- Eloquent resources and Laravel 13 JSON:API resources:
  https://laravel.com/docs/13.x/eloquent-resources
- Responses:
  https://laravel.com/docs/13.x/responses
- Pagination:
  https://laravel.com/docs/13.x/pagination
- Error handling:
  https://laravel.com/docs/13.x/errors
- Validation errors:
  https://laravel.com/docs/13.x/validation
- HTTP tests:
  https://laravel.com/docs/13.x/http-tests
- Pinned skeleton JSON negotiation:
  https://github.com/laravel/laravel/blob/43f3606336468af53f85aa6c993ce72041c63a61/bootstrap/app.php

Resource APIs are `official`. A success envelope, error code taxonomy, filter
language, and versioning policy are `project-convention` unless backed by a
published project contract.
<!-- END: references/api-resources-errors-pagination.md -->

<!-- BEGIN: references/architecture-configuration.md -->
# Laravel 13 Architecture and Configuration

## Contents

- Trace Laravel's bootstrap and request lifecycle before changing behavior.
- Keep configuration, environment access, and container bindings explicit.
- Use service providers and dependency injection at stable boundaries.
- Preserve project architecture when it is secure and version-compatible.
- Prepare configuration for caching, workers, and long-lived runtimes.

## Applies To

Use this reference for application structure, `bootstrap/app.php`, service
providers, facades, contracts, container bindings, configuration, environment
variables, and architectural boundaries.

Read it before adding a service layer, repository abstraction, provider,
middleware configuration, exception configuration, or environment-dependent
behavior.

It applies to web requests, console commands, queued jobs, scheduled tasks, and
tests because they all bootstrap the application container.

## Verified Laravel 13 Behavior

The Laravel 13 skeleton configures the application from `bootstrap/app.php` via
`Application::configure(...)`.

The pinned skeleton registers web routes, console routes, and the health route.
It does not prove that every project has an `api.php` route file.

Middleware and exception behavior are configured through the application
builder. Existing project configuration should be inspected before adding
another callback.

Service providers are the central bootstrap location for application services.
Bindings registered in a provider can be resolved through constructor
injection.

Laravel supports `bind`, `singleton`, `scoped`, contextual binding, interface
binding, tagging, and container events. Select lifetime from real execution
semantics rather than convenience.

Configuration values are read through `config(...)` after bootstrap.

When configuration is cached, Laravel does not load the application's `.env`
file during requests or Artisan commands. Calls to `env(...)` should therefore
remain in configuration files.

Facades resolve services from the container. They are testable, but they can
hide dependencies when used throughout domain code.

The project may use actions, services, repositories, domain modules, or a
feature-oriented layout. None of those structures is required by Laravel core.

## Correct Pattern

Inspect these files before changing architecture:

- `composer.json` and `composer.lock`.
- `bootstrap/app.php`.
- `bootstrap/providers.php`.
- `config/*.php`.
- route files.
- existing controllers, commands, jobs, tests, and project instructions.

Define deploy-time values in configuration:

```php runnable
// config/invoicing.php
return [
    'endpoint' => env('INVOICING_ENDPOINT'),
    'timeout_seconds' => (int) env('INVOICING_TIMEOUT', 10),
];
```

Consume the resolved configuration rather than reading the environment inside
business logic:

```php illustrative
namespace App\Services;

final class InvoiceGateway
{
    public function __construct(
        private readonly string $endpoint,
        private readonly int $timeoutSeconds,
    ) {
    }
}
```

Register the dependency at the composition root:

```php illustrative
use App\Services\InvoiceGateway;
use Illuminate\Contracts\Foundation\Application;

$this->app->singleton(InvoiceGateway::class, function (Application $app) {
    return new InvoiceGateway(
        endpoint: (string) $app['config']->get('invoicing.endpoint'),
        timeoutSeconds: (int) $app['config']->get('invoicing.timeout_seconds'),
    );
});
```

Prefer constructor injection for required collaborators.

Use method injection for request-scoped dependencies used by one controller
action.

Bind an interface only when multiple implementations, test seams, or a stable
domain boundary justify the abstraction.

Keep provider `register` methods focused on container registration. Perform
boot-time integration that requires registered services in `boot`.

Use `scoped` rather than `singleton` for state that must reset between job or
request lifecycles in long-lived workers.

Treat configuration as immutable during normal request handling.

Use typed configuration access or explicit casts at integration boundaries.

Run `php artisan config:cache` as part of deployment verification when the
project's deployment model uses cached configuration.

## Incorrect Pattern

```php illustrative
final class InvoiceService
{
    public function send(): void
    {
        $endpoint = env('INVOICING_ENDPOINT');
        $client = app('http');

        // Hidden dependency and runtime environment lookup.
    }
}
```

Do not create a repository layer solely because a generic style guide says so.

Do not move existing feature code into a new architecture without evidence that
the task requires it.

Do not store request-specific mutable data on a singleton.

Do not resolve every dependency with `app(...)` inside domain methods.

Do not assume `routes/api.php`, package providers, or middleware aliases exist
without inspecting the project.

Do not read secrets from configuration and then log or return them.

Do not commit a generated configuration cache.

Do not change environment variable names without migration and deployment
coordination.

## Failure Modes

- `env(...)` outside config returns unexpected values after `config:cache`.
- A singleton leaks tenant or user state across requests in Octane or workers.
- Duplicate provider registration produces repeated listeners or side effects.
- A provider performs network or database work during every bootstrap.
- A config value remains a string when an integration expects an integer or
  boolean.
- Missing environment values fail only when a rarely used code path resolves.
- An interface binding points to a class with unresolved constructor arguments.
- A package auto-discovery assumption fails after `dont-discover` customization.
- Cached routes or configuration hide a local file edit.
- Tests pass by replacing a facade while production code resolves another
  container key.

Fail early for required integration configuration, but avoid making unrelated
commands fail when an optional integration is disabled.

## Trade-offs

Direct class injection is simpler than an interface until substitution is
needed.

Facades are concise and framework-native; constructor injection makes coupling
and lifetime more visible.

Singletons reduce construction cost but require stateless services.

Scoped bindings are safer for per-request state but depend on lifecycle reset.

Configuration caching improves bootstrap performance but requires disciplined
environment handling.

Feature-oriented organization improves cohesion but may differ from an existing
project's conventions.

Project convention wins when it is coherent, covered by tests, secure, and
compatible with the installed framework.

## Version and Package Boundaries

The `Application::configure` skeleton described here is verified against the
Laravel 13 application skeleton pinned by `source-lock.json`.

Laravel 10 through 13 share parts of this bootstrap style, but callbacks and
methods must be verified against the detected version.

Octane and other long-lived runtimes add lifetime constraints; load their
package documentation only when installed or explicitly requested.

Package service providers, facades, and configuration belong to the installed
package version, not Laravel core.

Environment injection differs across Forge, Vapor, containers, traditional
servers, and local tools.

## Testing

Run `php artisan about` and targeted container-resolution tests when safe.

Test required bindings by resolving their public service from the container.

Test configuration with cache-compatible scalar and array values.

Test missing, malformed, and disabled optional integration configuration.

For long-lived runtimes, make two requests or jobs with different user/tenant
context and assert no state leaks.

Use `Config::set(...)` or configuration overrides in tests rather than mutating
the process environment after bootstrap.

Add a deployment smoke check that builds configuration cache and boots a
read-only command.

Review the generated diff for accidental `.env`, credential, cache, or vendor
files.

## Grounding

- Application structure:
  https://laravel.com/docs/13.x/structure
- Request lifecycle:
  https://laravel.com/docs/13.x/lifecycle
- Service container:
  https://laravel.com/docs/13.x/container
- Service providers:
  https://laravel.com/docs/13.x/providers
- Configuration:
  https://laravel.com/docs/13.x/configuration
- Facades:
  https://laravel.com/docs/13.x/facades
- Pinned skeleton `bootstrap/app.php`:
  https://github.com/laravel/laravel/blob/43f3606336468af53f85aa6c993ce72041c63a61/bootstrap/app.php

Architecture recommendations beyond documented framework behavior are
`project-convention` or `derived` and should be presented as such.
<!-- END: references/architecture-configuration.md -->

<!-- BEGIN: references/authentication-authorization.md -->
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
<!-- END: references/authentication-authorization.md -->

<!-- BEGIN: references/blade-views-components.md -->
# Blade, Views, Components, and Forms

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for server-rendered views, Blade layouts, anonymous and class components,
slots, attributes, forms, validation messages, authorization-aware UI, pagination, and reusable
presentation boundaries. Blade is core Laravel UI and may be used deeply without introducing a
separate frontend framework.

Read existing layouts, component conventions, view composers, localization style, CSS system,
accessibility patterns, and browser tests before changing markup. Authorization in a template
controls presentation only; the corresponding server action still needs authorization.

## Verified Laravel 13 Behavior

- Views normally live under `resources/views` and are returned with the `view` helper or the
  `View` facade.
- `{{ $value }}` passes output through Laravel's escaping helper. Raw `{!! $html !!}` output is
  not escaped and is appropriate only for content already trusted and sanitized for that context.
- Blade control directives compile to PHP; layouts may use components/slots or template
  inheritance with sections and yields.
- Anonymous components live under `resources/views/components`; class components pair a PHP class
  with a view.
- Component attributes not declared as constructor data are available through `$attributes`.
  `merge` combines defaults, while `class` conditionally builds CSS classes.
- Named and default slots let callers provide markup while components own surrounding structure.
- `@aware` can expose explicitly passed parent component data to nested components; it does not
  implicitly expose a parent's default property value.
- Forms targeting `POST`, `PUT`, `PATCH`, or `DELETE` routes use `@csrf`; non-POST verbs also use
  `@method` because browser forms submit only GET or POST.
- `@error`, `old`, and validation error bags support redisplaying rejected form input.
- `@auth`, `@guest`, and `@can` can tailor visible UI, but they do not replace middleware, gates,
  policies, or controller authorization.
- Stacks and `@push` allow child views or components to contribute assets or markup to a layout.

## Correct Pattern

Pass explicit view data, escape user-controlled output, and keep query/business logic outside the
template.

```php illustrative
use App\Models\Post;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Gate;

public function edit(Post $post): View
{
    Gate::authorize('update', $post);

    return view('posts.edit', [
        'post' => $post,
        'categories' => $this->categories->forSelect(),
    ]);
}
```

Laravel 13 controller authorization attributes are another valid project-level pattern.
`$this->authorize(...)` is valid only when the controller explicitly uses `AuthorizesRequests`;
do not assume the application's base controller supplies that trait.

```blade
<form method="POST" action="{{ route('posts.update', $post) }}">
    @csrf
    @method('PUT')

    <x-form.input
        name="title"
        :label="__('Title')"
        :value="old('title', $post->title)"
        :errors="$errors"
    />

    @can('update', $post)
        <button type="submit">{{ __('Save') }}</button>
    @endcan
</form>
```

An anonymous input component can merge caller attributes while retaining accessible defaults:

```blade
@props(['name', 'label', 'value' => null, 'errors'])

<label for="{{ $name }}">{{ $label }}</label>
<input
    id="{{ $name }}"
    name="{{ $name }}"
    value="{{ $value }}"
    {{ $attributes->class(['is-invalid' => $errors->has($name)]) }}
    aria-describedby="{{ $errors->has($name) ? $name.'-error' : '' }}"
>
@if ($errors->has($name))
    <p id="{{ $name }}-error" role="alert">{{ $errors->first($name) }}</p>
@endif
```

Pass the intended message bag to the component. The default form can pass
`$errors`; a named form bag should pass `$errors->getBag('profile')`. Avoid
mixing a named bag for classes and ARIA state with `@error($name)`, which reads
the default bag unless its bag argument is supplied.

## Incorrect Pattern

```blade
{{-- Unsafe: untrusted rich text is rendered without contextual sanitization. --}}
{!! $post->body_from_request !!}

{{-- Inefficient: relationship access can trigger a query for every rendered item. --}}
@foreach ($posts as $post)
    {{ $post->author->name }}
@endforeach

{{-- Incomplete: hiding a button is not authorization for the endpoint. --}}
@if ($user->is_admin)
    <form method="POST" action="/users/{{ $target->id }}/delete">
        <button>Delete</button>
    </form>
@endif
```

Avoid service-container lookups, database queries, remote calls, state mutation, and complex
business decisions inside Blade. Do not suppress validation or authorization errors merely to
make a component reusable.

## Failure Modes

- Raw output creates stored or reflected XSS.
- A form fails with HTTP 419 because the CSRF token is absent or the session/cookie domain is wrong.
- A PUT/PATCH/DELETE route receives POST because method spoofing is missing.
- A component attribute disappears because it was consumed as constructor data or not forwarded.
- Default and caller CSS classes conflict because `merge` semantics were not considered.
- A nested component expects `@aware` data that was never explicitly supplied.
- Repeated lazy-loaded relationships create an N+1 query problem during rendering.
- Error messages use the wrong named error bag.
- Old input is shown for a sensitive field that should never be repopulated.
- The UI suggests access is denied, but the route lacks actual authorization.
- Focus order, labels, errors, or keyboard interactions become inaccessible after component reuse.
- View caches preserve stale compiled output during an incomplete deployment.

## Trade-offs

Anonymous components are lightweight and keep simple presentation together. Class components are
useful when preparing presentation data or behavior would otherwise clutter the template, but can
hide dependencies if overused. Includes are direct; components offer a clearer public interface.

Blade-first UI reduces client complexity and works well for server-rendered workflows. Highly
interactive screens may justify an installed reactive stack, but selecting one changes build,
state, testing, and deployment concerns and therefore requires project evidence or an explicit
user request.

## Version and Package Boundaries

- Blade and views are Laravel core. Livewire, Flux, Inertia, React, Vue, and their component
  libraries are separate stacks.
- Tailwind-specific class strategy belongs to the detected asset setup, not to Blade itself.
- Starter-kit components may depend on Fortify and a specific frontend stack; inspect both
  Composer and JavaScript lockfiles before copying them.
- `$this->authorize` needs the `AuthorizesRequests` trait; the Laravel 13 application skeleton's
  base controller may not provide that trait.
- Do not introduce or deeply prescribe a non-core UI stack unless it is detected or the user
  explicitly requests it.

## Testing

- Use feature tests to assert status, selected view, view data, validation errors, redirects, and
  authorization for the underlying endpoint.
- Use `assertSee` with escaping awareness and `assertSeeText` for user-visible text.
- Test anonymous or class components with representative attributes, slots, errors, and locale.
- Enable lazy-loading prevention or query-count checks where a rendered collection could hide N+1
  behavior.
- Add browser tests for critical form flows, focus/error behavior, keyboard access, and JavaScript-
  enhanced interactions.
- Test CSRF/session behavior at an appropriate integration or browser layer rather than disabling
  middleware everywhere.
- Run view compilation or application tests during deployment validation to catch malformed Blade.

## Grounding

Classification: `official` for Blade APIs and `derived` for component-design guidance.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/views
- https://laravel.com/docs/13.x/blade
- https://laravel.com/docs/13.x/csrf
- https://laravel.com/docs/13.x/validation#displaying-the-validation-errors
- https://laravel.com/docs/13.x/authorization
- https://laravel.com/docs/13.x/testing

When a detected starter kit replaces or extends these patterns, verify its installed package
versions before applying stack-specific guidance.
<!-- END: references/blade-views-components.md -->

<!-- BEGIN: references/boost-ai-mcp.md -->
# Laravel Boost, AI SDK, and MCP

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference when a Laravel project installs or explicitly requests Laravel Boost, the
Laravel AI SDK, or Laravel MCP. These are three distinct package surfaces:

- Boost improves AI-assisted development with project inspection, generated guidance, skills, and
  version-aware documentation search.
- The AI SDK adds runtime provider-agnostic agents, tools, media, embeddings, files, vector stores,
  and related application features.
- Laravel MCP lets an application expose or consume MCP tools, resources, prompts, and apps.

Inspect `composer.lock`, package configuration, generated agent files, routes, migrations, provider
credentials, and threat model. Do not install any of these packages merely because the application
uses Laravel 13.

## Verified Laravel 13 Behavior

- Boost installs as a development dependency with `composer require laravel/boost --dev` and is
  initialized with `php artisan boost:install`.
- Boost generates MCP configuration and agent guidance/skill files for selected coding agents.
  `boost:update` refreshes generated resources.
- Boost's `Search Docs` tool queries Laravel's hosted documentation service using detected package
  versions; it is preferred for exact installed-package syntax when available.
- Codex can register Boost manually with
  `codex mcp add laravel-boost -- php "artisan" "boost:mcp"` when automatic setup is unavailable.
- Context7 or the pinned official Laravel 13 source remains a documentation fallback and an
  independent freshness check; it does not replace project version detection.
- The AI SDK installs with `composer require laravel/ai`; publishing its provider creates
  configuration and migrations, including conversation-storage tables when those migrations run.
- `php artisan make:agent` creates an AI agent class. The package supports tools, structured output,
  streaming, queueing, provider options, files, embeddings, and test fakes.
- Agent classes support `fake` responses for tests, including structured responses.
- Laravel MCP installs with `composer require laravel/mcp`; publishing `ai-routes` creates
  `routes/ai.php`.
- `make:mcp-server`, `make:mcp-tool`, `make:mcp-prompt`, and `make:mcp-resource` generate MCP
  primitives. Servers register with `Mcp::web` for HTTP transport or `Mcp::local` for Artisan/local
  transport.
- MCP tool inputs, prompt arguments, and access still require validation, authentication,
  authorization, rate limiting, and safe error handling appropriate to their exposure.

## Correct Pattern

Use Boost first as a read-only grounding aid: detect versions, query exact documentation, inspect
routes/configuration, and compare generated guidance changes before accepting them. Project code,
tests, and valid conventions retain precedence.

Fake AI responses in automated tests and validate application behavior independently of provider
availability:

```php illustrative
use App\Ai\Agents\SalesCoach;
use Laravel\Ai\Prompts\AgentPrompt;

SalesCoach::fake(function (AgentPrompt $prompt): string {
    return str_contains($prompt->prompt, 'quarter')
        ? 'Focus on retained revenue.'
        : 'Ask for a reporting period.';
});

$response = (new SalesCoach)->prompt('Review this quarter.');
```

Register the smallest MCP exposure. Do not expose `Mcp::web` until the application proves a
compatible bearer-token or OAuth guard is installed and configured. The official Laravel MCP
authentication paths are Sanctum bearer tokens through `auth:sanctum`, Passport OAuth 2.1 through
`auth:api`, or a deliberately implemented custom Authorization-header middleware. OAuth 2.1 is
the most broadly interoperable MCP option. If none is available, keep the capability local with
`Mcp::local` and stop to design authentication before adding a web transport.

Define the named limiter before attaching it:

```php illustrative
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('mcp-web', function (Request $request): Limit {
    $identity = $request->user()?->getAuthIdentifier() ?? $request->ip();

    return Limit::perMinute(30)->by('mcp:'.$identity);
});
```

Then protect the server route with the detected guard. For an application that already has
Sanctum token authentication configured, the client must send an `Authorization: Bearer ...`
header:

```php illustrative
use App\Mcp\Servers\SupportServer;
use Laravel\Mcp\Facades\Mcp;

Mcp::web('/mcp/support', SupportServer::class)
    ->middleware(['auth:sanctum', 'throttle:mcp-web']);

Mcp::local('support', SupportServer::class);
```

For a configured Passport installation, register the MCP OAuth discovery/client routes and use
`auth:api` instead. Do not add Sanctum or Passport merely to copy an example. `routes/ai.php` does
not by itself establish Laravel's browser `web` middleware stack, session, cookie, or CSRF
boundary. A user-requested cookie-session MCP design therefore needs an explicit, version-matched
web/session/CSRF architecture and transport tests; never treat bare `auth` as proof that it exists.

Route authentication establishes an actor; it does not authorize every tool or
resource. Resolve a narrowly scoped record inside each capability and enforce
its policy before returning or mutating data:

```php illustrative
<?php

namespace App\Mcp\Tools;

use App\Models\Ticket;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Gate;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

class ShowTicketTool extends Tool
{
    public function handle(Request $request): Response
    {
        $validated = $request->validate([
            'ticket_id' => ['required', 'integer'],
        ]);

        $ticket = Ticket::query()->findOrFail($validated['ticket_id']);
        Gate::authorize('view', $ticket);

        return Response::text(json_encode([
            'id' => $ticket->getKey(),
            'status' => $ticket->status,
        ], JSON_THROW_ON_ERROR));
    }

    /** @return array<string, \Illuminate\JsonSchema\Types\Type> */
    public function schema(JsonSchema $schema): array
    {
        return [
            'ticket_id' => $schema->integer()
                ->description('The authorized ticket identifier to retrieve.')
                ->required(),
        ];
    }
}
```

Describe tools precisely, define narrow schemas, validate input again at the system boundary, apply
policies to selected records, bound output size, and return only data the caller may access. Treat
model/tool output as untrusted input before database writes, commands, URLs, or rendered HTML.

## Incorrect Pattern

```php illustrative
// Unsafe: model text becomes a shell command.
Process::run($agent->prompt($request->string('task'))->text);

// Unsafe: unauthenticated remote tool exposes arbitrary records.
Mcp::web('/mcp/admin', AdminServer::class);

// Fragile: live provider calls make the feature suite slow and nondeterministic.
$result = (new SalesCoach)->prompt('Always call the paid provider in tests.');
```

Do not place provider keys in prompts, generated guidance, tool output, MCP metadata, logs, or
committed configuration. Do not let prompt instructions override authorization, validation,
tenant isolation, or external-action approval.

## Failure Modes

- Boost detects a package but generated guidance conflicts with an intentional project convention.
- Running `boost:install` or `boost:update` overwrites or adds agent files without reviewing the diff.
- An agent uses live current docs for a different package major than `composer.lock`.
- AI provider credentials or base URLs are missing, exposed, or cached incorrectly.
- A provider response violates the expected structured schema or contains unsafe content.
- Tool calls create duplicate charges, messages, or writes after retry.
- Conversation, file, embedding, or vector-store data violates retention or tenant boundaries.
- Prompt injection persuades a tool to read unrelated records or disclose hidden instructions.
- An MCP web route lacks authentication, capability authorization, rate limiting, or transport TLS.
- A local MCP server inherits broader workstation credentials than the task needs.
- Tool schemas are broad, descriptions are ambiguous, or errors leak internal data.
- Provider and MCP tests pass only when external paid services are reachable.

## Trade-offs

Boost improves documentation retrieval and project awareness but adds generated artifacts and a
local inspection surface. The AI SDK provides one Laravel-native abstraction across providers but
cannot erase differences in model capability, billing, latency, moderation, retention, or tool
semantics. Laravel MCP accelerates protocol integration while expanding the application's attack
surface.

Local MCP transport is convenient for developer tools and inherits local trust. Web transport
supports remote clients but needs production-grade identity, authorization, rate limiting, and
monitoring. Structured output reduces parsing ambiguity but still requires domain validation.

## Version and Package Boundaries

- Confirm `laravel/boost`, `laravel/ai`, and `laravel/mcp` independently in `composer.lock`.
- Boost belongs in development dependencies and is not the runtime AI SDK.
- Provider capabilities and options vary; use only features supported by the selected provider and
  installed AI SDK version.
- Web MCP authentication uses an installed bearer-token/custom Authorization-header guard or
  Passport OAuth 2.1. Do not infer Sanctum or Passport from MCP alone, and do not infer a browser
  session stack from `routes/ai.php` or bare `auth` middleware.
- Boost documentation coverage lists its own supported package versions; that list is not a claim
  that those packages are compatible with each other.
- Install or deeply configure these packages only when detected or explicitly requested.

## Testing

- Use Boost read-only inspection and `Search Docs` during development; verify generated-file diffs
  after install/update.
- Use agent, image, audio, embedding, file, and vector-store fakes supplied by the AI SDK for fast
  deterministic tests.
- Assert structured schema validation, tool authorization, timeout, failover, retry/idempotency,
  quota, moderation, and provider error behavior.
- Test prompt-injection attempts and cross-tenant record references as authorization cases.
- Use Laravel MCP test helpers and the MCP Inspector in a controlled environment.
- Test local and web registration separately, including unauthenticated, unauthorized, throttled,
  malformed, oversized, duplicate, and successful requests.
- Keep paid/live-provider smoke tests opt-in, budget-bounded, secret-protected, and outside ordinary
  pull-request determinism.
- Review logs, stored conversations, tool arguments, and outputs for secrets and regulated data.

## Grounding

Classification: `package-specific`. Verified against official Laravel 13 package documentation:

- https://laravel.com/docs/13.x/boost
- https://laravel.com/docs/13.x/ai
- https://laravel.com/docs/13.x/ai-sdk
- https://laravel.com/docs/13.x/mcp
- https://laravel.com/docs/13.x/testing
- https://laravel.com/docs/13.x/authorization
- https://laravel.com/docs/13.x/rate-limiting

Use Boost's version-aware `Search Docs`, Context7 `/laravel/docs/__branch__13.x`, and the pinned
official source lock to verify exact APIs while keeping the detected project version authoritative.
<!-- END: references/boost-ai-mcp.md -->

<!-- BEGIN: references/cache-redis-locks.md -->
# Cache, Redis, Atomic Locks, and Invalidation

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for cache-aside reads, expiration, invalidation, stale-while-revalidate,
multiple cache stores, Redis access, atomic add, distributed locks, lock ownership, and stampede
control. Inspect `config/cache.php`, installed Redis client, key prefixes, serialization,
deployment topology, tenant boundaries, and failure policy before selecting a pattern.

Cached data is a derived copy unless the application explicitly implements a cache-backed source
of truth. Design behavior for misses, stale values, eviction, store failure, and partial
invalidation.

## Verified Laravel 13 Behavior

- The `Cache` facade uses the configured default store; `Cache::store($name)` selects another
  configured store.
- `get` returns a fallback for a missing key. `remember` computes and stores a value when absent;
  `rememberForever` has no application TTL and remains subject to eviction or manual removal.
- `put` accepts a TTL, `forever` stores without an application expiration, and `forget` removes a
  key.
- `add` is atomic on supported stores and returns whether an absent key was successfully stored.
- `increment` and `decrement` use store-level operations; initialize and type values consistently
  before relying on them as counters.
- `Cache::flexible` implements a stale-while-revalidate window: a fresh value is returned first,
  a stale value may be served while refresh is deferred, and an expired value is recomputed.
- Cache tags group related keys only on stores that support tags. File, database, and DynamoDB
  stores do not support tagged cache items.
- `Cache::lock` creates an atomic lock with a lease duration on lock-capable stores. `get`,
  `block`, `release`, owner tokens, and `restoreLock` control acquisition and ownership.
- Passing a closure to `get` or `block` releases the acquired lock after the closure exits.
- Laravel Redis connections are configured in `config/database.php` and use the installed
  PhpRedis extension or the Predis package.

## Correct Pattern

Use a versioned, tenant-scoped key and invalidate it only after durable state commits:

```php illustrative
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

function productCatalogKey(int $tenantId): string
{
    return "tenant:{$tenantId}:catalog:v3";
}

$catalog = Cache::remember(
    productCatalogKey($tenantId),
    now()->addMinutes(10),
    fn () => Product::query()
        ->where('tenant_id', $tenantId)
        ->where('is_visible', true)
        ->get(['id', 'name', 'price_minor']),
);

DB::transaction(function () use ($tenantId, $attributes): void {
    Product::query()->create($attributes);

    DB::afterCommit(function () use ($tenantId): void {
        Cache::forget(productCatalogKey($tenantId));
    });
});
```

Use an atomic lock for one bounded cross-process operation. Set the lease longer than expected
work, bound acquisition wait, and keep the critical section small:

```php illustrative
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Support\Facades\Cache;

try {
    Cache::lock("invoice:{$invoiceId}:generate", 120)
        ->block(5, function () use ($invoiceId): void {
            GenerateInvoice::run($invoiceId);
        });
} catch (LockTimeoutException) {
    throw new InvoiceGenerationAlreadyRunning();
}
```

When ownership moves to another process, pass the owner token explicitly and restore that exact
lock before release:

```php illustrative
$lock = Cache::lock($lockName, 120);

if ($lock->get()) {
    FinishLockedWork::dispatch($lockName, $lock->owner());
}

// In the receiving process:
Cache::restoreLock($lockName, $ownerToken)->release();
```

## Incorrect Pattern

```php illustrative
// Race: get followed by put is not an atomic claim.
if (! Cache::has($key)) {
    Cache::put($key, true, 60);
}

// Cross-tenant leak and collision.
Cache::remember('products', 3600, fn () => Product::all());

// A five-second lease cannot protect work that may run for a minute.
Cache::lock('monthly-report', 5)->get(function (): void {
    buildLargeReport();
});

// Flush ignores the application's cache prefix and can affect shared stores.
Cache::flush();
```

Do not use `forceRelease` as routine cleanup; it ignores ownership and can release another
process's valid lease.

## Failure Modes

- A key omits tenant, locale, user, permission, or version context and returns another audience's
  data.
- Cached authorization or role data remains stale after a permission change.
- Invalidation runs before a database rollback, leaving cache and durable state inconsistent.
- A forever key never receives a new schema/version and old serialized objects cannot be decoded.
- A hot key expires simultaneously on many workers and causes a cache stampede.
- A lock lease expires while work continues, so a second worker enters the same critical section.
- A process crashes after acquiring a lock; an excessive lease blocks work too long.
- A lock owner token is logged, exposed, or released by the wrong process.
- Tests use the array store and incorrectly prove cross-process locking.
- Redis eviction or failover removes a value the application treated as durable state.
- A cluster command touches keys in different hash slots and loses expected atomicity.
- `flush` clears unrelated applications that share the same physical cache.

## Trade-offs

Short TTLs reduce staleness but increase misses and backend load. Long TTLs improve hit rate while
making invalidation completeness more important. Event-driven invalidation is fast but can miss a
path; versioned keys make broad invalidation simple at the cost of abandoned old entries.

Atomic locks are appropriate for short, bounded coordination. Database constraints are stronger
for durable uniqueness, and queue uniqueness or overlap middleware may better express job
scheduling intent.

Redis provides fast shared operations and rich structures but adds network, memory, persistence,
cluster, and failover decisions. A local file or array store is simpler but cannot coordinate
multiple application hosts.

## Version and Package Boundaries

- Confirm the installed Laravel version before using newer cache APIs such as flexible caching or
  concurrency helpers.
- Atomic lock support depends on the configured driver and all participants sharing the same
  central store.
- Cache tags are not portable to every Laravel cache driver.
- The PhpRedis extension and Predis package differ in installation, options, serialization, and
  cluster behavior; inspect the detected client configuration.
- Redis Cluster multi-key operations may require deliberate hash tags so related keys share a
  slot.
- Horizon, queue middleware, rate limiters, and session storage may share Redis infrastructure
  but have separate key, durability, and failure requirements.
- Do not introduce Redis or a cache package solely because this reference mentions it.

## Testing

- Test miss, hit, expiration, stale window, recomputation failure, and explicit invalidation.
- Assert tenant/user/locale/permission dimensions are included in cache keys.
- Test mutation rollback and commit to prove invalidation timing.
- Use a real shared lock-capable store for acquisition contention, lease expiry, owner transfer,
  and crash recovery tests.
- Run two processes to prove only one enters the critical section.
- Test behavior when the cache store is unavailable according to the application's fail-open or
  fail-closed policy.
- Verify serialized values across deployment versions when objects rather than scalar/array data
  are cached.
- Inspect TTLs, hit rate, evictions, memory, slow commands, and lock contention in production
  telemetry.
- Do not use `Cache::flush` in tests against a store shared with another suite or application.

## Grounding

Classification: `official` for Laravel cache, Redis, and lock APIs; `derived` for key design,
invalidation, and lease-safety guidance. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/cache
- https://laravel.com/docs/13.x/redis
- https://laravel.com/docs/13.x/database#database-transactions
- https://laravel.com/docs/13.x/queues#unique-jobs
- https://laravel.com/docs/13.x/queues#preventing-job-overlaps

Redis durability, clustering, eviction, and failover must also be verified against the configured
client and deployment's primary documentation.
<!-- END: references/cache-redis-locks.md -->

<!-- BEGIN: references/collections-strings-processes.md -->
# Collections, Helpers, Strings, Contracts, and Processes

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference when code transforms in-memory or streamed data, reaches for a global helper,
normalizes strings, defines an abstraction, resolves dependencies, or invokes an operating-system
process. These APIs are convenient, but their return types, evaluation timing, escaping behavior,
container lifetime, and process boundary can materially affect correctness and security.

Before changing code, inspect:

- `composer.lock` for the exact `laravel/framework`, Symfony Process, CommonMark, and related
  package versions;
- the concrete collection type: base `Collection`, `LazyCollection`, or Eloquent collection;
- whether the input is already resident in memory or is generated, queried, or streamed;
- Blade templates and the final output context for any string that can contain untrusted data;
- service providers, container attributes, interfaces, and test substitutions already used by the
  project;
- the executable path, command arguments, working directory, inherited environment, resource
  limits, output handling, and deployment user for an external process; and
- the project's process fake policy and whether CI can safely execute the real binary.

Do not introduce an application interface, macro, external binary, or optional package merely
because it appears in this reference. Follow detected project conventions unless an explicit user
request requires a change, and still call out correctness, security, and version conflicts.

## Verified Laravel 13 Behavior

### Collections and lazy collections

- `collect($items)` creates an `Illuminate\Support\Collection`. Most collection operations return
  a new collection, so a fluent chain commonly leaves the original collection unchanged.
- Mutation is not universal. `transform`, `forget`, `put`, `push`, and `prepend` change the
  collection they are called on. `pull`, `pop`, `shift`, and `splice` both mutate the source and
  return removed value(s). Read the method contract instead of assuming every fluent method is
  immutable.
- `map` returns a new collection; `transform` replaces the items in the existing collection.
  `tap` and `each` return the original collection, and a callback return value is not mapped into
  it. Returning `false` from an `each` callback stops iteration.
- Collection higher-order messages such as `$users->each->markAsVip()` proxy property access or a
  method call to every item, and constant arguments are forwarded to each call. Use an explicit
  closure for per-item arguments, branching, authorization, error handling, or a clearer
  return-value contract.
- `pop()` and `shift()` return one removed item, while passing a count returns a collection of
  removed items. `pull($key)` returns the removed value. `splice(...)` returns the removed slice.
  These methods do not return the remaining collection.
- Operations such as `filter`, `slice`, and `unique` may preserve existing keys. Call `values()`
  only when a consecutively indexed result is part of the required contract.
- `all()` returns the underlying array. `toArray()` recursively converts nested `Arrayable`
  values, including Eloquent models; that conversion can expose different fields than `all()`.
- `contains`, `where`, `whereIn`, and `unique` use loose comparisons in documented forms. Their
  `Strict` variants use strict comparisons. Identity, authorization, identifiers, booleans, and
  externally supplied values usually require an explicit strict choice.
- `first` may return `null`; `firstOrFail` throws when no item matches; `sole` requires exactly one
  match. Select the method whose cardinality contract matches the business rule.
- A `LazyCollection` is backed by generators and defers work until enumeration. It can keep only a
  small portion of a stream in memory when the upstream source is also lazy.
- Calling `lazy()` on an existing collection provides lazy downstream operations but does not
  remove the already-loaded source items from memory. Calling `collect()`, `all()`, or another
  terminal materialization on a lazy sequence can consume the entire sequence.
- Mutating collection methods such as `shift`, `pop`, and `prepend` are not available on
  `LazyCollection`. Lazy side effects should be deliberate and occur only when values are pulled.
- `remember()` on a lazy collection caches values that have already been enumerated for later
  enumerations. It avoids retrieving them again but causes retained values to consume memory.
- Query-builder and Eloquent `cursor()` flows return lazy collections. Database cursor semantics,
  eager-loading needs, connection buffering, and relation access still need separate inspection.
- Eloquent collections specialize some base collection methods. Verify model-identity and return-
  type behavior in the Eloquent collection documentation before treating them as plain arrays.

### Helpers and strings

- `data_get` reads nested arrays or objects with dot notation, supports a default, and supports
  documented wildcards. Related `data_set`, `data_fill`, and `data_forget` operations can mutate
  nested structures; wildcard paths may affect more values than a literal path.
- `blank` treats empty strings, whitespace-only strings, `null`, and empty countable values as
  blank, but does not treat `0`, `true`, or `false` as blank. `filled` is its inverse.
- `once` caches a callback result in memory for the duration of the request. When called from an
  object instance, its cache is scoped to that object instance. It is not a durable or distributed
  cache.
- `tap($value, $callback)` passes the value to the callback and then returns the original value;
  the callback's return value is discarded. Proxy-style `tap($value)->method()` also returns the
  original value, not the proxied method's return value.
- `rescue` catches exceptions, reports them by default, and returns a default value when supplied.
  It allows execution to continue, so it must not erase an integrity, authorization, or payment
  failure that callers need to distinguish.
- `retry` retries callbacks that throw and rethrows after the configured attempts. Delay schedules
  and conditional retry callbacks are supported. Retrying does not make a side effect idempotent.
- `value` evaluates a closure or returns a non-closure unchanged. `transform` applies a callback
  only when a value is not blank. Their lazy/default behavior can hide expensive work if used
  casually inside loops.
- `Str` exposes static helpers, while `Str::of` returns a fluent `Stringable`. Operations such as
  `trim`, `squish`, `lower`, `slug`, `limit`, `mask`, `isJson`, `isUrl`, `uuid`, `ulid`, `random`,
  and `password` each solve a narrow formatting or generation task, not general validation.
- `Str::random` uses PHP `random_bytes`; `Str::password` generates a secure random password with
  configurable character classes. Required entropy, format, expiration, and storage still depend
  on the credential or token protocol.
- `e($value)` applies HTML escaping. Blade's `{{ ... }}` output is escaped by default, while raw
  output syntax and `HtmlString` / `toHtmlString()` bypass Blade escaping.
- `Str::markdown` and `Str::inlineMarkdown` produce HTML. Options such as `html_input => 'strip'`
  and `allow_unsafe_links => false` reduce risk for untrusted Markdown; converting to an
  `HtmlString` is not sanitization.
- `Str::isUrl` checks URL syntax and can restrict protocols, but does not prove that a destination
  is safe to fetch. It does not prevent redirects, loopback/private-network access, DNS rebinding,
  or cloud metadata access.
- A slug is not guaranteed unique, Base64 is not encryption, masking is not deletion, valid JSON
  is not schema validation, and a UUID or ULID is not authorization.
- String and collection macros modify global runtime behavior. Register them in the project's
  established provider and test collisions, worker reuse, and package compatibility.

### Contracts and the service container

- Laravel contracts are framework service interfaces under `Illuminate\Contracts`. Most have a
  framework implementation, and many facades expose an equivalent service.
- Facades and contracts are both documented, testable approaches. Contracts make constructor
  dependencies explicit; facades are convenient. Choosing one is a project design decision, not a
  universal quality rule.
- The container automatically resolves concrete classes whose dependencies are themselves
  resolvable concrete classes. An interface requires a binding unless Laravel or a package has
  already registered its implementation.
- Controllers, middleware, listeners, jobs, route closures, and other container-resolved classes
  may receive dependencies through constructor or method injection.
- `bind` creates transient resolutions by default, `singleton` reuses one instance for the
  container lifetime, and `scoped` reuses an instance for one request or job lifecycle before a
  scoped flush in supported long-lived runtimes.
- Contextual bindings provide different implementations or values when different consumers need
  the same contract. Container attributes such as `Bind`, `Singleton`, `Scoped`, and contextual
  attributes are version-sensitive configuration surfaces.
- The standalone `illuminate/contracts` package is useful to packages that need Laravel service
  interfaces without requiring concrete framework implementations. It does not provide a running
  container or those implementations by itself.
- Application-owned interfaces are justified by a real substitution boundary, stable domain
  concept, multiple implementation, package boundary, or testing seam. A one-to-one interface for
  every concrete class is a project convention at most, not a Laravel requirement.
- Service-location calls such as `app(...)` and `resolve(...)` are available, but constructor
  injection usually makes reusable class dependencies and tests clearer. Runtime-dependent lookup
  remains appropriate in framework integration points that genuinely need it.

### Processes

- `Process::run($command)` executes synchronously and returns an
  `Illuminate\Contracts\Process\ProcessResult`. The result exposes `command`, `successful`,
  `failed`, `output`, `errorOutput`, and `exitCode`.
- A non-zero exit does not make `run` throw by itself. Call `throw()` / `throwIf(...)` or branch on
  `successful()` / `failed()` so failure cannot be mistaken for valid output.
- Laravel 13's pinned framework source accepts an array or string command for `run`, `start`, and
  pending `command`. Array commands are passed as argument vectors to Symfony Process; string
  commands are created as shell command lines. Prefer an array whenever values are dynamic.
- `path` sets the working directory. `input` supplies standard input. `timeout` bounds total run
  time, and `idleTimeout` bounds the time without output. The documented default total timeout is
  60 seconds; `forever` removes it and should be exceptional.
- `env` adds environment entries while the child still inherits the parent environment. Setting
  an entry to `false` removes that inherited variable for the child. Environment values are not a
  substitute for a secret manager or least-privilege process account.
- `quietly` disables output retrieval to conserve memory. It also removes output that diagnostics
  or callers might need, so retain bounded output when it is operationally important.
- `run` and `start` can receive an output callback for incremental stdout/stderr. Output chunks may
  split arbitrary boundaries; do not assume one callback equals one complete line.
- `start` launches asynchronously and returns an invoked process with `running`, `id`, `signal`,
  `stop`, output access, timeout checks, and `wait`. Long-running loops should call
  `ensureNotTimedOut`; application shutdown needs an explicit ownership and cleanup policy.
- `Process::pool` starts multiple asynchronous processes and can name them with `as`; `wait`
  returns keyed results. `Process::concurrently` starts a pool and waits immediately.
- `Process::pipe` feeds each successful process's stdout into the next process synchronously and
  returns the last result; the pipeline stops advancing after a failed stage. Each stage still
  needs safe argument construction, timeouts, and an understood output-size bound.
- Process fakes record invocations. `Process::fake` supports default, pattern-specific, sequence,
  failure, and asynchronous lifecycle results. Unmatched commands run for real unless
  `Process::preventStrayProcesses()` is enabled.
- Assertions include `assertRan`, `assertDidntRun`, and `assertRanTimes`; assertion closures can
  inspect a `PendingProcess` and its result. Assert configuration and observable application
  outcome, not only that some command string appeared.

## Correct Pattern

### Preserve collection intent and cardinality

Prefer non-mutating transforms for derived data, state the key shape, and use strict comparisons
for identifiers:

```php illustrative
use Illuminate\Support\Collection;

/** @param Collection<int, array{id: string, enabled: bool, name: string}> $records */
function enabledNames(Collection $records, string $requiredId): Collection
{
    return $records
        ->filter(fn (array $record): bool => $record['enabled'] === true)
        ->filter(fn (array $record): bool => $record['id'] === $requiredId)
        ->map(fn (array $record): string => trim($record['name']))
        ->reject(fn (string $name): bool => $name === '')
        ->values();
}
```

Use a lazy upstream source for large streams and keep the terminal operation bounded:

```php illustrative
Order::query()
    ->where('status', 'pending')
    ->orderBy('id')
    ->cursor()
    ->filter(fn (Order $order): bool => $order->shouldBeExported())
    ->take(10_000)
    ->each(function (Order $order) use ($writer): void {
        $writer->write($order->toExportRow());
    });
```

If mutation is intentional, make the removed value and remaining collection separate variables:

```php illustrative
$queue = collect(['first', 'second', 'third']);
$next = $queue->shift();

// $next === 'first'; $queue now contains ['second', 'third'].
```

### Keep formatting separate from trust decisions

Use helpers for shape and presentation, then validate against the actual boundary:

```php illustrative
use Illuminate\Support\Str;

$payload = $request->validated();
$displayName = Str::squish((string) data_get($payload, 'profile.display_name', ''));
$callbackUrl = (string) data_get($payload, 'callback_url', '');

if (! Str::isUrl($callbackUrl, ['https'])) {
    throw ValidationException::withMessages(['callback_url' => 'Use a valid HTTPS URL.']);
}

// A server-side fetch still needs host/IP/port/redirect and egress enforcement.
```

Render ordinary untrusted text through escaped Blade output:

```blade illustrative
<h1>{{ $displayName }}</h1>
```

When the product explicitly supports untrusted Markdown, configure the renderer defensively and
only use raw Blade output for the resulting, reviewed rendering boundary:

```php illustrative
$renderedMarkdown = Str::markdown($validatedMarkdown, [
    'html_input' => 'strip',
    'allow_unsafe_links' => false,
]);
```

```blade illustrative
{{-- Raw output is permitted here only because the server-side Markdown policy is the trust boundary. --}}
{!! $renderedMarkdown !!}
```

If the application permits a richer HTML subset, use a maintained sanitizer configured for that
subset before raw output. `toHtmlString()` alone must never be the sanitizer.

### Bind abstractions at a real boundary

Use a project-owned contract when the application genuinely needs replaceable infrastructure:

```php illustrative
namespace App\Contracts;

interface PaymentGateway
{
    public function charge(string $idempotencyKey, int $amountMinor): string;
}
```

```php illustrative
use App\Contracts\PaymentGateway;
use App\Payments\ConfiguredPaymentGateway;

$this->app->bind(PaymentGateway::class, ConfiguredPaymentGateway::class);
```

```php illustrative
final class CapturePayment
{
    public function __construct(private PaymentGateway $gateway) {}

    public function handle(Order $order): string
    {
        return $this->gateway->charge(
            idempotencyKey: "order:{$order->getKey()}:capture",
            amountMinor: $order->amount_minor,
        );
    }
}
```

Prefer a concrete injected class when no substitution boundary exists. Select `singleton` or
`scoped` only after checking mutability and the actual worker/container lifecycle.

### Invoke external processes without a shell injection surface

Pass dynamic values as separate arguments, set explicit operational bounds, and handle failure:

```php illustrative
use Illuminate\Support\Facades\Process;

$command = [
    PHP_BINARY,
    base_path('artisan'),
    'reports:render',
    "--report={$report->getKey()}",
];

$result = Process::path(base_path())
    ->input(json_encode($options, JSON_THROW_ON_ERROR))
    ->timeout(30)
    ->idleTimeout(10)
    ->env([
        'REPORT_FORMAT' => 'pdf',
        'UNRELATED_INHERITED_SECRET' => false,
    ])
    ->run($command)
    ->throw();

$artifactPath = trim($result->output());
```

The executable and working directory should come from trusted configuration, not request input.
Standard input avoids exposing a payload as a shell fragment, but the child process must still
validate it and the parent must avoid logging sensitive input.

For status-only commands with potentially large output, opt out explicitly:

```php illustrative
Process::path(base_path())
    ->timeout(120)
    ->quietly()
    ->run([PHP_BINARY, base_path('artisan'), 'search:reindex'])
    ->throw();
```

Own asynchronous cleanup and timeout checks:

```php illustrative
$process = Process::timeout(120)->idleTimeout(20)->start($command);

try {
    while ($process->running()) {
        $process->ensureNotTimedOut();
        usleep(100_000);
    }

    $result = $process->wait()->throw();
} finally {
    if ($process->running()) {
        $process->stop(timeout: 5);
    }
}
```

Use named pools when tasks are independent and resource capacity is known:

```php illustrative
use Illuminate\Process\Pool;

$pool = Process::pool(function (Pool $pool) use ($tenantIds): void {
    foreach ($tenantIds as $tenantId) {
        $pool->as("tenant-{$tenantId}")
            ->timeout(60)
            ->command([PHP_BINARY, base_path('artisan'), 'tenant:sync', (string) $tenantId]);
    }
})->start();

foreach ($pool->wait()->collect() as $result) {
    $result->throw();
}
```

Use an array command for every pipeline stage when any argument is dynamic:

```php illustrative
use Illuminate\Process\Pipe;

$result = Process::pipe(function (Pipe $pipe) use ($file, $needle): void {
    $pipe->path(storage_path('app/exports'))->command(['cat', $file]);
    $pipe->command(['grep', '-F', '--', $needle]);
})->throw();
```

The example assumes trusted, available `cat` and `grep` binaries and a validated file name rooted
under the working directory. Prefer a PHP-native implementation when portability or path safety is
more important than process composition.

## Incorrect Pattern

```php illustrative
$records = collect($rows);

// map returns a new collection; this leaves $records unchanged.
$records->map(fn (array $row): array => normalize($row));

// transform mutates the original despite the new-looking variable name.
$normalized = $records->transform(fn (array $row): array => normalize($row));

// pop returns the removed value, not the remaining collection.
$remaining = $records->pop();

// Loose comparison may equate different identifier types.
if ($records->contains($request->input('id'))) {
    // ...
}
```

```php illustrative
// The source is already fully loaded; lazy() cannot recover that memory.
$users = User::all()->lazy();

// Materializes the entire lazy stream and defeats streaming.
$allUsers = User::cursor()->all();

// Re-enumeration retains every encountered value in memory.
$foreverGrowing = User::cursor()->remember();
```

```blade illustrative
{{-- Unescaped user-controlled HTML is an XSS boundary violation. --}}
{!! $request->input('biography') !!}
```

```php illustrative
// HtmlString marks content as trusted; it does not clean it.
$trusted = Str::of($request->input('biography'))->toHtmlString();

// URL syntax alone does not make a server-side request destination safe.
Http::get(Str::isUrl($url) ? $url : throw new InvalidArgumentException());

// Slugs can collide and must not be authorization credentials.
$document = Document::where('slug', Str::slug($request->input('title')))->firstOrFail();

// Swallows a failure whose distinction is required by the caller.
$charged = rescue(fn () => $gateway->charge($order), false, report: false);

// Retrying a non-idempotent charge may duplicate the side effect.
retry(5, fn () => $gateway->charge($order));
```

```php illustrative
// Service locator hides the dependency and makes lifetime behavior implicit.
final class ReportBuilder
{
    public function build(): void
    {
        app(ReportRepository::class)->write();
    }
}

// An interface with one implementation and no boundary is not automatically useful.
interface ReportNameFormatterInterface {}
final class ReportNameFormatter implements ReportNameFormatterInterface {}
```

```php illustrative
// Critical command injection: request data is interpreted by a shell.
$result = Process::run('convert '.$request->input('source').' '.$request->input('target'));

// A failed process still returns a result; this may store stderr or an empty value as success.
Artifact::create(['path' => trim($result->output())]);

// Unbounded runtime can leak workers and exhaust host capacity.
Process::forever()->start($request->input('command'));

// Secrets in arguments can be visible in process listings and logs.
Process::run(['vendor-cli', '--token', config('services.vendor.secret')]);
```

Do not treat `escapeshellarg` around one interpolated fragment as proof that a complex shell string
is safe. Prefer an argument array and avoid the shell entirely. If shell syntax is genuinely
required, keep the program and syntax fixed, allowlist every variable choice, document the
remaining platform-specific risk, and test on each supported operating system.

## Failure Modes

### Data transformation

- A caller ignores the collection returned by `map`, `filter`, or `values`, so intended changes
  never take effect.
- A shared collection is changed by `transform`, `forget`, `pull`, `pop`, `push`, `put`, `shift`,
  or `splice`, producing action-at-a-distance.
- Code chains after `pull`, `pop`, or `shift` as though the return value were the collection.
- Preserved keys serialize to a JSON object when the client contract expected a JSON array.
- Loose comparisons merge or match values such as numeric strings, integers, booleans, and nulls.
- `first()` returns `null` and later code fails far from the missing-cardinality boundary.
- A supposedly lazy pipeline begins from `Model::all()` or ends in `all()` / `collect()`, so memory
  still grows with the entire dataset.
- A lazy side effect never runs because the sequence is never enumerated, or runs twice because
  the sequence is enumerated twice.
- `remember()` turns a streaming job into an unbounded in-memory cache.
- Relation access in a cursor loop creates N+1 queries or conflicts with database cursor limits.

### Helpers, strings, and output

- A wildcard `data_set` / `data_forget` path changes more nested records than intended.
- `blank(false)` or `blank(0)` is assumed true, changing validation or defaulting behavior.
- A `tap` callback return value is silently discarded.
- `once` is mistaken for cross-request cache, or state persists unexpectedly in a long-lived
  worker because lifecycle assumptions were not tested.
- `rescue` converts a security or data-integrity exception into an ordinary value and processing
  continues.
- `retry` repeats a non-idempotent external side effect or retries permanent failures.
- Raw Blade output, `HtmlString`, Markdown HTML, or a macro crosses a trust boundary without
  sanitization and causes stored or reflected XSS.
- `Str::isUrl` is used as an SSRF control; a syntactically valid URL reaches internal services.
- A slug collision returns another record, a masked secret remains available in logs, or Base64 is
  treated as confidentiality.
- Random strings are too short, never expire, are stored in plaintext, or are compared without
  the protocol's required timing and replay controls.

### Container and contracts

- An interface has no binding and resolution fails only on a rarely executed path.
- A singleton captures request, tenant, locale, authentication, or mutable DTO state and leaks it
  across requests in Octane or another long-lived worker.
- A transient expensive client is rebuilt repeatedly, while a stateful client is incorrectly made
  singleton; both stem from an unexamined lifetime.
- Contextual bindings make two consumers behave differently with no test proving the distinction.
- A package relies on an application-specific concrete implementation despite advertising only an
  `illuminate/contracts` dependency.
- Excess one-to-one interfaces and repository wrappers obscure Laravel-native behavior without a
  real substitution or domain boundary.
- Hidden `app()` lookups make dependency graphs, test isolation, and failure timing unpredictable.

### Processes

- Request-controlled text is interpolated into a string command and interpreted by the shell.
- A relative executable or working directory resolves differently in a queue, scheduler, web
  worker, container, or production release path.
- `run` returns a failed result that the application treats as success because neither `throw` nor
  an exit check is used.
- A timeout is absent, excessively high, or lower than legitimate work; a quiet command triggers
  `idleTimeout` even though it is making progress.
- `forever` or an orphaned async child consumes CPU, memory, file descriptors, locks, or deployment
  capacity after its request/job owner exits.
- Captured stdout/stderr exhausts memory, while `quietly` removes the only useful diagnostic.
- Secrets leak through command arguments, inherited environment variables, debug logs, exception
  messages, process listings, or captured output.
- The child process runs with broader filesystem/network permissions than the application action
  requires.
- An unrestricted pool starts too many binaries at once and saturates the host.
- One pipeline stage buffers huge output, fails, or emits binary data that the next stage or PHP
  string handling cannot safely consume.
- A test fake pattern does not match and silently executes a real destructive command because
  stray processes were not prevented.
- A fake always returns success, leaving non-zero exits, timeouts, partial output, and cleanup
  paths untested.

## Trade-offs

Collections make transformations expressive and composable, while arrays can be clearer for a
small fixed structure and avoid wrapper overhead. A lazy collection reduces peak memory only when
the source and downstream operations remain lazy; it adds deferred execution, resource-lifetime,
and repeated-enumeration complexity.

Mutation can be efficient and appropriate in a small local scope, but derived collections are
easier to reason about when data is shared. Preserving keys carries identity through a pipeline;
resetting keys produces predictable JSON arrays but discards that identity.

Helpers reduce boilerplate, but dense chains can hide evaluation, exception, and return-value
semantics. `Str` normalization improves presentation, not trust. Escaped plain text is safer and
simpler than rich HTML; Markdown or HTML support requires a narrow rendering policy and more
security tests.

Contracts provide explicit dependencies and replacement seams, while facades provide concise
Laravel-native access and built-in faking. Extra abstractions carry naming, binding, navigation,
and maintenance cost. Container lifetimes can reduce construction cost but increase shared-state
risk, especially under long-lived workers.

External processes reuse mature operating-system tools and isolate some workloads, but introduce
shell, platform, permission, timeout, observability, deployment, and resource-management risks. A
PHP-native library is often more portable and testable. Synchronous execution simplifies ownership
but blocks the worker; asynchronous execution and pools improve overlap at the cost of cleanup and
capacity control. Pipelines are concise but can obscure which stage failed and how much data is
buffered.

## Version and Package Boundaries

- Resolve the installed Laravel version before using a collection, helper, string, container
  attribute, or process API. Method availability and signatures may differ across major/minor
  versions.
- This reference targets the pinned Laravel 13 framework and documentation. Live 13.x docs are a
  freshness check; pinned source remains the reproducible baseline.
- Base collections, lazy collections, and Eloquent collections do not have identical method and
  identity behavior. Preserve the concrete type in reviews and tests.
- Markdown behavior is implemented through the installed CommonMark packages. Confirm supported
  options and security behavior against the locked versions before changing sanitizer policy.
- `Str::slug` transliteration and Unicode behavior can depend on PHP extensions and supporting
  packages. Test the application's actual languages.
- Container attributes and scoped lifecycle behavior depend on the framework version and runtime.
  Inspect Octane, queue worker, serverless, and package boot behavior when present.
- Laravel Process wraps Symfony Process. Executable availability, signal support, TTY behavior,
  quoting, paths, and exit codes vary across Unix, Windows, containers, and hosting platforms.
- Array commands are verified in the pinned Laravel 13 `PendingProcess` source. If supporting an
  older Laravel version, verify that version before prescribing the same signature.
- `cat`, `grep`, ImageMagick, FFmpeg, Node, Python, office converters, and other executables are
  external deployment dependencies. Do not add one unless detected or explicitly requested.
- Facade fakes apply to Laravel's Process facade, not arbitrary direct Symfony Process instances
  or native `proc_open` calls.
- Package code should document its required `illuminate/contracts` version and avoid assuming a
  full Laravel application unless declared.

## Testing

### Collections, helpers, and strings

- Assert both the returned value and the original collection for every method whose mutation
  semantics matter.
- Cover empty collections, missing keys, duplicate keys, sparse numeric keys, nulls, zero, false,
  numeric strings, strict identifiers, and nested `Arrayable` values.
- Prove output key shape with `array_is_list`, exact JSON, or contract assertions when an API
  distinguishes arrays from objects.
- For lazy flows, use a generator with an enumeration counter. Assert that construction performs no
  work, `take(n)` pulls only the required items, and accidental materialization is absent.
- Measure peak memory with a production-sized fixture when streaming is the reason for the design.
- Test partial enumeration, repeated enumeration, exceptions during generation, resource cleanup,
  and the memory effect of `remember()`.
- Test `blank` / `filled` with `''`, whitespace, `null`, `[]`, an empty collection, `0`, `true`, and
  `false`.
- Test `tap`, `once`, `rescue`, and `retry` for their exact return values, reporting behavior,
  attempt count, delay policy, and idempotency key reuse.
- Render templates and assert dangerous HTML is escaped. For Markdown, cover raw HTML, `javascript:`
  links, malformed markup, encoded payloads, and the configured sanitizer allowlist.
- Reset faked UUID/random-string factories and registered macro state between tests when the
  framework test helper does not already do so.

### Contracts and container behavior

- Resolve every application contract in a container test so missing bindings fail before a rare
  production path.
- Substitute a fake implementation and assert the consumer's observable behavior, not merely that
  the container returns a class name.
- Test contextual bindings for each consumer and environment they distinguish.
- Under long-lived runtime support, run sequential requests/jobs with different users or tenants
  to detect singleton/scoped state leaks.
- Verify package tests with only declared Composer dependencies, including the supported
  `illuminate/contracts` range.

### Process behavior

Prevent accidental real execution, provide only expected fakes, and inspect the pending process:

```php illustrative
use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Process;

Process::preventStrayProcesses();
Process::fake([
    '*artisan reports:render*' => Process::result(
        output: storage_path('app/reports/example.pdf').PHP_EOL,
        exitCode: 0,
    ),
]);

$artifact = $service->render($report, []);

Process::assertRan(function (PendingProcess $process, ProcessResult $result) use ($report): bool {
    return is_array($process->command)
        && in_array("--report={$report->getKey()}", $process->command, true)
        && $process->path === base_path()
        && $process->timeout === 30
        && $process->idleTimeout === 10
        && $result->successful();
});

expect($artifact)->toEndWith('.pdf');
```

- Add failed-result, stderr, timeout, malformed-output, empty-output, and cleanup tests. A fake
  success path alone is insufficient.
- Use `assertDidntRun` for authorization and validation failures, and `assertRanTimes` where
  deduplication or retry count is part of the contract.
- Use `Process::sequence` for retries and `Process::describe` for asynchronous running/output/exit
  lifecycles.
- Test that dynamic arguments remain distinct array entries; include spaces, quotes, semicolons,
  command substitution text, leading dashes, Unicode, and newlines as hostile fixtures.
- Assert secrets are absent from command arrays, logs, exception messages, and returned API data.
- Test pool partial failure and keyed result handling. Test pipeline failure at every stage and
  verify later stages do not run after a failed stage.
- Run a small integration test against the real pinned binary only in an isolated environment with
  non-destructive fixtures, least privileges, explicit timeouts, and no production credentials.
- Verify on every supported operating system or container image when paths, signals, TTY, quoting,
  or executable packages affect behavior.

## Grounding

Classification: `official` for documented collection, lazy collection, helper, string, contract,
container, and process APIs; `official-source` for Laravel 13 array-command handling and pipeline
failure flow observed in the pinned framework implementation; `derived` for abstraction thresholds,
strict-comparison selection, escaping boundaries, injection avoidance, capacity limits, secret
handling, idempotency, and operational guidance.

Verified against the pinned Laravel 13 documentation and framework source identified by
`source-lock.json`, plus the live official documentation freshness check:

- https://laravel.com/docs/13.x/collections
- https://laravel.com/docs/13.x/helpers
- https://laravel.com/docs/13.x/strings
- https://laravel.com/docs/13.x/contracts
- https://laravel.com/docs/13.x/container
- https://laravel.com/docs/13.x/processes
- https://github.com/laravel/framework/blob/v13.19.0/src/Illuminate/Process/PendingProcess.php
- https://github.com/laravel/framework/blob/v13.19.0/src/Illuminate/Process/Pipe.php
- https://github.com/laravel/framework/blob/v13.19.0/src/Illuminate/Process/Pool.php

Process portability and resource behavior must also be checked against the locked Symfony Process
version, target operating system/container, and each external executable's primary documentation.
Markdown safety must also be checked against the installed CommonMark version and the application's
sanitizer policy.
<!-- END: references/collections-strings-processes.md -->

<!-- BEGIN: references/deployment-operations.md -->
# Deployment and Operations

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for Laravel production builds, server configuration, environment ownership,
cache compilation, migrations, maintenance mode, health checks, queue and long-running service
reloads, scheduler operation, rollback planning, and deployment verification.

Inspect the actual platform, release script, container image, process supervisor, database engine,
shared storage, queue, cache, secrets mechanism, and observability before proposing commands. A
Laravel Cloud, Forge, container, serverless, and traditional VM deployment have different control
planes even when the application commands overlap.

## Verified Laravel 13 Behavior

- Laravel 13 requires a supported PHP runtime and documented PHP extensions. The skill baseline is
  PHP 8.3+, but the deployed Composer platform and locked dependencies remain authoritative.
- The web-server document root points to the application's `public` directory and requests route
  through `public/index.php`; serving the repository root can expose private files.
- The web process needs write access to `storage` and `bootstrap/cache`.
- `php artisan optimize` caches configuration, events, routes, and views for production.
- After `config:cache`, `.env` is not loaded during requests and `env` calls outside configuration
  return `null`. Application code should read `config(...)` instead.
- Route caching requires serializable/cacheable route definitions; verify the command against the
  project's routes.
- Laravel 13 provides `php artisan reload` to terminate reloadable long-running services such as
  queue workers, Reverb, and Octane so a process monitor can start them on new code.
- Laravel Cloud handles service reloads automatically; other platforms need a supervisor or
  orchestrator to restart exited services.
- The configured health route, conventionally `/up`, can be used by uptime monitors or load
  balancers and can dispatch a health-checking event.
- Production debug mode should be disabled to prevent sensitive configuration and stack details
  from being exposed.
- Scheduler execution still requires platform scheduling or a supervised scheduler process.

## Correct Pattern

Build an immutable release from locked dependencies, validate it, migrate with a compatibility
plan, atomically activate it where the platform permits, then reload long-running processes.

```php illustrative
// Application code reads cached configuration, not env() directly.
$endpoint = config('services.partner.url');

if (! is_string($endpoint) || $endpoint === '') {
    throw new RuntimeException('Partner endpoint is not configured.');
}
```

A platform-neutral command sequence must be adapted to the repository and deployment system:

```text
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
<locked package manager install>
<project test and static-analysis commands>
<project production asset build>
php artisan migrate --force
php artisan optimize
php artisan reload
```

Run database changes according to the migration's compatibility and locking risk, not merely its
position in this example. Verify the new health endpoint, a real read/write path, workers, scheduler,
and critical integrations before declaring the deployment healthy.

Configure the web server with `public` as its root, deny hidden files, pass only the front
controller to PHP, and terminate TLS at a trusted layer. Store secrets outside the image/repository
and inject them through the platform's secret mechanism.

## Incorrect Pattern

```php illustrative
// Breaks after config:cache and spreads environment lookup through application logic.
$apiKey = env('PARTNER_API_KEY');

// Unsafe: debug behavior is forced in source rather than environment-owned configuration.
config(['app.debug' => true]);
```

```text
# Unsafe examples:
chmod -R 777 .
php -S 0.0.0.0:80 -t .
git pull && php artisan migrate --force
```

Do not combine an irreversible migration, code activation, and process restart without a rollback
or forward-fix plan. Do not print environment values, tokens, connection strings, or private keys
in CI logs.

## Failure Modes

- The web root exposes `.env`, storage, Composer metadata, or application source.
- A build succeeds locally but production lacks a PHP extension or uses a different platform.
- Asset compilation is omitted and the Vite manifest is missing.
- Config cache captures missing or stale values, or source code still calls `env` directly.
- Route caching fails because a route definition is incompatible with caching.
- A destructive migration locks a large table or deploys before compatible application code.
- Old workers continue executing old code after the web release changes.
- A process is reloaded but no supervisor restarts it.
- Scheduler invocations overlap or never run.
- Ephemeral local storage loses uploads or conflicts across replicas.
- Session/cache drivers are not shared across load-balanced instances.
- Health checks pass while the database, queue, or required dependency is unavailable.
- Rollback restores code whose schema assumptions no longer match the migrated database.
- Permissions are broadened globally instead of assigning the minimum writable directories.

## Trade-offs

Maintenance mode simplifies coordinated changes but creates downtime unless secret bypass or
pre-rendering is used. Atomic/rolling deployments reduce downtime but require backward-compatible
schema and cache behavior. Building once improves reproducibility; building on each server reduces
artifact infrastructure but increases drift.

`optimize` improves bootstrap performance and catches some configuration problems, but cache files
must be rebuilt for every release. A shallow liveness check is fast and stable; deeper readiness
checks provide confidence but may amplify dependency outages and need careful timeouts.

## Version and Package Boundaries

- `php artisan reload` is part of the verified Laravel 13 deployment behavior; use version-
  appropriate worker commands when the detected application is older.
- Horizon, Octane, Reverb, Vapor, Envoy, Sail, Forge, and Cloud are optional products/packages with
  their own deployment contracts.
- Database migration safety differs across MySQL, PostgreSQL, SQLite, and managed database versions.
- Serverless and read-only filesystems change cache, session, storage, and temporary-file behavior.
- Do not introduce a deployment platform or optional runtime package without project evidence or an
  explicit user request.

## Testing

- Build the same immutable artifact in CI using locked Composer and frontend dependencies.
- Run unit, feature, integration, static-analysis, formatting, and production asset-build checks.
- Execute `php artisan optimize` in a production-like environment and boot the application from the
  resulting caches.
- Validate migrations against production database engines and representative data volume; inspect
  SQL locks and rollback/forward-fix behavior.
- Smoke-test public routes, authentication/session behavior, file storage, queues, scheduler, cache,
  mail, and critical integrations.
- Confirm `APP_DEBUG=false`, secure headers/TLS, writable directories, and absence of leaked secrets.
- Verify that reloadable services restart, consume a canary job, and report the new release version.
- Exercise backup restore and release rollback procedures before relying on them during an incident.

## Grounding

Classification: `official` for Laravel commands and `derived` for release engineering.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/deployment
- https://laravel.com/docs/13.x/configuration#configuration-caching
- https://laravel.com/docs/13.x/migrations#running-migrations
- https://laravel.com/docs/13.x/queues#queue-workers-and-deployment
- https://laravel.com/docs/13.x/scheduling
- https://laravel.com/docs/13.x/maintenance-mode

Platform-specific deployment details must be verified against the selected platform's current
primary documentation and the repository's own runbook.
<!-- END: references/deployment-operations.md -->

<!-- BEGIN: references/eloquent-models-relationships.md -->
# Eloquent Models, Relationships, Casts, and Serialization

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for Eloquent model configuration, mass assignment, casts, accessors and
mutators, relationships, pivots, polymorphism, soft deletes, factories, route-bound models, eager
loading, and array/JSON serialization. Inspect the schema, model traits, global scopes, resources,
policies, factories, and query call sites before changing a model contract.

Model relationships express domain cardinality and ownership. Do not create a relationship only
because one screen needs a display value; verify the underlying key, constraint, lifecycle, and
authorization meaning.

## Verified Laravel 13 Behavior

- Eloquent models conventionally map a singular class to a plural snake-case table and use `id`
  as the primary key. Override table, key type, incrementing behavior, or connection explicitly
  when the schema differs.
- Mass assignment through `create`, `fill`, and `update` is governed by `$fillable` or
  `$guarded`. Direct property assignment is a separate path.
- Laravel can prevent silently discarded mass-assignment attributes in local development through
  `Model::preventSilentlyDiscardingAttributes`.
- A model may define casts through a protected `casts(): array` method. Built-in casts include
  booleans, dates, immutable dates, arrays/JSON, encrypted values, collections, and enums.
- Relationship methods return relation objects such as `BelongsTo`, `HasMany`, and
  `BelongsToMany`. Custom foreign and owner keys are supported when conventions do not match.
- Eager loading with `with` or `load` avoids repeated lazy-load queries. Laravel can prevent lazy
  loading so hidden N+1 behavior becomes visible during development or testing.
- Many-to-many relationships use an intermediate table; `withPivot`, `withTimestamps`, custom
  pivot models, and pivot constraints define additional behavior.
- Polymorphic type columns contain model-type identifiers. An enforced morph map keeps stored
  identifiers independent from PHP class names.
- `$hidden`, `$visible`, and `$appends` affect model array/JSON serialization. They are not a
  substitute for a deliberate public API Resource.
- Soft deletes add a global scope and populate `deleted_at`; normal queries omit deleted rows
  unless `withTrashed` or `onlyTrashed` is selected.

## Correct Pattern

Align casts and relationships with the schema, use explicit mass-assignment fields, and provide
typed relationship return values:

```php illustrative
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Product extends Model
{
    protected $fillable = [
        'shop_id',
        'name',
        'price_minor',
        'status',
        'metadata',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'price_minor' => 'integer',
            'metadata' => 'array',
            'published_at' => 'immutable_datetime',
            'status' => ProductStatus::class,
        ];
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function orderLines(): HasMany
    {
        return $this->hasMany(OrderLine::class);
    }

    protected function normalizedName(): Attribute
    {
        return Attribute::get(
            fn (): string => mb_strtolower($this->name),
        );
    }
}
```

Back a many-to-many relation with database uniqueness and expose pivot fields intentionally:

```php illustrative
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class)
        ->withPivot(['granted_by'])
        ->withTimestamps();
}

// Migration:
$table->unique(['user_id', 'role_id']);
```

Load what the caller's output contract needs, then let a Resource avoid accidental lazy loading:

```php illustrative
$product = Product::query()
    ->with(['shop:id,name'])
    ->withCount('orderLines')
    ->findOrFail($productId);

return ProductResource::make($product);
```

Use `Relation::enforceMorphMap` before persisting polymorphic types when class-name stability or
cross-service identifiers matter. Treat changing an existing morph map as a data migration.

## Incorrect Pattern

```php illustrative
final class Product extends Model
{
    // Unsafe default: any request key may become assignable.
    protected $guarded = [];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}

// Hidden N+1: one query for products, then one query per shop.
foreach (Product::all() as $product) {
    echo $product->shop->name;
}

// Leaks every currently serializable column and loaded relation.
return response()->json(Product::findOrFail($id));
```

Avoid querying, issuing remote calls, or mutating state from accessors. Those methods may execute
during logging, serialization, debugging, queue serialization, or template rendering.

## Failure Modes

- A request field becomes mass assignable and changes ownership, role, price, or internal state.
- A misspelled fillable field is silently discarded and the caller assumes it was persisted.
- A cast does not match the column, causing precision loss, timezone drift, or invalid enum values.
- An accessor triggers queries repeatedly while a collection is serialized.
- A relation uses the wrong foreign key or cardinality and authorization checks traverse the wrong
  owner.
- A pivot allows duplicates because only application checks enforce uniqueness.
- A polymorphic type stores PHP class names, then a namespace refactor breaks existing rows.
- A resource accesses an unloaded relation and creates an N+1 query.
- A model returned directly exposes hidden operational columns or newly added attributes.
- Soft-deleted rows collide with a unique constraint because restore and reuse semantics were not
  designed.
- A global scope silently changes admin, export, queue, or maintenance queries.
- A queued model is restored later with different database state than the dispatcher observed.

## Trade-offs

`$fillable` is explicit and safer at input boundaries but requires maintenance when fields are
added. `$guarded` can be practical for internal-only models, but `$guarded = []` increases the
cost of every caller mistake.

Eager loading uses more data per query but prevents latency multiplication. Loading every
relationship by default simplifies callers while increasing memory and serialization risk.

Polymorphic relations reduce table count for genuinely shared behavior but weaken ordinary
foreign-key enforcement and complicate reporting. Explicit relations are easier to constrain when
the set of related types is small and stable.

## Version and Package Boundaries

- Confirm the installed Laravel version before adopting model attributes or helpers from newer
  live documentation.
- Native enum casts require PHP enums and compatible stored values; migration and fallback
  behavior remain application decisions.
- Database JSON, decimal, collation, timezone, and soft-delete uniqueness behavior varies by
  driver.
- `preventLazyLoading` and other strictness methods should normally be enabled conditionally so a
  production-only path does not fail unexpectedly without prior test coverage.
- Third-party sluggable, activity-log, translatable, tenancy, media, and state-machine packages
  own additional model behavior. Load their installed-version docs only when detected or
  explicitly requested.

## Testing

- Test mass assignment with allowed and sensitive attributes.
- Test every relationship's cardinality, custom keys, pivot metadata, and delete behavior.
- Assert cast round trips for enum, date/time, decimal/minor-unit money, JSON, encrypted, and null
  values used by the model.
- Enable lazy-loading prevention in tests that exercise collection serialization and Blade views.
- Assert public Resource output separately from model array serialization.
- Test soft delete, restore, force delete, uniqueness, and route binding behavior.
- Test polymorphic mappings against persisted aliases, including any legacy value migration.
- Use factories to create valid relationship graphs and named edge states.
- Add a production-driver test where JSON queries, case sensitivity, precision, or uniqueness
  semantics affect behavior.

## Grounding

Classification: `official` for Eloquent APIs and `derived` for domain-modeling and serialization
boundaries. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/eloquent
- https://laravel.com/docs/13.x/eloquent-relationships
- https://laravel.com/docs/13.x/eloquent-mutators
- https://laravel.com/docs/13.x/eloquent-serialization
- https://laravel.com/docs/13.x/eloquent-factories
- https://laravel.com/docs/13.x/eloquent-resources

Package traits can alter queries, events, serialization, and deletion. Inspect the installed trait
source and package tests before treating those behaviors as Eloquent core.
<!-- END: references/eloquent-models-relationships.md -->

<!-- BEGIN: references/errors-logging-observability.md -->
# Errors, Logging, and Observability

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for exception reporting and rendering, API error behavior, log channels and
stacks, contextual logging, request correlation, production debug settings, health signals,
metrics, traces, and package boundaries for Telescope, Pulse, or external observability systems.

Inspect `bootstrap/app.php`, `config/app.php`, `config/logging.php`, exception classes, API response
conventions, infrastructure log collection, and installed observability packages. Preserve a valid
project error contract unless a security or correctness defect requires escalation.

## Verified Laravel 13 Behavior

- Laravel exception behavior is configured in `bootstrap/app.php` through the application's
  `withExceptions` callback.
- `report` callbacks add custom reporting. Returning `false` or calling the documented stop method
  controls propagation to default reporting.
- `render` callbacks customize HTTP responses for selected exceptions.
- `shouldRenderJsonWhen` can decide when exceptions should be rendered as JSON beyond normal
  request content negotiation.
- `dontReport`, `stopIgnoring`, exception log levels, throttling, and duplicate-report prevention
  are available configuration tools.
- The global `report` helper can report an exception while allowing request handling to continue.
- `APP_DEBUG` controls detail rendered to users. Official deployment guidance requires it to be
  false in production because debug responses can expose sensitive configuration.
- Logging channels are configured in `config/logging.php`; stack channels combine multiple
  channels.
- `Log::withContext` adds context to the current channel, while `Log::shareContext` shares context
  with existing and subsequently created channels.
- The Context facade can carry contextual information across logs and queued job boundaries.
- Laravel's default health route is configurable in application bootstrap. It is a liveness
  endpoint, not automatically a complete dependency-readiness assessment.

## Correct Pattern

Render stable client-safe errors, report useful server context, and keep secrets and payloads out
of logs. Use a correlation identifier across request, log, job, and outbound integration metadata.

```php illustrative
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->report(function (PartnerUnavailable $exception): void {
        Log::warning('Partner request failed', [
            'partner' => $exception->partner(),
            'operation' => $exception->operation(),
        ]);
    });

    $exceptions->shouldRenderJsonWhen(
        fn (Request $request, Throwable $exception): bool =>
            $request->is('api/*') || $request->expectsJson()
    );
})
```

Add structured request context early in middleware:

```php illustrative
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

public function handle(Request $request, Closure $next): Response
{
    $requestId = $request->headers->get('X-Request-ID', (string) Str::uuid());
    Log::shareContext(['request_id' => $requestId]);

    $response = $next($request);
    $response->headers->set('X-Request-ID', $requestId);

    return $response;
}
```

Log identifiers, operation names, safe status fields, duration, attempt count, and exception type.
Redact authorization headers, cookies, session IDs, passwords, tokens, private keys, and sensitive
domain payloads.

## Incorrect Pattern

```php illustrative
// Unsafe: returns implementation details and secrets to the caller.
return response()->json([
    'error' => $exception->getMessage(),
    'trace' => $exception->getTrace(),
    'environment' => $_ENV,
], 500);

// Unsafe and noisy: dumps the entire request including credentials.
Log::error('Request failed', $request->all());

// Misleading: converts every exception into HTTP 200.
catch (Throwable $exception) {
    return response()->json(['success' => false], 200);
}
```

Do not catch an exception only to suppress it. Do not use logs as an audit ledger without the
durability, access control, retention, and integrity properties required by that domain.

## Failure Modes

- Production debug mode exposes environment or stack details.
- A broad render callback changes browser, API, and console behavior unintentionally.
- Expected client errors flood alerting because reporting and rendering are not separated.
- A custom reporter recursively logs or throws while handling the original exception.
- Sampling hides a low-volume critical error or retains too much high-volume noise.
- Log context leaks between requests in a long-running worker because process state is not reset.
- Queue logs lose the originating request or tenant identifier.
- Sensitive headers, request bodies, model attributes, or signed URLs enter centralized logs.
- Disk logs fill the server because rotation or retention is absent.
- Health checks report success although the database, queue, or external dependency is unusable.
- Metrics labels contain unbounded IDs and create high-cardinality storage costs.
- Telescope or another debugging tool is exposed publicly or retains sensitive payloads.

## Trade-offs

Detailed logs accelerate diagnosis but increase cost and privacy risk. Sampling reduces volume but
can hide rare failures. Centralized structured logs improve correlation; local text logs are
simpler during development. Error responses should be stable and minimal, while server reporting
may remain detailed under controlled access.

Telescope provides deep development inspection. Pulse focuses on application performance signals.
External APM systems may add distributed tracing and infrastructure correlation. These overlap but
are not interchangeable, and each introduces storage, sampling, privacy, and operational work.

## Version and Package Boundaries

- Exception bootstrap APIs are version-sensitive; verify the detected Laravel version.
- Monolog handlers and channel drivers may require separate packages or platform services.
- Telescope, Pulse, Horizon, Octane, Sentry, OpenTelemetry, and other observability integrations
  are package-specific.
- Long-running Octane and queue workers require particular attention to shared mutable context.
- Do not install or deeply configure an observability package unless detected or explicitly
  requested by the user.

## Testing

- Assert client status, JSON shape, content negotiation, and absence of sensitive exception detail.
- Use Laravel's exception-handling test helpers intentionally; do not disable handling when testing
  the production error contract.
- Fake or spy on logs only when the log event itself is required behavior; otherwise assert the
  domain outcome.
- Test correlation IDs across an HTTP request and dispatched job.
- Test reporter failure, throttling/sampling, duplicate reporting, and ignored exceptions where
  configured.
- Validate production `APP_DEBUG=false`, log delivery, rotation, and alert routing during deploy.
- Probe health endpoints from the same network path as the load balancer and separately test
  critical dependency readiness.
- Run a security review of captured fields and retention for logs, traces, Telescope, and Pulse.

## Grounding

Classification: `official` for framework configuration and `derived` for observability policy.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/errors
- https://laravel.com/docs/13.x/logging
- https://laravel.com/docs/13.x/context
- https://laravel.com/docs/13.x/deployment#debug-mode
- https://laravel.com/docs/13.x/deployment#the-health-route
- https://laravel.com/docs/13.x/pulse
- https://laravel.com/docs/13.x/telescope

For external telemetry, verify the installed integration and backend's current primary
documentation before adopting fields, sampling, or transport behavior.
<!-- END: references/errors-logging-observability.md -->

<!-- BEGIN: references/events-broadcasting-scheduling.md -->
# Events, Listeners, Broadcasting, Commands, and Scheduling

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for domain/application events, listeners, queued listeners, subscribers,
broadcast events and channel authorization, Artisan commands, scheduled commands/jobs/callbacks,
mutexes, one-server execution, and scheduler deployment. Inspect event discovery/registration,
queue and broadcast configuration, `routes/channels.php`, `routes/console.php`, cache topology,
timezones, and process supervision before changing flow.

Events communicate that something happened. They should not hide a required synchronous invariant
whose failure must roll back the caller unless that coupling is deliberate and tested.

## Verified Laravel 13 Behavior

- Events may be dispatched with the `event` helper, the `Event` facade, or an event class's
  dispatch support. Listeners may be discovered or registered according to application
  configuration.
- Listener dependencies are resolved by the service container. A listener implementing
  `ShouldQueue` is handled by the configured queue rather than synchronously.
- A queued listener can define connection, queue, delay, retries, backoff, middleware, and failure
  handling similarly to a job.
- Queued listeners dispatched inside database transactions can be configured for after-commit
  handling through the queue connection or the documented after-commit contract.
- `ShouldBroadcast` queues broadcasting; `ShouldBroadcastNow` uses the synchronous broadcast path.
  `broadcastOn` returns one or more channels.
- Private and presence channels require authorization callbacks. The callback determines whether
  the authenticated user may subscribe; client-supplied channel names are not authorization.
- `broadcastWith` controls event payload and `broadcastAs` controls the public event name.
- Schedules are commonly defined in `routes/console.php` with the `Schedule` facade or configured
  through the application bootstrap schedule hook.
- `withoutOverlapping` uses a cache lock; `onOneServer` elects one scheduler across servers using
  a shared lock-capable default cache store.
- A production scheduler normally invokes `php artisan schedule:run` every minute.
  `schedule:work` is useful for foreground/local execution.
- `schedule:list` displays configured tasks and their next run times.

## Correct Pattern

Keep an event immutable enough to describe a completed fact, queue slow listeners, and defer
database-dependent listeners until commit:

```php illustrative
use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;
use Illuminate\Foundation\Queue\Queueable;

final readonly class OrderConfirmed
{
    public function __construct(
        public int $orderId,
    ) {}
}

final class SendOrderConfirmation implements ShouldQueueAfterCommit
{
    use Queueable;

    public function handle(OrderConfirmed $event): void
    {
        $order = Order::query()->findOrFail($event->orderId);

        SendOrderConfirmationMail::dispatch($order->id);
    }
}
```

Broadcast the smallest client contract and authorize the private channel from server-side
ownership:

```php illustrative
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

final readonly class OrderStatusChanged implements ShouldBroadcast
{
    public function __construct(
        public int $orderId,
        public int $customerId,
        public string $status,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("customers.{$this->customerId}")];
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->orderId,
            'status' => $this->status,
        ];
    }
}

Broadcast::channel('customers.{customerId}', function (User $user, int $customerId): bool {
    return $user->id === $customerId;
});
```

Name scheduled tasks, bound their work, and select the overlap/server policy explicitly:

```php illustrative
use Illuminate\Support\Facades\Schedule;

Schedule::command('orders:expire-pending')
    ->name('orders:expire-pending')
    ->everyMinute()
    ->onOneServer()
    ->withoutOverlapping(10)
    ->runInBackground();
```

The command itself should be idempotent and process bounded chunks; scheduler locks do not make
the command's external effects exactly once.

## Incorrect Pattern

```php illustrative
// Leaks the full model and any newly serializable attributes to clients.
final class UserUpdated implements ShouldBroadcast
{
    public function __construct(public User $user) {}

    public function broadcastWith(): array
    {
        return $this->user->toArray();
    }
}

// Every server executes this and overlapping runs are possible.
Schedule::call(fn () => rebuildEverything())
    ->everyMinute();

// UI-provided channel ID is trusted without ownership authorization.
Broadcast::channel('orders.{orderId}', fn () => true);
```

Avoid event/listener cycles, synchronous remote calls hidden in listeners, and anonymous scheduled
closures that cannot be named, observed, or safely coordinated across servers.

## Failure Modes

- A listener is discovered and also registered manually, so it runs twice.
- A queued listener reads rows before the transaction that dispatched the event commits.
- A listener retry repeats a notification or external write.
- An event name or payload changes without coordinating browser/mobile consumers.
- A public channel exposes private tenant or user state.
- A private-channel callback checks authentication but not resource ownership.
- Broadcasting serializes an entire model and leaks hidden or newly added data.
- `ShouldBroadcastNow` adds request latency or fails the user request when the broadcaster is down.
- Every scheduler host runs the same task because the default cache is local.
- A scheduler lock outlives a crashed task and blocks expected runs.
- A task lasts longer than its overlap-lock expiry, allowing a second copy to start.
- Daylight-saving transitions skip or duplicate a timezone-specific schedule.
- `runInBackground` is used for an unsupported task shape or without process supervision/logging.
- The server cron exists, but workers, environment, path, or user differ from the application.

## Trade-offs

Synchronous listeners are simple and can participate in caller failure, but increase latency and
coupling. Queued listeners isolate slow work and failures while introducing eventual consistency,
delivery retries, and worker operations.

Broadcasting provides realtime UX but creates a public, versioned contract and an additional
authorization surface. Polling is less immediate but can be simpler and more resilient for low
frequency updates.

`withoutOverlapping` prevents concurrent runs of one named task; `onOneServer` prevents every
scheduler host from starting it. Using both is often appropriate, but both depend on shared cache
health and correctly sized lock leases.

## Version and Package Boundaries

- Confirm the installed Laravel version before using event, broadcast, or scheduler attributes and
  contracts from live documentation.
- Reverb, Pusher Channels, Ably, and other broadcast transports have separate packages,
  credentials, limits, client protocols, and deployment requirements.
- Redis/database queue timing affects queued listeners and broadcasts; inspect `after_commit` and
  worker configuration.
- `onOneServer` and `withoutOverlapping` require a shared lock-capable default cache store across
  scheduler hosts.
- Scheduler timezone behavior follows PHP/date-time and the configured application/task timezone;
  business-critical schedules should account for daylight-saving transitions.
- Horizon, Echo, Reverb, and frontend broadcast clients are package-specific and loaded only when
  detected or explicitly requested.

## Testing

- Use `Event::fake` narrowly to assert dispatch without hiding listeners that the test is meant to
  exercise.
- Test listeners directly for success, retry, duplicate delivery, missing models, and failure
  handling.
- Assert queued listener connection/queue and after-commit behavior at the transaction boundary.
- Test channel authorization for owner, another tenant, unauthenticated user, and hidden resource.
- Assert broadcast channel, name, and minimal payload without exposing sensitive fields.
- Run `schedule:list` in a smoke test and verify names, frequencies, environments, and timezones.
- Execute scheduled commands directly with representative data and repeated runs.
- Use two scheduler processes with the shared production-like cache to verify `onOneServer` and
  overlap behavior.
- Test task duration beyond normal runtime, lock expiration, crash recovery, and daylight-saving
  boundaries where applicable.
- Verify production cron, application path, user, environment, output logging, and queue workers.

## Grounding

Classification: `official` for Laravel event, listener, broadcasting, console, and scheduling
APIs; `derived` for contract design and operational scheduling guidance. Verified against the
pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/events
- https://laravel.com/docs/13.x/broadcasting
- https://laravel.com/docs/13.x/artisan
- https://laravel.com/docs/13.x/scheduling
- https://laravel.com/docs/13.x/queues
- https://laravel.com/docs/13.x/cache#atomic-locks

Transport delivery guarantees, websocket topology, cron supervision, and timezone behavior must
also be verified against the deployed services.
<!-- END: references/events-broadcasting-scheduling.md -->

<!-- BEGIN: references/filesystem-http-webhooks.md -->
# Filesystem, HTTP Client, and Webhooks

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for configured storage disks, uploaded files, private and public downloads,
outbound HTTP integrations, inbound webhooks, request signatures, retries, timeouts, and
integration fakes. Read the project disk configuration, validation rules, provider contract,
and `composer.lock` before selecting an implementation.

Treat storage paths as identifiers relative to a configured disk. Treat remote responses and
webhook payloads as untrusted boundary input. Keep credentials in configuration sourced from
the environment rather than in controllers, jobs, logs, or committed URLs.

## Verified Laravel 13 Behavior

- `Storage::disk($name)` selects a disk from `config/filesystems.php`; omitting `disk` uses the
  configured default.
- The local disk root is private by default. The conventional public disk writes under
  `storage/app/public` and requires `php artisan storage:link` for web access.
- `UploadedFile::store`, `storeAs`, and the filesystem `putFile` APIs can stream uploads.
  Generated filenames are safer defaults than trusting client-provided names.
- S3, SFTP, scoped, and read-only disks need the corresponding Flysystem adapters documented
  for that driver. Confirm installed packages rather than assuming they exist.
- `Storage::temporaryUrl` is appropriate only for a disk/driver configured to support temporary
  URLs. Authorization still belongs at the application boundary.
- Laravel's HTTP client wraps Guzzle and returns a response object. A 4xx or 5xx response is not
  automatically thrown as an exception unless code calls `throw` or an equivalent method.
- `timeout` limits the response wait; the documented default is 30 seconds. `connectTimeout`
  controls connection establishment separately.
- `retry` repeats configured attempts. Only retry operations that are safe or protected by an
  idempotency mechanism, and bound both attempts and delay.
- `Http::fake` replaces matching outbound calls. `Http::preventStrayRequests` turns any unmatched
  request into a test failure.
- Laravel core does not define one universal incoming-webhook signature format. Verify the raw
  request body according to the provider's timestamp, canonicalization, algorithm, and replay
  requirements before decoding or dispatching work.

## Correct Pattern

Protect the route with authentication, resource authorization, and a dedicated upload rate or
quota policy. Validate the file, place untrusted content under a quarantine prefix on the private
core `local` disk, persist
the path internally, and return an opaque domain resource instead of the storage path. Run
malware scanning or content disarm and reconstruction when the accepted types and threat model
require it; publish or make the file downloadable only after that state transition succeeds.

```php illustrative
use App\Http\Controllers\CustomerDocumentController;
use Illuminate\Support\Facades\Route;

Route::post('/customers/{customer}/documents', [CustomerDocumentController::class, 'store'])
    ->middleware(['auth', 'throttle:document-uploads']);
```

The named limiter must be registered by the application. The FormRequest should
fail closed and bind authorization to the route resource:

```php illustrative
use Illuminate\Validation\Rules\File;

public function authorize(): bool
{
    $customer = $this->route('customer');

    return $this->user()?->can('uploadDocument', $customer) ?? false;
}

public function rules(): array
{
    return [
        'document' => ['required', File::types(['pdf'])->max('10mb')],
    ];
}
```

```php illustrative
use App\Http\Requests\StoreCustomerDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Jobs\ScanDocument;
use App\Models\Customer;
use App\Models\Document;
use Illuminate\Http\Resources\Json\JsonResource;

public function store(
    StoreCustomerDocumentRequest $request,
    Customer $customer,
): JsonResource
{
    $file = $request->validated('document');
    $path = $file->store("quarantine/{$customer->getKey()}", 'local');

    $document = Document::query()->create([
        'customer_id' => $customer->getKey(),
        'storage_disk' => 'local',
        'storage_path' => $path,
        'status' => 'quarantined',
    ]);

    ScanDocument::dispatch($document->getKey())->afterCommit();

    return DocumentResource::make($document);
}
```

The Laravel 13 skeleton configures the `local` disk at `storage/app/private`. If a project instead
uses a custom disk named `private`, define and verify that disk in `config/filesystems.php` before
using the name in application code.

The FormRequest should authorize the actor against the route-bound customer and apply file type
and size rules. Register a named limiter on the route, enforce account storage quota in the
application boundary, and authorize every later download by document ID. If persistence can fail
after the file write, compensate by deleting the orphan or use a cleanup job.

Centralize an outbound client so timeouts, authentication, retry policy, error conversion, and
telemetry do not drift between callers.

```php illustrative
use Illuminate\Support\Facades\Http;

$response = Http::baseUrl(config('services.partner.url'))
    ->withToken(config('services.partner.token'))
    ->acceptJson()
    ->connectTimeout(3)
    ->timeout(10)
    ->retry(3, 200, throw: false)
    ->get('/orders/'.$externalId)
    ->throw();

$payload = $response->json();
```

Signature verification must use the exact raw bytes and constant-time comparison. The following
is a runnable primitive, not a substitute for a provider's timestamp and replay specification:

```php runnable
<?php

declare(strict_types=1);

function validWebhookSignature(string $rawBody, string $provided, string $secret): bool
{
    if ($secret === '' || ! preg_match('/\A[a-f0-9]{64}\z/i', $provided)) {
        return false;
    }

    $expected = hash_hmac('sha256', $rawBody, $secret);

    return hash_equals($expected, $provided);
}
```

Verify the provider timestamp inside its documented tolerance before parsing or performing side
effects. Sign the exact provider-defined bytes, commonly `timestamp.rawBody`, reject malformed or
future timestamps, and use a constant-time comparison. A timestamp check limits the replay window;
it does not deduplicate concurrent deliveries.

Back deduplication with a database uniqueness constraint, not a check-then-insert query:

```php illustrative
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::create('webhook_receipts', function (Blueprint $table): void {
    $table->id();
    $table->string('provider', 64);
    $table->string('event_id', 191);
    $table->json('payload');
    $table->string('status', 32)->default('pending');
    $table->unsignedInteger('attempts')->default(0);
    $table->timestamp('available_at')->nullable();
    $table->timestamp('processed_at')->nullable();
    $table->text('last_error')->nullable();
    $table->timestamp('received_at');
    $table->unique(['provider', 'event_id']);
});
```

After authenticating the raw body, validate and canonicalize the provider, event ID, timestamp,
and decoded payload. Persist a durable inbox row. Eloquent's `createOrFirst` attempts the insert
and recovers only from a unique-constraint violation by selecting the existing key; unrelated
database failures still surface:

```php illustrative
use App\Models\WebhookReceipt;

$receipt = WebhookReceipt::query()->createOrFirst(
    [
        'provider' => 'billing-partner',
        'event_id' => $event['id'],
    ],
    [
        'payload' => $event,
        'status' => 'pending',
        'available_at' => now(),
        'received_at' => now(),
    ],
);
```

Respond promptly after the inbox commit. A durable relay or scheduled sweeper must claim pending
rows with a conditional status update or database lock, dispatch processing by receipt ID, and
recover expired processing leases. A post-commit dispatch may reduce latency, but it cannot replace
that relay: a process can crash after commit and before queue publication. On duplicate delivery,
compare immutable identity fields and let completed, pending, failed, or expired-processing state
drive the response/recovery; do not unconditionally discard a non-completed receipt.

The processing job must be idempotent at every external side-effect boundary and mark the inbox
row complete only after its owned work succeeds. Keep provider plus stable event ID as the
idempotency key. A transaction without a unique constraint cannot stop two concurrent deliveries
from both passing a prior existence check, and a cache TTL is not a durable inbox.

Persist only payload fields needed for recovery. Never store signature or authorization headers;
encrypt and tightly authorize sensitive inbox content when it is genuinely required, and define a
retention/deletion schedule for completed and failed receipts.

## Incorrect Pattern

```php illustrative
// Unsafe: trusts a client-controlled filename and exposes it on a public disk.
$request->file('document')->storeAs('documents', $request->file('document')->getClientOriginalName(), 'public');

// Fragile: no timeout, no status handling, and a live external call scattered in a controller.
$data = Http::get($request->input('url'))->json();

// Unsafe: parses and processes before authenticity or replay checks.
$event = $request->json()->all();
ProcessWebhook::dispatchSync($event);
```

Do not let users choose arbitrary disks, filesystem paths, or remote URLs. Prefer destinations
built from administrator-controlled configuration. If a product requirement genuinely accepts a
user-influenced URL, restrict schemes and ports, reject credentials and fragments, validate every
redirect, block loopback/private/link-local/metadata destinations for both A and AAAA answers,
re-check the connected address to resist DNS rebinding, and enforce outbound network policy.
Avoid logging authorization headers, signed URLs, entire webhook bodies, or uploaded confidential
content.

## Failure Modes

- A public storage URL returns 404 because the link was not created or deployment uses ephemeral
  local storage.
- Two tenants collide because paths are not tenant-scoped or access checks only inspect a path.
- Upload validation checks only an extension while the actual MIME or content is unexpected.
- Large uploads exhaust memory because application code reads the entire file instead of streaming.
- A failed filesystem write is ignored when the disk is configured not to throw write exceptions.
- A remote 500 response is treated as success because the response was never checked or thrown.
- Retries duplicate a non-idempotent order, payment, or message.
- A broad HTTP fake hides a wrong hostname or malformed request.
- Signature verification uses decoded JSON rather than the raw body and fails after normalization.
- A valid signed event is replayed because timestamp tolerance and event-ID deduplication are absent.
- A synchronous webhook handler times out, causing the provider to deliver the same event again.

## Trade-offs

Public disks make delivery simple but intentionally expose objects; private disks plus temporary
URLs add authorization control and signing overhead. Local storage is easy for one server but is
usually unsuitable for horizontally scaled or ephemeral deployments.

Automatic retries improve resilience for transient faults but increase latency and duplicate risk.
Synchronous webhook processing provides immediate feedback but couples provider availability to
business work. An inbox record plus queued processing is more operationally robust at the cost of
additional state and eventual consistency.

## Version and Package Boundaries

- Confirm the Laravel version before copying method signatures from live documentation.
- S3, SFTP, path-prefixing, and read-only filesystems use separate Flysystem packages.
- Provider SDKs may supply their own signature middleware; use it when installed and compatible,
  while still testing replay and failure behavior.
- Temporary URL support and visibility semantics vary by driver.
- Do not add an HTTP, webhook, or storage package merely because it appears in this reference.
  Use a package only when the project already depends on it or the user explicitly requests it.

## Testing

- Use `Storage::fake('disk')`, `UploadedFile::fake`, `assertExists`, and `assertMissing` for upload
  behavior without touching production storage.
- Assert validation rejection for size, MIME, missing content, and unauthorized tenant paths.
- Use `Http::fake` with narrow URL patterns; assert method, URL, headers, and body with
  `Http::assertSent`.
- Enable `Http::preventStrayRequests` in integration tests so an incomplete fake cannot reach the
  network.
- Test success, timeout, connection exception, 429, retry exhaustion, invalid JSON, and 5xx paths.
- Test webhook invalid signatures, stale timestamps, duplicate event IDs, unknown event types,
  malformed payloads, missing or empty secrets, secret rotation, and queue dispatch after
  acceptance.
- Run at least one driver-specific integration test when production behavior depends on S3-style
  URLs, visibility, multipart uploads, or temporary URLs.

## Grounding

Classification: `official` for Laravel APIs and `derived` for operational integration guidance.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/filesystem
- https://laravel.com/docs/13.x/http-client
- https://laravel.com/docs/13.x/http-tests#testing-file-uploads
- https://laravel.com/docs/13.x/validation#validating-files
- https://laravel.com/docs/13.x/queues
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html

Provider signature and replay rules remain provider-specific; verify them in the installed SDK or
provider's primary documentation before implementing a webhook contract.
<!-- END: references/filesystem-http-webhooks.md -->

<!-- BEGIN: references/frontend-vite-starter-kits.md -->
# Frontend Assets, Vite, and Starter Kits

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for Laravel's Vite integration, asset entry points, production manifests,
Blade asset directives, development hot reload, static assets, and selection boundaries for
official starter kits. Treat Blade plus the project's existing asset pipeline as the core UI
surface.

Before changing frontend behavior, inspect `package.json`, its lockfile, `vite.config.*`, Composer
dependencies, resource directories, Blade layouts, and the selected starter kit. Preserve an
existing valid stack. Introduce Livewire, Inertia, Flux, React, Vue, Svelte, Tailwind, or another
UI package only when it is already detected or the user explicitly requests it.

## Verified Laravel 13 Behavior

- Laravel integrates Vite through `laravel-vite-plugin`; the exact JavaScript and CSS packages are
  defined by the application, not by the framework runtime alone.
- Vite development mode serves assets through its development server. A production build emits a
  manifest and versioned assets consumed by Laravel's Vite integration.
- `@vite([...])` loads configured entry points and automatically selects development-server or
  built-manifest URLs.
- `Vite::asset` returns a versioned URL for a configured static asset.
- The Laravel Vite plugin can refresh the browser when configured source files change.
- Production assets are generated with the project's package-manager build script, conventionally
  `npm run build`; the lockfile's package manager takes precedence over this example.
- Content security policy nonces, Subresource Integrity, custom build directories, and custom
  asset URL generation require corresponding application/plugin configuration.
- Laravel 13 offers official React, Svelte, Vue, and Livewire starter kits. They are optional
  application scaffolds, not evidence that every Laravel project uses those stacks.
- The official starter kits include authentication behavior through Laravel Fortify and ship
  their frontend source into the application for customization.
- The Livewire starter kit currently combines Livewire, Tailwind, and Flux UI. The React starter
  kit currently combines Inertia, React, Tailwind, and shadcn/ui. Those details are package- and
  release-sensitive and should be rechecked before changing a project.

## Correct Pattern

Declare the smallest entry-point set needed by the application and reference it from the base
layout.

```php illustrative
// vite.config.js is JavaScript; this PHP example shows the matching Blade-side concept.
use Illuminate\Support\Facades\Vite;

$logoUrl = Vite::asset('resources/images/logo.svg');
```

```blade
<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

Use the package manager already represented by the lockfile:

```text
package-lock.json -> npm ci && npm run build
pnpm-lock.yaml    -> pnpm install --frozen-lockfile && pnpm build
yarn.lock         -> yarn install --frozen-lockfile && yarn build
bun.lock          -> bun install --frozen-lockfile && bun run build
```

For an existing project, infer the UI stack from installed packages and source structure before
reading stack-specific references. For a greenfield project, ask for or follow the user's explicit
starter-kit choice rather than selecting one silently.

## Incorrect Pattern

```blade
{{-- Fragile: bypasses the manifest and assumes a fixed production filename. --}}
<script src="/build/assets/app.js"></script>

{{-- Wasteful: loads a second framework even though the project has no dependency or requirement. --}}
<script src="https://cdn.example.invalid/react.js"></script>
```

```php illustrative
// Wrong boundary: backend code assumes a particular starter kit from the Laravel version alone.
if (app()->version() === '13.x') {
    installReactAndTailwind();
}
```

Do not edit generated build files in `public/build` as source. Do not mix package managers, replace
the lockfile, upgrade major frontend packages, or migrate starter kits without explicit scope and
compatibility work.

## Failure Modes

- The page throws a Vite manifest-not-found error because production assets were not built or the
  build directory differs from Laravel configuration.
- A deploy serves old HTML with new hashed assets, or new HTML before assets are available.
- The development server is unreachable from a container, VM, or remote browser.
- Hot reload loops because refresh paths are too broad or generated files trigger rebuilds.
- Static images are copied outside Vite but referenced with `Vite::asset`, or vice versa.
- A custom CDN URL lacks CORS, CSP, integrity, or correct base-path configuration.
- Client-side environment variables leak secrets because they are bundled into browser assets.
- Node and package-manager versions differ between local development and CI.
- A starter-kit update overwrites customized application-owned frontend source.
- Backend routes and Inertia/SPA navigation disagree about response or authentication behavior.
- Two CSS systems produce conflicting resets, design tokens, or generated class scanning.
- Server-side rendering is enabled without supervising its long-running process.

## Trade-offs

One conventional Vite bundle is simple; multiple entry points can reduce page payload but increase
manifest and cache complexity. Importing assets through Vite provides hashing and dependency
tracking, while public-directory files retain stable URLs and bypass Vite processing.

Blade-first interfaces minimize client runtime and preserve straightforward HTTP behavior.
Livewire provides reactive PHP-driven UI. Inertia with React, Vue, or Svelte provides SPA-style
navigation while retaining Laravel controllers. Each option changes state management, build time,
accessibility, test strategy, and deployment processes; project evidence or explicit user intent
decides the stack.

## Version and Package Boundaries

- Verify `laravel-vite-plugin`, Vite, Node, and package-manager versions from the lockfile.
- Starter-kit contents evolve independently of the Laravel framework patch version.
- Fortify powers authentication in current official starter kits, but an existing application may
  use custom authentication or another package.
- Flux is associated with the Livewire starter kit and is not a Blade core dependency.
- Inertia is associated with current React, Vue, and Svelte starter kits and is not required for
  server-rendered Laravel.
- Tailwind is used by current official starter kits, but guidance must follow the detected project
  version and configuration.
- Deep stack-specific implementation belongs in that stack's primary documentation only after the
  dependency is detected or explicitly requested.

## Testing

- Run the locked install command and production asset build in CI.
- Fail CI on a missing manifest, unresolved import, type error, or bundler error.
- Add a feature or browser smoke test that renders the base layout and loads built assets.
- Test both development and production configuration when custom build paths or asset URLs exist.
- Check CSP nonce/integrity headers and browser console errors where those protections are enabled.
- Use semantic browser assertions for critical navigation, forms, validation, and authorization.
- Test responsive layout, keyboard navigation, focus behavior, and reduced-motion behavior for
  user-facing components.
- For SSR, test process startup, failure recovery, hydration, and fallback response behavior.

## Grounding

Classification: `official` for Vite and starter-kit behavior and `derived` for stack-selection
policy. Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/vite
- https://laravel.com/docs/13.x/frontend
- https://laravel.com/docs/13.x/starter-kits
- https://laravel.com/docs/13.x/blade
- https://laravel.com/docs/13.x/deployment

Read the installed stack's primary documentation for APIs beyond Laravel's integration boundary.
<!-- END: references/frontend-vite-starter-kits.md -->

<!-- BEGIN: references/mail-notifications-localization.md -->
# Mail, Notifications, and Localization

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for mailables, notification channels, queued delivery, per-recipient locale,
translation files, fallback language, and delivery testing. Inspect `config/mail.php`,
`config/queue.php`, `config/app.php`, the notifiable model, and installed notification-channel
packages before choosing APIs.

Separate domain events from delivery representations. A business event may fan out to mail,
database, broadcast, SMS, or another channel, while each channel has its own availability,
latency, credentials, and user-preference rules.

## Verified Laravel 13 Behavior

- Mailables encapsulate envelope, content, and attachments and may be generated with Artisan.
- A mailable that implements `ShouldQueue` is queued even when sent with `Mail::send`.
- Calling `afterCommit` prevents queued mail from running before an open database transaction is
  committed when the queue connection is not globally configured for that behavior.
- Notifications choose channels through `via`. Implementing `ShouldQueue` queues delivery;
  Laravel creates a queued job for each recipient and channel combination.
- `viaConnections`, `viaQueues`, delays, and notification middleware can customize queued delivery.
- The `Notifiable` trait routes built-in channels; `routeNotificationFor...` methods can override
  channel addresses.
- Notification locale can be set explicitly with `locale`, and a notifiable model may implement
  `HasLocalePreference` so queued notifications retain the preferred locale.
- Language files live under `lang/{locale}` after publishing the language directory. JSON
  translation files support strings used as their own keys.
- `__`, `trans`, and pluralization helpers resolve translated strings using the configured locale
  and fallback locale.
- Mail and notification fakes provide delivery assertions without contacting a transport.

## Correct Pattern

Create a queued notification with channel choice and locale driven by project state. Dispatch it
after the transaction that made the notification meaningful has committed.

```php illustrative
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Invoice;

final class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Invoice $invoice,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Invoice paid'))
            ->line(__('Your payment has been received.'))
            ->action(__('View invoice'), route('invoices.show', $this->invoice));
    }
}
```

Use a locale that belongs to the recipient, not the worker process. Keep the selected locale with
queued work through the notification locale API or `HasLocalePreference`.

```php illustrative
$user->notify(
    (new InvoicePaid($invoice))
        ->locale($user->preferred_locale)
        ->afterCommit()
);
```

Keep translations semantic and parameterized:

```php illustrative
$message = trans_choice(
    'invoices.overdue_count',
    $count,
    ['count' => $count],
    $user->preferred_locale,
);
```

## Incorrect Pattern

```php illustrative
// Fragile: sends within a transaction and assumes the row is already visible to a worker.
DB::transaction(function () use ($user, $invoice) {
    $invoice->markPaid();
    Mail::to($user)->queue(new InvoicePaidMail($invoice));
});

// Wrong recipient semantics: locale leaks from global mutable process state.
App::setLocale($request->input('locale'));
$user->notify(new InvoicePaid($invoice));

// Unmaintainable: channel credentials and recipient addresses are hardcoded.
Notification::route('mail', 'ops@example.invalid')->notify(new FailureNotice($secret));
```

Avoid putting secrets, access tokens, full payment data, or internal exception traces into mail,
notification payloads, database notification JSON, or provider metadata. Do not assume a queued
message has been delivered merely because dispatch succeeded.

## Failure Modes

- A worker renders a mailable before the surrounding transaction commits and cannot find data.
- A queued message serializes stale or oversized model graphs.
- A notification is delivered twice after retry because downstream delivery is not idempotent.
- One failing channel delays another because all channels share one queue and retry policy.
- The `from` address is rejected by the mail provider or does not match an authenticated domain.
- Markdown mail references an unpublished or missing component/theme.
- Attachments read a local path that is absent on the queue worker.
- A translated key is missing and the fallback string appears unexpectedly.
- A JSON translation key conflicts with a PHP translation filename.
- The recipient locale is unavailable, invalid, or not preserved by queued work.
- Database notifications grow without a retention policy.
- A fake is enabled globally and hides malformed transport configuration in deployment validation.

## Trade-offs

Mailables provide a focused email abstraction; notifications provide multi-channel fan-out and
recipient routing. Database notifications improve in-app history but require storage, indexing,
read-state behavior, and retention. Queued delivery improves request latency but introduces
eventual consistency and requires continuously supervised workers.

String-as-key JSON translations are convenient for small interfaces. Named PHP keys are easier to
organize, pluralize, review, and evolve in larger products. Choose one project convention and
avoid mixing styles without a reason.

## Version and Package Boundaries

- Mail transports and third-party notification channels may need additional Composer packages and
  provider configuration.
- Slack, SMS, push, and other community channels have contracts outside Laravel core; read the
  installed package version's primary documentation.
- Queue behavior depends on the configured connection and worker deployment.
- Starter-kit account notifications may be implemented by Fortify or another installed package;
  preserve those extension points instead of duplicating them.
- Do not add a channel, localization package, or provider SDK unless already detected or explicitly
  requested by the user.

## Testing

- Use `Mail::fake` and assert the intended mailable, recipient, queueing state, and relevant data.
- Use `Notification::fake` and `assertSentTo`, `assertNothingSent`, or on-demand routing assertions.
- Test that transaction rollback produces no delivery and successful commit dispatches once.
- Test every supported locale, fallback behavior, interpolation, pluralization, and HTML escaping.
- Exercise a real sandbox transport outside unit tests when headers, attachments, templates, or
  provider-specific behavior are business-critical.
- Test queue retry, permanent failure, timeouts, and idempotent handling.
- Verify that database notifications expose only authorized, non-sensitive fields and that cleanup
  behavior is covered.

## Grounding

Classification: `official` for framework APIs and `derived` for delivery operations.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/mail
- https://laravel.com/docs/13.x/notifications
- https://laravel.com/docs/13.x/localization
- https://laravel.com/docs/13.x/queues
- https://laravel.com/docs/13.x/testing

For non-core notification channels, also verify the installed channel package and the provider's
current delivery contract.
<!-- END: references/mail-notifications-localization.md -->

<!-- BEGIN: references/migrations-schema-seeding.md -->
# Migrations, Schema, Factories, and Seeding

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for schema creation and alteration, keys, constraints, indexes, rollback
behavior, production-safe rollout, factories, seeders, and data backfills. Inspect the current
schema, every migration touching the target table, model key types, production database driver,
deployment topology, and tests before proposing a change.

Treat a migration as deployed history once it may have run outside the local machine. Add a new
migration instead of editing deployed history unless the user explicitly confirms the migration
has never left a disposable environment.

## Verified Laravel 13 Behavior

- Migration classes expose `up` and `down` methods; `migrate` runs pending `up` methods and
  rollback commands invoke applicable `down` methods.
- `Schema::create` and `Schema::table` receive a `Blueprint`. Schema capabilities and generated
  SQL still depend on the configured database grammar.
- `foreignId` creates an unsigned big-integer-compatible column. Match UUID and ULID parents with
  `foreignUuid` and `foreignUlid` rather than mixing key representations.
- `constrained` infers the referenced table and column by convention. Explicit table, column,
  and index names are available when conventions do not match.
- Column modifiers such as `nullable` must be applied before `constrained`. A foreign key using
  `nullOnDelete` also needs a nullable column at the database level.
- `cascadeOnDelete`, `restrictOnDelete`, `nullOnDelete`, and `noActionOnDelete` describe database
  referential actions; they are not interchangeable business defaults.
- Unique constraints protect invariants under concurrency in a way request validation alone
  cannot. Validation remains useful for friendly errors.
- Laravel seeders may call other seeders through `$this->call`. Factories define test/dev object
  states and relationships; they do not replace a production backfill plan.
- `migrate --isolated` uses an atomic cache lock to prevent concurrent migration execution when
  the selected cache driver supports locks.
- The framework can dump a schema for migration squashing. A dump is a bootstrap optimization,
  not proof that production matches the repository.

## Correct Pattern

Choose nullability and delete semantics together. The modifier order below is significant:

```php illustrative
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::create('products', function (Blueprint $table): void {
    $table->id();
    $table->foreignId('shop_id')
        ->constrained()
        ->restrictOnDelete();
    $table->foreignId('category_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();
    $table->string('slug', 160);
    $table->string('status', 40)->index();
    $table->timestamps();

    $table->unique(['shop_id', 'slug']);
    $table->index(['shop_id', 'status', 'id']);
});
```

Use an expand/backfill/contract rollout when old and new application versions may overlap:

1. Add a nullable column, new table, or backward-compatible index.
2. Deploy code capable of writing the new shape while old reads still work.
3. Backfill in bounded, idempotent chunks outside the deploy-critical migration.
4. Verify completeness and switch reads.
5. Add required constraints only after every row is valid.
6. Remove the old shape in a later, explicitly approved deployment.

Factories should produce valid default records and named exceptional states:

```php illustrative
use Illuminate\Database\Eloquent\Factories\Factory;

final class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'status' => 'draft',
        ];
    }

    public function published(): static
    {
        return $this->state(fn (): array => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}
```

Make production backfills restartable: select a stable key, use `chunkById` or `lazyById`,
record progress when operations span deployments, and make rerunning an already-processed row a
no-op.

## Incorrect Pattern

```php illustrative
// Wrong modifier order and impossible SET NULL behavior on a non-null column.
$table->foreignId('category_id')
    ->constrained()
    ->nullable()
    ->nullOnDelete();

// Validation alone does not prevent concurrent duplicates.
Rule::unique('products', 'slug')->where('shop_id', $shopId);

// A deploy migration should not hold a large table and application release hostage.
Product::query()->each(fn (Product $product) => $product->update([
    'normalized_name' => normalize($product->name),
]));
```

Avoid calling current application models from old migrations. Model scopes, casts, table names,
events, and fillable fields change over time, so a historical migration can produce different
behavior months later.

## Failure Modes

- A nullable relation uses `nullOnDelete` but the column is not nullable, so parent deletion fails.
- A UUID parent is referenced by `foreignId`, causing type mismatch or unusable constraints.
- A cascading delete removes orders, audit history, or reports that should have been retained.
- A unique validation check passes twice under concurrency because no unique index arbitrates.
- A new non-null column is added before old application instances know how to populate it.
- A long backfill holds locks, exceeds deployment timeouts, or leaves partially transformed rows.
- `down` destroys newer data or cannot restore a lossy type conversion.
- An index is correct locally but blocks writes while being built on the production engine.
- A seeder runs in production and overwrites real records because it is not environment-safe or
  idempotent.
- Factories omit a database invariant, so tests pass with states production cannot persist.
- Two deploy processes run migrations concurrently because the isolation lock is not shared.
- SQLite tests pass while production fails on collation, constraint, generated-column, or DDL
  semantics.

## Trade-offs

Foreign keys and unique constraints strengthen integrity but add write checks and make deletion
order explicit. Cascades simplify cleanup but can erase history; restrictions preserve history
but require deliberate archival or detach workflows.

One large migration is operationally simple to name but difficult to deploy, observe, resume, and
roll back. Phased migrations add temporary complexity and dual-shape code while keeping mixed
application versions compatible.

Database defaults protect non-application writers but can hide missing application decisions.
Application-generated values are easier to test in domain code but need every writer to agree.

## Version and Package Boundaries

- Verify Laravel version and driver before copying schema methods from live docs.
- MariaDB/MySQL, PostgreSQL, SQLite, and SQL Server differ in transactional DDL, lock behavior,
  generated columns, index length, partial indexes, collations, and online alteration support.
- Laravel's schema builder exposes portable common operations; engine-specific online or
  concurrent index syntax may require a reviewed raw statement and a deployment runbook.
- SQLite is useful for fast tests but is not a substitute for a production-driver migration test.
- `migrate --isolated` requires a shared cache store with atomic lock support across deploy hosts.
- Factory APIs are Laravel core; third-party state-machine, enum, migration, or online-schema
  packages should be used only when detected or explicitly requested.

## Testing

- Run migrations from an empty database and from a representative pre-change schema.
- Run `migrate:rollback` only when rollback is expected to be safe, then migrate forward again.
- Assert table, column, index, and foreign-key behavior, not merely that the command exits zero.
- Test duplicate inserts against the unique constraint and invalid foreign-key writes.
- Test parent deletion for every chosen cascade, restrict, and set-null action.
- Exercise factories and seeders repeatedly to prove their valid and idempotent behavior.
- Test backfill interruption and restart with already-processed and malformed rows.
- Use SQLite for the PR smoke path and run MySQL/PostgreSQL fixtures for driver-sensitive changes.
- Estimate production row count, lock duration, disk growth, and rollback path before scheduling a
  high-risk migration.

## Grounding

Classification: `official` for Laravel schema, migration, factory, and seeding APIs; `derived` for
expand/backfill/contract and deployment-safety guidance. Verified against the pinned Laravel 13
sources and:

- https://laravel.com/docs/13.x/migrations
- https://laravel.com/docs/13.x/seeding
- https://laravel.com/docs/13.x/eloquent-factories
- https://laravel.com/docs/13.x/database-testing
- https://laravel.com/docs/13.x/cache#atomic-locks

Engine-specific DDL safety must also be verified against the production database's primary
documentation and observed schema before execution.
<!-- END: references/migrations-schema-seeding.md -->

<!-- BEGIN: references/official-packages.md -->
# Official Package Router

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference to identify and route work involving Laravel-maintained packages and products.
It is a selection boundary, not a replacement for package documentation. Inspect `composer.lock`,
`composer.json`, frontend lockfiles, published configuration, service providers, migrations, and
runtime infrastructure before loading package-specific guidance.

Package presence wins over assumptions. If a package is absent, do not introduce it unless the
user explicitly asks for the capability and accepts the dependency, migration, operational, and
compatibility impact.

## Verified Laravel 13 Behavior

- Composer is the authoritative package dependency resolver; `composer.lock` identifies the exact
  installed versions used by an application install.
- Laravel package discovery can automatically register providers and aliases declared in a
  package's Composer `extra.laravel` metadata.
- Applications can opt out of discovery through `extra.laravel.dont-discover` in `composer.json`.
- Published package configuration, migrations, routes, views, assets, and language files become
  application-owned copies and may drift from later package defaults.
- Official package documentation is versioned independently from the Laravel framework. Framework
  13 compatibility must be verified from the package constraint, release notes, and installed lock.

Route detected packages by capability:

| Capability | Common official package/product | Read when detected |
| --- | --- | --- |
| SPA/session API authentication | Sanctum | Token abilities, stateful domains, CSRF, guards |
| OAuth2 authorization server | Passport | Clients, grants, keys, scopes, migrations |
| Authentication backend | Fortify | Features, actions, rate limits, views boundary |
| Social authentication | Socialite | Provider scopes, callback state, account linking |
| Stripe or Paddle billing | Cashier | Webhooks, taxes, subscriptions, provider IDs |
| Queue dashboard/workers | Horizon | Redis queues, balancing, supervisors, metrics |
| Long-running application server | Octane | Worker lifecycle, state reset, server choice |
| WebSocket server | Reverb | Connections, scaling, TLS, Redis, broadcasting |
| Search abstraction | Scout | Engine, indexing consistency, queues, filters |
| Feature flags | Pennant | Scope, drivers, rollout consistency |
| Application performance | Pulse | Storage, sampling, recorders, authorization |
| Debug inspection | Telescope | Watchers, filtering, pruning, authorization |
| Browser testing | Dusk or documented browser stack | Driver, environment, selectors, CI |
| Local development | Sail or Valet | Host/runtime-specific commands |
| Formatting | Pint | Preset, config, check versus write mode |
| Deployment scripting | Envoy | Hosts, tasks, credentials, execution boundary |
| AI-assisted development | Boost | MCP tools, generated guidelines, docs search |
| Runtime AI features | AI SDK | Providers, agents, tools, storage, fakes |
| MCP servers/clients/apps | MCP | Transport, schemas, auth, authorization, tests |

## Correct Pattern

Detect exact Composer packages without guessing from filenames or marketing names:

```php illustrative
$lock = json_decode(
    file_get_contents(base_path('composer.lock')),
    true,
    flags: JSON_THROW_ON_ERROR,
);

$packages = collect([...$lock['packages'], ...$lock['packages-dev']])
    ->keyBy('name');

$sanctumVersion = $packages->get('laravel/sanctum')['version'] ?? null;
```

Then read the matching installed configuration and the package's primary documentation for that
version. Explain whether a recommendation is Laravel core, package API, provider behavior, or a
project convention.

For new capability requests, compare a core implementation with relevant packages, state migration
and operations costs, and wait for explicit dependency scope before changing Composer state.

## Incorrect Pattern

```php illustrative
// Wrong: Laravel 13 does not imply every official package is installed.
if (str_starts_with(app()->version(), '13.')) {
    Horizon::pause();
    Telescope::recordQueryBindings();
}

// Wrong: a class-name guess is not version or configuration detection.
$usesSanctum = class_exists('Laravel\\Sanctum\\Sanctum');
```

Do not recommend Passport when the project already has an adequate Sanctum contract, or Sanctum
when the requirement is a full OAuth2 authorization server, without explaining the difference.
Do not copy commands from a latest-docs page before checking the installed major version.

## Failure Modes

- The agent reads framework 13 docs but the installed package major has different APIs.
- A package is present only in `packages-dev` and is accidentally required at production runtime.
- Auto-discovery is disabled and the service provider never loads.
- Published configuration lacks a new package option after an upgrade.
- Published migrations conflict with application naming or previously applied migrations.
- A package assumes Redis, a process supervisor, WebSockets, browser binaries, or provider secrets
  that production does not supply.
- Authentication packages are combined with incompatible guards or cookie domains.
- A queue/search/broadcast package is configured synchronously in one environment and asynchronously
  in another.
- Debug packages expose routes or sensitive data outside local development.
- A package update changes external billing, OAuth, or webhook behavior without contract tests.
- Package removal leaves providers, configuration, migrations, scheduled tasks, or frontend imports.
- Composer constraints permit a release not covered by the project's automated tests.

## Trade-offs

Official packages usually integrate closely with Laravel conventions and documentation. They still
add versioning, configuration, database, runtime, security, and operational responsibilities.
Implementing a small capability in core code can reduce dependencies; a maintained package may
provide safer protocol compliance and deeper features.

Automatic discovery simplifies installation but hides registration flow. Publishing resources
enables customization but transfers merge responsibility to the application. Prefer extension
points over copied vendor source when the package supports them.

## Version and Package Boundaries

- Treat `composer.lock` as exact installed truth and `composer.json` as the allowed dependency
  range; inspect both.
- Separate production packages from `packages-dev`.
- Verify framework constraints, PHP constraints, database support, and infrastructure prerequisites
  for the exact package release.
- Livewire, Inertia, Flux, React, Vue, Svelte, Tailwind, Filament, and Nova are not Laravel core;
  some are first-party or ecosystem projects with separate documentation and release cycles.
- Load deep guidance only for a detected dependency or an explicit user request.
- Preserve project package choices unless correctness, security, or incompatibility evidence
  requires raising a concern.

## Testing

- Assert the expected package and version in lockfile/source-lock checks for contract-critical
  integrations.
- Run package migrations, configuration publication checks, and application boot in a clean fixture.
- Exercise authentication, webhook, billing, queue, search, broadcast, or browser behavior through
  package-supported fakes plus at least one realistic integration layer where risk warrants it.
- Test production service prerequisites and worker/supervisor configuration.
- Run upgrade tests against the intended new package version before updating the lockfile.
- Verify package route authorization, debug-data filtering, secret handling, and retention.
- On removal, search for namespaces, providers, config, routes, migrations, assets, scheduled tasks,
  environment values, and deployment services.

## Grounding

Classification: `package-specific`. The router is grounded in Laravel 13's official package index
and individual primary documentation:

- https://laravel.com/docs/13.x/packages
- https://laravel.com/docs/13.x/sanctum
- https://laravel.com/docs/13.x/passport
- https://laravel.com/docs/13.x/fortify
- https://laravel.com/docs/13.x/horizon
- https://laravel.com/docs/13.x/octane
- https://laravel.com/docs/13.x/reverb
- https://laravel.com/docs/13.x/pulse
- https://laravel.com/docs/13.x/telescope

Use the relevant official package page and installed release notes rather than loading every
package reference into context.
<!-- END: references/official-packages.md -->

<!-- BEGIN: references/queries-performance.md -->
# Database Queries, Pagination, Indexes, and Performance

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for Eloquent and query-builder reads, raw SQL, filters, sorting, eager loading,
aggregates, pagination, chunking, streaming, indexes, read/write connections, and query
observability. Begin with the actual SQL path, row counts, data distribution, database driver,
existing indexes, and production evidence rather than optimizing from the controller shape alone.

Treat column names, sort expressions, raw fragments, JSON paths, and table names as SQL structure.
Parameter binding protects values, not arbitrary SQL identifiers, so structural input needs an
explicit allowlist.

## Verified Laravel 13 Behavior

- The query builder and Eloquent bind ordinary values. Methods such as `whereRaw` accept a
  separate bindings array; interpolating user input into raw SQL bypasses that protection.
- Eager loading with `with`, `load`, and `loadMissing` prevents repeated relationship queries.
  Aggregate helpers such as `withCount` avoid loading full related collections for counts.
- `paginate` performs a count query for total pages. `simplePaginate` avoids the total-count
  query. `cursorPaginate` uses ordered cursor values instead of numeric page offsets.
- Cursor pagination requires an `orderBy` and works best with a deterministic, unique ordering.
  Ordered columns must belong to the paginated table and cannot be null for reliable cursors.
- `chunkById` and `lazyById` paginate by a stable key and are safer than offset chunks when the
  same process updates rows.
- `cursor` keeps only one hydrated model in memory at a time, but the PDO driver may still buffer
  raw results and eager loading is not available for a cursor stream.
- `exists` can answer an existence question without calculating a complete count.
- `DB::listen` receives executed-query events. `DB::whenQueryingForLongerThan` can report
  cumulative query time per request.
- Read/write database connections may route selects and mutations differently. Transactional and
  read-after-write behavior must account for the configured connection and sticky option.
- `upsert` performs insert-or-update using database-native conflict handling; unique indexes
  determine which conflicts the database can arbitrate.

## Correct Pattern

Validate external sort names, map them to known columns, and add a unique tie-breaker:

```php illustrative
use Illuminate\Validation\Rule;

$validated = $request->validate([
    'sort' => ['sometimes', Rule::in(['newest', 'oldest', 'price-low', 'price-high'])],
    'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
]);

$sortMap = [
    'newest' => ['created_at', 'desc'],
    'oldest' => ['created_at', 'asc'],
    'price-low' => ['price_minor', 'asc'],
    'price-high' => ['price_minor', 'desc'],
];

[$sortColumn, $sortDirection] = $sortMap[$validated['sort'] ?? 'newest'];

$products = Product::query()
    ->select(['id', 'shop_id', 'name', 'price_minor', 'created_at'])
    ->with('shop:id,name')
    ->orderBy($sortColumn, $sortDirection)
    ->orderBy('id', $sortDirection)
    ->cursorPaginate($validated['per_page'] ?? 25);
```

Design an index from equality filters followed by range/order and the stable tie-breaker:

```php illustrative
Schema::table('products', function (Blueprint $table): void {
    $table->index(
        ['shop_id', 'status', 'created_at', 'id'],
        'products_shop_status_created_id_index',
    );
});
```

When processing and updating a large table, group caller conditions so Laravel's added key
condition cannot change the intended boolean logic:

```php illustrative
Product::query()
    ->where(function ($query): void {
        $query->where('status', 'draft')
            ->orWhereNull('normalized_name');
    })
    ->chunkById(500, function ($products): void {
        foreach ($products as $product) {
            // Perform a bounded, retry-safe update.
        }
    });
```

Capture query evidence in a non-sensitive environment, inspect the generated SQL and bindings,
and compare the database execution plan before and after an index change.

## Incorrect Pattern

```php illustrative
// SQL injection risk: a binding cannot protect an arbitrary identifier.
$query->orderByRaw($request->input('sort'));

// Injection risk through string interpolation.
$query->whereRaw("status = '{$request->input('status')}'");

// Unbounded memory and response size.
$products = Product::all();

// Hidden N+1.
foreach ($products as $product) {
    echo $product->shop->name;
}

// Offset chunks may skip rows when this loop changes the filtered set.
Product::whereNull('processed_at')->chunk(500, $markAsProcessed);
```

Avoid selecting every column for a high-volume list when large text, JSON, encrypted, or binary
columns are not part of the response contract.

## Failure Modes

- An allowlisted filter gains a new query path but the matching composite index is never added.
- A composite index has the right columns in an order that the target query cannot use well.
- Offset pagination becomes slower at deep pages and produces duplicates or gaps during writes.
- Cursor pagination orders only by a non-unique timestamp, making equal values unstable.
- `paginate` spends most of its time calculating a total the client does not need.
- Eager loading fixes query count but loads too many columns or too many nested rows into memory.
- A Resource or Blade view accesses an unloaded relationship and reintroduces an N+1.
- A raw expression treats user input as SQL structure.
- `chunk` skips rows because processed records leave the original result set.
- A read replica returns stale state immediately after a write.
- A query-log callback records credentials, personal data, or large bindings.
- SQLite's planner and collation behavior make a test unrepresentative of MySQL/PostgreSQL.

## Trade-offs

Indexes accelerate selected reads and enforce uniqueness at the cost of disk, cache pressure, and
write amplification. A wide covering index can help one endpoint while increasing every insert
and update.

Offset pagination supports arbitrary page numbers and totals but becomes expensive at depth.
Cursor pagination is stable and efficient for sequential navigation but cannot jump naturally to
page 200 and needs a stable public cursor contract.

Eager loading reduces round trips while increasing row and memory volume. Aggregate subqueries
can be cheaper than loading relationships but still need suitable indexes.

## Version and Package Boundaries

- Confirm the installed Laravel version before using newer builder helpers.
- MySQL/MariaDB, PostgreSQL, SQLite, and SQL Server differ in collations, null ordering, JSON
  operators, full-text search, expression/partial indexes, and execution-plan output.
- MySQL/MariaDB use table primary and unique indexes to detect `upsert` conflicts; verify the
  driver's handling of the conflict target instead of assuming identical PostgreSQL semantics.
- Cursor pagination has restrictions on ordered expressions and nullable columns; verify the
  exact generated SQL for the selected driver.
- Search, filter, and query-builder packages are not Eloquent core. Methods such as
  `allowedFilters` require their installed package and documented entry point.
- Read replicas, proxies, and connection pools add consistency boundaries outside Eloquent.

## Testing

- Assert accepted and rejected filter/sort names at the HTTP boundary.
- Test deterministic pagination with multiple rows sharing the same primary sort value.
- Test inserts or updates between cursor pages to detect duplicates and gaps.
- Enable lazy-loading prevention and query-count assertions on representative list/resource
  flows.
- Seed enough skewed data to exercise common and rare filter values.
- Verify unique and composite index behavior against duplicate and range queries.
- Use the production driver for JSON, collation, full-text, upsert, and planner-sensitive tests.
- Inspect an execution plan with representative data before claiming an index improves a query.
- Test read-after-write paths when read/write connections or replicas are configured.
- Keep performance thresholds environment-aware and report the dataset and query evidence used.

## Grounding

Classification: `official` for Laravel query, pagination, and monitoring APIs; `derived` for index
design and production-performance guidance. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/queries
- https://laravel.com/docs/13.x/eloquent
- https://laravel.com/docs/13.x/eloquent-relationships#eager-loading
- https://laravel.com/docs/13.x/pagination
- https://laravel.com/docs/13.x/database
- https://laravel.com/docs/13.x/migrations#indexes

Database execution plans and index safety must be verified against the production engine's
primary documentation and representative data.
<!-- END: references/queries-performance.md -->

<!-- BEGIN: references/queues-jobs.md -->
# Queues, Jobs, Retries, Chains, and Batches

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for job design, dispatch, connection/queue selection, delay, retries, timeouts,
backoff, uniqueness, overlap prevention, rate-limited jobs, chains, batches, failed jobs, worker
deployment, and queue testing. Inspect `config/queue.php`, worker command/supervisor settings,
cache driver, transaction boundaries, payload sensitivity, and external side effects first.

Queue delivery is generally at least once: a job can run again after timeout, worker loss,
visibility expiry, manual retry, or partial failure. Design `handle` so repeating it is safe.

## Verified Laravel 13 Behavior

- Jobs implementing `ShouldQueue` are dispatched to the configured queue connection. The
  `Queueable` trait exposes common connection, queue, delay, and after-commit options.
- Method dependencies on `handle` are resolved by the service container.
- Eloquent models in job payloads are serialized as identifiers and restored when handled.
  Loaded relationships can increase payload/restoration work; `withoutRelations` and the
  `WithoutRelations` attribute remove them from serialization.
- Worker and job retry behavior can be bounded with `$tries` or `tries()`, `backoff()`,
  `retryUntil()`, `$maxExceptions`, `$timeout`, and `$failOnTimeout`.
- A worker's `--timeout` should be shorter than the connection's `retry_after` so a lost worker
  does not normally allow the same job to execute concurrently before termination.
- The `queue:work --timeout` option has no effect when the worker is invoked with `--once`;
  commands and automation using one-shot workers must not claim that option enforces a job timeout.
- `release` returns a job to the queue, `delete` completes it, and `fail` records an explicit
  failure when failed-job storage is configured.
- `ShouldBeUnique` uses a cache lock before dispatch. Every dispatcher must share a lock-capable
  cache store. Unique constraints do not apply to jobs inside batches.
- `WithoutOverlapping` job middleware limits concurrent processing. It may release or discard an
  overlapping job and can set lock expiry; it is different from unique dispatch.
- Queue connection `after_commit` or per-dispatch `afterCommit` delays publication until open
  database transactions commit.
- `Bus::chain` runs jobs sequentially and stops later jobs after a failure unless failure handling
  changes the flow. `Bus::batch` tracks a group of batchable jobs and supports progress and
  cancellation.

## Correct Pattern

Pass stable identifiers, bound retries, make the external operation idempotent, and select
after-commit dispatch when the job depends on new database state:

```php illustrative
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

final class SyncOrderToFulfillment implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;
    public int $maxExceptions = 3;
    public int $timeout = 60;
    public bool $failOnTimeout = true;

    public function __construct(
        public readonly int $orderId,
        public readonly string $operationId,
    ) {
        $this->onQueue('integrations');
    }

    public function backoff(): array
    {
        return [10, 60, 300, 900];
    }

    public function handle(FulfillmentClient $client): void
    {
        $order = Order::query()->findOrFail($this->orderId);

        $client->upsertOrder(
            order: $order,
            idempotencyKey: "order:{$order->id}:sync:{$this->operationId}",
        );
    }
}

SyncOrderToFulfillment::dispatch(
    orderId: $order->id,
    operationId: $syncOperation->id,
)->afterCommit();
```

Generate the operation ID once when the domain operation is accepted and store
it durably with that operation. Reuse it across retries. Do not derive an
idempotency key from a second-precision timestamp or regenerate a random value
inside `handle`, because either choice can merge distinct revisions or split one
retry sequence into multiple external operations.

Use overlap middleware when only one job for a domain key may process at a time:

```php illustrative
use Illuminate\Queue\Middleware\WithoutOverlapping;

public function middleware(): array
{
    return [
        (new WithoutOverlapping("order:{$this->orderId}"))
            ->releaseAfter(30)
            ->expireAfter(180),
    ];
}
```

Keep `handle` focused on one resumable unit. Persist a provider request ID or local processing
state before an ambiguous external call when reconciliation is needed after a timeout.

## Incorrect Pattern

```php illustrative
final class EmailEveryCustomer implements ShouldQueue
{
    public function __construct(
        public Collection $customers, // Huge, stale payload with loaded models.
    ) {}

    public function handle(Mailer $mailer): void
    {
        foreach ($this->customers as $customer) {
            $mailer->send($customer); // Retry resends earlier messages.
        }
    }
}

DB::transaction(function () use ($order): void {
    $order->save();
    SyncOrderToFulfillment::dispatch($order); // May run before commit.
});
```

Avoid unbounded retries, swallowed exceptions, sleeps inside workers, and long jobs containing
many independently retryable records.

## Failure Modes

- A job retries after an external call succeeded but before local completion was recorded.
- Worker timeout exceeds `retry_after` and two workers process the same job concurrently.
- A blocking socket or child process ignores the job timeout because its own timeout is unset.
- A job receives a model identifier after the model was deleted or changed.
- Serialized relationships make payloads large and restoration queries unexpected.
- `ShouldBeUnique` uses local cache on each host, so duplicate jobs are dispatched.
- Unique locks suppress dispatch but do not make a successfully started job idempotent.
- `WithoutOverlapping` repeatedly releases a job until it exhausts attempts.
- A job is published before the database transaction commits.
- A chain stops after failure and downstream compensation never runs.
- A batch callback captures non-serializable state or assumes every job succeeded.
- Workers continue running old code after deployment because they were not restarted.
- Failed-job storage contains sensitive payloads or grows without retention policy.

## Trade-offs

Small jobs isolate failures and distribute work well but increase queue overhead and coordination.
Large jobs reduce dispatch count but amplify timeout, memory, restart, and duplicate-side-effect
risk.

Unique dispatch reduces redundant queued work; overlap middleware controls concurrent execution.
Neither replaces durable idempotency for payments, webhooks, emails, or external writes.

Long exponential backoff protects a struggling dependency but delays recovery. Immediate retries
can amplify an outage. Retry policy should follow error classification and provider guidance.

## Version and Package Boundaries

- Verify the installed Laravel version, connection driver, and worker command before copying queue
  options.
- Database, Redis, SQS, Beanstalkd, and sync connections have different reservation,
  visibility/retry, delay, priority, and operational behavior.
- Unique jobs and overlap middleware require a shared cache store with atomic locks.
- Horizon is a separate first-party package for Redis queues; use its installed-version docs only
  when detected or explicitly requested.
- Batches require the batch repository migration and jobs using the applicable batchable behavior.
- Queue encryption requires `ShouldBeEncrypted` and protects the serialized payload at the queue
  boundary; logs, failed jobs, and external calls still need separate protection.
- Process supervisors, containers, serverless queues, and managed workers own shutdown and
  deployment behavior outside Laravel core.

## Testing

- Use `Queue::fake` to assert class, queue, delay, chain, and dispatch count at the caller boundary.
- Use `Bus::fake` for chains and batches, then separately execute job `handle` behavior with real
  collaborators faked at their own boundary.
- Test success, transient release, permanent failure, timeout, max exceptions, and retry
  exhaustion.
- Execute the same job twice and prove state and external side effects remain correct.
- Assert jobs dispatched inside transactions are published after commit and discarded on rollback.
- Test overlap and uniqueness with two processes and a shared production-like cache store.
- Test missing/deleted models and changed state between dispatch and handling.
- Verify worker `timeout`, connection `retry_after`, memory, queue name, and supervisor restart in
  deployment smoke tests.
- Inspect failed-job payload retention and sensitive-field exposure.

## Grounding

Classification: `official` for Laravel queue, job, chain, batch, and testing APIs; `derived` for
idempotency and worker-operability guidance. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/queues
- https://laravel.com/docs/13.x/queues#jobs-and-database-transactions
- https://laravel.com/docs/13.x/queues#unique-jobs
- https://laravel.com/docs/13.x/queues#job-middleware
- https://laravel.com/docs/13.x/queues#job-chaining
- https://laravel.com/docs/13.x/queues#job-batching
- https://laravel.com/docs/13.x/mocking#queue-fake

Driver delivery guarantees and visibility semantics must also be verified against the configured
queue service and production worker runtime.
<!-- END: references/queues-jobs.md -->

<!-- BEGIN: references/requests-validation-responses.md -->
# Laravel 13 Requests, Validation, and Responses

## Contents

- Treat every request as untrusted input.
- Choose inline validation or Form Requests from endpoint complexity.
- Separate validation, authorization, normalization, and business rules.
- Return response types that match browser and API contracts.
- Test invalid, unauthorized, and content-negotiation paths.

## Applies To

Use this reference for `Illuminate\Http\Request`, Form Requests, validation
rules, uploaded request data, redirects, JSON responses, streamed responses,
downloads, cookies, and content negotiation.

Read the routing reference for endpoint registration, the authorization
reference for policies, and the API reference for resource and error contracts.

Validation proves input shape. It does not prove that the authenticated actor
may perform the requested action.

## Verified Laravel 13 Behavior

Laravel offers request accessors for all input, selected input, typed values,
files, headers, route parameters, cookies, and the authenticated user.

`$request->validate(...)` returns validated data or raises a validation
exception.

A Form Request encapsulates `authorize()` and `rules()` and is validated before
the controller action executes.

Form Requests can prepare input before validation and perform additional
validation after base rules.

`validated()` returns data that passed the declared rules.

`safe()` returns a validated input container that supports `only`, `except`,
`all`, iteration, and collection conversion.

Laravel automatically redirects a traditional browser request after validation
failure and returns a JSON validation response for requests expecting JSON.

The request's `expectsJson()` and route/application exception configuration
affect response negotiation.

Laravel supports response objects, JSON responses, redirects, downloads,
streams, event streams, and response macros.

The pinned Laravel 13 skeleton configures exceptions to render JSON when a
request matches `api/*` or expects JSON. Existing projects can differ.

## Correct Pattern

Use a Form Request when validation or authorization is reusable or non-trivial:

```php runnable
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->user()),
            ],
        ];
    }
}
```

Pass only validated fields to the write operation:

```php illustrative
public function update(UpdateProfileRequest $request): RedirectResponse
{
    $request->user()->update($request->safe()->only([
        'name',
        'email',
    ]));

    return back()->with('status', 'profile-updated');
}
```

Keep normalization conservative and visible:

```php illustrative
protected function prepareForValidation(): void
{
    $this->merge([
        'email' => is_string($this->email)
            ? mb_strtolower(trim($this->email))
            : $this->email,
    ]);
}
```

Use database constraints in addition to application validation for invariants
that must remain true under concurrency.

Use `bail` or `stopOnFirstFailure` only when early stopping improves cost or
clarity.

Use conditional validation rules when the condition is part of the request
contract, not as a substitute for authorization.

For JSON endpoints, return a documented status and resource or response:

```php illustrative
return response()->json(
    ['data' => ['accepted' => true]],
    202,
);
```

For browser forms, redirect with flash state and validation errors rather than
returning an unrelated JSON envelope.

Preserve existing response macros and exception rendering when they form a
public project contract.

## Incorrect Pattern

```php illustrative
public function store(Request $request)
{
    $order = Order::create($request->all());

    return ['ok' => true, 'order' => $order];
}
```

The example passes unbounded input to persistence and exposes an implicit
serialization contract.

Do not use `$request->all()` as a persistence payload.

Do not add a permissive model fillable configuration to compensate for missing
request selection.

Do not place ownership checks only in validation rules.

Do not trust a client-provided identifier in `Rule::unique()->ignore(...)`;
provide the bound model or a trusted server-side identifier.

Do not normalize input in a way that changes a credential, signature, binary
payload, or case-sensitive identifier without an explicit contract.

Do not return validation errors with HTTP 200.

Do not catch `ValidationException` merely to recreate Laravel's existing
behavior with less information.

Do not assume every request under an `api` route prefix expects JSON; verify the
project's negotiation contract.

## Failure Modes

- A nullable field is omitted but application code treats omission as null.
- A boolean string is cast differently from the client's expectation.
- A nested wildcard rule validates items but misses an aggregate invariant.
- Validation queries pass, then a concurrent write violates uniqueness.
- An uploaded file passes extension checks while its content is unsafe.
- A Form Request `authorize()` returns false before a desired validation error.
- `prepareForValidation` changes data needed for signature verification.
- An API client omits `Accept: application/json` and receives a redirect.
- A global exception customization changes the standard validation envelope.
- A response serializes a full Eloquent model with sensitive attributes.
- A streamed response throws after headers are already sent.
- Browser and API consumers accidentally share one unstable response contract.

Treat validation, authorization, persistence, and serialization as separate
boundaries even when implemented in one request flow.

## Trade-offs

Inline validation is concise for a small endpoint.

Form Requests improve reuse and controller focus but separate input behavior
from the action.

Database-backed validation is readable but cannot replace unique constraints or
transactions.

Aggressive normalization simplifies downstream code but can destroy meaningful
input distinctions.

Automatic JSON negotiation is convenient but requires clients and exception
configuration to agree.

Response macros create consistency but can hide non-standard project
conventions.

## Version and Package Boundaries

This reference describes Laravel 13 core request, validation, and response
behavior.

Precognition adds package-specific live validation behavior and should be loaded
only when detected or explicitly requested.

Sanctum and SPA stacks add authentication, cookie, and CSRF requirements beyond
basic JSON validation.

File validation depends on PHP upload configuration, filesystem drivers, and
image libraries.

JSON:API resources are covered in the adjacent API reference and require exact
Laravel 13 syntax verification.

## Testing

Test the valid minimum payload, valid maximum payload, missing required fields,
wrong scalar types, nested-array failures, and unexpected fields.

Test unauthenticated and unauthorized requests independently from invalid data.

Assert database state, not only status codes.

Assert sensitive or unvalidated fields are not persisted.

Send `Accept: application/json` in API feature tests and assert the documented
error structure.

Test browser validation redirects, flashed input, and field errors.

Test the database constraint path for concurrent or duplicate writes.

Test file size, MIME/content handling, storage failure, and cleanup when uploads
are involved.

Use response assertions appropriate to the contract:

```php illustrative
$response = $this->postJson('/api/orders', []);

$response
    ->assertUnprocessable()
    ->assertJsonValidationErrors(['customer_id']);
```

## Grounding

- Requests:
  https://laravel.com/docs/13.x/requests
- Validation:
  https://laravel.com/docs/13.x/validation
- Responses:
  https://laravel.com/docs/13.x/responses
- Error handling:
  https://laravel.com/docs/13.x/errors
- HTTP tests:
  https://laravel.com/docs/13.x/http-tests
- Pinned skeleton exception negotiation:
  https://github.com/laravel/laravel/blob/43f3606336468af53f85aa6c993ce72041c63a61/bootstrap/app.php

Validation and response APIs are `official`. Envelope shape, normalization, and
layering beyond those APIs are `project-convention` unless the project already
publishes the contract.
<!-- END: references/requests-validation-responses.md -->

<!-- BEGIN: references/routing-middleware-controllers.md -->
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
<!-- END: references/routing-middleware-controllers.md -->

<!-- BEGIN: references/search-vector-reranking.md -->
# Search, Vector Similarity, Reranking, and Scout

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for keyword search, database full-text indexes, semantic search, PostgreSQL
`pgvector`, embeddings, cosine-distance queries, retrieve-then-rerank pipelines, and Laravel Scout.
It covers search behavior implemented by the Laravel 13 framework and the separate Laravel AI SDK
and Scout packages.

Resolve the actual search stack before changing code:

1. Inspect `composer.lock`, not only `composer.json`, for `laravel/framework`, `laravel/ai`,
   `laravel/scout`, and database-driver packages.
2. Inspect the configured database connection, production database version, enabled extensions,
   existing indexes, column dimensions, model casts, and representative execution plans.
3. Trace authentication, authorization policies, global scopes, tenant scopes, soft deletes, and
   visibility rules before building the retrieval query.
4. Inspect AI provider, model, dimensions, caching, data-retention, rate-limit, and billing
   configuration before generating embeddings or reranking documents.
5. Inspect Scout's selected engine, searchable attributes, filters, queue configuration, and index
   synchronization path when Scout is installed.

Choose the smallest search surface that satisfies the product requirement:

| Requirement | Prefer | Important boundary |
| --- | --- | --- |
| Exact substring on a small bounded set | Escaped `LIKE` or ordinary builder filters | No stemming or relevance ranking |
| Ranked keyword retrieval | Native full-text index plus `whereFullText` | MariaDB, MySQL, or PostgreSQL only |
| Meaning-based retrieval | PostgreSQL vector column plus vector query APIs | Requires `pgvector`; embeddings normally require `laravel/ai` |
| Improve a bounded candidate set | AI SDK reranking | Sends candidate text to an AI provider |
| Keep Eloquent search state synchronized | Scout | Separate `laravel/scout` package |
| Typo tolerance, facets, or geo-search at scale | Scout third-party engine | External index and eventual consistency |

Do not add `laravel/ai`, Scout, a database extension, or an external search service merely because
Laravel 13 documents it. Introduce a dependency only when the project already has it or the user
explicitly requests the capability and accepts its migration, security, cost, and operational
effects.

## Verified Laravel 13 Behavior

### Full-text search

- Laravel 13 supports `whereFullText` and `orWhereFullText` on MariaDB, MySQL, and PostgreSQL.
  SQLite and SQL Server are not supported by these full-text builder methods.
- `$table->fullText('body')` creates a full-text index. An array creates a composite full-text
  index, and the query should use the same indexed column set where the database requires it.
- PostgreSQL full-text indexes can specify a language with
  `$table->fullText('body')->language('english')`.
- On MariaDB and MySQL, the query grammar generates `MATCH (...) AGAINST (...)`. Natural-language
  mode is the default; the pinned source also supports the `boolean` mode and query expansion
  options.
- On PostgreSQL, the query grammar generates a `to_tsvector(...) @@ ...tsquery(...)` predicate.
  The pinned source defaults to the `english` configuration and supports `plain`, `phrase`,
  `websearch`, and raw tsquery modes through the query options.
- The PostgreSQL index language and query language must describe the same analysis strategy.
  A mismatch can change stemming and prevent the functional index from serving the query.
- MariaDB and MySQL full-text queries are automatically ordered by relevance in Laravel's Search
  guidance. PostgreSQL `whereFullText` filters matches but does not automatically add relevance
  ordering.
- Full-text search is not interchangeable with `%term%`. It has database-specific tokenization,
  minimum-word, stop-word, language, collation, and ranking behavior.

The public builder signature is:

```php illustrative
whereFullText(
    string|array $columns,
    string $value,
    array $options = [],
    string $boolean = 'and',
)
```

The options are engine-specific. Do not pass a MySQL boolean-mode contract to PostgreSQL or expose
PostgreSQL raw tsquery syntax as an ordinary user search field without designing and testing that
syntax explicitly.

### PostgreSQL vector storage and queries

- Laravel's framework-level vector distance queries are supported only on PostgreSQL connections.
  The pinned framework throws `RuntimeException` for vector distance queries on other connection
  types.
- PostgreSQL must have the `pgvector` extension installed and the migration role must be permitted
  to enable it. `Schema::ensureVectorExtensionExists()` issues a create-if-missing operation.
- `$table->vector('embedding', dimensions: 1536)` creates a vector column with the declared
  dimension count. The dimension must match every embedding stored in that column.
- Chaining `->index()` on a vector column creates an HNSW index using cosine distance in the pinned
  PostgreSQL grammar. The source-level `$table->vectorIndex(...)` API can add that index to an
  existing vector column.
- Cast an Eloquent vector attribute to `array` so Laravel converts between PHP arrays and the
  database vector representation.
- `whereVectorSimilarTo` uses cosine similarity, filters against a minimum similarity, and orders
  nearest results first unless `order: false` is passed.
- In pinned Laravel Framework v13.19.0, `whereVectorSimilarTo` has a default
  `minSimilarity` of `0.6`. Pass the threshold explicitly so behavior does not depend on a default
  that documentation summaries or later framework versions may describe differently.
- The builder does not validate an HTTP parameter as a finite number between `0.0` and `1.0`.
  Validate and bound external thresholds before calling the query method.
- A string vector argument invokes `Stringable::toEmbeddings(cache: true)`. That convenience path
  requires the Laravel AI SDK and a configured embedding provider; it also hides an external call
  or cache lookup inside query construction.
- Supplying a correctly sized numeric array avoids generating an embedding inside the query
  method. It does not remove the need to establish how that embedding was produced and versioned.

Pinned v13.19.0 exposes these vector query methods:

| Method | Behavior |
| --- | --- |
| `whereVectorSimilarTo($column, $vector, $minSimilarity = 0.6, $order = true)` | Filters by cosine similarity and optionally orders nearest first |
| `whereVectorDistanceLessThan($column, $vector, $maxDistance, $boolean = 'and')` | Adds a maximum cosine-distance predicate |
| `orWhereVectorDistanceLessThan($column, $vector, $maxDistance)` | Adds the distance predicate with `or` |
| `selectVectorDistance($column, $vector, $as = null)` | Selects the computed cosine distance |
| `orderByVectorDistance($column, $vector)` | Orders by ascending cosine distance |

`whereVectorSimilarTo` converts similarity to distance with `1 - $minSimilarity`. Its default
ordering is useful for nearest-neighbor retrieval. Set `order: false` only when a deliberate
secondary ordering or a separately selected distance defines the result contract.

### Embeddings and reranking

- `Str::of($text)->toEmbeddings()` and `Laravel\Ai\Embeddings` belong to the separate `laravel/ai`
  package, not to a bare Laravel framework installation.
- `Embeddings::for([...])->generate()` batches multiple inputs into one provider operation. The
  AI SDK supports selecting dimensions, provider, and model.
- Embedding dimensions are part of the persisted-data contract. Changing provider, model, or
  dimension can require a parallel column and a complete re-embedding migration.
- AI SDK embedding caching is configurable. When enabled globally, current Laravel 13 docs state
  that embeddings are cached for 30 days and the cache key includes provider, model, dimensions,
  and input content.
- `Laravel\Ai\Reranking::of([...])->rerank($query)` reorders documents and returns ranked records
  containing the original index, document, and score.
- Laravel collections receive a `rerank` macro from the AI SDK. It accepts a field name, multiple
  fields, or a closure that produces the document text, plus the query and an optional limit.
- Reranking does not pre-index content. It sends the selected candidate text and query to the
  configured provider at request time unless an application-level cache or queue changes that
  flow.
- Reranking is a second-stage tool. It should receive a bounded candidate set produced by an
  authorized first-stage query, not an unbounded Eloquent collection.

### Scout

- Laravel Scout is the separate `laravel/scout` package. Its `Searchable` trait registers model
  observers that keep non-database search indexes synchronized with Eloquent changes.
- Scout's `database` engine supports MySQL and PostgreSQL. It searches the database table directly
  and requires no separate import/index synchronization step.
- The database engine uses `LIKE` by default. `SearchUsingPrefix` changes selected attributes to
  prefix matching, and `SearchUsingFullText` uses full-text constraints for columns that already
  have compatible full-text indexes.
- Scout's database engine automatically orders by relevance, including on PostgreSQL, where direct
  `whereFullText` does not add relevance ordering.
- Scout's `collection` engine retrieves candidate records and filters them in PHP. It is portable
  to SQLite and SQL Server but is intended only for tests, prototypes, or a few hundred records.
- Third-party Scout engines such as Algolia, Meilisearch, and Typesense maintain external indexes
  and add engine-specific configuration for filters, facets, typo tolerance, geo-search, and
  ranking.
- For third-party engines, Scout's `query(...)` callback runs after matching IDs have already been
  returned by the search engine. It is not a valid security or tenant filter; use Scout search
  `where` constraints backed by configured filterable fields.
- For the database engine, `query(...)` constraints are applied directly to the database query and
  may filter results. Keep portable security constraints in the search query contract instead of
  relying on driver-specific timing.

## Correct Pattern

### 1. Define the search contract before selecting an engine

Write down:

- searchable fields and language;
- whether substring, stemming, semantic similarity, or typo tolerance is required;
- authorization and tenant predicates that must be applied before ranking;
- maximum query length, candidate count, result count, latency, and cost;
- stable tie-breaking and pagination behavior;
- freshness expectations after create, update, and delete;
- accepted degradation when the AI provider or external search engine is unavailable.

Use production-like data and the production database engine to confirm the decision. SQLite tests
cannot validate MariaDB/MySQL/PostgreSQL full-text or PostgreSQL vector behavior.

### 2. Create matching full-text indexes and queries

Use the same PostgreSQL language for the index and query:

```php illustrative
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('articles', function (Blueprint $table): void {
    $table->fullText(
        ['title', 'body'],
        'articles_title_body_fulltext',
    )->language('english');
});
```

Validate the public input, authorize the collection, apply tenant visibility before search, and
make PostgreSQL ordering explicit:

```php illustrative
use App\Models\Article;
use Illuminate\Support\Facades\Gate;

$validated = $request->validate([
    'query' => ['required', 'string', 'min:2', 'max:500'],
    'limit' => ['sometimes', 'integer', 'between:1,50'],
]);

$user = $request->user();

Gate::authorize('viewAny', Article::class);

$articles = Article::query()
    ->select(['id', 'tenant_id', 'title', 'summary', 'published_at'])
    ->where('tenant_id', $user->tenant_id)
    ->where('status', 'published')
    ->whereFullText(
        ['title', 'body'],
        $validated['query'],
        ['language' => 'english', 'mode' => 'websearch'],
    )
    // PostgreSQL whereFullText filters but does not rank automatically.
    ->orderByDesc('published_at')
    ->orderByDesc('id')
    ->limit($validated['limit'] ?? 20)
    ->get();
```

If relevance ordering is a requirement on PostgreSQL, choose Scout's database engine or implement
and test a PostgreSQL-specific ranking expression with bound values. Label an engine-specific raw
ranking expression as project-derived SQL rather than a portable Laravel behavior.

For MariaDB/MySQL boolean mode, expose a separate validated product contract instead of silently
reinterpreting the same query syntax on PostgreSQL:

```php illustrative
$articles = Article::query()
    ->where('tenant_id', $user->tenant_id)
    ->whereFullText(
        ['title', 'body'],
        $validated['query'],
        ['mode' => 'boolean'],
    )
    ->limit(20)
    ->get();
```

### 3. Establish PostgreSQL vector prerequisites explicitly

For a new table, enable the extension before the vector column and make the dimensions visible in
the migration:

```php illustrative
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::ensureVectorExtensionExists();

Schema::create('documents', function (Blueprint $table): void {
    $table->id();
    $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('content');
    $table->string('embedding_model')->nullable();
    $table->unsignedSmallInteger('embedding_dimensions')->nullable();
    $table->string('embedding_version', 64)->nullable();
    $table->vector('embedding', dimensions: 1536)->nullable()->index();
    $table->timestamps();

    $table->index(['tenant_id', 'id']);
});
```

The model/provider metadata columns are a derived production pattern, not mandatory Laravel
columns. They make stale or incompatible embeddings diagnosable and allow a backfill to select
only records that need the current embedding version.

Use a staged rollout for an existing high-volume table:

1. Confirm `pgvector` installation and migration-role privileges outside the deploy window.
2. Add a nullable vector column and model/version metadata without changing the read path.
3. Deploy code that writes embeddings for new or changed searchable content.
4. Backfill existing rows in bounded, idempotent queue jobs using batched embedding requests.
5. Verify dimensions, null rate, provider errors, and tenant distribution.
6. Build the HNSW index using the database's safe online procedure.
7. Enable vector reads behind a reversible feature flag and compare result quality and latency.
8. Make the column non-null only if the business contract truly requires it and the operational
   evidence proves every write path can satisfy that constraint.

Pinned source exposes an explicit vector-index command for an existing column:

```php illustrative
Schema::table('documents', function (Blueprint $table): void {
    $table->vectorIndex(
        'embedding',
        'documents_embedding_vector_index',
    )->online();
});
```

On PostgreSQL, `online()` compiles to `CREATE INDEX CONCURRENTLY`. PostgreSQL schema migrations are
transactional by default in Laravel, while concurrent index creation cannot run inside a
transaction. Put an online index operation in its own migration and deliberately set that
migration's `$withinTransaction = false` after verifying the exact framework and database
behavior. Do not combine it with unrelated schema changes.

Do not automatically drop the shared `vector` extension in `down()`. Other application tables may
depend on it. Roll back only the index and column owned by the migration unless the extension's
ownership is proven and coordinated.

### 4. Cast vectors and generate versioned embeddings

Cast the vector attribute to an array:

```php illustrative
use Illuminate\Database\Eloquent\Model;

final class Document extends Model
{
    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'embedding' => 'array',
        ];
    }
}
```

Batch embedding generation and make the persisted dimensions explicit:

```php illustrative
use Laravel\Ai\Embeddings;

$inputs = $documents->map(
    fn (Document $document): string => $document->title."\n\n".$document->content,
)->all();

$response = Embeddings::for($inputs)
    ->dimensions(1536)
    ->cache(seconds: 3600)
    ->generate();

$documents->values()->each(
    function (Document $document, int $index) use ($response): void {
        $document->forceFill([
            'embedding' => $response->embeddings[$index],
            'embedding_dimensions' => 1536,
            'embedding_version' => 'knowledge-v1',
        ])->save();
    },
);
```

The example illustrates the Laravel AI SDK API. Production backfills should also:

- persist the exact provider/model identifier used by the project;
- validate that every embedding is an array of the expected finite numeric dimension;
- make each batch retry-safe and avoid saving partial provider responses as complete;
- dispatch after the searchable database write commits;
- avoid emitting document text, embeddings, or provider credentials to logs;
- respect provider batch, token, rate, and spending limits.

### 5. Apply authorization constraints before vector ranking

Validate the threshold and result limit. Authorize the collection and apply record visibility in
SQL before computing the nearest results:

```php illustrative
use App\Models\Document;
use Illuminate\Support\Facades\Gate;
use Laravel\Ai\Embeddings;

$validated = $request->validate([
    'query' => ['required', 'string', 'min:2', 'max:500'],
    'min_similarity' => ['sometimes', 'numeric', 'between:0,1'],
    'limit' => ['sometimes', 'integer', 'between:1,50'],
]);

$user = $request->user();

Gate::authorize('viewAny', Document::class);

$embeddingResponse = Embeddings::for([$validated['query']])
    ->dimensions(1536)
    ->cache(seconds: 3600)
    ->generate();

$queryEmbedding = $embeddingResponse->embeddings[0];
$minSimilarity = (float) ($validated['min_similarity'] ?? 0.6);

$documents = Document::query()
    ->select(['id', 'tenant_id', 'owner_id', 'title', 'summary'])
    ->where('tenant_id', $user->tenant_id)
    ->where(function ($query) use ($user): void {
        $query->where('visibility', 'tenant')
            ->orWhere('owner_id', $user->getAuthIdentifier());
    })
    ->whereNotNull('embedding')
    ->whereVectorSimilarTo(
        'embedding',
        $queryEmbedding,
        minSimilarity: $minSimilarity,
        order: true,
    )
    ->limit($validated['limit'] ?? 10)
    ->get();
```

Adapt the visibility predicate to the project's real policy. `viewAny` alone does not prove every
row is visible. A policy check after retrieving a cross-tenant top-K set is too late: it can leak
data through timing or metadata and causes authorized rows to be displaced by forbidden rows.

For lower-level distance control, select and order the same bounded query vector:

```php illustrative
$documents = Document::query()
    ->select(['id', 'tenant_id', 'title'])
    ->where('tenant_id', $user->tenant_id)
    ->whereNotNull('embedding')
    ->selectVectorDistance('embedding', $queryEmbedding, as: 'distance')
    ->whereVectorDistanceLessThan(
        'embedding',
        $queryEmbedding,
        maxDistance: 0.3,
    )
    ->orderByVectorDistance('embedding', $queryEmbedding)
    ->limit(10)
    ->get();
```

Use an explicit selected alias only for output that the API contract needs. Do not serialize the
stored embedding merely because it is cast to an array.

### 6. Retrieve, then rerank a bounded authorized set

Use fast retrieval to narrow the corpus before sending content to a reranker:

```php illustrative
use App\Models\Article;

$candidates = Article::query()
    ->select(['id', 'tenant_id', 'title', 'body'])
    ->where('tenant_id', $user->tenant_id)
    ->where('status', 'published')
    ->whereFullText(['title', 'body'], $validated['query'])
    ->limit(50)
    ->get();

$ranked = $candidates->rerank(
    fn (Article $article): string => $article->title."\n\n".$article->body,
    $validated['query'],
    limit: 10,
);
```

Only authorized candidate content reaches the provider. Keep the original Eloquent identity and
map reranker indexes back to records deterministically. Define behavior for duplicate documents,
missing scores, provider timeouts, and fewer results than requested.

On PostgreSQL, direct `whereFullText` does not automatically rank the first-stage candidates. If
candidate quality depends on relevance, use Scout's database engine or a verified PostgreSQL
ranking query before reranking.

### 7. Keep Scout filtering engine-side

When a third-party Scout engine is present, include tenant and visibility fields in the searchable
document and configure them as filterable in that engine:

```php illustrative
$orders = Order::search($validated['query'])
    ->where('tenant_id', $user->tenant_id)
    ->whereIn('status', ['open', 'paid'])
    ->paginate(20);
```

Do not replace those constraints with a post-search Eloquent callback for a third-party engine.
Use `query(...)` there for eager loading or other non-filtering customization after matching IDs
are known.

For the Scout database engine, annotate only columns that have the required indexes:

```php illustrative
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;

final class Article extends Model
{
    use Searchable;

    #[SearchUsingPrefix(['id'])]
    #[SearchUsingFullText(['title', 'body'])]
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->getKey(),
            'tenant_id' => $this->tenant_id,
            'title' => $this->title,
            'body' => $this->body,
        ];
    }
}
```

Do not include secrets, internal-only relations, private content, or unbounded blobs in a
third-party search document. Search-index contents have their own retention, access, encryption,
deletion, and data-residency obligations.

## Incorrect Pattern

```php illustrative
// Wrong: relevance search without an index, language model, or bounded input.
$articles = Article::where('body', 'like', '%'.$request->query('q').'%')->get();

// Wrong: Laravel vector distance queries throw on a MySQL connection.
Document::whereVectorSimilarTo('embedding', $request->string('q'))->get();

// Wrong: threshold and result size are not validated or bounded.
Document::whereVectorSimilarTo(
    'embedding',
    $request->input('embedding'),
    minSimilarity: $request->input('threshold'),
)->limit($request->integer('limit'))->get();

// Wrong: retrieve cross-tenant candidates, then filter after ranking.
$documents = Document::whereVectorSimilarTo('embedding', $queryEmbedding)
    ->limit(100)
    ->get()
    ->where('tenant_id', $user->tenant_id);

// Wrong: sends the entire table, including unauthorized content, to a paid provider.
$ranked = Document::all()->rerank('content', $request->string('q'));

// Wrong for third-party Scout engines: query() runs after engine retrieval.
$orders = Order::search($request->string('q'))
    ->query(fn ($query) => $query->where('tenant_id', $user->tenant_id))
    ->get();
```

Also avoid:

- creating a non-null vector column on a large populated table and synchronously embedding every
  row inside the schema migration;
- enabling a database extension during a production deploy without verifying privileges;
- using a provider's new embedding model against a column created for a different dimension;
- depending on the implicit vector similarity threshold;
- using `order: false` without adding a deterministic, product-defined order;
- exposing MySQL boolean operators or PostgreSQL raw tsquery syntax as an undocumented input;
- assuming a SQLite test proves production full-text or vector behavior;
- embedding or reranking private text before authorization;
- logging raw queries, candidate documents, embeddings, provider payloads, or secrets;
- installing Scout or the AI SDK without explicit dependency scope.

## Failure Modes

### Full-text failures

- The application adds `whereFullText` but never creates the matching full-text index.
- A PostgreSQL index uses `english` while the query uses `simple`, changing matches and preventing
  the intended functional index path.
- A composite index covers `title` and `body`, but the query shape does not match the engine's
  usable indexed expression.
- PostgreSQL results are treated as relevance-ranked even though `whereFullText` only filters.
- MariaDB/MySQL stop-word, token-length, or collation behavior makes expected short terms vanish.
- Boolean or raw query syntax produces surprising semantics or errors for ordinary user input.
- An index build locks a large production table because online behavior was not planned.
- A fallback `%term%` scan becomes unbounded and bypasses the intended search index.

### Vector and embedding failures

- `Schema::ensureVectorExtensionExists()` fails because `pgvector` is unavailable or the migration
  role cannot create extensions.
- A migration calls vector query APIs on MySQL, MariaDB, SQLite, or SQL Server and receives the
  framework's PostgreSQL-only runtime exception.
- The provider returns 3072 values for a `vector(1536)` column.
- A provider/model change silently mixes incompatible semantic spaces in one column.
- A content update commits but its embedding job never runs, leaving stale retrieval data.
- A queued job runs before the transaction commits and embeds missing or previous content.
- Retried jobs write partial, duplicated, or out-of-order embedding versions.
- Null vectors are not excluded during a staged backfill.
- The HNSW index is absent, invalid, or not selected, causing a sequential scan at production size.
- A threshold calibrated for one model removes useful results after a model upgrade.
- A plain string passed to `whereVectorSimilarTo` reaches an unconfigured AI SDK/provider path.
- Embedding cache keys or stored prompts retain personal or regulated data longer than intended.
- Provider throttling, timeout, billing exhaustion, or regional outage turns every search request
  into an application failure.

### Reranking failures

- The initial candidate set is too broad, creating high latency and provider cost.
- The initial candidate set is arbitrary or low quality, so reranking never sees the best records.
- Unauthorized candidate text is sent to the provider before filtering.
- Original IDs are lost when ranked indexes are mapped back to Eloquent records.
- Duplicate text causes the wrong record to receive a score.
- Provider output is assumed complete, sorted, unique, and trustworthy without validation.
- The reranker times out and the endpoint has no deterministic first-stage fallback.
- A live provider is called from ordinary automated tests.

### Scout failures

- The agent assumes Scout is part of Laravel core and uses `Searchable` when the package is absent.
- Searchable data changes but a queued third-party index update is delayed or fails.
- Deletes, soft deletes, restores, bulk updates, or direct SQL leave an external index stale.
- Tenant fields are not configured as filterable in the selected third-party engine.
- Security filtering is placed in Scout's post-retrieval `query(...)` callback.
- A collection engine passes tests on tiny fixtures and exhausts memory in production.
- An engine switch changes ranking, filter, pagination, or soft-delete semantics without contract
  tests.
- Index documents expose fields the application policy would not return.

## Trade-offs

| Approach | Strengths | Costs and limits |
| --- | --- | --- |
| Escaped `LIKE` | Portable and simple for small datasets | No language ranking; leading wildcard scans |
| Native full text | Fast database-local keyword retrieval; no provider | Engine-specific language and ranking behavior |
| PostgreSQL vector | Semantic retrieval remains in the primary database | Extension, large vectors, model lifecycle, approximate index tuning |
| AI reranking | Improves semantic order without persisted vectors | Provider latency, cost, privacy, bounded candidate requirement |
| Scout database engine | Eloquent API and PostgreSQL relevance ordering without external service | Separate package; MySQL/PostgreSQL database-engine boundary |
| Scout third-party engine | Typo tolerance, facets, geo-search, custom ranking | External data copy, synchronization, queues, vendor operations |

A hybrid retrieve-then-rerank pipeline often gives better latency than reranking the corpus and
better semantic quality than keyword retrieval alone. It also adds two ranking stages, provider
failure handling, quality evaluation, and data-governance obligations.

HNSW improves nearest-neighbor latency at the cost of index storage, build time, write overhead,
and approximate recall. Measure with representative tenant filters, corpus size, vector
dimensions, threshold, and top-K. Do not infer production performance from an empty development
database.

Embedding at write time improves read latency but delays write completion or requires eventual
consistency. Queued embedding makes writes responsive but needs stale/null behavior, retries,
monitoring, and a freshness service-level objective.

Embedding caching reduces provider calls but can retain sensitive query or document-derived data.
Choose cache store, TTL, encryption, access, and deletion behavior as part of the threat model.

## Version and Package Boundaries

Treat these surfaces separately:

| Surface | Evidence | Availability |
| --- | --- | --- |
| Full-text schema and query builder | `laravel/framework` | Core; MariaDB/MySQL/PostgreSQL behavior differs |
| PostgreSQL vector schema and distance queries | `laravel/framework` plus database extension | Core APIs; PostgreSQL `pgvector` only for these queries |
| Embedding generation and reranking | `laravel/ai` | Separate package and provider configuration |
| Scout model search and engines | `laravel/scout` | Separate package and independently versioned drivers |
| MongoDB vector search | Laravel MongoDB package | Separate API; do not apply PostgreSQL query examples |

- Resolve the exact `laravel/framework` version from `composer.lock`. This reference is pinned to
  v13.19.0 behavior; verify method signatures again after a framework update.
- Resolve `laravel/ai` independently before using `Embeddings`, `Reranking`, collection `rerank`,
  or string-to-embedding convenience paths.
- Resolve `laravel/scout` and the selected engine/driver version independently. Framework 13 does
  not prove a compatible Scout driver is installed.
- Verify database server version and extension availability separately from PHP dependencies.
- Verify provider support for the requested embedding dimensions and reranking operation. AI SDK
  abstraction does not make every provider/model capability identical.
- Preserve the project's existing engine and provider choice unless correctness, security,
  compatibility, or an explicit user request justifies a change.
- Treat external engine settings, model names, HNSW tuning, ranking expressions, thresholds,
  quality metrics, and fallback policy as project conventions or derived recommendations.

When documentation summaries disagree about defaults, inspect the pinned framework implementation
and pass behavior-defining arguments explicitly. For v13.19.0, the pinned query builder source is
authoritative for the `0.6` default, while application code should still pass its calibrated
threshold.

## Testing

### Structural and migration tests

- Run migrations against the production database engine, not only SQLite.
- Assert the `pgvector` extension exists before creating vector columns in PostgreSQL integration
  environments.
- Assert full-text index names, columns, language, and online behavior.
- Assert vector column dimensions, nullability, HNSW index, and model array cast.
- Exercise a fresh migration, staged upgrade, rollback of application-owned objects, and rerun.
- Verify a concurrent/online PostgreSQL index migration is not wrapped in a transaction.
- Test duplicate deploy execution or migration isolation according to the deployment workflow.

### Search contract tests

- Test empty, whitespace-only, maximum-length, Unicode, stop-word, punctuation, and malformed
  mode-specific queries.
- Test accepted and rejected threshold values, including negative, greater than one, non-numeric,
  non-finite, and missing input.
- Test stable result limits and deterministic tie behavior.
- Test PostgreSQL full-text filtering separately from relevance ordering.
- Test MariaDB/MySQL natural-language and boolean modes only on the matching driver.
- Test no-result and fewer-than-limit behavior.
- Test null and stale embeddings during backfill.
- Test explicit vector ordering and `order: false` behavior.
- Test `selectVectorDistance`, distance threshold, and ordering with known small vectors.

### Authorization and tenant tests

- Create equally relevant documents in two tenants and prove the caller never receives or sends
  the other tenant's text to a provider.
- Test public, tenant, owner-only, soft-deleted, embargoed, and unauthorized records.
- Test `viewAny` denial and per-record visibility independently.
- For third-party Scout engines, assert tenant and visibility filters are present in the engine
  request, not only in a later Eloquent query.
- Test queue payloads and logs for private content, embeddings, and secrets.

### AI SDK tests

- Use `Embeddings::fake()` and `Reranking::fake()` for deterministic feature tests.
- Use `preventStrayEmbeddings()` and the AI SDK assertion APIs so an unexpected paid call fails the
  test instead of reaching a provider.
- Return embeddings with the exact production dimension in normal tests.
- Add wrong-size, missing, partial, duplicate, timeout, throttled, and provider-error responses.
- Assert batching, selected dimensions, cache policy, provider/model metadata, and retry idempotency.
- Assert reranked indexes map back to the correct Eloquent IDs and no unauthorized text is present.
- Keep live-provider smoke tests opt-in, budget-bounded, secret-protected, and outside ordinary pull
  request determinism.

### Scout tests

- Test create, update, delete, soft delete, restore, bulk import, and failed queued synchronization.
- Test the exact selected engine; the collection engine is not behavioral proof for database or
  third-party engines.
- Assert filterable attributes and index settings in an integration environment.
- Test engine outage, delayed freshness, pagination, and fallback behavior.
- Run a reconciliation check that compares application records with external index identity.

### Relevance and performance tests

- Maintain a versioned golden query set with relevant, irrelevant, tenant-forbidden, and hard
  negative documents.
- Measure product-appropriate metrics such as precision at K, recall at K, mean reciprocal rank,
  or normalized discounted cumulative gain. These are derived evaluation practices, not Laravel
  framework APIs.
- Record provider/model, embedding version, threshold, database version, corpus size, tenant
  distribution, and candidate count with each benchmark.
- Inspect `EXPLAIN (ANALYZE, BUFFERS)` or the matching engine plan using representative data.
- Measure p50/p95/p99 latency, provider calls, cache hits, tokens, cost, database time, and memory.
- Load-test concurrent search while writes and embedding backfills are active.
- Re-run quality and latency gates before changing model, dimensions, language, index, threshold,
  Scout engine, or reranking provider.

## Grounding

Classification: `mixed`.

| Classification | Claims in this reference |
| --- | --- |
| `official` | Documented Laravel 13 full-text, Search, migration, vector, and query-builder behavior |
| `source-verified` | Exact v13.19.0 signatures, PostgreSQL-only guard, `0.6` default, HNSW cosine grammar, string embedding call, and explicit vector-index command |
| `package-specific` | Laravel AI SDK embedding/reranking APIs and Scout engine behavior |
| `derived` | Tenant-first query design, staged backfill, model/version metadata, quality metrics, performance gates, privacy, and failure-recovery guidance |

The reproducible baseline is the repository's `source-lock.json`:

- Laravel docs 13.x commit `6d8246ff751a299421520660979cc34a2b255bc9`
- Laravel Framework v13.19.0 commit `514502b38e11bd676ecf83b271c9452cc7500f16`

Primary documentation:

- https://laravel.com/docs/13.x/search
- https://laravel.com/docs/13.x/queries#full-text-where-clauses
- https://laravel.com/docs/13.x/queries#vector-similarity-clauses
- https://laravel.com/docs/13.x/migrations#available-index-types
- https://laravel.com/docs/13.x/migrations#column-method-vector
- https://laravel.com/docs/13.x/ai-sdk#embeddings
- https://laravel.com/docs/13.x/ai-sdk#reranking
- https://laravel.com/docs/13.x/ai-sdk#testing
- https://laravel.com/docs/13.x/scout
- https://laravel.com/docs/13.x/authorization
- https://laravel.com/docs/13.x/validation

Pinned source evidence:

  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/search.md
  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/queries.md
  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/migrations.md
  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/ai-sdk.md
  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/scout.md
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Query/Builder.php
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Schema/Blueprint.php
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Schema/Builder.php
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Query/Grammars/PostgresGrammar.php
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Schema/Grammars/PostgresGrammar.php

Use Context7 `/laravel/docs/__branch__13.x` and live official documentation only as freshness
checks. If a generated summary conflicts with the pinned docs or framework implementation, cite
the conflict, follow the pinned source for this skill version, and make behavior-defining arguments
explicit in application code.
<!-- END: references/search-vector-reranking.md -->

<!-- BEGIN: references/security-rate-limiting-encryption.md -->
# Laravel 13 Security, Rate Limiting, Encryption, and Hashing

## Contents

- Identify trust boundaries before changing code.
- Validate, authorize, constrain, and safely serialize untrusted data.
- Apply rate limits with stable, privacy-conscious keys.
- Distinguish hashing, encryption, signing, and redaction.
- Verify failure behavior without exposing sensitive information.

## Applies To

Use this reference for sensitive endpoints, secrets, credentials, tokens,
personal data, database input, model writes, raw HTML, encryption, hashing,
signed values, rate limiting, login abuse, webhook abuse, and error disclosure.

Also load the domain-specific reference for sessions, uploads, webhooks,
database queries, authentication, or serialization.

Security is an end-to-end property; one Laravel helper does not secure an
otherwise incomplete flow.

## Verified Laravel 13 Behavior

Laravel validation rejects inputs that do not satisfy declared rules.

Authorization gates and policies can deny a concrete action with an HTTP 403
response.

Query Builder and Eloquent bind normal query values. Raw SQL expressions require
separate scrutiny.

Blade `{{ }}` escapes output through `htmlspecialchars`. Raw `{!! !!}` output
does not provide that protection.

Laravel's encrypter uses OpenSSL and signs encrypted values with a message
authentication code so modified ciphertext cannot be decrypted silently.

The `Crypt` facade provides `encryptString` and `decryptString` for strings.

The `Hash` facade provides secure password hashing, verification, and rehash
checks.

Hashing is one-way and is appropriate for passwords.

Encryption is reversible by an application holding its key and is appropriate
only when plaintext recovery is required.

Laravel rate limiters can be defined with `RateLimiter::for(...)` and attached
through throttle middleware.

Limit keys can be scoped by authenticated user, IP address, or another stable
application identifier.

Laravel returns HTTP 429 when a request exceeds an attached route rate limit.

Laravel's exception and logging systems can attach context, but application code
controls whether sensitive values are included.

## Correct Pattern

Define named limits with unambiguous keys:

```php runnable
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('account-actions', function (Request $request): Limit {
    $key = $request->user()
        ? 'user:'.$request->user()->getAuthIdentifier()
        : 'ip:'.$request->ip();

    return Limit::perMinute(20)->by($key);
});
```

Attach the named limiter to the narrow route group it protects:

```php illustrative
Route::middleware(['auth', 'throttle:account-actions'])
    ->group(function (): void {
        Route::post('/account/email', UpdateEmailController::class);
    });
```

Use layered limits for expensive or abuse-prone flows when the installed
framework syntax is verified, such as a short burst limit and a longer account
limit.

Hash passwords:

```php illustrative
use Illuminate\Support\Facades\Hash;

$user->forceFill([
    'password' => Hash::make($plainPassword),
])->save();

if (Hash::needsRehash($user->password)) {
    // Rehash after a successful credential verification.
}
```

Encrypt recoverable sensitive strings only when the data model requires
recovery:

```php illustrative
use Illuminate\Support\Facades\Crypt;

$ciphertext = Crypt::encryptString($externalReference);
$plaintext = Crypt::decryptString($ciphertext);
```

When rotating `APP_KEY`, deploy the new key together with the previous keys so
existing ciphertext and encrypted cookies remain decryptable during the
transition:

```dotenv illustrative
APP_KEY=base64:current-key-material
APP_PREVIOUS_KEYS="base64:previous-key-one,base64:previous-key-two"
```

Laravel always encrypts with the current key and attempts the configured
`APP_PREVIOUS_KEYS` only while decrypting. Remove an old key only after the
application has re-encrypted or expired every value that still depends on it.
Treat every listed key as a secret and coordinate rotation across all running
instances.

Keep secrets in environment-backed configuration or an approved secret manager.

Return safe client messages while logging a sanitized diagnostic identifier and
server-side context.

Use explicit field selection for mass writes and explicit resource transforms
for responses.

Allowlist raw SQL identifiers and order directions; bind data values.

Use escaped Blade output for untrusted data.

Verify webhook signatures against the raw body before transforming the payload
in a way that changes signed bytes.

## Incorrect Pattern

```php illustrative
$user->update($request->all());

$rows = DB::select(
    "select * from users order by {$request->input('sort')}"
);

return response()->json([
    'exception' => $exception->getMessage(),
]);
```

The example combines unbounded mass assignment, raw identifier injection, and
sensitive error disclosure.

Do not encrypt passwords.

Do not hash values that the application later needs to recover.

Do not use one global rate-limit key for all users.

Do not use only an IP key for authenticated high-value actions when account
scoping is available.

Do not expose `APP_KEY`, API tokens, authorization headers, cookies, reset
tokens, encryption plaintext, SQL, or stack traces.

Do not rely on hidden UI controls for authorization.

Do not output user-controlled HTML with raw Blade syntax.

Do not disable CSRF, signature checks, validation, or throttling to resolve one
failing integration.

Do not claim an encrypted database field is safe from an attacker who also
obtains the application key.

## Failure Modes

- A limiter key collides between user IDs and IP strings.
- A reverse proxy makes every request appear to come from one IP.
- A distributed deployment uses a non-shared limiter store.
- An endpoint dispatches expensive work before its rate limit or authorization.
- Error logs contain request bodies, credentials, or personal data.
- A raw SQL fragment accepts a client-provided column or direction.
- Model serialization exposes hidden internal or personal fields.
- Ciphertext becomes undecryptable after an uncoordinated key change.
- `APP_PREVIOUS_KEYS` is removed before old ciphertext or cookies have expired.
- A decryption exception is returned verbatim to the client.
- A password is hashed twice.
- Login messages reveal whether an email account exists.
- Raw Blade output enables stored or reflected XSS.
- A signed webhook is parsed or normalized before signature verification.
- A security test disables the middleware it intends to prove.

Model the attacker, protected asset, trust boundary, failure impact, and
recovery plan before choosing a control.

## Trade-offs

Stricter rate limits reduce abuse but can block legitimate users behind shared
networks.

Account-scoped limits are precise after authentication; IP limits still help
before identity is established.

Encryption protects data at rest from some exposures but adds key-management
and query limitations.

Hashing protects passwords from recovery but cannot support plaintext use
cases.

Detailed server logs accelerate diagnosis but increase privacy and secret
exposure risk.

Generic client errors protect internals but require correlation IDs or
structured server logs for support.

Raw SQL can express driver-specific features but increases review and
portability cost.

## Version and Package Boundaries

This reference uses Laravel 13 core validation, authorization, encryption,
hashing, query binding, Blade escaping, logging, and rate limiting.

Limiter storage behavior depends on the configured cache backend and deployment
topology.

Authentication packages may register their own limits and response contracts.

Web application firewalls, CDN limits, proxy trust, and infrastructure secrets
are outside Laravel core but can change observed behavior.

Database encryption extensions and searchable-encryption packages have
independent guarantees.

Package-specific security guidance is loaded only when that package is detected
or explicitly requested.

## Testing

Test each protected action as guest, wrong user, correct user, and privileged
user when applicable.

Assert rate-limit success below the threshold, HTTP 429 above it, and isolation
between limiter keys.

Test proxy-aware IP behavior in an environment matching production.

Test encryption round trips and modified ciphertext failure without exposing the
secret in test output.

Test key rotation by encrypting with the old key, booting with a new current key
and `APP_PREVIOUS_KEYS`, proving decryption succeeds, then proving it fails after
the previous key is intentionally retired.

Test `Hash::check` and rehash behavior with the project's configured driver.

Test invalid raw-query sort and filter inputs against an allowlist.

Assert logs and JSON errors omit credentials, tokens, SQL, paths, and sensitive
payloads.

Test Blade rendering of hostile input and assert it is escaped.

Run dependency and secret scanning appropriate to the repository before release.

Use focused feature tests rather than relying only on unit tests of individual
helpers.

## Grounding

- Authorization:
  https://laravel.com/docs/13.x/authorization
- Validation:
  https://laravel.com/docs/13.x/validation
- Rate limiting:
  https://laravel.com/docs/13.x/rate-limiting
- Encryption:
  https://laravel.com/docs/13.x/encryption
- Graceful key rotation:
  https://laravel.com/docs/13.x/encryption#gracefully-rotating-encryption-keys
- Hashing:
  https://laravel.com/docs/13.x/hashing
- Query Builder:
  https://laravel.com/docs/13.x/queries
- Blade escaping:
  https://laravel.com/docs/13.x/blade
- Error handling and logging:
  https://laravel.com/docs/13.x/errors
  https://laravel.com/docs/13.x/logging

Framework capabilities are `official`. Threat models, limit thresholds,
redaction policy, retention, and incident response are `project-convention` or
`derived-security` decisions.
<!-- END: references/security-rate-limiting-encryption.md -->

<!-- BEGIN: references/sessions-cookies-csrf.md -->
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
<!-- END: references/sessions-cookies-csrf.md -->

<!-- BEGIN: references/testing-quality.md -->
# Testing and Quality

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for Laravel unit, feature, HTTP, console, database, queue, event, mail,
notification, filesystem, and browser testing. Apply it when implementing behavior, fixing bugs,
reviewing regressions, or choosing the smallest test layer that proves an externally meaningful
outcome.

Read `phpunit.xml`, `tests/TestCase.php`, Composer scripts, factories, database configuration,
frontend test configuration, and CI before introducing a tool or convention. Follow the project's
Pest or PHPUnit style; neither test runner should be replaced solely by preference.

## Verified Laravel 13 Behavior

- Laravel applications support Pest or PHPUnit and conventionally separate `tests/Unit` from
  `tests/Feature`.
- `php artisan test` runs the configured PHP test suite and forwards supported runner options.
- Laravel boots the application for tests extending the project `Tests\TestCase`; plain unit tests
  need not boot the framework.
- The default test environment is controlled by `phpunit.xml`; cached configuration should be
  cleared before relying on changed test environment values.
- HTTP tests simulate requests internally and provide status, header, JSON, session, view, and
  validation assertions without opening a real network server.
- `RefreshDatabase` manages database state between tests. Its transaction/migration behavior
  depends on migration state and connection support.
- Model factories create or make test models and can express reusable states and relationships.
- Laravel supplies fakes for events, queues, buses, mail, notifications, storage, HTTP calls, and
  other framework boundaries.
- Console tests can execute Artisan commands and assert output, questions, tables, and exit codes.
- Time, exceptions, authentication, sessions, and container bindings have test helpers.
- Parallel test execution is available but may require the documented ParaTest dependency and
  parallel-safe external resources.
- Browser testing is a distinct layer with its own runtime and package/tool requirements.

## Correct Pattern

Start a behavior change with a focused failing test, make the smallest implementation pass, then
refactor while preserving the same evidence. Assert outcomes rather than private call sequences.

```php runnable
<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class SlugTest extends TestCase
{
    public function test_it_normalizes_words_for_a_url(): void
    {
        $slug = strtolower(str_replace(' ', '-', trim('  Laravel Skill  ')));

        self::assertSame('laravel-skill', $slug);
    }
}
```

Use a feature test when behavior crosses routing, middleware, validation, authorization, model,
or response boundaries:

```php illustrative
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('an owner can update a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->for($user)->create();

    $this->actingAs($user)
        ->put(route('posts.update', $post), ['title' => 'Revised'])
        ->assertRedirect(route('posts.show', $post));

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'title' => 'Revised',
    ]);
});
```

Use narrow fakes and pair action assertions with outcome assertions. For example, assert that a
job was dispatched and separately test the job's database or integration behavior.

## Incorrect Pattern

```php illustrative
// Brittle: tests a controller's private implementation instead of observable behavior.
$controller = Mockery::mock(PostController::class)->makePartial();
$controller->shouldReceive('normalizePayload')->once();

// Dangerous: disables every middleware, hiding authentication, CSRF, bindings, and throttling.
$this->withoutMiddleware()->post('/admin/delete-everything')->assertOk();

// Weak: status alone does not prove the intended state transition.
$this->post('/orders')->assertSuccessful();
```

Avoid production services, real mail delivery, unfaked outbound HTTP calls, shared mutable fixtures,
sleep-based timing, and assertions that pass when the expected code path never ran.

## Failure Modes

- A newly written test is green before implementation because it does not exercise the missing
  behavior.
- A test fails from broken setup, syntax, or missing dependency rather than the intended defect.
- SQLite behavior hides MySQL or PostgreSQL differences in constraints, locking, JSON, or SQL.
- Transactional tests cannot observe after-commit callbacks as expected.
- Parallel workers collide on files, ports, caches, queues, buckets, or external identifiers.
- A broad fake prevents listeners, jobs, or notifications that the test meant to exercise.
- Test order affects state because static caches, locale, time, or singleton bindings are not reset.
- Factories create unrealistic data and bypass important invariants.
- Snapshot assertions accept accidental contract changes without review.
- Coverage rises while authorization, failure paths, and concurrency remain untested.
- Browser tests depend on CSS selectors or arbitrary sleeps and become flaky.
- Cached configuration makes the suite use a database or credential different from `phpunit.xml`.

## Trade-offs

Unit tests are fast and precise for pure logic but cannot prove framework wiring. Feature tests
provide higher confidence for Laravel behavior with more setup and database cost. Browser tests
cover real user flows but are slower and require a browser/build environment.

Fakes improve isolation and failure determinism but can diverge from a provider contract. A small
number of sandbox or container-backed integration tests complements, rather than replaces, fast
application tests. Coverage is a diagnostic floor, not proof of useful assertions.

## Version and Package Boundaries

- Detect whether the project uses Pest, PHPUnit, Dusk, a browser plugin, ParaTest, Mockery, or
  another package before prescribing syntax.
- Pest and PHPUnit major versions have different attributes, configuration schemas, and plugin
  compatibility.
- Database behavior should be verified on each production database engine for driver-sensitive
  code.
- Queue, cache, Redis, filesystem, search, and browser tests may need service containers or package-
  specific fakes.
- Do not install a test runner, browser harness, or assertion package unless it is detected or
  explicitly requested.

## Testing

For every change, cover the success path, validation boundary, unauthenticated and unauthorized
paths, missing resources, conflicts, provider/queue failures, and relevant concurrency behavior.

Use this verification ladder:

1. Run the narrow test target and confirm the intended pre-implementation failure.
2. Run the same target after implementation and confirm it passes.
3. Run nearby feature and integration tests.
4. Run the complete PHP suite.
5. Run static analysis, formatting checks, frontend tests, and production asset build configured by
   the repository.
6. Run database and browser matrices when the changed behavior depends on them.

Record commands, exit status, and skipped environments. Do not claim a check passed when it was not
run or when it exited early without executing tests.

## Grounding

Classification: `official` for Laravel testing APIs and `project-convention` for the quality gate.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/testing
- https://laravel.com/docs/13.x/http-tests
- https://laravel.com/docs/13.x/database-testing
- https://laravel.com/docs/13.x/console-tests
- https://laravel.com/docs/13.x/mocking
- https://laravel.com/docs/13.x/browser-tests

Runner- and package-specific APIs must also be checked against the versions locked by Composer.
<!-- END: references/testing-quality.md -->

<!-- BEGIN: references/transactions-concurrency-idempotency.md -->
# Transactions, Concurrency, Idempotency, and After-Commit Work

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for multi-write domain operations, pessimistic locks, atomic state changes,
deadlock retries, idempotency keys, webhook deduplication, queue dispatch timing, transactional
outboxes, and other race-sensitive behavior. Draw the invariant, competing writers, lock order,
external side effects, retry sources, and database driver before choosing a mechanism.

A transaction protects work performed on its database connection. It does not make HTTP calls,
emails, cache writes, filesystem writes, or third-party operations transactional.

## Verified Laravel 13 Behavior

- `DB::transaction` commits when its callback returns and rolls back when the callback throws.
- The optional `attempts` argument retries transactions after recognized deadlocks. The callback
  must therefore tolerate being run again.
- Manual `beginTransaction`, `rollBack`, and `commit` are available when callback-based control is
  insufficient, but every exception path then needs explicit cleanup.
- Query-builder `lockForUpdate` and `sharedLock` request database row locks. They are meaningful
  only while a transaction keeps the selected rows locked.
- Row locks protect rows returned by the locking query. They do not reserve an arbitrary missing
  key across every supported database.
- `afterCommit` may be selected for a dispatched job. Queue connections may also set
  `after_commit` so jobs, queued listeners, mailables, notifications, and broadcasts wait for
  open transactions to commit.
- Work deferred until commit is discarded when the transaction rolls back.
- Database unique constraints arbitrate competing inserts. A pre-insert `exists` check alone
  cannot prevent a duplicate race.
- Cache atomic locks can coordinate work across processes when all workers share a lock-capable
  store, but they have lease and ownership semantics distinct from database transactions.

## Correct Pattern

Lock the aggregate inside a short transaction, perform only database work, and dispatch dependent
work after commit:

```php illustrative
use Illuminate\Support\Facades\DB;

$order = DB::transaction(function () use ($orderId, $actorId) {
    $order = Order::query()
        ->whereKey($orderId)
        ->lockForUpdate()
        ->firstOrFail();

    $order->confirmBy($actorId);
    $order->save();

    OrderEvent::query()->create([
        'order_id' => $order->id,
        'type' => 'confirmed',
    ]);

    ProcessConfirmedOrder::dispatch($order->id)->afterCommit();

    return $order;
}, attempts: 3);
```

Make the database the final arbiter for idempotency-key ownership:

```php illustrative
Schema::create('idempotency_records', function (Blueprint $table): void {
    $table->id();
    $table->foreignId('actor_id')->constrained('users')->cascadeOnDelete();
    $table->string('operation', 100);
    $table->string('idempotency_key', 160);
    $table->string('request_hash', 64);
    $table->string('status', 30);
    $table->json('stored_response')->nullable();
    $table->timestamp('expires_at')->nullable();
    $table->timestamps();

    $table->unique(
        ['actor_id', 'operation', 'idempotency_key'],
        'idempotency_actor_operation_key_unique',
    );
});
```

For the first request, attempt the insert. If a driver-classified unique-constraint exception
shows another request won, re-read that row and compare the request hash. Return the stored
response for the same hash, return a conflict for a different hash, or apply the project's bounded
in-progress policy. Do not identify duplicate-key exceptions by brittle message text.

```php illustrative
try {
    $record = IdempotencyRecord::query()->create($newRecordAttributes);
} catch (QueryException $exception) {
    if (! $duplicateKeyClassifier->matches($exception, 'idempotency_actor_operation_key_unique')) {
        throw $exception;
    }

    $record = IdempotencyRecord::query()
        ->where($idempotencyScope)
        ->firstOrFail();
}

if (! hash_equals($record->request_hash, $requestHash)) {
    throw new IdempotencyConflict();
}
```

The exception classifier is driver-specific infrastructure. Test it with the production driver.
The catch-and-re-read example must run in autocommit mode or after rolling back the transaction
that received the unique violation. PostgreSQL marks the current transaction as aborted after an
error, so querying again inside that same transaction fails until rollback. If ownership must be
claimed inside a larger transaction, use a driver-verified savepoint or an atomic conflict-ignore /
upsert strategy and prove its affected-row semantics on the production driver; do not assume the
same recovery sequence works across PostgreSQL, MySQL, and SQLite.

## Incorrect Pattern

```php illustrative
// Race: no row exists to lock, so two requests can both reach firstOrCreate.
$record = IdempotencyRecord::query()
    ->lockForUpdate()
    ->firstOrCreate($scope);

// Race: both requests can observe "not found".
if (! IdempotencyRecord::where($scope)->exists()) {
    IdempotencyRecord::create($scope);
}

DB::transaction(function () use ($paymentGateway): void {
    $paymentGateway->charge(); // Database rollback cannot undo this call.
    Order::query()->update(/* ... */);
});

ProcessOrder::dispatch($order); // May run before an open transaction commits.
```

Avoid holding locks while waiting on users, remote services, large file operations, or unbounded
loops.

## Failure Modes

- Two first requests create duplicate work because the idempotency scope lacks a unique index.
- `lockForUpdate` is called outside a transaction and releases before the protected update.
- Competing code paths lock rows in different orders and deadlock.
- A deadlock retry repeats an email, HTTP request, or non-idempotent callback inside the closure.
- A worker receives a job before the row it references is committed.
- After-commit dispatch is assumed to provide exactly-once delivery; a crash or queue retry still
  duplicates the side effect.
- The same idempotency key is accepted with a different request payload.
- An in-progress record never completes after a crash and every retry remains blocked.
- The stored response contains credentials, personal data, or an object that cannot be serialized
  consistently.
- A long transaction grows contention, replica lag, or lock wait timeouts.
- SQLite tests do not reproduce production row locks or isolation behavior.
- Multiple database connections are used, but only one participates in the transaction.
- Code catches a PostgreSQL unique violation and queries again before rolling back the aborted
  transaction.

## Trade-offs

Pessimistic locking gives straightforward serialization for hot aggregates but increases waiting
and deadlock risk. Optimistic conditional updates avoid waiting and work well when contention is
rare, but callers must handle a failed compare-and-set.

Idempotency records provide durable replay behavior and conflict detection at the cost of storage,
expiry, privacy, and recovery policy. A cache lock is lighter but may expire during work and
usually cannot return a durable prior response.

After-commit dispatch prevents pre-commit reads but leaves a crash window after commit and before
publication unless the queue integration is transactional. A transactional outbox closes that
window by persisting an event with domain changes, at the cost of a relay and eventual delivery.

## Version and Package Boundaries

- Confirm the installed Laravel version and queue connection before relying on after-commit APIs.
- Deadlock detection, isolation levels, missing-row/gap locks, lock timeouts, and error codes vary
  across MySQL/MariaDB, PostgreSQL, SQLite, and SQL Server.
- SQLite does not provide representative row-level locking for production concurrency tests.
- The queue `after_commit` option affects queued listeners, mailables, notifications, and
  broadcasts on that connection; inspect project configuration before adding per-dispatch calls.
- Cache locks require every participant to use the same central lock-capable store.
- Payment SDK idempotency, message-broker deduplication, and distributed transaction packages are
  external contracts and need installed-version primary documentation.

## Testing

- Test success, rollback, and exception paths for every transactional state transition.
- Run two independent connections or processes against the production driver to exercise races.
- Verify the unique constraint decides simultaneous first-use idempotency requests.
- Test same key/same hash, same key/different hash, in-progress timeout, completed replay, expiry,
  and failed-operation recovery.
- Force a retryable deadlock where practical and prove repeated closure execution is safe.
- Assert jobs are not visible before commit and are discarded on rollback.
- Test worker retry after the database commit and verify the external side effect remains
  idempotent.
- Test lock timeout and conflict responses without converting them into generic server errors.
- Inspect transaction duration and lock waits under representative load.

## Grounding

Classification: `official` for Laravel transaction, lock, and after-commit APIs; `derived` for
idempotency-record and outbox design. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/database#database-transactions
- https://laravel.com/docs/13.x/queries#pessimistic-locking
- https://laravel.com/docs/13.x/queues#jobs-and-database-transactions
- https://laravel.com/docs/13.x/events#queued-event-listeners-and-database-transactions
- https://laravel.com/docs/13.x/cache#atomic-locks
- https://laravel.com/docs/13.x/migrations#creating-indexes

Unique-constraint classification, lock semantics, and isolation behavior must also be verified
against the production database driver.
<!-- END: references/transactions-concurrency-idempotency.md -->

<!-- BEGIN: references/version-grounding.md -->
# Laravel 13 Version Grounding

## Contents

- Resolve the installed framework version before selecting APIs.
- Distinguish a locked reproducible baseline from live freshness checks.
- Handle Laravel 12, Laravel 13, and unknown-version projects safely.
- Record framework, documentation, skeleton, PHP, and package evidence.
- Verify upgrade-sensitive behavior instead of relying on memory.

## Applies To

Read this reference for every Laravel task before using version-specific syntax.

It applies to implementation, review, debugging, upgrades, package integration,
generated examples, production diagnosis, and greenfield design.

It is especially relevant when a prompt mentions `composer.json`, `composer.lock`,
Artisan, an unfamiliar framework API, a copied tutorial, or a Laravel major
upgrade.

The target repository remains the first source of truth. This reference supplies
Laravel 13 defaults only after the installed version has been established.

## Verified Laravel 13 Behavior

Laravel 13 was released on March 17, 2026.

Laravel 13 supports PHP 8.3 through PHP 8.5.

The published security-fix window runs through March 17, 2028.

The reproducible baseline recorded by this skill is:

- Laravel documentation branch `13.x` at commit
  `6d8246ff751a299421520660979cc34a2b255bc9`.
- Laravel Framework `v13.19.0` at commit
  `514502b38e11bd676ecf83b271c9452cc7500f16`.
- Laravel application skeleton branch `13.x` at commit
  `43f3606336468af53f85aa6c993ce72041c63a61`.

These values are a verification baseline, not a declaration that every Laravel
13 project uses framework patch 13.19.0.

Laravel follows semantic versioning for framework releases. Major versions may
contain breaking changes; minor and patch releases are intended to remain
backward compatible.

Laravel's backward-compatibility policy does not cover PHP named argument names.
Avoid depending on framework parameter names unless the installed source proves
the call is safe.

Laravel 13 includes high-impact request-forgery changes and smaller behavioral
changes across cache, database, Eloquent, queues, routing, and views. Read the
official upgrade guide whenever code crosses a Laravel 12/13 boundary.

The official greenfield path requires PHP, Composer, and the Laravel installer,
plus Node/NPM or Bun when frontend assets are built. `laravel new` creates the
application and prompts for supported choices instead of proving a particular
database, test runner, or starter kit from the Laravel version alone. The
current skeleton starts with SQLite, creates `database/database.sqlite`, and
runs its initial migrations.

The Laravel 12 to 13 upgrade guide requires reviewing dependency constraints,
not merely changing `laravel/framework`: its current baseline lists framework
`^13.0`, Boost `^2.0`, Tinker `^3.0`, PHPUnit `^12.0`, and Pest `^4.0` when those
packages are present. Composer must resolve the whole installed package graph.

High-impact Laravel 13 upgrade work includes the request-forgery middleware
rename and origin check. The official guide also calls out cache
`serializable_classes`, non-empty `uniqueBy` for database upserts, domain-route
precedence, changed queue event properties, contract method additions, and
other lower-impact compatibility points. Search the target project for each
applicable symbol and test observed behavior; do not turn this summary into a
blind replacement list.

### Laravel 12 to 13 compatibility inventory

Treat every item below as an applicability check against the target project, installed packages,
custom framework implementations, configuration, and tests:

- Update the whole dependency graph: `laravel/framework` to `^13.0`, and, when installed,
  `laravel/boost` to `^2.0`, `laravel/tinker` to `^3.0`, PHPUnit to `^12.0`, and Pest to `^4.0`.
  Update the global Laravel installer or Laravel Herd before generating Laravel 13 applications.
- Check fallback cache/Redis prefixes and the session cookie name, whose generated defaults now
  use hyphenated suffixes. Pin `CACHE_PREFIX`, `REDIS_PREFIX`, and `SESSION_COOKIE` when identity
  continuity across deployment matters.
- Custom cache `Store`/`Repository` implementations must support `touch`. Review the cache
  `serializable_classes` allow-list and migrate arbitrary object payloads to approved classes or
  non-object data.
- `Container::call` now honors a nullable class parameter's `null` default when no binding exists.
- Update custom contract implementations for Bus `Dispatcher::dispatchAfterResponse`, routing
  `ResponseFactory::eventStream`, `MustVerifyEmail::markEmailAsUnverified`, and queue inspection
  methods `pendingSize`, `delayedSize`, `reservedSize`, and
  `creationTimeOfOldestPendingJob`.
- Database `upsert` now rejects an empty `uniqueBy`, including on MySQL/MariaDB. Joined MySQL
  `DELETE` statements now compile `ORDER BY` and `LIMIT`; engines that reject that syntax may now
  throw instead of silently performing the prior behavior.
- Instantiating a model while the same model is booting now throws. Custom polymorphic pivot
  table inference now pluralizes names, and restored serialized Eloquent collections retain their
  eager-loaded relations.
- Custom HTTP client response subclasses must match the declared callback signatures for
  `Response::throw($callback = null)` and `throwIf($condition, $callback = null)`.
- The default password-reset subject is now `Reset your password`. Queued notifications honor
  `#[DeleteWhenMissingModels]` and `$deleteWhenMissingModels` on the notification class.
- Queue listeners must replace `JobAttempted::$exceptionOccurred` with `$exception` and
  `QueueBusy::$connection` with `$connectionName`.
- Explicit-domain routes are prioritized before non-domain routes. Schedules registered through
  `ApplicationBuilder::withScheduling()` are deferred until `Schedule` is resolved.
- Replace direct `VerifyCsrfToken` / `ValidateCsrfToken` references with
  `PreventRequestForgery`; Laravel 13 also checks request origin with `Sec-Fetch-Site` and exposes
  the `preventRequestForgery(...)` middleware configuration API.
- Manager `extend` callbacks are now bound to the manager instance. Capture service-provider state
  explicitly instead of assuming another `$this` binding.
- Test setup must recreate custom `Str` UUID, ULID, or random factories because Laravel resets
  them between tests. `Js::from` now emits unescaped Unicode by default.
- `symfony/polyfill-php85` may define global `array_first()` and `array_last()` below PHP 8.5 and
  conflict with legacy/custom helpers; prefer `Illuminate\Support\Arr` methods.
- Bootstrap 3 pagination defaults are now `pagination::bootstrap-3` and
  `pagination::simple-bootstrap-3`, replacing the former internal `default` names.

Also compare the Laravel 13 application skeleton with local configuration and comments. The
upgrade guide intentionally cannot enumerate every application-specific override.

## Correct Pattern

Resolve the version in this order:

1. Read the exact installed `laravel/framework` package in `composer.lock`.
2. If no lock exists, read the constraint in `composer.json`.
3. If vendor dependencies are installed and commands are safe, run
   `php artisan --version` or inspect `Application::VERSION`.
4. For a greenfield task, use the user's explicitly requested version.

For a new application, preserve the user's explicit database, test framework,
and UI choice. A conventional local bootstrap is:

```text
composer global require laravel/installer
laravel new example-app
cd example-app
npm install && npm run build
composer run dev
```

Do not execute remote install scripts, globally install tools, start services,
or overwrite a directory without the user's authorization. Use the package
manager represented by the generated lockfile. Keep `.env` uncommitted, verify
`APP_KEY`, configure the actual database, and run migrations deliberately.

For an upgrade, first create an inventory of installed Laravel packages and
application overrides. Update constraints together, regenerate the lockfile,
review the full dependency diff, run static analysis and focused compatibility
tests, then exercise the complete suite and deployment/rollback path. Search at
minimum for old request-forgery middleware names, custom cache stores, custom
framework-contract implementations, `upsert` calls, queue event listeners,
domain routes, serialized Eloquent collections, and custom manager drivers.

Treat a Composer constraint such as `^13.0` as a range, not an installed patch.

Record evidence in working notes before choosing an API:

```php illustrative
use Illuminate\Foundation\Application;

$runtimeVersion = app()->version();
$isLaravel13 = version_compare($runtimeVersion, '13.0.0', '>=')
    && version_compare($runtimeVersion, '14.0.0', '<');

if (! $isLaravel13) {
    throw new LogicException(
        "This example targets Laravel 13; detected {$runtimeVersion}."
    );
}
```

Use the installed source for exact behavior when it is available.

Use `source-lock.json` when the project has no installed source or when a
reproducible citation is required.

Use Laravel Boost `search-docs` when Boost is installed and its package-aware
documentation search is available.

Use Context7 library `/laravel/docs/__branch__13.x` when Boost is unavailable.

Use the live official Laravel 13 documentation only as a freshness check, then
record any drift from the pinned baseline.

For optional packages, resolve their installed version separately. A Laravel 13
application does not imply a particular Sanctum, Livewire, Inertia, Boost, AI
SDK, MCP, Vite, or frontend package version.

When the detected framework is not Laravel 13, report the mismatch and switch to
the matching official documentation. Do not transplant Laravel 13-only syntax
into the older project.

When the version remains unknown, limit work to version-neutral inspection and
state what evidence is missing.

## Incorrect Pattern

Do not infer Laravel 13 from this skill's name.

Do not infer an installed patch from `"laravel/framework": "^13.0"`.

Do not use a tutorial's publication date as version evidence.

Do not mix `master` documentation with a `13.x` application without checking the
installed source.

Do not claim an optional package API is part of Laravel core.

Do not silently update source-lock commits during feature work.

Do not copy a Laravel 13 attribute, middleware name, or method into Laravel 12
because the code looks compatible.

Do not assume `laravel new` selected a UI starter kit or optional package unless
the generated project proves that choice.

Do not update only `laravel/framework` and ignore conflicting first-party,
testing, Composer-plugin, or PHP constraints.

Do not use PHP named arguments against a framework method solely from memory.

## Failure Modes

- A lockfile can be stale relative to `vendor/` after an incomplete install.
- `composer.json` can permit multiple major or minor versions.
- A monorepo can contain more than one Laravel application.
- A Docker runtime can differ from the host's Composer files.
- A globally installed Artisan command is not evidence for the project version.
- Package documentation can describe the latest package rather than the locked
  package.
- Branch URLs drift over time even though their label remains `13.x`.
- A framework tag can be newer than the reference snapshot.
- A copied skeleton file can be customized and no longer represent the project.
- Cached configuration can make runtime behavior differ from edited files.
- A global Laravel installer is stale and generates a different major skeleton.
- A greenfield setup silently chooses a database, test runner, or starter kit
  that the user did not request.
- An upgrade changes Composer constraints but misses renamed middleware,
  contracts, queue events, cache serialization, or routing behavior.

When evidence conflicts, prefer the runtime actually serving the application,
then explain the discrepancy between runtime, lockfile, and source tree.

## Trade-offs

Pinned commits provide reproducibility but become stale.

Live documentation improves freshness but can change after an answer or test was
written.

Installed source is exact for the project but may be unavailable in a source-only
review.

Runtime inspection is strong evidence but can be unsafe or impossible in
production.

Composer constraints describe intent but not the resolved dependency graph.

Use at least two forms of evidence for upgrades or security-sensitive behavior.

## Version and Package Boundaries

This reference targets Laravel 13 and PHP 8.3+.

The framework patch baseline is 13.19.0; projects on another 13.x patch require
their installed source and changelog to resolve patch-level differences.

Laravel Boost, AI SDK, MCP, Sanctum, Passport, Horizon, Octane, Livewire,
Inertia, Flux, Tailwind, React, Vue, Svelte, and Vite are versioned independently.

Frontend versions come from the active npm, pnpm, Yarn, or Bun lockfile.

Database, Redis, queue, mail, and filesystem capabilities also depend on their
drivers and infrastructure versions.

## Testing

Test the resolver with locked Laravel 13, constrained-only Laravel 13, Laravel
12, missing files, malformed lockfiles, and monorepo fixtures.

Verify that a non-13 fixture prevents selection of Laravel 13-only examples.

Verify that package versions are taken from the relevant lockfile.

Run `php artisan --version` only in a disposable or approved project runtime.

Compare the source-lock values with read-only `git ls-remote` checks in scheduled
drift validation.

Require a grounding footer in behavioral evals:

```text
Laravel grounding: detected 13.19.0 from composer.lock; read references/version-grounding.md; verified against official Laravel 13.x docs.
```

## Grounding

- Official installation guide:
  https://laravel.com/docs/13.x/installation
- Official release policy:
  https://laravel.com/docs/13.x/releases
- Official upgrade guide:
  https://laravel.com/docs/13.x/upgrade
- Pinned documentation:
  https://github.com/laravel/docs/tree/6d8246ff751a299421520660979cc34a2b255bc9
- Pinned framework:
  https://github.com/laravel/framework/tree/514502b38e11bd676ecf83b271c9452cc7500f16
- Pinned skeleton:
  https://github.com/laravel/laravel/tree/43f3606336468af53f85aa6c993ce72041c63a61

Provenance classification: `official` for the facts above, `project` for detected
local behavior, and `derived` for conclusions produced by comparing sources.
<!-- END: references/version-grounding.md -->
