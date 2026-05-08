const fs = require("node:fs");
const path = require("node:path");
const { normalizeSlashes, parseMetadata } = require("./protocol");

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listMarkdownFiles(absolutePath);
    }
    return entry.isFile() && entry.name.endsWith(".md") ? [absolutePath] : [];
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
    return { exists: false, value: null };
  }

  try {
    return { exists: true, value: JSON.parse(content) };
  } catch (error) {
    blockers.push({
      id: `invalid-json-${relativePath.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
      reason: `${relativePath} is not valid JSON: ${error.message}`,
      source: relativePath
    });
    return { exists: true, value: null };
  }
}

function readProtocolArtifacts(root, repo) {
  const base = path.join(root, ".planning", "cross-repo");
  const dirs = [
    { kind: "request", relativeDir: ".planning/cross-repo/inbox" },
    { kind: "request", relativeDir: ".planning/cross-repo/outbox" },
    { kind: "decision", relativeDir: ".planning/cross-repo/decisions" }
  ];
  const artifacts = [];

  if (!fs.existsSync(base)) {
    return artifacts;
  }

  for (const { kind, relativeDir } of dirs) {
    for (const absolutePath of listMarkdownFiles(path.join(root, ...relativeDir.split("/")))) {
      const projectRelativePath = normalizeSlashes(path.relative(root, absolutePath));
      const content = fs.readFileSync(absolutePath, "utf8");
      artifacts.push({
        absolutePath,
        content,
        fields: parseMetadata(content).fields,
        kind,
        metadata: parseMetadata(content),
        projectRelativePath,
        repo,
        repoQualifiedPath: `${repo}/${projectRelativePath}`
      });
    }
  }

  return artifacts;
}

function discoverRepositories(options) {
  const roots = {
    "ai-tools": path.resolve(options.aiToolsDir),
    "ai-workspace-kit": path.resolve(options.aiWorkspaceKitDir)
  };
  const blockers = [];

  for (const [repo, root] of Object.entries(roots)) {
    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
      blockers.push({
        id: `missing-root-${repo}`,
        reason: `${repo} root is missing or unreadable.`,
        source: repo
      });
    }
  }

  const aiToolsRoot = roots["ai-tools"];
  const kitRoot = roots["ai-workspace-kit"];
  const artifacts = [
    ...readProtocolArtifacts(aiToolsRoot, "ai-tools"),
    ...readProtocolArtifacts(kitRoot, "ai-workspace-kit")
  ];
  const aiToolsGateRegistry = readJsonIfExists(aiToolsRoot, ".planning/gates/registry.json", blockers);
  const kitGateRegistry = readJsonIfExists(kitRoot, "templates/GATE-REGISTRY.json", blockers);
  const kitContract = readJsonIfExists(kitRoot, "AI-WORKSPACE-CONTRACT.json", blockers);
  const kitProtocolVersions = readJsonIfExists(kitRoot, "data/protocol-versions.json", blockers);

  return {
    artifacts,
    blockers,
    optionalEvidence: {
      kitContract,
      kitProtocolVersions
    },
    registries: {
      aiTools: aiToolsGateRegistry,
      aiWorkspaceKit: kitGateRegistry
    },
    roots
  };
}

module.exports = {
  discoverRepositories,
  listMarkdownFiles,
  readJsonIfExists,
  readProtocolArtifacts
};
