const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { main, parseArgs } = require("../../tools/gates-scan/cli");

const compatibleFixture = path.join(process.cwd(), "test", "fixtures", "gates-scan", "compatible");

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
});

test("help prints usage", async () => {
  const io = captureIo();
  const code = await main(["--help"], io);
  assert.equal(code, 0);
  assert.match(io.output.stdout, /--project <path>/);
});

test("missing args returns non-zero", async () => {
  const io = captureIo();
  const code = await main(["--project", "a"], io);
  assert.equal(code, 2);
  assert.match(io.output.stderr, /Missing required/);
});

test("mutating flags are rejected", () => {
  for (const flag of ["--fix", "--write", "--pull", "--fetch", "--install"]) {
    assert.throws(() => parseArgs([flag]), /review-only/);
  }
});

test("output inside project is rejected before packet write", async () => {
  const unsafeOutput = path.join(compatibleFixture, "review-output");
  const io = captureIo();
  const code = await main(["--project", compatibleFixture, "--out", unsafeOutput], io);

  assert.equal(code, 2);
  assert.match(io.output.stderr, /Rejected unsafe output path/);
  assert.equal(fs.existsSync(path.join(unsafeOutput, "REVIEW-SUMMARY.json")), false);
});

test("external output path is accepted", async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-gates-scan-cli-"));
  const io = captureIo();

  try {
    const code = await main(["--project", compatibleFixture, "--out", outDir], io);
    assert.equal(code, 0);
    assert.match(io.output.stdout, /gates-scan completed: pass/);
    assert.equal(fs.existsSync(path.join(outDir, "REVIEW-SUMMARY.json")), true);
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});

