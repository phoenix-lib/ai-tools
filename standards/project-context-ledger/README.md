# Project Context Ledger Schemas

Project context ledger schemas define the optional machine-readable contract for
the extra JSON artifacts emitted by `project-context-ledger`.

These schemas are for downstream evidence consumers. They do not make the
ledger a runtime dependency, gate authority, merge authority, roadmap mutator,
review disposition system, suppression system, package installer, target command
runner, or source of automatic workflow decisions.

## Public Schemas

| Artifact | Schema | Top-level shape |
|----------|--------|-----------------|
| `FACTS.json` | `schemas/FACTS.schema.json` | array |
| `COMMANDS.json` | `schemas/COMMANDS.schema.json` | array |
| `CONTRACTS.json` | `schemas/CONTRACTS.schema.json` | array |
| `SKILLS.json` | `schemas/SKILLS.schema.json` | array |
| `DECISIONS.json` | `schemas/DECISIONS.schema.json` | array |
| `CACHE-MANIFEST.json` | `schemas/CACHE-MANIFEST.schema.json` | object |
| `LEDGER-DIFF.json` | `schemas/LEDGER-DIFF.schema.json` | object |

`LEDGER-COMMON.schema.json` contains shared definitions used by the public
schemas. It is a helper, not a generated artifact.

## Versioning

The current ledger artifact contract is `project-context-ledger/v1`.
Record artifacts keep their existing top-level arrays for compatibility with
existing packet consumers. `CACHE-MANIFEST.json` is the only ledger artifact
that carries `schema_version` for the generated ledger artifact set.
`LEDGER-DIFF.json` uses `project-context-ledger-diff/v1` because it is an
explicit comparison artifact, not a persisted ledger record set.

Review packet schema versioning remains in
`REVIEW-SUMMARY.json.tool.schema_versions.review_packet`. Ledger schema
versioning remains in
`REVIEW-SUMMARY.json.tool.schema_versions.project_context_ledger` and
`CACHE-MANIFEST.json.schema_version`.

## Scope Categories

Ledger records and scanned source records include `source_category`. The
supported categories are:

- `current`: current source files and active root-level project guidance;
- `planning`: active planning artifacts that are not historical phase records;
- `history`: historical `.planning/phases/**` artifacts;
- `external`: external repository references or vendored upstream guidance;
- `fixture`: test fixtures and examples.

The default CLI scope is `current`. It excludes historical phase artifacts so
old findings do not dominate current project memory evidence by default.

## Diff Artifacts

`CACHE-MANIFEST.json` includes canonical `ledger_records` snapshots for record
artifacts. When the CLI is run with `--since-manifest <file>`, it compares
those snapshots with the current run and writes `LEDGER-DIFF.json`.

The diff is mechanical. It reports `added`, `changed`, `removed`,
`unchanged`, and `stale` snapshots plus by-artifact counts. It does not rank
importance, suppress findings, apply review dispositions, or make gate,
roadmap, merge, workflow, portfolio, or phase decisions.

## Evidence Refs

Ledger records store `evidence_refs` as IDs. Generated `EVIDENCE.json` remains
the source of truth for the evidence records behind those IDs.

JSON Schema validates the local record shape. Tests validate cross-artifact
rules such as unique record IDs and joins from `evidence_refs[]` to
`EVIDENCE.json`.

## Boundaries

The schemas describe evidence packets only. They do not authorize:

- target project mutation;
- package install, fetch, pull, run, or execute behavior;
- gate approval or rejection;
- merge approval;
- roadmap mutation;
- semantic priority;
- suppression;
- safe-to-ignore decisions;
- review dispositions;
- diff-based workflow decisions.
