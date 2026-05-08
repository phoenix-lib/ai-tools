---
phase: 14-ledger-artifact-schemas
plan: "14-01"
subsystem: standards
tags:
  - json-schema
  - ajv
  - project-context-ledger
requires:
  - phase: 13-review-packet-rollup-mvp
    provides: mechanical packet consumer boundary and evidence-only semantics
provides:
  - Public schemas for all six project-context-ledger artifacts
  - Focused schema contract tests for strict valid and invalid examples
  - Schema standard README preserving optional evidence-only boundaries
affects:
  - project-context-ledger
  - review-packet-consumers
  - ledger-generated-output-validation
tech-stack:
  added: []
  patterns:
    - strict JSON Schema draft 2020-12 under standards/
    - AJV contract tests independent from generated output
key-files:
  created:
    - standards/project-context-ledger/README.md
    - standards/project-context-ledger/schemas/LEDGER-COMMON.schema.json
    - standards/project-context-ledger/schemas/FACTS.schema.json
    - standards/project-context-ledger/schemas/COMMANDS.schema.json
    - standards/project-context-ledger/schemas/CONTRACTS.schema.json
    - standards/project-context-ledger/schemas/SKILLS.schema.json
    - standards/project-context-ledger/schemas/DECISIONS.schema.json
    - standards/project-context-ledger/schemas/CACHE-MANIFEST.schema.json
    - test/project-context-ledger/ledger-schema-contract.test.js
  modified: []
key-decisions:
  - "Kept FACTS, COMMANDS, CONTRACTS, SKILLS, and DECISIONS as top-level arrays."
  - "Kept schema_version on CACHE-MANIFEST.json only for the ledger artifact set."
  - "Left unique IDs and evidence-ref joins as generated-output test responsibilities."
patterns-established:
  - "Ledger artifact schemas live under standards/project-context-ledger/schemas/."
  - "Schema contract tests compile public schemas and validate small examples before generator wiring."
requirements-completed:
  - LEDGER-SCHEMA-01
  - LEDGER-SCHEMA-02
  - LEDGER-SCHEMA-03
duration: 44 min
completed: 2026-05-08
---

# Phase 14 Plan 14-01: Ledger Schema Contracts and Fixture Expectations Summary

**Strict JSON Schema contracts for project-context-ledger artifacts with focused AJV contract coverage**

## Performance

- **Duration:** 44 min
- **Started:** 2026-05-08T08:37:00Z
- **Completed:** 2026-05-08T09:21:15Z
- **Tasks:** 4
- **Files modified:** 9

## Accomplishments

- Added public schemas for `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`,
  `SKILLS.json`, `DECISIONS.json`, and `CACHE-MANIFEST.json`.
- Added `LEDGER-COMMON.schema.json` for shared confidence, ID, path, hash, and
  timestamp definitions.
- Added a standards README that frames ledger schemas as optional evidence
  consumer contracts, not gate or runtime authority.
- Added focused AJV tests proving schema compile, strict rejection, valid
  minimal records, cache source hash policy, and current previous-manifest
  states.

## Task Commits

Each Wave 1 task was committed as one schema-contract implementation commit:

1. **Tasks T1-T4: schema README, schemas, cache manifest schema, and focused tests** - `3562904` (`feat(14-01): add ledger artifact schemas`)

**Plan metadata:** pending in docs commit.

## Files Created/Modified

- `standards/project-context-ledger/README.md` - documents public schema set,
  versioning, evidence refs, and boundaries.
- `standards/project-context-ledger/schemas/LEDGER-COMMON.schema.json` - common
  confidence, ID, path, SHA-256, and timestamp definitions.
- `standards/project-context-ledger/schemas/FACTS.schema.json` - strict fact
  record array schema.
- `standards/project-context-ledger/schemas/COMMANDS.schema.json` - strict
  command record array schema.
- `standards/project-context-ledger/schemas/CONTRACTS.schema.json` - strict
  contract record array schema.
- `standards/project-context-ledger/schemas/SKILLS.schema.json` - strict skill
  record array schema.
- `standards/project-context-ledger/schemas/DECISIONS.schema.json` - strict
  decision record array schema.
- `standards/project-context-ledger/schemas/CACHE-MANIFEST.schema.json` -
  strict cache manifest object schema.
- `test/project-context-ledger/ledger-schema-contract.test.js` - focused
  schema contract tests.

## Decisions Made

- Used a shared helper schema because it removes repeated confidence, ID, path,
  hash, and timestamp definitions while keeping six public artifact schemas.
- Allowed `evidence_refs` arrays to be empty at schema level because generated
  safety aggregate facts can legitimately have zero evidence refs when there
  are zero generated packet dirs or secret paths.
- Kept evidence-ref joins out of JSON Schema and in generated-output tests, as
  planned.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Adjusted FACTS anyOf for AJV strictRequired**
- **Found during:** Task T4 focused schema contract tests.
- **Issue:** AJV strict mode rejected `required: ["text"]` and
  `required: ["value"]` inside `anyOf` because those subschemas did not define
  local properties.
- **Fix:** Added local `properties` declarations inside each `anyOf` branch
  without changing the requirement that each fact has `text`, `value`, or both.
- **Files modified:** `standards/project-context-ledger/schemas/FACTS.schema.json`
- **Verification:** `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js`
- **Committed in:** `3562904`

---

**Total deviations:** 1 auto-fixed (1 blocking schema strictness issue)
**Impact on plan:** The fix preserved the intended schema behavior and kept
AJV strict mode enabled.

## Issues Encountered

- Initial sandboxed `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js`
  failed with Node test runner `spawn EPERM`; rerunning with approved elevated
  execution produced actionable AJV output and then passed after the schema fix.

## Verification

- `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js` - passed, 6/6 tests.
- `npm.cmd test -- test/project-context-ledger/schema-output.test.js` - passed, 2/2 tests.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Wave 2 can now wire these schemas into generated ledger output validation and
make the planned narrow generator fixes for cache manifest `schema_version`,
contract `source_path`, and unique context decision IDs.

---
*Phase: 14-ledger-artifact-schemas*
*Completed: 2026-05-08*
