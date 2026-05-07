# ai-workspace-kit Upstream Review

**Last checked:** 2026-05-07
**Local before update:** `3e489b1a99c58443e593a1e2f6234ed5d0dc173d`
**Remote HEAD checked:** `578d0f8e453ba65e667872ac0b529dcb7bbc405f`
**Local after update:** `578d0f8e453ba65e667872ac0b529dcb7bbc405f`
**Result:** Local `.external/ai-workspace-kit` fast-forwarded to upstream HEAD.

## Gate

Before every phase planning step:

1. Compare local `.external/ai-workspace-kit` with GitHub HEAD.
2. Fast-forward the local checkout when changed.
3. Review changed commits and files.
4. Record usable ideas, preserved boundaries, and phase-planning impact here.

This review is design input for AI Tools. It must not copy upstream `.planning`
state or turn `ai-workspace-kit` into a runtime dependency.

## Current Upstream Change Summary

Commits reviewed from `3e489b1` to `578d0f8`:

- `578d0f8 fix(contracts): enforce discuss mode gate`
- `f9ad5fe docs(09-01): complete review summary governance plan`
- `6813c84 feat(09-01): add review summary governance`
- `6b7fdf8 docs(09): plan review summary governance`
- `faed5c1 fix(adopt): handle empty projects without planning`
- `1bc1fdb docs(09): capture tooling governance context`
- `af1227b docs(gsd): repair phase 9 and 10 numbering`
- `69d06e9 docs(gsd): align state after phase shift`
- `2f31042 docs(phase-09): add tooling governance phase`
- `bafb585 feat(phase-08): harden adoption review trust`
- `18c928f docs: plant seed for project environment review`
- `f4a0892 docs(phase-08): plan adoption review trust hardening`

Major changed areas:

- `TOOLING-PLAYBOOK.md` added optional-tool governance and GSD stage mapping.
- `schemas/review-summary.schema.json` added a compact machine-readable review
  gate artifact.
- `ADAPTER-GENERATION.md`, `AI-BOOTSTRAP.md`, `CORE-CONTRACT.md`, and adapter
  templates now enforce discuss-mode gate wording more explicitly.
- Review packet fixtures now emit `REVIEW-SUMMARY.json`.
- `scripts/lib/review.js`, `manifest.js`, `permissions.js`, `inspection.js`,
  and related tests gained stronger review-summary, permission, and trust
  behavior.
- A mature GSD/Codex fixture was added for adoption-review trust hardening.

## Usable Ideas For AI Tools

- Treat `REVIEW-SUMMARY.json` as the compact gate artifact for other agents and
  automation, while keeping richer evidence in dedicated packet artifacts.
- Keep one source of truth for status, counts, severity buckets, verdict, and
  recommended action; render Markdown, JSON, manifest, and CLI projections from
  it.
- Document optional tools by stage, inputs, outputs, blockers, automation
  boundary, and review packet integration.
- Make generated or derived guidance explicitly review material, not a direct
  replacement for mature project-local contracts.
- Keep exact adapter/tool selection visible in review artifacts so unrequested
  outputs do not produce misleading next steps.
- Continue treating secret-like paths as path-only and output dirs inside target
  projects as unsafe.

## Boundaries To Preserve

- AI Tools should not implement `ai-workspace-kit` adoption/bootstrap,
  assistant adapter generation, generated contract merge routing, or
  project-local contract installation.
- AI Tools may implement external read-only auditors, shared packet schemas,
  safety harnesses, deterministic checks, packet consumers, and compatibility
  docs.
- `.external/ai-workspace-kit` remains a reference checkout. Production code and
  tests in AI Tools should not import it.

## Phase Planning Impact

- **Phase 2:** Include compatibility with upstream review-summary governance in
  shared helper design, but keep implementation focused on generic safety
  primitives: path guard, ignore policy, file walker, secret policy, canonical
  JSON, tree hash, and fixtures.
- **Phase 3:** When building `contract-drift-auditor`, consider emitting a
  compact `REVIEW-SUMMARY.json` projection that is easy for `ai-workspace-kit`,
  GSD, and other assistants to consume.
- **Phase 4:** Use `TOOLING-PLAYBOOK.md` as a source for optional integration
  documentation and for explaining when AI Tools complements
  `ai-workspace-kit`.
