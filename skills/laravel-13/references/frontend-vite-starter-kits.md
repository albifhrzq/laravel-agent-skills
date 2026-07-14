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
