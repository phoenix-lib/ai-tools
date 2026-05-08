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
  assert.equal(discovery.scope, "current");
  assert.ok(discovery.contractFiles.some((document) => document.path === "AGENTS.md"));
  assert.ok(discovery.planningFiles.some((document) => document.path === ".planning/PROJECT.md"));
  assert.equal(discovery.planningFiles.some((document) => document.path.includes(".planning/phases/")), false);
  assert.ok(discovery.skillFiles.some((skill) => skill.path === ".codex/skills/project-ops/SKILL.md"));
  assert.ok(discovery.generatedPacketDirs.includes("old-review"));
  assert.ok(discovery.secretPaths.includes("config/.env.local"));
  assert.ok(discovery.packageFiles.some((packageFile) => packageFile.name === "ledger-fixture"));
  assert.ok(discovery.references.some((reference) => reference.path === "docs/MISSING.md"));
  assert.ok(discovery.references.some((reference) => reference.path === "docs/EXAMPLE-MISSING.md" && reference.reference_kind === "example"));
  assert.ok(discovery.references.some((reference) => reference.path === "docs/PLACEHOLDER.md" && reference.reference_kind === "placeholder"));
  assert.ok(discovery.documentedCommands.some((command) => command.command === "npm run missing-ledger"));
});

test("scope filtering separates active planning from historical phase artifacts", () => {
  const current = discoverProject({ projectDir: fixtureProject, scope: "current" });
  const planning = discoverProject({ projectDir: fixtureProject, scope: "planning" });
  const history = discoverProject({ projectDir: fixtureProject, scope: "history" });
  const all = discoverProject({ projectDir: fixtureProject, scope: "all" });

  assert.ok(current.contractFiles.some((document) => document.path === "AGENTS.md"));
  assert.ok(current.planningFiles.some((document) => document.path === ".planning/PROJECT.md"));
  assert.equal(current.planningFiles.some((document) => document.path.includes(".planning/phases/")), false);
  assert.equal(current.references.some((reference) => reference.path === "docs/HISTORICAL-MISSING.md"), false);

  assert.equal(planning.contractFiles.length, 0);
  assert.ok(planning.planningFiles.some((document) => document.path === ".planning/PROJECT.md"));
  assert.equal(planning.planningFiles.some((document) => document.path.includes(".planning/phases/")), false);

  assert.equal(history.contractFiles.length, 0);
  assert.ok(history.planningFiles.some((document) => document.path.includes(".planning/phases/")));
  assert.ok(history.references.some((reference) => reference.path === "docs/HISTORICAL-MISSING.md"));

  assert.ok(all.contractFiles.some((document) => document.path === "AGENTS.md"));
  assert.ok(all.planningFiles.some((document) => document.path.includes(".planning/phases/")));
  assert.ok(all.references.some((reference) => reference.path === "docs/HISTORICAL-MISSING.md"));
});

test("records blocker for missing project root", () => {
  const discovery = discoverProject({ projectDir: path.join(fixtureProject, "missing") });
  assert.ok(discovery.blockers.some((blocker) => blocker.id === "missing-project-root"));
});
