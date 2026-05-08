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

## Non-Goals

- Do not execute, install, fetch, pull, or mutate anything in the target project.
- Do not read secret-like file contents.
- Do not replace direct source inspection or assistant judgment.
- Do not make workflow, gate, roadmap, or phase decisions automatically.
