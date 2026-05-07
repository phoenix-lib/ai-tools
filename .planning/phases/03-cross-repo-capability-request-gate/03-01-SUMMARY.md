---
phase: 03-cross-repo-capability-request-gate
plan: 03-01
subsystem: planning-governance
tags: [cross-repo, gates, templates, registry]
requires:
  - phase: 02-shared-safety-harness
    provides: deterministic project safety foundation and fixture discipline
provides:
  - cross-repo request directory structure
  - capability request template
  - capability decision template
  - machine-readable gate registry
affects: [cross-repo-protocol, workflow-gates, ai-workspace-kit-interop, phase-03]
tech-stack:
  added: []
  patterns: [Markdown canonical requests, JSON gate registry, observable gate evidence]
key-files:
  created:
    - .planning/cross-repo/inbox/.gitkeep
    - .planning/cross-repo/outbox/.gitkeep
    - .planning/cross-repo/decisions/.gitkeep
    - .planning/cross-repo/templates/CAPABILITY-REQUEST.md
    - .planning/cross-repo/templates/CAPABILITY-DECISION.md
    - .planning/gates/registry.json
  modified: []
key-decisions:
  - "Use Markdown for human-reviewed cross-repo requests and decisions."
  - "Use .planning/gates/registry.json as the machine-readable source for gate evidence requirements."
  - "Gate outputs are evidence and do not replace assistant-owned semantic decisions."
patterns-established:
  - "Cross-repo request directories are separated into inbox, outbox, decisions, and templates."
  - "Gate registry entries include stages, artifacts, required fields, observable outputs, and skip behavior."
requirements-completed: [XREPO-01, XREPO-02, XREPO-03, XREPO-04, XREPO-05, GATE-01, GATE-02, GATE-04, GATE-05, GATE-06]
duration: 8 min
completed: 2026-05-07
---

# Phase 03 Plan 01: Cross-Repo Protocol Foundation Summary

**Markdown capability request/decision templates with a JSON gate registry for observable workflow enforcement**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-07T15:35:00Z
- **Completed:** 2026-05-07T15:43:00Z
- **Tasks:** 4
- **Files modified:** 6

## Accomplishments

- Created `.planning/cross-repo/` structure with `inbox`, `outbox`, `decisions`, and `templates`.
- Added `CAPABILITY-REQUEST.md` with required fields, headings, boundary classifications, and status guidance.
- Added `CAPABILITY-DECISION.md` with required fields, scope sections, and allowed decision statuses.
- Added `.planning/gates/registry.json` with the nine required gates and their observable evidence rules.

## Task Commits

Each task was committed atomically:

1. **Task 1: Cross-repo protocol directories** - `60ed22a` (docs)
2. **Task 2: Capability request template** - `3d2169d` (docs)
3. **Task 3: Capability decision template** - `bc435e1` (docs)
4. **Task 4: Gate enforcement registry** - `e823845` (docs)

## Files Created/Modified

- `.planning/cross-repo/inbox/.gitkeep` - Tracks incoming request directory.
- `.planning/cross-repo/outbox/.gitkeep` - Tracks outgoing request directory.
- `.planning/cross-repo/decisions/.gitkeep` - Tracks decision directory.
- `.planning/cross-repo/templates/CAPABILITY-REQUEST.md` - Canonical request template.
- `.planning/cross-repo/templates/CAPABILITY-DECISION.md` - Canonical decision template.
- `.planning/gates/registry.json` - Machine-readable gate registry.

## Decisions Made

- Kept cross-repo requests and decisions as Markdown because they are negotiated human-review artifacts.
- Kept gate enforcement in JSON because validators need stable IDs, stages, fields, and skip behavior.
- Kept all gate automation boundaries explicit: artifacts are evidence, not automatic decisions.

## Deviations from Plan

None - plan executed exactly as written.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope expansion; no cross-repo dependency, tool run, or roadmap mutation was introduced.

## Issues Encountered

None.

## Verification

- `Test-Path .planning/cross-repo/inbox; Test-Path .planning/cross-repo/outbox; Test-Path .planning/cross-repo/decisions; Test-Path .planning/cross-repo/templates` - passed.
- `Select-String` checks for request template required fields and vocabulary - passed.
- `Select-String` checks for decision template required fields and statuses - passed.
- `node -e` registry parse and required gate ID check - passed.
- Boundary search found no production imports from `.external/ai-workspace-kit`; only existing fixture tests mention the path.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

The protocol foundation is ready for Plan 03-02 playbook writing and AGENTS routing.

---
*Phase: 03-cross-repo-capability-request-gate*
*Completed: 2026-05-07*
