# Laravel 13 Behavioral Evaluation

`manifest.json` is generated from the static golden scenarios by `npm run build:evals`.

For each target model, give it only `prompts.json` and run every prompt in a fresh context with the installed `laravel-13` skill. Do not expose `manifest.json`, earlier outputs, or the intended fix. Run every case in at least three fresh, independent contexts. A separate reviewer must inspect meaning, code validity, Laravel/package version fit, security invariants, and requested scope; keyword checks alone are not acceptance evidence.

Save an evaluation bundle as:

```json
{
  "evaluations": [
    {
      "target": "codex",
      "runs": [
        {
          "id": "codex-run-1",
          "responses": [
            { "caseId": "api-crud", "response": "..." }
          ],
          "reviews": [
            {
              "caseId": "api-crud",
              "verdict": "pass",
              "reviewer": "independent-reviewer-run-1",
              "notes": "Checked routing, code validity, authorization, and Laravel 13 grounding."
            }
          ]
        }
      ]
    }
  ]
}
```

Score all supplied targets with:

```bash
npm run eval:model -- path/to/responses.json
```

The scorer rejects unknown targets, duplicate or incomplete runs, missing semantic reviews, dangerous advice patterns, any high-risk failure, any semantic-review failure, or a run below 90%. Every case in every run requires a passing independent semantic review (100% semantic pass rate). Use the stricter release gate when both configured primary targets are available:

```bash
npm run eval:model -- path/to/responses.json --require-all-targets
```

Acceptance requires every supplied target to pass three independent runs. Release acceptance requires both Codex and Claude through the strict command; if one target is unavailable, record that limitation and do not claim the cross-model release gate passed. Model credentials and response files are not committed.
