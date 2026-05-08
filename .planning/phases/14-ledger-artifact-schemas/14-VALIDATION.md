---
phase: 14
slug: ledger-artifact-schemas
status: approved
nyquist_compliant: true
wave_0_complete: true
created: "2026-05-08"
---

# Phase 14 - Validation Strategy

Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in `node --test` with AJV |
| **Config file** | `package.json` |
| **Quick run command** | `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js` |
| **Full suite command** | `npm.cmd test` |
| **Estimated runtime** | ~60 seconds for full suite, ~5 seconds for focused schema tests |

## Sampling Rate

- **After every task commit:** run the focused command listed for that task.
- **After every plan wave:** run all focused commands for that wave.
- **Before phase verification:** full suite must be green.
- **Max feedback latency:** one task or one plan wave, whichever comes first.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 14-01-T1 | 14-01 | 1 | LEDGER-SCHEMA-01, LEDGER-SCHEMA-02, LEDGER-SCHEMA-03 | T-14-01-01, T-14-01-04 | Schema docs preserve optional evidence-only boundaries | docs + schema | `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js` | yes | pending |
| 14-01-T2 | 14-01 | 1 | LEDGER-SCHEMA-01, LEDGER-SCHEMA-02 | T-14-01-01, T-14-01-02 | Record schemas stay strict and keep array top-level shape | schema unit | `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js` | yes | pending |
| 14-01-T3 | 14-01 | 1 | LEDGER-SCHEMA-03 | T-14-01-02, T-14-01-04 | Cache manifest schema validates only current metadata states | schema unit | `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js` | yes | pending |
| 14-01-T4 | 14-01 | 1 | LEDGER-SCHEMA-01, LEDGER-SCHEMA-02, LEDGER-SCHEMA-03 | T-14-01-02, T-14-01-03 | Invalid examples fail and cross-artifact checks are left to generated-output tests | schema unit | `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js` | yes | pending |
| 14-02-T1 | 14-02 | 2 | LEDGER-SCHEMA-02, LEDGER-SCHEMA-03, LEDGER-SCHEMA-04 | T-14-02-02, T-14-02-04 | Generator fixes are limited to schema validity and do not add deferred behavior | generated output + integration | `npm.cmd test -- test/project-context-ledger/schema-output.test.js test/project-context-ledger/integration.test.js` | yes | pending |
| 14-02-T2 | 14-02 | 2 | LEDGER-SCHEMA-01, LEDGER-SCHEMA-02, LEDGER-SCHEMA-03, LEDGER-SCHEMA-04 | T-14-02-01, T-14-02-03 | Generated artifacts validate, IDs are unique, and evidence refs join | schema output | `npm.cmd test -- test/project-context-ledger/schema-output.test.js test/project-context-ledger/ledger-schema-contract.test.js` | yes | pending |
| 14-02-T3 | 14-02 | 2 | LEDGER-SCHEMA-04 | T-14-02-05 | Docs describe schemas as optional evidence contracts only | docs + regression | `npm.cmd test -- test/project-context-ledger/schema-output.test.js` | yes | pending |
| 14-02-T4 | 14-02 | 2 | LEDGER-SCHEMA-04 | T-14-02-05 | Registry evidence is truthful and no new tool entry is created | registry | `npm.cmd test -- test/planning/tool-registry.test.js` | yes | pending |
| 14-02-T5 | 14-02 | 2 | LEDGER-SCHEMA-01, LEDGER-SCHEMA-02, LEDGER-SCHEMA-03, LEDGER-SCHEMA-04 | T-14-02-01, T-14-02-03, T-14-02-05 | Full suite and external self-use evidence prove release-facing readiness | full suite + self-use | `npm.cmd test` | yes | pending |

## Wave 0 Requirements

Existing infrastructure covers all phase requirements:

- `package.json` already provides `npm.cmd test`.
- `ajv` and `ajv-formats` already exist in `devDependencies`.
- `test/project-context-ledger/schema-output.test.js` already has generated
  fixture output patterns.
- `test/fixtures/project-context-ledger/mature-ledger/input/` already exists
  as the mature fixture oracle.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| External self-use evidence summary | LEDGER-SCHEMA-04 | The command is automated, but the phase summary must record the external output path, packet status, counts, blockers, required decisions, and residual risks. | Run `node tools/project-context-ledger/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-ledger-schemas-phase14`, inspect generated summary fields, and record them in `14-02-SUMMARY.md`. |

## Validation Sign-Off

- [x] All tasks have automated verify commands or existing infrastructure.
- [x] Sampling continuity has no three consecutive tasks without automated
  verification.
- [x] Wave 0 dependencies already exist.
- [x] No watch-mode flags.
- [x] Feedback latency is bounded to one task or one wave.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-05-08
