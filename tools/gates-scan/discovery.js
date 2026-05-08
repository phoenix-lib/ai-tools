const fs = require("node:fs");
const path = require("node:path");

function normalizeSlashes(value) {
  return value.replace(/\\/g, "/");
}

function listFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listFiles(absolutePath, predicate);
    }
    return entry.isFile() && predicate(absolutePath) ? [absolutePath] : [];
  }).sort();
}

function readTextIfExists(root, relativePath) {
  const absolutePath = path.join(root, ...relativePath.split("/"));
  if (!fs.existsSync(absolutePath)) {
    return null;
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function readJsonIfExists(root, relativePath, blockers) {
  const content = readTextIfExists(root, relativePath);
  if (content === null) {
    return { exists: false, raw: null, value: null };
  }

  try {
    return { exists: true, raw: content, value: JSON.parse(content) };
  } catch (error) {
    blockers.push({
      id: `invalid-json-${relativePath.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
      reason: `${relativePath} is not valid JSON: ${error.message}`,
      source: relativePath
    });
    return { exists: true, raw: content, value: null };
  }
}

function readMarkdownArtifacts(root) {
  const base = path.join(root, ".planning", "phases");
  return listFiles(base, (filePath) => filePath.endsWith(".md")).map((absolutePath) => {
    const projectRelativePath = normalizeSlashes(path.relative(root, absolutePath));
    return {
      absolutePath,
      content: fs.readFileSync(absolutePath, "utf8"),
      projectRelativePath
    };
  });
}

function discoverProject(options) {
  const projectDir = path.resolve(options.projectDir);
  const blockers = [];

  if (!fs.existsSync(projectDir) || !fs.statSync(projectDir).isDirectory()) {
    blockers.push({
      id: "missing-project-root",
      reason: "Project root is missing or unreadable.",
      source: projectDir
    });
  }

  const gateRegistry = readJsonIfExists(projectDir, ".planning/gates/registry.json", blockers);
  const docs = {
    agents: readTextIfExists(projectDir, "AGENTS.md"),
    changelog: readTextIfExists(projectDir, "CHANGELOG.md"),
    project: readTextIfExists(projectDir, ".planning/PROJECT.md"),
    releaseReadiness: readTextIfExists(projectDir, "docs/RELEASE-READINESS.md"),
    roadmap: readTextIfExists(projectDir, ".planning/ROADMAP.md"),
    state: readTextIfExists(projectDir, ".planning/STATE.md"),
    workflowGates: readTextIfExists(projectDir, ".planning/gates/WORKFLOW-GATES.md")
  };

  return {
    blockers,
    docs,
    gateRegistry,
    phaseArtifacts: readMarkdownArtifacts(projectDir),
    projectDir
  };
}

module.exports = {
  discoverProject,
  listFiles,
  normalizeSlashes,
  readJsonIfExists,
  readTextIfExists
};

