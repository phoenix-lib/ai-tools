const crypto = require("node:crypto");
const { sortValue } = require("./canonical-json");

function normalizeScalar(value, fallback = "unknown") {
  if (value === undefined || value === null) return fallback;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : fallback;
}

function normalizePath(value) {
  const normalized = normalizeScalar(value)
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\.\//, "")
    .replace(/\/$/, "");

  return normalized.length > 0 ? normalized : "unknown";
}

function normalizeTarget(value) {
  if (value === undefined || value === null) return "unknown";
  if (typeof value === "object") return sortValue(value);
  return normalizePath(value);
}

function fingerprintInput(input = {}) {
  const stable = {
    source_check_id: normalizeScalar(input.source_check_id),
    source_path: normalizePath(input.source_path),
    source_tool: normalizeScalar(input.source_tool),
    target: normalizeTarget(input.target)
  };

  if (input.source_packet_id !== undefined && input.source_packet_id !== null && String(input.source_packet_id).trim() !== "") {
    stable.source_packet_id = normalizeScalar(input.source_packet_id);
  }

  return sortValue(stable);
}

function createFindingFingerprint(input = {}) {
  const canonical = JSON.stringify(fingerprintInput(input));
  const hash = crypto.createHash("sha256").update(canonical).digest("hex");
  return `fp.${hash}`;
}

module.exports = {
  createFindingFingerprint,
  fingerprintInput,
  normalizePath,
  normalizeTarget
};
