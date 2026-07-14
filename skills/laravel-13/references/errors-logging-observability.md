# Errors, Logging, and Observability

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference for exception reporting and rendering, API error behavior, log channels and
stacks, contextual logging, request correlation, production debug settings, health signals,
metrics, traces, and package boundaries for Telescope, Pulse, or external observability systems.

Inspect `bootstrap/app.php`, `config/app.php`, `config/logging.php`, exception classes, API response
conventions, infrastructure log collection, and installed observability packages. Preserve a valid
project error contract unless a security or correctness defect requires escalation.

## Verified Laravel 13 Behavior

- Laravel exception behavior is configured in `bootstrap/app.php` through the application's
  `withExceptions` callback.
- `report` callbacks add custom reporting. Returning `false` or calling the documented stop method
  controls propagation to default reporting.
- `render` callbacks customize HTTP responses for selected exceptions.
- `shouldRenderJsonWhen` can decide when exceptions should be rendered as JSON beyond normal
  request content negotiation.
- `dontReport`, `stopIgnoring`, exception log levels, throttling, and duplicate-report prevention
  are available configuration tools.
- The global `report` helper can report an exception while allowing request handling to continue.
- `APP_DEBUG` controls detail rendered to users. Official deployment guidance requires it to be
  false in production because debug responses can expose sensitive configuration.
- Logging channels are configured in `config/logging.php`; stack channels combine multiple
  channels.
- `Log::withContext` adds context to the current channel, while `Log::shareContext` shares context
  with existing and subsequently created channels.
- The Context facade can carry contextual information across logs and queued job boundaries.
- Laravel's default health route is configurable in application bootstrap. It is a liveness
  endpoint, not automatically a complete dependency-readiness assessment.

## Correct Pattern

Render stable client-safe errors, report useful server context, and keep secrets and payloads out
of logs. Use a correlation identifier across request, log, job, and outbound integration metadata.

```php illustrative
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->report(function (PartnerUnavailable $exception): void {
        Log::warning('Partner request failed', [
            'partner' => $exception->partner(),
            'operation' => $exception->operation(),
        ]);
    });

    $exceptions->shouldRenderJsonWhen(
        fn (Request $request, Throwable $exception): bool =>
            $request->is('api/*') || $request->expectsJson()
    );
})
```

Add structured request context early in middleware:

```php illustrative
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

public function handle(Request $request, Closure $next): Response
{
    $requestId = $request->headers->get('X-Request-ID', (string) Str::uuid());
    Log::shareContext(['request_id' => $requestId]);

    $response = $next($request);
    $response->headers->set('X-Request-ID', $requestId);

    return $response;
}
```

Log identifiers, operation names, safe status fields, duration, attempt count, and exception type.
Redact authorization headers, cookies, session IDs, passwords, tokens, private keys, and sensitive
domain payloads.

## Incorrect Pattern

```php illustrative
// Unsafe: returns implementation details and secrets to the caller.
return response()->json([
    'error' => $exception->getMessage(),
    'trace' => $exception->getTrace(),
    'environment' => $_ENV,
], 500);

// Unsafe and noisy: dumps the entire request including credentials.
Log::error('Request failed', $request->all());

// Misleading: converts every exception into HTTP 200.
catch (Throwable $exception) {
    return response()->json(['success' => false], 200);
}
```

Do not catch an exception only to suppress it. Do not use logs as an audit ledger without the
durability, access control, retention, and integrity properties required by that domain.

## Failure Modes

- Production debug mode exposes environment or stack details.
- A broad render callback changes browser, API, and console behavior unintentionally.
- Expected client errors flood alerting because reporting and rendering are not separated.
- A custom reporter recursively logs or throws while handling the original exception.
- Sampling hides a low-volume critical error or retains too much high-volume noise.
- Log context leaks between requests in a long-running worker because process state is not reset.
- Queue logs lose the originating request or tenant identifier.
- Sensitive headers, request bodies, model attributes, or signed URLs enter centralized logs.
- Disk logs fill the server because rotation or retention is absent.
- Health checks report success although the database, queue, or external dependency is unusable.
- Metrics labels contain unbounded IDs and create high-cardinality storage costs.
- Telescope or another debugging tool is exposed publicly or retains sensitive payloads.

## Trade-offs

Detailed logs accelerate diagnosis but increase cost and privacy risk. Sampling reduces volume but
can hide rare failures. Centralized structured logs improve correlation; local text logs are
simpler during development. Error responses should be stable and minimal, while server reporting
may remain detailed under controlled access.

Telescope provides deep development inspection. Pulse focuses on application performance signals.
External APM systems may add distributed tracing and infrastructure correlation. These overlap but
are not interchangeable, and each introduces storage, sampling, privacy, and operational work.

## Version and Package Boundaries

- Exception bootstrap APIs are version-sensitive; verify the detected Laravel version.
- Monolog handlers and channel drivers may require separate packages or platform services.
- Telescope, Pulse, Horizon, Octane, Sentry, OpenTelemetry, and other observability integrations
  are package-specific.
- Long-running Octane and queue workers require particular attention to shared mutable context.
- Do not install or deeply configure an observability package unless detected or explicitly
  requested by the user.

## Testing

- Assert client status, JSON shape, content negotiation, and absence of sensitive exception detail.
- Use Laravel's exception-handling test helpers intentionally; do not disable handling when testing
  the production error contract.
- Fake or spy on logs only when the log event itself is required behavior; otherwise assert the
  domain outcome.
- Test correlation IDs across an HTTP request and dispatched job.
- Test reporter failure, throttling/sampling, duplicate reporting, and ignored exceptions where
  configured.
- Validate production `APP_DEBUG=false`, log delivery, rotation, and alert routing during deploy.
- Probe health endpoints from the same network path as the load balancer and separately test
  critical dependency readiness.
- Run a security review of captured fields and retention for logs, traces, Telescope, and Pulse.

## Grounding

Classification: `official` for framework configuration and `derived` for observability policy.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/errors
- https://laravel.com/docs/13.x/logging
- https://laravel.com/docs/13.x/context
- https://laravel.com/docs/13.x/deployment#debug-mode
- https://laravel.com/docs/13.x/deployment#the-health-route
- https://laravel.com/docs/13.x/pulse
- https://laravel.com/docs/13.x/telescope

For external telemetry, verify the installed integration and backend's current primary
documentation before adopting fields, sampling, or transport behavior.
