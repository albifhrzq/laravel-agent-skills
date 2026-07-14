# Search, Vector Similarity, Reranking, and Scout

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

Use this reference for keyword search, database full-text indexes, semantic search, PostgreSQL
`pgvector`, embeddings, cosine-distance queries, retrieve-then-rerank pipelines, and Laravel Scout.
It covers search behavior implemented by the Laravel 13 framework and the separate Laravel AI SDK
and Scout packages.

Resolve the actual search stack before changing code:

1. Inspect `composer.lock`, not only `composer.json`, for `laravel/framework`, `laravel/ai`,
   `laravel/scout`, and database-driver packages.
2. Inspect the configured database connection, production database version, enabled extensions,
   existing indexes, column dimensions, model casts, and representative execution plans.
3. Trace authentication, authorization policies, global scopes, tenant scopes, soft deletes, and
   visibility rules before building the retrieval query.
4. Inspect AI provider, model, dimensions, caching, data-retention, rate-limit, and billing
   configuration before generating embeddings or reranking documents.
5. Inspect Scout's selected engine, searchable attributes, filters, queue configuration, and index
   synchronization path when Scout is installed.

Choose the smallest search surface that satisfies the product requirement:

| Requirement | Prefer | Important boundary |
| --- | --- | --- |
| Exact substring on a small bounded set | Escaped `LIKE` or ordinary builder filters | No stemming or relevance ranking |
| Ranked keyword retrieval | Native full-text index plus `whereFullText` | MariaDB, MySQL, or PostgreSQL only |
| Meaning-based retrieval | PostgreSQL vector column plus vector query APIs | Requires `pgvector`; embeddings normally require `laravel/ai` |
| Improve a bounded candidate set | AI SDK reranking | Sends candidate text to an AI provider |
| Keep Eloquent search state synchronized | Scout | Separate `laravel/scout` package |
| Typo tolerance, facets, or geo-search at scale | Scout third-party engine | External index and eventual consistency |

Do not add `laravel/ai`, Scout, a database extension, or an external search service merely because
Laravel 13 documents it. Introduce a dependency only when the project already has it or the user
explicitly requests the capability and accepts its migration, security, cost, and operational
effects.

## Verified Laravel 13 Behavior

### Full-text search

- Laravel 13 supports `whereFullText` and `orWhereFullText` on MariaDB, MySQL, and PostgreSQL.
  SQLite and SQL Server are not supported by these full-text builder methods.
- `$table->fullText('body')` creates a full-text index. An array creates a composite full-text
  index, and the query should use the same indexed column set where the database requires it.
- PostgreSQL full-text indexes can specify a language with
  `$table->fullText('body')->language('english')`.
- On MariaDB and MySQL, the query grammar generates `MATCH (...) AGAINST (...)`. Natural-language
  mode is the default; the pinned source also supports the `boolean` mode and query expansion
  options.
- On PostgreSQL, the query grammar generates a `to_tsvector(...) @@ ...tsquery(...)` predicate.
  The pinned source defaults to the `english` configuration and supports `plain`, `phrase`,
  `websearch`, and raw tsquery modes through the query options.
- The PostgreSQL index language and query language must describe the same analysis strategy.
  A mismatch can change stemming and prevent the functional index from serving the query.
- MariaDB and MySQL full-text queries are automatically ordered by relevance in Laravel's Search
  guidance. PostgreSQL `whereFullText` filters matches but does not automatically add relevance
  ordering.
- Full-text search is not interchangeable with `%term%`. It has database-specific tokenization,
  minimum-word, stop-word, language, collation, and ranking behavior.

The public builder signature is:

```php illustrative
whereFullText(
    string|array $columns,
    string $value,
    array $options = [],
    string $boolean = 'and',
)
```

The options are engine-specific. Do not pass a MySQL boolean-mode contract to PostgreSQL or expose
PostgreSQL raw tsquery syntax as an ordinary user search field without designing and testing that
syntax explicitly.

### PostgreSQL vector storage and queries

- Laravel's framework-level vector distance queries are supported only on PostgreSQL connections.
  The pinned framework throws `RuntimeException` for vector distance queries on other connection
  types.
- PostgreSQL must have the `pgvector` extension installed and the migration role must be permitted
  to enable it. `Schema::ensureVectorExtensionExists()` issues a create-if-missing operation.
- `$table->vector('embedding', dimensions: 1536)` creates a vector column with the declared
  dimension count. The dimension must match every embedding stored in that column.
- Chaining `->index()` on a vector column creates an HNSW index using cosine distance in the pinned
  PostgreSQL grammar. The source-level `$table->vectorIndex(...)` API can add that index to an
  existing vector column.
- Cast an Eloquent vector attribute to `array` so Laravel converts between PHP arrays and the
  database vector representation.
- `whereVectorSimilarTo` uses cosine similarity, filters against a minimum similarity, and orders
  nearest results first unless `order: false` is passed.
- In pinned Laravel Framework v13.19.0, `whereVectorSimilarTo` has a default
  `minSimilarity` of `0.6`. Pass the threshold explicitly so behavior does not depend on a default
  that documentation summaries or later framework versions may describe differently.
- The builder does not validate an HTTP parameter as a finite number between `0.0` and `1.0`.
  Validate and bound external thresholds before calling the query method.
- A string vector argument invokes `Stringable::toEmbeddings(cache: true)`. That convenience path
  requires the Laravel AI SDK and a configured embedding provider; it also hides an external call
  or cache lookup inside query construction.
- Supplying a correctly sized numeric array avoids generating an embedding inside the query
  method. It does not remove the need to establish how that embedding was produced and versioned.

Pinned v13.19.0 exposes these vector query methods:

| Method | Behavior |
| --- | --- |
| `whereVectorSimilarTo($column, $vector, $minSimilarity = 0.6, $order = true)` | Filters by cosine similarity and optionally orders nearest first |
| `whereVectorDistanceLessThan($column, $vector, $maxDistance, $boolean = 'and')` | Adds a maximum cosine-distance predicate |
| `orWhereVectorDistanceLessThan($column, $vector, $maxDistance)` | Adds the distance predicate with `or` |
| `selectVectorDistance($column, $vector, $as = null)` | Selects the computed cosine distance |
| `orderByVectorDistance($column, $vector)` | Orders by ascending cosine distance |

`whereVectorSimilarTo` converts similarity to distance with `1 - $minSimilarity`. Its default
ordering is useful for nearest-neighbor retrieval. Set `order: false` only when a deliberate
secondary ordering or a separately selected distance defines the result contract.

### Embeddings and reranking

- `Str::of($text)->toEmbeddings()` and `Laravel\Ai\Embeddings` belong to the separate `laravel/ai`
  package, not to a bare Laravel framework installation.
- `Embeddings::for([...])->generate()` batches multiple inputs into one provider operation. The
  AI SDK supports selecting dimensions, provider, and model.
- Embedding dimensions are part of the persisted-data contract. Changing provider, model, or
  dimension can require a parallel column and a complete re-embedding migration.
- AI SDK embedding caching is configurable. When enabled globally, current Laravel 13 docs state
  that embeddings are cached for 30 days and the cache key includes provider, model, dimensions,
  and input content.
- `Laravel\Ai\Reranking::of([...])->rerank($query)` reorders documents and returns ranked records
  containing the original index, document, and score.
- Laravel collections receive a `rerank` macro from the AI SDK. It accepts a field name, multiple
  fields, or a closure that produces the document text, plus the query and an optional limit.
- Reranking does not pre-index content. It sends the selected candidate text and query to the
  configured provider at request time unless an application-level cache or queue changes that
  flow.
- Reranking is a second-stage tool. It should receive a bounded candidate set produced by an
  authorized first-stage query, not an unbounded Eloquent collection.

### Scout

- Laravel Scout is the separate `laravel/scout` package. Its `Searchable` trait registers model
  observers that keep non-database search indexes synchronized with Eloquent changes.
- Scout's `database` engine supports MySQL and PostgreSQL. It searches the database table directly
  and requires no separate import/index synchronization step.
- The database engine uses `LIKE` by default. `SearchUsingPrefix` changes selected attributes to
  prefix matching, and `SearchUsingFullText` uses full-text constraints for columns that already
  have compatible full-text indexes.
- Scout's database engine automatically orders by relevance, including on PostgreSQL, where direct
  `whereFullText` does not add relevance ordering.
- Scout's `collection` engine retrieves candidate records and filters them in PHP. It is portable
  to SQLite and SQL Server but is intended only for tests, prototypes, or a few hundred records.
- Third-party Scout engines such as Algolia, Meilisearch, and Typesense maintain external indexes
  and add engine-specific configuration for filters, facets, typo tolerance, geo-search, and
  ranking.
- For third-party engines, Scout's `query(...)` callback runs after matching IDs have already been
  returned by the search engine. It is not a valid security or tenant filter; use Scout search
  `where` constraints backed by configured filterable fields.
- For the database engine, `query(...)` constraints are applied directly to the database query and
  may filter results. Keep portable security constraints in the search query contract instead of
  relying on driver-specific timing.

## Correct Pattern

### 1. Define the search contract before selecting an engine

Write down:

- searchable fields and language;
- whether substring, stemming, semantic similarity, or typo tolerance is required;
- authorization and tenant predicates that must be applied before ranking;
- maximum query length, candidate count, result count, latency, and cost;
- stable tie-breaking and pagination behavior;
- freshness expectations after create, update, and delete;
- accepted degradation when the AI provider or external search engine is unavailable.

Use production-like data and the production database engine to confirm the decision. SQLite tests
cannot validate MariaDB/MySQL/PostgreSQL full-text or PostgreSQL vector behavior.

### 2. Create matching full-text indexes and queries

Use the same PostgreSQL language for the index and query:

```php illustrative
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('articles', function (Blueprint $table): void {
    $table->fullText(
        ['title', 'body'],
        'articles_title_body_fulltext',
    )->language('english');
});
```

Validate the public input, authorize the collection, apply tenant visibility before search, and
make PostgreSQL ordering explicit:

```php illustrative
use App\Models\Article;
use Illuminate\Support\Facades\Gate;

$validated = $request->validate([
    'query' => ['required', 'string', 'min:2', 'max:500'],
    'limit' => ['sometimes', 'integer', 'between:1,50'],
]);

$user = $request->user();

Gate::authorize('viewAny', Article::class);

$articles = Article::query()
    ->select(['id', 'tenant_id', 'title', 'summary', 'published_at'])
    ->where('tenant_id', $user->tenant_id)
    ->where('status', 'published')
    ->whereFullText(
        ['title', 'body'],
        $validated['query'],
        ['language' => 'english', 'mode' => 'websearch'],
    )
    // PostgreSQL whereFullText filters but does not rank automatically.
    ->orderByDesc('published_at')
    ->orderByDesc('id')
    ->limit($validated['limit'] ?? 20)
    ->get();
```

If relevance ordering is a requirement on PostgreSQL, choose Scout's database engine or implement
and test a PostgreSQL-specific ranking expression with bound values. Label an engine-specific raw
ranking expression as project-derived SQL rather than a portable Laravel behavior.

For MariaDB/MySQL boolean mode, expose a separate validated product contract instead of silently
reinterpreting the same query syntax on PostgreSQL:

```php illustrative
$articles = Article::query()
    ->where('tenant_id', $user->tenant_id)
    ->whereFullText(
        ['title', 'body'],
        $validated['query'],
        ['mode' => 'boolean'],
    )
    ->limit(20)
    ->get();
```

### 3. Establish PostgreSQL vector prerequisites explicitly

For a new table, enable the extension before the vector column and make the dimensions visible in
the migration:

```php illustrative
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::ensureVectorExtensionExists();

Schema::create('documents', function (Blueprint $table): void {
    $table->id();
    $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('content');
    $table->string('embedding_model')->nullable();
    $table->unsignedSmallInteger('embedding_dimensions')->nullable();
    $table->string('embedding_version', 64)->nullable();
    $table->vector('embedding', dimensions: 1536)->nullable()->index();
    $table->timestamps();

    $table->index(['tenant_id', 'id']);
});
```

The model/provider metadata columns are a derived production pattern, not mandatory Laravel
columns. They make stale or incompatible embeddings diagnosable and allow a backfill to select
only records that need the current embedding version.

Use a staged rollout for an existing high-volume table:

1. Confirm `pgvector` installation and migration-role privileges outside the deploy window.
2. Add a nullable vector column and model/version metadata without changing the read path.
3. Deploy code that writes embeddings for new or changed searchable content.
4. Backfill existing rows in bounded, idempotent queue jobs using batched embedding requests.
5. Verify dimensions, null rate, provider errors, and tenant distribution.
6. Build the HNSW index using the database's safe online procedure.
7. Enable vector reads behind a reversible feature flag and compare result quality and latency.
8. Make the column non-null only if the business contract truly requires it and the operational
   evidence proves every write path can satisfy that constraint.

Pinned source exposes an explicit vector-index command for an existing column:

```php illustrative
Schema::table('documents', function (Blueprint $table): void {
    $table->vectorIndex(
        'embedding',
        'documents_embedding_vector_index',
    )->online();
});
```

On PostgreSQL, `online()` compiles to `CREATE INDEX CONCURRENTLY`. PostgreSQL schema migrations are
transactional by default in Laravel, while concurrent index creation cannot run inside a
transaction. Put an online index operation in its own migration and deliberately set that
migration's `$withinTransaction = false` after verifying the exact framework and database
behavior. Do not combine it with unrelated schema changes.

Do not automatically drop the shared `vector` extension in `down()`. Other application tables may
depend on it. Roll back only the index and column owned by the migration unless the extension's
ownership is proven and coordinated.

### 4. Cast vectors and generate versioned embeddings

Cast the vector attribute to an array:

```php illustrative
use Illuminate\Database\Eloquent\Model;

final class Document extends Model
{
    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'embedding' => 'array',
        ];
    }
}
```

Batch embedding generation and make the persisted dimensions explicit:

```php illustrative
use Laravel\Ai\Embeddings;

$inputs = $documents->map(
    fn (Document $document): string => $document->title."\n\n".$document->content,
)->all();

$response = Embeddings::for($inputs)
    ->dimensions(1536)
    ->cache(seconds: 3600)
    ->generate();

$documents->values()->each(
    function (Document $document, int $index) use ($response): void {
        $document->forceFill([
            'embedding' => $response->embeddings[$index],
            'embedding_dimensions' => 1536,
            'embedding_version' => 'knowledge-v1',
        ])->save();
    },
);
```

The example illustrates the Laravel AI SDK API. Production backfills should also:

- persist the exact provider/model identifier used by the project;
- validate that every embedding is an array of the expected finite numeric dimension;
- make each batch retry-safe and avoid saving partial provider responses as complete;
- dispatch after the searchable database write commits;
- avoid emitting document text, embeddings, or provider credentials to logs;
- respect provider batch, token, rate, and spending limits.

### 5. Apply authorization constraints before vector ranking

Validate the threshold and result limit. Authorize the collection and apply record visibility in
SQL before computing the nearest results:

```php illustrative
use App\Models\Document;
use Illuminate\Support\Facades\Gate;
use Laravel\Ai\Embeddings;

$validated = $request->validate([
    'query' => ['required', 'string', 'min:2', 'max:500'],
    'min_similarity' => ['sometimes', 'numeric', 'between:0,1'],
    'limit' => ['sometimes', 'integer', 'between:1,50'],
]);

$user = $request->user();

Gate::authorize('viewAny', Document::class);

$embeddingResponse = Embeddings::for([$validated['query']])
    ->dimensions(1536)
    ->cache(seconds: 3600)
    ->generate();

$queryEmbedding = $embeddingResponse->embeddings[0];
$minSimilarity = (float) ($validated['min_similarity'] ?? 0.6);

$documents = Document::query()
    ->select(['id', 'tenant_id', 'owner_id', 'title', 'summary'])
    ->where('tenant_id', $user->tenant_id)
    ->where(function ($query) use ($user): void {
        $query->where('visibility', 'tenant')
            ->orWhere('owner_id', $user->getAuthIdentifier());
    })
    ->whereNotNull('embedding')
    ->whereVectorSimilarTo(
        'embedding',
        $queryEmbedding,
        minSimilarity: $minSimilarity,
        order: true,
    )
    ->limit($validated['limit'] ?? 10)
    ->get();
```

Adapt the visibility predicate to the project's real policy. `viewAny` alone does not prove every
row is visible. A policy check after retrieving a cross-tenant top-K set is too late: it can leak
data through timing or metadata and causes authorized rows to be displaced by forbidden rows.

For lower-level distance control, select and order the same bounded query vector:

```php illustrative
$documents = Document::query()
    ->select(['id', 'tenant_id', 'title'])
    ->where('tenant_id', $user->tenant_id)
    ->whereNotNull('embedding')
    ->selectVectorDistance('embedding', $queryEmbedding, as: 'distance')
    ->whereVectorDistanceLessThan(
        'embedding',
        $queryEmbedding,
        maxDistance: 0.3,
    )
    ->orderByVectorDistance('embedding', $queryEmbedding)
    ->limit(10)
    ->get();
```

Use an explicit selected alias only for output that the API contract needs. Do not serialize the
stored embedding merely because it is cast to an array.

### 6. Retrieve, then rerank a bounded authorized set

Use fast retrieval to narrow the corpus before sending content to a reranker:

```php illustrative
use App\Models\Article;

$candidates = Article::query()
    ->select(['id', 'tenant_id', 'title', 'body'])
    ->where('tenant_id', $user->tenant_id)
    ->where('status', 'published')
    ->whereFullText(['title', 'body'], $validated['query'])
    ->limit(50)
    ->get();

$ranked = $candidates->rerank(
    fn (Article $article): string => $article->title."\n\n".$article->body,
    $validated['query'],
    limit: 10,
);
```

Only authorized candidate content reaches the provider. Keep the original Eloquent identity and
map reranker indexes back to records deterministically. Define behavior for duplicate documents,
missing scores, provider timeouts, and fewer results than requested.

On PostgreSQL, direct `whereFullText` does not automatically rank the first-stage candidates. If
candidate quality depends on relevance, use Scout's database engine or a verified PostgreSQL
ranking query before reranking.

### 7. Keep Scout filtering engine-side

When a third-party Scout engine is present, include tenant and visibility fields in the searchable
document and configure them as filterable in that engine:

```php illustrative
$orders = Order::search($validated['query'])
    ->where('tenant_id', $user->tenant_id)
    ->whereIn('status', ['open', 'paid'])
    ->paginate(20);
```

Do not replace those constraints with a post-search Eloquent callback for a third-party engine.
Use `query(...)` there for eager loading or other non-filtering customization after matching IDs
are known.

For the Scout database engine, annotate only columns that have the required indexes:

```php illustrative
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;

final class Article extends Model
{
    use Searchable;

    #[SearchUsingPrefix(['id'])]
    #[SearchUsingFullText(['title', 'body'])]
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->getKey(),
            'tenant_id' => $this->tenant_id,
            'title' => $this->title,
            'body' => $this->body,
        ];
    }
}
```

Do not include secrets, internal-only relations, private content, or unbounded blobs in a
third-party search document. Search-index contents have their own retention, access, encryption,
deletion, and data-residency obligations.

## Incorrect Pattern

```php illustrative
// Wrong: relevance search without an index, language model, or bounded input.
$articles = Article::where('body', 'like', '%'.$request->query('q').'%')->get();

// Wrong: Laravel vector distance queries throw on a MySQL connection.
Document::whereVectorSimilarTo('embedding', $request->string('q'))->get();

// Wrong: threshold and result size are not validated or bounded.
Document::whereVectorSimilarTo(
    'embedding',
    $request->input('embedding'),
    minSimilarity: $request->input('threshold'),
)->limit($request->integer('limit'))->get();

// Wrong: retrieve cross-tenant candidates, then filter after ranking.
$documents = Document::whereVectorSimilarTo('embedding', $queryEmbedding)
    ->limit(100)
    ->get()
    ->where('tenant_id', $user->tenant_id);

// Wrong: sends the entire table, including unauthorized content, to a paid provider.
$ranked = Document::all()->rerank('content', $request->string('q'));

// Wrong for third-party Scout engines: query() runs after engine retrieval.
$orders = Order::search($request->string('q'))
    ->query(fn ($query) => $query->where('tenant_id', $user->tenant_id))
    ->get();
```

Also avoid:

- creating a non-null vector column on a large populated table and synchronously embedding every
  row inside the schema migration;
- enabling a database extension during a production deploy without verifying privileges;
- using a provider's new embedding model against a column created for a different dimension;
- depending on the implicit vector similarity threshold;
- using `order: false` without adding a deterministic, product-defined order;
- exposing MySQL boolean operators or PostgreSQL raw tsquery syntax as an undocumented input;
- assuming a SQLite test proves production full-text or vector behavior;
- embedding or reranking private text before authorization;
- logging raw queries, candidate documents, embeddings, provider payloads, or secrets;
- installing Scout or the AI SDK without explicit dependency scope.

## Failure Modes

### Full-text failures

- The application adds `whereFullText` but never creates the matching full-text index.
- A PostgreSQL index uses `english` while the query uses `simple`, changing matches and preventing
  the intended functional index path.
- A composite index covers `title` and `body`, but the query shape does not match the engine's
  usable indexed expression.
- PostgreSQL results are treated as relevance-ranked even though `whereFullText` only filters.
- MariaDB/MySQL stop-word, token-length, or collation behavior makes expected short terms vanish.
- Boolean or raw query syntax produces surprising semantics or errors for ordinary user input.
- An index build locks a large production table because online behavior was not planned.
- A fallback `%term%` scan becomes unbounded and bypasses the intended search index.

### Vector and embedding failures

- `Schema::ensureVectorExtensionExists()` fails because `pgvector` is unavailable or the migration
  role cannot create extensions.
- A migration calls vector query APIs on MySQL, MariaDB, SQLite, or SQL Server and receives the
  framework's PostgreSQL-only runtime exception.
- The provider returns 3072 values for a `vector(1536)` column.
- A provider/model change silently mixes incompatible semantic spaces in one column.
- A content update commits but its embedding job never runs, leaving stale retrieval data.
- A queued job runs before the transaction commits and embeds missing or previous content.
- Retried jobs write partial, duplicated, or out-of-order embedding versions.
- Null vectors are not excluded during a staged backfill.
- The HNSW index is absent, invalid, or not selected, causing a sequential scan at production size.
- A threshold calibrated for one model removes useful results after a model upgrade.
- A plain string passed to `whereVectorSimilarTo` reaches an unconfigured AI SDK/provider path.
- Embedding cache keys or stored prompts retain personal or regulated data longer than intended.
- Provider throttling, timeout, billing exhaustion, or regional outage turns every search request
  into an application failure.

### Reranking failures

- The initial candidate set is too broad, creating high latency and provider cost.
- The initial candidate set is arbitrary or low quality, so reranking never sees the best records.
- Unauthorized candidate text is sent to the provider before filtering.
- Original IDs are lost when ranked indexes are mapped back to Eloquent records.
- Duplicate text causes the wrong record to receive a score.
- Provider output is assumed complete, sorted, unique, and trustworthy without validation.
- The reranker times out and the endpoint has no deterministic first-stage fallback.
- A live provider is called from ordinary automated tests.

### Scout failures

- The agent assumes Scout is part of Laravel core and uses `Searchable` when the package is absent.
- Searchable data changes but a queued third-party index update is delayed or fails.
- Deletes, soft deletes, restores, bulk updates, or direct SQL leave an external index stale.
- Tenant fields are not configured as filterable in the selected third-party engine.
- Security filtering is placed in Scout's post-retrieval `query(...)` callback.
- A collection engine passes tests on tiny fixtures and exhausts memory in production.
- An engine switch changes ranking, filter, pagination, or soft-delete semantics without contract
  tests.
- Index documents expose fields the application policy would not return.

## Trade-offs

| Approach | Strengths | Costs and limits |
| --- | --- | --- |
| Escaped `LIKE` | Portable and simple for small datasets | No language ranking; leading wildcard scans |
| Native full text | Fast database-local keyword retrieval; no provider | Engine-specific language and ranking behavior |
| PostgreSQL vector | Semantic retrieval remains in the primary database | Extension, large vectors, model lifecycle, approximate index tuning |
| AI reranking | Improves semantic order without persisted vectors | Provider latency, cost, privacy, bounded candidate requirement |
| Scout database engine | Eloquent API and PostgreSQL relevance ordering without external service | Separate package; MySQL/PostgreSQL database-engine boundary |
| Scout third-party engine | Typo tolerance, facets, geo-search, custom ranking | External data copy, synchronization, queues, vendor operations |

A hybrid retrieve-then-rerank pipeline often gives better latency than reranking the corpus and
better semantic quality than keyword retrieval alone. It also adds two ranking stages, provider
failure handling, quality evaluation, and data-governance obligations.

HNSW improves nearest-neighbor latency at the cost of index storage, build time, write overhead,
and approximate recall. Measure with representative tenant filters, corpus size, vector
dimensions, threshold, and top-K. Do not infer production performance from an empty development
database.

Embedding at write time improves read latency but delays write completion or requires eventual
consistency. Queued embedding makes writes responsive but needs stale/null behavior, retries,
monitoring, and a freshness service-level objective.

Embedding caching reduces provider calls but can retain sensitive query or document-derived data.
Choose cache store, TTL, encryption, access, and deletion behavior as part of the threat model.

## Version and Package Boundaries

Treat these surfaces separately:

| Surface | Evidence | Availability |
| --- | --- | --- |
| Full-text schema and query builder | `laravel/framework` | Core; MariaDB/MySQL/PostgreSQL behavior differs |
| PostgreSQL vector schema and distance queries | `laravel/framework` plus database extension | Core APIs; PostgreSQL `pgvector` only for these queries |
| Embedding generation and reranking | `laravel/ai` | Separate package and provider configuration |
| Scout model search and engines | `laravel/scout` | Separate package and independently versioned drivers |
| MongoDB vector search | Laravel MongoDB package | Separate API; do not apply PostgreSQL query examples |

- Resolve the exact `laravel/framework` version from `composer.lock`. This reference is pinned to
  v13.19.0 behavior; verify method signatures again after a framework update.
- Resolve `laravel/ai` independently before using `Embeddings`, `Reranking`, collection `rerank`,
  or string-to-embedding convenience paths.
- Resolve `laravel/scout` and the selected engine/driver version independently. Framework 13 does
  not prove a compatible Scout driver is installed.
- Verify database server version and extension availability separately from PHP dependencies.
- Verify provider support for the requested embedding dimensions and reranking operation. AI SDK
  abstraction does not make every provider/model capability identical.
- Preserve the project's existing engine and provider choice unless correctness, security,
  compatibility, or an explicit user request justifies a change.
- Treat external engine settings, model names, HNSW tuning, ranking expressions, thresholds,
  quality metrics, and fallback policy as project conventions or derived recommendations.

When documentation summaries disagree about defaults, inspect the pinned framework implementation
and pass behavior-defining arguments explicitly. For v13.19.0, the pinned query builder source is
authoritative for the `0.6` default, while application code should still pass its calibrated
threshold.

## Testing

### Structural and migration tests

- Run migrations against the production database engine, not only SQLite.
- Assert the `pgvector` extension exists before creating vector columns in PostgreSQL integration
  environments.
- Assert full-text index names, columns, language, and online behavior.
- Assert vector column dimensions, nullability, HNSW index, and model array cast.
- Exercise a fresh migration, staged upgrade, rollback of application-owned objects, and rerun.
- Verify a concurrent/online PostgreSQL index migration is not wrapped in a transaction.
- Test duplicate deploy execution or migration isolation according to the deployment workflow.

### Search contract tests

- Test empty, whitespace-only, maximum-length, Unicode, stop-word, punctuation, and malformed
  mode-specific queries.
- Test accepted and rejected threshold values, including negative, greater than one, non-numeric,
  non-finite, and missing input.
- Test stable result limits and deterministic tie behavior.
- Test PostgreSQL full-text filtering separately from relevance ordering.
- Test MariaDB/MySQL natural-language and boolean modes only on the matching driver.
- Test no-result and fewer-than-limit behavior.
- Test null and stale embeddings during backfill.
- Test explicit vector ordering and `order: false` behavior.
- Test `selectVectorDistance`, distance threshold, and ordering with known small vectors.

### Authorization and tenant tests

- Create equally relevant documents in two tenants and prove the caller never receives or sends
  the other tenant's text to a provider.
- Test public, tenant, owner-only, soft-deleted, embargoed, and unauthorized records.
- Test `viewAny` denial and per-record visibility independently.
- For third-party Scout engines, assert tenant and visibility filters are present in the engine
  request, not only in a later Eloquent query.
- Test queue payloads and logs for private content, embeddings, and secrets.

### AI SDK tests

- Use `Embeddings::fake()` and `Reranking::fake()` for deterministic feature tests.
- Use `preventStrayEmbeddings()` and the AI SDK assertion APIs so an unexpected paid call fails the
  test instead of reaching a provider.
- Return embeddings with the exact production dimension in normal tests.
- Add wrong-size, missing, partial, duplicate, timeout, throttled, and provider-error responses.
- Assert batching, selected dimensions, cache policy, provider/model metadata, and retry idempotency.
- Assert reranked indexes map back to the correct Eloquent IDs and no unauthorized text is present.
- Keep live-provider smoke tests opt-in, budget-bounded, secret-protected, and outside ordinary pull
  request determinism.

### Scout tests

- Test create, update, delete, soft delete, restore, bulk import, and failed queued synchronization.
- Test the exact selected engine; the collection engine is not behavioral proof for database or
  third-party engines.
- Assert filterable attributes and index settings in an integration environment.
- Test engine outage, delayed freshness, pagination, and fallback behavior.
- Run a reconciliation check that compares application records with external index identity.

### Relevance and performance tests

- Maintain a versioned golden query set with relevant, irrelevant, tenant-forbidden, and hard
  negative documents.
- Measure product-appropriate metrics such as precision at K, recall at K, mean reciprocal rank,
  or normalized discounted cumulative gain. These are derived evaluation practices, not Laravel
  framework APIs.
- Record provider/model, embedding version, threshold, database version, corpus size, tenant
  distribution, and candidate count with each benchmark.
- Inspect `EXPLAIN (ANALYZE, BUFFERS)` or the matching engine plan using representative data.
- Measure p50/p95/p99 latency, provider calls, cache hits, tokens, cost, database time, and memory.
- Load-test concurrent search while writes and embedding backfills are active.
- Re-run quality and latency gates before changing model, dimensions, language, index, threshold,
  Scout engine, or reranking provider.

## Grounding

Classification: `mixed`.

| Classification | Claims in this reference |
| --- | --- |
| `official` | Documented Laravel 13 full-text, Search, migration, vector, and query-builder behavior |
| `source-verified` | Exact v13.19.0 signatures, PostgreSQL-only guard, `0.6` default, HNSW cosine grammar, string embedding call, and explicit vector-index command |
| `package-specific` | Laravel AI SDK embedding/reranking APIs and Scout engine behavior |
| `derived` | Tenant-first query design, staged backfill, model/version metadata, quality metrics, performance gates, privacy, and failure-recovery guidance |

The reproducible baseline is the repository's `source-lock.json`:

- Laravel docs 13.x commit `6d8246ff751a299421520660979cc34a2b255bc9`
- Laravel Framework v13.19.0 commit `514502b38e11bd676ecf83b271c9452cc7500f16`

Primary documentation:

- https://laravel.com/docs/13.x/search
- https://laravel.com/docs/13.x/queries#full-text-where-clauses
- https://laravel.com/docs/13.x/queries#vector-similarity-clauses
- https://laravel.com/docs/13.x/migrations#available-index-types
- https://laravel.com/docs/13.x/migrations#column-method-vector
- https://laravel.com/docs/13.x/ai-sdk#embeddings
- https://laravel.com/docs/13.x/ai-sdk#reranking
- https://laravel.com/docs/13.x/ai-sdk#testing
- https://laravel.com/docs/13.x/scout
- https://laravel.com/docs/13.x/authorization
- https://laravel.com/docs/13.x/validation

Pinned source evidence:

  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/search.md
  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/queries.md
  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/migrations.md
  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/ai-sdk.md
  - https://github.com/laravel/docs/blob/6d8246ff751a299421520660979cc34a2b255bc9/scout.md
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Query/Builder.php
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Schema/Blueprint.php
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Schema/Builder.php
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Query/Grammars/PostgresGrammar.php
- https://github.com/laravel/framework/blob/514502b38e11bd676ecf83b271c9452cc7500f16/src/Illuminate/Database/Schema/Grammars/PostgresGrammar.php

Use Context7 `/laravel/docs/__branch__13.x` and live official documentation only as freshness
checks. If a generated summary conflicts with the pinned docs or framework implementation, cite
the conflict, follow the pinned source for this skill version, and make behavior-defining arguments
explicit in application code.
