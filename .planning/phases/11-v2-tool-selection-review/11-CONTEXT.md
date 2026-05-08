---
phase: 11
name: v2 Tool Selection Review
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - LEDGER-01
  - FORENSICS-01
  - CONFIG-01
  - SKILL-01
  - TESTQA-01
  - UIREG-01
depends_on:
  - Phase 10 Evidence-Only Gate Linter Seed MVP
---

# Phase 11: v2 Tool Selection Review - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 11 reviews deferred seed tools and chooses at most one next implementation
candidate from evidence. It does not implement the selected tool. It should
produce a clear selection decision, keep non-selected tools deferred with
reasons, and make the promoted candidate specific enough for a later planning
phase to implement without reopening ownership, output, or fixture questions.

The phase should prefer evidence from this repository: roadmap history,
validated tool self-use output, changelog entries, cross-repo requests,
registry metadata, seed files, and repeated project pain. Interesting tools
without repeated demand remain deferred.

</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- Gate: `discuss-mode`
- Status: passed
- Resolution: Trusted Self-Questioning
- Selected by: user
- Approval source: user replied `2` after the Phase 11 discuss-mode prompt on
  2026-05-08.
- Evidence:
  - `.planning/gates/registry.json` records `discuss-mode` as a non-skippable
    discuss-stage gate.
  - `AGENTS.md` states `$gsd-discuss-phase` must resolve Manual Questions vs
    Trusted Self-Questioning before gray-area analysis or artifact writes.
  - `workflow.discuss_mode=discuss` was treated as routing only, not approval
    evidence.
- Cycle limits: one focused self-questioning pass over candidate scoring,
  promotion threshold, selected tool, non-selected tool disposition,
  implementation boundary, and validation artifacts.
- Skip reason: not skipped.
- `workflow.discuss_mode` is routing only: yes.

### Cross-Repo Incoming Review Gate

- Gate: `cross-repo-incoming`
- Status: passed
- Resolution: existing incoming requests do not request a new Phase 11 tool.
  They remain evidence that external tools must be optional, review-only, and
  routed through explicit decisions.
- Evidence:
  - `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
  - `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
  - `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
- Decision: no new incoming request is folded into Phase 11.

### AI Tools Self-Use Gate

- Gate: `self-use`
- Status: passed with execution-stage follow-up.
- Capabilities considered:
  - `contract-drift-auditor`: validated, applies if Phase 11 changes contracts,
    registry, roadmap, or docs.
  - `cross-repo-compatibility-checker`: validated, applies only if cross-repo
    protocol or interop-relevant docs change.
  - `gates-scan`: validated, applies if Phase 11 changes workflow gates,
    phase-boundary docs, or gate-related registry/docs.
- Resolution: do not run tools during context gathering before artifacts exist.
  Phase 11 execution should run relevant self-use tools after selection docs,
  registry, roadmap, or changelog changes. Tool output remains evidence only.

### New Tool Intake and Placement Gate

- Gate: `new-tool-intake`
- Status: passed for discuss context.
- Owner classification: candidate tools remain AI Tools-owned external
  read-only evidence producers unless a later research step finds a specific
  kit-owned boundary.
- Decision: Phase 11 may promote exactly one candidate from deferred to planned
  with owner, destination, activation stage, outputs, non-goals, and fixture
  seed defined. It must not add a package bin or implement the CLI.

### Git Baseline Gate

- Gate: `git-baseline`
- Status: passed with caveat.
- Evidence: `git status --short` showed active uncommitted Phase 10 work and
  current Phase 11 discussion artifacts in progress.
- Classification: active work, not a clean baseline. Do not use git cleanliness
  as verification evidence until Phase 10/11 artifacts are explicitly handled.

## Trusted Self-Questioning Results

### What evidence should decide the next tool?

Use an evidence-weighted selection matrix, not personal preference or broad
ecosystem appeal. Score each candidate against:

- repeated project pain in changelog, verification, self-use, or phase history;
- fit with current validated infrastructure: review packets, path guard,
  ignore policy, secret policy, canonical JSON, fixture hashing, and registry;
- usefulness to this repository's next work;
- ownership clarity under the AI Tools / `ai-workspace-kit` boundary;
- implementation size for a small review-only MVP;
- whether the tool needs external services, browsers, devices, or target
  runtime execution.

### Which candidate should be promoted?

Promote `project-context-ledger` as the single next implementation candidate.

Reasons:

- It appears in the original recommended build order immediately after
  `contract-drift-auditor` and before phase forensics.
- This repository repeatedly spends context on the same project facts,
  decisions, commands, packet artifacts, and source-layer evidence during
  discuss, plan, verify, self-use, and resume workflows.
- Phase 4 through Phase 10 self-use repeatedly produced noisy or historical
  findings that required assistant interpretation. A verified ledger can reduce
  repeated broad reads and point agents to current facts while preserving
  evidence refs.
- It reuses existing primitives directly: file walking, secret policy,
  path-only evidence, canonical JSON, review packet renderer, package/tool
  metadata, and fixture tree hashing.
- It stays review-only. The ledger should summarize and index facts; it must
  not mutate target projects or replace reading relevant source files.

### What is the promotion boundary?

Phase 11 should promote `project-context-ledger` from deferred to planned, not
implemented or validated. It may update registry metadata, write a selection
review artifact, and define the future MVP contract. It should not add a
package bin, CLI files, generated ledger output, or implementation tests beyond
docs/registry selection validation.

Future implementation should be a separate phase, likely a new Phase 12 or next
milestone entry.

### What should the future ledger MVP include?

The promoted candidate should target a small read-only MVP:

- CLI shape: `project-context-ledger --project <path> --out <dir>` unless
  later planning finds a better local name.
- Output: the shared review packet artifacts plus ledger-specific JSON files:
  `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`,
  `DECISIONS.json`, `EVIDENCE.json`, and `CACHE-MANIFEST.json`.
- Fact model: value, evidence refs, confidence (`verified`, `inferred`,
  `unknown`, `stale`), source hash, and last checked timestamp.
- Scope: project facts, commands, assistant contracts, skills, decisions,
  current planning state, implemented tools, and generated packet references.
- Non-goal: do not replace reading relevant source code; the ledger is an
  evidence index and briefing aid.
- First fixture: a mature AI-tools-like project with `AGENTS.md`, `.planning`,
  package scripts, seed tools, one stale fact, one missing referenced command or
  file, one secret-like path, and generated review packet output that must be
  ignored.

### Why not phase forensics next?

Keep `phase-forensics-tool` deferred. It is a strong later candidate, but it is
most valuable after failed execution, surprising review results, user
corrections, rollbacks, or repeated plan/reality mismatches. This repo's recent
phases have completed cleanly with tests and verification evidence. Build the
ledger first so a future forensics tool has a verified fact/evidence substrate.

### Why not config, skill, test, UI, runtime, integration, or domain tools now?

- `config-matrix-validator`: defer until config-heavy project evidence or
  environment refactors appear.
- `skill-linter`: defer until this repo starts publishing or maintaining
  project-local skills as first-class artifacts.
- `test-quality-auditor`: defer until repeated shallow-test or missed-behavior
  evidence exists. Current phases have focused fixture and schema tests.
- `ui-regression-screenshot-comparator`: defer because this repository has no
  frontend surface.
- `runtime-capability-inspector`: defer because current tools do not depend on
  hardware, ports, browser APIs, or local services.
- `local-integration-harness`: defer because it is heavier and project-specific;
  useful after runtime capability evidence exists.
- `domain-contract-test-generator`: defer until stable domain contract formats
  or domain-heavy products create repeated need.

## Implementation Decisions

### D-01: Selection Method

Use a documented evidence matrix for all deferred seed tools. The matrix should
include local evidence, current pain, dependency on existing primitives,
implementation size, ownership clarity, and trigger conditions for future
promotion.

### D-02: Selected Candidate

Promote only `project-context-ledger` as the next implementation candidate.
Do not promote multiple tools in Phase 11.

### D-03: Promotion Level

Promotion means `planned` and implementation-ready, not runnable. Registry,
roadmap, and selection artifacts may change. No CLI, package bin, or tool code
should be added in Phase 11.

### D-04: Non-Selected Tools

Leave `phase-forensics-tool`, `config-matrix-validator`, `skill-linter`,
`test-quality-auditor`, `ui-regression-screenshot-comparator`,
`runtime-capability-inspector`, `local-integration-harness`, and
`domain-contract-test-generator` deferred with explicit reasons and future
trigger evidence.

### D-05: Future Ledger Boundaries

The ledger must be read-only, evidence-backed, secret-safe, deterministic, and
packet-compatible. It must not become a cache that hides relevant source files
from agents, a target-project mutator, or an `ai-workspace-kit` dependency.

### D-06: Phase 11 Artifacts

The plan should create or update:

- a phase-local selection review artifact, preferably
  `.planning/phases/11-v2-tool-selection-review/11-SELECTION-REVIEW.md`;
- `tools/registry.json` entries for the selected and non-selected candidates;
- roadmap/requirements/state as needed to represent the promoted next phase or
  planned candidate;
- `CHANGELOG.md` if registry, roadmap, workflow, or milestone scope changes.

### D-07: Validation

Validation should be docs/registry-focused:

- registry schema and tool-registry tests pass;
- docs or selection-review tests prove one candidate was promoted and others
  remained deferred with reasons;
- full `npm.cmd test` passes;
- relevant self-use packets run after final artifact changes when applicable.

### the agent's Discretion

The planner may choose exact field names for the selection matrix and whether
to add a focused `test/planning/tool-selection.test.js`, as long as the test
guards against promoting multiple deferred tools at once.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning.**

### Planning Scope

- `.planning/ROADMAP.md` - Phase 11 goal, requirements, success criteria, and
  one-plan boundary.
- `.planning/REQUIREMENTS.md` - `LEDGER-01`, `FORENSICS-01`, `CONFIG-01`,
  `SKILL-01`, `TESTQA-01`, and `UIREG-01` traceability.
- `.planning/PROJECT.md` - active requirement to keep broad seed tools deferred
  until evidence-backed v2 tool selection promotes one next candidate.
- `.planning/STATE.md` - current milestone position and deferred items.
- `CHANGELOG.md` - repeated self-use and phase history evidence.
- `docs/INITIAL-SEED-OVERVIEW.md` - original recommended build order and
  external tool boundary.
- `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md` - later-tool guidance, ledger shape,
  safety contract, and review packet integration.

### Registry and Seeds

- `tools/registry.json` - current maturity, ownership, outputs, activation
  stage, self-use, and non-goals for all tools.
- `tools/README.md` - seed routing and tool registry usage.
- `tools/project-context-ledger/SEED-IDEAS.md` - selected candidate purpose,
  inputs, outputs, MVP, safety rules, and first fixture.
- `tools/phase-forensics-tool/SEED-IDEAS.md` - deferred candidate; useful after
  failed phases or surprising review results.
- `tools/config-matrix-validator/SEED-IDEAS.md` - deferred candidate; useful for
  config-heavy project evidence.
- `tools/skill-linter/SEED-IDEAS.md` - deferred candidate; useful when skills
  become active project artifacts.
- `tools/test-quality-auditor/SEED-IDEAS.md` - deferred candidate; useful after
  repeated shallow-test evidence.
- `tools/ui-regression-screenshot-comparator/SEED-IDEAS.md` - deferred
  candidate; useful for frontend/UI work.
- `tools/runtime-capability-inspector/SEED-IDEAS.md` - deferred candidate;
  useful for hardware/service/runtime capability work.
- `tools/local-integration-harness/SEED-IDEAS.md` - deferred candidate; useful
  after runtime capability checks justify heavier integration runs.
- `tools/domain-contract-test-generator/SEED-IDEAS.md` - deferred candidate;
  useful once stable domain contract formats exist.

### Prior Decisions and Evidence

- `.planning/phases/09-tool-registry-and-workflow-gate-slimming/09-CONTEXT.md`
  - registry fields, maturity, self-use, and deferred seed coverage.
- `.planning/phases/10-evidence-only-gate-linter-seed-mvp/10-VERIFICATION.md`
  - latest validated tool, self-use evidence, and residual historical-noise
  findings.
- `.planning/research/FEATURES.md` - original feature prioritization: context
  ledger and phase forensics as P2, visual/integration tools as P3.
- `.planning/research/SUMMARY.md` - research summary recommending later tool
  selection based on real repeated demand.
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` - ownership,
  incoming/outgoing gates, and no-automation boundaries.

### Existing Implementation Patterns

- `shared/review-packet-renderer.js` - shared packet artifact rendering and
  count validation pattern for future tools.
- `shared/path-guard.js` - output isolation.
- `shared/ignore-policy.js` - safe project walking and generated packet ignore.
- `shared/secret-policy.js` - path-only secret evidence.
- `shared/tool-metadata.js` - shared tool names and packet constants.
- `test/planning/tool-registry.test.js` - registry validation style.
- `test/shared/safety-harness.test.js` - no-mutation and secret-safety fixture
  patterns.
- `test/contract-drift-auditor/integration.test.js` and
  `test/gates-scan/integration.test.js` - packet-producing fixture patterns.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `tools/registry.json`: already records maturity, destination, expected
  outputs, self-use, activation stage, and non-goals. Phase 11 can promote one
  entry without inventing a new catalog.
- `shared/review-packet-renderer.js`: future ledger packets should reuse the
  same summary, findings, evidence, and recommended action artifact flow.
- `shared/path-guard.js`, `shared/ignore-policy.js`, and
  `shared/secret-policy.js`: directly applicable to any context ledger scan.
- `shared/tree-hash.js` and existing fixture helpers: useful for proving ledger
  scans do not mutate target projects and for detecting stale cached facts.
- Existing CLI directories under `tools/contract-drift-auditor/`,
  `tools/cross-repo-compatibility-checker/`, and `tools/gates-scan/`: patterns
  for future package bin, README, fixture, integration, and schema-output work.

### Established Patterns

- New tools are CommonJS Node CLIs with explicit input paths and explicit
  external `--out`.
- Output isolation rejects target-contained packet directories before writes.
- Tool findings are evidence only and do not make automatic workflow or release
  decisions.
- Synthetic fixtures prove broken cases; real repo self-use is verification
  evidence, not the only validation.
- Registry maturity must stay truthful: `deferred`, `planned`, `implemented`,
  or `validated` mean different things.

### Integration Points

- Phase 11 should update `tools/registry.json`, not `package.json`, unless it
  is explicitly implementing a runnable tool, which is out of scope.
- If Phase 11 adds a future Phase 12, update `.planning/ROADMAP.md` and
  `.planning/REQUIREMENTS.md` traceability consistently.
- If registry, roadmap, or changelog changes occur, run affected planning tests
  and relevant self-use tools as evidence.
- The future ledger should be consumed by GSD discuss/plan/review as optional
  evidence only; it should not replace reading source files or planning docs.

</code_context>

<specifics>
## Specific Ideas

Preferred future candidate name: `project-context-ledger`.

Preferred future CLI shape:

```bash
node tools/project-context-ledger/cli.js --project <path> --out <dir>
```

Preferred future MVP outputs:

- standard review packet artifacts;
- `FACTS.json`;
- `COMMANDS.json`;
- `CONTRACTS.json`;
- `SKILLS.json`;
- `DECISIONS.json`;
- `EVIDENCE.json`;
- `CACHE-MANIFEST.json`.

The ledger should be positioned as "verified project memory with evidence
refs," not as a magic summary or source-code replacement.

</specifics>

<deferred>
## Deferred Ideas

- Implementing `project-context-ledger` remains a later phase after Phase 11
  promotes and scopes it.
- `phase-forensics-tool` remains deferred until failed phases, rollbacks,
  surprising reviews, or repeated plan/reality mismatches create evidence.
- `config-matrix-validator` remains deferred until config-heavy projects or
  environment refactors create evidence.
- `skill-linter` remains deferred until project skill creation/publishing
  becomes active work.
- `test-quality-auditor` remains deferred until repeated shallow-test or missed
  behavior evidence appears.
- `ui-regression-screenshot-comparator` remains deferred until frontend/UI work
  exists.
- `runtime-capability-inspector` and `local-integration-harness` remain
  deferred until runtime services, hardware, browsers, ports, or integration
  flows create repeated demand.
- `domain-contract-test-generator` remains deferred until stable domain
  contract formats exist.

</deferred>

---

*Phase: 11-v2 Tool Selection Review*
*Context gathered: 2026-05-08*
