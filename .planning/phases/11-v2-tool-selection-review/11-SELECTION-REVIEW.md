---
phase: 11
status: complete
selected_candidate: project-context-ledger
promoted_candidates: 1
created: "2026-05-08"
---

# Phase 11 Selection Review: v2 Tool Selection

## Gate Resolution

### Research Gate

- **Status:** passed
- **Resolution:** research first
- **Selected by:** user
- **Evidence:** user replied `1` after the Phase 11 research prompt;
  `11-RESEARCH.md` records the research findings.

### Upstream Freshness Gate

- **Status:** passed
- **Resolution:** embedded `ai-workspace-kit` was updated from `e225f77` to
  `b5903a4` before Phase 11 execution.
- **Evidence:** `11-UPSTREAM-UPDATE-REVIEW.md`.
- **Impact:** upstream reinforces update-impact review and evidence-only
  external tool boundaries. It does not change Phase 11 into implementation,
  dependency lifecycle tooling, or kit-owned behavior.

### New Tool Intake and Placement Gate

- **Status:** passed
- **Resolution:** promote exactly one AI Tools-owned external read-only auditor
  candidate, `project-context-ledger`, from `deferred` to `planned`.
- **Owner:** `ai-tools`
- **Destination:** `tools/project-context-ledger/`
- **Use gate:** `new-tool-intake`
- **Promotion level:** planned only. No package bin, package script, CLI file,
  fixture output, implementation test, or generated ledger artifact is added in
  Phase 11.

### AI Tools Self-Use Gate

- **Status:** passed with execution evidence
- **Resolution:** self-use tools are evidence only. Phase 11 execution should
  run `gates-scan` and `contract-drift-auditor` after registry, roadmap,
  changelog, and phase-boundary artifact changes.
- **Evidence expectation:** record packet paths, statuses, finding counts,
  blockers, and required decisions in `11-01-SUMMARY.md` and
  `11-VERIFICATION.md`.

### Cross-Repo Outgoing Need Gate

- **Status:** skipped with reason
- **Reason:** the selected ledger is an AI Tools-owned optional external tool.
  No kit-owned adoption, bootstrap, generated-contract, or semantic gate-review
  implementation is needed.

## Selection Method

Candidates were reviewed against local evidence, repeated pain, fit with
validated primitives, ownership clarity, implementation size, runtime burden,
and future trigger evidence.

| Candidate | Current Evidence | Fit With Existing Primitives | Runtime Burden | Decision | Trigger For Future Promotion |
|-----------|------------------|------------------------------|----------------|----------|------------------------------|
| `project-context-ledger` | Repeated discuss/plan/verify/self-use work rereads project facts, commands, contracts, decisions, packet outputs, and source layers. Original build order places it after the first auditor. | Strong: review packet renderer, path guard, ignore policy, secret policy, canonical JSON, tree hash, registry metadata. | Low: read-only local scan with explicit `--project` and external `--out`. | **Promote to planned.** | Implement next as Phase 12. |
| `phase-forensics-tool` | Useful after failed execution, surprising review results, user correction, or rollback. Recent phases completed cleanly. | Strong once ledger exists; needs phase diffs, summaries, tests, and review packets. | Medium: commit/test correlation and postmortem classification. | Defer. | Repeated failed phases, rollbacks, disputed verification, or plan/reality mismatches. |
| `config-matrix-validator` | No current config-heavy environment work in this repository. | Moderate: secret policy and packet renderer apply. | Medium: config discovery and environment interpretation. | Defer. | Dev/stage/prod config drift, environment refactor, or deploy-readiness pain. |
| `skill-linter` | No project-local skill publishing or active skill maintenance in this repository. | Moderate: contract parsing and evidence refs apply. | Low to medium. | Defer. | Skills become first-class project artifacts or shared skill publishing begins. |
| `test-quality-auditor` | Current phases have fixture/schema tests and no repeated shallow-test miss evidence. | Moderate: packet renderer and fixture patterns apply. | Medium to high: behavior adequacy requires careful heuristics. | Defer. | Repeated regressions from shallow assertions, over-mocking, or missing error paths. |
| `ui-regression-screenshot-comparator` | No frontend surface exists in this repository. | Low now; Playwright policy would be new. | High: browser capture, thresholds, layout checks. | Defer. | Frontend/UI phases, visual refactors, or release screenshot baselines. |
| `runtime-capability-inspector` | Current tools do not require hardware, browser APIs, services, ports, or devices. | Moderate later. | Medium to high depending on probes. | Defer. | Runtime services, local devices, browser APIs, or unsafe-to-verify capability demand. |
| `local-integration-harness` | Heavier than current evidence justifies. | Moderate after runtime capability evidence exists. | High: orchestration across services, browser, devices, and simulators. | Defer. | Repeated integration failures after runtime capability checks justify a harness. |
| `domain-contract-test-generator` | Stable domain contract formats are not established in this project. | Moderate later. | Medium: generated tests must stay review-only until accepted. | Defer. | Domain-heavy work with stable domain contracts and repeated shallow-test pressure. |

## Selected Candidate

`project-context-ledger` is the single next implementation candidate.

Promotion rationale:

- It addresses repeated local project pain: agents repeatedly reload the same
  roadmap, state, contract, command, packet, changelog, and decision facts.
- It is the next original build-order candidate after the packet standard and
  first auditor.
- It reuses validated AI Tools primitives instead of requiring a new runtime
  service, browser, device, or dependency lifecycle capability.
- It supports future forensics and maintenance by creating an evidence-backed
  fact substrate.
- It preserves the project boundary: optional external evidence, not a
  required `ai-workspace-kit` dependency or source-code replacement.

## Future Ledger MVP Contract

Preferred future CLI shape:

```text
project-context-ledger --project <path> --out <dir>
```

Implementation planning may choose the final command path, but the future MVP
must preserve explicit project input, explicit external output, and read-only
target behavior.

Standard packet artifacts:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

Ledger-specific artifacts:

- `FACTS.json`
- `COMMANDS.json`
- `CONTRACTS.json`
- `SKILLS.json`
- `DECISIONS.json`
- `CACHE-MANIFEST.json`

`EVIDENCE.json` remains the shared evidence artifact and may also be consumed
by ledger-specific records.

Fact model:

- structured value or concise fact text;
- evidence refs;
- confidence: `verified`, `inferred`, `unknown`, or `stale`;
- source hash;
- last checked timestamp.

Initial scope:

- project facts;
- commands and package scripts;
- assistant contracts;
- project skills;
- decisions and current planning state;
- implemented and planned tools;
- generated review packet references.

First fixture seed:

- mature AI Tools-like project;
- `AGENTS.md` and `.planning` artifacts;
- package scripts;
- seed tool directories;
- one stale fact;
- one missing referenced command or file;
- one secret-like path that must remain path-only;
- generated review packet output that must be ignored.

## Non-Goals

- No target project mutation.
- No secret-like file content reads by default.
- No source-code replacement or magic summary that hides relevant files.
- No `ai-workspace-kit` runtime dependency.
- No automatic GSD decision, phase creation, roadmap mutation, or gate approval.
- No package-manager runner.
- No dependency lifecycle review, vulnerability scanner, or abandoned-package
  detector.
- No UI, runtime, integration, test-quality, config, skill, domain, or
  forensics implementation in Phase 11.

## Decision

Promote `project-context-ledger` to `planned` in `tools/registry.json` and add
a future Phase 12 for the ledger MVP. Leave every non-selected candidate
`deferred` with explicit trigger evidence.

