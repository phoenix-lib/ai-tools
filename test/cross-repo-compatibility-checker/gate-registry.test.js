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

test("compatible registry mapping passes through explicit interop mapping", () => {
  const result = checkFixture("compatible");

  assert.deepEqual(result.findings, []);
});

test("missing registry mapping and stage alias produce findings", () => {
  const result = checkFixture("gate-registry-drift");
  const ids = result.findings.map((finding) => finding.id);

  assert.ok(ids.some((id) => id.startsWith("registry-field-mapping-")));
  assert.ok(ids.some((id) => id.startsWith("registry-stage-alias-")));
  assert.ok(result.findings.every((finding) => finding.status_contribution === "human_review_required"));
});
