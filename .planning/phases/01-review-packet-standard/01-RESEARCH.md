# Phase 1: Review Packet Standard - Research

**Researched:** 2026-05-07
**Domain:** deterministic review packet contracts, JSON Schema, evidence-backed audit output
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- V1 mandatory packet artifacts are `REVIEW-SUMMARY.json`, `FINDINGS.md`, `EVIDENCE.json`, and `RECOMMENDED-ACTIONS.md`.
- `REVIEW-SUMMARY.json` is the top-level machine entrypoint and must include packet status, counts, finding references or embedded findings, tool metadata, target metadata, generated artifact list, and schema version.
- `FINDINGS.md` and `RECOMMENDED-ACTIONS.md` are human projections rendered from the same shared summary/finding data as JSON.
- `EVIDENCE.json` is the machine evidence index. It must avoid long copied source content and support path-only evidence for secret-like files.
- `RISK-MATRIX.md`, `RECOMMENDED-PATCHES.md`, patch bundles, per-tool extension schemas, and adapter-specific output generation are out of scope.
- Focused schemas are required: `REVIEW-SUMMARY.schema.json`, `FINDING.schema.json`, `EVIDENCE-REF.schema.json`, `RECOMMENDED-ACTION.schema.json`, and `TOOL-MANIFEST.schema.json`.
- Packet statuses are `pass`, `info`, `human_review_required`, and `blocked`.
- Severities are `critical`, `high`, `medium`, `low`, and `info`.
- Confidence values are `verified`, `inferred`, `unknown`, and `stale`.
- Evidence paths are normalized relative paths using `/`; readable evidence uses `sha256`; secret-like files use path-only evidence without secret-content hashes.
- CLI output, Markdown status, JSON status, and counts must be rendered from one shared summary object.
- Mirror `ai-workspace-kit` concepts, not its exact manifest. Do not make `ai-workspace-kit` a runtime dependency of V1 auditors.

### Agent Discretion

- Exact JSON Schema composition mechanics.
- File naming case for schema files.
- Test helper names.
- Whether examples live under `standards/review-packet/examples/` or nearby fixtures.

### Deferred Ideas (OUT OF SCOPE)

- `RISK-MATRIX.md`.
- `RECOMMENDED-PATCHES.md` and patch bundles.
- Per-tool extension schemas.
- Adapter-specific contract generation.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

Single-tier repository phase: all Phase 1 work is local standards, examples, and tests.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Review packet schemas | `standards/review-packet/schemas/` | tests | Schemas are the machine contract consumed by later tools and CI. |
| Taxonomy and packet guidance | `standards/review-packet/` | seed README | Human guidance must explain JSON as the source of truth and Markdown as projections. |
| Canonical JSON contract | `standards/review-packet/` | future `shared/` helper | Phase 1 documents behavior; Phase 2 can promote implementation into shared code. |
| Example packets | `standards/review-packet/examples/` | tests | Examples prove the schema shape and become fixtures for validators. |
| Schema validation tests | `test/review-packet/` | `package.json` | Tests prove determinism and schema validity before tool implementation. |
</architectural_responsibility_map>

<research_summary>
## Summary

The strongest design is a standards-first packet contract with JSON Schemas as the machine API and Markdown as generated projections. The first phase should avoid implementing drift checks or file walking; it should define stable data shapes, example packets, canonical JSON rules, and tests that future tools can reuse.

The relevant `ai-workspace-kit` ideas are strict manifests, shared summary rendering, generated file/evidence tracking, policy hashes, unresolved fields, blockers, required decisions, rejected assumptions, and preservation of stricter local rules. These should be adapted into auditor-oriented packet fields without copying the exact adoption manifest or depending on the external repository at runtime.

**Primary recommendation:** Create `standards/review-packet/` with strict draft 2020-12 schemas, examples, canonical JSON guidance, and Node tests using `ajv` to validate examples and prove deterministic serialization.
</research_summary>

<standard_stack>
## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| JSON Schema draft 2020-12 | schema URI | Machine-readable validation contract | Modern schema draft with standard composition and clear validator support. |
| Node.js built-ins | project runtime | Deterministic file IO, hashing, `node --test` | Matches `ai-workspace-kit` precedent and avoids unnecessary framework weight. |
| `ajv` | current npm stable at install time | Test-time JSON Schema validation | Widely used JSON Schema validator for Node and suitable for CI validation tests. |

### Supporting

| Library/Tool | Version | Purpose | When to Use |
|--------------|---------|---------|-------------|
| `ajv-formats` | current npm stable at install time | Validate `date-time` and URI-like formats | Add only if tests rely on strict format validation. |
| Plain Markdown | n/a | Human packet documentation and projections | Use for `FINDINGS.md` and `RECOMMENDED-ACTIONS.md` guidance/examples. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `ajv` | hand-written validator | Hand-written validation would under-test JSON Schema semantics. |
| runtime dependency in Phase 1 | dev-only validation tests | Keep Phase 1 focused on standards; runtime helpers can come in Phase 2. |
| one monolithic schema | focused schemas with `$defs`/`$ref` | Focused schemas match context decisions and improve reuse by later tools. |

**Installation:**

```bash
npm install --save-dev ajv ajv-formats
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram

```text
Future auditor checks
  -> shared summary/finding data
  -> canonical JSON writer
  -> REVIEW-SUMMARY.json
  -> EVIDENCE.json
  -> Markdown projections
  -> schema validation tests
  -> CI/GSD/human consumption
```

### Recommended Project Structure

```text
standards/
  review-packet/
    README.md
    CANONICAL-JSON.md
    schemas/
      REVIEW-SUMMARY.schema.json
      FINDING.schema.json
      EVIDENCE-REF.schema.json
      RECOMMENDED-ACTION.schema.json
      TOOL-MANIFEST.schema.json
    examples/
      pass/
        REVIEW-SUMMARY.json
        EVIDENCE.json
        FINDINGS.md
        RECOMMENDED-ACTIONS.md
      human-review/
        REVIEW-SUMMARY.json
        EVIDENCE.json
        FINDINGS.md
        RECOMMENDED-ACTIONS.md
test/
  review-packet/
    schema-validation.test.js
    canonical-json.test.js
```

### Pattern 1: Strict Focused Schemas

**What:** Use `additionalProperties: false`, explicit required fields, and `$ref` between the focused schema files.
**When to use:** All packet contract objects that later tools must emit consistently.
**Example:**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "severity", "confidence", "title", "summary", "evidenceRefs"],
  "additionalProperties": false
}
```

### Pattern 2: Shared Summary Source of Truth

**What:** Define summary counts/status as data fields that every output must render from the same object.
**When to use:** `REVIEW-SUMMARY.json`, `FINDINGS.md`, `RECOMMENDED-ACTIONS.md`, and future CLI output.
**Example:** `summary.counts.findings_by_severity.high` is stored once and compared against findings in validation tests.

### Anti-Patterns to Avoid

- **Markdown as source of truth:** Markdown is too brittle for agents and CI; it must project JSON data.
- **Long copied evidence:** Evidence refs should point to files, hashes, and reasons, not duplicate source content.
- **Secret-content hashing:** Path-only evidence must not hash or expose secret-like file contents.
- **Exact `ai-workspace-kit` manifest cloning:** Auditor packets need compatible concepts, not adapter adoption internals.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON Schema validation | Custom recursive validator | `ajv` in tests | Correct schema semantics are easy to get wrong. |
| Canonical JSON rules | Ad hoc `JSON.stringify` calls | One documented canonical JSON helper | Determinism and hashes require one behavior. |
| Count/status rendering | Per-artifact recomputation | Shared summary object | Prevents JSON/Markdown/CLI drift. |
| Secret evidence proof | Content snippets or content hashes | Path-only evidence marker | Prevents accidental secret leakage. |

**Key insight:** Phase 1 is a contract phase. The implementation should prove the contract is valid and deterministic, not solve target-project inspection yet.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Schema Drift Between Examples and Docs

**What goes wrong:** Examples demonstrate fields the schemas do not accept, or docs omit required fields.
**Why it happens:** Markdown and JSON are edited independently.
**How to avoid:** Validate examples in tests and name JSON as the source of truth in docs.
**Warning signs:** Example packets cannot be used as fixtures by future tools.

### Pitfall 2: Status and Severity Collapse

**What goes wrong:** `high` severity findings become packet `blocked` automatically, or packet status is inferred inconsistently.
**Why it happens:** Impact and workflow outcome are treated as the same concept.
**How to avoid:** Keep status packet-level and severity finding-level; document status contribution separately.
**Warning signs:** A low-confidence human decision changes severity instead of packet status.

### Pitfall 3: Secret Evidence Leakage

**What goes wrong:** Secret-like files appear in hashes, snippets, or copied evidence.
**Why it happens:** Evidence refs assume all readable files can be treated the same way.
**How to avoid:** Require `path_only: true` as a first-class schema branch and forbid secret-content snippets in V1.
**Warning signs:** A `.env` example includes a hash derived from file content.
</common_pitfalls>

<code_examples>
## Code Examples

### Canonical JSON Reference

```javascript
// Source: .external/ai-workspace-kit/scripts/lib/canonical-json.js
function canonicalJson(value) {
  return JSON.stringify(sortValue(value), null, 2) + "\n";
}
```

### Shared Summary Rendering Reference

```javascript
// Source: .external/ai-workspace-kit/scripts/lib/review.js
const status = blockers.length
  ? "blocked"
  : requiredDecisions.length
    ? "human review required"
    : "ready for manual review";
```

### Strict Manifest Schema Reference

```json
{
  "required": ["sourceCommit", "generatedFiles", "permissionPolicyHash", "reviewSummary"],
  "additionalProperties": false
}
```
</code_examples>

<sota_updates>
## State of the Art (2024-2026)

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Prose-only audit reports | Machine JSON plus human projections | Enables CI, agents, and deterministic tests. |
| Tool-specific finding shapes | Shared packet schemas | Enables cross-tool review and GSD ingestion. |
| Embedded evidence snippets | Narrow evidence references | Reduces copyright, token, and secret risks. |
| Implicit unknowns | Explicit `unknown` and `stale` confidence | Avoids invented project facts. |

**New tools/patterns to consider:**

- JSON Schema draft 2020-12 for portable contracts.
- `node --test` for low-dependency test execution.
- Dev-only `ajv` validation for schema proof.

**Deprecated/outdated:**

- Markdown-only packet contracts for machine consumers.
- Broad generated contract replacement without review packets.
</sota_updates>

<open_questions>
## Open Questions

1. **Should `ajv-formats` be required immediately?**
   - What we know: `TOOL-MANIFEST` needs `date-time`; `ajv` requires a formats plugin for strict format validation.
   - What's unclear: Whether Phase 1 should enforce date formats or only type-check strings.
   - Recommendation: Add `ajv-formats` in plan 01-03 if schema tests validate `run_timestamp`.

2. **Should findings be embedded in `REVIEW-SUMMARY.json` or referenced?**
   - What we know: Context allows finding references or embedded findings.
   - What's unclear: Which is better for the first auditor.
   - Recommendation: Use embedded findings in examples for easy validation and allow stable ids for future splitting.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)

- `.planning/phases/01-review-packet-standard/01-CONTEXT.md` - locked decisions.
- `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md` - build order and packet requirements.
- `AGENTS.md` - local workflow, safety, and review packet rules.
- `standards/review-packet/SEED-IDEAS.md` - seed product scope.
- `.external/ai-workspace-kit/ADAPTER-GENERATION.md` - compatible manifest and review packet concepts.
- `.external/ai-workspace-kit/schemas/ai-workspace.manifest.schema.json` - strict schema precedent.
- `.external/ai-workspace-kit/scripts/lib/canonical-json.js` - canonical JSON reference.
- `.external/ai-workspace-kit/scripts/lib/review.js` - shared summary rendering reference.

### Secondary (MEDIUM confidence)

- `.planning/research/SUMMARY.md` - roadmap-level research and stack guidance.
</sources>

<metadata>
## Metadata

**Research scope:**

- Core technology: JSON Schema, deterministic JSON, Node tests.
- Ecosystem: `ai-workspace-kit` review packet reference concepts.
- Patterns: focused schemas, shared summary rendering, path-only evidence.
- Pitfalls: schema/doc drift, status/severity collapse, secret evidence leakage.

**Confidence breakdown:**

- Standard stack: HIGH - local reference uses Node and deterministic JSON; JSON Schema is the requested contract.
- Architecture: HIGH - directly derived from locked Phase 1 decisions.
- Pitfalls: HIGH - explicitly described by guide and `ai-workspace-kit`.
- Code examples: HIGH - from local checked-out source.

**Research date:** 2026-05-07
**Valid until:** 2026-06-06
</metadata>

---

*Phase: 01-review-packet-standard*
*Research completed: 2026-05-07*
*Ready for planning: yes*
