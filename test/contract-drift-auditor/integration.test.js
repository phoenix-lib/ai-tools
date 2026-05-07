const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { runAudit } = require("../../tools/contract-drift-auditor");
const { treeHash } = require("../../shared/tree-hash");
const {
  createTempOutputDir,
  fixtureInputDir,
  readOutputText,
  removeTempOutputDir
} = require("../shared/fixture-helpers");

const fixedClock = () => new Date("2026-05-07T00:00:00Z");

test("auditor emits required packet artifacts for missing-command fixture", async () => {
  const input = fixtureInputDir("missing-command");
  const outDir = createTempOutputDir("missing-command");
  const before = treeHash(input);

  try {
    const result = await runAudit({
      projectDir: input,
      outDir,
      clock: fixedClock,
      argv: ["--project", "missing-command", "--out", "packet"]
    });

    assert.equal(result.status, "human_review_required");
    for (const artifact of ["REVIEW-SUMMARY.json", "EVIDENCE.json", "FINDINGS.md", "RECOMMENDED-ACTIONS.md"]) {
      assert.equal(fs.existsSync(path.join(outDir, artifact)), true, `${artifact} should exist`);
    }

    const summary = JSON.parse(fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8"));
    assert.ok(summary.findings.some((finding) => finding.id === "drift.command.missing"));
    assert.equal(treeHash(input), before);
  } finally {
    removeTempOutputDir(outDir);
  }
});

test("auditor does not leak secret sentinel output", async () => {
  const input = fixtureInputDir("secret-like-files");
  const outDir = createTempOutputDir("secret-like-files");
  const before = treeHash(input);

  try {
    await runAudit({ projectDir: input, outDir, clock: fixedClock });
    const outputText = readOutputText(outDir);

    assert.doesNotMatch(outputText, /SECRET_SENTINEL_DO_NOT_LEAK/);
    assert.equal(treeHash(input), before);
  } finally {
    removeTempOutputDir(outDir);
  }
});

test("auditor ignores generated packet artifacts inside target evidence", async () => {
  const input = fixtureInputDir("generated-packet-inside-target");
  const outDir = createTempOutputDir("generated-packet-inside-target");

  try {
    await runAudit({ projectDir: input, outDir, clock: fixedClock });
    const outputText = readOutputText(outDir);

    assert.doesNotMatch(outputText, /old-review\//);
    assert.doesNotMatch(outputText, /old-adoption\//);
  } finally {
    removeTempOutputDir(outDir);
  }
});
