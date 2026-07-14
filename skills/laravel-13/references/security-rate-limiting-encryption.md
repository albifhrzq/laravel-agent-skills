# Laravel 13 Security, Rate Limiting, Encryption, and Hashing

## Contents

- Identify trust boundaries before changing code.
- Validate, authorize, constrain, and safely serialize untrusted data.
- Apply rate limits with stable, privacy-conscious keys.
- Distinguish hashing, encryption, signing, and redaction.
- Verify failure behavior without exposing sensitive information.

## Applies To

Use this reference for sensitive endpoints, secrets, credentials, tokens,
personal data, database input, model writes, raw HTML, encryption, hashing,
signed values, rate limiting, login abuse, webhook abuse, and error disclosure.

Also load the domain-specific reference for sessions, uploads, webhooks,
database queries, authentication, or serialization.

Security is an end-to-end property; one Laravel helper does not secure an
otherwise incomplete flow.

## Verified Laravel 13 Behavior

Laravel validation rejects inputs that do not satisfy declared rules.

Authorization gates and policies can deny a concrete action with an HTTP 403
response.

Query Builder and Eloquent bind normal query values. Raw SQL expressions require
separate scrutiny.

Blade `{{ }}` escapes output through `htmlspecialchars`. Raw `{!! !!}` output
does not provide that protection.

Laravel's encrypter uses OpenSSL and signs encrypted values with a message
authentication code so modified ciphertext cannot be decrypted silently.

The `Crypt` facade provides `encryptString` and `decryptString` for strings.

The `Hash` facade provides secure password hashing, verification, and rehash
checks.

Hashing is one-way and is appropriate for passwords.

Encryption is reversible by an application holding its key and is appropriate
only when plaintext recovery is required.

Laravel rate limiters can be defined with `RateLimiter::for(...)` and attached
through throttle middleware.

Limit keys can be scoped by authenticated user, IP address, or another stable
application identifier.

Laravel returns HTTP 429 when a request exceeds an attached route rate limit.

Laravel's exception and logging systems can attach context, but application code
controls whether sensitive values are included.

## Correct Pattern

Define named limits with unambiguous keys:

```php runnable
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('account-actions', function (Request $request): Limit {
    $key = $request->user()
        ? 'user:'.$request->user()->getAuthIdentifier()
        : 'ip:'.$request->ip();

    return Limit::perMinute(20)->by($key);
});
```

Attach the named limiter to the narrow route group it protects:

```php illustrative
Route::middleware(['auth', 'throttle:account-actions'])
    ->group(function (): void {
        Route::post('/account/email', UpdateEmailController::class);
    });
```

Use layered limits for expensive or abuse-prone flows when the installed
framework syntax is verified, such as a short burst limit and a longer account
limit.

Hash passwords:

```php illustrative
use Illuminate\Support\Facades\Hash;

$user->forceFill([
    'password' => Hash::make($plainPassword),
])->save();

if (Hash::needsRehash($user->password)) {
    // Rehash after a successful credential verification.
}
```

Encrypt recoverable sensitive strings only when the data model requires
recovery:

```php illustrative
use Illuminate\Support\Facades\Crypt;

$ciphertext = Crypt::encryptString($externalReference);
$plaintext = Crypt::decryptString($ciphertext);
```

When rotating `APP_KEY`, deploy the new key together with the previous keys so
existing ciphertext and encrypted cookies remain decryptable during the
transition:

```dotenv illustrative
APP_KEY=base64:current-key-material
APP_PREVIOUS_KEYS="base64:previous-key-one,base64:previous-key-two"
```

Laravel always encrypts with the current key and attempts the configured
`APP_PREVIOUS_KEYS` only while decrypting. Remove an old key only after the
application has re-encrypted or expired every value that still depends on it.
Treat every listed key as a secret and coordinate rotation across all running
instances.

Keep secrets in environment-backed configuration or an approved secret manager.

Return safe client messages while logging a sanitized diagnostic identifier and
server-side context.

Use explicit field selection for mass writes and explicit resource transforms
for responses.

Allowlist raw SQL identifiers and order directions; bind data values.

Use escaped Blade output for untrusted data.

Verify webhook signatures against the raw body before transforming the payload
in a way that changes signed bytes.

## Incorrect Pattern

```php illustrative
$user->update($request->all());

$rows = DB::select(
    "select * from users order by {$request->input('sort')}"
);

return response()->json([
    'exception' => $exception->getMessage(),
]);
```

The example combines unbounded mass assignment, raw identifier injection, and
sensitive error disclosure.

Do not encrypt passwords.

Do not hash values that the application later needs to recover.

Do not use one global rate-limit key for all users.

Do not use only an IP key for authenticated high-value actions when account
scoping is available.

Do not expose `APP_KEY`, API tokens, authorization headers, cookies, reset
tokens, encryption plaintext, SQL, or stack traces.

Do not rely on hidden UI controls for authorization.

Do not output user-controlled HTML with raw Blade syntax.

Do not disable CSRF, signature checks, validation, or throttling to resolve one
failing integration.

Do not claim an encrypted database field is safe from an attacker who also
obtains the application key.

## Failure Modes

- A limiter key collides between user IDs and IP strings.
- A reverse proxy makes every request appear to come from one IP.
- A distributed deployment uses a non-shared limiter store.
- An endpoint dispatches expensive work before its rate limit or authorization.
- Error logs contain request bodies, credentials, or personal data.
- A raw SQL fragment accepts a client-provided column or direction.
- Model serialization exposes hidden internal or personal fields.
- Ciphertext becomes undecryptable after an uncoordinated key change.
- `APP_PREVIOUS_KEYS` is removed before old ciphertext or cookies have expired.
- A decryption exception is returned verbatim to the client.
- A password is hashed twice.
- Login messages reveal whether an email account exists.
- Raw Blade output enables stored or reflected XSS.
- A signed webhook is parsed or normalized before signature verification.
- A security test disables the middleware it intends to prove.

Model the attacker, protected asset, trust boundary, failure impact, and
recovery plan before choosing a control.

## Trade-offs

Stricter rate limits reduce abuse but can block legitimate users behind shared
networks.

Account-scoped limits are precise after authentication; IP limits still help
before identity is established.

Encryption protects data at rest from some exposures but adds key-management
and query limitations.

Hashing protects passwords from recovery but cannot support plaintext use
cases.

Detailed server logs accelerate diagnosis but increase privacy and secret
exposure risk.

Generic client errors protect internals but require correlation IDs or
structured server logs for support.

Raw SQL can express driver-specific features but increases review and
portability cost.

## Version and Package Boundaries

This reference uses Laravel 13 core validation, authorization, encryption,
hashing, query binding, Blade escaping, logging, and rate limiting.

Limiter storage behavior depends on the configured cache backend and deployment
topology.

Authentication packages may register their own limits and response contracts.

Web application firewalls, CDN limits, proxy trust, and infrastructure secrets
are outside Laravel core but can change observed behavior.

Database encryption extensions and searchable-encryption packages have
independent guarantees.

Package-specific security guidance is loaded only when that package is detected
or explicitly requested.

## Testing

Test each protected action as guest, wrong user, correct user, and privileged
user when applicable.

Assert rate-limit success below the threshold, HTTP 429 above it, and isolation
between limiter keys.

Test proxy-aware IP behavior in an environment matching production.

Test encryption round trips and modified ciphertext failure without exposing the
secret in test output.

Test key rotation by encrypting with the old key, booting with a new current key
and `APP_PREVIOUS_KEYS`, proving decryption succeeds, then proving it fails after
the previous key is intentionally retired.

Test `Hash::check` and rehash behavior with the project's configured driver.

Test invalid raw-query sort and filter inputs against an allowlist.

Assert logs and JSON errors omit credentials, tokens, SQL, paths, and sensitive
payloads.

Test Blade rendering of hostile input and assert it is escaped.

Run dependency and secret scanning appropriate to the repository before release.

Use focused feature tests rather than relying only on unit tests of individual
helpers.

## Grounding

- Authorization:
  https://laravel.com/docs/13.x/authorization
- Validation:
  https://laravel.com/docs/13.x/validation
- Rate limiting:
  https://laravel.com/docs/13.x/rate-limiting
- Encryption:
  https://laravel.com/docs/13.x/encryption
- Graceful key rotation:
  https://laravel.com/docs/13.x/encryption#gracefully-rotating-encryption-keys
- Hashing:
  https://laravel.com/docs/13.x/hashing
- Query Builder:
  https://laravel.com/docs/13.x/queries
- Blade escaping:
  https://laravel.com/docs/13.x/blade
- Error handling and logging:
  https://laravel.com/docs/13.x/errors
  https://laravel.com/docs/13.x/logging

Framework capabilities are `official`. Threat models, limit thresholds,
redaction policy, retention, and incident response are `project-convention` or
`derived-security` decisions.
