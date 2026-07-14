# Migrations, Schema, Factories, and Seeding

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

Use this reference for schema creation and alteration, keys, constraints, indexes, rollback
behavior, production-safe rollout, factories, seeders, and data backfills. Inspect the current
schema, every migration touching the target table, model key types, production database driver,
deployment topology, and tests before proposing a change.

Treat a migration as deployed history once it may have run outside the local machine. Add a new
migration instead of editing deployed history unless the user explicitly confirms the migration
has never left a disposable environment.

## Verified Laravel 13 Behavior

- Migration classes expose `up` and `down` methods; `migrate` runs pending `up` methods and
  rollback commands invoke applicable `down` methods.
- `Schema::create` and `Schema::table` receive a `Blueprint`. Schema capabilities and generated
  SQL still depend on the configured database grammar.
- `foreignId` creates an unsigned big-integer-compatible column. Match UUID and ULID parents with
  `foreignUuid` and `foreignUlid` rather than mixing key representations.
- `constrained` infers the referenced table and column by convention. Explicit table, column,
  and index names are available when conventions do not match.
- Column modifiers such as `nullable` must be applied before `constrained`. A foreign key using
  `nullOnDelete` also needs a nullable column at the database level.
- `cascadeOnDelete`, `restrictOnDelete`, `nullOnDelete`, and `noActionOnDelete` describe database
  referential actions; they are not interchangeable business defaults.
- Unique constraints protect invariants under concurrency in a way request validation alone
  cannot. Validation remains useful for friendly errors.
- Laravel seeders may call other seeders through `$this->call`. Factories define test/dev object
  states and relationships; they do not replace a production backfill plan.
- `migrate --isolated` uses an atomic cache lock to prevent concurrent migration execution when
  the selected cache driver supports locks.
- The framework can dump a schema for migration squashing. A dump is a bootstrap optimization,
  not proof that production matches the repository.

## Correct Pattern

Choose nullability and delete semantics together. The modifier order below is significant:

```php illustrative
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::create('products', function (Blueprint $table): void {
    $table->id();
    $table->foreignId('shop_id')
        ->constrained()
        ->restrictOnDelete();
    $table->foreignId('category_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();
    $table->string('slug', 160);
    $table->string('status', 40)->index();
    $table->timestamps();

    $table->unique(['shop_id', 'slug']);
    $table->index(['shop_id', 'status', 'id']);
});
```

Use an expand/backfill/contract rollout when old and new application versions may overlap:

1. Add a nullable column, new table, or backward-compatible index.
2. Deploy code capable of writing the new shape while old reads still work.
3. Backfill in bounded, idempotent chunks outside the deploy-critical migration.
4. Verify completeness and switch reads.
5. Add required constraints only after every row is valid.
6. Remove the old shape in a later, explicitly approved deployment.

Factories should produce valid default records and named exceptional states:

```php illustrative
use Illuminate\Database\Eloquent\Factories\Factory;

final class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'status' => 'draft',
        ];
    }

    public function published(): static
    {
        return $this->state(fn (): array => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}
```

Make production backfills restartable: select a stable key, use `chunkById` or `lazyById`,
record progress when operations span deployments, and make rerunning an already-processed row a
no-op.

## Incorrect Pattern

```php illustrative
// Wrong modifier order and impossible SET NULL behavior on a non-null column.
$table->foreignId('category_id')
    ->constrained()
    ->nullable()
    ->nullOnDelete();

// Validation alone does not prevent concurrent duplicates.
Rule::unique('products', 'slug')->where('shop_id', $shopId);

// A deploy migration should not hold a large table and application release hostage.
Product::query()->each(fn (Product $product) => $product->update([
    'normalized_name' => normalize($product->name),
]));
```

Avoid calling current application models from old migrations. Model scopes, casts, table names,
events, and fillable fields change over time, so a historical migration can produce different
behavior months later.

## Failure Modes

- A nullable relation uses `nullOnDelete` but the column is not nullable, so parent deletion fails.
- A UUID parent is referenced by `foreignId`, causing type mismatch or unusable constraints.
- A cascading delete removes orders, audit history, or reports that should have been retained.
- A unique validation check passes twice under concurrency because no unique index arbitrates.
- A new non-null column is added before old application instances know how to populate it.
- A long backfill holds locks, exceeds deployment timeouts, or leaves partially transformed rows.
- `down` destroys newer data or cannot restore a lossy type conversion.
- An index is correct locally but blocks writes while being built on the production engine.
- A seeder runs in production and overwrites real records because it is not environment-safe or
  idempotent.
- Factories omit a database invariant, so tests pass with states production cannot persist.
- Two deploy processes run migrations concurrently because the isolation lock is not shared.
- SQLite tests pass while production fails on collation, constraint, generated-column, or DDL
  semantics.

## Trade-offs

Foreign keys and unique constraints strengthen integrity but add write checks and make deletion
order explicit. Cascades simplify cleanup but can erase history; restrictions preserve history
but require deliberate archival or detach workflows.

One large migration is operationally simple to name but difficult to deploy, observe, resume, and
roll back. Phased migrations add temporary complexity and dual-shape code while keeping mixed
application versions compatible.

Database defaults protect non-application writers but can hide missing application decisions.
Application-generated values are easier to test in domain code but need every writer to agree.

## Version and Package Boundaries

- Verify Laravel version and driver before copying schema methods from live docs.
- MariaDB/MySQL, PostgreSQL, SQLite, and SQL Server differ in transactional DDL, lock behavior,
  generated columns, index length, partial indexes, collations, and online alteration support.
- Laravel's schema builder exposes portable common operations; engine-specific online or
  concurrent index syntax may require a reviewed raw statement and a deployment runbook.
- SQLite is useful for fast tests but is not a substitute for a production-driver migration test.
- `migrate --isolated` requires a shared cache store with atomic lock support across deploy hosts.
- Factory APIs are Laravel core; third-party state-machine, enum, migration, or online-schema
  packages should be used only when detected or explicitly requested.

## Testing

- Run migrations from an empty database and from a representative pre-change schema.
- Run `migrate:rollback` only when rollback is expected to be safe, then migrate forward again.
- Assert table, column, index, and foreign-key behavior, not merely that the command exits zero.
- Test duplicate inserts against the unique constraint and invalid foreign-key writes.
- Test parent deletion for every chosen cascade, restrict, and set-null action.
- Exercise factories and seeders repeatedly to prove their valid and idempotent behavior.
- Test backfill interruption and restart with already-processed and malformed rows.
- Use SQLite for the PR smoke path and run MySQL/PostgreSQL fixtures for driver-sensitive changes.
- Estimate production row count, lock duration, disk growth, and rollback path before scheduling a
  high-risk migration.

## Grounding

Classification: `official` for Laravel schema, migration, factory, and seeding APIs; `derived` for
expand/backfill/contract and deployment-safety guidance. Verified against the pinned Laravel 13
sources and:

- https://laravel.com/docs/13.x/migrations
- https://laravel.com/docs/13.x/seeding
- https://laravel.com/docs/13.x/eloquent-factories
- https://laravel.com/docs/13.x/database-testing
- https://laravel.com/docs/13.x/cache#atomic-locks

Engine-specific DDL safety must also be verified against the production database's primary
documentation and observed schema before execution.
