---
phase: 10
name: Evidence-Only Gate Linter Seed MVP
status: complete
created: "2026-05-08"
requirements:
  - GATELINT-01
---

# Phase 10 Research: Evidence-Only Gate Linter Seed MVP

## Research Question

What must be known to plan a small, deterministic `gates-scan` MVP that checks
mechanical gate evidence without becoming semantic gate review or kit-owned
adoption tooling?

## Gate Resolution

- **Research Gate:** user selected Research first on 2026-05-08.
- **Upstream Freshness Gate:** resolved in
  `10-UPSTREAM-UPDATE-REVIEW.md`. The local kit checkout was fast-forwarded
  from `485da62` to `e225f77`; changed source layers reinforce that
  gate-linter execution is external AI Tools evidence and that mechanical
  output is not authority.
- **AI Tools Self-Use Gate:** resolved for planning. Ran
  `cross-repo-compatibility-checker` against this repo and
  `.external\ai-workspace-kit`, output at
  `C:\Users\suppo\.codex\memories\ai-tools-cross-repo-check-phase10-plan`.
  Result: `human_review_required`, 1 medium legacy upstream metadata finding,
  0 blockers, 0 required decisions.
- **New Tool Intake Gate:** resolved in `10-CONTEXT.md`: `gates-scan` is
  AI Tools-owned, destination `tools/gates-scan/`, output is the shared review
  packet, non-goal is semantic gate decision-making.
- **Cross-Repo Outgoing Need Gate:** skipped with reason. No kit-owned
  capability is needed to implement an external evidence scanner.

## Findings

### 1. Implement, Do Not Re-Defer

The prerequisites that previously blocked `GATELINT-01` now exist:

- Phase 7 validated the cross-repo compatibility checker.
- Phase 9 added `tools/registry.json` and detailed workflow gate docs.
- Upstream kit now explicitly documents consumer confidence boundaries and
  repeats that external `ai-tools` packet output is evidence only.

No blocker was found that would force a deferred decision artifact instead of a
minimal implementation.

### 2. Keep the Tool Local and Explicit

The CLI should follow existing tool shape:

```text
gates-scan --project <path> --out <dir>
```

It should reject `--out` inside the scanned project using `shared/path-guard.js`
and should reject mutating flags such as `--fix`, `--write`, `--pull`,
`--fetch`, and `--install`. It must not infer or execute a sibling
`ai-workspace-kit` checkout.

### 3. Reuse Existing Packet Mechanics

The closest implementation pattern is
`tools/cross-repo-compatibility-checker/`:

- `cli.js` handles explicit inputs and safe argument parsing.
- `index.js` validates output paths, builds a packet summary, writes artifacts,
  and returns status.
- `checks.js` creates evidence, findings, and recommended actions.
- integration and CLI tests use synthetic fixtures under `test/fixtures/`.

`gates-scan` should reuse:

- `shared/review-packet-renderer.js`
- `shared/path-guard.js`
- `shared/tool-metadata.js`
- existing package bin/script patterns.

### 4. Split the Phase Into Boundary Then Implementation

The roadmap already has two plan slots:

- `10-01`: revalidate gate-linter boundary and fixture scope.
- `10-02`: implement minimal evidence-only linter or record explicit deferral.

Research recommends using the first plan to create the seed/scope and fixture
contract, then the second plan to implement the runnable CLI and self-use it.
This prevents the implementation from expanding into semantic gate review.

### 5. MVP Checks Should Be Deterministic

The first implementation should check mechanical evidence:

- gate registry exists and parses as JSON;
- duplicate gate IDs;
- required gate fields;
- gates without observable outputs;
- interop field mapping and stage alias drift;
- missing `## Gate Resolution` sections in completed phase governance
  artifacts where registered gates apply;
- non-skippable gates marked skipped;
- skipped gates missing required skip reasons;
- `workflow.discuss_mode` used as approval evidence for `discuss-mode`;
- stale literal paths in source layers and required artifacts;
- changelog/docs impact missing after gate/schema/workflow/public CLI changes.

The scanner should not decide whether a gate should be adopted, superseded,
removed, or converted into a cross-repo request.

### 6. Fixture Strategy

Use synthetic fixtures as the primary oracle under `test/fixtures/gates-scan/`:

- compatible project;
- duplicate gate IDs;
- missing gate resolution;
- skipped non-skippable gate;
- skipped gate missing reason;
- discuss-mode routing used as approval evidence;
- stale path;
- missing observable output;
- interop mapping drift;
- changelog impact missing.

Real AI Tools self-use should run during verification, but local historical
phase artifacts should not be the only test source.

## Planning Recommendation

Create two executable plans:

1. `10-01`: add `tools/gates-scan/SEED-IDEAS.md`, fixture contract, initial
   docs/tests scaffolding, and preserve registry planned state.
2. `10-02`: implement `gates-scan`, package bin/script, packet output,
   deterministic checks, docs, registry maturity update, changelog entry, and
   self-use evidence.

## Risks

- **Semantic overreach:** mitigated by explicit non-goals and finding wording.
- **Historical false positives:** mitigated by synthetic fixtures and narrow
  completed-artifact selection.
- **Registry/docs drift:** mitigated by focused tests and updating
  `tools/registry.json` only when maturity is true.
- **Unsafe output writes:** mitigated with shared path guard and CLI tests.

## Conclusion

Phase 10 should implement a minimal `gates-scan` MVP. The upstream update and
cross-repo self-use evidence confirm the boundary rather than blocking the
tool.

