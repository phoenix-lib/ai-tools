# Phase 11: v2 Tool Selection Review - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 11-v2 Tool Selection Review
**Areas discussed:** discuss-mode gate, selection method, candidate promotion, non-selected disposition, promotion boundary

---

## Discuss Mode Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask remaining Phase 11 questions interactively before writing context. | |
| Trusted Self-Questioning | Answer the phase questions from project evidence and record cycle limits in the gate resolution. | yes |

**User's choice:** Trusted Self-Questioning (`2`).
**Notes:** `workflow.discuss_mode=discuss` was treated as routing only, not approval evidence.

---

## Selection Method

| Option | Description | Selected |
|--------|-------------|----------|
| Evidence matrix | Score deferred tools using local pain, prior evidence, dependency on existing primitives, ownership clarity, implementation size, and runtime burden. | yes |
| Original seed order only | Follow the old build order without checking current evidence. | |
| Defer all by default | Avoid selecting a tool until a user names one explicitly. | |

**User's choice:** Trusted self-questioning selected evidence matrix.
**Notes:** Phase 11 exists specifically to reassess deferred seeds against real usage evidence, not just seed appeal.

---

## Candidate Promotion

| Option | Description | Selected |
|--------|-------------|----------|
| Project context ledger | Reduces repeated context loading and builds verified project memory using existing review packet and safety primitives. | yes |
| Phase forensics | Useful after failed phases or surprising review results, but stronger after ledger evidence exists. | |
| Config/skill/test/UI/runtime tools | Useful for specific project pain that is not yet repeated in this repository. | |
| Defer all | Keeps broad seeds deferred but misses the strongest evidence-backed next candidate. | |

**User's choice:** Trusted self-questioning selected `project-context-ledger`.
**Notes:** The ledger is promoted as the single next implementation candidate, not implemented in this phase.

---

## Promotion Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Planned only | Update selection artifacts/registry/roadmap so a later phase can implement the candidate. | yes |
| Implement now | Add CLI, package bin, fixtures, and generated ledger output during Phase 11. | |
| Research only | Avoid any registry or roadmap consequence. | |

**User's choice:** Trusted self-questioning selected planned-only promotion.
**Notes:** Phase 11 should not add runnable `project-context-ledger` code or package metadata.

---

## Non-Selected Tools

| Option | Description | Selected |
|--------|-------------|----------|
| Keep deferred with triggers | Preserve each seed with the evidence that would justify future promotion. | yes |
| Remove from registry | Drop seeds that are not selected now. | |
| Promote several | Start multiple future tools in parallel. | |

**User's choice:** Trusted self-questioning selected keep deferred with triggers.
**Notes:** This preserves optional future work while enforcing the one-next-tool rule.

---

## the agent's Discretion

- The planner may choose the exact selection matrix field names.
- The planner may add a focused planning test to prevent multiple simultaneous promotions.
- The planner may decide whether Phase 11 creates a new Phase 12 roadmap entry or records the candidate as planned for the next milestone, as long as implementation does not happen in Phase 11.

## Deferred Ideas

- Implementing `project-context-ledger` is deferred to a later phase.
- `phase-forensics-tool`, `config-matrix-validator`, `skill-linter`, `test-quality-auditor`, `ui-regression-screenshot-comparator`, `runtime-capability-inspector`, `local-integration-harness`, and `domain-contract-test-generator` remain deferred until their trigger evidence appears.
