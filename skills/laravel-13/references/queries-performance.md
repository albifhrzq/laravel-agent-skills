# Database Queries, Pagination, Indexes, and Performance

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

Use this reference for Eloquent and query-builder reads, raw SQL, filters, sorting, eager loading,
aggregates, pagination, chunking, streaming, indexes, read/write connections, and query
observability. Begin with the actual SQL path, row counts, data distribution, database driver,
existing indexes, and production evidence rather than optimizing from the controller shape alone.

Treat column names, sort expressions, raw fragments, JSON paths, and table names as SQL structure.
Parameter binding protects values, not arbitrary SQL identifiers, so structural input needs an
explicit allowlist.

## Verified Laravel 13 Behavior

- The query builder and Eloquent bind ordinary values. Methods such as `whereRaw` accept a
  separate bindings array; interpolating user input into raw SQL bypasses that protection.
- Eager loading with `with`, `load`, and `loadMissing` prevents repeated relationship queries.
  Aggregate helpers such as `withCount` avoid loading full related collections for counts.
- `paginate` performs a count query for total pages. `simplePaginate` avoids the total-count
  query. `cursorPaginate` uses ordered cursor values instead of numeric page offsets.
- Cursor pagination requires an `orderBy` and works best with a deterministic, unique ordering.
  Ordered columns must belong to the paginated table and cannot be null for reliable cursors.
- `chunkById` and `lazyById` paginate by a stable key and are safer than offset chunks when the
  same process updates rows.
- `cursor` keeps only one hydrated model in memory at a time, but the PDO driver may still buffer
  raw results and eager loading is not available for a cursor stream.
- `exists` can answer an existence question without calculating a complete count.
- `DB::listen` receives executed-query events. `DB::whenQueryingForLongerThan` can report
  cumulative query time per request.
- Read/write database connections may route selects and mutations differently. Transactional and
  read-after-write behavior must account for the configured connection and sticky option.
- `upsert` performs insert-or-update using database-native conflict handling; unique indexes
  determine which conflicts the database can arbitrate.

## Correct Pattern

Validate external sort names, map them to known columns, and add a unique tie-breaker:

```php illustrative
use Illuminate\Validation\Rule;

$validated = $request->validate([
    'sort' => ['sometimes', Rule::in(['newest', 'oldest', 'price-low', 'price-high'])],
    'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
]);

$sortMap = [
    'newest' => ['created_at', 'desc'],
    'oldest' => ['created_at', 'asc'],
    'price-low' => ['price_minor', 'asc'],
    'price-high' => ['price_minor', 'desc'],
];

[$sortColumn, $sortDirection] = $sortMap[$validated['sort'] ?? 'newest'];

$products = Product::query()
    ->select(['id', 'shop_id', 'name', 'price_minor', 'created_at'])
    ->with('shop:id,name')
    ->orderBy($sortColumn, $sortDirection)
    ->orderBy('id', $sortDirection)
    ->cursorPaginate($validated['per_page'] ?? 25);
```

Design an index from equality filters followed by range/order and the stable tie-breaker:

```php illustrative
Schema::table('products', function (Blueprint $table): void {
    $table->index(
        ['shop_id', 'status', 'created_at', 'id'],
        'products_shop_status_created_id_index',
    );
});
```

When processing and updating a large table, group caller conditions so Laravel's added key
condition cannot change the intended boolean logic:

```php illustrative
Product::query()
    ->where(function ($query): void {
        $query->where('status', 'draft')
            ->orWhereNull('normalized_name');
    })
    ->chunkById(500, function ($products): void {
        foreach ($products as $product) {
            // Perform a bounded, retry-safe update.
        }
    });
```

Capture query evidence in a non-sensitive environment, inspect the generated SQL and bindings,
and compare the database execution plan before and after an index change.

## Incorrect Pattern

```php illustrative
// SQL injection risk: a binding cannot protect an arbitrary identifier.
$query->orderByRaw($request->input('sort'));

// Injection risk through string interpolation.
$query->whereRaw("status = '{$request->input('status')}'");

// Unbounded memory and response size.
$products = Product::all();

// Hidden N+1.
foreach ($products as $product) {
    echo $product->shop->name;
}

// Offset chunks may skip rows when this loop changes the filtered set.
Product::whereNull('processed_at')->chunk(500, $markAsProcessed);
```

Avoid selecting every column for a high-volume list when large text, JSON, encrypted, or binary
columns are not part of the response contract.

## Failure Modes

- An allowlisted filter gains a new query path but the matching composite index is never added.
- A composite index has the right columns in an order that the target query cannot use well.
- Offset pagination becomes slower at deep pages and produces duplicates or gaps during writes.
- Cursor pagination orders only by a non-unique timestamp, making equal values unstable.
- `paginate` spends most of its time calculating a total the client does not need.
- Eager loading fixes query count but loads too many columns or too many nested rows into memory.
- A Resource or Blade view accesses an unloaded relationship and reintroduces an N+1.
- A raw expression treats user input as SQL structure.
- `chunk` skips rows because processed records leave the original result set.
- A read replica returns stale state immediately after a write.
- A query-log callback records credentials, personal data, or large bindings.
- SQLite's planner and collation behavior make a test unrepresentative of MySQL/PostgreSQL.

## Trade-offs

Indexes accelerate selected reads and enforce uniqueness at the cost of disk, cache pressure, and
write amplification. A wide covering index can help one endpoint while increasing every insert
and update.

Offset pagination supports arbitrary page numbers and totals but becomes expensive at depth.
Cursor pagination is stable and efficient for sequential navigation but cannot jump naturally to
page 200 and needs a stable public cursor contract.

Eager loading reduces round trips while increasing row and memory volume. Aggregate subqueries
can be cheaper than loading relationships but still need suitable indexes.

## Version and Package Boundaries

- Confirm the installed Laravel version before using newer builder helpers.
- MySQL/MariaDB, PostgreSQL, SQLite, and SQL Server differ in collations, null ordering, JSON
  operators, full-text search, expression/partial indexes, and execution-plan output.
- MySQL/MariaDB use table primary and unique indexes to detect `upsert` conflicts; verify the
  driver's handling of the conflict target instead of assuming identical PostgreSQL semantics.
- Cursor pagination has restrictions on ordered expressions and nullable columns; verify the
  exact generated SQL for the selected driver.
- Search, filter, and query-builder packages are not Eloquent core. Methods such as
  `allowedFilters` require their installed package and documented entry point.
- Read replicas, proxies, and connection pools add consistency boundaries outside Eloquent.

## Testing

- Assert accepted and rejected filter/sort names at the HTTP boundary.
- Test deterministic pagination with multiple rows sharing the same primary sort value.
- Test inserts or updates between cursor pages to detect duplicates and gaps.
- Enable lazy-loading prevention and query-count assertions on representative list/resource
  flows.
- Seed enough skewed data to exercise common and rare filter values.
- Verify unique and composite index behavior against duplicate and range queries.
- Use the production driver for JSON, collation, full-text, upsert, and planner-sensitive tests.
- Inspect an execution plan with representative data before claiming an index improves a query.
- Test read-after-write paths when read/write connections or replicas are configured.
- Keep performance thresholds environment-aware and report the dataset and query evidence used.

## Grounding

Classification: `official` for Laravel query, pagination, and monitoring APIs; `derived` for index
design and production-performance guidance. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/queries
- https://laravel.com/docs/13.x/eloquent
- https://laravel.com/docs/13.x/eloquent-relationships#eager-loading
- https://laravel.com/docs/13.x/pagination
- https://laravel.com/docs/13.x/database
- https://laravel.com/docs/13.x/migrations#indexes

Database execution plans and index safety must be verified against the production engine's
primary documentation and representative data.
