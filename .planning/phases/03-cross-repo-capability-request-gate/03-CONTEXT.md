# Phase 3: Cross-Repo Capability Request Gate - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 creates the file-based coordination protocol for AI Tools and
`ai-workspace-kit`: cross-repo request directories, request and decision
templates, a capability request playbook, initial example requests, gate
enforcement registry, and docs validation proving required protocol fields are
present.

This phase does not implement `contract-drift-auditor`, mechanical
`gate-linter`, automatic cross-repo sync, automatic phase creation, automatic
tool runs, repo dependencies, or copied `.planning` state. It creates the
protocol and enforceable workflow gates that make those later decisions safer.

## Gate Resolution

- **Discuss Mode Gate**
  - Resolution: Trusted self-questioning
  - Selected by: user
  - Evidence: user selected `1` after the gate miss was identified
  - Note: an initial manual gray-area prompt was shown before this gate was
    resolved. That was a process miss and is corrected in this context before
    any canonical phase artifact is written.
- **Pending Todo Cross-Reference Gate**
  - Resolution: folded into Phase 3
  - Todo: `.planning/todos/pending/2026-05-07-accept-gate-linter-request.md`
  - Evidence: user selected `1` to fold it into the phase context.
- **AI Tools Self-Use Gate**
  - Resolution: checked
  - Result: no validated AI Tools external auditor exists yet, so no self-use
    tool run is required for this discuss phase.
  - Follow-up: Phase 3 must define machine-readable gate enforcement so future
    skips require explicit reasons.
- **Git Baseline Gate**
  - Resolution: checked
  - Result: `git status --short` was clean after seed consolidation commit
    `036d86f`.
- **Upstream Freshness Gate**
  - Resolution: not required for discuss; required before Phase 3 planning.
  - Current local reference observed during discussion:
    `.external/ai-workspace-kit` at `48ec037d058747151c320ced9c0ee1e1d247d4b1`.
  - Follow-up: `$gsd-plan-phase 3` must run the full upstream freshness gate,
    including remote HEAD check and changelog/release-note pre-read when
    present.

</domain>

<decisions>
## Implementation Decisions

### Discuss Mode

- **D-01:** Phase 3 uses Trusted self-questioning. The discussion artifact must
  record this explicitly because a missed discuss-mode gate caused a process
  failure before this context was written.
- **D-02:** Trusted self-questioning is not a silent default. Future phases must
  record who selected the mode, the selected mode, and the observable evidence
  in a `Gate Resolution` section before writing `*-CONTEXT.md`.

### Cross-Repo Protocol Shape

- **D-03:** Create `.planning/cross-repo/` with exactly these initial
  directories: `inbox/`, `outbox/`, `decisions/`, and `templates/`.
- **D-04:** Use Markdown as the human-readable canonical artifact format for
  requests and decisions, with required top fields and required headings. Do not
  introduce automatic integration, runtime cross-repo dependencies, or copied
  planning state.
- **D-05:** Add stable file naming conventions so requests and decisions are
  discoverable without parsing prose:
  - requests: `REQ-YYYYMMDD-<from>-to-<to>-<slug>.md`
  - decisions: `DEC-<request-id>.md`
  Exact slug normalization is the planner's discretion, but IDs must be stable.
- **D-06:** Templates must include all fields requested by the upstream prompt:
  ID, From, To, Status, Severity, Requested by phase/gate, Boundary
  classification, Need, Why, Evidence, Boundary, Expected Output,
  Compatibility Impact, Acceptance Criteria, Non-Goals, Decision Needed, and
  Review / Expiry.
- **D-07:** Boundary classifications are locked to:
  `kit-owned infrastructure`, `interop contract`, `recommendation guidance`,
  `external ai-tools capability`, and `unclear boundary`.
- **D-08:** Decision templates must include Request ID, Decision, Decided by,
  Date, Target phase, Reason, Outcome, Scope Accepted, Scope Rejected, Required
  Follow-Up, and Compatibility Notes.
- **D-09:** Decision statuses are locked to: `proposed`,
  `needs-clarification`, `accepted`, `planned`, `implemented`, `deferred`,
  `rejected`, `superseded`, and `stale`.
- **D-10:** Mixed decisions are allowed. A decision may accept one part of a
  request, plan another part for a phase, and defer a later tool capability, as
  long as accepted, rejected, and deferred scope are separated explicitly.

### Gate Enforcement Model

- **D-11:** Phase 3 must implement a machine-readable gate registry, not only
  prose in `AGENTS.md`. Use `.planning/gates/registry.json` unless research
  finds a stronger local pattern.
- **D-12:** The gate registry must define at least:
  - `discuss-mode`
  - `upstream-freshness`
  - `cross-repo-outgoing`
  - `cross-repo-incoming`
  - `changelog`
  - `self-use`
  - `new-tool-intake`
  - `git-baseline`
  - `future-gate-review`
- **D-13:** Every registry entry must define id, name, stages, required
  artifacts, required fields or observable output, whether skip is allowed, and
  whether skip reason is required.
- **D-14:** Every major GSD artifact created after this phase must include a
  `Gate Resolution` section when a registered gate applies. This section is the
  observable proof that the gate ran.
- **D-15:** If a gate does not apply, the artifact must say why. If a gate is
  skipped and `skipAllowed` is false, docs validation must fail.
- **D-16:** If interactive question tools are unavailable, the agent must show
  plain-text choices and stop for user input. Continuing silently is a gate
  failure.
- **D-17:** Mechanical gate checks are evidence only. The assistant remains
  responsible for semantic decisions: relevant, stale, duplicated,
  boundary-breaking, dependency creep, adopt, revise, defer, reject, or convert
  to request.

### Gate Stage Mapping

- **D-18:** Discuss stage gates: `discuss-mode`, `cross-repo-incoming`,
  `self-use`, and `git-baseline` when repository cleanliness is used as
  evidence.
- **D-19:** Research/plan stage gates: `upstream-freshness`,
  `cross-repo-outgoing`, `new-tool-intake`, `self-use`, and
  `cross-repo-incoming`.
- **D-20:** Execute/verify stage gates: `changelog`, `self-use`, and any
  phase-specific gates recorded in the plan.
- **D-21:** Phase-boundary/release gates: `cross-repo-incoming`,
  `future-gate-review`, `changelog`, `git-baseline`, and `self-use`.
- **D-22:** Outgoing Need Gate applies when AI Tools is about to implement a
  capability that may belong to `ai-workspace-kit`. If kit-owned, create an
  outbox request instead of implementing.
- **D-23:** Incoming Review Gate applies at discuss, maintenance, and
  phase-boundary stages. Incoming requests create decision points, not phases,
  dependencies, tool runs, or copied `.planning` state.

### Incoming Gate-Linter Request Decision

- **D-24:** Convert the pending todo into a structured inbox request from
  `ai-workspace-kit` to AI Tools during Phase 3 execution.
- **D-25:** The decision for that request should be mixed:
  - accept and document changelog convention as a process requirement;
  - accept assistant-owned semantic gate review as a process requirement;
  - plan the gate registry plus docs validation as Phase 3 scope;
  - defer mechanical `gate-linter` implementation as a v2 optional AI Tools
    capability;
  - keep future mechanical output evidence-only.
- **D-26:** The decision status should be `planned` because part of the request
  becomes Phase 3 implementation work while the later linter remains deferred.
- **D-27:** Do not create a new phase from the incoming request. Phase 3 already
  covers the protocol and gate enforcement model; `gate-linter` remains a v2
  seed/candidate until deliberately promoted.

### Example Requests

- **D-28:** Add at least two example requests required by roadmap:
  - from `ai-workspace-kit` to AI Tools: read-only contract drift auditor;
  - from AI Tools to `ai-workspace-kit`: stable review packet schema and
    evidence refs contract.
- **D-29:** Also add the real incoming changelog/gate-review/gate-linter
  request from the pending todo, not only synthetic examples.
- **D-30:** Examples must demonstrate boundaries and non-goals clearly enough
  that neither repo is encouraged to copy `.planning`, auto-run tools, or
  install the other repo.

### Docs Validation Strictness

- **D-31:** Phase 3 must add Node `node:test` docs validation. It should check
  directory existence, template headings, required fields, allowed boundary
  classifications, allowed decision statuses, example request completeness, and
  gate registry shape.
- **D-32:** Validation should also check that Phase 3 context contains a
  `Gate Resolution` section with `Discuss Mode Gate: Trusted self-questioning`
  or equivalent structured text.
- **D-33:** Keep tests mechanical. They should verify structure and allowed
  vocabulary, not decide whether a gate is semantically relevant.

### the agent's Discretion

The planner may choose exact registry JSON field names, exact validator file
name, request slug format, and whether validation lives under
`test/planning/`, `test/gates/`, or another existing test directory. Keep the
locked behavior above intact.

### Folded Todos

- **Accept gate linter request** from
  `.planning/todos/pending/2026-05-07-accept-gate-linter-request.md`: fold into
  Phase 3 as the first real incoming cross-repo request and mixed decision.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements

- `.planning/PROJECT.md` - Project purpose, active constraints, tandem
  boundary, self-use gate, new-tool intake gate, and v2 gate-linter decision.
- `.planning/REQUIREMENTS.md` - Phase 3 requirement IDs: `XREPO-01` through
  `XREPO-08`, `GATE-01`, `GATE-02`, `GATE-04`, `GATE-05`, and `GATE-06`.
- `.planning/ROADMAP.md` - Phase 3 goal, success criteria, and plan outline.
- `.planning/STATE.md` - Current phase focus, pending todos, deferred items,
  and latest roadmap evolution.
- `CHANGELOG.md` - Current changelog gate practice and pending cross-repo
  request summary.
- `AGENTS.md` - Local gate definitions, self-use gate, new-tool intake gate,
  git baseline gate, upstream freshness gate, and tandem boundary gate.

### Folded Request

- `.planning/todos/pending/2026-05-07-accept-gate-linter-request.md` -
  Incoming `ai-workspace-kit` request to convert into a structured inbox
  request and mixed decision.

### Existing Standards and Tests

- `standards/review-packet/README.md` - Review packet source-of-truth rule and
  shared summary rendering requirement.
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json` - Existing
  schema style and strict validation pattern.
- `test/review-packet/schema-validation.test.js` - Existing `node:test` and Ajv
  validation pattern to mirror for Phase 3 docs validation.
- `tools/README.md` - Tool seed routing and New Tool Intake placement rules.
- `tools/ai-workspace-kit-internal-gates/SEED-IDEAS.md` - Boundary note showing
  kit-owned gates should not become a parallel AI Tools adoption system.
- `tools/contract-drift-auditor/SEED-IDEAS.md` - Required example request from
  kit to AI Tools should point toward this future external auditor, not
  implement it.

### ai-workspace-kit Reference

- `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md` - Latest upstream
  review and Phase 3 planning impacts.
- `.external/ai-workspace-kit/CORE-CONTRACT.md` - Mandatory discuss-mode gate,
  fallback behavior when question tools are unavailable, and project-local gate
  discipline.
- `.external/ai-workspace-kit/AI-BOOTSTRAP.md` - Adoption review boundaries,
  review material policy, and optional tool guidance.
- `.external/ai-workspace-kit/ADAPTER-GENERATION.md` - Review packet boundary,
  generated contract policy, and external-tool non-duplication constraints.
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md` - External tool boundary,
  optional-tool stage mapping, and non-duplication gate.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `test/review-packet/schema-validation.test.js`: established pattern for
  structure validation with Node test and Ajv where schemas exist.
- `package.json`: `npm test` runs `node --test`; Phase 3 validation can be
  added without new scripts.
- `shared/canonical-json.js`: available if Phase 3 writes JSON fixtures or
  registry files that need deterministic output.
- `standards/review-packet/*`: existing machine/human packet conventions to
  reference for future gate-linter evidence packets.

### Established Patterns

- Planning and standards are Markdown-first, with focused JSON schemas/tests
  where machine validation matters.
- Project-specific source layers are recorded in `AGENTS.md` and must not point
  at stale files.
- Shared mechanics belong in `shared/`; tool implementations belong under
  `tools/<tool-name>/`; planning protocols belong under `.planning/`.

### Integration Points

- `.planning/cross-repo/` is the new protocol home.
- `.planning/gates/registry.json` should become the mechanical gate contract.
- `AGENTS.md` should point to the registry/playbook once they exist.
- `CHANGELOG.md` must record this workflow gate change when Phase 3 executes.
- Future Phase 4 `contract-drift-auditor` can consume these gates as source
  layer expectations after they are validated.

</code_context>

<specifics>
## Specific Ideas

- Do not rely on memory or prose-only gates. A gate needs an observable artifact
  output.
- `Gate Resolution` sections should be required in relevant GSD artifacts.
- The self-questioning miss in this discussion should be documented as evidence
  for why enforcement is necessary.
- The first validation target should be small and mechanical: required
  headings, allowed statuses, allowed classifications, registry fields, and
  explicit skip reasons.

</specifics>

<deferred>
## Deferred Ideas

- Mechanical `gate-linter` implementation is deferred to v2. Phase 3 only seeds
  the future capability and records that its output is evidence-only.
- Cross-repo automation, automatic issue creation, automatic phase creation,
  automatic tool runs, and repo dependencies are out of scope.
- `contract-drift-auditor` implementation remains Phase 4.

</deferred>

---

*Phase: 3-Cross-Repo Capability Request Gate*
*Context gathered: 2026-05-07*
