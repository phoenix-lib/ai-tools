# Phase 4: Contract Drift Auditor MVP - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 04-contract-drift-auditor-mvp
**Areas discussed:** Discuss Mode Gate, auditor scope, packet renderer, cross-repo boundary, fixture strategy

---

## Discuss Mode Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask the user explicit follow-up questions before writing context. | |
| Trusted Self-Questioning | The assistant resolves implementation gray areas from existing roadmap, requirements, prior contexts, and gate evidence. | yes |

**User's choice:** Trusted Self-Questioning.
**Notes:** User replied `2` after the corrected `discuss-mode` gate was
presented. `workflow.discuss_mode` was not treated as approval evidence.

---

## Auditor Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Narrow deterministic MVP | Implement read-only file/source-layer/command/permission/skill/profile-fact drift checks with evidence refs. | yes |
| Broad AI analysis | Add LLM-heavy interpretation and many later tool categories. | |
| Adoption/bootstrap clone | Rebuild `ai-workspace-kit` contract generation or adoption review behavior in AI Tools. | |

**User's choice:** Trusted self-questioning selected the narrow deterministic
MVP because it matches ROADMAP Phase 4, `DRIFT-*` requirements, and the incoming
`ai-workspace-kit` request.
**Notes:** Later tool categories remain deferred until this auditor proves the
shared standards.

---

## Packet Renderer

| Option | Description | Selected |
|--------|-------------|----------|
| Build shared renderer in Phase 4 | Create reusable rendering so JSON, Markdown, recommended actions, evidence, and CLI status come from one model. | yes |
| Let the auditor render ad hoc | Faster initially, but risks count/status drift across artifacts. | |
| Defer renderer to release hardening | Would leave `RENDER-01` unmet and make the first auditor harder to trust. | |

**User's choice:** Trusted self-questioning selected shared renderer in Phase 4.
**Notes:** This carries forward Phase 1 packet rules and prior feedback that a
shared packet renderer prevents divergent JSON/Markdown counts.

---

## Cross-Repo Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Accept as AI Tools-owned external auditor | Build the auditor here and let `ai-workspace-kit` consume packets optionally. | yes |
| Make `ai-workspace-kit` run it automatically | Creates hidden dependency and automation creep. | |
| Duplicate adoption review in AI Tools | Violates the tandem boundary gate. | |

**User's choice:** Trusted self-questioning selected AI Tools-owned external
auditor with optional packet consumption.
**Notes:** The incoming request is recorded as planned for Phase 4 in the
cross-repo decision artifact.

---

## Fixture Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse and extend existing target fixtures | Build on mature, missing-command, stale-source-layer, secret-like, mixed-package-manager, and generated-packet fixtures. | yes |
| Create unrelated new fixtures | More baseline churn and weaker connection to Phase 2 safety proof. | |
| Test only against this repository | Useful later for self-use, but too narrow for MVP validation. | |

**User's choice:** Trusted self-questioning selected reuse and extension of
existing target fixtures.
**Notes:** Tests must preserve target input tree hashes and keep expected output
outside fixture `input/` trees.

## the agent's Discretion

- Exact module layout and parser implementation.
- Exact finding IDs and severity mapping details.
- Exact CLI argument parser package or hand-rolled parser, as long as the CLI
  shape and safety rules hold.
- Exact Markdown wording for `FINDINGS.md` and `RECOMMENDED-ACTIONS.md`.

## Deferred Ideas

- Auto-fix mode.
- Cross-repo compatibility checker.
- Mechanical gate-linter.
- Project context ledger and phase forensics.
- Runtime/config/test-quality/UI/integration tools.
