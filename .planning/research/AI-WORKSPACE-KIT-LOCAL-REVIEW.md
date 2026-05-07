# ai-workspace-kit Local Checkout Review

Date: 2026-05-07

## Checkout

- Local path: `C:\projects\ai-workspace-kit`
- Local commit: `bfeb670198a9d0edff4222a5417c5d8d70ffb0ad`
- Local status: clean
- Remote/embedded reference reviewed earlier: `2079ab9626e9f9ed256512091f9c5ea473582885`
- Delta from embedded reference: 28 commits

This review intentionally uses the sibling local checkout, not only
`.external/ai-workspace-kit`. The local sibling contains newer unpushed or
not-yet-embedded work that is useful planning evidence for AI Tools.

## New Useful Ideas

### Machine-Readable Contract Index

`ai-workspace-kit` now has `AI-WORKSPACE-CONTRACT.json` as a compact index of
source layers, adapters, packet artifacts, generated review-only files,
boundaries, unsupported capabilities, non-goals, and protocol version sources.

Recommendation for AI Tools:

- Add an AI Tools contract index in a future governance phase, likely
  `AI-TOOLS-CONTRACT.json`.
- Include implemented tools, review packet artifacts, source layers,
  boundaries with `ai-workspace-kit`, unsupported capabilities, required output
  safety, and self-use stages.
- Validate it with schema tests so docs, package metadata, gates, and tool
  registry cannot silently drift.

### Centralized Protocol Versions

Kit added `data/protocol-versions.json` and `scripts/lib/protocol-versions.js`
to centralize adapter, review summary, gate registry, cross-repo,
generated-contract policy, and permission-policy versions.

Recommendation for AI Tools:

- Keep `shared/tool-metadata.js`, but add a machine-readable
  `data/protocol-versions.json` or equivalent when Phase 7/9 introduces more
  interop contracts.
- Use it for review packet schema version, cross-repo protocol version, gate
  registry compatibility version, and tool registry schema version.
- Add drift tests that compare prose/templates/schemas/tool output against the
  central version source.

### Documentation Impact Gate

Kit added a Documentation Impact Gate for execute, verify, and maintenance
stages. It asks whether major functionality, workflow, schema, gate, adapter,
review packet, permission, release-model, boundary, compatibility, seed,
requirement, roadmap, and source-of-truth changes require doc updates.

Recommendation for AI Tools:

- Add a local `documentation-impact` gate to `.planning/gates/registry.json`.
- It should complement, not replace, the changelog gate:
  - changelog = historical planning evidence;
  - documentation impact = update consumer/source-of-truth docs or record a
    deferred/not-needed/blocking reason.
- `gates-scan` should check this gate later.

### Gate Registry Effective-From and Forward-Only Validation

Kit's gate registry has `effectiveFromPhase` and says completed artifacts before
that phase are legacy evidence and should not be rewritten solely for new gate
rules.

Recommendation for AI Tools:

- Add an AI Tools equivalent such as `effective_from_phase` or explicit legacy
  policy to the gate registry.
- `gates-scan` should avoid flagging pre-effective artifacts as failures unless
  the artifact was modified after the gate became active.

### Standard Gate Resolution Template

Kit's `templates/GATE-RESOLUTION.md` standardizes statuses:

- `Resolved`
- `Skipped`
- `Blocked`
- `Not applicable`

It also requires evidence, reason for skipped gates, next action for blocked
gates, and explicitly says route config such as `workflow.discuss_mode` is not
gate evidence.

Recommendation for AI Tools:

- Add an AI Tools gate resolution template before or during `gates-scan`.
- Keep existing legacy artifacts intact, but require the normalized shape for
  future major phase artifacts.

### Optional Tool Policy

Kit added bounded docs for RTK, SocratiCode, and cross-AI review.

Useful practices for AI Tools:

- SocratiCode output is navigation/discovery evidence only; verify important
  claims against source files, schemas, tests, or command output before
  planning or coding.
- RTK-style compressed command output must never hide failing test lines, stack
  traces, assertion messages, secret-related output, security logs, or
  reproduction commands.
- Cross-AI review is evidence only. It must not mutate roadmaps, run tools,
  install dependencies, replace local contracts, or override gate resolutions.

### Skill Synthesis Governance

Kit added project operating skill guidance, `SKILL-REVIEW.md`, candidate skill
scorecards, and a Skill Gate.

Recommendation for AI Tools:

- Useful for the future "top skill" work, but do not rush it before gate
  reliability is improved.
- Sequence should be: Phase 7 cross-repo checker, then `gates-scan`, then
  contract/tool registry and skill packaging.
- When creating an AI Tools project skill, use a `SKILL-REVIEW.md`-style
  artifact with evidence used, patterns adopted/rejected, unresolved
  assumptions, verification rules, and maintenance triggers.

## Roadmap Impact

Recommended AI Tools ordering remains:

1. Phase 7: Cross-Repo Compatibility Checker MVP.
2. Next: promote `GATELINT-01` as user-facing `gates-scan`.
3. Then: contract-drift-auditor CLI ergonomics.
4. Then: tool registry plus AI Tools contract index/protocol versions.
5. Then: skill synthesis / project operating skill packaging.

Why:

- Phase 7 protects interop with the local and embedded kit checkouts.
- `gates-scan` addresses repeated gate enforcement misses.
- Contract index/protocol versions make later tool growth safer.
- Skill packaging is high-leverage, but should depend on stable gate and tool
  registry evidence.

## Freshness Gate Adjustment

Current AI Tools freshness logic mostly tracks `.external/ai-workspace-kit` and
GitHub HEAD. The sibling local checkout can be newer than both.

Recommendation:

- During planning, record both:
  - embedded reference: `.external/ai-workspace-kit`;
  - sibling local reference when present: `C:\projects\ai-workspace-kit`.
- If the sibling checkout is ahead of remote, treat it as local peer evidence,
  not authoritative upstream release.
- Do not copy `.planning` state from the sibling repo.
- Review sibling `CHANGELOG.md`, contract index, templates, schemas, and docs
  before deciding whether AI Tools planning should adopt the ideas.

## Boundaries To Preserve

- Do not import or depend on `ai-workspace-kit` runtime code from AI Tools.
- Do not implement adoption/bootstrap, adapter generation, generated-contract
  merge routing, or target-project contract installation in AI Tools.
- Do not auto-run optional tools, cross-AI review, RTK, SocratiCode, or future
  gate-linter.
- Treat local kit as evidence and design input, not automatic authority.
