# Laravel Agent Skills

A focused collection of agent skills for Laravel projects, especially Laravel 13 API development with Codex, Claude Code, Cursor, Windsurf, and other tools that understand `SKILL.md`-style skills.

This repository is intentionally Laravel-focused. It is not a generic full-stack skill collection.

## Available Skills

| Skill | Purpose |
|---|---|
| `laravel-api-design` | Laravel 13 API route setup, REST route design, FormRequest validation, API Resources, JSON:API Resources, error envelopes, auth, authorization, JWT lifecycle, pagination, idempotency, rate limiting, OpenAPI docs, and feature tests. |

## Install

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-api-design
```

Or copy a skill folder manually into your project:

```text
.agents/skills/laravel-api-design/
```

## Skill Layout

Each mature skill uses two guidance layers:

```text
skills/laravel-api-design/
├── SKILL.md
├── AGENTS.md
├── rules/        # short rules, guardrails, acceptance criteria
└── references/   # longer guides, examples, trade-offs, edge cases
```

## Documentation Grounding

When Context7 MCP is available in the coding-agent environment, agents should fetch Laravel 13 docs through Context7 before editing Laravel-specific behavior. If Context7 is unavailable, use the official Laravel 13 documentation directly.

## Recommended Project Setup

In each Laravel project, combine these skills with a project-level `AGENTS.md` that defines:

- Laravel/PHP version.
- App architecture conventions.
- API response contract.
- Auth guard/token strategy.
- Roles and permissions.
- Test commands.
- Deployment constraints.
- Things the agent must never change without explicit approval.

## Example Project-Level Usage

```text
your-laravel-project/
├── AGENTS.md
├── .agents/
│   └── skills/
│       └── laravel-api-design/
│           └── SKILL.md
├── app/
├── routes/
└── tests/
```

## License

MIT
