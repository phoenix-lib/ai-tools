const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "gates-scan");

const requiredFixtures = [
  "compatible",
  "duplicate-gate-id",
  "missing-gate-resolution",
  "skipped-non-skippable",
  "skipped-missing-reason",
  "discuss-mode-routing-approval",
  "stale-path",
  "missing-observable-output",
  "interop-mapping-drift",
  "missing-changelog-impact",
  "conflicting-wording",
  "unresolved-reference"
];

const requiredCheckIds = [
  "GATE-DUPLICATE-ID",
  "GATE-RESOLUTION-MISSING",
  "GATE-SKIP-NONSKIPPABLE",
  "GATE-SKIP-REASON-MISSING",
  "GATE-DISCUSS-MODE-ROUTING-ONLY",
  "GATE-STALE-PATH",
  "GATE-OBSERVABLE-OUTPUT-MISSING",
  "GATE-INTEROP-MAPPING-DRIFT",
  "GATE-STAGE-ALIAS-DRIFT",
  "GATE-CHANGELOG-IMPACT-MISSING",
  "GATE-CONFLICTING-WORDING",
  "GATE-UNRESOLVED-REFERENCE"
];

function readExpected(fixtureName) {
  const filePath = path.join(fixtureRoot, fixtureName, "EXPECTED-FINDINGS.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listFiles(absolutePath);
    }
    return entry.isFile() ? [absolutePath] : [];
  });
}

test("required gates-scan fixtures exist", () => {
  for (const fixtureName of requiredFixtures) {
    assert.equal(fs.existsSync(path.join(fixtureRoot, fixtureName)), true, `${fixtureName} missing`);
  }
});

test("compatible fixture has required project shape", () => {
  const compatible = path.join(fixtureRoot, "compatible");
  assert.equal(fs.existsSync(path.join(compatible, ".planning", "gates", "registry.json")), true);
  assert.equal(fs.existsSync(path.join(compatible, ".planning", "ROADMAP.md")), true);
  assert.equal(fs.existsSync(path.join(compatible, ".planning", "PROJECT.md")), true);

  const phaseArtifact = fs.readFileSync(
    path.join(compatible, ".planning", "phases", "01-gate-docs", "01-01-PLAN.md"),
    "utf8"
  );
  assert.match(phaseArtifact, /## Gate Resolution/);
});

test("broken fixtures declare deterministic expected findings", () => {
  const allExpected = new Set();

  for (const fixtureName of requiredFixtures.filter((name) => name !== "compatible")) {
    const expected = readExpected(fixtureName);
    assert.ok(expected.length > 0, `${fixtureName} must declare EXPECTED-FINDINGS.json`);
    for (const checkId of expected) {
      allExpected.add(checkId);
    }
  }

  for (const checkId of requiredCheckIds) {
    assert.ok(allExpected.has(checkId), `fixture matrix missing ${checkId}`);
  }
});

test("fixtures do not rely on external kit checkout state", () => {
  for (const filePath of listFiles(fixtureRoot)) {
    const relativePath = path.relative(fixtureRoot, filePath).replace(/\\/g, "/");
    const content = fs.readFileSync(filePath, "utf8");
    assert.equal(relativePath.includes(".external/ai-workspace-kit"), false, relativePath);
    assert.equal(content.includes(".external/ai-workspace-kit"), false, relativePath);
  }
});

