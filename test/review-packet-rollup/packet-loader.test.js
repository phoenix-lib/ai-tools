const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const {
  loadPacketDirectories,
  resolvePacketDirs
} = require("../../tools/review-packet-rollup/packet-loader");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "review-packet-rollup");

function fixture(...parts) {
  return path.join(fixtureRoot, ...parts);
}

test("loader validates two packet directories and records deterministic metadata", () => {
  const packets = loadPacketDirectories([fixture("valid-a"), fixture("valid-b")]);

  assert.equal(packets.length, 2);
  assert.equal(packets[0].packet_id, "packet-01-valid-a");
  assert.equal(packets[1].packet_id, "packet-02-valid-b");
  assert.equal(packets[0].validation_status, "valid");
  assert.equal(packets[0].source_tool_name, "alpha-reviewer");
  assert.equal(packets[0].source_tool_version, "0.1.0");
  assert.equal(packets[0].source_status, "human_review_required");
  assert.equal(packets[0].schema_version, "review-packet/v1");
  assert.match(packets[0].artifact_hashes["REVIEW-SUMMARY.json"], /^[a-f0-9]{64}$/);
  assert.match(packets[0].artifact_hashes["EVIDENCE.json"], /^[a-f0-9]{64}$/);
});

test("loader de-duplicates packet directories while preserving input order", () => {
  const dirs = resolvePacketDirs([fixture("valid-a"), fixture("valid-a"), fixture("valid-b")]);

  assert.deepEqual(dirs, [fixture("valid-a"), fixture("valid-b")].map((dir) => path.resolve(dir)));
});

test("loader rejects fewer than two packet directories", () => {
  assert.throws(
    () => loadPacketDirectories([fixture("valid-a")]),
    /at least two packet directories/
  );
});

test("loader records missing summary as invalid without dropping valid packets", () => {
  const packets = loadPacketDirectories([fixture("valid-a"), fixture("invalid-missing-summary")]);

  assert.equal(packets[0].validation_status, "valid");
  assert.equal(packets[1].validation_status, "invalid");
  assert.match(packets[1].validation_errors.join("\n"), /Missing required REVIEW-SUMMARY/);
});

test("loader records invalid evidence entries as invalid packet input", () => {
  const packets = loadPacketDirectories([fixture("valid-a"), fixture("invalid-evidence-entry")]);

  assert.equal(packets[1].validation_status, "invalid");
  assert.match(packets[1].validation_errors.join("\n"), /EVIDENCE\.json\[0\]/);
  assert.match(packets[1].validation_errors.join("\n"), /sha256/);
});
