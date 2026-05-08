# Phase 9: Tool Registry and Workflow Gate Slimming - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 09-Tool Registry and Workflow Gate Slimming
**Areas discussed:** Discuss Mode Gate, Registry Placement, Registry Shape, AGENTS Slimming, Upstream Update Impact, Phase 10 Boundary, Self-Use

---

## Discuss Mode Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask the user focused questions before writing context. | |
| Trusted Self-Questioning | The agent performs a bounded self-questioning pass and records decisions. | yes |

**User's choice:** Trusted Self-Questioning.

**Notes:** User replied `2` after the discuss-mode preflight. No Phase 9 discussion artifacts were written before this approval.

---

## Registry Placement

| Option | Description | Selected |
|--------|-------------|----------|
| `.planning/tools/registry.json` | Planning-local artifact only. Keeps workflow state separate from product tools. | |
| `tools/registry.json` | Product-level capability catalog beside implemented and seed tools. Easier for docs, tests, and future tooling to discover. | yes |
| Prose only | Keep the list in README/AGENTS without a machine-readable registry. | |

**User's choice:** Trusted self-questioning selected `tools/registry.json`.

**Notes:** The registry describes AI Tools capabilities rather than transient phase state, so it belongs in the `tools/` namespace. Workflow gates can reference it.

---

## Registry Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal list | Only tool ids and paths. Simple but too weak for self-use/new-tool intake gates. | |
| Strict capability entries | Include owner, destination, maturity, activation stages, expected outputs, use gate, self-use, non-goals, and evidence refs. | yes |
| Full workflow model | Attempt to encode every gate and phase rule in the registry. | |

**User's choice:** Trusted self-questioning selected strict capability entries.

**Notes:** Keep maturity separate from self-use. A validated tool can be self-use-required only at specific stages.

---

## AGENTS Slimming

| Option | Description | Selected |
|--------|-------------|----------|
| Keep everything in AGENTS | No migration risk, but root entrypoint stays too heavy and duplicates machine-readable sources. | |
| Move detailed gate policy to `.planning/gates/WORKFLOW-GATES.md` | Keeps AGENTS as the first-read entrypoint while moving long policy bodies to focused docs. | yes |
| Move all gate policy out of AGENTS | Too risky because discuss-mode preflight should remain visible in the first-read contract. | |

**User's choice:** Trusted self-questioning selected focused gate docs with a short AGENTS entrypoint.

**Notes:** Preserve source layers, hard safety rules, and the explicit discuss-mode preflight in `AGENTS.md`.

---

## Phase 10 Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Implement gates-scan now | Would violate roadmap boundary; belongs to Phase 10. | |
| Register gates-scan as planned | Captures scope, use gate, outputs, and non-goals without implementing it. | yes |
| Ignore gates-scan until Phase 10 | Misses the point of registry guardrails before new tools. | |

**User's choice:** Trusted self-questioning selected planned registry entry only.

**Notes:** Phase 9 tests should not expect a runnable `gates-scan` CLI.

---

## Upstream Update Impact

| Option | Description | Selected |
|--------|-------------|----------|
| New standalone phase | Add a separate governance phase for Kit Update Self-Check. | |
| Separate new gate id | Add `kit-update-self-check` beside `upstream-freshness`. | |
| Extend upstream-freshness | Keep the compatible registry id and require update-impact self-check when kit changes. | yes |

**User's choice:** Extend `upstream-freshness` inside Phase 9 rather than adding a new phase.

**Notes:** Use the general pattern `Upstream Update Impact Gate`; in AI Tools call it `Kit Update Self-Check Gate`. It must cover current repo impact, current phase impact, and future consumer practice impact. Phase-local `<phase>-UPSTREAM-UPDATE-REVIEW.md` is recommended for substantial updates.

---

## Self-Use

| Option | Description | Selected |
|--------|-------------|----------|
| No self-use in Phase 9 | Would miss validated tools after AGENTS/gate doc changes. | |
| Run relevant validated tools after changes | Use contract drift auditor and cross-repo checker as read-only evidence after registry/gate docs change. | yes |
| Treat tool findings as blockers | Would violate evidence-only policy. | |

**User's choice:** Trusted self-questioning selected evidence-only self-use after changes.

**Notes:** Record command, output path, status, finding count, and interpretation. Findings remain evidence only.

## the agent's Discretion

- Planner may choose exact test filename and optional registry fields.
- Planner may choose whether schema lives at `tools/registry.schema.json` or an adjacent equivalent if the name is clear and tested.

## Deferred Ideas

- Implementing `gates-scan` / `GATELINT-01` remains Phase 10.
- Selecting the next broad seed tool remains Phase 11.
- Adding Phase 8 CLI flags to `cross-repo-compatibility-checker` remains future consistency work.
