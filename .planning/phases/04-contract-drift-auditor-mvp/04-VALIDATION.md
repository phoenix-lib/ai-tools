---
phase: 04
slug: contract-drift-auditor-mvp
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-07
---

# Phase 04 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node `node:test` |
| **Config file** | `package.json` |
| **Quick run command** | `npm.cmd test -- test/contract-drift-auditor` |
| **Full suite command** | `npm.cmd test` |
| **Estimated runtime** | ~1 second currently; allow up to 10 seconds after auditor tests land |

## Sampling Rate

- **After every task commit:** run the task-specific test command from the plan.
- **After every plan wave:** run `npm.cmd test`.
- **Before `$gsd-verify-work`:** full suite must be green.
- **Max feedback latency:** 10 seconds for local tests.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-T1 | 01 | 1 | RENDER-01 | T-04-01-01 | one packet model renders all artifacts | unit | `npm.cmd test -- test/shared/review-packet-renderer.test.js` | yes after task | pending |
| 04-01-T2 | 01 | 1 | DRIFT-01 | T-04-01-02 | unsafe output rejected before writes | unit | `npm.cmd test -- test/contract-drift-auditor/cli.test.js` | yes after task | pending |
| 04-01-T3 | 01 | 1 | DRIFT-02 | T-04-01-03 | discovery is deterministic and ignores generated packets | unit | `npm.cmd test -- test/contract-drift-auditor/discovery.test.js` | yes after task | pending |
| 04-02-T1 | 02 | 2 | DRIFT-02, DRIFT-06 | T-04-02-01 | missing source files become findings | fixture | `npm.cmd test -- test/contract-drift-auditor/checks.test.js` | yes after task | pending |
| 04-02-T2 | 02 | 2 | DRIFT-03 | T-04-02-02 | missing commands become findings without executing commands | fixture | `npm.cmd test -- test/contract-drift-auditor/checks.test.js` | yes after task | pending |
| 04-02-T3 | 02 | 2 | DRIFT-04, DRIFT-05 | T-04-02-03 | absent tools/skills become evidence-backed findings | fixture | `npm.cmd test -- test/contract-drift-auditor/checks.test.js` | yes after task | pending |
| 04-03-T1 | 03 | 3 | DRIFT-07, TEST-04 | T-04-03-01 | generated packets validate and stay deterministic | integration | `npm.cmd test -- test/contract-drift-auditor/integration.test.js` | yes after task | pending |
| 04-03-T2 | 03 | 3 | TEST-04 | T-04-03-02 | target fixture trees are unchanged and secret sentinels absent | integration | `npm.cmd test -- test/contract-drift-auditor/integration.test.js` | yes after task | pending |

## Wave 0 Requirements

Existing infrastructure covers the phase:

- `package.json` already runs `node --test`.
- `shared/tree-hash.js` already exists for mutation proof.
- `test/fixtures/targets/*` already contains required target scenarios.
- Ajv schema validation already exists in `test/review-packet/schema-validation.test.js`.

## Manual-Only Verifications

All Phase 4 MVP behaviors have automated verification. Manual review is useful
for report wording, but it is not required to prove the phase.

## Validation Sign-Off

- [x] All tasks have automated verify commands.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency target < 10s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-05-07
