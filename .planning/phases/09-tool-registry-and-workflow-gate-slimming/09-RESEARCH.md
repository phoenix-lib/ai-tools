---
phase: 9
name: Tool Registry and Workflow Gate Slimming
status: research-complete
created: "2026-05-08"
requirements:
  - REG-01
  - GOV-01
---

# Phase 9: Tool Registry and Workflow Gate Slimming - Research

## Gate Resolution

### Research Gate

- **Status:** Resolved
- **Registry id:** research
- **Stage:** research
- **Resolution:** User selected `Research first`.
- **Evidence:** User replied `1` to the plan-phase research prompt.

### ai-workspace-kit Upstream Freshness Gate

- **Status:** Resolved
- **Registry id:** upstream-freshness
- **Stage:** research
- **Old commit:** `7bc432cce309178bdbcdf5715af6f6187c7ee568`
- **New commit:** `485da622e292e34a4e8f929f2212b441239c55f1`
- **Update action:** pulled with `git -C .external\ai-workspace-kit pull --ff-only`
- **Changelog reviewed:** yes, `.external/ai-workspace-kit/CHANGELOG.md`.
- **Changed source layers:** `AGENTS.md`, `AI-WORKSPACE-CONTRACT.json`,
  `templates/GATE-REGISTRY.json`, `templates/GATE-RESOLUTION.md`,
  `scripts/doctor.js`, `scripts/smoke-adopt.js`, docs, tests, and Phase 19
  planning artifacts.
- **Boundary classification:** shared governance pattern; implementation of
  kit doctor/smoke remains kit-owned, mechanical gate-linter remains AI
  Tools-owned future work.
- **Current repo impact:** strengthen `upstream-freshness` as a Kit Update
  Self-Check and keep gate-linter execution out of Phase 9.
- **Current phase impact:** plan registry/tests and gate docs so future tools
  have machine-readable routing before Phase 10.
- **Consumer practice impact:** promote update-impact review as a reusable
  practice for future AI Tools consumers, but do not copy kit adoption behavior.
- **Self-use/check output:** `cross-repo-compatibility-checker` produced
  `human_review_required` with one medium legacy kit decision field finding and
  no blockers.
- **Cross-repo request needed:** no new request for Phase 9; existing evidence
  can remain human-reviewed.
- **Decision:** adopt now for docs/registry planning.
- **Evidence:** `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md` and
  `C:\Users\suppo\.codex\memories\ai-tools-cross-repo-check-phase09-plan`.
- **No install/run/dependency confirmation:** no kit package was installed or
  imported; kit remains a reference checkout.

### Cross-Repo Incoming Review Gate

- **Status:** Resolved
- **Registry id:** cross-repo-incoming
- **Stage:** research
- **Resolution:** Existing requests justify clearer registry and gate routing,
  but do not promote `gates-scan` into Phase 9 implementation.
- **Evidence:** `.planning/cross-repo/inbox/` and
  `.planning/cross-repo/decisions/`.

### Cross-Repo Outgoing Need Gate

- **Status:** Skipped
- **Registry id:** cross-repo-outgoing
- **Stage:** research
- **Resolution:** No kit-owned capability is needed to plan Phase 9.
- **Reason:** Phase 9 consumes kit guidance as evidence and keeps
  adoption/bootstrap responsibilities out of AI Tools.

### AI Tools Self-Use Gate

- **Status:** Resolved
- **Registry id:** self-use
- **Stage:** research
- **Resolution:** Ran `cross-repo-compatibility-checker` because the phase
  depends on gate registry and interop semantics. `contract-drift-auditor`
  should run during execution after `AGENTS.md` and gate docs change.
- **Evidence summary:** packet status `human_review_required`; 1 medium finding;
  0 blockers; 0 required decisions.

### New Tool Intake and Placement Gate

- **Status:** Resolved
- **Registry id:** new-tool-intake
- **Stage:** research
- **Resolution:** Phase 9 introduces governance registry artifacts, not a new
  runnable tool. `gates-scan` is registered as planned Phase 10 only.
- **Evidence:** `tools/README.md`, `tools/*/SEED-IDEAS.md`,
  `.planning/REQUIREMENTS.md`.

## Research Findings

### 1. Registry Should Be Product-Level, Not Planning-Only

`tools/registry.json` is the right source of truth because it describes AI
Tools capabilities rather than GSD phase state. `.planning/gates/registry.json`
should remain the workflow gate catalog. The two registries should reference
each other by stable ids, not merge.

Recommended files:

- `tools/registry.schema.json`
- `tools/registry.json`
- `test/planning/tool-registry.test.js`

This mirrors existing governance patterns: JSON artifact, schema-like strict
shape, and focused node tests. It also follows the upstream kit pattern in
`AI-WORKSPACE-CONTRACT.json` and `templates/GATE-REGISTRY.json` without copying
kit-owned adoption contracts.

### 2. Registry Entries Need Routing Fields, Not Runtime Automation

Minimum fields should cover:

- stable `id`;
- `owner`;
- `destination`;
- `maturity`;
- `activation_stage`;
- `expected_outputs`;
- `use_gate`;
- `self_use`;
- `non_goals`;
- `evidence_refs`.

Useful optional fields:

- `cli` for runnable tools;
- `package_bin` for package.json consistency;
- `requirements`;
- `phase`;
- `status_notes`;
- `compatible_packet_standard`.

Avoid fields that imply automatic execution, dependency installation, semantic
approval, or mandatory target-project integration.

### 3. Initial Registry Coverage

The first registry should include:

- validated tools: `contract-drift-auditor`,
  `cross-repo-compatibility-checker`;
- active governance artifact: `tool-registry`;
- planned Phase 10 tool: `gates-scan`;
- boundary entry: `ai-workspace-kit-internal-gates`;
- deferred seed tools from `tools/*/SEED-IDEAS.md`.

Implemented runnable tools should be cross-checked with `package.json` `bin`.
Deferred seed entries should prove the project intentionally reviewed them
instead of leaving hidden unclassified ideas.

### 4. AGENTS Slimming Should Preserve Hard Rules

`AGENTS.md` is currently doing too much: entrypoint, source layers, local
workflow policy, upstream freshness, changelog, self-use, new-tool intake,
future gate review, safety, permission defaults, packet standards, and
verification. Phase 9 should move detailed policy bodies to
`.planning/gates/WORKFLOW-GATES.md` while preserving:

- generated-source warning;
- source layers;
- project purpose;
- hard safety rules;
- discuss-mode preflight;
- links to gate registry, workflow gate docs, cross-repo playbook, and tool
  registry;
- non-duplication boundary with `ai-workspace-kit`.

The discuss-mode preflight remains in root because it is safety-critical and
has already failed when it was only implicit.

### 5. Upstream Update Impact Belongs In Existing Gate

Do not add a separate `kit-update-self-check` gate id. Extend
`upstream-freshness` so old artifacts and existing references remain stable.
The concrete AI Tools behavior can be named "Kit Update Self-Check" in docs.

Required update-impact fields should include old/new commit, update action,
changelog status, changed source layers, usable ideas, boundary classification,
current repo impact, current phase impact, consumer practice impact, self-use
output, cross-repo request decision, outcome, evidence, and no
install/run/dependency confirmation.

For ordinary updates, the active artifact `Gate Resolution` is enough. For
substantial upstream updates, execution should create a phase-local
`<phase>-UPSTREAM-UPDATE-REVIEW.md` artifact.

### 6. Phase 10 Boundary

The Phase 10 `gates-scan` seed should be represented in the registry with
owner, output contract, use gate, and non-goals. Phase 9 should not implement:

- CLI parser;
- fixtures;
- findings;
- scanner checks;
- review packet generation for gates-scan.

The registry and docs should make Phase 10 easier to implement without letting
Phase 9 become an accidental linter phase.

## Planning Recommendations

Plan Phase 9 as two waves:

1. `09-01` creates the registry schema/data and tests.
2. `09-02` slims `AGENTS.md`, writes focused gate docs, extends
   `upstream-freshness`, updates docs/changelog, and runs self-use evidence.

This ordering gives docs a stable registry to reference and keeps the second
plan focused on governance surface cleanup.

## Residual Risks

- The updated kit contains a doctor command, but AI Tools should not copy it as
  a Phase 9 tool. The useful pattern is contract/index validation, not the kit
  implementation.
- The cross-repo checker still reports one medium upstream legacy decision
  field issue. This is not a blocker for human-reviewed planning, but future
  automation should keep treating it as evidence.
- Over-slimming `AGENTS.md` could hide safety-critical rules. Tests should
  verify retained links and retained discuss-mode preflight wording.

