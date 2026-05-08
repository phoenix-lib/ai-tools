const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { createReviewPacketAjv } = require("../../tools/review-packet-rollup/packet-loader");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "review-packet-rollup");

function readJson(...parts) {
  return JSON.parse(fs.readFileSync(path.join(fixtureRoot, ...parts), "utf8"));
}

test("schema helper validates valid fixture summary and evidence entries", () => {
  const ajv = createReviewPacketAjv();
  const validateSummary = ajv.getSchema("https://ai-tools.local/schemas/review-packet/REVIEW-SUMMARY.schema.json");
  const validateEvidence = ajv.getSchema("https://ai-tools.local/schemas/review-packet/EVIDENCE-REF.schema.json");
  const summary = readJson("valid-a", "REVIEW-SUMMARY.json");
  const evidence = readJson("valid-a", "EVIDENCE.json");

  assert.equal(validateSummary(summary), true, ajv.errorsText(validateSummary.errors));
  for (const evidenceRef of evidence) {
    assert.equal(validateEvidence(evidenceRef), true, ajv.errorsText(validateEvidence.errors));
  }
});

test("schema helper rejects invalid evidence entries", () => {
  const ajv = createReviewPacketAjv();
  const validateEvidence = ajv.getSchema("https://ai-tools.local/schemas/review-packet/EVIDENCE-REF.schema.json");
  const evidence = readJson("invalid-evidence-entry", "EVIDENCE.json");

  assert.equal(validateEvidence(evidence[0]), false);
});
