const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { canonicalJson } = require("../../shared/canonical-json");
const { createFindingFingerprint } = require("../../shared/finding-fingerprint");
const { treeHash } = require("../../shared/tree-hash");
const { parseArgs } = require("../../tools/review-packet-rollup/cli");
const { runRollup } = require("../../tools/review-packet-rollup");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "review-packet-rollup");

function fixture(...parts) {
  return path.join(fixtureRoot, ...parts);
}

function readJson(outDir, fileName) {
  return JSON.parse(fs.readFileSync(path.join(outDir, fileName), "utf8"));
}

function writeDispositionFile(dir, records, overrides = {}) {
  const filePath = path.join(dir, "REVIEW-DISPOSITIONS.json");
  fs.writeFileSync(filePath, canonicalJson({
    dispositions: records,
    schema_version: "review-disposition/v1",
    ...overrides
  }), "utf8");
  return filePath;
}

function dispositionRecord(overrides = {}) {
  return {
    evidence_refs: ["packet-01-valid-a.ev.shared"],
    expires_at: "2026-06-08T00:00:00.000Z",
    finding_fingerprint: createFindingFingerprint({
      source_check_id: "alpha.shared",
      source_packet_id: "packet-01-valid-a",
      source_path: "src/shared.js",
      source_tool: "alpha-reviewer",
      target: "src/shared.js"
    }),
    finding_id: "shared.finding",
    id: "disp.alpha.shared",
    owner: "platform-team",
    reason: "Reviewed as active issue.",
    reviewed_at: "2026-05-08T00:00:00.000Z",
    schema_version: "review-disposition/v1",
    source_check_id: "alpha.shared",
    source_packet_id: "packet-01-valid-a",
    source_path: "src/shared.js",
    source_tool: "alpha-reviewer",
    status: "accepted_current_issue",
    tool_name: "review-packet-rollup",
    tool_version: "0.1.0",
    ...overrides
  };
}

async function rollupWithDisposition(records, options = {}) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-rollup-dispositions-out-"));
  const dispositionDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-rollup-dispositions-in-"));
  const dispositionFile = writeDispositionFile(dispositionDir, records, options.artifactOverrides);

  await runRollup({
    clock: () => new Date("2026-05-08T00:00:00Z"),
    dispositionFiles: [dispositionFile],
    outDir,
    packetDirs: options.packetDirs ?? [fixture("valid-a"), fixture("valid-b")]
  });

  return { dispositionDir, dispositionFile, outDir };
}

test("CLI parses disposition file inputs without changing required packets/out args", () => {
  const args = parseArgs([
    "--packets",
    "packet-a",
    "packet-b",
    "--dispositions",
    "reviews/REVIEW-DISPOSITIONS.json",
    "reviews/extra.json",
    "--out",
    "rollup"
  ]);

  assert.deepEqual(args.packets, ["packet-a", "packet-b"]);
  assert.deepEqual(args.dispositions, ["reviews/REVIEW-DISPOSITIONS.json", "reviews/extra.json"]);
  assert.equal(args.out, "rollup");
});

test("rollup joins active dispositions by fingerprint without changing source summary", async () => {
  const { dispositionDir, outDir } = await rollupWithDisposition([dispositionRecord()]);

  try {
    const summary = readJson(outDir, "REVIEW-SUMMARY.json");
    const index = readJson(outDir, "DISPOSITION-INDEX.json");

    assert.equal(summary.status, "human_review_required");
    assert.equal(summary.counts.total_findings, 4);
    assert.deepEqual(summary.generated_artifacts, [
      "REVIEW-SUMMARY.json",
      "EVIDENCE.json",
      "FINDINGS.md",
      "RECOMMENDED-ACTIONS.md"
    ]);
    assert.equal(index.counts.matched, 1);
    assert.equal(index.counts.expired, 0);
    assert.equal(index.counts.findings_without_active_disposition, 3);
    assert.deepEqual(index.matched[0].finding_refs, ["packet-01-valid-a.shared.finding"]);
    assert.equal(index.matched[0].disposition_id, "disp.alpha.shared");
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
    fs.rmSync(dispositionDir, { force: true, recursive: true });
  }
});

test("expired and unmatched dispositions remain visible in the disposition index", async () => {
  const unmatchedFingerprint = createFindingFingerprint({
    source_check_id: "missing.check",
    source_path: "missing.js",
    source_tool: "missing-tool",
    target: "missing.js"
  });
  const { dispositionDir, outDir } = await rollupWithDisposition([
    dispositionRecord({
      expires_at: "2026-05-01T00:00:00.000Z",
      id: "disp.alpha.expired",
      status: "accepted_historical_noise"
    }),
    dispositionRecord({
      evidence_refs: [],
      finding_fingerprint: unmatchedFingerprint,
      finding_id: "missing.finding",
      id: "disp.unmatched",
      source_check_id: "missing.check",
      source_packet_id: undefined,
      source_path: "missing.js",
      source_tool: "missing-tool"
    })
  ]);

  try {
    const index = readJson(outDir, "DISPOSITION-INDEX.json");

    assert.equal(index.counts.expired, 1);
    assert.equal(index.counts.unmatched, 1);
    assert.equal(index.review_required_context.expired_dispositions, 1);
    assert.equal(index.review_required_context.unmatched_dispositions, 1);
    assert.equal(index.expired[0].disposition_id, "disp.alpha.expired");
    assert.equal(index.unmatched[0].disposition_id, "disp.unmatched");
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
    fs.rmSync(dispositionDir, { force: true, recursive: true });
  }
});

test("fingerprint joins survive occurrence-normalized duplicate finding ids", async () => {
  const fingerprint = createFindingFingerprint({
    source_check_id: "duplicate",
    source_packet_id: "packet-01-a",
    source_path: "src/duplicate-a.js",
    source_tool: "duplicate-a",
    target: "src/duplicate-a.js"
  });
  const { dispositionDir, outDir } = await rollupWithDisposition([
    dispositionRecord({
      evidence_refs: ["packet-01-a.ev.file"],
      finding_fingerprint: fingerprint,
      finding_id: "duplicate.finding",
      id: "disp.duplicate",
      source_check_id: "duplicate",
      source_packet_id: "packet-01-a",
      source_path: "src/duplicate-a.js",
      source_tool: "duplicate-a"
    })
  ], {
    packetDirs: [fixture("duplicate-finding-ids", "a"), fixture("valid-a")]
  });

  try {
    const index = readJson(outDir, "DISPOSITION-INDEX.json");

    assert.equal(index.counts.matched, 1);
    assert.deepEqual(index.matched[0].finding_refs, [
      "packet-01-a.duplicate.finding",
      "packet-01-a.duplicate.finding.occurrence-2"
    ]);
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
    fs.rmSync(dispositionDir, { force: true, recursive: true });
  }
});

test("invalid disposition files are visible and input directories are not mutated", async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-rollup-invalid-dispositions-out-"));
  const dispositionDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-rollup-invalid-dispositions-in-"));
  const dispositionFile = path.join(dispositionDir, "REVIEW-DISPOSITIONS.json");
  fs.writeFileSync(dispositionFile, "{ invalid json", "utf8");
  const beforeDispositionDir = treeHash(dispositionDir);
  const beforePacketA = treeHash(fixture("valid-a"));
  const beforePacketB = treeHash(fixture("valid-b"));

  try {
    await runRollup({
      clock: () => new Date("2026-05-08T00:00:00Z"),
      dispositionFiles: [dispositionFile],
      outDir,
      packetDirs: [fixture("valid-a"), fixture("valid-b")]
    });
    const index = readJson(outDir, "DISPOSITION-INDEX.json");

    assert.equal(index.counts.invalid_files, 1);
    assert.match(index.invalid_files[0].errors[0], /not valid JSON/);
    assert.equal(beforeDispositionDir, treeHash(dispositionDir));
    assert.equal(beforePacketA, treeHash(fixture("valid-a")));
    assert.equal(beforePacketB, treeHash(fixture("valid-b")));
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
    fs.rmSync(dispositionDir, { force: true, recursive: true });
  }
});
