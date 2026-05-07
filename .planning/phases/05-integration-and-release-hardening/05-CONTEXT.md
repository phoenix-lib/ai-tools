---
phase: 5
name: Integration and Release Hardening
status: context-complete
created: "2026-05-07"
mode: trusted-self-questioning
requirements:
  - DOC-01
  - DOC-02
  - DOC-03
  - DOC-04
  - GATE-03
depends_on:
  - Phase 4
---

# Phase 5 Context: Integration and Release Hardening

## Phase Goal

Prepare the first useful release of AI Tools around one working external
auditor, stable review packet outputs, explicit safety guarantees, optional
`ai-workspace-kit` integration, and release readiness gates.

Phase 5 should turn the Phase 4 MVP into something a human or another AI
assistant can use without reading the whole planning history.

## Gate Resolution

### Discuss Mode Gate

- Gate: `discuss-mode`
- Status: passed
- Resolution: Trusted Self-Questioning
- Selected by: user
- Approval source: user selected option `2` after an explicit discuss-mode gate prompt.
- Evidence:
  - `.planning/gates/registry.json` records `discuss-mode` as a non-skippable
    discuss-stage gate.
  - `AGENTS.md` states `$gsd-discuss-phase` must resolve Manual Questions vs
    Trusted Self-Questioning before writing discuss artifacts.
  - `workflow.discuss_mode=discuss` is routing only and is not approval evidence.
- Cycle limits: five focused self-questioning passes.
- Passes performed:
  - release documentation surface;
  - optional `ai-workspace-kit` integration boundary;
  - first-release definition of done;
  - gate-review availability and manual fallback;
  - Phase 4 self-audit noise and hardening implications.

### Cross-Repo Incoming Review Gate

- Gate: `cross-repo-incoming`
- Status: passed
- Resolution: no new automatic phase or dependency created.
- Evidence:
  - `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
  - `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
  - `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
- Reason:
  - The contract drift auditor request was accepted for Phase 4 and the MVP is
    now implemented.
  - The changelog and gate-review request is accepted as process work, while
    the mechanical gate-linter remains deferred as future AI Tools evidence.
  - Incoming requests remain decision points, not automatic roadmap mutations.

### AI Tools Self-Use Gate

- Gate: `self-use`
- Status: passed with release-hardening follow-up.
- Tool considered: `contract-drift-auditor`
- Maturity: validated MVP from Phase 4.
- Resolution: use the Phase 4 self-audit output as evidence for Phase 5
  hardening; do not rerun during discuss because no runtime code changed after
  Phase 4 verification.
- Evidence:
  - `.planning/phases/04-contract-drift-auditor-mvp/04-VERIFICATION.md`
  - Local evidence packet:
    `C:/Users/suppo/.codex/memories/ai-tools-self-audit-phase04/REVIEW-SUMMARY.json`
- Finding: the self-audit produced `human_review_required` with 768 findings.
  This is useful evidence, but too noisy for release readiness because
  historical `.planning` files, fixtures, placeholder paths, and optional
  `.external` references dominate the output.
- Phase 5 implication: harden self-audit source filtering or document release
  limitations clearly before treating full-repo self-audit as release evidence.

### Git Baseline Gate

- Gate: `git-baseline`
- Status: passed at discuss start.
- Resolution: baseline was clean before Phase 5 discuss artifacts were written.
- Evidence: `git status --short` returned no tracked or untracked changes.

### Future Gate Review Hook

- Gate: `future-gate-review`
- Status: applies to release readiness.
- Resolution: Phase 5 must run assistant-owned semantic gate review manually.
- Evidence:
  - `.external/ai-workspace-kit/templates/GATE-REGISTRY.json` now contains a
    `gate-review` entry.
  - `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md` says gate-review outcomes
    are `adopt`, `revise`, `defer`, `reject`, or request external capability.
  - `.external/ai-workspace-kit/CHANGELOG.md` says mechanical gate-linter
    execution remains an external AI Tools capability and no AI Tools runtime
    dependency is introduced.
- Phase 5 implication: do not assume an executable upstream command exists.
  Use local kit guidance as semantic review input. If a future runnable
  capability appears, its output is evidence only, not the final decision.

## Trusted Self-Questioning Results

### What is the release entrypoint?

The repository currently has no root `README.md`. Phase 5 should create one as
the first-release entrypoint instead of relying on planning docs or
tool-specific docs.

The root README should cover:

- what AI Tools is;
- current usable capability: `contract-drift-auditor`;
- local usage commands;
- required packet outputs;
- safety guarantees;
- when to use and when not to use the auditor;
- how `ai-workspace-kit` may consume packets optionally;
- release readiness status and links to deeper docs.

The package is still `private: true`, so documentation must not imply a
published npm package. Prefer repo-local commands such as:

```bash
npm run contract-drift-auditor -- --project <path> --out <dir>
```

or:

```bash
node tools/contract-drift-auditor/cli.js --project <path> --out <dir>
```

### What should remain tool-specific?

`tools/contract-drift-auditor/README.md` should stay as the detailed auditor
manual. Phase 5 should expand it only where needed for:

- use cases and non-use cases;
- safety guarantees;
- output interpretation;
- self-audit caveats;
- optional `ai-workspace-kit` consumption.

Root README should not duplicate every check implementation detail.

### What is the first-release definition of done?

Phase 5 needs a checkable release readiness document, likely
`docs/FIRST-RELEASE-CHECKLIST.md` or `docs/RELEASE-READINESS.md`.

It should require:

- schemas exist and tests validate packet output;
- one working auditor exists and is documented;
- generated packet artifacts are deterministic from one summary model;
- secret-like paths are path-only and secret contents are not emitted;
- output directory is outside the target project;
- target projects are not mutated;
- `ai-workspace-kit` integration is optional and packet-based;
- changelog has a concise entry for major completed work;
- release gate review has been performed;
- self-audit output is either meaningful enough for release evidence or its
  limitations are explicitly recorded.

### How should `ai-workspace-kit` integration be documented?

Phase 5 must keep the tandem boundary visible:

- `ai-workspace-kit` owns adoption/bootstrap contracts, adapter guidance,
  generated contract policy, permission policy, and assistant-led gate-review
  procedure.
- AI Tools owns external read-only auditors, review packet mechanics, future
  validators, and mechanical evidence tools.
- AI Tools must not implement bootstrap/adoption contracts.
- `ai-workspace-kit` must not hide heavy auditors inside kit workflows.
- No automatic installs, auto-runs, phase creation, dependency wiring, or
  `.planning` copying across repositories.

Docs should say kit can recommend or read AI Tools packet outputs as optional
evidence, not as an implicit dependency.

### What should happen with gate review in this phase?

Phase 5 should include a release-readiness gate review against:

- `AGENTS.md`;
- `.planning/gates/registry.json`;
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`;
- `CHANGELOG.md`;
- relevant `ai-workspace-kit` local guidance under `.external/ai-workspace-kit`.

Review questions:

- Is each gate relevant to its stages?
- Does any gate duplicate `ai-workspace-kit` ownership?
- Does any gate duplicate AI Tools future mechanical tooling as a semantic
  decision?
- Does any gate imply hidden automation or dependency creep?
- Are skip rules coherent with artifact blocking behavior?
- Does every required gate produce observable evidence?

The Phase 5 plan should avoid implementing a full mechanical gate-linter unless
explicitly promoted later. `GATELINT-01` remains a future capability seed.

### How should the noisy self-audit be handled?

The Phase 4 self-use run proved the auditor works but also showed the full-repo
signal is noisy. Phase 5 should either:

- refine current-project source filtering and reference extraction so a
  self-audit is useful as release evidence; or
- keep the MVP behavior but document the limitation and make it a release
  caveat.

Preferred plan: harden filtering enough that historical `.planning` artifacts,
fixtures, generated packet output, optional `.external` references, and
placeholder paths do not dominate current-project release evidence.

This should remain scoped to the existing auditor. Do not start the
cross-repo validator, context ledger, forensics, UI tools, or gate-linter during
Phase 5.

### What criteria should control later tool selection?

Later tools should stay as seed ideas until they meet all criteria:

- repeated real demand from project work or cross-repo requests;
- clear owner and boundary classification;
- activation stage and target user are explicit;
- output packet contract is known;
- non-goals prevent duplication with `ai-workspace-kit`;
- safety profile is known;
- fixture/test strategy is clear;
- release value is higher than hardening the existing auditor.

`XREPO-VALIDATOR-01` should remain a v2 prerequisite before any automatic
cross-repo indexer or gate-linter automation.

## Implementation Guidance for Planning

Suggested plan shape:

1. Create first-release documentation.
2. Expand auditor usage/safety/integration docs.
3. Add a release readiness checklist with gate resolution expectations.
4. Harden self-audit source filtering or explicitly document the limitation.
5. Add docs validation tests for release-required docs and required phrases.
6. Run full tests, self-audit, manual gate review, and update `CHANGELOG.md`.

## Canonical References

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `AGENTS.md`
- `CHANGELOG.md`
- `package.json`
- `tools/README.md`
- `tools/contract-drift-auditor/README.md`
- `standards/review-packet/README.md`
- `.planning/phases/02-shared-safety-and-packet-foundation/02-CONTEXT.md`
- `.planning/phases/03-cross-repo-capability-request-gate/03-CONTEXT.md`
- `.planning/phases/04-contract-drift-auditor-mvp/04-CONTEXT.md`
- `.planning/phases/04-contract-drift-auditor-mvp/04-VERIFICATION.md`
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`
- `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
- `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
- `.external/ai-workspace-kit/CHANGELOG.md`
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md`
- `.external/ai-workspace-kit/templates/GATE-REGISTRY.json`

## Open Planning Risks

- The local `.external/ai-workspace-kit` checkout may not match upstream by the
  time planning starts. `$gsd-plan-phase 5` must run the upstream freshness gate
  before using kit guidance as current.
- The existing self-audit output is too noisy to be a clean release signal.
- The absence of a root README makes the release hard to consume without GSD
  context.
- A mechanical gate-linter is intentionally not available yet; Phase 5 must not
  pretend it exists.

## Deferred

- `XREPO-VALIDATOR-01`: v2 read-only cross-repo compatibility checker before
  automatic cross-repo indexer or gate-linter automation.
- `GATELINT-01`: future mechanical gate-linter that emits evidence packets only.
- Context ledger, forensics, UI regression, runtime probes, and integration
  harnesses remain seed ideas until repeated demand justifies promotion.
