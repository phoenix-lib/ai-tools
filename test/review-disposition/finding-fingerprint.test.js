const assert = require("node:assert/strict");
const test = require("node:test");
const {
  createFindingFingerprint,
  fingerprintInput,
  normalizePath
} = require("../../shared/finding-fingerprint");

const baseInput = Object.freeze({
  source_check_id: "ledger.file.missing",
  source_packet_id: "packet-01-ledger",
  source_path: "src\\config\\app.js",
  source_tool: "project-context-ledger",
  target: "src/config/app.js"
});

test("fingerprint is deterministic and shaped as fp sha256", () => {
  const first = createFindingFingerprint(baseInput);
  const second = createFindingFingerprint({ ...baseInput });

  assert.equal(first, second);
  assert.match(first, /^fp\.[a-f0-9]{64}$/);
});

test("path normalization is stable across slash variants", () => {
  const backslash = createFindingFingerprint({
    ...baseInput,
    source_path: "src\\config\\app.js",
    target: "src\\config\\app.js"
  });
  const slash = createFindingFingerprint({
    ...baseInput,
    source_path: "./src/config/app.js",
    target: "./src/config/app.js"
  });

  assert.equal(backslash, slash);
  assert.equal(normalizePath("src\\config\\app.js"), "src/config/app.js");
});

test("missing source path uses unknown bucket", () => {
  const input = fingerprintInput({
    source_check_id: "check",
    source_tool: "tool",
    target: "target"
  });

  assert.equal(input.source_path, "unknown");
});

test("mutable finding fields do not affect fingerprint", () => {
  const first = createFindingFingerprint({
    ...baseInput,
    id: "packet-01.finding",
    severity: "high",
    status_contribution: "human_review_required",
    summary: "First summary",
    title: "First title"
  });
  const second = createFindingFingerprint({
    ...baseInput,
    id: "packet-01.finding.occurrence-2",
    severity: "low",
    status_contribution: "info",
    summary: "Updated summary",
    title: "Updated title"
  });

  assert.equal(first, second);
});

test("stable fields change fingerprint", () => {
  const original = createFindingFingerprint(baseInput);

  for (const changed of [
    { source_tool: "review-packet-rollup" },
    { source_check_id: "different.check" },
    { source_path: "src/other.js" },
    { target: "src/other.js" },
    { source_packet_id: "packet-02-ledger" }
  ]) {
    assert.notEqual(createFindingFingerprint({ ...baseInput, ...changed }), original);
  }
});
