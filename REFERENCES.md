# Source Baseline

The machine-readable baseline is `skills/laravel-13/source-lock.json`. As verified on 2026-07-13:

- Laravel 13 documentation: `6d8246ff751a299421520660979cc34a2b255bc9`
- Root documentation inventory: 103 pages, SHA-256 `80822e8acfd0bb3c63046975c5cbea0633e92caf24f189d7cec772af64aeafd2`
- Laravel Framework: `v13.19.0`, `514502b38e11bd676ecf83b271c9452cc7500f16`
- Laravel application skeleton: `43f3606336468af53f85aa6c993ce72041c63a61`
- Context7 library: `/laravel/docs/__branch__13.x`

Primary entry points:

- https://laravel.com/docs/13.x
- https://github.com/laravel/docs/tree/13.x
- https://github.com/laravel/framework/tree/13.x
- https://github.com/laravel/laravel/tree/13.x

Installed project code and version remain the first source for a target repository. Live primary sources are freshness checks against the reproducible lock. `npm run check:source-drift` verifies locked integrity, the newest stable `v13.*` tag, and the page inventory directly from the pinned Git tree.
