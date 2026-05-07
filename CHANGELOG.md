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
- Added AI Tools Self-Use Gate guidance: validated AI Tools capabilities should
  be considered while developing this repository, but their output remains
  evidence rather than an automatic decision.
- Added New Tool Intake and Placement Gate guidance: every new tool idea must be
  classified by owner, destination, maturity, activation stage, outputs, and
  non-goals before implementation.
- Added Git Baseline Gate guidance: old untracked seed/project files must be
  separated from active work before git cleanliness is used as evidence.

### Planning

- Inserted Phase 03: Cross-Repo Capability Request Gate.
- Moved Contract Drift Auditor MVP from Phase 03 to Phase 04.
- Moved Integration and Release Hardening from Phase 04 to Phase 05.
- Added `RENDER-01` to Phase 04 for a shared packet renderer so JSON,
  Markdown, recommended actions, evidence, and CLI status come from one packet
  model.
- Consolidated untracked seed ideas into `tools/*/SEED-IDEAS.md`,
  `standards/review-packet/SEED-IDEAS.md`, and `docs/`, removing obsolete
  root-level seed folders.

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

- Changed scope: completed shared read-only safety helpers for canonical JSON,
  output path isolation, secret-like path-only evidence, default ignored target
  walks, and raw fixture tree hashing.
- Validation: added focused helper tests plus integrated fixture tests proving
  output isolation, generated packet exclusion, secret sentinel non-leakage, and
  no target fixture mutation. `npm.cmd test` passed with 40 tests.
- Changed tool capabilities: future auditors can reuse deterministic safety
  primitives and the seven target fixtures before `contract-drift-auditor`
  exists.
- Changed contracts, gates, schemas, and review packet semantics: no changes to
  the Phase 01 review packet schema contract or cross-repo gates.
- Compatibility impact for `ai-workspace-kit`: no dependency or runtime
  integration added. The generated packet ignore policy recognizes stale
  ai-workspace-kit adoption packet markers inside target fixtures as ignored
  generated review material.
- Breaking changes: none.
- Migration notes: none.
- Upstream impact: reviewed `ai-workspace-kit` upstream changes through commit
  `48ec037` before writing Phase 02 plans; no upstream changelog artifact was
  available to pre-read.
