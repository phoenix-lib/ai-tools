---
phase: 12
plan: "12-01"
subsystem: tools
tags:
  - project-context-ledger
  - review-packet
  - read-only
  - self-use
requires:
  - LEDGER-01
provides:
  - project-context-ledger CLI
  - FACTS.json
  - COMMANDS.json
  - CONTRACTS.json
  - SKILLS.json
  - DECISIONS.json
  - CACHE-MANIFEST.json
affects:
  - package.json
  - shared/tool-metadata.js
  - tools/project-context-ledger/
  - tools/registry.json
  - test/project-context-ledger/
  - test/fixtures/project-context-ledger/
  - README.md
  - docs/RELEASE-READINESS.md
  - CHANGELOG.md
tech-stack:
  added: []
  patterns:
    - shared review packet renderer
    - canonical JSON
    - output path isolation
    - path-only secret evidence
    - generated packet exclusion
key-files:
  created:
    - tools/project-context-ledger/README.md
    - tools/project-context-ledger/cli.js
    - tools/project-context-ledger/index.js
    - tools/project-context-ledger/discovery.js
    - tools/project-context-ledger/ledger.js
    - tools/project-context-ledger/checks.js
    - test/project-context-ledger/cli.test.js
    - test/project-context-ledger/discovery.test.js
    - test/project-context-ledger/integration.test.js
    - test/project-context-ledger/schema-output.test.js
    - test/fixtures/project-context-ledger/mature-ledger/input/
  modified:
    - package.json
    - shared/tool-metadata.js
    - tools/registry.json
    - test/planning/tool-registry.test.js
    - test/planning/tool-selection.test.js
    - test/shared/tool-metadata.test.js
    - README.md
    - docs/RELEASE-READINESS.md
    - .planning/PROJECT.md
    - CHANGELOG.md
key-decisions:
  - Keep ledger output as optional evidence, not workflow authority.
  - Keep shared review summary schema-compliant by listing only packet artifacts in `generated_artifacts`; ledger artifacts are listed in the tool manifest.
  - Treat secret-like paths as path-only evidence and generated packet directories as ignored source input.
requirements-completed:
  - LEDGER-01
duration: "0 min"
completed: "2026-05-08"
---

# Phase 12 Plan 12-01: Project Context Ledger CLI, Artifacts, and Validation Summary

Phase 12 implemented `project-context-ledger` as a read-only optional evidence
tool. It scans deterministic project context and emits the shared review packet
plus six ledger JSON artifacts without executing target project commands or
mutating the target project.

## Execution Summary

- Added `project-context-ledger --project <path> --out <dir>` with required
  explicit inputs, mutating flag rejection, and target-local output rejection.
- Added ledger discovery for package scripts/bins, assistant contracts,
  planning docs, project skills, tool registry data, documented commands,
  references, secret-like paths, and generated packet directories.
- Added canonical ledger artifacts: `FACTS.json`, `COMMANDS.json`,
  `CONTRACTS.json`, `SKILLS.json`, `DECISIONS.json`, and
  `CACHE-MANIFEST.json`.
- Added shared packet output with schema-valid `REVIEW-SUMMARY.json`,
  `EVIDENCE.json`, `FINDINGS.md`, and `RECOMMENDED-ACTIONS.md`.
- Added fixtures and tests proving CLI behavior, schema validity,
  determinism, output isolation, no target mutation, secret non-leakage, and
  generated packet exclusion.
- Promoted `project-context-ledger` in `tools/registry.json` from planned to
  validated and added package bin/script metadata.
- Updated README, release readiness, project context, and changelog records.

## Validation

| Check | Result |
|-------|--------|
| `npm.cmd test -- test/project-context-ledger/cli.test.js test/project-context-ledger/discovery.test.js test/project-context-ledger/integration.test.js test/project-context-ledger/schema-output.test.js test/shared/tool-metadata.test.js test/planning/tool-registry.test.js test/planning/tool-selection.test.js` | Passed 27/27 |
| `npm.cmd test` | Passed 188/188 |
| `node tools/project-context-ledger/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-context-ledger-phase12` | `human_review_required`, 280 findings, 0 blockers, 0 required decisions |
| `node tools/gates-scan/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-gates-scan-phase12` | `human_review_required`, 26 findings, 0 blockers, 0 required decisions |
| `node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase12 --format json --fail-on never` | `human_review_required`, 48 low findings, 0 blockers, 0 required decisions |

Self-use findings are evidence only. They identify historical references,
documented commands, or broad contract/planning references for human review and
do not block Phase 12 because no blockers or required decisions were reported.

## Deviations from Plan

No scope deviations. One implementation detail was adjusted to preserve shared
review packet schema compatibility: `REVIEW-SUMMARY.json.generated_artifacts`
lists only the four shared packet artifacts, while the tool manifest lists all
ten requested/generated files including ledger artifacts.

**Total deviations:** 0 scope deviations.

## Commits

No commits were created. The repository contract requires explicit approval for
git history changes.

## Self-Check: PASSED

- The CLI is review-only and rejects mutating flags.
- Output paths inside the target project are rejected before packet writes.
- Secret-like paths are path-only evidence; secret sentinel contents do not
  appear in output.
- Generated packet directories are ignored as source input and recorded in the
  cache manifest.
- Packet and ledger JSON output is deterministic with a fixed clock.
- `project-context-ledger` is registered as a validated optional AI Tools
  capability, not an `ai-workspace-kit` runtime dependency.

## Next

Phase 12 is ready for completion tracking.
