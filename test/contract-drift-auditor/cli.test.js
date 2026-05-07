const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { main, parseArgs } = require("../../tools/contract-drift-auditor/cli");
const {
  createTempOutputDir,
  fixtureInputDir,
  removeTempOutputDir
} = require("../shared/fixture-helpers");

function bufferIo() {
  const output = {
    stdout: "",
    stderr: ""
  };

  return {
    output,
    stdout: {
      write(text) {
        output.stdout += text;
      }
    },
    stderr: {
      write(text) {
        output.stderr += text;
      }
    }
  };
}

test("parses required project and output args", () => {
  assert.deepEqual(parseArgs(["--project", "a", "--out", "b"]), {
    project: "a",
    out: "b",
    help: false
  });
});

test("help prints usage", async () => {
  const io = bufferIo();
  const code = await main(["--help"], io);

  assert.equal(code, 0);
  assert.match(io.output.stdout, /contract-drift-auditor --project <path> --out <dir>/);
});

test("missing required args returns non-zero", async () => {
  const io = bufferIo();
  const code = await main(["--project", fixtureInputDir("clean-project")], io);

  assert.equal(code, 2);
  assert.match(io.output.stderr, /Missing required/);
});

test("write and fix flags are rejected", async () => {
  for (const flag of ["--fix", "--write", "--unknown"]) {
    const io = bufferIo();
    const code = await main([flag], io);

    assert.equal(code, 2);
  }
});

test("target-local output is rejected before creating output", async () => {
  const input = fixtureInputDir("clean-project");
  const targetLocalOutput = path.join(input, "review-output");
  const io = bufferIo();
  const code = await main(["--project", input, "--out", targetLocalOutput], io);

  assert.equal(code, 2);
  assert.equal(fs.existsSync(targetLocalOutput), false);
  assert.match(io.output.stderr, /outside the target project/);
});

test("external output path is accepted by CLI shell", async () => {
  const outDir = createTempOutputDir("cli-shell");

  try {
    const io = bufferIo();
    const code = await main(["--project", fixtureInputDir("clean-project"), "--out", outDir], io);

    assert.equal(code, 0);
    assert.match(io.output.stdout, /completed/);
  } finally {
    removeTempOutputDir(outDir);
  }
});
