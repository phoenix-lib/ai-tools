# Changelog

This file records notable project-level changes after each completed phase,
major plan execution, and workflow gate change.

## Unreleased

### Phase 14: Ledger Artifact Schemas

- Changed ledger contracts: added strict JSON Schemas under
  `standards/project-context-ledger/schemas/` for `FACTS.json`,
  `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, `DECISIONS.json`, and
  `CACHE-MANIFEST.json`, with shared definitions documented in
  `standards/project-context-ledger/README.md`.
- Changed generated ledger output: `project-context-ledger` now writes
  `schema_version: project-context-ledger/v1` in `CACHE-MANIFEST.json`,
  includes `source_path` on direct contract records, namespaces context
  decision IDs by source path, and occurrence-normalizes duplicate ledger
  record IDs deterministically.
- Changed validation surface: generated ledger artifact tests now validate all
  six ledger artifacts against the Phase 14 schemas, assert deterministic
  output, require unique record IDs per record artifact, and verify ledger
  `evidence_refs` join to generated `EVIDENCE.json`.
- Changed docs and registry: updated `tools/project-context-ledger/README.md`,
  `docs/RELEASE-READINESS.md`, and `tools/registry.json` to mark schemas as
  optional evidence-consumer contracts, not runtime dependencies or decision
  authority.
- Validation: focused schema tests passed 10/10, generated ledger integration
  tests passed 6/6, registry/release/schema docs tests passed 17/17, full
  `npm.cmd test` passed 225/225, and `git diff --check` passed.
- Self-use result: Phase 14 `project-context-ledger` wrote output outside the
  repository at
  `C:\Users\suppo\.codex\memories\ai-tools-ledger-schemas-phase14-final`;
  packet status was `human_review_required` with 383 findings, 381 low, 2
  medium, 0 blockers, and 0 required decisions. `CACHE-MANIFEST.json` recorded
  `schema_version: project-context-ledger/v1`, 396 scanned sources, 8 ignored
  generated packet directories, and 8 path-only secret paths. All ledger record
  artifacts had unique record IDs.
- Upstream impact: no `ai-workspace-kit` source was changed. The schemas remain
  optional AI Tools evidence contracts for consumers of ledger packets.
- Compatibility impact for `ai-workspace-kit`: no runtime dependency,
  automatic workflow decision, gate decision, roadmap mutation, merge decision,
  suppression/disposition layer, portfolio scanner, source command execution,
  or target-project mutation authority was introduced.
- Breaking changes: artifact filenames and top-level shapes are unchanged, but
  consumers that keyed directly on previous context decision IDs or duplicate
  ledger record IDs may observe deterministic ID changes.
- Migration notes: validate ledger packets against
  `standards/project-context-ledger/schemas/` and treat
  `CACHE-MANIFEST.json` `schema_version` as the contract marker; continue using
  evidence refs rather than record IDs alone for durable interpretation.

### Phase 13: Review Packet Rollup MVP

- Changed tool capabilities: added runnable review-only
  `review-packet-rollup --packets <dir...> --out <dir>` support for consuming
  two or more existing review packet directories.
- Changed packet outputs: `review-packet-rollup` emits the shared
  `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md` artifacts plus `PACKET-INDEX.json` and
  `ROLLUP-GROUPS.json`.
- Changed aggregation semantics: input `REVIEW-SUMMARY.json` and
  `EVIDENCE.json` files are validated before aggregation; invalid packets
  become blocked rollup findings while valid packets remain included. Duplicate
  source finding IDs are occurrence-normalized so mechanical group counts do
  not collapse repeated source findings.
- Changed grouping surface: output groups findings by source tool, source
  status, severity, `source_check_id`, `status_contribution`, and source path.
  It does not assign safe-to-ignore labels, suppress findings, or make gate,
  merge, roadmap, disposition, install, fetch, pull, or source-running
  decisions.
- Changed docs and registry: added `tools/review-packet-rollup/README.md`,
  package bin/script metadata, registry `packet_role: consumer`, tests, fixture
  coverage, and promoted the `tools/registry.json` `review-packet-rollup` entry
  to validated.
- Validation: focused Phase 13 rollup tests passed 29/29,
  registry/metadata/release docs tests passed 17/17, full `npm.cmd test`
  passed 218/218, and `git diff --check` passed.
- Self-use result: Phase 13 `review-packet-rollup` wrote output outside the
  repository at
  `C:\Users\suppo\.codex\memories\ai-tools-review-packet-rollup-phase13`;
  packet status was `human_review_required` with 401 findings, 0 blockers, and
  0 required decisions. Mechanical by-tool counts were 299
  `project-context-ledger`, 75 `contract-drift-auditor`, 26 `gates-scan`, and 1
  `cross-repo-compatibility-checker`.
- Upstream impact: no `ai-workspace-kit` source was changed. The tool consumes
  existing packet directories as optional external evidence and keeps
  adoption/bootstrap, generated local guidance, and permission policy with
  `ai-workspace-kit`.
- Compatibility impact for `ai-workspace-kit`: downstream workflows can consume
  rollup packets as optional evidence, but no runtime dependency, automatic
  tool execution, automatic gate decision, roadmap mutation, suppression layer,
  or copied `.planning` state was introduced.
- Breaking changes: none for existing CLIs or review packet schemas.
- Migration notes: use rollup when multiple AI Tools packet outputs need one
  mechanical review surface; continue reading source packet details before
  making human or assistant decisions.

### Phase 12: Project Context Ledger MVP

- Changed tool capabilities: added runnable review-only
  `project-context-ledger --project <path> --out <dir>` support for project
  facts, commands, assistant contracts, skills, decisions, generated packet
  exclusions, secret path-only evidence, and cache source hashes.
- Changed packet outputs: `project-context-ledger` emits the shared
  `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md` artifacts plus `FACTS.json`, `COMMANDS.json`,
  `CONTRACTS.json`, `SKILLS.json`, `DECISIONS.json`, and
  `CACHE-MANIFEST.json`.
- Changed docs and registry: added `tools/project-context-ledger/README.md`,
  package bin/script metadata, tests, fixture coverage, and promoted the
  `tools/registry.json` `project-context-ledger` entry from planned to
  validated.
- Validation: focused Phase 12 tests passed 27/27 and full `npm.cmd test`
  passed 188/188.
- Self-use result: Phase 12 `project-context-ledger` wrote output outside the
  repository at
  `C:\Users\suppo\.codex\memories\ai-tools-context-ledger-phase12`; packet
  status was `human_review_required` with 280 findings, 0 blockers, and 0
  required decisions. `gates-scan` wrote
  `C:\Users\suppo\.codex\memories\ai-tools-gates-scan-phase12`; packet status
  was `human_review_required` with 26 findings, 0 blockers, and 0 required
  decisions. `contract-drift-auditor` wrote
  `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase12`; packet status
  was `human_review_required` with 48 low findings, 0 blockers, and 0 required
  decisions.
- Upstream impact: Phase 12 planning refreshed embedded `ai-workspace-kit` to
  `bbb009a` and reviewed freshness-impact, dependency lifecycle, and optional
  tool guidance changes. The ledger remains an optional external evidence
  producer and does not copy `.planning` state, execute target commands,
  install dependencies, fetch, pull, or make workflow decisions.
- Compatibility impact for `ai-workspace-kit`: downstream workflows can consume
  ledger packet output as optional evidence, but no runtime dependency,
  automatic gate decision, roadmap mutation, or kit-owned adoption/bootstrap
  behavior was introduced.
- Breaking changes: none for existing CLIs or review packet schemas.
- Migration notes: use `project-context-ledger` as pre-work evidence for
  project facts and cache inputs; keep assistant judgment responsible for
  deciding which ledger facts matter.

### Phase 11: v2 Tool Selection Review

- Changed planning scope: reviewed deferred v2 seed tools against local
  evidence, changelog history, cross-repo boundaries, registry metadata, and
  project pain.
- Changed tool registry: promoted only `project-context-ledger` from deferred
  to planned. No package bin, package script, CLI implementation, fixture
  output, or generated ledger artifact was added.
- Changed deferred tool disposition: kept phase forensics, config, skill, test
  quality, UI regression, runtime capability, local integration, and domain
  contract tools deferred with trigger evidence for future promotion.
- Changed roadmap and requirements: added Phase 12 as the planned Project
  Context Ledger MVP implementation phase for `LEDGER-01`; remaining broad
  seed requirements stay deferred for future evidence.
- Validation: focused selection/registry tests passed 10/10 and full
  `npm.cmd test` passed 175/175.
- Self-use result: Phase 11 `gates-scan` wrote output outside the repository at
  `C:\Users\suppo\.codex\memories\ai-tools-gates-scan-phase11`; packet status
  was `human_review_required` with 23 findings, 0 blockers, and 0 required
  decisions. `contract-drift-auditor` wrote
  `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase11`; packet status
  was `human_review_required` with 47 low findings, 0 blockers, and 0 required
  decisions.
- Upstream impact: Phase 11 refreshed embedded `ai-workspace-kit` to `b5903a4`
  and reviewed updated interop, freshness-impact, and dependency lifecycle
  guidance. The update did not add kit-owned behavior, package-manager tooling,
  dependency scanning, automatic tool execution, or runtime dependency.
- Compatibility impact for `ai-workspace-kit`: downstream freshness checks can
  see which AI Tools candidate is planned next, but no automatic install, run,
  dependency, gate decision, roadmap mutation, or copied `.planning` state was
  introduced.
- Breaking changes: none for existing CLIs or review packet schemas.
- Migration notes: treat the planned ledger as a future optional evidence
  source; continue to use existing validated tools until Phase 12 implements
  and validates the ledger.

### Phase 10: Evidence-Only Gate Linter Seed MVP

- Changed tool capabilities: added runnable review-only
  `gates-scan --project <path> --out <dir>` support for mechanical gate
  registry, gate resolution, stale path, changelog impact, unresolved
  reference, and conflicting wording evidence.
- Changed docs and registry: added `tools/gates-scan/README.md`,
  `tools/gates-scan/SEED-IDEAS.md`, package bin/script metadata, and promoted
  the `tools/registry.json` `gates-scan` entry from planned to validated.
- Packet semantics unchanged: `gates-scan` emits the shared
  `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md` artifacts and treats findings as evidence only.
- Validation: `npm.cmd test -- test/gates-scan/*.test.js` passed 30/30,
  focused registry/metadata/release docs tests passed 15/15, and full
  `npm.cmd test` passed 171/171.
- Self-use result: Phase 10 `gates-scan` wrote output outside the repository at
  `C:\Users\suppo\.codex\memories\ai-tools-gates-scan-phase10`; packet status
  was `human_review_required` with 20 findings, 0 blockers, and 0 required
  decisions. `contract-drift-auditor` self-use wrote
  `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase10`; packet status
  was `human_review_required` with 40 low findings, 0 blockers, and 0 required
  decisions.
- Upstream impact: Phase 10 planning refreshed embedded `ai-workspace-kit` to
  `e225f77` and kept assistant-led semantic gate review, adoption/bootstrap,
  and generated-contract ownership with `ai-workspace-kit`.
- Compatibility impact for `ai-workspace-kit`: downstream freshness checks can
  see that AI Tools now has a mechanical gate evidence producer, but no runtime
  dependency, automatic gate decision, install, pull/fetch, `.planning`
  mutation, or kit-owned gate implementation was added.
- Breaking changes: none for existing CLIs or review packet schemas.
- Migration notes: use `gates-scan` as evidence before or during semantic gate
  review; do not treat it as approval, rejection, or auto-fix authority.

### Phase 09: Tool Registry and Workflow Gate Slimming

- Changed governance artifacts: added `tools/registry.json` and
  `tools/registry.schema.json` as the machine-readable capability catalog for
  implemented, validated, planned, seed-only, and deferred tools.
- Changed docs and gates: moved detailed workflow gate policy from root
  `AGENTS.md` into `.planning/gates/WORKFLOW-GATES.md` while preserving hard
  safety rules, source layers, discuss-mode preflight, and canonical links in
  `AGENTS.md`.
- Changed gate registry: extended the existing `upstream-freshness` gate with
  Kit Update Self-Check / update-impact fields including changed source layers,
  usable ideas, current repo impact, current phase impact, consumer practice
  impact, self-use output, cross-repo request decision, and no
  install/run/dependency confirmation.
- Validation: focused registry and workflow gate tests plus full `npm.cmd test`
  are required for this phase. Self-use output is evidence only.
- Upstream impact: Phase 09 planning updated embedded `ai-workspace-kit` from
  `7bc432c` to `485da62`, read upstream `CHANGELOG.md`, reviewed Phase 19
  smoke/doctor and consumer-practice guidance, and adopted the reusable
  machine-readable contract/index pattern without copying kit-owned doctor,
  smoke, adoption, or bootstrap behavior.
- Compatibility impact for `ai-workspace-kit`: downstream freshness checks can
  read this entry to see that AI Tools governance and registry surfaces changed,
  but packet artifacts, runtime dependency policy, and no-automation boundaries
  did not. No automatic tool execution, install, pull/fetch, `.planning`
  mutation, phase creation, or duplicated adoption/bootstrap behavior was added.
- Breaking changes: none for CLIs or review packet schemas.
- Migration notes: future agents should read `tools/registry.json` before
  promoting or using a tool, and read `.planning/gates/WORKFLOW-GATES.md` for
  detailed gate procedure instead of relying on long policy bodies in
  `AGENTS.md`.

### Phase 08: Contract Drift Auditor CLI Ergonomics

- Changed tool capabilities: `contract-drift-auditor` now supports
  `--format json`, `--quiet`, and
  `--fail-on blocked|human_review_required|never`.
- Changed CLI stdout: default human success output now includes packet status,
  and JSON stdout is a compact projection of `REVIEW-SUMMARY.json` status,
  counts, generated artifact names, and output directory.
- Changed exit policy: generated packets still exit `0` by default because
  `--fail-on never` is the default. Callers may opt into exit `1` for
  `blocked` or `human_review_required` packet statuses.
- Packet semantics unchanged: required artifacts remain `REVIEW-SUMMARY.json`,
  `EVIDENCE.json`, `FINDINGS.md`, and `RECOMMENDED-ACTIONS.md`; stdout is not a
  replacement packet artifact.
- Self-use result: Phase 8 JSON self-audit wrote output outside the repository
  at `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-json`; packet
  status was `human_review_required` with 54 low findings, 0 blockers, and 0
  required decisions.
- Validation: focused CLI tests, schema-output tests, docs validation, and full
  `npm.cmd test` are required for this phase. Self-use output is evidence only.
- Compatibility impact for `ai-workspace-kit`: downstream freshness checks can
  read this entry to see that CLI projection and shell policy changed, but the
  packet contract did not. No runtime dependency, automatic tool execution,
  install, pull/fetch, `.planning` mutation, or duplicated adoption/bootstrap
  behavior was added.
- Breaking changes: none by default.
- Migration notes: CI can opt into `--fail-on human_review_required` or
  `--fail-on blocked`; assistants and downstream tools should still read packet
  artifacts for details and treat findings as review evidence.

### Phase 07: Cross-Repo Compatibility Checker MVP

- Changed tool capabilities: added a runnable review-only
  `cross-repo-compatibility-checker --ai-tools <path> --ai-workspace-kit <path> --out <dir>`
  CLI for validating `ai-tools` / `ai-workspace-kit` cross-repo protocol
  compatibility.
- Changed protocol validation: the checker validates required protocol fields,
  canonical request IDs, `Thread ID`, `Origin`, `Mirror required`, mirrored
  counterpart IDs/paths, manual-transfer decision evidence, and portable
  repo-qualified counterpart paths.
- Changed gate validation: the checker compares AI Tools snake_case gate
  registry metadata with kit camelCase expectations through documented interop
  mappings and stage aliases. Direct schema identity is not required when the
  mapping is explicit.
- Changed packet output: the checker emits the standard
  `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md` artifacts through the shared packet renderer.
- Changed docs: added `tools/cross-repo-compatibility-checker/README.md`,
  updated root `README.md`, and recorded Phase 7 self-use evidence in
  `docs/RELEASE-READINESS.md`.
- Self-use result: Phase 7 checker wrote output outside both repositories at
  `C:\Users\suppo\.codex\memories\ai-tools-cross-repo-check-phase07`; packet
  status was `human_review_required` with 1 medium finding, 0 blockers, and 0
  required decisions.
- Self-use finding: local sibling `ai-workspace-kit` decision artifact
  `ai-workspace-kit/.planning/cross-repo/decisions/2026-05-07-ai-tools-review-packet-standard.md`
  is missing required field `Reason`.
- Validation: focused checker tests and full `npm.cmd test` are required for
  this phase. The checker remains evidence-only, so `human_review_required`
  self-use output is not an automatic blocker.
- Compatibility impact for `ai-workspace-kit`: downstream freshness checks now
  have a concrete validator for protocol drift. No runtime dependency,
  automatic tool execution, install, pull/fetch, `.planning` mutation,
  automatic phase creation, or duplicated adoption/bootstrap behavior was
  added.
- Breaking changes: none.
- Migration notes: use the new checker before automatic cross-repo indexer or
  gate-linter work. Treat findings as evidence for assistant or human review,
  not as acceptance/rejection decisions.

### Local ai-workspace-kit Review

- Reviewed sibling local checkout `C:\projects\ai-workspace-kit` at
  `bfeb670`, which is 28 commits ahead of the embedded `.external` reference
  and remote HEAD previously used by the freshness gate.
- Added `.planning/research/AI-WORKSPACE-KIT-LOCAL-REVIEW.md` with useful
  ideas for AI Tools: machine-readable contract index, centralized protocol
  versions, Documentation Impact Gate, forward-only gate registry validation,
  normalized Gate Resolution template, optional-tool evidence boundaries, and
  skill synthesis governance.
- Recommendation: keep Phase 7 as cross-repo compatibility checker, then
  promote `GATELINT-01` as user-facing `gates-scan`, then add tool registry
  plus AI Tools contract index/protocol versions before broad skill/tool
  expansion.
- Compatibility impact for `ai-workspace-kit`: this is planning evidence only.
  No runtime dependency, automatic tool execution, copied `.planning` state, or
  duplicated adoption/bootstrap behavior is added.

### Phase Verification and Gates Scan Review

- Added `.planning/verification/PHASE-VERIFY-AUDIT.md` confirming every
  completed phase from 01 through 06 has a verification artifact with verdict,
  requirement coverage, validation evidence, and residual risk notes.
- Added `.planning/research/GATES-SCAN-ROADMAP-REVIEW.md` analyzing the
  proposed `gates-scan` CLI while keeping requirement ID `GATELINT-01`.
- Recommendation: keep Phase 7 as the cross-repo compatibility checker, then
  promote a small read-only evidence-only `gates-scan` MVP immediately after
  Phase 7, before broader tool registry or deferred seed work.
- Compatibility impact for `ai-workspace-kit`: no kit dependency, automatic
  tool execution, or semantic gate decision is added. `ai-workspace-kit` should
  remain the source of gate policy; AI Tools may produce mechanical evidence.
- Validation: planning-only audit/review. Full `npm.cmd test` should remain the
  mechanical regression check after this documentation update.

### Phase 06-03: Release Packet Fixtures

- Changed tool examples: added release-facing `contract-drift-auditor` packet
  fixtures under `tools/contract-drift-auditor/examples/` for `pass`,
  `human_review_required`, and `blocked` outcomes.
- Changed safety evidence: the `blocked-safety` fixture is explicitly a
  synthetic packet-shape example. Real target-local output paths are rejected
  before packet artifacts are written.
- Changed validation: added `test/contract-drift-auditor/release-examples.test.js`
  for schema-valid examples, required artifact coverage, normalized evidence
  paths, and Markdown status/count consistency. Added an integration regression
  proving unsafe target-local output writes no packet files.
- Changed release docs: `tools/contract-drift-auditor/README.md` and
  `docs/RELEASE-READINESS.md` now point to the three example folders and
  preserve portable self-audit guidance with caller-provided external `--out`.
- Self-use result: final Phase 6 self-audit wrote output outside the repository
  at `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase06`; packet
  status was `human_review_required` with 55 low findings, 0 blockers, 0
  critical/high/medium findings, and 0 required decisions.
- Validation: `npm.cmd test -- test/contract-drift-auditor/release-examples.test.js`
  passed 4/4, `npm.cmd test -- test/contract-drift-auditor/integration.test.js`
  passed 5/5, `npm.cmd test -- test/planning/release-docs.test.js` passed 4/4,
  and `npm.cmd test` passed 99/99.
- Compatibility impact for `ai-workspace-kit`: downstream readers now have
  concrete packet examples for all release-relevant statuses. No schema change,
  runtime dependency, automatic tool execution, kit-owned adoption/bootstrap
  behavior, or hidden cross-repo integration was added.
- Breaking changes: none.
- Migration notes: downstream validators should treat
  `REVIEW-SUMMARY.json` as the machine source of truth and treat the blocked
  fixture as a synthetic shape example, not proof that unsafe output writes are
  allowed.

### Phase 06-02: Tool Metadata Source

- Changed shared metadata: added `shared/tool-metadata.js` as the code-owned
  source for `review-packet/v1`, required packet artifact names,
  `contract-drift-auditor` tool name, policy hash source paths, and package
  version lookup from `package.json`.
- Changed packet generation internals: `shared/review-packet-renderer.js` and
  `tools/contract-drift-auditor/index.js` now consume shared metadata constants
  instead of repeating schema version, artifact names, tool name, or package
  version lookup locally.
- Packet semantics unchanged: required artifacts remain `REVIEW-SUMMARY.json`,
  `EVIDENCE.json`, `FINDINGS.md`, and `RECOMMENDED-ACTIONS.md`; schema version
  remains `review-packet/v1`.
- Validation: `npm.cmd test -- test/shared/tool-metadata.test.js`,
  `npm.cmd test -- test/shared/review-packet-renderer.test.js`,
  `npm.cmd test -- test/contract-drift-auditor/schema-output.test.js`, and
  `npm.cmd test` are the required checks for this plan.
- Compatibility impact for `ai-workspace-kit`: downstream packet readers should
  see no schema or artifact-name change. This is a source-of-truth cleanup only
  and does not add runtime dependency, automatic tool execution, or kit-owned
  behavior.
- Breaking changes: none.
- Migration notes: future packet examples and tools should import shared
  metadata constants instead of duplicating packet artifact names or schema
  versions.

### Phase 06-01: Release Docs Closeout

- Changed documentation only: updated `tools/contract-drift-auditor/README.md`
  so current limitations reflect Phase 5 self-audit filtering. Historical
  `.planning/phases/**` artifacts and nested fixture contracts are no longer
  described as dominating current self-audit results by default.
- Changed self-audit guidance: `docs/RELEASE-READINESS.md` now gives the
  reusable command as
  `node tools/contract-drift-auditor/cli.js --project . --out <external-dir>`,
  with `<external-dir>` required to be outside the audited repository. The
  Phase 5 `C:\Users\suppo\...` path remains historical evidence only.
- Validation: `npm.cmd test -- test/planning/release-docs.test.js` and
  `npm.cmd test` are the required checks for this plan.
- Upstream impact: Phase 06 planning checked `ai-workspace-kit` local and
  remote HEAD at `2079ab9`; no upstream update was required.
- Compatibility impact for `ai-workspace-kit`: downstream freshness checks can
  read this changelog first to see that Phase 06-01 changed docs and guidance
  only. No runtime dependency, automatic tool execution, packet schema change,
  or duplicated adoption/bootstrap behavior was added.
- Breaking changes: none.
- Migration notes: use caller-provided external output directories for future
  self-audits instead of copying the historical Phase 5 machine-local path.

### Preliminary v2 Roadmap

- Changed planning scope: added preliminary Phases 06-11 after the completed
  v1 release hardening phase.
- Planned Phase 06 for release closeout, auditor limitation cleanup, release
  packet fixtures, centralized tool metadata, and safe self-audit invocation.
- Planned Phase 07 for `XREPO-VALIDATOR-01`, the read-only cross-repo
  compatibility checker that must exist before automatic cross-repo indexer or
  gate-linter automation.
- Planned Phase 08 for `contract-drift-auditor` CLI ergonomics: machine stdout,
  quiet mode, documented `--fail-on` behavior, and stable exit codes while
  keeping findings evidence-only by default.
- Planned Phase 09 for a machine-readable tool registry and root `AGENTS.md`
  slimming by moving detailed gate policy into focused workflow docs.
- Planned Phase 10 for evidence-only `GATELINT-01` promotion or explicit
  re-deferral after validator and registry guardrails exist.
- Planned Phase 11 as the evidence-backed review point for broad seed tools
  such as ledger, forensics, config, skill, test quality, UI, and integration
  candidates. At most one next tool should be promoted from that review.
- Compatibility impact for `ai-workspace-kit`: no runtime dependency, tool
  execution, automatic phase creation, or duplicated adoption/bootstrap behavior
  is added. The next interop work remains read-only validation evidence.
- Validation: planning-only change; `npm.cmd test` passed with 89/89 tests
  after editing roadmap, requirements, state, and changelog.

### Phase 05: Integration and Release Hardening

- Changed documentation: added the root `README.md` release entrypoint,
  expanded `tools/contract-drift-auditor/README.md`, and added
  `docs/RELEASE-READINESS.md` as the first-release definition of done.
- Changed compatibility guidance: documentation now states that
  `ai-workspace-kit` remains the adoption/bootstrap contract tool and may
  consume AI Tools packets only as optional external evidence.
- Changed docs validation: added `test/planning/release-docs.test.js` to check
  required use/non-use guidance, safety guarantees, packet artifacts,
  `ai-workspace-kit` boundary language, and deferred v2 validator/linter scope.
- Changed auditor filtering behavior: default contract source selection now
  treats only root `AGENTS.md`/`CLAUDE.md` as current project contracts, excludes
  historical `.planning/phases/**` from planning source docs, avoids treating
  nested fixture contracts as current self-audit contracts, ignores descriptive
  phrases and bare directory placeholders as file references, and resolves
  repo-qualified `ai-workspace-kit/...` counterpart paths through
  `.external/ai-workspace-kit`.
- Changed self-use evidence: release self-audit now writes review output outside
  the repo at `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase05`.
  The packet status is `human_review_required` with 57 low findings, 0 blockers,
  0 critical/high/medium findings, and 0 required decisions. Remaining findings
  are release caveats, not automatic blockers.
- Changed gate review evidence: performed assistant-led release gate review
  using local `ai-workspace-kit` tooling guidance, local gate registry, cross-repo
  playbook, and `AGENTS.md`. Current gates are adopted for v1; no hidden
  automation, dependency creep, duplicated kit-owned behavior, or release-blocking
  gate conflict was found.
- Validation: `npm.cmd test -- test/contract-drift-auditor/discovery.test.js`
  passed 6/6, `npm.cmd test -- test/contract-drift-auditor/checks.test.js`
  passed 9/9, `npm.cmd test -- test/contract-drift-auditor/integration.test.js`
  passed 4/4, `npm.cmd test -- test/planning/release-docs.test.js` passed 3/3,
  and `npm.cmd test` passed 89/89.
- Upstream impact: Phase 05 planning checked `ai-workspace-kit` local and
  remote HEAD at `2079ab9`; no update was required before release docs work.
- Compatibility impact for `ai-workspace-kit`: v1 remains optional external
  evidence only. No automatic kit dependency, automatic cross-repo validation,
  automatic tool execution, or mechanical gate-linter automation was added.
  `XREPO-VALIDATOR-01` and `GATELINT-01` remain deferred v2 work.
- Breaking changes: none; source-document filtering only reduces false-positive
  self-audit noise and keeps broad project discovery intact.
- Migration notes: downstream consumers should read the changelog first, then
  `README.md` and `docs/RELEASE-READINESS.md` before relying on changed AI Tools
  release guidance. Treat self-audit findings as evidence for human review, not
  as automatic decisions.

### Phase 04: Contract Drift Auditor MVP

- Changed tool capabilities: added a runnable review-only
  `contract-drift-auditor --project <path> --out <dir>` MVP that emits
  `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md`.
- Changed shared review packet mechanics: added
  `shared/review-packet-renderer.js` so JSON and Markdown packet artifacts
  render from one summary/evidence/action model with canonical JSON.
- Changed drift checks: the auditor now detects missing source-layer/local file
  references, missing `npm test` or `npm run <script>` package scripts, missing
  or invalid local skills, absent-tool references, and unknown contract facts.
- Changed safety behavior: auditor output is rejected inside the audited target
  project, target commands are never executed, target files are not mutated, and
  generated packet directories inside targets are ignored as stale evidence.
- Validation: added renderer, CLI, discovery, checks, integration, and schema
  output tests. Full validation passed with `npm.cmd test`.
- Self-use impact: running the auditor against this repository produced a
  `human_review_required` packet with noisy historical `.planning`, fixture, and
  optional `.external` references; Phase 5 should harden self-audit source
  filtering before treating full-repo output as release evidence.
- Compatibility impact for `ai-workspace-kit`: the auditor produces compatible
  review packet artifacts that kit may consume as optional evidence. No runtime
  dependency, automatic execution, adapter/bootstrap duplication, or target
  project dependency was added.
- Breaking changes: none for existing APIs; the new CLI is additive.
- Migration notes: future packet-producing tools should use the shared renderer
  and keep CLI output, Markdown, and JSON status derived from one model.

### Workflow Gate Enforcement

- Fixed the Discuss Mode Gate contract so `$gsd-discuss-phase` must resolve
  `discuss-mode` before gray-area analysis, user questions, checkpoints,
  `*-CONTEXT.md`, or `*-DISCUSSION-LOG.md` writes.
- Clarified that `workflow.discuss_mode` is routing only and is not evidence of
  user approval for Manual Questions or Trusted Self-Questioning.
- Validation: added regression coverage for `AGENTS.md`,
  `.planning/gates/registry.json`, and existing discuss context artifacts.
- Phase 4 impact: no Phase 4 discussion artifacts existed before this fix, so
  no stale artifact migration was required.

### Cross-Repo Interop Compatibility

- Planned `XREPO-VALIDATOR-01` as a deferred v2 read-only cross-repo
  compatibility checker that validates both `ai-tools` and `ai-workspace-kit`
  protocol artifacts before automatic indexer or gate-linter automation.
- Added `tools/cross-repo-compatibility-checker/SEED-IDEAS.md` to preserve the
  checker scope, non-goals, expected review packet outputs, and first fixture
  shape without blocking Phase 4.
- Changed mirror semantics: request and decision artifacts now include
  `Origin` and `Mirror required` so manual transfers can be explicit instead of
  looking like broken mirrored requests.
- Validation: protocol tests now require mirrored requests to have counterpart
  metadata, and require non-mirrored requests to have a decision artifact.
- Changed semantic grouping: request and decision artifacts now require
  `Thread ID` so mirrored requests can be grouped even when canonical IDs or
  filenames differ.
- Validation: protocol tests now require `THREAD-YYYYMMDD-...` identifiers and
  verify the mirrored kit thread IDs for contract drift and review packet
  semantics.
- Changed counterpart paths: cross-repo protocol files now use repo-qualified
  relative paths instead of machine-local absolute paths.
- Validation: protocol tests now reject Windows absolute paths inside
  `.planning/cross-repo/` markdown files.
- Changed cross-repo protocol fields: capability request and decision templates
  now require `Protocol version: 1.0`, canonical IDs, counterpart IDs,
  counterpart paths, and legacy IDs.
- Changed compatibility semantics: mirrored legacy files from
  `ai-workspace-kit` are explicit counterparts, not separate requests.
- Changed gate registry compatibility: `.planning/gates/registry.json` remains
  AI Tools-specific snake_case and now declares a kit interop mapping for field
  names and stage aliases.
- Validation: added protocol tests for canonical request IDs, mirrored
  counterpart metadata, and registry interop metadata.
- Compatibility impact for `ai-workspace-kit`: consumers can correlate current
  canonical AI Tools requests with kit legacy filenames without automatic
  dependency, install, or tool execution.
- Breaking changes: none for runtime behavior. Validators that read cross-repo
  markdown should expect the new protocol/counterpart fields.
- Migration notes: old mirrored artifacts should be linked through
  `Counterpart ID`, `Counterpart path`, and `Legacy ID` instead of being copied
  or renamed across repositories.

### Phase 03: Cross-Repo Capability Request Gate

- Changed cross-repo protocol artifacts: added `.planning/cross-repo/` with
  inbox, outbox, decisions, templates, request examples, a real incoming
  request, and a mixed decision artifact.
- Changed gates: added `.planning/gates/registry.json` as the machine-readable
  gate source for discuss mode, upstream freshness, cross-repo incoming/outgoing
  review, changelog, self-use, new-tool intake, git baseline, and future
  gate-review hook.
- Changed templates: added capability request and decision templates with
  required fields, boundary classifications, decision statuses, non-goals, and
  review/expiry sections.
- Changed review packet/interoperability semantics: documented that
  `ai-workspace-kit` can request AI Tools external auditors through inbox
  requests, and AI Tools can request stable review packet/evidence-ref
  compatibility through outbox requests.
- Compatibility impact for `ai-workspace-kit`: requests are evidence and
  decision inputs only. They do not install, run, or depend on AI Tools
  automatically, and they do not copy `.planning` state between repositories.
- Breaking changes: none for runtime behavior; future GSD artifacts now need
  observable `Gate Resolution` sections when registered gates apply.
- Migration notes: future agents should read `CHANGELOG.md` first, then
  `.planning/gates/registry.json` and
  `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` before changing
  gates or cross-repo protocol behavior.
- Validation: `npm.cmd test -- test/planning/cross-repo-protocol.test.js` and
  `npm.cmd test` passed after Phase 03 docs validation was added.
- Upstream impact: Phase 03 planning checked `ai-workspace-kit` at commit
  `48ec037d058747151c320ced9c0ee1e1d247d4b1`; no upstream changelog or release
  notes artifact existed at that commit, so commit/diff review remains the
  fallback.

### Workflow Gates

- Added a planned changelog gate: after each major task or phase, update this
  file with what changed, validation performed, and any `ai-workspace-kit`
  upstream impact.
- Planned an `ai-workspace-kit` gate review hook for release/maintenance once
  that upstream capability exists. Until then, gate relevance/conflict review is
  manual and routed through cross-repo requests or decisions.
- Added AI Tools Self-Use Gate guidance: validated AI Tools capabilities should
  be considered while developing this repository, but their output remains
  evidence rather than an automatic decision.
- Added New Tool Intake and Placement Gate guidance: every new tool idea must be
  classified by owner, destination, maturity, activation stage, outputs, and
  non-goals before implementation.
- Added Git Baseline Gate guidance: old untracked seed/project files must be
  separated from active work before git cleanliness is used as evidence.

### Planning

- Inserted Phase 03: Cross-Repo Capability Request Gate.
- Moved Contract Drift Auditor MVP from Phase 03 to Phase 04.
- Moved Integration and Release Hardening from Phase 04 to Phase 05.
- Added `RENDER-01` to Phase 04 for a shared packet renderer so JSON,
  Markdown, recommended actions, evidence, and CLI status come from one packet
  model.
- Consolidated untracked seed ideas into `tools/*/SEED-IDEAS.md`,
  `standards/review-packet/SEED-IDEAS.md`, and `docs/`, removing obsolete
  root-level seed folders.

### Cross-Repo Requests

- Captured an incoming `ai-workspace-kit` request for changelog gate
  compatibility, assistant-owned gate review, and future evidence-only
  mechanical gate-linter support. The structured `.planning/cross-repo/`
  protocol is not implemented yet, so the request is preserved as a pending
  Phase 03 todo. Mechanical gate-linter is recorded as a v2 candidate, not a
  v1 implementation dependency.

## 2026-05-07

### Phase 01: Review Packet Standard

- Defined the shared review packet schemas, taxonomy, examples, canonical JSON
  guidance, and schema validation tests.
- Validated deterministic review packet examples and summary count consistency.

### Phase 02: Shared Safety Harness

- Changed scope: completed shared read-only safety helpers for canonical JSON,
  output path isolation, secret-like path-only evidence, default ignored target
  walks, and raw fixture tree hashing.
- Validation: added focused helper tests plus integrated fixture tests proving
  output isolation, generated packet exclusion, secret sentinel non-leakage, and
  no target fixture mutation. `npm.cmd test` passed with 40 tests.
- Changed tool capabilities: future auditors can reuse deterministic safety
  primitives and the seven target fixtures before `contract-drift-auditor`
  exists.
- Changed contracts, gates, schemas, and review packet semantics: no changes to
  the Phase 01 review packet schema contract or cross-repo gates.
- Compatibility impact for `ai-workspace-kit`: no dependency or runtime
  integration added. The generated packet ignore policy recognizes stale
  ai-workspace-kit adoption packet markers inside target fixtures as ignored
  generated review material.
- Breaking changes: none.
- Migration notes: none.
- Upstream impact: reviewed `ai-workspace-kit` upstream changes through commit
  `48ec037` before writing Phase 02 plans; no upstream changelog artifact was
  available to pre-read.
