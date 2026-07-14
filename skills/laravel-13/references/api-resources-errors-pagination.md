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
