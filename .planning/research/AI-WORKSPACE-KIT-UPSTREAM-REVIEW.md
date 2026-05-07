# ai-workspace-kit Upstream Review

## Phase 4 Planning Freshness Check

**Checked:** 2026-05-07 during `$gsd-plan-phase 4`
**Local before update:** `48ec037d058747151c320ced9c0ee1e1d247d4b1`
**Remote HEAD:** `2079ab9626e9f9ed256512091f9c5ea473582885`
**Local after update:** `2079ab9626e9f9ed256512091f9c5ea473582885`
**Checkout status before update:** clean
**Result:** local `.external/ai-workspace-kit` fast-forwarded to upstream HEAD.

Upstream now provides `CHANGELOG.md`, so the freshness gate read it before
reviewing changed contracts directly. The changelog records Phase 11 interop
guidance, Phase 12 skill synthesis/maintenance guidance, and Phase 13 gate
enforcement contracts.

Relevant changed areas reviewed for Phase 4:

- `CHANGELOG.md` - changed contracts, gates, schemas, compatibility impact, and
  explicit statement that changelog is planning evidence, not automatic
  approval.
- `AI-TOOLS-INTEROP.md` - compatible AI Tools packet artifacts, status mapping,
  evidence-ref semantics, secret path-only rules, and recommended-action
  boundaries.
- `EXTERNAL-DEV-TOOLS.md` - optional external tool matrix. It names
  `contract-drift-auditor` for discuss/plan/maintenance and keeps it
  review-only with no automatic contract rewrite.
- `TOOLING-PLAYBOOK.md` - external tool non-duplication gate and tool matrix.
  It explicitly keeps drift auditing external to `ai-workspace-kit`.
- `CROSS-REPO-CAPABILITY-REQUESTS.md` - protocol version, canonical IDs,
  `Thread ID`, repo-qualified counterpart paths, registry mapping, and
  incoming/outgoing gates.
- `AI-CONTRACT-REVIEW.md` - review packet consumption order and mature-project
  rule to preserve stricter local contracts before copying generated guidance.
- `schemas/gate-registry.schema.json` and `templates/GATE-RESOLUTION.md` -
  upstream gate registry/gate-resolution contract. AI Tools keeps its
  snake_case registry with explicit mapping instead of claiming direct schema
  equality.

Phase 4 planning impact:

- `contract-drift-auditor` remains clearly AI Tools-owned external auditor
  scope. `ai-workspace-kit` may recommend it or consume compatible packets, but
  must not run it automatically or hide it inside adoption/bootstrap.
- Phase 4 packet renderer should align with `AI-TOOLS-INTEROP.md`:
  `REVIEW-SUMMARY.json`, `EVIDENCE.json`, `FINDINGS.md`, and
  `RECOMMENDED-ACTIONS.md` generated from one packet model.
- `low` severity is valid in AI Tools schemas; kit consumers may map it to
  `info`. Do not remove `low` from AI Tools.
- Evidence refs must stay relative, normalized, and secret-like paths must
  remain path-only without content reads, copied values, or content hashes.
- Plan artifacts should continue recording `Gate Resolution`, but completed
  pre-registry artifacts are legacy evidence and are not rewritten solely to
  satisfy new upstream gate fields.
- Future mechanical gate-linter and cross-repo validator remain deferred
  AI Tools capabilities; they are not Phase 4 scope.

**Last checked:** 2026-05-07
**Local before latest update:** `578d0f8e453ba65e667872ac0b529dcb7bbc405f`
**Remote HEAD checked:** `48ec037d058747151c320ced9c0ee1e1d247d4b1`
**Local after latest update:** `48ec037d058747151c320ced9c0ee1e1d247d4b1`
**Result:** Local `.external/ai-workspace-kit` fast-forwarded to upstream HEAD.

## Phase 3 Planning Freshness Check

**Checked:** 2026-05-07 during `$gsd-plan-phase 3`
**Local commit:** `48ec037d058747151c320ced9c0ee1e1d247d4b1`
**Remote HEAD:** `48ec037d058747151c320ced9c0ee1e1d247d4b1`
**Checkout status:** clean
**Result:** no upstream update required before Phase 3 planning.

No upstream changelog, release note, or equivalent change log file was present
in `.external/ai-workspace-kit` at this commit, so there was no changed
changelog artifact to pre-read. The current Phase 3 plan should carry forward
the previously reviewed upstream findings from commit `48ec037`, especially the
mandatory discuss-mode gate, non-duplication boundary, optional external-tool
stage mapping, and future project operating skill/gate-review ideas.

## Gate

Before every phase planning step:

1. Compare local `.external/ai-workspace-kit` with GitHub HEAD.
2. Fast-forward the local checkout when changed.
3. Review changed commits and files.
4. Record usable ideas, preserved boundaries, and phase-planning impact here.

This review is design input for AI Tools. It must not copy upstream `.planning`
state or turn `ai-workspace-kit` into a runtime dependency.

## Latest Upstream Change Summary

Commits reviewed from `578d0f8` to `48ec037`:

- `48ec037 docs: require self-improving project operating skill`
- `8ea42da docs(gsd): plan skill synthesis and ai-tools freshness gates`
- `97e9acd feat(phase-10): add laravel framework evidence adapter`
- `21492b7 docs: schedule consumer review interoperability phase`
- `2a80913 docs: add ai-tools non-duplication gate`
- `5cf40bd docs(10): plan framework evidence adapters`
- `79dc3fc test: normalize source layer assertions`
- `5a9a103 docs: clarify ai-tools boundary`
- `7623173 docs(10): refresh framework adapter context`

Major changed areas:

- `scripts/lib/frameworks.js` and `scripts/lib/frameworks/laravel.js` added a
  reusable framework evidence adapter boundary for Laravel/PHP.
- `TOOLING-PLAYBOOK.md` now includes an explicit external-tool
  non-duplication gate and a framework evidence adapters row.
- `ADAPTER-GENERATION.md` clarifies that framework adapters may inspect local
  path/metadata evidence, but must not run framework commands or implement
  external `ai-tools` capabilities such as drift audits or runtime probes.
- Laravel fixtures include `.env` and `.env.example`, reinforcing path-only
  runtime env handling and shallow structure-only example env treatment.
- Upstream docs now require a self-improving project operating skill for
  mature projects. This is relevant to future skill packaging, not Phase 2
  shared helper implementation.

New usable ideas for AI Tools:

- Keep adapter/plugin boundaries generic enough that future domain evidence
  adapters can sit on top of the file walker without bypassing safety policy.
- Treat `.env.example` structure-only reading as a future explicit policy;
  Phase 2 should keep default `.env*` classification path-only as already
  decided.
- Ensure generated review packet marker detection includes both AI Tools packet
  names and ai-workspace-kit adoption packet names.
- Non-duplication is now enforced in both directions: AI Tools must not rebuild
  adoption review, and ai-workspace-kit must not hide external auditors inside
  the kit.

Latest phase-planning impact:

- **Phase 2:** Keep the shared harness generic and framework-agnostic, but make
  helper APIs usable by future framework evidence adapters. Do not implement
  Laravel/PHP detection in Phase 2.
- **Phase 3:** Add a cross-repo capability request gate so upstream requests and
  AI Tools requests become structured decisions before heavy auditor work starts.
- **Phase 3:** Document local `CHANGELOG.md` updates after major work and make
  the upstream freshness gate read upstream changelog/release notes first once
  `ai-workspace-kit` provides them. At commit `48ec037`, no upstream changelog
  file exists, so commit log and diff review remain the fallback.
- **Phase 4:** Contract drift can later consume framework/source-layer evidence,
  but should remain a separate read-only auditor.
- **Phase 5:** Reserve a release/maintenance gate-review step for a future
  `ai-workspace-kit` capability that detects conflicting, stale, or irrelevant
  gates. Until upstream exposes that command, keep the review manual and route
  gaps through cross-repo requests or decisions.
- **Future skill work:** The self-improving project operating skill idea should
  be captured later when packaging this project's workflow into durable skills.

## Prior Upstream Change Summary

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
- **Phase 3:** Capture the cross-repo request protocol and keep incoming
  requests as decision points, not automatic phases.
- **Phase 3:** Include changelog discipline and upstream changelog pre-read in
  the cross-repo capability request playbook.
- **Phase 4:** When building `contract-drift-auditor`, consider emitting a
  compact `REVIEW-SUMMARY.json` projection that is easy for `ai-workspace-kit`,
  GSD, and other assistants to consume.
- **Phase 5:** Use `TOOLING-PLAYBOOK.md` as a source for optional integration
  documentation and for explaining when AI Tools complements
  `ai-workspace-kit`.
- **Phase 5:** Plan a future ai-workspace-kit gate-review hook, but do not mark
  it as currently runnable until upstream ships the capability.
