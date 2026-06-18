# Laravel 13 FormRequest Validation Guide

Guide for using FormRequest classes to keep Laravel API validation consistent, testable, and controller-safe.

## When to Use

Use this guide when creating or reviewing:

- create/update endpoints
- login or refresh requests
- search/filter/sort requests
- imports
- checkout/order flows
- webhook payload validation
- file upload validation
- complex conditional validation

## Core Rule

Use FormRequest classes for non-trivial API requests. Avoid large inline validation blocks inside controllers.

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

Controller:

```php
public function store(StoreProductRequest $request, CreateProductAction $createProduct): ProductResource
{
    $product = $createProduct->execute($request->user(), $request->validated());

    return ProductResource::make($product);
}
```

## Authorization in FormRequest

Use `authorize()` for request-level authorization, especially when the decision depends on the authenticated user and route model.

```php
public function authorize(): bool
{
    $product = $this->route('product');

    return $product && $this->user()->can('update', $product);
}
```

Still use policies/gates for resource-level authorization. FormRequest authorization should not become a replacement for policy design.

## validated() vs safe() vs all()

Prefer:

```php
$data = $request->validated();
```

or:

```php
$data = $request->safe()->only(['name', 'price']);
```

Avoid:

```php
$data = $request->all();
```

`all()` can include unvalidated fields, which may create mass assignment, authorization, or data integrity issues.

## prepareForValidation()

Use `prepareForValidation()` only for deterministic normalization.

Good examples:

```php
protected function prepareForValidation(): void
{
    $this->merge([
        'email' => strtolower(trim((string) $this->email)),
        'slug' => Str::slug((string) $this->slug),
    ]);
}
```

Avoid using it for:

- database writes
- external service calls
- authorization decisions
- hidden business workflows

## Partial Updates

For PATCH endpoints, do not accidentally null fields that were not sent.

```php
public function rules(): array
{
    return [
        'name' => ['sometimes', 'string', 'max:120'],
        'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
        'price' => ['sometimes', 'integer', 'min:0'],
    ];
}
```

## Collection Query Validation

Validate filter, sort, and pagination inputs too.

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

Never pass arbitrary request input into `orderBy`, `where`, or raw SQL.

## Auth Request Validation

Login, refresh, password reset, and verification endpoints should have dedicated FormRequest classes.

For auth-sensitive endpoints:

- validate input shape strictly
- rate-limit separately
- keep error responses consistent
- avoid leaking whether an email/account exists when that would create enumeration risk

## Error Shape

Validation failures should be converted into the project error envelope. The field-level details should remain machine-readable.

Example project-level shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "email": ["The email field is required."]
    }
  }
}
```

## Test Checklist

For every important FormRequest, cover:

- required field missing
- invalid type
- invalid enum/status
- max length
- unauthorized user
- valid request success
- partial update does not overwrite omitted fields
- filter/sort validation for collection endpoints

## Review Checklist

Before accepting validation changes, verify:

- validation is in FormRequest for non-trivial endpoints
- controllers only use `validated()` or `safe()` data
- `authorize()` is explicit when the request is resource-sensitive
- max length / min / enum / exists rules are present where needed
- array inputs have bounds
- filter/sort inputs are allowlisted
- validation failure response matches the API contract
