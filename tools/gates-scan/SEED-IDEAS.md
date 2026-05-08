# Gates Scan Seed Ideas

## Purpose

`gates-scan` is a read-only mechanical gate linter for AI Tools and similar
GSD planning projects. It reports evidence that gate artifacts are missing,
stale, duplicated, or not observable. It does not decide whether a gate should
be adopted, revised, rejected, superseded, or converted into a cross-repo
request.

## CLI Shape

```bash
gates-scan --project <path> --out <dir>
```

`--out` must be outside the scanned project. The tool emits the standard review
packet artifacts:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

## MVP Checks

- `GATE-REGISTRY-MISSING`
- `GATE-REGISTRY-INVALID-JSON`
- `GATE-DUPLICATE-ID`
- `GATE-REQUIRED-FIELD-MISSING`
- `GATE-OBSERVABLE-OUTPUT-MISSING`
- `GATE-INTEROP-MAPPING-DRIFT`
- `GATE-STAGE-ALIAS-DRIFT`
- `GATE-RESOLUTION-MISSING`
- `GATE-SKIP-NONSKIPPABLE`
- `GATE-SKIP-REASON-MISSING`
- `GATE-DISCUSS-MODE-ROUTING-ONLY`
- `GATE-STALE-PATH`
- `GATE-CHANGELOG-IMPACT-MISSING`
- `GATE-CONFLICTING-WORDING`
- `GATE-UNRESOLVED-REFERENCE`

## Non-Goals

- Do not make semantic gate adoption decisions.
- Do not auto-run during GSD workflows.
- Do not create phases, plans, or cross-repo requests.
- Do not install, run, fetch, pull, or depend on `ai-workspace-kit`.
- Do not mutate the scanned project.
- Do not replace assistant or human review of findings.

