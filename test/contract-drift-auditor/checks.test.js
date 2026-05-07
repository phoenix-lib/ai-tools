const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { discoverProject } = require("../../tools/contract-drift-auditor/discovery");
const { runChecks } = require("../../tools/contract-drift-auditor/checks");
const { fixtureInputDir } = require("../shared/fixture-helpers");

function findingsFor(fixtureName) {
  return runChecks(discoverProject(fixtureInputDir(fixtureName))).findings;
}

function withTempProject(files, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-checks-"));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const absolutePath = path.join(root, relativePath);
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      fs.writeFileSync(absolutePath, content, "utf8");
    }
    return fn(root);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
}

test("stale source-layer fixture reports missing source layer", () => {
  const result = runChecks(discoverProject(fixtureInputDir("stale-source-layer")));
  const finding = result.findings.find((candidate) => candidate.id === "drift.source_layer.missing");

  assert.ok(finding);
  assert.match(finding.summary, /docs\/MISSING\.md/);
  assert.equal(result.evidence.every((ref) => !/^[A-Za-z]:/.test(ref.path)), true);
});

test("mature fixture does not report missing source layers or missing skills", () => {
  const findings = findingsFor("mature-ai-project");

  assert.equal(findings.some((finding) => finding.id === "drift.source_layer.missing"), false);
  assert.equal(findings.some((finding) => finding.id === "drift.skill.missing"), false);
});

test("missing command fixture reports missing npm run script but not npm test", () => {
  const result = runChecks(discoverProject(fixtureInputDir("missing-command")));
  const commandFindings = result.findings.filter((finding) => finding.id === "drift.command.missing");

  assert.equal(commandFindings.length, 1);
  assert.match(commandFindings[0].summary, /npm run verify:ai/);
  assert.doesNotMatch(commandFindings[0].summary, /npm test/);
});

test("missing skill references produce skill drift finding", () => {
  withTempProject({
    "AGENTS.md": "# Fixture\n\n## Source Layers\n\n- Local skill: .codex/skills/missing/SKILL.md\n",
    "package.json": "{\"scripts\":{\"test\":\"node --test\"}}\n"
  }, (projectDir) => {
    const findings = runChecks(discoverProject(projectDir)).findings;
    assert.ok(findings.some((finding) => finding.id === "drift.skill.missing"));
  });
});

test("absent tool references are evidence-backed findings, not permission decisions", () => {
  withTempProject({
    "AGENTS.md": "# Fixture\n\n## Workflow\n\n- Use `pnpm test` before release.\n",
    "package.json": "{\"scripts\":{\"test\":\"node --test\"}}\n"
  }, (projectDir) => {
    const result = runChecks(discoverProject(projectDir));
    const finding = result.findings.find((candidate) => candidate.id === "drift.tool.absent");

    assert.ok(finding);
    assert.equal(finding.status_contribution, "human_review_required");
    assert.ok(result.recommended_actions.some((action) => action.id === "act.tool.review.pnpm"));
  });
});

test("unknown contract facts stay unknown instead of being invented", () => {
  const result = runChecks(discoverProject(fixtureInputDir("clean-project")));
  const finding = result.findings.find((candidate) => candidate.id === "drift.profile.unknown");

  assert.ok(finding);
  assert.equal(finding.confidence, "unknown");
});
