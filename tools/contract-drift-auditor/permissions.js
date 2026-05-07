const TOOL_EVIDENCE = {
  npm: ["package.json", "package-lock.json", "npm-shrinkwrap.json"],
  yarn: ["yarn.lock"],
  pnpm: ["pnpm-lock.yaml", "pnpm-workspace.yaml"],
  node: ["package.json"],
  uv: ["uv.lock", "pyproject.toml"],
  python: ["pyproject.toml", "requirements.txt"],
  cargo: ["Cargo.toml"],
  go: ["go.mod"]
};

function availableTools(discovery) {
  const files = new Set(discovery.files ?? []);
  const available = new Set();

  for (const [tool, markers] of Object.entries(TOOL_EVIDENCE)) {
    if (markers.some((marker) => files.has(marker) || [...files].some((file) => file.endsWith(`/${marker}`)))) {
      available.add(tool);
    }
  }

  return available;
}

function extractToolReferences(documents) {
  const references = [];
  const toolNames = Object.keys(TOOL_EVIDENCE);
  const toolPattern = new RegExp(`\\b(${toolNames.join("|")})\\b`, "gi");

  for (const document of documents) {
    const lines = (document.content ?? "").split(/\r?\n/);
    lines.forEach((line, index) => {
      let match;
      while ((match = toolPattern.exec(line)) !== null) {
        references.push({
          tool: match[1].toLowerCase(),
          source_path: document.path,
          line: index + 1
        });
      }
    });
  }

  return references;
}

function findAbsentToolReferences(discovery, documents) {
  const available = availableTools(discovery);
  return extractToolReferences(documents)
    .filter((reference) => !available.has(reference.tool))
    .filter((reference, index, all) => all.findIndex((candidate) => (
      candidate.tool === reference.tool
        && candidate.source_path === reference.source_path
        && candidate.line === reference.line
    )) === index);
}

module.exports = {
  availableTools,
  extractToolReferences,
  findAbsentToolReferences
};
