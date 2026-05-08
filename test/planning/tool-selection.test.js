const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = process.cwd();

const v2SeedIds = [
  "config-matrix-validator",
  "domain-contract-test-generator",
  "local-integration-harness",
  "phase-forensics-tool",
  "project-context-ledger",
  "runtime-capability-inspector",
  "skill-linter",
  "test-quality-auditor",
  "ui-regression-screenshot-comparator"
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function registryById() {
  return new Map(readJson("tools/registry.json").tools.map((entry) => [entry.id, entry]));
}

test("Phase 11 selected the v2 seed that Phase 12 implements", () => {
  const registry = registryById();
  const implemented = v2SeedIds.filter((id) => registry.get(id).maturity === "validated");

  assert.ok(implemented.includes("project-context-ledger"));
});

test("project context ledger is validated and runnable", () => {
  const registry = registryById();
  const packageJson = readJson("package.json");
  const ledger = registry.get("project-context-ledger");

  assert.equal(ledger.owner, "ai-tools");
  assert.equal(ledger.destination, "tools/project-context-ledger/");
  assert.equal(ledger.maturity, "validated");
  assert.equal(ledger.package_bin, "project-context-ledger");
  assert.equal(packageJson.bin["project-context-ledger"], "tools/project-context-ledger/cli.js");
  assert.equal(packageJson.scripts["project-context-ledger"], "node tools/project-context-ledger/cli.js");
  assert.ok(ledger.activation_stage.includes("research"));
  assert.ok(ledger.activation_stage.includes("plan"));
  assert.ok(ledger.activation_stage.includes("verify"));
  assert.ok(ledger.activation_stage.includes("phase-boundary"));
  assert.ok(ledger.expected_outputs.includes("FACTS.json"));
  assert.ok(ledger.expected_outputs.includes("CACHE-MANIFEST.json"));
  assert.ok(ledger.evidence_refs.includes(".planning/phases/11-v2-tool-selection-review/11-SELECTION-REVIEW.md"));
  assert.match(ledger.status_notes, /Validated Phase 12/i);
});

test("non-selected v2 seeds remain deferred with trigger notes", () => {
  const registry = registryById();

  for (const id of v2SeedIds.filter((seedId) => seedId !== "project-context-ledger")) {
    const entry = registry.get(id);

    assert.equal(entry.maturity, "deferred", `${id} must remain deferred`);
    assert.match(entry.status_notes, /Deferred after Phase 11/i, `${id} needs Phase 11 deferral note`);
  }
});

test("selection review and roadmap preserve ledger selection trail", () => {
  const selectionReview = readText(".planning/phases/11-v2-tool-selection-review/11-SELECTION-REVIEW.md");
  const roadmap = readText(".planning/ROADMAP.md");
  const requirements = readText(".planning/REQUIREMENTS.md");

  assert.match(selectionReview, /selected_candidate: project-context-ledger/);
  assert.match(selectionReview, /No package bin/);
  assert.match(selectionReview, /phase-forensics-tool[\s\S]*Defer/);
  assert.match(roadmap, /Phase 12: Project Context Ledger MVP/);
  assert.match(roadmap, /\| LEDGER-01 \| Phase 12 \|/);
  assert.match(requirements, /\| LEDGER-01 \| Phase 12 \| (Planned|Complete) \|/);
  assert.match(requirements, /\| FORENSICS-01 \| Future \| Deferred /);
});
