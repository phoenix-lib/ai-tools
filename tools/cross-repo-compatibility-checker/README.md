# Cross-Repo Compatibility Checker

`cross-repo-compatibility-checker` is a review-only validator for the
`ai-tools` and `ai-workspace-kit` cross-repo protocol. It reads both checkouts
and emits the standard AI Tools review packet artifacts.

## Usage

```bash
npm run cross-repo-compatibility-checker -- --ai-tools <path> --ai-workspace-kit <path> --out <dir>
```

or:

```bash
node tools/cross-repo-compatibility-checker/cli.js --ai-tools <path> --ai-workspace-kit <path> --out <dir>
```

`<dir>` must be outside both input repositories.

Required output artifacts:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

`REVIEW-SUMMARY.json` is the machine source of truth. Markdown files are
projections from the same packet model.

## What It Checks

- Cross-repo protocol version metadata.
- Canonical request IDs and `Thread ID` semantic grouping.
- `Origin` and `Mirror required` combinations.
- Mirrored request `Counterpart ID` and repo-qualified `Counterpart path`.
- Decision artifacts for `manual-transfer` requests with
  `Mirror required: false`.
- Machine-local absolute paths in protocol metadata.
- AI Tools snake_case gate registry interop mapping against kit camelCase
  expectations.
- stage aliases such as `verification -> verify`, `release -> phase-boundary`,
  and `replan -> plan`.

## Status Meanings

- `pass`: no compatibility findings.
- `info`: non-blocking observations exist.
- `human_review_required`: compatibility evidence needs assistant or human
  review.
- `blocked`: unsafe output, unreadable required roots, invalid required JSON, or
  malformed input prevents reliable review.

## Boundaries

This checker is evidence-only. It does not decide whether a capability request
should be accepted, planned, rejected, or implemented.

It does not:

- install dependencies;
- run tools or tests in the neighboring repository;
- fetch or pull git remotes;
- write to either input repository;
- mutate `.planning`;
- create phases;
- replace `ai-workspace-kit` as the source of protocol policy;
- implement `gates-scan`.

`ai-workspace-kit` remains responsible for adoption/bootstrap contracts,
adapter guidance, generated contract policy, and assistant-led gate-review
procedure. AI Tools owns this external validator and its review packet output.
