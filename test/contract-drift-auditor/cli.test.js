const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  main,
  parseArgs,
  renderMachineStdout,
  shouldFailForStatus
} = require("../../tools/contract-drift-auditor/cli");
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
    failOn: "never",
    format: "human",
    help: false,
    project: "a",
    out: "b",
    quiet: false
  });
});

test("parses output mode, quiet mode, and fail policy args", () => {
  assert.deepEqual(
    parseArgs(["--project", "a", "--out", "b", "--format", "json", "--quiet", "--fail-on", "human_review_required"]),
    {
      failOn: "human_review_required",
      format: "json",
      help: false,
      project: "a",
      out: "b",
      quiet: true
    }
  );
});

test("rejects unsupported output mode and fail policy values", async () => {
  for (const args of [
    ["--format", "xml"],
    ["--fail-on", "info"]
  ]) {
    const io = bufferIo();
    const code = await main(args, io);

    assert.equal(code, 2);
    assert.match(io.output.stderr, /Unsupported/);
  }
});

test("status fail policy is explicit and opt-in", () => {
  assert.equal(shouldFailForStatus("blocked", "blocked"), true);
  assert.equal(shouldFailForStatus("human_review_required", "blocked"), false);
  assert.equal(shouldFailForStatus("blocked", "human_review_required"), true);
  assert.equal(shouldFailForStatus("human_review_required", "human_review_required"), true);

  for (const status of ["pass", "info", "human_review_required", "blocked"]) {
    assert.equal(shouldFailForStatus(status, "never"), false);
  }
});

test("machine stdout is compact json from packet summary data", () => {
  const stdout = renderMachineStdout({
    outDir: "out",
    packet: {
      summary: {
        status: "human_review_required",
        counts: { total_findings: 1 },
        generated_artifacts: ["REVIEW-SUMMARY.json"]
      }
    }
  });

  assert.equal(stdout.endsWith("\n"), true);
  assert.equal(stdout.indexOf("\n"), stdout.length - 1);
  assert.deepEqual(JSON.parse(stdout), {
    status: "human_review_required",
    counts: { total_findings: 1 },
    generated_artifacts: ["REVIEW-SUMMARY.json"],
    out_dir: "out"
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
    assert.match(io.output.stdout, /contract-drift-auditor completed: (pass|info|human_review_required|blocked)\./);
  } finally {
    removeTempOutputDir(outDir);
  }
});

test("quiet suppresses human success output", async () => {
  const outDir = createTempOutputDir("cli-quiet");

  try {
    const io = bufferIo();
    const code = await main(["--project", fixtureInputDir("clean-project"), "--out", outDir, "--quiet"], io);

    assert.equal(code, 0);
    assert.equal(io.output.stdout, "");
    assert.equal(io.output.stderr, "");
  } finally {
    removeTempOutputDir(outDir);
  }
});

test("json stdout matches generated review summary packet", async () => {
  const outDir = createTempOutputDir("cli-json");

  try {
    const io = bufferIo();
    const code = await main(["--project", fixtureInputDir("missing-command"), "--out", outDir, "--format", "json"], io);
    const stdout = JSON.parse(io.output.stdout);
    const summary = JSON.parse(fs.readFileSync(path.join(outDir, "REVIEW-SUMMARY.json"), "utf8"));

    assert.equal(code, 0);
    assert.equal(stdout.status, summary.status);
    assert.deepEqual(stdout.counts, summary.counts);
    assert.deepEqual(stdout.generated_artifacts, summary.generated_artifacts);
    assert.equal(stdout.out_dir, path.resolve(outDir));
  } finally {
    removeTempOutputDir(outDir);
  }
});

test("quiet does not suppress explicit json output", async () => {
  const outDir = createTempOutputDir("cli-quiet-json");

  try {
    const io = bufferIo();
    const code = await main(["--project", fixtureInputDir("clean-project"), "--out", outDir, "--quiet", "--format", "json"], io);

    assert.equal(code, 0);
    assert.equal(JSON.parse(io.output.stdout).out_dir, path.resolve(outDir));
  } finally {
    removeTempOutputDir(outDir);
  }
});

test("fail-on policy controls only generated packet statuses", async () => {
  const input = fixtureInputDir("missing-command");
  const reviewOut = createTempOutputDir("cli-fail-human-review");
  const blockedOut = createTempOutputDir("cli-fail-blocked");

  try {
    const humanReviewIo = bufferIo();
    const humanReviewCode = await main(["--project", input, "--out", reviewOut, "--fail-on", "human_review_required"], humanReviewIo);

    assert.equal(humanReviewCode, 1);
    assert.match(humanReviewIo.output.stdout, /completed: human_review_required/);

    const blockedIo = bufferIo();
    const blockedCode = await main(["--project", input, "--out", blockedOut, "--fail-on", "blocked"], blockedIo);

    assert.equal(blockedCode, 0);
    assert.match(blockedIo.output.stdout, /completed: human_review_required/);
  } finally {
    removeTempOutputDir(reviewOut);
    removeTempOutputDir(blockedOut);
  }
});
