---
phase: 13
name: Review Packet Rollup MVP
status: complete
created: "2026-05-08"
research_mode: inline
requirements:
  - ROLLUP-01
  - ROLLUP-02
  - ROLLUP-03
  - ROLLUP-04
  - ROLLUP-05
  - ROLLUP-06
---

# Phase 13: Review Packet Rollup MVP - Research

## Research Question

What does the planner need to know to build `review-packet-rollup` as a
mechanical packet consumer without widening AI Tools into a semantic triage or
decision engine?

## Sources Reviewed

- `.planning/phases/13-review-packet-rollup-mvp/13-CONTEXT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json`
- `standards/review-packet/schemas/FINDING.schema.json`
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json`
- `shared/review-packet-renderer.js`
- `shared/path-guard.js`
- `shared/tool-metadata.js`
- `tools/gates-scan/cli.js`
- `tools/project-context-ledger/cli.js`
- `tools/project-context-ledger/index.js`
- `tools/project-context-ledger/ledger.js`
- `tools/registry.json`
- `tools/registry.schema.json`
- `test/contract-drift-auditor/schema-output.test.js`
- `test/gates-scan/integration.test.js`
- `test/planning/tool-registry.test.js`
- `test/shared/fixture-helpers.js`
- Prior plans `10-02-PLAN.md` and `12-01-PLAN.md`

## Findings

### 1. Rollup Should Reuse The Existing Packet Renderer

`shared/review-packet-renderer.js` already derives counts from the summary
model and validates that `counts` match findings, blockers, required decisions,
rejected assumptions, and preserved stricter local rules. Phase 13 should not
add a separate count calculator for generated `REVIEW-SUMMARY.json`.

Planning implication: normalize source findings into one rollup packet model,
then let `deriveCounts`, `validateCounts`, and `writePacketArtifacts` produce
the standard packet artifacts.

### 2. Finding Provenance Cannot Be Added Inline

`FINDING.schema.json` has `additionalProperties: false`. Valid source finding
fields are limited to id, severity, title, summary, confidence,
status_contribution, source_check_id, evidence_refs, and recommended_action_refs.
Packet provenance therefore cannot be stored as extra properties on rollup
findings.

Planning implication: keep rollup findings schema-valid by prefixing ids and
refs, then store source packet path, source finding id, source tool, validation
status, and hash metadata in `PACKET-INDEX.json` and `ROLLUP-GROUPS.json`.

### 3. Evidence Validation Is Entry-Based

The current standard has `EVIDENCE-REF.schema.json`, not a wrapper schema for
the full `EVIDENCE.json` array. Existing tests validate each evidence entry
with AJV after loading all review packet schemas.

Planning implication: validate `REVIEW-SUMMARY.json` as a whole and validate
each `EVIDENCE.json` array entry against `EVIDENCE-REF.schema.json`. Treat a
non-array evidence file as invalid packet input.

### 4. Output Isolation Must Use Multi-Input Path Guarding

`shared/path-guard.js` exposes `assertSafeOutputDirOutsideAll`, which matches
the rollup command because there are multiple packet input directories. The
message still says target project, but the behavior correctly rejects output
inside or equal to any packet directory.

Planning implication: call `assertSafeOutputDirOutsideAll(packetDirs, outDir)`
before reading and before writing, and add a fixture test that proves no input
packet source is modified.

### 5. Existing CLIs Are Small And Non-Breaking

`gates-scan` and `project-context-ledger` parse only explicit input/output/help,
reject mutating flags, require external output, and print a human completion
line. Full `--format json`, `--quiet`, and `--fail-on` behavior exists in
`contract-drift-auditor` but is explicitly Phase 17 scope for cross-tool
unification.

Planning implication: `review-packet-rollup` should use the small CLI style in
Phase 13. It should parse `--packets <dir...>`, `--out <dir>`, and `--help`;
reject mutating/source-running flags; and defer shared CLI contract work.

### 6. Registry Needs A Minimal Consumer Distinction

`tools/registry.schema.json` can already represent a planned or runnable tool
with expected outputs, package bin, maturity, self-use, and non-goals. It does
not currently distinguish producers from consumers. The Phase 13 context allows
a minimal compatible extension if needed.

Planning implication: the lowest-risk implementation is to add an optional
field such as `tool_kind` or `packet_role` only if docs/tests need it, and to
keep existing producer entries valid. The rollup registry entry should say
packet consumer in `status_notes` and non-goals even if no schema field is
added.

### 7. Grouping Should Be Built From Validated Artifacts

ROLLUP-03 requires grouping by source tool, status, severity, source_check_id,
status_contribution, and source path. Source path is safest when derived from
validated evidence refs, not prose summaries. A finding can cite multiple
evidence refs and should appear in multiple source path groups with unique
finding refs.

Planning implication: build a normalized source packet model:

- packet id, absolute/normalized input path, validation status, artifact hashes
- parsed summary, evidence refs by id, source tool metadata
- copied findings, blockers, required decisions, rejected assumptions, and
  preserved stricter local rules with deterministic prefixed ids
- evidence ref mapping from source ids to rollup ids

Then build `ROLLUP-GROUPS.json` from the normalized rollup findings and
packet-index provenance.

### 8. Invalid Input Should Block Trust But Preserve Valid Evidence

Phase 13 context says missing, malformed, or schema-invalid packet input should
emit a blocked finding and set rollup status to `blocked`, while still indexing
valid packets. This is aligned with review packet semantics: findings are
evidence, and a blocker means the aggregate is not fully trustworthy.

Planning implication: validation should return per-packet results instead of
throwing the whole run away, except for pre-flight issues such as fewer than two
packet dirs or unsafe output. Invalid packets produce packet-index records and
rollup validation findings.

### 9. Tests Should Be Synthetic First

Existing fixture patterns use small committed fixture directories and temporary
external output. Real self-use packets are useful verification evidence, but
they are noisy and unstable as primary oracles.

Planning implication: create `test/fixtures/review-packet-rollup/` with small
packet directories covering:

- two valid packets with overlapping severities and source paths
- duplicate source finding ids across packets
- missing or invalid required JSON artifact
- blockers and required decisions
- one finding with multiple evidence refs
- unsafe output inside an input packet directory

### 10. Rollup Is A Foundation For Future Portfolio Scan, Not That Feature

The future real-project evidence baseline seed depends on reliable rollup
output, but Phase 13 should not introduce portfolio manifests, source tool
execution, project scanning, dispositions, or scope/diff semantics.

Planning implication: docs should make clear that rollup consumes packet
directories already produced elsewhere. It is not a runner, gate, merge
decision engine, disposition system, or portfolio scanner.

## Recommended Implementation Shape

Use two plans:

1. `13-01` defines fixtures, packet validation, provenance, normalization, and
   grouping model. This plan should write most pure functions and tests for
   packet ingestion without exposing the package bin yet.
2. `13-02` wires the CLI, renderer, metadata, registry, docs, self-use evidence,
   final tests, and changelog. This plan depends on `13-01`.

Suggested module boundaries:

- `tools/review-packet-rollup/cli.js`
- `tools/review-packet-rollup/index.js`
- `tools/review-packet-rollup/packet-loader.js`
- `tools/review-packet-rollup/normalize.js`
- `tools/review-packet-rollup/groups.js`
- `tools/review-packet-rollup/README.md`

Suggested tests:

- `test/review-packet-rollup/cli.test.js`
- `test/review-packet-rollup/packet-loader.test.js`
- `test/review-packet-rollup/groups.test.js`
- `test/review-packet-rollup/integration.test.js`
- `test/review-packet-rollup/schema-output.test.js`

## Risks To Guard

- Adding semantic suppression or safe-to-ignore wording.
- Putting provenance into schema-invalid finding properties.
- Treating real self-use output as the only oracle.
- Forgetting that `generated_artifacts` in `REVIEW-SUMMARY.json` only allows
  the four standard packet artifacts; extra artifacts belong in the tool
  manifest requested/generated files and docs, not the summary
  `generated_artifacts` enum.
- Marking the registry entry as validated before CLI, focused tests, full
  tests, docs, and self-use evidence exist.

## Research Complete

Phase 13 is ready for planning. The plan should preserve a narrow, mechanical
packet-consumer boundary and rely on existing shared packet mechanics wherever
possible.
