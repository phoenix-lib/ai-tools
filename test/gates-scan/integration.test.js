const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runGatesScan } = require("../../tools/gates-scan");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "gates-scan");

function tempOut(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `ai-tools-gates-scan-${name}-`));
}

async function runFixture(name) {
  const outDir = tempOut(name);
  const result = await runGatesScan({
    clock: () => new Date("2026-05-08T00:00:00Z"),
    outDir,
    projectDir: path.join(fixtureRoot, name)
  });
  return { outDir, result };
}

function readExpected(name) {
  const filePath = path.join(fixtureRoot, name, "EXPECTED-FINDINGS.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

test("compatible fixture emits pass packet", async () => {
  const { outDir, result } = await runFixture("compatible");

  try {
    assert.equal(result.status, "pass");
    assert.equal(fs.existsSync(path.join(outDir, "REVIEW-SUMMARY.json")), true);
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});

for (const name of fs.readdirSync(fixtureRoot).filter((entry) => entry !== "compatible")) {
  test(`${name} fixture emits expected findings`, async () => {
    const { outDir, result } = await runFixture(name);
    const expected = readExpected(name);
    const actual = new Set(result.packet.summary.findings.map((finding) => finding.source_check_id));

    try {
      assert.equal(result.status, "human_review_required");
      for (const checkId of expected) {
        assert.ok(actual.has(checkId), `${name} missing ${checkId}`);
      }
    } finally {
      fs.rmSync(outDir, { force: true, recursive: true });
    }
  });
}

test("scanner rejects output inside fixture before packet write", async () => {
  const projectDir = path.join(fixtureRoot, "compatible");
  const unsafeOut = path.join(projectDir, "review-output");

  await assert.rejects(
    () => runGatesScan({ outDir: unsafeOut, projectDir }),
    /Rejected unsafe output path/
  );
  assert.equal(fs.existsSync(path.join(unsafeOut, "REVIEW-SUMMARY.json")), false);
});

