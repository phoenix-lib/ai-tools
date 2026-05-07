# Roadmap: AI Tools

## Overview

The v1 roadmap builds one reliable read-only audit pipeline from the inside out:
first the shared review packet contract, then shared safety and deterministic
inspection helpers, then the first external auditor, then integration and
documentation hardening. Later tools stay deferred until the packet standard is
proven by `contract-drift-auditor`.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work.
- Decimal phases (2.1, 2.2): Urgent insertions if needed.

- [ ] **Phase 1: Review Packet Standard** - Define the machine and human output contract every tool will use.
- [ ] **Phase 2: Shared Safety Harness** - Build deterministic read-only inspection primitives and fixture proof.
- [ ] **Phase 3: Contract Drift Auditor MVP** - Ship the first external auditor using the shared packet standard.
- [ ] **Phase 4: Integration and Release Hardening** - Align docs, optional ai-workspace-kit integration, and first-release readiness.

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
- [ ] 01-01: Define review packet schemas and status/severity/confidence taxonomy.
- [ ] 01-02: Define evidence refs, recommended actions, and tool manifest metadata.
- [ ] 01-03: Add canonical JSON guidance, examples, and schema validation tests.

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
- [ ] 02-01: Implement output path guard, ignore policy, file walker, and secret policy.
- [ ] 02-02: Build reusable fixtures and tree-hash mutation checks.
- [ ] 02-03: Add deterministic safety tests for output isolation, secret handling, and ignored generated packets.

### Phase 3: Contract Drift Auditor MVP
**Goal**: Ship a read-only CLI that detects AI contract drift and emits the shared review packet.
**Depends on**: Phase 2
**Requirements**: DRIFT-01, DRIFT-02, DRIFT-03, DRIFT-04, DRIFT-05, DRIFT-06, DRIFT-07, TEST-04
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. User can run `contract-drift-auditor --project <path> --out <dir>` without mutating the target project.
  2. Auditor detects missing referenced files, missing commands, absent-tool permissions, invalid/missing skills, stale source layers, and profile fact drift.
  3. Auditor emits `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, and `RECOMMENDED-ACTIONS.md`.
  4. Each finding cites evidence and unknown facts are marked explicitly.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Implement CLI shell and contract/source discovery.
- [ ] 03-02: Implement drift checks for files, commands, permissions, skills, source layers, and profile facts.
- [ ] 03-03: Render packet artifacts and add auditor fixture tests.

### Phase 4: Integration and Release Hardening
**Goal**: Prepare the first useful release and keep integration optional.
**Depends on**: Phase 3
**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Documentation explains when to use the auditor, when not to use it, and what safety guarantees it provides.
  2. Documentation states `ai-workspace-kit` remains the adoption/bootstrap contract tool and external tools are optional.
  3. First release definition of done is checkable against schemas, one working auditor, deterministic tests, and secret safety.
  4. Later tool selection is deferred with clear criteria based on repeated real demand.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Write usage, safety, integration, and first-release documentation.
- [ ] 04-02: Run release readiness review and document deferred tool criteria.

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| RPS-01 | Phase 1 |
| RPS-02 | Phase 1 |
| RPS-03 | Phase 1 |
| RPS-04 | Phase 1 |
| RPS-05 | Phase 1 |
| RPS-06 | Phase 1 |
| SAFE-01 | Phase 2 |
| SAFE-02 | Phase 2 |
| SAFE-03 | Phase 2 |
| SAFE-04 | Phase 1 |
| SAFE-05 | Phase 2 |
| SAFE-06 | Phase 1 |
| DRIFT-01 | Phase 3 |
| DRIFT-02 | Phase 3 |
| DRIFT-03 | Phase 3 |
| DRIFT-04 | Phase 3 |
| DRIFT-05 | Phase 3 |
| DRIFT-06 | Phase 3 |
| DRIFT-07 | Phase 3 |
| TEST-01 | Phase 1 |
| TEST-02 | Phase 2 |
| TEST-03 | Phase 2 |
| TEST-04 | Phase 3 |
| TEST-05 | Phase 1 |
| TEST-06 | Phase 1 |
| TEST-07 | Phase 2 |
| DOC-01 | Phase 4 |
| DOC-02 | Phase 4 |
| DOC-03 | Phase 4 |
| DOC-04 | Phase 4 |

**Coverage:** 30/30 v1 requirements mapped.

## Progress

**Execution Order:** 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Review Packet Standard | 0/3 | Not started | - |
| 2. Shared Safety Harness | 0/3 | Not started | - |
| 3. Contract Drift Auditor MVP | 0/3 | Not started | - |
| 4. Integration and Release Hardening | 0/2 | Not started | - |
