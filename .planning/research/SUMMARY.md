# Project Research Summary

**Project:** AI Tools
**Domain:** read-only AI development audit tools
**Researched:** 2026-05-07
**Confidence:** MEDIUM

## Executive Summary

AI Tools should be built as a small evidence-first audit ecosystem, not as a
collection of independent scripts. The central product is the review packet:
deterministic JSON for agents and CI, concise Markdown for humans, and narrow
evidence refs that make every finding reviewable.

The safest architecture starts with shared schemas and inspection primitives,
then proves them through one useful auditor: `contract-drift-auditor`. Later
tools such as context ledger, phase forensics, config validation, and visual
comparison should consume the same packet contract instead of inventing their
own output format.

The biggest risk is accidental mutation or evidence pollution. The roadmap
should front-load output isolation, secret policy, canonical JSON, generated
packet ignores, and fixture mutation tests before any heavier analysis.

## Key Findings

### Recommended Stack

Use a minimal Node.js CLI stack first, matching `ai-workspace-kit`. Favor
portable JSON Schemas, built-in Node modules, `node --test`, canonical JSON, and
plain Markdown reports. Add third-party dependencies only after the contracts
and first auditor prove where they are needed.

### Expected Features

**Must have:**
- Review packet schemas.
- Evidence refs and severity/status taxonomy.
- Secret-safe, read-only file inspection.
- Deterministic JSON and status/count consistency.
- `contract-drift-auditor` MVP.
- Fixture tests proving no mutation and no secret leakage.

**Should have later:**
- Project context ledger.
- Phase forensics.
- Config matrix validator.
- Skill linter.

**Defer:**
- UI screenshot comparator.
- Runtime capability inspector.
- Local integration harness.
- Domain contract test generator.

### Architecture Approach

Use shared standards and helpers first: `standards/review-packet/`, `shared/*`,
then `tools/contract-drift-auditor/`. The tool pipeline should be target path,
safe walker, evidence classification, deterministic checks, shared summary, and
packet rendering to `--out`.

### Critical Pitfalls

1. **Building many tools before the contract** - avoid by shipping schemas and
   shared renderer first.
2. **Hidden target mutation** - avoid with output isolation and tree-hash tests.
3. **Secret leakage** - avoid with path-only evidence and sentinel tests.
4. **Weak permission evidence** - avoid by separating command discovery from
   permission approval.
5. **Markdown source of truth** - avoid by rendering all artifacts from one
   shared summary.

## Implications for Roadmap

### Phase 1: Review Packet Standard

**Rationale:** Every tool depends on one stable packet contract.
**Delivers:** Schemas, status/severity/confidence model, evidence refs, tool
manifest, canonical JSON guidance, and example packets.
**Avoids:** Markdown-only reports and tool-specific output drift.

### Phase 2: Shared Safety and Fixture Harness

**Rationale:** Read-only safety must be enforced before the first auditor walks
target projects.
**Delivers:** Ignore policy, output path safety, secret policy, file walker,
canonical JSON helper, fixtures, and mutation/secret/determinism tests.
**Avoids:** Hidden mutation and secret leakage.

### Phase 3: Cross-Repo Capability Request Gate

**Rationale:** The two repositories need an explicit request and decision
protocol before heavy auditor work starts influencing upstream contracts.
**Delivers:** Cross-repo inbox/outbox/decision structure, request and decision
templates, gate playbook, bidirectional examples, and docs validation.
**Avoids:** Duplicated ownership, automatic phase creation from incoming
requests, and dependency coupling between repositories.

### Phase 4: Contract Drift Auditor MVP

**Rationale:** The first auditor proves the packet standard against real
contract drift.
**Delivers:** Read-only CLI that checks referenced files, commands,
permissions, skills, source layers, and project facts.
**Avoids:** Standards that are not grounded in a working tool.

### Phase 5: Integration and Release Hardening

**Rationale:** The first release should document how AI Tools complements
`ai-workspace-kit` without becoming a mandatory dependency.
**Delivers:** Usage, safety, optional integration guidance, release readiness
review, and criteria for deferring later tools.
**Avoids:** Integration drift, unclear release gates, and premature tool
expansion.

### Future: Later Tool Selection

**Rationale:** Build only the next tool justified by real repeated demand.
**Delivers:** Decision between context ledger, phase forensics, config matrix,
or skill linter based on usage evidence.
**Avoids:** Premature implementation of heavy optional tools.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Based on local `ai-workspace-kit` precedent, not external package research. |
| Features | HIGH | Directly derived from guide and seed README purposes. |
| Architecture | MEDIUM | Clear first structure; exact package layout can be refined during Phase 1. |
| Pitfalls | HIGH | Strongly evidenced by guide and `ai-workspace-kit` tests/workflow. |

**Overall confidence:** MEDIUM

## Gaps to Address

- Exact Node module format and package structure should be decided in Phase 1.
- JSON Schema validation dependency should be decided after initial schema
  authoring.
- The cross-repo request gate is now Phase 3; `contract-drift-auditor` moved to
  Phase 4 and release/integration hardening moved to Phase 5.

## Sources

### Primary

- `.planning/PROJECT.md`
- `AI-AGENT-IMPLEMENTATION-GUIDE.md`
- `.external/ai-workspace-kit/README.md`
- `.external/ai-workspace-kit/ADAPTER-GENERATION.md`

### Secondary

- Seed tool README files.
- `.external/ai-workspace-kit/scripts/lib/*`
- `.external/ai-workspace-kit/test/*.js`

---
*Research completed: 2026-05-07*
*Ready for roadmap: yes*
