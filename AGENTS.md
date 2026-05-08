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
- Gate registry: `.planning/gates/registry.json`
- Workflow gate details: `.planning/gates/WORKFLOW-GATES.md`
- Cross-repo playbook: `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`
- Tool capability catalog: `tools/registry.json`
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
before the shared review packet standard and validated guardrails exist.

## Workflow

- Read `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md` before making architectural
  changes.
- Read the relevant `tools/<tool-name>/SEED-IDEAS.md` file before implementing
  a tool.
- Use `.planning/gates/registry.json` as the machine-readable source for local
  workflow gates. Use `.planning/gates/WORKFLOW-GATES.md` for detailed gate
  procedure, evidence expectations, skip rules, and non-automation boundaries.
- Use `tools/registry.json` to classify tool ownership, maturity, activation
  stage, expected outputs, self-use routing, and non-goals before relying on,
  promoting, or implementing a capability.
- Major GSD artifacts must include a `Gate Resolution` section when a
  registered gate applies, or an explicit reason when it does not apply.
- Before any `$gsd-discuss-phase` gray-area analysis, user questions,
  checkpoint writes, `*-CONTEXT.md`, or `*-DISCUSSION-LOG.md` writes, read
  `.planning/gates/registry.json` and resolve gate id `discuss-mode`.
  `workflow.discuss_mode` is routing only; it is not evidence of user approval
  for Manual Questions or Trusted Self-Questioning.
- If `discuss-mode` applies, ask the user to choose Manual Questions or
  Trusted Self-Questioning. If interactive question tooling is unavailable,
  present a plain-text numbered list and stop for user input. Do not write
  phase discussion artifacts until the user answers.
- Record the selected mode, selected_by, approval source, evidence, and
  self-questioning cycle limits or skip reason in the `Gate Resolution`.
- Run the ai-workspace-kit upstream freshness / Kit Update Self-Check gate
  before phase planning or major replanning when the phase depends on upstream
  contracts, gates, schemas, review packet semantics, optional-tool guidance,
  or interop docs.
- Run the AI Tools Self-Use Gate when planning, executing, verifying, or
  releasing this repository after a relevant AI Tools capability has been
  implemented and validated. Tool output is evidence only.
- Run the New Tool Intake and Placement Gate whenever a new tool idea, upstream
  request, seed, or user request appears.
- Treat incoming cross-repo requests as decision points. They do not
  automatically create phases, run tools, add dependencies, or copy planning
  state across repositories.
- After every completed GSD phase, executed major plan, or workflow gate
  change, update `CHANGELOG.md` with changed scope, validation, and
  `ai-workspace-kit` upstream impact.
- Preserve the tandem boundary: AI Tools owns external read-only auditors,
  shared review packet mechanics, deterministic evidence collectors, validators,
  fixtures, and optional packet consumers. `ai-workspace-kit` owns
  adoption/bootstrap contracts, adapter guidance, generated local guidance,
  generated-contract review, and permission policy.
- Do not copy `.planning` state or assumptions from any external project into
  this repository.

## Safety

- Preserve user changes. Do not revert, overwrite, or discard unrelated files
  without explicit instruction.
- Never read or expose secret contents unless the user requests that exact file
  or value and the access is necessary.
- Treat `.env`, `.env.*`, key, token, credential, and secret files as path-only
  evidence by default.
- Ask before writes outside the workspace, commits, package installs, remote
  git operations, network actions with external effects, long-lived services,
  or destructive operations.
- MVP tools must be review-only and must not mutate target projects.
- Prefer one small green read-only tool over broad README expansion.
- Keep shared contracts in `standards/` and reusable mechanics in `shared/`.
  Tool-specific checks belong under `tools/<tool-name>/`.

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
- Use canonical JSON with recursively sorted keys and a trailing newline.
- `--out <dir>` is required for report-generating CLIs, and output paths inside
  the target project must be rejected for target-project audits.
- Review packets must clearly separate blockers, required decisions, rejected
  assumptions, stricter local rules to preserve, and safe-to-merge findings.

## Verification Checklist

- Source layers are current.
- Commands are verified from project files before being documented.
- Review-only commands do not mutate target projects.
- Secret-like contents do not appear in outputs.
- Tree-hash or equivalent fixture checks prove non-mutation.
- CLI status, Markdown status, JSON summary status, and counts match.
- Adapter/tool selection is respected; unrequested outputs and next steps are
  not generated.
