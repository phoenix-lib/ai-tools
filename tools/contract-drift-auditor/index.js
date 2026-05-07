const crypto = require("node:crypto");
const path = require("node:path");
const { assertSafeOutputDir } = require("../../shared/path-guard");
const {
  REQUIRED_ARTIFACTS,
  deriveCounts,
  writePacketArtifacts
} = require("../../shared/review-packet-renderer");
const {
  CONTRACT_DRIFT_AUDITOR_TOOL_NAME,
  POLICY_HASH_SOURCES,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
} = require("../../shared/tool-metadata");
const { discoverProject } = require("./discovery");
const { runChecks } = require("./checks");

function sha256File(filePath) {
  const fs = require("node:fs");
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function createPolicyHashes(rootDir) {
  const hashes = {};

  for (const [policyName, relativePath] of Object.entries(POLICY_HASH_SOURCES)) {
    hashes[policyName] = sha256File(path.join(rootDir, relativePath));
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

function createToolManifest({ projectDir, argv, timestamp }) {
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
      path: projectDir
    },
    tool_name: CONTRACT_DRIFT_AUDITOR_TOOL_NAME,
    tool_version: loadPackageVersion(rootDir)
  };
}

async function runAudit(options) {
  const projectDir = path.resolve(options.projectDir);
  const outDir = path.resolve(options.outDir);
  const timestamp = (options.clock ?? (() => new Date()))().toISOString();

  assertSafeOutputDir(projectDir, outDir);

  const discovery = discoverProject(projectDir);
  const checkResult = runChecks(discovery);
  const summary = {
    blockers: checkResult.blockers,
    counts: deriveCounts(checkResult),
    evidence_file: "EVIDENCE.json",
    findings: checkResult.findings,
    generated_artifacts: REQUIRED_ARTIFACTS,
    preserved_stricter_local_rules: checkResult.preserved_stricter_local_rules,
    recommended_actions: checkResult.recommended_actions,
    recommended_actions_file: "RECOMMENDED-ACTIONS.md",
    rejected_assumptions: checkResult.rejected_assumptions,
    required_decisions: checkResult.required_decisions,
    schema_version: REVIEW_PACKET_SCHEMA_VERSION,
    status: packetStatus(checkResult.findings, checkResult.blockers),
    target_project: {
      path: projectDir
    },
    tool: createToolManifest({
      projectDir,
      argv: options.argv ?? [],
      timestamp
    })
  };
  const packet = {
    summary,
    evidence: checkResult.evidence
  };
  const artifacts = writePacketArtifacts(packet, outDir);

  return {
    artifacts,
    discovery,
    packet,
    status: summary.status,
    outDir
  };
}

module.exports = {
  createToolManifest,
  packetStatus,
  runAudit
};
