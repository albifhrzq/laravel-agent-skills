# Laravel Workflow Agents

The read-only `laravel-code-tracer` and `laravel-code-reviewer` agents are generated from their canonical files in `skills/` by `npm run build:workflows`.

Both require the `laravel-13` master skill, resolve the installed version from `composer.lock` first, route to relevant references, and preserve a visible `Laravel grounding:` footer.
