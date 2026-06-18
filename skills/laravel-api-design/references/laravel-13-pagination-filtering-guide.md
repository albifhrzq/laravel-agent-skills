# Laravel 13 Pagination & Filtering Guide

Guide for designing safe, predictable, and performant Laravel API collection endpoints.

## When to Use

Use this guide when creating or reviewing:

- list endpoints
- search endpoints
- filtering
- sorting
- pagination
- feed/timeline endpoints
- admin tables
- marketplace listing APIs

## Core Rule

Every collection endpoint should define:

- pagination type
- maximum `per_page`
- allowed filters
- allowed sort fields
- default ordering
- relationship loading strategy

Never pass arbitrary request input directly into query columns or sort expressions.

## Request Validation

Validate collection query parameters with FormRequest.

```php
final class ProductIndexRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'filter.status' => ['sometimes', Rule::in(['draft', 'published'])],
            'filter.shop_id' => ['sometimes', 'uuid', Rule::exists('shops', 'id')],
            'sort' => ['sometimes', Rule::in(['created_at', '-created_at', 'price', '-price'])],
        ];
    }
}
```

## Pagination Choices

Use the right Laravel paginator for the API shape:

```text
paginate()        = includes total counts; useful for admin tables
simplePaginate()  = no total count; useful when total is expensive
cursorPaginate()  = stable large feeds and infinite scroll
```

For large marketplace feeds, logs, notifications, or timelines, prefer cursor pagination when possible.

## Safe Sorting

Map allowed sort values to known columns.

```php
$sortMap = [
    'created_at' => ['created_at', 'asc'],
    '-created_at' => ['created_at', 'desc'],
    'price' => ['price', 'asc'],
    '-price' => ['price', 'desc'],
];

[$column, $direction] = $sortMap[$request->input('sort', '-created_at')];
$query->orderBy($column, $direction);
```

Avoid:

```php
$query->orderBy($request->input('sort'));
```

## Filtering

Use explicit filters:

```php
$query
    ->when($request->input('filter.status'), fn ($query, $status) => $query->where('status', $status))
    ->when($request->input('filter.shop_id'), fn ($query, $shopId) => $query->where('shop_id', $shopId));
```

Do not allow users to filter every database column unless the project has a reviewed query-builder layer.

## Relationship Loading

Avoid N+1 queries:

```php
$products = Product::query()
    ->with(['shop'])
    ->latest()
    ->paginate($request->integer('per_page', 15));
```

Load relationships intentionally, based on the API response contract.

## Index Awareness

Before adding filters/sorts on large tables, check whether the database has suitable indexes.

Common index candidates:

- foreign keys used in filters
- status/type fields used in filters
- date fields used for ordering
- compound indexes for common filter + sort combinations

## Response Contract

Paginated resource responses should preserve pagination `meta` and `links`.

```php
return ProductResource::collection($products);
```

## Test Checklist

Test:

- default pagination
- max `per_page` rejected or capped
- one valid filter
- invalid filter value
- one valid sort
- invalid sort value
- response includes pagination metadata
- response does not trigger obvious N+1 behavior when test tooling supports it

## Review Checklist

Before accepting collection endpoint changes, verify:

- filters and sorts are allowlisted
- pagination is bounded
- default ordering is stable
- large feeds use appropriate pagination
- relationships are eager loaded intentionally
- indexes are considered for new filter/sort fields
- tests cover filters, sorts, and pagination metadata
