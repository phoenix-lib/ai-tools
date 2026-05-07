---
phase: 01-review-packet-standard
plan: 01-03
subsystem: standards-testing
tags: [review-packet, canonical-json, ajv, node-test, examples]
requires:
  - phase: 01-02
    provides: Complete focused review packet schema set
provides:
  - Canonical JSON guidance
  - Pass and human-review example packets
  - Node test harness for schema validation and determinism
affects: [phase-1, phase-2, contract-drift-auditor]
tech-stack:
  added:
    - ajv
    - ajv-formats
  patterns:
    - Dev-only schema validation with Ajv 2020
    - Canonical JSON fixture checks
    - Markdown projection consistency checks
key-files:
  created:
    - package.json
    - package-lock.json
    - standards/review-packet/CANONICAL-JSON.md
    - standards/review-packet/examples/pass/REVIEW-SUMMARY.json
    - standards/review-packet/examples/pass/EVIDENCE.json
    - standards/review-packet/examples/pass/FINDINGS.md
    - standards/review-packet/examples/pass/RECOMMENDED-ACTIONS.md
    - standards/review-packet/examples/human-review/REVIEW-SUMMARY.json
    - standards/review-packet/examples/human-review/EVIDENCE.json
    - standards/review-packet/examples/human-review/FINDINGS.md
    - standards/review-packet/examples/human-review/RECOMMENDED-ACTIONS.md
    - test/review-packet/schema-validation.test.js
    - test/review-packet/canonical-json.test.js
  modified:
    - .gitignore
    - standards/review-packet/schemas/EVIDENCE-REF.schema.json
    - standards/review-packet/schemas/FINDING.schema.json
    - standards/review-packet/schemas/REVIEW-SUMMARY.schema.json
key-decisions:
  - "Used Ajv2020 plus ajv-formats for dev-only schema validation."
  - "Added pass and human_review_required examples as the first packet fixtures."
  - "Made example JSON canonical and tested that property directly."
patterns-established:
  - "Tests validate examples against schemas before later tools emit packets."
  - "Tests compare Markdown status/count projections against REVIEW-SUMMARY.json."
requirements-completed:
  - RPS-01
  - RPS-02
  - RPS-03
  - RPS-04
  - RPS-05
  - RPS-06
  - SAFE-04
  - SAFE-06
  - TEST-01
  - TEST-05
  - TEST-06
duration: 11 min
completed: 2026-05-07
---

# Phase 01 Plan 01-03: Canonical JSON Examples and Validation Summary

**Canonical review packet examples validated with Ajv and Node test coverage**

## Performance

- **Duration:** 11 min
- **Started:** 2026-05-07T13:05:05Z
- **Completed:** 2026-05-07T13:15:46Z
- **Tasks:** 4
- **Files modified:** 17

## Accomplishments

- Added minimal Node test harness with `npm test`.
- Documented canonical JSON rules for recursively sorted keys and trailing newline.
- Created `pass` and `human-review` packet examples with all four required artifacts.
- Added tests for schema validation, canonical JSON, summary counts, path-only evidence, and Markdown projection consistency.

## Task Commits

Each planned task was included in the implementation commit:

1. **Task 1: Node test harness** - `dc7b6a0`
2. **Task 2: Canonical JSON guidance** - `dc7b6a0`
3. **Task 3: Example packets** - `dc7b6a0`
4. **Task 4: Validation tests** - `dc7b6a0`

**Plan metadata:** this summary commit.

## Files Created/Modified

- `package.json` - Minimal CommonJS package with `npm test`.
- `package-lock.json` - Locked dev dependency graph.
- `.gitignore` - Ignores `node_modules/`.
- `standards/review-packet/CANONICAL-JSON.md` - Deterministic serialization rules.
- `standards/review-packet/examples/pass/*` - Passing packet fixture.
- `standards/review-packet/examples/human-review/*` - Human-review packet fixture with path-only evidence.
- `test/review-packet/canonical-json.test.js` - Canonical serialization and fixture checks.
- `test/review-packet/schema-validation.test.js` - Ajv schema validation and projection consistency checks.
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json` - Strict-mode conditional fix for path-only `sha256`.
- `standards/review-packet/schemas/FINDING.schema.json` - Absolute schema refs for Ajv resolution.
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json` - Absolute schema refs for Ajv resolution.

## Decisions Made

- Kept Ajv and `ajv-formats` as dev dependencies only.
- Used `Ajv2020` because the schemas declare draft 2020-12.
- Validated Markdown projections by checking status and counts against JSON summaries.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed strict Ajv schema resolution and conditional validation**
- **Found during:** Task 4 (schema validation tests)
- **Issue:** `npm test` failed because relative `$ref` values resolved incorrectly from schema `$id`, and Ajv strict mode rejected a conditional `required` check for `sha256`.
- **Fix:** Switched cross-schema refs to absolute schema IDs and changed the path-only conditional to forbid `sha256` via `properties.sha256: false`.
- **Files modified:** `standards/review-packet/schemas/EVIDENCE-REF.schema.json`, `standards/review-packet/schemas/FINDING.schema.json`, `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json`
- **Verification:** `npm.cmd test` passed 7/7.
- **Committed in:** `dc7b6a0`

**2. [Rule 3 - Blocking] Fixed non-canonical example key order**
- **Found during:** Task 4 (canonical JSON tests)
- **Issue:** `human-review/REVIEW-SUMMARY.json` had one recommended action key out of canonical order.
- **Fix:** Reordered `suggested_file` before `summary` to match recursive canonical sorting.
- **Files modified:** `standards/review-packet/examples/human-review/REVIEW-SUMMARY.json`
- **Verification:** `npm.cmd test` passed 7/7.
- **Committed in:** `dc7b6a0`

---

**Total deviations:** 2 auto-fixed (2 blocking).
**Impact on plan:** Both fixes strengthened the standard and were required for deterministic schema validation. No scope creep.

## Issues Encountered

- Initial `npm install` attempt timed out without writing a lockfile. Re-ran with approved elevated execution and completed successfully.

## User Setup Required

None - no external service configuration required.

## Verification

- `npm.cmd test -- --help` confirmed the test script is wired.
- `Select-String` confirmed canonical JSON guidance mentions recursive sorting, array order, trailing newline, and path-only evidence.
- `node -e` parsed all example JSON artifacts.
- `npm.cmd test` passed 7/7.
- Search confirmed no target-project auditor, file walker, or mutation-capable CLI was introduced.

## Self-Check: PASSED

- Required files exist.
- Acceptance criteria passed.
- Plan-level verification passed.
- Examples validate against schemas and are canonical.
- Summary counts match findings and Markdown projections.

## Next Phase Readiness

Phase 1 deliverables are ready for phase-level verification and for Phase 2 to promote canonical JSON and evidence behavior into shared helpers.

---
*Phase: 01-review-packet-standard*
*Completed: 2026-05-07*
