# Changelog

This file records notable project-level changes after each completed phase,
major plan execution, and workflow gate change.

## Unreleased

### Workflow Gates

- Added a planned changelog gate: after each major task or phase, update this
  file with what changed, validation performed, and any `ai-workspace-kit`
  upstream impact.
- Planned an `ai-workspace-kit` gate review hook for release/maintenance once
  that upstream capability exists. Until then, gate relevance/conflict review is
  manual and routed through cross-repo requests or decisions.

### Planning

- Inserted Phase 03: Cross-Repo Capability Request Gate.
- Moved Contract Drift Auditor MVP from Phase 03 to Phase 04.
- Moved Integration and Release Hardening from Phase 04 to Phase 05.

### Cross-Repo Requests

- Captured an incoming `ai-workspace-kit` request for changelog gate
  compatibility, assistant-owned gate review, and future evidence-only
  mechanical gate-linter support. The structured `.planning/cross-repo/`
  protocol is not implemented yet, so the request is preserved as a pending
  Phase 03 todo. Mechanical gate-linter is recorded as a v2 candidate, not a
  v1 implementation dependency.

## 2026-05-07

### Phase 01: Review Packet Standard

- Defined the shared review packet schemas, taxonomy, examples, canonical JSON
  guidance, and schema validation tests.
- Validated deterministic review packet examples and summary count consistency.

### Phase 02: Shared Safety Harness

- Planned shared read-only safety helpers, fixture harnesses, mutation proof,
  and integrated safety tests.
- Reviewed `ai-workspace-kit` upstream changes through commit `48ec037` before
  writing Phase 02 plans.
