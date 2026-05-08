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

The v2.1 roadmap shifts from producing more evidence to consuming evidence
well. It starts with a strictly mechanical packet rollup, then stabilizes ledger
schemas, adds human review disposition metadata, reduces ledger noise through
scope/diff modes, unifies validated CLI behavior, and checks the new
`ai-workspace-kit` LLM instruction surface without making AI Tools a runtime
dependency.

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
- [x] **Phase 10: Evidence-Only Gate Linter Seed MVP** - Build or formally re-defer the mechanical gate-linter only after the cross-repo validator and tool registry are in place. Completed 2026-05-08.
- [x] **Phase 11: v2 Tool Selection Review** - Reassess deferred seed tools and choose the next single tool only from repeated evidence-backed demand. (completed 2026-05-08)
- [x] **Phase 12: Project Context Ledger MVP** - Build the selected read-only verified project memory tool from Phase 11. (completed 2026-05-08)
- [x] **Phase 13: Review Packet Rollup MVP** - Build a mechanical packet consumer that validates and aggregates multiple review packets without semantic suppression. (completed 2026-05-08)
- [x] **Phase 14: Ledger Artifact Schemas** - Stabilize machine-readable schemas for project-context-ledger artifacts before other tools consume them. (completed 2026-05-08)
- [ ] **Phase 15: Review Disposition Model** - Add explicit human review disposition metadata with owner, expiry, and evidence refs.
- [ ] **Phase 16: Ledger Scope and Diff Modes** - Reduce ledger noise with current/planning/history scopes and since-manifest diffs.
- [ ] **Phase 17: Shared CLI Contract** - Apply one CLI contract across validated report tools.
- [ ] **Phase 18: ai-workspace-kit LLM Instructions Compatibility** - Validate optional AI Tools evidence wording in upstream LLM project instructions.

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
- Phase 10 may promote `gates-scan` / `GATELINT-01` only as evidence-only
  mechanical review, not semantic gate automation.

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
**Wave 1**
- [x] 10-01: Revalidate gate-linter boundary and fixture scope against `ai-workspace-kit`.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 10-02: Implement minimal evidence-only linter or record explicit deferred decision.

Cross-cutting constraints:
- Keep `gates-scan` as AI Tools-owned external mechanical evidence.
- Do not implement semantic gate adoption, revision, rejection, automatic GSD
  execution, phase creation, kit dependency, or target-project mutation.
- Emit standard review packet artifacts from shared packet mechanics.

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
- [x] 11-01: Run evidence-backed v2 seed review and promote one next tool or defer all.

### Phase 12: Project Context Ledger MVP
**Goal**: Build a read-only project context ledger that scans a project into verified fact, command, contract, skill, decision, evidence, and cache manifest artifacts.
**Depends on**: Phase 11
**Requirements**: LEDGER-01
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. User can run `project-context-ledger --project <path> --out <dir>` or the final planned equivalent without mutating the target project.
  2. The ledger emits shared review packet artifacts plus `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, `DECISIONS.json`, `EVIDENCE.json`, and `CACHE-MANIFEST.json`.
  3. Facts include evidence refs, confidence, source hash, and last checked timestamp.
  4. Secret-like files remain path-only and generated review packets inside target trees are ignored.
  5. The tool is optional evidence only and does not replace reading relevant source files or make automatic workflow decisions.
**Plans**: 1 plan

Plans:
**Wave 1**
- [x] 12-01: Implement the selected project context ledger MVP.

### Phase 13: Review Packet Rollup MVP
**Goal**: Build a strictly mechanical consumer for multiple review packet directories.
**Depends on**: Phase 12
**Requirements**: ROLLUP-01, ROLLUP-02, ROLLUP-03, ROLLUP-04, ROLLUP-05, ROLLUP-06
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. User can run `review-packet-rollup --packets <dir...> --out <dir>` with at least two packet directories and no target-project mutation.
  2. Input `REVIEW-SUMMARY.json` and `EVIDENCE.json` artifacts are validated before aggregation.
  3. Output groups findings by source tool, status, severity, `source_check_id`, `status_contribution`, and source path.
  4. Blockers, required decisions, and `human_review_required` contributors are listed separately.
  5. Output includes standard review packet artifacts plus `PACKET-INDEX.json` and `ROLLUP-GROUPS.json` with packet provenance and input hashes.
  6. The tool never marks findings safe-to-ignore, suppresses findings, or makes gate/merge/roadmap decisions.
**Plans**: 2 plans

Plans:
**Wave 1**
- [x] 13-01: Define rollup fixtures, input validation, packet provenance, and grouping model.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 13-02: Implement rollup CLI, packet rendering, docs, registry metadata, tests, and self-use evidence.

### Phase 14: Ledger Artifact Schemas
**Goal**: Make ledger artifacts safe for downstream consumers by adding stable JSON schemas and validation tests.
**Depends on**: Phase 13
**Requirements**: LEDGER-SCHEMA-01, LEDGER-SCHEMA-02, LEDGER-SCHEMA-03, LEDGER-SCHEMA-04
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Schemas exist for `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, `DECISIONS.json`, and `CACHE-MANIFEST.json`.
  2. Schemas require IDs, evidence refs, confidence, source metadata, and version fields where applicable.
  3. `project-context-ledger` generated artifacts validate against the schemas.
  4. Fixtures prove deterministic schema-valid ledger output.
**Plans**: 2 plans

Plans:
**Wave 1**
- [x] 14-01: Define ledger artifact schemas and fixture expectations.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 14-02: Wire ledger schema validation into tests, docs, and generated artifact checks.

### Phase 15: Review Disposition Model
**Goal**: Add explicit human review context for findings without suppressing original evidence.
**Depends on**: Phase 14
**Requirements**: DISP-01, DISP-02, DISP-03, DISP-04
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. A review disposition schema captures finding identity, reason, owner, review time, expiry, evidence refs, tool version, and schema version.
  2. Dispositions can be joined to packet findings while preserving original severity, status contribution, and evidence refs.
  3. Expired dispositions are reported as stale review context.
  4. Docs describe dispositions as human review metadata, not suppression or automatic ignore policy.
**Plans**: 2 plans

Plans:
**Wave 1**
- [ ] 15-01: Define review disposition schema, examples, and lifecycle rules.

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 15-02: Add disposition consumption to packet consumers with tests for expired and stale entries.

### Phase 16: Ledger Scope and Diff Modes
**Goal**: Reduce project-context-ledger noise and make changed facts easier to review.
**Depends on**: Phase 14
**Requirements**: LEDGER-SCOPE-01, LEDGER-SCOPE-02, LEDGER-SCOPE-03, LEDGER-SCOPE-04
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Ledger supports `--scope current|planning|history|all`.
  2. Ledger supports `--since-manifest <CACHE-MANIFEST.json>` and reports changed, added, removed, stale, and unchanged facts.
  3. Historical `.planning/phases/**` artifacts are categorized as history and excluded from current scope by default.
  4. Examples, placeholders, `n/a`, and generated packet artifacts are classified so they do not inflate current findings.
**Plans**: 2 plans

Plans:
**Wave 1**
- [ ] 16-01: Add ledger source categories, scope filtering, and current/history fixture coverage.

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 16-02: Add since-manifest diff mode, changed-fact reporting, docs, and self-use evidence.

### Phase 17: Shared CLI Contract
**Goal**: Unify report CLI ergonomics across validated AI Tools without changing evidence-only defaults.
**Depends on**: Phase 13
**Requirements**: CLI-CONTRACT-01, CLI-CONTRACT-02, CLI-CONTRACT-03, CLI-CONTRACT-04, CLI-CONTRACT-05
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. A shared CLI helper covers common parsing, help text, machine JSON stdout, quiet mode, fail policy, and mutating flag rejection.
  2. `contract-drift-auditor`, `cross-repo-compatibility-checker`, `gates-scan`, `project-context-ledger`, and `review-packet-rollup` use the shared contract where applicable.
  3. Default CLI behavior remains evidence-only and non-breaking.
  4. Tests cover Windows behavior, exit policy, quiet mode, JSON stdout, help text, and mutating flag rejection.
**Plans**: 2 plans

Plans:
**Wave 1**
- [ ] 17-01: Extract shared CLI contract helper and migrate one representative tool.

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 17-02: Migrate remaining validated tools, update docs/examples, and add cross-tool CLI tests.

### Phase 18: ai-workspace-kit LLM Instructions Compatibility
**Goal**: Keep new upstream LLM instruction guidance compatible with AI Tools as optional evidence only.
**Depends on**: Phase 17
**Requirements**: KITLLM-01, KITLLM-02, KITLLM-03
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Cross-repo compatibility checker reads `.external/ai-workspace-kit/LLM-PROJECT-INSTRUCTIONS.json` and its schema when present in `ai-workspace-kit`.
  2. Checker reports if upstream instructions describe AI Tools as dependency, package runner, hidden trigger, automatic decision authority, or roadmap mutator.
  3. Checker reports whether upstream instructions keep AI Tools review packets optional and compatible with standard packet artifact names.
  4. Output remains review packet evidence only and does not run or install either repository.
**Plans**: 1 plan

Plans:
**Wave 1**
- [ ] 18-01: Add ai-workspace-kit LLM instruction compatibility checks, fixtures, docs, and self-use evidence.

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
| LEDGER-01 | Phase 12 |
| ROLLUP-01 | Phase 13 |
| ROLLUP-02 | Phase 13 |
| ROLLUP-03 | Phase 13 |
| ROLLUP-04 | Phase 13 |
| ROLLUP-05 | Phase 13 |
| ROLLUP-06 | Phase 13 |
| LEDGER-SCHEMA-01 | Phase 14 |
| LEDGER-SCHEMA-02 | Phase 14 |
| LEDGER-SCHEMA-03 | Phase 14 |
| LEDGER-SCHEMA-04 | Phase 14 |
| DISP-01 | Phase 15 |
| DISP-02 | Phase 15 |
| DISP-03 | Phase 15 |
| DISP-04 | Phase 15 |
| LEDGER-SCOPE-01 | Phase 16 |
| LEDGER-SCOPE-02 | Phase 16 |
| LEDGER-SCOPE-03 | Phase 16 |
| LEDGER-SCOPE-04 | Phase 16 |
| CLI-CONTRACT-01 | Phase 17 |
| CLI-CONTRACT-02 | Phase 17 |
| CLI-CONTRACT-03 | Phase 17 |
| CLI-CONTRACT-04 | Phase 17 |
| CLI-CONTRACT-05 | Phase 17 |
| KITLLM-01 | Phase 18 |
| KITLLM-02 | Phase 18 |
| KITLLM-03 | Phase 18 |
| FORENSICS-01 | Future |
| CONFIG-01 | Future |
| SKILL-01 | Future |
| TESTQA-01 | Future |
| UIREG-01 | Future |

**Coverage:**
- v1: 45/45 requirements mapped and complete.
- v2 preliminary: 16/16 requirements mapped to complete, planned, or deferred phases.
- v2.1: 26/26 requirements mapped to planned phases 13-18.

## Gate Resolution

### upstream-freshness

- **Status:** Resolved for v2.1 planning.
- **Local commit before update:** `bbb009a7274a9fc8648431789b7ff4b5154015b3`.
- **Remote HEAD:** `683afc795a4554ac0689418a2ad6246ac9694e3a`.
- **Update action:** Fast-forwarded `.external/ai-workspace-kit` to `683afc795a4554ac0689418a2ad6246ac9694e3a` with user-approved `git -C .external\ai-workspace-kit pull --ff-only`.
- **Changelog status:** Upstream `.external/ai-workspace-kit/CHANGELOG.md` reviewed. It records `.external/ai-workspace-kit/LLM-PROJECT-INSTRUCTIONS.json`, `.external/ai-workspace-kit/schemas/llm-project-instructions.schema.json`, and no `ai-tools` runtime dependency.
- **Changed source layers:** `.external/ai-workspace-kit/AGENTS.md`, `.external/ai-workspace-kit/AI-BOOTSTRAP.md`, `.external/ai-workspace-kit/AI-WORKSPACE-CONTRACT.json`, `.external/ai-workspace-kit/CHANGELOG.md`, `.external/ai-workspace-kit/CONSUMER-CONFIDENCE-CHECKLIST.md`, `.external/ai-workspace-kit/LLM-PROJECT-INSTRUCTIONS.json`, `.external/ai-workspace-kit/QUICKSTART.md`, `.external/ai-workspace-kit/README.md`, `.external/ai-workspace-kit/schemas/llm-project-instructions.schema.json`, `.external/ai-workspace-kit/scripts/doctor.js`, and related tests.
- **Planning impact:** Added Phase 18 to validate that upstream LLM instructions describe AI Tools as optional evidence only.
- **Boundary decision:** AI Tools may check optional evidence wording; `ai-workspace-kit` still owns adoption/bootstrap and generated local guidance.
- **No install/run/dependency confirmation:** No package install, target-project mutation, or runtime dependency was introduced.

### new-tool-intake

- **Status:** Resolved for Review Packet Rollup MVP planning.
- **Owner:** `ai-tools`.
- **Destination:** `tools/review-packet-rollup/` plus shared packet mechanics where reusable.
- **Maturity:** Validated in Phase 13.
- **Activation stage:** plan, verify, phase-boundary, maintenance.
- **Outputs:** Standard review packet artifacts plus `PACKET-INDEX.json` and `ROLLUP-GROUPS.json`.
- **Non-goals:** No semantic suppression, no safe-to-ignore decisions, no target-project mutation, no automatic gate/merge/roadmap decisions, and no `ai-workspace-kit` dependency.
- **Decision:** Implement as a packet consumer, not another domain auditor.

### self-use

- **Status:** Resolved for Phase 13 execution.
- **Capability:** Validated packet producers, `project-context-ledger`, and
  `review-packet-rollup` evidence.
- **Maturity:** `contract-drift-auditor`,
  `cross-repo-compatibility-checker`, `gates-scan`,
  `project-context-ledger`, and `review-packet-rollup` are validated.
- **Run or skip reason:** Ran applicable validated tools read-only after
  writing the v2.1 planning artifacts, then ran `review-packet-rollup` during
  Phase 13 verification.
- **Evidence summary:** `project-context-ledger` wrote
  `C:\Users\suppo\.codex\memories\ai-tools-v21-ledger-20260508-final` with
  `human_review_required`, 299 findings, 0 blockers, and 0 required decisions.
  `gates-scan` wrote
  `C:\Users\suppo\.codex\memories\ai-tools-v21-gates-scan-20260508-final` with
  `human_review_required`, 26 findings, 0 blockers, and 0 required decisions.
  `contract-drift-auditor` wrote
  `C:\Users\suppo\.codex\memories\ai-tools-v21-contract-drift-20260508-final`
  with `human_review_required`, 75 low findings, 0 blockers, and 0 required
  decisions. `cross-repo-compatibility-checker` wrote
  `C:\Users\suppo\.codex\memories\ai-tools-v21-cross-repo-20260508-final` with
  `human_review_required`, 1 medium finding, 0 blockers, and 0 required
  decisions. `review-packet-rollup` wrote
  `C:\Users\suppo\.codex\memories\ai-tools-review-packet-rollup-phase13` with
  `human_review_required`, 401 findings, 0 blockers, and 0 required decisions.
- **Planning impact:** Findings support v2.1's focus on schemas, scope/diff,
  dispositions, and CLI consistency; no finding blocks the milestone.

## Progress

**Execution Order:** 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18

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
| 10. Evidence-Only Gate Linter Seed MVP | 2/2 | Complete | 2026-05-08 |
| 11. v2 Tool Selection Review | 1/1 | Complete    | 2026-05-08 |
| 12. Project Context Ledger MVP | 1/1 | Complete    | 2026-05-08 |
| 13. Review Packet Rollup MVP | 2/2 | Complete    | 2026-05-08 |
| 14. Ledger Artifact Schemas | 2/2 | Complete    | 2026-05-08 |
| 15. Review Disposition Model | 0/2 | Planned | |
| 16. Ledger Scope and Diff Modes | 0/2 | Planned | |
| 17. Shared CLI Contract | 0/2 | Planned | |
| 18. ai-workspace-kit LLM Instructions Compatibility | 0/1 | Planned | |
