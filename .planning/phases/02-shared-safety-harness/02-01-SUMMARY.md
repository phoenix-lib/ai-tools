---
phase: 02-shared-safety-harness
plan: 02-01
subsystem: shared-safety
tags: [canonical-json, path-guard, secret-policy, file-walker, node-test]
requires:
  - phase: 01-review-packet-standard
    provides: review packet schemas and canonical JSON guidance
provides:
  - shared canonical JSON helper
  - output path guard for target-project audits
  - path-only secret evidence policy
  - deterministic ignored-file walker
affects: [contract-drift-auditor, review-packet, phase-02]
tech-stack:
  added: []
  patterns: [CommonJS shared helpers, node:test focused helper tests]
key-files:
  created:
    - shared/canonical-json.js
    - shared/path-guard.js
    - shared/secret-policy.js
    - shared/ignore-policy.js
    - shared/file-walker.js
    - test/shared/canonical-json.test.js
    - test/shared/path-guard.test.js
    - test/shared/secret-policy.test.js
    - test/shared/file-walker.test.js
  modified: []
key-decisions:
  - "Keep Phase 2 helpers generic and independent from .external/ai-workspace-kit runtime code."
  - "Classify secret-like paths by basename and path segments so credential directories remain path-only."
patterns-established:
  - "Shared helpers expose small deterministic CommonJS functions."
  - "Focused helper tests cover safety primitives before any auditor CLI exists."
requirements-completed: [SAFE-01, SAFE-02, SAFE-03, SAFE-04]
duration: 20 min
completed: 2026-05-07
---

# Phase 02 Plan 01: Shared Safety Helper Foundation Summary

**Reusable CommonJS safety helpers for canonical JSON, output isolation, secret path-only evidence, and deterministic file walking**

## Performance

- **Duration:** 20 min
- **Started:** 2026-05-07T14:33:00Z
- **Completed:** 2026-05-07T14:53:00Z
- **Tasks:** 4
- **Files modified:** 9

## Accomplishments

- Added `shared/canonical-json.js` with recursive key sorting and one trailing newline.
- Added `shared/path-guard.js` with real-path-aware output containment checks.
- Added `shared/secret-policy.js` with conservative path-only secret evidence refs.
- Added `shared/ignore-policy.js` and `shared/file-walker.js` for deterministic evidence walking.
- Added focused `node:test` coverage for every helper.

## Task Commits

Each task was committed atomically:

1. **Task 1: Canonical JSON helper** - `bb3e1b3` (feat)
2. **Task 2: Output path guard** - `8da3a89` (feat)
3. **Task 3: Secret path policy** - `c01cf40` (feat)
4. **Task 4: Ignore policy and file walker** - `726bed1` (feat)

## Files Created/Modified

- `shared/canonical-json.js` - Shared canonical JSON sorter/serializer.
- `shared/path-guard.js` - Output directory safety checks for target audits.
- `shared/secret-policy.js` - Secret-like path classifier and path-only evidence ref builder.
- `shared/ignore-policy.js` - Default ignored dirs and generated packet/nested checkout detection.
- `shared/file-walker.js` - Deterministic sorted project file walker.
- `test/shared/*.test.js` - Focused helper tests.

## Decisions Made

- Kept upstream `ai-workspace-kit` code as a reference only; no production imports from `.external/ai-workspace-kit`.
- Made secret classification segment-aware, so directories such as `credentials/` make contained files path-only.

## Deviations from Plan

None - plan executed within the intended helper/test scope.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope expansion; helper behavior remained generic and framework-agnostic.

## Issues Encountered

- Initial sandbox test runs failed with `spawn EPERM`; the same tests passed when rerun with approved `npm.cmd test` escalation.
- The first secret-policy implementation classified only basenames. The focused test caught `credentials/service.json`; classification was corrected to inspect path segments.

## Verification

- `npm.cmd test -- test/shared/canonical-json.test.js` - passed.
- `npm.cmd test -- test/shared/path-guard.test.js` - passed.
- `npm.cmd test -- test/shared/secret-policy.test.js` - passed after segment-aware fix.
- `npm.cmd test -- test/shared/file-walker.test.js` - passed.
- `npm.cmd test` - passed, 22 tests.
- Boundary checks confirmed no `tools/contract-drift-auditor/` directory was introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

The shared helper foundation is ready for Plan 02-02 fixture tree hashing and no-mutation proof.

---
*Phase: 02-shared-safety-harness*
*Completed: 2026-05-07*
