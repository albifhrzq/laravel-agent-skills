---
title: Shape API Responses with JsonResource and ResourceCollection
impact: CRITICAL
impactDescription: Explicit resources prevent accidental model leaks and keep contracts stable.
tags: laravel, api, resources, response-contract
---

# Shape API Responses with JsonResource and ResourceCollection

## Rule

Return `JsonResource` or `ResourceCollection` classes for API data. Do not return raw Eloquent models, query builders, or arbitrary arrays for important endpoints.

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

## Avoid

```php
return Product::findOrFail($id);
return response()->json($product->toArray());
```

## Laravel Guidance

- Hide internal columns such as password hashes, remember tokens, internal notes, flags, secret keys, provider tokens, and operational metadata.
- Use `whenLoaded()` to avoid accidental lazy loading.
- Use `when()` and `mergeWhen()` for conditional fields.
- Keep timestamps consistent, preferably ISO 8601 for APIs.
- Avoid changing field names casually; response fields are client contracts.
- Keep naming convention consistent. Laravel commonly uses `snake_case`; choose one convention and enforce it.

## Acceptance Criteria

API responses expose only intentional fields, use resources for transformation, avoid lazy-loading surprises, and have feature tests asserting key JSON paths.
