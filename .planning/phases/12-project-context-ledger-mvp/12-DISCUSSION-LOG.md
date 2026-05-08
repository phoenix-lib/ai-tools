# Phase 12: Project Context Ledger MVP - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `12-CONTEXT.md`; this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 12-Project Context Ledger MVP
**Areas discussed:** Discuss mode gate, MVP scope, command surface, artifact contract, extraction scope, fact/cache model, safety, validation

---

## Discuss Mode Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask the user interactive gray-area questions before writing discussion artifacts. | |
| Trusted Self-Questioning | Proceed with a bounded self-questioning pass and record the gate resolution. | yes |

**User's choice:** Trusted Self-Questioning
**Notes:** The user replied `2` after the required discuss-mode gate prompt.
`workflow.discuss_mode` was treated as routing only, not user approval.

---

## MVP Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Scan MVP | Implement `project-context-ledger --project <path> --out <dir>` and required ledger artifacts. | yes |
| Full seed command set | Also implement future `ctx brief`, `ctx diff`, and `ctx evidence` commands. | |
| Planning-only continuation | Leave the tool planned and defer implementation again. | |

**User's choice:** Trusted self-questioning selected the scan MVP because it
matches Phase 12 roadmap success criteria and Phase 11 selected implementation
contract.
**Notes:** Future seed subcommands are deferred unless planning proves they are
required for LEDGER-01.

---

## Command Surface

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal explicit CLI | Require `--project` and `--out`, reject mutating flags, support `--help`. | yes |
| Full ergonomic CLI | Include machine stdout, quiet mode, and fail policy immediately. | |
| Package-manager wrapper | Run target commands to discover behavior. | |

**User's choice:** Trusted self-questioning selected the minimal explicit CLI.
**Notes:** Machine stdout and fail policy can be considered only if they stay
small and reuse existing patterns. Target command execution remains out of
scope.

---

## Artifact Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Shared packet plus ledger JSON | Emit review packet artifacts plus FACTS, COMMANDS, CONTRACTS, SKILLS, DECISIONS, and CACHE-MANIFEST. | yes |
| Ledger-only JSON | Skip shared review packet artifacts. | |
| Markdown-first report | Make prose reports the main output. | |

**User's choice:** Trusted self-questioning selected shared packet plus ledger
JSON.
**Notes:** `EVIDENCE.json` remains the shared evidence source used by ledger
records through evidence refs.

---

## Extraction Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Deterministic project context | Extract package scripts, contracts, planning facts, skills, decisions, registry/tool facts, and packet references. | yes |
| Whole-codebase semantic summary | Infer broad project intent from all source files. | |
| Dependency/runtime scanner | Inspect dependency lifecycle, runtime services, ports, or environment capability. | |

**User's choice:** Trusted self-questioning selected deterministic project
context.
**Notes:** The ledger should point to evidence and mark unknown/stale facts
instead of inventing missing context.

---

## Fact And Cache Model

| Option | Description | Selected |
|--------|-------------|----------|
| Evidence-backed facts | Include id, category, value/text, evidence refs, confidence, source hash, and last checked timestamp. | yes |
| Freeform memory notes | Store unstructured project memory without evidence refs. | |
| Current-only manifest | Omit stale/cache comparison behavior. | |

**User's choice:** Trusted self-questioning selected evidence-backed facts.
**Notes:** Confidence values should be `verified`, `inferred`, `unknown`, and
`stale`. The cache manifest should support hash-based staleness when prior
ledger output exists and evidence-gap staleness otherwise.

---

## Safety

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse shared safety primitives | Use path guard, ignore policy, secret policy, canonical JSON, tree hash, and packet renderer. | yes |
| Tool-local safety rules | Reimplement safety behavior inside the ledger only. | |
| Broader automation | Let the ledger update planning state or approve gates. | |

**User's choice:** Trusted self-questioning selected reuse of shared safety
primitives.
**Notes:** Target mutation, secret content reads, package installs, target
command execution, automatic GSD decisions, and ai-workspace-kit runtime
dependency are out of scope.

---

## Validation

| Option | Description | Selected |
|--------|-------------|----------|
| Fixture-backed scan tests | Cover output isolation, non-mutation, secret non-leakage, deterministic JSON, schemas, and ledger refs. | yes |
| Smoke-only command test | Verify only that the CLI exits successfully. | |
| Manual-only review | Rely on human inspection of generated artifacts. | |

**User's choice:** Trusted self-questioning selected fixture-backed scan tests.
**Notes:** Use a mature AI Tools-like fixture with planning artifacts, scripts,
contracts, seed tool directories, missing/stale reference evidence,
secret-like path, and generated packet directory ignored as source input.

## Agent Discretion

- Exact module boundaries are left to planning.
- Machine stdout, quiet mode, and fail policy are optional if implementation
  cost stays low; they are not required for the MVP discussion boundary.
- Documentation updates should be scoped to the actual user-facing command and
  validation evidence produced in Phase 12.

## Deferred Ideas

- `ctx brief --task`
- `ctx diff --since`
- `ctx evidence --topic`
- Dependency lifecycle, vulnerability, abandoned package, runtime capability,
  UI, test-quality, config, skill-linter, domain, and forensics behavior
- Automatic GSD decisions, gate approval, phase creation, roadmap mutation, or
  ai-workspace-kit runtime dependency
