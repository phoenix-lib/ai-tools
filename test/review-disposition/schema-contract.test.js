const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const schemaPath = path.join(process.cwd(), "standards/review-disposition/schemas/REVIEW-DISPOSITIONS.schema.json");

function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addSchema(JSON.parse(fs.readFileSync(schemaPath, "utf8")));
  return ajv;
}

function validArtifact(overrides = {}) {
  return {
    dispositions: [
      {
        evidence_refs: ["packet-01.ev.source"],
        expires_at: "2026-06-08T00:00:00.000Z",
        finding_fingerprint: "fp.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        finding_id: "packet-01.finding",
        id: "disp.packet-01.finding",
        owner: "platform-team",
        reason: "Reviewed and tracked as current issue.",
        reviewed_at: "2026-05-08T00:00:00.000Z",
        schema_version: "review-disposition/v1",
        source_check_id: "ledger.file.missing",
        source_path: "src/config/app.js",
        source_tool: "project-context-ledger",
        status: "accepted_current_issue",
        tool_name: "review-packet-rollup",
        tool_version: "0.1.0"
      }
    ],
    schema_version: "review-disposition/v1",
    ...overrides
  };
}

function validateArtifact(artifact) {
  const ajv = createAjv();
  const validate = ajv.getSchema("https://ai-tools.local/schemas/review-disposition/REVIEW-DISPOSITIONS.schema.json");
  return { ajv, validate, valid: validate(artifact) };
}

test("valid active disposition artifact passes", () => {
  const { ajv, validate, valid } = validateArtifact(validArtifact());
  assert.equal(valid, true, ajv.errorsText(validate.errors));
});

test("valid expired and provenance-rich disposition artifact passes", () => {
  const artifact = validArtifact({
    dispositions: [
      {
        ...validArtifact().dispositions[0],
        expires_at: "2026-05-01T00:00:00.000Z",
        source_packet_id: "packet-01-ledger",
        source_packet_path: "packet-inputs/packet-01-ledger",
        source_packet_sha256: "b".repeat(64),
        status: "accepted_historical_noise"
      }
    ],
    reviewed_at: "2026-05-08T00:00:00.000Z",
    reviewed_by: "ai-tools-maintainers",
    source_packet_id: "packet-01-ledger",
    source_packet_path: "packet-inputs/packet-01-ledger",
    source_packet_sha256: "b".repeat(64)
  });
  const { ajv, validate, valid } = validateArtifact(artifact);

  assert.equal(valid, true, ajv.errorsText(validate.errors));
});

test("schema rejects missing required disposition fields", () => {
  for (const field of ["finding_fingerprint", "owner", "expires_at", "schema_version"]) {
    const record = { ...validArtifact().dispositions[0] };
    delete record[field];
    const { valid } = validateArtifact(validArtifact({ dispositions: [record] }));

    assert.equal(valid, false, `${field} should be required`);
  }
});

test("schema rejects invalid status, version, fingerprint, dates, paths, and unknown fields", () => {
  const invalidCases = [
    { dispositions: [{ ...validArtifact().dispositions[0], status: "expired" }] },
    { schema_version: "review-disposition/v2" },
    { dispositions: [{ ...validArtifact().dispositions[0], finding_fingerprint: "finding-1" }] },
    { dispositions: [{ ...validArtifact().dispositions[0], expires_at: "tomorrow" }] },
    { dispositions: [{ ...validArtifact().dispositions[0], source_path: "C:\\project\\file.js" }] },
    { dispositions: [{ ...validArtifact().dispositions[0], extra: true }] },
    { extra: true }
  ];

  for (const invalidCase of invalidCases) {
    const { valid } = validateArtifact(validArtifact(invalidCase));
    assert.equal(valid, false, JSON.stringify(invalidCase));
  }
});
