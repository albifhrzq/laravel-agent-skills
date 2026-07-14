# Laravel Boost, AI SDK, and MCP

## Contents

- [Applies To](#applies-to)
- [Verified Laravel 13 Behavior](#verified-laravel-13-behavior)
- [Correct Pattern](#correct-pattern)
- [Incorrect Pattern](#incorrect-pattern)
- [Failure Modes](#failure-modes)
- [Trade-offs](#trade-offs)
- [Version and Package Boundaries](#version-and-package-boundaries)
- [Testing](#testing)
- [Grounding](#grounding)

## Applies To

Use this reference when a Laravel project installs or explicitly requests Laravel Boost, the
Laravel AI SDK, or Laravel MCP. These are three distinct package surfaces:

- Boost improves AI-assisted development with project inspection, generated guidance, skills, and
  version-aware documentation search.
- The AI SDK adds runtime provider-agnostic agents, tools, media, embeddings, files, vector stores,
  and related application features.
- Laravel MCP lets an application expose or consume MCP tools, resources, prompts, and apps.

Inspect `composer.lock`, package configuration, generated agent files, routes, migrations, provider
credentials, and threat model. Do not install any of these packages merely because the application
uses Laravel 13.

## Verified Laravel 13 Behavior

- Boost installs as a development dependency with `composer require laravel/boost --dev` and is
  initialized with `php artisan boost:install`.
- Boost generates MCP configuration and agent guidance/skill files for selected coding agents.
  `boost:update` refreshes generated resources.
- Boost's `Search Docs` tool queries Laravel's hosted documentation service using detected package
  versions; it is preferred for exact installed-package syntax when available.
- Codex can register Boost manually with
  `codex mcp add laravel-boost -- php "artisan" "boost:mcp"` when automatic setup is unavailable.
- Context7 or the pinned official Laravel 13 source remains a documentation fallback and an
  independent freshness check; it does not replace project version detection.
- The AI SDK installs with `composer require laravel/ai`; publishing its provider creates
  configuration and migrations, including conversation-storage tables when those migrations run.
- `php artisan make:agent` creates an AI agent class. The package supports tools, structured output,
  streaming, queueing, provider options, files, embeddings, and test fakes.
- Agent classes support `fake` responses for tests, including structured responses.
- Laravel MCP installs with `composer require laravel/mcp`; publishing `ai-routes` creates
  `routes/ai.php`.
- `make:mcp-server`, `make:mcp-tool`, `make:mcp-prompt`, and `make:mcp-resource` generate MCP
  primitives. Servers register with `Mcp::web` for HTTP transport or `Mcp::local` for Artisan/local
  transport.
- MCP tool inputs, prompt arguments, and access still require validation, authentication,
  authorization, rate limiting, and safe error handling appropriate to their exposure.

## Correct Pattern

Use Boost first as a read-only grounding aid: detect versions, query exact documentation, inspect
routes/configuration, and compare generated guidance changes before accepting them. Project code,
tests, and valid conventions retain precedence.

Fake AI responses in automated tests and validate application behavior independently of provider
availability:

```php illustrative
use App\Ai\Agents\SalesCoach;
use Laravel\Ai\Prompts\AgentPrompt;

SalesCoach::fake(function (AgentPrompt $prompt): string {
    return str_contains($prompt->prompt, 'quarter')
        ? 'Focus on retained revenue.'
        : 'Ask for a reporting period.';
});

$response = (new SalesCoach)->prompt('Review this quarter.');
```

Register the smallest MCP exposure. Do not expose `Mcp::web` until the application proves a
compatible bearer-token or OAuth guard is installed and configured. The official Laravel MCP
authentication paths are Sanctum bearer tokens through `auth:sanctum`, Passport OAuth 2.1 through
`auth:api`, or a deliberately implemented custom Authorization-header middleware. OAuth 2.1 is
the most broadly interoperable MCP option. If none is available, keep the capability local with
`Mcp::local` and stop to design authentication before adding a web transport.

Define the named limiter before attaching it:

```php illustrative
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('mcp-web', function (Request $request): Limit {
    $identity = $request->user()?->getAuthIdentifier() ?? $request->ip();

    return Limit::perMinute(30)->by('mcp:'.$identity);
});
```

Then protect the server route with the detected guard. For an application that already has
Sanctum token authentication configured, the client must send an `Authorization: Bearer ...`
header:

```php illustrative
use App\Mcp\Servers\SupportServer;
use Laravel\Mcp\Facades\Mcp;

Mcp::web('/mcp/support', SupportServer::class)
    ->middleware(['auth:sanctum', 'throttle:mcp-web']);

Mcp::local('support', SupportServer::class);
```

For a configured Passport installation, register the MCP OAuth discovery/client routes and use
`auth:api` instead. Do not add Sanctum or Passport merely to copy an example. `routes/ai.php` does
not by itself establish Laravel's browser `web` middleware stack, session, cookie, or CSRF
boundary. A user-requested cookie-session MCP design therefore needs an explicit, version-matched
web/session/CSRF architecture and transport tests; never treat bare `auth` as proof that it exists.

Route authentication establishes an actor; it does not authorize every tool or
resource. Resolve a narrowly scoped record inside each capability and enforce
its policy before returning or mutating data:

```php illustrative
<?php

namespace App\Mcp\Tools;

use App\Models\Ticket;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Gate;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

class ShowTicketTool extends Tool
{
    public function handle(Request $request): Response
    {
        $validated = $request->validate([
            'ticket_id' => ['required', 'integer'],
        ]);

        $ticket = Ticket::query()->findOrFail($validated['ticket_id']);
        Gate::authorize('view', $ticket);

        return Response::text(json_encode([
            'id' => $ticket->getKey(),
            'status' => $ticket->status,
        ], JSON_THROW_ON_ERROR));
    }

    /** @return array<string, \Illuminate\JsonSchema\Types\Type> */
    public function schema(JsonSchema $schema): array
    {
        return [
            'ticket_id' => $schema->integer()
                ->description('The authorized ticket identifier to retrieve.')
                ->required(),
        ];
    }
}
```

Describe tools precisely, define narrow schemas, validate input again at the system boundary, apply
policies to selected records, bound output size, and return only data the caller may access. Treat
model/tool output as untrusted input before database writes, commands, URLs, or rendered HTML.

## Incorrect Pattern

```php illustrative
// Unsafe: model text becomes a shell command.
Process::run($agent->prompt($request->string('task'))->text);

// Unsafe: unauthenticated remote tool exposes arbitrary records.
Mcp::web('/mcp/admin', AdminServer::class);

// Fragile: live provider calls make the feature suite slow and nondeterministic.
$result = (new SalesCoach)->prompt('Always call the paid provider in tests.');
```

Do not place provider keys in prompts, generated guidance, tool output, MCP metadata, logs, or
committed configuration. Do not let prompt instructions override authorization, validation,
tenant isolation, or external-action approval.

## Failure Modes

- Boost detects a package but generated guidance conflicts with an intentional project convention.
- Running `boost:install` or `boost:update` overwrites or adds agent files without reviewing the diff.
- An agent uses live current docs for a different package major than `composer.lock`.
- AI provider credentials or base URLs are missing, exposed, or cached incorrectly.
- A provider response violates the expected structured schema or contains unsafe content.
- Tool calls create duplicate charges, messages, or writes after retry.
- Conversation, file, embedding, or vector-store data violates retention or tenant boundaries.
- Prompt injection persuades a tool to read unrelated records or disclose hidden instructions.
- An MCP web route lacks authentication, capability authorization, rate limiting, or transport TLS.
- A local MCP server inherits broader workstation credentials than the task needs.
- Tool schemas are broad, descriptions are ambiguous, or errors leak internal data.
- Provider and MCP tests pass only when external paid services are reachable.

## Trade-offs

Boost improves documentation retrieval and project awareness but adds generated artifacts and a
local inspection surface. The AI SDK provides one Laravel-native abstraction across providers but
cannot erase differences in model capability, billing, latency, moderation, retention, or tool
semantics. Laravel MCP accelerates protocol integration while expanding the application's attack
surface.

Local MCP transport is convenient for developer tools and inherits local trust. Web transport
supports remote clients but needs production-grade identity, authorization, rate limiting, and
monitoring. Structured output reduces parsing ambiguity but still requires domain validation.

## Version and Package Boundaries

- Confirm `laravel/boost`, `laravel/ai`, and `laravel/mcp` independently in `composer.lock`.
- Boost belongs in development dependencies and is not the runtime AI SDK.
- Provider capabilities and options vary; use only features supported by the selected provider and
  installed AI SDK version.
- Web MCP authentication uses an installed bearer-token/custom Authorization-header guard or
  Passport OAuth 2.1. Do not infer Sanctum or Passport from MCP alone, and do not infer a browser
  session stack from `routes/ai.php` or bare `auth` middleware.
- Boost documentation coverage lists its own supported package versions; that list is not a claim
  that those packages are compatible with each other.
- Install or deeply configure these packages only when detected or explicitly requested.

## Testing

- Use Boost read-only inspection and `Search Docs` during development; verify generated-file diffs
  after install/update.
- Use agent, image, audio, embedding, file, and vector-store fakes supplied by the AI SDK for fast
  deterministic tests.
- Assert structured schema validation, tool authorization, timeout, failover, retry/idempotency,
  quota, moderation, and provider error behavior.
- Test prompt-injection attempts and cross-tenant record references as authorization cases.
- Use Laravel MCP test helpers and the MCP Inspector in a controlled environment.
- Test local and web registration separately, including unauthenticated, unauthorized, throttled,
  malformed, oversized, duplicate, and successful requests.
- Keep paid/live-provider smoke tests opt-in, budget-bounded, secret-protected, and outside ordinary
  pull-request determinism.
- Review logs, stored conversations, tool arguments, and outputs for secrets and regulated data.

## Grounding

Classification: `package-specific`. Verified against official Laravel 13 package documentation:

- https://laravel.com/docs/13.x/boost
- https://laravel.com/docs/13.x/ai
- https://laravel.com/docs/13.x/ai-sdk
- https://laravel.com/docs/13.x/mcp
- https://laravel.com/docs/13.x/testing
- https://laravel.com/docs/13.x/authorization
- https://laravel.com/docs/13.x/rate-limiting

Use Boost's version-aware `Search Docs`, Context7 `/laravel/docs/__branch__13.x`, and the pinned
official source lock to verify exact APIs while keeping the detected project version authoritative.
