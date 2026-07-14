# Filesystem, HTTP Client, and Webhooks

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

Use this reference for configured storage disks, uploaded files, private and public downloads,
outbound HTTP integrations, inbound webhooks, request signatures, retries, timeouts, and
integration fakes. Read the project disk configuration, validation rules, provider contract,
and `composer.lock` before selecting an implementation.

Treat storage paths as identifiers relative to a configured disk. Treat remote responses and
webhook payloads as untrusted boundary input. Keep credentials in configuration sourced from
the environment rather than in controllers, jobs, logs, or committed URLs.

## Verified Laravel 13 Behavior

- `Storage::disk($name)` selects a disk from `config/filesystems.php`; omitting `disk` uses the
  configured default.
- The local disk root is private by default. The conventional public disk writes under
  `storage/app/public` and requires `php artisan storage:link` for web access.
- `UploadedFile::store`, `storeAs`, and the filesystem `putFile` APIs can stream uploads.
  Generated filenames are safer defaults than trusting client-provided names.
- S3, SFTP, scoped, and read-only disks need the corresponding Flysystem adapters documented
  for that driver. Confirm installed packages rather than assuming they exist.
- `Storage::temporaryUrl` is appropriate only for a disk/driver configured to support temporary
  URLs. Authorization still belongs at the application boundary.
- Laravel's HTTP client wraps Guzzle and returns a response object. A 4xx or 5xx response is not
  automatically thrown as an exception unless code calls `throw` or an equivalent method.
- `timeout` limits the response wait; the documented default is 30 seconds. `connectTimeout`
  controls connection establishment separately.
- `retry` repeats configured attempts. Only retry operations that are safe or protected by an
  idempotency mechanism, and bound both attempts and delay.
- `Http::fake` replaces matching outbound calls. `Http::preventStrayRequests` turns any unmatched
  request into a test failure.
- Laravel core does not define one universal incoming-webhook signature format. Verify the raw
  request body according to the provider's timestamp, canonicalization, algorithm, and replay
  requirements before decoding or dispatching work.

## Correct Pattern

Protect the route with authentication, resource authorization, and a dedicated upload rate or
quota policy. Validate the file, place untrusted content under a quarantine prefix on the private
core `local` disk, persist
the path internally, and return an opaque domain resource instead of the storage path. Run
malware scanning or content disarm and reconstruction when the accepted types and threat model
require it; publish or make the file downloadable only after that state transition succeeds.

```php illustrative
use App\Http\Controllers\CustomerDocumentController;
use Illuminate\Support\Facades\Route;

Route::post('/customers/{customer}/documents', [CustomerDocumentController::class, 'store'])
    ->middleware(['auth', 'throttle:document-uploads']);
```

The named limiter must be registered by the application. The FormRequest should
fail closed and bind authorization to the route resource:

```php illustrative
use Illuminate\Validation\Rules\File;

public function authorize(): bool
{
    $customer = $this->route('customer');

    return $this->user()?->can('uploadDocument', $customer) ?? false;
}

public function rules(): array
{
    return [
        'document' => ['required', File::types(['pdf'])->max('10mb')],
    ];
}
```

```php illustrative
use App\Http\Requests\StoreCustomerDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Jobs\ScanDocument;
use App\Models\Customer;
use App\Models\Document;
use Illuminate\Http\Resources\Json\JsonResource;

public function store(
    StoreCustomerDocumentRequest $request,
    Customer $customer,
): JsonResource
{
    $file = $request->validated('document');
    $path = $file->store("quarantine/{$customer->getKey()}", 'local');

    $document = Document::query()->create([
        'customer_id' => $customer->getKey(),
        'storage_disk' => 'local',
        'storage_path' => $path,
        'status' => 'quarantined',
    ]);

    ScanDocument::dispatch($document->getKey())->afterCommit();

    return DocumentResource::make($document);
}
```

The Laravel 13 skeleton configures the `local` disk at `storage/app/private`. If a project instead
uses a custom disk named `private`, define and verify that disk in `config/filesystems.php` before
using the name in application code.

The FormRequest should authorize the actor against the route-bound customer and apply file type
and size rules. Register a named limiter on the route, enforce account storage quota in the
application boundary, and authorize every later download by document ID. If persistence can fail
after the file write, compensate by deleting the orphan or use a cleanup job.

Centralize an outbound client so timeouts, authentication, retry policy, error conversion, and
telemetry do not drift between callers.

```php illustrative
use Illuminate\Support\Facades\Http;

$response = Http::baseUrl(config('services.partner.url'))
    ->withToken(config('services.partner.token'))
    ->acceptJson()
    ->connectTimeout(3)
    ->timeout(10)
    ->retry(3, 200, throw: false)
    ->get('/orders/'.$externalId)
    ->throw();

$payload = $response->json();
```

Signature verification must use the exact raw bytes and constant-time comparison. The following
is a runnable primitive, not a substitute for a provider's timestamp and replay specification:

```php runnable
<?php

declare(strict_types=1);

function validWebhookSignature(string $rawBody, string $provided, string $secret): bool
{
    if ($secret === '' || ! preg_match('/\A[a-f0-9]{64}\z/i', $provided)) {
        return false;
    }

    $expected = hash_hmac('sha256', $rawBody, $secret);

    return hash_equals($expected, $provided);
}
```

Verify the provider timestamp inside its documented tolerance before parsing or performing side
effects. Sign the exact provider-defined bytes, commonly `timestamp.rawBody`, reject malformed or
future timestamps, and use a constant-time comparison. A timestamp check limits the replay window;
it does not deduplicate concurrent deliveries.

Back deduplication with a database uniqueness constraint, not a check-then-insert query:

```php illustrative
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::create('webhook_receipts', function (Blueprint $table): void {
    $table->id();
    $table->string('provider', 64);
    $table->string('event_id', 191);
    $table->json('payload');
    $table->string('status', 32)->default('pending');
    $table->unsignedInteger('attempts')->default(0);
    $table->timestamp('available_at')->nullable();
    $table->timestamp('processed_at')->nullable();
    $table->text('last_error')->nullable();
    $table->timestamp('received_at');
    $table->unique(['provider', 'event_id']);
});
```

After authenticating the raw body, validate and canonicalize the provider, event ID, timestamp,
and decoded payload. Persist a durable inbox row. Eloquent's `createOrFirst` attempts the insert
and recovers only from a unique-constraint violation by selecting the existing key; unrelated
database failures still surface:

```php illustrative
use App\Models\WebhookReceipt;

$receipt = WebhookReceipt::query()->createOrFirst(
    [
        'provider' => 'billing-partner',
        'event_id' => $event['id'],
    ],
    [
        'payload' => $event,
        'status' => 'pending',
        'available_at' => now(),
        'received_at' => now(),
    ],
);
```

Respond promptly after the inbox commit. A durable relay or scheduled sweeper must claim pending
rows with a conditional status update or database lock, dispatch processing by receipt ID, and
recover expired processing leases. A post-commit dispatch may reduce latency, but it cannot replace
that relay: a process can crash after commit and before queue publication. On duplicate delivery,
compare immutable identity fields and let completed, pending, failed, or expired-processing state
drive the response/recovery; do not unconditionally discard a non-completed receipt.

The processing job must be idempotent at every external side-effect boundary and mark the inbox
row complete only after its owned work succeeds. Keep provider plus stable event ID as the
idempotency key. A transaction without a unique constraint cannot stop two concurrent deliveries
from both passing a prior existence check, and a cache TTL is not a durable inbox.

Persist only payload fields needed for recovery. Never store signature or authorization headers;
encrypt and tightly authorize sensitive inbox content when it is genuinely required, and define a
retention/deletion schedule for completed and failed receipts.

## Incorrect Pattern

```php illustrative
// Unsafe: trusts a client-controlled filename and exposes it on a public disk.
$request->file('document')->storeAs('documents', $request->file('document')->getClientOriginalName(), 'public');

// Fragile: no timeout, no status handling, and a live external call scattered in a controller.
$data = Http::get($request->input('url'))->json();

// Unsafe: parses and processes before authenticity or replay checks.
$event = $request->json()->all();
ProcessWebhook::dispatchSync($event);
```

Do not let users choose arbitrary disks, filesystem paths, or remote URLs. Prefer destinations
built from administrator-controlled configuration. If a product requirement genuinely accepts a
user-influenced URL, restrict schemes and ports, reject credentials and fragments, validate every
redirect, block loopback/private/link-local/metadata destinations for both A and AAAA answers,
re-check the connected address to resist DNS rebinding, and enforce outbound network policy.
Avoid logging authorization headers, signed URLs, entire webhook bodies, or uploaded confidential
content.

## Failure Modes

- A public storage URL returns 404 because the link was not created or deployment uses ephemeral
  local storage.
- Two tenants collide because paths are not tenant-scoped or access checks only inspect a path.
- Upload validation checks only an extension while the actual MIME or content is unexpected.
- Large uploads exhaust memory because application code reads the entire file instead of streaming.
- A failed filesystem write is ignored when the disk is configured not to throw write exceptions.
- A remote 500 response is treated as success because the response was never checked or thrown.
- Retries duplicate a non-idempotent order, payment, or message.
- A broad HTTP fake hides a wrong hostname or malformed request.
- Signature verification uses decoded JSON rather than the raw body and fails after normalization.
- A valid signed event is replayed because timestamp tolerance and event-ID deduplication are absent.
- A synchronous webhook handler times out, causing the provider to deliver the same event again.

## Trade-offs

Public disks make delivery simple but intentionally expose objects; private disks plus temporary
URLs add authorization control and signing overhead. Local storage is easy for one server but is
usually unsuitable for horizontally scaled or ephemeral deployments.

Automatic retries improve resilience for transient faults but increase latency and duplicate risk.
Synchronous webhook processing provides immediate feedback but couples provider availability to
business work. An inbox record plus queued processing is more operationally robust at the cost of
additional state and eventual consistency.

## Version and Package Boundaries

- Confirm the Laravel version before copying method signatures from live documentation.
- S3, SFTP, path-prefixing, and read-only filesystems use separate Flysystem packages.
- Provider SDKs may supply their own signature middleware; use it when installed and compatible,
  while still testing replay and failure behavior.
- Temporary URL support and visibility semantics vary by driver.
- Do not add an HTTP, webhook, or storage package merely because it appears in this reference.
  Use a package only when the project already depends on it or the user explicitly requests it.

## Testing

- Use `Storage::fake('disk')`, `UploadedFile::fake`, `assertExists`, and `assertMissing` for upload
  behavior without touching production storage.
- Assert validation rejection for size, MIME, missing content, and unauthorized tenant paths.
- Use `Http::fake` with narrow URL patterns; assert method, URL, headers, and body with
  `Http::assertSent`.
- Enable `Http::preventStrayRequests` in integration tests so an incomplete fake cannot reach the
  network.
- Test success, timeout, connection exception, 429, retry exhaustion, invalid JSON, and 5xx paths.
- Test webhook invalid signatures, stale timestamps, duplicate event IDs, unknown event types,
  malformed payloads, missing or empty secrets, secret rotation, and queue dispatch after
  acceptance.
- Run at least one driver-specific integration test when production behavior depends on S3-style
  URLs, visibility, multipart uploads, or temporary URLs.

## Grounding

Classification: `official` for Laravel APIs and `derived` for operational integration guidance.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/filesystem
- https://laravel.com/docs/13.x/http-client
- https://laravel.com/docs/13.x/http-tests#testing-file-uploads
- https://laravel.com/docs/13.x/validation#validating-files
- https://laravel.com/docs/13.x/queues
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html

Provider signature and replay rules remain provider-specific; verify them in the installed SDK or
provider's primary documentation before implementing a webhook contract.
