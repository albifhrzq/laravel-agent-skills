# Cache, Redis, Atomic Locks, and Invalidation

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

Use this reference for cache-aside reads, expiration, invalidation, stale-while-revalidate,
multiple cache stores, Redis access, atomic add, distributed locks, lock ownership, and stampede
control. Inspect `config/cache.php`, installed Redis client, key prefixes, serialization,
deployment topology, tenant boundaries, and failure policy before selecting a pattern.

Cached data is a derived copy unless the application explicitly implements a cache-backed source
of truth. Design behavior for misses, stale values, eviction, store failure, and partial
invalidation.

## Verified Laravel 13 Behavior

- The `Cache` facade uses the configured default store; `Cache::store($name)` selects another
  configured store.
- `get` returns a fallback for a missing key. `remember` computes and stores a value when absent;
  `rememberForever` has no application TTL and remains subject to eviction or manual removal.
- `put` accepts a TTL, `forever` stores without an application expiration, and `forget` removes a
  key.
- `add` is atomic on supported stores and returns whether an absent key was successfully stored.
- `increment` and `decrement` use store-level operations; initialize and type values consistently
  before relying on them as counters.
- `Cache::flexible` implements a stale-while-revalidate window: a fresh value is returned first,
  a stale value may be served while refresh is deferred, and an expired value is recomputed.
- Cache tags group related keys only on stores that support tags. File, database, and DynamoDB
  stores do not support tagged cache items.
- `Cache::lock` creates an atomic lock with a lease duration on lock-capable stores. `get`,
  `block`, `release`, owner tokens, and `restoreLock` control acquisition and ownership.
- Passing a closure to `get` or `block` releases the acquired lock after the closure exits.
- Laravel Redis connections are configured in `config/database.php` and use the installed
  PhpRedis extension or the Predis package.

## Correct Pattern

Use a versioned, tenant-scoped key and invalidate it only after durable state commits:

```php illustrative
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

function productCatalogKey(int $tenantId): string
{
    return "tenant:{$tenantId}:catalog:v3";
}

$catalog = Cache::remember(
    productCatalogKey($tenantId),
    now()->addMinutes(10),
    fn () => Product::query()
        ->where('tenant_id', $tenantId)
        ->where('is_visible', true)
        ->get(['id', 'name', 'price_minor']),
);

DB::transaction(function () use ($tenantId, $attributes): void {
    Product::query()->create($attributes);

    DB::afterCommit(function () use ($tenantId): void {
        Cache::forget(productCatalogKey($tenantId));
    });
});
```

Use an atomic lock for one bounded cross-process operation. Set the lease longer than expected
work, bound acquisition wait, and keep the critical section small:

```php illustrative
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Support\Facades\Cache;

try {
    Cache::lock("invoice:{$invoiceId}:generate", 120)
        ->block(5, function () use ($invoiceId): void {
            GenerateInvoice::run($invoiceId);
        });
} catch (LockTimeoutException) {
    throw new InvoiceGenerationAlreadyRunning();
}
```

When ownership moves to another process, pass the owner token explicitly and restore that exact
lock before release:

```php illustrative
$lock = Cache::lock($lockName, 120);

if ($lock->get()) {
    FinishLockedWork::dispatch($lockName, $lock->owner());
}

// In the receiving process:
Cache::restoreLock($lockName, $ownerToken)->release();
```

## Incorrect Pattern

```php illustrative
// Race: get followed by put is not an atomic claim.
if (! Cache::has($key)) {
    Cache::put($key, true, 60);
}

// Cross-tenant leak and collision.
Cache::remember('products', 3600, fn () => Product::all());

// A five-second lease cannot protect work that may run for a minute.
Cache::lock('monthly-report', 5)->get(function (): void {
    buildLargeReport();
});

// Flush ignores the application's cache prefix and can affect shared stores.
Cache::flush();
```

Do not use `forceRelease` as routine cleanup; it ignores ownership and can release another
process's valid lease.

## Failure Modes

- A key omits tenant, locale, user, permission, or version context and returns another audience's
  data.
- Cached authorization or role data remains stale after a permission change.
- Invalidation runs before a database rollback, leaving cache and durable state inconsistent.
- A forever key never receives a new schema/version and old serialized objects cannot be decoded.
- A hot key expires simultaneously on many workers and causes a cache stampede.
- A lock lease expires while work continues, so a second worker enters the same critical section.
- A process crashes after acquiring a lock; an excessive lease blocks work too long.
- A lock owner token is logged, exposed, or released by the wrong process.
- Tests use the array store and incorrectly prove cross-process locking.
- Redis eviction or failover removes a value the application treated as durable state.
- A cluster command touches keys in different hash slots and loses expected atomicity.
- `flush` clears unrelated applications that share the same physical cache.

## Trade-offs

Short TTLs reduce staleness but increase misses and backend load. Long TTLs improve hit rate while
making invalidation completeness more important. Event-driven invalidation is fast but can miss a
path; versioned keys make broad invalidation simple at the cost of abandoned old entries.

Atomic locks are appropriate for short, bounded coordination. Database constraints are stronger
for durable uniqueness, and queue uniqueness or overlap middleware may better express job
scheduling intent.

Redis provides fast shared operations and rich structures but adds network, memory, persistence,
cluster, and failover decisions. A local file or array store is simpler but cannot coordinate
multiple application hosts.

## Version and Package Boundaries

- Confirm the installed Laravel version before using newer cache APIs such as flexible caching or
  concurrency helpers.
- Atomic lock support depends on the configured driver and all participants sharing the same
  central store.
- Cache tags are not portable to every Laravel cache driver.
- The PhpRedis extension and Predis package differ in installation, options, serialization, and
  cluster behavior; inspect the detected client configuration.
- Redis Cluster multi-key operations may require deliberate hash tags so related keys share a
  slot.
- Horizon, queue middleware, rate limiters, and session storage may share Redis infrastructure
  but have separate key, durability, and failure requirements.
- Do not introduce Redis or a cache package solely because this reference mentions it.

## Testing

- Test miss, hit, expiration, stale window, recomputation failure, and explicit invalidation.
- Assert tenant/user/locale/permission dimensions are included in cache keys.
- Test mutation rollback and commit to prove invalidation timing.
- Use a real shared lock-capable store for acquisition contention, lease expiry, owner transfer,
  and crash recovery tests.
- Run two processes to prove only one enters the critical section.
- Test behavior when the cache store is unavailable according to the application's fail-open or
  fail-closed policy.
- Verify serialized values across deployment versions when objects rather than scalar/array data
  are cached.
- Inspect TTLs, hit rate, evictions, memory, slow commands, and lock contention in production
  telemetry.
- Do not use `Cache::flush` in tests against a store shared with another suite or application.

## Grounding

Classification: `official` for Laravel cache, Redis, and lock APIs; `derived` for key design,
invalidation, and lease-safety guidance. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/cache
- https://laravel.com/docs/13.x/redis
- https://laravel.com/docs/13.x/database#database-transactions
- https://laravel.com/docs/13.x/queues#unique-jobs
- https://laravel.com/docs/13.x/queues#preventing-job-overlaps

Redis durability, clustering, eviction, and failover must also be verified against the configured
client and deployment's primary documentation.
