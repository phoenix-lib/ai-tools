# Phase 16: Ledger Scope and Diff Modes - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 16-Ledger Scope and Diff Modes
**Areas discussed:** Scope semantics, source categorization, diff output, noise classification, verification evidence

---

## Scope Semantics

| Option | Description | Selected |
|--------|-------------|----------|
| Default broad scan | Keep scanning active and historical planning by default. Lowest implementation risk, but preserves current noise problem. | |
| Current-by-default scope | Default to current source-of-truth evidence and require explicit `planning`, `history`, or `all` for broader scans. | yes |
| History-only cleanup | Focus only on excluding `.planning/phases/**` without adding full scope modes. Smaller but does not satisfy LEDGER-SCOPE-01. | |

**User's choice:** Trusted Self-Questioning selected by user; agent selected current-by-default because it directly matches Phase 16 success criteria and the Phase 14/15 noise evidence.
**Notes:** History remains available through explicit `--scope history` and `--scope all`.

---

## Source Categorization

| Option | Description | Selected |
|--------|-------------|----------|
| Path-only filtering | Filter sources by path without exposing category metadata to consumers. | |
| Category metadata | Add deterministic source categories to manifest/records so consumers can inspect current vs planning vs history evidence. | yes |
| Separate tools per source type | Split ledger into multiple commands for current/planning/history. | |

**User's choice:** Trusted Self-Questioning selected by user; agent selected category metadata.
**Notes:** Public ledger schemas must be updated if new fields are emitted.

---

## Diff Output

| Option | Description | Selected |
|--------|-------------|----------|
| File-hash-only diff | Reuse existing `previous_manifest.changed_sources` behavior. Simple but does not report changed facts. | |
| Record-level diff | Compare ledger records by artifact and stable id, reporting added, removed, changed, stale, and unchanged. | yes |
| Semantic triage diff | Rank which changed facts matter most. | |

**User's choice:** Trusted Self-Questioning selected by user; agent selected record-level mechanical diff.
**Notes:** Semantic triage and priority decisions stay out of scope.

---

## Noise Classification

| Option | Description | Selected |
|--------|-------------|----------|
| Suppress noisy findings | Hide historical/example findings from outputs. | |
| Classify non-real references | Distinguish examples, placeholders, `n/a`, and generated packet artifacts without making suppression decisions. | yes |
| Leave all references as real | Preserve current behavior and rely on dispositions. | |

**User's choice:** Trusted Self-Questioning selected by user; agent selected classification without suppression.
**Notes:** Conservative classification is required: uncertain references remain real.

---

## Verification Evidence

| Option | Description | Selected |
|--------|-------------|----------|
| Fixture tests only | Prove behavior on synthetic inputs but skip real self-use evidence. | |
| Fixture tests plus self-use deltas | Test deterministic fixtures and run current/all or history self-use to compare historical finding counts. | yes |
| Real self-use only | Use this repository as the main oracle. | |

**User's choice:** Trusted Self-Questioning selected by user; agent selected fixtures plus self-use deltas.
**Notes:** Real self-use output is evidence only; synthetic fixtures remain the oracle.

---

## Agent Discretion

- Exact module names for scope and diff helpers.
- Whether `LEDGER-DIFF.json` is emitted only when `--since-manifest` is supplied
  or represented through an always-present empty artifact.
- Whether source category additions remain under `project-context-ledger/v1` as
  optional/additive schema fields or require a documented version adjustment.

## Deferred Ideas

- Shared CLI contract migration belongs to Phase 17.
- `ai-workspace-kit` LLM instruction compatibility belongs to Phase 18.
- Portfolio real project scanning belongs to a future milestone after v2.1.
