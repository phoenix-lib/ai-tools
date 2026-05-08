# Phase 10: Evidence-Only Gate Linter Seed MVP - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 10-Evidence-Only Gate Linter Seed MVP
**Areas discussed:** discuss-mode, ownership boundary, promotion default, MVP check set, CLI/output shape, fixtures, self-use and verification

---

## Discuss Mode

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask targeted user questions before writing Phase 10 context. | |
| Trusted Self-Questioning | Use a structured self-questioning pass and capture decisions for planning. | yes |

**User's choice:** `2`, Trusted Self-Questioning.
**Notes:** The `discuss-mode` gate was resolved before gray-area analysis and before writing `10-CONTEXT.md` or this log. `workflow.discuss_mode` was treated as routing only.

---

## Ownership Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| AI Tools mechanical scanner | Build read-only evidence checks for gate artifacts and workflow docs. | yes |
| Kit semantic gate review | Treat `ai-workspace-kit` as owner of assistant-led gate policy and final semantic review. | yes |
| Mixed hidden integration | Make one repo run or depend on the other automatically. | |

**User's choice:** Inferred from Trusted Self-Questioning and prior accepted cross-repo decisions.
**Notes:** Phase 10 can implement mechanical `gates-scan` evidence, but must not decide gate adoption, revision, rejection, or phase creation.

---

## Promotion Default

| Option | Description | Selected |
|--------|-------------|----------|
| Implement MVP now | Promote `GATELINT-01` because prerequisites now exist and repeated gate misses justify it. | yes |
| Defer by default | Keep only a decision artifact unless the user asks again. | |
| Expand into full workflow automation | Build automatic GSD preflight execution now. | |

**User's choice:** Trusted Self-Questioning selected the recommended builder default: implement MVP unless boundary research finds a blocker.
**Notes:** Phase 7 checker and Phase 9 registry prerequisites are complete, so Phase 10 should not re-defer without concrete evidence.

---

## MVP Check Set

| Option | Description | Selected |
|--------|-------------|----------|
| Deterministic local checks | Registry validity, duplicate IDs, required fields, gate resolution blocks, skip semantics, stale paths, aliases, docs/changelog impact. | yes |
| Broad prose interpretation | Attempt to decide if every gate is semantically relevant or stale. | |
| Cross-repo indexer | Scan both repositories and derive protocol decisions. | |

**User's choice:** Trusted Self-Questioning selected deterministic local checks.
**Notes:** The scanner should report observable facts and unresolved evidence, not judge gate policy.

---

## CLI And Output Shape

| Option | Description | Selected |
|--------|-------------|----------|
| `gates-scan --project <path> --out <dir>` | Explicit read-only one-project scanner with standard packet output. | yes |
| Planning-only docs validation | Keep checks only in tests and no user-facing CLI. | |
| Hidden GSD runner | Auto-run scanner during every GSD phase. | |

**User's choice:** Trusted Self-Questioning selected the explicit CLI.
**Notes:** Output must use `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and `RECOMMENDED-ACTIONS.md` with JSON as source of truth.

---

## Fixtures And Self-Use

| Option | Description | Selected |
|--------|-------------|----------|
| Synthetic fixtures plus real self-use | Use fixtures for broken cases and run on AI Tools during verification. | yes |
| Real repo only | Use current `.planning` history as the primary test oracle. | |
| No fixtures | Rely on manual testing. | |

**User's choice:** Trusted Self-Questioning selected synthetic fixtures plus real self-use.
**Notes:** This keeps tests deterministic while still proving the tool helps this repository.

## the agent's Discretion

- The planner may choose exact module names, fixture filenames, check IDs, and plan wave boundaries.
- The planner may implement all MVP checks in one implementation plan or split them when that makes tests clearer.

## Deferred Ideas

- Automatic GSD preflight execution of `gates-scan`.
- Semantic gate-review workflow decisions.
- Broad seed tools deferred to Phase 11.
