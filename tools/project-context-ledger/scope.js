const path = require("node:path");
const { isSecretLikePath, normalizeEvidencePath } = require("../../shared/secret-policy");

const SCOPES = Object.freeze(["current", "planning", "history", "all"]);

const SOURCE_CATEGORIES = Object.freeze([
  "current",
  "planning",
  "history",
  "generated_packet",
  "secret",
  "example",
  "placeholder",
  "unknown"
]);

const PLANNING_FILE_RE = /^\.planning\/(?:PROJECT|STATE|ROADMAP|REQUIREMENTS)\.md$/;
const PHASE_ARTIFACT_RE = /^\.planning\/phases\/[^/]+\/[^/]+-(?:CONTEXT|SUMMARY|VERIFICATION)\.md$/;

function normalizePath(value) {
  return normalizeEvidencePath(String(value ?? "").replace(/\\/g, "/"));
}

function normalizeScope(scope) {
  const normalized = scope ?? "current";
  if (!SCOPES.includes(normalized)) {
    throw new Error(`Invalid scope: ${normalized}. Expected one of: ${SCOPES.join(", ")}.`);
  }

  return normalized;
}

function isPhaseArtifactPath(relativePath) {
  return PHASE_ARTIFACT_RE.test(normalizePath(relativePath));
}

function isActivePlanningPath(relativePath) {
  const normalized = normalizePath(relativePath);

  return PLANNING_FILE_RE.test(normalized)
    || normalized.startsWith(".planning/gates/")
    || normalized.startsWith(".planning/cross-repo/");
}

function isSkillPath(relativePath) {
  return /(^|\/)(\.codex|\.agents)\/skills\/[^/]+\/SKILL\.md$/.test(normalizePath(relativePath));
}

function isContractPath(relativePath) {
  return ["AGENTS.md", "CLAUDE.md"].includes(normalizePath(relativePath));
}

function isPackagePath(relativePath) {
  return path.posix.basename(normalizePath(relativePath)) === "package.json";
}

function isRegistryPath(relativePath) {
  return normalizePath(relativePath) === "tools/registry.json";
}

function categorizeSourcePath(relativePath) {
  const normalized = normalizePath(relativePath);

  if (isSecretLikePath(normalized)) {
    return "secret";
  }

  if (isPhaseArtifactPath(normalized)) {
    return "history";
  }

  if (isActivePlanningPath(normalized)) {
    return "planning";
  }

  if (isContractPath(normalized) || isPackagePath(normalized) || isSkillPath(normalized) || isRegistryPath(normalized)) {
    return "current";
  }

  return "current";
}

function categoryIncludedInScope(category, scopeInput) {
  const scope = normalizeScope(scopeInput);

  if (scope === "all") {
    return ["current", "planning", "history"].includes(category);
  }

  if (scope === "current") {
    return category === "current" || category === "planning";
  }

  return category === scope;
}

function sourceIncludedInScope(relativePath, scope) {
  return categoryIncludedInScope(categorizeSourcePath(relativePath), scope);
}

function isPlaceholderLine(line) {
  const normalized = String(line ?? "").toLowerCase();
  return /\b(n\/a|none|todo|placeholder|example|sample)\b/.test(normalized)
    || /<[^>]+>/.test(normalized)
    || /\{[^}]+\}/.test(normalized);
}

function classifyReference(reference, options = {}) {
  const line = options.line ?? "";
  const referencedPath = normalizePath(reference.path);
  const generatedPacketDirs = options.generatedPacketDirs ?? [];

  if (generatedPacketDirs.some((generatedPath) => referencedPath === generatedPath || referencedPath.startsWith(`${generatedPath}/`))) {
    return "generated_packet";
  }

  if (isPlaceholderLine(line)) {
    if (/\b(example|sample)\b/i.test(line)) {
      return "example";
    }

    return "placeholder";
  }

  return "real";
}

module.exports = {
  SCOPES,
  SOURCE_CATEGORIES,
  categoryIncludedInScope,
  categorizeSourcePath,
  classifyReference,
  isActivePlanningPath,
  isContractPath,
  isPhaseArtifactPath,
  isSkillPath,
  normalizeScope,
  sourceIncludedInScope
};
