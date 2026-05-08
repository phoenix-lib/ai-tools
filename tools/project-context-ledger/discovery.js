const fs = require("node:fs");
const path = require("node:path");
const { walkProjectFiles } = require("../../shared/file-walker");
const { isGeneratedPacketDir, shouldIgnoreDir } = require("../../shared/ignore-policy");
const { isSecretLikePath, normalizeEvidencePath } = require("../../shared/secret-policy");
const { extractMarkdownReferences } = require("../contract-drift-auditor/references");
const {
  categorizeSourcePath,
  classifyReference,
  isActivePlanningPath,
  isContractPath,
  isSkillPath,
  normalizeScope,
  sourceIncludedInScope
} = require("./scope");

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
    path_only: isSecretLikePath(relativePath),
    source_category: categorizeSourcePath(relativePath)
  };
}

function discoverProject(options) {
  const root = path.resolve(options.projectDir);
  const scope = normalizeScope(options.scope);
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
  const scopedFiles = files.filter((relativePath) => sourceIncludedInScope(relativePath, scope));
  const fileSet = new Set(files);
  const scopedFileSet = new Set(scopedFiles);
  const sourceCategories = new Map(files.map((relativePath) => [
    normalizeEvidencePath(relativePath),
    categorizeSourcePath(relativePath)
  ]));
  const generatedPacketDirs = listGeneratedPacketDirs(root);
  const secretPaths = files.filter((relativePath) => isSecretLikePath(relativePath)).sort();

  const contractFiles = scopedFiles
    .filter(isContractPath)
    .map((relativePath) => makeDocument(root, relativePath))
    .sort(sortByPath);

  const planningFiles = scopedFiles
    .filter((relativePath) => relativePath.endsWith(".md") && (isActivePlanningPath(relativePath) || categorizeSourcePath(relativePath) === "history"))
    .map((relativePath) => makeDocument(root, relativePath))
    .sort(sortByPath);

  const skillFiles = scopedFiles
    .filter(isSkillPath)
    .map((relativePath) => ({
      ...makeDocument(root, relativePath),
      name: normalizeEvidencePath(relativePath).split("/").at(-2)
    }))
    .sort(sortByPath);

  const packageFiles = scopedFiles
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
        source_category: categorizeSourcePath(normalized),
        value: packageJson.value
      };
    })
    .sort(sortByPath);

  const registry = scopedFileSet.has("tools/registry.json")
    ? {
        path: "tools/registry.json",
        source_category: categorizeSourcePath("tools/registry.json"),
        ...readJsonIfSafe(root, "tools/registry.json")
      }
    : null;

  const sourceDocuments = [...contractFiles, ...planningFiles, ...skillFiles]
    .filter((document) => document.content !== null);
  const references = [];
  const documentedCommands = [];

  for (const document of sourceDocuments) {
    const extracted = extractMarkdownReferences(document);
    const lines = (document.content ?? "").split(/\r?\n/);
    references.push(...extracted.references.map((reference) => ({
      ...reference,
      reference_kind: classifyReference(reference, {
        generatedPacketDirs,
        line: lines[reference.line - 1] ?? ""
      }),
      source_category: document.source_category
    })));
    documentedCommands.push(...extracted.commands.map((command) => ({
      ...command,
      source_category: document.source_category
    })));
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
    scope,
    sourceCategories,
    scopedFiles,
    sourceDocuments
  };
}

module.exports = {
  discoverProject,
  isContractPath,
  isPlanningPath: isActivePlanningPath,
  isSkillPath,
  listGeneratedPacketDirs
};
