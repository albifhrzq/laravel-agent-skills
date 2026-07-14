# Events, Listeners, Broadcasting, Commands, and Scheduling

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

Use this reference for domain/application events, listeners, queued listeners, subscribers,
broadcast events and channel authorization, Artisan commands, scheduled commands/jobs/callbacks,
mutexes, one-server execution, and scheduler deployment. Inspect event discovery/registration,
queue and broadcast configuration, `routes/channels.php`, `routes/console.php`, cache topology,
timezones, and process supervision before changing flow.

Events communicate that something happened. They should not hide a required synchronous invariant
whose failure must roll back the caller unless that coupling is deliberate and tested.

## Verified Laravel 13 Behavior

- Events may be dispatched with the `event` helper, the `Event` facade, or an event class's
  dispatch support. Listeners may be discovered or registered according to application
  configuration.
- Listener dependencies are resolved by the service container. A listener implementing
  `ShouldQueue` is handled by the configured queue rather than synchronously.
- A queued listener can define connection, queue, delay, retries, backoff, middleware, and failure
  handling similarly to a job.
- Queued listeners dispatched inside database transactions can be configured for after-commit
  handling through the queue connection or the documented after-commit contract.
- `ShouldBroadcast` queues broadcasting; `ShouldBroadcastNow` uses the synchronous broadcast path.
  `broadcastOn` returns one or more channels.
- Private and presence channels require authorization callbacks. The callback determines whether
  the authenticated user may subscribe; client-supplied channel names are not authorization.
- `broadcastWith` controls event payload and `broadcastAs` controls the public event name.
- Schedules are commonly defined in `routes/console.php` with the `Schedule` facade or configured
  through the application bootstrap schedule hook.
- `withoutOverlapping` uses a cache lock; `onOneServer` elects one scheduler across servers using
  a shared lock-capable default cache store.
- A production scheduler normally invokes `php artisan schedule:run` every minute.
  `schedule:work` is useful for foreground/local execution.
- `schedule:list` displays configured tasks and their next run times.

## Correct Pattern

Keep an event immutable enough to describe a completed fact, queue slow listeners, and defer
database-dependent listeners until commit:

```php illustrative
use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;
use Illuminate\Foundation\Queue\Queueable;

final readonly class OrderConfirmed
{
    public function __construct(
        public int $orderId,
    ) {}
}

final class SendOrderConfirmation implements ShouldQueueAfterCommit
{
    use Queueable;

    public function handle(OrderConfirmed $event): void
    {
        $order = Order::query()->findOrFail($event->orderId);

        SendOrderConfirmationMail::dispatch($order->id);
    }
}
```

Broadcast the smallest client contract and authorize the private channel from server-side
ownership:

```php illustrative
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

final readonly class OrderStatusChanged implements ShouldBroadcast
{
    public function __construct(
        public int $orderId,
        public int $customerId,
        public string $status,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("customers.{$this->customerId}")];
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->orderId,
            'status' => $this->status,
        ];
    }
}

Broadcast::channel('customers.{customerId}', function (User $user, int $customerId): bool {
    return $user->id === $customerId;
});
```

Name scheduled tasks, bound their work, and select the overlap/server policy explicitly:

```php illustrative
use Illuminate\Support\Facades\Schedule;

Schedule::command('orders:expire-pending')
    ->name('orders:expire-pending')
    ->everyMinute()
    ->onOneServer()
    ->withoutOverlapping(10)
    ->runInBackground();
```

The command itself should be idempotent and process bounded chunks; scheduler locks do not make
the command's external effects exactly once.

## Incorrect Pattern

```php illustrative
// Leaks the full model and any newly serializable attributes to clients.
final class UserUpdated implements ShouldBroadcast
{
    public function __construct(public User $user) {}

    public function broadcastWith(): array
    {
        return $this->user->toArray();
    }
}

// Every server executes this and overlapping runs are possible.
Schedule::call(fn () => rebuildEverything())
    ->everyMinute();

// UI-provided channel ID is trusted without ownership authorization.
Broadcast::channel('orders.{orderId}', fn () => true);
```

Avoid event/listener cycles, synchronous remote calls hidden in listeners, and anonymous scheduled
closures that cannot be named, observed, or safely coordinated across servers.

## Failure Modes

- A listener is discovered and also registered manually, so it runs twice.
- A queued listener reads rows before the transaction that dispatched the event commits.
- A listener retry repeats a notification or external write.
- An event name or payload changes without coordinating browser/mobile consumers.
- A public channel exposes private tenant or user state.
- A private-channel callback checks authentication but not resource ownership.
- Broadcasting serializes an entire model and leaks hidden or newly added data.
- `ShouldBroadcastNow` adds request latency or fails the user request when the broadcaster is down.
- Every scheduler host runs the same task because the default cache is local.
- A scheduler lock outlives a crashed task and blocks expected runs.
- A task lasts longer than its overlap-lock expiry, allowing a second copy to start.
- Daylight-saving transitions skip or duplicate a timezone-specific schedule.
- `runInBackground` is used for an unsupported task shape or without process supervision/logging.
- The server cron exists, but workers, environment, path, or user differ from the application.

## Trade-offs

Synchronous listeners are simple and can participate in caller failure, but increase latency and
coupling. Queued listeners isolate slow work and failures while introducing eventual consistency,
delivery retries, and worker operations.

Broadcasting provides realtime UX but creates a public, versioned contract and an additional
authorization surface. Polling is less immediate but can be simpler and more resilient for low
frequency updates.

`withoutOverlapping` prevents concurrent runs of one named task; `onOneServer` prevents every
scheduler host from starting it. Using both is often appropriate, but both depend on shared cache
health and correctly sized lock leases.

## Version and Package Boundaries

- Confirm the installed Laravel version before using event, broadcast, or scheduler attributes and
  contracts from live documentation.
- Reverb, Pusher Channels, Ably, and other broadcast transports have separate packages,
  credentials, limits, client protocols, and deployment requirements.
- Redis/database queue timing affects queued listeners and broadcasts; inspect `after_commit` and
  worker configuration.
- `onOneServer` and `withoutOverlapping` require a shared lock-capable default cache store across
  scheduler hosts.
- Scheduler timezone behavior follows PHP/date-time and the configured application/task timezone;
  business-critical schedules should account for daylight-saving transitions.
- Horizon, Echo, Reverb, and frontend broadcast clients are package-specific and loaded only when
  detected or explicitly requested.

## Testing

- Use `Event::fake` narrowly to assert dispatch without hiding listeners that the test is meant to
  exercise.
- Test listeners directly for success, retry, duplicate delivery, missing models, and failure
  handling.
- Assert queued listener connection/queue and after-commit behavior at the transaction boundary.
- Test channel authorization for owner, another tenant, unauthenticated user, and hidden resource.
- Assert broadcast channel, name, and minimal payload without exposing sensitive fields.
- Run `schedule:list` in a smoke test and verify names, frequencies, environments, and timezones.
- Execute scheduled commands directly with representative data and repeated runs.
- Use two scheduler processes with the shared production-like cache to verify `onOneServer` and
  overlap behavior.
- Test task duration beyond normal runtime, lock expiration, crash recovery, and daylight-saving
  boundaries where applicable.
- Verify production cron, application path, user, environment, output logging, and queue workers.

## Grounding

Classification: `official` for Laravel event, listener, broadcasting, console, and scheduling
APIs; `derived` for contract design and operational scheduling guidance. Verified against the
pinned Laravel 13 sources and:

- https://laravel.com/docs/13.x/events
- https://laravel.com/docs/13.x/broadcasting
- https://laravel.com/docs/13.x/artisan
- https://laravel.com/docs/13.x/scheduling
- https://laravel.com/docs/13.x/queues
- https://laravel.com/docs/13.x/cache#atomic-locks

Transport delivery guarantees, websocket topology, cron supervision, and timezone behavior must
also be verified against the deployed services.
