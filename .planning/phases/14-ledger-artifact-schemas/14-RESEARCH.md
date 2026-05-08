---
phase: 14
name: Ledger Artifact Schemas
status: research-complete
created: "2026-05-08"
research_mode: inline
requirements:
  - LEDGER-SCHEMA-01
  - LEDGER-SCHEMA-02
  - LEDGER-SCHEMA-03
  - LEDGER-SCHEMA-04
---

# Phase 14 Research: Ledger Artifact Schemas

## Question

What is the smallest schema and validation layer that makes
`project-context-ledger` artifacts safe for downstream packet consumers without
changing the ledger into a triage engine, disposition model, scope/diff tool, or
new runtime dependency?

## Sources Read

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/phases/14-ledger-artifact-schemas/14-CONTEXT.md`
- `.planning/phases/14-ledger-artifact-schemas/14-DISCUSSION-LOG.md`
- `.planning/phases/13-review-packet-rollup-mvp/13-CONTEXT.md`
- `tools/project-context-ledger/index.js`
- `tools/project-context-ledger/ledger.js`
- `tools/project-context-ledger/discovery.js`
- `tools/project-context-ledger/checks.js`
- `tools/project-context-ledger/README.md`
- `shared/tool-metadata.js`
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json`
- `standards/review-packet/schemas/TOOL-MANIFEST.schema.json`
- `test/project-context-ledger/schema-output.test.js`
- `test/project-context-ledger/integration.test.js`
- `test/review-packet-rollup/schema-output.test.js`
- Existing external self-use outputs under
  `C:\Users\suppo\.codex\memories\ai-tools-context-ledger-phase12\`

## Gate Resolution

- **Research Gate:** user selected `1` for research-first during
  `$gsd-plan-phase 14`.
- **Upstream Freshness Gate:** resolved before writing plans. The local
  `.external/ai-workspace-kit` checkout was clean, `rev-parse --short HEAD`
  returned `683afc7`, `log -1 --oneline` returned
  `683afc7 docs: add machine-readable LLM project instructions`, and
  `git -C .external\ai-workspace-kit pull --ff-only` returned
  `Already up to date`.
- **AI Tools Self-Use Gate:** applies during execution after schema validation
  exists. Planning should require focused tests plus a generated ledger packet
  under an external output directory.
- **New Tool Intake Gate:** skipped with reason. Phase 14 adds standards and
  tests for an existing validated tool; it does not create a new tool.
- **Cross-Repo Gates:** skipped with reason. The phase does not mutate
  `ai-workspace-kit` or copy external project planning state.

## Current Artifact Shapes

| Artifact | Current top-level shape | Contract direction |
| --- | --- | --- |
| `FACTS.json` | array | Preserve. Require record identity, confidence, evidence refs, source metadata, and fact content. |
| `COMMANDS.json` | array | Preserve. Require command/kind/source metadata plus confidence and evidence refs. |
| `CONTRACTS.json` | array | Preserve. Require contract type/path/confidence/evidence refs and normalize source metadata where current direct records omit it. |
| `SKILLS.json` | array | Preserve. Require name/path/confidence/evidence refs and allow source hash. |
| `DECISIONS.json` | array | Preserve. Require decision type/text/source metadata/confidence/evidence refs and fix duplicate context decision IDs. |
| `CACHE-MANIFEST.json` | object | Preserve. Add `schema_version` and validate source hashes, generated artifact lists, policy metadata, and previous-manifest states. |

The existing generator already writes canonical JSON through the ledger runner.
The schema phase should therefore validate and harden the current model rather
than add wrappers or new packet outputs.

## Existing Implementation Findings

- `runLedger` writes standard review packet artifacts plus the six ledger
  artifacts listed in `PROJECT_CONTEXT_LEDGER_ARTIFACTS`.
- `REVIEW-SUMMARY.json.tool.schema_versions.project_context_ledger` already
  uses `project-context-ledger/v1`; `CACHE-MANIFEST.json` does not yet expose
  a matching `schema_version`.
- `ledger.js` already gives facts the strongest record shape:
  `id`, `category`, `confidence`, `evidence_refs`, `source_path`,
  `last_checked`, and optional text/value/hash/stale/unknown fields.
- Commands already include `id`, `kind`, `command`, `confidence`,
  `evidence_refs`, and `source_path`; `source_sha256` is not consistently
  present and should remain optional.
- Direct assistant contract records include `path`, `type`, `confidence`,
  `evidence_refs`, and `source_sha256`, but currently omit `source_path`.
  Backfilling `source_path` to the contract path is the narrowest schema-valid
  fix.
- Context decisions currently use IDs such as `decision.d-01`, which can
  duplicate across phase context files. Phase 14 should generate IDs that
  include a deterministic source-path component before declaring schemas
  validated.
- `test/project-context-ledger/schema-output.test.js` validates review packet
  schemas and determinism today, but it does not validate ledger artifact
  schemas, unique record IDs, or evidence-ref joins.
- External self-use confirms the duplicate decision ID risk and also shows why
  committed real packet output should not become the fixture oracle: it is large
  and noisy, while the mature synthetic fixture is small and repeatable.

## Schema Design Recommendations

- Store public schemas in `standards/project-context-ledger/schemas/` with IDs
  under `https://ai-tools.local/schemas/project-context-ledger/`.
- Add a small `LEDGER-COMMON.schema.json` only for common definitions such as
  confidence enum, record id pattern, evidence ref id arrays, source path, and
  SHA-256 hash. Keep the six artifact schemas as the public contract.
- Keep record-artifact top-level arrays for compatibility with Phase 12 and
  Phase 13 consumers.
- Keep `CACHE-MANIFEST.json` as the only ledger artifact that carries
  `schema_version`.
- Use strict `additionalProperties: false` schemas. If current generated output
  fails, fix the generator narrowly rather than weakening the schema.
- Reuse the review packet confidence vocabulary:
  `verified`, `inferred`, `unknown`, `stale`.
- Treat `EVIDENCE.json` as the source of truth for evidence IDs. JSON Schema
  should validate `evidence_refs` as strings; tests should validate the join.
- Validate uniqueness of `id` values per artifact in tests because JSON Schema
  is not the right tool for that cross-item invariant here.

## Validation Recommendations

- Add a schema-file test that loads and compiles all ledger schemas with AJV.
- Add small handcrafted valid/invalid examples or inline test cases for strict
  schema behavior before touching generator output.
- Extend generated-output tests to validate all six ledger artifacts from the
  mature fixture with a fixed clock.
- Add test assertions for:
  - unique `id` values within each record artifact;
  - every record `evidence_refs[]` entry exists in generated `EVIDENCE.json`;
  - readable `scanned_sources` have SHA-256 hashes;
  - `path_only` scanned sources do not have SHA-256 hashes;
  - `previous_manifest` accepts only the two documented states;
  - repeated runs with the same fixture and clock produce deterministic schema-
    valid output.
- Keep review packet schema tests separate from ledger artifact schema tests,
  but run both in final Phase 14 verification.

## Validation Architecture

Phase 14 validation should sample both contract-level and generated-output
behavior:

- **Contract tests:** compile all six public ledger schemas and validate small
  valid/invalid examples for strictness.
- **Generated-output tests:** run the mature project-context-ledger fixture and
  validate generated artifacts against schemas with a fixed clock.
- **Cross-artifact tests:** verify unique record IDs and evidence-ref joins
  against generated `EVIDENCE.json`.
- **Integration tests:** keep output isolation, target non-mutation, secret
  path-only handling, and generated packet exclusion covered.
- **Self-use evidence:** after generated output validates, run
  `project-context-ledger` against this repository into an external output
  directory and record the status/counts as evidence only.

## Execution Split

Phase 14 should be executed in two waves:

1. **14-01:** define schema files, schema docs, schema compile tests, and small
   fixture expectations.
2. **14-02:** make narrow generator fixes, validate generated fixture output,
   update docs/registry/changelog, and run self-use evidence.

This split keeps the first wave standards-focused and prevents schema design
from being hidden inside generator changes.

## Explicitly Deferred

- Ledger `--scope current|planning|history|all` and `--since-manifest` diffing:
  Phase 16.
- Review dispositions, expiry, owner, and baseline semantics: Phase 15.
- Shared CLI `--format json`, `--quiet`, `--fail-on`, and exit-code contract:
  Phase 17.
- Portfolio-wide real project scanning: later real-project evidence baseline
  after schema, disposition, and scope/diff foundations exist.
- Semantic prioritization, suppression, safe-ignore, gate approval, merge
  approval, roadmap mutation, package installs, or target command execution:
  out of scope.

## Research Complete

The recommended plan is to make ledger artifacts a strict, versioned,
schema-valid evidence substrate while preserving current artifact shapes and
the review-only boundary.
