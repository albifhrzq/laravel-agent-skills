# Security Baseline

Validate untrusted input at the boundary, authorize the specific action and resource, preserve CSRF protection for browser-session state changes, parameterize database access, constrain uploads, verify webhook authenticity, and avoid exposing secrets or sensitive model attributes.

Laravel 13 uses `PreventRequestForgery` as its request-forgery middleware; older CSRF middleware names are deprecated aliases. [claim:L13-CSRF]

The default Laravel 13 application controller does not provide `$this->authorize()` automatically. Prefer `Gate::authorize()`, controller authorization attributes, or explicitly add and document the required trait. [claim:AUTHZ-DEFAULT]
