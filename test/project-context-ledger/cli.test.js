const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { main, parseArgs } = require("../../tools/project-context-ledger/cli");

const fixtureProject = path.join(
  process.cwd(),
  "test",
  "fixtures",
  "project-context-ledger",
  "mature-ledger",
  "input"
);

function captureIo() {
  const output = { stderr: "", stdout: "" };
  return {
    output,
    stderr: { write: (value) => { output.stderr += value; } },
    stdout: { write: (value) => { output.stdout += value; } }
  };
}

test("parses project and output args", () => {
  const parsed = parseArgs(["--project", "a", "--out", "b"]);
  assert.equal(parsed.project, "a");
  assert.equal(parsed.out, "b");
  assert.equal(parsed.scope, "current");
});

test("parses explicit scope", () => {
  const parsed = parseArgs(["--project", "a", "--out", "b", "--scope", "history"]);
  assert.equal(parsed.scope, "history");
});

test("parses explicit since manifest", () => {
  const parsed = parseArgs(["--project", "a", "--out", "b", "--since-manifest", "CACHE-MANIFEST.json"]);
  assert.equal(parsed.sinceManifest, "CACHE-MANIFEST.json");
});

test("rejects invalid scope", () => {
  assert.throws(() => parseArgs(["--scope", "future"]), /Invalid scope/);
  assert.throws(() => parseArgs(["--scope"]), /Missing value/);
  assert.throws(() => parseArgs(["--since-manifest"]), /Missing value/);
});

test("help prints usage", async () => {
  const io = captureIo();
  const code = await main(["--help"], io);

  assert.equal(code, 0);
  assert.match(io.output.stdout, /project-context-ledger --project <path> --out <dir>/);
  assert.match(io.output.stdout, /--scope <value>/);
});

test("missing args returns non-zero", async () => {
  const io = captureIo();
  const code = await main(["--project", fixtureProject], io);

  assert.equal(code, 2);
  assert.match(io.output.stderr, /Missing required/);
});

test("mutating flags are rejected", () => {
  for (const flag of ["--fix", "--write", "--pull", "--fetch", "--install"]) {
    assert.throws(() => parseArgs([flag]), /review-only/);
  }
});

test("output inside project is rejected before packet write", async () => {
  const unsafeOutput = path.join(fixtureProject, "review-output");
  const io = captureIo();
  const code = await main(["--project", fixtureProject, "--out", unsafeOutput], io);

  assert.equal(code, 2);
  assert.match(io.output.stderr, /Rejected unsafe output path/);
  assert.equal(fs.existsSync(path.join(unsafeOutput, "REVIEW-SUMMARY.json")), false);
});

test("external output path is accepted", async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-ledger-cli-"));
  const io = captureIo();

  try {
    const code = await main(["--project", fixtureProject, "--out", outDir], io);
    assert.equal(code, 0);
    assert.match(io.output.stdout, /project-context-ledger completed: human_review_required/);
    assert.equal(fs.existsSync(path.join(outDir, "FACTS.json")), true);
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});
