const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { assertSafeOutputDir } = require("../../shared/path-guard");
const {
  REQUIRED_ARTIFACTS,
  deriveCounts,
  writePacketArtifacts
} = require("../../shared/review-packet-renderer");
const {
  GATES_SCAN_TOOL_NAME,
  POLICY_HASH_SOURCES,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
} = require("../../shared/tool-metadata");
const { discoverProject } = require("./discovery");
const { runChecks } = require("./checks");

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function createPolicyHashes(rootDir) {
  const hashes = {};

  for (const [policyName, relativePath] of Object.entries(POLICY_HASH_SOURCES)) {
    hashes[policyName] = sha256File(path.join(rootDir, relativePath));
  }

  const checksPath = path.join(rootDir, "tools/gates-scan/checks.js");
  if (fs.existsSync(checksPath)) {
    hashes.gates_scan_checks = sha256File(checksPath);
  }

  return hashes;
}

function packetStatus(findings, blockers) {
  if ((blockers ?? []).length > 0 || findings.some((finding) => finding.status_contribution === "blocked")) {
    return "blocked";
  }
  if (findings.some((finding) => finding.status_contribution === "human_review_required")) {
    return "human_review_required";
  }
  if (findings.length > 0) {
    return "info";
  }
  return "pass";
}

function createToolManifest({ argv, projectDir, timestamp }) {
  const rootDir = path.join(__dirname, "../..");

  return {
    generated_files: REQUIRED_ARTIFACTS.map((artifact) => ({ path: artifact })),
    input: {
      args: argv ?? [],
      target_path: projectDir
    },
    policy_hashes: createPolicyHashes(rootDir),
    read_write_behavior: "review_output_only",
    requested_outputs: REQUIRED_ARTIFACTS,
    run_timestamp: timestamp,
    safety_profile: {
      review_only: true,
      secret_policy: "path-only-secret-evidence",
      target_mutation: "none"
    },
    schema_versions: {
      review_packet: REVIEW_PACKET_SCHEMA_VERSION
    },
    source_commit: null,
    target_project: {
      display_name: "gate project",
      path: projectDir
    },
    tool_name: GATES_SCAN_TOOL_NAME,
    tool_version: loadPackageVersion(rootDir)
  };
}

async function runGatesScan(options) {
  const projectDir = path.resolve(options.projectDir);
  const outDir = path.resolve(options.outDir);
  const timestamp = (options.clock ?? (() => new Date()))().toISOString();

  assertSafeOutputDir(projectDir, outDir);

  const discovery = discoverProject({ projectDir });
  const checkResult = runChecks(discovery);
  const blockers = [...discovery.blockers, ...checkResult.blockers];
  const summaryModel = {
    blockers,
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
    generated_artifacts: REQUIRED_ARTIFACTS,
    recommended_actions_file: "RECOMMENDED-ACTIONS.md",
    schema_version: REVIEW_PACKET_SCHEMA_VERSION,
    status: packetStatus(checkResult.findings, blockers),
    target_project: {
      display_name: "gate project",
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
  const artifacts = writePacketArtifacts(packet, outDir);

  return {
    artifacts,
    discovery,
    outDir,
    packet,
    status: summary.status
  };
}

module.exports = {
  createToolManifest,
  packetStatus,
  runGatesScan
};

