# Capability Request

ID: REQ-20260507-ai-tools-to-ai-workspace-kit-review-packet-contract
From: ai-tools
To: ai-workspace-kit
Status: proposed
Severity: medium
Requested by phase/gate: Phase 3 Outgoing Need Gate / review packet interoperability
Boundary classification: interop contract

## Need

Stable review packet schema and evidence reference compatibility contract that
AI Tools can target without importing `ai-workspace-kit` internals.

## Why

External tools need a stable packet format to integrate with GSD,
`ai-workspace-kit`, humans, and CI. AI Tools owns external auditors and packet
mechanics, while `ai-workspace-kit` owns adoption review semantics and generated
contract policy. The boundary needs shared compatibility notes rather than
hidden dependencies.

## Evidence

- `standards/review-packet/README.md`
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json`
- `.external/ai-workspace-kit/ADAPTER-GENERATION.md`
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md`

## Boundary

This is shared interoperability work. AI Tools should not implement
`ai-workspace-kit` adoption review, and `ai-workspace-kit` should not implement
AI Tools auditors. Both repositories can document compatible status, severity,
evidence, and decision semantics.

## Expected Output

- stable `REVIEW-SUMMARY.json` compatibility notes;
- evidence ref semantics;
- severity/status mapping;
- generated contract policy compatibility notes where adoption review consumes
  external packets.

## Compatibility Impact

Reduces drift between AI Tools packet output and `ai-workspace-kit` adoption
review packet expectations without creating a runtime dependency in either
direction.

## Acceptance Criteria

- Compatibility notes can be read without installing either repository.
- Evidence refs have stable path/hash/path-only semantics.
- Severity and status mapping is explicit.
- Generated contract policy remains `ai-workspace-kit` owned.
- External auditor output remains AI Tools owned.

## Non-Goals

- Do not make `ai-workspace-kit` depend on AI Tools.
- Do not auto-run AI Tools from `ai-workspace-kit`.
- Do not copy `.planning` state between repositories.
- Do not replace AI Tools schemas with kit internals.
- Do not treat compatibility notes as approval to consume every future packet
  change automatically.

## Decision Needed

Should `ai-workspace-kit` publish stable review packet compatibility notes for
external AI Tools packet consumers?

## Review / Expiry

Review before AI Tools Phase 4 packet renderer and contract drift auditor
integration. Mark stale if a shared standard supersedes the current packet
contract.
