const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_IGNORED_DIRS = new Set([
  ".git",
  ".next",
  ".pnpm-store",
  ".tmp",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "tmp",
  "vendor"
]);

const AI_TOOLS_PACKET_MARKERS = [
  "REVIEW-SUMMARY.json",
  "FINDINGS.md",
  "EVIDENCE.json",
  "RECOMMENDED-ACTIONS.md"
];

const AI_WORKSPACE_KIT_PACKET_MARKERS = [
  "ADOPTION-REVIEW.md",
  "CONFLICTS.md",
  "MERGE-REVIEW.md",
  "ai-workspace.manifest.json"
];

const AI_WORKSPACE_KIT_SOURCE_MARKERS = [
  "CORE-CONTRACT.md",
  "AI-BOOTSTRAP.md",
  "ADAPTER-GENERATION.md",
  "TOOLING-PLAYBOOK.md"
];

function fileExists(dir, fileName) {
  return fs.existsSync(path.join(dir, fileName));
}

function hasAllMarkers(dir, markers) {
  return markers.every((marker) => fileExists(dir, marker));
}

function hasAnyMarker(dir, markers) {
  return markers.some((marker) => fileExists(dir, marker));
}

function isGeneratedPacketDir(dir) {
  return hasAllMarkers(dir, AI_TOOLS_PACKET_MARKERS) || hasAllMarkers(dir, AI_WORKSPACE_KIT_PACKET_MARKERS);
}

function isAiWorkspaceKitCheckout(dir) {
  const packageJson = path.join(dir, "package.json");
  if (fs.existsSync(packageJson)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJson, "utf8"));
      if (pkg.name === "ai-workspace-kit") {
        return true;
      }
    } catch {
      return false;
    }
  }

  return hasAnyMarker(dir, AI_WORKSPACE_KIT_SOURCE_MARKERS);
}

function normalizeRelPath(relativePath) {
  return relativePath.replace(/\\/g, "/");
}

function isFixtureInternalDir(relativePath) {
  const normalized = normalizeRelPath(relativePath);
  return /(^|\/)(expected|output)(\/|$)/.test(normalized);
}

function shouldIgnoreDir(dirPath, options = {}) {
  const { includeFixtureInternals = false, relativePath = path.basename(dirPath) } = options;
  const baseName = path.basename(dirPath);

  if (DEFAULT_IGNORED_DIRS.has(baseName)) {
    return true;
  }

  if (!includeFixtureInternals && isFixtureInternalDir(relativePath)) {
    return true;
  }

  return isGeneratedPacketDir(dirPath) || isAiWorkspaceKitCheckout(dirPath);
}

function shouldIgnoreFile() {
  return false;
}

module.exports = {
  AI_TOOLS_PACKET_MARKERS,
  AI_WORKSPACE_KIT_PACKET_MARKERS,
  DEFAULT_IGNORED_DIRS,
  isAiWorkspaceKitCheckout,
  isFixtureInternalDir,
  isGeneratedPacketDir,
  shouldIgnoreDir,
  shouldIgnoreFile
};
