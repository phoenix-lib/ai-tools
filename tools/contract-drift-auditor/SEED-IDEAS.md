# Contract Drift Auditor

## Classification

external tool, optionally integrated with kit

## Purpose

Checks whether AI contracts still match project reality.

## When To Use

Maintenance mode, phase boundaries, before major execution, and before adopting generated contracts into mature projects.

## Inputs

- Target project path.
- Existing assistant contracts such as AGENTS.md, CLAUDE.md, or project-local equivalents when relevant.
- Planning artifacts such as .planning/ROADMAP.md, phase plans, summaries, and state when relevant.
- Tool-specific evidence files discovered locally; do not read secret contents unless the user explicitly asks.

## Outputs

- Human-readable Markdown report.
- Machine-readable JSON summary with status, severity, recommended actions, evidence refs, stale facts, and blockers.
- Evidence references as file paths, hashes, and short reason strings.
- No target-project mutation by default.

## MVP Implementation

Parse AGENTS.md/CLAUDE.md/.planning; extract commands, source layers, permissions, skills, optional tools; compare against filesystem/package scripts; emit drift report and JSON summary.

## Integration With ai-workspace-kit

- ai-workspace-kit should document when this tool is recommended.
- Tool output should be compatible with review packet artifacts, ideally REVIEW-SUMMARY.json, FINDINGS.md, and EVIDENCE.json.
- Adoption review should reference this tool only when local evidence shows the project would benefit from it.
- The tool must not become a required dependency of ai-workspace-kit unless a future phase deliberately changes that boundary.

## Safety Rules

- Default to review-only mode.
- Do not install dependencies or mutate target projects automatically.
- Do not read secret-like file contents by default.
- Mark uncertain facts as unresolved or stale instead of inventing values.
- Preserve stricter project-local rules.

## First Test Fixture

Use a small mature fixture with existing assistant guidance, planning artifacts, nested package roots, and at least one intentionally stale or missing reference.

