---
phase: 13
name: Review Packet Rollup MVP
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - ROLLUP-01
  - ROLLUP-02
  - ROLLUP-03
  - ROLLUP-04
  - ROLLUP-05
  - ROLLUP-06
depends_on:
  - Phase 12 Project Context Ledger MVP
---

# Phase 13: Review Packet Rollup MVP - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 13 builds `review-packet-rollup` as a strictly mechanical consumer for
existing AI Tools review packet directories. It must read two or more packet
output directories, validate required machine artifacts, aggregate source
findings and counts, group evidence mechanically, preserve provenance, and
emit a standard review packet plus rollup-specific JSON artifacts.

The phase implements ROLLUP-01 through ROLLUP-06. It does not decide that
findings are safe to ignore, suppress findings, create review dispositions,
rank business priority semantically, approve gates, mutate target projects, or
run source tools. Those capabilities belong to later phases or assistant-led
review.

</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- **Gate:** `discuss-mode`
- **Status:** resolved
- **Mode:** Trusted Self-Questioning
- **Selected by:** user
- **Approval source:** user replied `2` after the Phase 13 discuss-mode choice
  prompt on 2026-05-08.
- **Evidence:** `AGENTS.md` requires resolving Manual Questions vs Trusted
  Self-Questioning before gray-area analysis or discuss artifacts;
  `.planning/gates/registry.json` defines `discuss-mode` as non-skippable for
  discuss-stage work; `workflow.discuss_mode` was checked and treated as
  routing only.
- **Cycle limits:** one focused self-questioning pass over CLI shape, input
  validation, source finding normalization, grouping artifacts, provenance,
  status policy, safety boundaries, fixtures, registry/docs updates, and
  deferred follow-up.
- **Skip reason:** not skipped.
- **workflow_discuss_mode_is_routing_only:** true.

Required field mirror:

- `mode`: Trusted Self-Questioning
- `selected_by`: user
- `approval_source`: user replied `2` after the Phase 13 discuss-mode prompt
- `evidence`: `AGENTS.md`, `.planning/gates/registry.json`, and routing-only
  `workflow.discuss_mode` check
- `cycle_limits_or_skip_reason`: one focused self-questioning pass
- `workflow_discuss_mode_is_routing_only`: true

### New Tool Intake and Placement Gate

- **Gate:** `new-tool-intake`
- **Status:** resolved from v2.1 roadmap and reaffirmed for Phase 13.
- **Owner:** AI Tools.
- **Destination:** `tools/review-packet-rollup/`.
- **Maturity:** planned at Phase 13 start.
- **Activation stage:** plan, verify, phase-boundary, maintenance.
- **Outputs:** standard review packet artifacts plus `PACKET-INDEX.json` and
  `ROLLUP-GROUPS.json`.
- **Non-goals:** no semantic suppression, no "safe to ignore" decisions, no
  target-project mutation, no automatic gate/merge/roadmap decisions, no
  `ai-workspace-kit` dependency, and no source tool execution.

### AI Tools Self-Use Gate

- **Gate:** `self-use`
- **Status:** applies during planning, execution, and verification.
- **Capabilities considered:** `contract-drift-auditor`,
  `cross-repo-compatibility-checker`, `gates-scan`, and
  `project-context-ledger` are validated.
- **Resolution:** do not run self-use tools during context gathering before
  Phase 13 artifacts exist beyond this context. Planning and execution should
  run relevant tools after adding rollup code/docs/registry changes. If the
  rollup becomes runnable in Phase 13, verification should run it over at least
  two existing self-use packet directories as evidence.

### Cross-Repo Incoming Review Gate

- **Gate:** `cross-repo-incoming`
- **Status:** skipped with reason.
- **Reason:** no incoming cross-repo request asks for Phase 13 scope. The
  phase remains AI Tools-owned packet consumption work and does not mutate
  `ai-workspace-kit`.

### Git Baseline Gate

- **Gate:** `git-baseline`
- **Status:** resolved with caveat.
- **Evidence:** `git status --short` showed active uncommitted v2.1 planning
  updates and `.planning/seeds/SEED-001-real-project-evidence-baseline.md`
  before Phase 13 context was written.
- **Classification:** active planning work, not unrelated baseline noise. Do
  not use git cleanliness as verification evidence until these planning
  artifacts are intentionally staged or committed.

## Implementation Decisions

### CLI Shape

- **D-01:** Use the user-facing CLI name `review-packet-rollup`.
- **D-02:** Prefer the roadmap command shape:
  `review-packet-rollup --packets <dir...> --out <dir>`.
- **D-03:** `--packets` consumes two or more following packet directories until
  the next flag. Reject fewer than two packet directories.
- **D-04:** Require `--out`; reject output paths inside or equal to any input
  packet directory with `assertSafeOutputDirOutsideAll`.
- **D-05:** Reject mutating or source-running flags such as `--fix`, `--write`,
  `--pull`, `--fetch`, `--install`, `--run`, and `--execute`.
- **D-06:** Keep the Phase 13 CLI small: support `--help` and human completion
  stdout. `--format json`, `--quiet`, and `--fail-on` belong to Phase 17 unless
  planning finds a very small shared helper reuse that does not expand scope.

### Input Validation

- **D-07:** Treat `REVIEW-SUMMARY.json` and `EVIDENCE.json` as the required
  machine inputs for each packet directory.
- **D-08:** Validate `REVIEW-SUMMARY.json` against
  `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json`.
- **D-09:** Validate each `EVIDENCE.json` entry against
  `standards/review-packet/schemas/EVIDENCE-REF.schema.json`; there is no
  separate `EVIDENCE.schema.json` in the current standard.
- **D-10:** Do not require Markdown packet projections for rollup input. If
  `FINDINGS.md` or `RECOMMENDED-ACTIONS.md` is missing, record it as
  provenance/status metadata only if needed; do not block aggregation.
- **D-11:** If any required input packet JSON is missing, unreadable,
  malformed, or schema-invalid, emit a blocked finding and mark the rollup
  packet `blocked`, because the aggregate is not fully trustworthy.
- **D-12:** Valid packets should still be indexed and grouped even when another
  input packet is invalid, so humans can see partial evidence plus the blocker.

### Source Finding Normalization

- **D-13:** Preserve source findings as rollup findings instead of replacing
  them with one prose summary. This keeps the rollup mechanically useful and
  lets `REVIEW-SUMMARY.json` counts represent combined source findings.
- **D-14:** Generate stable rollup finding IDs by prefixing a deterministic
  packet id and source finding index/id, because current source packets may
  reuse finding ids such as `drift.file.missing`.
- **D-15:** Preserve source severity, confidence, `source_check_id`, and
  `status_contribution` for valid source findings.
- **D-16:** Prefix source evidence refs and recommended action refs with the
  packet id in the rollup finding, and emit corresponding rollup evidence refs
  in `EVIDENCE.json`.
- **D-17:** Do not add extra fields to findings; the finding schema has
  `additionalProperties: false`. Put provenance and source-specific metadata in
  `PACKET-INDEX.json` and `ROLLUP-GROUPS.json`.

### Rollup Artifacts

- **D-18:** Emit standard packet artifacts via `shared/review-packet-renderer`:
  `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md`.
- **D-19:** Emit `PACKET-INDEX.json` with one record per input packet:
  deterministic packet id, normalized input path, input artifact hashes,
  validation status, source tool name, source tool version, schema version,
  source status, counts, generated artifacts, and any parse/validation errors.
- **D-20:** Emit `ROLLUP-GROUPS.json` with mechanical group arrays:
  `by_tool`, `by_status`, `by_severity`, `by_source_check_id`,
  `by_status_contribution`, and `by_source_path`.
- **D-21:** Group entries should include counts, packet ids, finding refs, and
  evidence refs. They should not include semantic labels such as
  "safe_to_ignore", "new", "important", or "priority".
- **D-22:** Sort group arrays and refs deterministically by stable keys and
  counts so output is snapshot-friendly without pretending to rank business
  importance.

### Source Path Grouping

- **D-23:** Source path grouping should be based on validated source
  `EVIDENCE.json` refs, not ad hoc path parsing from finding summaries.
- **D-24:** A finding with multiple evidence refs may appear in multiple
  `by_source_path` groups. Group counts should record unique finding refs per
  group so the duplication is explicit.
- **D-25:** If a finding has no evidence refs or refs that cannot be resolved
  in the source packet, group it under a deterministic `unknown` source path
  bucket and emit a low or medium validation finding depending on severity.

### Status And Counts

- **D-26:** The rollup packet status is derived mechanically:
  `blocked` if any blocker exists or any finding contributes `blocked`;
  `human_review_required` if any finding contributes `human_review_required`;
  `info` if only informational findings exist; otherwise `pass`.
- **D-27:** Combined counts come from normalized rollup findings and copied
  blocker/required-decision arrays, not from hand-written count math. Use
  `deriveCounts` / renderer validation so JSON, Markdown, and CLI status cannot
  drift.
- **D-28:** Copy source `blockers`, `required_decisions`,
  `rejected_assumptions`, and `preserved_stricter_local_rules` into rollup
  equivalents with deterministic prefixed ids and source packet attribution.

### Safety And Boundaries

- **D-29:** `review-packet-rollup` reads packet output directories only. It
  does not scan target projects, run source tools, install dependencies, pull
  repositories, or mutate any target project.
- **D-30:** Treat packet evidence as already-produced review material. Do not
  read secret-like target files referenced by source packets.
- **D-31:** Output must be canonical JSON with trailing newlines, and tests must
  prove deterministic output with a fixed clock.
- **D-32:** Register the tool as a packet consumer in `tools/registry.json`.
  If the existing schema only models producers, Phase 13 may minimally extend
  the registry to distinguish producer vs consumer without changing validated
  producer semantics.

### Fixtures And Validation

- **D-33:** Build fixtures from small synthetic packet directories, not from
  real self-use outputs as the primary oracle.
- **D-34:** Minimum fixture set: two valid packets with overlapping severities
  and source paths; duplicate source finding ids; one invalid or missing
  required JSON artifact; one packet with blockers and required decisions; one
  packet with multiple evidence refs per finding.
- **D-35:** Integration tests should prove external output isolation, input
  packets are not mutated, required artifacts are emitted, invalid packet input
  produces a blocker, and generated packet JSON validates against the current
  schemas.
- **D-36:** Verification should run the rollup over at least two existing
  self-use packet directories after implementation, but real repo self-use is
  evidence only and not the only test.

### Agent Discretion

The planner may choose exact module boundaries, such as `cli.js`, `index.js`,
`discovery.js`, `validate-packet.js`, `normalize.js`, `groups.js`, and
`provenance.js`. The implementation should favor small pure functions and
fixtures over broad abstractions. If a shared packet validator helper is useful
for future phases, it may live in `shared/`, but Phase 13 should avoid turning
rollup into the full Phase 17 CLI contract work.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 13 goal, dependency, success criteria, plan
  split, and v2.1 Gate Resolution.
- `.planning/REQUIREMENTS.md` - ROLLUP-01 through ROLLUP-06 and traceability.
- `.planning/PROJECT.md` - current v2.1 milestone goal, active requirements,
  key decisions, review-only boundary, and optional `ai-workspace-kit` boundary.
- `.planning/STATE.md` - current Phase 13 readiness and active planning state.
- `.planning/seeds/SEED-001-real-project-evidence-baseline.md` - future
  portfolio scan seed that depends on rollup output but is out of scope for
  Phase 13.

### Prior Decisions

- `.planning/phases/12-project-context-ledger-mvp/12-CONTEXT.md` - latest
  packet-producing tool context, shared artifact decisions, safety boundaries,
  and validation expectations.
- `.planning/phases/11-v2-tool-selection-review/11-CONTEXT.md` - evidence
  selection, deferred tools, and ledger/forensics ordering rationale.
- `.planning/phases/10-evidence-only-gate-linter-seed-mvp/10-CONTEXT.md` -
  evidence-only scanner boundary, status mapping, fixture strategy, and
  registry maturity rules.

### Review Packet Standard

- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json` - required
  summary shape, status values, counts, generated artifacts, and embedded
  finding validation.
- `standards/review-packet/schemas/FINDING.schema.json` - finding shape and
  `additionalProperties: false` constraint.
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json` - evidence ref
  shape; validates entries inside `EVIDENCE.json`.
- `standards/review-packet/schemas/RECOMMENDED-ACTION.schema.json` - action
  shape if rollup copies source recommended actions.
- `standards/review-packet/schemas/TOOL-MANIFEST.schema.json` - tool manifest
  metadata.
- `standards/review-packet/examples/` - existing packet examples for valid
  artifact shape and canonical JSON expectations.

### Shared Implementation Patterns

- `shared/review-packet-renderer.js` - render standard packet artifacts and
  validate count consistency from one summary model.
- `shared/tool-metadata.js` - packet artifact constants, package version, tool
  names, and policy hash pattern.
- `shared/path-guard.js` - `assertSafeOutputDirOutsideAll` for rejecting output
  inside input packet dirs.
- `shared/canonical-json.js` - deterministic JSON output.
- `shared/tree-hash.js` - non-mutation proof for fixture packet directories.
- `tools/contract-drift-auditor/cli.js` - richer CLI parsing, JSON stdout, and
  fail policy; Phase 13 should not fully copy Phase 17 concerns.
- `tools/gates-scan/cli.js` - small `--project` / `--out` CLI pattern and
  mutating flag rejection.
- `tools/gates-scan/index.js` - packet status, manifest, policy hash, and
  shared renderer integration.
- `tools/cross-repo-compatibility-checker/index.js` - multi-input output
  isolation and shared renderer integration.

### Tests And Fixtures

- `test/contract-drift-auditor/schema-output.test.js` - AJV setup for review
  packet schemas and evidence ref validation.
- `test/gates-scan/integration.test.js` - fixture-driven packet-producing CLI
  pattern.
- `test/cross-repo-compatibility-checker/integration.test.js` - multi-root
  output isolation and packet validation pattern.
- `test/shared/fixture-helpers.js` - temp output and fixture helpers.
- `test/shared/safety-harness.test.js` - target non-mutation and secret
  non-leakage expectations.
- `test/planning/tool-registry.test.js` - registry shape and maturity
  validation that will need updates for a packet consumer.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `shared/review-packet-renderer.js` already derives counts from findings and
  validates count consistency before rendering JSON or Markdown.
- `shared/path-guard.js` already supports `assertSafeOutputDirOutsideAll`,
  which matches rollup's multiple input packet directories.
- `shared/canonical-json.js` and existing schema-output tests already prove
  deterministic JSON patterns with fixed clocks.
- Existing tool manifests use package version, policy hashes, requested
  outputs, generated files, run timestamp, safety profile, and schema versions.
- Current CLIs are CommonJS Node entrypoints with explicit inputs, external
  outputs, mutating flag rejection, and no runtime services.

### Established Patterns

- Packet status is derived mechanically from findings and blockers.
- JSON artifacts are the machine source of truth; Markdown artifacts are
  projections.
- Synthetic fixtures cover broken cases; real repo self-use is verification
  evidence only.
- Registry maturity must remain truthful: planned before implementation,
  implemented after CLI/docs/tests exist, validated after focused/full tests and
  self-use evidence.
- Current tools are producers. Phase 13 introduces a consumer, so registry
  wording may need a minimal compatible extension.

### Integration Points

- Add `tools/review-packet-rollup/` with CLI, runner, packet validation,
  normalization, grouping, README, and fixtures.
- Add package `bin` and npm script for `review-packet-rollup` only after the
  CLI exists.
- Update `tools/registry.json` and registry tests so rollup is clearly a
  packet consumer, not a domain auditor.
- Update `shared/tool-metadata.js` with a rollup tool name and rollup-specific
  artifact list if implementation follows existing metadata style.
- Add tests under `test/review-packet-rollup/` and fixtures under
  `test/fixtures/review-packet-rollup/`.
- Update `README.md`, `tools/README.md`, and `CHANGELOG.md` if Phase 13
  execution adds the user-facing command.

</code_context>

<specifics>
## Specific Ideas

- Prefer "packet consumer" language throughout docs and registry. Avoid calling
  rollup an auditor.
- `PACKET-INDEX.json` should answer: which packet dirs were read, were they
  valid, what tool/schema/status/counts did they report, and what hashes prove
  provenance?
- `ROLLUP-GROUPS.json` should answer: where are findings concentrated by
  mechanical dimensions, without deciding priority or disposition?
- Invalid packet input should block trust in the rollup while still preserving
  partial valid input evidence for human review.
- Phase 13 should create the foundation for the future real project portfolio
  scan seed, but it should not implement portfolio manifests or real project
  scanning.

</specifics>

<deferred>
## Deferred Ideas

- Review disposition / suppression / safe-to-ignore policy belongs to Phase 15.
- Ledger scope/diff behavior belongs to Phase 16.
- Shared CLI contract across all tools belongs to Phase 17 unless a very small
  helper is needed locally.
- ai-workspace-kit LLM instruction compatibility belongs to Phase 18.
- Real project portfolio scan belongs to
  `.planning/seeds/SEED-001-real-project-evidence-baseline.md` after v2.1
  foundations exist.
- Semantic ranking, "top actionable" interpretation, auto-running source tools,
  gate approval, merge decisions, roadmap mutation, target mutation, and package
  installs are out of scope.

</deferred>

---

*Phase: 13-Review Packet Rollup MVP*
*Context gathered: 2026-05-08*
