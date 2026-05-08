---
phase: 16
name: Ledger Scope and Diff Modes
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - LEDGER-SCOPE-01
  - LEDGER-SCOPE-02
  - LEDGER-SCOPE-03
  - LEDGER-SCOPE-04
depends_on:
  - Phase 14 Ledger Artifact Schemas
---

# Phase 16: Ledger Scope and Diff Modes - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 16 hardens the existing `project-context-ledger` by adding explicit
source scopes and explicit manifest-based diffs. The phase should let users
separate current source-of-truth evidence from active planning evidence and
historical phase artifacts, then compare a new ledger run against a previous
`CACHE-MANIFEST.json`.

The phase must reduce historical planning noise without hiding history. It does
not add a new auditor, review disposition generation, semantic suppression,
shared CLI migration, portfolio scanning, target-project mutation, or automatic
workflow/gate/roadmap decisions.

</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- **Gate:** `discuss-mode`
- **Status:** resolved
- **Mode:** Trusted Self-Questioning
- **Selected by:** user
- **Approval source:** user replied `1` after the Phase 16 discuss-mode choice
  prompt on 2026-05-08.
- **Evidence:** `AGENTS.md` requires resolving Manual Questions vs Trusted
  Self-Questioning before gray-area analysis or discuss artifacts;
  `.planning/gates/registry.json` defines `discuss-mode` as non-skippable for
  discuss-stage work; `workflow.discuss_mode` was checked and treated as
  routing only.
- **Cycle limits:** one focused self-questioning pass over scope semantics,
  source categories, historical planning treatment, placeholder/generated
  artifact classification, manifest diff behavior, output artifacts, tests,
  self-use evidence, and deferred boundaries.
- **Skip reason:** not skipped.
- **workflow_discuss_mode_is_routing_only:** true.

Required field mirror:

- `mode`: Trusted Self-Questioning
- `selected_by`: user
- `approval_source`: user replied `1` after the Phase 16 discuss-mode prompt
- `evidence`: `AGENTS.md`, `.planning/gates/registry.json`, and routing-only
  `workflow.discuss_mode` check
- `cycle_limits_or_skip_reason`: one focused self-questioning pass
- `workflow_discuss_mode_is_routing_only`: true

### AI Tools Self-Use Gate

- **Gate:** `self-use`
- **Status:** applies during planning, execution, and verification.
- **Capabilities considered:** `project-context-ledger` is the target tool;
  `review-packet-rollup` and review dispositions are validated consumers but
  should not drive Phase 16 scope.
- **Resolution:** do not rerun self-use tools during context capture. Phase 16
  verification must run `project-context-ledger` against this repository with
  default `current` scope and explicit `all` or `history` scope, then record
  whether historical `.planning/phases/**` reference findings are reduced
  without blocking full-history inspection.

### Cross-Repo Incoming Review Gate

- **Gate:** `cross-repo-incoming`
- **Status:** skipped with reason.
- **Reason:** no incoming cross-repo request asks for Phase 16 scope. This is
  AI Tools-owned ledger hardening and does not mutate `ai-workspace-kit`.

### New Tool Intake and Placement Gate

- **Gate:** `new-tool-intake`
- **Status:** skipped with reason.
- **Reason:** Phase 16 extends the validated `project-context-ledger`; it does
  not introduce a new tool.

### Git Baseline Gate

- **Gate:** `git-baseline`
- **Status:** resolved.
- **Evidence:** `git status --short` was clean before Phase 16 context work.
- **Classification:** no unrelated baseline noise.

## Implementation Decisions

### Scope Semantics

- **D-01:** Add `project-context-ledger --scope current|planning|history|all`.
  Default to `current`.
- **D-02:** Treat `current` as the default source-of-truth scope: root
  assistant contracts, package manifests, tool registry, skills, and active
  top-level planning files that define the current project state. It must
  exclude historical phase artifacts.
- **D-03:** Treat `planning` as active planning-only evidence: `.planning`
  source-of-truth files such as `PROJECT.md`, `REQUIREMENTS.md`,
  `ROADMAP.md`, `STATE.md`, gates, and cross-repo decision/request docs. It
  must not include `.planning/phases/**`.
- **D-04:** Treat `history` as historical phase evidence, especially
  `.planning/phases/**` `*-CONTEXT.md`, `*-SUMMARY.md`, and
  `*-VERIFICATION.md`. History mode exists so old decisions remain available
  when explicitly requested.
- **D-05:** Treat `all` as the union of current, planning, and history plus
  any other supported non-ignored ledger sources.
- **D-06:** Preserve output isolation and read-only behavior for every scope.
  Scope changes only affect which sources become ledger inputs and findings;
  they do not mutate target projects or planning artifacts.

### Source Categories And Schema Impact

- **D-07:** Add a deterministic source category for discovered sources, using
  at least `current`, `planning`, `history`, `generated_packet`, `secret`,
  `example`, `placeholder`, and `unknown` where applicable.
- **D-08:** Include source category in the machine-readable ledger surface so
  consumers can understand why a source was included, excluded, or treated as
  non-actionable. The preferred places are `CACHE-MANIFEST.scanned_sources[]`
  and generated record source metadata.
- **D-09:** Update public ledger schemas and generated-output tests when source
  category fields are emitted. Keep the existing top-level array artifact
  shapes from Phase 14.
- **D-10:** Keep the current `project-context-ledger/v1` contract unless
  planning finds a real incompatible consumer break. If a required schema
  field would break the Phase 14 contract, prefer an optional field first or
  explicitly document the version decision.

### Historical Planning Noise

- **D-11:** Categorize `.planning/phases/**` as `history` by path before
  markdown reference extraction. Do not let old phase contexts dominate default
  current-scope findings.
- **D-12:** Keep history discoverable. `--scope history` and `--scope all`
  should still report stale references found in historical phase artifacts.
- **D-13:** Source categories should appear in findings or evidence refs
  clearly enough that a human can tell whether a stale reference came from
  current, planning, or history evidence.
- **D-14:** Do not mark historical findings safe to ignore. Phase 16 is
  mechanical scoping, not review disposition or suppression.

### Example, Placeholder, N/A, And Generated Packet Classification

- **D-15:** Classify references from obvious examples, template prose,
  placeholder values, `n/a`, `none`, and generated packet artifacts separately
  from real references.
- **D-16:** Non-real references should not inflate current missing-reference
  findings. They may remain in evidence or manifest counters as classified
  non-actionable inputs.
- **D-17:** Generated review packet directories remain ignored as source input
  by default. Their paths stay path-only evidence in the manifest.
- **D-18:** Classification should be deterministic and conservative. If a
  reference cannot be confidently classified as example/placeholder/generated,
  keep it as a real reference rather than silently dropping it.

### Manifest Diff Mode

- **D-19:** Add `--since-manifest <CACHE-MANIFEST.json>` as an explicit diff
  input. The supplied manifest may come from a previous external ledger output
  directory; it must be validated enough to avoid trusting malformed files.
- **D-20:** Keep the existing implicit same-output-directory previous manifest
  behavior only if it does not conflict with explicit `--since-manifest`.
  Explicit flag input should win.
- **D-21:** Compare generated ledger records by artifact name and stable record
  id. Report `added`, `removed`, `changed`, `unchanged`, and `stale` record
  states mechanically.
- **D-22:** Define `changed` as the same artifact/id with a different canonical
  record hash. Define `unchanged` as the same artifact/id with the same
  canonical record hash. Define `added` and `removed` by id presence.
- **D-23:** Define `stale` as current records with `confidence: "stale"` or
  records whose cited source evidence is known to have changed or disappeared
  since the previous manifest. Stale is review context, not an automatic
  failure policy.
- **D-24:** Prefer a separate `LEDGER-DIFF.json` artifact when
  `--since-manifest` is supplied. If planning chooses to embed the diff in
  `CACHE-MANIFEST.json` instead, it must still be easy for packet consumers to
  find the five required categories.
- **D-25:** Diff output should include source manifest path/hash, current run
  timestamp, artifact-level counts, record refs, source paths, source
  categories, and evidence refs where available.

### Findings And Status Policy

- **D-26:** Diff mode should not make unchanged or changed facts automatic
  blockers. Findings should remain evidence-only and follow existing severity
  patterns.
- **D-27:** Missing or malformed `--since-manifest` input should be a blocked
  CLI error or blocked packet finding depending on how early it is detected.
  Do not silently fall back to no diff.
- **D-28:** Added, removed, changed, stale, and unchanged counts should be
  visible in machine JSON. Markdown may summarize them, but JSON is the source
  of truth.
- **D-29:** Do not integrate review dispositions into ledger diff behavior.
  Dispositions remain a packet-consumer sidecar from Phase 15.

### CLI Boundaries

- **D-30:** Add only the narrow Phase 16 CLI flags: `--scope` and
  `--since-manifest`. Do not migrate `project-context-ledger` to the full
  Phase 17 shared CLI contract in this phase.
- **D-31:** Reject invalid scope values with exit code 2 and a clear message.
- **D-32:** Keep mutating flag rejection intact and include any newly rejected
  mutating aliases if nearby tests expose gaps.

### Fixtures And Verification

- **D-33:** Add fixture coverage with active top-level planning docs and
  historical `.planning/phases/**` docs that contain stale references. Default
  current scope should exclude the historical findings; `history` or `all`
  should include them.
- **D-34:** Add fixture coverage for examples, placeholders, `n/a`, and
  generated packet directories so they do not inflate current missing-reference
  findings.
- **D-35:** Add diff fixture coverage using a previous `CACHE-MANIFEST.json`
  and ledger records that produce all five categories: added, removed,
  changed, stale, and unchanged.
- **D-36:** Add schema-output tests for any new/changed ledger artifact schema
  fields, plus deterministic output tests with a fixed clock.
- **D-37:** Verification should run self-use twice: default current scope and
  explicit all/history scope. Record counts and finding deltas, not just pass
  or fail.

### Agent Discretion

The planner may choose exact module boundaries such as `scope.js`,
`diff.js`, or additions to `discovery.js` and `ledger.js`. Prefer small pure
functions for source categorization and record diffing, with fixture tests
before broad refactors.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 16 goal, dependency, success criteria, and
  two-wave plan split.
- `.planning/REQUIREMENTS.md` - LEDGER-SCOPE-01 through LEDGER-SCOPE-04 and
  v2.1 traceability.
- `.planning/PROJECT.md` - v2.1 evidence consumption milestone, review-only
  boundary, and key decisions about signal quality.
- `.planning/STATE.md` - current project state and previous phase continuity.

### Prior Phase Decisions

- `.planning/phases/15-review-disposition-model/15-CONTEXT.md` - disposition
  boundary, no suppression, and explicit deferral of ledger scope/diff to
  Phase 16.
- `.planning/phases/15-review-disposition-model/15-VERIFICATION.md` -
  validated disposition behavior and remaining noisy rollup evidence.
- `.planning/phases/14-ledger-artifact-schemas/14-CONTEXT.md` - ledger schema
  ownership, strict schema style, cache manifest model, and deferred scope/diff
  boundary.
- `.planning/phases/14-ledger-artifact-schemas/14-VERIFICATION.md` - schema
  validation evidence and residual risk that 383 ledger findings remain noisy.
- `.planning/phases/13-review-packet-rollup-mvp/13-CONTEXT.md` - mechanical
  packet consumer boundary and no semantic suppression decisions.

### Ledger Standards And Implementation

- `standards/project-context-ledger/README.md` - public ledger schema contract
  and non-authority boundaries.
- `standards/project-context-ledger/schemas/CACHE-MANIFEST.schema.json` -
  existing manifest shape that Phase 16 may extend for source categories and
  diff metadata.
- `standards/project-context-ledger/schemas/FACTS.schema.json` - fact record
  shape and category/confidence/source metadata rules.
- `standards/project-context-ledger/schemas/LEDGER-COMMON.schema.json` -
  shared path, timestamp, hash, confidence, and evidence ref definitions.
- `tools/project-context-ledger/README.md` - current CLI usage, outputs, and
  non-goals.
- `tools/project-context-ledger/SEED-IDEAS.md` - original `ctx diff --since`
  seed and ledger purpose.
- `tools/project-context-ledger/cli.js` - current argument parsing and mutating
  flag rejection.
- `tools/project-context-ledger/discovery.js` - current discovery rules for
  contracts, active planning, phase artifacts, skills, packages, registry, and
  generated packet dirs.
- `tools/project-context-ledger/ledger.js` - current ledger record generation,
  evidence refs, previous manifest comparison, and cache manifest writing.
- `tools/project-context-ledger/index.js` - runner, output isolation, tool
  manifest, and artifact writing integration.

### Tests And Fixtures

- `test/project-context-ledger/cli.test.js` - CLI parsing and error handling
  patterns for new flags.
- `test/project-context-ledger/discovery.test.js` - discovery behavior for
  source categorization and scope filtering.
- `test/project-context-ledger/integration.test.js` - non-mutation,
  generated artifact, secret safety, and output isolation patterns.
- `test/project-context-ledger/schema-output.test.js` - generated schema
  validation, deterministic output, evidence joins, and unique IDs.
- `test/project-context-ledger/ledger-schema-contract.test.js` - public schema
  validity coverage.
- `test/fixtures/project-context-ledger/mature-ledger/input/` - baseline
  synthetic fixture to extend with scope/history/diff cases.
- `shared/ignore-policy.js` - generated packet directory detection and ignore
  policy that Phase 16 must preserve.
- `shared/canonical-json.js` - canonical JSON for new or changed artifacts.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `discoverProject` already separates contract files, planning files, skills,
  package files, registry, generated packet directories, secret paths, and
  markdown references. This is the natural place to add source categories and
  scope filtering.
- `PHASE_ARTIFACT_RE` in `discovery.js` already identifies
  `.planning/phases/**` context/summary/verification files; Phase 16 should
  promote that from a boolean planning match into a `history` category.
- `buildLedger` already creates canonical ledger artifacts and a
  `CACHE-MANIFEST.json`; diff work should reuse canonical JSON and record IDs.
- `changedPreviousSources` already compares source hashes from a previous
  manifest. It can be replaced or extended by explicit `--since-manifest`
  support and record-level diffing.
- Existing schema-output tests already validate generated artifacts against
  public schemas, unique IDs, evidence joins, and deterministic output.

### Established Patterns

- JSON artifacts are the machine source of truth; Markdown is a projection.
- Generated packet directories are ignored as source input and recorded as
  path-only evidence.
- Secret-like paths are path-only evidence; contents are not read.
- Synthetic fixtures are the oracle. Real self-use output is verification
  evidence only.
- Tool-specific artifact changes should update `shared/tool-metadata.js`,
  schemas, registry/docs, and tests only when behavior is validated.

### Integration Points

- Extend `tools/project-context-ledger/cli.js` parsing for `--scope` and
  `--since-manifest`.
- Extend `tools/project-context-ledger/discovery.js` with source category
  helpers and scope filtering before reference extraction.
- Extend `tools/project-context-ledger/ledger.js` with source category metadata
  and manifest/record diff generation.
- Extend `tools/project-context-ledger/index.js` to pass scope and
  since-manifest options into discovery/ledger and write any new diff artifact.
- Extend `standards/project-context-ledger/schemas/` and schema tests for any
  new fields or `LEDGER-DIFF.json` artifact.
- Update `tools/project-context-ledger/README.md`, `tools/registry.json`,
  `CHANGELOG.md`, and release docs after behavior is validated.

</code_context>

<specifics>
## Specific Ideas

- Prefer default `current` scope over broad `all` to stop old phase artifacts
  from dominating everyday ledger runs.
- Prefer explicit `--scope all` for full historical analysis so no evidence is
  hidden from users who ask for it.
- Prefer a separate `LEDGER-DIFF.json` artifact for manifest diffs if it keeps
  `CACHE-MANIFEST.json` from becoming too overloaded.
- Treat placeholder/example filtering as classification, not deletion: keep
  counts/evidence where useful, but do not inflate current actionable findings.

</specifics>

<deferred>
## Deferred Ideas

- Shared `--format json`, `--quiet`, `--fail-on`, exit code, and help text
  migration belongs to Phase 17.
- `ai-workspace-kit` LLM instruction compatibility belongs to Phase 18.
- Portfolio real project scanning belongs to the future `PORTFOLIO-SCAN-01`
  milestone candidate after v2.1 foundations exist.
- Do not add semantic prioritization, automatic safe-ignore, review
  disposition generation, source finding deletion, gate approval, merge
  decisions, roadmap mutation, package installs, or target command execution.

</deferred>

---

*Phase: 16-Ledger Scope and Diff Modes*
*Context gathered: 2026-05-08*
