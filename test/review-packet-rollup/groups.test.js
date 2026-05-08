const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { loadPacketDirectories } = require("../../tools/review-packet-rollup/packet-loader");
const { buildRollupGroups } = require("../../tools/review-packet-rollup/groups");
const { normalizeLoadedPackets } = require("../../tools/review-packet-rollup/normalize");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "review-packet-rollup");

function fixture(...parts) {
  return path.join(fixtureRoot, ...parts);
}

function groups(...packetDirs) {
  const normalized = normalizeLoadedPackets(loadPacketDirectories(packetDirs));
  return buildRollupGroups(normalized);
}

function groupKeys(groupList) {
  return groupList.map((group) => group.key);
}

test("groups include all required mechanical dimensions", () => {
  const result = groups(fixture("valid-a"), fixture("valid-b"));

  assert.deepEqual(Object.keys(result).sort(), [
    "by_severity",
    "by_source_check_id",
    "by_source_path",
    "by_status",
    "by_status_contribution",
    "by_tool"
  ]);
  assert.ok(groupKeys(result.by_tool).includes("alpha-reviewer"));
  assert.ok(groupKeys(result.by_tool).includes("beta-reviewer"));
  assert.ok(groupKeys(result.by_severity).includes("medium"));
  assert.ok(groupKeys(result.by_status_contribution).includes("human_review_required"));
});

test("source path groups are derived from evidence refs", () => {
  const result = groups(fixture("valid-a"), fixture("valid-b"));
  const shared = result.by_source_path.find((group) => group.key === "src/shared.js");

  assert.ok(shared);
  assert.equal(shared.count, 2);
  assert.deepEqual(shared.finding_refs, [
    "packet-01-valid-a.shared.finding",
    "packet-02-valid-b.shared.finding"
  ]);
});

test("one finding with multiple evidence refs appears in multiple source path groups", () => {
  const result = groups(fixture("valid-a"), fixture("multiple-evidence-refs"));
  const one = result.by_source_path.find((group) => group.key === "src/one.js");
  const two = result.by_source_path.find((group) => group.key === "src/two.js");

  assert.ok(one);
  assert.ok(two);
  assert.deepEqual(one.finding_refs, ["packet-02-multiple-evidence-refs.multi.evidence"]);
  assert.deepEqual(two.finding_refs, ["packet-02-multiple-evidence-refs.multi.evidence"]);
});

test("groups do not include semantic disposition or priority fields", () => {
  const result = groups(fixture("valid-a"), fixture("valid-b"));
  const serialized = JSON.stringify(result);

  assert.equal(serialized.includes("safe_to_ignore"), false);
  assert.equal(serialized.includes("priority"), false);
  assert.equal(serialized.includes("suppressed"), false);
  assert.equal(serialized.includes("disposition"), false);
});
