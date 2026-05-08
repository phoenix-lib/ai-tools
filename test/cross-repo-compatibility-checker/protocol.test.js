const assert = require("node:assert/strict");
const test = require("node:test");
const {
  REQUEST_ID_PATTERN,
  THREAD_ID_PATTERN,
  fieldValue,
  hasAbsolutePath,
  isRepoQualifiedPath,
  parseMetadata,
  parseMirrorRequired,
  resolveRepoQualifiedPath
} = require("../../tools/cross-repo-compatibility-checker/protocol");

test("parseMetadata extracts top-level field values deterministically", () => {
  const metadata = parseMetadata([
    "# Capability Request",
    "",
    "Protocol version: 1.0",
    "Thread ID: THREAD-20260507-example",
    "Thread ID: THREAD-duplicate",
    "## Need",
    "Need: this is prose and still a field-shaped line"
  ].join("\n"));

  assert.equal(fieldValue(metadata, "Protocol version"), "1.0");
  assert.equal(fieldValue(metadata, "Thread ID"), "THREAD-20260507-example");
  assert.deepEqual(metadata.duplicates, ["Thread ID"]);
});

test("canonical request and thread ID regexes accept protocol IDs", () => {
  assert.match("REQ-20260507-ai-tools-to-ai-workspace-kit-review-packet-contract", REQUEST_ID_PATTERN);
  assert.match("THREAD-20260507-review-packet-semantics", THREAD_ID_PATTERN);
  assert.doesNotMatch("2026-05-07-ai-tools-review-packet-standard", REQUEST_ID_PATTERN);
});

test("parseMirrorRequired preserves malformed values", () => {
  assert.equal(parseMirrorRequired("true"), true);
  assert.equal(parseMirrorRequired("false"), false);
  assert.equal(parseMirrorRequired("yes"), null);
});

test("absolute and repo-qualified paths are classified", () => {
  assert.equal(hasAbsolutePath("Counterpart path: C:\\projects\\ai-tools\\file.md"), true);
  assert.equal(hasAbsolutePath("Counterpart path: /tmp/ai-tools/file.md"), true);
  assert.equal(hasAbsolutePath("Counterpart path: ai-tools/.planning/file.md"), false);
  assert.equal(isRepoQualifiedPath("ai-tools/.planning/file.md"), true);
  assert.equal(isRepoQualifiedPath("ai-workspace-kit/.planning/file.md"), true);
  assert.equal(isRepoQualifiedPath(".planning/file.md"), false);
});

test("repo-qualified paths resolve through explicit roots", () => {
  const resolved = resolveRepoQualifiedPath("ai-workspace-kit/.planning/cross-repo/inbox/request.md", {
    "ai-tools": "C:/projects/ai-tools",
    "ai-workspace-kit": "C:/projects/ai-workspace-kit"
  });

  assert.equal(resolved.repo, "ai-workspace-kit");
  assert.equal(resolved.relativePath, "ai-workspace-kit/.planning/cross-repo/inbox/request.md");
  assert.match(resolved.absolutePath.replace(/\\/g, "/"), /ai-workspace-kit\/\.planning\/cross-repo\/inbox\/request\.md$/);
});
