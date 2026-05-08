---
id: SEED-001
status: dormant
planted: 2026-05-08
planted_during: Milestone v2.1 Evidence Consumption & Signal Quality, before Phase 13
trigger_when: After v2.1 has packet rollup, ledger schemas, scope/diff modes, and shared CLI consistency, and the user has a real project portfolio ready for read-only scans.
scope: Large
---

# SEED-001: Real Project Evidence Baseline / Portfolio Scan

## Why This Matters

`ai-workspace-kit` and `ai-tools` were created to improve real AI-assisted
projects, not only fixtures or planning examples. Once several real projects
are gathered in one place, a read-only portfolio scan can replace speculative
roadmap guesses with evidence from actual contracts, commands, gates, review
packets, ledgers, and recurring project failures.

This should become the bridge from tool-building to product truth: collect
repeatable problems across the user's real projects, classify which belong to
`ai-tools`, which belong to `ai-workspace-kit`, and which belong to individual
projects, then derive deeper requirements from repeated evidence.

## When to Surface

**Trigger:** After v2.1 has packet rollup, ledger schemas, scope/diff modes,
and shared CLI consistency, and the user has a real project portfolio ready for
read-only scans.

This seed should be presented during `$gsd-new-milestone` when the milestone
scope matches any of these conditions:
- The user wants to gather all real projects and run Codex, `ai-workspace-kit`,
  and validated `ai-tools` against them.
- Phase 13 review packet rollup is available and can aggregate packets across
  multiple project output directories.
- Phase 16 ledger scope/diff modes are available, so historical planning noise
  does not dominate real project findings.
- The next roadmap asks for real-world requirements, portfolio-level evidence,
  or a deeper solution based on actual project scans.

## Scope Estimate

**Large** - this is likely a full milestone, not a single tool patch. It needs
a portfolio manifest, read-only scan playbook, safe output layout, packet
rollup, findings synthesis, and requirement mining across multiple projects.

## Candidate Deliverables

- `PROJECT-PORTFOLIO.json` or equivalent manifest listing project paths,
  project types, sensitivity, allowed read-only tools, and external output
  directories.
- A review-only scan playbook that states exactly what Codex reads, what
  `ai-workspace-kit` contributes, which `ai-tools` run, and what remains
  forbidden: installs, mutation, secret reads, auto-fix, or hidden automation.
- Portfolio packet output layout that keeps each project's outputs isolated.
- Portfolio rollup using review packet evidence to group recurring problems by
  tool, severity, source path, source check, project, and owner boundary.
- `REAL-PROJECT-FINDINGS.md` summarizing repeated problems, one-off problems,
  blockers, required decisions, stale facts, and safe follow-up paths.
- `PORTFOLIO-REQUIREMENTS.md` translating repeated findings into requirements
  for `ai-tools`, `ai-workspace-kit`, and individual project maintenance.

## Boundary Rules

- The scan is read-only by default.
- Do not install dependencies, run project mutation commands, or auto-fix any
  target project.
- Do not read secret-like contents unless the user requests an exact file or
  value and the task requires it.
- Do not make `ai-tools` a runtime dependency of `ai-workspace-kit` or any
  target project.
- Treat packets, ledgers, and compatibility findings as evidence, not automatic
  decisions.
- Do not copy `.planning` state between projects.

## Breadcrumbs

Related code and decisions found in the current codebase:

- `.planning/PROJECT.md` - v2.1 current milestone focuses on evidence
  consumption and signal quality before broader real-project mining.
- `.planning/ROADMAP.md` - Phases 13-18 create the packet rollup, ledger
  schemas, dispositions, scope/diff modes, shared CLI contract, and
  `ai-workspace-kit` LLM instruction compatibility needed before portfolio
  scans.
- `.planning/STATE.md` - current state marks Phase 13 ready and records that
  phase forensics should wait until evidence consumption and triage mechanics
  are stable.
- `tools/registry.json` - source of validated tool maturity, self-use stages,
  owners, expected outputs, and non-goals.
- `tools/project-context-ledger/README.md` - current read-only project context
  scan command and ledger artifact list.
- `README.md` - public usage entrypoint for current validated tools.
- `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md` - states later tools should wait
  until real projects show repeated need.

## Notes

This seed came from the user's stated goal to gather all real projects in one
place, run Codex and `ai-workspace-kit` with validated `ai-tools` as real
read-only evidence, and use the results to derive true problems and deeper
requirements. It should surface after v2.1, because portfolio analysis will be
much more useful once rollup, schemas, scope/diff, and CLI consistency exist.
