const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const SCHEMA_NAMES = [
  "EVIDENCE-REF.schema.json",
  "RECOMMENDED-ACTION.schema.json",
  "TOOL-MANIFEST.schema.json",
  "FINDING.schema.json",
  "REVIEW-SUMMARY.schema.json"
];

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "packet";
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function createReviewPacketAjv(rootDir = path.join(__dirname, "../..")) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);

  const schemaDir = path.join(rootDir, "standards", "review-packet", "schemas");
  for (const schemaName of SCHEMA_NAMES) {
    ajv.addSchema(readJsonFile(path.join(schemaDir, schemaName)));
  }

  return ajv;
}

function normalizeErrors(validate, fallbackMessage) {
  if (!validate.errors || validate.errors.length === 0) {
    return [fallbackMessage];
  }

  return validate.errors.map((error) => {
    const location = error.instancePath || "/";
    return `${location} ${error.message}`.trim();
  });
}

function resolvePacketDirs(packetDirs) {
  const seen = new Set();
  const resolved = [];

  for (const packetDir of packetDirs ?? []) {
    const absolutePath = path.resolve(packetDir);
    const key = process.platform === "win32" ? absolutePath.toLowerCase() : absolutePath;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    resolved.push(absolutePath);
  }

  if (resolved.length < 2) {
    throw new Error("review-packet-rollup requires at least two packet directories.");
  }

  return resolved;
}

function packetIdFor(index, packetDir) {
  return `packet-${String(index + 1).padStart(2, "0")}-${slug(path.basename(packetDir))}`;
}

function hashExistingArtifacts(packetDir) {
  const hashes = {};

  for (const fileName of ["REVIEW-SUMMARY.json", "EVIDENCE.json"]) {
    const filePath = path.join(packetDir, fileName);
    if (fs.existsSync(filePath)) {
      hashes[fileName] = sha256File(filePath);
    }
  }

  return hashes;
}

function invalidRecord({ errors, index, packetDir }) {
  return {
    artifact_hashes: hashExistingArtifacts(packetDir),
    evidence: [],
    generated_artifacts: [],
    input_path: packetDir,
    packet_id: packetIdFor(index, packetDir),
    schema_version: null,
    source_counts: null,
    source_status: null,
    source_tool_name: null,
    source_tool_version: null,
    summary: null,
    validation_errors: errors,
    validation_status: "invalid"
  };
}

function loadPacketRecord(packetDir, index, ajv) {
  const summaryPath = path.join(packetDir, "REVIEW-SUMMARY.json");
  const evidencePath = path.join(packetDir, "EVIDENCE.json");
  const errors = [];
  let summary = null;
  let evidence = null;

  if (!fs.existsSync(summaryPath)) {
    errors.push("Missing required REVIEW-SUMMARY.json.");
  } else {
    try {
      summary = readJsonFile(summaryPath);
    } catch (error) {
      errors.push(`REVIEW-SUMMARY.json is not valid JSON: ${error.message}`);
    }
  }

  if (!fs.existsSync(evidencePath)) {
    errors.push("Missing required EVIDENCE.json.");
  } else {
    try {
      evidence = readJsonFile(evidencePath);
    } catch (error) {
      errors.push(`EVIDENCE.json is not valid JSON: ${error.message}`);
    }
  }

  if (summary) {
    const validateSummary = ajv.getSchema("https://ai-tools.local/schemas/review-packet/REVIEW-SUMMARY.schema.json");
    if (validateSummary(summary) !== true) {
      errors.push(...normalizeErrors(validateSummary, "REVIEW-SUMMARY.json is schema-invalid."));
    }
  }

  if (evidence) {
    const validateEvidence = ajv.getSchema("https://ai-tools.local/schemas/review-packet/EVIDENCE-REF.schema.json");
    if (!Array.isArray(evidence)) {
      errors.push("EVIDENCE.json must be an array of evidence refs.");
    } else {
      evidence.forEach((entry, entryIndex) => {
        if (validateEvidence(entry) !== true) {
          const entryErrors = normalizeErrors(validateEvidence, "EVIDENCE.json entry is schema-invalid.");
          for (const entryError of entryErrors) {
            errors.push(`EVIDENCE.json[${entryIndex}]: ${entryError}`);
          }
        }
      });
    }
  }

  if (errors.length > 0) {
    return invalidRecord({ errors, index, packetDir });
  }

  return {
    artifact_hashes: hashExistingArtifacts(packetDir),
    evidence,
    generated_artifacts: summary.generated_artifacts ?? [],
    input_path: packetDir,
    packet_id: packetIdFor(index, packetDir),
    schema_version: summary.schema_version,
    source_counts: summary.counts,
    source_status: summary.status,
    source_tool_name: summary.tool?.tool_name ?? "unknown",
    source_tool_version: summary.tool?.tool_version ?? "unknown",
    summary,
    validation_errors: [],
    validation_status: "valid"
  };
}

function loadPacketDirectories(packetDirs, options = {}) {
  const resolvedDirs = resolvePacketDirs(packetDirs);
  const ajv = options.ajv ?? createReviewPacketAjv(options.rootDir);

  return resolvedDirs.map((packetDir, index) => loadPacketRecord(packetDir, index, ajv));
}

module.exports = {
  createReviewPacketAjv,
  loadPacketDirectories,
  packetIdFor,
  resolvePacketDirs,
  sha256File,
  slug
};
