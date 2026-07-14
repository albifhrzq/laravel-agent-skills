<?php

declare(strict_types=1);

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;

require dirname(__DIR__).'/vendor/autoload.php';

$driver = $argv[1] ?? 'sqlite';

$connections = [
    'sqlite' => [
        'driver' => 'sqlite',
        'database' => ':memory:',
        'prefix' => '',
        'foreign_key_constraints' => true,
    ],
    'mysql' => [
        'driver' => 'mysql',
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'port' => (int) (getenv('DB_PORT') ?: 3306),
        'database' => getenv('DB_DATABASE') ?: 'laravel_skill',
        'username' => getenv('DB_USERNAME') ?: 'root',
        'password' => getenv('DB_PASSWORD') ?: 'secret',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
    ],
    'pgsql' => [
        'driver' => 'pgsql',
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'port' => (int) (getenv('DB_PORT') ?: 5432),
        'database' => getenv('DB_DATABASE') ?: 'laravel_skill',
        'username' => getenv('DB_USERNAME') ?: 'postgres',
        'password' => getenv('DB_PASSWORD') ?: 'secret',
        'charset' => 'utf8',
        'prefix' => '',
        'schema' => 'public',
    ],
];

if (! isset($connections[$driver])) {
    fwrite(STDERR, "Unsupported driver: {$driver}\n");
    exit(2);
}

$capsule = new Capsule;
$capsule->addConnection($connections[$driver]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

$connection = $capsule->getConnection();
$schema = $connection->getSchemaBuilder();

$schema->dropIfExists('skill_orders');
$schema->create('skill_orders', function (Blueprint $table): void {
    $table->id();
    $table->string('idempotency_key')->unique();
    $table->string('status');
    $table->timestamps();
});

$connection->transaction(function () use ($connection): void {
    $connection->table('skill_orders')->insert([
        'idempotency_key' => 'checkout-001',
        'status' => 'pending',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
});

$duplicateRejected = false;

try {
    $connection->table('skill_orders')->insert([
        'idempotency_key' => 'checkout-001',
        'status' => 'duplicate',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
} catch (QueryException) {
    $duplicateRejected = true;
}

if (! $duplicateRejected) {
    fwrite(STDERR, "Unique idempotency constraint was not enforced for {$driver}.\n");
    exit(1);
}

$record = $connection->table('skill_orders')->sole();

if ($record->status !== 'pending') {
    fwrite(STDERR, "Transaction result was not preserved for {$driver}.\n");
    exit(1);
}

$schema->drop('skill_orders');
fwrite(STDOUT, "Laravel 13 database fixture passed for {$driver}.\n");
