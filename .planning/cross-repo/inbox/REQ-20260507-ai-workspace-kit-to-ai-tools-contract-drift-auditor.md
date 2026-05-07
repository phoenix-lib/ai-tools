# Capability Request

Protocol version: 1.0
Canonical ID: REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor
Counterpart ID: REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor
Counterpart path: C:/projects/ai-workspace-kit/.planning/cross-repo/outbox/2026-05-07-ai-tools-contract-drift-auditor.md
Legacy ID: 2026-05-07-ai-tools-contract-drift-auditor
ID: REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor
From: ai-workspace-kit
To: ai-tools
Status: proposed
Severity: high
Requested by phase/gate: Phase 3 example / cross-repo outgoing-incoming protocol
Boundary classification: external ai-tools capability

## Need

Read-only `contract-drift-auditor` that checks whether project assistant
contracts, commands, skills, permissions, and source layers still match local
project reality.

## Why

`ai-workspace-kit` adoption review can detect generated-contract merge
conflicts and adoption packet issues, but it should not implement heavy external
auditors. Deep checks for stale commands, stale skills, source-layer drift,
permission drift, and profile fact drift belong in AI Tools.

## Evidence

- Mirrors `ai-workspace-kit` legacy request
  `2026-05-07-ai-tools-contract-drift-auditor`; do not count the legacy file
  and this canonical inbox artifact as separate requests.
- `tools/contract-drift-auditor/SEED-IDEAS.md`
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md`
- `AGENTS.md` AI Tools Self-Use Gate and Tandem Boundary Gate

## Boundary

AI Tools owns this external auditor. `ai-workspace-kit` may recommend it and
consume review-packet-compatible output, but must not hide the auditor inside
adoption/bootstrap behavior.

## Expected Output

- `REVIEW-SUMMARY.json`
- `FINDINGS.md`
- `EVIDENCE.json`
- optional `RECOMMENDED-ACTIONS.md` when the shared packet renderer exists

## Compatibility Impact

The output should align with AI Tools review packet standards so
`ai-workspace-kit`, GSD, humans, and CI can consume the same status, severity,
evidence, and recommendation semantics.

## Acceptance Criteria

- Auditor is read-only by default.
- CLI uses explicit `--project <path>` and `--out <dir>`.
- Output directory inside the target project is rejected for target-project
  audits.
- Secret-like contents stay path-only.
- Findings cite evidence refs.
- `ai-workspace-kit` remains optional consumer, not a runtime dependency.

## Non-Goals

- Do not implement adoption/bootstrap contracts inside AI Tools.
- Do not add automatic `ai-workspace-kit` execution paths.
- Do not make AI Tools mandatory for `ai-workspace-kit`.
- Do not copy `.planning` state between repositories.
- Do not auto-fix target projects.

## Decision Needed

Should AI Tools keep `contract-drift-auditor` as the next external auditor MVP
after the cross-repo protocol is complete?

## Review / Expiry

Review during Phase 4 planning. Mark stale if the auditor scope is superseded
by a later roadmap decision.
