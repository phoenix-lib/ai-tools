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

`LEDGER-COMMON.schema.json` contains shared definitions used by the public
schemas. It is a helper, not a generated artifact.

## Versioning

The current ledger artifact contract is `project-context-ledger/v1`.
Record artifacts keep their existing top-level arrays for compatibility with
existing packet consumers. `CACHE-MANIFEST.json` is the only ledger artifact
that carries `schema_version` for the generated ledger artifact set.

Review packet schema versioning remains in
`REVIEW-SUMMARY.json.tool.schema_versions.review_packet`. Ledger schema
versioning remains in
`REVIEW-SUMMARY.json.tool.schema_versions.project_context_ledger` and
`CACHE-MANIFEST.json.schema_version`.

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
- review dispositions.
