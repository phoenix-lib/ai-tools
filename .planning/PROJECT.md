# AI Tools

## What This Is

AI Tools is a small ecosystem of read-only AI development auditors for keeping
AI-assisted projects accurate, reviewable, and cheap to reason about. The tools
produce evidence-backed review packets that can be consumed by assistants,
humans, CI jobs, and GSD workflows.

The project supports `ai-workspace-kit` and GSD workflows, but the external
tools must remain optional. Target projects should be able to benefit from
audits without taking these tools as mandatory product dependencies.

## Core Value

Produce deterministic, evidence-backed review packets that make AI project
guidance auditable without mutating target projects.

## Current Milestone: v2.1 Evidence Consumption & Signal Quality

**Goal:** Make existing review packets and ledger artifacts easier to validate,
aggregate, scope, diff, and consume without adding another broad semantic
auditor or making `ai-workspace-kit` depend on AI Tools.

**Target features:**
- Mechanical review packet rollup for multiple packet directories.
- Stable schemas for project-context-ledger artifacts.
- Human review disposition records with owner, expiry, and evidence refs.
- Ledger scope and diff modes that reduce historical planning noise.
- Shared CLI contract for validated tools.
- Optional `ai-workspace-kit` LLM instruction compatibility checks that preserve
  the no-runtime-dependency boundary.

## Requirements

### Validated

- [x] Define a portable AI review packet standard with schemas for summaries,
  findings, evidence references, recommended actions, and tool metadata.
  Validated in Phase 01: Review Packet Standard.
- [x] Implement shared safety primitives for read-only inspection, output path
  isolation, secret-like path-only evidence, deterministic JSON, ignored
  generated artifacts, fixture hashing, and no-mutation proof. Validated in
  Phase 02: Shared Safety Harness.
- [x] Add deterministic fixtures and tests proving no target-project mutation,
  no secret leakage, consistent status/counts across artifacts, and
  schema-valid review packets. Validated across Phase 01 and Phase 02.
- [x] Consolidate initial seed ideas into `tools/*/SEED-IDEAS.md`,
  `standards/review-packet/SEED-IDEAS.md`, and `docs/` so root-level seed
  folders are no longer baseline noise.
- [x] Define a cross-repo capability request protocol with inbox/outbox,
  decisions, templates, playbook, gate registry, bidirectional examples, and
  docs validation. Validated in Phase 03: Cross-Repo Capability Request Gate.
- [x] Document AI Tools self-use, new-tool intake, git baseline, changelog,
  upstream freshness, and cross-repo incoming/outgoing gates with observable
  evidence and skip behavior. Validated in Phase 03.
- [x] Build `contract-drift-auditor` as the first external read-only tool with
  explicit `--project` and `--out`, output isolation, deterministic drift
  checks, and shared review packet output. Validated in Phase 04.
- [x] Build a shared packet renderer so summary, findings, recommended actions,
  Markdown projections, and CLI status are rendered from one packet model.
  Validated in Phase 04.
- [x] Ensure first auditor findings cite narrow evidence and mark unknown facts
  explicitly. Validated in Phase 04.
- [x] Document the first release surface, including root usage entrypoint,
  auditor use/non-use guidance, optional `ai-workspace-kit` integration, and
  release readiness checklist. Validated in Phase 05.
- [x] Harden full-repo self-audit source filtering so historical phase
  artifacts and nested fixture contracts do not dominate release evidence.
  Validated in Phase 05.
- [x] Run release gate review manually using current `ai-workspace-kit`
  guidance while no runnable upstream gate-review command exists. Validated in
  Phase 05.
- [x] Close the v1 release baseline with accurate auditor limitations, release
  packet fixtures, centralized tool metadata, and safe self-audit invocation.
  Validated in Phase 06.
- [x] Build the cross-repo compatibility checker before any automatic
  cross-repo indexer or gate-linter automation. Validated in Phase 07:
  Cross-Repo Compatibility Checker MVP.
- [x] Improve `contract-drift-auditor` CLI ergonomics with compact machine
  stdout, quiet mode, and opt-in fail policy while keeping packet artifacts as
  the source of truth. Validated in Phase 08: Contract Drift Auditor CLI
  Ergonomics.
- [x] Add a machine-readable tool registry and slim root `AGENTS.md` by moving
  detailed gate policy into focused workflow gate documentation. Validated in
  Phase 09: Tool Registry and Workflow Gate Slimming.
- [x] Build `gates-scan` as an evidence-only mechanical gate linter with
  explicit `--project` and `--out`, fixture-backed checks, shared review packet
  output, and self-use evidence. Validated in Phase 10: Evidence-Only Gate
  Linter Seed MVP.
- [x] Review deferred v2 seed tools and promote exactly one next
  implementation candidate from evidence. `project-context-ledger` was promoted
  to planned and the other broad seeds stayed deferred. Validated in Phase 11:
  v2 Tool Selection Review.
- [x] Build `project-context-ledger` as a read-only optional evidence tool with
  explicit `--project` and `--out`, shared review packet output, six ledger JSON
  artifacts, target non-mutation proof, secret path-only evidence, generated
  packet exclusion, and self-use evidence. Validated in Phase 12: Project
  Context Ledger MVP.
- [x] Build `review-packet-rollup` as a mechanical packet consumer that
  validates and aggregates multiple existing review packet directories without
  running source tools or making suppression decisions. Validated in Phase 13:
  Review Packet Rollup MVP.
- [x] Stabilize public JSON Schemas for project-context-ledger artifacts and
  validate generated ledger output against them. Validated in Phase 14: Ledger
  Artifact Schemas.
- [x] Add human review dispositions with owner, reason, expiry, evidence refs,
  stable finding fingerprints, and rollup-side `DISPOSITION-INDEX.json`
  consumption without rewriting source findings. Validated in Phase 15: Review
  Disposition Model.

### Active

- [ ] Keep `ai-workspace-kit` integration optional and review-packet based.
- [ ] Enforce the ai-workspace-kit tandem boundary gate so AI Tools does not
  duplicate adoption/bootstrap, adapter generation, or generated-contract
  review capabilities already owned by `ai-workspace-kit`.
- [ ] Run an ai-workspace-kit upstream freshness gate before each phase planning
  step so planning uses the latest reachable upstream commit and records
  reusable changes.
- [ ] Maintain `CHANGELOG.md` after every completed phase, executed major plan,
  or workflow gate change.
- [ ] Keep forensics, config, skill, test quality, UI, runtime, integration,
  and domain tools deferred until their Phase 11 trigger evidence appears.
- [ ] Add ledger scope and diff modes so current source-of-truth facts can be
  separated from historical phase artifacts.
- [ ] Unify validated tool CLI behavior around machine stdout, quiet mode,
  fail policy, mutating flag rejection, and documented exit codes.
- [ ] Validate that `ai-workspace-kit` machine-readable LLM instructions can
  cite AI Tools outputs only as optional evidence, not as a runtime dependency,
  runner, or automatic gate decision layer.

### Out of Scope

- Building all seed tools at once - this would create many disconnected partial
  tools before the shared standards exist.
- Auto-fixing target projects in the MVP - write behavior needs a future,
  explicitly designed `--fix` mode.
- Installing dependencies in target projects - auditors must inspect evidence,
  not mutate project environments.
- Reading secret-like file contents by default - these files are path-only
  evidence unless the user requests exact access.
- Making external tools mandatory dependencies of `ai-workspace-kit` or target
  products - integration stays optional.
- Rebuilding `ai-workspace-kit` adoption/bootstrap behavior inside AI Tools -
  the two projects work in tandem, so duplicated adapter generation,
  generated-contract review routing, or project-local contract installation
  belongs upstream or as compatibility integration, not as a parallel tool.
- Auto-creating AI Tools phases from incoming cross-repo requests - requests are
  decision points first, not automatic commitments.
- Starting with AI-generated prose reports only - the first implementation work
  must be schemas, fixtures, parsers, and deterministic reports.

## Context

The repository keeps product seed ideas in `tools/*/SEED-IDEAS.md`. Each seed
file describes purpose, inputs, outputs, MVP, risks, and integration ideas.
These are planning seeds, not final architecture.

Important seed areas:

- `standards/review-packet/SEED-IDEAS.md`
- `tools/ai-workspace-kit-internal-gates/SEED-IDEAS.md`
- `tools/contract-drift-auditor/SEED-IDEAS.md`
- `tools/project-context-ledger/SEED-IDEAS.md`
- `tools/phase-forensics-tool/SEED-IDEAS.md`
- `tools/config-matrix-validator/SEED-IDEAS.md`
- `tools/domain-contract-test-generator/SEED-IDEAS.md`
- `tools/runtime-capability-inspector/SEED-IDEAS.md`
- `tools/skill-linter/SEED-IDEAS.md`
- `tools/test-quality-auditor/SEED-IDEAS.md`
- `tools/tool-usage-registry/SEED-IDEAS.md`
- `tools/ui-regression-screenshot-comparator/SEED-IDEAS.md`
- `tools/local-integration-harness/SEED-IDEAS.md`
- implemented `gates-scan` gate-linter seed from the `ai-workspace-kit`
  cross-repo request
- implemented `cross-repo-compatibility-checker` for validating `ai-tools` and
  `ai-workspace-kit` protocol threads before any automatic indexer/gate-linter

The project guide is `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md`. It is the main
source for implementation order and standards. The local `AGENTS.md` adapts
`phoenix-lib/ai-workspace-kit` workflow principles for this repository.

The local `.external/ai-workspace-kit` checkout is a reference source only. It
should not be treated as target-project evidence unless a task explicitly asks
to inspect it.

## Constraints

- **Review-only default**: MVP tools must not mutate target projects.
- **Output isolation**: Report-generating CLIs must require `--out <dir>` and
  reject target-project output paths for target-project audits.
- **Secret safety**: Secret-like files may be listed as path-only evidence, but
  contents must not be read, copied, rendered, or hashed into user-facing
  reports by default.
- **Evidence-first reporting**: Findings must cite evidence refs; unknowns must
  be marked `unknown`, `stale`, `TODO`, or `unresolved`.
- **Determinism**: JSON output should use canonical recursively sorted keys and
  trailing newlines; tests should prove deterministic reports.
- **Optional integration**: `ai-workspace-kit` remains the adoption/bootstrap
  contract tool; external auditors are optional helpers.
- **Tandem boundary gate**: Before planning a new tool, classify whether the
  capability is owned by AI Tools, owned by `ai-workspace-kit`, or shared
  boundary work. Do not mask duplicate `ai-workspace-kit` behavior as a new AI
  Tools review utility.
- **Upstream freshness gate**: Before phase planning, compare the local
  `.external/ai-workspace-kit` commit with GitHub `HEAD`, fast-forward the
  checkout when it changed, review the upstream diff, and record project impacts
  before writing or updating a phase plan.
- **Cross-repo request gate**: When AI Tools needs a capability owned by
  `ai-workspace-kit`, create an outbox request instead of implementing it here.
  Incoming requests from `ai-workspace-kit` create decision points, not automatic
  phases, tool runs, dependencies, or copied planning state.
- **Project changelog gate**: After every completed phase, executed major plan,
  or workflow gate change, update `CHANGELOG.md` with changed scope,
  validation, and upstream impact.
- **Upstream changelog pre-read**: When the ai-workspace-kit freshness gate
  detects upstream changes, read upstream changelog/release notes first if that
  artifact exists and changed. If it does not exist yet, record the absence and
  use commit log plus diff review.
- **Future gate review hook**: At release hardening and maintenance boundaries,
  use the future `ai-workspace-kit` gate-review capability once available to
  find conflicting, stale, or irrelevant gates. Until then, review manually and
  route gaps through cross-repo requests or decisions.
- **Git baseline gate**: Before relying on `git status` as evidence, distinguish
  old untracked seed/project files from active work. A broad baseline commit
  needs explicit approval and must stay separate from feature commits.
- **Self-use gate**: Once an AI Tools capability is implemented and validated,
  check whether it applies to this repository's planning, execution,
  verification, or release stage. Run applicable tools as read-only evidence or
  record why they are skipped.
- **New tool intake gate**: Every new tool idea must be classified by owner,
  destination, maturity, activation stage, outputs, and non-goals before
  implementation starts.
- **Windows compatibility**: Clean clone tests must pass on Windows, including
  line-ending behavior.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with the review packet standard | Every later tool depends on a stable output contract. | Validated in Phase 01 |
| Build one external auditor before expanding the ecosystem | A small green `contract-drift-auditor` proves the standards under real use. | Validated in Phase 04 |
| Consolidate seed ideas under their future homes | Tool ideas should live beside the future tool namespace, while shared packet ideas stay under `standards/`. | Validated 2026-05-07 |
| Use `ai-workspace-kit` workflow principles but keep it optional | The workflow is useful, but target projects should not inherit dependencies or assumptions. | Pending |
| Treat generated packets as review material, not installation material | This preserves user control and avoids accidental target-project mutation. | Pending |
| Enforce the ai-workspace-kit tandem boundary gate | AI Tools should complement `ai-workspace-kit`, not duplicate adoption/bootstrap or adapter-generation behavior under new tool names. | Active |
| Enforce the ai-workspace-kit upstream freshness gate | `ai-workspace-kit` is a living upstream reference; phase plans should reflect current contracts, schemas, and workflow lessons. | Active |
| Insert Cross-Repo Capability Request Gate before the first heavy auditor | The two repos need a structured request/decision protocol before external tool work starts consuming or influencing upstream contracts. | Validated in Phase 03 |
| Maintain a project changelog after major work | Future agents need a compact history before reading deeper planning artifacts. | Active |
| Plan ai-workspace-kit gate review as a future hook | The upstream command does not exist yet, so AI Tools should reserve the review stage without pretending it is currently runnable. | Validated in Phase 05 |
| Treat mechanical gate-linter output as evidence only | Gate relevance and boundary decisions remain assistant-owned semantic review; tools can surface evidence but not decide adoption. | Validated in Phase 10 |
| Validate shared safety harness before auditor work | The first heavy auditor should consume already-tested read-only, secret-safe, deterministic primitives instead of inventing safety behavior locally. | Validated in Phase 02 |
| Add shared packet renderer before broad tool expansion | Schemas alone are not enough; packet-producing tools need one renderer so JSON, Markdown, and CLI status cannot drift. | Validated in Phase 04 |
| Treat self-use tools as evidence, not authority | AI Tools should audit itself with validated tools, but the assistant keeps responsibility for scope, relevance, and boundary decisions. | Validated in Phase 03 |
| Classify new tools before implementation | New tool ideas should go to `standards/`, `shared/`, `tools/<tool-name>/`, seed/backlog, or cross-repo requests based on ownership and maturity. | Validated in Phase 03 |
| Defer cross-repo protocol automation until a validator exists | Human-reviewed protocol exchange is compatible now, but automatic indexers or gate linters need a read-only checker that validates both repositories together. | Validated in Phase 07 |
| Start v2 with release closeout, metadata, and cross-repo validation | Release discipline and interop drift are the current risks; broad seed tools should wait until tool registry and validator guardrails exist. | Phase 06 validated release closeout; Phase 07 validated cross-repo checker |
| Keep release examples generated from the shared packet model | Committed examples are useful only if JSON and Markdown stay internally consistent with packet semantics. | Validated in Phase 06 |
| Keep CLI fail policy opt-in | Packet status is evidence; shell failure should be a caller-selected policy so default auditor runs remain non-breaking. | Validated in Phase 08 |
| Use a machine-readable tool registry before broad tool expansion | Future agents need deterministic capability routing, self-use policy, and non-goals before promoting seed tools. | Validated in Phase 09 |
| Promote `gates-scan` only as external mechanical evidence | The scanner should find deterministic gate evidence gaps without approving, rejecting, revising, or auto-running gates. | Validated in Phase 10 |
| Promote `project-context-ledger` as the next v2 tool | Repeated project fact, command, contract, planning, packet, and decision context loading is the strongest current evidence-backed demand. | Validated in Phase 12 |
| Start v2.1 with evidence consumption, not another broad auditor | Phase 12 self-use showed ledger output is useful but noisy; the next risk is signal quality, packet consumption, and shared contracts. | Active |
| Keep review packet rollup mechanical | Rollup may validate, aggregate, group, and index packet evidence, but must not decide that findings are safe to ignore or automatically resolved. | Validated in Phase 13 and extended in Phase 15 |
| Treat review dispositions as human review context | Dispositions should carry owner, reason, expiry, evidence refs, and tool/schema versions while preserving the original finding. | Validated in Phase 15 |
| Incorporate `ai-workspace-kit` LLM instructions as optional interop evidence | Upstream now publishes `.external/ai-workspace-kit/LLM-PROJECT-INSTRUCTIONS.json`; AI Tools may validate optional evidence wording without becoming a kit dependency. | Active |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? Move to Out of Scope with reason.
2. Requirements validated? Move to Validated with phase reference.
3. New requirements emerged? Add to Active.
4. Decisions to log? Add to Key Decisions.
5. "What This Is" still accurate? Update if drifted.

**After each milestone**:
1. Full review of all sections.
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state.

---
*Last updated: 2026-05-08 after completing Phase 15 Review Disposition Model*
