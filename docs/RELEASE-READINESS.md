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
Phase 10 adds `gates-scan` as an evidence-only mechanical gate linter for
phase-boundary, registry, and workflow gate documentation review.
Phase 12 adds `project-context-ledger` as a read-only project memory evidence
producer for facts, commands, contracts, skills, decisions, and cache source
hashes.
Phase 13 adds `review-packet-rollup` as a mechanical packet consumer for
combining existing review packets without running source tools or making
semantic suppression decisions.
Phase 14 adds strict JSON Schemas for the six `project-context-ledger` ledger
artifacts and generated-output validation for schema-valid deterministic ledger
packets.
Phase 15 adds the `REVIEW-DISPOSITIONS.json` sidecar schema, stable finding
fingerprints, and `review-packet-rollup` disposition indexing through
`DISPOSITION-INDEX.json` without changing source finding severity, status
contribution, evidence refs, or packet status derivation.
Phase 16 adds `project-context-ledger` source scopes and explicit diff mode:
`--scope current|planning|history|all`, default current-source filtering for
historical phase artifacts, cache-manifest `ledger_records`, and
`LEDGER-DIFF.json` generation from `--since-manifest`.

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
- [x] Phase 10 post-v1 `gates-scan` CLI is documented as evidence-only
  mechanical gate review support, not gate adoption automation.
- [x] Phase 12 post-v1 `project-context-ledger` CLI is documented as optional
  project context evidence, not automatic workflow or roadmap authority.
- [x] Phase 13 post-v1 `review-packet-rollup` CLI is documented as optional
  packet evidence consumption, not a gate, merge, roadmap, suppression, or
  disposition authority.
- [x] Phase 14 post-v1 ledger artifact schemas are documented as optional
  evidence-consumer contracts, not runtime dependencies, gate authority,
  suppression rules, dispositions, or portfolio scanners.
- [x] Phase 15 post-v1 review dispositions are documented as human review
  metadata, not source finding rewrites, suppression, or automatic gate
  authority.
- [x] Phase 16 post-v1 ledger scope and diff modes are documented as optional
  evidence-consumer support, not automatic priority, suppression, disposition,
  workflow, gate, roadmap, merge, phase, or portfolio authority.

## Required Artifacts

- `README.md`
- `tools/contract-drift-auditor/README.md`
- `standards/review-packet/README.md`
- `tools/contract-drift-auditor/examples/pass/`
- `tools/contract-drift-auditor/examples/human-review/`
- `tools/contract-drift-auditor/examples/blocked-safety/`
- `tools/cross-repo-compatibility-checker/README.md`
- `tools/gates-scan/README.md`
- `tools/project-context-ledger/README.md`
- `tools/review-packet-rollup/README.md`
- `standards/project-context-ledger/README.md`
- `standards/project-context-ledger/schemas/`
- `standards/review-disposition/README.md`
- `standards/review-disposition/schemas/`
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

Phase 10 gate-linter hardening adds `gates-scan` as a read-only evidence
producer. It reports mechanical gate issues through the shared packet artifacts
and does not mutate scanned projects, decide gate applicability, or replace
assistant-led semantic review.

Phase 12 context-ledger hardening adds `project-context-ledger` as a read-only
evidence producer. It emits the shared packet artifacts plus `FACTS.json`,
`COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, `DECISIONS.json`, and
`CACHE-MANIFEST.json`, while rejecting target-local output paths and mutating
flags.

Phase 13 rollup hardening adds `review-packet-rollup` as a read-only packet
consumer. It emits the shared packet artifacts plus `PACKET-INDEX.json` and
`ROLLUP-GROUPS.json`, while rejecting output inside any input packet directory
and refusing source-running or mutating flags. It provides optional packet evidence consumption, not another source auditor or decision engine.

Phase 14 ledger schema hardening adds `standards/project-context-ledger/`
schemas for `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`,
`DECISIONS.json`, and `CACHE-MANIFEST.json`. Generated ledger output is tested
against those schemas, with additional checks for deterministic output, unique
record IDs, and joins from ledger `evidence_refs` to generated `EVIDENCE.json`.
The schemas are optional evidence-consumer contracts and do not authorize
workflow, gate, roadmap, merge, suppression, disposition, portfolio scan,
install, fetch, run, or mutation decisions.

Phase 15 review disposition hardening adds `standards/review-disposition/`
with a strict `REVIEW-DISPOSITIONS.json` schema and stable
`shared/finding-fingerprint.js` helper. `review-packet-rollup` now emits
`DISPOSITION-INDEX.json` as a separate tool-specific artifact that records
matched, unmatched, expired, stale, invalid, and undispositioned review
context. It does not modify source findings, source packet counts, severity,
status contribution, evidence refs, blockers, required decisions, or packet
status derivation.

Phase 16 ledger scope and diff hardening adds
`project-context-ledger --scope current|planning|history|all` and
`--since-manifest <CACHE-MANIFEST.json>`. The default `current` scope excludes
historical `.planning/phases/**` artifacts, ledger records include
`source_category`, `CACHE-MANIFEST.json` records canonical `ledger_records`,
and explicit diff runs write `LEDGER-DIFF.json` with added, changed, removed,
unchanged, and stale record snapshots. Scope and diff output remain evidence
only and do not authorize automatic priority, suppression, disposition,
workflow, gate, roadmap, merge, phase, portfolio, install, fetch, run, or
mutation decisions.

Phase 14 self-use wrote ledger output outside the repository at:

```bash
node tools/project-context-ledger/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-ledger-schemas-phase14-final
```

Result: `human_review_required` with 383 findings, 381 low, 2 medium, 0
blockers, and 0 required decisions. The generated `CACHE-MANIFEST.json` used
`schema_version: project-context-ledger/v1`, recorded 396 scanned sources, 8
ignored generated packet directories, and 8 path-only secret paths. All ledger
record artifacts had unique record IDs after deterministic occurrence
normalization.

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

Mechanical gate-linter output from Phase 10 `gates-scan` is evidence only. The
assistant still makes the repository-local semantic decision.

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

Phase 10 gates-scan evidence:

- Reusable command: `node tools/gates-scan/cli.js --project . --out <external-dir>`
- Phase 10 self-use command: `node tools/gates-scan/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-gates-scan-phase10`
- Phase 10 output path: `C:\Users\suppo\.codex\memories\ai-tools-gates-scan-phase10`
- Packet status: `human_review_required`
- Finding count: 20 total, 2 medium and 18 low; 0 blockers, 0 required
  decisions.
- Interpretation: mechanical gate-linter output is review evidence only and
  does not create automatic phase, gate, or release decisions.

Phase 12 project-context-ledger evidence:

- Reusable command: `node tools/project-context-ledger/cli.js --project . --out <external-dir>`
- Phase 12 self-use command: `node tools/project-context-ledger/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-context-ledger-phase12`
- Phase 12 output path: `C:\Users\suppo\.codex\memories\ai-tools-context-ledger-phase12`
- Packet status: `human_review_required`
- Finding count: 280 total, 2 medium and 278 low; 0 blockers, 0 required
  decisions.
- Interpretation: context ledger output is evidence only and does not create
  automatic workflow, gate, roadmap, phase, install, fetch, or mutation
  decisions.

Phase 13 review-packet-rollup evidence:

- Reusable command: `node tools/review-packet-rollup/cli.js --packets <packet-dir-a> <packet-dir-b> --out <external-dir>`
- Phase 13 self-use command: `node tools/review-packet-rollup/cli.js --packets C:\Users\suppo\.codex\memories\ai-tools-v21-ledger-20260508-final C:\Users\suppo\.codex\memories\ai-tools-v21-gates-scan-20260508-final C:\Users\suppo\.codex\memories\ai-tools-v21-contract-drift-20260508-final C:\Users\suppo\.codex\memories\ai-tools-v21-cross-repo-20260508-final --out C:\Users\suppo\.codex\memories\ai-tools-review-packet-rollup-phase13`
- Phase 13 output path: `C:\Users\suppo\.codex\memories\ai-tools-review-packet-rollup-phase13`
- Packet status: `human_review_required`
- Finding count: 401 total, 396 low and 5 medium; 0 blockers, 0 required
  decisions.
- Mechanical groups: by tool, 299 `project-context-ledger`, 75
  `contract-drift-auditor`, 26 `gates-scan`, and 1
  `cross-repo-compatibility-checker`; by status contribution, 401
  `human_review_required`.
- Interpretation: rollup output is evidence only. It groups existing packet
  findings mechanically and does not create automatic workflow, gate, roadmap,
  phase, install, fetch, source-running, disposition, suppression, or mutation
  decisions.

Phase 14 ledger artifact schema evidence:

- Reusable command: `node tools/project-context-ledger/cli.js --project . --out <external-dir>`
- Focused validation commands:
  `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js`
  and
  `npm.cmd test -- test/project-context-ledger/schema-output.test.js test/project-context-ledger/integration.test.js`
- Schema contract: `standards/project-context-ledger/schemas/` validates all
  six ledger artifacts; `CACHE-MANIFEST.json` carries
  `schema_version: "project-context-ledger/v1"`.
- Interpretation: schema validation makes ledger packets safer for downstream
  consumers. It does not make ledger facts automatic workflow decisions.

Phase 15 review disposition evidence:

- Reusable command:
  `node tools/review-packet-rollup/cli.js --packets <packet-dir-a> <packet-dir-b> --dispositions <REVIEW-DISPOSITIONS.json> --out <external-dir>`
- Focused validation commands:
  `npm.cmd test -- test/review-disposition/schema-contract.test.js test/review-disposition/finding-fingerprint.test.js`
  and
  `npm.cmd test -- test/review-packet-rollup/dispositions.test.js test/review-packet-rollup/integration.test.js test/review-packet-rollup/schema-output.test.js test/review-packet-rollup/normalize.test.js`
- Interpretation: dispositions are optional human review metadata joined by
  stable finding fingerprints. They are not safe-to-ignore labels,
  suppressions, source finding rewrites, or automatic gate decisions.

Phase 16 ledger scope and diff evidence:

- Reusable current-scope command:
  `node tools/project-context-ledger/cli.js --project . --out <external-dir>`
- Reusable all-scope command:
  `node tools/project-context-ledger/cli.js --project . --scope all --out <external-dir>`
- Reusable diff command:
  `node tools/project-context-ledger/cli.js --project . --scope current --since-manifest <CACHE-MANIFEST.json> --out <external-dir>`
- Focused validation command:
  `npm.cmd test -- test/project-context-ledger/cli.test.js test/project-context-ledger/discovery.test.js test/project-context-ledger/integration.test.js test/project-context-ledger/schema-output.test.js test/project-context-ledger/ledger-schema-contract.test.js`
- Phase 16 current-scope output path:
  `C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-current-20260508`
- Phase 16 all-scope output path:
  `C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-all-20260508`
- Phase 16 diff output path:
  `C:\Users\suppo\.codex\memories\ai-tools-ledger-scope-phase16-diff-20260508`
- Self-use result: current scope produced `human_review_required` with 74 low
  findings, 349 scanned sources, and 239 ledger records. All scope produced
  `human_review_required` with 460 findings, 415 scanned sources, and 2361
  ledger records. Explicit diff produced `LEDGER-DIFF.json` with 0 added, 0
  changed, 0 removed, 74 stale, and 239 unchanged records.
- Interpretation: default current-scope runs reduce historical phase noise.
  Explicit diff output is a mechanical ledger-record comparison and does not
  replace direct source inspection or assistant judgment.

## Deferred V2 Work

`XREPO-VALIDATOR-01`, `GATELINT-01`, `LEDGER-01`, the Phase 13 packet
rollup, the Phase 14 ledger schemas, Phase 15 review dispositions, and Phase 16
ledger scope/diff modes are
implemented after v1 as read-only evidence producers, consumers, or contracts.
Automatic cross-repo indexing, automatic gate-linter decisions, automatic
context adoption, auto-fix mode, and additional seed tools remain deferred.

The mechanical gate linter remains not part of the v1 release. Its Phase 10
post-v1 implementation is evidence-only and must not be treated as automatic
gate adoption, release approval, or target-project mutation authority.

The project context ledger remains not part of the v1 release. Its Phase 12
post-v1 implementation and Phase 14 schema hardening are evidence-only and must
not be treated as automatic workflow routing, roadmap mutation, phase approval,
suppression, disposition, portfolio scan, or target-project mutation authority.

Review dispositions remain not part of the v1 release. Their Phase 15
implementation is a human review metadata layer and must not be treated as
automatic suppression, safe-to-ignore policy, gate approval, roadmap mutation,
merge decision, portfolio scan, or target-project mutation authority.

Ledger scope and diff modes remain not part of the v1 release. Their Phase 16
implementation is optional context evidence filtering and mechanical diffing.
It must not be treated as automatic priority, suppression, disposition, gate
approval, roadmap mutation, merge decision, portfolio scan, source command
execution, or target-project mutation authority.
