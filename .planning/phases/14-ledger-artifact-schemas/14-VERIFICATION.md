# Phase 14 Verification: Ledger Artifact Schemas

**Verdict:** PASS

Phase 14 delivered strict public schemas for the six project-context-ledger
artifacts and proved generated ledger output validates against them. The work
kept the ledger as optional evidence, not runtime, gate, roadmap, merge,
suppression, disposition, scope/diff, or portfolio-scan authority.

## Goal Verification

Goal: stabilize machine-readable schemas for `project-context-ledger` artifacts
before other tools consume them.

Status: achieved.

- Public schemas exist under `standards/project-context-ledger/schemas/` for
  `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`,
  `DECISIONS.json`, and `CACHE-MANIFEST.json`.
- Shared definitions live in `LEDGER-COMMON.schema.json`; the standards README
  documents versioning, evidence refs, artifact shapes, and optional-consumer
  boundaries.
- Generated ledger output now includes `CACHE-MANIFEST.json`
  `schema_version: "project-context-ledger/v1"`.
- Direct assistant contract records include `source_path`.
- Context decision IDs are source-path namespaced.
- Duplicate generated ledger record IDs are deterministically
  occurrence-normalized with `.occurrence-N` suffixes.
- Generated-output tests validate all ledger artifacts against schemas, assert
  unique IDs per record artifact, assert evidence-ref joins to `EVIDENCE.json`,
  and compare deterministic fixed-clock output.
- Docs, registry, release readiness, and changelog record Phase 14 scope,
  validation, compatibility, migration notes, and upstream impact.

## Requirement Coverage

| Requirement | Status | Evidence |
|-------------|--------|----------|
| LEDGER-SCHEMA-01 | Covered | `FACTS.schema.json` plus generated-output tests validate fact records with category, confidence, source metadata, timestamps, and evidence refs. |
| LEDGER-SCHEMA-02 | Covered | `COMMANDS`, `CONTRACTS`, `SKILLS`, and `DECISIONS` schemas plus generated-output tests validate stable IDs, evidence refs, confidence, and source metadata. |
| LEDGER-SCHEMA-03 | Covered | `CACHE-MANIFEST.schema.json` validates tool metadata, `schema_version`, scanned sources, artifact lists, ignored generated dirs, secret path-only policy, and previous-manifest states. |
| LEDGER-SCHEMA-04 | Covered | `schema-output.test.js` validates generated artifacts against schemas, unique IDs, evidence-ref joins, and deterministic output. |

## Validation Evidence

- `npm.cmd test -- test/project-context-ledger/ledger-schema-contract.test.js`
  - Passed 6/6 after the AJV strictRequired schema fix in 14-01.
- `npm.cmd test -- test/project-context-ledger/schema-output.test.js test/project-context-ledger/integration.test.js`
  - Passed 6/6.
- `npm.cmd test -- test/project-context-ledger/schema-output.test.js test/project-context-ledger/ledger-schema-contract.test.js`
  - Passed 10/10.
- `npm.cmd test -- test/planning/release-docs.test.js test/planning/tool-registry.test.js test/project-context-ledger/schema-output.test.js`
  - Passed 17/17.
- `npm.cmd test -- test/planning/tool-registry.test.js`
  - Passed 8/8 after final registry evidence-ref updates.
- `npm.cmd test`
  - Passed 226/226.
- `git diff --check`
  - Passed.
- `gsd-sdk.cmd query state.validate`
  - Passed with no warnings or drift.

Sandboxed `node --test` can return `spawn EPERM` in this environment;
validation passed with user-approved elevated npm execution.

## Self-Use Evidence

`project-context-ledger` was run against this repository and wrote output
outside the repository:

```text
C:\Users\suppo\.codex\memories\ai-tools-ledger-schemas-phase14-final
```

Command:

```bash
node tools/project-context-ledger/cli.js --project . --out C:\Users\suppo\.codex\memories\ai-tools-ledger-schemas-phase14-final
```

Result:

- Status: `human_review_required`.
- Findings: 383 total, 381 low, 2 medium.
- Blockers: 0.
- Required decisions: 0.
- Cache manifest schema version: `project-context-ledger/v1`.
- Scanned sources: 396.
- Ignored generated packet directories: 8.
- Path-only secret paths: 8.
- Unique record IDs: all ledger record artifacts unique after deterministic
  occurrence normalization.

The self-use run exposed duplicate contract IDs in real repository output.
Phase 14 added occurrence normalization and regression coverage before the
final self-use packet was recorded.

## Residual Risks

- The schemas validate artifact shape, not semantic priority or actionability.
  Phase 15 review dispositions and Phase 16 scope/diff modes are still needed
  to reduce human-review noise.
- Consumers that keyed directly on old context decision IDs or duplicate record
  IDs may observe deterministic ID changes. Consumers should validate against
  the schemas and use evidence refs for durable interpretation.
- The self-use packet still reports 383 findings. That is expected evidence for
  later signal-quality work, not a Phase 14 schema failure.

## Conclusion

Phase 14 meets its stated goal and all mapped requirements. The implementation
is validated, documented, registered as schema-backed ledger evidence, and
committed in `3562904`, `bda8f3e`, and `ddbec34`.
