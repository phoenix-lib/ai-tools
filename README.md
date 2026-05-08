# AI Tools

AI Tools is a small set of read-only AI development auditors and shared review
packet standards. The project focuses on deterministic, evidence-backed output
that assistants, humans, CI jobs, and GSD workflows can inspect without mutating
target projects.

The current usable capabilities are `contract-drift-auditor`,
`cross-repo-compatibility-checker`, `gates-scan`,
`project-context-ledger`, and `review-packet-rollup`.
`tools/registry.json` is the machine-readable capability catalog for
implemented, planned, seed-only, and deferred tools.

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

`gates-scan` performs evidence-only mechanical checks over local workflow gate
registries, gate resolution blocks, changelog impact notes, referenced paths,
and wording that may need semantic review.

Run it from this repository:

```bash
npm run gates-scan -- --project <path> --out <dir>
```

or directly:

```bash
node tools/gates-scan/cli.js --project <path> --out <dir>
```

`project-context-ledger` records project facts, commands, assistant contracts,
skills, decisions, generated packet exclusions, secret path-only evidence, and
cache source hashes.

Run it from this repository:

```bash
npm run project-context-ledger -- --project <path> --out <dir>
```

or directly:

```bash
node tools/project-context-ledger/cli.js --project <path> --out <dir>
```

`review-packet-rollup` consumes two or more existing review packet directories,
validates their machine artifacts, preserves source findings, and emits one
mechanically grouped packet plus provenance JSON.
It can support later portfolio-wide review after source tools produce packets,
but it does not scan projects, run source tools, or create portfolio manifests.

Run it from this repository:

```bash
npm run review-packet-rollup -- --packets <dir-a> <dir-b> --out <dir>
```

or directly:

```bash
node tools/review-packet-rollup/cli.js --packets <dir-a> <dir-b> --out <dir>
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

Packet consumers may emit additional JSON artifacts for their own mechanical
views. `review-packet-rollup` adds `PACKET-INDEX.json` and
`ROLLUP-GROUPS.json`.

## Safety Guarantees

AI Tools commands are review-only.

- Review-only by default.
- No target project mutation.
- No automatic fixes.
- No target command execution.
- No source tool execution by packet consumers.
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

Use `gates-scan` when:

- workflow gate registry or gate documentation changes need mechanical review;
- a phase boundary needs evidence for missing gate resolution blocks, stale
  paths, duplicate IDs, unresolved references, or missing changelog impact;
- assistant-led gate review would benefit from deterministic evidence while
  keeping semantic adoption decisions with the assistant and reviewer.

Use `project-context-ledger` when:

- project commands, contracts, planning state, skills, or decisions need a
  deterministic evidence ledger before discuss, plan, verify, phase-boundary,
  maintenance, or resume work;
- generated packet directories need to be excluded from source evidence while
  still being recorded as ignored packet inputs;
- downstream agents need cache manifest hashes and confidence-marked facts
  without executing target project commands.

Use `review-packet-rollup` when:

- multiple AI Tools packet outputs need one mechanical review surface;
- a phase boundary needs combined counts and grouped findings by tool, severity,
  status contribution, check id, and source path;
- assistants need provenance across packet directories without running source
  tools or deciding which findings can be ignored.

## When Not to Use

Do not use this auditor as:

- an adoption/bootstrap contract generator;
- an automatic permission approval;
- an auto-fix tool;
- a replacement for human review of findings;
- proof that a command is safe to run;
- a finding suppression, safe-ignore, or review disposition mechanism;
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
- `tools/gates-scan/README.md` - mechanical gate linter usage, checks, packet
  outputs, and evidence-only boundaries.
- `tools/project-context-ledger/README.md` - project ledger usage, outputs,
  secret policy, generated packet exclusions, and non-goals.
- `tools/review-packet-rollup/README.md` - packet rollup usage, provenance,
  grouping, invalid packet behavior, and non-goals.
- `standards/review-packet/README.md` - shared packet schema and evidence
  semantics.
- `docs/RELEASE-READINESS.md` - first-release checklist and evidence.
- `tools/README.md` and `tools/registry.json` - future tool seed routing,
  intake guidance, maturity, self-use routing, and non-goals.
- `.planning/gates/WORKFLOW-GATES.md` - detailed workflow gate procedures and
  evidence-only boundaries.
- `CHANGELOG.md` - changed contracts, gates, schemas, tool capabilities, and
  compatibility impact.
