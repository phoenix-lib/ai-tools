const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { discoverProject } = require("../../tools/gates-scan/discovery");
const { runChecks } = require("../../tools/gates-scan/checks");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "gates-scan");

function checkIds(name) {
  const discovery = discoverProject({ projectDir: path.join(fixtureRoot, name) });
  const result = runChecks(discovery);
  return new Set(result.findings.map((finding) => finding.source_check_id));
}

test("duplicate gate ids are detected", () => {
  assert.ok(checkIds("duplicate-gate-id").has("GATE-DUPLICATE-ID"));
});

test("discuss mode routing approval misuse is detected", () => {
  assert.ok(checkIds("discuss-mode-routing-approval").has("GATE-DISCUSS-MODE-ROUTING-ONLY"));
});

test("compatible fixture has no findings", () => {
  assert.equal(checkIds("compatible").size, 0);
});

