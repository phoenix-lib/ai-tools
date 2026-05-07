# Phase 2: Shared Safety Harness - Research

**Researched:** 2026-05-07
**Domain:** read-only inspection safety, deterministic Node helpers, fixture mutation proof
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Phase 2 owns generic AI Tools safety primitives and must not rebuild
  `ai-workspace-kit` adoption/bootstrap behavior.
- `ai-workspace-kit` is a living upstream reference only; production code and
  tests must not import from `.external/ai-workspace-kit`.
- Report output directories equal to or inside the audited target project must
  be rejected before any write.
- Secret-like paths are path-only evidence by default. Secret contents must not
  be read, copied, rendered, hashed, or returned in output.
- Default inspection must ignore workspace noise, generated review packets,
  nested checkouts, fixture expected/output trees, dependencies, builds,
  coverage, and temp directories unless explicitly targeted.
- The file walker must return deterministic sorted relative paths using `/`.
- Mutation proof must use a raw tree hash over the whole target tree, not the
  audit ignore policy.
- Shared mechanics belong in `shared/`; tests belong in `test/shared/`.
- Phase 2 fixtures must cover clean project, mature project, stale source
  layer, missing command, secret-like files, mixed package managers, and a
  generated packet inside the target tree.
- Upstream freshness gate was run before planning. Local
  `.external/ai-workspace-kit` is now at
  `48ec037d058747151c320ced9c0ee1e1d247d4b1`.

### Deferred Ideas (OUT OF SCOPE)

- `contract-drift-auditor` CLI and drift checks.
- Adoption review packets, generated assistant contracts, and merge routing.
- Laravel/PHP or other framework evidence adapters.
- Structure-only `.env.example` reads until an explicit safe-read policy exists.
- Auto-fix or any mutation-capable target-project behavior.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Module | Tests | Rationale |
|------------|----------------|-------|-----------|
| Canonical JSON | `shared/canonical-json.js` | `test/shared/canonical-json.test.js` | Promotes Phase 1 documented behavior into a reusable writer. |
| Output path guard | `shared/path-guard.js` | `test/shared/path-guard.test.js` | Protects every future `--project --out` CLI. |
| Secret policy | `shared/secret-policy.js` | `test/shared/secret-policy.test.js` | Centralizes path-only evidence and leakage prevention. |
| Ignore policy | `shared/ignore-policy.js` | `test/shared/file-walker.test.js` | Prevents generated/noisy evidence pollution. |
| File walker | `shared/file-walker.js` | `test/shared/file-walker.test.js` | Gives auditors deterministic target evidence paths. |
| Tree hash | `shared/tree-hash.js` | `test/shared/tree-hash.test.js` | Proves read-only commands do not mutate targets. |
| Fixtures | `test/fixtures/targets/` | `test/shared/safety-harness.test.js` | Covers Phase 2 safety and future Phase 4 drift scenarios. |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 2 should be implemented as small CommonJS helpers plus focused tests. The
best approach is to keep inspection helpers separate from mutation-proofing:
the file walker intentionally ignores generated/noisy evidence, while the tree
hash intentionally sees every file under the target to catch accidental writes.

The latest `ai-workspace-kit` upstream added framework evidence adapters. That
does not change Phase 2 scope, but it strengthens the API requirement: helpers
should be generic enough for later framework/source evidence adapters without
coupling this project to Laravel or adoption review.

**Primary recommendation:** create `shared/` helper modules first, then reusable
target fixtures, then integration safety tests that prove output isolation,
secret sentinel non-leakage, generated packet ignoring, deterministic walking,
and no target mutation.
</research_summary>

<standard_stack>
## Standard Stack

| Tool | Purpose | Notes |
|------|---------|-------|
| Node.js built-ins | `fs`, `path`, `crypto`, `node:test` | Enough for path resolution, walking, hashing, and tests. |
| CommonJS | Module format | Matches current `package.json` and Phase 1 tests. |
| Ajv existing dev deps | Optional evidence schema validation | Already installed by Phase 1; no new dependency required. |
| PowerShell-compatible commands | Verification | Keep command snippets Windows-friendly. |

No package install is needed for Phase 2.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Guard Before Write

Resolve the target and output paths before creating directories. Use real paths
for existing segments and preserve missing suffixes for not-yet-created output
dirs. Compare with `path.relative`, not string prefixes. Lowercase comparison
paths on Windows.

### Pattern 2: Classify Before Read

Any future content reader should ask `secret-policy` first. If a path is
secret-like, return path-only evidence and do not read bytes.

### Pattern 3: Ignore Policy By Markers

Generated review packets should be ignored when a directory contains packet
marker files, not only when its name matches a convention. Include both AI
Tools markers (`REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`,
`RECOMMENDED-ACTIONS.md`) and ai-workspace-kit markers
(`ADOPTION-REVIEW.md`, `MERGE-REVIEW.md`, `CONFLICTS.md`,
`ai-workspace.manifest.json`).

### Pattern 4: Raw Mutation Hash

Use a raw recursive file list for mutation proof. Do not reuse audit ignore
rules for tree hashing; ignored target paths can still be mutated accidentally.

### Pattern 5: Fixture Inputs Stay Inputs

Use `test/fixtures/targets/<scenario>/input/` as the audited target. Expected or
generated outputs must live outside that input directory.
</architecture_patterns>

<validation_architecture>
## Validation Architecture

Use direct Node tests for all safety helpers.

| Test Area | Command | Requirement Coverage |
|-----------|---------|----------------------|
| Helper unit tests | `npm.cmd test -- test/shared/canonical-json.test.js test/shared/path-guard.test.js test/shared/secret-policy.test.js test/shared/file-walker.test.js test/shared/tree-hash.test.js` | SAFE-01, SAFE-02, SAFE-03, SAFE-04, SAFE-05 |
| Fixture/integration tests | `npm.cmd test -- test/shared/safety-harness.test.js` | TEST-02, TEST-03, TEST-07 |
| Full suite | `npm.cmd test` | All Phase 2 requirements plus Phase 1 regression |

Nyquist sampling should run the relevant helper test after each task commit and
the full suite after each wave. Feedback latency should stay under 15 seconds
for focused tests and under 30 seconds for the full suite.
</validation_architecture>

<common_pitfalls>
## Common Pitfalls

- **Using ignore policy for mutation proof:** misses writes into ignored dirs.
- **String-prefix path checks:** unsafe on Windows and with sibling paths such
  as `project` vs `project-output`.
- **Reading secrets before classifying:** leaks through hashes, logs, or test
  failure output.
- **Overfitting to ai-workspace-kit:** helper APIs should support future AI
  Tools auditors, not adoption review internals.
- **Fixture outputs inside input trees:** invalidates no-mutation proof and
  pollutes future walks.
</common_pitfalls>

<sources>
## Sources

### Primary

- `.planning/phases/02-shared-safety-harness/02-CONTEXT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `AGENTS.md`
- `AI-AGENT-IMPLEMENTATION-GUIDE.md`
- `standards/review-packet/CANONICAL-JSON.md`
- `standards/review-packet/schemas/EVIDENCE-REF.schema.json`
- `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md`

### Reference

- `.external/ai-workspace-kit/scripts/lib/paths.js`
- `.external/ai-workspace-kit/scripts/lib/ignore.js`
- `.external/ai-workspace-kit/scripts/lib/profile.js`
- `.external/ai-workspace-kit/scripts/lib/inspection.js`
- `.external/ai-workspace-kit/scripts/lib/frameworks.js`
- `.external/ai-workspace-kit/scripts/lib/frameworks/laravel.js`
- `.external/ai-workspace-kit/test/adopt.test.js`
- `.external/ai-workspace-kit/TOOLING-PLAYBOOK.md`
</sources>

<metadata>
## Metadata

**Research scope:** shared Node helpers, safety fixtures, upstream compatibility.
**Confidence:** HIGH - all recommendations derive from local project decisions
and current upstream source.
**Valid until:** 2026-06-06 or until the next upstream freshness gate finds a
new `ai-workspace-kit` commit.
</metadata>

---

## RESEARCH COMPLETE

*Phase: 02-shared-safety-harness*
*Research completed: 2026-05-07*
*Ready for planning: yes*
