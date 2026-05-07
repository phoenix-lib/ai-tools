# Capability Decision

Protocol version: 1.0
Request ID: REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor
Canonical ID: REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor
Thread ID: THREAD-20260507-contract-drift-auditor
Origin: mirrored
Mirror required: true
Counterpart ID: REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor
Counterpart path: ai-workspace-kit/.planning/cross-repo/outbox/2026-05-07-ai-tools-contract-drift-auditor.md
Legacy ID: 2026-05-07-ai-tools-contract-drift-auditor
Decision: planned
Decided by: AI Tools assistant
Date: 2026-05-07
Target phase: Phase 4 - Contract Drift Auditor MVP
Reason: The request matches Phase 4 roadmap scope and AI Tools ownership of external read-only auditors.

## Outcome

Plan the read-only `contract-drift-auditor` as Phase 4 work. The auditor should
emit AI Tools review packet artifacts and remain optional evidence for
`ai-workspace-kit`, GSD, humans, and CI.

## Scope Accepted

- Read-only CLI with explicit `--project <path>` and `--out <dir>`.
- Detection for missing referenced files, stale or missing source layers,
  missing referenced commands, absent-tool permissions, missing or invalid
  skills, and profile/source facts that cannot be verified from local evidence.
- `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md` output through the shared review packet standard.
- Secret-like files as path-only evidence.
- Output path isolation and target-project non-mutation tests.
- Optional consumption or recommendation by `ai-workspace-kit`.

## Scope Rejected

- Making AI Tools mandatory for `ai-workspace-kit`.
- Automatic cross-repo execution or dependency wiring.
- Adoption/bootstrap contract generation inside AI Tools.
- Generated contract installation or merge-routing behavior inside AI Tools.
- Copying `.planning` state between repositories.
- Auto-fixing target projects in the MVP.

## Required Follow-Up

- `$gsd-plan-phase 4` must run the upstream freshness gate before planning.
- Phase 4 planning must include the shared packet renderer because `RENDER-01`
  is required before the first auditor can safely emit multiple artifacts.
- Phase 4 implementation must validate packet output against existing schemas
  and preserve target fixture tree hashes.

## Compatibility Notes

This decision preserves the tandem boundary:

- AI Tools owns external read-only auditors and review packet mechanics.
- `ai-workspace-kit` owns adoption/bootstrap contracts, adapter guidance,
  generated contract policy, and project-local contract installation guidance.

The auditor output is evidence. It does not automatically decide adoption,
phase creation, permission approval, or cross-repo integration.
