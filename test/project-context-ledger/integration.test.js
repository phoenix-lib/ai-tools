const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { runLedger, ALL_ARTIFACTS } = require("../../tools/project-context-ledger");
const { treeHash } = require("../../shared/tree-hash");

const fixtureProject = path.join(
  process.cwd(),
  "test",
  "fixtures",
  "project-context-ledger",
  "mature-ledger",
  "input"
);

function readJson(outDir, fileName) {
  return JSON.parse(fs.readFileSync(path.join(outDir, fileName), "utf8"));
}

test("ledger run emits packet and ledger artifacts without mutating target project", async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-ledger-integration-"));
  const beforeHash = treeHash(fixtureProject);

  try {
    const result = await runLedger({
      clock: () => new Date("2026-05-08T00:00:00Z"),
      outDir,
      projectDir: fixtureProject
    });
    const afterHash = treeHash(fixtureProject);
    const summary = readJson(outDir, "REVIEW-SUMMARY.json");
    const facts = readJson(outDir, "FACTS.json");
    const commands = readJson(outDir, "COMMANDS.json");
    const contracts = readJson(outDir, "CONTRACTS.json");
    const skills = readJson(outDir, "SKILLS.json");
    const cacheManifest = readJson(outDir, "CACHE-MANIFEST.json");
    const outputText = ALL_ARTIFACTS
      .map((fileName) => fs.readFileSync(path.join(outDir, fileName), "utf8"))
      .join("\n");

    assert.equal(result.status, "human_review_required");
    assert.equal(beforeHash, afterHash);
    for (const artifact of ALL_ARTIFACTS) {
      assert.equal(fs.existsSync(path.join(outDir, artifact)), true, `${artifact} should exist`);
    }
    assert.ok(summary.findings.some((finding) => finding.source_check_id === "ledger.reference"));
    assert.ok(summary.findings.some((finding) => finding.source_check_id === "ledger.command"));
    assert.ok(facts.some((fact) => fact.id === "fact.package-name.package-json" && fact.value === "ledger-fixture"));
    assert.ok(commands.some((command) => command.kind === "package_script" && command.name === "test"));
    assert.ok(commands.some((command) => command.kind === "package_bin" && command.name === "fixture-cli"));
    assert.ok(contracts.some((contract) => contract.path === "docs/MISSING.md" && contract.confidence === "stale"));
    assert.ok(skills.some((skill) => skill.name === "project-ops"));
    assert.ok(cacheManifest.ignored_generated_packet_dirs.includes("old-review"));
    assert.ok(cacheManifest.path_only_secret_paths.includes("config/.env.local"));
    assert.equal(outputText.includes("SECRET_SENTINEL_DO_NOT_LEAK"), false);
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});

test("ledger rejects output inside target project before writing", async () => {
  const unsafeOut = path.join(fixtureProject, "review-output");

  await assert.rejects(
    () => runLedger({ outDir: unsafeOut, projectDir: fixtureProject }),
    /Rejected unsafe output path/
  );
  assert.equal(fs.existsSync(path.join(unsafeOut, "REVIEW-SUMMARY.json")), false);
});
