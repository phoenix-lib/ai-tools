#!/usr/bin/env node

const { runCompatibilityCheck } = require("./index");

const USAGE = `cross-repo-compatibility-checker --ai-tools <path> --ai-workspace-kit <path> --out <dir>

Review-only compatibility checker for ai-tools and ai-workspace-kit protocol artifacts.

Options:
  --ai-tools <path>          Path to the ai-tools checkout.
  --ai-workspace-kit <path>  Path to the ai-workspace-kit checkout.
  --out <dir>                Output directory outside both input repositories.
  --help                     Show this help.
`;

function parseArgs(argv) {
  const parsed = {
    aiTools: null,
    aiWorkspaceKit: null,
    help: false,
    out: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--ai-tools") {
      parsed.aiTools = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--ai-workspace-kit") {
      parsed.aiWorkspaceKit = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--out") {
      parsed.out = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (["--fix", "--write", "--pull", "--fetch", "--install"].includes(arg)) {
      throw new Error(`${arg} is not supported. The checker is review-only.`);
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

    if (!args.aiTools || !args.aiWorkspaceKit || !args.out) {
      stderr.write("Missing required --ai-tools, --ai-workspace-kit, or --out.\n");
      stderr.write(USAGE);
      return 2;
    }

    const result = await runCompatibilityCheck({
      aiToolsDir: args.aiTools,
      aiWorkspaceKitDir: args.aiWorkspaceKit,
      argv,
      outDir: args.out
    });
    stdout.write(`cross-repo-compatibility-checker completed: ${result.status}.\n`);
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
