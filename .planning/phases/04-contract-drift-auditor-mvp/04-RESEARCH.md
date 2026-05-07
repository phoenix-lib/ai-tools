# Phase 4: Contract Drift Auditor MVP - Research

## RESEARCH COMPLETE

**Phase:** 04 - Contract Drift Auditor MVP
**Date:** 2026-05-07
**Research mode:** inline Codex research using local project artifacts and
updated `.external/ai-workspace-kit` reference.

## Gate Resolution

- **Upstream Freshness Gate:** passed. Local `ai-workspace-kit` was updated from
  `48ec037d058747151c320ced9c0ee1e1d247d4b1` to
  `2079ab9626e9f9ed256512091f9c5ea473582885`; checkout was clean before pull.
  Upstream `CHANGELOG.md` existed and was read first.
- **AI Tools Self-Use Gate:** no validated matching AI Tools auditor exists yet.
  Skip as planned capability.
- **Cross-Repo Incoming Review Gate:** the incoming
  `contract-drift-auditor` request is accepted/planned for Phase 4 through
  `.planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`.
- **Cross-Repo Outgoing Need Gate:** no outgoing request required. The phase
  implements AI Tools-owned external auditor mechanics and packet renderer;
  `ai-workspace-kit` owns only optional consumption/recommendation guidance.
- **New Tool Intake Gate:** destination is `tools/contract-drift-auditor/` for
  auditor mechanics and `shared/` for reusable packet rendering.
- **Git Baseline Gate:** worktree was clean before freshness/research work.

## Phase Goal

Build the first useful read-only AI Tools auditor:

```powershell
contract-drift-auditor --project <path> --out <dir>
```

The CLI should reject unsafe output paths, inspect local project evidence,
detect contract drift, and emit the standard packet artifacts:
`REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
`RECOMMENDED-ACTIONS.md`.

## Relevant Existing Assets

- `shared/path-guard.js`: output path rejection for target-project audits.
- `shared/file-walker.js` and `shared/ignore-policy.js`: deterministic scans
  and generated-packet/nested-checkout exclusion.
- `shared/secret-policy.js`: normalized evidence paths and path-only secret
  evidence refs.
- `shared/canonical-json.js`: deterministic JSON output.
- `shared/tree-hash.js`: target fixture mutation checks.
- `standards/review-packet/schemas/*`: strict schemas for packet artifacts.
- `test/fixtures/targets/*`: seven existing target fixtures covering clean,
  mature, missing command, stale source layer, secret-like files, mixed package
  managers, and generated packet inside target.

## Implementation Strategy

### 1. Shared Packet Renderer First

Schemas alone do not prevent drift between JSON, Markdown, and CLI status.
Phase 4 should create a reusable renderer that accepts one packet model and
writes all artifacts from it:

- `REVIEW-SUMMARY.json` through canonical JSON.
- `EVIDENCE.json` from the packet evidence collection.
- `FINDINGS.md` from `summary.findings`.
- `RECOMMENDED-ACTIONS.md` from `summary.recommended_actions`.
- CLI status from the same summary status/counts.

The renderer should not know `contract-drift-auditor` domain details. It should
validate basic shape/count consistency and keep future tools reusable.

### 2. CLI Safety Shell

The CLI needs only the minimum argument parser:

- Require `--project <path>`.
- Require `--out <dir>`.
- Support `--help`.
- Reject unknown write/fix flags in MVP.
- Resolve target/out paths and call `assertSafeOutputDir` before output
  creation.
- Return non-zero for unsafe args or blocked packet-generation failures.

Do not run target project scripts as validation. Package scripts are evidence,
not commands to execute.

### 3. Deterministic Discovery

Discovery can be simple and file-based:

- Contract files: `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, project-local
  equivalents when present.
- Planning files: `.planning/ROADMAP.md`, `.planning/STATE.md`, active phase
  docs when discoverable.
- Skill files: `.codex/skills/*/SKILL.md`, `.agents/skills/*/SKILL.md`.
- Package scripts: nearest `package.json` files discovered by the walker.
- Source-layer references: markdown list items under headings like
  `Source Layers`, `Canonical References`, `Project Contract`, and explicit
  path-looking inline references.

MVP does not need perfect natural-language parsing. It needs deterministic
checks that catch clear drift and mark ambiguous facts as unknown/unresolved.

### 4. MVP Drift Checks

First check set:

- `drift.file.missing`: referenced local file path does not exist.
- `drift.source_layer.missing`: source-layer/canonical reference file missing.
- `drift.command.missing`: command such as `npm run verify:ai` is referenced
  but no matching package script or known command source is found.
- `drift.permission.absent_tool`: permission/workflow text references a tool or
  package manager with no local evidence.
- `drift.skill.missing`: referenced skill directory or `SKILL.md` is missing.
- `drift.profile.unresolved`: profile/source fact cannot be verified from local
  evidence.
- `drift.generated_packet.ignored`: generated packet directories are ignored as
  current evidence; this can be info-level if useful for debug output.

Severity should be conservative:

- Missing command/source layer used by active contracts: `high` or `medium`
  depending on whether it blocks trust.
- Missing optional skill/tool: `medium` or `low`.
- Unknown/unresolved fact: `info` or `human_review_required` status
  contribution when a human decision is needed.

### 5. Packet Semantics

Use existing schema values:

- packet statuses: `pass`, `info`, `human_review_required`, `blocked`.
- severities: `critical`, `high`, `medium`, `low`, `info`.
- confidence: `verified`, `inferred`, `unknown`, `stale`.

`ai-workspace-kit` may map AI Tools `low` severity to kit `info`; AI Tools
should keep its richer severity vocabulary.

## Validation Architecture

Test with `node:test` and existing Ajv schema helpers.

Required automated checks:

- Unit tests for renderer count/status consistency and canonical JSON output.
- Unit tests for CLI argument failures: missing `--project`, missing `--out`,
  target-local `--out`, unknown write/fix flags.
- Unit tests for discovery/parsing against fixture `AGENTS.md` and nested
  package roots.
- Fixture tests for `missing-command` and `stale-source-layer` proving expected
  finding IDs appear.
- Secret fixture test proving sentinel strings do not appear in generated
  packet artifacts.
- Generated-packet fixture test proving old packets inside target are not
  treated as current contract evidence.
- Tree-hash tests before/after auditor runs proving target `input/` is not
  mutated.
- Schema validation for generated `REVIEW-SUMMARY.json`, embedded findings,
  evidence refs, and recommended actions.

Quick command:

```powershell
npm.cmd test -- test/contract-drift-auditor
```

Full command:

```powershell
npm.cmd test
```

## Risks and Mitigations

- **Parser overreach:** keep MVP path/command/skill extraction deterministic and
  mark ambiguous facts unresolved.
- **Secret leakage:** classify secret-like paths before any content read and use
  path-only evidence.
- **Packet drift:** renderer owns all packet projections.
- **Boundary creep:** do not implement adoption/bootstrap or generated-contract
  merge logic.
- **Target mutation:** output isolation plus tree-hash fixture checks.
- **Windows path bugs:** normalize evidence paths with `/` and reject drive
  paths in packet evidence.

## Planning Recommendation

Use three waves:

1. Shared renderer plus CLI safety/discovery shell.
2. Drift checks for files, commands, permissions, skills, source layers, and
   unresolved facts.
3. Full packet emission, fixture integration tests, documentation, and final
   schema/non-mutation verification.

