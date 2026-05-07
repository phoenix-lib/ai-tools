# Cross-Repo Compatibility Checker

## Classification

external read-only validator, v2 candidate

## Purpose

Validates that sibling `ai-tools` and `ai-workspace-kit` checkouts can exchange
cross-repo capability requests without ambiguous semantic threads, broken
counterpart links, machine-local paths, or hidden automation creep.

## When To Use

- Before introducing automatic cross-repo indexers.
- Before promoting mechanical gate-linter automation.
- During release readiness after cross-repo protocol changes.
- During maintenance when either repository changes request templates,
  decision templates, gate registries, or interop docs.

## Inputs

- Path to the `ai-tools` checkout.
- Path to the `ai-workspace-kit` checkout.
- `.planning/cross-repo/` request, decision, and template artifacts.
- Gate registry artifacts and documented interop mappings.
- Optional changelog entries as planning evidence.

## Outputs

- `REVIEW-SUMMARY.json`
- `FINDINGS.md`
- `EVIDENCE.json`
- optional `RECOMMENDED-ACTIONS.md`

## MVP Checks

- Group request and decision artifacts by `Thread ID`.
- Validate `Protocol version: 1.0` on requests and decisions.
- Validate canonical request ID and thread ID formats.
- Validate reciprocal `Counterpart ID` and repo-qualified `Counterpart path`
  when `Mirror required: true`.
- Validate `Origin` and `Mirror required` combinations.
- Require a decision artifact for `manual-transfer` requests with
  `Mirror required: false`.
- Reject machine-local absolute paths in protocol artifacts.
- Compare AI Tools snake_case gate registry metadata against kit camelCase
  schema expectations through the documented interop mapping.
- Report stage alias drift, including `verification -> verify`,
  `release -> phase-boundary`, and `replan -> plan`.

## Non-Goals

- Do not install dependencies in either repository.
- Do not run tools from the neighboring repository.
- Do not mutate `.planning` artifacts.
- Do not auto-create phases from incoming requests.
- Do not decide whether a capability should be accepted. Findings are evidence
  for assistant or human review.
- Do not replace `ai-workspace-kit` as the protocol policy source.

## Integration With ai-workspace-kit

`ai-workspace-kit` remains the source of protocol policy and examples. This
checker consumes those artifacts as read-only evidence and reports compatibility
findings in the AI Tools review packet format.

## First Test Fixture

Use two small fixture repositories with:

- one fully mirrored request;
- one request with different canonical IDs but shared `Thread ID`;
- one `manual-transfer` request with `Mirror required: false` and a decision;
- one intentionally broken counterpart path;
- one gate registry casing/stage alias mismatch.
