const path = require("node:path");

const SECRET_BASENAME_RE = /(^|[._-])(secret|token|credential|credentials|passwd|password|key)([._-]|$)/i;
const SECRET_EXTENSION_RE = /\.(key|pem|p12|pfx)$/i;
const SSH_KEY_NAMES = new Set(["id_rsa", "id_dsa", "id_ed25519"]);

function normalizeEvidencePath(relPath) {
  if (typeof relPath !== "string" || relPath.trim() === "") {
    throw new Error("Evidence path must be a non-empty relative path.");
  }

  if (path.isAbsolute(relPath) || /^[A-Za-z]:[\\/]/.test(relPath)) {
    throw new Error(`Evidence path must be relative, got: ${relPath}`);
  }

  const slashPath = relPath.replace(/\\/g, "/");
  const normalized = path.posix.normalize(slashPath);

  if (normalized === "." || normalized === "" || normalized.startsWith("../") || normalized === "..") {
    throw new Error(`Evidence path must stay inside the target project, got: ${relPath}`);
  }

  return normalized;
}

function isSecretLikePath(relPath) {
  const normalized = normalizeEvidencePath(relPath).toLowerCase();
  const segments = normalized.split("/");
  const basename = path.posix.basename(normalized);

  if (basename === ".env" || basename.startsWith(".env.")) {
    return true;
  }

  if (SSH_KEY_NAMES.has(basename)) {
    return true;
  }

  return SECRET_EXTENSION_RE.test(basename)
    || segments.some((segment) => SECRET_BASENAME_RE.test(segment));
}

function secretEvidenceRef({ id, path: evidencePath, reason }) {
  if (!id || typeof id !== "string") {
    throw new Error("Secret evidence ref requires a string id.");
  }
  if (!reason || typeof reason !== "string") {
    throw new Error("Secret evidence ref requires a reason.");
  }

  return {
    confidence: "verified",
    evidence_type: "secret_path",
    id,
    path: normalizeEvidencePath(evidencePath),
    path_only: true,
    reason
  };
}

module.exports = {
  isSecretLikePath,
  normalizeEvidencePath,
  secretEvidenceRef
};
