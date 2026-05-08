---
phase: 7
name: Cross-Repo Compatibility Checker MVP
status: research-complete
created: "2026-05-08"
requirements:
  - XREPO-VALIDATOR-01
---

# Phase 7 Research: Cross-Repo Compatibility Checker MVP

## Gate Resolution

- **Research Gate:** user selected `Research first` by replying `1` after the plan-phase research prompt.
- **Upstream Freshness Gate:** local embedded `.external/ai-workspace-kit` is at `2079ab9`; sibling `C:\projects\ai-workspace-kit` is readable and at `9021bce` when using a command-local `safe.directory` override. The sibling checkout is newer local peer evidence, not an automatic dependency.
- **Cross-Repo Incoming Review Gate:** passed. Existing requests justify a checker but do not auto-create work beyond Phase 7.
- **Cross-Repo Outgoing Need Gate:** passed. No new kit-owned capability is required; the checker consumes kit policy artifacts as read-only evidence.
- **New Tool Intake Gate:** passed. Owner is AI Tools; destination is `tools/cross-repo-compatibility-checker/`; output is a standard review packet; non-goals include install/run/mutate behavior.
- **AI Tools Self-Use Gate:** applies after implementation. Run the new checker against `ai-tools` and the available `ai-workspace-kit` checkout with `--out` outside both repos.
- **Git Baseline Gate:** planning started from a clean tree after Phase 7 context commit.

## Research Question

What needs to be known to plan a small, deterministic, read-only cross-repo compatibility checker well?

## Current Local Patterns

### CLI Shape

`tools/contract-drift-auditor/cli.js` provides the local CLI pattern:

- parse args in a small pure `parseArgs(argv)` function;
- support `--help`;
- reject unsupported mutating flags such as `--fix` and `--write`;
- return `2` for usage/runtime errors;
- call an async runner and print one completion line.

Phase 7 should mirror this style with explicit arguments:

```text
cross-repo-compatibility-checker --ai-tools <path> --ai-workspace-kit <path> --out <dir>
```

### Output Safety

`shared/path-guard.js` currently guards one target project. Phase 7 has two target roots, so implementation should either:

- call a small new helper that rejects output inside either root; or
- call the existing single-root helper twice.

The plan should prefer a named helper such as `assertSafeOutputDirOutsideAll(targetDirs, outDir)` if it stays small and tested. This avoids hiding the two-root invariant in caller code.

### Packet Rendering

`shared/review-packet-renderer.js` already renders all four standard artifacts from one packet model. `shared/tool-metadata.js` centralizes:

- review packet schema version;
- required packet artifact names;
- package version lookup;
- policy hash sources.

Phase 7 should reuse this renderer and add a checker-specific tool name constant, likely `CROSS_REPO_COMPATIBILITY_CHECKER_TOOL_NAME`, without turning the metadata file into the Phase 9 full registry.

### Existing Protocol Validation

`test/planning/cross-repo-protocol.test.js` has useful deterministic helpers:

- `fieldValue(content, field)` for Markdown metadata lines;
- `listMarkdownFiles(relativeDir)`;
- required request and decision fields;
- origin vocabulary;
- Thread ID and REQ ID regex checks;
- portable path rejection.

These are test-local today. Phase 7 should implement production equivalents inside the checker rather than importing tests.

## ai-workspace-kit Evidence

### Embedded Reference

`.external/ai-workspace-kit` is at `2079ab9` and includes the older gate registry template shape. It is useful for minimum compatibility with the vendored reference.

### Local Sibling Reference

The local sibling checkout at `C:\projects\ai-workspace-kit` is at `9021bce` when read with command-local safe directory configuration. It includes:

- `AI-WORKSPACE-CONTRACT.json`;
- `data/protocol-versions.json`;
- `templates/GATE-REGISTRY.json` with newer fields such as `effectiveFromPhase`, `requiredSection`, `blocksArtifactWrite`, `owner`, and `validationLevel`;
- explicit boundaries that gate linting, drift auditing, and external tool execution belong to AI Tools and must remain evidence-only.

Phase 7 should use these newer files as optional evidence. The checker must not require them for older kit checkouts if existing docs/templates still establish protocol compatibility.

## Compatibility Semantics

### Request Identity

`Thread ID` is the semantic grouping key. `Canonical ID` identifies the artifact. This matters because the repos previously used different canonical IDs for the same semantic request while agreeing through thread and counterpart metadata.

### Mirrored Requests

For `Mirror required: true`, the checker should require:

- non-`none` `Counterpart ID`;
- non-`none` `Counterpart path`;
- counterpart path resolves to an artifact in the other repo;
- counterpart artifact shares `Thread ID` or explicitly names the local artifact through counterpart metadata;
- protocol version is `1.0`.

### Manual Transfer

For `Origin: manual-transfer` and `Mirror required: false`, the checker should require a local decision artifact. This supports human-reviewed exchange without forcing every request to be mirrored.

### Portable Paths

Protocol files must not contain machine-local paths such as `C:\projects\...`. Counterpart paths should be repo-qualified relative paths, for example:

- `ai-tools/.planning/cross-repo/...`
- `ai-workspace-kit/.planning/cross-repo/...`

Evidence paths in emitted packets should also be normalized slash paths and should not reveal absolute local roots.

## Gate Registry Interop

AI Tools uses snake_case registry fields. Kit uses camelCase fields. Direct schema compatibility is intentionally false in `ai-tools`:

```json
"kit_schema_direct_compatibility": false
```

The checker should validate compatibility through `registry.interop.field_name_mapping` and `registry.interop.stage_aliases`, not by forcing identical JSON schemas.

Required alias coverage:

- `verification -> verify`
- `release -> phase-boundary`
- `replan -> plan`

The newer kit registry also introduces more fields. Missing optional newer fields should be informational unless Phase 7 explicitly needs them.

## Status and Findings Model

Use the existing packet status vocabulary:

- `pass`: no findings.
- `info`: optional newer kit artifacts missing or non-blocking observations.
- `human_review_required`: broken mirror, missing manual-transfer decision, registry mapping drift, missing stage alias, or missing semantic protocol metadata that still allows safe packet emission.
- `blocked`: unsafe output path, unreadable required input root, invalid required JSON, or artifacts too malformed to parse.

Default CLI behavior should remain evidence-only. Exit code ergonomics are Phase 8 for the auditor, not a Phase 7 requirement for this checker.

## Recommended Implementation Shape

```text
tools/cross-repo-compatibility-checker/
  cli.js
  index.js
  discovery.js
  protocol.js
  checks.js
  README.md
```

Suggested responsibilities:

- `cli.js`: args/help/no mutating flags.
- `index.js`: path resolution, output safety, packet assembly, renderer call.
- `discovery.js`: read both repo roots, find cross-repo request/decision/template files and gate registries.
- `protocol.js`: deterministic Markdown field extraction and ID/path helpers.
- `checks.js`: pure checks that return findings/evidence/recommended actions.
- `README.md`: usage, boundaries, status semantics, self-use command.

Tests should use small paired fixture repos under `test/fixtures/cross-repo-compatibility/`, not copies of real repos.

## Fixture Strategy

Create fixture pairs for:

- compatible mirrored requests;
- different canonical IDs sharing one `Thread ID`;
- manual-transfer request with decision;
- broken counterpart path;
- absolute counterpart path;
- registry mapping or stage alias drift.

Use fixture hashing or file snapshots to prove read-only behavior where practical.

## Non-Goals To Preserve

- No dependency on `ai-workspace-kit`.
- No running kit commands or tests.
- No git fetch/pull/update in the checker.
- No installing dependencies in either repo.
- No `.planning` mutation.
- No automatic phase creation.
- No semantic decision about whether a capability request should be accepted.
- No `gates-scan` implementation in Phase 7.

## Planning Recommendation

Plan Phase 7 in three waves:

1. **07-01:** fixtures, discovery, deterministic protocol parsing, CLI skeleton, two-root output safety.
2. **07-02:** request/thread/counterpart/origin/mirror/manual-transfer/path checks.
3. **07-03:** gate registry mapping/stage alias checks, packet rendering, docs, package bin/script, self-use validation.

## RESEARCH COMPLETE

