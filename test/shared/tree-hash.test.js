const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { relativeTreeFiles, treeHash, walkTreeFiles } = require("../../shared/tree-hash");

function withTempDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-tools-tree-hash-"));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

function writeFile(root, relPath, text) {
  const target = path.join(root, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

test("relativeTreeFiles returns sorted normalized paths", () => withTempDir((dir) => {
  writeFile(dir, "z\\file.txt", "z");
  writeFile(dir, "a\\file.txt", "a");

  assert.deepEqual(relativeTreeFiles(dir), ["a/file.txt", "z/file.txt"]);
  assert.equal(walkTreeFiles(dir).length, 2);
}));

test("treeHash is stable for unchanged trees", () => withTempDir((dir) => {
  writeFile(dir, "README.md", "hello\n");
  writeFile(dir, "src/index.js", "module.exports = {};\n");

  assert.equal(treeHash(dir), treeHash(dir));
}));

test("treeHash changes when file content changes", () => withTempDir((dir) => {
  writeFile(dir, "README.md", "hello\n");
  const before = treeHash(dir);

  writeFile(dir, "README.md", "changed\n");

  assert.notEqual(treeHash(dir), before);
}));

test("treeHash changes for files inside audit-ignored directories", () => withTempDir((dir) => {
  writeFile(dir, "src/index.js", "source\n");
  writeFile(dir, "node_modules/pkg/index.js", "ignored by audit walker\n");
  const before = treeHash(dir);

  writeFile(dir, "node_modules/pkg/index.js", "mutated\n");

  assert.notEqual(treeHash(dir), before);
}));

test("treeHash changes when files are added or deleted", () => withTempDir((dir) => {
  writeFile(dir, "a.txt", "a");
  const beforeAdd = treeHash(dir);

  writeFile(dir, "b.txt", "b");
  const afterAdd = treeHash(dir);
  assert.notEqual(afterAdd, beforeAdd);

  fs.rmSync(path.join(dir, "b.txt"));
  assert.equal(treeHash(dir), beforeAdd);
}));
