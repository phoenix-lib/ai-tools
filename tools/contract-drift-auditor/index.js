const path = require("node:path");
const { assertSafeOutputDir } = require("../../shared/path-guard");
const { discoverProject } = require("./discovery");

async function runAudit(options) {
  const projectDir = path.resolve(options.projectDir);
  const outDir = path.resolve(options.outDir);

  assertSafeOutputDir(projectDir, outDir);

  const discovery = discoverProject(projectDir);

  return {
    status: "pass",
    discovery,
    outDir
  };
}

module.exports = {
  runAudit
};
