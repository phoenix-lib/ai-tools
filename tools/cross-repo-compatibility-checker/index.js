const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { assertSafeOutputDirOutsideAll } = require("../../shared/path-guard");
const {
  REQUIRED_ARTIFACTS,
  deriveCounts,
  writePacketArtifacts
} = require("../../shared/review-packet-renderer");
const {
  CROSS_REPO_COMPATIBILITY_CHECKER_TOOL_NAME,
  POLICY_HASH_SOURCES,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
} = require("../../shared/tool-metadata");
const { discoverRepositories } = require("./discovery");

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function createPolicyHashes(rootDir) {
  const hashes = {};

  for (const [policyName, relativePath] of Object.entries(POLICY_HASH_SOURCES)) {
    hashes[policyName] = sha256File(path.join(rootDir, relativePath));
  }

  for (const [policyName, relativePath] of Object.entries({
    cross_repo_protocol: "tools/cross-repo-compatibility-checker/protocol.js",
    cross_repo_checks: "tools/cross-repo-compatibility-checker/checks.js"
  })) {
    const absolutePath = path.join(rootDir, relativePath);
    if (fs.existsSync(absolutePath)) {
      hashes[policyName] = sha256File(absolutePath);
    }
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

function createToolManifest({ aiToolsDir, aiWorkspaceKitDir, argv, timestamp }) {
  const rootDir = path.join(__dirname, "../..");

  return {
    generated_files: REQUIRED_ARTIFACTS.map((artifact) => ({ path: artifact })),
    input: {
      args: argv ?? [],
      target_path: `ai-tools=${aiToolsDir};ai-workspace-kit=${aiWorkspaceKitDir}`
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
      display_name: "ai-tools + ai-workspace-kit",
      path: `ai-tools=${aiToolsDir};ai-workspace-kit=${aiWorkspaceKitDir}`
    },
    tool_name: CROSS_REPO_COMPATIBILITY_CHECKER_TOOL_NAME,
    tool_version: loadPackageVersion(rootDir)
  };
}

async function runCompatibilityCheck(options) {
  const aiToolsDir = path.resolve(options.aiToolsDir);
  const aiWorkspaceKitDir = path.resolve(options.aiWorkspaceKitDir);
  const outDir = path.resolve(options.outDir);
  const timestamp = (options.clock ?? (() => new Date()))().toISOString();

  assertSafeOutputDirOutsideAll([aiToolsDir, aiWorkspaceKitDir], outDir);

  const discovery = discoverRepositories({ aiToolsDir, aiWorkspaceKitDir });
  const { runChecks } = require("./checks");
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
      display_name: "ai-tools + ai-workspace-kit",
      path: `ai-tools=${aiToolsDir};ai-workspace-kit=${aiWorkspaceKitDir}`
    },
    tool: createToolManifest({
      aiToolsDir,
      aiWorkspaceKitDir,
      argv: options.argv ?? [],
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
  runCompatibilityCheck
};
