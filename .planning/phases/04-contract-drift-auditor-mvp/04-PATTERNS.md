# Phase 4: Contract Drift Auditor MVP - Pattern Map

## Target Files and Closest Analogs

| New/Changed Area | Planned Files | Closest Existing Analog | Pattern to Reuse |
|------------------|---------------|-------------------------|------------------|
| Shared packet renderer | `shared/review-packet-renderer.js`, `test/shared/review-packet-renderer.test.js` | `shared/canonical-json.js`, `test/review-packet/schema-validation.test.js` | CommonJS exports, deterministic JSON, strict schema validation, one source object. |
| CLI shell | `tools/contract-drift-auditor/cli.js`, `tools/contract-drift-auditor/index.js`, `package.json` | `shared/path-guard.js`, `test/shared/path-guard.test.js` | Fail before writes, actionable error strings, focused tests. |
| Discovery/parsing | `tools/contract-drift-auditor/discovery.js`, `tools/contract-drift-auditor/package-scripts.js` | `shared/file-walker.js`, `shared/ignore-policy.js` | Sorted relative `/` paths, no content reads for ignored/generated dirs. |
| Drift checks | `tools/contract-drift-auditor/checks.js`, `test/contract-drift-auditor/checks.test.js` | `standards/review-packet/examples/human-review/REVIEW-SUMMARY.json` | Finding IDs, evidence refs, recommended actions, status contribution. |
| Fixture integration | `test/contract-drift-auditor/*.test.js` | `test/shared/safety-harness.test.js`, `test/shared/fixture-helpers.js` | Target tree hashing, fixture `input/` isolation, secret sentinel assertions. |

## Code Excerpts To Preserve

### Canonical JSON

`shared/canonical-json.js` exports:

```js
function canonicalJson(value) {
  return `${JSON.stringify(sortValue(value), null, 2)}\n`;
}
```

Renderer JSON writes should call this helper rather than `JSON.stringify`
directly.

### Output Isolation

`shared/path-guard.js` rejects target-local output:

```js
if (isInsideOrEqual(targetReal, outputReal)) {
  throw new Error("Rejected unsafe output path: output directory must be outside the target project.");
}
```

The auditor CLI must call this before creating `--out`.

### Secret Evidence

`shared/secret-policy.js` returns path-only evidence:

```js
return {
  confidence: "verified",
  evidence_type: "secret_path",
  id,
  path: normalizeEvidencePath(evidencePath),
  path_only: true,
  reason
};
```

The auditor should not hash or render secret-like file contents.

### Fixture Safety

`test/shared/safety-harness.test.js` already proves fixture trees can be hashed
before and after helper operations. Auditor integration tests should use the
same `treeHash(inputDir)` pattern around real CLI/runner calls.

## Data Flow

1. CLI parses `--project` and `--out`.
2. Safety shell rejects unsafe output paths.
3. Discovery walks target files and extracts contract references.
4. Checks produce findings, evidence refs, recommended actions, and packet
   status signals.
5. Shared renderer writes packet artifacts from one packet model.
6. Tests validate schemas, deterministic output, no mutation, and no secret
   leakage.

## Boundary Notes

- Do not import `.external/ai-workspace-kit` from runtime code.
- Do not execute target package scripts.
- Do not add adoption/bootstrap or adapter-generation code.
- Do not store absolute local paths in evidence refs.

