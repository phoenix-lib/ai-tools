const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { assertSafeOutputDir } = require("../../shared/path-guard");
const {
  REQUIRED_ARTIFACTS,
  deriveCounts,
  writePacketArtifacts
} = require("../../shared/review-packet-renderer");
const { discoverProject } = require("./discovery");
const { runChecks } = require("./checks");

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function packageVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8")).version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
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
  return {
    generated_files: REQUIRED_ARTIFACTS.map((artifact) => ({ path: artifact })),
    input: {
      args: argv ?? [],
      target_path: projectDir
    },
    policy_hashes: {
      ignore_policy: sha256File(path.join(__dirname, "../../shared/ignore-policy.js")),
      path_guard: sha256File(path.join(__dirname, "../../shared/path-guard.js")),
      secret_policy: sha256File(path.join(__dirname, "../../shared/secret-policy.js"))
    },
    read_write_behavior: "review_output_only",
    requested_outputs: REQUIRED_ARTIFACTS,
    run_timestamp: timestamp,
    safety_profile: {
      review_only: true,
      secret_policy: "path-only-secret-evidence",
      target_mutation: "none"
    },
    schema_versions: {
      review_packet: "review-packet/v1"
    },
    source_commit: null,
    target_project: {
      path: projectDir
    },
    tool_name: "contract-drift-auditor",
    tool_version: packageVersion()
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
    schema_version: "review-packet/v1",
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
