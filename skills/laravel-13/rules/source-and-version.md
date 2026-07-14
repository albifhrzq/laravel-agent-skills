# Source and Version Resolution

Resolve the installed framework version before selecting framework APIs. `composer.lock` is stronger evidence than `composer.json`; runtime and installed source can confirm the result. [claim:VERSION-DETECT]

Use the project's installed source and tests first. Use `source-lock.json` for the reproducible Laravel 13 baseline, then Boost, Context7, or live official docs for freshness.

If the project is not on Laravel 13, report the mismatch and switch to version-matched evidence. Do not backport or upgrade implicitly.
