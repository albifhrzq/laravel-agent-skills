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
