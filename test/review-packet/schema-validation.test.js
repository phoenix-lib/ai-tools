const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const schemaDir = path.join(process.cwd(), "standards/review-packet/schemas");
const exampleDir = path.join(process.cwd(), "standards/review-packet/examples");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), "utf8"));
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

function loadPacket(name) {
  const packetDir = path.join(exampleDir, name);
  return {
    evidence: JSON.parse(fs.readFileSync(path.join(packetDir, "EVIDENCE.json"), "utf8")),
    findingsMarkdown: fs.readFileSync(path.join(packetDir, "FINDINGS.md"), "utf8"),
    recommendedActionsMarkdown: fs.readFileSync(path.join(packetDir, "RECOMMENDED-ACTIONS.md"), "utf8"),
    summary: JSON.parse(fs.readFileSync(path.join(packetDir, "REVIEW-SUMMARY.json"), "utf8"))
  };
}

function assertSummaryCounts(summary) {
  const severityCounts = {
    critical: 0,
    high: 0,
    info: 0,
    low: 0,
    medium: 0
  };

  for (const finding of summary.findings) {
    severityCounts[finding.severity] += 1;
  }

  assert.equal(summary.counts.total_findings, summary.findings.length);
  assert.deepEqual(summary.counts.findings_by_severity, severityCounts);
  assert.equal(summary.counts.blockers, summary.blockers.length);
  assert.equal(summary.counts.required_decisions, summary.required_decisions.length);
  assert.equal(summary.counts.rejected_assumptions, summary.rejected_assumptions.length);
  assert.equal(
    summary.counts.preserved_stricter_local_rules,
    summary.preserved_stricter_local_rules.length
  );
}

function assertMarkdownProjection(summary, markdown) {
  assert.match(markdown, new RegExp(`Status: ${summary.status}`));
  assert.match(markdown, new RegExp(`Total findings: ${summary.counts.total_findings}`));
  assert.match(markdown, new RegExp(`Required decisions: ${summary.counts.required_decisions}`));
}

test("schemas are valid JSON", () => {
  for (const schemaName of [
    "EVIDENCE-REF.schema.json",
    "FINDING.schema.json",
    "RECOMMENDED-ACTION.schema.json",
    "REVIEW-SUMMARY.schema.json",
    "TOOL-MANIFEST.schema.json"
  ]) {
    assert.ok(readSchema(schemaName).$schema, `${schemaName} must declare $schema`);
  }
});

test("example packet summaries validate against REVIEW-SUMMARY schema", () => {
  const ajv = createAjv();
  const validateSummary = ajv.getSchema(
    "https://ai-tools.local/schemas/review-packet/REVIEW-SUMMARY.schema.json"
  );

  for (const packetName of ["pass", "human-review"]) {
    const packet = loadPacket(packetName);
    assert.equal(
      validateSummary(packet.summary),
      true,
      `${packetName} summary failed validation: ${ajv.errorsText(validateSummary.errors)}`
    );
  }
});

test("evidence and recommended actions validate against focused schemas", () => {
  const ajv = createAjv();
  const validateEvidence = ajv.getSchema(
    "https://ai-tools.local/schemas/review-packet/EVIDENCE-REF.schema.json"
  );
  const validateAction = ajv.getSchema(
    "https://ai-tools.local/schemas/review-packet/RECOMMENDED-ACTION.schema.json"
  );

  for (const packetName of ["pass", "human-review"]) {
    const packet = loadPacket(packetName);

    for (const evidenceRef of packet.evidence) {
      assert.equal(
        validateEvidence(evidenceRef),
        true,
        `${packetName} evidence failed validation: ${ajv.errorsText(validateEvidence.errors)}`
      );

      if (evidenceRef.path_only) {
        assert.equal(evidenceRef.sha256, undefined, "path-only evidence must not include sha256");
      }
    }

    for (const action of packet.summary.recommended_actions) {
      assert.equal(
        validateAction(action),
        true,
        `${packetName} action failed validation: ${ajv.errorsText(validateAction.errors)}`
      );
    }
  }
});

test("summary counts match findings and Markdown projections", () => {
  for (const packetName of ["pass", "human-review"]) {
    const packet = loadPacket(packetName);

    assertSummaryCounts(packet.summary);
    assertMarkdownProjection(packet.summary, packet.findingsMarkdown);
    assertMarkdownProjection(packet.summary, packet.recommendedActionsMarkdown);
  }
});

test("required artifact JSON files parse", () => {
  for (const relativePath of [
    "standards/review-packet/examples/pass/REVIEW-SUMMARY.json",
    "standards/review-packet/examples/pass/EVIDENCE.json",
    "standards/review-packet/examples/human-review/REVIEW-SUMMARY.json",
    "standards/review-packet/examples/human-review/EVIDENCE.json"
  ]) {
    assert.doesNotThrow(() => readJson(relativePath));
  }
});
