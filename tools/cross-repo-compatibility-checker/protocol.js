const path = require("node:path");

const REQUEST_ID_PATTERN = /^REQ-\d{8}-[a-z0-9-]+-to-[a-z0-9-]+-[a-z0-9-]+$/;
const THREAD_ID_PATTERN = /^THREAD-\d{8}-[a-z0-9-]+$/;
const ALLOWED_ORIGINS = Object.freeze(["mirrored", "manual-transfer", "local-created"]);

const REQUIRED_REQUEST_FIELDS = Object.freeze([
  "Protocol version",
  "Canonical ID",
  "Thread ID",
  "Origin",
  "Mirror required",
  "Counterpart ID",
  "Counterpart path",
  "Legacy ID",
  "ID",
  "From",
  "To",
  "Status",
  "Severity",
  "Requested by phase/gate",
  "Boundary classification"
]);

const REQUIRED_DECISION_FIELDS = Object.freeze([
  "Protocol version",
  "Request ID",
  "Canonical ID",
  "Thread ID",
  "Origin",
  "Mirror required",
  "Counterpart ID",
  "Counterpart path",
  "Legacy ID",
  "Decision",
  "Decided by",
  "Date",
  "Target phase",
  "Reason"
]);

function parseMetadata(content) {
  const fields = {};
  const duplicates = [];

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9 /_-]*):\s*(.*)$/);
    if (!match) {
      continue;
    }

    const field = match[1].trim();
    const value = match[2].trim();
    if (Object.hasOwn(fields, field)) {
      duplicates.push(field);
      continue;
    }
    fields[field] = value;
  }

  return { duplicates, fields };
}

function fieldValue(metadata, field) {
  return metadata.fields[field] ?? "";
}

function normalizeSlashes(value) {
  return value.replace(/\\/g, "/");
}

function parseMirrorRequired(value) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return null;
}

function hasAbsolutePath(value) {
  return /(?:^|[\s(])(?:[A-Za-z]:[\\/]|\/(?!\/))/.test(value);
}

function isRepoQualifiedPath(value) {
  return /^(ai-tools|ai-workspace-kit)\//.test(normalizeSlashes(value));
}

function resolveRepoQualifiedPath(value, roots) {
  const normalized = normalizeSlashes(value);
  const match = normalized.match(/^(ai-tools|ai-workspace-kit)\/(.+)$/);
  if (!match) {
    return null;
  }

  return {
    absolutePath: path.join(roots[match[1]], ...match[2].split("/")),
    repo: match[1],
    relativePath: normalized
  };
}

function sanitizeId(value) {
  return normalizeSlashes(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "item";
}

module.exports = {
  ALLOWED_ORIGINS,
  REQUEST_ID_PATTERN,
  REQUIRED_DECISION_FIELDS,
  REQUIRED_REQUEST_FIELDS,
  THREAD_ID_PATTERN,
  fieldValue,
  hasAbsolutePath,
  isRepoQualifiedPath,
  normalizeSlashes,
  parseMetadata,
  parseMirrorRequired,
  resolveRepoQualifiedPath,
  sanitizeId
};
