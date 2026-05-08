#!/usr/bin/env node

const { runAudit } = require("./index");

const USAGE = `contract-drift-auditor --project <path> --out <dir>

Review-only contract drift auditor.

Options:
  --project <path>                    Target project to audit.
  --out <dir>                         Output directory outside the target project.
  --format json                       Emit compact machine stdout from REVIEW-SUMMARY.json data.
  --quiet                             Suppress human success stdout.
  --fail-on blocked|human_review_required|never
                                      Return 1 when packet status meets this policy. Default: never.
  --help                              Show this help.
`;

const SUPPORTED_FORMATS = new Set(["json"]);
const SUPPORTED_FAIL_ON = new Set(["blocked", "human_review_required", "never"]);

function requireEnumValue(flag, value, supportedValues) {
  if (!supportedValues.has(value)) {
    throw new Error(`Unsupported ${flag} value: ${value ?? "none"}. Supported values: ${Array.from(supportedValues).join(", ")}.`);
  }

  return value;
}

function parseArgs(argv) {
  const parsed = {
    failOn: "never",
    format: "human",
    help: false,
    project: null,
    out: null,
    quiet: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--project") {
      parsed.project = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--out") {
      parsed.out = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--format") {
      parsed.format = requireEnumValue("--format", argv[index + 1] ?? null, SUPPORTED_FORMATS);
      index += 1;
      continue;
    }

    if (arg === "--quiet") {
      parsed.quiet = true;
      continue;
    }

    if (arg === "--fail-on") {
      parsed.failOn = requireEnumValue("--fail-on", argv[index + 1] ?? null, SUPPORTED_FAIL_ON);
      index += 1;
      continue;
    }

    if (arg === "--fix" || arg === "--write") {
      throw new Error(`${arg} is not supported in the MVP. The auditor is review-only.`);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function renderMachineStdout(result) {
  return `${JSON.stringify({
    status: result.packet.summary.status,
    counts: result.packet.summary.counts,
    generated_artifacts: result.packet.summary.generated_artifacts,
    out_dir: result.outDir
  })}\n`;
}

function shouldFailForStatus(status, failOn) {
  if (failOn === "never") {
    return false;
  }

  if (failOn === "blocked") {
    return status === "blocked";
  }

  if (failOn === "human_review_required") {
    return status === "human_review_required" || status === "blocked";
  }

  throw new Error(`Unsupported fail policy: ${failOn}`);
}

function formatHumanSuccess(result) {
  return `contract-drift-auditor completed: ${result.status}.\n`;
}

async function main(argv = process.argv.slice(2), io = {}) {
  const stdout = io.stdout ?? process.stdout;
  const stderr = io.stderr ?? process.stderr;

  try {
    const args = parseArgs(argv);

    if (args.help) {
      stdout.write(USAGE);
      return 0;
    }

    if (!args.project || !args.out) {
      stderr.write("Missing required --project or --out.\n");
      stderr.write(USAGE);
      return 2;
    }

    const result = await runAudit({ projectDir: args.project, outDir: args.out, argv });

    if (args.format === "json") {
      stdout.write(renderMachineStdout(result));
    } else if (!args.quiet) {
      stdout.write(formatHumanSuccess(result));
    }

    return shouldFailForStatus(result.status, args.failOn) ? 1 : 0;
  } catch (error) {
    stderr.write(`${error.message}\n`);
    return 2;
  }
}

if (require.main === module) {
  main().then((code) => {
    process.exitCode = code;
  });
}

module.exports = {
  USAGE,
  formatHumanSuccess,
  main,
  parseArgs,
  renderMachineStdout,
  shouldFailForStatus
};
