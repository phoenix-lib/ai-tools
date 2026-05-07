# Cross-Repo Capability Requests

This playbook defines how AI Tools and `ai-workspace-kit` ask each other for
missing capabilities without mixing ownership, creating hidden dependencies, or
turning requests into automatic work.

## Gate Resolution

Every major GSD artifact created after Phase 3 must include a `Gate Resolution`
section when a registered gate applies. The machine-readable source for gate
IDs, stages, required artifacts, observable outputs, and skip behavior is
`.planning/gates/registry.json`.

If a gate does not apply, record why. If a gate is skipped, record the skip
reason. A non-skippable gate cannot be silently skipped.

## Why This Exists

AI Tools and `ai-workspace-kit` are designed to work in tandem:

- `ai-workspace-kit` provides adoption/bootstrap contracts, adapter guidance,
  generated contract policy, permission policy, and assistant-led review
  procedures.
- AI Tools provides external read-only auditors, deterministic evidence
  collectors, review packet mechanics, validators, runtime probes, drift
  checks, quality auditors, and optional integration harnesses.

The request protocol prevents either repository from silently rebuilding the
other repository's responsibilities under a generic "review" or "gate" name.

## Directory Structure

```text
.planning/cross-repo/
  inbox/
  outbox/
  decisions/
  templates/
```

- `inbox/`: requests received from the neighboring repository.
- `outbox/`: requests AI Tools sends to the neighboring repository.
- `decisions/`: accepted, rejected, deferred, planned, superseded, or stale
  outcomes for requests.
- `templates/`: canonical request and decision templates.

## Naming

Requests:

```text
REQ-YYYYMMDD-<from>-to-<to>-<slug>.md
```

Every request must include `Protocol version: 1.0`, `Canonical ID`,
`Thread ID`, `Origin`, `Mirror required`, `Counterpart ID`, `Counterpart path`,
and `Legacy ID`. `Thread ID` is the cross-repository semantic request
identifier; mirrored records for the same need must share it even when
`Canonical ID` or filenames differ.

Allowed origins:

- `mirrored`: a request record mirrored in both repositories.
- `manual-transfer`: a request transferred manually without a neighboring
  protocol artifact.
- `local-created`: a local request that is not yet sent or mirrored.

If `Mirror required` is `true`, `Counterpart ID` and `Counterpart path` must not
be `none`. If `Mirror required` is `false`, `Counterpart ID` and
`Counterpart path` may be `none`, but a decision artifact must exist before an
automated cross-repo validator treats the request as resolved.

If a neighboring repository still has a legacy filename or ID, record it in
`Legacy ID` and record a repo-qualified relative path such as
`ai-workspace-kit/.planning/cross-repo/...` in `Counterpart path` so validators
do not count the same request twice. Do not use machine-local absolute paths.

Decisions:

```text
DEC-<request-id>.md
```

Use stable slugs. Do not rename requests after other artifacts reference their
IDs unless the decision explicitly supersedes the old request.

## Machine Compatibility

AI Tools keeps `.planning/gates/registry.json` in an AI Tools-local snake_case
format. It is not directly valid against the current `ai-workspace-kit`
`gate-registry.schema.json` camelCase contract.

Cross-repo consumers must treat the registry as an AI Tools-specific source and
use the registry `interop` mapping when comparing it to kit contracts:

- `schema_version` maps to `schemaVersion`;
- `required_artifacts` maps to `requiredArtifacts`;
- `required_fields` maps to `requiredFields`;
- `observable_outputs` maps to `observableOutputs`;
- `skip_allowed` maps to `skipAllowed`;
- `skip_reason_required` maps to `skipReasonRequired`;
- `automation_boundary` maps to `automationBoundary`.

Stage names are also mapped, not assumed identical. AI Tools `verification`
maps to kit `verify`; AI Tools `release` maps to kit `phase-boundary`; AI Tools
`replan` maps to kit `plan`. `adoption-review` remains kit-owned.

## Ownership Boundaries

Short form: `ai-workspace-kit owns` adoption/bootstrap infrastructure and
generated assistant contract semantics. `AI Tools owns` external read-only
auditors, deterministic evidence tools, and review-packet-compatible outputs.

| Area | Owner | Notes |
|------|-------|-------|
| Adoption/bootstrap contracts | `ai-workspace-kit` | Do not rebuild in AI Tools. |
| Adapter guidance and generated project-local guidance | `ai-workspace-kit` | AI Tools may request interop contracts but should not generate adapters. |
| Permission policy | `ai-workspace-kit` | AI Tools may audit drift or report evidence, not grant permissions. |
| Generated contract review and merge routing | `ai-workspace-kit` | AI Tools can emit compatible evidence packets for external checks. |
| Stable review packet compatibility notes | Shared boundary | Use requests and decisions to coordinate semantics. |
| External read-only auditors | AI Tools | Examples: contract drift, config matrix, test quality, runtime capability, visual regression, integration harnesses. |
| Mechanical evidence linters | AI Tools, when deliberately promoted | Output is evidence only; semantic gate decisions remain assistant-owned. |

## When To Create A Request

Create a request when:

- AI Tools needs a stable interop contract owned by `ai-workspace-kit`;
- `ai-workspace-kit` needs an external auditor or evidence packet capability
  owned by AI Tools;
- a gate or tool idea is at an unclear boundary and needs a recorded decision;
- a changelog or upstream freshness review exposes a compatibility change that
  affects the neighboring repository;
- implementation would otherwise duplicate the other repository's product
  responsibility.

Requests are not automatic obligations. They are decision inputs.

## When To Reject Or Defer A Request

Reject a request when:

- it asks AI Tools to implement adoption/bootstrap, adapter generation,
  generated-contract merge routing, or permission policy;
- it asks `ai-workspace-kit` to implement heavy external auditors or runtime
  probes;
- it requires automatic installation, automatic tool execution, copied
  `.planning` state, or a required repo dependency;
- it lacks evidence, expected output, boundary classification, or acceptance
  criteria after clarification.

Defer a request when:

- the need is valid but not part of the current milestone;
- the required protocol exists but the tool capability is v2+;
- upstream or downstream semantics are still changing and would make immediate
  implementation brittle.

Use `stale` when the request no longer matches current project facts. Use
`superseded` when a newer request replaces it.

## Outgoing Need Gate

Run this gate during research and planning.

Question:

```text
Are we about to implement functionality that belongs to the neighboring repo?
```

If yes:

1. Do not implement the capability locally.
2. Create a request in `.planning/cross-repo/outbox/`.
3. Record the request in the active `Gate Resolution`.
4. Continue only with AI Tools-owned compatibility or external-auditor work.

If no:

1. Record the ownership classification.
2. Record why no outgoing request is needed.

## Incoming Review Gate

Run this gate during discuss, maintenance, and phase-boundary work. Also run it
during research/planning when an inbox item is already known.

Question:

```text
Are there incoming requests that affect this roadmap, gate registry, protocol,
or compatibility contract?
```

If yes:

1. Read the request.
2. Classify the boundary.
3. Create or update a decision artifact.
4. Record whether scope is accepted, rejected, planned, deferred, superseded,
   or stale.

Incoming requests do not automatically create phases. They do not automatically
run tools, install dependencies, copy `.planning`, or change the roadmap.

## Changelog And Freshness

AI Tools maintains `CHANGELOG.md` after completed phases, executed major plans,
and workflow gate changes. Entries should cover changed contracts, changed
gates, changed schemas, changed review packet semantics, changed tool
capabilities, validation, compatibility impact for `ai-workspace-kit`, breaking
or potentially breaking changes, migration notes, and upstream impact.

When AI Tools checks `ai-workspace-kit` freshness:

1. Check local path, remote, branch, commit, and dirty status.
2. Fetch or update only when explicitly permitted.
3. If commits changed, read upstream changelog/release notes first when that
   artifact exists and changed.
4. If no upstream changelog exists, record the absence and review commit log
   plus changed contracts/schemas/docs directly.
5. Treat upstream changes as evidence and design input, not automatic authority.

When `ai-workspace-kit` checks AI Tools freshness, it should follow the same
principle: read AI Tools changelog first, then inspect changed
contracts/schemas/docs directly when the changelog is missing, stale, or
incomplete.

## Gate Review

Assistant-owned semantic review decides whether a gate is:

- relevant to the current phase;
- conflicting with other gates;
- duplicated across repositories;
- stale relative to current workflow;
- causing hidden automation or dependency creep;
- ready to adopt, revise, defer, reject, or convert to a capability request.

Future mechanical gate-linter support may check missing gate blocks, duplicate
gate IDs, stale file paths, missing source layers, missing changelog entries,
conflicting required/forbidden wording, unresolved references, and gates without
observable artifact output.

Mechanical output is evidence only. It is not the final decision.

## Preventing Endless Task Exchange

- Every request needs `Decision Needed` and `Review / Expiry`.
- Every non-trivial request needs a decision artifact.
- A decision must separate accepted, rejected, and deferred scope.
- Stale or superseded requests should be closed explicitly.
- Do not create a new request just to avoid making a decision on an old one.
- Do not create roadmap phases from requests without a separate roadmap update.

## Non-Goals

- Do not make either repository depend on the other at runtime.
- Do not auto-run tools from the neighboring repository.
- Do not auto-create phases from incoming requests.
- Do not copy `.planning` state between repositories.
- Do not implement `ai-workspace-kit` adoption/bootstrap behavior in AI Tools.
- Do not implement heavy AI Tools auditors inside `ai-workspace-kit`.
- Do not treat a changelog entry as automatic approval to consume a changed
  capability.

## GSD Stage Mapping

| Stage | Required Review |
|-------|-----------------|
| Discuss | Resolve discuss mode, check incoming requests when relevant, record self-use skip/run reason. |
| Research | Run upstream freshness, outgoing need, incoming review when known, self-use, and new-tool intake gates. |
| Plan | Record gate resolution in PLAN.md and convert boundary needs into requests. |
| Execute | Update changelog for gate/protocol changes and run applicable self-use tools. |
| Verify | Treat mechanical validation as evidence; assistant verifies semantic boundaries. |
| Phase boundary | Review incoming requests, changelog, git baseline, self-use, and future gate-review hook. |
| Release/maintenance | Run future `ai-workspace-kit` gate review when available; otherwise perform manual semantic review. |

## Decision Principle

A request is not an automatic obligation. It becomes actionable only after a
human or assistant-owned decision artifact records the accepted scope, rejected
scope, follow-up, compatibility notes, and target phase when applicable.
