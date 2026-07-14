<?php

declare(strict_types=1);

namespace LaravelAgentSkills\Tests;

use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\QueryException;
use Illuminate\Encryption\Encrypter as LaravelEncrypter;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use LaravelAgentSkills\Tests\Support\SecurityPrimitives;
use Orchestra\Testbench\TestCase;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

final class SecurityBoundariesTest extends TestCase
{
    protected function defineEnvironment($app): void
    {
        $app['config']->set('app.key', 'base64:'.base64_encode(random_bytes(32)));
        $app['config']->set('cache.default', 'array');
        $app['config']->set('database.default', 'sqlite');
        $app['config']->set('database.connections.sqlite', [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
        ]);
        $app['config']->set('filesystems.disks.private', [
            'driver' => 'local',
            'root' => storage_path('framework/testing/disks/private'),
            'throw' => true,
            'visibility' => 'private',
        ]);
        $app['config']->set('hashing.driver', 'bcrypt');
        $app['config']->set('hashing.bcrypt.rounds', 4);
        $app['config']->set('session.driver', 'array');
    }

    public function test_csrf_middleware_rejects_an_invalid_token_when_verification_is_forced_during_tests(): void
    {
        $session = $this->newSession();
        $request = $this->postRequestWithSession($session, 'invalid-token');
        $middleware = $this->csrfMiddleware();

        $this->expectException(TokenMismatchException::class);

        $middleware->handle($request, static fn (): Response => new Response(status: 204));
    }

    public function test_csrf_middleware_accepts_the_session_token_when_verification_is_forced_during_tests(): void
    {
        $session = $this->newSession();
        $request = $this->postRequestWithSession($session, $session->token());

        $response = $this->csrfMiddleware()->handle(
            $request,
            static fn (): Response => new Response(status: 204),
        );

        $this->assertSame(204, $response->getStatusCode());
    }

    public function test_session_regeneration_rotates_both_the_identifier_and_csrf_token(): void
    {
        $session = $this->newSession();
        $session->put('user_id', 42);
        $previousId = $session->getId();
        $previousToken = $session->token();

        $this->assertTrue($session->regenerate(destroy: true));

        $this->assertNotSame($previousId, $session->getId());
        $this->assertNotSame($previousToken, $session->token());
        $this->assertSame(42, $session->get('user_id'));
    }

    public function test_gate_allows_only_the_document_owner(): void
    {
        $owner = new FixtureUser(7);
        $stranger = new FixtureUser(8);
        $document = new FixtureDocument(ownerId: 7);
        $gate = $this->app->make(GateContract::class);
        $gate->define(
            'update-document',
            static fn (FixtureUser $user, FixtureDocument $target): bool => $user->id === $target->ownerId,
        );

        $this->assertTrue($gate->forUser($owner)->allows('update-document', $document));
        $this->assertFalse($gate->forUser($stranger)->allows('update-document', $document));
    }

    public function test_private_download_requires_resource_authorization(): void
    {
        Storage::fake('private');
        Storage::disk('private')->put('documents/opaque-id.pdf', 'confidential');
        $owner = new FixtureUser(7);
        $stranger = new FixtureUser(8);
        $document = new FixtureDocument(ownerId: 7);
        $gate = $this->app->make(GateContract::class);
        $gate->define(
            'download-document',
            static fn (FixtureUser $user, FixtureDocument $target): bool => $user->id === $target->ownerId,
        );

        $gate->forUser($owner)->authorize('download-document', $document);
        $response = Storage::disk('private')->download('documents/opaque-id.pdf', 'document.pdf');
        $this->assertSame(200, $response->getStatusCode());

        $this->expectException(AuthorizationException::class);
        $gate->forUser($stranger)->authorize('download-document', $document);
    }

    public function test_private_pdf_upload_is_validated_renamed_and_stored_privately(): void
    {
        Storage::fake('private');
        $upload = $this->realUploadedFile(
            'customer-supplied-name.pdf',
            "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
        );

        try {
            $path = SecurityPrimitives::storePrivatePdf($upload);
        } finally {
            $this->removeTemporaryUpload($upload);
        }

        Storage::disk('private')->assertExists($path);
        $this->assertSame('private', Storage::disk('private')->visibility($path));
        $this->assertMatchesRegularExpression(
            '/\Aquarantine\/[0-9a-f-]{36}\.pdf\z/',
            $path,
        );
        $this->assertStringNotContainsString('customer-supplied-name', $path);
    }

    public function test_private_upload_rejects_disguised_executable_content(): void
    {
        Storage::fake('private');
        $upload = $this->realUploadedFile(
            'invoice.pdf',
            '<?php echo "not a PDF";',
        );

        try {
            SecurityPrimitives::storePrivatePdf($upload);
            $this->fail('Executable content disguised as a PDF was accepted.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('document', $exception->errors());
        } finally {
            $this->removeTemporaryUpload($upload);
        }
    }

    public function test_private_upload_rejects_a_pdf_with_the_wrong_extension_or_excessive_size(): void
    {
        Storage::fake('private');
        $wrongExtension = $this->realUploadedFile('invoice.txt', "%PDF-1.4\n%%EOF");
        $oversized = $this->realUploadedFile(
            'oversized.pdf',
            "%PDF-1.4\n".str_repeat('0', 65 * 1024)."\n%%EOF",
        );

        foreach ([$wrongExtension, $oversized] as $upload) {
            try {
                SecurityPrimitives::storePrivatePdf($upload);
                $this->fail('An upload outside the PDF validation policy was accepted.');
            } catch (ValidationException $exception) {
                $this->assertArrayHasKey('document', $exception->errors());
            } finally {
                $this->removeTemporaryUpload($upload);
            }
        }
    }

    public function test_webhook_hmac_verification_fails_closed_and_accepts_only_a_valid_signature(): void
    {
        $payload = '{"event":"invoice.paid"}';
        $fixtureSigningKey = 'fixture-webhook-signing-key';
        $validSignature = 'sha256='.hash_hmac('sha256', $payload, $fixtureSigningKey);

        $this->assertFalse(SecurityPrimitives::validWebhookSignature($payload, $validSignature, null));
        $this->assertFalse(SecurityPrimitives::validWebhookSignature($payload, $validSignature, ''));
        $this->assertFalse(SecurityPrimitives::validWebhookSignature($payload, $validSignature, '   '));
        $this->assertFalse(SecurityPrimitives::validWebhookSignature($payload, null, $fixtureSigningKey));
        $this->assertFalse(SecurityPrimitives::validWebhookSignature($payload, 'sha256=invalid', $fixtureSigningKey));
        $this->assertFalse(SecurityPrimitives::validWebhookSignature($payload.'tampered', $validSignature, $fixtureSigningKey));
        $this->assertTrue(SecurityPrimitives::validWebhookSignature($payload, $validSignature, $fixtureSigningKey));
    }

    public function test_timestamped_webhook_rejects_replay_windows_and_uses_durable_unique_receipts(): void
    {
        Schema::create('webhook_receipts', function (Blueprint $table): void {
            $table->id();
            $table->string('provider', 64);
            $table->string('event_id', 191);
            $table->timestamp('received_at');
            $table->unique(['provider', 'event_id']);
        });
        $payload = '{"id":"evt_123","event":"invoice.paid"}';
        $fixtureSigningKey = 'fixture-webhook-signing-key';
        $now = 1_750_000_000;
        $signature = 'sha256='.hash_hmac('sha256', $now.'.'.$payload, $fixtureSigningKey);

        $this->assertTrue(SecurityPrimitives::validTimestampedWebhookSignature(
            $payload, $signature, $fixtureSigningKey, $now, $now,
        ));
        $this->assertFalse(SecurityPrimitives::validTimestampedWebhookSignature(
            $payload, $signature, $fixtureSigningKey, $now, $now + 301,
        ));
        $this->assertFalse(SecurityPrimitives::validTimestampedWebhookSignature(
            $payload, $signature, $fixtureSigningKey, $now, $now - 301,
        ));
        try {
            $this->assertTrue(DB::table('webhook_receipts')->insert([
                'provider' => 'partner',
                'event_id' => 'evt_123',
                'received_at' => now(),
            ]));

            try {
                DB::table('webhook_receipts')->insert([
                    'provider' => 'partner',
                    'event_id' => 'evt_123',
                    'received_at' => now(),
                ]);
                $this->fail('The database accepted a duplicate provider and event identifier.');
            } catch (QueryException $exception) {
                $this->assertSame('23000', $exception->getCode());
            }

            $this->assertTrue(DB::table('webhook_receipts')->insert([
                'provider' => 'other-partner',
                'event_id' => 'evt_123',
                'received_at' => now(),
            ]));
        } finally {
            Schema::dropIfExists('webhook_receipts');
        }
    }

    public function test_outbound_url_prefilter_rejects_unsafe_syntax_hosts_and_dns_answers(): void
    {
        $allowed = ['api.partner.test'];

        $this->assertTrue(SecurityPrimitives::passesOutboundUrlPrefilter(
            'https://api.partner.test/orders/42',
            $allowed,
            ['93.184.216.34'],
        ));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter('http://api.partner.test', $allowed, ['93.184.216.34']));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter('https://api.partner.test:8443', $allowed, ['93.184.216.34']));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter('https://user@api.partner.test', $allowed, ['93.184.216.34']));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter('https://api.partner.test.evil.test', $allowed, ['93.184.216.34']));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter('https://api.partner.test', $allowed, []));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter('https://api.partner.test', $allowed, ['127.0.0.1']));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter('https://api.partner.test', $allowed, ['::1']));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter('https://api.partner.test', $allowed, ['fe80::1']));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter(
            'https://169.254.169.254/latest/meta-data',
            [...$allowed, '169.254.169.254'],
            ['169.254.169.254'],
        ));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter(
            'https://127.0.0.1/',
            [...$allowed, '127.0.0.1'],
            ['93.184.216.34'],
        ));
        $this->assertFalse(SecurityPrimitives::passesOutboundUrlPrefilter(
            'https://[::1]/',
            [...$allowed, '::1'],
            ['::1'],
        ));
    }

    public function test_rate_limiter_blocks_requests_after_the_configured_threshold(): void
    {
        $key = 'login:203.0.113.10';
        RateLimiter::clear($key);

        $this->assertSame('first', RateLimiter::attempt($key, 2, static fn (): string => 'first', 60));
        $this->assertSame('second', RateLimiter::attempt($key, 2, static fn (): string => 'second', 60));
        $this->assertFalse(RateLimiter::attempt($key, 2, static fn (): string => 'third', 60));
        $this->assertTrue(RateLimiter::tooManyAttempts($key, 2));
        $this->assertSame(0, RateLimiter::remaining($key, 2));
    }

    public function test_encryption_rejects_tampering_and_hashing_verifies_without_storing_plaintext(): void
    {
        $plaintext = 'sensitive fixture value';
        $ciphertext = Crypt::encryptString($plaintext);
        $passwordHash = Hash::make('correct horse battery staple');

        $this->assertNotSame($plaintext, $ciphertext);
        $this->assertSame($plaintext, Crypt::decryptString($ciphertext));
        $this->assertNotSame('correct horse battery staple', $passwordHash);
        $this->assertTrue(Hash::check('correct horse battery staple', $passwordHash));
        $this->assertFalse(Hash::check('wrong password', $passwordHash));

        $this->expectException(DecryptException::class);

        Crypt::decryptString(substr($ciphertext, 0, -1).'x');
    }

    public function test_encryption_key_rotation_decrypts_with_previous_keys_only(): void
    {
        $oldKey = random_bytes(32);
        $newKey = random_bytes(32);
        $oldEncrypter = new LaravelEncrypter($oldKey, 'aes-256-cbc');
        $rotatedEncrypter = (new LaravelEncrypter($newKey, 'aes-256-cbc'))
            ->previousKeys([$oldKey]);
        $oldCiphertext = $oldEncrypter->encryptString('created before rotation');

        $this->assertSame('created before rotation', $rotatedEncrypter->decryptString($oldCiphertext));
        $this->assertSame([$oldKey], $rotatedEncrypter->getPreviousKeys());
        $newCiphertext = $rotatedEncrypter->encryptString('created after rotation');

        try {
            $oldEncrypter->decryptString($newCiphertext);
            $this->fail('The retired key decrypted ciphertext created with the current key.');
        } catch (DecryptException) {
            $this->assertSame('created after rotation', $rotatedEncrypter->decryptString($newCiphertext));
        }
    }

    private function csrfMiddleware(): ForcedCsrfVerification
    {
        return new ForcedCsrfVerification(
            $this->app,
            $this->app->make(Encrypter::class),
        );
    }

    private function newSession(): Store
    {
        $session = new Store('fixture-session', new ArraySessionHandler(minutes: 120));
        $session->start();

        return $session;
    }

    private function postRequestWithSession(Store $session, string $token): Request
    {
        $request = Request::create('/fixture', 'POST', ['_token' => $token]);
        $request->setLaravelSession($session);

        return $request;
    }

    private function realUploadedFile(string $name, string $content): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'laravel-skill-upload-');

        if ($path === false || file_put_contents($path, $content) === false) {
            throw new RuntimeException('Unable to create the upload test fixture.');
        }

        return new UploadedFile(
            $path,
            $name,
            'application/pdf',
            UPLOAD_ERR_OK,
            true,
        );
    }

    private function removeTemporaryUpload(UploadedFile $upload): void
    {
        $path = $upload->getPathname();

        if (is_file($path) && ! unlink($path)) {
            throw new RuntimeException('Unable to remove the upload test fixture.');
        }
    }
}

final class ForcedCsrfVerification extends PreventRequestForgery
{
    protected $addHttpCookie = false;

    protected function runningUnitTests()
    {
        return false;
    }
}

final readonly class FixtureUser
{
    public function __construct(public int $id) {}
}

final readonly class FixtureDocument
{
    public function __construct(public int $ownerId) {}
}
