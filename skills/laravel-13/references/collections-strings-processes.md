# Collections, Helpers, Strings, Contracts, and Processes

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

Use this reference when code transforms in-memory or streamed data, reaches for a global helper,
normalizes strings, defines an abstraction, resolves dependencies, or invokes an operating-system
process. These APIs are convenient, but their return types, evaluation timing, escaping behavior,
container lifetime, and process boundary can materially affect correctness and security.

Before changing code, inspect:

- `composer.lock` for the exact `laravel/framework`, Symfony Process, CommonMark, and related
  package versions;
- the concrete collection type: base `Collection`, `LazyCollection`, or Eloquent collection;
- whether the input is already resident in memory or is generated, queried, or streamed;
- Blade templates and the final output context for any string that can contain untrusted data;
- service providers, container attributes, interfaces, and test substitutions already used by the
  project;
- the executable path, command arguments, working directory, inherited environment, resource
  limits, output handling, and deployment user for an external process; and
- the project's process fake policy and whether CI can safely execute the real binary.

Do not introduce an application interface, macro, external binary, or optional package merely
because it appears in this reference. Follow detected project conventions unless an explicit user
request requires a change, and still call out correctness, security, and version conflicts.

## Verified Laravel 13 Behavior

### Collections and lazy collections

- `collect($items)` creates an `Illuminate\Support\Collection`. Most collection operations return
  a new collection, so a fluent chain commonly leaves the original collection unchanged.
- Mutation is not universal. `transform`, `forget`, `put`, `push`, and `prepend` change the
  collection they are called on. `pull`, `pop`, `shift`, and `splice` both mutate the source and
  return removed value(s). Read the method contract instead of assuming every fluent method is
  immutable.
- `map` returns a new collection; `transform` replaces the items in the existing collection.
  `tap` and `each` return the original collection, and a callback return value is not mapped into
  it. Returning `false` from an `each` callback stops iteration.
- Collection higher-order messages such as `$users->each->markAsVip()` proxy property access or a
  method call to every item, and constant arguments are forwarded to each call. Use an explicit
  closure for per-item arguments, branching, authorization, error handling, or a clearer
  return-value contract.
- `pop()` and `shift()` return one removed item, while passing a count returns a collection of
  removed items. `pull($key)` returns the removed value. `splice(...)` returns the removed slice.
  These methods do not return the remaining collection.
- Operations such as `filter`, `slice`, and `unique` may preserve existing keys. Call `values()`
  only when a consecutively indexed result is part of the required contract.
- `all()` returns the underlying array. `toArray()` recursively converts nested `Arrayable`
  values, including Eloquent models; that conversion can expose different fields than `all()`.
- `contains`, `where`, `whereIn`, and `unique` use loose comparisons in documented forms. Their
  `Strict` variants use strict comparisons. Identity, authorization, identifiers, booleans, and
  externally supplied values usually require an explicit strict choice.
- `first` may return `null`; `firstOrFail` throws when no item matches; `sole` requires exactly one
  match. Select the method whose cardinality contract matches the business rule.
- A `LazyCollection` is backed by generators and defers work until enumeration. It can keep only a
  small portion of a stream in memory when the upstream source is also lazy.
- Calling `lazy()` on an existing collection provides lazy downstream operations but does not
  remove the already-loaded source items from memory. Calling `collect()`, `all()`, or another
  terminal materialization on a lazy sequence can consume the entire sequence.
- Mutating collection methods such as `shift`, `pop`, and `prepend` are not available on
  `LazyCollection`. Lazy side effects should be deliberate and occur only when values are pulled.
- `remember()` on a lazy collection caches values that have already been enumerated for later
  enumerations. It avoids retrieving them again but causes retained values to consume memory.
- Query-builder and Eloquent `cursor()` flows return lazy collections. Database cursor semantics,
  eager-loading needs, connection buffering, and relation access still need separate inspection.
- Eloquent collections specialize some base collection methods. Verify model-identity and return-
  type behavior in the Eloquent collection documentation before treating them as plain arrays.

### Helpers and strings

- `data_get` reads nested arrays or objects with dot notation, supports a default, and supports
  documented wildcards. Related `data_set`, `data_fill`, and `data_forget` operations can mutate
  nested structures; wildcard paths may affect more values than a literal path.
- `blank` treats empty strings, whitespace-only strings, `null`, and empty countable values as
  blank, but does not treat `0`, `true`, or `false` as blank. `filled` is its inverse.
- `once` caches a callback result in memory for the duration of the request. When called from an
  object instance, its cache is scoped to that object instance. It is not a durable or distributed
  cache.
- `tap($value, $callback)` passes the value to the callback and then returns the original value;
  the callback's return value is discarded. Proxy-style `tap($value)->method()` also returns the
  original value, not the proxied method's return value.
- `rescue` catches exceptions, reports them by default, and returns a default value when supplied.
  It allows execution to continue, so it must not erase an integrity, authorization, or payment
  failure that callers need to distinguish.
- `retry` retries callbacks that throw and rethrows after the configured attempts. Delay schedules
  and conditional retry callbacks are supported. Retrying does not make a side effect idempotent.
- `value` evaluates a closure or returns a non-closure unchanged. `transform` applies a callback
  only when a value is not blank. Their lazy/default behavior can hide expensive work if used
  casually inside loops.
- `Str` exposes static helpers, while `Str::of` returns a fluent `Stringable`. Operations such as
  `trim`, `squish`, `lower`, `slug`, `limit`, `mask`, `isJson`, `isUrl`, `uuid`, `ulid`, `random`,
  and `password` each solve a narrow formatting or generation task, not general validation.
- `Str::random` uses PHP `random_bytes`; `Str::password` generates a secure random password with
  configurable character classes. Required entropy, format, expiration, and storage still depend
  on the credential or token protocol.
- `e($value)` applies HTML escaping. Blade's `{{ ... }}` output is escaped by default, while raw
  output syntax and `HtmlString` / `toHtmlString()` bypass Blade escaping.
- `Str::markdown` and `Str::inlineMarkdown` produce HTML. Options such as `html_input => 'strip'`
  and `allow_unsafe_links => false` reduce risk for untrusted Markdown; converting to an
  `HtmlString` is not sanitization.
- `Str::isUrl` checks URL syntax and can restrict protocols, but does not prove that a destination
  is safe to fetch. It does not prevent redirects, loopback/private-network access, DNS rebinding,
  or cloud metadata access.
- A slug is not guaranteed unique, Base64 is not encryption, masking is not deletion, valid JSON
  is not schema validation, and a UUID or ULID is not authorization.
- String and collection macros modify global runtime behavior. Register them in the project's
  established provider and test collisions, worker reuse, and package compatibility.

### Contracts and the service container

- Laravel contracts are framework service interfaces under `Illuminate\Contracts`. Most have a
  framework implementation, and many facades expose an equivalent service.
- Facades and contracts are both documented, testable approaches. Contracts make constructor
  dependencies explicit; facades are convenient. Choosing one is a project design decision, not a
  universal quality rule.
- The container automatically resolves concrete classes whose dependencies are themselves
  resolvable concrete classes. An interface requires a binding unless Laravel or a package has
  already registered its implementation.
- Controllers, middleware, listeners, jobs, route closures, and other container-resolved classes
  may receive dependencies through constructor or method injection.
- `bind` creates transient resolutions by default, `singleton` reuses one instance for the
  container lifetime, and `scoped` reuses an instance for one request or job lifecycle before a
  scoped flush in supported long-lived runtimes.
- Contextual bindings provide different implementations or values when different consumers need
  the same contract. Container attributes such as `Bind`, `Singleton`, `Scoped`, and contextual
  attributes are version-sensitive configuration surfaces.
- The standalone `illuminate/contracts` package is useful to packages that need Laravel service
  interfaces without requiring concrete framework implementations. It does not provide a running
  container or those implementations by itself.
- Application-owned interfaces are justified by a real substitution boundary, stable domain
  concept, multiple implementation, package boundary, or testing seam. A one-to-one interface for
  every concrete class is a project convention at most, not a Laravel requirement.
- Service-location calls such as `app(...)` and `resolve(...)` are available, but constructor
  injection usually makes reusable class dependencies and tests clearer. Runtime-dependent lookup
  remains appropriate in framework integration points that genuinely need it.

### Processes

- `Process::run($command)` executes synchronously and returns an
  `Illuminate\Contracts\Process\ProcessResult`. The result exposes `command`, `successful`,
  `failed`, `output`, `errorOutput`, and `exitCode`.
- A non-zero exit does not make `run` throw by itself. Call `throw()` / `throwIf(...)` or branch on
  `successful()` / `failed()` so failure cannot be mistaken for valid output.
- Laravel 13's pinned framework source accepts an array or string command for `run`, `start`, and
  pending `command`. Array commands are passed as argument vectors to Symfony Process; string
  commands are created as shell command lines. Prefer an array whenever values are dynamic.
- `path` sets the working directory. `input` supplies standard input. `timeout` bounds total run
  time, and `idleTimeout` bounds the time without output. The documented default total timeout is
  60 seconds; `forever` removes it and should be exceptional.
- `env` adds environment entries while the child still inherits the parent environment. Setting
  an entry to `false` removes that inherited variable for the child. Environment values are not a
  substitute for a secret manager or least-privilege process account.
- `quietly` disables output retrieval to conserve memory. It also removes output that diagnostics
  or callers might need, so retain bounded output when it is operationally important.
- `run` and `start` can receive an output callback for incremental stdout/stderr. Output chunks may
  split arbitrary boundaries; do not assume one callback equals one complete line.
- `start` launches asynchronously and returns an invoked process with `running`, `id`, `signal`,
  `stop`, output access, timeout checks, and `wait`. Long-running loops should call
  `ensureNotTimedOut`; application shutdown needs an explicit ownership and cleanup policy.
- `Process::pool` starts multiple asynchronous processes and can name them with `as`; `wait`
  returns keyed results. `Process::concurrently` starts a pool and waits immediately.
- `Process::pipe` feeds each successful process's stdout into the next process synchronously and
  returns the last result; the pipeline stops advancing after a failed stage. Each stage still
  needs safe argument construction, timeouts, and an understood output-size bound.
- Process fakes record invocations. `Process::fake` supports default, pattern-specific, sequence,
  failure, and asynchronous lifecycle results. Unmatched commands run for real unless
  `Process::preventStrayProcesses()` is enabled.
- Assertions include `assertRan`, `assertDidntRun`, and `assertRanTimes`; assertion closures can
  inspect a `PendingProcess` and its result. Assert configuration and observable application
  outcome, not only that some command string appeared.

## Correct Pattern

### Preserve collection intent and cardinality

Prefer non-mutating transforms for derived data, state the key shape, and use strict comparisons
for identifiers:

```php illustrative
use Illuminate\Support\Collection;

/** @param Collection<int, array{id: string, enabled: bool, name: string}> $records */
function enabledNames(Collection $records, string $requiredId): Collection
{
    return $records
        ->filter(fn (array $record): bool => $record['enabled'] === true)
        ->filter(fn (array $record): bool => $record['id'] === $requiredId)
        ->map(fn (array $record): string => trim($record['name']))
        ->reject(fn (string $name): bool => $name === '')
        ->values();
}
```

Use a lazy upstream source for large streams and keep the terminal operation bounded:

```php illustrative
Order::query()
    ->where('status', 'pending')
    ->orderBy('id')
    ->cursor()
    ->filter(fn (Order $order): bool => $order->shouldBeExported())
    ->take(10_000)
    ->each(function (Order $order) use ($writer): void {
        $writer->write($order->toExportRow());
    });
```

If mutation is intentional, make the removed value and remaining collection separate variables:

```php illustrative
$queue = collect(['first', 'second', 'third']);
$next = $queue->shift();

// $next === 'first'; $queue now contains ['second', 'third'].
```

### Keep formatting separate from trust decisions

Use helpers for shape and presentation, then validate against the actual boundary:

```php illustrative
use Illuminate\Support\Str;

$payload = $request->validated();
$displayName = Str::squish((string) data_get($payload, 'profile.display_name', ''));
$callbackUrl = (string) data_get($payload, 'callback_url', '');

if (! Str::isUrl($callbackUrl, ['https'])) {
    throw ValidationException::withMessages(['callback_url' => 'Use a valid HTTPS URL.']);
}

// A server-side fetch still needs host/IP/port/redirect and egress enforcement.
```

Render ordinary untrusted text through escaped Blade output:

```blade illustrative
<h1>{{ $displayName }}</h1>
```

When the product explicitly supports untrusted Markdown, configure the renderer defensively and
only use raw Blade output for the resulting, reviewed rendering boundary:

```php illustrative
$renderedMarkdown = Str::markdown($validatedMarkdown, [
    'html_input' => 'strip',
    'allow_unsafe_links' => false,
]);
```

```blade illustrative
{{-- Raw output is permitted here only because the server-side Markdown policy is the trust boundary. --}}
{!! $renderedMarkdown !!}
```

If the application permits a richer HTML subset, use a maintained sanitizer configured for that
subset before raw output. `toHtmlString()` alone must never be the sanitizer.

### Bind abstractions at a real boundary

Use a project-owned contract when the application genuinely needs replaceable infrastructure:

```php illustrative
namespace App\Contracts;

interface PaymentGateway
{
    public function charge(string $idempotencyKey, int $amountMinor): string;
}
```

```php illustrative
use App\Contracts\PaymentGateway;
use App\Payments\ConfiguredPaymentGateway;

$this->app->bind(PaymentGateway::class, ConfiguredPaymentGateway::class);
```

```php illustrative
final class CapturePayment
{
    public function __construct(private PaymentGateway $gateway) {}

    public function handle(Order $order): string
    {
        return $this->gateway->charge(
            idempotencyKey: "order:{$order->getKey()}:capture",
            amountMinor: $order->amount_minor,
        );
    }
}
```

Prefer a concrete injected class when no substitution boundary exists. Select `singleton` or
`scoped` only after checking mutability and the actual worker/container lifecycle.

### Invoke external processes without a shell injection surface

Pass dynamic values as separate arguments, set explicit operational bounds, and handle failure:

```php illustrative
use Illuminate\Support\Facades\Process;

$command = [
    PHP_BINARY,
    base_path('artisan'),
    'reports:render',
    "--report={$report->getKey()}",
];

$result = Process::path(base_path())
    ->input(json_encode($options, JSON_THROW_ON_ERROR))
    ->timeout(30)
    ->idleTimeout(10)
    ->env([
        'REPORT_FORMAT' => 'pdf',
        'UNRELATED_INHERITED_SECRET' => false,
    ])
    ->run($command)
    ->throw();

$artifactPath = trim($result->output());
```

The executable and working directory should come from trusted configuration, not request input.
Standard input avoids exposing a payload as a shell fragment, but the child process must still
validate it and the parent must avoid logging sensitive input.

For status-only commands with potentially large output, opt out explicitly:

```php illustrative
Process::path(base_path())
    ->timeout(120)
    ->quietly()
    ->run([PHP_BINARY, base_path('artisan'), 'search:reindex'])
    ->throw();
```

Own asynchronous cleanup and timeout checks:

```php illustrative
$process = Process::timeout(120)->idleTimeout(20)->start($command);

try {
    while ($process->running()) {
        $process->ensureNotTimedOut();
        usleep(100_000);
    }

    $result = $process->wait()->throw();
} finally {
    if ($process->running()) {
        $process->stop(timeout: 5);
    }
}
```

Use named pools when tasks are independent and resource capacity is known:

```php illustrative
use Illuminate\Process\Pool;

$pool = Process::pool(function (Pool $pool) use ($tenantIds): void {
    foreach ($tenantIds as $tenantId) {
        $pool->as("tenant-{$tenantId}")
            ->timeout(60)
            ->command([PHP_BINARY, base_path('artisan'), 'tenant:sync', (string) $tenantId]);
    }
})->start();

foreach ($pool->wait()->collect() as $result) {
    $result->throw();
}
```

Use an array command for every pipeline stage when any argument is dynamic:

```php illustrative
use Illuminate\Process\Pipe;

$result = Process::pipe(function (Pipe $pipe) use ($file, $needle): void {
    $pipe->path(storage_path('app/exports'))->command(['cat', $file]);
    $pipe->command(['grep', '-F', '--', $needle]);
})->throw();
```

The example assumes trusted, available `cat` and `grep` binaries and a validated file name rooted
under the working directory. Prefer a PHP-native implementation when portability or path safety is
more important than process composition.

## Incorrect Pattern

```php illustrative
$records = collect($rows);

// map returns a new collection; this leaves $records unchanged.
$records->map(fn (array $row): array => normalize($row));

// transform mutates the original despite the new-looking variable name.
$normalized = $records->transform(fn (array $row): array => normalize($row));

// pop returns the removed value, not the remaining collection.
$remaining = $records->pop();

// Loose comparison may equate different identifier types.
if ($records->contains($request->input('id'))) {
    // ...
}
```

```php illustrative
// The source is already fully loaded; lazy() cannot recover that memory.
$users = User::all()->lazy();

// Materializes the entire lazy stream and defeats streaming.
$allUsers = User::cursor()->all();

// Re-enumeration retains every encountered value in memory.
$foreverGrowing = User::cursor()->remember();
```

```blade illustrative
{{-- Unescaped user-controlled HTML is an XSS boundary violation. --}}
{!! $request->input('biography') !!}
```

```php illustrative
// HtmlString marks content as trusted; it does not clean it.
$trusted = Str::of($request->input('biography'))->toHtmlString();

// URL syntax alone does not make a server-side request destination safe.
Http::get(Str::isUrl($url) ? $url : throw new InvalidArgumentException());

// Slugs can collide and must not be authorization credentials.
$document = Document::where('slug', Str::slug($request->input('title')))->firstOrFail();

// Swallows a failure whose distinction is required by the caller.
$charged = rescue(fn () => $gateway->charge($order), false, report: false);

// Retrying a non-idempotent charge may duplicate the side effect.
retry(5, fn () => $gateway->charge($order));
```

```php illustrative
// Service locator hides the dependency and makes lifetime behavior implicit.
final class ReportBuilder
{
    public function build(): void
    {
        app(ReportRepository::class)->write();
    }
}

// An interface with one implementation and no boundary is not automatically useful.
interface ReportNameFormatterInterface {}
final class ReportNameFormatter implements ReportNameFormatterInterface {}
```

```php illustrative
// Critical command injection: request data is interpreted by a shell.
$result = Process::run('convert '.$request->input('source').' '.$request->input('target'));

// A failed process still returns a result; this may store stderr or an empty value as success.
Artifact::create(['path' => trim($result->output())]);

// Unbounded runtime can leak workers and exhaust host capacity.
Process::forever()->start($request->input('command'));

// Secrets in arguments can be visible in process listings and logs.
Process::run(['vendor-cli', '--token', config('services.vendor.secret')]);
```

Do not treat `escapeshellarg` around one interpolated fragment as proof that a complex shell string
is safe. Prefer an argument array and avoid the shell entirely. If shell syntax is genuinely
required, keep the program and syntax fixed, allowlist every variable choice, document the
remaining platform-specific risk, and test on each supported operating system.

## Failure Modes

### Data transformation

- A caller ignores the collection returned by `map`, `filter`, or `values`, so intended changes
  never take effect.
- A shared collection is changed by `transform`, `forget`, `pull`, `pop`, `push`, `put`, `shift`,
  or `splice`, producing action-at-a-distance.
- Code chains after `pull`, `pop`, or `shift` as though the return value were the collection.
- Preserved keys serialize to a JSON object when the client contract expected a JSON array.
- Loose comparisons merge or match values such as numeric strings, integers, booleans, and nulls.
- `first()` returns `null` and later code fails far from the missing-cardinality boundary.
- A supposedly lazy pipeline begins from `Model::all()` or ends in `all()` / `collect()`, so memory
  still grows with the entire dataset.
- A lazy side effect never runs because the sequence is never enumerated, or runs twice because
  the sequence is enumerated twice.
- `remember()` turns a streaming job into an unbounded in-memory cache.
- Relation access in a cursor loop creates N+1 queries or conflicts with database cursor limits.

### Helpers, strings, and output

- A wildcard `data_set` / `data_forget` path changes more nested records than intended.
- `blank(false)` or `blank(0)` is assumed true, changing validation or defaulting behavior.
- A `tap` callback return value is silently discarded.
- `once` is mistaken for cross-request cache, or state persists unexpectedly in a long-lived
  worker because lifecycle assumptions were not tested.
- `rescue` converts a security or data-integrity exception into an ordinary value and processing
  continues.
- `retry` repeats a non-idempotent external side effect or retries permanent failures.
- Raw Blade output, `HtmlString`, Markdown HTML, or a macro crosses a trust boundary without
  sanitization and causes stored or reflected XSS.
- `Str::isUrl` is used as an SSRF control; a syntactically valid URL reaches internal services.
- A slug collision returns another record, a masked secret remains available in logs, or Base64 is
  treated as confidentiality.
- Random strings are too short, never expire, are stored in plaintext, or are compared without
  the protocol's required timing and replay controls.

### Container and contracts

- An interface has no binding and resolution fails only on a rarely executed path.
- A singleton captures request, tenant, locale, authentication, or mutable DTO state and leaks it
  across requests in Octane or another long-lived worker.
- A transient expensive client is rebuilt repeatedly, while a stateful client is incorrectly made
  singleton; both stem from an unexamined lifetime.
- Contextual bindings make two consumers behave differently with no test proving the distinction.
- A package relies on an application-specific concrete implementation despite advertising only an
  `illuminate/contracts` dependency.
- Excess one-to-one interfaces and repository wrappers obscure Laravel-native behavior without a
  real substitution or domain boundary.
- Hidden `app()` lookups make dependency graphs, test isolation, and failure timing unpredictable.

### Processes

- Request-controlled text is interpolated into a string command and interpreted by the shell.
- A relative executable or working directory resolves differently in a queue, scheduler, web
  worker, container, or production release path.
- `run` returns a failed result that the application treats as success because neither `throw` nor
  an exit check is used.
- A timeout is absent, excessively high, or lower than legitimate work; a quiet command triggers
  `idleTimeout` even though it is making progress.
- `forever` or an orphaned async child consumes CPU, memory, file descriptors, locks, or deployment
  capacity after its request/job owner exits.
- Captured stdout/stderr exhausts memory, while `quietly` removes the only useful diagnostic.
- Secrets leak through command arguments, inherited environment variables, debug logs, exception
  messages, process listings, or captured output.
- The child process runs with broader filesystem/network permissions than the application action
  requires.
- An unrestricted pool starts too many binaries at once and saturates the host.
- One pipeline stage buffers huge output, fails, or emits binary data that the next stage or PHP
  string handling cannot safely consume.
- A test fake pattern does not match and silently executes a real destructive command because
  stray processes were not prevented.
- A fake always returns success, leaving non-zero exits, timeouts, partial output, and cleanup
  paths untested.

## Trade-offs

Collections make transformations expressive and composable, while arrays can be clearer for a
small fixed structure and avoid wrapper overhead. A lazy collection reduces peak memory only when
the source and downstream operations remain lazy; it adds deferred execution, resource-lifetime,
and repeated-enumeration complexity.

Mutation can be efficient and appropriate in a small local scope, but derived collections are
easier to reason about when data is shared. Preserving keys carries identity through a pipeline;
resetting keys produces predictable JSON arrays but discards that identity.

Helpers reduce boilerplate, but dense chains can hide evaluation, exception, and return-value
semantics. `Str` normalization improves presentation, not trust. Escaped plain text is safer and
simpler than rich HTML; Markdown or HTML support requires a narrow rendering policy and more
security tests.

Contracts provide explicit dependencies and replacement seams, while facades provide concise
Laravel-native access and built-in faking. Extra abstractions carry naming, binding, navigation,
and maintenance cost. Container lifetimes can reduce construction cost but increase shared-state
risk, especially under long-lived workers.

External processes reuse mature operating-system tools and isolate some workloads, but introduce
shell, platform, permission, timeout, observability, deployment, and resource-management risks. A
PHP-native library is often more portable and testable. Synchronous execution simplifies ownership
but blocks the worker; asynchronous execution and pools improve overlap at the cost of cleanup and
capacity control. Pipelines are concise but can obscure which stage failed and how much data is
buffered.

## Version and Package Boundaries

- Resolve the installed Laravel version before using a collection, helper, string, container
  attribute, or process API. Method availability and signatures may differ across major/minor
  versions.
- This reference targets the pinned Laravel 13 framework and documentation. Live 13.x docs are a
  freshness check; pinned source remains the reproducible baseline.
- Base collections, lazy collections, and Eloquent collections do not have identical method and
  identity behavior. Preserve the concrete type in reviews and tests.
- Markdown behavior is implemented through the installed CommonMark packages. Confirm supported
  options and security behavior against the locked versions before changing sanitizer policy.
- `Str::slug` transliteration and Unicode behavior can depend on PHP extensions and supporting
  packages. Test the application's actual languages.
- Container attributes and scoped lifecycle behavior depend on the framework version and runtime.
  Inspect Octane, queue worker, serverless, and package boot behavior when present.
- Laravel Process wraps Symfony Process. Executable availability, signal support, TTY behavior,
  quoting, paths, and exit codes vary across Unix, Windows, containers, and hosting platforms.
- Array commands are verified in the pinned Laravel 13 `PendingProcess` source. If supporting an
  older Laravel version, verify that version before prescribing the same signature.
- `cat`, `grep`, ImageMagick, FFmpeg, Node, Python, office converters, and other executables are
  external deployment dependencies. Do not add one unless detected or explicitly requested.
- Facade fakes apply to Laravel's Process facade, not arbitrary direct Symfony Process instances
  or native `proc_open` calls.
- Package code should document its required `illuminate/contracts` version and avoid assuming a
  full Laravel application unless declared.

## Testing

### Collections, helpers, and strings

- Assert both the returned value and the original collection for every method whose mutation
  semantics matter.
- Cover empty collections, missing keys, duplicate keys, sparse numeric keys, nulls, zero, false,
  numeric strings, strict identifiers, and nested `Arrayable` values.
- Prove output key shape with `array_is_list`, exact JSON, or contract assertions when an API
  distinguishes arrays from objects.
- For lazy flows, use a generator with an enumeration counter. Assert that construction performs no
  work, `take(n)` pulls only the required items, and accidental materialization is absent.
- Measure peak memory with a production-sized fixture when streaming is the reason for the design.
- Test partial enumeration, repeated enumeration, exceptions during generation, resource cleanup,
  and the memory effect of `remember()`.
- Test `blank` / `filled` with `''`, whitespace, `null`, `[]`, an empty collection, `0`, `true`, and
  `false`.
- Test `tap`, `once`, `rescue`, and `retry` for their exact return values, reporting behavior,
  attempt count, delay policy, and idempotency key reuse.
- Render templates and assert dangerous HTML is escaped. For Markdown, cover raw HTML, `javascript:`
  links, malformed markup, encoded payloads, and the configured sanitizer allowlist.
- Reset faked UUID/random-string factories and registered macro state between tests when the
  framework test helper does not already do so.

### Contracts and container behavior

- Resolve every application contract in a container test so missing bindings fail before a rare
  production path.
- Substitute a fake implementation and assert the consumer's observable behavior, not merely that
  the container returns a class name.
- Test contextual bindings for each consumer and environment they distinguish.
- Under long-lived runtime support, run sequential requests/jobs with different users or tenants
  to detect singleton/scoped state leaks.
- Verify package tests with only declared Composer dependencies, including the supported
  `illuminate/contracts` range.

### Process behavior

Prevent accidental real execution, provide only expected fakes, and inspect the pending process:

```php illustrative
use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Process;

Process::preventStrayProcesses();
Process::fake([
    '*artisan reports:render*' => Process::result(
        output: storage_path('app/reports/example.pdf').PHP_EOL,
        exitCode: 0,
    ),
]);

$artifact = $service->render($report, []);

Process::assertRan(function (PendingProcess $process, ProcessResult $result) use ($report): bool {
    return is_array($process->command)
        && in_array("--report={$report->getKey()}", $process->command, true)
        && $process->path === base_path()
        && $process->timeout === 30
        && $process->idleTimeout === 10
        && $result->successful();
});

expect($artifact)->toEndWith('.pdf');
```

- Add failed-result, stderr, timeout, malformed-output, empty-output, and cleanup tests. A fake
  success path alone is insufficient.
- Use `assertDidntRun` for authorization and validation failures, and `assertRanTimes` where
  deduplication or retry count is part of the contract.
- Use `Process::sequence` for retries and `Process::describe` for asynchronous running/output/exit
  lifecycles.
- Test that dynamic arguments remain distinct array entries; include spaces, quotes, semicolons,
  command substitution text, leading dashes, Unicode, and newlines as hostile fixtures.
- Assert secrets are absent from command arrays, logs, exception messages, and returned API data.
- Test pool partial failure and keyed result handling. Test pipeline failure at every stage and
  verify later stages do not run after a failed stage.
- Run a small integration test against the real pinned binary only in an isolated environment with
  non-destructive fixtures, least privileges, explicit timeouts, and no production credentials.
- Verify on every supported operating system or container image when paths, signals, TTY, quoting,
  or executable packages affect behavior.

## Grounding

Classification: `official` for documented collection, lazy collection, helper, string, contract,
container, and process APIs; `official-source` for Laravel 13 array-command handling and pipeline
failure flow observed in the pinned framework implementation; `derived` for abstraction thresholds,
strict-comparison selection, escaping boundaries, injection avoidance, capacity limits, secret
handling, idempotency, and operational guidance.

Verified against the pinned Laravel 13 documentation and framework source identified by
`source-lock.json`, plus the live official documentation freshness check:

- https://laravel.com/docs/13.x/collections
- https://laravel.com/docs/13.x/helpers
- https://laravel.com/docs/13.x/strings
- https://laravel.com/docs/13.x/contracts
- https://laravel.com/docs/13.x/container
- https://laravel.com/docs/13.x/processes
- https://github.com/laravel/framework/blob/v13.19.0/src/Illuminate/Process/PendingProcess.php
- https://github.com/laravel/framework/blob/v13.19.0/src/Illuminate/Process/Pipe.php
- https://github.com/laravel/framework/blob/v13.19.0/src/Illuminate/Process/Pool.php

Process portability and resource behavior must also be checked against the locked Symfony Process
version, target operating system/container, and each external executable's primary documentation.
Markdown safety must also be checked against the installed CommonMark version and the application's
sanitizer policy.
