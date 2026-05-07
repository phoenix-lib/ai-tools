# Project Context Ledger

## Classification

external tool or kit extension

## Purpose

Stores verified project facts with evidence refs, hashes, confidence, and stale detection to reduce repeated context loading.

## When To Use

Before discuss/plan/review; after commits; when resuming work; before asking an AI to inspect a large repo.

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

ctx scan; ctx brief --task; ctx diff --since; ctx evidence --topic; FACTS/COMMANDS/CONTRACTS/SKILLS/DECISIONS/EVIDENCE.json files with hash-based staleness.

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

