# Phase 16-02 Summary: Ledger Diff, Docs, Registry, and Self-Use

## Scope

Implemented explicit ledger diff support and updated the public evidence
surfaces for Phase 16:

- `project-context-ledger --since-manifest <file>` reads a previous Phase 16+
  `CACHE-MANIFEST.json` with `ledger_records`.
- `CACHE-MANIFEST.json` now records canonical ledger record snapshots for
  downstream comparison.
- Explicit diff runs write `LEDGER-DIFF.json` with added, changed, removed,
  unchanged, stale, and by-artifact counts.
- `tools/project-context-ledger/README.md`,
  `standards/project-context-ledger/README.md`,
  `docs/RELEASE-READINESS.md`, `CHANGELOG.md`, and `tools/registry.json`
  document the new scope/diff evidence contract.

## Validation

Focused validation passed:

```bash
npm.cmd test -- test/project-context-ledger/cli.test.js test/project-context-ledger/discovery.test.js test/project-context-ledger/integration.test.js test/project-context-ledger/schema-output.test.js test/project-context-ledger/ledger-schema-contract.test.js test/planning/tool-registry.test.js test/planning/release-docs.test.js
```

Result: 40/40 tests passed.

## Self-Use Evidence

Current-scope ledger run:

```bash
node tools/project-context-ledger/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-current-20260508
```

Result: `human_review_required`, 74 low findings, 0 blockers, 0 required
decisions, 349 scanned sources, 239 ledger records.

All-scope ledger run:

```bash
node tools/project-context-ledger/cli.js --project . --scope all --out C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-all-20260508
```

Result: `human_review_required`, 460 findings, 458 low, 2 medium, 0 blockers,
0 required decisions, 415 scanned sources, 2361 ledger records.

Explicit diff run:

```bash
node tools/project-context-ledger/cli.js --project . --scope current --since-manifest C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-current-20260508\CACHE-MANIFEST.json --out C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-diff-20260508
```

Result: `human_review_required`, 74 low findings, 0 blockers, 0 required
decisions, and `LEDGER-DIFF.json` with 0 added, 0 changed, 0 removed, 74
stale, 239 unchanged, 239 current records, and 239 previous records.

## Boundaries

The diff artifact is mechanical evidence only. It does not rank importance,
apply review dispositions, suppress findings, approve gates, mutate roadmaps,
approve merges, select phases, run source commands, install/fetch/pull, or
mutate target projects.

No `ai-workspace-kit` source was changed.
