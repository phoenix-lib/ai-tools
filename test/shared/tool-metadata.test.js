const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  CONTRACT_DRIFT_AUDITOR_TOOL_NAME,
  CROSS_REPO_COMPATIBILITY_CHECKER_TOOL_NAME,
  POLICY_HASH_SOURCES,
  REQUIRED_PACKET_ARTIFACTS,
  REVIEW_PACKET_SCHEMA_VERSION,
  loadPackageVersion
} = require("../../shared/tool-metadata");

const root = process.cwd();

test("exports stable review packet constants", () => {
  assert.equal(REVIEW_PACKET_SCHEMA_VERSION, "review-packet/v1");
  assert.equal(CONTRACT_DRIFT_AUDITOR_TOOL_NAME, "contract-drift-auditor");
  assert.equal(CROSS_REPO_COMPATIBILITY_CHECKER_TOOL_NAME, "cross-repo-compatibility-checker");
  assert.deepEqual(REQUIRED_PACKET_ARTIFACTS, [
    "REVIEW-SUMMARY.json",
    "EVIDENCE.json",
    "FINDINGS.md",
    "RECOMMENDED-ACTIONS.md"
  ]);
});

test("exports policy hash source paths", () => {
  assert.deepEqual(POLICY_HASH_SOURCES, {
    ignore_policy: "shared/ignore-policy.js",
    path_guard: "shared/path-guard.js",
    secret_policy: "shared/secret-policy.js"
  });

  for (const relativePath of Object.values(POLICY_HASH_SOURCES)) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, `${relativePath} should exist`);
  }
});

test("loads package version from package.json", () => {
  const packageVersion = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;

  assert.equal(loadPackageVersion(root), packageVersion);
});

test("package version lookup falls back deterministically", () => {
  assert.equal(loadPackageVersion(path.join(root, "does-not-exist")), "0.0.0");
});
