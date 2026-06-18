---
title: Ground Laravel API Changes in Official Laravel 13 Documentation
impact: CRITICAL
impactDescription: Laravel-specific guidance must follow the current framework documentation instead of generic API assumptions.
tags: laravel, api, documentation, context7, official-docs
---

# Ground Laravel API Changes in Official Laravel 13 Documentation

## Rule

Before changing Laravel API architecture, route registration, validation, resources, authorization, rate limiting, or tests, check the official Laravel 13 documentation. If Context7 is available in the coding agent environment, fetch the relevant Laravel docs through Context7 first.

## Recommended Lookup Order

1. Context7 Laravel docs, when available.
2. Official Laravel 13 docs at `laravel.com/docs/13.x`.
3. Project-level `AGENTS.md`, when it defines stricter local conventions.
4. Existing code patterns in the repository.

## Laravel 13 Docs to Prefer

- Routing: `https://laravel.com/docs/13.x/routing`
- Validation / FormRequest: `https://laravel.com/docs/13.x/validation`
- API Resources: `https://laravel.com/docs/13.x/eloquent-resources`
- Authorization: `https://laravel.com/docs/13.x/authorization`
- Rate Limiting: `https://laravel.com/docs/13.x/rate-limiting`
- HTTP Tests: `https://laravel.com/docs/13.x/http-tests`
- Sanctum: `https://laravel.com/docs/13.x/sanctum`

## Important Laravel 13 Notes

- API routes may be enabled with `php artisan install:api`, which installs Sanctum and creates `routes/api.php`.
- Routes in `routes/api.php` are stateless, assigned to the `api` middleware group, and automatically receive the `/api` URI prefix.
- The API prefix can be customized from `bootstrap/app.php` via routing configuration.
- Use FormRequest classes for complex validation and authorization-adjacent request checks.
- Use API Resources for transforming models and collections into stable JSON contracts.
- Define named rate limiters with Laravel's `RateLimiter` and attach them to routes via throttle middleware.

## Acceptance Criteria

When a rule is updated, it should either align with Laravel 13 documentation or explicitly state that it is a project-level convention layered on top of Laravel defaults.
