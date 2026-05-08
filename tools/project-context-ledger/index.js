const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { assertSafeOutputDir } = require("../../shared/path-guard");
const {
  deriveCounts,
  writePacketArtifacts
} = require("../../shared/review-packet-renderer");
const {
  POLICY_HASH_SOURCES,
  PROJECT_CONTEXT_LEDGER_ARTIFACTS,
  PROJECT_CONTEXT_LEDGER_TOOL_NAME,
  REQUIRED_PACKET_ARTIFACTS,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
} = require("../../shared/tool-metadata");
const { discoverProject } = require("./discovery");
const { buildLedger } = require("./ledger");
const { packetStatus } = require("./checks");

const ALL_ARTIFACTS = Object.freeze([...REQUIRED_PACKET_ARTIFACTS, ...PROJECT_CONTEXT_LEDGER_ARTIFACTS]);

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function createPolicyHashes(rootDir) {
  const hashes = {};

  for (const [policyName, relativePath] of Object.entries(POLICY_HASH_SOURCES)) {
    hashes[policyName] = sha256File(path.join(rootDir, relativePath));
  }

  for (const [policyName, relativePath] of Object.entries({
    project_context_ledger_checks: "tools/project-context-ledger/checks.js",
    project_context_ledger_discovery: "tools/project-context-ledger/discovery.js",
    project_context_ledger_ledger: "tools/project-context-ledger/ledger.js"
  })) {
    const absolutePath = path.join(rootDir, relativePath);
    if (fs.existsSync(absolutePath)) {
      hashes[policyName] = sha256File(absolutePath);
    }
  }

  return hashes;
}

function createToolManifest({ argv, projectDir, timestamp }) {
  const rootDir = path.join(__dirname, "../..");

  return {
    generated_files: ALL_ARTIFACTS.map((artifact) => ({ path: artifact })),
    input: {
      args: argv ?? [],
      target_path: projectDir
    },
    policy_hashes: createPolicyHashes(rootDir),
    read_write_behavior: "review_output_only",
    requested_outputs: ALL_ARTIFACTS,
    run_timestamp: timestamp,
    safety_profile: {
      review_only: true,
      secret_policy: "path-only-secret-evidence",
      target_mutation: "none"
    },
    schema_versions: {
      project_context_ledger: "project-context-ledger/v1",
      review_packet: REVIEW_PACKET_SCHEMA_VERSION
    },
    source_commit: null,
    target_project: {
      path: projectDir
    },
    tool_name: PROJECT_CONTEXT_LEDGER_TOOL_NAME,
    tool_version: loadPackageVersion(rootDir)
  };
}

async function runLedger(options) {
  const projectDir = path.resolve(options.projectDir);
  const outDir = path.resolve(options.outDir);
  const timestamp = (options.clock ?? (() => new Date()))().toISOString();

  assertSafeOutputDir(projectDir, outDir);

  const discovery = discoverProject({ projectDir });
  const ledgerResult = buildLedger(discovery, {
    argv: options.argv ?? [],
    outDir,
    timestamp
  });
  const checkResult = ledgerResult.result;
  const summaryModel = {
    blockers: checkResult.blockers,
    findings: checkResult.findings,
    preserved_stricter_local_rules: checkResult.preserved_stricter_local_rules,
    recommended_actions: checkResult.recommended_actions,
    rejected_assumptions: checkResult.rejected_assumptions,
    required_decisions: checkResult.required_decisions
  };
  const summary = {
    ...summaryModel,
    counts: deriveCounts(summaryModel),
    evidence_file: "EVIDENCE.json",
    generated_artifacts: REQUIRED_PACKET_ARTIFACTS,
    recommended_actions_file: "RECOMMENDED-ACTIONS.md",
    schema_version: REVIEW_PACKET_SCHEMA_VERSION,
    status: packetStatus(checkResult.findings, checkResult.blockers),
    target_project: {
      path: projectDir
    },
    tool: createToolManifest({
      argv: options.argv ?? [],
      projectDir,
      timestamp
    })
  };
  const packet = {
    evidence: checkResult.evidence,
    summary
  };

  const packetArtifacts = writePacketArtifacts(packet, outDir);
  fs.mkdirSync(outDir, { recursive: true });

  for (const [fileName, content] of Object.entries(ledgerResult.artifacts)) {
    fs.writeFileSync(path.join(outDir, fileName), content, "utf8");
  }

  return {
    artifacts: {
      ...packetArtifacts,
      ...ledgerResult.artifacts
    },
    discovery,
    ledger: ledgerResult.ledger,
    outDir,
    packet,
    status: summary.status
  };
}

module.exports = {
  ALL_ARTIFACTS,
  createToolManifest,
  runLedger
};
