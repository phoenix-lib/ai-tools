---
phase: 5
name: Integration and Release Hardening
status: complete
created: "2026-05-07"
requirements:
  - DOC-01
  - DOC-02
  - DOC-03
  - DOC-04
  - GATE-03
---

# Phase 5 Research: Integration and Release Hardening

## Gate Resolution

- **Research Gate:** user selected `Research first` by replying `1` after the
  plan-phase research prompt.
- **Upstream Freshness Gate:** passed. Local `.external/ai-workspace-kit` was
  clean on `master`; local commit and GitHub HEAD both resolved to
  `2079ab9626e9f9ed256512091f9c5ea473582885`. Upstream `CHANGELOG.md` was
  already reviewed for Phase 5 planning impact and recorded in
  `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md`.
- **Cross-Repo Incoming Review Gate:** no new request changes Phase 5 scope.
  Existing incoming requests are represented by decision artifacts; changelog
  and gate-review process work remains accepted, while mechanical gate-linter
  stays v2.
- **Cross-Repo Outgoing Need Gate:** not applicable for Phase 5 docs and
  release hardening. If planning discovers missing kit-owned protocol behavior,
  create an outbox request instead of implementing it locally.
- **AI Tools Self-Use Gate:** applies. `contract-drift-auditor` is a validated
  MVP and must be considered for release readiness. Phase 4 self-use evidence
  produced `human_review_required` with 768 noisy findings, so Phase 5 should
  harden current-project source filtering before using self-audit as release
  evidence.
- **New Tool Intake Gate:** no new v1 tool is promoted. `XREPO-VALIDATOR-01`
  and `GATELINT-01` stay deferred v2 seeds.
- **Git Baseline Gate:** clean before Phase 5 planning artifacts were written.

## Research Questions

### What does Phase 5 need to plan well?

Phase 5 is not just documentation. It is release hardening for the first useful
AI Tools slice:

- one working external auditor;
- stable review packet artifacts;
- documented safety and non-goals;
- optional `ai-workspace-kit` packet consumption;
- gate-review evidence for release readiness;
- explicit deferral of broader tool ecosystem work.

The plan should remain narrow. Building the cross-repo validator, mechanical
gate-linter, context ledger, forensics tool, or runtime probes would expand
Phase 5 beyond release hardening.

### What docs are missing?

The repository has no root `README.md`. That is the biggest release readiness
gap because a consumer cannot understand the project without reading planning
history. Existing docs are split across:

- `tools/README.md` for seed routing;
- `tools/contract-drift-auditor/README.md` for a short tool manual;
- `standards/review-packet/README.md` for packet semantics;
- `CHANGELOG.md` for project changes;
- `.planning/*` for GSD decisions.

Phase 5 should create a root README and a release readiness checklist rather
than expanding planning docs as the user-facing entrypoint.

### What should the root README contain?

The root README should be a release entrypoint:

- project purpose;
- current usable tool: `contract-drift-auditor`;
- local commands, without implying npm publication because `package.json` is
  still `private: true`;
- required packet artifacts;
- safety guarantees;
- when to use and when not to use the auditor;
- optional `ai-workspace-kit` integration boundary;
- links to packet standard, tool README, release readiness, and seed ideas.

### How should release docs cover packet semantics?

Do not duplicate the full packet standard. Link to
`standards/review-packet/README.md`, then summarize the minimum a release
consumer needs:

- `REVIEW-SUMMARY.json` is the machine source of truth;
- Markdown reports are projections from the same packet model;
- paths are normalized relative paths;
- secret-like paths are path-only;
- severity and packet status are separate concepts;
- confidence supports `verified`, `inferred`, `unknown`, and `stale`;
- recommended actions are guidance, not patches or permission grants.

### What needs mechanical validation?

Phase 3 established mechanical docs validation with `node:test`. Phase 5 can
reuse that pattern. A focused `test/planning/release-docs.test.js` should check
that:

- `README.md` exists and names `contract-drift-auditor`;
- root README contains local usage, required artifacts, safety, use/non-use
  guidance, and optional `ai-workspace-kit` boundary language;
- `tools/contract-drift-auditor/README.md` contains expanded use/non-use,
  safety, output interpretation, and kit compatibility sections;
- release readiness docs reference schemas, one working auditor, deterministic
  tests, secret safety, output isolation, non-mutation, gate review, changelog,
  and deferred v2 validator/linter work.

Keep this validation mechanical. It should not decide semantic gate quality.

### How should self-audit noise be reduced?

The current auditor discovers every `.planning/*.md` file as source documents.
That is valid for target-project drift, but noisy for this repository because
historical phase plans and summaries contain old references, fixture paths,
future seeds, and optional upstream paths that are not current release
contracts.

Preferred hardening:

- keep `AGENTS.md`, `CLAUDE.md`, local skills, active planning docs, and
  cross-repo protocol docs as source documents;
- exclude historical phase summaries/plans/checkpoints from default
  current-contract source docs unless the user explicitly targets them later;
- keep `.external/ai-workspace-kit` ignored as a nested reference checkout;
- keep fixtures as project files but avoid treating fixture input docs as
  current project contracts during self-audit unless they are explicitly
  targeted;
- add tests proving generated packet dirs, historical planning files, and
  optional external references do not dominate default self-audit findings.

This should be implemented as a scoped improvement to current discovery/source
document selection, not as a new tool or broad profile system.

### What does gate review require?

Local `ai-workspace-kit` now has gate-review guidance and a `gate-review`
registry entry. It does not create an automatic dependency. Phase 5 release
readiness should manually review:

- `AGENTS.md`;
- `.planning/gates/registry.json`;
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`;
- `CHANGELOG.md`;
- relevant upstream guidance in `.external/ai-workspace-kit`.

Review dimensions:

- relevance to current stages;
- duplication with kit-owned responsibilities;
- duplication with future AI Tools mechanical tooling;
- hidden automation or dependency creep;
- stale assumptions;
- missing observable artifacts;
- incoherent skip/blocking rules.

The review output should live in release readiness docs or a Phase 5
verification artifact. Future mechanical gate-linter output, if it exists, is
evidence only.

## Recommended Plan Split

### Plan 05-01: Release Docs and Docs Validation

Focus:

- create root `README.md`;
- expand `tools/contract-drift-auditor/README.md`;
- create `docs/RELEASE-READINESS.md`;
- add `test/planning/release-docs.test.js`;
- update changelog for docs scope when executed.

Requirements: DOC-01, DOC-02, DOC-03, DOC-04.

### Plan 05-02: Self-Audit Hardening and Release Gate Review

Focus:

- reduce default self-audit noise in the existing auditor;
- add focused tests for source filtering;
- run release self-audit to an external output directory;
- perform manual gate review using current kit guidance;
- update release readiness docs with evidence;
- update changelog with validation and upstream impact.

Requirements: GATE-03, DOC-04, plus release evidence for DOC-01 through
DOC-03.

## Files To Read During Execution

- `README.md` if it exists by then.
- `tools/contract-drift-auditor/README.md`
- `tools/contract-drift-auditor/discovery.js`
- `tools/contract-drift-auditor/checks.js`
- `shared/file-walker.js`
- `shared/ignore-policy.js`
- `standards/review-packet/README.md`
- `test/planning/cross-repo-protocol.test.js`
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md`
- `.external/ai-workspace-kit/templates/GATE-REGISTRY.json`
- `.planning/phases/05-integration-and-release-hardening/05-CONTEXT.md`

## Risks

- Root docs could imply published package behavior that does not exist. Keep
  commands repo-local.
- Release readiness could become aspirational. Make it checklist/evidence
  based.
- Self-audit noise could take over the phase. Fix only default source selection
  enough for release evidence; do not redesign the auditor.
- Gate review could accidentally duplicate future mechanical gate-linter work.
  Keep semantic review human/assistant-owned and mechanical linting deferred.

## RESEARCH COMPLETE
