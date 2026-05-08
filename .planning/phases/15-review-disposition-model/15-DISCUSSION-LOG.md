# Phase 15: Review Disposition Model - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 15-review-disposition-model
**Areas discussed:** discuss mode gate, artifact shape, fingerprint identity, disposition lifecycle, packet consumer joins, bounded review surface, boundaries

---

## Discuss Mode Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Trusted self | The agent performs one focused self-questioning pass and asks only necessary questions. | yes |
| Manual questions | The agent asks the user questions for each gray area before writing context. | |

**User's choice:** `1` - Trusted self.
**Notes:** The user previously confirmed this is the desired working style for
this project: tools and planning artifacts should be self-used as evidence, but
the assistant keeps responsibility for judgment.

---

## Artifact Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Sidecar `REVIEW-DISPOSITIONS.json` | Human review metadata lives beside packets or in an external review directory without rewriting source packets. | yes |
| Embed dispositions into `REVIEW-SUMMARY.json` findings | Would require changing strict finding schema and would blur source evidence with review metadata. | |
| New auditor/tool | Would expand the ecosystem rather than consume existing evidence. | |

**User's choice:** Trusted self selected sidecar artifact.
**Notes:** Sidecar shape best preserves source packet integrity and aligns with
the requirement that dispositions do not suppress or rewrite findings.

---

## Fingerprint Identity

| Option | Description | Selected |
|--------|-------------|----------|
| Stable fingerprint helper | Derive `finding_fingerprint` from source tool, source check id, normalized source path, and normalized target. | yes |
| Current finding id only | Too brittle because rollup and ledger already occurrence-normalize duplicate ids. | |
| Title/summary hash | Too sensitive to prose changes and not evidence-grounded enough. | |

**User's choice:** Trusted self selected stable fingerprint helper.
**Notes:** This implements the planning refinement captured as DISP-05.

---

## Disposition Lifecycle

| Option | Description | Selected |
|--------|-------------|----------|
| Required expiry | Every disposition has `expires_at`; expired records remain visible. | yes |
| Optional/no expiry | Easier for users, but stale review context can silently accumulate. | |
| Manual expired status | Lets stale state depend on a label instead of time calculation. | |

**User's choice:** Trusted self selected required expiry.
**Notes:** Expiry should be computed from `expires_at`, not stored as a manual
status.

---

## Packet Consumer Joins

| Option | Description | Selected |
|--------|-------------|----------|
| Rollup consumes dispositions | `review-packet-rollup` is the first consumer and emits a separate join artifact. | yes |
| Producers consume dispositions | Would mix source evidence generation with human review metadata. | |
| No consumer integration | Would define schema but not prove practical value. | |

**User's choice:** Trusted self selected rollup consumer integration.
**Notes:** Phase 13 already created the packet consumer layer, so Phase 15
should build on it instead of changing packet producers.

---

## Bounded Review Surface

| Option | Description | Selected |
|--------|-------------|----------|
| Optional small dashboard | May expose top noisy paths/checks and disposition counts if the core work stays small. | yes |
| Mandatory dashboard | Risks growing beyond disposition schema and join behavior. | |
| No bounded surface ever | Leaves users with only raw counts despite known 383/401 finding self-use noise. | |

**User's choice:** Trusted self selected optional dashboard.
**Notes:** `DISPOSITION-INDEX.json` is core. `REVIEW-DASHBOARD.json` is allowed
only if cheap and mechanical.

---

## Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Phase 15 narrow | No scope/diff, shared CLI migration, portfolio scanning, or automatic safe-ignore. | yes |
| Pull in Phase 16 scope/diff | Would reduce noise but belongs to the next phase. | |
| Add auto-suppression | Violates the evidence-only and human-review boundary. | |

**User's choice:** Trusted self selected narrow Phase 15.
**Notes:** The phase should make human review metadata explicit, not hide
findings.

---

## the agent's Discretion

- Exact schema factoring and helper filenames.
- Whether `DISPOSITION-INDEX.json` is produced only by rollup or by a small
  shared consumer helper used by rollup.
- Whether `REVIEW-DASHBOARD.json` is included in Phase 15 or deferred when the
  core schema/join work is already large.

## Deferred Ideas

- Ledger current/history scope and since-manifest diffing: Phase 16.
- Shared CLI contract: Phase 17.
- ai-workspace-kit LLM instruction compatibility: Phase 18.
- Portfolio real project scanning: future `PORTFOLIO-SCAN-01` milestone
  candidate.
