const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { walkProjectFiles } = require("../../shared/file-walker");
const { fixtureInputDir } = require("./fixture-helpers");

function withTempDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-file-walker-"));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

function writeFile(root, relPath, text = "") {
  const target = path.join(root, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

test("walkProjectFiles returns sorted normalized relative file paths", () => withTempDir((dir) => {
  writeFile(dir, "src\\z.js");
  writeFile(dir, "src\\a.js");
  writeFile(dir, "README.md");

  assert.deepEqual(walkProjectFiles(dir), [
    "README.md",
    "src/a.js",
    "src/z.js"
  ]);
}));

test("walkProjectFiles ignores default noise directories", () => withTempDir((dir) => {
  writeFile(dir, "src/index.js");
  writeFile(dir, "node_modules/pkg/index.js");
  writeFile(dir, ".git/config");
  writeFile(dir, "coverage/report.json");
  writeFile(dir, "dist/bundle.js");
  writeFile(dir, ".tmp/cache.json");

  assert.deepEqual(walkProjectFiles(dir), ["src/index.js"]);
}));

test("walkProjectFiles ignores generated packet marker directories", () => withTempDir((dir) => {
  writeFile(dir, "src/index.js");
  writeFile(dir, "old-review/REVIEW-SUMMARY.json");
  writeFile(dir, "old-review/FINDINGS.md");
  writeFile(dir, "old-review/EVIDENCE.json");
  writeFile(dir, "old-review/RECOMMENDED-ACTIONS.md");
  writeFile(dir, "adoption/ADOPTION-REVIEW.md");
  writeFile(dir, "adoption/CONFLICTS.md");
  writeFile(dir, "adoption/MERGE-REVIEW.md");
  writeFile(dir, "adoption/ai-workspace.manifest.json");

  assert.deepEqual(walkProjectFiles(dir), ["src/index.js"]);
}));

test("walkProjectFiles ignores generated packet dirs inside target fixtures", () => {
  assert.deepEqual(walkProjectFiles(fixtureInputDir("generated-packet-inside-target")), [
    "README.md"
  ]);
});

test("walkProjectFiles ignores nested ai-workspace-kit checkouts", () => withTempDir((dir) => {
  writeFile(dir, "src/index.js");
  writeFile(dir, ".external/ai-workspace-kit/package.json", JSON.stringify({ name: "ai-workspace-kit" }));
  writeFile(dir, ".external/ai-workspace-kit/CORE-CONTRACT.md");

  assert.deepEqual(walkProjectFiles(dir), ["src/index.js"]);
}));

test("walkProjectFiles ignores fixture expected and output trees by default", () => withTempDir((dir) => {
  writeFile(dir, "test/fixtures/targets/demo/input/README.md");
  writeFile(dir, "test/fixtures/targets/demo/expected/REPORT.md");
  writeFile(dir, "test/fixtures/targets/demo/output/REPORT.md");

  assert.deepEqual(walkProjectFiles(dir), ["test/fixtures/targets/demo/input/README.md"]);
  assert.deepEqual(walkProjectFiles(dir, { includeFixtureInternals: true }), [
    "test/fixtures/targets/demo/expected/REPORT.md",
    "test/fixtures/targets/demo/input/README.md",
    "test/fixtures/targets/demo/output/REPORT.md"
  ]);
}));

test("walkProjectFiles enforces deterministic maxFiles limit", () => withTempDir((dir) => {
  writeFile(dir, "a.txt");
  writeFile(dir, "b.txt");

  assert.throws(() => walkProjectFiles(dir, { maxFiles: 1 }), /maxFiles/);
}));
