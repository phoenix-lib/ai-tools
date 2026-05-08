# Workflow Gates

This document is the detailed workflow gate playbook for AI Tools. The root
`AGENTS.md` keeps the short entrypoint and hard rules; this file keeps the
longer procedures, evidence expectations, skip rules, and boundaries.

Gate metadata lives in `.planning/gates/registry.json`. Tool maturity and
self-use routing lives in `tools/registry.json`.

## Gate Resolution Rules

- Important artifacts must include `## Gate Resolution` when a registered gate
  applies.
- `Skipped` is valid only when the registry has `skip_allowed: true`.
- If `skip_reason_required: true`, record a concrete reason.
- Tool output is evidence only. The assistant still decides whether a gate is
  relevant, stale, duplicated, or boundary-breaking.
- Do not auto-run tools.
- Do not auto-create phases.
- Do not install dependencies or copy `.planning` state between repositories
  from a gate result.

## Discuss Mode Gate

Resolve `discuss-mode` before any `$gsd-discuss-phase` gray-area analysis, user
questions, checkpoint writes, `*-CONTEXT.md`, or `*-DISCUSSION-LOG.md` writes.

`workflow.discuss_mode` is routing only. It is not user approval for Manual
Questions or Trusted Self-Questioning.

If interactive question tooling is unavailable, present a plain-text numbered
list and stop for user input. Record selected mode, selected_by, approval
source, evidence, and self-questioning cycle limits or skip reason.

## ai-workspace-kit Upstream Freshness / Kit Update Self-Check

Run before phase planning, major replanning, or phase-boundary maintenance when
the phase depends on `ai-workspace-kit` contracts, gates, schemas, review packet
semantics, optional-tool guidance, or interop docs.

Procedure:

1. Record the local `.external/ai-workspace-kit` commit and dirty status.
2. Check reachable upstream HEAD when permitted.
3. If commits differ, update only with explicit permission and clean checkout.
4. Read upstream `CHANGELOG.md`, `CHANGES.md`, release notes, or equivalent
   first when present and changed.
5. Review changed source layers directly when changelog is missing, stale, or
   incomplete.
6. Record update-impact findings in the active phase Gate Resolution. For
   substantial upstream changes, create
   `.planning/phases/<phase>/<phase>-UPSTREAM-UPDATE-REVIEW.md`.

Required update-impact fields:

- old_commit
- new_commit
- update_action
- changelog_reviewed
- changed_source_layers
- usable_ideas
- boundary_classification
- current_repo_impact
- current_phase_impact
- consumer_practice_impact
- self_use_check_output
- cross_repo_request_needed
- decision
- evidence
- no_install_run_dependency

The gate answers three questions: what changes affect AI Tools now, what
changes affect the current phase, and what reusable practice should future AI
Tools consumers inherit. It must also state what remains kit-owned.

## Project Changelog Gate

Run after every completed GSD phase, executed major plan, and workflow gate
change.

Each entry should include date, phase or plan, changed scope, validation,
upstream impact, compatibility impact, breaking or potentially breaking changes,
and migration notes. Changelog entries are downstream planning evidence, not
approval to consume a changed capability automatically.

## AI Tools Self-Use Gate

Use `tools/registry.json` to classify relevant capabilities by maturity and
self-use policy. Run only validated matching tools, with explicit inputs and
external output directories.

Record command, output location, packet status, finding counts, important
findings, skip reason if applicable, and assistant interpretation. Findings are
evidence; they do not replace verification or user decisions.

## New Tool Intake and Placement Gate

Run whenever a new AI Tools capability is proposed, discovered in an upstream
request, added as a seed, or requested by the user.

Classify:

- owner: AI Tools, `ai-workspace-kit`, or shared-boundary;
- destination: `standards/`, `shared/`, `tools/<tool-name>/`,
  `tools/<tool-name>/SEED-IDEAS.md`, backlog, or cross-repo request;
- maturity: validated, implemented, planned, seed-only, or deferred;
- activation stage;
- expected outputs;
- use gate;
- non-goals.

Do not implement until owner, destination, maturity, activation stage, outputs,
and non-goals are explicit. If the need is kit-owned, write an outbox request
instead of rebuilding it in AI Tools.

## Git Baseline Gate

Run before using repository cleanliness as planning, verification, review
packet, or release evidence.

Check `git status --short`, classify baseline seed/project files separately
from active work, and avoid broad staging. If unresolved baseline noise exists,
record it in `.planning/STATE.md`.

## Cross-Repo Incoming and Outgoing Gates

Use `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md` for request and
decision protocol.

Outgoing Need Gate applies during research and planning. If a needed capability
belongs to `ai-workspace-kit`, do not implement it locally; create an outbox
request.

Incoming Review Gate applies during discuss, maintenance, and phase-boundary
review. Incoming requests create decision points only. They do not
automatically create phases, run tools, add dependencies, or copy planning
state.

## Future ai-workspace-kit Gate Review Hook

At release hardening and maintenance boundaries, use the future upstream
gate-review capability when it exists. Until then, do manual assistant-led gate
review and route gaps through cross-repo requests or decisions.

Future mechanical gate-linter output may be evidence, but the assistant owns
the final semantic decision.

## ai-workspace-kit Tandem Boundary

AI Tools owns external read-only auditors, shared review packet schemas,
evidence refs, safety helpers, fixtures, deterministic checks, validators, and
optional packet consumers.

`ai-workspace-kit` owns project adoption/bootstrap, assistant contract
generation, adapter-specific contract files, generated local guidance, adoption
review packets, merge/conflict routing for generated contracts, adapter next
steps, and permission policy.

Shared boundary work belongs in cross-repo requests, compatibility docs, or
evidence-only validators. Do not duplicate kit-owned functionality under a
generic "review" or "gate" name.
