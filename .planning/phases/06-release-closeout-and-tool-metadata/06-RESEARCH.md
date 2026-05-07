---
phase: 6
name: Release Closeout and Tool Metadata
status: complete
created: "2026-05-07"
requirements:
  - REL-05
  - REL-06
  - META-01
  - SELF-01
---

# Phase 6 Research: Release Closeout and Tool Metadata

## Research Question

What do we need to know to plan Phase 6 well?

Phase 6 is release discipline work around the existing
`contract-drift-auditor`. It should clean up release docs, add representative
release packet examples, centralize metadata constants, and document portable
self-audit usage without starting the cross-repo validator, CLI ergonomics, or
tool registry phases early.

## Source Review

### Upstream Freshness

The ai-workspace-kit freshness gate was run before planning:

- Local `.external/ai-workspace-kit` commit:
  `2079ab9626e9f9ed256512091f9c5ea473582885`
- GitHub HEAD:
  `2079ab9626e9f9ed256512091f9c5ea473582885`
- Branch: `master`
- Dirty status: clean
- Result: no upstream update required.

Upstream Phase 11-13 guidance remains relevant:

- AI Tools packet compatibility expects `REVIEW-SUMMARY.json`,
  `EVIDENCE.json`, `FINDINGS.md`, and `RECOMMENDED-ACTIONS.md`.
- JSON artifacts are the machine source of truth; Markdown is projection.
- Evidence refs must stay relative and normalized; secret-like paths remain
  path-only.
- Changelogs are planning evidence for downstream freshness checks, not
  automatic approval to consume changed capabilities.
- `ai-workspace-kit` must not install, run, or depend on AI Tools
  automatically.

The freshness review was recorded in
`.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md`.

### Current Release Docs

`tools/contract-drift-auditor/README.md` still says the MVP can report noisy
references on large historical planning folders. That is stale after Phase 5,
because `05-02` hardened source filtering so historical `.planning/phases/**`
artifacts and nested fixture contracts are not treated as current self-audit
source documents by default.

The accurate remaining limitation is narrower: conservative text parsing over
current contract/planning docs can still surface low-severity caveats around
optional, example, or shorthand references.

`docs/RELEASE-READINESS.md` records a real Phase 5 self-audit command with a
machine-local output path under `C:\Users\suppo`. That path is valid as
historical evidence, but not as reusable guidance. Phase 6 should add or
replace recommended guidance with a portable pattern requiring a
caller-provided external output directory.

### Current Metadata Duplication

`tools/contract-drift-auditor/index.js` currently owns several values that
should not silently drift:

- `packageVersion()` reads `package.json` locally inside the auditor.
- `schema_version` is hardcoded as `review-packet/v1`.
- `tool.schema_versions.review_packet` is hardcoded as `review-packet/v1`.
- `tool_name` is hardcoded as `contract-drift-auditor`.
- `REQUIRED_ARTIFACTS` comes from `shared/review-packet-renderer.js`.
- policy hash labels are inline in `createToolManifest`.

This is acceptable for the MVP, but Phase 6's `META-01` needs a single source
used by code/docs/examples/tests where practical.

The right scope is a small CommonJS helper such as `shared/tool-metadata.js`,
not the full Phase 9 tool registry. It should centralize stable constants and
helpers, while `package.json` remains the package version source.

Candidate contents:

- `REVIEW_PACKET_SCHEMA_VERSION`
- `REQUIRED_PACKET_ARTIFACTS`
- `CONTRACT_DRIFT_AUDITOR_TOOL_NAME`
- `POLICY_FILES` or `POLICY_HASH_SOURCES`
- `loadPackageVersion(rootDir)`
- helper to build generated file metadata if useful

Avoid moving maturity, owner, activation stage, or full use-gate metadata into
Phase 6; that belongs to Phase 9 registry work.

### Release Packet Fixtures

Generic examples already exist under `standards/review-packet/examples/`.
Phase 6 needs tool-specific examples showing what `contract-drift-auditor`
emits. They should be release-facing, committed to the repository, and
schema-validated by tests.

Recommended location:

```text
tools/contract-drift-auditor/examples/
  pass/
    REVIEW-SUMMARY.json
    EVIDENCE.json
    FINDINGS.md
    RECOMMENDED-ACTIONS.md
  human-review/
    REVIEW-SUMMARY.json
    EVIDENCE.json
    FINDINGS.md
    RECOMMENDED-ACTIONS.md
  blocked-safety/
    REVIEW-SUMMARY.json
    EVIDENCE.json
    FINDINGS.md
    RECOMMENDED-ACTIONS.md
```

The pass and human-review examples can be generated from existing fixture
targets with a fixed clock. The safety-blocked case needs care because the real
CLI correctly rejects an unsafe `--out` before writing any packet. A committed
`blocked-safety` example should be treated as a synthetic packet-shape example,
rendered through the shared packet renderer, and documented as such. Tests
should separately prove unsafe target-local output produces no files.

### Validation Patterns

Existing tests provide the right mechanics:

- `test/planning/release-docs.test.js` validates release docs contain required
  phrases.
- `test/contract-drift-auditor/schema-output.test.js` validates generated
  auditor packets against review packet schemas and enforces normalized
  evidence paths.
- `test/shared/review-packet-renderer.test.js` proves Markdown/JSON output
  comes from one model and count divergence fails.
- `test/contract-drift-auditor/integration.test.js` proves required artifacts,
  secret safety, generated packet ignore behavior, and historical planning
  filtering.

Phase 6 can add focused tests rather than a new test harness:

- docs test for updated limitation wording and portable self-audit command;
- metadata test proving code uses shared constants for schema version, artifact
  names, tool name, and package version lookup;
- release examples test validating all three example folders have required
  artifacts and schema-valid JSON;
- safety test proving target-local output is still rejected without writing a
  packet, if not already explicit enough.

## Planning Recommendations

### Plan 06-01: Release Docs Cleanup

Scope:

- Update `tools/contract-drift-auditor/README.md` limitation wording.
- Update `docs/RELEASE-READINESS.md` so reusable self-audit guidance uses
  `<external-dir>` and the Phase 5 machine-local path is clearly historical
  evidence only.
- Add docs validation for these phrases.

Do not change runtime behavior here.

### Plan 06-02: Metadata Source of Truth

Scope:

- Add `shared/tool-metadata.js`.
- Move review packet schema version, required artifact names, auditor tool
  name, policy hash source labels, and package version lookup into the helper.
- Update `shared/review-packet-renderer.js` and
  `tools/contract-drift-auditor/index.js` to consume it.
- Add focused metadata tests.

This should happen before or alongside release examples because examples should
use the final metadata values.

### Plan 06-03: Release Packet Fixtures

Scope:

- Add tool-specific release packet examples for pass, human-review, and
  blocked-safety.
- Generate or render examples from one model with fixed timestamps.
- Validate artifacts and schemas.
- Document that blocked-safety is a packet-shape example if it is synthetic,
  while runtime unsafe-output behavior still writes no packet.
- Update `CHANGELOG.md` with changed release artifacts, validation, and
  `ai-workspace-kit` compatibility impact.

## Gate Implications

- **AI Tools Self-Use Gate:** the auditor is relevant to release readiness, but
  Phase 6 planning itself should not rerun it. Execution/verification should
  run it only after docs/metadata/fixtures have changed, with explicit
  `--project . --out <external-dir>`.
- **New Tool Intake Gate:** Phase 6 introduces no new tool. Metadata helper and
  examples are support artifacts for the existing auditor.
- **Cross-Repo Boundary Gate:** no outgoing request is needed. Phase 6 preserves
  optional packet compatibility and does not implement kit-owned behavior.
- **Changelog Gate:** Phase 6 must update `CHANGELOG.md` because downstream
  `ai-workspace-kit` freshness checks read it first.

## Risks

- If the metadata helper becomes a full registry, Phase 6 will duplicate Phase
  9. Keep it small and constant-oriented.
- If blocked-safety examples appear to be real output from an unsafe path,
  consumers may misunderstand safety behavior. Label synthetic examples clearly.
- If docs remove all limitation wording, release readiness will overstate the
  auditor. Keep current-doc low-severity caveats explicit.
- If self-audit guidance embeds a local path, future downstream planning will
  treat machine-local evidence as a reusable command.

## Research Complete

Phase 6 is ready for planning. The recommended executable plan order is:

1. `06-01` docs cleanup and docs validation.
2. `06-02` metadata source of truth.
3. `06-03` release packet fixtures, validation, changelog, and self-use
   verification guidance.
