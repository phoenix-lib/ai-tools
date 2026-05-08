const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { canonicalJson } = require("../../shared/canonical-json");
const { assertSafeOutputDirOutsideAll } = require("../../shared/path-guard");
const { deriveCounts, writePacketArtifacts } = require("../../shared/review-packet-renderer");
const {
  POLICY_HASH_SOURCES,
  REQUIRED_PACKET_ARTIFACTS,
  REVIEW_PACKET_ROLLUP_ARTIFACTS,
  REVIEW_PACKET_ROLLUP_TOOL_NAME,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
} = require("../../shared/tool-metadata");
const { buildRollupGroups } = require("./groups");
const { loadPacketDirectories, resolvePacketDirs } = require("./packet-loader");
const { normalizeLoadedPackets } = require("./normalize");
const { buildDispositionIndex } = require("./dispositions");

const ALL_ARTIFACTS = Object.freeze([...REQUIRED_PACKET_ARTIFACTS, ...REVIEW_PACKET_ROLLUP_ARTIFACTS]);

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function createPolicyHashes(rootDir) {
  const hashes = {};

  for (const [policyName, relativePath] of Object.entries(POLICY_HASH_SOURCES)) {
    const absolutePath = path.join(rootDir, relativePath);
    if (fs.existsSync(absolutePath)) {
      hashes[policyName] = sha256File(absolutePath);
    }
  }

  for (const [policyName, relativePath] of Object.entries({
    review_packet_rollup_groups: "tools/review-packet-rollup/groups.js",
    review_packet_rollup_normalize: "tools/review-packet-rollup/normalize.js",
    review_packet_rollup_packet_loader: "tools/review-packet-rollup/packet-loader.js",
    review_packet_rollup_dispositions: "tools/review-packet-rollup/dispositions.js",
    review_disposition_schema: "standards/review-disposition/schemas/REVIEW-DISPOSITIONS.schema.json"
  })) {
    const absolutePath = path.join(rootDir, relativePath);
    if (fs.existsSync(absolutePath)) {
      hashes[policyName] = sha256File(absolutePath);
    }
  }

  return hashes;
}

function createToolManifest({ argv, packetDirs, timestamp }) {
  const rootDir = path.join(__dirname, "../..");

  return {
    generated_files: ALL_ARTIFACTS.map((artifact) => ({ path: artifact })),
    input: {
      args: argv ?? [],
      target_path: packetDirs.join(";")
    },
    policy_hashes: createPolicyHashes(rootDir),
    read_write_behavior: "review_output_only",
    requested_outputs: ALL_ARTIFACTS,
    run_timestamp: timestamp,
    safety_profile: {
      review_only: true,
      secret_policy: "packet-evidence-only",
      target_mutation: "none"
    },
    schema_versions: {
      review_packet: REVIEW_PACKET_SCHEMA_VERSION,
      review_packet_rollup: "review-packet-rollup/v1"
    },
    source_commit: null,
    target_project: {
      path: "review-packet-rollup"
    },
    tool_name: REVIEW_PACKET_ROLLUP_TOOL_NAME,
    tool_version: loadPackageVersion(rootDir)
  };
}

async function runRollup(options) {
  const packetDirs = resolvePacketDirs(options.packetDirs);
  const outDir = path.resolve(options.outDir);
  const timestamp = (options.clock ?? (() => new Date()))().toISOString();

  assertSafeOutputDirOutsideAll(packetDirs, outDir);

  const packetRecords = loadPacketDirectories(packetDirs);
  const normalized = normalizeLoadedPackets(packetRecords);
  const groups = buildRollupGroups(normalized);
  const dispositionIndex = buildDispositionIndex(normalized, {
    dispositionFiles: options.dispositionFiles ?? [],
    now: new Date(timestamp),
    rootDir: path.join(__dirname, "../..")
  });
  const summaryModel = {
    blockers: normalized.blockers,
    findings: normalized.findings,
    preserved_stricter_local_rules: normalized.preserved_stricter_local_rules,
    recommended_actions: normalized.recommended_actions,
    rejected_assumptions: normalized.rejected_assumptions,
    required_decisions: normalized.required_decisions
  };
  const summary = {
    ...summaryModel,
    counts: deriveCounts(summaryModel),
    evidence_file: "EVIDENCE.json",
    generated_artifacts: REQUIRED_PACKET_ARTIFACTS,
    recommended_actions_file: "RECOMMENDED-ACTIONS.md",
    schema_version: REVIEW_PACKET_SCHEMA_VERSION,
    status: normalized.summary_model.status,
    target_project: {
      path: "review-packet-rollup"
    },
    tool: createToolManifest({
      argv: options.argv ?? [],
      packetDirs,
      timestamp
    })
  };
  const packet = {
    evidence: normalized.evidence,
    summary
  };

  const packetArtifacts = writePacketArtifacts(packet, outDir);
  const rollupArtifacts = {
    "DISPOSITION-INDEX.json": canonicalJson(dispositionIndex),
    "PACKET-INDEX.json": canonicalJson(normalized.packet_index),
    "ROLLUP-GROUPS.json": canonicalJson(groups)
  };

  for (const [fileName, content] of Object.entries(rollupArtifacts)) {
    fs.writeFileSync(path.join(outDir, fileName), content, "utf8");
  }

  return {
    artifacts: {
      ...packetArtifacts,
      ...rollupArtifacts
    },
    groups,
    disposition_index: dispositionIndex,
    normalized,
    outDir,
    packet,
    packet_index: normalized.packet_index,
    status: summary.status
  };
}

module.exports = {
  ALL_ARTIFACTS,
  createToolManifest,
  runRollup
};
