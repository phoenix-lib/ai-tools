#!/usr/bin/env node

const { runLedger } = require("./index");
const { normalizeScope } = require("./scope");

const USAGE = `project-context-ledger --project <path> --out <dir> [--scope current|planning|history|all]

Read-only project context ledger scanner.

Options:
  --project <path>  Project to scan.
  --out <dir>       Output directory outside the scanned project.
  --scope <value>   Source scope to scan. Defaults to current.
  --help            Show this help.
`;

const MUTATING_FLAGS = new Set(["--fix", "--write", "--pull", "--fetch", "--install"]);

function parseArgs(argv) {
  const parsed = {
    help: false,
    out: null,
    project: null,
    scope: "current"
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

    if (arg === "--scope") {
      if (!argv[index + 1] || argv[index + 1].startsWith("--")) {
        throw new Error("Missing value for --scope.");
      }
      parsed.scope = normalizeScope(argv[index + 1]);
      index += 1;
      continue;
    }

    if (MUTATING_FLAGS.has(arg)) {
      throw new Error(`${arg} is not supported. project-context-ledger is review-only.`);
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

    const result = await runLedger({
      argv,
      outDir: args.out,
      projectDir: args.project,
      scope: args.scope
    });

    stdout.write(`project-context-ledger completed: ${result.status}.\n`);
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
