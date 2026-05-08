const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const { runRollup } = require("../../tools/review-packet-rollup");
const {
  REQUIRED_PACKET_ARTIFACTS,
  REVIEW_PACKET_ROLLUP_ARTIFACTS,
  REVIEW_PACKET_ROLLUP_TOOL_NAME,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
} = require("../../shared/tool-metadata");

const schemaDir = path.join(process.cwd(), "standards/review-packet/schemas");
const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "review-packet-rollup");

function fixture(...parts) {
  return path.join(fixtureRoot, ...parts);
}

function readSchema(name) {
  return JSON.parse(fs.readFileSync(path.join(schemaDir, name), "utf8"));
}

function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);

  for (const schemaName of [
    "EVIDENCE-REF.schema.json",
    "RECOMMENDED-ACTION.schema.json",
    "TOOL-MANIFEST.schema.json",
    "FINDING.schema.json",
    "REVIEW-SUMMARY.schema.json"
  ]) {
    ajv.addSchema(readSchema(schemaName));
  }

  return ajv;
}

async function generatePacket() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-rollup-schema-"));
  await runRollup({
    clock: () => new Date("2026-05-08T00:00:00Z"),
    outDir,
    packetDirs: [fixture("valid-a"), fixture("valid-b")]
  });

  return {
    evidence: JSON.parse(fs.readFileSync(path.join(outDir, "EVIDENCE.json"), "utf8")),
    evidenceText: fs.readFileSync(path.join(outDir, "EVIDENCE.json"), "utf8"),
    dispositionIndexText: fs.readFileSync(path.join(outDir, "DISPOSITION-INDEX.json"), "utf8"),
    groupsText: fs.readFileSync(path.join(outDir, "ROLLUP-GROUPS.json"), "utf8"),
    indexText: fs.readFileSync(path.join(outDir, "PACKET-INDEX.json"), "utf8"),
    outDir,
    summary: JSON.parse(fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8")),
    summaryText: fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8")
  };
}

test("generated rollup packet validates against review packet schemas", async () => {
  const packet = await generatePacket();
  const ajv = createAjv();
  const validateSummary = ajv.getSchema("https://ai-tools.local/schemas/review-packet/REVIEW-SUMMARY.schema.json");
  const validateEvidence = ajv.getSchema("https://ai-tools.local/schemas/review-packet/EVIDENCE-REF.schema.json");
  const validateAction = ajv.getSchema("https://ai-tools.local/schemas/review-packet/RECOMMENDED-ACTION.schema.json");

  try {
    assert.equal(validateSummary(packet.summary), true, ajv.errorsText(validateSummary.errors));
    assert.equal(packet.summary.schema_version, REVIEW_PACKET_SCHEMA_VERSION);
    assert.deepEqual(packet.summary.generated_artifacts, REQUIRED_PACKET_ARTIFACTS);
    assert.equal(packet.summary.tool.tool_name, REVIEW_PACKET_ROLLUP_TOOL_NAME);
    assert.equal(packet.summary.tool.tool_version, loadPackageVersion(process.cwd()));
    for (const artifact of REVIEW_PACKET_ROLLUP_ARTIFACTS) {
      assert.ok(packet.summary.tool.requested_outputs.includes(artifact), `${artifact} should be requested`);
      assert.ok(packet.summary.tool.generated_files.some((file) => file.path === artifact), `${artifact} should be generated`);
    }

    for (const evidenceRef of packet.evidence) {
      assert.equal(validateEvidence(evidenceRef), true, ajv.errorsText(validateEvidence.errors));
      assert.equal(/^[A-Za-z]:/.test(evidenceRef.path), false);
      assert.equal(evidenceRef.path.includes("\\"), false);
    }

    for (const action of packet.summary.recommended_actions) {
      assert.equal(validateAction(action), true, ajv.errorsText(validateAction.errors));
    }
  } finally {
    fs.rmSync(packet.outDir, { force: true, recursive: true });
  }
});

test("generated rollup JSON artifacts are deterministic with a fixed clock", async () => {
  const first = await generatePacket();
  const second = await generatePacket();

  try {
    assert.equal(first.summaryText, second.summaryText);
    assert.equal(first.dispositionIndexText, second.dispositionIndexText);
    assert.equal(first.evidenceText, second.evidenceText);
    assert.equal(first.indexText, second.indexText);
    assert.equal(first.groupsText, second.groupsText);
  } finally {
    fs.rmSync(first.outDir, { force: true, recursive: true });
    fs.rmSync(second.outDir, { force: true, recursive: true });
  }
});
