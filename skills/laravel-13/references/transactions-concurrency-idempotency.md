# Transactions, Concurrency, Idempotency, and After-Commit Work

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

Use this reference for multi-write domain operations, pessimistic locks, atomic state changes,
deadlock retries, idempotency keys, webhook deduplication, queue dispatch timing, transactional
outboxes, and other race-sensitive behavior. Draw the invariant, competing writers, lock order,
external side effects, retry sources, and database driver before choosing a mechanism.

A transaction protects work performed on its database connection. It does not make HTTP calls,
emails, cache writes, filesystem writes, or third-party operations transactional.

## Verified Laravel 13 Behavior

- `DB::transaction` commits when its callback returns and rolls back when the callback throws.
- The optional `attempts` argument retries transactions after recognized deadlocks. The callback
  must therefore tolerate being run again.
- Manual `beginTransaction`, `rollBack`, and `commit` are available when callback-based control is
  insufficient, but every exception path then needs explicit cleanup.
- Query-builder `lockForUpdate` and `sharedLock` request database row locks. They are meaningful
  only while a transaction keeps the selected rows locked.
- Row locks protect rows returned by the locking query. They do not reserve an arbitrary missing
  key across every supported database.
- `afterCommit` may be selected for a dispatched job. Queue connections may also set
  `after_commit` so jobs, queued listeners, mailables, notifications, and broadcasts wait for
  open transactions to commit.
- Work deferred until commit is discarded when the transaction rolls back.
- Database unique constraints arbitrate competing inserts. A pre-insert `exists` check alone
  cannot prevent a duplicate race.
- Cache atomic locks can coordinate work across processes when all workers share a lock-capable
  store, but they have lease and ownership semantics distinct from database transactions.

## Correct Pattern

Lock the aggregate inside a short transaction, perform only database work, and dispatch dependent
work after commit:

```php illustrative
use Illuminate\Support\Facades\DB;

$order = DB::transaction(function () use ($orderId, $actorId) {
    $order = Order::query()
        ->whereKey($orderId)
        ->lockForUpdate()
        ->firstOrFail();

    $order->confirmBy($actorId);
    $order->save();

    OrderEvent::query()->create([
        'order_id' => $order->id,
        'type' => 'confirmed',
    ]);

    ProcessConfirmedOrder::dispatch($order->id)->afterCommit();

    return $order;
}, attempts: 3);
```

Make the database the final arbiter for idempotency-key ownership:

```php illustrative
Schema::create('idempotency_records', function (Blueprint $table): void {
    $table->id();
    $table->foreignId('actor_id')->constrained('users')->cascadeOnDelete();
    $table->string('operation', 100);
    $table->string('idempotency_key', 160);
    $table->string('request_hash', 64);
    $table->string('status', 30);
    $table->json('stored_response')->nullable();
    $table->timestamp('expires_at')->nullable();
    $table->timestamps();

    $table->unique(
        ['actor_id', 'operation', 'idempotency_key'],
        'idempotency_actor_operation_key_unique',
    );
});
```

For the first request, attempt the insert. If a driver-classified unique-constraint exception
shows another request won, re-read that row and compare the request hash. Return the stored
response for the same hash, return a conflict for a different hash, or apply the project's bounded
in-progress policy. Do not identify duplicate-key exceptions by brittle message text.

```php illustrative
try {
    $record = IdempotencyRecord::query()->create($newRecordAttributes);
} catch (QueryException $exception) {
    if (! $duplicateKeyClassifier->matches($exception, 'idempotency_actor_operation_key_unique')) {
        throw $exception;
    }

    $record = IdempotencyRecord::query()
        ->where($idempotencyScope)
        ->firstOrFail();
}

if (! hash_equals($record->request_hash, $requestHash)) {
    throw new IdempotencyConflict();
}
```

The exception classifier is driver-specific infrastructure. Test it with the production driver.
The catch-and-re-read example must run in autocommit mode or after rolling back the transaction
that received the unique violation. PostgreSQL marks the current transaction as aborted after an
error, so querying again inside that same transaction fails until rollback. If ownership must be
claimed inside a larger transaction, use a driver-verified savepoint or an atomic conflict-ignore /
upsert strategy and prove its affected-row semantics on the production driver; do not assume the
same recovery sequence works across PostgreSQL, MySQL, and SQLite.

## Incorrect Pattern

```php illustrative
// Race: no row exists to lock, so two requests can both reach firstOrCreate.
$record = IdempotencyRecord::query()
    ->lockForUpdate()
    ->firstOrCreate($scope);

// Race: both requests can observe "not found".
if (! IdempotencyRecord::where($scope)->exists()) {
    IdempotencyRecord::create($scope);
}

DB::transaction(function () use ($paymentGateway): void {
    $paymentGateway->charge(); // Database rollback cannot undo this call.
    Order::query()->update(/* ... */);
});

ProcessOrder::dispatch($order); // May run before an open transaction commits.
```

Avoid holding locks while waiting on users, remote services, large file operations, or unbounded
loops.

## Failure Modes

- Two first requests create duplicate work because the idempotency scope lacks a unique index.
- `lockForUpdate` is called outside a transaction and releases before the protected update.
- Competing code paths lock rows in different orders and deadlock.
- A deadlock retry repeats an email, HTTP request, or non-idempotent callback inside the closure.
- A worker receives a job before the row it references is committed.
- After-commit dispatch is assumed to provide exactly-once delivery; a crash or queue retry still
  duplicates the side effect.
- The same idempotency key is accepted with a different request payload.
- An in-progress record never completes after a crash and every retry remains blocked.
- The stored response contains credentials, personal data, or an object that cannot be serialized
  consistently.
- A long transaction grows contention, replica lag, or lock wait timeouts.
- SQLite tests do not reproduce production row locks or isolation behavior.
- Multiple database connections are used, but only one participates in the transaction.
- Code catches a PostgreSQL unique violation and queries again before rolling back the aborted
  transaction.

## Trade-offs

Pessimistic locking gives straightforward serialization for hot aggregates but increases waiting
and deadlock risk. Optimistic conditional updates avoid waiting and work well when contention is
rare, but callers must handle a failed compare-and-set.

Idempotency records provide durable replay behavior and conflict detection at the cost of storage,
expiry, privacy, and recovery policy. A cache lock is lighter but may expire during work and
usually cannot return a durable prior response.

After-commit dispatch prevents pre-commit reads but leaves a crash window after commit and before
publication unless the queue integration is transactional. A transactional outbox closes that
window by persisting an event with domain changes, at the cost of a relay and eventual delivery.

## Version and Package Boundaries

- Confirm the installed Laravel version and queue connection before relying on after-commit APIs.
- Deadlock detection, isolation levels, missing-row/gap locks, lock timeouts, and error codes vary
  across MySQL/MariaDB, PostgreSQL, SQLite, and SQL Server.
- SQLite does not provide representative row-level locking for production concurrency tests.
- The queue `after_commit` option affects queued listeners, mailables, notifications, and
  broadcasts on that connection; inspect project configuration before adding per-dispatch calls.
- Cache locks require every participant to use the same central lock-capable store.
- Payment SDK idempotency, message-broker deduplication, and distributed transaction packages are
  external contracts and need installed-version primary documentation.

## Testing

- Test success, rollback, and exception paths for every transactional state transition.
- Run two independent connections or processes against the production driver to exercise races.
- Verify the unique constraint decides simultaneous first-use idempotency requests.
- Test same key/same hash, same key/different hash, in-progress timeout, completed replay, expiry,
  and failed-operation recovery.
- Force a retryable deadlock where practical and prove repeated closure execution is safe.
- Assert jobs are not visible before commit and are discarded on rollback.
- Test worker retry after the database commit and verify the external side effect remains
  idempotent.
- Test lock timeout and conflict responses without converting them into generic server errors.
- Inspect transaction duration and lock waits under representative load.

## Grounding

Classification: `official` for Laravel transaction, lock, and after-commit APIs; `derived` for
idempotency-record and outbox design. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/database#database-transactions
- https://laravel.com/docs/13.x/queries#pessimistic-locking
- https://laravel.com/docs/13.x/queues#jobs-and-database-transactions
- https://laravel.com/docs/13.x/events#queued-event-listeners-and-database-transactions
- https://laravel.com/docs/13.x/cache#atomic-locks
- https://laravel.com/docs/13.x/migrations#creating-indexes

Unique-constraint classification, lock semantics, and isolation behavior must also be verified
against the production database driver.
