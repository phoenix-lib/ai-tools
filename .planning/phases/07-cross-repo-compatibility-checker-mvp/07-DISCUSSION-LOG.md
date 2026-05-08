---
phase: 7
name: Cross-Repo Compatibility Checker MVP
created: "2026-05-08"
mode: trusted-self-questioning
status: complete
---

# Phase 7 Discussion Log

## Invocation

- Command: `$gsd-discuss-phase 7`
- Discuss mode gate prompt: plain-text fallback
- User selection: `2`
- Resolved mode: Trusted Self-Questioning

## Gate Resolution Audit

| Gate | Result | Evidence |
| --- | --- | --- |
| Discuss Mode Gate | Resolved as Trusted Self-Questioning | User selected `2`; `.planning/gates/registry.json`; `AGENTS.md` |
| Cross-Repo Incoming Review Gate | Passed | Existing cross-repo requests are decision evidence, not automatic scope |
| Cross-Repo Outgoing Need Gate | Passed | No new kit-owned capability request needed |
| New Tool Intake Gate | Passed | Tool belongs under `tools/cross-repo-compatibility-checker/` as an external ai-tools validator |
| Git Baseline Gate | Passed | Working tree was clean before discuss artifacts |
| Documentation/Changelog Impact Gate | Deferred to execution | New CLI requires docs and changelog updates during implementation |

## Self-Questioning Passes

### Pass 1: CLI Boundary

Question: Should the checker infer repo paths or require explicit paths?

Decision: Require explicit `--ai-tools`, `--ai-workspace-kit`, and `--out`.

Reason: This keeps the tool portable, avoids hidden dependencies on sibling checkout layout, and makes CI usage explicit.

### Pass 2: Mutation Boundary

Question: Can the checker run commands or update the neighboring repo to determine compatibility?

Decision: No. It only reads files.

Reason: Cross-repo compatibility checking must remain evidence-only. Freshness/update behavior is a separate gate and requires explicit permission.

### Pass 3: Request Identity

Question: What should be the identity key when canonical IDs differ?

Decision: Use `Thread ID` as semantic identity and keep canonical IDs as artifact identifiers.

Reason: The repositories already had compatible requests with different canonical IDs. `Thread ID` is the agreed semantic grouping mechanism.

### Pass 4: Manual Transfer

Question: How should manually transferred requests be accepted by the checker?

Decision: `Origin: manual-transfer` plus `Mirror required: false` is valid only with a decision artifact.

Reason: The protocol allows human-reviewed requests, but future tooling needs an observable decision point.

### Pass 5: Gate Registry Mapping

Question: Should the checker force ai-tools to match kit's gate registry schema directly?

Decision: No. Validate through explicit field mapping and stage aliases.

Reason: The projects intentionally use different casing and local registry structure. Compatibility is achieved through mapping, not direct schema identity.

### Pass 6: Output Semantics

Question: Should findings fail the command by default?

Decision: No. Default output is an evidence packet. Unsafe input/output conditions can block execution, while compatibility drift should normally produce review findings.

Reason: Tool output is evidence, not the final decision.

### Pass 7: Test Scope

Question: Should tests use full local repo copies?

Decision: No. Use small paired fixtures plus one optional/manual self-use run during verification.

Reason: Full real repo tests would be slow and brittle. Fixtures should encode protocol cases intentionally.

## Rejected Alternatives

- Auto-detecting `C:\projects\ai-workspace-kit` as an implicit input.
- Pulling or refreshing `.external/ai-workspace-kit` as part of the checker.
- Treating differing canonical IDs as incompatible when `Thread ID` matches.
- Creating missing mirrored requests automatically.
- Implementing `gates-scan` inside Phase 7.

## Planning Questions To Carry Forward

- Final CLI bin name.
- Exact status mapping between findings and process exit code.
- Whether optional kit contract artifacts should produce `info` findings or evidence-only records.
- Whether templates/examples should be checked in the same MVP pass as live protocol artifacts.

## Outcome

Phase 7 has enough context to plan implementation. The phase should stay narrow: read-only cross-repo compatibility validation with review packet output and reusable patterns for future `gates-scan`.

