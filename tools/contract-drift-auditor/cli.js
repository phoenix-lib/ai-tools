#!/usr/bin/env node

const { runAudit } = require("./index");

const USAGE = `contract-drift-auditor --project <path> --out <dir>

Review-only contract drift auditor.

Options:
  --project <path>  Target project to audit.
  --out <dir>      Output directory outside the target project.
  --help           Show this help.
`;

function parseArgs(argv) {
  const parsed = {
    project: null,
    out: null,
    help: false
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

    if (arg === "--fix" || arg === "--write") {
      throw new Error(`${arg} is not supported in the MVP. The auditor is review-only.`);
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

    await runAudit({ projectDir: args.project, outDir: args.out, argv });
    stdout.write("contract-drift-auditor completed.\n");
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
