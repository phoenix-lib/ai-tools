# Phase 3: Cross-Repo Capability Request Gate - Research

**Researched:** 2026-05-07
**Domain:** cross-repo capability requests, workflow gate enforcement, docs validation
**Confidence:** HIGH

## Gate Resolution

- **Research Gate**
  - Resolution: Research first
  - Selected by: user
  - Evidence: user answered `1` after the plan-phase research gate prompt.
- **Upstream Freshness Gate**
  - Resolution: checked before planning
  - Local `.external/ai-workspace-kit`: `48ec037d058747151c320ced9c0ee1e1d247d4b1`
  - Remote `phoenix-lib/ai-workspace-kit` HEAD: `48ec037d058747151c320ced9c0ee1e1d247d4b1`
  - Result: no upstream update required.
  - Changelog status: no upstream changelog/release-note file exists at this commit.
- **Git Baseline Gate**
  - Resolution: checked
  - Result: `git status --short` was clean before research.
- **AI Tools Self-Use Gate**
  - Resolution: checked
  - Result: no validated AI Tools auditor exists yet, so no self-use tool run applies.
- **Cross-Repo Incoming Review Gate**
  - Resolution: checked
  - Result: pending `ai-workspace-kit` changelog/gate-review/gate-linter request must become a structured inbox request and mixed decision during Phase 3 execution.
- **New Tool Intake Gate**
  - Resolution: checked
  - Result: mechanical `gate-linter` remains a v2 seed/candidate and must not be implemented in Phase 3.

<user_constraints>
## User Constraints From Context

- Phase 3 creates a file-based coordination protocol and gate enforcement model
  before the first heavy auditor.
- Do not implement `contract-drift-auditor`, mechanical `gate-linter`, automatic
  cross-repo sync, automatic phase creation, automatic tool runs, repo
  dependencies, or copied `.planning` state.
- Requests are Markdown-first canonical artifacts with stable filenames.
- Decisions may be mixed: accepted process rules, planned protocol work, and
  deferred tool capabilities must be separated explicitly.
- Gate enforcement cannot rely on memory or prose-only guidance. It needs
  observable artifacts, required fields, and docs validation.
- Future mechanical gate checks are evidence only; the assistant keeps semantic
  responsibility for relevance, conflicts, duplication, staleness, and
  dependency creep.
</user_constraints>

<research_summary>
## Summary

Phase 3 should be planned as a small governance/protocol layer, not as a tool
implementation. The durable value is making cross-repo decisions explicit:
requests live in `.planning/cross-repo/{inbox,outbox}`, decisions live in
`.planning/cross-repo/decisions`, templates live under
`.planning/cross-repo/templates`, and gate rules become machine-readable in
`.planning/gates/registry.json`.

The most important planning adjustment from the recent gate miss is that every
major GSD artifact created after Phase 3 must show a `Gate Resolution` section
when registered gates apply. This gives future agents a concrete checklist and
gives tests a mechanical artifact to validate.

**Primary recommendation:** split Phase 3 into three waves:
1. Create protocol structure, templates, and gate registry.
2. Write the playbook and update local guidance to point at the registry.
3. Add example requests, the real incoming request/decision, and docs
   validation tests.
</research_summary>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Markdown Canonical, JSON Registry

Use Markdown for request and decision artifacts because humans need to review
and negotiate boundaries. Use JSON for gate registry because future validators
need stable IDs, stages, required artifacts, skip rules, and observable outputs.

### Pattern 2: Decision Point, Not Work Creation

Incoming requests create decision artifacts, not automatic phases. A decision
may accept, reject, plan, defer, or supersede scope, but phase creation remains
a separate roadmap decision.

### Pattern 3: Gate Evidence Is Local

Every gate must leave local evidence: a `Gate Resolution` block, a registry
entry, a changelog entry, a request/decision artifact, or a validation result.
Silent reasoning is not sufficient.

### Pattern 4: Boundary Before Implementation

Before implementing or planning a tool-like capability, classify ownership:
AI Tools owns external auditors and shared packet mechanics; `ai-workspace-kit`
owns adoption/bootstrap contracts, adapter guidance, generated contract policy,
and permission policy. Shared needs become cross-repo requests.

### Pattern 5: Mechanical Checks Stay Narrow

Phase 3 validation should check structure, allowed vocabularies, required
fields, and required files. It should not try to decide whether a gate is
semantically correct; that remains assistant-owned review.
</architecture_patterns>

<implementation_findings>
## Implementation Findings

| Area | Finding | Planning Impact |
|------|---------|-----------------|
| Existing tests | `test/review-packet/schema-validation.test.js` uses `node:test` and Ajv for deterministic schema checks. | Phase 3 docs validation can use plain `node:test` with filesystem/string assertions; no new dependency is needed. |
| Package scripts | `package.json` has only `npm test` mapped to `node --test`. | Add tests under `test/planning/` or similar so they run automatically. |
| Source layers | `AGENTS.md` already documents upstream freshness, changelog, self-use, new-tool intake, git baseline, future gate review, and tandem boundary gates. | Phase 3 should update AGENTS to point to the new registry/playbook rather than duplicating all rules. |
| Upstream kit | Current upstream has mandatory discuss-mode gate, optional-tool non-duplication gate, review packet semantics, framework adapter boundary, and top-level skill maintenance guidance. | Phase 3 should preserve these as influence/boundary rules without importing kit code or `.planning` state. |
| Pending request | `.planning/todos/pending/2026-05-07-accept-gate-linter-request.md` captures a real incoming request. | Execution must convert it to an inbox request and decision artifact, then leave or archive the todo only after that evidence exists. |
| Tool seeds | `tools/ai-workspace-kit-internal-gates/SEED-IDEAS.md` is boundary context, not an AI Tools implementation plan. | Avoid implementing kit-owned gates locally; Phase 3 only plans mechanical evidence support for future AI Tools linting. |
</implementation_findings>

<validation_architecture>
## Validation Architecture

Use `node:test` docs validation with deterministic filesystem checks.

| Check | Expected Coverage |
|-------|-------------------|
| Cross-repo directories exist | XREPO-01 |
| Request template top fields/headings exist | XREPO-02 |
| Allowed boundary classifications are present | XREPO-03 |
| Decision template fields/headings exist | XREPO-04 |
| Allowed decision statuses are present | XREPO-05 |
| Playbook documents outgoing/incoming gates and non-goals | XREPO-06, XREPO-07 |
| Example requests and real incoming request exist | XREPO-08 |
| Gate registry has required IDs, stages, artifacts, fields, and skip behavior | GATE-01, GATE-02, GATE-04, GATE-05, GATE-06 |
| Phase 3 context/research/plans show `Gate Resolution` evidence | gate enforcement model |

Focused command:
`npm.cmd test -- test/planning/cross-repo-protocol.test.js`

Full regression command:
`npm.cmd test`
</validation_architecture>

<common_pitfalls>
## Common Pitfalls

- **Prose-only gates:** easy for future agents to skip. Require registry entries
  and `Gate Resolution` evidence.
- **Automatic phase creation:** incoming requests must not mutate the roadmap by
  themselves.
- **Hidden dependency creep:** do not add imports, package dependencies, or
  auto-runs between repos.
- **Duplicating kit behavior:** AI Tools should not implement adoption review,
  adapter generation, permission policy, or generated contract merge routing.
- **Overbuilding gate-linter:** Phase 3 should seed the future capability and
  validate docs structure only.
- **Treating tool output as final decision:** future mechanical lint output is
  evidence, not semantic acceptance/rejection.
</common_pitfalls>

<sources>
## Sources

### Primary

- `.planning/phases/03-cross-repo-capability-request-gate/03-CONTEXT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/todos/pending/2026-05-07-accept-gate-linter-request.md`
- `AGENTS.md`
- `CHANGELOG.md`
- `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md`

### Local Implementation Patterns

- `package.json`
- `test/review-packet/schema-validation.test.js`
- `standards/review-packet/README.md`
- `tools/README.md`
- `tools/contract-drift-auditor/SEED-IDEAS.md`
- `tools/ai-workspace-kit-internal-gates/SEED-IDEAS.md`

### ai-workspace-kit Reference

- `.external/ai-workspace-kit/CORE-CONTRACT.md`
- `.external/ai-workspace-kit/AI-BOOTSTRAP.md`
- `.external/ai-workspace-kit/ADAPTER-GENERATION.md`
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md`
</sources>

<metadata>
## Metadata

**Research scope:** planning protocol, gate enforcement, validation structure,
and cross-repo boundary handling.
**Confidence:** HIGH - recommendations derive from locked Phase 3 context,
current local project contracts, and current reachable upstream kit commit.
**Valid until:** 2026-06-06 or until the next upstream freshness gate finds a
new `ai-workspace-kit` commit.
</metadata>

---

## RESEARCH COMPLETE

*Phase: 03-cross-repo-capability-request-gate*
*Research completed: 2026-05-07*
*Ready for planning: yes*
