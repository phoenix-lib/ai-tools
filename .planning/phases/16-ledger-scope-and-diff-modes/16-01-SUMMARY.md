---
phase: 16
plan: "16-01"
status: complete
completed: "2026-05-08"
requirements:
  - LEDGER-SCOPE-01
  - LEDGER-SCOPE-03
  - LEDGER-SCOPE-04
key-files:
  - tools/project-context-ledger/scope.js
  - tools/project-context-ledger/cli.js
  - tools/project-context-ledger/discovery.js
  - tools/project-context-ledger/ledger.js
  - standards/project-context-ledger/schemas/
  - test/project-context-ledger/
---

# Plan 16-01 Summary: Ledger Scope Filtering and Source Categories

## Result

Status: complete.

Implemented current-by-default ledger scope filtering and deterministic source
category metadata. Historical `.planning/phases/**` artifacts are excluded
from default current-scope discovery and remain available through explicit
`--scope history` or `--scope all`.

## Completed Tasks

- Added `tools/project-context-ledger/scope.js` with scope normalization,
  source categorization, scope inclusion rules, and conservative non-real
  reference classification.
- Added `project-context-ledger --scope current|planning|history|all`, with
  `current` as the default.
- Filtered source documents before markdown reference and documented-command
  extraction.
- Added `scope` and `source_category` metadata to `CACHE-MANIFEST.json`.
- Added `source_category` to ledger record artifacts and schema validation.
- Added `reference_kind` for classified contract references so examples,
  placeholders, and generated-packet references do not inflate current
  missing-reference findings.
- Extended fixture coverage for current/history separation and non-real
  references.

## Validation

- `npm.cmd test -- test/project-context-ledger/cli.test.js test/project-context-ledger/discovery.test.js test/project-context-ledger/integration.test.js test/project-context-ledger/schema-output.test.js test/project-context-ledger/ledger-schema-contract.test.js`
  - Passed 24/24.

The first sandboxed test attempt failed with Windows `spawn EPERM`; the same
command passed with user-approved elevated `npm.cmd test`.

## Requirement Coverage

| Requirement | Status | Evidence |
|-------------|--------|----------|
| LEDGER-SCOPE-01 | Covered | CLI parses and validates `--scope current|planning|history|all`; default is `current`. |
| LEDGER-SCOPE-03 | Covered | Current scope excludes historical `.planning/phases/**` documents before reference extraction; history/all include them. |
| LEDGER-SCOPE-04 | Covered | Fixture examples/placeholders/`n/a` are classified and do not create current missing-reference findings. |

## Boundary Checks

- No `--since-manifest` or `LEDGER-DIFF.json` behavior was added in this wave.
- No Phase 17 shared CLI behavior was added.
- No review disposition generation, semantic suppression, gate authority,
  target mutation, package install, or portfolio scanning behavior was added.

## Self-Check

PASSED.
