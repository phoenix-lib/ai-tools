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
*Last updated: 2026-05-07 after Phase 01 completion*
