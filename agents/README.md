# Laravel Agents

Specialized agents for Laravel projects.

These agents complement the reusable skills under `skills/`:

- `skills/laravel-api-design` provides Laravel 13 API design knowledge.
- `agents/laravel-code-tracer` traces execution flow through a Laravel codebase.
- `agents/laravel-code-reviewer` reviews Laravel code changes with evidence-based findings.

## Available Agents

| Agent | Purpose |
|---|---|
| `laravel-code-tracer` | Trace a Laravel request, command, job, event, listener, webhook, or scheduled task from entry point to exit. |
| `laravel-code-reviewer` | Review Laravel code changes for correctness, security, API contract stability, tests, performance, and production readiness. |

## Usage Principle

Use the tracer before implementing or reviewing complex behavior. Use the reviewer after implementation and before claiming completion.
