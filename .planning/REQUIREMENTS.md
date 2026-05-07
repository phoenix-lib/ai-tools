# Requirements: AI Tools

**Defined:** 2026-05-07
**Core Value:** Produce deterministic, evidence-backed review packets that make AI project guidance auditable without mutating target projects.

## v1 Requirements

### Review Packet Standard

- [x] **RPS-01**: Tool consumers can validate `REVIEW-SUMMARY.json` against a documented JSON Schema.
- [x] **RPS-02**: Tool consumers can validate finding objects with severity, confidence, title, summary, evidence refs, and recommended action fields.
- [x] **RPS-03**: Tool consumers can validate evidence refs containing normalized path, hash or path-only marker, optional line, reason, and evidence type.
- [x] **RPS-04**: Tool consumers can validate recommended actions as concrete next steps separate from findings.
- [x] **RPS-05**: Tool consumers can identify tool name, version, schema version, input target, generated files, run timestamp, and policy hashes from packet metadata.
- [x] **RPS-06**: Human reviewers can read packet guidance that explains JSON artifacts as the machine source of truth and Markdown artifacts as projections.

### Packet Rendering

- [ ] **RENDER-01**: A shared packet renderer emits `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, `RECOMMENDED-ACTIONS.md`, and CLI status from one packet model so status and counts cannot diverge.

### Shared Safety and Determinism

- [x] **SAFE-01**: A shared output path guard rejects report output paths inside the audited target project for target-project audits.
- [x] **SAFE-02**: A shared secret policy classifies `.env`, `.env.*`, key, token, credential, and secret-like files as path-only evidence by default.
- [x] **SAFE-03**: A shared ignore policy excludes `.git`, dependency folders, build outputs, coverage, temporary directories, generated review packets, nested checkouts, and fixture expected/output trees unless explicitly targeted.
- [x] **SAFE-04**: A canonical JSON writer emits recursively sorted object keys and a trailing newline.
- [x] **SAFE-05**: A fixture harness can hash target project trees before and after tool runs to prove non-mutation.
- [x] **SAFE-06**: Shared summary rendering keeps CLI status, Markdown status, JSON status, and finding/blocker counts consistent.

### Cross-Repo Capability Requests

- [ ] **XREPO-01**: The project defines `.planning/cross-repo/inbox/`, `.planning/cross-repo/outbox/`, `.planning/cross-repo/decisions/`, and `.planning/cross-repo/templates/` for explicit cross-repo capability coordination.
- [ ] **XREPO-02**: A capability request template captures ID, sender, recipient, status, severity, requested phase/gate, boundary classification, need, evidence, boundary, expected output, compatibility impact, acceptance criteria, non-goals, decision needed, and review/expiry.
- [ ] **XREPO-03**: Boundary classification supports `kit-owned infrastructure`, `interop contract`, `recommendation guidance`, `external ai-tools capability`, and `unclear boundary`.
- [ ] **XREPO-04**: A capability decision template captures request ID, decision, decider, date, target phase, reason, outcome, accepted scope, rejected scope, follow-up, and compatibility notes.
- [ ] **XREPO-05**: Decision statuses include `proposed`, `needs-clarification`, `accepted`, `planned`, `implemented`, `deferred`, `rejected`, `superseded`, and `stale`.
- [ ] **XREPO-06**: Outgoing Need Gate is documented for research/plan stages so AI Tools creates an outbox request instead of implementing a capability owned by `ai-workspace-kit`.
- [ ] **XREPO-07**: Incoming Review Gate is documented for discuss, maintenance, and phase-boundary stages so incoming requests create decision points, not automatic phases or automatic tool runs.
- [ ] **XREPO-08**: Example requests and docs validation prove the protocol covers both directions without repo dependency, copied `.planning` state, automatic integration, or duplicated ownership.

### Workflow Governance

- [ ] **GATE-01**: `CHANGELOG.md` is updated after each completed phase, executed major plan, or workflow gate change with date, phase/plan, changed scope, validation, and upstream impact.
- [ ] **GATE-02**: The ai-workspace-kit upstream freshness gate reads an upstream changelog or release notes first when that artifact exists and changed, and records the absence of such a changelog when it does not exist.
- [ ] **GATE-03**: Release or maintenance gate review uses the future `ai-workspace-kit` gate-review capability when available, with manual review plus cross-repo request/decision fallback when it is not available.
- [ ] **GATE-04**: AI Tools Self-Use Gate documents when validated AI Tools capabilities must be considered while developing AI Tools itself, how to run them read-only, and how to record skip reasons.
- [ ] **GATE-05**: New Tool Intake and Placement Gate classifies every new tool idea by owner, destination, maturity, activation stage, outputs, and non-goals before implementation.
- [ ] **GATE-06**: Git Baseline Gate separates baseline seed/project files from active work before git cleanliness is used as planning, verification, review packet, or release evidence.

### Contract Drift Auditor

- [ ] **DRIFT-01**: A user can run `contract-drift-auditor` in read-only mode with explicit `--project` and `--out` arguments.
- [ ] **DRIFT-02**: The auditor reports missing files referenced by `AGENTS.md`, `CLAUDE.md`, `.planning/*`, or project skills.
- [ ] **DRIFT-03**: The auditor reports commands referenced by contracts when no matching package script or documented command source is found.
- [ ] **DRIFT-04**: The auditor reports permissions that reference absent tools or package managers.
- [ ] **DRIFT-05**: The auditor reports referenced skills that are missing or lack a valid `SKILL.md`.
- [ ] **DRIFT-06**: The auditor reports stale or missing source-layer references and project profile facts that do not match local evidence.
- [ ] **DRIFT-07**: The auditor emits `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, and `RECOMMENDED-ACTIONS.md` using the shared packet standard.

### Test Coverage

- [x] **TEST-01**: Tests prove generated review output is deterministic.
- [x] **TEST-02**: Tests prove target project fixtures are not mutated by review-only commands.
- [x] **TEST-03**: Tests prove secret sentinel strings from secret-like files never appear in output.
- [ ] **TEST-04**: Tests prove stale source-layer and missing command drift are detected.
- [x] **TEST-05**: Tests prove review summary counts match findings across JSON, Markdown, and CLI output.
- [x] **TEST-06**: Tests prove generated packet JSON validates against schemas.
- [x] **TEST-07**: Tests cover clean project, mature project, stale source layer, missing command, secret-like files, mixed package managers, and generated packet inside target tree.

### Integration and Documentation

- [ ] **DOC-01**: Documentation explains when to use `contract-drift-auditor` and when not to use it.
- [ ] **DOC-02**: Documentation explains that `ai-workspace-kit` remains the adoption/bootstrap contract tool and external auditors are optional.
- [ ] **DOC-03**: Documentation explains secret handling, output isolation, evidence refs, severity, confidence, and unknown/stale facts.
- [ ] **DOC-04**: The first release definition of done is documented and references the shared packet schema plus one working external auditor.

## v2 Requirements

### Later Tools

- **LEDGER-01**: User can scan a project into a verified context ledger with FACTS, COMMANDS, CONTRACTS, SKILLS, DECISIONS, EVIDENCE, and CACHE-MANIFEST files.
- **FORENSICS-01**: User can analyze a failed phase by correlating plans, diffs, commits, tests, review artifacts, and feedback.
- **CONFIG-01**: User can validate config matrices across dev/stage/prod evidence.
- **SKILL-01**: User can lint project skills for trigger quality, referenced files, tool assumptions, and contract conflicts.
- **TESTQA-01**: User can audit tests for shallow assertions, over-mocking, missing error paths, and missing domain behavior proof.
- **UIREG-01**: User can compare UI screenshots with layout and interaction checks.
- **GATELINT-01**: User can run an evidence-only mechanical gate linter that reports missing required gate blocks, duplicate gate IDs, stale file paths, missing source layers, missing changelog entries, conflicting required or forbidden wording, unresolved references, and gates without observable artifact output.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Auto-fix mode in v1 | Mutating target projects needs a separate safety design and explicit approval model. |
| Building all seed tools in v1 | Shared standards must be proven before expanding the ecosystem. |
| Installing dependencies in target projects | Auditors should inspect target evidence without mutating project environments. |
| Reading secret-like file contents by default | Secret safety requires path-only evidence unless exact access is requested. |
| Making auditors mandatory for `ai-workspace-kit` | Integration must remain optional and packet-based. |
| LLM-only drift detection | MVP drift checks must be deterministic and evidence-backed. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| RPS-01 | Phase 1 | Complete |
| RPS-02 | Phase 1 | Complete |
| RPS-03 | Phase 1 | Complete |
| RPS-04 | Phase 1 | Complete |
| RPS-05 | Phase 1 | Complete |
| RPS-06 | Phase 1 | Complete |
| RENDER-01 | Phase 4 | Pending |
| SAFE-01 | Phase 2 | Complete |
| SAFE-02 | Phase 2 | Complete |
| SAFE-03 | Phase 2 | Complete |
| SAFE-04 | Phase 1 | Complete |
| SAFE-05 | Phase 2 | Complete |
| SAFE-06 | Phase 1 | Complete |
| XREPO-01 | Phase 3 | Pending |
| XREPO-02 | Phase 3 | Pending |
| XREPO-03 | Phase 3 | Pending |
| XREPO-04 | Phase 3 | Pending |
| XREPO-05 | Phase 3 | Pending |
| XREPO-06 | Phase 3 | Pending |
| XREPO-07 | Phase 3 | Pending |
| XREPO-08 | Phase 3 | Pending |
| GATE-01 | Phase 3 | Pending |
| GATE-02 | Phase 3 | Pending |
| GATE-03 | Phase 5 | Pending |
| GATE-04 | Phase 3 | Pending |
| GATE-05 | Phase 3 | Pending |
| GATE-06 | Phase 3 | Pending |
| DRIFT-01 | Phase 4 | Pending |
| DRIFT-02 | Phase 4 | Pending |
| DRIFT-03 | Phase 4 | Pending |
| DRIFT-04 | Phase 4 | Pending |
| DRIFT-05 | Phase 4 | Pending |
| DRIFT-06 | Phase 4 | Pending |
| DRIFT-07 | Phase 4 | Pending |
| TEST-01 | Phase 1 | Complete |
| TEST-02 | Phase 2 | Complete |
| TEST-03 | Phase 2 | Complete |
| TEST-04 | Phase 4 | Pending |
| TEST-05 | Phase 1 | Complete |
| TEST-06 | Phase 1 | Complete |
| TEST-07 | Phase 2 | Complete |
| DOC-01 | Phase 5 | Pending |
| DOC-02 | Phase 5 | Pending |
| DOC-03 | Phase 5 | Pending |
| DOC-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0

---
*Requirements defined: 2026-05-07*
*Last updated: 2026-05-07 after adding self-use, tool-intake, baseline, and renderer requirements*
