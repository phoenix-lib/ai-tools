---
phase: 14-ledger-artifact-schemas
plan: "14-02"
subsystem: project-context-ledger
tags:
  - generated-output-validation
  - json-schema
  - review-packet
requires:
  - plan: "14-01"
    provides: strict public ledger artifact schemas and focused contract tests
provides:
  - Generated project-context-ledger artifacts validated against all six ledger schemas
  - Cache manifest schema version and direct contract source metadata
  - Deterministic occurrence-normalized duplicate ledger record IDs
  - Release docs, changelog, and registry evidence for Phase 14 schema hardening
affects:
  - project-context-ledger
  - ledger-generated-output-validation
  - review-packet-consumers
tech-stack:
  added: []
  patterns:
    - AJV generated-output validation against standards/project-context-ledger/schemas
    - deterministic occurrence suffixes for duplicate ledger record IDs
    - evidence-ref join assertions from ledger records to EVIDENCE.json
key-files:
  created:
    - .planning/phases/14-ledger-artifact-schemas/14-02-SUMMARY.md
  modified:
    - tools/project-context-ledger/ledger.js
    - test/project-context-ledger/schema-output.test.js
    - test/project-context-ledger/integration.test.js
    - tools/project-context-ledger/README.md
    - tools/registry.json
    - docs/RELEASE-READINESS.md
    - CHANGELOG.md
key-decisions:
  - "Kept ledger artifact filenames and top-level shapes unchanged."
  - "Stored schema_version on CACHE-MANIFEST.json as the ledger contract marker."
  - "Resolved duplicate generated ledger record IDs with deterministic occurrence suffixes instead of weakening uniqueness expectations."
  - "Kept schemas as optional evidence-consumer contracts, not runtime or gate authority."
patterns-established:
  - "Generated ledger schema tests validate schema shape, uniqueness, evidence-ref joins, and deterministic output together."
  - "Self-use output remains external to the repository and is recorded as evidence, not committed as an oracle."
requirements-completed:
  - LEDGER-SCHEMA-01
  - LEDGER-SCHEMA-02
  - LEDGER-SCHEMA-03
  - LEDGER-SCHEMA-04
duration: 19 min
completed: 2026-05-08
---

# Phase 14 Plan 14-02: Generated Ledger Validation, Docs, Registry, and Self-Use Evidence Summary

**Generated project-context-ledger artifacts now validate against the Phase 14 ledger schema contract.**

## Performance

- **Duration:** 19 min
- **Started:** 2026-05-08T09:21:15Z
- **Completed:** 2026-05-08T09:40:50Z
- **Tasks:** 5
- **Files modified:** 8

## Accomplishments

- Added generated-output AJV validation for `FACTS.json`, `COMMANDS.json`,
  `CONTRACTS.json`, `SKILLS.json`, `DECISIONS.json`, and
  `CACHE-MANIFEST.json`.
- Added generated-output checks for unique record IDs per ledger artifact and
  ledger `evidence_refs` joins to generated `EVIDENCE.json`.
- Extended deterministic output coverage across all project-context-ledger
  artifact JSON files.
- Added `schema_version: "project-context-ledger/v1"` to generated cache
  manifests and `source_path` to direct assistant contract records.
- Namespaced generated context decision IDs by source path.
- Added deterministic `.occurrence-N` suffixing for duplicate generated ledger
  record IDs surfaced by real self-use output.
- Updated ledger README, release readiness, changelog, and registry metadata to
  document Phase 14 schemas as optional evidence-consumer contracts.
- Ran a real self-use `project-context-ledger` scan against this repository with
  output outside the repository.

## Task Commits

1. **Tasks T1-T5: generated validation, generator fixes, docs, registry, and self-use evidence** - `bda8f3e` (`feat(14-02): validate ledger artifacts against schemas`)

**Plan metadata:** this summary is committed separately with GSD state updates.

## Files Created/Modified

- `tools/project-context-ledger/ledger.js` - cache manifest schema version,
  direct contract `source_path`, source-namespaced context decision IDs, and
  occurrence-normalized duplicate record IDs.
- `test/project-context-ledger/schema-output.test.js` - generated ledger schema
  validation, unique ID assertions, evidence-ref joins, deterministic artifact
  checks, and duplicate occurrence ID coverage.
- `test/project-context-ledger/integration.test.js` - integration checks for
  direct contract source metadata and cache manifest schema version.
- `tools/project-context-ledger/README.md` - schema contract docs and optional
  evidence-consumer boundaries.
- `tools/registry.json` - project-context-ledger evidence refs and status notes
  updated for Phase 14 schema validation.
- `docs/RELEASE-READINESS.md` - Phase 14 release-facing schema expectations and
  self-use evidence.
- `CHANGELOG.md` - Phase 14 changed scope, validation, compatibility, breaking
  changes, migration notes, and upstream impact.
- `.planning/phases/14-ledger-artifact-schemas/14-02-SUMMARY.md` - plan
  completion record.

## Decisions Made

- Kept JSON Schema responsible for artifact shape and generated-output tests
  responsible for cross-artifact evidence-ref joins.
- Treated duplicate ledger IDs from real self-use as a generator correctness
  issue, not a reason to loosen schemas or abandon uniqueness.
- Kept generated schema validation independent from review packet schema
  validation so failures identify the affected contract layer.
- Recorded self-use output path and counts, but did not commit generated
  self-use artifacts as fixtures or approval state.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Real self-use surfaced duplicate contract IDs**
- **Found during:** Task T5 self-use scan against this repository.
- **Issue:** `CONTRACTS.json` had 1692 records but only 1689 unique IDs before
  occurrence normalization.
- **Fix:** Added deterministic `.occurrence-N` suffixing for duplicate generated
  ledger record IDs in all record artifacts and added a focused regression test.
- **Files modified:** `tools/project-context-ledger/ledger.js`,
  `test/project-context-ledger/schema-output.test.js`
- **Verification:** generated schema-output tests and final self-use output
  showed unique IDs across all record artifacts.
- **Committed in:** `bda8f3e`

---

**Total deviations:** 1 auto-fixed blocking generated-output correctness issue.
**Impact on plan:** The fix strengthened the planned uniqueness guarantee while
preserving artifact filenames, top-level shapes, and evidence-only semantics.

## Issues Encountered

- Sandboxed Node test execution can fail with `spawn EPERM` in this environment;
  npm test commands were rerun through the approved elevated test path.

## Verification

- `npm.cmd test -- test/project-context-ledger/schema-output.test.js test/project-context-ledger/integration.test.js` - passed, 6/6 tests.
- `npm.cmd test -- test/project-context-ledger/schema-output.test.js test/project-context-ledger/ledger-schema-contract.test.js` - passed, 10/10 tests.
- `npm.cmd test -- test/planning/release-docs.test.js test/planning/tool-registry.test.js test/project-context-ledger/schema-output.test.js` - passed, 17/17 tests.
- `npm.cmd test` - passed, 225/225 tests.
- `git diff --check` - passed.

## Self-Use Evidence

Command:

```bash
node tools/project-context-ledger/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-ledger-schemas-phase14-final
```

Result:

- Output path: `C:\Users\suppo\.codex\memories\ai-tools-ledger-schemas-phase14-final`
- Packet status: `human_review_required`
- Findings: 383 total, 381 low, 2 medium
- Blockers: 0
- Required decisions: 0
- Cache manifest: `schema_version: project-context-ledger/v1`
- Scanned sources: 396
- Ignored generated packet directories: 8
- Path-only secret paths: 8
- Unique record IDs: all record artifacts unique after occurrence normalization

## User Setup Required

None - no external services or package changes required.

## Next Phase Readiness

Phase 15 can build a review-disposition/baseline model on top of schema-valid
ledger packets. Phase 14 intentionally did not add suppression, disposition,
scope/diff modes, portfolio scanning, shared CLI migration, or gate authority.

---
*Phase: 14-ledger-artifact-schemas*
*Completed: 2026-05-08*
