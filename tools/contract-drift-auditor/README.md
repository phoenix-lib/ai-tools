# Contract Drift Auditor

`contract-drift-auditor` is a review-only auditor for AI project contracts. It
compares local assistant guidance against project evidence and emits the shared
AI Tools review packet artifacts.

## Usage

```bash
npm run contract-drift-auditor -- --project <path> --out <dir>
```

or:

```bash
node tools/contract-drift-auditor/cli.js --project <path> --out <dir>
```

Required output artifacts:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

The JSON summary is the machine source of truth. Markdown files are rendered
from the same packet model so status and counts cannot diverge.

## When to Use

Use `contract-drift-auditor` when local assistant guidance may be stale against
project evidence:

- before release readiness or maintenance review;
- after changing package scripts, source layers, project skills, planning docs,
  or assistant contracts;
- when a human reviewer or downstream workflow needs a shared packet with
  evidence refs and recommended actions;
- when `ai-workspace-kit` needs optional external drift evidence without
  embedding the auditor in adoption/bootstrap behavior.

## When Not to Use

Do not use this auditor as:

- an auto-fix or contract rewrite tool;
- an adoption/bootstrap generator;
- a permission decision engine;
- proof that a referenced command is safe to run;
- a replacement for human judgment on findings;
- a required dependency for `ai-workspace-kit` or target projects.

## Safety

- Review-only: no target mutation and no automatic fixes.
- No target command execution: package scripts are read as evidence only.
- No installs or dependency downloads.
- `--out` must be outside the audited target project.
- Secret-like paths are path-only evidence; secret contents are not read,
  quoted, rendered, or hashed into packet output.
- Generated AI Tools or `ai-workspace-kit` packet directories inside a target
  are ignored as stale review output.

## Output Interpretation

`REVIEW-SUMMARY.json` is the machine source of truth for packet status, counts,
findings, blockers, decisions, generated files, and tool metadata.
`FINDINGS.md` and `RECOMMENDED-ACTIONS.md` are human projections from the same
summary model.

Packet status and finding severity are separate:

- `pass`: no findings require attention.
- `info`: informational findings exist.
- `human_review_required`: evidence exists, but a human decision is needed.
- `blocked`: packet output is unsafe or incomplete for downstream use.

### Severity

Finding severity describes one issue:

- `critical`: severe correctness, safety, or security risk.
- `high`: important issue that should be resolved before relying on the
  contract.
- `medium`: material drift or weakness with clear remediation.
- `low`: minor issue, cleanup, or weak signal.
- `info`: observation with no required fix.

### Confidence

Confidence describes the evidence:

- `verified`: confirmed from readable local evidence.
- `inferred`: supported by evidence, but not directly proven.
- `unknown`: required fact was unavailable and must not be invented.
- `stale`: evidence exists but appears outdated.

Unknown and stale facts are first-class data. Recommended actions are guidance
only; they are not patches, permission grants, or automatic apply instructions.
In short, recommended actions are guidance only.

## Current Checks

- Missing source-layer or local file references.
- Documented `npm test` and `npm run <script>` commands that are not backed by
  discovered package scripts.
- Missing or invalid local skill references.
- References to absent package managers or tools.
- Unknown project contract facts when no local assistant contract is present.

Findings are evidence for a human or downstream workflow. They are not
permission decisions and they do not rewrite project contracts.

## Current Limitations

- The MVP is deterministic and fixture-backed, but it uses conservative text parsing
  and can still report low-severity caveats from optional, example, or shorthand
  references in current contract/planning docs.
- Historical `.planning/phases/**` artifacts and nested fixture contracts are
  excluded from current self-audit source documents by default, so old phase
  evidence should not dominate current self-audit results.
- It does not execute target commands to prove runtime behavior.
- It does not decide whether a local contract or filesystem reference is
  authoritative; it reports evidence for review.
- It does not implement cross-repo validation or mechanical gate linting.

## ai-workspace-kit Compatibility

`ai-workspace-kit` may consume these review packet artifacts as optional
external evidence. This optional external evidence does not install, run, or depend on
`ai-workspace-kit`, and `ai-workspace-kit` does not become a dependency of
target projects through this auditor.

The boundary remains:

- AI Tools owns external read-only auditors and review packet mechanics.
- `ai-workspace-kit` owns adoption/bootstrap contracts, adapter guidance, and
  generated local contract review.
