# Capability Request

Protocol version: 1.0
Canonical ID: REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review
Thread ID: THREAD-20260507-changelog-gate-review
Counterpart ID: none
Counterpart path: none
Legacy ID: none
ID: REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review
From: ai-workspace-kit
To: ai-tools
Status: proposed
Severity: medium
Requested by phase/gate: Phase 11 planning / AI-tools interoperability
Boundary classification: external ai-tools capability

## Need

Add two related AI Tools rules:

1. Changelog gate.
2. Gate review support.

## Why

`ai-workspace-kit` will use AI Tools as an external set of auditors and review
packet producers, but it should not duplicate AI Tools functionality. Downstream
planning needs a compact, reliable way to understand AI Tools changes before
inspecting deeper contracts, schemas, docs, or plans.

## Evidence

- User-provided incoming request captured in
  `.planning/todos/pending/2026-05-07-accept-gate-linter-request.md`.
- `CHANGELOG.md` already records the planned changelog gate.
- `AGENTS.md` already records AI Tools Self-Use Gate, New Tool Intake Gate,
  Git Baseline Gate, Tandem Boundary Gate, and Future Gate Review Hook.
- `.planning/gates/registry.json` now makes required gate evidence mechanical.

## Boundary

`ai-workspace-kit` owns adapter/evidence boundaries, cross-repo request
protocol expectations, and assistant-led gate-review procedure.

AI Tools owns or may later own mechanical gate linter support, external review
packet tools, and auditors that inspect project reality.

## Expected Output

Short-term:

- changelog guidance or `CHANGELOG.md` convention;
- gate-review/gate-linter seed guidance in roadmap or planning docs;
- documentation that mechanical gate checks are evidence only.

Later:

- optional gate-linter tool that can emit `REVIEW-SUMMARY.json`,
  `FINDINGS.md`, and `EVIDENCE.json` compatible with the AI Tools review packet
  standard.

## Compatibility Impact

`ai-workspace-kit` can read AI Tools changelog first during freshness checks,
then inspect changed contracts/schemas/docs directly when the changelog is
missing, stale, or incomplete. AI Tools remains optional and is not installed,
run, or depended on automatically.

## Acceptance Criteria

- AI Tools records changelog entries after completed phases, major tasks, and
  workflow gate changes.
- AI Tools documents assistant-owned semantic gate review.
- Mechanical gate-linter support is seeded as future evidence-only capability.
- Phase 3 docs validation proves required gate/protocol artifacts exist.
- Incoming requests create decision artifacts, not automatic phases.

## Non-Goals

- Do not make `ai-workspace-kit` depend on AI Tools.
- Do not make AI Tools auto-create phases in `ai-workspace-kit`.
- Do not auto-run AI Tools from `ai-workspace-kit`.
- Do not duplicate contract drift auditor inside `ai-workspace-kit`.
- Do not treat changelog as automatic approval to consume a changed capability.
- Do not make mechanical gate-linter output the final semantic decision.

## Decision Needed

Should AI Tools accept this as a future capability/process requirement, and in
which phase should changelog convention and mechanical gate-linter seed be
planned?

## Review / Expiry

Review during Phase 3 execution and again before release hardening. Mark stale
if a later cross-repo request supersedes the gate-linter scope.
