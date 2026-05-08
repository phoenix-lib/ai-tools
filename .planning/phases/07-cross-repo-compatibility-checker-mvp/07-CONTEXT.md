---
phase: 7
name: Cross-Repo Compatibility Checker MVP
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - XREPO-VALIDATOR-01
depends_on:
  - Phase 6 Release Closeout and Tool Metadata
---

# Phase 7 Context: Cross-Repo Compatibility Checker MVP

## Goal

Ship the first v2 tool as a read-only compatibility validator for sibling `ai-tools` and `ai-workspace-kit` checkouts.

The tool should convert the manual compatibility reviews already performed between the repositories into a repeatable evidence packet. It must not create a dependency between repos, run tools in the neighboring checkout, mutate `.planning`, or decide whether a capability request should be accepted.

## Gate Resolution

### Discuss Mode Gate

- Gate: `discuss-mode`
- Status: resolved
- Selected mode: Trusted Self-Questioning
- Selected by: user
- Approval source: user replied `2` after the Phase 7 discuss-mode prompt on 2026-05-08
- Evidence: `.planning/gates/registry.json`, `AGENTS.md`, `$gsd-discuss-phase 7` invocation, user answer `2`
- Cycle limits: one context-building self-questioning pass, no open-ended recursion
- Skip reason: not skipped
- Note: `workflow.discuss_mode` is routing only and was not treated as approval.

### Cross-Repo Incoming Review Gate

- Gate: incoming cross-repo request review
- Status: passed
- Evidence reviewed: `.planning/cross-repo/`, `.planning/research/AI-WORKSPACE-KIT-LOCAL-REVIEW.md`
- Decision: existing requests support this phase but do not auto-create or auto-scope work. The checker remains an `ai-tools` owned external validator.
- Follow-up: Phase 7 implementation should use cross-repo protocol artifacts as fixtures/evidence, not as mutable targets.

### Cross-Repo Outgoing Need Gate

- Gate: outgoing need review
- Status: passed
- Decision: no new request to `ai-workspace-kit` is required for this phase.
- Reason: Phase 7 consumes existing kit-owned protocol rules and examples as read-only evidence. Missing or newer kit contracts should be reported as compatibility findings or optional evidence, not implemented inside `ai-tools`.

### New Tool Intake Gate

- Gate: new tool placement and self-use policy
- Status: passed
- Tool destination: `tools/cross-repo-compatibility-checker/`
- Ownership classification: external ai-tools capability
- Output contract: review packet artifacts (`REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, `RECOMMENDED-ACTIONS.md`)
- Required boundary: read-only, evidence-only, no install/run/mutate behavior against sibling repos
- Self-use expectation: after implementation, run the checker against `C:\projects\ai-tools` and the available `ai-workspace-kit` checkout, with output outside both repositories.

### Git Baseline Gate

- Gate: git baseline
- Status: passed
- Evidence: working tree was clean before Phase 7 discuss artifacts were created.

### Documentation/Changelog Impact Gate

- Gate: changelog and docs impact
- Status: applies later
- Decision: Phase 7 execution must update CLI/tool documentation and `CHANGELOG.md` because it introduces a new user-facing tool and compatibility semantics.

## Trusted Self-Questioning Summary

### 1. What is the smallest useful validator?

The useful MVP is a CLI that accepts explicit paths to both repositories and an explicit output directory:

```text
cross-repo-compatibility-checker --ai-tools <path> --ai-workspace-kit <path> --out <dir>
```

It should validate protocol metadata, mirrored request relationships, manual-transfer handling, counterpart paths, gate registry mapping, and stage aliases. It should emit a review packet and exit without changing either input repository.

### 2. What should be treated as the semantic identity of a request?

`Thread ID` is the semantic grouping key. Different `Canonical ID` values can remain compatible when both sides share the same `Thread ID` and counterpart metadata is coherent. This matches the resolved drift between the repos and prevents future validators from treating old filename differences as separate business requests.

### 3. How should manual-transfer requests be handled?

`Origin: manual-transfer` with `Mirror required: false` is valid only when a decision artifact exists. This preserves the protocol rule that incoming requests create decision points, not automatic phases, while giving future tooling an observable artifact to validate.

### 4. How strict should the checker be with newer kit contracts?

The checker should prefer explicit kit contract sources when present, such as `AI-WORKSPACE-CONTRACT.json`, protocol version files, or gate registry templates. Their absence should be informational for older checkouts unless a required Phase 7 contract is otherwise missing.

### 5. How should the checker report problems?

Tool output is evidence, not the final decision.

- `pass`: no compatibility findings.
- `info`: optional newer kit artifacts are absent but fallback validation is possible.
- `human_review_required`: broken mirror, missing decision for a manual transfer, stage alias drift, registry mapping mismatch, or missing semantic metadata.
- `blocked`: unsafe output directory, unreadable required input roots, invalid required JSON, or protocol artifacts too malformed to parse safely.

## Decisions

### D-01: Tool Scope

Implement the Phase 7 tool under `tools/cross-repo-compatibility-checker/`.

It should be the first v2 tool and should not absorb `gates-scan`, contract-drift-auditor CLI ergonomics, tool registry work, or future ledger/forensics tools.

### D-02: CLI Inputs

Require explicit `--ai-tools`, `--ai-workspace-kit`, and `--out` arguments. Do not silently assume sibling paths or `.external` paths in the user-facing CLI.

### D-03: Output Safety

Reject `--out` inside either input repository. The checker should write only to the explicitly provided output directory after safety checks pass.

### D-04: Read-Only Boundary

The checker may read Markdown, JSON, and schema files from both repositories. It must not install dependencies, run tests, pull/fetch, invoke kit tools, write `.planning`, or create phases.

### D-05: Protocol Parsing

Use deterministic field extraction for capability request and decision Markdown. Required fields for v1 compatibility:

- `Protocol version`
- `Canonical ID`
- `Thread ID`
- `Origin`
- `Mirror required`
- `Counterpart ID`
- `Counterpart path`
- `Legacy ID`

### D-06: Thread and Counterpart Validation

Group requests by `Thread ID`. For mirrored requests, validate counterpart IDs/paths and require the target artifact to exist. Different canonical IDs are acceptable when the shared `Thread ID` and counterpart metadata resolve the same semantic request.

### D-07: Manual Transfer Validation

For `Origin: manual-transfer` and `Mirror required: false`, require a decision artifact. Missing decision evidence should produce `human_review_required`.

### D-08: Portable Paths

Report machine-local absolute counterpart paths as findings. Protocol references should be repo-qualified relative paths such as `ai-workspace-kit/.planning/...` or `ai-tools/.planning/...`.

### D-09: Gate Registry Interop

Validate AI Tools `snake_case` gate registry metadata against kit `camelCase` expectations through documented mapping and stage aliases. Do not require direct schema compatibility if `kit_schema_direct_compatibility: false` is explicitly declared.

Required alias coverage includes:

- `verification -> verify`
- `release -> phase-boundary`
- `replan -> plan`

### D-10: Optional Newer Kit Evidence

If the local kit checkout exposes newer contract artifacts, use them as optional evidence. Absence is informational unless the checker cannot establish required protocol expectations through existing docs/templates.

### D-11: Shared Packet Output

Reuse `shared/review-packet-renderer.js`, canonical JSON, existing review packet schemas, and safety helpers. Add checker-specific tool metadata without breaking contract-drift-auditor metadata.

### D-12: Fixtures

Create small paired fixture repositories instead of copying real repos. Required fixture cases:

- fully compatible mirrored requests
- different canonical IDs sharing one `Thread ID`
- manual-transfer request with decision
- broken counterpart path
- absolute counterpart path
- gate casing or stage alias mismatch

### D-13: Verification

Phase 7 execution should run unit/integration tests and a self-use compatibility check against the current `ai-tools` checkout plus the available local or embedded `ai-workspace-kit` checkout. The output directory must be outside both repositories.

### D-14: Roadmap Boundary

The next likely priority after Phase 7 is `GATELINT-01` as a user-facing `gates-scan` MVP. Phase 7 should not implement it, but should keep packet/status patterns reusable for it.

## Canonical References

### Planning

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/research/AI-WORKSPACE-KIT-LOCAL-REVIEW.md`
- `.planning/research/GATES-SCAN-ROADMAP-REVIEW.md`
- `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md`
- `.planning/phases/05-integration-and-release-hardening/05-CONTEXT.md`
- `.planning/phases/06-release-closeout-and-tool-metadata/06-CONTEXT.md`
- `.planning/phases/06-release-closeout-and-tool-metadata/06-VERIFICATION.md`

### Cross-Repo Protocol

- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`
- `.planning/cross-repo/templates/CAPABILITY-REQUEST.md`
- `.planning/cross-repo/templates/CAPABILITY-DECISION.md`
- `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
- `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
- `.planning/cross-repo/outbox/REQ-20260507-ai-tools-to-ai-workspace-kit-review-packet-contract.md`
- `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
- `.external/ai-workspace-kit/CROSS-REPO-CAPABILITY-REQUESTS.md`
- `.external/ai-workspace-kit/templates/GATE-REGISTRY.json`

### Gates

- `.planning/gates/registry.json`
- `AGENTS.md`

### Implementation

- `tools/cross-repo-compatibility-checker/SEED-IDEAS.md`
- `shared/review-packet-renderer.js`
- `shared/tool-metadata.js`
- `shared/canonical-json.js`
- `shared/path-guard.js`
- `shared/file-walker.js`
- `shared/ignore-policy.js`
- `shared/secret-policy.js`
- `tools/contract-drift-auditor/cli.js`
- `tools/contract-drift-auditor/index.js`
- `standards/review-packet/schemas/REVIEW-SUMMARY.schema.json`
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json`
- `test/planning/cross-repo-protocol.test.js`
- `test/contract-drift-auditor/integration.test.js`
- `test/contract-drift-auditor/schema-output.test.js`
- `package.json`

## Open Questions For Planning

- Should the package expose the CLI as `cross-repo-compatibility-checker`, `cross-repo-check`, or both with one canonical name?
- Should missing optional kit contract artifacts be emitted as `info` findings or only included in `EVIDENCE.json`?
- Should malformed protocol Markdown produce `blocked` immediately, or `human_review_required` when enough fields can still be recovered?
- Should the checker compare only current cross-repo artifacts, or also templates and examples in both repos?

## Risks

- Overreaching into kit-owned policy decisions would blur repository boundaries.
- Using real local repos as primary tests would make tests brittle across machines.
- Treating canonical IDs as the only identity would reintroduce the compatibility issue already solved with `Thread ID`.
- Writing output inside either repo would create self-audit noise and violate read-only expectations.
- Making gate registry schemas directly identical would fight the accepted snake_case/camelCase interop mapping.

## Planning Handoff

Plan Phase 7 as three small implementation slices:

1. Define paired fixtures, protocol field extraction, and CLI/read-only safety skeleton.
2. Implement request thread, counterpart, origin, mirror, decision, and portable path checks.
3. Add gate registry mapping/stage alias checks, shared review packet rendering, docs, package script/bin entry, and self-use verification.

