---
phase: 7
name: Cross-Repo Compatibility Checker MVP
status: passed
verified: "2026-05-08T04:24:21+03:00"
requirements:
  - XREPO-VALIDATOR-01
---

# Phase 7 Verification: Cross-Repo Compatibility Checker MVP

## Verdict

Passed.

Phase 7 shipped a read-only `cross-repo-compatibility-checker` CLI that accepts explicit `--ai-tools`, `--ai-workspace-kit`, and `--out` arguments, validates cross-repo protocol and gate registry compatibility, emits the shared review packet artifacts, and keeps all findings evidence-only.

## Requirement Coverage

| Requirement | Status | Evidence |
| --- | --- | --- |
| XREPO-VALIDATOR-01 | Covered | `tools/cross-repo-compatibility-checker/`, `test/cross-repo-compatibility-checker/`, `test/fixtures/cross-repo-compatibility/`, `package.json`, self-use packet |

## Success Criteria

1. User can run checker with explicit paths to both repositories and explicit `--out`.
   - Status: passed.
   - Evidence: `tools/cross-repo-compatibility-checker/cli.js`, `package.json`, `test/cross-repo-compatibility-checker/cli.test.js`.

2. Checker validates protocol metadata including `Protocol version`, canonical request IDs, `Thread ID`, `Origin`, `Mirror required`, counterpart IDs, and repo-qualified counterpart paths.
   - Status: passed.
   - Evidence: `tools/cross-repo-compatibility-checker/protocol.js`, `tools/cross-repo-compatibility-checker/checks.js`, `test/cross-repo-compatibility-checker/checks.test.js`.

3. Checker requires decisions for `manual-transfer` requests with `Mirror required: false`.
   - Status: passed.
   - Evidence: `test/fixtures/cross-repo-compatibility/manual-transfer-with-decision/`, `test/cross-repo-compatibility-checker/checks.test.js`.

4. Checker compares AI Tools snake_case gate registry metadata with kit camelCase expectations through documented interop mapping and stage aliases.
   - Status: passed.
   - Evidence: `tools/cross-repo-compatibility-checker/checks.js`, `test/cross-repo-compatibility-checker/gate-registry.test.js`.

5. Output uses shared review packet artifacts and never installs, runs, mutates, or depends on the neighboring repository.
   - Status: passed.
   - Evidence: `tools/cross-repo-compatibility-checker/index.js`, `shared/review-packet-renderer.js`, `test/cross-repo-compatibility-checker/schema-output.test.js`, `tools/cross-repo-compatibility-checker/README.md`.

## Automated Checks

- `npm.cmd test -- test/shared/path-guard.test.js test/cross-repo-compatibility-checker/protocol.test.js test/cross-repo-compatibility-checker/discovery.test.js test/cross-repo-compatibility-checker/cli.test.js`: 18/18 pass.
- `npm.cmd test -- test/cross-repo-compatibility-checker/checks.test.js test/cross-repo-compatibility-checker/integration.test.js`: 7/7 pass.
- `npm.cmd test -- test/cross-repo-compatibility-checker/gate-registry.test.js test/cross-repo-compatibility-checker/schema-output.test.js test/cross-repo-compatibility-checker/integration.test.js test/cross-repo-compatibility-checker/cli.test.js test/shared/tool-metadata.test.js`: 17/17 pass.
- `npm.cmd test -- test/planning/release-docs.test.js test/cross-repo-compatibility-checker/gate-registry.test.js test/cross-repo-compatibility-checker/schema-output.test.js test/cross-repo-compatibility-checker/integration.test.js`: 12/12 pass.
- `npm.cmd test`: 124/124 pass.

## Self-Use Evidence

Command:

```bash
node tools/cross-repo-compatibility-checker/cli.js --ai-tools . --ai-workspace-kit C:\projects\ai-workspace-kit --out C:\Users\suppo\.codex\memories\ai-tools-cross-repo-check-phase07
```

Output:

- Path: `C:\Users\suppo\.codex\memories\ai-tools-cross-repo-check-phase07`
- Artifacts: `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, `RECOMMENDED-ACTIONS.md`
- Status: `human_review_required`
- Findings: 1 medium, 0 blockers, 0 required decisions

Finding:

- `ai-workspace-kit/.planning/cross-repo/decisions/2026-05-07-ai-tools-review-packet-standard.md` is missing required field `Reason`.

Interpretation: self-use confirms the checker produces useful cross-repo evidence. The remaining finding is in the neighboring local `ai-workspace-kit` checkout and does not block AI Tools Phase 7 completion.

## Boundary Verification

- No `ai-workspace-kit` dependency was added to `package.json`.
- The checker does not run kit commands, install dependencies, fetch/pull git, mutate `.planning`, create phases, or make semantic request decisions.
- `gates-scan` remains future work; Phase 7 only created reusable validation and packet patterns.

## Residual Risk

- The checker is deterministic and fixture-backed, but its protocol parser intentionally reads Markdown field lines rather than a full Markdown AST. This is acceptable for the v1.0 cross-repo templates and is covered by fixtures.
- Self-use depends on the local sibling checkout state. Output is evidence only and should be rerun after either repository changes cross-repo protocol artifacts.

## Conclusion

Phase 7 satisfies `XREPO-VALIDATOR-01` and is complete.

