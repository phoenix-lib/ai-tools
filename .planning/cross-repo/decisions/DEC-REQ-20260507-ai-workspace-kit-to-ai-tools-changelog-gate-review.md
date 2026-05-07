# Capability Decision

Protocol version: 1.0
Request ID: REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review
Canonical ID: REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review
Thread ID: THREAD-20260507-changelog-gate-review
Counterpart ID: none
Counterpart path: none
Legacy ID: none
Decision: planned
Decided by: AI Tools assistant
Date: 2026-05-07
Target phase: Phase 3 for protocol/gate process; v2 for mechanical gate-linter tool
Reason: The process requirements are already aligned with Phase 3 gate enforcement, while mechanical linting is a future AI Tools capability and must stay evidence-only.

## Outcome

Accept the changelog convention and assistant-owned semantic gate review as AI
Tools process requirements. Plan the gate registry and docs validation in Phase
3. Defer the mechanical gate-linter implementation as a v2 optional AI Tools
capability.

## Scope Accepted

- AI Tools updates `CHANGELOG.md` after completed phases, executed major plans,
  and workflow gate changes.
- AI Tools documents that gate review is assistant-owned semantic review.
- AI Tools documents that future mechanical gate checks are evidence only.
- Phase 3 adds `.planning/gates/registry.json` and docs validation for required
  gate/protocol artifacts.
- `ai-workspace-kit` may read AI Tools changelog first during freshness checks
  without installing, running, or depending on AI Tools automatically.

## Scope Rejected

- Automatic phase creation from incoming requests.
- Automatic tool execution across repositories.
- Runtime dependency between repositories.
- Copying `.planning` state between repositories.
- Duplicating AI Tools contract drift auditor inside `ai-workspace-kit`.
- Treating mechanical gate-linter output as the final semantic decision.

## Required Follow-Up

- Complete Phase 3 protocol, playbook, example requests, decision artifacts,
  and docs validation.
- Keep mechanical gate-linter as v2 candidate `GATELINT-01` until deliberately
  promoted.
- Revisit gate-review integration at release/maintenance boundaries when
  `ai-workspace-kit` exposes that capability.

## Compatibility Notes

This decision preserves the tandem boundary:

- `ai-workspace-kit` owns adoption/bootstrap contracts, adapter guidance,
  generated contract policy, permission policy, and assistant-led gate-review
  procedure.
- AI Tools owns or may own external auditors, review packet mechanics, and
  mechanical evidence tools.

Tool output is evidence, not the final decision.
