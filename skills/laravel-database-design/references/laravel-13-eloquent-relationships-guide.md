# Laravel 13 Eloquent Relationships Guide

Guide for modeling Laravel Eloquent relationships with clear ownership, cardinality, and API impact.

## When to Use

Use this guide when creating or reviewing:

- `belongsTo`
- `hasOne`
- `hasMany`
- `belongsToMany`
- polymorphic relationships
- model casts
- scopes
- factories
- API resources that expose relationships

## Relationship Design Questions

Before adding a relationship, answer:

- Who owns the record?
- Is the relationship required or optional?
- Can the parent be deleted?
- Should children be deleted, restricted, or detached?
- Is the relationship used for authorization?
- Is it used in common filters or sorts?

## Typed Relationships

Prefer typed relationship methods:

```php
public function shop(): BelongsTo
{
    return $this->belongsTo(Shop::class);
}

public function products(): HasMany
{
    return $this->hasMany(Product::class);
}
```

## Many-to-Many

For pivot tables, define uniqueness and metadata intentionally.

```php
Schema::create('product_tag', function (Blueprint $table) {
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
    $table->timestamps();

    $table->unique(['product_id', 'tag_id']);
});
```

## Polymorphic Relationships

Use polymorphic relationships only when multiple models truly share the same relationship behavior.

Laravel supports migration helpers like:

```php
$table->morphs('taggable');
```

Avoid polymorphic design when normal explicit relationships would be easier to query, authorize, and index.

## Casts and Scopes

Use casts for meaningful types:

```php
protected $casts = [
    'published_at' => 'datetime',
    'metadata' => 'array',
    'is_active' => 'boolean',
];
```

Use scopes for reusable query constraints:

```php
public function scopePublished($query)
{
    return $query->whereNotNull('published_at')
        ->where('published_at', '<=', now());
}
```

## API Impact

If an API resource exposes a relationship, the query should eager load it intentionally.

```php
Product::query()->with(['shop'])->paginate();
```

Then the resource may use:

```php
'shop' => ShopResource::make($this->whenLoaded('shop')),
```

## Review Checklist

- Relationship cardinality is correct.
- Foreign keys and indexes exist.
- Delete behavior is intentional.
- Many-to-many pivots have uniqueness where needed.
- Polymorphic relationships are justified.
- Relationship methods are typed.
- API resources use `whenLoaded()`.
- Factories can create valid related data.
