# AI Tools

AI Tools is a small set of read-only AI development auditors and shared review
packet standards. The project focuses on deterministic, evidence-backed output
that assistants, humans, CI jobs, and GSD workflows can inspect without mutating
target projects.

The current usable v1 capability is `contract-drift-auditor`.

## Current Tool

`contract-drift-auditor` reviews local assistant contracts against project
evidence. It checks whether guidance such as `AGENTS.md`, `CLAUDE.md`,
planning docs, skills, package scripts, source-layer references, and tool
availability still match local project reality.

Run it from this repository:

```bash
npm run contract-drift-auditor -- --project <path> --out <dir>
```

or directly:

```bash
node tools/contract-drift-auditor/cli.js --project <path> --out <dir>
```

This repository is currently `private: true`; do not assume a published package
or global install path.

## Required Output

Every v1 auditor packet emits:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

`REVIEW-SUMMARY.json` is the machine source of truth. Markdown files are human
projections rendered from the same packet model so status, severity counts,
evidence refs, and recommended actions cannot drift.

## Safety Guarantees

`contract-drift-auditor` is review-only.

- Review-only by default.
- No target project mutation.
- No automatic fixes.
- No target command execution.
- No installs or dependency downloads.
- `--out` must be outside the audited target project.
- Secret-like paths are path-only evidence. Secret contents are not read,
  quoted, hashed into packet output, or rendered into Markdown.
- Generated AI Tools or `ai-workspace-kit` packet directories inside a target
  are ignored as stale review output.

## When to Use

Use `contract-drift-auditor` when:

- assistant guidance may be stale after code, command, skill, or planning
  changes;
- a phase boundary or release readiness check needs evidence about contract
  drift;
- a project has local `AGENTS.md`, `CLAUDE.md`, `.planning`, or skill files that
  downstream agents rely on;
- an optional `ai-workspace-kit` adoption or maintenance review needs external
  drift evidence in a shared packet format.

## When Not to Use

Do not use this auditor as:

- an adoption/bootstrap contract generator;
- an automatic permission approval;
- an auto-fix tool;
- a replacement for human review of findings;
- proof that a command is safe to run;
- a dependency that `ai-workspace-kit` or a target project must install.

## ai-workspace-kit Boundary

`ai-workspace-kit` owns adoption/bootstrap contracts, adapter guidance,
generated local contract policy, permission policy, and assistant-led
gate-review procedure.

AI Tools owns external read-only auditors, shared review packet mechanics,
deterministic evidence checks, and future validators. `ai-workspace-kit` may
recommend or consume AI Tools packet output as optional evidence, but this
repository does not make `ai-workspace-kit` a runtime dependency and does not
run kit workflows automatically.

## Docs

- `tools/contract-drift-auditor/README.md` - auditor-specific usage, checks,
  safety, and output interpretation.
- `standards/review-packet/README.md` - shared packet schema and evidence
  semantics.
- `docs/RELEASE-READINESS.md` - first-release checklist and evidence.
- `tools/README.md` - future tool seed routing and intake guidance.
- `CHANGELOG.md` - changed contracts, gates, schemas, tool capabilities, and
  compatibility impact.
