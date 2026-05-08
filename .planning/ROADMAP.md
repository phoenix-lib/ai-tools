# Roadmap: AI Tools

## Overview

The v1 roadmap builds one reliable read-only audit pipeline from the inside out:
first the shared review packet contract, then shared safety and deterministic
inspection helpers, then an explicit cross-repo request gate for coordinating
with `ai-workspace-kit`, then the first external auditor, then integration and
documentation hardening. Later tools stay deferred until the packet standard is
proven by `contract-drift-auditor`.

The v2 preliminary roadmap keeps that discipline: first close release
documentation and machine-readable metadata gaps, then build the smallest
cross-repo validator that prevents known `ai-tools` / `ai-workspace-kit`
protocol drift, then improve the first auditor's CLI ergonomics. Broad seed
tools stay deferred until the existing packet standard, registry, gates, and
validator can govern tool intake.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work.
- Decimal phases (2.1, 2.2): Urgent insertions if needed.

- [x] **Phase 1: Review Packet Standard** - Define the machine and human output contract every tool will use. Completed 2026-05-07.
- [x] **Phase 2: Shared Safety Harness** - Build deterministic read-only inspection primitives and fixture proof. Completed 2026-05-07.
- [x] **Phase 3: Cross-Repo Capability Request Gate** - Define structured capability requests and decisions between AI Tools and `ai-workspace-kit`. Completed 2026-05-07.
- [x] **Phase 4: Contract Drift Auditor MVP** - Ship the first external auditor using the shared packet standard. Completed 2026-05-07.
- [x] **Phase 5: Integration and Release Hardening** - Align docs, optional ai-workspace-kit integration, and first-release readiness. (completed 2026-05-07)
- [x] **Phase 6: Release Closeout and Tool Metadata** - Fix post-Phase-5 doc drift, add release packet fixtures, centralize tool metadata, and preserve safe self-audit invocation. Completed 2026-05-07.
- [x] **Phase 7: Cross-Repo Compatibility Checker MVP** - Build the smallest read-only validator for AI Tools / `ai-workspace-kit` protocol compatibility before any automatic cross-repo automation. Completed 2026-05-08.
- [x] **Phase 8: Contract Drift Auditor CLI Ergonomics** - Add machine stdout, quiet mode, fail-on policy, and documented exit codes without making findings automatic decisions. Completed 2026-05-08.
- [x] **Phase 9: Tool Registry and Workflow Gate Slimming** - Create the machine-readable tool registry and move detailed gate policy out of root `AGENTS.md` into focused workflow docs. Completed 2026-05-08.
- [ ] **Phase 10: Evidence-Only Gate Linter Seed MVP** - Build or formally re-defer the mechanical gate-linter only after the cross-repo validator and tool registry are in place.
- [ ] **Phase 11: v2 Tool Selection Review** - Reassess deferred seed tools and choose the next single tool only from repeated evidence-backed demand.

## Phase Details

### Phase 1: Review Packet Standard
**Goal**: Create the portable output contract used by all tools.
**Depends on**: Nothing (first phase)
**Requirements**: RPS-01, RPS-02, RPS-03, RPS-04, RPS-05, RPS-06, SAFE-04, SAFE-06, TEST-01, TEST-05, TEST-06
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. JSON schemas exist for review summaries, findings, evidence refs, recommended actions, and tool manifests.
  2. Example packets validate against schemas and show status, severity, confidence, evidence, and recommended actions.
  3. Markdown packet guidance clearly states JSON is the source of truth.
  4. Canonical JSON and shared summary rules are documented enough for later tools to implement.
**Plans**: 3 plans

Plans:
**Wave 1**
- [x] 01-01: Define review packet schemas and status/severity/confidence taxonomy.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 01-02: Define evidence refs, recommended actions, and tool manifest metadata.

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 01-03: Add canonical JSON guidance, examples, and schema validation tests.

### Phase 2: Shared Safety Harness
**Goal**: Build the shared read-only inspection and fixture safety foundation.
**Depends on**: Phase 1
**Requirements**: SAFE-01, SAFE-02, SAFE-03, SAFE-05, TEST-02, TEST-03, TEST-07
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Shared helpers can reject unsafe output paths, classify secret-like paths, walk project files with the default ignore policy, and hash fixture trees.
  2. Fixtures cover clean project, mature project, stale source layer, missing command, secret-like files, mixed package managers, and generated packet inside target tree.
  3. Tests prove target fixtures are unchanged after read-only runs.
  4. Tests prove secret sentinel strings never appear in outputs.
**Plans**: 3 plans

Plans:
- [x] 02-01: Implement output path guard, ignore policy, file walker, and secret policy.
- [x] 02-02: Build reusable fixtures and tree-hash mutation checks.
- [x] 02-03: Add deterministic safety tests for output isolation, secret handling, and ignored generated packets.

### Phase 3: Cross-Repo Capability Request Gate
**Goal**: Create the structured protocol for AI Tools and `ai-workspace-kit` to request missing capabilities without mixing ownership or automatically creating work.
**Depends on**: Phase 2
**Requirements**: XREPO-01, XREPO-02, XREPO-03, XREPO-04, XREPO-05, XREPO-06, XREPO-07, XREPO-08, GATE-01, GATE-02, GATE-04, GATE-05, GATE-06
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. `.planning/cross-repo/` contains `inbox/`, `outbox/`, `decisions/`, and `templates/` structure.
  2. Capability request and decision templates exist with required fields, boundary classifications, and decision statuses.
  3. A playbook documents why the gate exists, when to create or reject requests, how to prevent endless task exchange, and which repository owns which responsibilities.
  4. Outgoing Need Gate and Incoming Review Gate are mapped to the relevant GSD stages and explicitly do not auto-run tools, create phases, copy planning state, or add repo dependencies.
  5. Example requests exist in both directions: `ai-workspace-kit` asks AI Tools for a read-only contract drift auditor, and AI Tools asks `ai-workspace-kit` for a stable review packet schema and evidence refs contract.
  6. The project changelog gate is documented, and the upstream freshness gate reads upstream changelog/release notes first when present and changed.
  7. AI Tools Self-Use Gate, New Tool Intake and Placement Gate, and Git Baseline Gate are documented with trigger stages, evidence rules, skip behavior, and no-automatic-decision boundaries.
  8. Tests or docs validation prove required templates/docs exist and contain required fields where the project test harness supports it.
**Plans**: 3 plans

Plans:
- [x] 03-01: Create cross-repo request directories, request template, and decision template.
- [x] 03-02: Write the capability request playbook with ownership boundaries, changelog discipline, upstream changelog pre-read, self-use, new-tool intake, git baseline, and GSD gate mapping.
- [x] 03-03: Add bidirectional example requests and docs validation for required fields.

### Phase 4: Contract Drift Auditor MVP
**Goal**: Ship a read-only CLI that detects AI contract drift and emits the shared review packet.
**Depends on**: Phase 3
**Requirements**: RENDER-01, DRIFT-01, DRIFT-02, DRIFT-03, DRIFT-04, DRIFT-05, DRIFT-06, DRIFT-07, TEST-04
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. User can run `contract-drift-auditor --project <path> --out <dir>` without mutating the target project.
  2. Auditor detects missing referenced files, missing commands, absent-tool permissions, invalid/missing skills, stale source layers, and profile fact drift.
  3. Auditor emits `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, and `RECOMMENDED-ACTIONS.md`.
  4. Each finding cites evidence and unknown facts are marked explicitly.
  5. Shared packet renderer generates JSON, Markdown, and CLI status from one packet model.
**Plans**: 3 plans

Plans:
- [x] 04-01: Implement CLI shell and contract/source discovery.
- [x] 04-02: Implement drift checks for files, commands, permissions, skills, source layers, and profile facts.
- [x] 04-03: Render packet artifacts through the shared packet renderer and add auditor fixture tests.

### Phase 5: Integration and Release Hardening
**Goal**: Prepare the first useful release and keep integration optional.
**Depends on**: Phase 4
**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04, GATE-03
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Documentation explains when to use the auditor, when not to use it, and what safety guarantees it provides.
  2. Documentation states `ai-workspace-kit` remains the adoption/bootstrap contract tool and external tools are optional.
  3. First release definition of done is checkable against schemas, one working auditor, deterministic tests, and secret safety.
  4. Later tool selection is deferred with clear criteria based on repeated real demand.
  5. Release readiness includes a planned `ai-workspace-kit` gate review hook for conflicting, stale, or irrelevant gates, with manual fallback until the upstream capability exists.
  6. Release readiness records `XREPO-VALIDATOR-01` as the deferred read-only cross-repo compatibility checker to build before any automatic cross-repo indexer or gate-linter automation.
**Plans**: 2 plans

Plans:
**Wave 1**
- [x] 05-01: Write usage, safety, integration, and first-release documentation.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 05-02: Run release readiness review, future ai-workspace-kit gate review if available, document deferred tool criteria, and preserve `XREPO-VALIDATOR-01` as a v2 prerequisite for automatic cross-repo validation.

### Phase 6: Release Closeout and Tool Metadata
**Goal**: Convert Phase 5 release evidence into a clean v1 release baseline.
**Depends on**: Phase 5
**Requirements**: REL-05, REL-06, META-01, SELF-01
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. `contract-drift-auditor` docs no longer claim historical phase artifacts dominate self-audit after Phase 5 filtering; remaining limitations are accurately scoped.
  2. Release packet fixtures exist for `pass`, `human_review_required`, and safety-blocked auditor outcomes.
  3. Tool metadata and protocol versions have a single source used by code, docs, examples, or tests.
  4. Self-audit is documented as a safe invocation that requires caller-provided external `--out` and does not encode a machine-local path.
  5. Changelog captures compatibility impact for `ai-workspace-kit` and downstream freshness checks.
**Plans**: 3 plans

Plans:
**Wave 1**
- [x] 06-01: Clean release docs and auditor limitations after Phase 5 self-audit hardening.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 06-02: Centralize tool metadata/version data and add safe self-audit command guidance.
- [x] 06-03: Add release packet fixtures and validation for representative auditor outcomes.

### Phase 7: Cross-Repo Compatibility Checker MVP
**Goal**: Ship the first v2 tool as a read-only compatibility validator for sibling `ai-tools` and `ai-workspace-kit` checkouts.
**Depends on**: Phase 6
**Requirements**: XREPO-VALIDATOR-01
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. User can run a checker with explicit paths to both repositories and explicit `--out`.
  2. Checker validates `Protocol version`, canonical request IDs, `Thread ID`, `Origin`, `Mirror required`, counterpart IDs, and repo-qualified counterpart paths.
  3. Checker requires decisions for `manual-transfer` requests with `Mirror required: false`.
  4. Checker compares AI Tools snake_case gate registry metadata with kit camelCase expectations through documented interop mapping and stage aliases.
  5. Output uses the shared review packet artifacts and never installs, runs, mutates, or depends on the neighboring repository.
**Plans**: 3 plans

Plans:
**Wave 1**
- [x] 07-01: Define cross-repo checker fixtures, discovery, and protocol metadata parsing.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 07-02: Implement thread/counterpart/origin/path validation checks.
- [x] 07-03: Add gate registry mapping checks, packet rendering, docs, and self-use validation.

### Phase 8: Contract Drift Auditor CLI Ergonomics
**Goal**: Make the first auditor easier to consume in CI and assistant workflows without changing evidence-only defaults.
**Depends on**: Phase 6
**Requirements**: CLI-01, CLI-02
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. CLI can emit a compact machine stdout summary while packet files remain the source of truth.
  2. CLI supports quiet mode that suppresses non-essential output.
  3. CLI supports `--fail-on blocked|human_review_required|never` with documented stable exit codes.
  4. Default behavior remains non-breaking: findings are evidence, not automatic shell failure.
  5. Tests cover stdout modes and exit-code behavior on Windows.
**Plans**: 2 plans

Plans:
**Wave 1**
- [x] 08-01: Add CLI output modes and stable exit-code policy.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 08-02: Update docs, tests, and release examples for CI/assistant consumption.

### Phase 9: Tool Registry and Workflow Gate Slimming
**Goal**: Make tool intake and self-use machine-readable before adding more tools, while keeping root assistant guidance lightweight.
**Depends on**: Phase 7
**Requirements**: REG-01, GOV-01
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. A machine-readable tool registry records implemented, validated, self-use-required, planned, seed-only, and deferred capabilities.
  2. Registry entries include owner, destination, maturity, activation stage, expected outputs, non-goals, and use gate.
  3. New Tool Intake and AI Tools Self-Use gates reference the registry as evidence.
  4. Root `AGENTS.md` keeps hard rules and source layers, while detailed gate policy moves to focused workflow gate docs.
  5. Tests validate registry shape and required gate documentation links.
**Plans**: 2 plans

Plans:
**Wave 1**
- [x] 09-01: Add tool registry schema/data and registry-backed docs validation.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 09-02: Slim `AGENTS.md` and move detailed gate policy into workflow gate documentation.

Cross-cutting constraints:
- Preserve the `ai-workspace-kit` ownership boundary and do not implement
  adoption/bootstrap, generated-contract review, or kit doctor behavior.
- Treat AI Tools self-use output as evidence only; tools do not make semantic
  gate decisions or auto-create phases.
- Keep `gates-scan` / `GATELINT-01` registered as planned Phase 10 work only.

### Phase 10: Evidence-Only Gate Linter Seed MVP
**Goal**: Promote or explicitly re-defer `GATELINT-01` after the validator and tool registry can bound its scope.
**Depends on**: Phase 9
**Requirements**: GATELINT-01
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Gate linter scope is checked against `ai-workspace-kit` ownership before implementation.
  2. If implemented, it reports missing gate blocks, duplicate gate IDs, stale paths, missing source layers, missing changelog entries, conflicting wording, unresolved refs, and gates without observable outputs.
  3. Output is review packet evidence only and never makes semantic adoption decisions.
  4. If not implemented, a decision artifact records why it remains deferred and what evidence would promote it later.
**Plans**: 2 plans

Plans:
- [ ] 10-01: Revalidate gate-linter boundary and fixture scope against `ai-workspace-kit`.
- [ ] 10-02: Implement minimal evidence-only linter or record explicit deferred decision.

### Phase 11: v2 Tool Selection Review
**Goal**: Choose the next single tool from deferred seeds based on evidence instead of starting several broad tools.
**Depends on**: Phase 10
**Requirements**: LEDGER-01, FORENSICS-01, CONFIG-01, SKILL-01, TESTQA-01, UIREG-01
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Deferred seed tools are reviewed against actual usage evidence, changelog history, cross-repo requests, and project pain.
  2. At most one next implementation candidate is promoted.
  3. Non-selected tools remain seed/backlog items with explicit reasons.
  4. The promoted tool has ownership, destination, use gate, outputs, non-goals, and fixtures defined before implementation.
**Plans**: 1 plan

Plans:
- [ ] 11-01: Run evidence-backed v2 seed review and promote one next tool or defer all.

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| RPS-01 | Phase 1 |
| RPS-02 | Phase 1 |
| RPS-03 | Phase 1 |
| RPS-04 | Phase 1 |
| RPS-05 | Phase 1 |
| RPS-06 | Phase 1 |
| RENDER-01 | Phase 4 |
| SAFE-01 | Phase 2 |
| SAFE-02 | Phase 2 |
| SAFE-03 | Phase 2 |
| SAFE-04 | Phase 1 |
| SAFE-05 | Phase 2 |
| SAFE-06 | Phase 1 |
| XREPO-01 | Phase 3 |
| XREPO-02 | Phase 3 |
| XREPO-03 | Phase 3 |
| XREPO-04 | Phase 3 |
| XREPO-05 | Phase 3 |
| XREPO-06 | Phase 3 |
| XREPO-07 | Phase 3 |
| XREPO-08 | Phase 3 |
| GATE-01 | Phase 3 |
| GATE-02 | Phase 3 |
| GATE-03 | Phase 5 |
| GATE-04 | Phase 3 |
| GATE-05 | Phase 3 |
| GATE-06 | Phase 3 |
| DRIFT-01 | Phase 4 |
| DRIFT-02 | Phase 4 |
| DRIFT-03 | Phase 4 |
| DRIFT-04 | Phase 4 |
| DRIFT-05 | Phase 4 |
| DRIFT-06 | Phase 4 |
| DRIFT-07 | Phase 4 |
| TEST-01 | Phase 1 |
| TEST-02 | Phase 2 |
| TEST-03 | Phase 2 |
| TEST-04 | Phase 4 |
| TEST-05 | Phase 1 |
| TEST-06 | Phase 1 |
| TEST-07 | Phase 2 |
| DOC-01 | Phase 5 |
| DOC-02 | Phase 5 |
| DOC-03 | Phase 5 |
| DOC-04 | Phase 5 |
| REL-05 | Phase 6 |
| REL-06 | Phase 6 |
| META-01 | Phase 6 |
| SELF-01 | Phase 6 |
| XREPO-VALIDATOR-01 | Phase 7 |
| CLI-01 | Phase 8 |
| CLI-02 | Phase 8 |
| REG-01 | Phase 9 |
| GOV-01 | Phase 9 |
| GATELINT-01 | Phase 10 |
| LEDGER-01 | Phase 11 |
| FORENSICS-01 | Phase 11 |
| CONFIG-01 | Phase 11 |
| SKILL-01 | Phase 11 |
| TESTQA-01 | Phase 11 |
| UIREG-01 | Phase 11 |

**Coverage:**
- v1: 45/45 requirements mapped and complete.
- v2 preliminary: 16/16 requirements mapped to complete, planned, or deferred phases.

## Progress

**Execution Order:** 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Review Packet Standard | 3/3 | Complete | 2026-05-07 |
| 2. Shared Safety Harness | 3/3 | Complete | 2026-05-07 |
| 3. Cross-Repo Capability Request Gate | 3/3 | Complete | 2026-05-07 |
| 4. Contract Drift Auditor MVP | 3/3 | Complete | 2026-05-07 |
| 5. Integration and Release Hardening | 2/2 | Complete | 2026-05-07 |
| 6. Release Closeout and Tool Metadata | 3/3 | Complete | 2026-05-07 |
| 7. Cross-Repo Compatibility Checker MVP | 3/3 | Complete | 2026-05-08 |
| 8. Contract Drift Auditor CLI Ergonomics | 2/2 | Complete | 2026-05-08 |
| 9. Tool Registry and Workflow Gate Slimming | 2/2 | Complete | 2026-05-08 |
| 10. Evidence-Only Gate Linter Seed MVP | 0/2 | Planned | - |
| 11. v2 Tool Selection Review | 0/1 | Planned | - |
