function discoverPackageScripts(discovery) {
  return (discovery.packageFiles ?? []).map((packageFile) => ({
    package_path: packageFile.path,
    package_root: packageFile.root,
    scripts: { ...(packageFile.scripts ?? {}) }
  }));
}

function normalizeNpmCommand(command) {
  const normalized = command.replace(/\s+/g, " ").trim();

  if (normalized === "npm test") {
    return { manager: "npm", script: "test" };
  }

  const match = normalized.match(/^npm run ([a-z0-9:._-]+)$/i);
  if (match) {
    return { manager: "npm", script: match[1] };
  }

  return null;
}

function hasNpmScript(command, packageScripts) {
  const parsed = normalizeNpmCommand(command);
  if (!parsed) {
    return true;
  }

  return packageScripts.some((packageFile) => Object.prototype.hasOwnProperty.call(packageFile.scripts, parsed.script));
}

module.exports = {
  discoverPackageScripts,
  hasNpmScript,
  normalizeNpmCommand
};
