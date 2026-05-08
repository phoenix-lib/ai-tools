---
phase: 07-cross-repo-compatibility-checker-mvp
plan: "07-01"
subsystem: tooling
tags: [cross-repo, cli, fixtures, parser, safety]
requires:
  - phase: 06-release-closeout-and-tool-metadata
    provides: shared metadata, packet renderer, release discipline
provides:
  - Cross-repo checker CLI skeleton
  - Two-root output safety guard
  - Protocol metadata parser
  - Paired cross-repo fixtures
affects: [phase-7, phase-10, gates-scan, ai-workspace-kit-interop]
tech-stack:
  added: []
  patterns: [explicit two-repo CLI inputs, repo-qualified fixture protocol artifacts]
key-files:
  created:
    - tools/cross-repo-compatibility-checker/cli.js
    - tools/cross-repo-compatibility-checker/index.js
    - tools/cross-repo-compatibility-checker/discovery.js
    - tools/cross-repo-compatibility-checker/protocol.js
    - test/fixtures/cross-repo-compatibility/
    - test/cross-repo-compatibility-checker/cli.test.js
    - test/cross-repo-compatibility-checker/discovery.test.js
    - test/cross-repo-compatibility-checker/protocol.test.js
  modified:
    - shared/path-guard.js
    - shared/tool-metadata.js
key-decisions:
  - "Checker requires explicit --ai-tools, --ai-workspace-kit, and --out arguments."
  - "Output is rejected inside either input repository before packet artifacts are written."
  - "Fixtures are small paired repos, not copies of real project planning trees."
patterns-established:
  - "Cross-repo tools label inputs as ai-tools and ai-workspace-kit from CLI args, not inferred path names."
requirements-completed:
  - XREPO-VALIDATOR-01
duration: 15min
completed: 2026-05-08
---

# Phase 7 Plan 07-01: Fixtures, Discovery, Protocol Parser, and CLI Safety Skeleton Summary

**Cross-repo checker foundation with explicit two-repo CLI inputs, paired fixtures, deterministic Markdown metadata parsing, and output isolation across both repositories**

## Performance

- **Duration:** 15 min
- **Started:** 2026-05-08T04:10:00+03:00
- **Completed:** 2026-05-08T04:24:00+03:00
- **Tasks:** 5
- **Files modified:** 18+

## Accomplishments

- Added `cross-repo-compatibility-checker` CLI skeleton and runner.
- Added deterministic protocol metadata parsing helpers.
- Added discovery over explicit `ai-tools` and `ai-workspace-kit` roots.
- Added two-root output safety via `assertSafeOutputDirOutsideAll`.
- Added paired compatibility fixtures covering pass, broken counterpart, manual transfer, absolute path, and registry drift cases.

## Task Commits

Implementation committed in `753c758`:

1. **T1 Fixtures** - `753c758`
2. **T2 Two-root path guard** - `753c758`
3. **T3 Protocol parser** - `753c758`
4. **T4 Discovery** - `753c758`
5. **T5 CLI skeleton** - `753c758`

## Files Created/Modified

- `tools/cross-repo-compatibility-checker/cli.js` - user-facing CLI.
- `tools/cross-repo-compatibility-checker/index.js` - runner and packet assembly.
- `tools/cross-repo-compatibility-checker/discovery.js` - read-only artifact discovery.
- `tools/cross-repo-compatibility-checker/protocol.js` - deterministic field parsing and path helpers.
- `shared/path-guard.js` - multi-root output guard.
- `test/fixtures/cross-repo-compatibility/` - paired fixture repos.
- `test/cross-repo-compatibility-checker/*` - focused tests.

## Decisions Made

- Kept CLI inputs explicit to avoid hidden sibling checkout assumptions.
- Reused shared packet renderer and metadata patterns instead of creating a separate packet format.
- Kept fixture repos intentionally small so compatibility cases are readable and portable.

## Deviations from Plan

None - plan executed as written. One implementation detail was corrected during execution: portable-path scanning was narrowed to protocol path fields after focused tests and self-use evidence showed prose false positives.

## Issues Encountered

- Focused multi-file `node --test` initially hit sandbox `spawn EPERM`; rerun with approved test execution succeeded.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for `07-02` protocol validation checks.

## Self-Check: PASSED

- Focused Wave 1 tests passed.
- Full phase validation later passed with `npm.cmd test` 124/124.

---
*Phase: 07-cross-repo-compatibility-checker-mvp*
*Completed: 2026-05-08*

