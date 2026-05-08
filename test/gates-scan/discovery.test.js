const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { discoverProject } = require("../../tools/gates-scan/discovery");

const compatibleFixture = path.join(process.cwd(), "test", "fixtures", "gates-scan", "compatible");

test("discovers registry and phase artifacts", () => {
  const discovery = discoverProject({ projectDir: compatibleFixture });

  assert.equal(discovery.gateRegistry.exists, true);
  assert.equal(discovery.gateRegistry.value.gates[0].id, "discuss-mode");
  assert.ok(discovery.phaseArtifacts.some((artifact) =>
    artifact.projectRelativePath === ".planning/phases/01-gate-docs/01-01-PLAN.md"
  ));
});

test("records blocker for missing project root", () => {
  const discovery = discoverProject({ projectDir: path.join(compatibleFixture, "missing") });
  assert.ok(discovery.blockers.some((blocker) => blocker.id === "missing-project-root"));
});

