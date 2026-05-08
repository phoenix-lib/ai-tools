---
phase: 14
name: Ledger Artifact Schemas
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - LEDGER-SCHEMA-01
  - LEDGER-SCHEMA-02
  - LEDGER-SCHEMA-03
  - LEDGER-SCHEMA-04
depends_on:
  - Phase 13 Review Packet Rollup MVP
---

# Phase 14: Ledger Artifact Schemas - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 14 stabilizes the machine-readable contract for the six
`project-context-ledger` JSON artifacts: `FACTS.json`, `COMMANDS.json`,
`CONTRACTS.json`, `SKILLS.json`, `DECISIONS.json`, and
`CACHE-MANIFEST.json`.

The phase should add schemas, fixture expectations, generated-output
validation, and documentation for the current ledger artifact model. It may
make narrow ledger output fixes required for schema validity, such as stable
unique record IDs or missing source metadata. It must not add ledger scope/diff
modes, review dispositions, suppression, semantic triage, portfolio scanning,
or shared CLI contract behavior.

</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- **Gate:** `discuss-mode`
- **Status:** resolved
- **Mode:** Trusted Self-Questioning
- **Selected by:** user
- **Approval source:** user replied `2` after the Phase 14 discuss-mode choice
  prompt on 2026-05-08.
- **Evidence:** `AGENTS.md` requires resolving Manual Questions vs Trusted
  Self-Questioning before gray-area analysis or discuss artifacts;
  `.planning/gates/registry.json` defines `discuss-mode` as non-skippable for
  discuss-stage work; `workflow.discuss_mode` was checked and treated as
  routing only.
- **Cycle limits:** one focused self-questioning pass over schema ownership,
  artifact compatibility, required fields, cache manifest metadata, validation
  strategy, and deferred boundaries.
- **Skip reason:** not skipped.
- **workflow_discuss_mode_is_routing_only:** true.

Required field mirror:

- `mode`: Trusted Self-Questioning
- `selected_by`: user
- `approval_source`: user replied `2` after the Phase 14 discuss-mode prompt
- `evidence`: `AGENTS.md`, `.planning/gates/registry.json`, and routing-only
  `workflow.discuss_mode` check
- `cycle_limits_or_skip_reason`: one focused self-questioning pass
- `workflow_discuss_mode_is_routing_only`: true

### AI Tools Self-Use Gate

- **Gate:** `self-use`
- **Status:** applies later in planning/execution.
- **Capabilities considered:** `project-context-ledger` and
  `review-packet-rollup` are validated; schema validation itself does not yet
  exist before this phase.
- **Resolution:** skip self-use during context capture. Planning and execution
  should run relevant focused tests and, after schemas are wired, validate a
  generated `project-context-ledger` packet. If multiple packets are produced
  during verification, `review-packet-rollup` may be used as optional evidence.

### Cross-Repo Incoming Review Gate

- **Gate:** `cross-repo-incoming`
- **Status:** skipped with reason.
- **Reason:** no incoming cross-repo request asks for Phase 14 scope. This
  phase strengthens AI Tools-owned ledger artifact contracts and does not
  mutate `ai-workspace-kit`.

### New Tool Intake and Placement Gate

- **Gate:** `new-tool-intake`
- **Status:** skipped with reason.
- **Reason:** Phase 14 does not introduce a new tool. It adds schemas for the
  already validated `project-context-ledger`.

### Git Baseline Gate

- **Gate:** `git-baseline`
- **Status:** resolved.
- **Evidence:** `git status --short` was clean before Phase 14 context files
  were written.
- **Classification:** no unrelated baseline noise.

## Implementation Decisions

### Schema Ownership And Location

- **D-01:** Store ledger artifact schemas under
  `standards/project-context-ledger/schemas/`, not inside
  `tools/project-context-ledger/`. These schemas are a downstream consumer
  contract, similar to `standards/review-packet/schemas/`.
- **D-02:** Use schema IDs under
  `https://ai-tools.local/schemas/project-context-ledger/`, with names that map
  directly to generated artifact names: `FACTS.schema.json`,
  `COMMANDS.schema.json`, `CONTRACTS.schema.json`, `SKILLS.schema.json`,
  `DECISIONS.schema.json`, and `CACHE-MANIFEST.schema.json`.
- **D-03:** Add a small shared schema helper such as
  `LEDGER-COMMON.schema.json` only if it reduces duplication for common
  fields. The six artifact schemas remain the public contract.
- **D-04:** Document the schema set in a new or updated ledger schema README so
  downstream consumers know that ledger artifacts are optional evidence, not
  workflow authority.

### Artifact Shape Compatibility

- **D-05:** Preserve the existing top-level array shape for `FACTS.json`,
  `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, and `DECISIONS.json`.
  Do not wrap them in `{ schema_version, entries }` in Phase 14 because that
  would break existing Phase 12 and Phase 13 consumers.
- **D-06:** Keep `CACHE-MANIFEST.json` as an object and add explicit schema
  version metadata there if needed. The manifest is the right place to declare
  ledger artifact schema version for the whole generated set.
- **D-07:** Keep review packet schema versioning in
  `REVIEW-SUMMARY.json.tool.schema_versions.review_packet`; keep ledger schema
  versioning in `REVIEW-SUMMARY.json.tool.schema_versions.project_context_ledger`
  and `CACHE-MANIFEST.json`.
- **D-08:** Use `project-context-ledger/v1` as the current ledger artifact
  contract version. Do not invent a v2 wrapper unless a later breaking schema
  migration is explicitly planned.

### Common Record Rules

- **D-09:** Every ledger record schema should require `id`, `confidence`, and
  `evidence_refs`. Valid confidence values stay aligned with the review packet
  standard: `verified`, `inferred`, `unknown`, and `stale`.
- **D-10:** Every non-cache record should include source metadata. Require
  `source_path` when the current artifact already has or can reasonably add it;
  allow `source_sha256` only when the source is safe, present, and not
  path-only.
- **D-11:** Use strict schemas with `additionalProperties: false` once the
  existing generator is adjusted. This prevents ledger artifacts from becoming
  an unbounded prose dump.
- **D-12:** Require unique stable IDs per artifact in tests, even if JSON
  Schema cannot easily enforce cross-item uniqueness by `id`. Current
  self-use output shows duplicate decision IDs such as `decision.d-01` across
  phase contexts; Phase 14 should fix that before declaring the schema
  validated.
- **D-13:** Evidence refs in ledger artifacts must point to ids present in the
  generated `EVIDENCE.json`. Add a cross-artifact test for this because JSON
  Schema alone cannot verify the join.

### Artifact-Specific Rules

- **D-14:** `FACTS.json` entries should require `id`, `category`, `confidence`,
  `evidence_refs`, `source_path`, `last_checked`, and either `text`, `value`,
  or both. `source_sha256`, `stale_reason`, and `unknown_detail` are optional.
- **D-15:** `COMMANDS.json` entries should require `id`, `kind`, `command`,
  `confidence`, `evidence_refs`, and `source_path`. `name`, `package_path`, and
  `source_sha256` are optional because documented commands and package-bin
  commands have different evidence shapes.
- **D-16:** `CONTRACTS.json` entries should require `id`, `type`, `path`,
  `confidence`, and `evidence_refs`. Require `source_path` for references and
  allow it to be absent for direct assistant contract records only if planning
  decides not to backfill it; preferred implementation is to add `source_path`
  consistently.
- **D-17:** `SKILLS.json` entries should require `id`, `name`, `path`,
  `confidence`, and `evidence_refs`; `source_sha256` is optional.
- **D-18:** `DECISIONS.json` entries should require `id`, `type`, `text`,
  `confidence`, `evidence_refs`, and `source_path`. Optional `value` may hold
  structured registry decision metadata.
- **D-19:** `CACHE-MANIFEST.json` should require `schema_version`,
  `run_timestamp`, `tool`, `ledger_artifacts`, `packet_artifacts`,
  `scanned_sources`, `policy_hashes`, `ignored_generated_packet_dirs`,
  `path_only_secret_paths`, and `previous_manifest`.

### Cache Manifest Policy Metadata

- **D-20:** Treat current top-level fields `ignored_generated_packet_dirs`,
  `path_only_secret_paths`, and `policy_hashes` as the first policy metadata
  surface. Add only small missing fields required by the schema; do not
  redesign cache semantics in Phase 14.
- **D-21:** `scanned_sources` records should require `path` and `path_only`.
  If `path_only` is false, require or test for `sha256`; if `path_only` is
  true, `sha256` must be absent.
- **D-22:** `previous_manifest` should allow exactly the two current states:
  `{ compared: false, reason }` and `{ compared: true, changed_sources }`.
  `changed_sources` entries should require `path`, `previous_sha256`, and
  `current_sha256`.

### Validation Strategy

- **D-23:** Add AJV validation tests for all six ledger artifact schemas using
  generated output from the existing mature ledger fixture.
- **D-24:** Add focused fixture expectations that prove generated artifacts are
  schema-valid, deterministic with a fixed clock, have unique record IDs, and
  reference valid `EVIDENCE.json` ids.
- **D-25:** Keep review packet schema tests separate from ledger artifact
  schema tests, but run both in Phase 14 verification because the ledger emits
  both artifact families.
- **D-26:** If schemas expose invalid current output, fix the generator rather
  than loosening the schema, unless the current output shape is intentionally
  documented as optional.
- **D-27:** Do not commit generated ledger output from real self-use as a test
  oracle. Use synthetic fixtures for assertions and real self-use only as
  verification evidence.

### Documentation And Registry

- **D-28:** Update `tools/project-context-ledger/README.md` to point to the
  new ledger artifact schemas and explain that `EVIDENCE.json` remains the
  evidence-id source.
- **D-29:** Update `docs/RELEASE-READINESS.md` and `CHANGELOG.md` during
  execution if the schema contract becomes a release-facing capability.
- **D-30:** Update `tools/registry.json` evidence refs/status notes if the
  validated ledger entry should cite the schema files and schema-output tests.
  Do not create a new registry tool entry for schemas.

### Agent Discretion

The planner may choose exact schema factoring, test filenames, and whether
small generator backfills happen in Wave 1 or Wave 2. Prefer the smallest set
of code changes needed to make current generated artifacts validate against
strict schemas.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 14 goal, dependency, success criteria, and
  two-wave plan shape.
- `.planning/REQUIREMENTS.md` - LEDGER-SCHEMA-01 through
  LEDGER-SCHEMA-04 and v2.1 traceability.
- `.planning/PROJECT.md` - v2.1 signal-quality milestone, review-only
  boundary, optional `ai-workspace-kit` integration, and key decisions.
- `.planning/STATE.md` - current Phase 14 readiness and Phase 13 completion
  evidence.

### Prior Phase Decisions

- `.planning/phases/13-review-packet-rollup-mvp/13-CONTEXT.md` - packet
  consumer boundary, provenance/grouping decisions, and evidence-only
  consumer semantics.
- `.planning/phases/13-review-packet-rollup-mvp/13-VERIFICATION.md` - latest
  self-use evidence showing 401 rolled-up findings and why signal-quality
  work matters.
- `.planning/phases/12-project-context-ledger-mvp/12-CONTEXT.md` - ledger
  artifact contract, fact model, cache manifest model, and safety boundaries.
- `.planning/phases/12-project-context-ledger-mvp/12-VERIFICATION.md` -
  validated ledger behavior and generated artifact evidence.
- `.planning/phases/11-v2-tool-selection-review/11-CONTEXT.md` - original
  reason for selecting `project-context-ledger` and deferring broader tools.

### Ledger Implementation

- `tools/project-context-ledger/index.js` - runner, packet rendering,
  `project_context_ledger` schema version in tool manifest, and artifact
  writing.
- `tools/project-context-ledger/ledger.js` - current generated models for
  facts, commands, contracts, skills, decisions, cache manifest, source hashes,
  and evidence refs.
- `tools/project-context-ledger/discovery.js` - source categories and current
  planning/phase artifact discovery behavior.
- `tools/project-context-ledger/checks.js` - packet status, finding, and action
  helpers.
- `tools/project-context-ledger/README.md` - current user-facing artifact list
  and non-goals.
- `shared/tool-metadata.js` - `PROJECT_CONTEXT_LEDGER_ARTIFACTS`, shared
  artifact constants, and package version lookup.

### Existing Schema Patterns

- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json` - strict schema
  style, status/counts, and embedded finding/action references.
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json` - evidence ref
  shape used by ledger records.
- `standards/review-packet/schemas/FINDING.schema.json` - strict
  `additionalProperties: false` pattern and confidence enum.
- `standards/review-packet/schemas/TOOL-MANIFEST.schema.json` - tool manifest
  schema version pattern.
- `standards/review-packet/CANONICAL-JSON.md` - deterministic JSON guidance.

### Tests And Fixtures

- `test/project-context-ledger/schema-output.test.js` - current review packet
  schema validation and deterministic ledger artifact checks.
- `test/project-context-ledger/integration.test.js` - mature fixture,
  non-mutation proof, generated artifact assertions, and secret non-leakage.
- `test/fixtures/project-context-ledger/mature-ledger/input/` - synthetic
  ledger fixture that should remain the primary schema-validation oracle.
- `test/review-packet-rollup/schema-output.test.js` - recent pattern for
  validating extra tool-specific artifacts without changing review packet
  summary generated_artifacts.
- `test/shared/fixture-helpers.js` - temporary output/fixture helper patterns.
- `test/planning/tool-registry.test.js` - registry evidence refs and maturity
  expectations if registry metadata changes.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `project-context-ledger` already emits the six ledger JSON artifacts with
  canonical JSON through `ledger.js`.
- `test/project-context-ledger/schema-output.test.js` already creates AJV for
  review packet schemas and can be extended or mirrored for ledger artifact
  schemas.
- `shared/tool-metadata.js` already centralizes the ledger artifact names.
- `EVIDENCE.json` already carries the evidence refs ledger records point to;
  Phase 14 should validate joins rather than inventing another evidence file.

### Established Patterns

- Schema contracts live under `standards/` when they are intended for
  downstream consumers.
- Tool-specific extra artifacts are generated alongside the standard review
  packet, but they are not added to `REVIEW-SUMMARY.json.generated_artifacts`
  because that enum is for the four standard packet files.
- Tests use generated fixture output with fixed clocks instead of committed
  real self-use output as the canonical oracle.
- Existing JSON schemas are strict. Phase 14 should continue that pattern after
  small generator fixes.

### Integration Points

- New schema files should be loaded by AJV in ledger schema tests.
- `tools/project-context-ledger/ledger.js` likely needs small output fixes:
  unique decision IDs, consistent `source_path`, cache manifest
  `schema_version`, and possibly `source_sha256` additions.
- `tools/project-context-ledger/README.md`, `docs/RELEASE-READINESS.md`, and
  `CHANGELOG.md` should document the schema contract after implementation.
- `tools/registry.json` can cite schema files as evidence for the validated
  ledger entry, but no new package bin or tool entry is needed.

</code_context>

<specifics>
## Specific Ideas

- Prefer the schema directory:
  `standards/project-context-ledger/schemas/`.
- Preserve existing top-level arrays for ledger record artifacts.
- Add `schema_version: "project-context-ledger/v1"` to
  `CACHE-MANIFEST.json` if it is not already present.
- Add cross-artifact tests for evidence refs and unique IDs because JSON
  Schema alone is not enough for those constraints.
- Treat duplicate `decision.d-01` style IDs as a real schema-hardening bug,
  not as a schema looseness requirement.

</specifics>

<deferred>
## Deferred Ideas

- Ledger `--scope current|planning|history|all` belongs to Phase 16.
- Ledger `--since-manifest` changed/added/removed fact diffing belongs to
  Phase 16, beyond the small cache-manifest validation in Phase 14.
- Review dispositions, expiry, and stale disposition reporting belong to
  Phase 15.
- Shared `--format json`, `--quiet`, and `--fail-on` migration belongs to
  Phase 17.
- Portfolio-wide real project scanning remains deferred to the real-project
  evidence baseline seed after v2.1 foundations exist.
- Do not add semantic prioritization, suppression, auto-ignore, gate approval,
  roadmap mutation, package installs, or target command execution.

</deferred>

---

*Phase: 14-Ledger Artifact Schemas*
*Context gathered: 2026-05-08*
