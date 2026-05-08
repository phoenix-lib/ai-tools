const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { treeHash } = require("../../shared/tree-hash");
const { ALL_ARTIFACTS, runRollup } = require("../../tools/review-packet-rollup");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "review-packet-rollup");

function fixture(...parts) {
  return path.join(fixtureRoot, ...parts);
}

function readJson(outDir, fileName) {
  return JSON.parse(fs.readFileSync(path.join(outDir, fileName), "utf8"));
}

test("rollup emits standard packet and rollup artifacts without mutating inputs", async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-rollup-integration-"));
  const inputA = fixture("valid-a");
  const inputB = fixture("valid-b");
  const beforeA = treeHash(inputA);
  const beforeB = treeHash(inputB);

  try {
    const result = await runRollup({
      clock: () => new Date("2026-05-08T00:00:00Z"),
      outDir,
      packetDirs: [inputA, inputB]
    });
    const summary = readJson(outDir, "REVIEW-SUMMARY.json");
    const packetIndex = readJson(outDir, "PACKET-INDEX.json");
    const groups = readJson(outDir, "ROLLUP-GROUPS.json");

    assert.equal(result.status, "human_review_required");
    assert.equal(beforeA, treeHash(inputA));
    assert.equal(beforeB, treeHash(inputB));
    for (const artifact of ALL_ARTIFACTS) {
      assert.equal(fs.existsSync(path.join(outDir, artifact)), true, `${artifact} should exist`);
    }
    assert.equal(summary.counts.total_findings, 4);
    assert.deepEqual(summary.generated_artifacts, [
      "REVIEW-SUMMARY.json",
      "EVIDENCE.json",
      "FINDINGS.md",
      "RECOMMENDED-ACTIONS.md"
    ]);
    assert.equal(packetIndex.length, 2);
    assert.ok(groups.by_source_path.some((group) => group.key === "src/shared.js" && group.count === 2));
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});

test("invalid source packet blocks rollup while preserving valid packet evidence", async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-rollup-invalid-"));

  try {
    const result = await runRollup({
      clock: () => new Date("2026-05-08T00:00:00Z"),
      outDir,
      packetDirs: [fixture("valid-a"), fixture("invalid-missing-summary")]
    });
    const summary = readJson(outDir, "REVIEW-SUMMARY.json");
    const packetIndex = readJson(outDir, "PACKET-INDEX.json");

    assert.equal(result.status, "blocked");
    assert.equal(summary.status, "blocked");
    assert.ok(summary.findings.some((finding) => finding.source_check_id === "rollup.packet.validation"));
    assert.equal(packetIndex[0].validation_status, "valid");
    assert.equal(packetIndex[1].validation_status, "invalid");
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});

test("rollup rejects output inside any input packet directory before writing", async () => {
  const unsafeOut = path.join(fixture("valid-a"), "rollup-output");

  await assert.rejects(
    () => runRollup({
      outDir: unsafeOut,
      packetDirs: [fixture("valid-a"), fixture("valid-b")]
    }),
    /Rejected unsafe output path/
  );
  assert.equal(fs.existsSync(path.join(unsafeOut, "REVIEW-SUMMARY.json")), false);
});
