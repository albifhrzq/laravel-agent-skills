# Laravel 13 Error Handling Guide

Guide for rendering safe, consistent API errors in Laravel 13.

## When to Use

Use this guide when creating or reviewing:

- API error envelopes
- exception rendering
- validation error responses
- 401 / 403 / 404 / 409 / 422 / 429 handling
- `bootstrap/app.php` exception configuration
- API observability and request IDs

## Laravel 13 Exception Configuration

Laravel exception behavior is configured in `bootstrap/app.php` through `withExceptions()`.

Use this area to control how API exceptions are rendered.

```php
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Throwable;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
        return $request->is('api/*') || $request->expectsJson();
    });
})
```

## Error Envelope

Prefer one stable error shape across the API.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {},
    "request_id": "req_..."
  }
}
```

## Status Code Mapping

Use HTTP status codes consistently:

```text
400 = malformed request or unsupported input shape
401 = unauthenticated
403 = authenticated but not allowed
404 = resource not found
409 = state conflict or duplicate/retry conflict
422 = validation failed
429 = rate limit exceeded
500 = unexpected server error
```

## Rendering Known Exceptions

Known domain exceptions may be rendered into the project error envelope.

```php
$exceptions->render(function (OrderAlreadyCancelledException $e, Request $request) {
    if ($request->is('api/*')) {
        return response()->json([
            'error' => [
                'code' => 'ORDER_ALREADY_CANCELLED',
                'message' => 'The order has already been cancelled.',
            ],
        ], 409);
    }
});
```

## Validation Errors

Validation errors should keep field-level details machine-readable.

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

## Auth Errors

Keep auth error codes clear:

```text
AUTH_REQUIRED
FORBIDDEN
TOKEN_EXPIRED
TOKEN_INVALID
TOKEN_REVOKED
```

Do not expose low-level exception class names in the response body.

## Observability

For production APIs, add or preserve:

- request ID or correlation ID
- structured logs for unexpected errors
- route name
- status code
- authenticated user ID when available
- latency or duration when the project supports it

Avoid logging sensitive request content.

## Test Checklist

Test these paths:

- validation failure returns 422 and error envelope
- unauthenticated returns 401
- forbidden returns 403
- not found returns 404
- conflict returns 409
- rate limit returns 429
- unexpected exception does not expose internals

## Review Checklist

Before accepting error handling changes, verify:

- `withExceptions()` is used for framework-level rendering changes
- JSON rendering is forced for API requests
- error shape is consistent
- status codes are intentional
- internal implementation details are not exposed
- tests cover common error paths
