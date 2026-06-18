---
title: Keep Laravel API Documentation and Feature Tests in Sync
impact: HIGH
impactDescription: API contracts should be documented and protected by tests before clients depend on them.
tags: laravel, api, openapi, tests, pest, phpunit, contract
---

# Keep Laravel API Documentation and Feature Tests in Sync

## Rule

Every important API endpoint should have feature tests and documentation that describe the request, response, auth requirements, validation errors, and important edge cases.

## Feature Test Guidance

Cover at minimum:

- Success response and JSON shape.
- Validation failure with expected error envelope.
- Unauthenticated response (`401`) when auth is required.
- Forbidden response (`403`) when the user lacks permission.
- Not found or scoped-not-found behavior.
- Conflict or idempotency behavior for state transitions.
- Pagination/filter/sort behavior for collection endpoints.

## Example

```php
it('allows a seller to create a product', function () {
    $seller = User::factory()->seller()->create();
    $shop = Shop::factory()->forOwner($seller)->create();

    Sanctum::actingAs($seller);

    postJson('/api/v1/shops/'.$shop->id.'/products', [
        'name' => 'Test Product',
        'price' => 100000,
    ])
        ->assertCreated()
        ->assertJsonPath('data.name', 'Test Product');
});
```

## Documentation Guidance

- Maintain OpenAPI/Swagger when the project exposes API docs or external consumers.
- Document auth scheme, rate limits, idempotency headers, pagination parameters, filters, sort fields, and error codes.
- Include request and response examples.
- Update docs in the same PR as route/contract changes.
- Keep internal-only endpoints clearly marked.

## Acceptance Criteria

A contract change is not done until feature tests and API documentation are updated or the PR clearly explains why docs are not applicable.
