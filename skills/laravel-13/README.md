# Laravel 13 Master Skill

Install the canonical Laravel 13 skill:

```bash
npx skills add albifhrzq/laravel-agent-skills --skill laravel-13
```

The skill applies to Laravel backend, API, database, session and CSRF, queues, testing, deployment, Blade, Vite, core UI, and installed first-party packages. It resolves the project version and conventions before applying Laravel 13 defaults.

Optional workflow skills `laravel-code-tracer` and `laravel-code-reviewer` depend on this master skill. Install them only in addition to `laravel-13`.

Detailed knowledge is loaded progressively from `rules/` and `references/`. `source-lock.json`, `coverage-map.json`, `provenance.json`, and `routing-map.json` make grounding and routing auditable.
