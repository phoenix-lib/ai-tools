# Changelog

This file records notable project-level changes after each completed phase,
major plan execution, and workflow gate change.

## Unreleased

### Phase 03: Cross-Repo Capability Request Gate

- Changed cross-repo protocol artifacts: added `.planning/cross-repo/` with
  inbox, outbox, decisions, templates, request examples, a real incoming
  request, and a mixed decision artifact.
- Changed gates: added `.planning/gates/registry.json` as the machine-readable
  gate source for discuss mode, upstream freshness, cross-repo incoming/outgoing
  review, changelog, self-use, new-tool intake, git baseline, and future
  gate-review hook.
- Changed templates: added capability request and decision templates with
  required fields, boundary classifications, decision statuses, non-goals, and
  review/expiry sections.
- Changed review packet/interoperability semantics: documented that
  `ai-workspace-kit` can request AI Tools external auditors through inbox
  requests, and AI Tools can request stable review packet/evidence-ref
  compatibility through outbox requests.
- Compatibility impact for `ai-workspace-kit`: requests are evidence and
  decision inputs only. They do not install, run, or depend on AI Tools
  automatically, and they do not copy `.planning` state between repositories.
- Breaking changes: none for runtime behavior; future GSD artifacts now need
  observable `Gate Resolution` sections when registered gates apply.
- Migration notes: future agents should read `CHANGELOG.md` first, then
  `.planning/gates/registry.json` and
  `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` before changing
  gates or cross-repo protocol behavior.
- Validation: `npm.cmd test -- test/planning/cross-repo-protocol.test.js` and
  `npm.cmd test` passed after Phase 03 docs validation was added.
- Upstream impact: Phase 03 planning checked `ai-workspace-kit` at commit
  `48ec037d058747151c320ced9c0ee1e1d247d4b1`; no upstream changelog or release
  notes artifact existed at that commit, so commit/diff review remains the
  fallback.

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
