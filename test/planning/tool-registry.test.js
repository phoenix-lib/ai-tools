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

test("gates-scan remains planned and is not a Phase 9 CLI", () => {
  const packageJson = readJson("package.json");
  const registry = registryById();
  const entry = registry.get("gates-scan");

  assert.ok(entry, "gates-scan registry entry must exist");
  assert.equal(entry.maturity, "planned");
  assert.equal(entry.phase, "10");
  assert.equal(Object.hasOwn(packageJson.bin, "gates-scan"), false, "Phase 9 must not add gates-scan bin");
  assert.match(entry.non_goals.join("\n"), /Do not implement the CLI in Phase 9/);
  assert.match(entry.non_goals.join("\n"), /semantic gate adoption decisions/);
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
