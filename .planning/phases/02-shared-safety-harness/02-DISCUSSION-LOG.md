# Phase 2: Shared Safety Harness - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 2-Shared Safety Harness
**Areas discussed:** Tandem boundary and ownership, output isolation, secret policy and evidence semantics, ignore policy and file walker, fixture harness and mutation proof, shared module layout and API surface

---

## Discuss Mode Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Trusted self-questioning | Agent runs 4-5 cycles per gray area and records decisions without interrupting unless blocked. | yes |
| Manual questions | User answers each gray-area question interactively. | |

**User's choice:** Trusted self-questioning.
**Notes:** User explicitly selected option `1`.

---

## Tandem Boundary and Ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Generic AI Tools safety harness | Implement reusable external-auditor safety primitives independent of ai-workspace-kit runtime. | yes |
| Clone ai-workspace-kit adoption internals | Copy adoption/bootstrap review behavior into AI Tools. | |
| Depend on ai-workspace-kit package at runtime | Import external kit helpers directly from `.external/ai-workspace-kit`. | |

**User's choice:** Trusted self-questioning delegated this decision to the agent.
**Notes:** Selected the generic harness. This respects the tandem boundary gate:
AI Tools owns auditor safety primitives, while ai-workspace-kit owns
adoption/bootstrap and generated contract review behavior.

---

## Output Isolation

| Option | Description | Selected |
|--------|-------------|----------|
| Strict outside-target output guard | Require explicit output dir and reject paths equal to or inside the audited target before writes. | yes |
| Warn but allow target-local output | Emit a warning when output is inside the target but continue. | |
| Allow target-local output for convenience | Let each future tool decide whether target-local output is safe. | |

**User's choice:** Trusted self-questioning delegated this decision to the agent.
**Notes:** Selected strict guard because `SAFE-01`, `AGENTS.md`, and
ai-workspace-kit reference behavior all require output isolation for review
commands.

---

## Secret Policy and Evidence Semantics

| Option | Description | Selected |
|--------|-------------|----------|
| Conservative path-only by default | Treat secret-like paths as evidence without reading, hashing, copying, or rendering contents. | yes |
| Structure-only example env reads now | Add special safe-read handling for `.env.example` and sample env files in Phase 2. | |
| Content reads with redaction | Read secret-like files and attempt to redact values before output. | |

**User's choice:** Trusted self-questioning delegated this decision to the agent.
**Notes:** Selected conservative path-only behavior. Structure-only sample env
handling is deferred until a future explicit safe-read policy exists.

---

## Ignore Policy and File Walker

| Option | Description | Selected |
|--------|-------------|----------|
| Shared marker-based ignore policy | Ignore dependency/build/temp dirs, generated packets, nested checkouts, and fixture expected/output trees. | yes |
| Minimal hardcoded directory ignore list | Ignore only obvious folders such as `.git` and `node_modules`. | |
| Tool-specific ignore rules only | Let each future auditor define its own ignore behavior. | |

**User's choice:** Trusted self-questioning delegated this decision to the agent.
**Notes:** Selected shared marker-based policy so Phase 4 has deterministic
evidence collection and generated review packets do not pollute later scans.

---

## Fixture Harness and Mutation Proof

| Option | Description | Selected |
|--------|-------------|----------|
| Raw tree-hash proof | Hash every file under the target before and after read-only runs, independent of audit ignore rules. | yes |
| Hash only walked evidence files | Hash only files returned by the audit file walker. | |
| Rely on output path guard tests only | Prove non-mutation indirectly by testing output path rejection. | |

**User's choice:** Trusted self-questioning delegated this decision to the agent.
**Notes:** Selected raw tree-hash proof. Mutation proof must catch writes even
inside ignored directories.

---

## Shared Module Layout and API Surface

| Option | Description | Selected |
|--------|-------------|----------|
| Small CommonJS helpers in `shared/` | Implement deterministic helper modules and direct `node:test` coverage before any CLI. | yes |
| Start Phase 4 CLI immediately | Build `contract-drift-auditor` shell and extract helpers later. | |
| Keep helpers embedded in tests | Use test-only helper code until a real auditor needs it. | |

**User's choice:** Trusted self-questioning delegated this decision to the agent.
**Notes:** Selected `shared/` helpers to match `AGENTS.md` and reduce Phase 4
risk.

---

## the agent's Discretion

- Exact helper function names.
- Exact fixture scenario directory names.
- Max file cap defaults for the file walker.
- Whether `shared/` exposes per-file modules only or a small index export.

## Deferred Ideas

- Structure-only `.env.example` or sample env handling.
- `contract-drift-auditor` CLI shell and drift checks.
- ai-workspace-kit adoption/bootstrap packet generation or merge routing.
- Phase 5 integration documentation explaining how AI Tools and ai-workspace-kit
  work together.
