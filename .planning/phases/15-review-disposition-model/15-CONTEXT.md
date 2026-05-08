---
phase: 15
name: Review Disposition Model
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - DISP-01
  - DISP-02
  - DISP-03
  - DISP-04
  - DISP-05
depends_on:
  - Phase 14 Ledger Artifact Schemas
---

# Phase 15: Review Disposition Model - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 15 adds explicit human review disposition metadata for existing review
packet findings. It defines how reviewers record what they decided about a
finding, how consumers join those records back to packet findings, and how
expired or stale disposition records remain visible.

The phase must preserve the original review packet evidence: it does not delete
findings, rewrite severity, change `status_contribution`, mark findings safe to
ignore, mutate source packet directories, or make gate, merge, roadmap, install,
or target-project mutation decisions.

</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- **Gate:** `discuss-mode`
- **Status:** resolved
- **Mode:** Trusted Self-Questioning
- **Selected by:** user
- **Approval source:** user replied `1` after the Phase 15 discuss-mode choice
  prompt on 2026-05-08.
- **Evidence:** `AGENTS.md` requires resolving Manual Questions vs Trusted
  Self-Questioning before gray-area analysis or discuss artifacts;
  `.planning/gates/registry.json` defines `discuss-mode` as non-skippable for
  discuss-stage work; `workflow.discuss_mode` was checked and treated as
  routing only.
- **Cycle limits:** one focused self-questioning pass over sidecar artifact
  shape, fingerprint identity, disposition lifecycle, packet consumer joins,
  stale/expired handling, bounded review surface, tests, and deferred
  boundaries.
- **Skip reason:** not skipped.
- **workflow_discuss_mode_is_routing_only:** true.

Required field mirror:

- `mode`: Trusted Self-Questioning
- `selected_by`: user
- `approval_source`: user replied `1` after the Phase 15 discuss-mode prompt
- `evidence`: `AGENTS.md`, `.planning/gates/registry.json`, and routing-only
  `workflow.discuss_mode` check
- `cycle_limits_or_skip_reason`: one focused self-questioning pass
- `workflow_discuss_mode_is_routing_only`: true

### AI Tools Self-Use Gate

- **Gate:** `self-use`
- **Status:** resolved for context capture with evidence reuse.
- **Capabilities considered:** `project-context-ledger` and
  `review-packet-rollup` are validated and directly relevant.
- **Resolution:** do not rerun tools during context capture. Phase 14 and
  Phase 13 self-use already provide fresh evidence: ledger output reported 383
  findings with 0 blockers and 0 required decisions; rollup output reported
  401 findings with 0 blockers and 0 required decisions. Those findings are the
  reason Phase 15 needs explicit human review metadata.
- **Planning impact:** Phase 15 planning and verification should use small
  fixtures plus a real self-use packet or rollup packet to prove dispositions
  join to noisy findings without hiding them.

### Cross-Repo Incoming Review Gate

- **Gate:** `cross-repo-incoming`
- **Status:** skipped with reason.
- **Reason:** no incoming cross-repo request asks for Phase 15 scope. The
  phase adds AI Tools-owned packet review metadata and does not mutate
  `ai-workspace-kit`.

### New Tool Intake and Placement Gate

- **Gate:** `new-tool-intake`
- **Status:** skipped with reason.
- **Reason:** Phase 15 should not introduce a new auditor. It adds standards
  and consumer behavior for review dispositions over existing packet findings.

### Git Baseline Gate

- **Gate:** `git-baseline`
- **Status:** resolved.
- **Evidence:** `git status --short` was clean before Phase 15 context work.
- **Classification:** no unrelated baseline noise.

## Implementation Decisions

### Artifact Ownership And Shape

- **D-01:** Store the public disposition contract under
  `standards/review-disposition/`, with schemas under
  `standards/review-disposition/schemas/`.
- **D-02:** Use `review-disposition/v1` as the first schema version.
- **D-03:** Define a sidecar artifact named `REVIEW-DISPOSITIONS.json`.
  It is separate from source `REVIEW-SUMMARY.json` and never rewrites source
  packet findings.
- **D-04:** Make `REVIEW-DISPOSITIONS.json` a top-level object, not a bare
  array, so the file can carry `schema_version`, source packet identity, review
  ownership metadata, and a `dispositions` array.
- **D-05:** Keep disposition files valid outside a packet directory. They may
  live beside a rollup output or in another explicit external review directory.
  Source packet directories remain read-only inputs.
- **D-06:** Do not add disposition fields to review packet finding objects.
  `FINDING.schema.json` is strict and should stay focused on source findings.
  Joined disposition state belongs in consumer-specific artifacts.

### Disposition Record Identity

- **D-07:** Every disposition record requires a stable `id` and a
  `finding_fingerprint`.
- **D-08:** Keep `finding_id` in the record as the exact source finding id that
  was reviewed, but do not rely on it alone because rollup and ledger already
  occurrence-normalize duplicate ids.
- **D-09:** Add a shared deterministic fingerprint helper, preferably under
  `shared/finding-fingerprint.js`, so packet consumers and tests do not invent
  incompatible identity rules.
- **D-10:** Derive fingerprints from a canonical object that favors stable
  evidence fields: source tool name, source check id, normalized source path,
  normalized target value, and optional source packet id. Do not include title,
  summary prose, severity, occurrence suffix, or generated rollup prefix.
- **D-11:** Use a deterministic string shape such as `fp.<sha256>` for
  `finding_fingerprint`. The exact hash input can be decided in planning, but
  it must be documented and tested.
- **D-12:** For findings without a resolvable source path, use a stable
  `unknown` source path bucket plus the source check id and normalized target
  rather than falling back to mutable prose.

### Required Fields

- **D-13:** A disposition record should require: `id`, `finding_id`,
  `finding_fingerprint`, `source_tool`, `source_check_id`, `source_path`,
  `status`, `reason`, `owner`, `reviewed_at`, `expires_at`, `evidence_refs`,
  `tool_name`, `tool_version`, and `schema_version`.
- **D-14:** Include optional packet provenance fields when available:
  `source_packet_id`, `source_packet_path`, and `source_packet_sha256`.
- **D-15:** `evidence_refs` in a disposition should cite packet evidence ids or
  review evidence ids. Tests should prove refs join when the source evidence is
  available.
- **D-16:** `owner` is the human or team responsible for re-review, not an
  automatic assignee for code changes.
- **D-17:** `expires_at` is required. Phase 15 should avoid indefinite
  dispositions because stale review context was one of the core risks.

### Disposition Status Model

- **D-18:** Use a small explicit enum for stored statuses:
  `accepted_current_issue`, `accepted_historical_noise`, `not_actionable`,
  `false_positive`, and `needs_followup`.
- **D-19:** Do not store `expired` as a manual status. Expiry is computed from
  `expires_at` so stale review context cannot be hidden by an old label.
- **D-20:** `accepted_historical_noise` is the intended status for findings
  like old `.planning/phases/**` references that are understood but should stay
  visible until Phase 16 scope/diff reduces them mechanically.
- **D-21:** `false_positive` is allowed only as human review metadata. It does
  not delete the source finding or change source packet counts.
- **D-22:** `needs_followup` should keep the finding prominent in bounded
  review surfaces.

### Packet Consumer Behavior

- **D-23:** The first consumer integration should be `review-packet-rollup`,
  because it already aggregates multiple packets and has grouping/provenance
  artifacts.
- **D-24:** Add optional disposition input to packet consumers, likely
  `--dispositions <file...>` for `review-packet-rollup`. This is not the Phase
  17 shared CLI migration.
- **D-25:** Joined disposition output should live in a separate artifact such
  as `DISPOSITION-INDEX.json`. Do not modify source findings or the standard
  `generated_artifacts` enum in `REVIEW-SUMMARY.json`.
- **D-26:** `DISPOSITION-INDEX.json` should record matched dispositions,
  unmatched dispositions, expired dispositions, stale schema/tool-version
  context, and findings with no disposition.
- **D-27:** Expired dispositions should create review-required context. The
  planner may implement this as a consumer finding with
  `source_check_id: disposition.expired` or as a clearly counted expired bucket
  in `DISPOSITION-INDEX.json`, but it must be visible in verification.
- **D-28:** Active dispositions may annotate the bounded review surface, but
  they must not change source severity, source status contribution, blockers,
  required decisions, or packet status derivation.

### Bounded Review Surface

- **D-29:** Phase 15 may add a small bounded review surface if it is cheap and
  mechanical, such as top source checks, top source paths, expired disposition
  count, and undispositioned finding count.
- **D-30:** If a bounded surface is added, prefer a separate artifact such as
  `REVIEW-DASHBOARD.json` rather than adding semantic fields to source
  findings.
- **D-31:** The bounded surface is a display/index aid only. It must not rank
  business priority, declare safe-to-ignore, or become a gate/merge decision
  engine.
- **D-32:** If implementation pressure is high, `REVIEW-DASHBOARD.json` can be
  deferred. `REVIEW-DISPOSITIONS.json` schema and `DISPOSITION-INDEX.json`
  joins are the core Phase 15 deliverable.

### Lifecycle And Validation

- **D-33:** Add examples for active, expired, unmatched, and stale-version
  disposition records.
- **D-34:** Add AJV schema tests for valid and invalid
  `REVIEW-DISPOSITIONS.json` files.
- **D-35:** Add join tests proving dispositions match findings by fingerprint
  even when rollup occurrence ids change.
- **D-36:** Add tests proving expired dispositions remain visible and do not
  silently suppress source findings.
- **D-37:** Add tests proving source packet directories are not mutated when
  disposition files are consumed.
- **D-38:** Real self-use should be verification evidence only; synthetic
  fixtures remain the primary oracle.

### Boundaries

- **D-39:** Do not implement Phase 16 scope/diff behavior in Phase 15.
- **D-40:** Do not implement Phase 17 shared CLI helper in Phase 15 beyond the
  narrow optional `--dispositions` input needed by a consumer.
- **D-41:** Do not implement portfolio project scanning in Phase 15.
- **D-42:** Do not add automatic disposition generation from findings. Review
  dispositions are human-authored or fixture-authored metadata.

### Agent Discretion

The planner may choose exact filenames for internal helpers and whether
`DISPOSITION-INDEX.json` is emitted by rollup only or by a small shared
consumer helper used by rollup. Prefer the smallest implementation that proves
schema validity, fingerprint matching, expiry visibility, and source packet
non-mutation.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 15 goal, success criteria, dependency, and
  DISP-01 through DISP-05 mapping.
- `.planning/REQUIREMENTS.md` - formal disposition requirements, fingerprint
  requirement, and future portfolio boundary.
- `.planning/PROJECT.md` - v2.1 evidence consumption milestone, review-only
  boundary, and key decision that dispositions are human review context.
- `.planning/STATE.md` - Phase 15 readiness and Phase 14 completion evidence.

### Prior Phase Decisions

- `.planning/phases/14-ledger-artifact-schemas/14-CONTEXT.md` - schema
  strictness, `project-context-ledger/v1`, unique ids, and deferred boundary
  from ledger schemas to dispositions.
- `.planning/phases/14-ledger-artifact-schemas/14-VERIFICATION.md` - self-use
  evidence showing 383 findings, 0 blockers, and why disposition/scope work is
  needed.
- `.planning/phases/13-review-packet-rollup-mvp/13-CONTEXT.md` - mechanical
  packet consumer boundary, provenance, grouping, normalization, and no
  suppression decisions.
- `.planning/phases/13-review-packet-rollup-mvp/13-VERIFICATION.md` - rollup
  self-use evidence showing 401 findings and validating the consumer surface.

### Review Packet And Ledger Standards

- `standards/review-packet/schemas/FINDING.schema.json` - strict source
  finding shape that must not be extended with disposition fields.
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json` - packet
  status/count behavior and standard artifact enum.
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json` - evidence ref
  shape used by disposition evidence refs.
- `standards/project-context-ledger/schemas/LEDGER-COMMON.schema.json` -
  shared id, evidence ref, confidence, path, hash, and timestamp patterns.
- `standards/project-context-ledger/README.md` - optional evidence-consumer
  contract language and non-authority boundaries.

### Existing Consumer Implementation

- `tools/review-packet-rollup/normalize.js` - source finding normalization,
  occurrence ids, copied evidence refs, packet status derivation, and
  provenance mapping.
- `tools/review-packet-rollup/groups.js` - mechanical grouping by tool, status,
  severity, source check id, status contribution, and source path.
- `tools/review-packet-rollup/packet-loader.js` - packet validation and packet
  id generation.
- `tools/review-packet-rollup/index.js` - rollup runner and extra artifact
  writing integration point.
- `tools/review-packet-rollup/README.md` - current packet consumer behavior and
  non-goals.
- `shared/review-packet-renderer.js` - source packet count derivation and
  standard artifact rendering that dispositions must not subvert.
- `shared/canonical-json.js` - canonical JSON output for new disposition
  artifacts.

### Tests And Fixtures

- `test/review-packet-rollup/schema-output.test.js` - pattern for validating
  standard packet output plus extra tool-specific artifacts.
- `test/review-packet-rollup/normalize.test.js` - occurrence-normalized source
  finding id coverage.
- `test/review-packet-rollup/groups.test.js` - mechanical grouping coverage
  that disposition dashboard/index behavior may reuse.
- `test/review-packet-rollup/integration.test.js` - output isolation and
  non-mutation patterns for packet consumer runs.
- `test/project-context-ledger/schema-output.test.js` - generated-output schema
  validation and unique id/evidence join patterns from Phase 14.
- `test/planning/tool-registry.test.js` - registry maturity/evidence checks if
  disposition standards or consumer artifacts need registry evidence refs.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `review-packet-rollup` already has a packet loader, normalizer, grouping
  logic, and extra artifact writing path, making it the natural first
  disposition consumer.
- `shared/canonical-json.js` can render new disposition artifacts
  deterministically.
- `review-packet-renderer` keeps source packet counts consistent; Phase 15
  should leave that model intact and put joins in separate artifacts.
- AJV setup patterns already exist in packet and ledger schema-output tests.

### Established Patterns

- Public consumer contracts live under `standards/`.
- Source findings are strict and do not accept extra fields.
- Extra tool-specific artifacts are emitted alongside standard packet
  artifacts and listed in tool manifest requested/generated files, not in the
  standard `generated_artifacts` enum.
- Synthetic fixtures are the test oracle; real self-use output is verification
  evidence.

### Integration Points

- Add `standards/review-disposition/README.md` and schema files.
- Add fixture disposition files under `test/fixtures/review-packet-rollup/` or
  a focused `test/fixtures/review-disposition/` directory.
- Add a shared fingerprint helper that rollup/disposition tests can use.
- Extend `review-packet-rollup` to optionally load disposition files and emit a
  disposition index without mutating input packets.
- Update registry/docs/changelog only after schema and consumer behavior are
  validated.

</code_context>

<specifics>
## Specific Ideas

- Prefer artifact names `REVIEW-DISPOSITIONS.json` for human-authored sidecar
  review metadata and `DISPOSITION-INDEX.json` for consumer join output.
- Prefer fingerprint ids shaped like `fp.<sha256>` over reusing finding ids.
- Treat `accepted_historical_noise` as a bridge until Phase 16 current/history
  scope reduces old planning reference noise mechanically.
- Keep `REVIEW-DASHBOARD.json` optional for Phase 15; do it only if the core
  schema/join work stays small.

</specifics>

<deferred>
## Deferred Ideas

- Ledger `--scope current|planning|history|all` and `--since-manifest` belong
  to Phase 16.
- Shared `--format json`, `--quiet`, and `--fail-on` migration belongs to
  Phase 17.
- `ai-workspace-kit` LLM instruction compatibility belongs to Phase 18.
- Portfolio real project scanning belongs to the future `PORTFOLIO-SCAN-01`
  milestone candidate after v2.1 foundations exist.
- Do not add semantic prioritization, automatic safe-ignore, source finding
  deletion, gate approval, merge decisions, roadmap mutation, package installs,
  or target command execution.

</deferred>

---

*Phase: 15-Review Disposition Model*
*Context gathered: 2026-05-08*
