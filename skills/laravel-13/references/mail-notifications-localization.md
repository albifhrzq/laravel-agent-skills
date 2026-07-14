# Mail, Notifications, and Localization

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

Use this reference for mailables, notification channels, queued delivery, per-recipient locale,
translation files, fallback language, and delivery testing. Inspect `config/mail.php`,
`config/queue.php`, `config/app.php`, the notifiable model, and installed notification-channel
packages before choosing APIs.

Separate domain events from delivery representations. A business event may fan out to mail,
database, broadcast, SMS, or another channel, while each channel has its own availability,
latency, credentials, and user-preference rules.

## Verified Laravel 13 Behavior

- Mailables encapsulate envelope, content, and attachments and may be generated with Artisan.
- A mailable that implements `ShouldQueue` is queued even when sent with `Mail::send`.
- Calling `afterCommit` prevents queued mail from running before an open database transaction is
  committed when the queue connection is not globally configured for that behavior.
- Notifications choose channels through `via`. Implementing `ShouldQueue` queues delivery;
  Laravel creates a queued job for each recipient and channel combination.
- `viaConnections`, `viaQueues`, delays, and notification middleware can customize queued delivery.
- The `Notifiable` trait routes built-in channels; `routeNotificationFor...` methods can override
  channel addresses.
- Notification locale can be set explicitly with `locale`, and a notifiable model may implement
  `HasLocalePreference` so queued notifications retain the preferred locale.
- Language files live under `lang/{locale}` after publishing the language directory. JSON
  translation files support strings used as their own keys.
- `__`, `trans`, and pluralization helpers resolve translated strings using the configured locale
  and fallback locale.
- Mail and notification fakes provide delivery assertions without contacting a transport.

## Correct Pattern

Create a queued notification with channel choice and locale driven by project state. Dispatch it
after the transaction that made the notification meaningful has committed.

```php illustrative
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Invoice;

final class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Invoice $invoice,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Invoice paid'))
            ->line(__('Your payment has been received.'))
            ->action(__('View invoice'), route('invoices.show', $this->invoice));
    }
}
```

Use a locale that belongs to the recipient, not the worker process. Keep the selected locale with
queued work through the notification locale API or `HasLocalePreference`.

```php illustrative
$user->notify(
    (new InvoicePaid($invoice))
        ->locale($user->preferred_locale)
        ->afterCommit()
);
```

Keep translations semantic and parameterized:

```php illustrative
$message = trans_choice(
    'invoices.overdue_count',
    $count,
    ['count' => $count],
    $user->preferred_locale,
);
```

## Incorrect Pattern

```php illustrative
// Fragile: sends within a transaction and assumes the row is already visible to a worker.
DB::transaction(function () use ($user, $invoice) {
    $invoice->markPaid();
    Mail::to($user)->queue(new InvoicePaidMail($invoice));
});

// Wrong recipient semantics: locale leaks from global mutable process state.
App::setLocale($request->input('locale'));
$user->notify(new InvoicePaid($invoice));

// Unmaintainable: channel credentials and recipient addresses are hardcoded.
Notification::route('mail', 'ops@example.invalid')->notify(new FailureNotice($secret));
```

Avoid putting secrets, access tokens, full payment data, or internal exception traces into mail,
notification payloads, database notification JSON, or provider metadata. Do not assume a queued
message has been delivered merely because dispatch succeeded.

## Failure Modes

- A worker renders a mailable before the surrounding transaction commits and cannot find data.
- A queued message serializes stale or oversized model graphs.
- A notification is delivered twice after retry because downstream delivery is not idempotent.
- One failing channel delays another because all channels share one queue and retry policy.
- The `from` address is rejected by the mail provider or does not match an authenticated domain.
- Markdown mail references an unpublished or missing component/theme.
- Attachments read a local path that is absent on the queue worker.
- A translated key is missing and the fallback string appears unexpectedly.
- A JSON translation key conflicts with a PHP translation filename.
- The recipient locale is unavailable, invalid, or not preserved by queued work.
- Database notifications grow without a retention policy.
- A fake is enabled globally and hides malformed transport configuration in deployment validation.

## Trade-offs

Mailables provide a focused email abstraction; notifications provide multi-channel fan-out and
recipient routing. Database notifications improve in-app history but require storage, indexing,
read-state behavior, and retention. Queued delivery improves request latency but introduces
eventual consistency and requires continuously supervised workers.

String-as-key JSON translations are convenient for small interfaces. Named PHP keys are easier to
organize, pluralize, review, and evolve in larger products. Choose one project convention and
avoid mixing styles without a reason.

## Version and Package Boundaries

- Mail transports and third-party notification channels may need additional Composer packages and
  provider configuration.
- Slack, SMS, push, and other community channels have contracts outside Laravel core; read the
  installed package version's primary documentation.
- Queue behavior depends on the configured connection and worker deployment.
- Starter-kit account notifications may be implemented by Fortify or another installed package;
  preserve those extension points instead of duplicating them.
- Do not add a channel, localization package, or provider SDK unless already detected or explicitly
  requested by the user.

## Testing

- Use `Mail::fake` and assert the intended mailable, recipient, queueing state, and relevant data.
- Use `Notification::fake` and `assertSentTo`, `assertNothingSent`, or on-demand routing assertions.
- Test that transaction rollback produces no delivery and successful commit dispatches once.
- Test every supported locale, fallback behavior, interpolation, pluralization, and HTML escaping.
- Exercise a real sandbox transport outside unit tests when headers, attachments, templates, or
  provider-specific behavior are business-critical.
- Test queue retry, permanent failure, timeouts, and idempotent handling.
- Verify that database notifications expose only authorized, non-sensitive fields and that cleanup
  behavior is covered.

## Grounding

Classification: `official` for framework APIs and `derived` for delivery operations.
Verified against Laravel 13 documentation:

- https://laravel.com/docs/13.x/mail
- https://laravel.com/docs/13.x/notifications
- https://laravel.com/docs/13.x/localization
- https://laravel.com/docs/13.x/queues
- https://laravel.com/docs/13.x/testing

For non-core notification channels, also verify the installed channel package and the provider's
current delivery contract.
