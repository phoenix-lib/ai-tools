# gates-scan

`gates-scan` is an evidence-only mechanical linter for workflow gate artifacts.
It checks deterministic facts and emits review packet evidence for an assistant
or human to review.

It does not decide whether a gate should be adopted, revised, rejected,
superseded, or promoted into another project. Semantic gate review remains
assistant-owned.

## Usage

```bash
gates-scan --project <path> --out <dir>
```

or from this repository:

```bash
npm run gates-scan -- --project <path> --out <dir>
```

`--out` must be outside the scanned project. Mutating flags such as `--fix`,
`--write`, `--pull`, `--fetch`, and `--install` are rejected.

## Output

The tool emits the shared review packet artifacts:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

`REVIEW-SUMMARY.json` is the machine source of truth. Markdown files are human
projections rendered from the same packet model.

## Status Meanings

- `pass`: no mechanical findings.
- `human_review_required`: mechanical gate evidence needs assistant or human
  review.
- `blocked`: the scan could not produce trustworthy evidence, such as invalid
  required JSON or unsafe output path.

## Checks

- missing or invalid gate registry;
- duplicate gate IDs;
- missing required gate fields;
- gates without observable outputs;
- AI Tools to kit interop mapping or stage alias drift;
- missing `## Gate Resolution` sections where an artifact names an applicable
  gate;
- non-skippable gates marked skipped;
- skipped gates missing a required skip reason;
- `workflow.discuss_mode` used as approval evidence for `discuss-mode`;
- stale literal file paths in gate-required artifacts;
- missing changelog gate impact;
- unresolved reference markers;
- mechanically conflicting required/forbidden wording.

## Boundaries

Findings are evidence only. The tool does not approve, reject, revise, or
auto-create gate work. It does not run target project commands, install
dependencies, use `ai-workspace-kit`, or mutate scanned project files.

