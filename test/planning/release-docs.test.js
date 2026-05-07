const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assertIncludesAll(content, values, label) {
  for (const value of values) {
    assert.ok(content.includes(value), `${label} missing ${value}`);
  }
}

test("root README is the release entrypoint", () => {
  assert.equal(exists("README.md"), true, "README.md must exist");
  const readme = read("README.md");

  assertIncludesAll(
    readme,
    [
      "AI Tools",
      "contract-drift-auditor",
      "npm run contract-drift-auditor -- --project <path> --out <dir>",
      "node tools/contract-drift-auditor/cli.js --project <path> --out <dir>",
      "REVIEW-SUMMARY.json",
      "EVIDENCE.json",
      "FINDINGS.md",
      "RECOMMENDED-ACTIONS.md",
      "review-only",
      "No target project mutation",
      "No target command execution",
      "path-only evidence",
      "When to Use",
      "When Not to Use",
      "ai-workspace-kit",
      "optional evidence",
      "adoption/bootstrap"
    ],
    "root README"
  );
});

test("contract drift auditor docs explain usage, non-usage, safety, and packet semantics", () => {
  const docs = read("tools/contract-drift-auditor/README.md");

  assertIncludesAll(
    docs,
    [
      "When to Use",
      "When Not to Use",
      "Safety",
      "Output Interpretation",
      "Severity",
      "Confidence",
      "unknown",
      "stale",
      "path-only evidence",
      "recommended actions are guidance only",
      "Current Limitations",
      "Historical `.planning/phases/**` artifacts",
      "current contract/planning docs",
      "conservative text parsing",
      "ai-workspace-kit Compatibility",
      "optional external evidence"
    ],
    "auditor README"
  );
});

test("release readiness doc is checkable and preserves deferred boundaries", () => {
  assert.equal(exists("docs/RELEASE-READINESS.md"), true, "release readiness doc must exist");
  const docs = read("docs/RELEASE-READINESS.md");

  assertIncludesAll(
    docs,
    [
      "Definition of Done",
      "shared review packet schemas",
      "contract-drift-auditor",
      "REVIEW-SUMMARY.json",
      "secret",
      "path-only",
      "output is isolated",
      "non-mutation",
      "Manual Gate Review",
      "Self-Use Evidence",
      "CHANGELOG.md",
      "ai-workspace-kit",
      "optional external evidence",
      "XREPO-VALIDATOR-01",
      "GATELINT-01",
      "not part of the v1 release"
    ],
    "release readiness"
  );
});

test("release readiness documents portable self-audit guidance", () => {
  const docs = read("docs/RELEASE-READINESS.md");

  assertIncludesAll(
    docs,
    [
      "node tools/contract-drift-auditor/cli.js --project . --out <external-dir>",
      "`<external-dir>` must be outside the audited repository",
      "historical evidence",
      "Historical Phase 5 command",
      "Historical Phase 5 output path"
    ],
    "portable self-audit guidance"
  );

  const reusableCommandIndex = docs.indexOf("Reusable command:");
  assert.notEqual(reusableCommandIndex, -1, "release readiness must label reusable command");
  const reusableCommandLine = docs.slice(reusableCommandIndex, docs.indexOf("\n", reusableCommandIndex));
  assert.equal(reusableCommandLine.includes("C:\\Users"), false, "reusable self-audit command must not be machine-local");
});
