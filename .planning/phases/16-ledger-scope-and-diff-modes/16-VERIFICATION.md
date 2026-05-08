# Phase 16 Verification: Ledger Scope and Diff Modes

## Verdict

PASS.

Phase 16 delivered the planned scope and diff behavior for
`project-context-ledger` while preserving read-only, evidence-only boundaries.

## Requirement Coverage

- `LEDGER-SCOPE-01`: PASS. CLI supports
  `--scope current|planning|history|all`, with `current` as default.
- `LEDGER-SCOPE-02`: PASS. CLI supports
  `--since-manifest <CACHE-MANIFEST.json>` and writes `LEDGER-DIFF.json` with
  added, changed, removed, stale, unchanged, and by-artifact counts.
- `LEDGER-SCOPE-03`: PASS. Historical `.planning/phases/**` artifacts are
  categorized as history and excluded from current scope by default.
- `LEDGER-SCOPE-04`: PASS. Placeholder/example references such as `n/a` are
  classified separately from real current references, and generated packet
  artifacts remain ignored as source input.

## Evidence

- `tools/project-context-ledger/scope.js`
- `tools/project-context-ledger/discovery.js`
- `tools/project-context-ledger/diff.js`
- `tools/project-context-ledger/ledger.js`
- `tools/project-context-ledger/cli.js`
- `standards/project-context-ledger/schemas/CACHE-MANIFEST.schema.json`
- `standards/project-context-ledger/schemas/LEDGER-DIFF.schema.json`
- `tools/project-context-ledger/README.md`
- `standards/project-context-ledger/README.md`
- `tools/registry.json`
- `.planning/phases/16-ledger-scope-and-diff-modes/16-01-SUMMARY.md`
- `.planning/phases/16-ledger-scope-and-diff-modes/16-02-SUMMARY.md`

## Validation Commands

Focused validation:

```bash
npm.cmd test -- test/project-context-ledger/cli.test.js test/project-context-ledger/discovery.test.js test/project-context-ledger/integration.test.js test/project-context-ledger/schema-output.test.js test/project-context-ledger/ledger-schema-contract.test.js test/planning/tool-registry.test.js test/planning/release-docs.test.js
```

Result: 40/40 tests passed.

Full validation:

```bash
npm.cmd test
```

Result: 247/247 tests passed.

Whitespace validation:

```bash
git diff --check
```

Result: passed.

GSD state validation:

```bash
gsd-sdk.cmd query state.validate
```

Result: passed with no warnings and no drift.

## Self-Use Evidence

Current-scope self-use:

```bash
node tools/project-context-ledger/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-current-20260508
```

Result: `human_review_required`, 74 low findings, 0 blockers, 0 required
decisions, 349 scanned sources, and 239 ledger records.

All-scope self-use:

```bash
node tools/project-context-ledger/cli.js --project . --scope all --out C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-all-20260508
```

Result: `human_review_required`, 460 findings, 458 low, 2 medium, 0 blockers,
0 required decisions, 415 scanned sources, and 2361 ledger records.

Explicit diff self-use:

```bash
node tools/project-context-ledger/cli.js --project . --scope current --since-manifest C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-current-20260508\CACHE-MANIFEST.json --out C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-diff-20260508
```

Result: `human_review_required`, 74 low findings, 0 blockers, 0 required
decisions, and `LEDGER-DIFF.json` with 0 added, 0 changed, 0 removed, 74
stale, 239 unchanged, 239 current records, and 239 previous records.

## Boundary Review

- No target project mutation behavior was added.
- `--out <dir>` remains required and target-local output is rejected.
- Secret-like files remain path-only evidence.
- `LEDGER-DIFF.json` is mechanical evidence only. It does not rank priority,
  suppress findings, apply dispositions, approve gates, mutate roadmaps,
  approve merges, select phases, run source commands, install/fetch/pull, or
  mutate target projects.
- No `ai-workspace-kit` source was changed.

## Residual Risk

The current-scope self-use still reports 74 low human-review findings from
current planning and contract references. This is a useful reduction from
all-scope historical noise, not a blocker. Further reduction belongs in future
signal-quality work or human review dispositions, not in Phase 16.
