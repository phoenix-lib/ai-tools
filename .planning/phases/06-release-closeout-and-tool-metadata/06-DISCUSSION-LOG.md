# Phase 6: Release Closeout and Tool Metadata - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 6-Release Closeout and Tool Metadata
**Areas discussed:** discuss mode gate, release docs drift, packet fixtures, metadata source, safe self-audit, phase boundaries

---

## Discuss Mode Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask the user targeted questions before writing context. | |
| Trusted Self-Questioning | The assistant runs bounded self-questioning and records decisions. | yes |

**User's choice:** `2`
**Notes:** Interactive question tooling was unavailable in Default mode, so a
plain-text fallback was used. The user selected Trusted Self-Questioning before
Phase 6 discussion artifacts were written.

---

## Release Docs Drift

| Option | Description | Selected |
|--------|-------------|----------|
| Leave Phase 5 wording as-is | Accept that README still says historical planning folders can dominate noise. | |
| Narrow the limitation | Update docs to reflect Phase 5 filtering while preserving remaining caveats. | yes |
| Claim self-audit is clean | Treat 57 low findings as fully resolved release evidence. | |

**User's choice:** Trusted Self-Questioning selected option 2.
**Notes:** Phase 5 filtered historical `.planning/phases/**` and nested
fixture contracts from current self-audit source documents. The remaining risk
is conservative parsing of current docs, not historical phase evidence
dominating the result.

---

## Release Packet Fixtures

| Option | Description | Selected |
|--------|-------------|----------|
| Generic standard examples only | Reuse `standards/review-packet/examples` and add no auditor-specific fixtures. | |
| Tool-specific release fixtures | Add `contract-drift-auditor` examples for pass, human review, and blocked shapes. | yes |
| Runtime-only fixtures | Generate examples only during tests and do not commit packet examples. | |

**User's choice:** Trusted Self-Questioning selected option 2.
**Notes:** The project already has generic review packet examples. Phase 6
needs release-facing examples that show the actual auditor packet contract.
Blocked safety behavior may need a synthetic packet-shape example because the
real CLI should reject unsafe output before writing files.

---

## Tool Metadata Source

| Option | Description | Selected |
|--------|-------------|----------|
| Keep inline constants | Leave schema version, artifacts, and package version lookup duplicated locally. | |
| Central JS metadata helper | Use one CommonJS helper for tool metadata and packet constants. | yes |
| Static JSON registry now | Introduce a broad registry before Phase 9. | |

**User's choice:** Trusted Self-Questioning selected option 2.
**Notes:** A small shared metadata helper fits the existing CommonJS codebase
and avoids starting the larger Phase 9 machine-readable tool registry early.
`package.json` should remain the package version source.

---

## Safe Self-Audit Invocation

| Option | Description | Selected |
|--------|-------------|----------|
| Hard-code a local output path | Add a script or docs command with a developer-specific path. | |
| Caller-provided external output | Document or script only the prefix and require `--out <external-dir>`. | yes |
| Skip self-audit guidance | Rely on prior Phase 5 evidence path only. | |

**User's choice:** Trusted Self-Questioning selected option 2.
**Notes:** The Phase 5 evidence path can remain historical evidence, but the
recommended reusable invocation must be portable and safe.

---

## Phase Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Expand into cross-repo validator | Start `XREPO-VALIDATOR-01` now. | |
| Keep Phase 6 to release closeout | Finish docs, fixtures, metadata, and self-audit guidance only. | yes |
| Add CLI ergonomics now | Add `--format`, `--quiet`, and `--fail-on` in Phase 6. | |

**User's choice:** Trusted Self-Questioning selected option 2.
**Notes:** Cross-repo validation is Phase 7, CLI ergonomics is Phase 8, tool
registry/gate slimming is Phase 9, and gate-linter work is Phase 10.

---

## the agent's Discretion

- Exact file names for the metadata helper and tool-specific example folders.
- Whether to implement metadata before fixtures if fixture validation benefits
  from shared constants.
- Exact focused tests, provided full `npm.cmd test` remains part of
  verification.

## Deferred Ideas

- Cross-repo compatibility checker: Phase 7.
- CLI stdout/quiet/fail-on behavior: Phase 8.
- Tool registry and AGENTS slimming: Phase 9.
- Mechanical gate linter: Phase 10, evidence-only.
- Broad seed tools: Phase 11 selection review.
