---
phase: 01-review-packet-standard
plan: 01-02
subsystem: standards
tags: [review-packet, evidence, recommended-actions, tool-manifest, json-schema]
requires:
  - phase: 01-01
    provides: Review packet README plus summary and finding schemas
provides:
  - Evidence reference schema
  - Recommended action schema
  - Tool manifest schema
  - Schema wiring across summary, findings, evidence, actions, and tool metadata
affects: [phase-1, phase-2, contract-drift-auditor]
tech-stack:
  added: []
  patterns:
    - Path-only secret evidence
    - Recommended actions separated from patch/application behavior
    - Tool metadata modeled without ai-workspace-kit runtime dependency
key-files:
  created:
    - standards/review-packet/schemas/EVIDENCE-REF.schema.json
    - standards/review-packet/schemas/RECOMMENDED-ACTION.schema.json
    - standards/review-packet/schemas/TOOL-MANIFEST.schema.json
  modified:
    - standards/review-packet/README.md
    - standards/review-packet/schemas/REVIEW-SUMMARY.schema.json
    - standards/review-packet/schemas/FINDING.schema.json
key-decisions:
  - "Path-only evidence forbids sha256 so secret-like contents are not hashed into packet data."
  - "Recommended actions are guidance only and do not contain patch bodies."
  - "Tool manifest mirrors ai-workspace-kit concepts without adopting its adapter manifest."
patterns-established:
  - "Evidence refs require normalized relative paths, reason, confidence, and path_only."
  - "Tool metadata includes generated files, policy hashes, requested outputs, run timestamp, and safety profile."
requirements-completed:
  - RPS-03
  - RPS-04
  - RPS-05
  - RPS-06
  - SAFE-06
duration: 4 min
completed: 2026-05-07
---

# Phase 01 Plan 01-02: Evidence, Actions, and Tool Manifest Summary

**Evidence refs, recommended actions, and tool metadata wired into the review packet schema set**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-07T13:01:51Z
- **Completed:** 2026-05-07T13:05:05Z
- **Tasks:** 4
- **Files modified:** 6

## Accomplishments

- Added strict schemas for evidence refs, recommended actions, and tool manifests.
- Updated summary and finding schemas to reference focused schema files.
- Documented path-only evidence, action guidance, and `ai-workspace-kit` concept compatibility.

## Task Commits

Each planned task was included in the implementation commit:

1. **Task 1: Evidence ref schema** - `d740e8c`
2. **Task 2: Recommended action schema** - `d740e8c`
3. **Task 3: Tool manifest schema** - `d740e8c`
4. **Task 4: Schema wiring and README guidance** - `d740e8c`

**Plan metadata:** this summary commit.

## Files Created/Modified

- `standards/review-packet/schemas/EVIDENCE-REF.schema.json` - Evidence identity and proof schema.
- `standards/review-packet/schemas/RECOMMENDED-ACTION.schema.json` - Concrete next-step guidance schema.
- `standards/review-packet/schemas/TOOL-MANIFEST.schema.json` - Tool/run metadata schema.
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json` - References tool manifest and recommended actions.
- `standards/review-packet/schemas/FINDING.schema.json` - Allows evidence/action refs by id or object.
- `standards/review-packet/README.md` - Adds evidence/action/tool manifest guidance.

## Decisions Made

- Enforced no `sha256` on `path_only: true` evidence to avoid hashes derived from secret contents.
- Kept recommended actions separate from patches, apply instructions, and permission grants.
- Used `TOOL-MANIFEST.schema.json` for shared metadata instead of copying `ai-workspace-kit`'s exact adoption manifest.

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope change.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Verification

- `node -e` parsed all five schema files.
- `Select-String` confirmed README guidance for `path_only`, `TOOL-MANIFEST`, recommended actions, and `ai-workspace-kit`.
- Search confirmed no runtime import from `.external/ai-workspace-kit`.
- Search confirmed schema/guidance references to path-only evidence, `sha256`, source commit, requested outputs, and no patch bodies.

## Self-Check: PASSED

- Required files exist.
- Acceptance criteria passed.
- Plan-level verification passed.
- No runtime dependency on `ai-workspace-kit` was introduced.

## Next Phase Readiness

Ready for plan 01-03 to add canonical JSON guidance, examples, and schema validation tests.

---
*Phase: 01-review-packet-standard*
*Completed: 2026-05-07*
