#!/usr/bin/env node

const { runRollup } = require("./index");

const USAGE = `review-packet-rollup --packets <dir...> [--dispositions <file...>] --out <dir>

Mechanical consumer for existing review packet directories.

Options:
  --packets <dir...>       Two or more review packet directories.
  --dispositions <file...> Optional REVIEW-DISPOSITIONS.json files to join.
  --out <dir>              Output directory outside every input packet directory.
  --help                   Show this help.
`;

const REVIEW_ONLY_REJECTED_FLAGS = new Set(["--fix", "--write", "--pull", "--fetch", "--install", "--run", "--execute"]);

function parseArgs(argv) {
  const parsed = {
    help: false,
    dispositions: [],
    out: null,
    packets: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--out") {
      parsed.out = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--packets") {
      index += 1;
      while (index < argv.length && !argv[index].startsWith("--")) {
        parsed.packets.push(argv[index]);
        index += 1;
      }
      index -= 1;
      continue;
    }

    if (arg === "--dispositions") {
      index += 1;
      while (index < argv.length && !argv[index].startsWith("--")) {
        parsed.dispositions.push(argv[index]);
        index += 1;
      }
      index -= 1;
      continue;
    }

    if (REVIEW_ONLY_REJECTED_FLAGS.has(arg)) {
      throw new Error(`${arg} is not supported. review-packet-rollup is review-only and consumes existing packet output only.`);
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

    if (!args.out || args.packets.length < 2) {
      stderr.write("Missing required --out or at least two --packets directories.\n");
      stderr.write(USAGE);
      return 2;
    }

    const result = await runRollup({
      argv,
      dispositionFiles: args.dispositions,
      outDir: args.out,
      packetDirs: args.packets
    });

    stdout.write(`review-packet-rollup completed: ${result.status}.\n`);
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
