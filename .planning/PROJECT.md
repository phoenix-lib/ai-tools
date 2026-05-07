# AI Tools

## What This Is

AI Tools is a small ecosystem of read-only AI development auditors for keeping
AI-assisted projects accurate, reviewable, and cheap to reason about. The tools
produce evidence-backed review packets that can be consumed by assistants,
humans, CI jobs, and GSD workflows.

The project supports `ai-workspace-kit` and GSD workflows, but the external
tools must remain optional. Target projects should be able to benefit from
audits without taking these tools as mandatory product dependencies.

## Core Value

Produce deterministic, evidence-backed review packets that make AI project
guidance auditable without mutating target projects.

## Requirements

### Validated

- [x] Define a portable AI review packet standard with schemas for summaries,
  findings, evidence references, recommended actions, and tool metadata.
  Validated in Phase 01: Review Packet Standard.

### Active

- [ ] Implement shared safety primitives for read-only inspection, output path
  isolation, secret-like path-only evidence, deterministic JSON, and ignored
  generated artifacts.
- [ ] Build `contract-drift-auditor` as the first external read-only tool.
- [ ] Ensure every finding cites narrow evidence and marks unknown or stale facts
  explicitly.
- [ ] Add deterministic fixtures and tests proving no target-project mutation,
  no secret leakage, consistent status/counts across artifacts, and schema-valid
  review packets.
- [ ] Keep `ai-workspace-kit` integration optional and review-packet based.
- [ ] Enforce the ai-workspace-kit tandem boundary gate so AI Tools does not
  duplicate adoption/bootstrap, adapter generation, or generated-contract
  review capabilities already owned by `ai-workspace-kit`.
- [ ] Run an ai-workspace-kit upstream freshness gate before each phase planning
  step so planning uses the latest reachable upstream commit and records
  reusable changes.
- [ ] Define a cross-repo capability request protocol so AI Tools and
  `ai-workspace-kit` can ask for missing capabilities through explicit requests
  and decisions without automatically creating phases or mixing ownership.
- [ ] Maintain `CHANGELOG.md` after every completed phase, executed major plan,
  or workflow gate change.
- [ ] Plan a future `ai-workspace-kit` gate-review hook for release and
  maintenance boundaries, with manual fallback until the upstream capability
  exists.

### Out of Scope

- Building all seed tools at once - this would create many disconnected partial
  tools before the shared standards exist.
- Auto-fixing target projects in the MVP - write behavior needs a future,
  explicitly designed `--fix` mode.
- Installing dependencies in target projects - auditors must inspect evidence,
  not mutate project environments.
- Reading secret-like file contents by default - these files are path-only
  evidence unless the user requests exact access.
- Making external tools mandatory dependencies of `ai-workspace-kit` or target
  products - integration stays optional.
- Rebuilding `ai-workspace-kit` adoption/bootstrap behavior inside AI Tools -
  the two projects work in tandem, so duplicated adapter generation,
  generated-contract review routing, or project-local contract installation
  belongs upstream or as compatibility integration, not as a parallel tool.
- Auto-creating AI Tools phases from incoming cross-repo requests - requests are
  decision points first, not automatic commitments.
- Starting with AI-generated prose reports only - the first implementation work
  must be schemas, fixtures, parsers, and deterministic reports.

## Context

The repository currently contains product seed folders. Each seed folder has a
`README.md` describing purpose, inputs, outputs, MVP, risks, and integration
ideas. These are planning seeds, not final architecture.

Important seed areas:

- `ai-review-packet-standard`
- `ai-workspace-kit-internal-gates`
- `contract-drift-auditor`
- `project-context-ledger`
- `phase-forensics-tool`
- `config-matrix-validator`
- `domain-contract-test-generator`
- `runtime-capability-inspector`
- `skill-linter`
- `test-quality-auditor`
- `tool-usage-registry`
- `ui-regression-screenshot-comparator`
- `local-integration-harness`

The project guide is `AI-AGENT-IMPLEMENTATION-GUIDE.md`. It is the main source
for implementation order and standards. The local `AGENTS.md` adapts
`phoenix-lib/ai-workspace-kit` workflow principles for this repository.

The local `.external/ai-workspace-kit` checkout is a reference source only. It
should not be treated as target-project evidence unless a task explicitly asks
to inspect it.

## Constraints

- **Review-only default**: MVP tools must not mutate target projects.
- **Output isolation**: Report-generating CLIs must require `--out <dir>` and
  reject target-project output paths for target-project audits.
- **Secret safety**: Secret-like files may be listed as path-only evidence, but
  contents must not be read, copied, rendered, or hashed into user-facing
  reports by default.
- **Evidence-first reporting**: Findings must cite evidence refs; unknowns must
  be marked `unknown`, `stale`, `TODO`, or `unresolved`.
- **Determinism**: JSON output should use canonical recursively sorted keys and
  trailing newlines; tests should prove deterministic reports.
- **Optional integration**: `ai-workspace-kit` remains the adoption/bootstrap
  contract tool; external auditors are optional helpers.
- **Tandem boundary gate**: Before planning a new tool, classify whether the
  capability is owned by AI Tools, owned by `ai-workspace-kit`, or shared
  boundary work. Do not mask duplicate `ai-workspace-kit` behavior as a new AI
  Tools review utility.
- **Upstream freshness gate**: Before phase planning, compare the local
  `.external/ai-workspace-kit` commit with GitHub `HEAD`, fast-forward the
  checkout when it changed, review the upstream diff, and record project impacts
  before writing or updating a phase plan.
- **Cross-repo request gate**: When AI Tools needs a capability owned by
  `ai-workspace-kit`, create an outbox request instead of implementing it here.
  Incoming requests from `ai-workspace-kit` create decision points, not automatic
  phases, tool runs, dependencies, or copied planning state.
- **Project changelog gate**: After every completed phase, executed major plan,
  or workflow gate change, update `CHANGELOG.md` with changed scope,
  validation, and upstream impact.
- **Upstream changelog pre-read**: When the ai-workspace-kit freshness gate
  detects upstream changes, read upstream changelog/release notes first if that
  artifact exists and changed. If it does not exist yet, record the absence and
  use commit log plus diff review.
- **Future gate review hook**: At release hardening and maintenance boundaries,
  use the future `ai-workspace-kit` gate-review capability once available to
  find conflicting, stale, or irrelevant gates. Until then, review manually and
  route gaps through cross-repo requests or decisions.
- **Windows compatibility**: Clean clone tests must pass on Windows, including
  line-ending behavior.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with the review packet standard | Every later tool depends on a stable output contract. | Validated in Phase 01 |
| Build one external auditor before expanding the ecosystem | A small green `contract-drift-auditor` proves the standards under real use. | Pending |
| Keep existing seed folders as product notes initially | Moving everything before code exists adds churn without proving architecture. | Pending |
| Use `ai-workspace-kit` workflow principles but keep it optional | The workflow is useful, but target projects should not inherit dependencies or assumptions. | Pending |
| Treat generated packets as review material, not installation material | This preserves user control and avoids accidental target-project mutation. | Pending |
| Enforce the ai-workspace-kit tandem boundary gate | AI Tools should complement `ai-workspace-kit`, not duplicate adoption/bootstrap or adapter-generation behavior under new tool names. | Active |
| Enforce the ai-workspace-kit upstream freshness gate | `ai-workspace-kit` is a living upstream reference; phase plans should reflect current contracts, schemas, and workflow lessons. | Active |
| Insert Cross-Repo Capability Request Gate before the first heavy auditor | The two repos need a structured request/decision protocol before external tool work starts consuming or influencing upstream contracts. | Planned for Phase 03 |
| Maintain a project changelog after major work | Future agents need a compact history before reading deeper planning artifacts. | Active |
| Plan ai-workspace-kit gate review as a future hook | The upstream command does not exist yet, so AI Tools should reserve the review stage without pretending it is currently runnable. | Planned for Phase 05 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? Move to Out of Scope with reason.
2. Requirements validated? Move to Validated with phase reference.
3. New requirements emerged? Add to Active.
4. Decisions to log? Add to Key Decisions.
5. "What This Is" still accurate? Update if drifted.

**After each milestone**:
1. Full review of all sections.
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state.

---
*Last updated: 2026-05-07 after adding changelog and gate-review governance*
