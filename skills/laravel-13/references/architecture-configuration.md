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
