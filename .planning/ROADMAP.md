# Roadmap: AI Tools

## Overview

The v1 roadmap builds one reliable read-only audit pipeline from the inside out:
first the shared review packet contract, then shared safety and deterministic
inspection helpers, then an explicit cross-repo request gate for coordinating
with `ai-workspace-kit`, then the first external auditor, then integration and
documentation hardening. Later tools stay deferred until the packet standard is
proven by `contract-drift-auditor`.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work.
- Decimal phases (2.1, 2.2): Urgent insertions if needed.

- [x] **Phase 1: Review Packet Standard** - Define the machine and human output contract every tool will use. Completed 2026-05-07.
- [x] **Phase 2: Shared Safety Harness** - Build deterministic read-only inspection primitives and fixture proof. Completed 2026-05-07.
- [ ] **Phase 3: Cross-Repo Capability Request Gate** - Define structured capability requests and decisions between AI Tools and `ai-workspace-kit`.
- [ ] **Phase 4: Contract Drift Auditor MVP** - Ship the first external auditor using the shared packet standard.
- [ ] **Phase 5: Integration and Release Hardening** - Align docs, optional ai-workspace-kit integration, and first-release readiness.

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
- [ ] 03-02: Write the capability request playbook with ownership boundaries, changelog discipline, upstream changelog pre-read, self-use, new-tool intake, git baseline, and GSD gate mapping.
- [ ] 03-03: Add bidirectional example requests and docs validation for required fields.

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
- [ ] 04-01: Implement CLI shell and contract/source discovery.
- [ ] 04-02: Implement drift checks for files, commands, permissions, skills, source layers, and profile facts.
- [ ] 04-03: Render packet artifacts through the shared packet renderer and add auditor fixture tests.

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
**Plans**: 2 plans

Plans:
- [ ] 05-01: Write usage, safety, integration, and first-release documentation.
- [ ] 05-02: Run release readiness review, future ai-workspace-kit gate review if available, and document deferred tool criteria.

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

**Coverage:** 45/45 v1 requirements mapped.

## Progress

**Execution Order:** 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Review Packet Standard | 3/3 | Complete | 2026-05-07 |
| 2. Shared Safety Harness | 3/3 | Complete | 2026-05-07 |
| 3. Cross-Repo Capability Request Gate | 0/3 | Not started | - |
| 4. Contract Drift Auditor MVP | 0/3 | Not started | - |
| 5. Integration and Release Hardening | 0/2 | Not started | - |
