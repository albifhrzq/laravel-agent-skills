<?php

declare(strict_types=1);

namespace LaravelAgentSkills\Tests\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\File;
use RuntimeException;

final class SecurityPrimitives
{
    /**
     * Validate URL syntax, the exact host allow-list, and trusted resolver answers.
     *
     * This is only a preflight filter. Production callers must repeat the check for every
     * redirect and enforce the connected address plus network egress policy.
     */
    public static function passesOutboundUrlPrefilter(
        string $url,
        array $allowedHosts,
        array $resolvedAddresses,
    ): bool
    {
        $parts = parse_url($url);

        if (
            ! is_array($parts)
            || strtolower((string) ($parts['scheme'] ?? '')) !== 'https'
            || ! isset($parts['host'])
            || isset($parts['user'])
            || isset($parts['pass'])
            || isset($parts['fragment'])
            || (isset($parts['port']) && $parts['port'] !== 443)
        ) {
            return false;
        }

        $normalizeHost = static function (string $host): string {
            $normalized = strtolower(rtrim($host, '.'));

            return str_starts_with($normalized, '[') && str_ends_with($normalized, ']')
                ? substr($normalized, 1, -1)
                : $normalized;
        };
        $host = $normalizeHost((string) $parts['host']);
        $allowlist = array_map(
            $normalizeHost,
            $allowedHosts,
        );

        if (! in_array($host, $allowlist, true)) {
            return false;
        }

        if ($resolvedAddresses === []) {
            return false;
        }

        $normalizedAddresses = array_map(
            static fn (string $address): string => $normalizeHost($address),
            $resolvedAddresses,
        );
        $literalHost = filter_var($host, FILTER_VALIDATE_IP);
        if ($literalHost !== false && ! in_array($host, $normalizedAddresses, true)) {
            return false;
        }

        foreach ($normalizedAddresses as $normalizedAddress) {
            if (filter_var(
                $normalizedAddress,
                FILTER_VALIDATE_IP,
                FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE,
            ) === false) {
                return false;
            }
        }

        return true;
    }

    public static function storePrivatePdf(UploadedFile $upload): string
    {
        Validator::validate(
            ['document' => $upload],
            [
                'document' => [
                    'required',
                    File::types(['application/pdf'])
                        ->extensions(['pdf'])
                        ->max('64kb'),
                ],
            ],
        );

        $path = $upload->storeAs(
            'quarantine',
            Str::uuid()->toString().'.pdf',
            ['disk' => 'private', 'visibility' => 'private'],
        );

        if (! is_string($path) || $path === '') {
            throw new RuntimeException('The validated upload could not be stored.');
        }

        return $path;
    }

    public static function validWebhookSignature(
        string $payload,
        ?string $providedSignature,
        ?string $secret,
    ): bool {
        if (
            $secret === null ||
            trim($secret) === '' ||
            $providedSignature === null ||
            preg_match('/\Asha256=[0-9a-f]{64}\z/D', $providedSignature) !== 1
        ) {
            return false;
        }

        $expectedSignature = 'sha256='.hash_hmac('sha256', $payload, $secret);

        return hash_equals($expectedSignature, $providedSignature);
    }

    public static function validTimestampedWebhookSignature(
        string $payload,
        ?string $providedSignature,
        ?string $secret,
        ?int $timestamp,
        int $now,
        int $toleranceSeconds = 300,
    ): bool {
        if (
            $timestamp === null
            || $toleranceSeconds < 0
            || abs($now - $timestamp) > $toleranceSeconds
        ) {
            return false;
        }

        return self::validWebhookSignature(
            $timestamp.'.'.$payload,
            $providedSignature,
            $secret,
        );
    }
}
