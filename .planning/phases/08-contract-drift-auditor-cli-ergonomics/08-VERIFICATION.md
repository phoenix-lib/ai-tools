---
phase: 8
name: Contract Drift Auditor CLI Ergonomics
status: passed
verified: "2026-05-08T04:48:00+03:00"
requirements:
  - CLI-01
  - CLI-02
---

# Phase 8 Verification: Contract Drift Auditor CLI Ergonomics

## Verdict

Passed.

Phase 8 added stable machine stdout, quiet mode, and opt-in fail policy to `contract-drift-auditor` while preserving packet files as the source of truth and keeping default findings evidence-only.

## Requirement Coverage

| Requirement | Status | Evidence |
| --- | --- | --- |
| CLI-01 | Covered | `tools/contract-drift-auditor/cli.js`, `test/contract-drift-auditor/cli.test.js`, `tools/contract-drift-auditor/README.md` |
| CLI-02 | Covered | `tools/contract-drift-auditor/cli.js`, `test/contract-drift-auditor/cli.test.js`, `docs/RELEASE-READINESS.md`, `CHANGELOG.md` |

## Success Criteria

1. CLI can emit compact machine stdout while packet files remain the source of truth.
   - Status: passed.
   - Evidence: `--format json`, `renderMachineStdout`, JSON stdout versus `REVIEW-SUMMARY.json` test.

2. CLI supports quiet mode that suppresses non-essential output.
   - Status: passed.
   - Evidence: `--quiet` parser/main behavior and quiet tests.

3. CLI supports `--fail-on blocked|human_review_required|never` with documented stable exit codes.
   - Status: passed.
   - Evidence: fail-policy helper, end-to-end human-review fixture tests, README exit-code docs.

4. Default behavior remains non-breaking: findings are evidence, not automatic shell failure.
   - Status: passed.
   - Evidence: default `failOn: "never"` and human-review fixture exits `0` unless stricter policy is selected.

5. Tests cover stdout modes and exit-code behavior on Windows.
   - Status: passed.
   - Evidence: `npm.cmd test` passed 132/132 in the Windows workspace.

## Automated Checks

- `npm.cmd test -- test/contract-drift-auditor/cli.test.js`: 14/14 pass.
- `npm.cmd test -- test/contract-drift-auditor/cli.test.js test/contract-drift-auditor/schema-output.test.js`: 16/16 pass.
- `npm.cmd test -- test/planning/release-docs.test.js`: 5/5 pass.
- `npm.cmd test -- test/contract-drift-auditor/cli.test.js test/planning/release-docs.test.js`: 19/19 pass.
- `npm.cmd test`: 132/132 pass.

## Self-Use Evidence

Command:

```bash
node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-json --format json --fail-on never
```

Output:

- Path: `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-json`
- Artifacts: `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, `RECOMMENDED-ACTIONS.md`
- Status: `human_review_required`
- Findings: 54 low, 0 blockers, 0 required decisions
- Exit code: `0`

Quiet command:

```bash
node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-quiet --quiet
```

Result: exited `0` and emitted no auditor success line.

## Boundary Verification

- No review packet schema or required artifact name changed.
- No dependency was added.
- No auto-fix, write mode, permission approval, or `ai-workspace-kit` runtime integration was added.
- `cross-repo-compatibility-checker` CLI behavior was not changed in this phase.

## Residual Risk

- The compact JSON stdout is intentionally not a full packet contract. Consumers that need finding details must read packet files from `--out`.
- Self-use still reports low-severity current-doc caveats. They remain evidence for review and do not block Phase 8 because packet generation, schema validation, output isolation, docs validation, and full tests passed.

## Conclusion

Phase 8 satisfies `CLI-01` and `CLI-02` and is complete.
