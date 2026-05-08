const fs = require("node:fs");
const path = require("node:path");

const REVIEW_PACKET_SCHEMA_VERSION = "review-packet/v1";
const CONTRACT_DRIFT_AUDITOR_TOOL_NAME = "contract-drift-auditor";
const CROSS_REPO_COMPATIBILITY_CHECKER_TOOL_NAME = "cross-repo-compatibility-checker";
const GATES_SCAN_TOOL_NAME = "gates-scan";
const PROJECT_CONTEXT_LEDGER_TOOL_NAME = "project-context-ledger";
const REVIEW_PACKET_ROLLUP_TOOL_NAME = "review-packet-rollup";

const REQUIRED_PACKET_ARTIFACTS = Object.freeze([
  "REVIEW-SUMMARY.json",
  "EVIDENCE.json",
  "FINDINGS.md",
  "RECOMMENDED-ACTIONS.md"
]);

const PROJECT_CONTEXT_LEDGER_ARTIFACTS = Object.freeze([
  "FACTS.json",
  "COMMANDS.json",
  "CONTRACTS.json",
  "SKILLS.json",
  "DECISIONS.json",
  "CACHE-MANIFEST.json"
]);

const PROJECT_CONTEXT_LEDGER_DIFF_ARTIFACT = "LEDGER-DIFF.json";

const REVIEW_PACKET_ROLLUP_ARTIFACTS = Object.freeze([
  "PACKET-INDEX.json",
  "ROLLUP-GROUPS.json",
  "DISPOSITION-INDEX.json"
]);

const POLICY_HASH_SOURCES = Object.freeze({
  ignore_policy: "shared/ignore-policy.js",
  path_guard: "shared/path-guard.js",
  secret_policy: "shared/secret-policy.js"
});

function loadPackageVersion(rootDir = path.join(__dirname, "..")) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
    return packageJson.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

module.exports = {
  CONTRACT_DRIFT_AUDITOR_TOOL_NAME,
  CROSS_REPO_COMPATIBILITY_CHECKER_TOOL_NAME,
  GATES_SCAN_TOOL_NAME,
  POLICY_HASH_SOURCES,
  PROJECT_CONTEXT_LEDGER_DIFF_ARTIFACT,
  PROJECT_CONTEXT_LEDGER_ARTIFACTS,
  PROJECT_CONTEXT_LEDGER_TOOL_NAME,
  REQUIRED_PACKET_ARTIFACTS,
  REVIEW_PACKET_ROLLUP_ARTIFACTS,
  REVIEW_PACKET_ROLLUP_TOOL_NAME,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
};
