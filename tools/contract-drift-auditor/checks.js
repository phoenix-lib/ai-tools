const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { isSecretLikePath, normalizeEvidencePath, secretEvidenceRef } = require("../../shared/secret-policy");
const { extractMarkdownReferences } = require("./references");
const { discoverPackageScripts, hasNpmScript } = require("./package-scripts");
const { findAbsentToolReferences } = require("./permissions");

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "item";
}

function hashFile(projectDir, relativePath) {
  const absolutePath = path.join(projectDir, relativePath);
  return crypto.createHash("sha256").update(fs.readFileSync(absolutePath)).digest("hex");
}

function referenceExists(discovery, relativePath) {
  if (discovery.fileSet.has(relativePath) || fs.existsSync(path.join(discovery.projectDir, relativePath))) {
    return true;
  }

  if (relativePath.startsWith("ai-workspace-kit/")) {
    const counterpartPath = relativePath.slice("ai-workspace-kit/".length);
    return fs.existsSync(path.join(discovery.projectDir, ".external", "ai-workspace-kit", counterpartPath));
  }

  return false;
}

function evidenceRef(discovery, { id, path: evidencePath, evidence_type, reason, line, confidence = "verified", unknown_detail }) {
  const normalizedPath = normalizeEvidencePath(evidencePath);

  if (isSecretLikePath(normalizedPath)) {
    return secretEvidenceRef({ id, path: normalizedPath, reason });
  }

  const ref = {
    confidence,
    evidence_type,
    id,
    path: normalizedPath,
    path_only: false,
    reason,
    sha256: hashFile(discovery.projectDir, normalizedPath)
  };

  if (line) {
    ref.line = line;
  }

  if (unknown_detail) {
    ref.unknown_detail = unknown_detail;
  }

  return ref;
}

function addFinding(result, finding, evidenceRefs, action) {
  for (const ref of evidenceRefs) {
    if (!result.evidence.some((existing) => existing.id === ref.id)) {
      result.evidence.push(ref);
    }
  }

  if (action && !result.recommended_actions.some((existing) => existing.id === action.id)) {
    result.recommended_actions.push(action);
  }

  result.findings.push(finding);
}

function sourceDocuments(discovery) {
  return [
    ...(discovery.contractFiles ?? []),
    ...(discovery.planningFiles ?? []),
    ...(discovery.skillFiles ?? [])
  ]
    .filter((document) => document.content !== null);
}

function collectReferences(discovery) {
  const documents = sourceDocuments(discovery);
  const references = [];
  const commands = [];

  for (const document of documents) {
    const extracted = extractMarkdownReferences(document);
    references.push(...extracted.references);
    commands.push(...extracted.commands);
  }

  return { documents, references, commands };
}

function checkMissingReferences(discovery, result, references) {
  const seen = new Set();

  for (const reference of references) {
    if (referenceExists(discovery, reference.path)) {
      continue;
    }

    const kind = reference.source_layer ? "source_layer" : "file";
    const key = `${kind}:${reference.path}:${reference.source_path}:${reference.line}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    const findingId = reference.source_layer ? "drift.source_layer.missing" : "drift.file.missing";
    const evidenceId = `ev.${slug(reference.source_path)}.${reference.line}`;
    const actionId = `act.${kind}.update.${slug(reference.path)}`;

    addFinding(result, {
      confidence: "verified",
      evidence_refs: [evidenceId],
      id: findingId,
      recommended_action_refs: [actionId],
      severity: reference.source_layer ? "medium" : "low",
      source_check_id: `contract.${kind}`,
      status_contribution: "human_review_required",
      summary: `Referenced ${kind.replace("_", " ")} \`${reference.path}\` is not present in the target project.`,
      title: `Missing referenced ${kind.replace("_", " ")}`
    }, [
      evidenceRef(discovery, {
        id: evidenceId,
        path: reference.source_path,
        line: reference.line,
        evidence_type: "contract_file",
        reason: `This line references missing path ${reference.path}.`
      })
    ], {
      finding_refs: [findingId],
      human_review_required: true,
      id: actionId,
      rationale: "The auditor cannot prove whether the contract or the project filesystem is authoritative.",
      suggested_file: reference.source_path,
      summary: `Update the reference to ${reference.path} or restore the missing file.`,
      target_owner: "project maintainer"
    });
  }
}

function checkCommands(discovery, result, commands) {
  const packageScripts = discoverPackageScripts(discovery);
  const seen = new Set();

  for (const command of commands) {
    if (hasNpmScript(command.command, packageScripts)) {
      continue;
    }

    const key = `${command.command}:${command.source_path}:${command.line}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    const evidenceId = `ev.command.${slug(command.source_path)}.${command.line}`;
    const actionId = `act.command.update.${slug(command.command)}`;

    addFinding(result, {
      confidence: "verified",
      evidence_refs: [evidenceId],
      id: "drift.command.missing",
      recommended_action_refs: [actionId],
      severity: "medium",
      source_check_id: "contract.command",
      status_contribution: "human_review_required",
      summary: `Documented command \`${command.command}\` is not backed by any discovered package script.`,
      title: "Referenced command is missing from package scripts"
    }, [
      evidenceRef(discovery, {
        id: evidenceId,
        path: command.source_path,
        line: command.line,
        evidence_type: "contract_command",
        reason: `This line documents command ${command.command}.`
      })
    ], {
      finding_refs: ["drift.command.missing"],
      human_review_required: true,
      id: actionId,
      rationale: "Command references must match project scripts before downstream agents rely on them.",
      suggested_file: command.source_path,
      summary: `Either add a package script for \`${command.command}\` or update the documented workflow.`,
      target_owner: "project maintainer"
    });
  }
}

function checkSkills(discovery, result, references) {
  const skillReferences = references.filter((reference) => reference.skill_reference);

  for (const reference of skillReferences) {
    if (discovery.fileSet.has(reference.path)) {
      continue;
    }

    const evidenceId = `ev.skill.${slug(reference.source_path)}.${reference.line}`;
    const actionId = `act.skill.restore.${slug(reference.path)}`;

    addFinding(result, {
      confidence: "verified",
      evidence_refs: [evidenceId],
      id: "drift.skill.missing",
      recommended_action_refs: [actionId],
      severity: "medium",
      source_check_id: "contract.skill",
      status_contribution: "human_review_required",
      summary: `Referenced skill file \`${reference.path}\` is missing.`,
      title: "Referenced local skill is missing"
    }, [
      evidenceRef(discovery, {
        id: evidenceId,
        path: reference.source_path,
        line: reference.line,
        evidence_type: "skill_reference",
        reason: `This line references missing skill ${reference.path}.`
      })
    ], {
      finding_refs: ["drift.skill.missing"],
      human_review_required: true,
      id: actionId,
      rationale: "Skill references must point to readable SKILL.md files before agents can use them.",
      suggested_file: reference.source_path,
      summary: `Restore ${reference.path} or remove the stale skill reference.`,
      target_owner: "project maintainer"
    });
  }

  for (const skill of discovery.skillFiles ?? []) {
    if (skill.content && skill.content.trim().startsWith("#")) {
      continue;
    }

    const evidenceId = `ev.skill.invalid.${slug(skill.path)}`;
    const actionId = `act.skill.fix.${slug(skill.path)}`;

    addFinding(result, {
      confidence: skill.content === null ? "unknown" : "verified",
      evidence_refs: [evidenceId],
      id: "drift.skill.invalid",
      recommended_action_refs: [actionId],
      severity: "low",
      source_check_id: "contract.skill",
      status_contribution: "human_review_required",
      summary: `Discovered skill file \`${skill.path}\` is not a readable Markdown skill with a heading.`,
      title: "Local skill file is invalid"
    }, [
      evidenceRef(discovery, {
        id: evidenceId,
        path: skill.path,
        evidence_type: "skill_file",
        reason: "Skill file exists but does not satisfy the MVP readable-skill check."
      })
    ], {
      finding_refs: ["drift.skill.invalid"],
      human_review_required: true,
      id: actionId,
      rationale: "Invalid skills should be fixed or removed from contract references.",
      suggested_file: skill.path,
      summary: "Review the skill file format.",
      target_owner: "project maintainer"
    });
  }
}

function checkAbsentToolReferences(discovery, result, documents) {
  const absentTools = findAbsentToolReferences(discovery, documents);

  for (const reference of absentTools) {
    const evidenceId = `ev.tool.${reference.tool}.${slug(reference.source_path)}.${reference.line}`;
    const actionId = `act.tool.review.${reference.tool}`;

    addFinding(result, {
      confidence: "inferred",
      evidence_refs: [evidenceId],
      id: "drift.tool.absent",
      recommended_action_refs: [actionId],
      severity: "low",
      source_check_id: "contract.permission",
      status_contribution: "human_review_required",
      summary: `The contract references \`${reference.tool}\`, but no local marker for that tool was discovered.`,
      title: "Referenced tool is not locally evidenced"
    }, [
      evidenceRef(discovery, {
        id: evidenceId,
        path: reference.source_path,
        line: reference.line,
        evidence_type: "tool_reference",
        reason: `This line references ${reference.tool}; discovery did not find matching tool evidence.`
      })
    ], {
      finding_refs: ["drift.tool.absent"],
      human_review_required: true,
      id: actionId,
      rationale: "Tool references should be evidence-backed before being treated as available or permitted.",
      suggested_file: reference.source_path,
      summary: `Review whether ${reference.tool} is actually part of this project.`,
      target_owner: "project maintainer"
    });
  }
}

function checkUnknownSourceFacts(discovery, result) {
  if ((discovery.contractFiles ?? []).length > 0) {
    return;
  }

  const evidencePath = (discovery.files ?? []).find((file) => file.endsWith("README.md")) ?? "README.md";
  if (!discovery.fileSet.has(evidencePath)) {
    return;
  }

  const evidenceId = "ev.profile.unknown";
  const actionId = "act.profile.add-contract";

  addFinding(result, {
    confidence: "unknown",
    evidence_refs: [evidenceId],
    id: "drift.profile.unknown",
    recommended_action_refs: [actionId],
    severity: "info",
    source_check_id: "contract.profile",
    status_contribution: "info",
    summary: "No local assistant contract was discovered, so source-layer and workflow facts are unresolved.",
    title: "Project contract facts are unresolved"
  }, [
    evidenceRef(discovery, {
      id: evidenceId,
      path: evidencePath,
      evidence_type: "project_file",
      reason: "A project file exists, but no AGENTS.md or CLAUDE.md contract was discovered.",
      confidence: "unknown",
      unknown_detail: "No local assistant contract was found."
    })
  ], {
    finding_refs: ["drift.profile.unknown"],
    human_review_required: false,
    id: actionId,
    rationale: "The auditor records unknown facts instead of inventing contract state.",
    summary: "Add or point the auditor to a local assistant contract if drift checks should cover source-layer facts.",
    target_owner: "project maintainer"
  });
}

function runChecks(discovery) {
  const result = {
    findings: [],
    evidence: [],
    recommended_actions: [],
    blockers: [],
    required_decisions: [],
    rejected_assumptions: [],
    preserved_stricter_local_rules: []
  };
  const { documents, references, commands } = collectReferences(discovery);

  checkMissingReferences(discovery, result, references);
  checkCommands(discovery, result, commands);
  checkSkills(discovery, result, references);
  checkAbsentToolReferences(discovery, result, documents);
  checkUnknownSourceFacts(discovery, result);

  result.findings.sort((left, right) => left.id.localeCompare(right.id) || left.summary.localeCompare(right.summary));
  result.evidence.sort((left, right) => left.id.localeCompare(right.id));
  result.recommended_actions.sort((left, right) => left.id.localeCompare(right.id));

  return result;
}

module.exports = {
  collectReferences,
  evidenceRef,
  runChecks
};
