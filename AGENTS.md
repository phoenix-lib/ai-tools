# AGENTS.md

## Generated Source

Created from the `phoenix-lib/ai-workspace-kit` contract model and adapted for
this repository. Review this file at phase boundaries and when project facts
change. Stricter local rules may be added, but the safety floor must not be
weakened.

## Source Layers

- Core reference: `.external/ai-workspace-kit/CORE-CONTRACT.md`
- Bootstrap reference: `.external/ai-workspace-kit/AI-BOOTSTRAP.md`
- Adapter reference: `.external/ai-workspace-kit/ADAPTER-GENERATION.md`
- Project guide: `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md`
- Project changelog: `CHANGELOG.md`
- Initial seed overview: `docs/INITIAL-SEED-OVERVIEW.md`
- Product seeds: `tools/*/SEED-IDEAS.md` and
  `standards/review-packet/SEED-IDEAS.md`

## Project Contract

Project: `ai-tools`

Purpose: build a small ecosystem of read-only AI development auditors that
produce evidence-backed review packets for assistants, humans, CI jobs, and GSD
workflows without becoming mandatory dependencies of target projects.

Keep this repository focused on standards, schemas, fixtures, deterministic
parsers, and read-only auditors. Do not expand it into many disconnected tools
before the shared review packet standard and first external auditor exist.

## Current Facts

- Current state includes review packet schemas/examples, shared safety helpers,
  target fixtures, automated tests, and consolidated tool seed ideas under
  `tools/*/SEED-IDEAS.md`.
- Root `package.json` exists with `npm test` backed by `node --test`; no build
  command is defined yet.
- The current recommended implementation order is review packet standard,
  shared safety harness, cross-repo capability request gate, then
  `contract-drift-auditor`.
- `.external/ai-workspace-kit` is a local reference checkout only. Do not treat
  it as target project evidence unless the task explicitly asks to inspect it.
- This directory is now a git repository initialized during GSD project setup.

## Workflow

- Read `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md` before making architectural
  changes.
- Read the relevant `tools/<tool-name>/SEED-IDEAS.md` file before implementing
  a tool.
- Run the ai-workspace-kit tandem boundary gate before proposing, planning, or
  implementing a new tool or review workflow.
- Before every GSD phase planning step, run the ai-workspace-kit upstream
  freshness gate. Planning must use the latest reachable
  `phoenix-lib/ai-workspace-kit` reference, not a stale local checkout.
- Treat incoming cross-repo capability requests as decision points. They do not
  automatically create phases, run tools, add dependencies, or copy planning
  state across repositories.
- Run the AI Tools Self-Use Gate when planning, executing, verifying, or
  releasing this repository after a relevant AI Tools capability has been
  implemented and validated.
- Run the New Tool Intake and Placement Gate whenever a new tool idea, upstream
  request, seed, or user request appears.
- Before relying on `git status` as evidence, separate baseline seed files from
  active work through the Git Baseline Gate.
- After every completed GSD phase, executed major plan, or workflow gate change,
  update `CHANGELOG.md` with what changed, validation performed, and any
  `ai-workspace-kit` upstream impact.
- Prefer one small green read-only tool over broad README expansion.
- Keep shared contracts in `standards/` and reusable mechanics in `shared/`.
  Tool-specific checks belong under `tools/<tool-name>/` once implementation
  begins.
- Use schemas, fixtures, deterministic output, and tests before adding complex
  heuristics.
- Do not copy `.planning` state or assumptions from any external project into
  this repository.

## ai-workspace-kit Workflow Rules

Use `.external/ai-workspace-kit` as the workflow reference for assistant
contracts, not as a product dependency.

- Keep the layer boundary clear: core policy and shared standards are separate
  from tool-specific mechanics and adapter-specific behavior.
- Before adopting or changing assistant contracts, inspect existing local
  guidance and propose merges. Do not blindly replace project-specific rules.
- Generated or derived contracts are review material first. They need explicit
  review before they become project-local guidance.
- Prefer an adoption-review shape for any contract-producing command:
  `--review`, explicit `--project`, explicit `--out`, and no writes to the
  target project.
- `--out` must be outside the audited target project for target-project audits.
  If a tool audits this repository itself, write review artifacts to a separate
  review directory and ignore generated review packets on later scans.
- Use adapter/tool selection explicitly. If only Codex output is requested,
  do not generate Claude files or tell the user to inspect Claude-only files.
- Treat `ADOPTION-REVIEW.md`-style files as packet overview, `CONFLICTS.md` as
  decision routing, file/hash reviews as merge evidence, and JSON manifests as
  the machine source of truth.
- Render all human-readable reports, machine summaries, and CLI status from one
  shared summary object so counts and status cannot diverge.
- Keep project-local contracts living. At phase boundaries and whenever facts
  change, review stack facts, commands, risks, permissions, optional tools,
  source layers, and skills for drift.
- During GSD discuss/context gathering, ask each phase whether the user wants
  manual questions or trusted self-questioning. Do not persist that answer as a
  global preference.

## ai-workspace-kit Upstream Freshness Gate

Run this gate before every `$gsd-plan-phase`, before major replanning, and
whenever a phase depends on `ai-workspace-kit` behavior. The purpose is to keep
this project aligned with the living upstream kit and to harvest useful new
principles without copying its product responsibilities.

1. Read the current local commit:
   `git -C .external/ai-workspace-kit rev-parse HEAD`.
2. Check the latest reachable upstream commit:
   `git ls-remote https://github.com/phoenix-lib/ai-workspace-kit.git HEAD`.
3. If the commits differ, ensure the local checkout is clean, then update it
   with `git -C .external/ai-workspace-kit pull --ff-only`. If the checkout is
   missing, clone it into `.external/ai-workspace-kit`.
4. Review what changed before planning. If upstream provides `CHANGELOG.md`,
   `CHANGES.md`, release notes, or an equivalent change log and that file
   changed, read it first. If no upstream changelog exists, record that and use
   commit log plus changed files:
   - `git -C .external/ai-workspace-kit log --oneline <old>..<new>`
   - `git -C .external/ai-workspace-kit diff --name-only <old>..<new>`
   - Changed source layers such as `CORE-CONTRACT.md`,
     `AI-BOOTSTRAP.md`, `ADAPTER-GENERATION.md`, `TOOLING-PLAYBOOK.md`,
     schemas, adapter templates, and `scripts/lib/*`.
5. Update `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md` with the
   checked commits, upstream changelog status, changed areas, usable ideas,
   boundaries to preserve, and any phase-planning impact.
6. Carry relevant findings into the active phase `CONTEXT.md`, `RESEARCH.md`,
   or `PLAN.md` so downstream agents see the current upstream state.

Do not copy `.external/ai-workspace-kit/.planning` state into this project.
Treat upstream changes as evidence and design input, not as automatic authority
over AI Tools scope. If network access is unavailable, record the upstream
commit as `unknown`, note the risk in the phase plan, and avoid decisions that
depend on newly changed kit behavior until the gate can run.

## Project Changelog Gate

Run this gate after every completed GSD phase, executed major plan, and workflow
gate change before the final commit or final response for that work.

1. Update `CHANGELOG.md`.
2. Include date, phase or plan ID, changed behavior or planning scope, important
   files or artifacts, validation run, and any `ai-workspace-kit` upstream
   commit/changelog impact.
3. If the work is documentation-only, say so explicitly instead of implying
   runtime behavior changed.
4. Do not include secrets, raw environment values, or broad file dumps.
5. Keep the changelog human-readable; detailed evidence belongs in phase
   summaries, review packets, or research files.

## Git Baseline Gate

Run this gate before using repository cleanliness as evidence in planning,
verification, review packets, release readiness, or self-audits.

1. Check `git status --short` and identify untracked seed/project files versus
   active implementation changes.
2. If untracked files are intended baseline project content, ask for an explicit
   baseline decision before staging them. Do not silently mix broad baseline
   staging with feature or gate work.
3. If untracked files are not intended project content, route them to
   `.gitignore`, cleanup, or a documented deferred decision.
4. Record unresolved baseline noise in `.planning/STATE.md` so later agents do
   not misread old untracked files as current work.
5. When a baseline commit is approved, keep it separate from feature commits and
   do not include generated review output or secrets.

## AI Tools Self-Use Gate

AI Tools should use its own validated tools while developing AI Tools, but only
as read-only evidence. Tool output does not replace assistant judgment, phase
verification, or user decisions.

Run this gate at phase planning, after major gate/contract changes, during
phase verification, and before release readiness:

1. List relevant AI Tools capabilities from `ROADMAP.md`, `REQUIREMENTS.md`,
   `CHANGELOG.md`, and tool manifests once they exist.
2. Classify each capability maturity:
   - **seed**: idea only; do not run.
   - **planned**: phase or plan exists; do not run as evidence.
   - **experimental**: may be run manually, but cannot block by itself.
   - **validated**: may be used as supporting evidence for matching work.
   - **self-use required**: must run at its documented stage, or the skip reason
     must be recorded.
3. Run only validated tools whose scope matches the current work. Use explicit
   `--project <repo>` and `--out <dir>` arguments, keep outputs outside the
   audited target unless a tool explicitly supports a safe ignored review
   location, and never mutate the target project.
4. Record command, output location, summary status, important findings, and any
   skip reason in the active phase artifact or verification report.
5. Treat findings as evidence. The assistant still decides whether a gate is
   relevant, stale, duplicated, or boundary-breaking.

Initial applicability matrix:

| Tool capability | Use stage for this repo | Status |
|-----------------|-------------------------|--------|
| `contract-drift-auditor` | Before phase planning after contract/source-layer changes, during release readiness | Planned Phase 04 |
| shared packet renderer | All packet-producing tools and self-audit reports | Planned Phase 04 |
| mechanical gate linter | After workflow gate changes and release/maintenance boundaries | v2 candidate, evidence only |
| test quality auditor | After non-trivial test-suite changes | v2 candidate |
| runtime capability inspector | Before documenting commands, permissions, or tool availability | v2 candidate |
| phase forensics tool | After failed or disputed phase execution | v2 candidate |
| project context ledger | Milestone context refresh or large onboarding handoff | v2 candidate |
| UI regression screenshot comparator | UI changes only | v2+ candidate |

## New Tool Intake and Placement Gate

Run this gate whenever a new AI Tools capability is proposed, discovered in an
upstream request, added as a seed, or requested by the user.

1. Run the ai-workspace-kit Tandem Boundary Gate first.
2. Classify ownership:
   - AI Tools owns external read-only auditors, shared review packet mechanics,
     deterministic evidence collectors, safety helpers, renderers, validators,
     fixtures, and optional packet consumers.
   - `ai-workspace-kit` owns adoption/bootstrap contracts, adapter guidance,
     generated project-local guidance, adoption review semantics, and
     permission policy.
   - Shared boundary work belongs in cross-repo requests or compatibility docs,
     not hidden dependencies.
3. Assign the destination before implementation:
   - `standards/` for shared schemas, packet contracts, and compatibility
     semantics.
   - `shared/` for reusable safety, rendering, normalization, or evidence
     mechanics used by multiple tools.
   - `tools/<tool-name>/` for an implemented external auditor or validator.
   - `tools/<tool-name>/SEED-IDEAS.md` or backlog for an idea that is not ready
     for v1.
   - `.planning/cross-repo/outbox/` for kit-owned capabilities AI Tools needs.
   - `.planning/cross-repo/inbox/` plus a decision artifact for incoming
     requests from `ai-workspace-kit`.
4. Define the use gate before coding: when the tool should run, what inputs it
   reads, where outputs go, what artifact proves it ran, and what it must never
   decide automatically.
5. Require read-only default behavior, explicit `--project` and `--out` for
   report-generating CLIs, review packet output compatibility, fixture tests,
   secret-safety tests, and changelog impact notes.
6. Do not implement the tool until ownership, destination, maturity, activation
   stage, outputs, and non-goals are explicit.

## Future ai-workspace-kit Gate Review Hook

At release hardening and later maintenance boundaries, use the future
`ai-workspace-kit` gate-review capability when it exists to review this
repository's assistant contracts, workflow gates, and cross-repo boundaries for
conflicting, stale, or irrelevant guidance.

Until that upstream capability exists, do a manual gate review and route gaps
through `.planning/cross-repo/` requests or decisions once Phase 03 creates that
protocol. Do not block unrelated implementation solely because the upstream
gate-review command is not available yet, and do not create phases
automatically from its findings. Any review packet output must be written
outside the target project.

## ai-workspace-kit Tandem Boundary Gate

AI Tools and `ai-workspace-kit` work in tandem. Do not duplicate
`ai-workspace-kit` capabilities under a different tool name or a generic
"review" label. Before proposing, planning, or implementing any AI Tools
capability:

1. Inspect the relevant `ai-workspace-kit` source layer or docs in
   `.external/ai-workspace-kit`.
2. Classify the capability as one of:
   - **AI Tools owns**: external read-only auditors, shared review packet
     schemas, evidence refs, safety harnesses, fixtures, deterministic checks,
     and packet consumers.
   - **ai-workspace-kit owns**: project adoption/bootstrap, assistant contract
     generation, adapter-specific contract files, generated local guidance,
     adoption review packets, merge/conflict routing for generated contracts,
     adapter next steps, and project-local contract maintenance.
   - **Shared boundary**: packet compatibility, optional integration docs,
     schema-compatible summaries, and evidence that lets the two systems
     interoperate without either becoming a required dependency of the other.
3. If `ai-workspace-kit` already owns the capability, do not rebuild it here.
   Instead, document the boundary, add compatibility checks, consume or emit the
   shared review packet, or propose an upstream `ai-workspace-kit` change.
4. Infrastructure needed for AI Tools to operate is allowed, but it must remain
   clearly in service of external auditors and shared packet validation rather
   than becoming a parallel adoption/bootstrap system.

Examples:

- Do not build a second adapter generator, adoption installer, generated
  `AGENTS.md`/`CLAUDE.md` workflow, or adoption-review merge router in this
  repository.
- Do build schema validation, canonical JSON helpers, path-only evidence,
  mutation-proof fixtures, and external auditors such as
  `contract-drift-auditor`.
- If a proposed tool sounds like "review generated assistant contracts", first
  check whether `ai-workspace-kit` already performs that review. If yes, keep
  AI Tools focused on packet compatibility or external drift evidence.
- If AI Tools needs `ai-workspace-kit` to provide or stabilize a contract, use
  the planned cross-repo capability request protocol instead of implementing the
  kit-owned capability locally.

## Implementation Start Rule

For the first real code phase, start with `standards/review-packet/` and only
the minimum shared helpers needed by the first read-only auditor:

1. JSON schemas for review summary, finding, evidence ref, recommended action,
   and tool manifest.
2. Canonical JSON writer with recursively sorted keys and trailing newline.
3. File walker with the default ignore policy.
4. Secret policy that supports path-only evidence.
5. Fixture harness proving deterministic output and target non-mutation.

Do not implement `project-context-ledger`, `phase-forensics-tool`, UI visual
comparison, or integration harness code until the common review packet schema
and `contract-drift-auditor` MVP exist.

## Safety

- Preserve user changes. Do not revert, overwrite, or discard unrelated files
  without explicit instruction.
- Never read or expose secret contents unless the user requests that exact file
  or value and the access is necessary.
- Treat `.env`, `.env.*`, key, token, credential, and secret files as path-only
  evidence by default.
- Ask before writes outside the workspace, commits, package installs, remote git
  operations, network actions with external effects, long-lived services, or
  destructive operations.
- MVP tools must be review-only and must not mutate target projects.

## Permission Defaults

| Category | Default | Examples |
|----------|---------|----------|
| Read-only inspection | allow | read files, `rg`, `git status`, `git diff`, `git log` |
| Workspace edits | ask | create/edit files, formatters that rewrite files |
| Git history and remotes | ask | commit, push, pull, fetch, remote operations |
| Package changes | ask | install, update, add, remove, dependency downloads |
| Documentation lookup | allow | official docs/reference lookup without project mutation |
| Secrets | deny | `.env`, keys, tokens, credentials unless exact access is requested |
| Destructive operations | deny | recursive delete, forced overwrite, broad cleanup, force push, elevation |

Do not grant permissions for absent package managers or tools. Command
discovery is evidence that a command exists; it is not permission approval.

## Review Packet Standards

- JSON artifacts are for agents and CI; Markdown artifacts are for humans.
- Render CLI, Markdown, and JSON status from one shared summary object.
- Findings must cite evidence refs.
- Unknowns must be marked `unknown`, `stale`, `TODO`, or `unresolved`; do not
  invent project facts.
- Use canonical JSON with recursively sorted keys and trailing newline.
- Include tool version, schema version, policy hashes, target facts, generated
  files, requested outputs, and run timestamp in packet metadata when available.
- `--out <dir>` is required for report-generating CLIs, and output paths inside
  the target project must be rejected for target-project audits.
- Review packets must clearly separate blockers, required decisions, rejected
  assumptions, stricter local rules to preserve, and safe-to-merge findings.
- Command discovery must record command, source file, package root when
  applicable, and verification status. It must not grant permission by itself.

## Verification Checklist

- Source layers are current.
- Commands are verified from project files before being documented.
- Review-only commands do not mutate target projects.
- Secret-like contents do not appear in outputs.
- Tree-hash or equivalent fixture checks prove non-mutation.
- CLI status, Markdown status, JSON summary status, and counts match.
- Adapter/tool selection is respected; unrequested outputs and next steps are
  not generated.
