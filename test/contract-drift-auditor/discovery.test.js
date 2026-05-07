const assert = require("node:assert/strict");
const test = require("node:test");
const { discoverProject } = require("../../tools/contract-drift-auditor/discovery");
const { fixtureInputDir } = require("../shared/fixture-helpers");

test("mature fixture discovers contracts, planning, skills, and nested package scripts", () => {
  const discovery = discoverProject(fixtureInputDir("mature-ai-project"));

  assert.ok(discovery.contractFiles.some((file) => file.path === "AGENTS.md"));
  assert.ok(discovery.planningFiles.some((file) => file.path === ".planning/ROADMAP.md"));
  assert.ok(discovery.skillFiles.some((file) => file.path === ".codex/skills/project-operator/SKILL.md"));
  assert.ok(discovery.packageFiles.some((file) => file.path === "packages/api/package.json" && file.scripts.test));
});

test("generated packet fixture ignores old packet directories", () => {
  const discovery = discoverProject(fixtureInputDir("generated-packet-inside-target"));

  assert.deepEqual(discovery.files, ["README.md"]);
});

test("discovery paths are sorted relative slash paths", () => {
  const discovery = discoverProject(fixtureInputDir("mature-ai-project"));

  assert.deepEqual(discovery.files, [...discovery.files].sort());
  assert.equal(discovery.files.some((relativePath) => /^[A-Za-z]:/.test(relativePath)), false);
  assert.equal(discovery.files.some((relativePath) => relativePath.includes("\\")), false);
});
