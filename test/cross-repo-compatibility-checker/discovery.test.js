const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { discoverRepositories } = require("../../tools/cross-repo-compatibility-checker/discovery");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "cross-repo-compatibility");

function fixture(name) {
  return {
    aiToolsDir: path.join(fixtureRoot, name, "ai-tools"),
    aiWorkspaceKitDir: path.join(fixtureRoot, name, "ai-workspace-kit")
  };
}

test("discovery reads paired repo protocol artifacts and registries", () => {
  const discovery = discoverRepositories(fixture("compatible"));
  const requestPaths = discovery.artifacts
    .filter((artifact) => artifact.kind === "request")
    .map((artifact) => artifact.repoQualifiedPath);

  assert.deepEqual(discovery.blockers, []);
  assert.ok(requestPaths.includes("ai-tools/.planning/cross-repo/outbox/REQ-20260507-ai-tools-to-ai-workspace-kit-review-packet-contract.md"));
  assert.ok(requestPaths.includes("ai-workspace-kit/.planning/cross-repo/inbox/REQ-20260507-ai-tools-to-ai-workspace-kit-review-packet-standard.md"));
  assert.equal(discovery.registries.aiTools.exists, true);
  assert.equal(discovery.registries.aiWorkspaceKit.exists, true);
  assert.equal(discovery.optionalEvidence.kitProtocolVersions.exists, true);
});

test("discovery records missing roots as blockers", () => {
  const discovery = discoverRepositories({
    aiToolsDir: path.join(fixtureRoot, "missing-ai-tools"),
    aiWorkspaceKitDir: path.join(fixtureRoot, "missing-kit")
  });

  assert.equal(discovery.blockers.length, 2);
  assert.match(discovery.blockers[0].id, /missing-root/);
});
