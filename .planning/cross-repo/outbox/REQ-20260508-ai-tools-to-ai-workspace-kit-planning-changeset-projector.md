# Capability Request

Protocol version: 1.0
Canonical ID: REQ-20260508-ai-tools-to-ai-workspace-kit-planning-changeset-projector
Thread ID: THREAD-20260508-planning-changeset-projector
Origin: local-created
Mirror required: false
Counterpart ID: none
Counterpart path: none
Legacy ID: none
ID: REQ-20260508-ai-tools-to-ai-workspace-kit-planning-changeset-projector
From: ai-tools
To: ai-workspace-kit
Status: proposed
Severity: medium
Requested by phase/gate: Phase 20 New Tool Intake and Cross-Repo Outgoing Need Gates
Boundary classification: interop contract

## Need

A GSD / `ai-workspace-kit` owned planning changeset projector that accepts a
typed `planning-changeset/v1` file, previews the markdown projections, applies
them only on explicit approval, and records journal/status evidence for future
sessions.

## Why

Planning changes currently requires repeated edits across `PROJECT.md`,
`REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `CHANGELOG.md`, and cross-repo
request artifacts. That burns assistant context and increases drift risk. A
typed changeset plus deterministic projector would let agents submit one
compact operation list while the tool handles formatting, propagation,
idempotency, and session recovery.

## Evidence

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `CHANGELOG.md`
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`
- `REVIEW-SUMMARY.json` remains the standard evidence packet summary name for
  any optional AI Tools read-only validator output.

## Boundary

The mutating projector belongs to GSD / `ai-workspace-kit` because it writes
planning state and governs assistant workflow artifacts. AI Tools can define
schemas, fixtures, compatibility notes, or an optional read-only validator, but
should not implement the apply engine as an AI Tools auditor.

## Expected Output

- `planning-changeset/v1` schema compatibility guidance;
- dry-run projection diff;
- explicit `--apply` or equivalent apply step;
- operation IDs and idempotency checks;
- base git commit and file-hash preconditions;
- journal entries for applied changesets;
- status/verify output that a new session can read before loading every
  planning markdown file.

## Compatibility Impact

Reduces planning context load and markdown drift while preserving user control,
GSD ownership of planning mutation, and AI Tools' review-only default.

## Acceptance Criteria

- The projector accepts typed operations, not free-form semantic instructions.
- Dry-run is the default and apply is explicit.
- The tool shows a diff before writing.
- The tool records an applied changeset journal and exposes compact status for
  new sessions.
- File-hash or equivalent preconditions prevent applying stale projections over
  unrelated user edits.
- AI Tools can validate changeset/projection evidence without becoming the
  mutating planning engine.

## Non-Goals

- Do not implement the mutating projector inside AI Tools.
- Do not accept one large free-form prompt and infer hidden semantic decisions.
- Do not auto-create phases, requirements, changelog entries, or cross-repo
  requests without explicit typed operations.
- Do not copy `.planning` state across repositories.
- Do not make AI Tools a runtime dependency of `ai-workspace-kit` or GSD.
- Do not treat optional validator output as approval to apply a changeset.

## Decision Needed

Should `ai-workspace-kit` / GSD own a deterministic planning changeset
projector with dry-run, explicit apply, diff preview, journal, status, and
verify behavior, while AI Tools only supplies compatible schemas and optional
read-only validation evidence?

## Review / Expiry

Review during AI Tools Phase 20 planning and before any portfolio scan
milestone. Mark stale if GSD already ships an equivalent projector or if
planning artifacts move to a different canonical state model.
