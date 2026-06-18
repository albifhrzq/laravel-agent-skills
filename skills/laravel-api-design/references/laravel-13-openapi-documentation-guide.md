# Laravel 13 OpenAPI Documentation Guide

Guide for keeping Laravel API documentation aligned with the implemented API contract.

## When to Use

Use this guide when creating or reviewing:

- OpenAPI / Swagger documentation
- public API docs
- partner API docs
- request/response examples
- auth documentation
- error code documentation
- API version changes
- contract changes

## Core Rule

A meaningful API contract change should update tests and documentation in the same change set.

## What to Document

For each endpoint, document:

- HTTP method
- URL path
- route version
- auth requirement
- required abilities or roles
- request headers
- path parameters
- query parameters
- request body
- success response
- error responses
- pagination behavior
- rate limits when relevant
- idempotency behavior when relevant

## Auth Documentation

Document the selected auth strategy:

```text
Sanctum session or token auth
JWT bearer auth
Passport OAuth-style auth
external provider auth
public unauthenticated endpoint
```

For JWT APIs, document lifetime, refresh behavior, logout behavior, and expected error codes at a high level.

## Error Codes

Document machine-readable error codes.

Example:

```text
VALIDATION_ERROR
AUTH_REQUIRED
FORBIDDEN
NOT_FOUND
CONFLICT
RATE_LIMITED
TOKEN_EXPIRED
TOKEN_INVALID
```

Error documentation should match the actual exception rendering and tests.

## Pagination Documentation

For collection endpoints, document:

- pagination type
- query parameters
- maximum `per_page`
- default ordering
- allowed filters
- allowed sorts
- response `meta` and `links`

## Request and Response Examples

Include examples that are realistic but safe.

Good examples:

```json
{
  "name": "Example Product",
  "price": 100000
}
```

```json
{
  "data": {
    "id": "product-id",
    "name": "Example Product",
    "price": 100000
  }
}
```

Avoid examples that include real credentials, private data, production identifiers, or internal-only fields.

## Versioning and Deprecation

When an API version changes, document:

- what changed
- migration path
- deprecated fields or endpoints
- removal timeline when applicable
- compatibility notes for clients

## Documentation Review Checklist

Before accepting documentation changes, verify:

- documented routes exist in code
- request fields match FormRequest rules
- response examples match Resource classes
- error responses match exception rendering
- auth and authorization requirements are clear
- pagination/filter/sort docs match implementation
- idempotency docs exist for retry-sensitive endpoints
- tests cover the documented contract
