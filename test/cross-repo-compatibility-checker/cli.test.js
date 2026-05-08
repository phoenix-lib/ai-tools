const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { main, parseArgs } = require("../../tools/cross-repo-compatibility-checker/cli");

const fixtureRoot = path.join(process.cwd(), "test", "fixtures", "cross-repo-compatibility", "compatible");

function captureIo() {
  const output = { stderr: "", stdout: "" };
  return {
    output,
    stderr: { write: (value) => { output.stderr += value; } },
    stdout: { write: (value) => { output.stdout += value; } }
  };
}

test("parses required ai-tools, ai-workspace-kit, and output args", () => {
  const parsed = parseArgs(["--ai-tools", "a", "--ai-workspace-kit", "b", "--out", "c"]);

  assert.equal(parsed.aiTools, "a");
  assert.equal(parsed.aiWorkspaceKit, "b");
  assert.equal(parsed.out, "c");
});

test("help prints usage", async () => {
  const io = captureIo();
  const code = await main(["--help"], io);

  assert.equal(code, 0);
  assert.match(io.output.stdout, /--ai-tools <path>/);
  assert.match(io.output.stdout, /--ai-workspace-kit <path>/);
});

test("missing required args returns non-zero", async () => {
  const io = captureIo();
  const code = await main(["--ai-tools", "a"], io);

  assert.equal(code, 2);
  assert.match(io.output.stderr, /Missing required/);
});

test("mutating flags are rejected", () => {
  for (const flag of ["--fix", "--write", "--pull", "--fetch", "--install"]) {
    assert.throws(() => parseArgs([flag]), /review-only/);
  }
});

test("output inside either input repository is rejected before packet write", async () => {
  const aiToolsDir = path.join(fixtureRoot, "ai-tools");
  const aiWorkspaceKitDir = path.join(fixtureRoot, "ai-workspace-kit");
  const unsafeOutput = path.join(aiWorkspaceKitDir, "review-output");
  const io = captureIo();
  const code = await main([
    "--ai-tools",
    aiToolsDir,
    "--ai-workspace-kit",
    aiWorkspaceKitDir,
    "--out",
    unsafeOutput
  ], io);

  assert.equal(code, 2);
  assert.match(io.output.stderr, /Rejected unsafe output path/);
  assert.equal(fs.existsSync(path.join(unsafeOutput, "REVIEW-SUMMARY.json")), false);
});

test("external output path is accepted", async () => {
  const aiToolsDir = path.join(fixtureRoot, "ai-tools");
  const aiWorkspaceKitDir = path.join(fixtureRoot, "ai-workspace-kit");
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-cross-repo-cli-"));
  const io = captureIo();

  try {
    const code = await main([
      "--ai-tools",
      aiToolsDir,
      "--ai-workspace-kit",
      aiWorkspaceKitDir,
      "--out",
      outDir
    ], io);

    assert.equal(code, 0);
    assert.equal(fs.existsSync(path.join(outDir, "REVIEW-SUMMARY.json")), true);
  } finally {
    fs.rmSync(outDir, { force: true, recursive: true });
  }
});
