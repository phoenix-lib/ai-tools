# Phase 1: Review Packet Standard - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 defines the portable review packet contract that every future `ai-tools`
auditor will emit. It covers schemas, status/severity/confidence taxonomy,
evidence references, recommended actions, tool metadata, canonical JSON
guidance, example packets, and schema validation tests.

This phase does not implement the shared file walker, secret policy, fixture
harness, or `contract-drift-auditor` behavior. Those are Phase 2 and Phase 4.

</domain>

<decisions>
## Discuss Mode

Mode: Trusted Self-Questioning
Approved by: user

Cycles run:

- Packet artifact set: 5
- Schema boundaries: 5
- Status model: 5
- Evidence semantics: 5
- ai-workspace-kit compatibility: 4

## Implementation Decisions

### Packet Artifact Set

- **D-01:** V1 mandatory packet artifacts are `REVIEW-SUMMARY.json`,
  `FINDINGS.md`, `EVIDENCE.json`, and `RECOMMENDED-ACTIONS.md`.
- **D-02:** `REVIEW-SUMMARY.json` is the top-level machine entrypoint and must
  include packet status, counts, finding references or embedded findings,
  tool metadata, target metadata, generated artifact list, and schema version.
- **D-03:** `FINDINGS.md` and `RECOMMENDED-ACTIONS.md` are human projections.
  They must be rendered from the same shared summary/finding data as JSON.
- **D-04:** `EVIDENCE.json` is the machine evidence index. It must avoid long
  copied source content and must support path-only evidence for secret-like
  files.
- **D-05:** `RISK-MATRIX.md` and `RECOMMENDED-PATCHES.md` are deferred. They can
  be added later as projections or fix-mode artifacts after real demand exists.

### Schema Boundaries

- **D-06:** Use focused schemas instead of one monolithic schema:
  `REVIEW-SUMMARY.schema.json`, `FINDING.schema.json`,
  `EVIDENCE-REF.schema.json`, `RECOMMENDED-ACTION.schema.json`, and
  `TOOL-MANIFEST.schema.json`.
- **D-07:** `REVIEW-SUMMARY.schema.json` owns packet-level fields: status,
  counts, artifact paths, schema version, target project facts, tool metadata,
  blockers, required decisions, rejected assumptions, preserved stricter local
  rules, and generated files.
- **D-08:** `FINDING.schema.json` owns individual issue fields: stable id,
  severity, title, summary, evidence refs, recommended action refs, confidence,
  status contribution, and source check id.
- **D-09:** `EVIDENCE-REF.schema.json` owns evidence identity and proof:
  normalized path, evidence type, readable content hash or path-only marker,
  optional line or range, reason, confidence, and stale/unknown markers.
- **D-10:** `RECOMMENDED-ACTION.schema.json` owns action guidance, not patches:
  action id, summary, rationale, target owner, suggested command or file when
  applicable, and whether human review is required.
- **D-11:** `TOOL-MANIFEST.schema.json` owns tool identity, version, schema
  versions, input args, safety profile, read/write behavior, policy hashes, and
  run timestamp.

### Status Model

- **D-12:** V1 packet statuses are `pass`, `info`, `human_review_required`, and
  `blocked`.
- **D-13:** Status is packet-level outcome; severity is finding-level impact.
  Do not collapse severity into status.
- **D-14:** V1 severities are `critical`, `high`, `medium`, `low`, and `info`.
- **D-15:** V1 confidence values are `verified`, `inferred`, `unknown`, and
  `stale`.
- **D-16:** `blocked` is reserved for conditions that prevent safe use of the
  packet or require resolution before proceeding. Examples: unreadable required
  target evidence, schema-invalid generated packet, or critical unresolved
  contradiction.
- **D-17:** `human_review_required` is for findings or decisions where evidence
  exists but a human must choose. Examples: conflicting package managers,
  preserved stricter local rules, or rejected assumptions.
- **D-18:** CLI output, Markdown status, and JSON status must be rendered from
  one shared summary object. Counts must not be recomputed independently per
  artifact.

### Evidence Semantics

- **D-19:** Evidence paths are normalized relative paths using `/`, not absolute
  local paths, unless the target project path itself is required in metadata.
- **D-20:** Readable evidence uses `sha256` content hashes. Canonical JSON uses
  recursively sorted keys and a trailing newline before hashing.
- **D-21:** Secret-like files use path-only evidence. The evidence ref must mark
  the item as `path_only: true` or equivalent and must not contain content
  hashes derived from secret contents.
- **D-22:** Line references are optional but preferred when available. V1 may
  support `line`; ranges can be added if cheap but are not required.
- **D-23:** Every evidence ref needs a short `reason` explaining why the source
  was cited.
- **D-24:** Unknown or stale facts must be explicit in evidence/finding data.
  Agents and CI must not infer missing values from prose.
- **D-25:** Evidence snippets are not part of V1. If later added, they must have
  strict length limits and never apply to secret-like files.

### ai-workspace-kit Compatibility

- **D-26:** Mirror `ai-workspace-kit` concepts, not its exact manifest as the
  full packet format. AI Tools packets should be concept-compatible but focused
  on auditor findings.
- **D-27:** Carry forward these compatible concepts: source commit when
  available, tool version, generated files, policy hash, requested outputs,
  shared review summary, evidence files, blockers, required decisions,
  rejected assumptions, and preserved stricter local rules.
- **D-28:** Do not make `ai-workspace-kit` a runtime dependency of V1 auditors.
  It is a reference and optional integration target.
- **D-29:** Names should use underscore-safe machine values where possible,
  e.g. `human_review_required`, while Markdown may display human labels.
- **D-30:** Adapter-specific outputs are out of scope for Phase 1. The packet
  standard may support `requestedOutputs`, but Codex/Claude generation behavior
  remains owned by `ai-workspace-kit`.

### the agent's Discretion

The planner may choose exact JSON Schema composition mechanics, file naming
case for schema files, test helper names, and whether example packets live under
`standards/review-packet/examples/` or a nearby fixtures directory, as long as
the decisions above remain true.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope

- `.planning/PROJECT.md` - Project purpose, core value, constraints, and active
  requirements.
- `.planning/REQUIREMENTS.md` - Phase 1 requirement IDs and traceability.
- `.planning/ROADMAP.md` - Phase 1 goal, success criteria, and plan outline.
- `.planning/research/SUMMARY.md` - Research findings and roadmap implications.

### Local Standards

- `AI-AGENT-IMPLEMENTATION-GUIDE.md` - Main implementation guide and adopted
  principles from `ai-workspace-kit`.
- `AGENTS.md` - Local assistant contract and workflow rules.
- `ai-review-packet-standard/README.md` - Product seed for this phase.

### ai-workspace-kit Reference

- `.external/ai-workspace-kit/ADAPTER-GENERATION.md` - Review packet contract,
  manifest concepts, permission evidence, and inspection reliability rules.
- `.external/ai-workspace-kit/schemas/ai-workspace.manifest.schema.json` -
  Reference manifest schema concepts to adapt, not clone blindly.
- `.external/ai-workspace-kit/scripts/lib/canonical-json.js` - Reference
  canonical JSON implementation.
- `.external/ai-workspace-kit/scripts/lib/review.js` - Reference shared summary
  rendering pattern.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `.external/ai-workspace-kit/scripts/lib/canonical-json.js`: reusable pattern
  for recursively sorted JSON and trailing newline behavior.
- `.external/ai-workspace-kit/scripts/lib/review.js`: reusable pattern for a
  shared review summary rendered into multiple human/machine artifacts.
- `.external/ai-workspace-kit/schemas/ai-workspace.manifest.schema.json`:
  reference for strict `additionalProperties: false`, required metadata fields,
  and manifest-style generated file/evidence tracking.

### Established Patterns

- Current repository is documentation-first and seed-driven; Phase 1 should add
  standards before tool implementation.
- `ai-workspace-kit` separates core contract, adapter mechanics, project
  profile, generated local contracts, and optional tools. AI Tools should mirror
  that boundary by separating standards, shared helpers, and tools.
- The local workflow prefers review-only output, explicit unknowns, deterministic
  artifacts, and no target mutation.

### Integration Points

- Phase 1 output feeds Phase 2 safety helpers and Phase 4
  `contract-drift-auditor`.
- GSD integration should consume JSON packet summaries rather than parse
  Markdown prose.
- `ai-workspace-kit` compatibility should be documented as optional and
  packet-based.

</code_context>

<specifics>
## Specific Ideas

- Use the four required artifact names from `AI-AGENT-IMPLEMENTATION-GUIDE.md`
  as the V1 base.
- Keep `RISK-MATRIX.md` and patch-oriented outputs deferred until real demand or
  fix-mode design.
- Prefer concept compatibility with `ai-workspace-kit` over copying its exact
  adoption manifest into every auditor packet.

</specifics>

<deferred>
## Deferred Ideas

- `RISK-MATRIX.md` as a future human projection if reviewers ask for it.
- `RECOMMENDED-PATCHES.md` or patch bundles as part of a future explicit
  `--fix` mode.
- Per-tool extension schemas after the common packet contract and first auditor
  are proven.
- Adapter-specific contract generation remains in `ai-workspace-kit`, not in
  Phase 1.

</deferred>

---

*Phase: 1-Review Packet Standard*
*Context gathered: 2026-05-07*
