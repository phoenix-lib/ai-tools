---
phase: 10
name: Evidence-Only Gate Linter Seed MVP
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - GATELINT-01
depends_on:
  - Phase 9 Tool Registry and Workflow Gate Slimming
---

# Phase 10: Evidence-Only Gate Linter Seed MVP - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 10 promotes `GATELINT-01` from planned seed to either a minimal
read-only `gates-scan` CLI or an explicit deferred decision if the boundary
review finds a blocker.

The phase should turn repeated gate misses into mechanical evidence: registry
shape problems, missing `Gate Resolution` sections, invalid skip handling,
stale paths, unresolved references, missing observable outputs, and missing
changelog/docs impact after gate or workflow changes.

It must not implement assistant-led semantic gate review, adoption/bootstrap
contracts, generated-contract policy, permission policy, automatic phase
creation, hidden GSD automation, or any runtime dependency on
`ai-workspace-kit`.
</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- Gate: `discuss-mode`
- Status: resolved
- Resolution: Trusted Self-Questioning
- Selected by: user
- Approval source: user replied `2` after the Phase 10 discuss-mode prompt on
  2026-05-08.
- Evidence:
  - `.planning/gates/registry.json` records `discuss-mode` as a non-skippable
    discuss-stage gate.
  - `AGENTS.md` requires resolving Manual Questions vs Trusted
    Self-Questioning before gray-area analysis, checkpoint writes,
    `*-CONTEXT.md`, or `*-DISCUSSION-LOG.md`.
  - `workflow.discuss_mode` was treated as routing only, not approval evidence.
- Cycle limits: one focused self-questioning pass over ownership boundary,
  MVP checks, CLI/output shape, fixtures, self-use policy, and deferral
  fallback.
- Skip reason: not skipped.

### Cross-Repo Incoming Review Gate

- Gate: `cross-repo-incoming`
- Status: resolved
- Resolution: existing incoming request
  `REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review` supports
  Phase 10 but does not auto-create or auto-scope the tool.
- Evidence:
  - `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - `.planning/research/GATES-SCAN-ROADMAP-REVIEW.md`
- Decision: Phase 10 may implement mechanical gate-linter support as an
  AI Tools-owned external evidence tool. It must preserve the decision that
  gate review remains assistant-owned semantic review.

### AI Tools Self-Use Gate

- Gate: `self-use`
- Status: resolved with planning/execution follow-up.
- Capabilities considered:
  - `contract-drift-auditor`: validated; relevant after source-layer,
    `AGENTS.md`, workflow gate docs, or CLI docs changes.
  - `cross-repo-compatibility-checker`: validated; relevant before planning
    because this phase depends on kit gate contracts and interop boundaries.
  - `gates-scan`: planned; not available during discuss.
- Resolution: do not run self-use tools during discuss because no Phase 10
  artifacts existed yet. Phase 10 planning should run the cross-repo checker as
  evidence after the upstream freshness check. Phase 10 execution should run
  `contract-drift-auditor`, `cross-repo-compatibility-checker` when interop
  docs change, and `gates-scan` on this repo if the CLI is implemented.
- Evidence summary: `tools/registry.json` marks the checker validated and
  `gates-scan` planned for Phase 10.

### New Tool Intake and Placement Gate

- Gate: `new-tool-intake`
- Status: resolved
- Owner: AI Tools.
- Destination: `tools/gates-scan/`.
- Maturity: planned at discuss start; can become implemented/validated only
  after Phase 10 execution and verification.
- Activation stage: verify, phase-boundary, maintenance, and workflow gate
  changes.
- Outputs: standard review packet artifacts:
  `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`,
  `RECOMMENDED-ACTIONS.md`.
- Non-goals:
  - do not make semantic adoption, revision, or rejection decisions;
  - do not auto-run during GSD;
  - do not create phases;
  - do not install, run, fetch, or depend on `ai-workspace-kit`;
  - do not duplicate kit-owned assistant-led gate-review policy.
- Evidence: `tools/registry.json`,
  `.planning/research/GATES-SCAN-ROADMAP-REVIEW.md`, and
  `.external/ai-workspace-kit/AI-WORKSPACE-CONTRACT.json`.

### Git Baseline Gate

- Gate: `git-baseline`
- Status: resolved
- Evidence: `git status --short` returned clean before Phase 10 artifacts were
  written.
- Classification: no baseline noise or active work was present at discuss
  start.

## Trusted Self-Questioning Results

### What should be built?

Default planning direction: implement a small `gates-scan` MVP now unless the
Phase 10 research/boundary review finds a concrete blocker.

The roadmap already delayed `GATELINT-01` until the cross-repo checker and tool
registry existed. Both prerequisites are now complete, and repeated gate misses
provide enough demand. A pure deferred decision should be used only if the
planner discovers that the minimum mechanical checks cannot be kept within the
AI Tools boundary.

### What is the CLI contract?

Use the user-facing CLI name `gates-scan`.

Preferred invocation:

```text
gates-scan --project <path> --out <dir>
```

The CLI should be read-only, require explicit inputs, and reject `--out` inside
the scanned project. It should not infer a sibling `ai-workspace-kit` checkout
or run upstream tools. Optional future flags are acceptable only if they do not
change the evidence-only default.

### What should the MVP check?

The first cut should check mechanical facts that can be proven from local files:

- gate registry exists and is valid JSON;
- duplicate gate IDs;
- required gate fields are present;
- gates declare observable outputs;
- ai-tools snake_case to kit camelCase mapping exists when interop is claimed;
- stage aliases include `verification -> verify`, `release -> phase-boundary`,
  and `replan -> plan`;
- required `## Gate Resolution` sections exist in completed phase artifacts
  where registered gates apply;
- non-skippable gates are not marked skipped;
- skipped gates include reasons when required;
- `workflow.discuss_mode` is not used as approval evidence for
  `discuss-mode`;
- source-layer paths, required artifact paths, and referenced docs exist when
  they are literal local paths;
- changelog/docs impact is present after gate, schema, workflow, or public CLI
  behavior changes;
- unresolved references and conflicting required/forbidden wording are reported
  when they can be detected deterministically.

The planner may split this into two implementation waves if needed, but the
MVP should prefer small deterministic checks over broad prose interpretation.

### What must remain semantic and assistant-owned?

`gates-scan` may report evidence that a gate block is missing, skipped
incorrectly, stale, duplicated, or unobservable. It must not decide whether a
gate should be adopted, revised, rejected, superseded, or converted into a
cross-repo request.

The packet can recommend human/assistant review, but final gate relevance and
ownership decisions stay with the assistant and project workflow.

### How should findings map to packet status?

Use the existing review packet standard.

- `pass`: no mechanical findings.
- `info`: advisory observations that do not affect required gate evidence.
- `human_review_required`: missing gate blocks, stale paths, unresolved refs,
  invalid skip handling, missing changelog/docs impact, or interop mapping
  drift.
- `blocked`: unsafe output path, unreadable project root, invalid required JSON
  that prevents reliable scanning, or malformed inputs that prevent producing
  a trustworthy packet.

Do not make default shell failure automatic. If fail policy is added later, it
should follow the Phase 8 opt-in pattern.

### What fixtures are needed?

Use synthetic target projects under `test/fixtures/gates-scan/` rather than
real phase history as primary tests. Minimum fixture cases:

- compatible project with valid registry and resolved gates;
- duplicate gate IDs;
- missing `Gate Resolution` in a completed phase artifact;
- non-skippable gate marked skipped;
- skipped gate missing required reason;
- `workflow.discuss_mode` used as false approval evidence;
- stale required artifact or source-layer path;
- gate without observable outputs;
- missing changelog/docs impact after gate/schema/workflow changes;
- interop mapping or stage alias drift.

Run the implemented scanner against the real AI Tools repository during
verification as self-use evidence, but do not make local historical artifacts
the only test oracle.

### How should Phase 10 update governance?

If the CLI is implemented:

- add `gates-scan` to `package.json` bin/scripts;
- add or update `tools/gates-scan/README.md`;
- update `tools/registry.json` from planned to implemented or validated only
  when tests and self-use evidence justify it;
- update `CHANGELOG.md`;
- record self-use packet output in verification.

If the CLI is deferred:

- create a phase-local decision artifact explaining the blocker;
- keep `tools/registry.json` as planned or deferred with evidence;
- document the exact evidence needed to promote it later.

## Implementation Decisions

### D-01: Promotion Default

Plan Phase 10 to implement a minimal `gates-scan` CLI unless research finds a
specific boundary or feasibility blocker. Do not re-defer by default.

### D-02: Tool Ownership

Classify `gates-scan` as AI Tools-owned external mechanical evidence tooling.
Do not copy kit's assistant-led `gate-review` ownership or adoption/bootstrap
contracts.

### D-03: CLI and Output Shape

Use `gates-scan --project <path> --out <dir>` and emit the standard packet
artifacts from the shared packet renderer. Reject output inside the scanned
project.

### D-04: Evidence-Only Boundary

Findings are evidence only. `gates-scan` must not approve, reject, revise, or
auto-create gate work. It can recommend assistant review.

### D-05: MVP Check Set

Prioritize deterministic checks over prose-heavy interpretation: registry
validity, duplicate IDs, required fields, observable outputs, interop mapping,
stage aliases, phase artifact gate resolution, skip semantics,
`workflow.discuss_mode` misuse, stale literal paths, unresolved refs, and
changelog/docs impact.

### D-06: Fixture Strategy

Use synthetic fixtures for broken cases and real repo self-use only as
verification evidence. Do not copy `.planning` state from `ai-workspace-kit`.

### D-07: Registry Update Rule

Update `tools/registry.json` only after the implementation state is true:
planned at the start, implemented after CLI/docs/tests exist, validated after
full tests and self-use evidence pass.

### D-08: Upstream Boundary Review

Before planning, run the existing `upstream-freshness` / Kit Update Self-Check
gate because Phase 10 depends on kit gate templates and boundary rules. Use
the cross-repo checker output as evidence, not as the final decision.

### the agent's Discretion

The planner may choose exact module names, check IDs, fixture filenames, and
whether to implement all MVP checks in one plan or split them across the two
roadmap plans. Keep the scope small, deterministic, and packet-compatible.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope

- `.planning/ROADMAP.md` - Phase 10 goal, dependencies, success criteria, and
  two planned work items.
- `.planning/REQUIREMENTS.md` - `GATELINT-01` requirement.
- `.planning/PROJECT.md` - active tandem boundary, self-use, changelog, and
  new-tool intake requirements.
- `.planning/STATE.md` - current milestone position and Phase 10 focus.
- `.planning/phases/09-tool-registry-and-workflow-gate-slimming/09-CONTEXT.md`
  - Phase 9 registry decisions and explicit Phase 10 boundary.

### Gate and Tool Governance

- `AGENTS.md` - root assistant contract, discuss-mode preflight, and source
  layer links.
- `.planning/gates/registry.json` - local machine-readable gate registry.
- `.planning/gates/WORKFLOW-GATES.md` - detailed local gate procedures and
  evidence expectations.
- `tools/registry.json` - tool maturity, self-use policy, `gates-scan`
  planned entry, and non-goals.
- `.planning/research/GATES-SCAN-ROADMAP-REVIEW.md` - prior `gates-scan`
  scope and ordering recommendation.
- `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md` - latest upstream
  kit gate/interop findings and Phase 9 freshness record.

### Cross-Repo Boundary

- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` - request/decision
  protocol and non-automation rules.
- `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - incoming request that seeded changelog and gate-linter support.
- `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - decision that accepted process requirements and deferred mechanical
  gate-linter to v2.
- `.external/ai-workspace-kit/AI-WORKSPACE-CONTRACT.json` - confirms gate
  linting is AI Tools-owned external evidence.
- `.external/ai-workspace-kit/templates/GATE-REGISTRY.json` - upstream
  camelCase gate registry expectations and kit-owned `gate-review` boundary.
- `.external/ai-workspace-kit/templates/GATE-RESOLUTION.md` - upstream
  observable gate output template and evidence-only mechanical tool rule.

### Implementation Patterns

- `package.json` - current CLI bin/script pattern.
- `shared/review-packet-renderer.js` - packet rendering from one summary model.
- `shared/tool-metadata.js` - shared packet artifact names and existing tool
  metadata constants.
- `shared/path-guard.js` - output path isolation pattern.
- `shared/file-walker.js` and `shared/ignore-policy.js` - read-only project
  walking and ignore behavior.
- `tools/cross-repo-compatibility-checker/README.md` - closest current
  read-only validator CLI pattern.
- `tools/cross-repo-compatibility-checker/cli.js` - explicit input/output CLI
  pattern.
- `test/planning/workflow-gates.test.js` - governance docs validation style.
- `test/planning/discuss-mode-gate.test.js` - discuss gate regression style.
- `test/cross-repo-compatibility-checker/*.test.js` - fixture-driven packet
  validator test patterns.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `shared/review-packet-renderer.js`: should render all `gates-scan` packet
  artifacts so JSON, Markdown, and counts cannot drift.
- `shared/path-guard.js`: should be reused to reject output inside the scanned
  project.
- `shared/file-walker.js` and `shared/ignore-policy.js`: should be reused or
  mirrored for deterministic read-only scanning.
- `tools/cross-repo-compatibility-checker/`: closest existing tool pattern for
  read-only validation, CLI argument parsing, checks, fixtures, packet output,
  and docs.
- `tools/registry.json`: current machine-readable destination for promoting
  `gates-scan` maturity after implementation.

### Established Patterns

- Tools require explicit input roots and explicit external output directories.
- Review packet JSON is the source of truth; Markdown is a projection.
- Synthetic fixtures prove broken cases; real repo self-use is verification
  evidence, not the only oracle.
- Cross-repo compatibility uses explicit mapping instead of forcing schema
  equality.
- Tool output is evidence; assistant decisions remain separate.

### Integration Points

- `package.json` should expose `gates-scan` only if the CLI is implemented.
- `tools/gates-scan/README.md` should document use, checks, status meanings,
  boundaries, and non-goals.
- `tools/registry.json` should move `gates-scan` from planned to implemented or
  validated only when the implementation actually reaches that level.
- `CHANGELOG.md` must record the user-facing CLI/gate governance impact after
  execution.
- Phase 10 verification should include `gates-scan` self-use if implemented.
</code_context>

<specifics>
## Specific Ideas

- Keep `gates-scan` separate from `cross-repo-compatibility-checker`.
  Cross-repo checker validates two-repo protocol compatibility; `gates-scan`
  validates one project's gate artifacts and workflow evidence.
- Treat kit's `gate-review` registry entry as semantic policy evidence, not as
  a command to implement inside AI Tools.
- Use finding IDs that make mechanical scope clear, such as
  `GATE-REGISTRY-MISSING`, `GATE-DUPLICATE-ID`, `GATE-RESOLUTION-MISSING`,
  `GATE-SKIP-NONSKIPPABLE`, `GATE-SKIP-REASON-MISSING`,
  `GATE-DISCUSS-MODE-ROUTING-ONLY`, `GATE-STALE-PATH`,
  `GATE-OBSERVABLE-OUTPUT-MISSING`, and `GATE-CHANGELOG-IMPACT-MISSING`.
</specifics>

<deferred>
## Deferred Ideas

- Automatic GSD preflight execution of `gates-scan` remains out of scope until
  the CLI is validated and an explicit later workflow integration is planned.
- A semantic gate-review assistant workflow remains kit/assistant-owned and is
  not implemented as an AI Tools mechanical scanner.
- Broad seed tools such as ledger, forensics, config matrix, skill linter, test
  quality auditor, and UI regression remain Phase 11 selection candidates.
</deferred>

---

*Phase: 10-Evidence-Only Gate Linter Seed MVP*
*Context gathered: 2026-05-08*
