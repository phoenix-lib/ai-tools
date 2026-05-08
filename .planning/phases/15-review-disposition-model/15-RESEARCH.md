---
phase: 15
name: Review Disposition Model
status: research-complete
created: "2026-05-08"
requirements:
  - DISP-01
  - DISP-02
  - DISP-03
  - DISP-04
  - DISP-05
depends_on:
  - Phase 14 Ledger Artifact Schemas
---

# Phase 15: Review Disposition Model - Research

## Research Question

What must be understood to plan a human review disposition model that can be
joined to review packet findings without suppressing or rewriting the original
evidence?

## Sources Reviewed

- `.planning/phases/15-review-disposition-model/15-CONTEXT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `tools/review-packet-rollup/index.js`
- `tools/review-packet-rollup/cli.js`
- `tools/review-packet-rollup/normalize.js`
- `tools/review-packet-rollup/groups.js`
- `tools/review-packet-rollup/packet-loader.js`
- `tools/review-packet-rollup/README.md`
- `standards/review-packet/schemas/FINDING.schema.json`
- `standards/project-context-ledger/schemas/LEDGER-COMMON.schema.json`
- `shared/canonical-json.js`
- `shared/tool-metadata.js`
- `test/review-packet-rollup/schema-output.test.js`
- `test/review-packet-rollup/normalize.test.js`
- `test/review-packet-rollup/integration.test.js`
- `.planning/phases/14-ledger-artifact-schemas/14-01-PLAN.md`
- `.planning/phases/14-ledger-artifact-schemas/14-02-PLAN.md`

## Gate Resolution

- **Research Gate:** user selected research-first by replying `1` to the
  plan-phase research prompt.
- **AI Tools Self-Use Gate:** applicable for planning. Existing Phase 13 and
  Phase 14 self-use evidence already proves the signal problem: rollup and
  ledger outputs produce many human-review findings with no blockers. Phase 15
  should add human review metadata and verify it with synthetic fixtures first,
  then optional real self-use output after implementation.
- **New Tool Intake Gate:** skipped with reason. Phase 15 defines a standard,
  helper, and packet consumer behavior for existing findings. It does not add a
  new auditor.
- **Cross-Repo Gates:** skipped with reason. No incoming cross-repo request is
  in scope, and no `ai-workspace-kit` mutation is planned.
- **Upstream Freshness Gate:** skipped with reason. Phase 15 depends on AI
  Tools review packet and rollup contracts, not on a new upstream
  `ai-workspace-kit` contract change.

## Current Architecture Findings

### Review Packet Findings Are Strict

`FINDING.schema.json` has `additionalProperties: false` and the rollup tests
assert that normalized findings contain only the standard fields. Disposition
state therefore must not be added to source or normalized finding objects.

Planning consequence: joined disposition state belongs in separate artifacts,
not in `REVIEW-SUMMARY.json.findings[]`.

### Rollup Already Has the Right Join Surface

`normalize.js` records `finding_sources` for every normalized finding:

- normalized finding id;
- source packet id;
- original source finding id;
- source packet status;
- source tool name.

It also preserves evidence refs with packet-prefixed ids. `groups.js` already
derives source paths by following finding evidence refs into normalized
evidence. This gives Phase 15 enough data to compute stable fingerprints from
source tool, source check id, source path, normalized target, and optional
packet id without rereading target projects.

Planning consequence: add a shared fingerprint helper and a rollup-specific
disposition join module rather than duplicating normalization logic.

### Tool-Specific Artifacts Are Already Supported

`index.js` writes standard packet artifacts through
`writePacketArtifacts(...)`, then writes `PACKET-INDEX.json` and
`ROLLUP-GROUPS.json` with canonical JSON. `REVIEW-SUMMARY.generated_artifacts`
stays limited to the standard packet artifacts, while tool manifest
`requested_outputs` and `generated_files` include rollup-specific artifacts.

Planning consequence: `DISPOSITION-INDEX.json` should follow the same pattern:
tool-specific output, canonical JSON, listed in tool manifest outputs, not in
the standard summary `generated_artifacts` enum.

### CLI Extension Must Stay Narrow

`review-packet-rollup/cli.js` has a small local parser and already rejects
mutating flags. Phase 17 will later unify report CLI behavior, so Phase 15
should only add `--dispositions <file...>` and related help text. It should not
add shared `--format`, `--quiet`, or `--fail-on` behavior.

Planning consequence: keep CLI changes isolated to disposition input routing.

### Existing Tests Cover the Critical Safety Patterns

Useful patterns already exist:

- schema tests compile public schemas with AJV;
- rollup output tests validate standard artifacts and deterministic JSON;
- integration tests hash input packet directories before and after a run;
- normalization tests prove occurrence-normalized finding ids.

Planning consequence: Phase 15 should add a focused schema/fingerprint plan
first, then a consumer integration plan that proves joins, expiry visibility,
and non-mutation.

## Recommended Design

### Artifact Contract

Add `standards/review-disposition/README.md` and
`standards/review-disposition/schemas/REVIEW-DISPOSITIONS.schema.json`.

The artifact should be a top-level object:

- `schema_version`: exactly `review-disposition/v1`;
- optional review/source packet metadata;
- `dispositions`: array of disposition records.

The record should require the fields from Phase 15 context:

- `id`;
- `finding_id`;
- `finding_fingerprint`;
- `source_tool`;
- `source_check_id`;
- `source_path`;
- `status`;
- `reason`;
- `owner`;
- `reviewed_at`;
- `expires_at`;
- `evidence_refs`;
- `tool_name`;
- `tool_version`;
- `schema_version`.

Optional provenance should include `source_packet_id`, `source_packet_path`,
and `source_packet_sha256` where available.

### Fingerprint Contract

Add `shared/finding-fingerprint.js`.

The helper should canonicalize a stable object and return `fp.<sha256>`.
Inputs should favor stable fields:

- `source_tool`;
- `source_check_id`;
- `source_path` normalized to POSIX-style relative path or `unknown`;
- `target` normalized from stable evidence target/path data;
- optional `source_packet_id`.

The helper must not include title, summary, severity, status contribution,
rollup occurrence suffix, or mutable prose.

### Consumer Contract

Add optional `--dispositions <file...>` to `review-packet-rollup`.

When dispositions are provided, rollup should:

- validate each `REVIEW-DISPOSITIONS.json` file;
- join records to normalized findings by `finding_fingerprint`;
- write `DISPOSITION-INDEX.json`;
- keep normalized findings, severity, status contribution, evidence refs,
  blockers, required decisions, and packet status unchanged;
- report matched, unmatched, expired, stale schema/tool-version context, and
  findings without active dispositions.

Expired dispositions must remain visible as review-required context. The safest
MVP path is to emit the expired bucket in `DISPOSITION-INDEX.json` and, if
needed for top-level visibility, add a rollup-owned finding with
`source_check_id: disposition.expired` without changing the source finding it
references.

### Bounded Review Surface

`REVIEW-DASHBOARD.json` is optional. If implementation is small, it can
mechanically expose top source checks, top source paths, expired disposition
count, undispositioned finding count, and follow-up count. It must not rank
business priority or declare safe-to-ignore.

## Planning Recommendation

Use two plans:

1. `15-01`: public disposition schema, README, examples, fingerprint helper,
   and focused schema/fingerprint tests.
2. `15-02`: rollup disposition consumption, `DISPOSITION-INDEX.json`, optional
   mechanical dashboard, docs, metadata, integration tests, and self-use
   evidence.

This keeps Phase 15 aligned with the v2.1 strategy: improve evidence
consumption and signal quality without adding another broad auditor or hidden
semantic decision layer.

## Residual Risks

- Fingerprint design can become unstable if it accidentally includes generated
  occurrence IDs or prose.
- Dispositions can be mistaken for suppression if docs and tests do not prove
  source counts and statuses remain unchanged.
- Expired dispositions can become invisible if they are represented only as
  metadata and never surfaced in output.
- Over-extending the CLI would collide with Phase 17.
- A dashboard can become semantic prioritization if it goes beyond mechanical
  counts.

## Research Complete

Phase 15 is ready for detailed planning.
