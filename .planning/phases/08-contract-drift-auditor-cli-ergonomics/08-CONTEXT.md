---
phase: 8
name: Contract Drift Auditor CLI Ergonomics
status: context-complete
created: "2026-05-08"
mode: trusted-self-questioning
requirements:
  - CLI-01
  - CLI-02
depends_on:
  - Phase 6 Release Closeout and Tool Metadata
---

# Phase 8: Contract Drift Auditor CLI Ergonomics - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 8 improves the existing `contract-drift-auditor` CLI for CI and assistant
consumers. It adds stable machine stdout, quiet mode, fail-on policy, and
documented exit codes while preserving the packet artifacts as the source of
truth.

This phase must not change drift detection semantics, add auto-fix behavior,
start `gates-scan`, create the tool registry, or make findings automatic
decisions. It is a CLI ergonomics phase for one existing tool.
</domain>

<decisions>
## Gate Resolution

### Discuss Mode Gate

- Gate: `discuss-mode`
- Status: passed
- Resolution: Trusted Self-Questioning
- Selected by: user
- Approval source: user replied `2` after the Phase 8 discuss-mode prompt on
  2026-05-08.
- Evidence:
  - `.planning/gates/registry.json` records `discuss-mode` as a non-skippable
    discuss-stage gate.
  - `AGENTS.md` states `$gsd-discuss-phase` must resolve Manual Questions vs
    Trusted Self-Questioning before writing discuss artifacts.
  - `workflow.discuss_mode=discuss` is routing only and is not approval
    evidence.
- Cycle limits: one focused self-questioning pass over CLI output, quiet mode,
  fail-on behavior, and docs/tests.
- Skip reason: not skipped.

### Cross-Repo Incoming Review Gate

- Gate: `cross-repo-incoming`
- Status: passed
- Resolution: no incoming request changes Phase 8 scope.
- Evidence:
  - `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md`
  - `.planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md`
  - matching decision artifacts under `.planning/cross-repo/decisions/`
- Reason: the incoming contract-drift-auditor request was satisfied by the
  existing auditor. Phase 8 improves the user-facing CLI around that tool, but
  does not create new cross-repo protocol obligations.

### AI Tools Self-Use Gate

- Gate: `self-use`
- Status: passed with planning-stage follow-up.
- Capabilities considered: `contract-drift-auditor` and
  `cross-repo-compatibility-checker`.
- Resolution: do not run tools during discuss because no implementation,
  protocol, or gate files changed while gathering context. Phase execution
  should run focused CLI tests, full `npm.cmd test`, and a self-audit command
  that exercises the new stdout/fail-on behavior with an external `--out`.
- Note: self-use output remains evidence only.

### Git Baseline Gate

- Gate: `git-baseline`
- Status: passed at discuss start.
- Evidence: `git status --short` returned no active changes before Phase 8
  artifacts were written.

### Changelog and Docs Impact Gate

- Gate: `changelog`
- Status: applies during execution.
- Resolution: Phase 8 must update `CHANGELOG.md`, root usage docs, and the
  auditor README because it changes user-facing CLI behavior and CI semantics.

## Trusted Self-Questioning Results

### What should machine stdout be?

Machine stdout should be an explicit mode, not the default. Add
`--format json` for a compact one-line JSON summary suitable for CI and
assistant consumers. It should include status, counts, generated artifact names,
and output directory. It should not dump full findings or evidence because
`REVIEW-SUMMARY.json` and `EVIDENCE.json` remain the source of truth.

Default stdout may become slightly more useful by printing the final packet
status, following the newer cross-repo checker pattern:

```text
contract-drift-auditor completed: human_review_required.
```

### How should quiet mode behave?

`--quiet` should suppress success chatter in the default human mode. It should
not suppress errors on stderr or help output. If `--format json` is requested,
the JSON line is the requested output and should still be printed even when
`--quiet` is present.

### How should fail-on work?

Add `--fail-on blocked|human_review_required|never`.

- Default: `never`.
- `never`: successful packet generation exits `0` for `pass`, `info`,
  `human_review_required`, and `blocked` packet statuses. CLI usage/safety
  errors still exit `2`.
- `human_review_required`: exit `1` when packet status is
  `human_review_required` or `blocked`.
- `blocked`: exit `1` only when packet status is `blocked`.

This keeps findings evidence-only by default while allowing CI to opt into
stricter policy.

### Should packet status and shell exit code be coupled?

No. Packet status is evidence. Shell exit code is a caller-selected policy.
Default successful packet generation should not fail the shell just because the
auditor found drift.

### Should the CLI use a parser dependency?

No new CLI dependency is needed for Phase 8. The current hand-rolled parser is
small and tested. Add focused validation for the new enum flags and preserve the
existing review-only flag rejections.

## Implementation Decisions

### D-01: Output Modes

Add `--format json` to `contract-drift-auditor`. The only supported values in
Phase 8 should be the default human mode and `json`. Unknown formats should
return usage error code `2`.

### D-02: JSON Stdout Shape

The JSON stdout shape should be compact and deterministic enough for tests:

```json
{
  "status": "human_review_required",
  "counts": {},
  "generated_artifacts": [],
  "out_dir": "<path>"
}
```

The exact key set may be expanded by the planner, but it must stay a summary of
the packet, not a second full packet format.

### D-03: Default Human Stdout

Default success output should remain short and human-readable. Prefer including
packet status in the existing completion line. Do not print findings, evidence,
or recommended actions to stdout by default.

### D-04: Quiet Mode

Add `--quiet`. In human mode, suppress success output. In JSON mode, still emit
the JSON line because the caller explicitly requested machine stdout. Errors and
help remain visible.

### D-05: Fail-On Policy

Add `--fail-on blocked|human_review_required|never`, defaulting to `never`.
Exit code `1` means "packet generated, caller-selected fail policy matched the
packet status." Exit code `2` remains reserved for usage, unsafe output, or
runtime errors that prevent normal CLI completion.

### D-06: Packet Source of Truth

Do not change packet artifact schemas for Phase 8. `REVIEW-SUMMARY.json`
continues to be the machine source of truth; stdout is a convenience projection.

### D-07: Tests

Extend `test/contract-drift-auditor/cli.test.js` with parser and end-to-end CLI
tests for:

- `--format json` success output parses as JSON and matches packet status;
- `--quiet` suppresses default success stdout;
- `--quiet --format json` still emits JSON;
- `--fail-on never` exits `0` for generated packets;
- `--fail-on human_review_required` exits `1` on a human-review fixture;
- `--fail-on blocked` does not fail human-review status but fails blocked status
  if a generated blocked packet status can be exercised;
- invalid enum values exit `2`.

### D-08: Docs

Update `tools/contract-drift-auditor/README.md`, `README.md`, and release docs
where needed. Documentation must state that CI fail policy is opt-in and does
not make findings automatic decisions.

### the agent's Discretion

The planner may choose whether to factor CLI helpers into small pure functions
inside `cli.js` or a neighboring module. Keep the implementation small unless
tests show the parser is becoming hard to reason about.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope

- `.planning/ROADMAP.md` - Phase 8 goal, success criteria, and plan count.
- `.planning/REQUIREMENTS.md` - `CLI-01` and `CLI-02`.
- `.planning/PROJECT.md` - active CLI ergonomics requirement, evidence-only
  defaults, changelog gate, and optional `ai-workspace-kit` integration.
- `.planning/STATE.md` - current milestone position.
- `.planning/phases/04-contract-drift-auditor-mvp/04-CONTEXT.md` - original
  auditor CLI and packet source-of-truth decisions.
- `.planning/phases/06-release-closeout-and-tool-metadata/06-CONTEXT.md` -
  deferred Phase 8 CLI ergonomics boundary and metadata decisions.
- `.planning/phases/07-cross-repo-compatibility-checker-mvp/07-CONTEXT.md` -
  newer CLI status pattern and evidence-only tool behavior.

### CLI and Auditor Code

- `tools/contract-drift-auditor/cli.js` - current parser, stdout, stderr, and
  exit-code behavior.
- `tools/contract-drift-auditor/index.js` - `runAudit` return shape, packet
  status, summary, and artifact output.
- `test/contract-drift-auditor/cli.test.js` - existing CLI parser and shell
  tests to extend.
- `test/contract-drift-auditor/integration.test.js` - auditor packet generation
  fixtures.
- `test/contract-drift-auditor/schema-output.test.js` - generated packet schema
  validation.
- `tools/cross-repo-compatibility-checker/cli.js` - existing status-bearing
  completion line pattern.
- `test/cross-repo-compatibility-checker/cli.test.js` - newer CLI test style.
- `shared/review-packet-renderer.js` - packet projection and count validation.
- `shared/tool-metadata.js` - shared packet constants and tool metadata.
- `package.json` - scripts and bin entries.

### Docs and Standards

- `README.md` - root usage and safety entrypoint.
- `tools/contract-drift-auditor/README.md` - auditor usage, output
  interpretation, status meanings, and limitations.
- `docs/RELEASE-READINESS.md` - release evidence and reusable self-audit
  command guidance.
- `standards/review-packet/README.md` - JSON artifacts as source of truth and
  Markdown/stdout as projections.
- `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md` - CLI behavior, evidence-only
  safety, deterministic output, and artifact consistency principles.
- `CHANGELOG.md` - compatibility impact for downstream freshness checks.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `tools/contract-drift-auditor/index.js`: `runAudit` already returns
  `{ artifacts, discovery, packet, status, outDir }`, which is enough to render
  compact stdout without re-reading generated files.
- `shared/review-packet-renderer.js`: validates packet counts before rendering
  artifacts; stdout should reuse the same summary result instead of recomputing
  status or counts.
- `tools/cross-repo-compatibility-checker/cli.js`: already prints
  `completed: <status>` and rejects mutating flags, providing a nearby CLI
  consistency pattern.

### Established Patterns

- CLIs are CommonJS, dependency-light, review-only, and tested with
  `node:test`.
- Unsafe output and usage errors return code `2`.
- Packet artifacts are the durable machine contract. CLI stdout is a projection
  for humans, CI, or assistants.
- Findings are evidence; policy decisions stay with the caller or assistant.

### Integration Points

- `parseArgs` in `tools/contract-drift-auditor/cli.js` is the main entry for
  `--format`, `--quiet`, and `--fail-on`.
- `main` in the same file should translate packet status plus fail policy into
  stdout and exit code.
- Existing tests use in-memory stdout/stderr adapters; extend that pattern for
  JSON and quiet output.
- Docs validation may need updates if release docs are expected to mention new
  CLI flags.
</code_context>

<specifics>
## Specific Ideas

Preferred command examples after Phase 8:

```bash
node tools/contract-drift-auditor/cli.js --project . --out <external-dir> --format json
node tools/contract-drift-auditor/cli.js --project . --out <external-dir> --quiet
node tools/contract-drift-auditor/cli.js --project . --out <external-dir> --fail-on human_review_required
```

The JSON stdout should be intentionally small. Consumers that need finding
details must read `REVIEW-SUMMARY.json` and `EVIDENCE.json` from `--out`.
</specifics>

<deferred>
## Deferred Ideas

- `gates-scan` and `GATELINT-01` remain Phase 10.
- Tool registry and AGENTS gate-policy slimming remain Phase 9.
- Applying the same `--format`, `--quiet`, and `--fail-on` interface to
  `cross-repo-compatibility-checker` is a future consistency improvement, not
  required for Phase 8.
- Auto-fix behavior remains out of scope.
</deferred>

---

*Phase: 8-Contract Drift Auditor CLI Ergonomics*
*Context gathered: 2026-05-08*
