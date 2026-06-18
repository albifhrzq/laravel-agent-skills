---
title: Shape API Responses with Laravel Resources
impact: CRITICAL
impactDescription: Explicit resources prevent accidental model leaks and keep contracts stable.
tags: laravel, api, resources, json-api, response-contract
---

# Shape API Responses with Laravel Resources

## Rule

Return Laravel resource classes for API data. Use `JsonResource` / `ResourceCollection` for normal Laravel JSON APIs, and consider Laravel 13 `JsonApiResource` when the project intentionally follows the JSON:API specification. Do not return raw Eloquent models, query builders, or arbitrary arrays for important endpoints.

## Prefer

```php
final class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'shop' => ShopResource::make($this->whenLoaded('shop')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
```

```php
return ProductResource::make($product);
return ProductResource::collection($products);
```

For JSON:API projects, prefer Laravel 13 JSON:API Resources instead of hand-rolling a JSON:API-like structure.

## Avoid

```php
return Product::findOrFail($id);
return response()->json($product->toArray());
```

## Laravel Guidance

- Hide internal columns such as password hashes, remember tokens, internal notes, flags, secret keys, provider tokens, and operational metadata.
- Use `whenLoaded()` to avoid accidental lazy loading.
- Use `when()` and `mergeWhen()` for conditional fields.
- Use `whenCounted()` when exposing preloaded aggregate counts.
- Keep timestamps consistent, preferably ISO 8601 for APIs.
- Avoid changing field names casually; response fields are client contracts.
- Keep naming convention consistent. Laravel commonly uses `snake_case`; choose one convention and enforce it.
- Remember that paginated resource responses include pagination `meta` and `links` information.

## Acceptance Criteria

API responses expose only intentional fields, use resources for transformation, avoid lazy-loading surprises, choose JsonResource vs JSON:API Resources intentionally, and have feature tests asserting key JSON paths.
