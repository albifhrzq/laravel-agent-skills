---
title: Make Pagination, Filtering, and Sorting Explicit and Safe
impact: HIGH
impactDescription: Collection endpoints must be predictable, performant, and protected from unsafe query input.
tags: laravel, api, pagination, filtering, sorting, eloquent
---

# Make Pagination, Filtering, and Sorting Explicit and Safe

## Rule

Every collection endpoint must define pagination, filtering, sorting, and maximum result limits. Never pass arbitrary request parameters directly into Eloquent queries.

## Prefer

```php
final class ProductIndexRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'filter.status' => ['sometimes', Rule::in(['draft', 'published'])],
            'sort' => ['sometimes', Rule::in(['created_at', '-created_at', 'price', '-price'])],
        ];
    }
}
```

```php
$products = Product::query()
    ->with(['shop'])
    ->when($request->input('filter.status'), fn ($query, $status) => $query->where('status', $status))
    ->when($request->input('sort'), fn ($query, $sort) => applyAllowedSort($query, $sort))
    ->paginate($request->integer('per_page', 15));
```

## Laravel Guidance

- Use `paginate()` for admin/simple lists where total counts are acceptable.
- Use `simplePaginate()` when total count is unnecessary.
- Use `cursorPaginate()` for large feeds, timelines, logs, notifications, marketplace listings, or infinite scroll.
- Set a hard maximum `per_page`.
- Allowlist filter and sort fields.
- Avoid sorting by unindexed columns on large tables.
- Avoid N+1 queries; use `with()`, `load()`, or explicit query projections.
- Keep filter names stable because clients depend on them.

## Avoid

```php
$query->orderBy($request->input('sort'));
$query->where($request->all());
Product::all();
```

## Acceptance Criteria

Collection endpoints have bounded pagination, safe filters/sorts, no raw user-controlled SQL fields, appropriate indexes, and tests for default pagination plus at least one filter/sort path.
