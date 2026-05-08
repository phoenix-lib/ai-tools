# Phase 13: Review Packet Rollup MVP - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 13-Review Packet Rollup MVP
**Areas discussed:** CLI shape, Input validation, Source finding normalization, Grouping artifacts, Status and counts, Safety and fixtures

---

## Discuss Mode Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask the user to choose gray areas and answer follow-up questions before writing context. | |
| Trusted Self-Questioning | The assistant performs one bounded self-questioning pass and records assistant-owned decisions. | yes |

**User's choice:** Trusted Self-Questioning
**Notes:** User replied `2` after the discuss-mode prompt. `workflow.discuss_mode` was treated as routing only, not approval evidence.

---

## CLI Shape

| Option | Description | Selected |
|--------|-------------|----------|
| `review-packet-rollup --packets <dir...> --out <dir>` | Matches roadmap and keeps the tool packet-focused. | yes |
| Repeated `--packet <dir>` flags | More explicit but expands parser surface without a Phase 13 requirement. | |
| Include Phase 17 flags now | Adds `--format`, `--quiet`, and `--fail-on` before the shared CLI contract phase. | |

**User's choice:** Trusted self-questioning selected roadmap shape.
**Notes:** Phase 13 should keep CLI small and leave cross-tool CLI consistency to Phase 17.

---

## Input Validation

| Option | Description | Selected |
|--------|-------------|----------|
| Validate summary and evidence refs | Validate `REVIEW-SUMMARY.json` and every `EVIDENCE.json` entry using current schemas. | yes |
| Require all Markdown projections | Blocks useful rollup on human-only projection gaps. | |
| Invent `EVIDENCE.schema.json` | Creates a new standard in the wrong phase. | |

**User's choice:** Trusted self-questioning selected current-schema validation.
**Notes:** Current standard has `EVIDENCE-REF.schema.json`, not a separate `EVIDENCE.schema.json`.

---

## Source Finding Normalization

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve source findings with prefixed IDs | Combined counts remain mechanically tied to source packets. | yes |
| Summarize groups as new findings only | Loses source finding granularity and makes counts less useful. | |
| Add provenance fields to findings | Violates `FINDING.schema.json` additionalProperties rules. | |

**User's choice:** Trusted self-questioning selected prefixed source findings.
**Notes:** Provenance goes in `PACKET-INDEX.json` and `ROLLUP-GROUPS.json`.

---

## Grouping Artifacts

| Option | Description | Selected |
|--------|-------------|----------|
| Separate mechanical group arrays | `by_tool`, `by_status`, `by_severity`, `by_source_check_id`, `by_status_contribution`, `by_source_path`. | yes |
| One large multidimensional cube | More complex and harder to consume in the MVP. | |
| Semantic priority groups | Drifts into Phase 15 or assistant-owned review. | |

**User's choice:** Trusted self-questioning selected separate mechanical group arrays.
**Notes:** Group sorting may be deterministic by key and count but must not imply business priority.

---

## Status and Counts

| Option | Description | Selected |
|--------|-------------|----------|
| Derive from normalized findings and blockers | Reuses packet renderer count validation and keeps projections aligned. | yes |
| Trust source packet counts blindly | Fails if source summaries are inconsistent with findings. | |
| Hand-write aggregate counts | Risks JSON/Markdown/CLI drift. | |

**User's choice:** Trusted self-questioning selected renderer-derived counts.
**Notes:** Invalid required packet input should produce blocked findings and make the rollup blocked.

---

## Safety and Fixtures

| Option | Description | Selected |
|--------|-------------|----------|
| Synthetic fixtures plus self-use evidence | Deterministic tests for broken cases, real packets for verification evidence. | yes |
| Real self-use packets as the only oracle | Too noisy and machine-local for stable tests. | |
| Run source tools from rollup | Violates packet-consumer boundary. | |

**User's choice:** Trusted self-questioning selected synthetic fixtures plus self-use.
**Notes:** The rollup reads packet directories only and should not scan target projects or run producer tools.

---

## the agent's Discretion

- Exact module boundaries under `tools/review-packet-rollup/`.
- Exact fixture names and packet ids.
- Whether a small shared packet validation helper is warranted.
- Whether registry schema needs a minimal `producer` / `consumer` distinction.

## Deferred Ideas

- Review dispositions and safe-to-ignore logic.
- Ledger scope and diff modes.
- Shared CLI contract across every validated tool.
- ai-workspace-kit LLM instruction compatibility.
- Real project portfolio scan.
