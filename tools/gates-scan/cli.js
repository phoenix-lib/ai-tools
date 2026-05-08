#!/usr/bin/env node

const { runGatesScan } = require("./index");

const USAGE = `gates-scan --project <path> --out <dir>

Evidence-only mechanical gate linter.

Options:
  --project <path>  Project to scan.
  --out <dir>       Output directory outside the scanned project.
  --help            Show this help.
`;

function parseArgs(argv) {
  const parsed = {
    help: false,
    out: null,
    project: null
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

    if (["--fix", "--write", "--pull", "--fetch", "--install"].includes(arg)) {
      throw new Error(`${arg} is not supported. gates-scan is review-only.`);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
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

    const result = await runGatesScan({
      argv,
      outDir: args.out,
      projectDir: args.project
    });

    stdout.write(`gates-scan completed: ${result.status}.\n`);
    return 0;
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
  main,
  parseArgs
};

