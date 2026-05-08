const fs = require("node:fs");
const path = require("node:path");
const { walkProjectFiles } = require("../../shared/file-walker");
const { isGeneratedPacketDir, shouldIgnoreDir } = require("../../shared/ignore-policy");
const { isSecretLikePath, normalizeEvidencePath } = require("../../shared/secret-policy");
const { extractMarkdownReferences } = require("../contract-drift-auditor/references");

const CONTRACT_FILE_NAMES = new Set(["AGENTS.md", "CLAUDE.md"]);
const PLANNING_FILE_RE = /^\.planning\/(?:PROJECT|STATE|ROADMAP|REQUIREMENTS)\.md$/;
const PHASE_ARTIFACT_RE = /^\.planning\/phases\/[^/]+\/[^/]+-(?:CONTEXT|SUMMARY|VERIFICATION)\.md$/;

function normalizeSlashes(value) {
  return value.replace(/\\/g, "/");
}

function sortByPath(left, right) {
  return left.path.localeCompare(right.path);
}

function readTextIfSafe(root, relativePath) {
  if (isSecretLikePath(relativePath)) {
    return null;
  }

  return fs.readFileSync(path.join(root, ...relativePath.split("/")), "utf8");
}

function readJsonIfSafe(root, relativePath) {
  if (isSecretLikePath(relativePath)) {
    return { path_only: true, parse_error: null, value: null };
  }

  try {
    return {
      parse_error: null,
      value: JSON.parse(fs.readFileSync(path.join(root, ...relativePath.split("/")), "utf8"))
    };
  } catch (error) {
    return {
      parse_error: error.message,
      value: null
    };
  }
}

function isContractPath(relativePath) {
  return CONTRACT_FILE_NAMES.has(normalizeEvidencePath(relativePath));
}

function isPlanningPath(relativePath) {
  const normalized = normalizeEvidencePath(relativePath);

  return PLANNING_FILE_RE.test(normalized)
    || PHASE_ARTIFACT_RE.test(normalized)
    || normalized.startsWith(".planning/gates/")
    || normalized.startsWith(".planning/cross-repo/");
}

function isSkillPath(relativePath) {
  return /(^|\/)(\.codex|\.agents)\/skills\/[^/]+\/SKILL\.md$/.test(normalizeEvidencePath(relativePath));
}

function listGeneratedPacketDirs(root) {
  if (!fs.existsSync(root)) {
    return [];
  }

  const generated = [];

  function visit(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = normalizeSlashes(path.relative(root, absolutePath));

      if (isGeneratedPacketDir(absolutePath)) {
        generated.push(normalizeEvidencePath(relativePath));
        continue;
      }

      if (!shouldIgnoreDir(absolutePath, { relativePath })) {
        visit(absolutePath);
      }
    }
  }

  visit(root);
  return generated.sort();
}

function makeDocument(root, relativePath) {
  return {
    content: readTextIfSafe(root, relativePath),
    path: normalizeEvidencePath(relativePath),
    path_only: isSecretLikePath(relativePath)
  };
}

function discoverProject(options) {
  const root = path.resolve(options.projectDir);
  const blockers = [];

  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    return {
      blockers: [{
        id: "missing-project-root",
        reason: "Project root is missing or unreadable.",
        source: root
      }],
      projectDir: root
    };
  }

  const files = walkProjectFiles(root);
  const fileSet = new Set(files);
  const generatedPacketDirs = listGeneratedPacketDirs(root);
  const secretPaths = files.filter((relativePath) => isSecretLikePath(relativePath)).sort();

  const contractFiles = files
    .filter(isContractPath)
    .map((relativePath) => makeDocument(root, relativePath))
    .sort(sortByPath);

  const planningFiles = files
    .filter((relativePath) => relativePath.endsWith(".md") && isPlanningPath(relativePath))
    .map((relativePath) => makeDocument(root, relativePath))
    .sort(sortByPath);

  const skillFiles = files
    .filter(isSkillPath)
    .map((relativePath) => ({
      ...makeDocument(root, relativePath),
      name: normalizeEvidencePath(relativePath).split("/").at(-2)
    }))
    .sort(sortByPath);

  const packageFiles = files
    .filter((relativePath) => path.posix.basename(relativePath) === "package.json")
    .map((relativePath) => {
      const packageJson = readJsonIfSafe(root, relativePath);
      const normalized = normalizeEvidencePath(relativePath);
      const rootPath = path.posix.dirname(normalized) === "." ? "" : path.posix.dirname(normalized);

      return {
        name: packageJson.value?.name ?? null,
        package_bin: packageJson.value?.bin && typeof packageJson.value.bin === "object" ? packageJson.value.bin : {},
        parse_error: packageJson.parse_error,
        path: normalized,
        root: rootPath,
        scripts: packageJson.value?.scripts && typeof packageJson.value.scripts === "object" ? packageJson.value.scripts : {},
        value: packageJson.value
      };
    })
    .sort(sortByPath);

  const registry = fileSet.has("tools/registry.json")
    ? {
        path: "tools/registry.json",
        ...readJsonIfSafe(root, "tools/registry.json")
      }
    : null;

  const sourceDocuments = [...contractFiles, ...planningFiles, ...skillFiles]
    .filter((document) => document.content !== null);
  const references = [];
  const documentedCommands = [];

  for (const document of sourceDocuments) {
    const extracted = extractMarkdownReferences(document);
    references.push(...extracted.references);
    documentedCommands.push(...extracted.commands);
  }

  return {
    blockers,
    contractFiles,
    documentedCommands,
    fileSet,
    files,
    generatedPacketDirs,
    packageFiles,
    planningFiles,
    projectDir: root,
    references,
    registry,
    secretPaths,
    skillFiles,
    sourceDocuments
  };
}

module.exports = {
  discoverProject,
  isContractPath,
  isPlanningPath,
  isSkillPath,
  listGeneratedPacketDirs
};
