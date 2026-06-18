# Laravel 13 Database Production Checklist

Checklist for reviewing Laravel database changes before they are treated as production-ready.

## Documentation Grounding

- Context7 Laravel 13 docs were checked when framework behavior matters.
- Official Laravel docs were checked when Context7 is unavailable.
- Project-level `AGENTS.md` and database conventions were respected.

## Migration Safety

- Migration has one clear purpose.
- Rollback risk is understood.
- Large data backfills are not hidden inside normal deploy migrations.
- High-volume table changes have rollout plan.
- Destructive changes are phased or explicitly approved.

## Schema Design

- Table names follow project/Laravel conventions.
- Column names are clear and domain-specific.
- Column types match domain meaning.
- Nullable columns are intentional.
- Timestamps are used where appropriate.
- Soft deletes are justified.
- JSON columns are not replacing relational design unnecessarily.

## Relationships

- Relationship cardinality is correct.
- Foreign keys exist for important relationships.
- Delete behavior is intentional.
- Eloquent relationship methods are typed.
- Pivot tables have uniqueness where needed.
- Polymorphic relationships are justified.
- Factories can create valid related data.

## Constraints and Integrity

- Unique constraints protect domain uniqueness.
- Foreign keys protect ownership/association rules.
- Status fields have lifecycle meaning.
- Soft delete uniqueness issues are considered.
- Application validation and database constraints agree.

## Indexes and Queries

- Common filters have indexes.
- Common sorts have indexes or justified alternatives.
- Joins use indexed foreign keys.
- Composite indexes match real query paths.
- Collection endpoints are paginated.
- Large table operations use chunking/cursor strategies.
- N+1 risk is reviewed.

## Transactions and Concurrency

- Multi-write operations use transactions.
- Current state is checked before state transitions.
- External side effects are not performed inside long transactions.
- Queue dispatch timing is intentional.
- Retry/idempotency behavior is defined where needed.

## Tests and Seed Data

- Factories reflect valid domain data.
- Seeders are appropriate for local/test usage.
- Feature tests cover new schema behavior.
- Duplicate/integrity cases are tested where relevant.
- Query-sensitive changes have test coverage or review notes.

## Deployment Impact

- Config/env impact is documented.
- Migration runtime risk is considered.
- Backward compatibility with old app version is considered when deploying in phases.
- Rollback strategy is clear.
- Monitoring/logging plan exists for risky migrations.
