# Changelog

This file records notable project-level changes after each completed phase,
major plan execution, and workflow gate change.

## Unreleased

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
