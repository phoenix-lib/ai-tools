const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { discoverRepositories } = require("../../tools/cross-repo-compatibility-checker/discovery");
const { runChecks } = require("../../tools/cross-repo-compatibility-checker/checks");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "cross-repo-compatibility");

function checkFixture(name) {
  const discovery = discoverRepositories({
    aiToolsDir: path.join(fixtureRoot, name, "ai-tools"),
    aiWorkspaceKitDir: path.join(fixtureRoot, name, "ai-workspace-kit")
  });
  return runChecks(discovery);
}

function findingIds(result) {
  return result.findings.map((finding) => finding.id);
}

test("compatible mirrored requests with different canonical IDs pass protocol checks", () => {
  const result = checkFixture("compatible");

  assert.deepEqual(result.findings, []);
  assert.deepEqual(result.required_decisions, []);
});

test("broken mirrored counterpart produces human review finding", () => {
  const result = checkFixture("broken-counterpart");

  assert.ok(findingIds(result).some((id) => id.startsWith("missing-counterpart-file-")));
  assert.ok(result.findings.every((finding) => finding.status_contribution === "human_review_required"));
});

test("manual-transfer request with decision passes", () => {
  const result = checkFixture("manual-transfer-with-decision");

  assert.deepEqual(result.findings, []);
  assert.deepEqual(result.required_decisions, []);
});

test("absolute counterpart path produces portable path finding", () => {
  const result = checkFixture("absolute-path");

  assert.ok(findingIds(result).some((id) => id.startsWith("absolute-path-")));
  assert.ok(findingIds(result).some((id) => id.startsWith("counterpart-path-format-")));
  for (const evidence of result.evidence) {
    assert.equal(/^[A-Za-z]:/.test(evidence.path), false);
    assert.equal(evidence.path.includes("\\"), false);
  }
});
