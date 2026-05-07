const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runAudit } = require("../../tools/contract-drift-auditor");
const { REQUIRED_ARTIFACTS } = require("../../shared/review-packet-renderer");
const { treeHash } = require("../../shared/tree-hash");
const {
  createTempOutputDir,
  fixtureInputDir,
  readOutputText,
  removeTempOutputDir
} = require("../shared/fixture-helpers");

const fixedClock = () => new Date("2026-05-07T00:00:00Z");

function writeFile(root, relativePath, content = "") {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

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

test("auditor does not report historical planning references as current drift", async () => {
  const input = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-self-audit-input-"));
  const outDir = createTempOutputDir("self-audit-filtering");

  try {
    writeFile(input, "AGENTS.md", [
      "# Contract",
      "",
      "## Source Layers",
      "",
      "- Current guide: docs/MISSING.md",
      "- Optional upstream: .external/ai-workspace-kit/TOOLING-PLAYBOOK.md",
      ""
    ].join("\n"));
    writeFile(input, ".planning/ROADMAP.md", "# Roadmap\n");
    writeFile(input, ".planning/phases/01-old/01-PLAN.md", "Historical ref: docs/HISTORICAL.md\n");
    writeFile(input, ".external/ai-workspace-kit/package.json", "{\"name\":\"ai-workspace-kit\"}\n");
    writeFile(input, ".external/ai-workspace-kit/TOOLING-PLAYBOOK.md", "# Tooling\n");

    const before = treeHash(input);
    await runAudit({ projectDir: input, outDir, clock: fixedClock });
    const summary = JSON.parse(fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8"));
    const summaries = summary.findings.map((finding) => finding.summary).join("\n");

    assert.match(summaries, /docs\/MISSING\.md/);
    assert.doesNotMatch(summaries, /docs\/HISTORICAL\.md/);
    assert.doesNotMatch(summaries, /\.external\/ai-workspace-kit\/TOOLING-PLAYBOOK\.md/);
    assert.equal(treeHash(input), before);
  } finally {
    removeTempOutputDir(outDir);
    fs.rmSync(input, { recursive: true, force: true });
  }
});

test("auditor rejects target-local output before writing packet artifacts", async () => {
  const input = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-unsafe-output-input-"));
  const outDir = path.join(input, "packet");

  try {
    writeFile(input, "AGENTS.md", "# Contract\n");
    writeFile(input, "package.json", "{\"scripts\":{\"test\":\"node --test\"}}\n");

    const before = treeHash(input);

    await assert.rejects(
      () => runAudit({ projectDir: input, outDir, clock: fixedClock }),
      /output directory must be outside the target project/
    );

    for (const artifact of REQUIRED_ARTIFACTS) {
      assert.equal(fs.existsSync(path.join(outDir, artifact)), false, `${artifact} must not be written`);
    }
    assert.equal(treeHash(input), before);
  } finally {
    fs.rmSync(input, { recursive: true, force: true });
  }
});
