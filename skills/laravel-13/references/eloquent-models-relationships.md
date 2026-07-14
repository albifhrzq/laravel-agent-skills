# Eloquent Models, Relationships, Casts, and Serialization

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

Use this reference for Eloquent model configuration, mass assignment, casts, accessors and
mutators, relationships, pivots, polymorphism, soft deletes, factories, route-bound models, eager
loading, and array/JSON serialization. Inspect the schema, model traits, global scopes, resources,
policies, factories, and query call sites before changing a model contract.

Model relationships express domain cardinality and ownership. Do not create a relationship only
because one screen needs a display value; verify the underlying key, constraint, lifecycle, and
authorization meaning.

## Verified Laravel 13 Behavior

- Eloquent models conventionally map a singular class to a plural snake-case table and use `id`
  as the primary key. Override table, key type, incrementing behavior, or connection explicitly
  when the schema differs.
- Mass assignment through `create`, `fill`, and `update` is governed by `$fillable` or
  `$guarded`. Direct property assignment is a separate path.
- Laravel can prevent silently discarded mass-assignment attributes in local development through
  `Model::preventSilentlyDiscardingAttributes`.
- A model may define casts through a protected `casts(): array` method. Built-in casts include
  booleans, dates, immutable dates, arrays/JSON, encrypted values, collections, and enums.
- Relationship methods return relation objects such as `BelongsTo`, `HasMany`, and
  `BelongsToMany`. Custom foreign and owner keys are supported when conventions do not match.
- Eager loading with `with` or `load` avoids repeated lazy-load queries. Laravel can prevent lazy
  loading so hidden N+1 behavior becomes visible during development or testing.
- Many-to-many relationships use an intermediate table; `withPivot`, `withTimestamps`, custom
  pivot models, and pivot constraints define additional behavior.
- Polymorphic type columns contain model-type identifiers. An enforced morph map keeps stored
  identifiers independent from PHP class names.
- `$hidden`, `$visible`, and `$appends` affect model array/JSON serialization. They are not a
  substitute for a deliberate public API Resource.
- Soft deletes add a global scope and populate `deleted_at`; normal queries omit deleted rows
  unless `withTrashed` or `onlyTrashed` is selected.

## Correct Pattern

Align casts and relationships with the schema, use explicit mass-assignment fields, and provide
typed relationship return values:

```php illustrative
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Product extends Model
{
    protected $fillable = [
        'shop_id',
        'name',
        'price_minor',
        'status',
        'metadata',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'price_minor' => 'integer',
            'metadata' => 'array',
            'published_at' => 'immutable_datetime',
            'status' => ProductStatus::class,
        ];
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function orderLines(): HasMany
    {
        return $this->hasMany(OrderLine::class);
    }

    protected function normalizedName(): Attribute
    {
        return Attribute::get(
            fn (): string => mb_strtolower($this->name),
        );
    }
}
```

Back a many-to-many relation with database uniqueness and expose pivot fields intentionally:

```php illustrative
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class)
        ->withPivot(['granted_by'])
        ->withTimestamps();
}

// Migration:
$table->unique(['user_id', 'role_id']);
```

Load what the caller's output contract needs, then let a Resource avoid accidental lazy loading:

```php illustrative
$product = Product::query()
    ->with(['shop:id,name'])
    ->withCount('orderLines')
    ->findOrFail($productId);

return ProductResource::make($product);
```

Use `Relation::enforceMorphMap` before persisting polymorphic types when class-name stability or
cross-service identifiers matter. Treat changing an existing morph map as a data migration.

## Incorrect Pattern

```php illustrative
final class Product extends Model
{
    // Unsafe default: any request key may become assignable.
    protected $guarded = [];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}

// Hidden N+1: one query for products, then one query per shop.
foreach (Product::all() as $product) {
    echo $product->shop->name;
}

// Leaks every currently serializable column and loaded relation.
return response()->json(Product::findOrFail($id));
```

Avoid querying, issuing remote calls, or mutating state from accessors. Those methods may execute
during logging, serialization, debugging, queue serialization, or template rendering.

## Failure Modes

- A request field becomes mass assignable and changes ownership, role, price, or internal state.
- A misspelled fillable field is silently discarded and the caller assumes it was persisted.
- A cast does not match the column, causing precision loss, timezone drift, or invalid enum values.
- An accessor triggers queries repeatedly while a collection is serialized.
- A relation uses the wrong foreign key or cardinality and authorization checks traverse the wrong
  owner.
- A pivot allows duplicates because only application checks enforce uniqueness.
- A polymorphic type stores PHP class names, then a namespace refactor breaks existing rows.
- A resource accesses an unloaded relation and creates an N+1 query.
- A model returned directly exposes hidden operational columns or newly added attributes.
- Soft-deleted rows collide with a unique constraint because restore and reuse semantics were not
  designed.
- A global scope silently changes admin, export, queue, or maintenance queries.
- A queued model is restored later with different database state than the dispatcher observed.

## Trade-offs

`$fillable` is explicit and safer at input boundaries but requires maintenance when fields are
added. `$guarded` can be practical for internal-only models, but `$guarded = []` increases the
cost of every caller mistake.

Eager loading uses more data per query but prevents latency multiplication. Loading every
relationship by default simplifies callers while increasing memory and serialization risk.

Polymorphic relations reduce table count for genuinely shared behavior but weaken ordinary
foreign-key enforcement and complicate reporting. Explicit relations are easier to constrain when
the set of related types is small and stable.

## Version and Package Boundaries

- Confirm the installed Laravel version before adopting model attributes or helpers from newer
  live documentation.
- Native enum casts require PHP enums and compatible stored values; migration and fallback
  behavior remain application decisions.
- Database JSON, decimal, collation, timezone, and soft-delete uniqueness behavior varies by
  driver.
- `preventLazyLoading` and other strictness methods should normally be enabled conditionally so a
  production-only path does not fail unexpectedly without prior test coverage.
- Third-party sluggable, activity-log, translatable, tenancy, media, and state-machine packages
  own additional model behavior. Load their installed-version docs only when detected or
  explicitly requested.

## Testing

- Test mass assignment with allowed and sensitive attributes.
- Test every relationship's cardinality, custom keys, pivot metadata, and delete behavior.
- Assert cast round trips for enum, date/time, decimal/minor-unit money, JSON, encrypted, and null
  values used by the model.
- Enable lazy-loading prevention in tests that exercise collection serialization and Blade views.
- Assert public Resource output separately from model array serialization.
- Test soft delete, restore, force delete, uniqueness, and route binding behavior.
- Test polymorphic mappings against persisted aliases, including any legacy value migration.
- Use factories to create valid relationship graphs and named edge states.
- Add a production-driver test where JSON queries, case sensitivity, precision, or uniqueness
  semantics affect behavior.

## Grounding

Classification: `official` for Eloquent APIs and `derived` for domain-modeling and serialization
boundaries. Verified against the pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/eloquent
- https://laravel.com/docs/13.x/eloquent-relationships
- https://laravel.com/docs/13.x/eloquent-mutators
- https://laravel.com/docs/13.x/eloquent-serialization
- https://laravel.com/docs/13.x/eloquent-factories
- https://laravel.com/docs/13.x/eloquent-resources

Package traits can alter queries, events, serialization, and deletion. Inspect the installed trait
source and package tests before treating those behaviors as Eloquent core.
