# Gates Scan Roadmap Review

Date: 2026-05-07

## Verdict

The colleague recommendation is directionally correct: AI Tools should expose a
user-facing `gates-scan` CLI, while keeping the requirement ID as
`GATELINT-01`. The tool belongs in AI Tools, not `ai-workspace-kit`, because it
is mechanical, read-only evidence generation rather than semantic gate
ownership or adoption/bootstrap policy.

## Current State

- `package.json` exposes only `contract-drift-auditor`.
- `GATELINT-01` is already defined in `.planning/REQUIREMENTS.md`.
- Roadmap currently places gate linting in Phase 10, after:
  - Phase 7 cross-repo compatibility checker;
  - Phase 8 contract-drift-auditor CLI ergonomics;
  - Phase 9 tool registry and workflow gate slimming.
- `.planning/gates/registry.json` already contains enough structured gate
  metadata to support a meaningful first scanner.

## Boundary Decision

AI Tools may own:

- mechanical checks over gate registries and phase artifacts;
- evidence-only review packet output;
- stale path/reference detection;
- casing and stage alias drift checks;
- missing gate resolution blocks and missing skip reasons.

`ai-workspace-kit` should continue to own:

- gate policy and semantic guidance;
- assistant-led gate-review procedure;
- adoption/bootstrap and generated contract boundaries;
- final decision about whether a gate is relevant, stale, duplicated, or
  should be revised.

Tool output must remain evidence, not the final decision.

## Recommended Shape

Keep requirement ID: `GATELINT-01`.

Use user-facing CLI:

```bash
gates-scan --project <path> --out <dir>
```

Output should match the review packet standard:

- `REVIEW-SUMMARY.json`
- `FINDINGS.md`
- `EVIDENCE.json`
- `RECOMMENDED-ACTIONS.md`

MVP checks should include:

- gate registry exists and is valid JSON;
- duplicate gate IDs;
- required gate fields are present;
- ai-tools snake_case to kit camelCase mapping exists where interop is claimed;
- stage aliases include `verification -> verify`, `release -> phase-boundary`,
  and `replan -> plan`;
- required `Gate Resolution` sections exist in completed phase artifacts where
  registered gates apply;
- non-skippable gates are not marked skipped;
- skipped gates include skip reasons when required;
- `workflow.discuss_mode` is not treated as `discuss-mode` approval evidence;
- source-layer paths and required artifacts are not stale;
- changelog/docs impact exists after gate, schema, or workflow changes;
- gates declare observable outputs.

## Roadmap Recommendation

Phase 10 is too late if the goal is to prevent the same gate enforcement misses
from recurring. The project has already had repeated pain around discuss-mode
and gate resolution, so a small `gates-scan` MVP should move earlier.

Recommended ordering:

1. Keep Phase 7 as `XREPO-VALIDATOR-01`; cross-repo compatibility must remain
   the first prerequisite before automatic interop or gate-linter automation.
2. Promote `GATELINT-01` / `gates-scan` to the next phase after Phase 7.
3. Move contract-drift-auditor CLI ergonomics after `gates-scan`; it is useful,
   but gate enforcement risk is currently higher.
4. Keep tool registry and broad seed selection after these guardrails.

This keeps the sequence:

- Phase 7: cross-repo compatibility checker;
- next: `gates-scan` MVP;
- then: contract-drift-auditor CLI ergonomics;
- then: tool registry / gate docs slimming;
- then: broad tool selection.

## Additional Recommendations

- Reuse shared packet renderer and metadata instead of creating a separate
  report format.
- Add fixtures with intentionally missing Gate Resolution, skipped
  non-skippable gate, stale source path, duplicate gate ID, and missing
  changelog impact.
- Keep semantic review explicitly assistant-owned in docs and findings.
- Do not make `gates-scan` auto-run during GSD yet; first make it runnable and
  self-use it manually at phase-boundary/release.
- After the tool registry exists, register `gates-scan` as self-use required
  for workflow gate changes and phase verification.
