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
