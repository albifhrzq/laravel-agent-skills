---
title: Design JWT Authentication Lifecycle Explicitly
impact: CRITICAL
impactDescription: JWT APIs need clear guard, expiry, refresh, invalidation, and error behavior.
tags: laravel, api, jwt, auth, lifecycle, guards
---

# Design JWT Authentication Lifecycle Explicitly

## Rule

When a Laravel API uses JWT, define the complete authentication lifecycle instead of only adding a login endpoint. The agent must check the project-selected JWT package and its documentation before changing auth behavior.

## Package Selection

Common Laravel JWT approaches include:

- `tymon/jwt-auth` or maintained forks for guard-based Laravel JWT authentication.
- `lcobucci/jwt` when the project needs lower-level JWT creation and validation primitives.
- External identity providers that issue JWTs and expose public signing keys.

Do not mix JWT packages or guards without an explicit migration plan.

## Required Design Decisions

Document these before implementing JWT auth:

- Which Laravel guard is used.
- Access credential lifetime.
- Refresh strategy and refresh lifetime.
- Whether invalidation or blacklist behavior is supported.
- Logout behavior: current session only or all sessions.
- Claims strategy: subject, issuer, audience, issued-at, expiry, not-before, unique ID, and custom claims.
- How roles, permissions, or abilities are represented.
- How expired, invalid, missing, and revoked credentials map to API error responses.
- Whether the API is consumed by mobile apps, SPA, server-to-server clients, or external providers.

## Laravel Guidance

- Keep JWT auth routes under the same API versioning strategy as the rest of the API.
- Keep JWT route groups separate from Sanctum or session-auth route groups unless the project explicitly supports both.
- Use dedicated FormRequest classes for login and refresh requests.
- Rate-limit login, refresh, password reset, and other auth-sensitive endpoints separately.
- Convert JWT failures into the project error envelope.
- Combine authentication with policies/gates; JWT validation is not authorization.
- For external JWT providers, validate issuer, audience, expiry, signature, and key rotation behavior.

## Test Matrix

JWT API tests should cover:

- Login success and failure.
- Authenticated user lookup.
- Expired credential.
- Invalid credential.
- Missing credential.
- Revoked or invalidated credential.
- Refresh success and refresh failure.
- Logout or invalidation behavior.
- Forbidden access when authenticated but unauthorized.

## Avoid

- Issuing credentials without expiry.
- Logging JWT values or auth headers.
- Returning different response shapes for login, refresh, and logout without documenting the contract.
- Trusting role or permission claims without considering stale permissions.
- Treating refresh as a normal authenticated endpoint without defining expired-credential behavior.

## Acceptance Criteria

A JWT implementation is acceptable when guard configuration, lifetime, refresh behavior, logout/invalidation, error mapping, rate limits, and feature tests are all explicit and aligned with the selected JWT package documentation.
