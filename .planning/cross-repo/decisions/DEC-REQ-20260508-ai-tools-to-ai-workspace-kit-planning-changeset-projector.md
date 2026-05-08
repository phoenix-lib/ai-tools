# Capability Decision

Protocol version: 1.0
Request ID: REQ-20260508-ai-tools-to-ai-workspace-kit-planning-changeset-projector
Canonical ID: DEC-REQ-20260508-ai-tools-to-ai-workspace-kit-planning-changeset-projector
Thread ID: THREAD-20260508-planning-changeset-projector
Origin: local-created
Mirror required: false
Counterpart ID: none
Counterpart path: none
Legacy ID: none
Decision: planned
Decided by: assistant
Date: 2026-05-08
Target phase: Phase 20
Reason: Planning artifact projection mutates workflow state and belongs to GSD / `ai-workspace-kit`; AI Tools should plan only schemas, compatibility notes, request evidence, and optional read-only validation.

## Outcome

Plan AI Tools Phase 20 around the planning changeset protocol, examples,
boundary documentation, and cross-repo request. Do not implement the mutating
projector in AI Tools unless the future scope is explicitly changed.

## Scope Accepted

- Define typed `planning-changeset/v1` schema requirements.
- Capture examples or fixtures for operation records, base commit and file-hash
  preconditions, expected projections, and idempotency expectations.
- Request kit/GSD ownership of the projector apply engine.
- Allow a future AI Tools read-only validator seed if it only checks
  changesets, journals, projections, and optional `REVIEW-SUMMARY.json` packet
  evidence.

## Scope Rejected

- AI Tools mutating apply engine.
- Hidden free-form semantic routing inside a tool.
- Automatic phase, requirement, roadmap, changelog, gate, or cross-repo request
  creation without typed operations.
- Any required runtime dependency between AI Tools and `ai-workspace-kit`.
- Any copied `.planning` state between repositories.

## Required Follow-Up

Use Phase 20 planning to define the concrete changeset schema, fixture surface,
journal/status semantics, and validator/request boundary. Mirror or transfer
the request upstream only with explicit user approval.

## Compatibility Notes

The request is evidence and planning input only. It does not change
`ai-workspace-kit`, does not run tools, does not apply planning changes, and
does not make AI Tools a gate decision or roadmap mutation authority.
