---
phase: 11
researched: "2026-05-08"
status: complete
---

# Phase 11 Research: v2 Tool Selection Review

## Gate Resolution

### Research Gate

- **Status:** resolved
- **Resolution:** Research first
- **Selected by:** user
- **Evidence:** user replied `1` after the Phase 11 research prompt.

### Skill Gate

- **Status:** resolved
- **Resolution:** `$gsd-plan-phase` applies. Phase 11 planning is performed
  inline because subagents were not explicitly requested.
- **Evidence:** `11-CONTEXT.md`, roadmap Phase 11, requirements
  `LEDGER-01`, `FORENSICS-01`, `CONFIG-01`, `SKILL-01`, `TESTQA-01`, and
  `UIREG-01`.
- **Skill changes needed:** none during planning.

### Upstream Freshness Gate

- **Status:** passed
- **Resolution:** embedded `ai-workspace-kit` was updated from `e225f77` to
  `b5903a4`; changed upstream source layers were reviewed.
- **Evidence:** `11-UPSTREAM-UPDATE-REVIEW.md`.

### New Tool Intake and Placement Gate

- **Status:** passed for planning
- **Resolution:** `project-context-ledger` is the only candidate with enough
  current evidence to promote from `deferred` to `planned`. Promotion is
  planning metadata only; implementation is out of Phase 11 scope.
- **Evidence:** `tools/registry.json`, `docs/INITIAL-SEED-OVERVIEW.md`,
  `docs/AI-AGENT-IMPLEMENTATION-GUIDE.md`,
  `tools/project-context-ledger/SEED-IDEAS.md`, and `11-CONTEXT.md`.

### Cross-Repo Outgoing Need Gate

- **Status:** skipped with reason
- **Reason:** no Phase 11 behavior belongs to `ai-workspace-kit`; the ledger is
  AI Tools-owned external evidence and remains optional.
- **Evidence:** `AI-TOOLS-INTEROP.md` in the embedded kit and local
  `AGENTS.md` tandem boundary.

## Research Question

What does Phase 11 need to plan so the next v2 tool is selected from evidence,
without starting several broad auditors or implementing the selected tool too
early?

## Findings

### F-01: The Current Registry Already Has The Right Promotion Surface

`tools/registry.json` records owner, destination, maturity, activation stage,
expected outputs, self-use, use gate, evidence refs, and non-goals for every
seed. `project-context-ledger` is still `deferred`, has no package bin, and is
not exposed in `package.json`.

Planning implication: Phase 11 should promote the registry entry to
`planned`, add the selection review as evidence, keep package metadata absent,
and make the future outputs more specific. It should not add CLI files.

### F-02: Ledger Has The Strongest Current Evidence

The original build order lists `project-context-ledger` after the packet
standard and contract drift auditor. The implementation guide says the ledger
reduces repeated context loading with `FACTS`, `COMMANDS`, `CONTRACTS`,
`SKILLS`, `DECISIONS`, `EVIDENCE`, and `CACHE-MANIFEST` files. Phase 4 through
Phase 10 repeatedly needed broad reads of the same project contracts, command
facts, packet outputs, changelog entries, and planning state.

Planning implication: the selection review should promote the ledger as
verified project memory with evidence refs, not as a source-code replacement or
automatic workflow dependency.

### F-03: Phase Forensics Is Strong But Should Follow Failure Evidence

`phase-forensics-tool` is designed for failed execution, surprising review
results, user correction, or rollback. Recent phases produced validation and
self-use evidence, but not repeated failed-phase evidence.

Planning implication: keep forensics deferred with explicit trigger evidence.
The future ledger can become a useful substrate for forensics later.

### F-04: Other Deferred Seeds Lack Current Trigger Evidence

Config, skill, test-quality, UI, runtime, integration, and domain tools all
have plausible future value, but each depends on a specific repeated pain that
is not present in this repository now: config-heavy environments, project-local
skill publishing, shallow-test misses, frontend surfaces, hardware/runtime
services, heavier integration flows, or stable domain contract formats.

Planning implication: Phase 11 should preserve these seeds and trigger
conditions instead of promoting them or removing them.

### F-05: Future Ledger MVP Must Stay Packet-Compatible And Read-Only

The ledger seed and implementation guide agree on review-only behavior,
path-only secret handling, unresolved/stale facts, and packet-compatible
outputs. Existing shared helpers already cover output isolation, ignore policy,
secret policy, canonical JSON, review packet rendering, and fixture tree
hashing.

Planning implication: Phase 11 should define the future MVP contract in
`11-SELECTION-REVIEW.md`, update registry metadata, and add tests that prevent
accidental package-bin exposure or multiple simultaneous promotions.

### F-06: A Future Phase Entry Is Cleaner Than Pretending Phase 11 Implements LEDGER-01

`LEDGER-01` says users can scan a project into a verified context ledger. Phase
11 only selects and scopes the next tool. Marking `LEDGER-01` complete in
Phase 11 would be inaccurate.

Planning implication: execution should add a future roadmap phase for the
ledger MVP, leave non-selected requirements deferred, and keep Phase 11
success tied to selection artifacts and metadata truth.

## Recommended Plan Shape

Use one Phase 11 plan:

1. Create `11-SELECTION-REVIEW.md` with the evidence matrix, selected candidate,
   future ledger contract, non-selected reasons, gate resolution, and
   validation expectations.
2. Update `tools/registry.json` so only `project-context-ledger` is `planned`;
   no package bin or CLI exists.
3. Add focused planning tests that enforce one promoted deferred seed and no
   package exposure.
4. Update roadmap, requirements, state, and changelog so Phase 12 can implement
   the ledger MVP and downstream freshness checks have current evidence.
5. Run focused tests, full tests, and relevant self-use packets during
   execution.

## Non-Goals

- Do not implement `project-context-ledger`.
- Do not add a package bin, package script, CLI file, fixture output, or
  generated ledger artifact.
- Do not promote more than one deferred candidate.
- Do not remove deferred seeds.
- Do not add a kit dependency or copy upstream `.planning` state.
- Do not add package-manager, dependency lifecycle, vulnerability, abandoned
  package, runtime, UI, integration, or domain-contract functionality.

## RESEARCH COMPLETE

