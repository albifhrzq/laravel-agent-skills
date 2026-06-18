# Laravel Database Design - Complete Reference

**Version:** 1.0.0  
**Target:** Laravel 13.x, PHP 8.3+  
**License:** MIT

## Purpose

Use this guide when designing, reviewing, or implementing Laravel database changes. The goal is to keep schema design intentional, queryable, safe to evolve, and production-aware.

This skill has two layers:

- `rules/` contains concise guardrails and acceptance criteria.
- `references/` contains longer implementation guides, examples, trade-offs, and review checklists.

## Source of Truth

When working on Laravel database behavior, use this order:

1. Project-level `AGENTS.md` when it defines explicit local conventions.
2. Context7 Laravel 13 documentation when Context7 MCP is available.
3. Official Laravel 13 documentation.
4. Existing migrations, models, factories, seeders, and tests.
5. Current production constraints when known.

## Reference Guides

Read the relevant reference guide when the task needs more than a short rule:

- `references/laravel-13-migrations-schema-guide.md`
- `references/laravel-13-eloquent-relationships-guide.md`
- `references/laravel-13-index-query-performance-guide.md`
- `references/laravel-13-data-integrity-guide.md`
- `references/laravel-13-transactions-concurrency-guide.md`
- `references/laravel-13-database-production-checklist.md`

## Core Principles

1. Tables should model domain concepts, not temporary UI needs.
2. Migrations should be small, reviewable, and production-aware.
3. Important relationships should have foreign keys and clear delete behavior.
4. Database constraints should protect important invariants.
5. Indexes should follow real query paths.
6. Eloquent relationships should be typed and match schema design.
7. Factories and seeders should produce valid domain data.
8. Multi-write operations should use transactions.
9. Large production changes should use phased rollout when needed.

## Recommended Migration Shape

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
    $table->string('name', 120);
    $table->string('slug', 160);
    $table->unsignedBigInteger('price');
    $table->string('status', 40)->index();
    $table->json('metadata')->nullable();
    $table->timestamp('published_at')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->unique(['shop_id', 'slug']);
    $table->index(['shop_id', 'status']);
    $table->index(['shop_id', 'created_at']);
});
```

## Recommended Model Shape

```php
final class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'shop_id',
        'name',
        'slug',
        'price',
        'status',
        'metadata',
        'published_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'published_at' => 'datetime',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
```

## Review Checklist

Before accepting database changes, verify:

- Context7 or Laravel 13 docs were checked when framework behavior matters.
- Migration purpose is clear.
- Rollback and production risk are understood.
- Column types and nullability match domain meaning.
- Foreign keys and delete behavior are intentional.
- Unique constraints protect domain uniqueness.
- Indexes match filter, sort, and join paths.
- Eloquent relationships match schema design.
- Factories/seeders/tests are updated.
- Multi-write operations use transactions.
- Large data changes are chunked or separated from deploy migrations.
- Zero-downtime rollout is considered for critical tables.
