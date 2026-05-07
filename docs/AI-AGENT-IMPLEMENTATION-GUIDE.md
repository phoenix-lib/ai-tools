# AI Tools Implementation Guide

This guide is for an AI coding agent implementing the `C:\projects\ai-tools` tool ecosystem.

## Mission

Build a small ecosystem of read-only AI development auditors that help projects stay accurate, reviewable, and cheap to reason about. The tools must support `ai-workspace-kit` without becoming mandatory product dependencies of target projects.

The first goal is not to generate more templates. The first goal is to produce reliable evidence-based review packets that other assistants, humans, CI jobs, and GSD workflows can consume.

## Current Repository State

`C:\projects\ai-tools` keeps product seed ideas under `tools/*/SEED-IDEAS.md`
and `standards/review-packet/SEED-IDEAS.md`. Each seed file describes purpose,
inputs, outputs, MVP, risks, and integration ideas. Treat these files as
product seeds, not as final architecture.

Important folders:

- `standards/review-packet/SEED-IDEAS.md`
- `tools/ai-workspace-kit-internal-gates/SEED-IDEAS.md`
- `tools/contract-drift-auditor/SEED-IDEAS.md`
- `tools/project-context-ledger/SEED-IDEAS.md`
- `tools/phase-forensics-tool/SEED-IDEAS.md`
- `tools/config-matrix-validator/SEED-IDEAS.md`
- `tools/domain-contract-test-generator/SEED-IDEAS.md`
- `tools/runtime-capability-inspector/SEED-IDEAS.md`
- `tools/skill-linter/SEED-IDEAS.md`
- `tools/test-quality-auditor/SEED-IDEAS.md`
- `tools/tool-usage-registry/SEED-IDEAS.md`
- `tools/ui-regression-screenshot-comparator/SEED-IDEAS.md`
- `tools/local-integration-harness/SEED-IDEAS.md`

## Core Direction

Do not build 13 disconnected tools at once. First create shared standards and a minimal read-only toolchain.

Recommended structure:

```text
ai-tools/
  standards/
    review-packet/
    evidence-ref/
    finding-severity/
    tool-manifest/
  tools/
    contract-drift-auditor/
    project-context-ledger/
    phase-forensics-tool/
    config-matrix-validator/
  shared/
    file-walker/
    secret-policy/
    package-discovery/
    markdown-contract-parser/
```

Seed ideas now live under `tools/*/SEED-IDEAS.md` and should be promoted into
plans only after the New Tool Intake and Placement Gate classifies ownership,
destination, maturity, activation stage, outputs, and non-goals.

## Adopted Principles From ai-workspace-kit

These project standards are derived from `phoenix-lib/ai-workspace-kit` at commit `3e489b1a99c58443e593a1e2f6234ed5d0dc173d`.

Use these principles across `ai-tools`:

- Keep core standards separate from tool-specific mechanics. Shared schemas, evidence refs, severity, status, permission policy, path safety, and secret handling belong in `standards/` or `shared/`; each tool owns only its domain checks and CLI behavior.
- Make review-only mode explicit. Commands that produce packets should require a clear review/action flag such as `--review`, reject install/apply/write-style flags until a future fix mode exists, and never mutate the target project.
- Require `--out <dir>` and reject output paths inside the target project. Report generation writes to the explicit output directory only.
- Treat generated packets as review material, not installation material. Reports may recommend manual changes, but MVP tools must not apply patches to target projects.
- Render human and machine artifacts from one shared summary object so status, blocker counts, finding counts, and required decisions cannot drift across Markdown, JSON, and CLI output.
- Preserve stricter local rules. If a target project has existing assistant contracts, planning artifacts, permissions, or safety rules, auditors should report conflicts or stale guidance without weakening local policy.
- Separate command discovery from permission approval. Finding `npm run test` or a package script is evidence that a command exists; it is not automatic evidence that broad package-manager mutation should be allowed.
- Keep permission decisions evidence-backed. Package mutation permissions require package metadata, lockfiles, or exact install/update/add/remove command evidence, not prose mentions or unrelated scripts.
- Treat conflicting package managers as review-required. Multiple managers in different roots should produce rejected or human-review permission conclusions instead of broad allow rules.
- Treat secret-like files as path-only evidence. `.env`, `.env.*`, key, token, credential, and secret files may be listed by path when useful, but contents must not be read, hashed into user-facing reports, copied, or treated as verified configuration facts by default.
- Use a default ignore policy to avoid evidence pollution. Ignore `.git`, `node_modules`, build outputs, coverage, temp directories, generated review packets, nested checkouts, and fixture expected/output trees unless the user explicitly targets them.
- Use canonical JSON for deterministic outputs. Sort object keys recursively and end JSON files with a newline before hashing or snapshot testing.
- Include source and policy hashes in packet metadata. Review packets should identify tool version, source commit when available, schema version, policy hashes, requested tool/adapters, generated files, target facts, and run timestamp.
- Make unresolved facts first-class. Required unknown values should become `TODO`, `unknown`, `stale`, or `unresolved` entries with required actions, not invented defaults.
- Test non-mutation with tree hashes. Fixtures should be hashed before and after tool execution to prove target inputs were not changed.
- Test artifact consistency. CLI status, Markdown status, JSON summary status, and counts must match.
- Test adapter/tool selection. If a run requests only one adapter or tool output, unrequested outputs and next steps must not be generated.

## Build Order

### Phase 1: AI Review Packet Standard

Create a portable output contract used by every tool.

Required artifacts:

```text
REVIEW-SUMMARY.json
FINDINGS.md
EVIDENCE.json
RECOMMENDED-ACTIONS.md
```

Minimum JSON concepts:

- `status`: `pass`, `info`, `human_review_required`, `blocked`
- `findings`: array of severity-tagged findings
- `severity`: `critical`, `high`, `medium`, `low`, `info`
- `evidenceRefs`: file path, hash, line when available, reason
- `recommendedActions`: concrete next steps
- `tool`: name, version, inputs, run timestamp
- `targetProject`: normalized path and detected facts

Rules:

- Findings must cite evidence.
- Unknown facts must be marked `unknown` or `stale`; do not invent values.
- Reports must be deterministic where possible.
- Markdown reports are for humans; JSON reports are for agents and CI.

### Phase 2: AI Workspace Kit Internal Gates

Apply the review packet standard back to `ai-workspace-kit`.

Target improvements:

- Add `REVIEW-SUMMARY.json` to adoption review packets.
- Add severity model to review output.
- Make generated-contract output patch-oriented, not replacement-oriented.
- Fix adapter-aware next steps: if only `--adapters codex` is requested, do not tell users to inspect Claude files.
- Keep permission defaults strict. Prefer `ask` for broad `npm run *`; allow only read-only commands by default.
- Keep generated contracts clearly marked as review material.

Acceptance checks:

- Clean clone tests pass on Windows with `core.autocrlf=true`.
- Review-only commands never mutate target projects.
- Secret-like files may appear only as path-only evidence; contents must never be read or copied.

### Phase 3: Contract Drift Auditor

Build the first external tool.

Purpose:

Check whether AI contracts still match project reality.

MVP checks:

- Files referenced by `AGENTS.md`, `CLAUDE.md`, `.planning/*`, and skills exist.
- Commands listed in contracts exist in package scripts or documented command sources.
- Permissions do not allow absent tools or package managers.
- Skills referenced by contracts exist and have valid `SKILL.md` files.
- Source layers are real files and are not stale.
- Project profile facts match local evidence.

Output:

- `REVIEW-SUMMARY.json`
- `FINDINGS.md`
- `EVIDENCE.json`
- `RECOMMENDED-ACTIONS.md`

Default mode is read-only. Do not auto-fix in the MVP.

### Phase 4: Project Context Ledger

Build verified project memory to reduce AI token usage without losing quality.

CLI shape:

```bash
ctx scan --project <path> --out <ledger-dir>
ctx brief --project <path> --task "review ai-workspace-kit"
ctx diff --project <path> --since HEAD~1
ctx evidence --project <path> --topic permissions
ctx stale --project <path>
```

Ledger files:

```text
FACTS.json
COMMANDS.json
CONTRACTS.json
SKILLS.json
DECISIONS.json
EVIDENCE.json
CACHE-MANIFEST.json
```

Each fact needs:

- fact text or structured value
- evidence refs
- hash of source evidence
- confidence: `verified`, `inferred`, `unknown`, `stale`
- last checked timestamp

The ledger must never replace reading relevant code. It should reduce repeated context loading by pointing the agent to the smallest relevant evidence set.

### Phase 5: Phase Forensics Tool

Build after the review packet standard and drift auditor exist.

Purpose:

Explain how a phase went wrong by correlating plans, diffs, commits, tests, review artifacts, and user feedback.

MVP inputs:

- target project path
- phase id or phase artifact directory
- commit range when available
- test outputs when available
- review packets when available

MVP classifications:

- plan/reality mismatch
- shallow or missing tests
- wrong assumption
- delegated work coordination failure
- UI regression not covered by tests
- contract drift
- verification gap

Output should include concrete contract/test/process updates, not just narrative blame.

## Later Tools

Do not implement these first unless a real project creates repeated demand.

- `config-matrix-validator`: important for dev/stage/prod config and secrets. Build after drift auditor or as a small parallel MVP.
- `skill-linter`: useful once shared skill publishing begins.
- `test-quality-auditor`: valuable after domain contracts stabilize.
- `domain-contract-test-generator`: requires a stable domain contract format first.
- `runtime-capability-inspector`: useful for projects with hardware/services such as OBS, GoXLR, microphones, browsers, ports.
- `ui-regression-screenshot-comparator`: valuable but needs Playwright baseline policy and visual threshold design.
- `local-integration-harness`: powerful but project-specific and heavier than the first read-only auditors.

## Safety Contract

Every tool must follow these defaults:

- Review-only by default.
- Do not mutate target projects unless an explicit future `--fix` mode is designed and approved.
- Do not install dependencies in target projects.
- Do not read secret-like file contents by default.
- Do not copy `.planning` state or assumptions from one project into another.
- Preserve stricter project-local rules.
- Mark uncertainty instead of inventing facts.
- Use narrow evidence refs instead of long copied source content.

Secret-like examples:

- `.env`
- `.env.*`
- key files
- token files
- credential files
- secret manager exports

Path-only evidence is allowed when useful; content reads are denied unless the user explicitly requests the exact access.

## Review Packet Finding Shape

Use this conceptual shape in JSON outputs:

```json
{
  "id": "drift.command.missing",
  "severity": "high",
  "title": "Contract references a missing command",
  "summary": "AGENTS.md lists npm run typecheck, but no matching package script was found.",
  "evidenceRefs": [
    {
      "path": "AGENTS.md",
      "line": 42,
      "hash": "...",
      "reason": "Referenced command"
    },
    {
      "path": "src/server/package.json",
      "hash": "...",
      "reason": "Available package scripts"
    }
  ],
  "recommendedAction": "Update the contract or add/rename the package script.",
  "confidence": "verified"
}
```

## Testing Strategy

Start with deterministic fixtures.

Minimum fixtures:

- small clean Node/Vue project
- mature project with `AGENTS.md`, `CLAUDE.md`, `.planning`, nested packages, and local skills
- project with stale source layer reference
- project with missing command in contract
- project with secret-like files that must not be read
- project with mixed package managers
- project with generated review packet inside the tree that must be ignored

Minimum tests:

- clean clone tests pass on Windows and Linux line endings
- review output is deterministic
- target project is not mutated
- secret contents do not appear in output
- stale/missing evidence is detected
- review summary counts match findings
- JSON schemas validate generated packets

## Integration With ai-workspace-kit And GSD

`ai-workspace-kit` should remain the adoption/bootstrap contract tool.

External tools should be optional and referenced only when useful:

- `contract-drift-auditor`: phase boundaries, maintenance, before applying generated contracts
- `project-context-ledger`: before discuss/plan/review and after commits
- `phase-forensics-tool`: after failed phases or surprising regressions
- `config-matrix-validator`: before environment/config work
- `test-quality-auditor`: before marking phases verified

GSD integration should consume review packets instead of parsing free-form prose.

## Definition Of Done For First Release

A first useful release is complete when:

- A common review packet schema exists.
- One tool, preferably `contract-drift-auditor`, emits that packet.
- The tool can run against `stream-voice-fix` in read-only mode.
- It identifies at least source-layer, command, permission, and skill drift.
- Tests cover clean clone, no mutation, secret safety, and deterministic output.
- Documentation explains when to use the tool and when not to use it.

## Practical Guidance For The Implementing Agent

Work incrementally. Prefer one small green tool over many broad README expansions.

Before coding:

1. Read `docs/INITIAL-SEED-OVERVIEW.md` and the relevant
   `tools/<tool-name>/SEED-IDEAS.md` files.
2. Confirm the proposed work belongs in `standards/`, `shared/`, or
   `tools/<tool-name>/`.
3. Create the review packet schema first.
4. Build one simple CLI entry point.
5. Add fixtures before adding complex heuristics.
6. Keep outputs concise and evidence-backed.

Do not start with AI-generated prose analysis. Start with schemas, fixtures, parsers, and deterministic reports.
