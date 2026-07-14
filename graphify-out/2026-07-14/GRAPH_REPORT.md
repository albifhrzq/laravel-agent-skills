# Graph Report - .  (2026-07-13)

## Corpus Check
- Corpus is ~20,314 words - fits in a single context window. You may not need a graph.

## Summary
- 54 nodes · 70 edges · 5 communities
- Extraction: 71% EXTRACTED · 29% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Skill Routing and Governance|Skill Routing and Governance]]
- [[_COMMUNITY_API Production Contracts|API Production Contracts]]
- [[_COMMUNITY_Database Safety and Tracing|Database Safety and Tracing]]
- [[_COMMUNITY_API Skill Metadata|API Skill Metadata]]
- [[_COMMUNITY_Database Skill Metadata|Database Skill Metadata]]

## God Nodes (most connected - your core abstractions)
1. `Laravel Database Design` - 9 edges
2. `Laravel API Production Readiness` - 8 edges
3. `Laravel API Design Knowledge Base` - 6 edges
4. `Laravel Agent Skills` - 5 edges
5. `Repository Guidance` - 4 edges
6. `Laravel Code Tracer Agent` - 4 edges
7. `Laravel Code Reviewer Agent` - 4 edges
8. `Laravel API Design` - 3 edges
9. `JWT Authentication Lifecycle` - 3 edges
10. `API Contract Documentation Synchronization` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Laravel Agent Skills` --references--> `Laravel Database Design`  [EXTRACTED]
  README.md → skills/laravel-database-design/metadata.json
- `Laravel Agent Skills` --references--> `Laravel API Design`  [EXTRACTED]
  README.md → skills/laravel-api-design/metadata.json
- `Repository Guidance` --conceptually_related_to--> `Laravel Agent Skills`  [INFERRED]
  AGENTS.md → README.md
- `Production API Contract` --conceptually_related_to--> `Laravel API Design`  [INFERRED]
  skills/laravel-api-design/AGENTS.md → skills/laravel-api-design/metadata.json
- `Laravel 13 Documentation Grounding` --references--> `Repository Guidance`  [EXTRACTED]
  skills/laravel-api-design/SKILL.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Laravel Engineering Skill Suite** — laravel_api_design_metadata_skill, laravel_database_design_metadata_skill, laravel_code_tracer_skill_agent, laravel_code_reviewer_skill_agent [EXTRACTED 1.00]
- **Laravel API Production Assurance** — references_laravel_13_production_checklist_production_readiness, references_laravel_13_openapi_documentation_guide_contract_documentation_sync, rules_laravel_docs_grounding_laravel_13_documentation_grounding, laravel_code_reviewer_skill_evidence_backed_review_gate [INFERRED 0.95]
- **Laravel Database Design Core Pillars** — laravel_database_design_skill_migration_safety, laravel_database_design_skill_schema_and_integrity, laravel_database_design_skill_eloquent_relationships, laravel_database_design_skill_index_and_query_performance, laravel_database_design_skill_transactions_and_concurrency, laravel_database_design_skill_zero_downtime_and_backfills, laravel_database_design_agents_production_readiness [EXTRACTED 1.00]

## Communities (5 total, 0 thin omitted)

### Community 0 - "Skill Routing and Governance"
Cohesion: 0.27
Nodes (12): Repository Guidance, Laravel API Design Complete Reference, Production API Contract, Laravel API Design, Laravel 13 Documentation Grounding, Laravel API Design Knowledge Base, API Design References Layer, API Design Rules Layer (+4 more)

### Community 1 - "API Production Contracts"
Cohesion: 0.27
Nodes (12): Evidence-Backed Laravel Review Gate, Retry-Safe Side Effects, JWT Authentication Lifecycle, API Contract Documentation Synchronization, Safe Collection Queries, Laravel API Production Readiness, Risk-Based Rate Limiting, Stable Laravel Resource Contracts (+4 more)

### Community 2 - "Database Safety and Tracing"
Cohesion: 0.27
Nodes (12): Laravel Code Tracer, Laravel Execution Flow Trace, Laravel Database Design Complete Reference, Database Production Readiness, Laravel Database Design Overview, Laravel Database Design, Eloquent Relationship Design, Index and Query Performance (+4 more)

### Community 3 - "API Skill Metadata"
Cohesion: 0.22
Nodes (8): categories, description, framework, laravelVersion, license, name, phpVersion, version

### Community 4 - "Database Skill Metadata"
Cohesion: 0.22
Nodes (8): categories, description, framework, laravelVersion, license, name, phpVersion, version

## Knowledge Gaps
- **18 isolated node(s):** `name`, `version`, `description`, `framework`, `laravelVersion` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 8 inferred relationships involving `Laravel API Production Readiness` (e.g. with `Evidence-Backed Laravel Review Gate` and `API Contract Documentation Synchronization`) actually correct?**
  _`Laravel API Production Readiness` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._