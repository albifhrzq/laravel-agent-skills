# Laravel Database Design Rule Sections

Rules should be read in this order:

1. `migration-safety.md` - migration structure, reversibility, and production risk.
2. `schema-design.md` - table design, column choices, timestamps, soft deletes, and naming.
3. `eloquent-relationships.md` - relationship modeling, typed relationships, casts, and scopes.
4. `constraints-integrity.md` - foreign keys, unique constraints, nullable behavior, and integrity rules.
5. `index-query-performance.md` - indexes, query patterns, pagination, and N+1 prevention.
6. `data-migration-seeding.md` - factories, seeders, and safe data backfills.
7. `transactions-concurrency.md` - multi-write operations, locks, retries, and consistency.
8. `zero-downtime-migrations.md` - safe rollout patterns for critical production tables.
