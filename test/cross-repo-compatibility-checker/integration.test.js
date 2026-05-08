const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runCompatibilityCheck } = require("../../tools/cross-repo-compatibility-checker");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "cross-repo-compatibility");

function fixture(name) {
  return {
    aiToolsDir: path.join(fixtureRoot, name, "ai-tools"),
    aiWorkspaceKitDir: path.join(fixtureRoot, name, "ai-workspace-kit")
  };
}

function tempOut(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `ai-tools-cross-repo-${name}-`));
}

async function runFixture(name) {
  const outDir = tempOut(name);
  const result = await runCompatibilityCheck({
    ...fixture(name),
    clock: () => new Date("2026-05-08T00:00:00Z"),
    outDir
  });
  return { outDir, result };
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

test("broken counterpart fixture emits human review packet", async () => {
  const { outDir, result } = await runFixture("broken-counterpart");

  try {
    assert.equal(result.status, "human_review_required");
    const summary = JSON.parse(fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8"));
    assert.ok(summary.findings.some((finding) => finding.id.startsWith("missing-counterpart-file-")));
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});

test("checker rejects output inside either fixture repo before packet write", async () => {
  const roots = fixture("compatible");
  const unsafeOut = path.join(roots.aiToolsDir, "review-output");

  await assert.rejects(
    () => runCompatibilityCheck({ ...roots, outDir: unsafeOut }),
    /Rejected unsafe output path/
  );
  assert.equal(fs.existsSync(path.join(unsafeOut, "REVIEW-SUMMARY.json")), false);
});
