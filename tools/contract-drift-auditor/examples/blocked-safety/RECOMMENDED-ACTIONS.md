# Recommended Actions

Status: blocked
Total findings: 1
Required decisions: 0

## act.use-external-out

Owner: tool caller
Human review required: true
Suggested command: node tools/contract-drift-auditor/cli.js --project <path> --out <external-dir>

Choose an output directory outside the audited target project.

Review output must remain outside the audited target so generated evidence cannot pollute the project being audited.
