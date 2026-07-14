# Testing and Quality

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

Use this reference for Laravel unit, feature, HTTP, console, database, queue, event, mail,
notification, filesystem, and browser testing. Apply it when implementing behavior, fixing bugs,
reviewing regressions, or choosing the smallest test layer that proves an externally meaningful
outcome.

Read `phpunit.xml`, `tests/TestCase.php`, Composer scripts, factories, database configuration,
frontend test configuration, and CI before introducing a tool or convention. Follow the project's
Pest or PHPUnit style; neither test runner should be replaced solely by preference.

## Verified Laravel 13 Behavior

- Laravel applications support Pest or PHPUnit and conventionally separate `tests/Unit` from
  `tests/Feature`.
- `php artisan test` runs the configured PHP test suite and forwards supported runner options.
- Laravel boots the application for tests extending the project `Tests\TestCase`; plain unit tests
  need not boot the framework.
- The default test environment is controlled by `phpunit.xml`; cached configuration should be
  cleared before relying on changed test environment values.
- HTTP tests simulate requests internally and provide status, header, JSON, session, view, and
  validation assertions without opening a real network server.
- `RefreshDatabase` manages database state between tests. Its transaction/migration behavior
  depends on migration state and connection support.
- Model factories create or make test models and can express reusable states and relationships.
- Laravel supplies fakes for events, queues, buses, mail, notifications, storage, HTTP calls, and
  other framework boundaries.
- Console tests can execute Artisan commands and assert output, questions, tables, and exit codes.
- Time, exceptions, authentication, sessions, and container bindings have test helpers.
- Parallel test execution is available but may require the documented ParaTest dependency and
  parallel-safe external resources.
- Browser testing is a distinct layer with its own runtime and package/tool requirements.

## Correct Pattern

Start a behavior change with a focused failing test, make the smallest implementation pass, then
refactor while preserving the same evidence. Assert outcomes rather than private call sequences.

```php runnable
<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class SlugTest extends TestCase
{
    public function test_it_normalizes_words_for_a_url(): void
    {
        $slug = strtolower(str_replace(' ', '-', trim('  Laravel Skill  ')));

        self::assertSame('laravel-skill', $slug);
    }
}
```

Use a feature test when behavior crosses routing, middleware, validation, authorization, model,
or response boundaries:

```php illustrative
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('an owner can update a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->for($user)->create();

    $this->actingAs($user)
        ->put(route('posts.update', $post), ['title' => 'Revised'])
        ->assertRedirect(route('posts.show', $post));

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'title' => 'Revised',
    ]);
});
```

Use narrow fakes and pair action assertions with outcome assertions. For example, assert that a
job was dispatched and separately test the job's database or integration behavior.

## Incorrect Pattern

```php illustrative
// Brittle: tests a controller's private implementation instead of observable behavior.
$controller = Mockery::mock(PostController::class)->makePartial();
$controller->shouldReceive('normalizePayload')->once();

// Dangerous: disables every middleware, hiding authentication, CSRF, bindings, and throttling.
$this->withoutMiddleware()->post('/admin/delete-everything')->assertOk();

// Weak: status alone does not prove the intended state transition.
$this->post('/orders')->assertSuccessful();
```

Avoid production services, real mail delivery, unfaked outbound HTTP calls, shared mutable fixtures,
sleep-based timing, and assertions that pass when the expected code path never ran.

## Failure Modes

- A newly written test is green before implementation because it does not exercise the missing
  behavior.
- A test fails from broken setup, syntax, or missing dependency rather than the intended defect.
- SQLite behavior hides MySQL or PostgreSQL differences in constraints, locking, JSON, or SQL.
- Transactional tests cannot observe after-commit callbacks as expected.
- Parallel workers collide on files, ports, caches, queues, buckets, or external identifiers.
- A broad fake prevents listeners, jobs, or notifications that the test meant to exercise.
- Test order affects state because static caches, locale, time, or singleton bindings are not reset.
- Factories create unrealistic data and bypass important invariants.
- Snapshot assertions accept accidental contract changes without review.
- Coverage rises while authorization, failure paths, and concurrency remain untested.
- Browser tests depend on CSS selectors or arbitrary sleeps and become flaky.
- Cached configuration makes the suite use a database or credential different from `phpunit.xml`.

## Trade-offs

Unit tests are fast and precise for pure logic but cannot prove framework wiring. Feature tests
provide higher confidence for Laravel behavior with more setup and database cost. Browser tests
cover real user flows but are slower and require a browser/build environment.

Fakes improve isolation and failure determinism but can diverge from a provider contract. A small
number of sandbox or container-backed integration tests complements, rather than replaces, fast
application tests. Coverage is a diagnostic floor, not proof of useful assertions.

## Version and Package Boundaries

- Detect whether the project uses Pest, PHPUnit, Dusk, a browser plugin, ParaTest, Mockery, or
  another package before prescribing syntax.
- Pest and PHPUnit major versions have different attributes, configuration schemas, and plugin
  compatibility.
- Database behavior should be verified on each production database engine for driver-sensitive
  code.
- Queue, cache, Redis, filesystem, search, and browser tests may need service containers or package-
  specific fakes.
- Do not install a test runner, browser harness, or assertion package unless it is detected or
  explicitly requested.

## Testing

For every change, cover the success path, validation boundary, unauthenticated and unauthorized
paths, missing resources, conflicts, provider/queue failures, and relevant concurrency behavior.

Use this verification ladder:

1. Run the narrow test target and confirm the intended pre-implementation failure.
2. Run the same target after implementation and confirm it passes.
3. Run nearby feature and integration tests.
4. Run the complete PHP suite.
5. Run static analysis, formatting checks, frontend tests, and production asset build configured by
   the repository.
6. Run database and browser matrices when the changed behavior depends on them.

Record commands, exit status, and skipped environments. Do not claim a check passed when it was not
run or when it exited early without executing tests.

## Grounding

Classification: `official` for Laravel testing APIs and `project-convention` for the quality gate.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/testing
- https://laravel.com/docs/13.x/http-tests
- https://laravel.com/docs/13.x/database-testing
- https://laravel.com/docs/13.x/console-tests
- https://laravel.com/docs/13.x/mocking
- https://laravel.com/docs/13.x/browser-tests

Runner- and package-specific APIs must also be checked against the versions locked by Composer.
