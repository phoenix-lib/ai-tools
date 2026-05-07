const fs = require("node:fs");
const path = require("node:path");

function normalizeForCompare(filePath) {
  const resolved = path.resolve(filePath);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

function realOrResolved(filePath) {
  const resolved = path.resolve(filePath);

  if (fs.existsSync(resolved)) {
    return fs.realpathSync.native(resolved);
  }

  const missingParts = [];
  let current = resolved;

  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) {
      return resolved;
    }
    missingParts.unshift(path.basename(current));
    current = parent;
  }

  return path.join(fs.realpathSync.native(current), ...missingParts);
}

function isInsideOrEqual(parentDir, candidateDir) {
  const parent = normalizeForCompare(parentDir);
  const candidate = normalizeForCompare(candidateDir);

  if (candidate === parent) {
    return true;
  }

  const relative = path.relative(parent, candidate);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function assertSafeOutputDir(targetDir, outDir) {
  const targetReal = realOrResolved(targetDir);
  const outputReal = realOrResolved(outDir);

  if (isInsideOrEqual(targetReal, outputReal)) {
    throw new Error(
      [
        "Rejected unsafe output path: output directory must be outside the target project.",
        `Target: ${targetReal}`,
        `Output: ${outputReal}`,
        "Use a separate review directory outside the target project."
      ].join("\n")
    );
  }
}

module.exports = {
  assertSafeOutputDir,
  isInsideOrEqual,
  realOrResolved
};
