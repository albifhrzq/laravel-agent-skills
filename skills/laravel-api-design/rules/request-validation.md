---
title: Validate API Input with FormRequest Classes
impact: CRITICAL
impactDescription: Centralized validation keeps controllers thin and API failures consistent.
tags: laravel, api, validation, form-request
---

# Validate API Input with FormRequest Classes

## Rule

Use FormRequest classes for create, update, search, filter, import, checkout, payment, and other non-trivial API requests. Avoid large inline validation blocks in controllers.

## Prefer

```php
final class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Product::class);
    }

    public function rules(): array
    {
        return [
            'shop_id' => ['required', 'uuid', Rule::exists('shops', 'id')],
            'name' => ['required', 'string', 'max:120'],
            'price' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
```

## Avoid

```php
public function store(Request $request)
{
    $data = $request->validate([...]);
    // large business workflow continues here
}
```

## Laravel Guidance

- Use `authorize()` for request-level permission checks, but still use policies for resource-level authorization.
- Use `validated()` or `safe()` only; do not trust `$request->all()`.
- Normalize input in `prepareForValidation()` only when the normalization is deterministic and safe.
- Use enum rules for status/type fields.
- Use explicit max limits for strings, arrays, and upload sizes.
- Validate filters and sorting fields, not just write payloads.
- For partial updates, use `sometimes` and avoid accidentally nulling fields.

## Acceptance Criteria

Every important API write endpoint has a FormRequest, authorization is explicit, tests cover validation failure shape, and controllers receive already-validated data.
