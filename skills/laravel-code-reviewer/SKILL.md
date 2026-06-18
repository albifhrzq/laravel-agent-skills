---
name: laravel-code-reviewer
description: Review Laravel 13 code changes with technical rigor. Use after implementing features, fixing bugs, changing APIs, editing auth/JWT behavior, adding migrations, modifying queues/jobs/events, or before claiming completion. Reviews correctness, Laravel conventions, API contract stability, validation, authorization, security, performance, tests, documentation, and production readiness.
license: MIT
metadata:
  author: albifhrzq
  version: "1.0.0"
  framework: Laravel
  laravelVersion: "13.x"
  phpVersion: "8.3+"
  type: codex-skill-wrapper
---

# Laravel Code Reviewer

This is the Codex skill version of `agents/laravel-code-reviewer`.

Use this skill after implementation and before claiming completion.

## Source of Truth

Before reviewing, read:

1. Project root `AGENTS.md`.
2. `skills/laravel-api-design/SKILL.md`.
3. Relevant `skills/laravel-api-design/rules/*.md` files.
4. Relevant `skills/laravel-api-design/references/*.md` files.
5. Context7 Laravel 13 docs when framework behavior is unclear.
6. Selected JWT package or identity provider docs when reviewing JWT behavior.

## Review Categories

Check:

- correctness against the requirement
- Laravel conventions
- API contract stability
- FormRequest validation
- authorization and guard boundaries
- security and data exposure
- performance and N+1 risk
- side effects and idempotency
- tests
- documentation and production readiness

## Severity Levels

### Critical

Must fix before merge or completion. Causes data corruption, auth bypass, broken API contract, security issue, migration danger, or major runtime failure.

### Important

Should fix before proceeding. Causes maintainability risk, missing important tests, performance problem, unclear API behavior, or likely production bug.

### Minor

Nice to improve. Does not block current task.

### Question

Needs clarification before judging.

## Review Process

1. Understand the requirement.
2. Inspect changed files.
3. Trace affected execution paths.
4. Check Laravel-specific rules and references.
5. Review tests and docs.
6. Produce findings with evidence.
7. Avoid vague comments.

## Output Format

```markdown
## Laravel Code Review

### Review Scope
- Requirement:
- Changed areas:
- Evidence reviewed:
- Tests/docs reviewed:

### Summary
- Overall risk: Low / Medium / High
- Merge readiness: Ready / Not ready / Needs clarification

### Critical Findings
1. **Title**
   - Location: `path/to/file.php:line`
   - Problem:
   - Impact:
   - Suggested fix:
   - Evidence:

### Important Findings
1. **Title**
   - Location:
   - Problem:
   - Impact:
   - Suggested fix:

### Minor Findings
- ...

### Questions
- ...

### Positive Notes
- Mention only concrete, useful positives.

### Verification Checklist
- [ ] Requirement satisfied
- [ ] API contract stable or documented
- [ ] Validation covered
- [ ] Authorization covered
- [ ] Tests adequate
- [ ] Docs updated if needed
- [ ] Production risks considered
```

## Rules

- Do not modify code while reviewing.
- Do not approve without evidence.
- Do not claim tests pass unless fresh output is available.
- Do not invent line numbers.
- Do not nitpick style while missing correctness, auth, data, or API contract risks.
- If there are no findings, state what was checked and what evidence supports that.
