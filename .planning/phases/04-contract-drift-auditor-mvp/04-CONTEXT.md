# Phase 4: Contract Drift Auditor MVP - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 ships the first external AI Tools auditor: a read-only
`contract-drift-auditor` CLI that runs with explicit
`--project <path> --out <dir>`, checks whether assistant contracts match local
project reality, and emits the shared review packet artifacts.

This phase also builds the shared packet renderer required by
`contract-drift-auditor` so `REVIEW-SUMMARY.json`, `EVIDENCE.json`,
`FINDINGS.md`, `RECOMMENDED-ACTIONS.md`, and CLI status are projections of one
packet model.

This phase does not implement auto-fix mode, automatic cross-repo integration,
project context ledger, phase forensics, gate-linter, cross-repo compatibility
checker, adoption/bootstrap contracts, adapter generation, generated-contract
review routing, or any `ai-workspace-kit` runtime dependency.

## Gate Resolution

- **Discuss Mode Gate**
  - Mode: Trusted Self-Questioning
  - Selected by: user
  - Approval source: user replied `2` after the gate was explicitly presented.
  - Evidence: local `discuss-mode` gate was read from
    `.planning/gates/registry.json`; `workflow.discuss_mode` was treated as
    routing only, not approval evidence.
  - Cycle limits or skip reason: trusted self-questioning was capped to five
    implementation-decision passes: phase boundary, drift-check scope, packet
    renderer scope, tandem/cross-repo boundaries, and fixture/test evidence.
- **Cross-Repo Incoming Review Gate**
  - Request reviewed:
    `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
  - Decision status: planned for Phase 4.
  - Decision artifact:
    `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
  - Compatibility notes: this accepts the external auditor as AI Tools-owned
    work while keeping `ai-workspace-kit` an optional consumer of review packet
    output, not a dependency or automation host.
- **AI Tools Self-Use Gate**
  - Capability: `contract-drift-auditor` and shared packet renderer.
  - Maturity: planned, not implemented or validated.
  - Run or skip reason: skip; no validated matching AI Tools auditor exists yet
    for discuss-stage self-use.
  - Evidence summary: `AGENTS.md` self-use matrix lists the auditor and renderer
    as planned Phase 04 capabilities.
- **Git Baseline Gate**
  - Status short: clean before Phase 4 context artifacts were created.
  - Classification: no baseline noise observed; subsequent changes are active
    Phase 4 discussion artifacts.
  - Decision or skip reason: cleanliness is safe to use as discuss-stage
    evidence for this context.
- **Upstream Freshness Gate**
  - Resolution: not run for discuss; mandatory before `$gsd-plan-phase 4`.
  - Reason: registry stages require this gate at research/plan/replan, and
    Phase 4 planning depends on current `ai-workspace-kit` boundaries.

</domain>

<decisions>
## Implementation Decisions

### Auditor Shape

- **D-01:** Phase 4 must produce a runnable review-only CLI named
  `contract-drift-auditor` with explicit `--project <path>` and
  `--out <dir>` arguments.
- **D-02:** The CLI must reject report output inside the audited target project
  for target-project audits, using the existing output path guard behavior.
- **D-03:** The auditor must not install dependencies, execute target project
  commands as proof, mutate target files, copy `.planning` state, or auto-fix
  target projects.
- **D-04:** The auditor may inspect this repository itself only when explicitly
  pointed at it, and generated review output must still be isolated from the
  audited target unless a future ignored review-output location is deliberately
  designed.

### Drift Check Scope

- **D-05:** MVP drift checks must be deterministic and evidence-backed, not
  LLM-only judgments.
- **D-06:** MVP must check referenced files and source layers from assistant
  contracts and planning artifacts, including missing local paths.
- **D-07:** MVP must check referenced commands against local evidence such as
  package scripts and documented command sources. Command discovery is evidence
  that a command exists; it is not permission approval.
- **D-08:** MVP must check permissions or workflow guidance that references
  absent tools or package managers. Conflicting or incomplete evidence should
  produce human-review findings rather than broad allow/deny assumptions.
- **D-09:** MVP must check referenced skills for existence and a readable
  `SKILL.md` when the target uses project-local skill references.
- **D-10:** MVP must report profile/source-layer facts as `unknown`, `stale`, or
  `unresolved` when local evidence is insufficient. It must not invent missing
  project facts.
- **D-11:** Generated AI Tools and `ai-workspace-kit` review packets inside the
  target tree should be ignored as current contract evidence by default, using
  the existing generated packet marker policy.

### Packet Renderer

- **D-12:** Build a shared packet renderer before or alongside the auditor
  checks. The renderer is part of Phase 4 because `RENDER-01` is a Phase 4
  requirement, not a later cleanup.
- **D-13:** `REVIEW-SUMMARY.json` remains the machine source of truth.
  `FINDINGS.md`, `RECOMMENDED-ACTIONS.md`, `EVIDENCE.json`, and CLI status must
  be generated from the same packet model so counts and statuses cannot drift.
- **D-14:** JSON output must use canonical recursively sorted keys and trailing
  newline behavior already established in `shared/canonical-json.js`.
- **D-15:** Findings must cite evidence refs and recommended action refs that
  validate against the existing review packet schemas.

### Evidence and Secret Safety

- **D-16:** Evidence paths must be normalized relative paths with `/`
  separators. Absolute paths and Windows drive paths are not valid evidence
  paths.
- **D-17:** Readable evidence may use SHA-256 content hashes. Secret-like files
  must be path-only evidence with no content hash, copied content, or snippet.
- **D-18:** Evidence should stay narrow: cite files and lines/ranges where
  available, but avoid long source excerpts in reports.

### Boundary With ai-workspace-kit

- **D-19:** Accept the incoming `ai-workspace-kit` request for a read-only
  contract drift auditor as Phase 4 scope.
- **D-20:** `ai-workspace-kit` may recommend or consume the review packet, but
  the auditor must not become hidden adoption/bootstrap behavior inside
  `ai-workspace-kit`.
- **D-21:** Do not duplicate `ai-workspace-kit` adoption review, adapter
  generation, generated contract installation, permission policy ownership, or
  assistant contract bootstrap logic. AI Tools owns external evidence and
  packet-producing auditors.
- **D-22:** Cross-repo compatibility checking remains deferred to v2
  `XREPO-VALIDATOR-01`; Phase 4 should preserve protocol metadata but not build
  automatic cross-repo validation.

### Fixtures and Tests

- **D-23:** Reuse existing target fixtures for clean, mature, missing-command,
  stale-source-layer, secret-like-files, mixed-package-managers, and generated
  packet inside target scenarios.
- **D-24:** Add auditor-specific expected outputs outside fixture `input/`
  trees, and keep target mutation checks based on tree hashing.
- **D-25:** MVP test coverage must prove at least missing command detection,
  stale/missing source-layer detection, schema-valid packet output,
  deterministic output, target non-mutation, output isolation, and secret
  sentinel non-leakage.

### the agent's Discretion

The planner may choose exact module layout, parser structure, CLI argument
parser, finding IDs, severity mapping details, Markdown wording, and whether
the renderer lives under `shared/` or `standards/review-packet/` as long as the
shared renderer is reusable by future tools and the boundaries above remain
intact.

</decisions>

<specifics>
## Specific Ideas

- Keep focus on one small green read-only tool before ledger, forensics, UI, or
  integration harness work.
- Treat `contract-drift-auditor` as the first real consumer of the review packet
  standard and safety harness.
- The first useful run shape should be:
  `contract-drift-auditor --project <path> --out <dir>`.
- The first external integration target is human-reviewed packet consumption by
  `ai-workspace-kit` and GSD, not automatic execution.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 4 goal, success criteria, and plan outline.
- `.planning/REQUIREMENTS.md` - `RENDER-01`, `DRIFT-01` through `DRIFT-07`,
  and `TEST-04`.
- `.planning/PROJECT.md` - active constraints, out-of-scope boundaries, and key
  decisions.
- `.planning/STATE.md` - current phase focus and latest roadmap evolution.
- `AGENTS.md` - local workflow gates, self-use matrix, safety rules, and tandem
  boundary gate.
- `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md` - implementation order, drift auditor
  MVP checks, safety contract, packet shape, and test strategy.

### Review Packet and Renderer

- `standards/review-packet/README.md` - required artifacts, packet status,
  severity/confidence, shared rendering rule, and evidence refs.
- `standards/review-packet/CANONICAL-JSON.md` - deterministic JSON guidance.
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json` - packet-level
  schema.
- `standards/review-packet/schemas/FINDING.schema.json` - finding schema.
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json` - evidence ref
  schema and path-only secret constraints.
- `standards/review-packet/schemas/RECOMMENDED-ACTION.schema.json` -
  recommended action schema.
- `standards/review-packet/schemas/TOOL-MANIFEST.schema.json` - tool metadata
  schema.
- `standards/review-packet/examples/human-review/REVIEW-SUMMARY.json` -
  concrete schema-valid example with required decisions and actions.

### Auditor Scope and Cross-Repo Request

- `tools/contract-drift-auditor/SEED-IDEAS.md` - auditor purpose, inputs,
  outputs, MVP checks, integration boundary, safety rules, and first fixture.
- `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md` -
  incoming request accepted for Phase 4.
- `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md` -
  Phase 4 decision for the incoming request.
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` - non-automation
  and ownership boundaries for cross-repo work.

### Shared Safety and Fixtures

- `shared/canonical-json.js` - canonical JSON helper.
- `shared/path-guard.js` - output path isolation helper.
- `shared/file-walker.js` - deterministic project file walker.
- `shared/ignore-policy.js` - default ignore policy and generated packet
  detection.
- `shared/secret-policy.js` - path-only secret evidence helpers.
- `shared/tree-hash.js` - fixture mutation proof helper.
- `test/fixtures/targets/mature-ai-project/input/AGENTS.md` - mature target
  fixture with source layers, planning, nested package root, and skill.
- `test/fixtures/targets/missing-command/input/AGENTS.md` - missing command
  fixture.
- `test/fixtures/targets/stale-source-layer/input/AGENTS.md` - stale/missing
  source-layer fixture.
- `test/fixtures/targets/secret-like-files/input/README.md` - secret-safety
  fixture entry point.
- `test/fixtures/targets/generated-packet-inside-target/input/README.md` -
  generated packet ignore fixture entry point.
- `test/shared/safety-harness.test.js` - existing integrated safety proof to
  mirror for auditor fixture tests.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `shared/canonical-json.js`: ready for renderer JSON output and deterministic
  packet snapshots.
- `shared/path-guard.js`: ready to reject output paths inside audited target
  projects before report directories are created.
- `shared/file-walker.js` and `shared/ignore-policy.js`: ready for deterministic
  target scans that skip generated packet directories and nested
  `ai-workspace-kit` checkouts by default.
- `shared/secret-policy.js`: ready for normalized evidence paths and path-only
  secret evidence refs.
- `shared/tree-hash.js`: ready for no-mutation fixture assertions.
- `standards/review-packet/schemas/*`: existing strict schemas for summary,
  findings, evidence refs, recommended actions, and tool manifests.

### Established Patterns

- Tests use `node:test` and direct Node helpers, without a build step.
- JSON schemas are strict and use `additionalProperties: false`.
- Existing fixtures separate `input/` from expected/output concerns; committed
  fixture `input/` trees should not contain generated output.
- Markdown reports are projections; JSON remains the machine source of truth.

### Integration Points

- A CLI entry point should connect to shared safety helpers before doing any
  target scan or output write.
- The packet renderer should sit below the auditor so future tools can reuse it.
- The auditor should emit standard review packet artifacts only to `--out`.
- Cross-repo integration should be documentation and packet compatibility only,
  not automatic invocation of `ai-workspace-kit` or AI Tools from the other
  repository.

</code_context>

<deferred>
## Deferred Ideas

- Auto-fix mode and patch bundles - future explicit write-mode design.
- Cross-repo compatibility checker - v2 `XREPO-VALIDATOR-01`.
- Mechanical gate-linter - v2 `GATELINT-01`, evidence only.
- Project context ledger, phase forensics, runtime capability inspector, config
  validator, test quality auditor, UI regression comparator, and local
  integration harness - later tool phases after the first auditor is green.

</deferred>

---

*Phase: 04-contract-drift-auditor-mvp*
*Context gathered: 2026-05-07*
