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
