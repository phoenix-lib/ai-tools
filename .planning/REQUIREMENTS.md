# Requirements: AI Tools

**Defined:** 2026-05-07
**Core Value:** Produce deterministic, evidence-backed review packets that make AI project guidance auditable without mutating target projects.

## v1 Requirements

### Review Packet Standard

- [ ] **RPS-01**: Tool consumers can validate `REVIEW-SUMMARY.json` against a documented JSON Schema.
- [ ] **RPS-02**: Tool consumers can validate finding objects with severity, confidence, title, summary, evidence refs, and recommended action fields.
- [ ] **RPS-03**: Tool consumers can validate evidence refs containing normalized path, hash or path-only marker, optional line, reason, and evidence type.
- [ ] **RPS-04**: Tool consumers can validate recommended actions as concrete next steps separate from findings.
- [ ] **RPS-05**: Tool consumers can identify tool name, version, schema version, input target, generated files, run timestamp, and policy hashes from packet metadata.
- [ ] **RPS-06**: Human reviewers can read packet guidance that explains JSON artifacts as the machine source of truth and Markdown artifacts as projections.

### Shared Safety and Determinism

- [ ] **SAFE-01**: A shared output path guard rejects report output paths inside the audited target project for target-project audits.
- [ ] **SAFE-02**: A shared secret policy classifies `.env`, `.env.*`, key, token, credential, and secret-like files as path-only evidence by default.
- [ ] **SAFE-03**: A shared ignore policy excludes `.git`, dependency folders, build outputs, coverage, temporary directories, generated review packets, nested checkouts, and fixture expected/output trees unless explicitly targeted.
- [ ] **SAFE-04**: A canonical JSON writer emits recursively sorted object keys and a trailing newline.
- [ ] **SAFE-05**: A fixture harness can hash target project trees before and after tool runs to prove non-mutation.
- [ ] **SAFE-06**: Shared summary rendering keeps CLI status, Markdown status, JSON status, and finding/blocker counts consistent.

### Contract Drift Auditor

- [ ] **DRIFT-01**: A user can run `contract-drift-auditor` in read-only mode with explicit `--project` and `--out` arguments.
- [ ] **DRIFT-02**: The auditor reports missing files referenced by `AGENTS.md`, `CLAUDE.md`, `.planning/*`, or project skills.
- [ ] **DRIFT-03**: The auditor reports commands referenced by contracts when no matching package script or documented command source is found.
- [ ] **DRIFT-04**: The auditor reports permissions that reference absent tools or package managers.
- [ ] **DRIFT-05**: The auditor reports referenced skills that are missing or lack a valid `SKILL.md`.
- [ ] **DRIFT-06**: The auditor reports stale or missing source-layer references and project profile facts that do not match local evidence.
- [ ] **DRIFT-07**: The auditor emits `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, and `RECOMMENDED-ACTIONS.md` using the shared packet standard.

### Test Coverage

- [ ] **TEST-01**: Tests prove generated review output is deterministic.
- [ ] **TEST-02**: Tests prove target project fixtures are not mutated by review-only commands.
- [ ] **TEST-03**: Tests prove secret sentinel strings from secret-like files never appear in output.
- [ ] **TEST-04**: Tests prove stale source-layer and missing command drift are detected.
- [ ] **TEST-05**: Tests prove review summary counts match findings across JSON, Markdown, and CLI output.
- [ ] **TEST-06**: Tests prove generated packet JSON validates against schemas.
- [ ] **TEST-07**: Tests cover clean project, mature project, stale source layer, missing command, secret-like files, mixed package managers, and generated packet inside target tree.

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
| RPS-01 | Phase 1 | Pending |
| RPS-02 | Phase 1 | Pending |
| RPS-03 | Phase 1 | Pending |
| RPS-04 | Phase 1 | Pending |
| RPS-05 | Phase 1 | Pending |
| RPS-06 | Phase 1 | Pending |
| SAFE-01 | Phase 2 | Pending |
| SAFE-02 | Phase 2 | Pending |
| SAFE-03 | Phase 2 | Pending |
| SAFE-04 | Phase 1 | Pending |
| SAFE-05 | Phase 2 | Pending |
| SAFE-06 | Phase 1 | Pending |
| DRIFT-01 | Phase 3 | Pending |
| DRIFT-02 | Phase 3 | Pending |
| DRIFT-03 | Phase 3 | Pending |
| DRIFT-04 | Phase 3 | Pending |
| DRIFT-05 | Phase 3 | Pending |
| DRIFT-06 | Phase 3 | Pending |
| DRIFT-07 | Phase 3 | Pending |
| TEST-01 | Phase 1 | Pending |
| TEST-02 | Phase 2 | Pending |
| TEST-03 | Phase 2 | Pending |
| TEST-04 | Phase 3 | Pending |
| TEST-05 | Phase 1 | Pending |
| TEST-06 | Phase 1 | Pending |
| TEST-07 | Phase 2 | Pending |
| DOC-01 | Phase 4 | Pending |
| DOC-02 | Phase 4 | Pending |
| DOC-03 | Phase 4 | Pending |
| DOC-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0

---
*Requirements defined: 2026-05-07*
*Last updated: 2026-05-07 after roadmap creation*
