---
title: Use a Safe and Consistent API Error Envelope
impact: CRITICAL
impactDescription: Consistent error responses make clients reliable and prevent sensitive data leaks.
tags: laravel, api, errors, exceptions, validation
---

# Use a Safe and Consistent API Error Envelope

## Rule

Normalize API errors into one project-wide JSON shape. Never expose stack traces, SQL errors, exception class names, or internal infrastructure details in production.

## Recommended Shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "email": ["The email field is required."]
    },
    "request_id": "req_01H..."
  }
}
```

## Laravel Guidance

- Customize exception rendering in `bootstrap/app.php` or exception handlers according to the Laravel version/project structure.
- Preserve correct HTTP status codes: `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`.
- Convert validation errors into field-level details.
- Include a request ID/correlation ID when the project has logging support.
- Keep `message` human-readable and `code` machine-readable.
- Log internal exception details server-side; do not return them to API consumers.
- Return `409 CONFLICT` for state conflicts or idempotency conflicts, not generic `500`.

## Avoid

```json
{
  "message": "SQLSTATE[23000]: Integrity constraint violation...",
  "exception": "Illuminate\\Database\\QueryException",
  "trace": []
}
```

## Acceptance Criteria

Every common error path returns the same envelope shape, sensitive internals are hidden, and tests assert validation, unauthorized, forbidden, not found, conflict, and rate-limit responses.
