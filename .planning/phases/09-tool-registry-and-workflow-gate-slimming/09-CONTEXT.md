---
phase: 9
name: Tool Registry and Workflow Gate Slimming
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - REG-01
  - GOV-01
depends_on:
  - Phase 7 Cross-Repo Compatibility Checker MVP
---

# Phase 9: Tool Registry and Workflow Gate Slimming - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 9 creates the machine-readable registry that tells future agents which AI
Tools capabilities exist, where they live, who owns them, when they should be
used, and what they must not do. It also slims root `AGENTS.md` by moving
detailed workflow gate policy into focused gate documentation while preserving
hard safety rules and source-layer pointers.

This phase must not implement `gates-scan`, a new auditor, a runtime indexer,
or any `ai-workspace-kit` adoption/bootstrap behavior. The registry is
governance and planning evidence; it is not a runner and does not auto-execute
tools.
</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- Gate: `discuss-mode`
- Status: passed
- Resolution: Trusted Self-Questioning
- Selected by: user
- Approval source: user replied `2` after the Phase 9 discuss-mode prompt on
  2026-05-08.
- Evidence:
  - `.planning/gates/registry.json` records `discuss-mode` as a non-skippable
    discuss-stage gate.
  - `AGENTS.md` states `$gsd-discuss-phase` must resolve Manual Questions vs
    Trusted Self-Questioning before gray-area analysis or artifact writes.
  - `workflow.discuss_mode=discuss` was treated as routing only, not approval
    evidence.
- Cycle limits: one focused self-questioning pass over registry shape, registry
  placement, self-use integration, AGENTS slimming, and Phase 10 boundary.
- Skip reason: not skipped.

### Cross-Repo Incoming Review Gate

- Gate: `cross-repo-incoming`
- Status: passed
- Resolution: existing incoming requests support the need for clearer tool/gate
  governance, but do not change Phase 9 into gate-linter implementation.
- Evidence:
  - `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`
- Decision: Phase 9 may register future `gates-scan` / `GATELINT-01` and define
  its use boundary, but implementation remains Phase 10.

### AI Tools Self-Use Gate

- Gate: `self-use`
- Status: passed with planning-stage follow-up.
- Capabilities considered:
  - `contract-drift-auditor`: validated.
  - `cross-repo-compatibility-checker`: validated.
- Resolution: do not run tools during discuss because no artifacts have changed
  yet. Phase 9 planning/execution should run self-use evidence after changing
  registry, gates, or `AGENTS.md`:
  - run `contract-drift-auditor` after slimming `AGENTS.md` or changing workflow
    gate docs;
  - run `cross-repo-compatibility-checker` after changing gate registry docs or
    interop-relevant gate references.
- Note: self-use output remains evidence only.

### New Tool Intake and Placement Gate

- Gate: `new-tool-intake`
- Status: passed
- Resolution: Phase 9 introduces a registry/governance artifact, not a new
  runnable external tool. It may register planned/deferred tools and seed-only
  ideas but must not implement them.
- Owner classification: AI Tools owns the registry for its external auditors,
  validators, shared packet mechanics, and deferred seed tools.
- Boundary: `ai-workspace-kit` adoption/bootstrap, adapter guidance, generated
  contract review, and permission policy remain kit-owned.

### Git Baseline Gate

- Gate: `git-baseline`
- Status: passed at discuss start.
- Evidence: `git status --short` returned clean before Phase 9 artifacts were
  written.

## Trusted Self-Questioning Results

### What is the registry source of truth?

Use a product-level machine-readable registry under `tools/`, not only prose in
`AGENTS.md` or phase docs. Preferred files:

- `tools/registry.json` - machine-readable registry source of truth.
- `tools/registry.schema.json` - JSON schema for registry validation.
- `test/planning/tool-registry.test.js` or equivalent - validation of schema,
  required entries, package/bin consistency, and deferred seed coverage.

Reason: the registry describes AI Tools capabilities, so it belongs beside the
tool namespace. Workflow gates can reference it from `AGENTS.md` and focused
gate docs without making it a hidden planning-only artifact.

### What should registry entries contain?

Each entry should be explicit enough for self-use and new-tool-intake gates:

- `id`: stable slug such as `contract-drift-auditor`.
- `owner`: `ai-tools`, `ai-workspace-kit`, or `shared-boundary`.
- `destination`: implementation/docs path or planned destination.
- `maturity`: `validated`, `implemented`, `planned`, `seed-only`, or
  `deferred`.
- `activation_stage`: array of stages such as `discuss`, `research`, `plan`,
  `execute`, `verify`, `phase-boundary`, `release`, or `maintenance`.
- `expected_outputs`: review packet artifacts, docs, schema, or `none`.
- `use_gate`: gate id or short rule that decides when to use it.
- `self_use`: object with `required` boolean and stages/reason.
- `non_goals`: explicit boundaries, especially no mutation, no auto-run, no
  kit-owned behavior.
- `evidence_refs`: paths proving the entry is real, planned, or deferred.

The planner may add optional fields such as `cli`, `package_bin`,
`requirements`, `phase`, `status_notes`, or `compatible_packet_standard` when
tests can validate them without making the schema noisy.

### Which initial entries are required?

Minimum registry coverage should include:

- `contract-drift-auditor`: validated; runnable CLI; self-use for contract or
  source-layer changes, release readiness, and AGENTS/gate docs changes.
- `cross-repo-compatibility-checker`: validated; runnable CLI; self-use before
  automatic cross-repo indexer/gate-linter automation and after protocol/gate
  interop changes.
- `gates-scan` or `gate-linter`: planned Phase 10; evidence-only; no semantic
  adoption decisions.
- `tool-registry`: active Phase 9 governance artifact; no external target
  mutation and no auto-execution.
- deferred seed tools from `tools/*/SEED-IDEAS.md`, including ledger,
  forensics, config matrix, runtime capability, skill linter, test quality, UI
  regression, domain contract test generator, and local integration harness.
- `ai-workspace-kit-internal-gates`: kit-owned boundary entry; not implemented
  here unless a future cross-repo decision reclassifies a narrow external
  evidence capability.

### How should `AGENTS.md` be slimmed?

`AGENTS.md` should remain the first file an agent reads, but it should stop
carrying full gate policy bodies. Keep:

- generated-source/source-layer warning;
- project purpose and hard safety rules;
- source layer list;
- mandatory preflight rule for `discuss-mode`;
- pointers to `.planning/gates/registry.json`,
  `.planning/gates/WORKFLOW-GATES.md`, `tools/registry.json`, and
  `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`;
- short non-negotiables: read-only default, no secret contents, no target
  mutation, no kit-owned duplication, no automatic tool execution.

Move detailed prose for upstream freshness, changelog, git baseline, self-use,
new-tool intake, future gate review, and tandem boundary into
`.planning/gates/WORKFLOW-GATES.md`. The moved docs should preserve enough
detail for future agents and tests to find required phrases.

### How does Phase 9 avoid becoming Phase 10?

Phase 9 may define the registry entry, use gate, output expectations, and
non-goals for `gates-scan` / `GATELINT-01`. It must not implement a linter,
fixtures, CLI, findings, or review packet output for it. Any tests in Phase 9
should validate registry/docs shape only.

### What should validation prove?

Phase 9 validation should prove:

- `tools/registry.json` validates against its schema.
- Implemented runnable tools in `package.json` `bin` and scripts have registry
  entries.
- Validated tools have expected review packet artifacts and self-use rules.
- Seed/deferred tools are represented or deliberately excluded with a reason.
- `AGENTS.md` links to focused gate docs instead of duplicating full gate
  bodies.
- Focused gate docs preserve discuss-mode, upstream freshness, changelog,
  self-use, new-tool intake, git-baseline, cross-repo, and future gate-review
  semantics.
- No Phase 9 test expects `gates-scan` to exist.

## Implementation Decisions

### D-01: Registry Location

Create the machine-readable registry at `tools/registry.json` with schema at
`tools/registry.schema.json` unless research finds a strong local reason to use
an adjacent filename. Keep it in the `tools/` namespace because it describes
AI Tools capabilities, not just GSD phase state.

### D-02: Registry Shape

Use explicit entries with owner, destination, maturity, activation stage,
expected outputs, non-goals, use gate, self-use policy, and evidence refs. Keep
the schema small but strict enough that future agents cannot silently add vague
tool entries.

### D-03: Maturity and Self-Use

Separate maturity from self-use:

- maturity says whether the capability is `validated`, `implemented`,
  `planned`, `seed-only`, or `deferred`;
- `self_use.required` and `self_use.stages` say when AI Tools should run it
  while developing itself.

Do not encode `self-use-required` only as a maturity value, because a validated
tool can be self-use-required only for specific stages.

### D-04: Initial Registry Entries

Seed the registry with all implemented tools, planned near-term tools, and
deferred seeds. At minimum include `contract-drift-auditor`,
`cross-repo-compatibility-checker`, `gates-scan` / `GATELINT-01`,
`tool-registry`, and the deferred seed tool directories listed in
`tools/README.md`.

### D-05: AGENTS Slimming Destination

Move detailed gate policy prose from `AGENTS.md` to
`.planning/gates/WORKFLOW-GATES.md`. Keep `AGENTS.md` as a concise entrypoint
with hard rules and links. Do not remove the explicit discuss-mode preflight
rule from `AGENTS.md`; that rule is safety-critical and has already prevented
artifact writes before user approval.

### D-06: Cross-Repo Boundary

Do not make the registry a copy of `ai-workspace-kit` tooling policy. It should
record AI Tools-owned and boundary capabilities, including kit-owned entries
only to prevent duplication and route requests.

### D-07: Phase 10 Boundary

Do not implement `gates-scan` in Phase 9. Register it as planned/evidence-only
and leave CLI/check implementation to Phase 10.

### D-08: Self-Use During Execution

After registry/gate docs/AGENTS changes, Phase 9 execution should run relevant
validated tools as evidence:

- `contract-drift-auditor --project . --out <external-dir> --format json
  --fail-on never`;
- `cross-repo-compatibility-checker --ai-tools . --ai-workspace-kit <path>
  --out <external-dir>` when gate registry or interop docs changed.

Record status, finding counts, output paths, and interpretation. Findings are
evidence, not automatic blockers.

### the agent's Discretion

The planner may choose exact test filenames and optional registry fields if the
choices stay deterministic, schema-validated, and small. Prefer adding focused
docs/registry tests over broad prose snapshots.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope

- `.planning/ROADMAP.md` - Phase 9 goal, requirements, success criteria, and
  Phase 10 boundary.
- `.planning/REQUIREMENTS.md` - `REG-01` and `GOV-01`.
- `.planning/PROJECT.md` - active registry requirement, self-use gate,
  new-tool intake gate, and optional `ai-workspace-kit` boundary.
- `.planning/STATE.md` - current milestone position and Phase 9 focus.
- `.planning/phases/06-release-closeout-and-tool-metadata/06-CONTEXT.md` -
  explicitly defers tool registry and AGENTS slimming to Phase 9.
- `.planning/phases/07-cross-repo-compatibility-checker-mvp/07-CONTEXT.md` -
  cross-repo checker scope, gate registry interop, and evidence-only boundary.
- `.planning/phases/08-contract-drift-auditor-cli-ergonomics/08-CONTEXT.md` -
  CLI ergonomics boundary and explicit deferral of registry/gates-scan.

### Current Registry and Gate Sources

- `AGENTS.md` - current root assistant contract to slim; preserve hard rules
  and discuss-mode preflight.
- `.planning/gates/registry.json` - current machine-readable gate registry.
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` - cross-repo gate
  routing, request/decision playbook, and non-automation boundaries.
- `tools/README.md` - current seed directory list and new-tool intake guidance.
- `tools/tool-usage-registry/SEED-IDEAS.md` - seed idea for tool usage
  registry and phase mapping.
- `tools/ai-workspace-kit-internal-gates/SEED-IDEAS.md` - kit-owned boundary
  seed; useful as a non-duplication entry.

### Implemented Tools and Metadata

- `package.json` - current `bin` and npm scripts for implemented CLIs.
- `shared/tool-metadata.js` - existing tool-name constants, packet artifact
  names, schema version, and package version helper.
- `tools/contract-drift-auditor/README.md` - validated auditor usage,
  boundaries, and self-use-relevant behavior.
- `tools/cross-repo-compatibility-checker/README.md` - validated checker usage,
  boundaries, and non-goals.
- `test/planning/release-docs.test.js` - existing docs validation style.
- `test/planning/discuss-mode-gate.test.js` - existing enforcement tests for
  discuss-mode gate wording.
- `test/planning/cross-repo-protocol.test.js` - existing registry/protocol
  docs validation patterns.

### Upstream and Compatibility Evidence

- `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md` - latest upstream
  freshness findings and kit registry/protocol compatibility notes.
- `.planning/research/GATES-SCAN-ROADMAP-REVIEW.md` - prior recommendation on
  `GATELINT-01` / `gates-scan` scope and ordering.
- `CHANGELOG.md` - downstream freshness evidence; update after execution.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `shared/tool-metadata.js`: already centralizes implemented tool names, packet
  artifact constants, schema version, policy hash source paths, and package
  version lookup. Phase 9 should not force this file to become the whole tool
  registry, but registry tests may cross-check it.
- `package.json`: exposes two runnable CLIs in `bin` and scripts. Registry
  tests should require implemented tool entries to match these names.
- `.planning/gates/registry.json`: already uses strict gate entry fields,
  interop mapping, stage aliases, and skip semantics. Its structure is a good
  pattern for `tools/registry.json` without copying gate-specific fields.
- `test/planning/cross-repo-protocol.test.js` and
  `test/planning/discuss-mode-gate.test.js`: established pattern for validating
  governance artifacts with `node:test`.

### Established Patterns

- Machine-readable governance artifacts are JSON plus focused tests.
- Cross-repo compatibility uses explicit mapping instead of pretending schemas
  are identical.
- Tool output is evidence, not an automatic decision.
- Seed ideas live under `tools/<tool-name>/SEED-IDEAS.md` until promoted.
- Root docs should point to canonical machine-readable sources instead of
  duplicating long policy bodies.

### Integration Points

- `AGENTS.md` should link to `tools/registry.json` for tool maturity and
  self-use routing.
- `.planning/gates/WORKFLOW-GATES.md` should become the detailed prose home for
  gate policies currently embedded in `AGENTS.md`.
- `tools/README.md` should reference the registry as the current capability
  catalog.
- Future Phase 10 `gates-scan` should be able to read the registry as input,
  but Phase 9 must not implement that scanner.
</code_context>

<specifics>
## Specific Ideas

- Treat `tools/registry.json` like the capability catalog and
  `.planning/gates/registry.json` like the workflow gate catalog. They should
  reference each other by ids, not merge into one file.
- Add a kit-owned boundary entry for `ai-workspace-kit-internal-gates` so
  future agents see that it is intentionally not an AI Tools implementation
  target.
- Preserve the discuss-mode preflight rule directly in `AGENTS.md`; it is small
  and critical enough not to hide only in linked docs.
</specifics>

<deferred>
## Deferred Ideas

- Implementing `gates-scan` / `GATELINT-01` remains Phase 10.
- Choosing the next broad seed tool remains Phase 11.
- Applying Phase 8 CLI ergonomics flags to
  `cross-repo-compatibility-checker` remains a future consistency improvement,
  not Phase 9 scope.
</deferred>

---

*Phase: 9-Tool Registry and Workflow Gate Slimming*
*Context gathered: 2026-05-08*
