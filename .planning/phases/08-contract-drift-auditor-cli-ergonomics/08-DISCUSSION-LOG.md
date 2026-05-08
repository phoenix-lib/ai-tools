# Phase 8: Contract Drift Auditor CLI Ergonomics - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 8-Contract Drift Auditor CLI Ergonomics
**Areas discussed:** Discuss Mode Gate, machine stdout, quiet mode, fail-on policy, docs and tests

---

## Discuss Mode Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask the user targeted questions before creating context. | |
| Trusted Self-Questioning | The assistant performs structured self-questioning with explicit cycle limits. | yes |

**User's choice:** `2`
**Notes:** `workflow.discuss_mode=discuss` was treated as routing only, not approval evidence.

---

## Machine Stdout

| Option | Description | Selected |
|--------|-------------|----------|
| Default JSON | Always print JSON to stdout. | |
| Explicit `--format json` | Print compact machine JSON only when requested. | yes |
| Packet-only | Keep stdout human-only and require consumers to read files. | |

**User's choice:** Trusted self-questioning selected explicit `--format json`.
**Notes:** Keeps default behavior human-friendly while giving CI/agents a stable stdout projection.

---

## Quiet Mode

| Option | Description | Selected |
|--------|-------------|----------|
| Suppress all stdout | `--quiet` suppresses success output, including JSON. | |
| Suppress human chatter only | `--quiet` suppresses default success text but preserves explicit JSON output. | yes |
| No quiet mode | Rely only on `--format json`. | |

**User's choice:** Trusted self-questioning selected suppressing human chatter only.
**Notes:** Errors and help remain visible. Explicit machine output remains available.

---

## Fail-On Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Fail by default on findings | Any human-review status exits non-zero. | |
| Opt-in fail policy | Default exit stays zero for generated packets; callers choose `--fail-on`. | yes |
| Never fail on packet status | Only usage/runtime errors can fail. | |

**User's choice:** Trusted self-questioning selected opt-in fail policy.
**Notes:** Default `--fail-on never`; `human_review_required` includes blocked; `blocked` fails only blocked.

---

## Docs and Tests

| Option | Description | Selected |
|--------|-------------|----------|
| CLI tests only | Cover behavior in `test/contract-drift-auditor/cli.test.js`. | |
| Tests plus docs | Cover parser/stdout/exit behavior and update README/release guidance. | yes |
| Broad registry work | Add this behavior to all tools and registry now. | |

**User's choice:** Trusted self-questioning selected tests plus docs.
**Notes:** Cross-tool consistency for `cross-repo-compatibility-checker` is deferred.

## the agent's Discretion

- Planner may choose exact helper function boundaries inside or near
  `tools/contract-drift-auditor/cli.js`.
- Planner may decide whether blocked packet status can be fixture-tested through
  the real runner or should be covered by a pure exit-policy helper test.

## Deferred Ideas

- Applying the same CLI ergonomics to `cross-repo-compatibility-checker`.
- `gates-scan` / `GATELINT-01`.
- Tool registry and AGENTS policy slimming.
