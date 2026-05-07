const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const { treeHash } = require("../../shared/tree-hash");
const {
  assertFixtureInputClean,
  fixtureInputDir,
  listRequiredFixtureNames
} = require("./fixture-helpers");

test("all required fixture scenarios exist with input directories", () => {
  assert.deepEqual(listRequiredFixtureNames(), [
    "clean-project",
    "mature-ai-project",
    "stale-source-layer",
    "missing-command",
    "secret-like-files",
    "mixed-package-managers",
    "generated-packet-inside-target"
  ]);

  for (const name of listRequiredFixtureNames()) {
    assert.equal(fs.statSync(fixtureInputDir(name)).isDirectory(), true, `${name} must have input/`);
  }
});

test("fixture input trees do not contain committed expected or output run dirs", () => {
  for (const name of listRequiredFixtureNames()) {
    assertFixtureInputClean(name, assert);
  }
});

test("every fixture input can be tree-hashed", () => {
  for (const name of listRequiredFixtureNames()) {
    assert.match(treeHash(fixtureInputDir(name)), /^[a-f0-9]{64}$/, `${name} must hash`);
  }
});
