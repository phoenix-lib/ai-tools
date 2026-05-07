# Stack Research

**Domain:** read-only AI development audit tools
**Researched:** 2026-05-07
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | Current LTS | CLI runtime and test runner | Matches `ai-workspace-kit`, has built-in `node --test`, good Windows support. |
| JSON Schema draft 2020-12 | Fixed per schema | Machine contracts for review packets | Portable across agents, CI, and tools. |
| Markdown | CommonMark-style | Human reports and seed docs | Already used by the repo and easy for humans/agents to inspect. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| No external dependency initially | n/a | Keep first release simple | Use built-in Node modules for schemas, file IO, hashing, and tests first. |
| ajv or equivalent | Future | Full JSON Schema validation | Add only if built-in validation is insufficient for schemas. |
| commander or equivalent | Future | CLI ergonomics | Add after the first CLI contract stabilizes. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `node --test` | Deterministic tests | Avoids external test dependencies for the MVP. |
| `rg` | Fast inspection | Preferred for local search and fixtures. |
| Git | Fixture mutation and change review | Tree-hash tests prove target projects are not mutated. |

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Node.js CLI | Python CLI | Use Python only if later tools need stronger parsing libraries. |
| JSON Schema | TypeScript-only types | Use TS types internally later, but schemas must remain portable. |
| Built-in test runner | Jest/Vitest | Use a framework only when assertions/snapshots outgrow `node --test`. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Heavy framework first | Adds dependency and build complexity before contracts are stable. | Plain Node modules and schemas. |
| LLM-only parsing | Non-deterministic and hard to verify. | Deterministic parsers with explicit unknowns. |
| Auto-fix engine in MVP | Mutates target projects before safety model is proven. | Review-only packets and recommended actions. |

## Stack Patterns by Variant

**If building the first release:**
- Use CommonJS or simple ESM consistently.
- Keep package layout minimal.
- Prefer deterministic helpers over abstraction-heavy frameworks.

**If adding richer tools later:**
- Add dependencies only behind shared helper boundaries.
- Preserve review-packet compatibility.

## Sources

- `AI-AGENT-IMPLEMENTATION-GUIDE.md` - implementation order and safety rules.
- `.external/ai-workspace-kit` - Node CLI, schemas, canonical JSON, review-only workflow.
- Seed README files - target tool domains.

---
*Stack research for: read-only AI development audit tools*
*Researched: 2026-05-07*
