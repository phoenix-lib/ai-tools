# Project Context Ledger

`project-context-ledger` is a read-only project context scanner. It records
evidence-backed facts, commands, contracts, skills, decisions, and cache inputs
without executing target project commands or mutating the target project.

## Usage

```bash
project-context-ledger --project <path> --out <dir> [--scope current|planning|history|all] [--since-manifest <file>]
```

`--out` must point outside the scanned project. The CLI rejects mutating flags
such as `--fix`, `--write`, `--pull`, `--fetch`, and `--install`.

`--scope` controls which source categories are scanned. The default is
`current`, which includes current source files and active planning documents
while excluding historical `.planning/phases/**` artifacts. `planning` scans
active planning documents only, `history` scans historical phase artifacts, and
`all` scans every supported category.

`--since-manifest <file>` compares the current run with a previous Phase 16+
`CACHE-MANIFEST.json` that includes `ledger_records`. The comparison is
mechanical: it reports added, changed, removed, unchanged, and stale ledger
record snapshots. It does not decide which changes are important.

## Outputs

The CLI writes the shared review packet artifacts:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

It also writes ledger artifacts:

- `FACTS.json`
- `COMMANDS.json`
- `CONTRACTS.json`
- `SKILLS.json`
- `DECISIONS.json`
- `CACHE-MANIFEST.json`
- `LEDGER-DIFF.json` when `--since-manifest` is provided

Secret-like paths are recorded as path-only evidence. Generated review packet
directories are ignored as source input and recorded in the cache manifest.
Ledger records include `source_category` so packet consumers can distinguish
current sources, active planning documents, historical phase artifacts, and
external/fixture sources.

## Ledger Artifact Schemas

Ledger artifact schemas live under
`standards/project-context-ledger/schemas/`.

The current ledger artifact contract is `project-context-ledger/v1`.
`FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, and
`DECISIONS.json` keep top-level array shapes for packet consumer compatibility.
`CACHE-MANIFEST.json` carries `schema_version:
"project-context-ledger/v1"` for the generated ledger artifact set and records
canonical `ledger_records` snapshots used by explicit diff runs.
`LEDGER-DIFF.json` carries `schema_version:
"project-context-ledger-diff/v1"` and is generated only for explicit
`--since-manifest` comparisons.

`EVIDENCE.json` remains the source of truth for evidence IDs referenced by
ledger records in `evidence_refs`. Generated-output tests validate the ledger
artifacts against the schemas and separately assert record ID uniqueness plus
evidence-ref joins.

The schemas are optional evidence-consumer contracts. They are not runtime
dependencies, gate authority, roadmap authority, suppression rules, review
dispositions, or portfolio scanners.

## Non-Goals

- Do not execute, install, fetch, pull, or mutate anything in the target project.
- Do not read secret-like file contents.
- Do not replace direct source inspection or assistant judgment.
- Do not make workflow, gate, roadmap, or phase decisions automatically.
- Do not treat diff output as semantic priority, suppression, or disposition.
