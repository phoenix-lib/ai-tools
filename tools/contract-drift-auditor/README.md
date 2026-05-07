# Contract Drift Auditor

`contract-drift-auditor` is a review-only auditor for AI project contracts. It
compares local assistant guidance against project evidence and emits the shared
AI Tools review packet artifacts.

## Usage

```bash
contract-drift-auditor --project <path> --out <dir>
```

Required output artifacts:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

The JSON summary is the machine source of truth. Markdown files are rendered
from the same packet model so status and counts cannot diverge.

## Safety

- Review-only: no target mutation and no automatic fixes.
- No target command execution: package scripts are read as evidence only.
- No installs or dependency downloads.
- `--out` must be outside the audited target project.
- Secret-like paths are path-only evidence; secret contents are not read,
  quoted, rendered, or hashed into packet output.
- Generated AI Tools or `ai-workspace-kit` packet directories inside a target
  are ignored as stale review output.

## Current Checks

- Missing source-layer or local file references.
- Documented `npm test` and `npm run <script>` commands that are not backed by
  discovered package scripts.
- Missing or invalid local skill references.
- References to absent package managers or tools.
- Unknown project contract facts when no local assistant contract is present.

Findings are evidence for a human or downstream workflow. They are not
permission decisions and they do not rewrite project contracts.

## ai-workspace-kit Compatibility

`ai-workspace-kit` may consume these review packet artifacts as optional
external evidence. This tool does not install, run, or depend on
`ai-workspace-kit`, and `ai-workspace-kit` does not become a dependency of
target projects through this auditor.

The boundary remains:

- AI Tools owns external read-only auditors and review packet mechanics.
- `ai-workspace-kit` owns adoption/bootstrap contracts, adapter guidance, and
  generated local contract review.
