# Architecture Research

**Domain:** read-only AI development audit tools
**Researched:** 2026-05-07
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```text
standards/
  review-packet/
    schemas and markdown contracts

shared/
  canonical-json/
  file-walker/
  ignore-policy/
  secret-policy/
  package-discovery/
  evidence-ref/

tools/
  contract-drift-auditor/
    cli, checks, renderers, tests

fixtures/
  target projects used by tests
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Review packet standard | Defines stable output contract. | JSON schemas plus markdown guidance. |
| Evidence refs | Connect findings to narrow proof. | Path, hash, line, reason, confidence. |
| File walker | Enumerates target evidence safely. | Ignore generated/noise paths; cap traversal. |
| Secret policy | Prevents secret content reads. | Path classification and path-only evidence. |
| Package discovery | Finds package scripts and managers. | Root plus common monorepo package roots. |
| Contract parser | Extracts referenced files, commands, skills. | Deterministic markdown/token heuristics with unknowns. |
| Drift auditor | Compares contract claims to local evidence. | Emits review packet artifacts. |

## Recommended Project Structure

```text
standards/
  review-packet/
    REVIEW-SUMMARY.schema.json
    FINDING.schema.json
    EVIDENCE.schema.json
    RECOMMENDED-ACTION.schema.json
    TOOL-MANIFEST.schema.json
    README.md
shared/
  canonical-json/
  file-walker/
  ignore-policy/
  secret-policy/
  package-discovery/
tools/
  contract-drift-auditor/
    src/
    test/
    README.md
fixtures/
  clean-node-vue/
  mature-existing/
  stale-source-layer/
  missing-command/
  secret-like-files/
  mixed-package-managers/
  generated-packet-inside-tree/
```

## Architectural Patterns

### Pattern 1: Shared Contract Before Tools

**What:** Implement schemas and shared packet renderers before individual tools.
**When to use:** Any tool that emits findings.
**Trade-offs:** Slower first visible tool, but prevents output drift.

### Pattern 2: Read-Only Inspection Pipeline

**What:** Discover files, classify evidence, run checks, render packets.
**When to use:** All MVP auditors.
**Trade-offs:** No automatic remediation, but safer and easier to verify.

### Pattern 3: One Shared Summary

**What:** Build one summary object, then render CLI, Markdown, and JSON from it.
**When to use:** Every review packet.
**Trade-offs:** Requires careful data model, but prevents inconsistent reports.

## Data Flow

```text
Target project path
  -> safe file walker and ignore policy
  -> evidence classification
  -> deterministic check modules
  -> findings with evidence refs
  -> shared review summary
  -> JSON artifacts and Markdown reports in --out
```

## Build Order Implications

1. Review packet schemas and shared packet model.
2. Safety helpers: ignore policy, output path safety, secret policy, canonical JSON.
3. Fixture harness and schema validation tests.
4. Contract drift auditor MVP.
5. Optional later tools consuming the same packet contract.

## Anti-Patterns

### Anti-Pattern 1: Tool Silos

**What people do:** Build each seed folder independently.
**Why it is wrong:** Findings, severity, evidence refs, and safety behavior drift.
**Do this instead:** Shared standards and helpers first.

### Anti-Pattern 2: Content-Based Secret Evidence

**What people do:** Hash or copy secret file contents.
**Why it is wrong:** Leaks sensitive data and violates safety contract.
**Do this instead:** Path-only evidence for secret-like files.

### Anti-Pattern 3: Free-Form Report Parsing

**What people do:** Make GSD parse Markdown prose.
**Why it is wrong:** Brittle and expensive for agents.
**Do this instead:** Machine JSON as source of truth, Markdown as projection.

## Integration Points

| Integration | Pattern | Notes |
|-------------|---------|-------|
| ai-workspace-kit | Optional packet consumer/source of standards | Do not make external tools mandatory dependencies. |
| GSD | Consume review packet JSON | Avoid parsing free-form prose. |
| CI | Run read-only auditors and inspect status | Must be deterministic and schema-valid. |

## Sources

- `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md`
- `.external/ai-workspace-kit/ADAPTER-GENERATION.md`
- `.external/ai-workspace-kit/scripts/lib/*`

---
*Architecture research for: read-only AI development audit tools*
*Researched: 2026-05-07*
