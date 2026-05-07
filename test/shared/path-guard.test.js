const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { assertSafeOutputDir, isInsideOrEqual, realOrResolved } = require("../../shared/path-guard");
const {
  createTempOutputDir,
  fixtureInputDir,
  removeTempOutputDir
} = require("./fixture-helpers");

function withTempDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-path-guard-"));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

test("isInsideOrEqual detects equal, child, and sibling paths", () => withTempDir((dir) => {
  const target = path.join(dir, "target");
  const child = path.join(target, "reports");
  const sibling = path.join(dir, "target-reports");

  fs.mkdirSync(target);

  assert.equal(isInsideOrEqual(target, target), true);
  assert.equal(isInsideOrEqual(target, child), true);
  assert.equal(isInsideOrEqual(target, sibling), false);
}));

test("realOrResolved preserves missing output suffix after existing ancestor", () => withTempDir((dir) => {
  const missing = path.join(dir, "target", "reports", "next");
  const resolved = realOrResolved(missing);

  assert.equal(resolved.endsWith(path.join("target", "reports", "next")), true);
}));

test("assertSafeOutputDir rejects equal and child output paths before creation", () => withTempDir((dir) => {
  const target = path.join(dir, "target");
  fs.mkdirSync(target);

  assert.throws(
    () => assertSafeOutputDir(target, target),
    /Rejected unsafe output path[\s\S]*Target:[\s\S]*Output:/
  );

  const childOutput = path.join(target, "review-output");
  assert.throws(
    () => assertSafeOutputDir(target, childOutput),
    /outside the target project/
  );
  assert.equal(fs.existsSync(childOutput), false);
}));

test("assertSafeOutputDir allows sibling output paths", () => withTempDir((dir) => {
  const target = path.join(dir, "target");
  const siblingOutput = path.join(dir, "target-review");
  fs.mkdirSync(target);

  assert.doesNotThrow(() => assertSafeOutputDir(target, siblingOutput));
}));

test("assertSafeOutputDir rejects fixture-local outputs before creation", () => {
  const input = fixtureInputDir("clean-project");
  const childOutput = path.join(input, "review-output");
  const externalOutput = createTempOutputDir("clean-project");

  try {
    assert.throws(() => assertSafeOutputDir(input, input), /outside the target project/);
    assert.throws(() => assertSafeOutputDir(input, childOutput), /outside the target project/);
    assert.equal(fs.existsSync(childOutput), false);
    assert.doesNotThrow(() => assertSafeOutputDir(input, externalOutput));
  } finally {
    removeTempOutputDir(externalOutput);
  }
});
