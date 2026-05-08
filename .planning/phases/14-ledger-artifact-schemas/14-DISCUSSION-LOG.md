# Phase 14: Ledger Artifact Schemas - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 14-Ledger Artifact Schemas
**Areas discussed:** Schema ownership, artifact compatibility, strictness, cache manifest metadata, validation strategy, deferred boundaries

---

## Discuss Mode

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Questions | Ask the user to choose gray areas and answer questions interactively. | |
| Trusted Self-Questioning | The agent performs a bounded self-questioning pass and records implementation decisions. | yes |

**User's choice:** Trusted Self-Questioning. User replied `2` after the
discuss-mode gate prompt.

**Notes:** `workflow.discuss_mode=discuss` was treated as routing only, not
approval evidence.

---

## Schema Ownership

| Option | Description | Selected |
|--------|-------------|----------|
| `standards/project-context-ledger/schemas/` | Treat ledger artifact schemas as downstream consumer contracts. | yes |
| `tools/project-context-ledger/schemas/` | Keep schemas tool-local, easier initially but weaker for consumers. | |
| Reuse review-packet schema directory | Mix unrelated standards and make ownership less clear. | |

**User's choice:** Trusted self-questioning selected standards ownership.

**Notes:** This follows the existing review-packet standard pattern while
keeping tool-specific logic in `tools/project-context-ledger/`.

---

## Artifact Compatibility

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve top-level arrays | Keep `FACTS.json`, `COMMANDS.json`, `CONTRACTS.json`, `SKILLS.json`, and `DECISIONS.json` compatible with Phase 12 output. | yes |
| Wrap every artifact in `{ schema_version, entries }` | Cleaner schema metadata but breaking for existing consumers. | |
| Add per-record schema versions | Noisy and repetitive for small ledger records. | |

**User's choice:** Trusted self-questioning selected compatibility-first
arrays with schema version metadata in `CACHE-MANIFEST.json` and tool manifest.

**Notes:** A future breaking version can add wrappers if needed, but Phase 14
should stabilize current output first.

---

## Strictness

| Option | Description | Selected |
|--------|-------------|----------|
| Strict schemas with generator fixes | Use `additionalProperties: false` and fix current output gaps. | yes |
| Loose schemas matching any current output | Faster but weakens downstream trust. | |
| Full redesign of ledger record model | Too broad for Phase 14. | |

**User's choice:** Trusted self-questioning selected strict schemas with narrow
generator fixes.

**Notes:** Current self-use output exposed duplicate decision IDs such as
`decision.d-01`; Phase 14 should fix duplicates instead of relaxing validation.

---

## Cache Manifest

| Option | Description | Selected |
|--------|-------------|----------|
| Validate current metadata plus small version field | Require scanned sources, policy hashes, ignored generated packet dirs, path-only secret paths, previous manifest shape, and tool metadata. | yes |
| Redesign cache manifest for diff mode | Belongs to Phase 16. | |
| Minimal schema only | Would not satisfy downstream cache validation needs. | |

**User's choice:** Trusted self-questioning selected current metadata plus
small schema-version hardening.

**Notes:** `--since-manifest` behavior remains out of scope for Phase 14.

---

## Validation Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Generated fixture validation | Run ledger on the mature fixture and validate all six ledger artifacts with AJV. | yes |
| Commit generated fixture output | More brittle and unnecessary for this repository's current test style. | |
| Real self-use as oracle | Useful evidence but too noisy as the primary schema oracle. | |

**User's choice:** Trusted self-questioning selected generated fixture
validation.

**Notes:** Add cross-artifact tests for unique IDs and evidence refs because
JSON Schema alone cannot prove those joins.

---

## Deferred Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Phase 14 to schemas and validation | Preserve roadmap boundary. | yes |
| Add scope/diff modes now | Belongs to Phase 16. | |
| Add dispositions now | Belongs to Phase 15. | |
| Add shared CLI behavior now | Belongs to Phase 17. | |

**User's choice:** Trusted self-questioning selected strict phase boundary.

**Notes:** The phase may fix generated output required for schema validity, but
should not add new ledger capabilities.

## the agent's Discretion

- Exact schema factoring and filenames for common definitions.
- Whether generator backfills happen in Wave 1 or Wave 2.
- Exact test file split, as long as generated ledger artifacts validate and
  deterministic output remains covered.

## Deferred Ideas

- Ledger scope/diff modes: Phase 16.
- Review dispositions: Phase 15.
- Shared CLI contract: Phase 17.
- Portfolio-wide project scanning: future real-project evidence baseline seed.
