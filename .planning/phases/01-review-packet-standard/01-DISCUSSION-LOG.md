# Phase 1: Review Packet Standard - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 1-Review Packet Standard
**Areas discussed:** Packet artifact set, Schema boundaries, Status model, Evidence semantics, ai-workspace-kit compatibility
**Mode:** Trusted Self-Questioning, approved by user

---

## Packet Artifact Set

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal four artifacts | `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, `RECOMMENDED-ACTIONS.md` | yes |
| Include risk matrix | Add `RISK-MATRIX.md` in v1 | no |
| Include patch files | Add `RECOMMENDED-PATCHES.md` or patch bundles in v1 | no |

**User's choice:** Trusted self-questioning.
**Notes:** Selected the minimal four artifacts because the guide already names
them as required, and Phase 1 should avoid premature projections or fix-mode
artifacts.

Self-questioning cycles:

1. What is the smallest packet agents and CI can consume?
2. Which files are human projections versus machine source of truth?
3. Would `RISK-MATRIX.md` add contract value or just presentation?
4. Would patch artifacts imply unsafe fix behavior?
5. What does the planner need locked? File names and v1/later boundary.

---

## Schema Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| One monolithic schema | One packet schema containing every nested object | no |
| Five focused schemas | Summary, finding, evidence ref, recommended action, tool manifest | yes |
| Per-tool schemas only | Each tool defines its own packet shape | no |

**User's choice:** Trusted self-questioning.
**Notes:** Selected focused schemas because they keep shared contracts reusable
without letting tools drift.

Self-questioning cycles:

1. What objects recur across every tool?
2. What should summary own versus finding?
3. Should evidence be embedded only or separately reusable?
4. How do recommended actions stay concrete without becoming patches?
5. What metadata is tool-level rather than finding-level?

---

## Status Model

| Option | Description | Selected |
|--------|-------------|----------|
| Four-state packet status | `pass`, `info`, `human_review_required`, `blocked` | yes |
| Severity-only status | Infer packet status from highest finding severity | no |
| ai-workspace-kit exact labels | Reuse `ready for manual review` style labels directly | no |

**User's choice:** Trusted self-questioning.
**Notes:** Selected four-state machine-safe status with separate finding severity
and confidence.

Self-questioning cycles:

1. What should CI and agents branch on?
2. What should humans scan by impact?
3. Where do blockers and required decisions fit?
4. How do we keep Markdown/CLI/JSON counts from drifting?
5. Which labels are stable machine values?

---

## Evidence Semantics

| Option | Description | Selected |
|--------|-------------|----------|
| Path-only refs | Only cite file paths | no |
| Content snippets | Copy excerpts into packet artifacts | no |
| Structured evidence refs | Path, hash or path-only marker, line, reason, type, confidence | yes |

**User's choice:** Trusted self-questioning.
**Notes:** Selected structured evidence refs with strict secret path-only
handling.

Self-questioning cycles:

1. What proof is enough for a finding?
2. How do downstream agents locate evidence cheaply?
3. How do we avoid secret leakage?
4. What must be deterministic for hashing?
5. How should unknown and stale facts be represented?

---

## ai-workspace-kit compatibility

| Option | Description | Selected |
|--------|-------------|----------|
| Exact manifest clone | Reuse `ai-workspace.manifest.json` structure wholesale | no |
| Concept-compatible packet | Reuse compatible concepts while keeping auditor-specific packet shape | yes |
| Independent format | Ignore `ai-workspace-kit` packet concepts | no |

**User's choice:** Trusted self-questioning.
**Notes:** Selected concept compatibility: source commit, policy hashes,
generated files, requested outputs, shared summary, blockers, required
decisions, rejected assumptions, and preserved stricter rules.

Self-questioning cycles:

1. What `ai-workspace-kit` concepts directly help auditors?
2. Which adoption-specific fields would confuse auditor packets?
3. How do we preserve optional integration?
4. Which labels should become machine-safe?

## the agent's Discretion

- Exact schema filename casing and directory layout within
  `standards/review-packet/`.
- Whether examples live under `standards/review-packet/examples/` or a shared
  fixture tree.
- Internal helper names for canonical JSON and shared summary rendering.

## Deferred Ideas

- `RISK-MATRIX.md` as a future human projection.
- `RECOMMENDED-PATCHES.md` or patch bundles as future fix-mode artifacts.
- Per-tool extension schemas after the common contract stabilizes.
