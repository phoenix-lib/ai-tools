---
phase: 8
name: Contract Drift Auditor CLI Ergonomics
status: research-complete
created: "2026-05-08"
requirements:
  - CLI-01
  - CLI-02
---

# Phase 8 Research: Contract Drift Auditor CLI Ergonomics

## Gate Resolution

### Research Gate
- **Status:** Resolved
- **Registry id:** research
- **Stage:** plan
- **Resolution:** User selected research first.
- **Selected by:** user
- **Evidence:** User replied `1` to the Phase 8 research prompt.
- **Reason:** CLI stdout, quiet, fail-on, and exit-code behavior affect CI and
  assistant consumers.

### Upstream Freshness Gate
- **Status:** Resolved
- **Registry id:** upstream-freshness
- **Stage:** plan
- **Resolution:** `.external/ai-workspace-kit` fast-forwarded from
  `2079ab9626e9f9ed256512091f9c5ea473582885` to
  `7bc432cce309178bdbcdf5715af6f6187c7ee568`.
- **Evidence:** `.planning/research/AI-WORKSPACE-KIT-UPSTREAM-REVIEW.md`;
  upstream `CHANGELOG.md`; `AI-WORKSPACE-CONTRACT.json`;
  `AI-TOOLS-INTEROP.md`; `examples/ai-tools-review-packet/REVIEW-SUMMARY.json`.
- **Reason:** Phase planning depends on current kit packet compatibility
  guidance.

### Cross-Repo Incoming Review Gate
- **Status:** Resolved
- **Registry id:** cross-repo-incoming
- **Stage:** plan
- **Resolution:** Existing incoming requests do not alter Phase 8 scope.
- **Evidence:** `.planning/cross-repo/inbox/` and
  `.planning/cross-repo/decisions/`.
- **Reason:** Phase 8 improves an existing AI Tools-owned auditor CLI and does
  not create a new cross-repo request.

### Cross-Repo Outgoing Need Gate
- **Status:** Skipped
- **Registry id:** cross-repo-outgoing
- **Stage:** plan
- **Resolution:** No outgoing request needed.
- **Evidence:** Phase 8 changes CLI projections and exit policy in AI Tools.
- **Reason:** The work is AI Tools-owned and does not require kit-owned
  adoption/bootstrap or protocol changes.

### AI Tools Self-Use Gate
- **Status:** Resolved
- **Registry id:** self-use
- **Stage:** plan
- **Resolution:** Ran the validated cross-repo checker after the upstream kit
  update.
- **Evidence:** `C:\Users\suppo\.codex\memories\ai-tools-cross-repo-check-phase08-plan\REVIEW-SUMMARY.json`.
- **Reason:** Upstream kit changed interop artifacts.

## Research Question

What does Phase 8 need to know to plan CLI ergonomics safely without changing
the review packet contract?

## Current Implementation

`tools/contract-drift-auditor/cli.js` is intentionally small:

- hand-rolled `parseArgs`;
- required `--project` and `--out`;
- `--help`;
- rejects `--fix` and `--write`;
- runs `runAudit`;
- prints `contract-drift-auditor completed.`;
- returns `0` on success and `2` for usage/runtime/safety errors.

`tools/contract-drift-auditor/index.js` already returns enough data for richer
CLI output:

- `status`;
- `outDir`;
- `artifacts`;
- `packet.summary.counts`;
- generated artifact names.

The cross-repo checker already prints `completed: <status>`, which is a useful
local consistency pattern.

## Recommended CLI Contract

### Output Modes

Add `--format json` as the only explicit machine stdout mode in Phase 8.

Default remains human-readable. JSON mode prints one compact JSON object to
stdout. It should not duplicate the full review packet. Consumers that need
findings or evidence should read packet files from `--out`.

Recommended JSON stdout fields:

- `status`;
- `counts`;
- `generated_artifacts`;
- `out_dir`.

Use the same packet summary produced by `runAudit`; do not recompute counts in
the CLI.

### Quiet Mode

Add `--quiet` to suppress default success chatter. Do not suppress:

- help output;
- error output on stderr;
- explicit `--format json` output.

This makes `--quiet --format json` valid and useful.

### Fail-On Policy

Add `--fail-on blocked|human_review_required|never`.

Recommended semantics:

| Value | Exit 1 when packet status is | Default |
|-------|------------------------------|---------|
| `never` | never for generated packets | yes |
| `blocked` | `blocked` | no |
| `human_review_required` | `human_review_required` or `blocked` | no |

Exit code meanings:

- `0`: CLI completed and generated packet artifacts; fail policy did not match.
- `1`: CLI completed and generated packet artifacts; caller-selected fail
  policy matched the packet status.
- `2`: usage error, unsafe output, unknown argument, invalid enum, or runtime
  failure prevented normal completion.

This preserves the evidence-only default while allowing CI to opt into stricter
behavior.

## Implementation Shape

Keep the parser dependency-free. Small helper functions are enough:

- `parseArgs(argv)` extends existing parser with `format`, `quiet`, and
  `failOn`;
- `renderMachineStdout(result)` returns compact JSON plus newline;
- `shouldFailForStatus(status, failOn)` returns boolean;
- `main` translates the result into stdout/stderr and exit code.

Avoid adding a generic CLI framework unless later phases add enough repeated
CLI surface to justify it.

## Test Strategy

Extend `test/contract-drift-auditor/cli.test.js` first. Cover:

- parser defaults;
- valid and invalid `--format`;
- valid and invalid `--fail-on`;
- `--quiet` success output suppression;
- `--format json` parses and reports packet status/counts;
- `--quiet --format json` still prints JSON;
- `--fail-on never` returns `0` for human-review packet status;
- `--fail-on human_review_required` returns `1` for human-review packet status;
- `--fail-on blocked` does not fail human-review packet status;
- usage/safety errors remain `2`.

If blocked status cannot be generated through a real safe run, test
`shouldFailForStatus("blocked", "blocked")` as a pure helper rather than
weakening output safety to produce a blocked packet.

## Documentation Impact

Update:

- `tools/contract-drift-auditor/README.md` with new flags, exit codes, and CI
  examples;
- root `README.md` only if usage examples should expose `--format json`;
- `docs/RELEASE-READINESS.md` if self-audit or CI guidance changes;
- `CHANGELOG.md` with changed CLI behavior, validation, compatibility impact,
  and migration notes.

Docs must say:

- packet files remain the source of truth;
- stdout JSON is a projection;
- `--fail-on` is opt-in;
- default findings are evidence, not automatic failure decisions.

## Upstream Kit Compatibility

The updated kit now includes:

- `AI-WORKSPACE-CONTRACT.json`;
- `data/protocol-versions.json`;
- static `examples/ai-tools-review-packet/`;
- `AI-TOOLS-INTEROP.md` compatibility rules.

Implications:

- Preserve the existing packet artifact names and `review-packet/v1`.
- Do not make `ai-workspace-kit` a runtime dependency.
- Do not add kit-specific stdout fields.
- Do not treat kit's static fixture as an executable contract or runner.

## Risks

| Risk | Mitigation |
|------|------------|
| CLI JSON becomes a second packet contract | Keep JSON stdout compact and point consumers to `REVIEW-SUMMARY.json`. |
| Default exit behavior starts breaking users | Default `--fail-on never`; document opt-in CI policy. |
| `--quiet` hides important failures | Never suppress stderr or help output. |
| Blocked status test weakens safety | Test fail policy as a pure helper if no safe blocked packet fixture exists. |
| Docs imply automatic decisions | State that packet status is evidence and shell failure is caller policy. |

## Planning Recommendation

Plan Phase 8 as two slices:

1. Add parser, stdout, quiet, fail-on helpers and CLI tests.
2. Update docs, changelog, release/self-use guidance, run final validation, and
   record self-audit evidence for the new CLI behavior.

## RESEARCH COMPLETE
