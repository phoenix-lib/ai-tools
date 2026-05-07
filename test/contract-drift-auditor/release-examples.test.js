const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const { REQUIRED_PACKET_ARTIFACTS } = require("../../shared/tool-metadata");

const root = process.cwd();
const examplesDir = path.join(root, "tools/contract-drift-auditor/examples");
const schemaDir = path.join(root, "standards/review-packet/schemas");

const exampleStatuses = {
  "blocked-safety": "blocked",
  "human-review": "human_review_required",
  pass: "pass"
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readSchema(name) {
  return readJson(path.join(schemaDir, name));
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

function assertRelativeEvidencePath(evidenceRef) {
  assert.equal(/^[A-Za-z]:/.test(evidenceRef.path), false, `${evidenceRef.id} must not use a drive-letter path`);
  assert.equal(evidenceRef.path.startsWith("/"), false, `${evidenceRef.id} must not use an absolute path`);
  assert.equal(evidenceRef.path.includes("\\"), false, `${evidenceRef.id} must use / path separators`);
}

for (const [exampleName, expectedStatus] of Object.entries(exampleStatuses)) {
  test(`${exampleName} release packet example is schema-valid and internally consistent`, () => {
    const exampleDir = path.join(examplesDir, exampleName);
    const ajv = createAjv();
    const validateSummary = ajv.getSchema("https://ai-tools.local/schemas/review-packet/REVIEW-SUMMARY.schema.json");
    const validateEvidence = ajv.getSchema("https://ai-tools.local/schemas/review-packet/EVIDENCE-REF.schema.json");
    const validateAction = ajv.getSchema("https://ai-tools.local/schemas/review-packet/RECOMMENDED-ACTION.schema.json");

    for (const artifact of REQUIRED_PACKET_ARTIFACTS) {
      assert.equal(fs.existsSync(path.join(exampleDir, artifact)), true, `${exampleName} missing ${artifact}`);
    }

    const summary = readJson(path.join(exampleDir, "REVIEW-SUMMARY.json"));
    const evidence = readJson(path.join(exampleDir, "EVIDENCE.json"));
    const findingsMarkdown = fs.readFileSync(path.join(exampleDir, "FINDINGS.md"), "utf8");
    const actionsMarkdown = fs.readFileSync(path.join(exampleDir, "RECOMMENDED-ACTIONS.md"), "utf8");

    assert.equal(validateSummary(summary), true, ajv.errorsText(validateSummary.errors));
    assert.equal(summary.status, expectedStatus);
    assert.deepEqual(summary.generated_artifacts, REQUIRED_PACKET_ARTIFACTS);
    assert.deepEqual(summary.tool.requested_outputs, REQUIRED_PACKET_ARTIFACTS);
    assert.deepEqual(summary.tool.generated_files.map((artifact) => artifact.path), REQUIRED_PACKET_ARTIFACTS);

    for (const evidenceRef of evidence) {
      assert.equal(validateEvidence(evidenceRef), true, ajv.errorsText(validateEvidence.errors));
      assertRelativeEvidencePath(evidenceRef);
    }

    for (const action of summary.recommended_actions) {
      assert.equal(validateAction(action), true, ajv.errorsText(validateAction.errors));
      if (action.suggested_file) {
        assert.equal(/^[A-Za-z]:/.test(action.suggested_file), false);
        assert.equal(action.suggested_file.includes("\\"), false);
      }
    }

    assert.match(findingsMarkdown, new RegExp(`Status: ${summary.status}`));
    assert.match(findingsMarkdown, new RegExp(`Total findings: ${summary.counts.total_findings}`));
    assert.match(actionsMarkdown, new RegExp(`Status: ${summary.status}`));
    assert.match(actionsMarkdown, new RegExp(`Required decisions: ${summary.counts.required_decisions}`));
  });
}

test("blocked-safety example is explicitly synthetic", () => {
  const summary = readJson(path.join(examplesDir, "blocked-safety/REVIEW-SUMMARY.json"));
  const summaries = [
    ...summary.blockers.map((blocker) => blocker.reason),
    ...summary.findings.map((finding) => finding.summary)
  ].join("\n");

  assert.match(summaries, /Synthetic packet-shape example/);
  assert.match(summaries, /rejected before (packet artifacts are|writing packet files)/);
});
