---
phase: 02
slug: shared-safety-harness
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-07
---

# Phase 02 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node `node:test` |
| **Config file** | `package.json` |
| **Quick run command** | `npm.cmd test -- test/shared/canonical-json.test.js test/shared/path-guard.test.js test/shared/secret-policy.test.js test/shared/file-walker.test.js test/shared/tree-hash.test.js` |
| **Full suite command** | `npm.cmd test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run the focused test for the helper or fixture changed by that task.
- **After every plan wave:** Run `npm.cmd test`.
- **Before `$gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 30 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-T1 | 01 | 1 | SAFE-04 | T-02-01-04 | Canonical JSON deterministic | unit | `npm.cmd test -- test/shared/canonical-json.test.js` | yes | pending |
| 02-01-T2 | 01 | 1 | SAFE-01 | T-02-01-01 | Reject output inside target | unit | `npm.cmd test -- test/shared/path-guard.test.js` | yes | pending |
| 02-01-T3 | 01 | 1 | SAFE-02 | T-02-01-02 | Secret paths are path-only | unit | `npm.cmd test -- test/shared/secret-policy.test.js` | yes | pending |
| 02-01-T4 | 01 | 1 | SAFE-03 | T-02-01-03 | Ignore generated/noisy evidence | unit | `npm.cmd test -- test/shared/file-walker.test.js` | yes | pending |
| 02-02-T1 | 02 | 2 | SAFE-05 | T-02-02-01 | Raw target tree mutation hash | unit | `npm.cmd test -- test/shared/tree-hash.test.js` | yes | pending |
| 02-02-T2 | 02 | 2 | TEST-07 | T-02-02-02 | Required target fixtures exist | unit | `npm.cmd test -- test/shared/safety-harness.test.js` | yes | pending |
| 02-03-T1 | 03 | 3 | TEST-02 | T-02-03-01 | Read-only operations do not mutate fixtures | integration | `npm.cmd test -- test/shared/safety-harness.test.js` | yes | pending |
| 02-03-T2 | 03 | 3 | TEST-03 | T-02-03-02 | Secret sentinels never appear in outputs | integration | `npm.cmd test -- test/shared/safety-harness.test.js` | yes | pending |

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements:

- `package.json` already defines `npm test`.
- Phase 1 installed `ajv` and `ajv-formats`.
- `test/review-packet/` already proves the current test harness works.

---

## Manual-Only Verifications

All Phase 2 behaviors have automated verification.

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency < 30s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-05-07
