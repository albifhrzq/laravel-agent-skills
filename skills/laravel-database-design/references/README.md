# Laravel Database Design References

Detailed Laravel 13 database guides for agents. These files complement the short rule files in `rules/`.

Use this folder when the task needs implementation patterns, examples, trade-offs, edge cases, and production review guidance.

## Reference Guides

| Topic | File | When to Use |
|---|---|---|
| Migrations & Schema | `laravel-13-migrations-schema-guide.md` | Creating migrations, choosing column types, timestamps, soft deletes, schema dump, rollout safety. |
| Eloquent Relationships | `laravel-13-eloquent-relationships-guide.md` | Modeling belongsTo, hasMany, belongsToMany, polymorphic relations, casts, scopes, factories. |
| Indexes & Query Performance | `laravel-13-index-query-performance-guide.md` | Indexing filters/sorts/joins, N+1 prevention, pagination, chunking, query review. |
| Data Integrity | `laravel-13-data-integrity-guide.md` | Foreign keys, unique constraints, nullability, delete behavior, domain invariants. |
| Transactions & Concurrency | `laravel-13-transactions-concurrency-guide.md` | Multi-write consistency, transactions, locks, queue side effects, idempotent operations. |
| Production Checklist | `laravel-13-database-production-checklist.md` | Final checklist before database changes are treated as production-ready. |

## Maintenance Rule

Before updating a guide, check Context7 Laravel 13 documentation when available and verify current project database conventions.
