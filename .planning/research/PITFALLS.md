# Pitfalls Research

**Domain:** read-only AI development audit tools
**Researched:** 2026-05-07
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Building Many Tools Before the Contract

**What goes wrong:**
Each tool invents its own status, severity, evidence, and output shape.

**Why it happens:**
The seed folders make it tempting to start several tools in parallel.

**How to avoid:**
Build the review packet standard first and make the first auditor prove it.

**Warning signs:**
Multiple tools have separate JSON shapes or duplicated file walkers.

**Phase to address:**
Phase 1.

---

### Pitfall 2: Hidden Target Project Mutation

**What goes wrong:**
Auditors write reports into target projects, run commands, install packages, or
modify contracts during review.

**Why it happens:**
Review and install/fix workflows are not separated.

**How to avoid:**
Require explicit `--out`, reject target-contained output for target audits, and
keep MVP tools review-only.

**Warning signs:**
Tests do not hash target fixtures before and after a run.

**Phase to address:**
Phase 2 and Phase 4.

---

### Pitfall 3: Secret Leakage Through Evidence

**What goes wrong:**
Secret-like file contents appear in JSON, Markdown, hashes, or copied evidence.

**Why it happens:**
File hashing/copying is implemented before secret classification.

**How to avoid:**
Classify secret-like paths before reads and use path-only evidence by default.

**Warning signs:**
Tests create `.env.local` but only assert the tool does not crash.

**Phase to address:**
Phase 2.

---

### Pitfall 4: Permission Approval From Weak Evidence

**What goes wrong:**
Finding `npm run test` becomes broad `npm install *` permission, or absent tools
receive allow rules.

**Why it happens:**
Command discovery and permission approval are treated as the same thing.

**How to avoid:**
Separate command existence, package-manager evidence, and permission conclusions.

**Warning signs:**
Prose mentions of Yarn, pnpm, curl, or wget generate permissions.

**Phase to address:**
Phase 4.

---

### Pitfall 5: Markdown as the Source of Truth

**What goes wrong:**
Agents and CI parse prose reports, and status/counts drift between artifacts.

**Why it happens:**
Markdown is easier to write first.

**How to avoid:**
Build one shared summary object and render Markdown/CLI/JSON from it.

**Warning signs:**
`FINDINGS.md` and `REVIEW-SUMMARY.json` compute counts independently.

**Phase to address:**
Phase 1.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Ad hoc markdown regexes everywhere | Fast extraction | Hard to reason about parser behavior | Only behind named parser helpers. |
| One-off fixture trees | Fast first tests | Hard to reuse across tools | Accept for first test, then consolidate. |
| No schema validation | Faster rendering | Broken packets reach agents/CI | Never for packet artifacts. |
| Broad ignore rules without tests | Simpler walker | Missed evidence or polluted evidence | Only with explicit fixture coverage. |

## Looks Done But Is Not Checklist

- [ ] Schemas exist but generated packets are not validated against them.
- [ ] Auditor is read-only in normal cases but writes inside target project on
  error paths.
- [ ] Secret files are ignored entirely, so path-only evidence is missing.
- [ ] CLI status says blocked but JSON says human review required.
- [ ] Commands are detected only at repo root, missing monorepo package roots.
- [ ] Generated review packets are discovered as target evidence on later runs.

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Tool silos | Phase 1 | Shared schemas and renderer exist before auditor MVP. |
| Hidden mutation | Phase 2 | Fixture tree hashes match before and after runs. |
| Secret leakage | Phase 2 | Secret sentinel strings never appear in outputs. |
| Weak permission evidence | Phase 4 | Mixed manager/prose mention fixtures reject broad permissions. |
| Markdown source of truth | Phase 1 | CLI, Markdown, and JSON statuses match from shared summary. |

## Sources

- `AI-AGENT-IMPLEMENTATION-GUIDE.md`
- `.external/ai-workspace-kit/README.md`
- `.external/ai-workspace-kit/ADAPTER-GENERATION.md`
- `.external/ai-workspace-kit/test/*.js`

---
*Pitfalls research for: read-only AI development audit tools*
*Researched: 2026-05-07*
