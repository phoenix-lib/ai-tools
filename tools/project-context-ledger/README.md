# Project Context Ledger

`project-context-ledger` is a read-only project context scanner. It records
evidence-backed facts, commands, contracts, skills, decisions, and cache inputs
without executing target project commands or mutating the target project.

## Usage

```bash
project-context-ledger --project <path> --out <dir>
```

`--out` must point outside the scanned project. The CLI rejects mutating flags
such as `--fix`, `--write`, `--pull`, `--fetch`, and `--install`.

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

Secret-like paths are recorded as path-only evidence. Generated review packet
directories are ignored as source input and recorded in the cache manifest.

## Ledger Artifact Schemas

Ledger artifact schemas live under
`standards/project-context-ledger/schemas/`.

The current ledger artifact contract is `project-context-ledger/v1`.
`FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, and
`DECISIONS.json` keep top-level array shapes for packet consumer compatibility.
`CACHE-MANIFEST.json` carries `schema_version:
"project-context-ledger/v1"` for the generated ledger artifact set.

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
