# Phase 02: Shared Safety Harness - Patterns

**Generated:** 2026-05-07
**Scope:** Shared helper modules, fixtures, and safety tests.

## Target Files and Closest Analogs

| New File | Role | Closest Existing Analog |
|----------|------|-------------------------|
| `shared/canonical-json.js` | Deterministic JSON writer | `test/review-packet/canonical-json.test.js`, `standards/review-packet/CANONICAL-JSON.md` |
| `shared/path-guard.js` | Output isolation guard | `.external/ai-workspace-kit/scripts/lib/paths.js` |
| `shared/secret-policy.js` | Secret-like path classification and evidence refs | `.external/ai-workspace-kit/scripts/lib/inspection.js`, `EVIDENCE-REF.schema.json` |
| `shared/ignore-policy.js` | Default ignored dirs and generated packet detection | `.external/ai-workspace-kit/scripts/lib/ignore.js` |
| `shared/file-walker.js` | Deterministic relative target walk | `.external/ai-workspace-kit/scripts/lib/profile.js` |
| `shared/tree-hash.js` | Raw mutation proof hashing | `.external/ai-workspace-kit/test/adopt.test.js` |
| `test/shared/*.test.js` | Helper and integration tests | `test/review-packet/*.test.js` |
| `test/fixtures/targets/*/input/` | Target project fixtures | `.external/ai-workspace-kit/examples/*/input/` |

## Reuse Patterns

### CommonJS Modules

Use `module.exports` and `require(...)`, matching current project tests and
upstream reference helpers.

### Deterministic Paths

Normalize evidence paths with `/`, never absolute paths. Return sorted arrays
from walkers and fixture helpers.

### Safety Before IO

The secret policy must run before future content readers. Phase 2 helper tests
should prove path-only evidence shape without reading fixture secret bytes.

### Raw Hash vs Audit Walk

Keep `tree-hash` independent from `file-walker`. This is a deliberate split:
inspection ignores noise, mutation proof sees everything.

## Integration Notes

- Phase 4 can import `shared/*` helpers for `contract-drift-auditor`.
- Future framework evidence adapters can use `file-walker` and `secret-policy`
  without bypassing output isolation or path-only evidence rules.
- No Phase 2 file should import from `.external/ai-workspace-kit`.
