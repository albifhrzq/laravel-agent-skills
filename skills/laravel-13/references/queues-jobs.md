# Queues, Jobs, Retries, Chains, and Batches

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

Use this reference for job design, dispatch, connection/queue selection, delay, retries, timeouts,
backoff, uniqueness, overlap prevention, rate-limited jobs, chains, batches, failed jobs, worker
deployment, and queue testing. Inspect `config/queue.php`, worker command/supervisor settings,
cache driver, transaction boundaries, payload sensitivity, and external side effects first.

Queue delivery is generally at least once: a job can run again after timeout, worker loss,
visibility expiry, manual retry, or partial failure. Design `handle` so repeating it is safe.

## Verified Laravel 13 Behavior

- Jobs implementing `ShouldQueue` are dispatched to the configured queue connection. The
  `Queueable` trait exposes common connection, queue, delay, and after-commit options.
- Method dependencies on `handle` are resolved by the service container.
- Eloquent models in job payloads are serialized as identifiers and restored when handled.
  Loaded relationships can increase payload/restoration work; `withoutRelations` and the
  `WithoutRelations` attribute remove them from serialization.
- Worker and job retry behavior can be bounded with `$tries` or `tries()`, `backoff()`,
  `retryUntil()`, `$maxExceptions`, `$timeout`, and `$failOnTimeout`.
- A worker's `--timeout` should be shorter than the connection's `retry_after` so a lost worker
  does not normally allow the same job to execute concurrently before termination.
- The `queue:work --timeout` option has no effect when the worker is invoked with `--once`;
  commands and automation using one-shot workers must not claim that option enforces a job timeout.
- `release` returns a job to the queue, `delete` completes it, and `fail` records an explicit
  failure when failed-job storage is configured.
- `ShouldBeUnique` uses a cache lock before dispatch. Every dispatcher must share a lock-capable
  cache store. Unique constraints do not apply to jobs inside batches.
- `WithoutOverlapping` job middleware limits concurrent processing. It may release or discard an
  overlapping job and can set lock expiry; it is different from unique dispatch.
- Queue connection `after_commit` or per-dispatch `afterCommit` delays publication until open
  database transactions commit.
- `Bus::chain` runs jobs sequentially and stops later jobs after a failure unless failure handling
  changes the flow. `Bus::batch` tracks a group of batchable jobs and supports progress and
  cancellation.

## Correct Pattern

Pass stable identifiers, bound retries, make the external operation idempotent, and select
after-commit dispatch when the job depends on new database state:

```php illustrative
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

final class SyncOrderToFulfillment implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;
    public int $maxExceptions = 3;
    public int $timeout = 60;
    public bool $failOnTimeout = true;

    public function __construct(
        public readonly int $orderId,
        public readonly string $operationId,
    ) {
        $this->onQueue('integrations');
    }

    public function backoff(): array
    {
        return [10, 60, 300, 900];
    }

    public function handle(FulfillmentClient $client): void
    {
        $order = Order::query()->findOrFail($this->orderId);

        $client->upsertOrder(
            order: $order,
            idempotencyKey: "order:{$order->id}:sync:{$this->operationId}",
        );
    }
}

SyncOrderToFulfillment::dispatch(
    orderId: $order->id,
    operationId: $syncOperation->id,
)->afterCommit();
```

Generate the operation ID once when the domain operation is accepted and store
it durably with that operation. Reuse it across retries. Do not derive an
idempotency key from a second-precision timestamp or regenerate a random value
inside `handle`, because either choice can merge distinct revisions or split one
retry sequence into multiple external operations.

Use overlap middleware when only one job for a domain key may process at a time:

```php illustrative
use Illuminate\Queue\Middleware\WithoutOverlapping;

public function middleware(): array
{
    return [
        (new WithoutOverlapping("order:{$this->orderId}"))
            ->releaseAfter(30)
            ->expireAfter(180),
    ];
}
```

Keep `handle` focused on one resumable unit. Persist a provider request ID or local processing
state before an ambiguous external call when reconciliation is needed after a timeout.

## Incorrect Pattern

```php illustrative
final class EmailEveryCustomer implements ShouldQueue
{
    public function __construct(
        public Collection $customers, // Huge, stale payload with loaded models.
    ) {}

    public function handle(Mailer $mailer): void
    {
        foreach ($this->customers as $customer) {
            $mailer->send($customer); // Retry resends earlier messages.
        }
    }
}

DB::transaction(function () use ($order): void {
    $order->save();
    SyncOrderToFulfillment::dispatch($order); // May run before commit.
});
```

Avoid unbounded retries, swallowed exceptions, sleeps inside workers, and long jobs containing
many independently retryable records.

## Failure Modes

- A job retries after an external call succeeded but before local completion was recorded.
- Worker timeout exceeds `retry_after` and two workers process the same job concurrently.
- A blocking socket or child process ignores the job timeout because its own timeout is unset.
- A job receives a model identifier after the model was deleted or changed.
- Serialized relationships make payloads large and restoration queries unexpected.
- `ShouldBeUnique` uses local cache on each host, so duplicate jobs are dispatched.
- Unique locks suppress dispatch but do not make a successfully started job idempotent.
- `WithoutOverlapping` repeatedly releases a job until it exhausts attempts.
- A job is published before the database transaction commits.
- A chain stops after failure and downstream compensation never runs.
- A batch callback captures non-serializable state or assumes every job succeeded.
- Workers continue running old code after deployment because they were not restarted.
- Failed-job storage contains sensitive payloads or grows without retention policy.

## Trade-offs

Small jobs isolate failures and distribute work well but increase queue overhead and coordination.
Large jobs reduce dispatch count but amplify timeout, memory, restart, and duplicate-side-effect
risk.

Unique dispatch reduces redundant queued work; overlap middleware controls concurrent execution.
Neither replaces durable idempotency for payments, webhooks, emails, or external writes.

Long exponential backoff protects a struggling dependency but delays recovery. Immediate retries
can amplify an outage. Retry policy should follow error classification and provider guidance.

## Version and Package Boundaries

- Verify the installed Laravel version, connection driver, and worker command before copying queue
  options.
- Database, Redis, SQS, Beanstalkd, and sync connections have different reservation,
  visibility/retry, delay, priority, and operational behavior.
- Unique jobs and overlap middleware require a shared cache store with atomic locks.
- Horizon is a separate first-party package for Redis queues; use its installed-version docs only
  when detected or explicitly requested.
- Batches require the batch repository migration and jobs using the applicable batchable behavior.
- Queue encryption requires `ShouldBeEncrypted` and protects the serialized payload at the queue
  boundary; logs, failed jobs, and external calls still need separate protection.
- Process supervisors, containers, serverless queues, and managed workers own shutdown and
  deployment behavior outside Laravel core.

## Testing

- Use `Queue::fake` to assert class, queue, delay, chain, and dispatch count at the caller boundary.
- Use `Bus::fake` for chains and batches, then separately execute job `handle` behavior with real
  collaborators faked at their own boundary.
- Test success, transient release, permanent failure, timeout, max exceptions, and retry
  exhaustion.
- Execute the same job twice and prove state and external side effects remain correct.
- Assert jobs dispatched inside transactions are published after commit and discarded on rollback.
- Test overlap and uniqueness with two processes and a shared production-like cache store.
- Test missing/deleted models and changed state between dispatch and handling.
- Verify worker `timeout`, connection `retry_after`, memory, queue name, and supervisor restart in
  deployment smoke tests.
- Inspect failed-job payload retention and sensitive-field exposure.

## Grounding

Classification: `official` for Laravel queue, job, chain, batch, and testing APIs; `derived` for
idempotency and worker-operability guidance. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/queues
- https://laravel.com/docs/13.x/queues#jobs-and-database-transactions
- https://laravel.com/docs/13.x/queues#unique-jobs
- https://laravel.com/docs/13.x/queues#job-middleware
- https://laravel.com/docs/13.x/queues#job-chaining
- https://laravel.com/docs/13.x/queues#job-batching
- https://laravel.com/docs/13.x/mocking#queue-fake

Driver delivery guarantees and visibility semantics must also be verified against the configured
queue service and production worker runtime.
