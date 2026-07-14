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
