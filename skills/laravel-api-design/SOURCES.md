# Sources and Grounding

This skill should be maintained against Laravel 13 documentation and project-level conventions.

## Runtime Lookup Rule

When an agent has Context7 MCP available, it should fetch Laravel docs from Context7 before changing Laravel-specific API behavior.

When Context7 is not available, use the official Laravel 13 docs directly.

## Key Laravel 13 Documentation

- Routing: https://laravel.com/docs/13.x/routing
- Validation / FormRequest: https://laravel.com/docs/13.x/validation
- API Resources: https://laravel.com/docs/13.x/eloquent-resources
- Authorization: https://laravel.com/docs/13.x/authorization
- Rate Limiting: https://laravel.com/docs/13.x/rate-limiting
- HTTP Tests: https://laravel.com/docs/13.x/http-tests
- Sanctum: https://laravel.com/docs/13.x/sanctum

## Important Laravel 13 API Routing Reminder

Do not blindly add an `api` prefix inside `routes/api.php`. With Laravel's documented API routing setup, routes in `routes/api.php` already receive the `/api` prefix.
