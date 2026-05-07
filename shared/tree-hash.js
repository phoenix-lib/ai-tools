const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

function normalizeRelative(filePath) {
  return filePath.replace(/\\/g, "/");
}

function walkTreeFiles(dir) {
  const root = path.resolve(dir);
  const files = [];

  function visit(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        visit(absolutePath);
        continue;
      }

      if (entry.isFile()) {
        files.push(absolutePath);
      }
    }
  }

  visit(root);

  return files.sort((left, right) => {
    const leftRel = normalizeRelative(path.relative(root, left));
    const rightRel = normalizeRelative(path.relative(root, right));
    return leftRel.localeCompare(rightRel);
  });
}

function relativeTreeFiles(dir) {
  const root = path.resolve(dir);
  return walkTreeFiles(root).map((filePath) => normalizeRelative(path.relative(root, filePath)));
}

function treeHash(dir) {
  const root = path.resolve(dir);
  const hash = crypto.createHash("sha256");

  for (const absolutePath of walkTreeFiles(root)) {
    const relativePath = normalizeRelative(path.relative(root, absolutePath));
    hash.update(relativePath);
    hash.update("\0");
    hash.update(fs.readFileSync(absolutePath));
    hash.update("\0");
  }

  return hash.digest("hex");
}

module.exports = {
  relativeTreeFiles,
  treeHash,
  walkTreeFiles
};
