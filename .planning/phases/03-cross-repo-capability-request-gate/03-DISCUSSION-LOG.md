# Phase 3: Cross-Repo Capability Request Gate - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 3-Cross-Repo Capability Request Gate
**Areas discussed:** Pending todo folding, Discuss mode, Gate enforcement model, Trusted self-questioning

---

## Pending Todo Folding

| Option | Description | Selected |
|--------|-------------|----------|
| Fold in | Include `Accept gate linter request` in Phase 3 context and planning. | yes |
| Review only | Record the todo as reviewed but not in Phase 3 scope. | |
| Skip | Ignore the todo for this discussion. | |

**User's choice:** `1` - Fold in.
**Notes:** The pending todo becomes the first real incoming request candidate
for `.planning/cross-repo/inbox/` and a mixed decision artifact.

---

## Discuss Mode

| Option | Description | Selected |
|--------|-------------|----------|
| Trusted self-questioning | The assistant runs structured self-questioning and records decisions. | yes |
| Manual discussion | Continue with the gray areas presented manually. | |
| Hybrid | Self-question first, then ask only disputed decisions. | |

**User's choice:** `1` - Trusted self-questioning.
**Notes:** The initial manual gray-area prompt was a gate miss. The user called
out the miss, then selected Trusted self-questioning. The canonical context
records the corrected gate resolution.

---

## Gate Enforcement Model

| Option | Description | Selected |
|--------|-------------|----------|
| Documentation only | Keep gates as prose in `AGENTS.md`. | |
| Artifact sections plus tests | Require `Gate Resolution` sections and validate them mechanically. | |
| Registry plus artifact sections plus tests | Add `.planning/gates/registry.json`, require `Gate Resolution`, and validate structure. | yes |
| Future linter only | Wait for a mechanical gate-linter in v2. | |

**User's choice:** Approved implementation of the registry plus artifact
sections plus tests model.
**Notes:** The rationale was that a missed gate here could repeat in more
important places. Phase 3 context locks the enforcement model into scope.

---

## Trusted Self-Questioning Areas

The assistant ran self-questioning over these gray areas and recorded the
resulting decisions in `03-CONTEXT.md`:

- Request and decision artifact shape.
- Gate enforcement registry and required `Gate Resolution` outputs.
- Gate stage mapping across discuss, research/plan, execute/verify, and
  phase-boundary/release stages.
- Incoming `ai-workspace-kit` changelog/gate-review/gate-linter request.
- Example request set and docs validation strictness.

## the agent's Discretion

- Exact registry JSON field names.
- Exact request slug normalization.
- Exact test file path under the existing `node:test` suite.
- Exact wording of docs validation failure messages.

## Deferred Ideas

- Mechanical `gate-linter` implementation remains a v2 optional capability.
- Cross-repo automation and automatic phase/task creation remain out of scope.
