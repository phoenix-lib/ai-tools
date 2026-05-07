const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const { runAudit } = require("../../tools/contract-drift-auditor");
const {
  createTempOutputDir,
  fixtureInputDir,
  removeTempOutputDir
} = require("../shared/fixture-helpers");

const fixedClock = () => new Date("2026-05-07T00:00:00Z");
const schemaDir = path.join(process.cwd(), "standards/review-packet/schemas");

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

async function generatePacket(fixtureName) {
  const input = fixtureInputDir(fixtureName);
  const outDir = createTempOutputDir(fixtureName);

  await runAudit({
    projectDir: input,
    outDir,
    clock: fixedClock,
    argv: ["--project", fixtureName, "--out", "packet"]
  });

  return {
    outDir,
    summary: JSON.parse(fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8")),
    evidence: JSON.parse(fs.readFileSync(path.join(outDir, "EVIDENCE.json"), "utf8")),
    summaryText: fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8"),
    evidenceText: fs.readFileSync(path.join(outDir, "EVIDENCE.json"), "utf8")
  };
}

test("generated auditor packet validates against review packet schemas", async () => {
  const packet = await generatePacket("missing-command");
  const ajv = createAjv();
  const validateSummary = ajv.getSchema("https://ai-tools.local/schemas/review-packet/REVIEW-SUMMARY.schema.json");
  const validateEvidence = ajv.getSchema("https://ai-tools.local/schemas/review-packet/EVIDENCE-REF.schema.json");
  const validateAction = ajv.getSchema("https://ai-tools.local/schemas/review-packet/RECOMMENDED-ACTION.schema.json");

  try {
    assert.equal(validateSummary(packet.summary), true, ajv.errorsText(validateSummary.errors));

    for (const evidenceRef of packet.evidence) {
      assert.equal(validateEvidence(evidenceRef), true, ajv.errorsText(validateEvidence.errors));
      assert.equal(/^[A-Za-z]:/.test(evidenceRef.path), false);
      assert.equal(evidenceRef.path.includes("\\"), false);
    }

    for (const action of packet.summary.recommended_actions) {
      assert.equal(validateAction(action), true, ajv.errorsText(validateAction.errors));
    }
  } finally {
    removeTempOutputDir(packet.outDir);
  }
});

test("generated JSON artifacts are deterministic with a fixed clock", async () => {
  const first = await generatePacket("stale-source-layer");
  const second = await generatePacket("stale-source-layer");

  try {
    assert.equal(first.summaryText, second.summaryText);
    assert.equal(first.evidenceText, second.evidenceText);
  } finally {
    removeTempOutputDir(first.outDir);
    removeTempOutputDir(second.outDir);
  }
});
