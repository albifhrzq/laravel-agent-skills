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
