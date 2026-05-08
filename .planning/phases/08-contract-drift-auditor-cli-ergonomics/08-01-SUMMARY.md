---
phase: 8
plan: "08-01"
subsystem: contract-drift-auditor-cli
tags:
  - cli
  - review-packet
  - ergonomics
requires:
  - CLI-01
  - CLI-02
provides:
  - contract-drift-auditor machine stdout
  - contract-drift-auditor quiet mode
  - contract-drift-auditor fail-on policy
affects:
  - tools/contract-drift-auditor/cli.js
  - test/contract-drift-auditor/cli.test.js
tech-stack:
  added: []
  patterns:
    - dependency-free node cli parsing
    - packet-summary stdout projection
key-files:
  created:
    - .planning/phases/08-contract-drift-auditor-cli-ergonomics/08-01-SUMMARY.md
  modified:
    - tools/contract-drift-auditor/cli.js
    - test/contract-drift-auditor/cli.test.js
key-decisions:
  - Keep default exit behavior shell-success with `--fail-on never`.
  - Emit machine stdout as a compact projection of `packet.summary`, not as a new artifact contract.
requirements-completed:
  - CLI-01
  - CLI-02
duration: "in-session"
completed: "2026-05-08"
---

# Phase 8 Plan 08-01: CLI Output Modes and Exit Policy Summary

Implemented dependency-free CLI ergonomics for `contract-drift-auditor`: compact JSON stdout, quiet human mode, status-bearing human success output, and explicit `--fail-on blocked|human_review_required|never` exit policy.

## Work Completed

- Extended `parseArgs` with `format`, `quiet`, and `failOn` defaults.
- Added `--format json`, `--quiet`, and `--fail-on` handling.
- Kept `--fix` and `--write` rejected as review-only violations.
- Added pure helpers for machine stdout rendering, human success rendering, and fail policy.
- Added tests that compare JSON stdout to the generated `REVIEW-SUMMARY.json` packet.

## Verification

- PASS: `npm.cmd test -- test/contract-drift-auditor/cli.test.js`
- PASS: `npm.cmd test -- test/contract-drift-auditor/cli.test.js test/contract-drift-auditor/schema-output.test.js`

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

Packet artifact names and schema output remain unchanged, no dependency was added, and default shell behavior remains non-failing for generated review packets.

## Next

Ready for 08-02 documentation, changelog, self-use evidence, and release validation.
