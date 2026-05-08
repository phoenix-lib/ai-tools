const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { discoverProject } = require("../../tools/project-context-ledger/discovery");

const fixtureProject = path.join(
  process.cwd(),
  "test",
  "fixtures",
  "project-context-ledger",
  "mature-ledger",
  "input"
);

test("discovers project contracts, commands, skills, and ignored packet dirs", () => {
  const discovery = discoverProject({ projectDir: fixtureProject });

  assert.deepEqual(discovery.blockers, []);
  assert.ok(discovery.contractFiles.some((document) => document.path === "AGENTS.md"));
  assert.ok(discovery.planningFiles.some((document) => document.path === ".planning/PROJECT.md"));
  assert.ok(discovery.skillFiles.some((skill) => skill.path === ".codex/skills/project-ops/SKILL.md"));
  assert.ok(discovery.generatedPacketDirs.includes("old-review"));
  assert.ok(discovery.secretPaths.includes("config/.env.local"));
  assert.ok(discovery.packageFiles.some((packageFile) => packageFile.name === "ledger-fixture"));
  assert.ok(discovery.references.some((reference) => reference.path === "docs/MISSING.md"));
  assert.ok(discovery.documentedCommands.some((command) => command.command === "npm run missing-ledger"));
});

test("records blocker for missing project root", () => {
  const discovery = discoverProject({ projectDir: path.join(fixtureProject, "missing") });
  assert.ok(discovery.blockers.some((blocker) => blocker.id === "missing-project-root"));
});
