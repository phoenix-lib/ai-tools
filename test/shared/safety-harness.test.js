const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { canonicalJson } = require("../../shared/canonical-json");
const { walkProjectFiles } = require("../../shared/file-walker");
const { assertSafeOutputDir } = require("../../shared/path-guard");
const { isSecretLikePath, secretEvidenceRef } = require("../../shared/secret-policy");
const { treeHash } = require("../../shared/tree-hash");
const {
  assertFixtureInputClean,
  createTempOutputDir,
  fixtureInputDir,
  listRequiredFixtureNames,
  removeTempOutputDir,
  walkRelativeFiles
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

test("fixture-oriented output isolation rejects target-local output before creation", () => {
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

test("secret sentinel values never appear in generated path-only evidence output", () => {
  const input = fixtureInputDir("secret-like-files");
  const files = walkProjectFiles(input);
  const secretFiles = files.filter((relativePath) => isSecretLikePath(relativePath));
  const sentinelSourceText = secretFiles
    .map((relativePath) => fs.readFileSync(path.join(input, relativePath), "utf8"))
    .join("\n");

  assert.match(sentinelSourceText, /SECRET_SENTINEL_DO_NOT_LEAK/);

  const evidence = secretFiles.map((relativePath, index) => secretEvidenceRef({
    id: `secret.fixture.${index}`,
    path: relativePath,
    reason: "Secret-like fixture path is path-only evidence."
  }));
  const outputText = canonicalJson({ evidence, files });

  assert.doesNotMatch(outputText, /SECRET_SENTINEL_DO_NOT_LEAK/);
  for (const evidenceRef of evidence) {
    assert.equal(evidenceRef.path_only, true);
    assert.equal(evidenceRef.sha256, undefined);
  }
});

test("generated packets inside target fixtures are not walked as current evidence", () => {
  const files = walkProjectFiles(fixtureInputDir("generated-packet-inside-target"));

  assert.deepEqual(files, ["README.md"]);
  assert.equal(files.some((relativePath) => relativePath.startsWith("old-review/")), false);
  assert.equal(files.some((relativePath) => relativePath.startsWith("old-adoption/")), false);
});

test("read-only helper operations do not mutate any fixture input", () => {
  for (const name of listRequiredFixtureNames()) {
    const input = fixtureInputDir(name);
    const before = treeHash(input);
    const externalOutput = createTempOutputDir(name);

    try {
      assertSafeOutputDir(input, externalOutput);
      assert.throws(() => assertSafeOutputDir(input, path.join(input, "review-output")));

      const files = walkProjectFiles(input);
      const evidence = files
        .filter((relativePath) => isSecretLikePath(relativePath))
        .map((relativePath, index) => secretEvidenceRef({
          id: `fixture.${name}.${index}`,
          path: relativePath,
          reason: "Secret-like fixture path is path-only evidence."
        }));

      canonicalJson({ evidence, files });
      assert.equal(treeHash(input), before, `${name} mutated during helper operations`);
      assert.equal(path.relative(input, externalOutput).startsWith(".."), true);
    } finally {
      removeTempOutputDir(externalOutput);
    }
  }
});

test("all fixture scenarios are exercised by the integrated harness", () => {
  for (const name of listRequiredFixtureNames()) {
    assert.ok(walkRelativeFiles(fixtureInputDir(name)).length > 0, `${name} must contain files`);
  }
});
