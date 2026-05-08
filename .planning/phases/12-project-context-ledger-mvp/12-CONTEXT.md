# Phase 12: Project Context Ledger MVP - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

## Phase Boundary

Phase 12 builds the selected `project-context-ledger` MVP as a read-only
external AI Tools capability. The phase must let a user scan a target project
with an explicit project path and explicit external output directory, then emit
standard review packet artifacts plus ledger-specific JSON artifacts for
facts, commands, contracts, skills, decisions, and cache/source hashes.

The phase implements LEDGER-01. It does not implement the broader future
`ctx brief`, `ctx diff`, or `ctx evidence` workflows from the seed file unless
planning proves they are required to satisfy the scan MVP.

## Gate Resolution

### Discuss Mode Gate

- **Status:** passed
- **Registered gate:** `discuss-mode`
- **Mode selected:** Trusted Self-Questioning
- **Selected by:** user
- **Approval source:** user replied `2` after the Phase 12 discuss-mode choice
  prompt on 2026-05-08.
- **Evidence:** `AGENTS.md` requires resolving `discuss-mode` before Phase
  discussion artifacts; `.planning/gates/registry.json` defines the gate and
  required fields; `workflow.discuss_mode` was checked and treated as routing
  only.
- **Cycle limits:** one focused self-questioning pass over MVP command shape,
  artifact contract, extraction scope, fact confidence, stale/cache behavior,
  safety boundaries, validation, self-use, and deferred seed behavior.
- **Routing-only acknowledgement:** `workflow.discuss_mode` is not user
  approval for Manual Questions or Trusted Self-Questioning.

Required field mirror:

- `mode`: Trusted Self-Questioning
- `selected_by`: user
- `approval_source`: user replied `2` after the Phase 12 discuss-mode choice
  prompt on 2026-05-08
- `evidence`: `AGENTS.md`, `.planning/gates/registry.json`, and routing-only
  `workflow.discuss_mode` check
- `cycle_limits_or_skip_reason`: one focused self-questioning pass
- `workflow_discuss_mode_is_routing_only`: true

### New Tool Intake and Placement Gate

- **Status:** passed from Phase 11; reaffirmed for Phase 12 planning.
- **Resolution:** implement the already selected AI Tools-owned external
  read-only tool `project-context-ledger` under `tools/project-context-ledger/`.
- **Evidence:** `tools/registry.json` marks `project-context-ledger` as
  `planned`; `.planning/phases/11-v2-tool-selection-review/11-SELECTION-REVIEW.md`
  records owner, destination, outputs, non-goals, fixture seed, and rationale.

### AI Tools Self-Use Gate

- **Status:** applies during execution and verification.
- **Resolution:** Phase 12 should run validated self-use tools after
  implementation changes. `gates-scan` and `contract-drift-auditor` are
  evidence only. After the ledger is implemented and validated, a self-scan of
  this repository should also be recorded as evidence, not authority.

### Cross-Repo Boundary

- **Status:** skipped with reason.
- **Reason:** the ledger is AI Tools-owned optional external evidence. It must
  not duplicate `ai-workspace-kit` adoption/bootstrap, adapter generation,
  generated-contract review, or semantic workflow approval behavior.

## Implementation Decisions

### Command Surface

- **D-01:** Prefer the Phase 11 command shape:
  `project-context-ledger --project <path> --out <dir>`.
- **D-02:** Require both `--project` and `--out`; reject output paths inside
  the scanned target project before writing artifacts.
- **D-03:** Keep the CLI review-only. Reject mutating or network-like flags
  such as `--fix`, `--write`, `--pull`, `--fetch`, and `--install`.
- **D-04:** Support `--help` and human completion stdout. Machine stdout,
  quiet mode, and fail policy may be deferred unless planning finds a small
  reuse path from `contract-drift-auditor` with low risk.

### Artifact Contract

- **D-05:** Emit the standard review packet artifacts from the shared packet
  renderer: `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md`.
- **D-06:** Emit ledger artifacts with canonical JSON and trailing newlines:
  `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`,
  `DECISIONS.json`, and `CACHE-MANIFEST.json`.
- **D-07:** Use `EVIDENCE.json` as the shared evidence source. Ledger records
  should reference evidence ids instead of creating a second incompatible
  evidence format.
- **D-08:** Keep JSON models structured and deterministic. Prefer arrays sorted
  by stable ids or normalized paths over object insertion order from filesystem
  traversal.

### Extraction Scope

- **D-09:** The MVP should extract deterministic local evidence only. It should
  not generate broad AI prose summaries or infer hidden project intent.
- **D-10:** Initial source categories are project identity facts, package bins
  and scripts, assistant contracts, planning state and roadmap decisions,
  project skill references when present, tool registry entries, and generated
  review packet references.
- **D-11:** Assistant contracts include root guidance such as `AGENTS.md`,
  `CLAUDE.md`, and project-local equivalents when present. Do not recurse into
  secret-like contents.
- **D-12:** Generated packet directories inside the scanned target should be
  ignored as source input while the ledger itself writes packet artifacts only
  to the external output directory.

### Fact And Cache Model

- **D-13:** Each fact should include a stable id, type/category, value or
  concise fact text, evidence refs, confidence, source path, source hash, and
  last checked timestamp.
- **D-14:** Use confidence values from Phase 11: `verified`, `inferred`,
  `unknown`, and `stale`.
- **D-15:** Prefer `verified` only when the fact is directly supported by a
  current source. Use `inferred` only for narrow deterministic derivations such
  as package bin command names from `package.json`.
- **D-16:** The cache manifest should record scanned source paths, hashes,
  ignored generated packet locations, path-only secret evidence, policy hashes,
  run timestamp, and tool/version metadata.
- **D-17:** Stale behavior should be hash-based where prior ledger output is
  available, and evidence-gap based where references point to missing files,
  missing commands, or unavailable current sources.

### Safety

- **D-18:** Reuse shared safety primitives where applicable:
  `shared/path-guard.js`, `shared/ignore-policy.js`,
  `shared/secret-policy.js`, `shared/canonical-json.js`,
  `shared/tree-hash.js`, and `shared/review-packet-renderer.js`.
- **D-19:** Secret-like files are path-only evidence by default. Their contents
  must not be read, copied, hashed into user-facing evidence, or rendered in
  output.
- **D-20:** The tool must not install dependencies, run target project package
  scripts, mutate target files, create planning decisions, approve gates, or
  update roadmaps.

### Validation

- **D-21:** Add a mature AI Tools-like fixture with `AGENTS.md`, `.planning`
  artifacts, package scripts, seed tool directories, one stale or missing
  reference, one secret-like path, and a generated review packet directory that
  must be ignored.
- **D-22:** Tests should prove output isolation, target non-mutation, secret
  non-leakage, deterministic JSON with a fixed clock, review packet schema
  validity, expected ledger artifact names, and evidence refs from ledger
  records to `EVIDENCE.json`.
- **D-23:** After implementation, run focused tests for the new ledger plus
  registry/metadata tests, then run the full suite before verification.

### Agent Discretion

Planning may split implementation into modules that match existing tool
patterns. Likely modules are `cli.js`, `index.js`, `discovery.js`, `facts.js`,
`commands.js`, `contracts.js`, `skills.js`, `decisions.js`, and
`cache-manifest.js`, but exact file boundaries should follow the simplest
maintainable implementation.

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Phase Scope

- `.planning/ROADMAP.md` - Phase 12 goal, LEDGER-01 mapping, success criteria,
  and initial one-plan shape.
- `.planning/REQUIREMENTS.md` - LEDGER-01 and shared safety/review packet
  requirements the ledger must preserve.
- `.planning/PROJECT.md` - project purpose, active constraints, tandem
  boundary, self-use, new-tool intake, changelog, and safety rules.
- `.planning/STATE.md` - current milestone position and Phase 12 readiness.

### Selected Tool Evidence

- `.planning/phases/11-v2-tool-selection-review/11-SELECTION-REVIEW.md` -
  selected candidate, MVP contract, initial scope, fixture seed, and non-goals.
- `.planning/phases/11-v2-tool-selection-review/11-VERIFICATION.md` - confirms
  Phase 11 only planned the ledger and left implementation for Phase 12.
- `tools/project-context-ledger/SEED-IDEAS.md` - original seed intent, future
  commands, safety rules, and fixture direction.
- `tools/registry.json` - planned metadata, owner, destination, expected
  outputs, non-goals, activation stages, and self-use notes.

### Shared Implementation Patterns

- `tools/contract-drift-auditor/cli.js` - richer CLI parsing, mutating flag
  rejection, optional machine stdout, and fail policy pattern.
- `tools/contract-drift-auditor/index.js` - output isolation, packet status,
  tool manifest, shared renderer integration.
- `tools/gates-scan/cli.js` - smaller explicit `--project`/`--out` CLI pattern.
- `tools/gates-scan/index.js` - simple scan runner with discovery/check split
  and policy hashes.
- `shared/review-packet-renderer.js` - packet rendering and count validation.
- `shared/path-guard.js` - external output directory enforcement.
- `shared/ignore-policy.js` - generated packet and ignored directory logic.
- `shared/secret-policy.js` - secret-like path-only evidence rules.
- `shared/canonical-json.js` - deterministic JSON writer.
- `shared/tree-hash.js` - reusable non-mutation proof support.
- `shared/tool-metadata.js` - tool constants, packet artifact list, schema
  version, package version, and policy hash source pattern.

### Tests And Fixtures

- `test/gates-scan/integration.test.js` - fixture matrix and unsafe output
  rejection pattern.
- `test/contract-drift-auditor/schema-output.test.js` - review packet schema
  validation and deterministic JSON tests.
- `test/shared/fixture-helpers.js` - temporary output and fixture helpers.
- `test/planning/tool-registry.test.js` - registry expectations that Phase 12
  will need to update when maturity changes from `planned` to implemented or
  validated.

## Existing Code Insights

### Reusable Assets

- Shared packet rendering already prevents JSON and Markdown packet drift when
  the summary model is the source of truth.
- Shared path guard already rejects output directories inside the audited
  target project, including missing output directories resolved under the
  target tree.
- Shared secret policy already normalizes evidence paths and classifies
  `.env`, key, token, credential, and password-like paths.
- Shared ignore policy already detects AI Tools and ai-workspace-kit generated
  packet directories, dependency/build/temp folders, fixture expected/output
  folders, and nested ai-workspace-kit checkouts.
- Existing tool CLIs are CommonJS, require no runtime services, and write
  packet output only after safety checks pass.

### Established Patterns

- Tool runners accept dependency-injected `clock`, `argv`, `projectDir`, and
  `outDir` for deterministic tests.
- Packet status is derived mechanically from findings and blockers.
- Tool manifests include policy hashes, run timestamp, requested outputs,
  generated files, schema versions, target path, review-only safety profile,
  and package version.
- Tests use temporary output directories outside fixtures and remove them in
  `finally` blocks.

### Integration Points

- Add a package `bin` and npm script for `project-context-ledger`.
- Add a `PROJECT_CONTEXT_LEDGER_TOOL_NAME` or equivalent shared metadata
  constant if the implementation follows existing metadata style.
- Update `tools/registry.json` maturity and evidence refs after validation.
- Update `CHANGELOG.md`, `README.md`, and relevant release/readiness docs only
  if implementation creates user-facing command surface or release guidance.

## Specific Ideas

- Treat the ledger as a fact substrate, not a replacement for source reading.
  The output should point agents toward evidence, not hide the evidence.
- Keep the first implementation boring and deterministic. The value comes from
  trustworthy paths, hashes, timestamps, and references.
- The fixture should include generated review packet artifacts inside the target
  tree to prove they are ignored as source evidence.
- A missing referenced command or file should become a finding or stale/unknown
  ledger entry with evidence, not invented context.

## Deferred Ideas

- `ctx brief --task`
- `ctx diff --since`
- `ctx evidence --topic`
- Dependency lifecycle, vulnerability, abandoned package, runtime capability,
  UI, test-quality, config, skill-linter, domain, and forensics behavior
- Automatic GSD decisions, gate approval, phase creation, roadmap mutation, or
  any ai-workspace-kit runtime dependency
- Package-manager execution or target project command running

---

*Phase: 12-Project Context Ledger MVP*
*Context gathered: 2026-05-08*
