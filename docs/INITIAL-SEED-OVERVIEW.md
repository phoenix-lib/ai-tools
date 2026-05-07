# AI Tools

Collection of proposed AI development tools and tool contracts related to `ai-workspace-kit`.

The guiding boundary:

- `ai-workspace-kit` owns adoption contracts, review packet shape, permission policy, and guidance for when tools are used.
- External tools own heavier analysis: drift checks, context ledgers, phase forensics, runtime capability probes, config validation, test quality, and UI/integration checks.

Each folder contains a `README.md` with purpose, when to use it, inputs, outputs, MVP implementation, risks, and how it could integrate with `ai-workspace-kit` or GSD.

Recommended build order:

1. `ai-workspace-kit-internal-gates`
2. `ai-review-packet-standard`
3. `contract-drift-auditor`
4. `project-context-ledger`
5. `phase-forensics-tool`

The remaining tools are strong candidates once real projects show repeated need.

