# Feature Research

**Domain:** read-only AI development audit tools
**Researched:** 2026-05-07
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Review packet schemas | Every tool needs a shared machine contract. | MEDIUM | Start with summary, finding, evidence, action, and tool manifest schemas. |
| Evidence references | Findings are not useful without proof. | MEDIUM | Include path, hash, line when available, reason, and confidence. |
| Secret-safe inspection | Auditors must not leak target secrets. | MEDIUM | Secret-like files are path-only evidence by default. |
| Deterministic output | CI and agents need stable diffs. | MEDIUM | Canonical JSON, sorted arrays where possible, stable timestamps in tests. |
| Output isolation | Review packets must not mutate target projects. | LOW | Require `--out`; reject target-contained output for target audits. |
| First external auditor | Standards need a real proving tool. | HIGH | `contract-drift-auditor` is the first useful tool. |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Agent-consumable packets | GSD and assistants can consume JSON directly. | MEDIUM | Avoid free-form parsing. |
| Permission evidence model | Prevents broad or absent-tool permissions. | MEDIUM | Separate command discovery from permission approval. |
| Contract drift checks | Catches stale AI guidance before work starts. | HIGH | Check files, commands, skills, source layers, and project facts. |
| Context ledger | Reduces repeated context loading. | HIGH | Build later after packet schema stabilizes. |
| Phase forensics | Explains failed phases with evidence. | HIGH | Requires existing packets and phase artifacts. |

### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Build all tools at once | Looks like faster ecosystem progress. | Produces disconnected partial tools. | Build packet standard plus one auditor first. |
| Auto-fix by default | Seems helpful for stale contracts. | Mutates target projects and needs stronger safety design. | Review-only recommended actions. |
| Long copied evidence snippets | Convenient for human reading. | Increases token cost and secret/copyright risk. | Narrow evidence refs. |
| Broad package-manager permissions | Reduces prompts. | Grants absent or dangerous tools. | Evidence-backed ask/allow entries. |

## Feature Dependencies

```text
Review packet schemas
  -> shared summary renderer
  -> contract-drift-auditor output

Secret policy + file walker + canonical JSON
  -> deterministic safe inspection
  -> all external auditors

contract-drift-auditor packets
  -> project-context-ledger
  -> phase-forensics-tool
```

## MVP Definition

### Launch With

- [ ] Review packet schema set.
- [ ] Shared canonical JSON, ignore policy, secret policy, and file walker.
- [ ] `contract-drift-auditor` read-only CLI.
- [ ] Fixtures for clean project, mature project, stale reference, missing command, secret-like file, mixed package managers, and generated review packet.
- [ ] Tests for no mutation, schema validation, deterministic output, secret safety, and status/count consistency.

### Add After Validation

- [ ] Project context ledger.
- [ ] Phase forensics tool.
- [ ] Config matrix validator.
- [ ] Skill linter.

### Future Consideration

- [ ] UI screenshot comparator.
- [ ] Local integration harness.
- [ ] Runtime capability inspector.
- [ ] Domain contract test generator.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Review packet schemas | HIGH | MEDIUM | P1 |
| Shared safety helpers | HIGH | MEDIUM | P1 |
| Contract drift auditor | HIGH | HIGH | P1 |
| Context ledger | MEDIUM | HIGH | P2 |
| Phase forensics | MEDIUM | HIGH | P2 |
| Visual/integration tools | MEDIUM | HIGH | P3 |

## Sources

- `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md`
- `README.md`
- Seed tool READMEs
- `.external/ai-workspace-kit/README.md`
- `.external/ai-workspace-kit/ADAPTER-GENERATION.md`

---
*Feature research for: read-only AI development audit tools*
*Researched: 2026-05-07*
