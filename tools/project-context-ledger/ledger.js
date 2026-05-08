const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { canonicalJson } = require("../../shared/canonical-json");
const { isSecretLikePath, normalizeEvidencePath, secretEvidenceRef } = require("../../shared/secret-policy");
const {
  POLICY_HASH_SOURCES,
  PROJECT_CONTEXT_LEDGER_DIFF_ARTIFACT,
  PROJECT_CONTEXT_LEDGER_ARTIFACTS,
  REQUIRED_PACKET_ARTIFACTS,
  loadPackageVersion
} = require("../../shared/tool-metadata");
const { action, emptyCheckResult, finding } = require("./checks");
const { buildLedgerDiff, createLedgerRecordSnapshots } = require("./diff");

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "item";
}

function sha256File(root, relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(root, ...relativePath.split("/")))).digest("hex");
}

function existingFile(root, relativePath) {
  return fs.existsSync(path.join(root, ...relativePath.split("/")));
}

function evidenceRef(discovery, options) {
  const normalizedPath = normalizeEvidencePath(options.path);

  if (isSecretLikePath(normalizedPath)) {
    return secretEvidenceRef({
      id: options.id,
      path: normalizedPath,
      reason: options.reason
    });
  }

  const ref = {
    confidence: options.confidence ?? "verified",
    evidence_type: options.evidence_type,
    id: options.id,
    path: normalizedPath,
    path_only: options.path_only ?? false,
    reason: options.reason
  };

  if (!ref.path_only && existingFile(discovery.projectDir, normalizedPath)) {
    ref.sha256 = sha256File(discovery.projectDir, normalizedPath);
  }

  if (options.line) {
    ref.line = options.line;
  }

  if (options.unknown_detail) {
    ref.unknown_detail = options.unknown_detail;
  }

  return ref;
}

function addEvidence(result, ref) {
  if (!result.evidence.some((existing) => existing.id === ref.id)) {
    result.evidence.push(ref);
  }

  return ref.id;
}

function addFinding(result, findingModel, evidenceRefs, actionModel) {
  for (const ref of evidenceRefs) {
    addEvidence(result, ref);
  }

  if (actionModel && !result.recommended_actions.some((existing) => existing.id === actionModel.id)) {
    result.recommended_actions.push(actionModel);
  }

  result.findings.push(findingModel);
}

function sourceHash(discovery, relativePath) {
  const normalizedPath = normalizeEvidencePath(relativePath);
  if (isSecretLikePath(normalizedPath) || !existingFile(discovery.projectDir, normalizedPath)) {
    return null;
  }

  return sha256File(discovery.projectDir, normalizedPath);
}

function fact({ id, category, text, value, evidenceRefs, confidence, sourceCategory, sourcePath, sourceSha256, timestamp, staleReason, unknownDetail }) {
  const result = {
    category,
    confidence,
    evidence_refs: evidenceRefs,
    id,
    last_checked: timestamp,
    source_category: sourceCategory,
    source_path: sourcePath
  };

  if (text !== undefined) {
    result.text = text;
  }

  if (value !== undefined) {
    result.value = value;
  }

  if (sourceSha256) {
    result.source_sha256 = sourceSha256;
  }

  if (staleReason) {
    result.stale_reason = staleReason;
  }

  if (unknownDetail) {
    result.unknown_detail = unknownDetail;
  }

  return result;
}

function sourceCategory(discovery, relativePath) {
  const normalizedPath = normalizeEvidencePath(relativePath);
  if (discovery.sourceCategories instanceof Map) {
    return discovery.sourceCategories.get(normalizedPath) ?? "unknown";
  }

  const document = (discovery.sourceDocuments ?? []).find((item) => item.path === normalizedPath);
  return document?.source_category ?? "unknown";
}

function sourceRecord(discovery, relativePath) {
  const normalizedPath = normalizeEvidencePath(relativePath);
  const record = {
    path: normalizedPath,
    path_only: isSecretLikePath(normalizedPath),
    source_category: sourceCategory(discovery, normalizedPath)
  };

  if (!record.path_only && existingFile(discovery.projectDir, normalizedPath)) {
    record.sha256 = sha256File(discovery.projectDir, normalizedPath);
  }

  return record;
}

function referenceExists(discovery, relativePath) {
  const normalizedPath = normalizeEvidencePath(relativePath);
  if (discovery.fileSet.has(normalizedPath) || existingFile(discovery.projectDir, normalizedPath)) {
    return true;
  }

  if (normalizedPath.startsWith("ai-workspace-kit/")) {
    return existingFile(discovery.projectDir, `.external/ai-workspace-kit/${normalizedPath.slice("ai-workspace-kit/".length)}`);
  }

  return false;
}

function normalizeNpmCommand(command) {
  const normalized = command.replace(/\s+/g, " ").trim();
  if (normalized === "npm test") {
    return "test";
  }

  const match = normalized.match(/^npm run ([a-z0-9:._-]+)$/i);
  return match ? match[1] : null;
}

function hasNpmScript(discovery, command) {
  const script = normalizeNpmCommand(command);
  if (!script) {
    return true;
  }

  return discovery.packageFiles.some((packageFile) => Object.prototype.hasOwnProperty.call(packageFile.scripts, script));
}

function createPolicyHashes(rootDir) {
  const hashes = {};

  for (const [policyName, relativePath] of Object.entries(POLICY_HASH_SOURCES)) {
    hashes[policyName] = sha256File(rootDir, relativePath);
  }

  for (const [policyName, relativePath] of Object.entries({
    project_context_ledger_checks: "tools/project-context-ledger/checks.js",
    project_context_ledger_discovery: "tools/project-context-ledger/discovery.js",
    project_context_ledger_ledger: "tools/project-context-ledger/ledger.js"
  })) {
    if (fs.existsSync(path.join(rootDir, relativePath))) {
      hashes[policyName] = sha256File(rootDir, relativePath);
    }
  }

  return hashes;
}

function readPreviousManifest(outDir) {
  const manifestPath = path.join(outDir, "CACHE-MANIFEST.json");
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    return null;
  }
}

function selectPreviousManifest(options) {
  if (options.previousManifest) {
    return options.previousManifest;
  }

  return readPreviousManifest(options.outDir);
}

function changedPreviousSources(previousManifest, currentSources) {
  if (!previousManifest || !Array.isArray(previousManifest.scanned_sources)) {
    return [];
  }

  const currentByPath = new Map(currentSources.map((source) => [source.path, source.sha256 ?? null]));
  return previousManifest.scanned_sources
    .filter((source) => !source.path_only && currentByPath.has(source.path) && currentByPath.get(source.path) !== (source.sha256 ?? null))
    .map((source) => ({
      current_sha256: currentByPath.get(source.path),
      path: source.path,
      previous_sha256: source.sha256 ?? null
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function withUniqueRecordIds(records) {
  const counts = new Map();

  return records.map((record) => {
    const occurrence = (counts.get(record.id) ?? 0) + 1;
    counts.set(record.id, occurrence);

    if (occurrence === 1) {
      return record;
    }

    return {
      ...record,
      id: `${record.id}.occurrence-${occurrence}`
    };
  });
}

function buildLedger(discovery, options) {
  const timestamp = options.timestamp;
  const rootDir = path.join(__dirname, "../..");
  const result = emptyCheckResult();
  const facts = [];
  const commands = [];
  const contracts = [];
  const skills = [];
  const decisions = [];

  for (const blocker of discovery.blockers ?? []) {
    result.blockers.push(blocker);
  }

  for (const secretPath of discovery.secretPaths ?? []) {
    addEvidence(result, secretEvidenceRef({
      id: `ev.secret.${slug(secretPath)}`,
      path: secretPath,
      reason: "Secret-like path discovered; contents are path-only evidence."
    }));
  }

  for (const generatedPath of discovery.generatedPacketDirs ?? []) {
    addEvidence(result, {
      confidence: "verified",
      evidence_type: "ignored_generated_packet",
      id: `ev.ignored-packet.${slug(generatedPath)}`,
      path: generatedPath,
      path_only: true,
      reason: "Generated review packet directory was ignored as source input."
    });
  }

  for (const packageFile of discovery.packageFiles ?? []) {
    const evidenceId = addEvidence(result, evidenceRef(discovery, {
      evidence_type: "package_manifest",
      id: `ev.package.${slug(packageFile.path)}`,
      path: packageFile.path,
      reason: "Package manifest discovered for command and project identity facts."
    }));

    if (packageFile.parse_error) {
      const findingId = `ledger.package.invalid.${slug(packageFile.path)}`;
      const actionId = `act.package.fix.${slug(packageFile.path)}`;
      addFinding(result, finding({
        evidenceRefs: [evidenceId],
        id: findingId,
        severity: "medium",
        sourceCheckId: "ledger.package_json",
        summary: `${packageFile.path} could not be parsed: ${packageFile.parse_error}`,
        title: "Package manifest could not be parsed"
      }), [], action({
        findingRefs: [findingId],
        id: actionId,
        rationale: "The ledger cannot reliably extract command facts from invalid JSON.",
        suggestedFile: packageFile.path,
        summary: "Fix the package manifest JSON."
      }));
      continue;
    }

    if (packageFile.name) {
      facts.push(fact({
        category: "project",
        confidence: "verified",
        evidenceRefs: [evidenceId],
        id: `fact.package-name.${slug(packageFile.path)}`,
        sourceCategory: packageFile.source_category ?? sourceCategory(discovery, packageFile.path),
        sourcePath: packageFile.path,
        sourceSha256: sourceHash(discovery, packageFile.path),
        text: `Package ${packageFile.path} declares project name ${packageFile.name}.`,
        timestamp,
        value: packageFile.name
      }));
    }

    for (const [scriptName, commandText] of Object.entries(packageFile.scripts ?? {}).sort(([left], [right]) => left.localeCompare(right))) {
      commands.push({
        command: commandText,
        confidence: "verified",
        evidence_refs: [evidenceId],
        id: `cmd.script.${slug(packageFile.path)}.${slug(scriptName)}`,
        kind: "package_script",
        name: scriptName,
        package_path: packageFile.path,
        source_category: packageFile.source_category ?? sourceCategory(discovery, packageFile.path),
        source_path: packageFile.path
      });
    }

    for (const [binName, binPath] of Object.entries(packageFile.package_bin ?? {}).sort(([left], [right]) => left.localeCompare(right))) {
      commands.push({
        command: binPath,
        confidence: "inferred",
        evidence_refs: [evidenceId],
        id: `cmd.bin.${slug(packageFile.path)}.${slug(binName)}`,
        kind: "package_bin",
        name: binName,
        package_path: packageFile.path,
        source_category: packageFile.source_category ?? sourceCategory(discovery, packageFile.path),
        source_path: packageFile.path
      });
    }
  }

  for (const document of [...(discovery.contractFiles ?? []), ...(discovery.planningFiles ?? [])]) {
    const evidenceId = addEvidence(result, evidenceRef(discovery, {
      evidence_type: document.path.endsWith("AGENTS.md") || document.path.endsWith("CLAUDE.md") ? "assistant_contract" : "planning_document",
      id: `ev.doc.${slug(document.path)}`,
      path: document.path,
      reason: "Document read as ledger source evidence."
    }));

    const isContract = (discovery.contractFiles ?? []).some((contract) => contract.path === document.path);
    if (isContract) {
      contracts.push({
        confidence: "verified",
        evidence_refs: [evidenceId],
        id: `contract.${slug(document.path)}`,
        path: document.path,
        source_category: document.source_category ?? sourceCategory(discovery, document.path),
        source_path: document.path,
        source_sha256: sourceHash(discovery, document.path),
        type: "assistant_contract"
      });
    }

    const decisionMatches = (document.content ?? "").matchAll(/\b(D-\d{2})\s*:\**\s*(.+)$/gm);
    for (const match of decisionMatches) {
      decisions.push({
        confidence: "verified",
        evidence_refs: [evidenceId],
        id: `decision.context.${slug(document.path)}.${match[1].toLowerCase()}`,
        source_category: document.source_category ?? sourceCategory(discovery, document.path),
        source_path: document.path,
        text: match[2].trim(),
        type: "context_decision"
      });
    }
  }

  for (const reference of discovery.references ?? []) {
    const sourceEvidenceId = addEvidence(result, evidenceRef(discovery, {
      evidence_type: reference.source_layer ? "source_layer_reference" : "file_reference",
      id: `ev.ref.${slug(reference.source_path)}.${reference.line}`,
      line: reference.line,
      path: reference.source_path,
      reason: `This line references ${reference.path}.`
    }));
    const exists = referenceExists(discovery, reference.path);

    contracts.push({
      confidence: exists ? "verified" : reference.reference_kind === "real" ? "stale" : "inferred",
      evidence_refs: [sourceEvidenceId],
      id: `contract.reference.${slug(reference.source_path)}.${reference.line}.${slug(reference.path)}`,
      path: reference.path,
      reference_kind: reference.reference_kind ?? "real",
      source_category: reference.source_category ?? sourceCategory(discovery, reference.source_path),
      source_path: reference.source_path,
      type: reference.source_layer ? "source_layer_reference" : "file_reference"
    });

    if (!exists && (reference.reference_kind ?? "real") === "real") {
      const findingId = `ledger.reference.missing.${slug(reference.source_path)}.${reference.line}.${slug(reference.path)}`;
      const actionId = `act.reference.review.${slug(reference.source_path)}.${reference.line}.${slug(reference.path)}`;
      addFinding(result, finding({
        evidenceRefs: [sourceEvidenceId],
        id: findingId,
        severity: reference.source_layer ? "medium" : "low",
        sourceCheckId: "ledger.reference",
        summary: `Referenced path ${reference.path} is not present in the scanned project.`,
        title: "Ledger source reference is missing"
      }), [], action({
        findingRefs: [findingId],
        id: actionId,
        rationale: "The ledger records stale references instead of treating them as verified facts.",
        suggestedFile: reference.source_path,
        summary: `Review reference ${reference.path}.`
      }));
    }
  }

  for (const commandRef of discovery.documentedCommands ?? []) {
    const evidenceId = addEvidence(result, evidenceRef(discovery, {
      evidence_type: "documented_command",
      id: `ev.command.${slug(commandRef.source_path)}.${commandRef.line}`,
      line: commandRef.line,
      path: commandRef.source_path,
      reason: `This line documents command ${commandRef.command}.`
    }));
    const backed = hasNpmScript(discovery, commandRef.command);

    commands.push({
      command: commandRef.command,
      confidence: backed ? "verified" : "stale",
      evidence_refs: [evidenceId],
      id: `cmd.documented.${slug(commandRef.source_path)}.${commandRef.line}.${slug(commandRef.command)}`,
      kind: "documented_command",
      source_category: commandRef.source_category ?? sourceCategory(discovery, commandRef.source_path),
      source_path: commandRef.source_path
    });

    if (!backed) {
      const findingId = `ledger.command.missing.${slug(commandRef.source_path)}.${commandRef.line}.${slug(commandRef.command)}`;
      const actionId = `act.command.review.${slug(commandRef.source_path)}.${commandRef.line}.${slug(commandRef.command)}`;
      addFinding(result, finding({
        evidenceRefs: [evidenceId],
        id: findingId,
        severity: "medium",
        sourceCheckId: "ledger.command",
        summary: `Documented command ${commandRef.command} is not backed by a discovered package script.`,
        title: "Ledger command reference is missing"
      }), [], action({
        findingRefs: [findingId],
        id: actionId,
        rationale: "Documented commands should match local package scripts before downstream agents rely on them.",
        suggestedFile: commandRef.source_path,
        summary: `Review command ${commandRef.command}.`
      }));
    }
  }

  for (const skill of discovery.skillFiles ?? []) {
    const evidenceId = addEvidence(result, evidenceRef(discovery, {
      evidence_type: "skill_file",
      id: `ev.skill.${slug(skill.path)}`,
      path: skill.path,
      reason: "Project skill file discovered for ledger evidence."
    }));

    skills.push({
      confidence: skill.content && /^#\s+/.test(skill.content.trim()) ? "verified" : "unknown",
      evidence_refs: [evidenceId],
      id: `skill.${slug(skill.name)}`,
      name: skill.name,
      path: skill.path,
      source_category: skill.source_category ?? sourceCategory(discovery, skill.path),
      source_sha256: sourceHash(discovery, skill.path)
    });
  }

  if (discovery.registry?.value?.tools) {
    const evidenceId = addEvidence(result, evidenceRef(discovery, {
      evidence_type: "tool_registry",
      id: "ev.tool-registry",
      path: discovery.registry.path,
      reason: "Tool registry discovered for capability and maturity facts."
    }));

    facts.push(fact({
      category: "tools",
      confidence: "verified",
      evidenceRefs: [evidenceId],
      id: "fact.tool-registry.count",
      sourceCategory: discovery.registry.source_category ?? sourceCategory(discovery, discovery.registry.path),
      sourcePath: discovery.registry.path,
      sourceSha256: sourceHash(discovery, discovery.registry.path),
      text: `Tool registry declares ${discovery.registry.value.tools.length} tools.`,
      timestamp,
      value: discovery.registry.value.tools.length
    }));

    for (const tool of discovery.registry.value.tools) {
      decisions.push({
        confidence: "verified",
        evidence_refs: [evidenceId],
        id: `decision.tool-maturity.${slug(tool.id)}`,
        source_category: discovery.registry.source_category ?? sourceCategory(discovery, discovery.registry.path),
        source_path: discovery.registry.path,
        text: `${tool.id} maturity is ${tool.maturity}.`,
        type: "tool_registry_maturity",
        value: {
          id: tool.id,
          maturity: tool.maturity,
          owner: tool.owner
        }
      });
    }
  }

  if ((discovery.contractFiles ?? []).length === 0) {
    const fallbackPath = (discovery.files ?? []).find((relativePath) => relativePath.endsWith("README.md"));
    if (fallbackPath) {
      const evidenceId = addEvidence(result, evidenceRef(discovery, {
        confidence: "unknown",
        evidence_type: "project_file",
        id: "ev.contract.unknown",
        path: fallbackPath,
        reason: "Project file exists, but no assistant contract was discovered.",
        unknown_detail: "No AGENTS.md or CLAUDE.md contract was found."
      }));
      facts.push(fact({
        category: "contracts",
        confidence: "unknown",
        evidenceRefs: [evidenceId],
        id: "fact.assistant-contract.unknown",
        sourceCategory: sourceCategory(discovery, fallbackPath),
        sourcePath: fallbackPath,
        sourceSha256: sourceHash(discovery, fallbackPath),
        text: "No assistant contract was discovered.",
        timestamp,
        unknownDetail: "No AGENTS.md or CLAUDE.md contract was found."
      }));
    }
  }

  const scannedSources = (discovery.scopedFiles ?? discovery.files ?? []).map((relativePath) => sourceRecord(discovery, relativePath));
  const previousManifest = selectPreviousManifest(options);
  const changedSources = changedPreviousSources(previousManifest, scannedSources);

  for (const changedSource of changedSources) {
    const evidenceId = addEvidence(result, evidenceRef(discovery, {
      evidence_type: "cache_manifest",
      id: `ev.cache.changed.${slug(changedSource.path)}`,
      path: changedSource.path,
      reason: "Source hash changed since previous ledger manifest."
    }));
    const findingId = `ledger.cache.changed.${slug(changedSource.path)}`;
    addFinding(result, finding({
      confidence: "stale",
      evidenceRefs: [evidenceId],
      id: findingId,
      severity: "low",
      sourceCheckId: "ledger.cache",
      status: "human_review_required",
      summary: `${changedSource.path} changed since the previous ledger manifest.`,
      title: "Cached ledger source changed"
    }), [], null);
  }

  facts.push(fact({
    category: "safety",
    confidence: "verified",
    evidenceRefs: (discovery.generatedPacketDirs ?? []).map((generatedPath) => `ev.ignored-packet.${slug(generatedPath)}`),
    id: "fact.generated-packets.ignored",
    sourceCategory: "generated_packet",
    sourcePath: ".",
    text: `${(discovery.generatedPacketDirs ?? []).length} generated packet directories were ignored as source input.`,
    timestamp,
    value: (discovery.generatedPacketDirs ?? []).length
  }));

  facts.push(fact({
    category: "safety",
    confidence: "verified",
    evidenceRefs: (discovery.secretPaths ?? []).map((secretPath) => `ev.secret.${slug(secretPath)}`),
    id: "fact.secret-paths.path-only",
    sourceCategory: "secret",
    sourcePath: ".",
    text: `${(discovery.secretPaths ?? []).length} secret-like paths were recorded path-only.`,
    timestamp,
    value: (discovery.secretPaths ?? []).length
  }));

  const recordArtifacts = {
    "COMMANDS.json": withUniqueRecordIds(commands).sort((left, right) => left.id.localeCompare(right.id)),
    "CONTRACTS.json": withUniqueRecordIds(contracts).sort((left, right) => left.id.localeCompare(right.id)),
    "DECISIONS.json": withUniqueRecordIds(decisions).sort((left, right) => left.id.localeCompare(right.id)),
    "FACTS.json": withUniqueRecordIds(facts).sort((left, right) => left.id.localeCompare(right.id)),
    "SKILLS.json": withUniqueRecordIds(skills).sort((left, right) => left.id.localeCompare(right.id))
  };
  const ledgerRecords = createLedgerRecordSnapshots(recordArtifacts);
  const ledgerArtifacts = options.previousManifest
    ? [...PROJECT_CONTEXT_LEDGER_ARTIFACTS, PROJECT_CONTEXT_LEDGER_DIFF_ARTIFACT]
    : PROJECT_CONTEXT_LEDGER_ARTIFACTS;

  const cacheManifest = {
    ignored_generated_packet_dirs: discovery.generatedPacketDirs ?? [],
    ledger_artifacts: ledgerArtifacts,
    ledger_records: ledgerRecords,
    packet_artifacts: REQUIRED_PACKET_ARTIFACTS,
    path_only_secret_paths: discovery.secretPaths ?? [],
    policy_hashes: createPolicyHashes(rootDir),
    previous_manifest: previousManifest ? {
      changed_sources: changedSources,
      compared: true
    } : {
      compared: false,
      reason: "No previous CACHE-MANIFEST.json found in output directory."
    },
    run_timestamp: timestamp,
    scope: discovery.scope ?? "current",
    scanned_sources: scannedSources,
    schema_version: "project-context-ledger/v1",
    tool: {
      name: "project-context-ledger",
      version: loadPackageVersion(rootDir)
    }
  };

  const artifactModels = {
    "CACHE-MANIFEST.json": cacheManifest,
    ...recordArtifacts
  };

  if (options.previousManifest) {
    artifactModels[PROJECT_CONTEXT_LEDGER_DIFF_ARTIFACT] = buildLedgerDiff({
      changedSources,
      currentRecords: ledgerRecords,
      previousManifest: options.previousManifest,
      previousManifestPath: options.previousManifestPath,
      previousManifestSha256: options.previousManifestSha256,
      timestamp
    });
  }

  result.evidence.sort((left, right) => left.id.localeCompare(right.id));
  result.findings.sort((left, right) => left.id.localeCompare(right.id));
  result.recommended_actions.sort((left, right) => left.id.localeCompare(right.id));

  return {
    artifacts: Object.fromEntries(Object.entries(artifactModels).map(([name, value]) => [name, canonicalJson(value)])),
    ledger: artifactModels,
    result
  };
}

module.exports = {
  buildLedger,
  sourceHash
};
