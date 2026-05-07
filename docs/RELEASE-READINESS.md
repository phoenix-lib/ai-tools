# Release Readiness

This document defines the first useful AI Tools release. It is a checkable
readiness record, not marketing copy.

## V1 Scope

The first release includes:

- shared review packet schemas and examples;
- shared deterministic safety helpers;
- one working external auditor: `contract-drift-auditor`;
- release documentation and docs validation;
- optional `ai-workspace-kit` packet compatibility guidance.

The first release does not include automatic cross-repo indexing, mechanical
gate-linter automation, auto-fix mode, or additional seed tools.

## Definition of Done

- [x] Shared packet schema exists under `standards/review-packet/schemas/`.
- [x] Packet guidance explains that `REVIEW-SUMMARY.json` is the machine source
  of truth and Markdown is a projection.
- [x] One working external auditor exists: `contract-drift-auditor`.
- [x] Auditor emits `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md`.
- [x] Deterministic tests validate packet rendering and schema output.
- [x] Secret-like evidence is path-only by default.
- [x] Auditor output is isolated outside the audited target project.
- [x] Target fixture non-mutation is tested.
- [x] Release self-audit evidence is recorded.
- [x] Manual gate review evidence is recorded.
- [x] `CHANGELOG.md` records Phase 05 release hardening validation and upstream
  `ai-workspace-kit` impact.

## Required Artifacts

- `README.md`
- `tools/contract-drift-auditor/README.md`
- `standards/review-packet/README.md`
- `docs/RELEASE-READINESS.md`
- `test/planning/release-docs.test.js`
- `CHANGELOG.md`

## Safety Evidence

Already verified in Phase 4:

- output isolation rejects report paths inside the audited target;
- target commands are not executed;
- target files are not mutated;
- generated packet directories inside targets are ignored;
- secret sentinel values from secret-like files do not appear in output.

Plan `05-02` refreshed release evidence with:

```bash
npm.cmd test
```

and:

```bash
node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase05
```

The self-audit output path is outside this repository. Findings are release
evidence for human review; they are not automatic blockers unless a safety or
schema issue makes the packet unusable.

Validation results recorded on 2026-05-07:

- `npm.cmd test -- test/contract-drift-auditor/discovery.test.js`: 6/6 pass.
- `npm.cmd test -- test/contract-drift-auditor/checks.test.js`: 9/9 pass.
- `npm.cmd test -- test/contract-drift-auditor/integration.test.js`: 4/4 pass.
- `npm.cmd test -- test/planning/release-docs.test.js`: 3/3 pass.
- `npm.cmd test`: 89/89 pass.

## Docs Evidence

Plan `05-01` adds mechanical docs validation:

```bash
npm.cmd test -- test/planning/release-docs.test.js
```

The validation checks that release docs mention use/non-use guidance,
review-only safety, path-only secret handling, required packet artifacts,
optional `ai-workspace-kit` integration, and deferred v2 validator/linter work.

## Optional ai-workspace-kit Integration

`ai-workspace-kit` remains the adoption/bootstrap contract tool. It owns
adapter guidance, generated local contract policy, permission policy, and
assistant-led gate-review procedure.

AI Tools remains an optional external evidence producer. `ai-workspace-kit` may
recommend or consume AI Tools packet output, but this release does not install,
run, depend on, or auto-wire either repository into the other.

## Manual Gate Review

Plan `05-02` performed assistant-led gate review using current local
`ai-workspace-kit` guidance. Reviewed sources:

- `AGENTS.md`;
- `.planning/gates/registry.json`;
- `.planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md`;
- `CHANGELOG.md`;
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md`;
- `.external/ai-workspace-kit/templates/GATE-REGISTRY.json`.

Result: adopt the current gate set for the first release. No release-blocking
conflict, duplicated `ai-workspace-kit` ownership, hidden automation, or
dependency creep was found. The `future-gate-review` hook remains manual because
`ai-workspace-kit` documents the semantic review procedure but does not provide
a runnable gate-review command yet. No cross-repo outbox request is needed for
this release.

Mechanical gate-linter output, if added later, is evidence only. The assistant
still makes the repository-local semantic decision.

## Self-Use Evidence

Phase 4 self-use produced `human_review_required` with noisy historical
findings. Plan `05-02` hardened self-audit filtering so historical
`.planning/phases/**` artifacts and nested fixture contracts are not treated as
current source documents by default.

Release readiness evidence:

- Command: `node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase05`
- Output path: `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase05`
- Packet status: `human_review_required`
- Finding count: 57 total, all `low`; 0 blockers, 0 critical, 0 high,
  0 medium, 0 required decisions.
- Interpretation: remaining findings are human-review caveats around optional,
  example, or shorthand references in current contract/planning docs. They do
  not block the first release because packet generation, schema validation,
  secret handling, output isolation, and non-mutation checks all passed.

## Deferred V2 Work

- `XREPO-VALIDATOR-01`: read-only cross-repo compatibility checker. This is a
  prerequisite before automatic cross-repo indexer or gate-linter automation.
- `GATELINT-01`: evidence-only mechanical gate linter for missing gate blocks,
  duplicate IDs, stale paths, conflicting wording, unresolved references, and
  gates without observable artifact output.

Neither deferred item is part of the v1 release. The cross-repo validator and
mechanical gate linter are not part of the v1 release.
