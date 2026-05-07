# Review Packet Standard

The review packet standard is the shared output contract for AI Tools auditors.
Every packet has machine-readable JSON artifacts for agents and CI, plus
Markdown projections for human review.

## Required Artifacts

V1 packets must emit these files:

| Artifact | Audience | Role |
|----------|----------|------|
| `REVIEW-SUMMARY.json` | agents, CI, GSD | Top-level machine entrypoint for status, counts, metadata, findings, blockers, and decisions. |
| `EVIDENCE.json` | agents, CI | Machine evidence index with normalized paths, hashes or path-only markers, reasons, and confidence. |
| `FINDINGS.md` | humans | Human projection of finding data from `REVIEW-SUMMARY.json`. |
| `RECOMMENDED-ACTIONS.md` | humans | Human projection of recommended action data from `REVIEW-SUMMARY.json`. |

JSON artifacts are the machine source of truth. Markdown artifacts must be
rendered from the same summary, finding, evidence, and action data rather than
edited or counted independently.

## Packet Status

Packet status is the workflow outcome for the whole packet. It is not the same
as finding severity.

| Status | Meaning |
|--------|---------|
| `pass` | No findings require attention and no unresolved packet concerns remain. |
| `info` | Informational findings exist, but no human decision or blocking condition is present. |
| `human_review_required` | Evidence exists, but a human decision is needed before the packet can be acted on confidently. |
| `blocked` | The packet is unsafe or incomplete for downstream use until the blocker is resolved. |

Use `blocked` for packet-safety failures such as unreadable required evidence,
schema-invalid output, or critical unresolved contradictions. Use
`human_review_required` for evidence-backed choices such as conflicting local
rules, rejected assumptions, or preserved stricter local guidance.

## Finding Severity

Finding severity describes impact for one finding.

| Severity | Meaning |
|----------|---------|
| `critical` | Severe correctness, safety, or security risk that likely blocks release or trust. |
| `high` | Important issue that should be resolved before relying on the audited contract. |
| `medium` | Material drift or weakness with clear remediation, but not immediately blocking. |
| `low` | Minor issue, cleanup, or weak signal. |
| `info` | Informational observation with no required fix. |

Severity does not automatically determine packet status. A high-severity finding
can still need human review rather than making the whole packet blocked.

## Confidence

Confidence states how strongly the tool can support a finding from local
evidence.

| Confidence | Meaning |
|------------|---------|
| `verified` | Confirmed from readable local evidence. |
| `inferred` | Supported by evidence, but not directly proven. |
| `unknown` | Required fact was not available and must not be invented. |
| `stale` | Evidence exists but appears outdated relative to current project facts. |

Unknown and stale facts are first-class data. They must appear in JSON fields,
not only in prose.

## Shared Summary Rendering

`REVIEW-SUMMARY.json`, `FINDINGS.md`, `RECOMMENDED-ACTIONS.md`, and future CLI
status output must render from one shared summary object. Counts such as total
findings, findings by severity, blockers, required decisions, rejected
assumptions, and preserved stricter local rules must not be recomputed
independently per artifact.

## Focused Schemas

The packet contract is split into focused schemas:

- `REVIEW-SUMMARY.schema.json` owns packet-level status, counts, metadata,
  blockers, decisions, generated artifacts, and embedded findings.
- `FINDING.schema.json` owns individual issue fields, including severity,
  confidence, evidence refs, and recommended action refs.
- `EVIDENCE-REF.schema.json` owns evidence identity and proof.
- `RECOMMENDED-ACTION.schema.json` owns action guidance, not patches.
- `TOOL-MANIFEST.schema.json` owns tool identity and run metadata.

## Out of Scope for V1

- `RISK-MATRIX.md`
- `RECOMMENDED-PATCHES.md`
- Patch bundles or automatic apply behavior
- Per-tool extension schemas
- Adapter-specific generation behavior

These may be added later as projections or explicit fix-mode artifacts after
real demand exists.
