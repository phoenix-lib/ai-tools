# Phase Forensics Tool

## Classification

external GSD review tool

## Purpose

Explains how a phase went wrong by correlating plan, commits, diffs, tests, feedback, and review artifacts.

## When To Use

After failed execution, surprising review result, user correction, or phase rollback.

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

Load phase plan and summaries; inspect commit range and test outputs; classify plan/reality/test/assumption failures; output findings, root causes, and contract updates.

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

