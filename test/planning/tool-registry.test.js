const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const root = process.cwd();
const packetArtifacts = [
  "REVIEW-SUMMARY.json",
  "EVIDENCE.json",
  "FINDINGS.md",
  "RECOMMENDED-ACTIONS.md"
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function listFiles(relativeDir, predicate) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name).replace(/\\/g, "/");
    if (entry.isDirectory()) return listFiles(relativePath, predicate);
    return entry.isFile() && predicate(relativePath) ? [relativePath] : [];
  });
}

function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv;
}

function registryById() {
  return new Map(readJson("tools/registry.json").tools.map((entry) => [entry.id, entry]));
}

test("tool registry validates against schema", () => {
  const ajv = createAjv();
  const schema = readJson("tools/registry.schema.json");
  const registry = readJson("tools/registry.json");
  const validate = ajv.compile(schema);

  assert.equal(validate(registry), true, ajv.errorsText(validate.errors));
});

test("package bin commands have registry entries", () => {
  const packageJson = readJson("package.json");
  const registry = registryById();

  for (const binName of Object.keys(packageJson.bin)) {
    assert.ok(registry.has(binName), `missing registry entry for package bin ${binName}`);
    const entry = registry.get(binName);
    assert.equal(entry.package_bin, binName, `${binName} must record package_bin`);
    assert.equal(entry.owner, "ai-tools");
    assert.ok(["implemented", "validated"].includes(entry.maturity), `${binName} must be runnable maturity`);
  }
});

test("validated packet tools declare shared review packet outputs", () => {
  const registry = readJson("tools/registry.json");

  for (const entry of registry.tools.filter((tool) => tool.maturity === "validated")) {
    for (const artifact of packetArtifacts) {
      assert.ok(entry.expected_outputs.includes(artifact), `${entry.id} missing ${artifact}`);
    }
    assert.equal(entry.compatible_packet_standard, "review-packet/v1", `${entry.id} must declare packet standard`);
  }
});

test("gates-scan is a validated Phase 10 evidence-only CLI", () => {
  const packageJson = readJson("package.json");
  const registry = registryById();
  const entry = registry.get("gates-scan");

  assert.ok(entry, "gates-scan registry entry must exist");
  assert.equal(entry.maturity, "validated");
  assert.equal(entry.phase, "10");
  assert.equal(packageJson.bin["gates-scan"], "tools/gates-scan/cli.js");
  assert.equal(entry.package_bin, "gates-scan");
  assert.equal(entry.self_use.required, true);
  assert.ok(entry.self_use.stages.includes("phase-boundary"));
  assert.match(entry.non_goals.join("\n"), /Do not mutate the scanned target project/);
  assert.match(entry.non_goals.join("\n"), /semantic gate adoption decisions/);
});

test("project-context-ledger is a validated Phase 12 read-only CLI", () => {
  const packageJson = readJson("package.json");
  const registry = registryById();
  const entry = registry.get("project-context-ledger");

  assert.ok(entry, "project-context-ledger registry entry must exist");
  assert.equal(entry.maturity, "validated");
  assert.equal(entry.phase, "12");
  assert.equal(packageJson.bin["project-context-ledger"], "tools/project-context-ledger/cli.js");
  assert.equal(entry.package_bin, "project-context-ledger");
  assert.equal(entry.self_use.required, true);
  assert.ok(entry.self_use.stages.includes("phase-boundary"));
  assert.ok(entry.expected_outputs.includes("FACTS.json"));
  assert.ok(entry.expected_outputs.includes("CACHE-MANIFEST.json"));
  assert.match(entry.non_goals.join("\n"), /Do not mutate target project context/);
  assert.match(entry.non_goals.join("\n"), /workflow, gate, roadmap, or phase decisions/);
});

test("review-packet-rollup is a Phase 13 packet consumer CLI", () => {
  const packageJson = readJson("package.json");
  const registry = registryById();
  const entry = registry.get("review-packet-rollup");

  assert.ok(entry, "review-packet-rollup registry entry must exist");
  assert.equal(entry.maturity, "validated");
  assert.equal(entry.phase, "13");
  assert.equal(entry.packet_role, "consumer");
  assert.equal(packageJson.bin["review-packet-rollup"], "tools/review-packet-rollup/cli.js");
  assert.equal(entry.package_bin, "review-packet-rollup");
  assert.equal(entry.self_use.required, true);
  assert.ok(entry.expected_outputs.includes("PACKET-INDEX.json"));
  assert.ok(entry.expected_outputs.includes("ROLLUP-GROUPS.json"));
  assert.match(entry.non_goals.join("\n"), /Do not run source tools/);
  assert.match(entry.non_goals.join("\n"), /safe-to-ignore/);
});

test("seed idea directories are represented in the registry", () => {
  const registry = readJson("tools/registry.json");
  const entries = registry.tools;
  const representedEvidence = new Set(entries.flatMap((entry) => entry.evidence_refs));
  const entryIds = new Set(entries.map((entry) => entry.id));

  for (const seedPath of listFiles("tools", (relativePath) => relativePath.endsWith("SEED-IDEAS.md"))) {
    const seedId = seedPath.split("/")[1];
    assert.ok(
      entryIds.has(seedId) || representedEvidence.has(seedPath),
      `${seedPath} must have a registry entry or be cited as evidence`
    );
  }
});

test("kit-owned internal gates are boundary-only and non-runnable", () => {
  const registry = registryById();
  const entry = registry.get("ai-workspace-kit-internal-gates");

  assert.ok(entry, "kit boundary entry must exist");
  assert.equal(entry.owner, "ai-workspace-kit");
  assert.equal(entry.package_bin, undefined);
  assert.deepEqual(entry.expected_outputs, ["none"]);
  assert.match(entry.non_goals.join("\n"), /Do not implement kit-owned/);
  assert.match(entry.non_goals.join("\n"), /Do not run or depend on ai-workspace-kit automatically/);
});
