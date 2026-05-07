# AI Workspace Kit Internal Gates

## Boundary Note

This seed is preserved for interoperability context. Internal
`ai-workspace-kit` adoption/bootstrap gates are kit-owned by default. AI Tools
should not implement this as a parallel adoption system unless a future
cross-repo decision explicitly reclassifies a narrow external-auditor
capability.

## Classification

internal ai-workspace-kit phase

## Purpose

Adds REVIEW-SUMMARY.json, severity model, generated-contract patch policy, and tool usage playbook inside ai-workspace-kit.

## When To Use

Before framework evidence adapters and before external tools are treated as supported integrations.

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

Extend review summary schema; emit REVIEW-SUMMARY.json; add critical/high/medium/info findings; document tool usage rules; add tests and snapshots.

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

