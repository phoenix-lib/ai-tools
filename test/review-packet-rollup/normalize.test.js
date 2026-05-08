const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const {
  createReviewPacketAjv,
  loadPacketDirectories
} = require("../../tools/review-packet-rollup/packet-loader");
const { normalizeLoadedPackets } = require("../../tools/review-packet-rollup/normalize");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "review-packet-rollup");

function fixture(...parts) {
  return path.join(fixtureRoot, ...parts);
}

function normalize(...packetDirs) {
  return normalizeLoadedPackets(loadPacketDirectories(packetDirs));
}

test("normalization prefixes duplicate source finding ids and refs", () => {
  const normalized = normalize(fixture("valid-a"), fixture("valid-b"));
  const ids = normalized.findings.map((finding) => finding.id);

  assert.ok(ids.includes("packet-01-valid-a.shared.finding"));
  assert.ok(ids.includes("packet-02-valid-b.shared.finding"));
  assert.equal(new Set(ids).size, ids.length);

  const alpha = normalized.findings.find((finding) => finding.id === "packet-01-valid-a.shared.finding");
  assert.deepEqual(alpha.evidence_refs, ["packet-01-valid-a.ev.shared"]);
  assert.deepEqual(alpha.recommended_action_refs, ["packet-01-valid-a.act.shared"]);
});

test("normalized findings remain schema-valid and carry no extra fields", () => {
  const normalized = normalize(fixture("valid-a"), fixture("valid-b"));
  const ajv = createReviewPacketAjv();
  const validateFinding = ajv.getSchema("https://ai-tools.local/schemas/review-packet/FINDING.schema.json");

  for (const finding of normalized.findings) {
    assert.equal(validateFinding(finding), true, ajv.errorsText(validateFinding.errors));
    assert.deepEqual(Object.keys(finding).sort(), [
      "confidence",
      "evidence_refs",
      "id",
      "recommended_action_refs",
      "severity",
      "source_check_id",
      "status_contribution",
      "summary",
      "title"
    ]);
  }
});

test("invalid packet input contributes a blocked rollup finding", () => {
  const normalized = normalize(fixture("valid-a"), fixture("invalid-missing-summary"));
  const finding = normalized.findings.find((item) => item.source_check_id === "rollup.packet.validation");

  assert.ok(finding);
  assert.equal(finding.status_contribution, "blocked");
  assert.equal(normalized.summary_model.status, "blocked");
  assert.equal(normalized.packet_index[1].validation_status, "invalid");
});

test("blockers and required decisions are copied with source attribution", () => {
  const normalized = normalize(fixture("valid-a"), fixture("blockers-decisions"));

  assert.equal(normalized.blockers.length, 1);
  assert.equal(normalized.required_decisions.length, 1);
  assert.equal(normalized.blockers[0].id, "packet-02-blockers-decisions.blocker.packet");
  assert.match(normalized.blockers[0].source, /packet-02-blockers-decisions/);
  assert.match(normalized.required_decisions[0].reason, /Source packet: packet-02-blockers-decisions/);
  assert.equal(normalized.summary_model.counts.blockers, 1);
  assert.equal(normalized.summary_model.counts.required_decisions, 1);
});

test("recommended actions are prefixed and retain mapped finding refs", () => {
  const normalized = normalize(fixture("valid-a"), fixture("valid-b"));
  const action = normalized.recommended_actions.find((item) => item.id === "packet-02-valid-b.act.shared");

  assert.ok(action);
  assert.deepEqual(action.finding_refs, ["packet-02-valid-b.shared.finding"]);
});
