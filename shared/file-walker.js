const fs = require("node:fs");
const path = require("node:path");
const { shouldIgnoreDir, shouldIgnoreFile } = require("./ignore-policy");

function normalizeRelative(filePath) {
  return filePath.replace(/\\/g, "/");
}

function walkProjectFiles(projectDir, options = {}) {
  const root = path.resolve(projectDir);
  const maxFiles = options.maxFiles ?? Infinity;
  const results = [];

  function visit(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name);
      const relativePath = normalizeRelative(path.relative(root, absolutePath));

      if (entry.isDirectory()) {
        if (!shouldIgnoreDir(absolutePath, { ...options, relativePath })) {
          visit(absolutePath);
        }
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (!shouldIgnoreFile(absolutePath, { ...options, relativePath })) {
        results.push(relativePath);
        if (results.length > maxFiles) {
          throw new Error(`File walk exceeded maxFiles limit: ${maxFiles}`);
        }
      }
    }
  }

  visit(root);
  return results.sort();
}

module.exports = {
  walkProjectFiles
};
