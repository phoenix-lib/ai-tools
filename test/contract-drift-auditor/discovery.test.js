const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  discoverProject,
  isCurrentContractDocument,
  isCurrentPlanningDocument
} = require("../../tools/contract-drift-auditor/discovery");
const { fixtureInputDir } = require("../shared/fixture-helpers");

function writeFile(root, relativePath, content = "") {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

test("mature fixture discovers contracts, planning, skills, and nested package scripts", () => {
  const discovery = discoverProject(fixtureInputDir("mature-ai-project"));

  assert.ok(discovery.contractFiles.some((file) => file.path === "AGENTS.md"));
  assert.ok(discovery.planningFiles.some((file) => file.path === ".planning/ROADMAP.md"));
  assert.ok(discovery.skillFiles.some((file) => file.path === ".codex/skills/project-operator/SKILL.md"));
  assert.ok(discovery.packageFiles.some((file) => file.path === "packages/api/package.json" && file.scripts.test));
});

test("planning source documents exclude historical phase artifacts by default", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-discovery-planning-"));

  try {
    writeFile(dir, "AGENTS.md", "# Contract\n");
    writeFile(dir, ".planning/ROADMAP.md", "# Roadmap\n");
    writeFile(dir, ".planning/PROJECT.md", "# Project\n");
    writeFile(dir, ".planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md", "# Cross Repo\n");
    writeFile(dir, ".planning/phases/01-old/01-PLAN.md", "# Old Plan\n");
    writeFile(dir, ".planning/phases/01-old/01-SUMMARY.md", "# Old Summary\n");

    const discovery = discoverProject(dir);
    const planningPaths = discovery.planningFiles.map((file) => file.path);

    assert.ok(planningPaths.includes(".planning/ROADMAP.md"));
    assert.ok(planningPaths.includes(".planning/PROJECT.md"));
    assert.ok(planningPaths.includes(".planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md"));
    assert.equal(planningPaths.includes(".planning/phases/01-old/01-PLAN.md"), false);
    assert.equal(planningPaths.includes(".planning/phases/01-old/01-SUMMARY.md"), false);
    assert.equal(discovery.files.includes(".planning/phases/01-old/01-PLAN.md"), true);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("current planning document classifier is explicit", () => {
  assert.equal(isCurrentPlanningDocument(".planning/ROADMAP.md"), true);
  assert.equal(isCurrentPlanningDocument(".planning/cross-repo/inbox/request.md"), true);
  assert.equal(isCurrentPlanningDocument(".planning/gates/README.md"), true);
  assert.equal(isCurrentPlanningDocument(".planning/phases/05/05-PLAN.md"), false);
});

test("contract source documents are root-level project contracts by default", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-discovery-contracts-"));

  try {
    writeFile(dir, "AGENTS.md", "# Root Contract\n");
    writeFile(dir, "test/fixtures/targets/example/input/AGENTS.md", "# Fixture Contract\n");

    const discovery = discoverProject(dir);
    const contractPaths = discovery.contractFiles.map((file) => file.path);

    assert.deepEqual(contractPaths, ["AGENTS.md"]);
    assert.equal(discovery.files.includes("test/fixtures/targets/example/input/AGENTS.md"), true);
    assert.equal(isCurrentContractDocument("AGENTS.md"), true);
    assert.equal(isCurrentContractDocument("test/fixtures/targets/example/input/AGENTS.md"), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
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
