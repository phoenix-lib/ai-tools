const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const { runLedger } = require("../../tools/project-context-ledger");
const { buildLedger } = require("../../tools/project-context-ledger/ledger");
const {
  PROJECT_CONTEXT_LEDGER_ARTIFACTS,
  PROJECT_CONTEXT_LEDGER_TOOL_NAME,
  REQUIRED_PACKET_ARTIFACTS,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
} = require("../../shared/tool-metadata");

const reviewSchemaDir = path.join(process.cwd(), "standards/review-packet/schemas");
const ledgerSchemaDir = path.join(process.cwd(), "standards/project-context-ledger/schemas");
const fixtureProject = path.join(
  process.cwd(),
  "test",
  "fixtures",
  "project-context-ledger",
  "mature-ledger",
  "input"
);
const ledgerPublicSchemaNames = [
  "FACTS.schema.json",
  "COMMANDS.schema.json",
  "CONTRACTS.schema.json",
  "SKILLS.schema.json",
  "DECISIONS.schema.json",
  "CACHE-MANIFEST.schema.json"
];

function readReviewSchema(name) {
  return JSON.parse(fs.readFileSync(path.join(reviewSchemaDir, name), "utf8"));
}

function readLedgerSchema(name) {
  return JSON.parse(fs.readFileSync(path.join(ledgerSchemaDir, name), "utf8"));
}

function createReviewAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);

  for (const schemaName of [
    "EVIDENCE-REF.schema.json",
    "RECOMMENDED-ACTION.schema.json",
    "TOOL-MANIFEST.schema.json",
    "FINDING.schema.json",
    "REVIEW-SUMMARY.schema.json"
  ]) {
    ajv.addSchema(readReviewSchema(schemaName));
  }

  return ajv;
}

function createLedgerAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addSchema(readLedgerSchema("LEDGER-COMMON.schema.json"));

  for (const schemaName of ledgerPublicSchemaNames) {
    ajv.addSchema(readLedgerSchema(schemaName));
  }

  return ajv;
}

async function generatePacket() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-ledger-schema-"));
  await runLedger({
    clock: () => new Date("2026-05-08T00:00:00Z"),
    outDir,
    projectDir: fixtureProject
  });

  return {
    cacheManifestText: fs.readFileSync(path.join(outDir, "CACHE-MANIFEST.json"), "utf8"),
    evidence: JSON.parse(fs.readFileSync(path.join(outDir, "EVIDENCE.json"), "utf8")),
    evidenceText: fs.readFileSync(path.join(outDir, "EVIDENCE.json"), "utf8"),
    factsText: fs.readFileSync(path.join(outDir, "FACTS.json"), "utf8"),
    ledgerArtifacts: Object.fromEntries(PROJECT_CONTEXT_LEDGER_ARTIFACTS.map((artifact) => [
      artifact,
      JSON.parse(fs.readFileSync(path.join(outDir, artifact), "utf8"))
    ])),
    ledgerTexts: Object.fromEntries(PROJECT_CONTEXT_LEDGER_ARTIFACTS.map((artifact) => [
      artifact,
      fs.readFileSync(path.join(outDir, artifact), "utf8")
    ])),
    outDir,
    summary: JSON.parse(fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8")),
    summaryText: fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8")
  };
}

test("generated ledger packet validates against review packet schemas", async () => {
  const packet = await generatePacket();
  const ajv = createReviewAjv();
  const validateSummary = ajv.getSchema("https://ai-tools.local/schemas/review-packet/REVIEW-SUMMARY.schema.json");
  const validateEvidence = ajv.getSchema("https://ai-tools.local/schemas/review-packet/EVIDENCE-REF.schema.json");
  const validateAction = ajv.getSchema("https://ai-tools.local/schemas/review-packet/RECOMMENDED-ACTION.schema.json");

  try {
    assert.equal(validateSummary(packet.summary), true, ajv.errorsText(validateSummary.errors));
    assert.equal(packet.summary.schema_version, REVIEW_PACKET_SCHEMA_VERSION);
    assert.deepEqual(packet.summary.generated_artifacts, REQUIRED_PACKET_ARTIFACTS);
    assert.equal(packet.summary.tool.tool_name, PROJECT_CONTEXT_LEDGER_TOOL_NAME);
    assert.equal(packet.summary.tool.tool_version, loadPackageVersion(process.cwd()));
    assert.equal(
      new Set(packet.summary.findings.map((finding) => finding.id)).size,
      packet.summary.findings.length,
      "finding ids should be stable and unique"
    );
    for (const artifact of PROJECT_CONTEXT_LEDGER_ARTIFACTS) {
      assert.ok(packet.summary.tool.requested_outputs.includes(artifact), `${artifact} should be requested`);
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

test("generated ledger artifacts validate against ledger schemas", async () => {
  const packet = await generatePacket();
  const ajv = createLedgerAjv();
  const evidenceIds = new Set(packet.evidence.map((ref) => ref.id));

  try {
    for (const artifact of PROJECT_CONTEXT_LEDGER_ARTIFACTS) {
      const schemaName = artifact.replace(".json", ".schema.json");
      const validate = ajv.getSchema(`https://ai-tools.local/schemas/project-context-ledger/${schemaName}`);
      assert.equal(validate(packet.ledgerArtifacts[artifact]), true, `${artifact}: ${ajv.errorsText(validate.errors)}`);
    }

    assert.equal(packet.ledgerArtifacts["CACHE-MANIFEST.json"].schema_version, "project-context-ledger/v1");
    assert.equal(packet.ledgerArtifacts["CACHE-MANIFEST.json"].scope, "current");
    assert.ok(packet.ledgerArtifacts["CACHE-MANIFEST.json"].scanned_sources.every((source) => typeof source.source_category === "string"));

    for (const artifact of PROJECT_CONTEXT_LEDGER_ARTIFACTS.filter((name) => name !== "CACHE-MANIFEST.json")) {
      const records = packet.ledgerArtifacts[artifact];
      assert.equal(
        new Set(records.map((record) => record.id)).size,
        records.length,
        `${artifact} record ids should be stable and unique`
      );

      for (const record of records) {
        assert.equal(typeof record.source_category, "string", `${artifact} ${record.id} should include source_category`);
        for (const evidenceRef of record.evidence_refs) {
          assert.equal(evidenceIds.has(evidenceRef), true, `${artifact} ${record.id} cites missing evidence ${evidenceRef}`);
        }
      }
    }
  } finally {
    fs.rmSync(packet.outDir, { force: true, recursive: true });
  }
});

test("duplicate ledger source records receive deterministic occurrence ids", () => {
  const result = buildLedger({
    contractFiles: [],
    fileSet: new Set(["AGENTS.md", "docs/KNOWN.md"]),
    files: ["AGENTS.md"],
    packageFiles: [],
    planningFiles: [],
    projectDir: fixtureProject,
    references: [
      {
        line: 1,
        path: "docs/KNOWN.md",
        source_layer: false,
        source_path: "AGENTS.md"
      },
      {
        line: 1,
        path: "docs/KNOWN.md",
        source_layer: false,
        source_path: "AGENTS.md"
      }
    ]
  }, {
    outDir: path.join(os.tmpdir(), "unused-ledger-out"),
    timestamp: "2026-05-08T00:00:00.000Z"
  });
  const ids = result.ledger["CONTRACTS.json"].map((record) => record.id);

  assert.deepEqual(ids, [
    "contract.reference.agents-md.1.docs-known-md",
    "contract.reference.agents-md.1.docs-known-md.occurrence-2"
  ]);
});

test("generated ledger JSON artifacts are deterministic with a fixed clock", async () => {
  const first = await generatePacket();
  const second = await generatePacket();

  try {
    assert.equal(first.summaryText, second.summaryText);
    assert.equal(first.evidenceText, second.evidenceText);
    for (const artifact of PROJECT_CONTEXT_LEDGER_ARTIFACTS) {
      assert.equal(first.ledgerTexts[artifact], second.ledgerTexts[artifact], `${artifact} should be deterministic`);
    }
  } finally {
    fs.rmSync(first.outDir, { force: true, recursive: true });
    fs.rmSync(second.outDir, { force: true, recursive: true });
  }
});
