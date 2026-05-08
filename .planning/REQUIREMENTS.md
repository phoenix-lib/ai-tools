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

- [x] **RENDER-01**: A shared packet renderer emits `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, `RECOMMENDED-ACTIONS.md`, and CLI status from one packet model so status and counts cannot diverge.

### Shared Safety and Determinism

- [x] **SAFE-01**: A shared output path guard rejects report output paths inside the audited target project for target-project audits.
- [x] **SAFE-02**: A shared secret policy classifies `.env`, `.env.*`, key, token, credential, and secret-like files as path-only evidence by default.
- [x] **SAFE-03**: A shared ignore policy excludes `.git`, dependency folders, build outputs, coverage, temporary directories, generated review packets, nested checkouts, and fixture expected/output trees unless explicitly targeted.
- [x] **SAFE-04**: A canonical JSON writer emits recursively sorted object keys and a trailing newline.
- [x] **SAFE-05**: A fixture harness can hash target project trees before and after tool runs to prove non-mutation.
- [x] **SAFE-06**: Shared summary rendering keeps CLI status, Markdown status, JSON status, and finding/blocker counts consistent.

### Cross-Repo Capability Requests

- [x] **XREPO-01**: The project defines `.planning/cross-repo/inbox/`, `.planning/cross-repo/outbox/`, `.planning/cross-repo/decisions/`, and `.planning/cross-repo/templates/` for explicit cross-repo capability coordination.
- [x] **XREPO-02**: A capability request template captures ID, sender, recipient, status, severity, requested phase/gate, boundary classification, need, evidence, boundary, expected output, compatibility impact, acceptance criteria, non-goals, decision needed, and review/expiry.
- [x] **XREPO-03**: Boundary classification supports `kit-owned infrastructure`, `interop contract`, `recommendation guidance`, `external ai-tools capability`, and `unclear boundary`.
- [x] **XREPO-04**: A capability decision template captures request ID, decision, decider, date, target phase, reason, outcome, accepted scope, rejected scope, follow-up, and compatibility notes.
- [x] **XREPO-05**: Decision statuses include `proposed`, `needs-clarification`, `accepted`, `planned`, `implemented`, `deferred`, `rejected`, `superseded`, and `stale`.
- [x] **XREPO-06**: Outgoing Need Gate is documented for research/plan stages so AI Tools creates an outbox request instead of implementing a capability owned by `ai-workspace-kit`.
- [x] **XREPO-07**: Incoming Review Gate is documented for discuss, maintenance, and phase-boundary stages so incoming requests create decision points, not automatic phases or automatic tool runs.
- [x] **XREPO-08**: Example requests and docs validation prove the protocol covers both directions without repo dependency, copied `.planning` state, automatic integration, or duplicated ownership.

### Workflow Governance

- [x] **GATE-01**: `CHANGELOG.md` is updated after each completed phase, executed major plan, or workflow gate change with date, phase/plan, changed scope, validation, and upstream impact.
- [x] **GATE-02**: The ai-workspace-kit upstream freshness gate reads an upstream changelog or release notes first when that artifact exists and changed, and records the absence of such a changelog when it does not exist.
- [x] **GATE-03**: Release or maintenance gate review uses the future `ai-workspace-kit` gate-review capability when available, with manual review plus cross-repo request/decision fallback when it is not available.
- [x] **GATE-04**: AI Tools Self-Use Gate documents when validated AI Tools capabilities must be considered while developing AI Tools itself, how to run them read-only, and how to record skip reasons.
- [x] **GATE-05**: New Tool Intake and Placement Gate classifies every new tool idea by owner, destination, maturity, activation stage, outputs, and non-goals before implementation.
- [x] **GATE-06**: Git Baseline Gate separates baseline seed/project files from active work before git cleanliness is used as planning, verification, review packet, or release evidence.

### Contract Drift Auditor

- [x] **DRIFT-01**: A user can run `contract-drift-auditor` in read-only mode with explicit `--project` and `--out` arguments.
- [x] **DRIFT-02**: The auditor reports missing files referenced by `AGENTS.md`, `CLAUDE.md`, `.planning/*`, or project skills.
- [x] **DRIFT-03**: The auditor reports commands referenced by contracts when no matching package script or documented command source is found.
- [x] **DRIFT-04**: The auditor reports permissions that reference absent tools or package managers.
- [x] **DRIFT-05**: The auditor reports referenced skills that are missing or lack a valid `SKILL.md`.
- [x] **DRIFT-06**: The auditor reports stale or missing source-layer references and project profile facts that do not match local evidence.
- [x] **DRIFT-07**: The auditor emits `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, and `RECOMMENDED-ACTIONS.md` using the shared packet standard.

### Test Coverage

- [x] **TEST-01**: Tests prove generated review output is deterministic.
- [x] **TEST-02**: Tests prove target project fixtures are not mutated by review-only commands.
- [x] **TEST-03**: Tests prove secret sentinel strings from secret-like files never appear in output.
- [x] **TEST-04**: Tests prove stale source-layer and missing command drift are detected.
- [x] **TEST-05**: Tests prove review summary counts match findings across JSON, Markdown, and CLI output.
- [x] **TEST-06**: Tests prove generated packet JSON validates against schemas.
- [x] **TEST-07**: Tests cover clean project, mature project, stale source layer, missing command, secret-like files, mixed package managers, and generated packet inside target tree.

### Integration and Documentation

- [x] **DOC-01**: Documentation explains when to use `contract-drift-auditor` and when not to use it.
- [x] **DOC-02**: Documentation explains that `ai-workspace-kit` remains the adoption/bootstrap contract tool and external auditors are optional.
- [x] **DOC-03**: Documentation explains secret handling, output isolation, evidence refs, severity, confidence, and unknown/stale facts.
- [x] **DOC-04**: The first release definition of done is documented and references the shared packet schema plus one working external auditor.

## v2 Requirements

### Release Discipline and Tool Metadata

- **REL-05**: First-release docs are consistent after Phase 5 self-audit hardening, including updated `contract-drift-auditor` limitations that distinguish historical phase artifacts from remaining low-severity current-doc caveats.
- **REL-06**: `contract-drift-auditor` has release packet fixtures that demonstrate `pass`, `human_review_required`, and safety-blocked output shapes using the shared review packet artifacts.
- **META-01**: Tool metadata and protocol versions are centralized so package version, tool version, review packet schema version, artifact names, and policy identifiers do not silently drift between code, docs, examples, and tests.
- **SELF-01**: Self-audit invocation is documented as a safe command pattern that requires an explicit external `--out` from the caller and does not hard-code a machine-local path.

### CLI and Consumer Ergonomics

- **CLI-01**: `contract-drift-auditor` supports stable machine stdout mode for CI or assistant consumers without replacing packet artifacts as the source of truth.
- **CLI-02**: `contract-drift-auditor` supports quiet mode and documented `--fail-on blocked|human_review_required|never` behavior with stable exit codes while keeping default findings evidence-only.
- **REG-01**: AI Tools has a machine-readable tool registry that records each capability's owner, destination, maturity, self-use stage, required outputs, activation gate, and non-goals before broad tool expansion.
- **GOV-01**: The root `AGENTS.md` entrypoint is slimmed by moving detailed gate policy prose into dedicated workflow gate documentation while preserving hard rules and source-layer links.

### Later Tools

- **XREPO-VALIDATOR-01**: User can run a read-only cross-repo compatibility checker over sibling `ai-tools` and `ai-workspace-kit` checkouts that groups requests by `Thread ID`, validates reciprocal `Counterpart ID` and repo-qualified `Counterpart path`, enforces `Origin` / `Mirror required` rules, verifies decisions for manual-transfer requests, checks protocol version fields, and reports gate registry field/stage mapping drift without installing, running, or depending on the neighboring repository.
- **LEDGER-01**: User can scan a project into a verified context ledger with FACTS, COMMANDS, CONTRACTS, SKILLS, DECISIONS, EVIDENCE, and CACHE-MANIFEST files.
- **FORENSICS-01**: User can analyze a failed phase by correlating plans, diffs, commits, tests, review artifacts, and feedback.
- **CONFIG-01**: User can validate config matrices across dev/stage/prod evidence.
- **SKILL-01**: User can lint project skills for trigger quality, referenced files, tool assumptions, and contract conflicts.
- **TESTQA-01**: User can audit tests for shallow assertions, over-mocking, missing error paths, and missing domain behavior proof.
- **UIREG-01**: User can compare UI screenshots with layout and interaction checks.
- **GATELINT-01**: User can run an evidence-only mechanical gate linter that reports missing required gate blocks, duplicate gate IDs, stale file paths, missing source layers, missing changelog entries, conflicting required or forbidden wording, unresolved references, and gates without observable artifact output.

## v2.1 Requirements

### Review Packet Rollup Consumer

- [x] **ROLLUP-01**: User can run `review-packet-rollup --packets <dir...> --out <dir>` over two or more existing review packet directories without mutating any packet source or target project.
- [x] **ROLLUP-02**: Tool consumers can validate every input `REVIEW-SUMMARY.json` and `EVIDENCE.json` before aggregation, with invalid or missing packet artifacts reported as findings.
- [x] **ROLLUP-03**: Tool consumers can view combined counts grouped mechanically by source tool, status, severity, `source_check_id`, `status_contribution`, and source path.
- [x] **ROLLUP-04**: Human reviewers can see blockers, required decisions, and `human_review_required` contributors separated from low-severity informational groups.
- [x] **ROLLUP-05**: Tool consumers can inspect rollup provenance through packet input paths, input hashes, source tool names, tool versions, schema versions, and generated `PACKET-INDEX.json` / `ROLLUP-GROUPS.json` artifacts.
- [x] **ROLLUP-06**: The rollup does not decide that findings are safe to ignore, suppress source findings, or turn evidence into automatic gate, roadmap, or merge decisions.

### Ledger Artifact Schemas

- [x] **LEDGER-SCHEMA-01**: Tool consumers can validate `FACTS.json` entries with evidence refs, confidence, source hash, source category, and last checked timestamp.
- [x] **LEDGER-SCHEMA-02**: Tool consumers can validate `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, and `DECISIONS.json` with stable IDs, evidence refs, confidence, and source metadata.
- [x] **LEDGER-SCHEMA-03**: Tool consumers can validate `CACHE-MANIFEST.json` with tool version, schema version, scanned roots, source hashes, generated artifact list, and excluded path policy metadata.
- [ ] **LEDGER-SCHEMA-04**: `project-context-ledger` tests prove generated ledger artifacts validate against the schemas and remain deterministic.

### Review Disposition Model

- [ ] **DISP-01**: Human reviewers can record a disposition for a specific finding without deleting or rewriting the original source finding.
- [ ] **DISP-02**: Dispositions require finding ID, source tool, source path, source check ID, reason, owner, reviewed timestamp, expiry timestamp, evidence refs, tool version, and schema version.
- [ ] **DISP-03**: Expired or stale dispositions remain visible as review-required context instead of silently suppressing findings.
- [ ] **DISP-04**: Packet consumers can join dispositions to findings as separate human review metadata while preserving original severity, status contribution, and evidence.

### Ledger Scope and Diff Modes

- [ ] **LEDGER-SCOPE-01**: User can run `project-context-ledger` with `--scope current|planning|history|all` to choose whether current source-of-truth files, planning files, historical phase artifacts, or all supported sources are scanned.
- [ ] **LEDGER-SCOPE-02**: User can run `project-context-ledger --since-manifest <CACHE-MANIFEST.json>` to report changed, added, removed, stale, and unchanged facts.
- [ ] **LEDGER-SCOPE-03**: Current scope treats historical `.planning/phases/**` artifacts as history by default so prior phase references do not dominate current source-of-truth findings.
- [ ] **LEDGER-SCOPE-04**: Ledger findings distinguish real references from examples, placeholders, `n/a`, and generated packet artifacts to reduce false positives.

### Shared CLI Contract

- [ ] **CLI-CONTRACT-01**: Validated report CLIs share parsing for `--project`, `--out`, `--format json`, `--quiet`, and `--fail-on blocked|human_review_required|never` where applicable.
- [ ] **CLI-CONTRACT-02**: Validated report CLIs render compact machine stdout from the same summary object used for packet artifacts.
- [ ] **CLI-CONTRACT-03**: Validated report CLIs use documented stable exit codes while default behavior remains evidence-only and non-breaking.
- [ ] **CLI-CONTRACT-04**: Validated report CLIs reject mutating flags consistently and keep help text aligned with review-only safety rules.
- [ ] **CLI-CONTRACT-05**: Shared CLI tests cover Windows behavior, quiet mode, JSON stdout, fail policy, help, and mutating flag rejection across validated tools.

### ai-workspace-kit LLM Instruction Compatibility

- [ ] **KITLLM-01**: Cross-repo compatibility checks can inspect `.external/ai-workspace-kit/LLM-PROJECT-INSTRUCTIONS.json` and schema evidence when present.
- [ ] **KITLLM-02**: The checker reports if kit LLM instructions recommend AI Tools as a dependency, package runner, hidden trigger, automatic gate decision layer, or source of roadmap mutation.
- [ ] **KITLLM-03**: The checker reports whether kit LLM instructions describe AI Tools review packets as optional evidence compatible with `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and `RECOMMENDED-ACTIONS.md`.

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
| RENDER-01 | Phase 4 | Complete |
| SAFE-01 | Phase 2 | Complete |
| SAFE-02 | Phase 2 | Complete |
| SAFE-03 | Phase 2 | Complete |
| SAFE-04 | Phase 1 | Complete |
| SAFE-05 | Phase 2 | Complete |
| SAFE-06 | Phase 1 | Complete |
| XREPO-01 | Phase 3 | Complete |
| XREPO-02 | Phase 3 | Complete |
| XREPO-03 | Phase 3 | Complete |
| XREPO-04 | Phase 3 | Complete |
| XREPO-05 | Phase 3 | Complete |
| XREPO-06 | Phase 3 | Complete |
| XREPO-07 | Phase 3 | Complete |
| XREPO-08 | Phase 3 | Complete |
| GATE-01 | Phase 3 | Complete |
| GATE-02 | Phase 3 | Complete |
| GATE-03 | Phase 5 | Complete |
| GATE-04 | Phase 3 | Complete |
| GATE-05 | Phase 3 | Complete |
| GATE-06 | Phase 3 | Complete |
| DRIFT-01 | Phase 4 | Complete |
| DRIFT-02 | Phase 4 | Complete |
| DRIFT-03 | Phase 4 | Complete |
| DRIFT-04 | Phase 4 | Complete |
| DRIFT-05 | Phase 4 | Complete |
| DRIFT-06 | Phase 4 | Complete |
| DRIFT-07 | Phase 4 | Complete |
| TEST-01 | Phase 1 | Complete |
| TEST-02 | Phase 2 | Complete |
| TEST-03 | Phase 2 | Complete |
| TEST-04 | Phase 4 | Complete |
| TEST-05 | Phase 1 | Complete |
| TEST-06 | Phase 1 | Complete |
| TEST-07 | Phase 2 | Complete |
| DOC-01 | Phase 5 | Complete |
| DOC-02 | Phase 5 | Complete |
| DOC-03 | Phase 5 | Complete |
| DOC-04 | Phase 5 | Complete |
| REL-05 | Phase 6 | Complete |
| REL-06 | Phase 6 | Complete |
| META-01 | Phase 6 | Complete |
| SELF-01 | Phase 6 | Complete |
| XREPO-VALIDATOR-01 | Phase 7 | Complete |
| CLI-01 | Phase 8 | Complete |
| CLI-02 | Phase 8 | Complete |
| REG-01 | Phase 9 | Complete |
| GOV-01 | Phase 9 | Complete |
| GATELINT-01 | Phase 10 | Complete |
| LEDGER-01 | Phase 12 | Complete |
| ROLLUP-01 | Phase 13 | Complete |
| ROLLUP-02 | Phase 13 | Complete |
| ROLLUP-03 | Phase 13 | Complete |
| ROLLUP-04 | Phase 13 | Complete |
| ROLLUP-05 | Phase 13 | Complete |
| ROLLUP-06 | Phase 13 | Complete |
| LEDGER-SCHEMA-01 | Phase 14 | Planned |
| LEDGER-SCHEMA-02 | Phase 14 | Planned |
| LEDGER-SCHEMA-03 | Phase 14 | Planned |
| LEDGER-SCHEMA-04 | Phase 14 | Planned |
| DISP-01 | Phase 15 | Planned |
| DISP-02 | Phase 15 | Planned |
| DISP-03 | Phase 15 | Planned |
| DISP-04 | Phase 15 | Planned |
| LEDGER-SCOPE-01 | Phase 16 | Planned |
| LEDGER-SCOPE-02 | Phase 16 | Planned |
| LEDGER-SCOPE-03 | Phase 16 | Planned |
| LEDGER-SCOPE-04 | Phase 16 | Planned |
| CLI-CONTRACT-01 | Phase 17 | Planned |
| CLI-CONTRACT-02 | Phase 17 | Planned |
| CLI-CONTRACT-03 | Phase 17 | Planned |
| CLI-CONTRACT-04 | Phase 17 | Planned |
| CLI-CONTRACT-05 | Phase 17 | Planned |
| KITLLM-01 | Phase 18 | Planned |
| KITLLM-02 | Phase 18 | Planned |
| KITLLM-03 | Phase 18 | Planned |
| FORENSICS-01 | Future | Deferred - trigger: failed phases, rollbacks, disputed verification, or repeated plan/reality mismatches |
| CONFIG-01 | Future | Deferred - trigger: config-heavy environment or deployment/refactor evidence |
| SKILL-01 | Future | Deferred - trigger: project skills become active maintained artifacts |
| TESTQA-01 | Future | Deferred - trigger: repeated shallow-test, over-mocking, or missed-behavior evidence |
| UIREG-01 | Future | Deferred - trigger: frontend or UI regression evidence demand |

**Coverage:**
- v1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0
- v2.1 requirements: 26 total
- v2.1 mapped to planned phases: 26

---
*Requirements defined: 2026-05-07*
*Last updated: 2026-05-08 after starting milestone v2.1 Evidence Consumption & Signal Quality*
