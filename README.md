# AI Tools

AI Tools is a small set of read-only AI development auditors and shared review
packet standards. The project focuses on deterministic, evidence-backed output
that assistants, humans, CI jobs, and GSD workflows can inspect without mutating
target projects.

The current usable capabilities are `contract-drift-auditor` and
`cross-repo-compatibility-checker`. `tools/registry.json` is the
machine-readable capability catalog for implemented, planned, seed-only, and
deferred tools.

## Current Tools

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

For CI or assistant consumers, the auditor also supports
`--format json`, `--quiet`, and `--fail-on blocked|human_review_required|never`.
These flags change CLI projection and shell policy only; `REVIEW-SUMMARY.json`
remains the machine source of truth.

`cross-repo-compatibility-checker` validates cross-repo capability request and
gate registry compatibility between sibling `ai-tools` and `ai-workspace-kit`
checkouts.

Run it from this repository:

```bash
npm run cross-repo-compatibility-checker -- --ai-tools <path> --ai-workspace-kit <path> --out <dir>
```

or directly:

```bash
node tools/cross-repo-compatibility-checker/cli.js --ai-tools <path> --ai-workspace-kit <path> --out <dir>
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

AI Tools commands are review-only.

- Review-only by default.
- No target project mutation.
- No automatic fixes.
- No target command execution.
- No installs or dependency downloads.
- `--out` must be outside the audited target project or outside both checked
  repositories for cross-repo validation.
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

Use `cross-repo-compatibility-checker` when:

- `ai-tools` or `ai-workspace-kit` changes cross-repo request templates,
  decisions, gate registries, or interop docs;
- a phase boundary needs evidence that mirrored requests still share semantic
  `Thread ID` metadata and valid counterpart paths;
- gate registry snake_case/camelCase mapping or stage aliases may have drifted.

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
- `tools/cross-repo-compatibility-checker/README.md` - cross-repo checker
  usage, protocol checks, gate registry checks, and evidence-only boundaries.
- `standards/review-packet/README.md` - shared packet schema and evidence
  semantics.
- `docs/RELEASE-READINESS.md` - first-release checklist and evidence.
- `tools/README.md` and `tools/registry.json` - future tool seed routing,
  intake guidance, maturity, self-use routing, and non-goals.
- `.planning/gates/WORKFLOW-GATES.md` - detailed workflow gate procedures and
  evidence-only boundaries.
- `CHANGELOG.md` - changed contracts, gates, schemas, tool capabilities, and
  compatibility impact.
