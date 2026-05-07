const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "targets");
const requiredFixtureNames = [
  "clean-project",
  "mature-ai-project",
  "stale-source-layer",
  "missing-command",
  "secret-like-files",
  "mixed-package-managers",
  "generated-packet-inside-target"
];

function fixtureInputDir(name) {
  return path.join(fixtureRoot, name, "input");
}

function listRequiredFixtureNames() {
  return [...requiredFixtureNames];
}

function createTempOutputDir(name) {
  const safeName = name.replace(/[^a-z0-9._-]/gi, "-");
  return fs.mkdtempSync(path.join(os.tmpdir(), `ai-tools-${safeName}-out-`));
}

function removeTempOutputDir(dir) {
  fs.rmSync(dir, { force: true, recursive: true });
}

function walkRelativeFiles(root) {
  const files = [];

  function visit(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
      } else if (entry.isFile()) {
        files.push(path.relative(root, absolutePath).replace(/\\/g, "/"));
      }
    }
  }

  visit(root);
  return files.sort();
}

function readOutputText(root) {
  return walkRelativeFiles(root)
    .map((relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8"))
    .join("\n");
}

function assertFixtureInputClean(name, assert) {
  const inputDir = fixtureInputDir(name);
  const files = walkRelativeFiles(inputDir);
  const badFile = files.find((relativePath) => /(^|\/)(expected|output)(\/|$)/.test(relativePath));

  assert.equal(badFile, undefined, `${name} input must not contain committed expected/output run files`);
}

module.exports = {
  assertFixtureInputClean,
  createTempOutputDir,
  fixtureInputDir,
  fixtureRoot,
  listRequiredFixtureNames,
  readOutputText,
  removeTempOutputDir,
  walkRelativeFiles
};
