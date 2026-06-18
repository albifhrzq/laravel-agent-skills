# Laravel Database Design

Laravel 13 database design skill for Codex, Claude Code, Cursor, Windsurf, and other agent tools that consume `SKILL.md` style instructions.

Use this skill when designing or reviewing migrations, schema structure, Eloquent relationships, indexes, constraints, query performance, transactions, factories, seeders, and production migration safety.

## Install

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-database-design
```

## What It Covers

- Laravel 13 migrations and schema design.
- Primary keys, foreign keys, nullable columns, timestamps, and soft deletes.
- Eloquent relationships and typed relationship methods.
- Data integrity with foreign keys, unique constraints, and check-like domain rules.
- Index design for filters, sorts, joins, and high-volume tables.
- Query performance and N+1 prevention.
- Factories and seeders for reliable tests.
- Transactions and concurrency-sensitive writes.
- Zero-downtime migration patterns for production.

## Recommended Pairing

Use this together with:

- `laravel-api-design` for endpoint contract and API response design.
- `laravel-code-tracer` before changing complex database flows.
- `laravel-code-reviewer` after migration or model changes.

## Source Lookup

When Context7 MCP is available, fetch Laravel 13 docs before editing Laravel database behavior. If Context7 is unavailable, use the official Laravel 13 docs directly.
