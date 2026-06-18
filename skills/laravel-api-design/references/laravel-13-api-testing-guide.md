# Laravel 13 API Testing Guide

Guide for testing Laravel 13 API contracts with feature tests.

## When to Use

Use this guide when creating or reviewing:

- API feature tests
- auth tests
- validation tests
- resource response tests
- pagination tests
- rate-limit tests
- idempotency tests
- webhook tests

## Core Rule

Important API endpoints should have feature tests for both success and failure paths.

## JSON Request Helpers

Laravel provides JSON API helpers such as:

```php
getJson('/api/v1/products');
postJson('/api/v1/products', ['name' => 'Example']);
putJson('/api/v1/products/'.$product->id, ['name' => 'Updated']);
patchJson('/api/v1/products/'.$product->id, ['name' => 'Updated']);
deleteJson('/api/v1/products/'.$product->id);
```

Use JSON helpers for API tests instead of generic request helpers when testing API endpoints.

## Basic Success Test

```php
it('lists products', function () {
    Product::factory()->count(3)->create();

    getJson('/api/v1/products')
        ->assertOk()
        ->assertJsonStructure([
            'data',
            'meta',
            'links',
        ]);
});
```

## Create Test

```php
it('creates a product', function () {
    $user = User::factory()->create();
    $shop = Shop::factory()->create(['user_id' => $user->id]);

    actingAs($user);

    postJson('/api/v1/shops/'.$shop->id.'/products', [
        'name' => 'Test Product',
        'price' => 100000,
    ])
        ->assertCreated()
        ->assertJsonPath('data.name', 'Test Product');
});
```

## Failure Matrix

For protected endpoints, cover:

```text
401 unauthenticated
403 forbidden
404 not found or scoped not found
409 conflict
422 validation failure
429 rate limited
```

## Validation Test

```php
postJson('/api/v1/products', [])
    ->assertUnprocessable()
    ->assertJsonPath('error.code', 'VALIDATION_ERROR');
```

## Auth Tests

Test 401 and 403 separately.

```php
getJson('/api/v1/me')->assertUnauthorized();
```

```php
actingAs($user);
patchJson('/api/v1/products/'.$product->id, ['name' => 'Updated'])
    ->assertForbidden();
```

## Resource Shape Tests

Assert important fields and absence of internal fields.

```php
getJson('/api/v1/products/'.$product->id)
    ->assertOk()
    ->assertJsonPath('data.id', $product->id)
    ->assertJsonPath('data.name', $product->name)
    ->assertJsonMissingPath('data.internal_note');
```

## Pagination Tests

```php
getJson('/api/v1/products?per_page=10')
    ->assertOk()
    ->assertJsonStructure(['data', 'meta', 'links']);
```

Also test invalid `per_page`, invalid filters, and invalid sort values.

## JWT Tests

For JWT APIs, test the whole lifecycle:

- login success
- login failure
- authenticated user lookup
- missing credential
- invalid credential
- expired credential
- refresh success
- refresh failure
- logout or invalidation behavior
- authenticated but forbidden action

## Idempotency Tests

For retry-safe endpoints, test:

- first request succeeds
- duplicate request returns same result
- same key with different body returns 409
- side effect is not duplicated

## Webhook Tests

For webhook endpoints, test:

- valid event accepted
- duplicate event ignored safely
- invalid verification rejected
- processing job dispatched when expected

## Review Checklist

Before accepting API test changes, verify:

- tests use JSON request helpers
- success and failure paths are covered
- 401 and 403 are separate
- response shape is asserted
- validation envelope is asserted
- pagination metadata is asserted
- auth lifecycle tests exist when auth changes
- idempotency/webhook tests exist when side effects are introduced
