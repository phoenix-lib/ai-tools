---
phase: 12
status: complete
researched: 2026-05-08
requirement: LEDGER-01
---

# Phase 12 Research: Project Context Ledger MVP

## Research Question

What needs to be known to plan a read-only `project-context-ledger` tool that
scans a target project into verified facts, commands, contracts, skills,
decisions, evidence, and cache manifest artifacts without mutating the target?

## Gate Resolution

### Research Gate

- **Status:** passed
- **Resolution:** research first
- **Selected by:** user
- **Evidence:** user replied `1` after the Phase 12 research prompt.

### Upstream Freshness Gate

- **Status:** resolved
- **Evidence:** `12-UPSTREAM-UPDATE-REVIEW.md`
- **Impact:** upstream was updated from `b5903a4` to `bbb009a`. Phase 12 must
  keep update-impact and dependency lifecycle review semantic only: no package
  manager runner, dependency scanner, automatic permission grant, or hidden
  `ai-workspace-kit` runtime dependency.

### New Tool Intake and Placement Gate

- **Status:** resolved from Phase 11
- **Evidence:** `11-SELECTION-REVIEW.md` and `tools/registry.json`
- **Impact:** `project-context-ledger` is AI Tools-owned, planned for
  `tools/project-context-ledger/`, and should emit shared packet artifacts plus
  ledger-specific JSON files.

### Cross-Repo Outgoing Need Gate

- **Status:** skipped with reason
- **Reason:** this phase implements an AI Tools-owned optional auditor. No
  kit-owned adoption/bootstrap/generated-contract behavior is needed.

### AI Tools Self-Use Gate

- **Status:** applies during execution and verification
- **Impact:** after implementation, run the new ledger against this repository
  with external output. Also run `gates-scan` and `contract-drift-auditor` as
  applicable evidence because package metadata, docs, registry, changelog, and
  phase artifacts will change.

## Existing Patterns To Reuse

### CLI And Runner Shape

Existing packet-producing tools use CommonJS modules with this split:

- `cli.js` parses arguments, shows `--help`, rejects unsupported/mutating
  flags, validates required paths, calls the runner, and prints compact human
  status.
- `index.js` resolves paths, calls `assertSafeOutputDir` before writes, runs
  discovery/checks, builds the packet summary, writes packet artifacts, and
  returns a result object for tests.
- `discovery.js` gathers local evidence into a stable structure.
- `checks.js` converts discovery evidence into findings, evidence refs, and
  recommended actions.

`contract-drift-auditor` has richer optional CLI ergonomics
(`--format`, `--quiet`, `--fail-on`). `gates-scan` has the smaller MVP CLI.
The ledger should start with the smaller shape unless adding machine stdout is
nearly free and tested.

### Shared Safety Helpers

Useful existing helpers:

- `shared/path-guard.js`: reject output paths inside the target project before
  packet writes.
- `shared/file-walker.js` and `shared/ignore-policy.js`: deterministic file
  walking and generated packet exclusion.
- `shared/secret-policy.js`: path-only evidence for `.env`, key, token,
  password, credential, and secret-like files.
- `shared/canonical-json.js`: recursively sorted JSON with trailing newline.
- `shared/tree-hash.js`: no-mutation proof for fixtures.
- `shared/review-packet-renderer.js`: shared packet rendering and count
  validation.
- `shared/tool-metadata.js`: packet artifact constants, schema version,
  package version, and policy hash source pattern.

### Discovery Scope

`contract-drift-auditor` already discovers:

- assistant contracts: `AGENTS.md`, `CLAUDE.md`;
- current planning docs: `.planning/PROJECT.md`, `.planning/STATE.md`,
  `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, gates, cross-repo docs;
- project skill files under `.codex/skills` or `.agents/skills`;
- package scripts from every discovered `package.json`.

The ledger can reuse this scope and extend it to structured ledger artifacts.
It should not scan all source code for semantic facts in the MVP.

## Recommended Ledger Architecture

### Module Split

Plan the implementation as one bounded tool with these modules:

- `tools/project-context-ledger/cli.js`
- `tools/project-context-ledger/index.js`
- `tools/project-context-ledger/discovery.js`
- `tools/project-context-ledger/ledger.js`
- `tools/project-context-ledger/checks.js`
- `tools/project-context-ledger/README.md`

Keep helpers tool-local until at least one other tool needs them. Move shared
helpers only if Phase 12 produces duplicated logic with clear reuse value.

### Ledger Artifacts

Use `EVIDENCE.json` as the shared evidence artifact. The ledger-specific files
should reference evidence ids:

- `FACTS.json`: project facts and derived facts with confidence and source
  hashes.
- `COMMANDS.json`: package bins, package scripts, and documented command
  references, without executing them.
- `CONTRACTS.json`: assistant contracts and source-layer references.
- `SKILLS.json`: discovered project skill paths and readable metadata.
- `DECISIONS.json`: planning decisions from project docs, roadmap, state,
  current phase context, and registry maturity decisions.
- `CACHE-MANIFEST.json`: scanned source hashes, ignored generated packet dirs,
  secret path-only entries, policy hashes, tool version, run timestamp, and
  previous-manifest comparison when present.

All JSON should be canonical and deterministic with fixed-clock tests.

### Fact Model

Each fact should include:

- stable `id`;
- `category` or `type`;
- `value` or concise `text`;
- `confidence`: `verified`, `inferred`, `unknown`, or `stale`;
- `evidence_refs`;
- `source_path`;
- `source_sha256` when the source is not secret-like;
- `last_checked`;
- optional `stale_reason` or `unknown_detail`.

Use `verified` only for direct evidence. Use `inferred` for narrow mechanical
derivations, such as package bin names derived from `package.json`. Use
`unknown` rather than inventing missing context. Use `stale` when prior
manifest comparison or missing referenced evidence proves the prior/current
fact is not reliable.

### Finding Strategy

The review packet should summarize ledger health, not duplicate all ledger
records as findings.

Recommended finding classes:

- missing referenced file or command found while building the ledger;
- unreadable or invalid JSON source that prevents reliable extraction;
- stale prior manifest source hash if an existing ledger manifest is present;
- unresolved project identity or missing assistant contract when evidence is
  insufficient;
- secret-like files encountered and handled path-only should be evidence, not
  findings unless a contract requires reading their contents.

Status should follow existing packet behavior:

- `blocked` for unreadable target project or unrecoverable invalid input that
  makes scan unreliable;
- `human_review_required` for stale/missing references;
- `info` for non-blocking unknowns;
- `pass` for clean scans.

## Test Strategy

Create a focused fixture set under `test/fixtures/project-context-ledger/`.
The primary fixture should be a mature AI Tools-like project with:

- `AGENTS.md`;
- `.planning/PROJECT.md`, `STATE.md`, `ROADMAP.md`, `REQUIREMENTS.md`, and a
  phase context artifact;
- `package.json` with scripts and bins;
- `tools/registry.json` with implemented/planned/deferred tools;
- `.codex/skills/<name>/SKILL.md` or `.agents/skills/<name>/SKILL.md`;
- a missing referenced file or command;
- a secret-like file containing a sentinel that must not appear in output;
- a generated review packet directory inside the target that must be ignored.

Tests should cover:

- CLI `--help`, missing args, mutating flag rejection, and unsafe `--out`
  rejection;
- generated artifact presence for all standard and ledger-specific files;
- review packet schema validity;
- deterministic JSON with a fixed clock;
- evidence refs from ledger records resolve to ids in `EVIDENCE.json`;
- no secret sentinel leaks and secret refs are path-only;
- target tree hash is unchanged before/after scan;
- generated packet dirs inside target are not scanned as current source;
- stale/missing references produce expected findings;
- package bin/script and registry metadata updates are reflected in planning
  tests.

## Documentation And Registry Impact

Phase 12 should update:

- `package.json`: add `project-context-ledger` bin and script.
- `shared/tool-metadata.js`: add a tool-name constant and any ledger-specific
  artifact list if useful.
- `tools/registry.json`: move `project-context-ledger` from `planned` to
  `implemented` or `validated` only when tests and self-use make that true.
- `tools/project-context-ledger/README.md`: document command, outputs, record
  shapes, status meanings, non-goals, and evidence-only use.
- `README.md` and `docs/RELEASE-READINESS.md`: add concise references only if
  they stay aligned with actual command support.
- `CHANGELOG.md`: record changed scope, validation, upstream impact,
  compatibility impact, breaking changes, and migration notes.

## Risks And Mitigations

- **Target mutation:** require external output and prove tree hash unchanged.
- **Secret leakage:** never read secret-like content; path-only refs only.
- **Generated packet recursion:** use ignore policy and test with target-local
  old packets.
- **Schema drift:** use shared packet renderer and validate summary/evidence
  schemas.
- **Overbroad memory claims:** keep facts mechanical and evidence-backed.
- **Dependency scanner creep:** record package metadata facts only; do not
  assess health, vulnerabilities, abandonment, or update advice.
- **Workflow automation creep:** explicitly state ledger output is evidence
  only and does not approve gates, mutate roadmaps, create phases, or replace
  source reading.

## Planning Recommendation

Use one implementation plan, `12-01`, because the roadmap already identifies
one vertical MVP and the work is cohesive: CLI, discovery, ledger artifacts,
tests, docs, registry, changelog, and self-use validation must land together to
make `LEDGER-01` true.

## RESEARCH COMPLETE
