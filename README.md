# Laravel Agent Skills

A focused collection of agent skills for Laravel projects, especially Laravel 13 API development with Codex, Claude Code, Cursor, Windsurf, and other tools that understand `SKILL.md`-style skills.

This repository is intentionally Laravel-focused. It is not a generic full-stack skill collection.

## Available Skills

| Skill | Purpose |
|---|---|
| `laravel-api-design` | Laravel 13 API route setup, REST route design, FormRequest validation, API Resources, JSON:API Resources, error envelopes, auth, authorization, JWT lifecycle, pagination, idempotency, rate limiting, OpenAPI docs, and feature tests. |
| `laravel-code-tracer` | Codex skill wrapper for tracing Laravel execution flow from route/command/job/event/webhook to validation, authorization, business logic, database, side effects, and response. |
| `laravel-code-reviewer` | Codex skill wrapper for reviewing Laravel code changes for correctness, API contract stability, validation, authorization, security, performance, tests, docs, and production readiness. |

## Available Agents

| Agent | Purpose |
|---|---|
| `laravel-code-tracer` | Agent version of the Laravel execution flow tracer. |
| `laravel-code-reviewer` | Agent version of the Laravel code reviewer. |

## Install Skills for Codex

Install the main Laravel API design skill:

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-api-design
```

Install tracer and reviewer as Codex-visible skills:

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-code-tracer
npx skills add albifhrzq/laravel-agent-skills --skill laravel-code-reviewer
```

Or install all three:

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-api-design
npx skills add albifhrzq/laravel-agent-skills --skill laravel-code-tracer
npx skills add albifhrzq/laravel-agent-skills --skill laravel-code-reviewer
```

## Manual Copy

```text
.agents/skills/laravel-api-design/
.agents/skills/laravel-code-tracer/
.agents/skills/laravel-code-reviewer/
```

## Agent Layout

```text
agents/
├── README.md
├── laravel-code-tracer/
│   └── SKILL.md
└── laravel-code-reviewer/
    └── SKILL.md
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
│       ├── laravel-api-design/
│       ├── laravel-code-tracer/
│       └── laravel-code-reviewer/
├── app/
├── routes/
└── tests/
```

## License

MIT
