const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { main, parseArgs } = require("../../tools/review-packet-rollup/cli");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "review-packet-rollup");

function fixture(...parts) {
  return path.join(fixtureRoot, ...parts);
}

function captureIo() {
  const output = { stderr: "", stdout: "" };
  return {
    output,
    stderr: { write: (value) => { output.stderr += value; } },
    stdout: { write: (value) => { output.stdout += value; } }
  };
}

test("parses packets and output args", () => {
  const parsed = parseArgs(["--packets", "a", "b", "--out", "c"]);

  assert.deepEqual(parsed.packets, ["a", "b"]);
  assert.equal(parsed.out, "c");
});

test("help prints usage", async () => {
  const io = captureIo();
  const code = await main(["--help"], io);

  assert.equal(code, 0);
  assert.match(io.output.stdout, /review-packet-rollup --packets <dir\.\.\.> --out <dir>/);
});

test("missing args and one packet return non-zero before writes", async () => {
  const io = captureIo();
  const code = await main(["--packets", fixture("valid-a"), "--out", "unused"], io);

  assert.equal(code, 2);
  assert.match(io.output.stderr, /at least two/);
});

test("mutating and source-running flags are rejected", () => {
  for (const flag of ["--fix", "--write", "--pull", "--fetch", "--install", "--run", "--execute"]) {
    assert.throws(() => parseArgs([flag]), /review-only/);
  }
});

test("phase 17 cli flags are not silently accepted in phase 13", () => {
  for (const flag of ["--format", "--quiet", "--fail-on"]) {
    assert.throws(() => parseArgs([flag]), /Unknown argument/);
  }
});

test("external output path is accepted", async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-rollup-cli-"));
  const io = captureIo();

  try {
    const code = await main(["--packets", fixture("valid-a"), fixture("valid-b"), "--out", outDir], io);
    assert.equal(code, 0);
    assert.match(io.output.stdout, /review-packet-rollup completed: human_review_required/);
    assert.equal(fs.existsSync(path.join(outDir, "PACKET-INDEX.json")), true);
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});
