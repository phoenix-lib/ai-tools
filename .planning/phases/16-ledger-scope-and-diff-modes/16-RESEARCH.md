# Phase 16 Research: Ledger Scope and Diff Modes

## RESEARCH COMPLETE

## Purpose

Plan Phase 16 so `project-context-ledger` can reduce historical planning noise
and make fact changes reviewable without becoming a suppression system,
semantic triage layer, or workflow authority.

## Current Implementation

- CLI entrypoint is `tools/project-context-ledger/cli.js`.
  It currently accepts `--project`, `--out`, and `--help`, rejects a small set
  of mutating flags, and prints human completion stdout.
- Runner is `tools/project-context-ledger/index.js`.
  It resolves project/out paths, enforces output isolation, calls
  `discoverProject`, calls `buildLedger`, renders the standard review packet,
  and writes the six ledger artifacts.
- Discovery is `tools/project-context-ledger/discovery.js`.
  It already separates contract files, planning files, skill files, package
  files, `tools/registry.json`, generated packet dirs, secret paths,
  markdown references, and documented commands.
- `PHASE_ARTIFACT_RE` already identifies historical phase artifacts under
  `.planning/phases/**`, but those artifacts currently flow into
  `planningFiles` and therefore into default ledger runs.
- Ledger generation is `tools/project-context-ledger/ledger.js`.
  It builds `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`,
  `DECISIONS.json`, `CACHE-MANIFEST.json`, packet findings, evidence refs, and
  recommended actions.
- The existing previous-manifest behavior only compares `scanned_sources`
  source hashes from a manifest in the same output directory. It does not
  accept explicit `--since-manifest`, compare ledger records, or report added,
  removed, changed, stale, and unchanged facts.

## Relevant Contracts

- Public ledger schemas live under
  `standards/project-context-ledger/schemas/`.
- Record artifacts keep top-level array shapes for compatibility.
- `CACHE-MANIFEST.json` carries
  `schema_version: "project-context-ledger/v1"`.
- Current `CACHE-MANIFEST.schema.json` requires `scanned_sources[]` entries
  with `path`, `path_only`, and `sha256` when not path-only.
- `FACTS.schema.json`, `CONTRACTS.schema.json`, and sibling schemas are strict
  with `additionalProperties: false`, so any new record metadata must be
  reflected in schemas and generated-output tests.
- `shared/tool-metadata.js` defines current ledger extra artifacts as:
  `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`,
  `DECISIONS.json`, and `CACHE-MANIFEST.json`.

## Recommended Implementation Shape

### Wave 1: Scope And Categories

Implement source classification before reference extraction:

- Add a small module such as `tools/project-context-ledger/scope.js`.
- Export allowed scope values: `current`, `planning`, `history`, `all`.
- Default parsed scope to `current`.
- Categorize source paths deterministically:
  - `current`: root assistant contracts, package manifests, registry, skills,
    and non-historical source-of-truth files.
  - `planning`: active `.planning` documents such as `PROJECT.md`,
    `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, gates, and cross-repo docs.
  - `history`: `.planning/phases/**` artifacts.
  - `generated_packet`: generated review packet directories.
  - `secret`: secret-like paths.
  - `example` / `placeholder`: deterministic non-real reference cases.
  - `unknown`: safe fallback for unclassified evidence.
- Filter documents by selected scope before markdown references and documented
  commands are extracted.
- Expose source category in `CACHE-MANIFEST.scanned_sources[]` first. Add
  record-level source category only where it is useful and schema-safe.
- Extend schema-output tests and discovery tests before broad fixture changes.

### Wave 2: Explicit Manifest Diff

Add explicit manifest diff after the generated current ledger exists:

- Add CLI flag `--since-manifest <CACHE-MANIFEST.json>`.
- Validate the file exists and parses; invalid input should not silently fall
  back to no diff.
- Prefer `LEDGER-DIFF.json` as the machine source of truth for record-level
  diff output.
- Compare generated record artifacts by artifact name plus stable `id`.
- Hash canonical record JSON for `changed` / `unchanged`.
- Report:
  - `added`: record id present in current run but absent in previous record
    snapshot.
  - `removed`: record id present in previous snapshot but absent in current
    run.
  - `changed`: same artifact/id with different canonical record hash.
  - `unchanged`: same artifact/id with identical canonical record hash.
  - `stale`: current record is `confidence: "stale"` or its source evidence
    changed/disappeared according to manifest comparison.
- Include artifact-level and total counts, refs, source paths, source
  categories, and evidence refs where available.

## Important Design Decisions

- Keep `current` as the default. This is the core signal-quality improvement.
- Preserve `history` and `all` so old phase evidence remains available when
  explicitly requested.
- Treat example/placeholder filtering as classification, not deletion.
- Do not use review dispositions in ledger scope/diff behavior.
- Do not add Phase 17 `--format json`, `--quiet`, or `--fail-on` behavior.
- Keep all outputs review-only and external to the scanned project.

## Test Strategy

- Extend `test/project-context-ledger/cli.test.js` for scope parsing, invalid
  scopes, and `--since-manifest` input validation.
- Extend `test/project-context-ledger/discovery.test.js` for current/planning/
  history/all filtering and source category assignment.
- Extend `test/project-context-ledger/integration.test.js` for output
  isolation, non-mutation, generated packet ignore behavior, and secret
  path-only behavior under scoped runs.
- Extend `test/project-context-ledger/schema-output.test.js` for updated
  schemas, deterministic artifacts, source category fields, and `LEDGER-DIFF`
  determinism if the diff artifact is added.
- Use synthetic fixtures as oracle. Real self-use should compare default
  current scope against explicit `all` or `history` and record the finding
  deltas as evidence only.

## Planning Risks

- **Schema drift:** strict schemas will fail if source category fields are
  emitted without schema updates. Plan schema and generator changes together.
- **Scope ambiguity:** `current` must be documented clearly enough that users
  understand why `.planning/phases/**` findings disappear from default runs.
- **False negatives:** placeholder classification must be conservative. If the
  classifier is unsure, keep the reference real.
- **Diff overreach:** record-level diff must stay mechanical and must not rank
  business priority or decide whether a changed fact matters.
- **Artifact bloat:** keep `CACHE-MANIFEST.json` focused; use
  `LEDGER-DIFF.json` for diff details if needed.

