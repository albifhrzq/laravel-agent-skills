# Laravel 13 API Resource Guide

Guide for shaping Laravel API responses with Laravel resource classes.

## Purpose

Use this guide when creating or reviewing `JsonResource`, `ResourceCollection`, paginated API responses, conditional fields, relationship inclusion, and Laravel 13 JSON:API Resources.

## Core Rule

Use resource classes for important API responses. Avoid returning raw Eloquent models from controllers.

```php
return ProductResource::make($product);
return ProductResource::collection($products);
```

## Basic Resource

```php
final class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
```

## Conditional Fields

Use `when()` for fields that depend on user permission, route context, or feature state.

```php
'internal_note' => $this->when($request->user()?->can('viewInternal', $this->resource), $this->internal_note),
```

## Relationships

Use `whenLoaded()` so the resource does not accidentally trigger lazy loading.

```php
'shop' => ShopResource::make($this->whenLoaded('shop')),
'items' => OrderItemResource::collection($this->whenLoaded('items')),
```

The controller or query layer should decide which relationships are loaded.

## Counts

Use `whenCounted()` for aggregate counts that were loaded intentionally.

```php
'comments_count' => $this->whenCounted('comments'),
```

## Pagination

Paginated resource responses should keep Laravel pagination `meta` and `links` data.

```php
return ProductResource::collection($products->paginate(15));
```

## JSON:API Resources

Laravel 13 includes JSON:API Resources. Use them only when the project intentionally follows the JSON:API specification. Do not mix normal Laravel resource envelopes and JSON:API-style envelopes in the same API without a documented reason.

## Review Checklist

- Resource classes are used for public API responses.
- Response fields are intentional and stable.
- Relationships use `whenLoaded()`.
- Counts use `whenCounted()`.
- Paginated responses preserve `meta` and `links`.
- JSON:API Resources are used only when the project follows JSON:API.
- Feature tests assert key JSON paths and response shapes.
