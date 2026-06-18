---
title: Design Eloquent Relationships Deliberately
impact: CRITICAL
impactDescription: Incorrect relationship modeling causes authorization bugs, N+1 queries, and unstable API contracts.
tags: laravel, eloquent, relationships, models
---

# Design Eloquent Relationships Deliberately

## Rule

Eloquent relationships must reflect the real domain ownership and cardinality. Relationship methods should be typed and paired with matching foreign keys, indexes, factories, and tests.

## Prefer

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

Use casts for fields with meaningful types:

```php
protected $casts = [
    'published_at' => 'datetime',
    'metadata' => 'array',
    'is_active' => 'boolean',
];
```

## Check Cardinality

Before creating relationships, decide:

- one-to-one
- one-to-many
- many-to-many
- polymorphic
- ownership vs association
- required vs optional relationship

## Avoid

- Adding relationships only because the UI needs a display field.
- Many-to-many pivots without uniqueness rules.
- Polymorphic relationships when normal relationships would be clearer.
- Accessing relationships in resources without eager loading.
- Trusting route IDs without ownership checks.

## Acceptance Criteria

A relationship design is acceptable when cardinality, ownership, foreign keys, indexes, casts, factories, and authorization implications are clear.
