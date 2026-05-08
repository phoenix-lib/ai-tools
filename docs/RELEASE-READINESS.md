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

The first v2 capability adds `cross-repo-compatibility-checker` as a
read-only validator for `ai-tools` / `ai-workspace-kit` protocol compatibility.
Phase 9 adds `tools/registry.json` as the machine-readable capability catalog
and `.planning/gates/WORKFLOW-GATES.md` as the detailed workflow gate playbook.

## Definition of Done

- [x] Shared packet schema exists under `standards/review-packet/schemas/`.
- [x] Packet guidance explains that `REVIEW-SUMMARY.json` is the machine source
  of truth and Markdown is a projection.
- [x] One working external auditor exists: `contract-drift-auditor`.
- [x] Auditor emits `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md`.
- [x] Auditor release packet examples cover `pass`, `human_review_required`, and
  `blocked` outcomes.
- [x] Deterministic tests validate packet rendering and schema output.
- [x] Secret-like evidence is path-only by default.
- [x] Auditor output is isolated outside the audited target project.
- [x] Target fixture non-mutation is tested.
- [x] Release self-audit evidence is recorded.
- [x] Manual gate review evidence is recorded.
- [x] `CHANGELOG.md` records Phase 05 and Phase 06 release validation and
  upstream `ai-workspace-kit` impact.
- [x] Phase 08 post-v1 CLI ergonomics are documented as optional caller
  conveniences: `--format json`, `--quiet`, and `--fail-on`.
- [x] Phase 09 tool registry and workflow gate documentation are planned as
  governance hardening before broad seed tool expansion.

## Required Artifacts

- `README.md`
- `tools/contract-drift-auditor/README.md`
- `standards/review-packet/README.md`
- `tools/contract-drift-auditor/examples/pass/`
- `tools/contract-drift-auditor/examples/human-review/`
- `tools/contract-drift-auditor/examples/blocked-safety/`
- `tools/cross-repo-compatibility-checker/README.md`
- `tools/registry.json`
- `tools/registry.schema.json`
- `.planning/gates/WORKFLOW-GATES.md`
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

Phase 6 adds release packet fixtures:

- `tools/contract-drift-auditor/examples/pass/`: no findings, status `pass`.
- `tools/contract-drift-auditor/examples/human-review/`: one human-review
  finding, status `human_review_required`.
- `tools/contract-drift-auditor/examples/blocked-safety/`: synthetic blocked packet-shape
  example for unsafe output semantics.

The blocked-safety fixture is intentionally synthetic. A real unsafe output path
inside the audited target is rejected before packet artifacts are written.

Plan `05-02` refreshed release evidence with:

```bash
npm.cmd test
```

and:

```bash
node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase05
```

That machine-local output path is historical evidence from the Phase 5 run, not
the reusable command pattern. For future self-audits, use:

```bash
node tools/contract-drift-auditor/cli.js --project . --out <external-dir>
```

`<external-dir>` must be outside the audited repository. Findings are release
evidence for human review; they are not automatic blockers unless a safety or
schema issue makes the packet unusable.

Validation results recorded on 2026-05-07:

- `npm.cmd test -- test/contract-drift-auditor/discovery.test.js`: 6/6 pass.
- `npm.cmd test -- test/contract-drift-auditor/checks.test.js`: 9/9 pass.
- `npm.cmd test -- test/contract-drift-auditor/integration.test.js`: 4/4 pass.
- `npm.cmd test -- test/planning/release-docs.test.js`: 3/3 pass.
- `npm.cmd test`: 89/89 pass.

Final Phase 6 validation results recorded on 2026-05-07:

- `npm.cmd test -- test/contract-drift-auditor/release-examples.test.js`: 4/4 pass.
- `npm.cmd test -- test/contract-drift-auditor/integration.test.js`: 5/5 pass.
- `npm.cmd test -- test/planning/release-docs.test.js`: 4/4 pass.
- `npm.cmd test`: 99/99 pass.

Phase 8 CLI ergonomics are post-v1 hardening. They do not change required
packet artifacts or schema semantics. `--format json` is compact machine
stdout projected from the packet summary, `--quiet` suppresses human success
chatter, and `--fail-on blocked|human_review_required|never` is optional
caller-selected shell policy.

Phase 9 governance hardening adds a registry and focused workflow gate docs.
`tools/registry.json` records capability owner, maturity, activation stage,
expected outputs, use gate, self-use policy, evidence refs, and non-goals.
`.planning/gates/WORKFLOW-GATES.md` keeps detailed gate procedures out of the
root `AGENTS.md` entrypoint while preserving evidence-only boundaries.

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

- Reusable command: `node tools/contract-drift-auditor/cli.js --project . --out <external-dir>`
- Historical Phase 5 command: `node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase05`
- Historical Phase 5 output path: `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase05`
- Packet status: `human_review_required`
- Finding count: 57 total, all `low`; 0 blockers, 0 critical, 0 high,
  0 medium, 0 required decisions.
- Interpretation: remaining findings are human-review caveats around optional,
  example, or shorthand references in current contract/planning docs. They do
  not block the first release because packet generation, schema validation,
  secret handling, output isolation, and non-mutation checks all passed.

Phase 8 CLI ergonomics evidence:

- Reusable command: `node tools/contract-drift-auditor/cli.js --project . --out <external-dir> --format json --fail-on never`
- Reusable quiet command: `node tools/contract-drift-auditor/cli.js --project . --out <external-dir> --quiet`
- Phase 8 JSON command: `node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-json --format json --fail-on never`
- Phase 8 JSON output path: `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-json`
- Phase 8 quiet command: `node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-quiet --quiet`
- Phase 8 quiet output path: `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase08-quiet`
- Packet status: `human_review_required`
- Finding count: 54 total, all `low`; 0 blockers, 0 critical, 0 high,
  0 medium, 0 required decisions.
- Interpretation: JSON stdout parsed and matched generated
  `REVIEW-SUMMARY.json` status/counts. The `--quiet` run exited `0` and emitted
  no auditor success line. Remaining findings are human-review caveats in
  current contract/planning documentation, not automatic blockers.
- Compatibility note: packet files remain the source of truth. Machine stdout
  and `--fail-on` are optional caller conveniences and do not create an
  `ai-workspace-kit` dependency or automatic approval/failure decision.

Final Phase 6 evidence:

- Reusable command: `node tools/contract-drift-auditor/cli.js --project . --out <external-dir>`
- Final Phase 6 command: `node tools/contract-drift-auditor/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase06`
- Final Phase 6 output path: `C:\Users\suppo\.codex\memories\ai-tools-self-audit-phase06`
- Packet status: `human_review_required`
- Finding count: 55 total, all `low`; 0 blockers, 0 critical, 0 high,
  0 medium, 0 required decisions.
- Interpretation: remaining findings are human-review caveats in current
  contract/planning documentation. They do not block the first release because
  release packet examples, schema validation, secret handling, output
  isolation, non-mutation checks, and final full tests passed.

Phase 7 cross-repo checker evidence:

- Reusable command: `node tools/cross-repo-compatibility-checker/cli.js --ai-tools <path> --ai-workspace-kit <path> --out <external-dir>`
- Phase 7 self-use command: `node tools/cross-repo-compatibility-checker/cli.js --ai-tools . --ai-workspace-kit C:\projects\ai-workspace-kit --out C:\Users\suppo\.codex\memories\ai-tools-cross-repo-check-phase07`
- Phase 7 output path: `C:\Users\suppo\.codex\memories\ai-tools-cross-repo-check-phase07`
- Packet status: `human_review_required`
- Finding count: 1 total, `medium`; 0 blockers, 0 critical, 0 high, 0 low,
  0 required decisions.
- Finding summary: local sibling `ai-workspace-kit` decision artifact
  `ai-workspace-kit/.planning/cross-repo/decisions/2026-05-07-ai-tools-review-packet-standard.md`
  is missing required field `Reason`.
- Interpretation: the checker is working as evidence-only validation. The
  remaining finding is a neighboring repo protocol artifact gap, not an AI
  Tools implementation blocker.

## Deferred V2 Work

- `XREPO-VALIDATOR-01`: read-only cross-repo compatibility checker. This is a
  prerequisite before automatic cross-repo indexer or gate-linter automation.
- `GATELINT-01`: evidence-only mechanical gate linter for missing gate blocks,
  duplicate IDs, stale paths, conflicting wording, unresolved references, and
  gates without observable artifact output.

`XREPO-VALIDATOR-01` is implemented after v1 as the first v2 capability.
Mechanical gate linter automation remains deferred and is not part of the v1
release. The mechanical gate linter is not part of the v1 release.
