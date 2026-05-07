---
phase: 03-cross-repo-capability-request-gate
plan: 03-02
subsystem: planning-governance
tags: [cross-repo, playbook, agents, gates]
requires:
  - phase: 03-cross-repo-capability-request-gate
    provides: protocol templates and gate registry from plan 03-01
provides:
  - cross-repo capability request playbook
  - AGENTS routing to gate registry and playbook
  - explicit no-automatic-work boundary
affects: [cross-repo-protocol, workflow-gates, ai-workspace-kit-interop, phase-03]
tech-stack:
  added: []
  patterns: [registry-backed gate evidence, request-as-decision-point]
key-files:
  created:
    - .planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md
  modified:
    - AGENTS.md
key-decisions:
  - "Requests are decision inputs, not automatic obligations."
  - "AGENTS.md now routes agents to the gate registry and cross-repo playbook."
  - "Mechanical gate-linter output remains evidence only; semantic decisions remain assistant-owned."
patterns-established:
  - "Cross-repo requests use inbox/outbox/decisions rather than roadmap mutation."
  - "Local assistant guidance points to durable artifacts instead of relying on session memory."
requirements-completed: [XREPO-06, XREPO-07, GATE-01, GATE-02, GATE-04, GATE-05, GATE-06]
duration: 5 min
completed: 2026-05-07
---

# Phase 03 Plan 02: Capability Request Playbook Summary

**Cross-repo request playbook with AGENTS routing to registry-backed gate evidence**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-07T15:43:00Z
- **Completed:** 2026-05-07T15:48:00Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- Added `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`.
- Documented when to create, reject, defer, stale, or supersede a request.
- Documented Outgoing Need Gate and Incoming Review Gate stage mapping.
- Documented ownership boundaries between AI Tools and `ai-workspace-kit`.
- Updated `AGENTS.md` to point to `.planning/gates/registry.json` and the playbook.

## Task Commits

Each task was committed atomically:

1. **Task 1: Cross-repo request playbook** - `c81a052` (docs)
2. **Task 2: AGENTS registry/playbook routing** - `7094c05` (docs)
3. **Task 3: Boundary verification** - no file changes; verification-only task

## Files Created/Modified

- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` - Human playbook for cross-repo requests, decisions, gates, and ownership.
- `AGENTS.md` - Local assistant contract now references the gate registry, playbook, `Gate Resolution`, and decision artifacts.

## Decisions Made

- Treated cross-repo requests as decision inputs rather than obligations.
- Kept gate review assistant-owned; future mechanical lint output is evidence only.
- Kept the playbook explicit about no automatic phase creation, no automatic tool runs, no copied `.planning`, and no runtime dependency.

## Deviations from Plan

None - plan executed exactly as written.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope expansion; playbook and AGENTS routing stay documentation/protocol only.

## Issues Encountered

None.

## Verification

- `Select-String` checks for `Outgoing Need Gate`, `Incoming Review Gate`, `not an automatic obligation`, `ai-workspace-kit owns`, and `AI Tools owns` - passed.
- `Select-String` checks for `.planning/gates/registry.json`, `CROSS-REPO-CAPABILITY-REQUESTS.md`, and `Gate Resolution` in `AGENTS.md` - passed.
- Boundary checks confirmed the docs include no automatic integration, no automatic phase creation, no automatic tool runs, no dependency, no copied `.planning`, and evidence-only mechanical lint output.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

The playbook and AGENTS routing are ready for Plan 03-03 request examples,
decision artifact, docs validation, and changelog updates.

---
*Phase: 03-cross-repo-capability-request-gate*
*Completed: 2026-05-07*
