---
gsd_state_version: 1.0
milestone: v2.1
milestone_name: "Evidence Consumption & Signal Quality"
status: planning
stopped_at: Phase 16 completed
last_updated: "2026-05-08T11:16:05.274Z"
last_activity: 2026-05-08 -- Phase 16 completed; Phase 17 ready to discuss
progress:
  total_phases: 19
  completed_phases: 16
  total_plans: 41
  completed_plans: 36
  percent: 88
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-08)

**Core value:** Produce deterministic, evidence-backed review packets that make
AI project guidance auditable without mutating target projects.
**Current focus:** Phase 17 - Shared CLI Contract

## Current Position

Phase: 17
Plan: Not started
Status: Ready for Phase 17 discussion
Last activity: 2026-05-08 -- Phase 16 completed

Progress: Phase 16 complete; Phase 17 is ready to discuss.

## Performance Metrics

**Velocity:**

- Total v2.1 plans completed: 8
- Average duration: n/a
- Total execution time: n/a

**By Phase (current milestone):**

| Phase | Plans | Status |
|-------|-------|--------|
| 13 | 2/2 | Complete |
| 14 | 2/2 | Complete |
| 15 | 2/2 | Complete |
| 16 | 2/2 | Complete |
| 17 | 0/2 | Planned |
| 18 | 0/1 | Planned |
| 19 | 0/2 | Planned |
| Phase 14 P14-01 | 44 min | 4 tasks | 9 files |
| Phase 14 P14-02 | 19 min | 5 tasks | 8 files |

## Accumulated Context

### Decisions

Decisions are logged in `.planning/PROJECT.md` Key Decisions table.

- Start with review packet schemas before external tools.
- Build one external auditor before expanding the ecosystem.
- Keep `ai-workspace-kit` integration optional and packet-based.
- Enforce the tandem boundary gate: do not duplicate adoption/bootstrap,
  adapter generation, or generated-contract review behavior owned by
  `ai-workspace-kit`.

- Maintain `CHANGELOG.md` after completed phases, executed major plans, and
  workflow gate changes.

- Treat AI Tools self-use output as evidence, not authority.
- Phase 11 promoted only `project-context-ledger` as the next implementation
  candidate; all other broad seed tools remain deferred until trigger evidence
  appears.

- Phase 12 validated `project-context-ledger` as optional read-only evidence,
  not workflow authority.

- Milestone v2.1 starts with evidence consumption and signal quality rather
  than another broad auditor.

- Review packet rollup is planned as a mechanical packet consumer, not a
  semantic suppression or gate decision engine.

- Review dispositions are validated as human review metadata with owner,
  reason, expiry, evidence refs, and stable finding fingerprints.

- Ledger scope and diff modes reduce current-source noise from historical
  phase artifacts and keep changed-fact comparison mechanical evidence only.

- Upstream `ai-workspace-kit` now includes
  `.external/ai-workspace-kit/LLM-PROJECT-INSTRUCTIONS.json`; AI Tools will
  validate optional evidence wording while preserving the tandem boundary.
- Package readiness should be completed before real portfolio scans so AI
  Tools has a stable installable surface, dispatcher, smoke tests, and concise
  consumer recipes.

### Completed Work

- Phases 01-05 validated the review packet standard, shared safety harness,
  cross-repo request gate, contract-drift-auditor MVP, and release hardening.

- Phases 06-09 validated release closeout, centralized metadata, cross-repo
  compatibility checking, contract-drift-auditor CLI ergonomics, and the tool
  registry / workflow gate slimming.

- Phase 10 validated `gates-scan` as an evidence-only mechanical gate linter.
- Phase 11 selected exactly one next v2 tool, `project-context-ledger`, and
  kept other broad seed tools deferred until trigger evidence appears.

- Phase 12 validated `project-context-ledger` with shared packet output, six
  ledger artifacts, secret path-only handling, generated packet exclusion,
  no-mutation tests, self-use evidence, and 188/188 tests passing.

- Phase 13 validated `review-packet-rollup` with shared packet output,
  `PACKET-INDEX.json`, `ROLLUP-GROUPS.json`, occurrence-normalized duplicate
  source finding IDs, self-use evidence, and 218/218 tests passing.

- Phase 14 validated project-context-ledger artifact schemas with six public
  ledger JSON Schemas, generated-output schema validation, deterministic
  occurrence-normalized record IDs, self-use evidence, and 226/226 tests
  passing.
- Phase 15 validated human review dispositions with stable finding
  fingerprints, strict disposition schemas, rollup-side
  `DISPOSITION-INDEX.json`, self-use evidence, and 240/240 tests passing.
- Phase 16 validated ledger scope and diff modes with current-by-default
  filtering, source categories, manifest `ledger_records`, explicit
  `LEDGER-DIFF.json`, self-use evidence, and 247/247 tests passing.

### Roadmap Evolution

- Phase 03 inserted: Cross-Repo Capability Request Gate.
- Former Phase 03 Contract Drift Auditor MVP moved to Phase 04.
- Former Phase 04 Integration and Release Hardening moved to Phase 05.
- Preliminary v2 phases 06-11 were added after Phase 5 to keep release
  discipline, interop validation, CLI ergonomics, tool registry, and future
  tool selection ordered by current risk.

- Phase 12 was added after Phase 11 selected `project-context-ledger` as the
  next single implementation candidate.

- Phase 12 completed the mapped v2 roadmap.
- Milestone v2.1 adds Phases 13-19: review packet rollup, ledger schemas,
  review dispositions, ledger scope/diff modes, shared CLI contract, and
  `ai-workspace-kit` LLM instruction compatibility, followed by package
  readiness and consumer UX hardening.

- Phase 15-17 scope refined after Phase 14 analysis: review dispositions now
  include stable finding fingerprints, ledger scope defaults to current, and a
  post-v2.1 portfolio real-project scan protocol is tracked as a future
  candidate.
- Phase 19 was added after package analysis showed real portfolio scans need
  package metadata, file allowlist, pack/install smoke tests, a top-level
  dispatcher, and consumer quickstart docs before broad local use.

### Pending Todos

- Start Phase 17: Shared CLI Contract.

### Blockers/Concerns

- Automatic cross-repo indexer or gate-linter automation should remain blocked
  unless the Phase 7 read-only compatibility checker is run as evidence and
  reviewed by the assistant.

- Future broad seed tools should remain deferred until their trigger evidence
  appears.

- Phase forensics remains deferred until evidence consumption and triage
  mechanics are stable enough to consume phase review packets without adding
  another noisy analyzer.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Tooling | Cross-repo compatibility checker | Completed in Phase 7 | Phase 5 release hardening |
| Tooling | Mechanical gate linter | Completed in Phase 10 | 2026-05-07 cross-repo request |
| Tooling | Project context ledger | Completed in Phase 12 | Phase 11 selection review |
| Tooling | Phase forensics tool | Deferred until failed-phase or plan/reality mismatch evidence appears | Phase 11 selection review |
| Tooling | Config matrix validator | Deferred until config-heavy environment evidence appears | Phase 11 selection review |
| Tooling | Skill/test/UI/integration tools | Deferred until their trigger evidence appears | Phase 11 selection review |

## Session Continuity

Last session: 2026-05-08T10:47:46.182Z
Stopped at: Phase 16 context gathered
Resume file: .planning/phases/16-ledger-scope-and-diff-modes/16-CONTEXT.md
