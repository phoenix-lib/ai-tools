# Phase 2: Shared Safety Harness - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 builds the reusable safety foundation for future AI Tools auditors:
output path isolation, secret-like path-only evidence classification, default
ignore policy, deterministic project file walking, canonical JSON helper
promotion, and fixture tree hashing for no-mutation proof.

This phase does not implement `contract-drift-auditor` drift checks, adoption
review packets, assistant contract generation, merge routing, or project-local
contract maintenance. Those adoption/bootstrap capabilities remain owned by
`ai-workspace-kit`; Phase 2 only creates generic primitives that future external
AI Tools auditors can use.

</domain>

<decisions>
## Discuss Mode

Mode: Trusted Self-Questioning
Approved by: user

Cycles run:

- Tandem boundary and ownership: 5
- Output isolation: 5
- Secret policy and evidence semantics: 5
- Ignore policy and file walker: 5
- Fixture harness and mutation proof: 5
- Shared module layout and API surface: 4
- Upstream freshness impact: 4

## Implementation Decisions

### Tandem Boundary and Ownership

- **D-01:** Phase 2 is owned by AI Tools because it implements external auditor
  safety primitives, deterministic checks, fixtures, and review-packet support.
- **D-02:** `ai-workspace-kit` remains a reference source only. Do not add it as
  a runtime dependency and do not import files from `.external/ai-workspace-kit`
  in production code or tests.
- **D-03:** It is allowed to adapt principles from `ai-workspace-kit` path
  guards, ignore rules, secret classification, file walking, and tree-hash tests
  into independent generic helpers.
- **D-04:** Do not rebuild adoption/bootstrap behavior in this phase: no adapter
  generator, no generated `AGENTS.md` or `CLAUDE.md` workflow, no adoption
  review packet, no merge/conflict router, and no project-local contract
  installer.
- **D-05:** Shared boundary work is limited to packet-compatible metadata,
  normalized evidence refs, and optional future interop documentation.

### Output Isolation

- **D-06:** Report-generating tools must require an explicit output directory
  and reject paths equal to or inside the audited target project by default.
- **D-07:** The guard must resolve existing paths through real paths where
  possible and handle not-yet-created output directories by resolving the
  deepest existing parent.
- **D-08:** Path containment comparisons must be Windows-safe: resolved paths
  should compare case-insensitively on Windows and use platform path semantics
  instead of string prefix checks.
- **D-09:** The guard must reject unsafe paths before creating the output
  directory or writing any report artifact.
- **D-10:** There should be no broad bypass. Tests may use explicit fixture
  options, but the normal target-project audit path rejects output inside the
  target.
- **D-11:** The error message should explain the rejected `--out` path and tell
  callers to use a separate review/output directory outside the target project.

### Secret Policy and Evidence Semantics

- **D-12:** Secret-like paths are path-only evidence by default. Their contents
  must not be read, copied, rendered, hashed, or placed in user-facing output.
- **D-13:** The default classifier must treat `.env`, `.env.*`, filenames
  containing `secret`, `token`, or `credential`, and key/certificate files such
  as `.key`, `.pem`, `.p12`, `.pfx`, `id_rsa`, `id_dsa`, and `id_ed25519` as
  secret-like.
- **D-14:** Secret evidence refs must use normalized relative paths with `/`,
  `evidence_type: "secret_path"`, `path_only: true`, a concrete `reason`, and
  `confidence: "verified"` when the path exists.
- **D-15:** Secret path-only evidence must not include `sha256`, snippets, or
  content-derived facts. This directly preserves the Phase 1
  `EVIDENCE-REF.schema.json` rule.
- **D-16:** Example env files can be revisited later as structure-only evidence,
  but Phase 2 default behavior stays conservative: secret-like env paths are
  path-only unless a future phase designs an explicit safe-read policy.
- **D-17:** Tests must include sentinel strings in secret-like fixture files and
  prove those sentinels never appear in generated outputs or returned report
  text.

### Ignore Policy and File Walker

- **D-18:** The shared ignore policy must exclude `.git`, dependency folders,
  build outputs, coverage, temp directories, generated review packets, nested
  checkouts, and fixture expected/output trees unless explicitly targeted.
- **D-19:** Default ignored directory names should include `.git`,
  `node_modules`, `.pnpm-store`, `vendor`, `dist`, `build`, `.next`, `out`,
  `coverage`, `.tmp`, and `tmp`.
- **D-20:** Generated review packet directories should be ignored by marker
  files, not just by name. Markers include `REVIEW-SUMMARY.json`,
  `EVIDENCE.json`, `FINDINGS.md`, `RECOMMENDED-ACTIONS.md`,
  `ADOPTION-REVIEW.md`, `MERGE-REVIEW.md`, `CONFLICTS.md`, and
  `ai-workspace.manifest.json`.
- **D-21:** Nested `ai-workspace-kit` checkouts should be ignored when detected
  by package name `ai-workspace-kit` or by `AI-BOOTSTRAP.md` plus
  `CORE-CONTRACT.md` in a nested directory.
- **D-22:** Fixture internals should be ignored when reviewing this repository:
  `fixtures/**/expected/**`, `fixtures/**/output/**`, and comparable
  generated-output trees. A fixture `input/` directory is inspected normally
  when it is passed directly as the target project.
- **D-23:** The file walker must return deterministic sorted relative paths with
  `/` separators, never absolute paths as evidence IDs.
- **D-24:** The file walker may return metadata needed by downstream tools, but
  secret classification must happen before any content read.
- **D-25:** The walker should support an explicit file cap with deterministic
  ordering so very large target trees do not produce unstable output.

### Fixture Harness and Mutation Proof

- **D-26:** Phase 2 fixtures must cover: clean project, mature project, stale
  source layer, missing command, secret-like files, mixed package managers, and
  generated packet inside target tree.
- **D-27:** Fixture targets should live under `test/fixtures/targets/<scenario>/`
  with an `input/` target tree and optional expected/output material outside the
  audited target path.
- **D-28:** Tree hashing for mutation proof must use a raw recursive file walk
  over the target tree, not the audit ignore policy. If a tool writes into an
  ignored directory inside the target, the hash should still catch the mutation.
- **D-29:** The tree hash must hash sorted normalized relative file paths plus
  raw file bytes using NUL separators and SHA-256.
- **D-30:** No-mutation tests should hash the fixture target before and after a
  read-only operation and fail on any file content, addition, deletion, or
  rename inside the target tree.
- **D-31:** Fixture output directories used by tests must be outside the target
  tree and cleaned through test helpers, not committed as transient run output.

### Shared Module Layout and API Surface

- **D-32:** Reusable mechanics belong in `shared/`, matching the local
  `AGENTS.md` rule. Tool-specific checks should wait for
  `tools/contract-drift-auditor/` in Phase 4.
- **D-33:** Use CommonJS modules and `node:test`, matching the current
  `package.json` and Phase 1 tests.
- **D-34:** Promote canonical JSON from documented/tested guidance into a shared
  helper, for example `shared/canonical-json.js`, so later tools stop using ad
  hoc `JSON.stringify`.
- **D-35:** Expected shared helpers are `path-guard`, `secret-policy`,
  `ignore-policy`, `file-walker`, `tree-hash`, and `canonical-json`. Exact file
  names can vary if the planner keeps the boundaries clear.
- **D-36:** Shared helpers should expose small deterministic functions rather
  than CLI behavior. CLI shell work belongs to Phase 4.
- **D-37:** Tests should live under `test/shared/` and should directly exercise
  the helper APIs before any auditor exists.

### Upstream Freshness Impact

- **D-38:** Before planning Phase 2, run the ai-workspace-kit upstream
  freshness gate: compare local `.external/ai-workspace-kit` with GitHub HEAD,
  fast-forward if changed, and review the upstream diff before writing plans.
- **D-39:** The latest reviewed upstream update for this context is
  `3e489b1a99c58443e593a1e2f6234ed5d0dc173d` to
  `578d0f8e453ba65e667872ac0b529dcb7bbc405f`.
- **D-40:** Phase 2 should reuse the updated upstream lessons around compact
  `REVIEW-SUMMARY.json`, single-source review summaries, optional tooling
  governance, stricter generated-contract policy, and adapter-aware review
  packets only as compatible design input. Do not implement ai-workspace-kit
  adoption review behavior here.
- **D-41:** Future phase plans must record the upstream commit checked and any
  reusable changes in
  `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md`.

### the agent's Discretion

The planner may choose exact helper function names, fixture scenario names, max
file cap defaults, and whether shared helpers use one index export or per-file
imports. Keep the behavioral decisions above intact and avoid adding
`ai-workspace-kit` runtime coupling.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Workflow

- `.planning/PROJECT.md` - Project purpose, constraints, active requirements,
  and tandem boundary gate.
- `.planning/REQUIREMENTS.md` - Phase 2 requirement IDs: `SAFE-01`,
  `SAFE-02`, `SAFE-03`, `SAFE-05`, `TEST-02`, `TEST-03`, and `TEST-07`.
- `.planning/ROADMAP.md` - Phase 2 goal, success criteria, and plan outline.
- `.planning/STATE.md` - Current project state and residual Phase 1 notes.
- `AGENTS.md` - Local assistant contract, implementation start rule, safety
  rules, and ai-workspace-kit tandem boundary gate.
- `AI-AGENT-IMPLEMENTATION-GUIDE.md` - Main implementation guide and product
  standards.
- `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md` - Latest recorded
  review of upstream `ai-workspace-kit` changes and phase-planning impacts.

### Phase 1 Outputs

- `.planning/phases/01-review-packet-standard/01-CONTEXT.md` - Phase 1
  decisions that deferred file walker, secret policy, and fixture harness to
  Phase 2.
- `.planning/phases/01-review-packet-standard/01-VERIFICATION.md` - Verification
  that Phase 1 passed and that canonical JSON should be promoted into a shared
  helper.
- `standards/review-packet/README.md` - Packet artifact set, evidence refs,
  status/severity/confidence taxonomy, and JSON source-of-truth rule.
- `standards/review-packet/CANONICAL-JSON.md` - Deterministic JSON rules to
  implement as a shared helper.
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json` - Path-only
  evidence schema contract.

### ai-workspace-kit Reference

- `.external/ai-workspace-kit/ADAPTER-GENERATION.md` - Review-only output
  isolation, inspect reliability, ignore policy, secret handling, mutation
  proof, and discuss-mode rules to adapt conceptually.
- `.external/ai-workspace-kit/scripts/lib/paths.js` - Reference pattern for
  real-path output containment checks.
- `.external/ai-workspace-kit/scripts/lib/ignore.js` - Reference ignore rules
  for generated packets, nested kit checkouts, and fixture internals.
- `.external/ai-workspace-kit/scripts/lib/profile.js` - Reference deterministic
  relative file walker shape.
- `.external/ai-workspace-kit/scripts/lib/inspection.js` - Reference
  `isSecretLike` path classifier and path-only evidence concept.
- `.external/ai-workspace-kit/test/adopt.test.js` - Reference tree-hash
  mutation proof and secret sentinel leakage tests.
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md` - Updated optional-tool
  governance and GSD stage mapping.
- `.external/ai-workspace-kit/schemas/review-summary.schema.json` - Updated
  compact review gate schema to compare with AI Tools packet contracts.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `standards/review-packet/CANONICAL-JSON.md`: defines the canonical JSON
  behavior that Phase 2 should implement in code.
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json`: already enforces
  `path_only: true` evidence without `sha256`.
- `test/review-packet/canonical-json.test.js`: current deterministic JSON test
  pattern to reuse for shared helper tests.
- `test/review-packet/schema-validation.test.js`: existing `node:test` and Ajv
  style for deterministic validation tests.
- `.external/ai-workspace-kit/scripts/lib/paths.js`: useful reference for
  resolving existing ancestors and comparing containment safely.
- `.external/ai-workspace-kit/scripts/lib/ignore.js`: useful reference for
  marker-based review packet detection and nested kit checkout detection.
- `.external/ai-workspace-kit/test/adopt.test.js`: useful reference for
  `treeHash` and secret sentinel tests.

### Established Patterns

- The repository uses CommonJS and `node --test`.
- Standards live under `standards/`; reusable mechanics should live under
  `shared/`; future tool checks should live under `tools/<tool-name>/`.
- JSON artifacts are the machine source of truth; Markdown and CLI summaries
  must be projections from shared data.
- Secret-like files are evidence by path only, not by content.
- External reference code may guide design but must not become a production
  dependency.

### Integration Points

- Phase 2 helpers feed Phase 4 `contract-drift-auditor`.
- Output path guard will back future `--project <path> --out <dir>` CLIs.
- File walker and ignore policy will define the target evidence set used by
  future drift checks.
- Secret policy will produce evidence refs compatible with
  `EVIDENCE-REF.schema.json`.
- Tree-hash helpers will support no-mutation proof for every read-only auditor.

</code_context>

<specifics>
## Specific Ideas

- Start implementation with helper APIs and tests, not a CLI.
- Use marker-based generated-packet detection so outputs from both AI Tools and
  `ai-workspace-kit` can be ignored when they appear inside scanned trees.
- Keep mutation proof stricter than inspection: tree hashing should see all
  files under the target, even files the auditor ignores for evidence.
- Include a fixture with a generated packet inside the target tree to prove the
  walker ignores stale/generated evidence while the output guard still rejects
  writing new output there.

</specifics>

<deferred>
## Deferred Ideas

- `contract-drift-auditor` CLI shell and drift checks are deferred to Phase 4.
- Adoption/bootstrap review packets, adapter generation, generated contract
  merge routing, and project-local contract maintenance remain in
  `ai-workspace-kit`.
- Structure-only reading for `.env.example` or sample env files is deferred
  until there is an explicit safe-read policy.
- Integration documentation explaining when to use AI Tools versus
  `ai-workspace-kit` is deferred to Phase 5.

</deferred>

---

*Phase: 2-Shared Safety Harness*
*Context gathered: 2026-05-07*
