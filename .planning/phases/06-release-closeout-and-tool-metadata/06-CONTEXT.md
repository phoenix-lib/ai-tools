---
phase: 6
name: Release Closeout and Tool Metadata
status: context-complete
created: "2026-05-07"
mode: trusted-self-questioning
requirements:
  - REL-05
  - REL-06
  - META-01
  - SELF-01
depends_on:
  - Phase 5
---

# Phase 6: Release Closeout and Tool Metadata - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 converts Phase 5 release hardening evidence into a clean v1 release
baseline. It should fix post-Phase-5 documentation drift, add representative
release packet fixtures, centralize tool metadata/protocol constants, and
document a portable safe self-audit invocation.

This phase must not start a new broad tool. Cross-repo validation belongs to
Phase 7, CLI ergonomics belong to Phase 8, tool registry and AGENTS slimming
belong to Phase 9, and mechanical gate linting belongs to Phase 10.
</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- Gate: `discuss-mode`
- Status: passed
- Resolution: Trusted Self-Questioning
- Selected by: user
- Approval source: user selected option `2` after a plain-text discuss-mode
  gate prompt.
- Evidence:
  - `.planning/gates/registry.json` records `discuss-mode` as a non-skippable
    discuss-stage gate.
  - `AGENTS.md` states `$gsd-discuss-phase` must resolve Manual Questions vs
    Trusted Self-Questioning before writing discuss artifacts.
  - `workflow.discuss_mode=discuss` is routing only and is not approval
    evidence.
- Cycle limits: five focused self-questioning passes.
- Passes performed:
  - release documentation drift after Phase 5 filtering;
  - release packet fixture shape and safety-blocked representation;
  - tool metadata/version source of truth;
  - safe self-audit invocation portability;
  - phase boundaries against Phase 7, Phase 8, Phase 9, and Phase 10.

### AI Tools Self-Use Gate

- Gate: `self-use`
- Status: passed with planning-stage follow-up.
- Capability considered: `contract-drift-auditor`
- Maturity: validated MVP with Phase 5 self-audit evidence.
- Resolution: do not rerun during discuss because no source implementation or
  release artifact changed during context gathering. Phase planning and
  verification should decide whether to rerun the auditor after docs,
  fixtures, metadata, and self-audit guidance are updated.
- Evidence:
  - `.planning/phases/05-integration-and-release-hardening/05-02-SUMMARY.md`
  - `.planning/phases/05-integration-and-release-hardening/05-VERIFICATION.md`
  - `docs/RELEASE-READINESS.md`
- Phase 6 implication: if self-audit is rerun, use an explicit caller-provided
  output directory outside the repository. Its findings remain evidence, not
  automatic release decisions.

### New Tool Intake and Placement Gate

- Gate: `new-tool-intake`
- Status: passed.
- Resolution: no new tool is introduced in Phase 6.
- Evidence:
  - Phase 6 requirements are release discipline and metadata requirements:
    `REL-05`, `REL-06`, `META-01`, and `SELF-01`.
  - `XREPO-VALIDATOR-01` remains Phase 7.
  - `CLI-01` and `CLI-02` remain Phase 8.
  - `REG-01` and `GOV-01` remain Phase 9.
  - `GATELINT-01` remains Phase 10.

### Cross-Repo Boundary Gate

- Gate: `cross-repo-outgoing`
- Status: passed.
- Resolution: no outgoing capability request is needed for Phase 6.
- Evidence:
  - Phase 6 improves AI Tools release artifacts and packet metadata.
  - It must preserve optional `ai-workspace-kit` consumption, not implement
    kit-owned adoption/bootstrap contracts, adapter generation, generated
    contract policy, or assistant-led semantic gate decisions.
- Compatibility note: `CHANGELOG.md` should capture whether Phase 6 changes
  packet semantics, metadata fields, generated artifacts, or self-audit
  expectations that downstream `ai-workspace-kit` freshness checks should read.

### Git Baseline Gate

- Gate: `git-baseline`
- Status: passed at discuss start.
- Resolution: baseline was clean before Phase 6 discuss artifacts were written.
- Evidence: `git status --short` returned no active changes.

## Implementation Decisions

### Release Docs

- **D-01:** Update `tools/contract-drift-auditor/README.md` so current
  limitations no longer say historical phase folders dominate self-audit after
  Phase 5 filtering.
- **D-02:** Keep the limitation honest: the auditor still uses conservative
  text parsing and may surface low-severity caveats from optional, example, or
  shorthand references in current contract/planning docs.
- **D-03:** Update `docs/RELEASE-READINESS.md` so self-audit examples are
  portable. The doc may mention the historical Phase 5 evidence path as past
  evidence, but the reusable command pattern must require a caller-provided
  external `--out <dir>` and must not encode a machine-local path as the
  recommended command.

### Release Packet Fixtures

- **D-04:** Add release-facing `contract-drift-auditor` packet fixtures for
  `pass`, `human_review_required`, and safety-blocked outcomes. These should
  include the standard four artifacts: `REVIEW-SUMMARY.json`, `EVIDENCE.json`,
  `FINDINGS.md`, and `RECOMMENDED-ACTIONS.md`.
- **D-05:** Prefer a tool-specific examples location that downstream humans can
  inspect, such as `tools/contract-drift-auditor/examples/`, with tests
  validating schema shape and artifact completeness.
- **D-06:** A safety-blocked packet example may be synthetic if the real CLI
  rejects unsafe output paths before writing any packet. If synthetic, label it
  clearly as a packet-shape example and separately keep or add tests proving
  unsafe target-local `--out` creates no output.
- **D-07:** The shared packet renderer should generate Markdown projections
  from the same model used for JSON, so example counts and status cannot drift.

### Tool Metadata and Versions

- **D-08:** Add a single code-owned metadata source for packet constants and
  tool metadata, likely `shared/tool-metadata.js`, rather than repeating
  `"review-packet/v1"`, artifact names, tool name, policy identifiers, and
  package version lookup across files.
- **D-09:** `package.json` remains the package version source. Metadata helpers
  should read or expose that version without copying `0.1.0` into generated
  packets, examples, and tests independently.
- **D-10:** `tools/contract-drift-auditor/index.js`,
  `shared/review-packet-renderer.js`, schema/packet tests, and release
  examples should consume the shared metadata where practical.

### Safe Self-Audit Invocation

- **D-11:** Do not add a machine-local self-audit script that writes to
  `C:\Users\...` or another developer-specific path.
- **D-12:** If a package script is added, it should only provide the stable
  prefix and require the caller to pass `--out`, for example:
  `npm run audit:self -- --out <external-dir>`. Otherwise, keep the documented
  direct command:
  `node tools/contract-drift-auditor/cli.js --project . --out <external-dir>`.
- **D-13:** Documentation must say `--out` has to be outside the audited
  repository and output is review evidence only.

### Planning Order

- **D-14:** Start with release docs cleanup (`06-01`) so Phase 5 evidence no
  longer contradicts the README.
- **D-15:** `06-02` and `06-03` may be ordered by dependency during planning:
  if fixtures need shared metadata constants first, do metadata before fixture
  rendering even though the roadmap lists them in the same wave.
- **D-16:** Verification should include focused docs/schema tests plus full
  `npm.cmd test`.

### the agent's Discretion

The planner may choose exact file names for tool-specific release examples and
the metadata helper, as long as the choices are discoverable, validated by
tests, and do not create duplicate metadata sources.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope

- `.planning/ROADMAP.md` - Phase 6 goal, success criteria, dependencies, and
  v2 sequencing.
- `.planning/REQUIREMENTS.md` - `REL-05`, `REL-06`, `META-01`, and `SELF-01`.
- `.planning/PROJECT.md` - active project constraints, self-use gate,
  changelog gate, upstream freshness gate, and deferred v2 tools.
- `.planning/STATE.md` - current milestone and focus.

### Phase 5 Evidence

- `.planning/phases/05-integration-and-release-hardening/05-CONTEXT.md` -
  release hardening boundary and self-audit noise rationale.
- `.planning/phases/05-integration-and-release-hardening/05-02-SUMMARY.md` -
  self-audit evidence, 57 low findings, and manual gate-review result.
- `.planning/phases/05-integration-and-release-hardening/05-VERIFICATION.md` -
  passed release readiness verification and residual risks.
- `docs/RELEASE-READINESS.md` - current release checklist, self-use evidence,
  manual gate review, and deferred v2 work.
- `CHANGELOG.md` - downstream freshness evidence and compatibility impact.

### Auditor and Packet Code

- `tools/contract-drift-auditor/README.md` - usage, safety, output semantics,
  current limitations, and `ai-workspace-kit` compatibility.
- `tools/contract-drift-auditor/index.js` - current inline package version,
  schema version, artifact list, and tool manifest generation.
- `shared/review-packet-renderer.js` - required artifacts and shared JSON /
  Markdown rendering.
- `shared/canonical-json.js` - deterministic JSON output.
- `shared/path-guard.js` - output directory safety guard.
- `shared/ignore-policy.js` - generated packet and nested checkout ignores.
- `shared/secret-policy.js` - path-only secret evidence policy.

### Packet Standards and Tests

- `standards/review-packet/README.md` - status, severity, confidence, evidence
  refs, tool manifest, and shared summary rendering rules.
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json` - packet summary
  schema.
- `standards/review-packet/schemas/TOOL-MANIFEST.schema.json` - tool manifest
  schema.
- `standards/review-packet/examples/pass/REVIEW-SUMMARY.json` - generic pass
  packet example.
- `standards/review-packet/examples/human-review/REVIEW-SUMMARY.json` - generic
  human-review packet example.
- `test/planning/release-docs.test.js` - existing release docs validation
  pattern.
- `test/contract-drift-auditor/schema-output.test.js` - generated auditor
  packet schema validation pattern.
- `test/shared/review-packet-renderer.test.js` - renderer count and projection
  validation pattern.
- `package.json` - package version, bin entry, and scripts.

### Gate and Boundary Contracts

- `AGENTS.md` - local gates, self-use, changelog, new-tool intake, upstream
  freshness, and tandem boundary rules.
- `.planning/gates/registry.json` - machine-readable gate registry.
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` - cross-repo
  request and decision playbook.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `shared/review-packet-renderer.js`: already renders all required artifacts
  from one packet model and validates counts before JSON/Markdown output.
- `tools/contract-drift-auditor/index.js`: already builds the packet summary
  and tool manifest, but currently hardcodes review packet schema strings and
  owns package version lookup locally.
- `standards/review-packet/examples/`: already contains generic packet examples;
  Phase 6 needs tool-specific release examples, not another generic standard.
- `test/planning/release-docs.test.js`: existing pattern for validating required
  release documentation phrases.
- `test/contract-drift-auditor/schema-output.test.js`: existing pattern for
  generating an auditor packet and validating it against schemas.

### Established Patterns

- Generated JSON should be canonical and deterministic.
- Packet Markdown should be projection output, not independently edited counts.
- Output directories must be outside audited targets.
- Findings and tool output are evidence; the assistant or human reviewer keeps
  final decision authority.
- `ai-workspace-kit` compatibility is optional and packet-based.

### Integration Points

- Metadata helper should connect to the auditor manifest, shared renderer
  constants, tests, and release examples.
- Release docs tests should verify the updated limitation wording and portable
  self-audit command.
- Fixture validation should verify artifact completeness and schema validity for
  all representative release packet examples.
</code_context>

<specifics>
## Specific Ideas

The release packet fixtures should show what consumers can expect from the
actual `contract-drift-auditor`, not only the abstract packet standard.

The safety-blocked example needs special care: the real safety behavior should
reject unsafe output paths before writing files. If a blocked packet example is
committed, make it explicit that it demonstrates packet shape for blocked
review output and is not the byproduct of allowing unsafe output.
</specifics>

<deferred>
## Deferred Ideas

- Cross-repo compatibility checker remains Phase 7.
- CLI `--format json`, `--quiet`, `--fail-on`, and stable exit codes remain
  Phase 8.
- Tool registry and detailed gate policy slimming remain Phase 9.
- Mechanical gate linter remains Phase 10 and evidence-only.
- Ledger, forensics, config, skill, test quality, UI, and integration tools
  remain deferred to Phase 11 selection review.
</deferred>

---

*Phase: 6-Release Closeout and Tool Metadata*
*Context gathered: 2026-05-07*
