---
created: 2026-05-07T14:30:39.616Z
title: Accept gate linter request
area: planning
files:
  - .planning/ROADMAP.md
  - .planning/REQUIREMENTS.md
  - .planning/cross-repo/
  - CHANGELOG.md
  - AGENTS.md
---

## Problem

`ai-workspace-kit` sent a proposed cross-repo capability request asking AI Tools
to accept two related process/capability requirements:

- Changelog gate: after each major phase or major task, AI Tools writes a
  concise changelog entry covering changed contracts, gates, schemas, review
  packet semantics, tool capabilities, compatibility impact for
  `ai-workspace-kit`, breaking or potentially breaking changes, and migration
  notes when needed.
- Gate review support: assistants make the final semantic decision about
  whether gates are relevant, conflicting, duplicated, stale, dependency-creep
  risks, or should be adopted/revised/deferred/rejected/converted into a
  capability request.

The request also asks AI Tools to plan future mechanical support for a
gate-linter that can detect missing gate blocks, duplicate gate IDs, stale file
paths, missing source layers, missing changelog entries, conflicting required or
forbidden wording, unresolved references, and gates without observable artifact
output. Tool output must be treated as evidence only, not as the final decision.

`.planning/cross-repo/` does not exist yet because Phase 03 has not executed.
This todo preserves the real incoming request so Phase 03 can convert it into
the first structured inbox request and decision once the protocol exists.

## Solution

During Phase 03 planning/execution:

1. Accept the short-term changelog convention and gate-review process as
   planned requirements already represented by `GATE-01`, `GATE-02`, and
   `GATE-03`.
2. Add a structured incoming request from `ai-workspace-kit` to
   `.planning/cross-repo/inbox/` using the Phase 03 capability request
   template.
3. Add a decision that accepts changelog convention and assistant-owned semantic
   gate review as process requirements, and defers mechanical gate-linter
   implementation as a future optional AI Tools capability.
4. Make clear in the playbook that `ai-workspace-kit` may read AI Tools
   changelog as evidence during freshness checks, but must not install, run, or
   depend on AI Tools automatically.
5. Seed a future optional `gate-linter` capability that emits
   `REVIEW-SUMMARY.json`, `FINDINGS.md`, and `EVIDENCE.json` using the AI Tools
   review packet standard. Keep its output evidence-only.
