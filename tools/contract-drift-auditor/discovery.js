const fs = require("node:fs");
const path = require("node:path");
const { walkProjectFiles } = require("../../shared/file-walker");
const { isSecretLikePath, normalizeEvidencePath } = require("../../shared/secret-policy");

const CONTRACT_FILE_NAMES = new Set(["AGENTS.md", "CLAUDE.md"]);
const CURRENT_PLANNING_FILES = new Set([
  ".planning/PROJECT.md",
  ".planning/STATE.md",
  ".planning/ROADMAP.md",
  ".planning/REQUIREMENTS.md"
]);

function sortByPath(left, right) {
  return left.path.localeCompare(right.path);
}

function readTextIfSafe(projectDir, relativePath) {
  if (isSecretLikePath(relativePath)) {
    return null;
  }

  return fs.readFileSync(path.join(projectDir, relativePath), "utf8");
}

function readPackageJson(projectDir, relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(projectDir, relativePath), "utf8"));
  } catch (error) {
    return {
      parse_error: error.message,
      scripts: {}
    };
  }
}

function isCurrentPlanningDocument(relativePath) {
  const normalizedPath = normalizeEvidencePath(relativePath);

  return CURRENT_PLANNING_FILES.has(normalizedPath)
    || normalizedPath.startsWith(".planning/cross-repo/")
    || normalizedPath.startsWith(".planning/gates/");
}

function isCurrentContractDocument(relativePath) {
  const normalizedPath = normalizeEvidencePath(relativePath);

  return CONTRACT_FILE_NAMES.has(normalizedPath);
}

function discoverProject(projectDir) {
  const root = path.resolve(projectDir);
  const files = walkProjectFiles(root);
  const fileSet = new Set(files);

  const contractFiles = files
    .filter((relativePath) => isCurrentContractDocument(relativePath))
    .map((relativePath) => ({
      path: normalizeEvidencePath(relativePath),
      path_only: isSecretLikePath(relativePath),
      content: readTextIfSafe(root, relativePath)
    }))
    .sort(sortByPath);

  const planningFiles = files
    .filter((relativePath) => relativePath.endsWith(".md") && isCurrentPlanningDocument(relativePath))
    .map((relativePath) => ({
      path: normalizeEvidencePath(relativePath),
      path_only: isSecretLikePath(relativePath),
      content: readTextIfSafe(root, relativePath)
    }))
    .sort(sortByPath);

  const skillFiles = files
    .filter((relativePath) => /(^|\/)(\.codex|\.agents)\/skills\/[^/]+\/SKILL\.md$/.test(relativePath))
    .map((relativePath) => ({
      name: relativePath.split("/").at(-2),
      path: normalizeEvidencePath(relativePath),
      path_only: isSecretLikePath(relativePath),
      content: readTextIfSafe(root, relativePath)
    }))
    .sort(sortByPath);

  const packageFiles = files
    .filter((relativePath) => path.posix.basename(relativePath) === "package.json")
    .map((relativePath) => {
      const packageJson = readPackageJson(root, relativePath);
      const rootPath = path.posix.dirname(relativePath) === "." ? "" : path.posix.dirname(relativePath);

      return {
        path: normalizeEvidencePath(relativePath),
        root: rootPath,
        name: packageJson.name ?? null,
        scripts: packageJson.scripts && typeof packageJson.scripts === "object" ? packageJson.scripts : {},
        parse_error: packageJson.parse_error
      };
    })
    .sort(sortByPath);

  return {
    projectDir: root,
    files,
    fileSet,
    contractFiles,
    planningFiles,
    skillFiles,
    packageFiles
  };
}

module.exports = {
  discoverProject,
  isCurrentContractDocument,
  isCurrentPlanningDocument,
  readTextIfSafe
};
