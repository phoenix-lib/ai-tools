---
phase: 8
plan: "08-02"
subsystem: contract-drift-auditor-docs
tags:
  - docs
  - changelog
  - self-use
  - release-readiness
requires:
  - CLI-01
  - CLI-02
provides:
  - documented CLI output modes
  - documented exit policy
  - Phase 8 self-use evidence
affects:
  - README.md
  - tools/contract-drift-auditor/README.md
  - docs/RELEASE-READINESS.md
  - CHANGELOG.md
  - test/planning/release-docs.test.js
tech-stack:
  added: []
  patterns:
    - changelog-first downstream freshness evidence
    - portable self-audit command plus historical local evidence
key-files:
  created:
    - .planning/phases/08-contract-drift-auditor-cli-ergonomics/08-02-SUMMARY.md
  modified:
    - README.md
    - tools/contract-drift-auditor/README.md
    - docs/RELEASE-READINESS.md
    - CHANGELOG.md
    - test/planning/release-docs.test.js
key-decisions:
  - Document `--fail-on` as caller-selected shell policy, not semantic approval or rejection.
  - Keep reusable self-audit guidance portable with `<external-dir>` and record local paths only as historical evidence.
requirements-completed:
  - CLI-01
  - CLI-02
duration: "in-session"
completed: "2026-05-08"
---

# Phase 8 Plan 08-02: CLI Documentation, Self-Use Evidence, and Release Validation Summary

Documented the new `contract-drift-auditor` CLI behavior and recorded self-use evidence proving JSON stdout, quiet mode, and opt-in fail policy work against this repository without changing packet artifacts.

## Work Completed

- Added detailed auditor README coverage for `--format json`, `--quiet`, `--fail-on`, and exit codes `0`, `1`, and `2`.
- Added concise root README guidance for CI and assistant consumers.
- Updated release readiness with Phase 8 self-use evidence and portable command guidance.
- Added Phase 08 changelog entry with compatibility impact for `ai-workspace-kit`.
- Extended docs validation to check the new CLI behavior and evidence-only wording.

## Self-Use Evidence

Command:

```bash
node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-json --format json --fail-on never
```

Output:

- Path: `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-json`
- Status: `human_review_required`
- Findings: 54 low, 0 blockers, 0 required decisions
- Exit code: `0`

Quiet command:

```bash
node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-quiet --quiet
```

Result: exited `0` and emitted no auditor success line.

## Verification

- PASS: `npm.cmd test -- test/planning/release-docs.test.js`
- PASS: `npm.cmd test -- test/contract-drift-auditor/cli.test.js test/planning/release-docs.test.js`
- PASS: `npm.cmd test` with 132/132 tests passing.
- PASS: `Select-String` checks for `--format json`, `--quiet`, `--fail-on`, `REVIEW-SUMMARY.json`, and evidence wording across docs/changelog.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Self-Check: PASSED

Docs, changelog, release evidence, and full tests now reflect the implemented CLI behavior. Packet files remain the source of truth.

## Next

Phase 8 is ready for verification and closeout. Next planned phase is Phase 9: Tool Registry and Workflow Gate Slimming.
