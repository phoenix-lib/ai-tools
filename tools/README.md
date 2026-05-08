# Tool Seed Ideas

This directory stores product seed ideas for future AI Tools capabilities.
`SEED-IDEAS.md` files are planning references, not implementation contracts.

`tools/registry.json` is the machine-readable capability catalog for current,
planned, seed-only, and deferred AI Tools capabilities. Use it to check owner,
maturity, activation stage, expected outputs, self-use routing, and non-goals
before relying on or promoting a tool.

Before implementing a tool:

1. Read `tools/registry.json` and run the New Tool Intake and Placement Gate.
2. Confirm AI Tools owns the capability, or route boundary work through the
   cross-repo request protocol.
3. Promote the relevant seed ideas into the active phase plan.
4. Keep implementation under `tools/<tool-name>/` and reusable mechanics under
   `shared/`.

Current seeds:

- `ai-workspace-kit-internal-gates`
- `config-matrix-validator`
- `contract-drift-auditor`
- `cross-repo-compatibility-checker`
- `domain-contract-test-generator`
- `local-integration-harness`
- `phase-forensics-tool`
- `project-context-ledger`
- `runtime-capability-inspector`
- `skill-linter`
- `test-quality-auditor`
- `tool-usage-registry`
- `ui-regression-screenshot-comparator`
