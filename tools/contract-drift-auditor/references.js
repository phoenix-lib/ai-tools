const path = require("node:path");
const { normalizeEvidencePath } = require("../../shared/secret-policy");

const FILE_EXT_RE = /\.(md|markdown|json|js|cjs|mjs|ts|tsx|yml|yaml|toml|txt|lock|key|pem|sh|cmd)$/i;
const COMMAND_RE = /\b(npm\s+(?:test|run\s+[a-z0-9:._-]+))\b/gi;
const BACKTICK_RE = /`([^`]+)`/g;
const PATH_TOKEN_RE = /(?:^|\s)([A-Za-z0-9._/-]+\.(?:md|markdown|json|js|cjs|mjs|ts|tsx|yml|yaml|toml|txt|lock|key|pem|sh|cmd))(?:\s|$|[),.;:])/gi;

function stripPunctuation(value) {
  return value.replace(/[),.;:]+$/g, "");
}

function isPathLike(value) {
  if (!value || value.includes("://") || value.includes("*")) {
    return false;
  }

  if (/\s/.test(value) || /[<>]/.test(value) || value.endsWith("/")) {
    return false;
  }

  if (/^(npm|node|git|yarn|pnpm|uv|cargo|go|python)\b/i.test(value)) {
    return false;
  }

  return value.includes("/") || value.startsWith(".") || FILE_EXT_RE.test(value);
}

function normalizeReferencePath(rawPath) {
  const withoutQuotes = stripPunctuation(rawPath.trim().replace(/^["']|["']$/g, ""));
  if (!isPathLike(withoutQuotes)) {
    return null;
  }

  try {
    return normalizeEvidencePath(path.posix.normalize(withoutQuotes.replace(/\\/g, "/")));
  } catch {
    return null;
  }
}

function extractMarkdownReferences(document) {
  const references = [];
  const commands = [];
  const lines = (document.content ?? "").split(/\r?\n/);
  let sourceLayerSection = false;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const heading = line.match(/^#+\s+(.+?)\s*$/);
    if (heading) {
      sourceLayerSection = /source layers?/i.test(heading[1]);
    }

    let commandMatch;
    while ((commandMatch = COMMAND_RE.exec(line)) !== null) {
      commands.push({
        command: commandMatch[1].replace(/\s+/g, " ").trim(),
        source_path: document.path,
        line: lineNumber
      });
    }

    const candidates = [];
    let backtickMatch;
    while ((backtickMatch = BACKTICK_RE.exec(line)) !== null) {
      candidates.push(backtickMatch[1]);
    }

    const afterColon = line.match(/:\s*([^`\s]+)\s*$/);
    if (afterColon) {
      candidates.push(afterColon[1].trim());
    }

    let pathTokenMatch;
    while ((pathTokenMatch = PATH_TOKEN_RE.exec(line)) !== null) {
      candidates.push(pathTokenMatch[1]);
    }

    for (const candidate of candidates) {
      const referencePath = normalizeReferencePath(candidate);
      if (!referencePath) {
        continue;
      }

      references.push({
        path: referencePath,
        source_path: document.path,
        line: lineNumber,
        source_layer: sourceLayerSection,
        skill_reference: /(^|\/)(\.codex|\.agents)\/skills\/[^/]+\/SKILL\.md$/i.test(referencePath)
      });
    }
  });

  return { references, commands };
}

module.exports = {
  extractMarkdownReferences,
  normalizeReferencePath
};
