const fs = require("node:fs");
const path = require("node:path");

const REQUIRED_GATE_FIELDS = [
  "id",
  "name",
  "description",
  "stages",
  "required_artifacts",
  "required_fields",
  "observable_outputs",
  "skip_allowed",
  "skip_reason_required",
  "automation_boundary"
];

const REQUIRED_FIELD_MAPPINGS = {
  required_artifacts: "requiredArtifacts",
  schema_version: "schemaVersion",
  skip_allowed: "skipAllowed"
};

const REQUIRED_STAGE_ALIASES = {
  release: "phase-boundary",
  replan: "plan",
  verification: "verify"
};

function emptyCheckResult() {
  return {
    blockers: [],
    evidence: [],
    findings: [],
    preserved_stricter_local_rules: [],
    recommended_actions: [],
    rejected_assumptions: [],
    required_decisions: []
  };
}

function sanitizeId(value) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function evidenceRef(result, source, reason, evidenceType = "gate_artifact") {
  const id = `ev-${result.evidence.length + 1}`;
  result.evidence.push({
    confidence: "verified",
    evidence_type: evidenceType,
    id,
    path: source,
    path_only: true,
    reason
  });
  return id;
}

function addFinding(result, source, options) {
  const findingId = `${options.checkId.toLowerCase()}-${sanitizeId(source)}-${result.findings.length + 1}`;
  const evidenceId = evidenceRef(result, source, options.evidenceReason ?? options.summary, options.evidenceType);
  const actionId = `act-${findingId}`;

  result.recommended_actions.push({
    finding_refs: [findingId],
    human_review_required: options.status_contribution !== "info",
    id: actionId,
    rationale: options.actionRationale ?? options.summary,
    suggested_file: source,
    summary: options.actionSummary ?? "Review mechanical gate evidence.",
    target_owner: "assistant"
  });
  result.findings.push({
    confidence: options.confidence ?? "verified",
    evidence_refs: [evidenceId],
    id: findingId,
    recommended_action_refs: [actionId],
    severity: options.severity ?? "medium",
    source_check_id: options.checkId,
    status_contribution: options.status_contribution ?? "human_review_required",
    summary: options.summary,
    title: options.title
  });
}

function addBlockerFinding(result, blocker) {
  addFinding(result, blocker.source, {
    checkId: blocker.id.toUpperCase(),
    severity: "high",
    status_contribution: "blocked",
    summary: blocker.reason,
    title: "Gate scan input is not reliable"
  });
}

function isLiteralProjectPath(value) {
  return typeof value === "string" &&
    value.length > 0 &&
    !value.includes("*") &&
    !value.includes("<") &&
    !value.includes(">") &&
    !/\s/.test(value) &&
    !value.includes("active ") &&
    !value.endsWith("/") &&
    !value.includes("{") &&
    !value.includes("}");
}

function pathExists(projectDir, relativePath) {
  return fs.existsSync(path.join(projectDir, ...relativePath.split("/")));
}

function checkRegistryPresence(result, discovery) {
  if (!discovery.gateRegistry.exists) {
    addFinding(result, ".planning/gates/registry.json", {
      checkId: "GATE-REGISTRY-MISSING",
      severity: "high",
      summary: "Project is missing .planning/gates/registry.json.",
      title: "Gate registry missing"
    });
  }
}

function checkDuplicateGateIds(result, registry) {
  const seen = new Set();
  const duplicates = new Set();

  for (const gate of registry.gates ?? []) {
    if (seen.has(gate.id)) {
      duplicates.add(gate.id);
    }
    seen.add(gate.id);
  }

  for (const duplicate of duplicates) {
    addFinding(result, ".planning/gates/registry.json", {
      checkId: "GATE-DUPLICATE-ID",
      summary: `Gate registry contains duplicate gate id ${duplicate}.`,
      title: "Duplicate gate id"
    });
  }
}

function checkRequiredGateFields(result, registry) {
  for (const gate of registry.gates ?? []) {
    for (const field of REQUIRED_GATE_FIELDS) {
      if (gate[field] === undefined || gate[field] === null || gate[field] === "" ||
        (Array.isArray(gate[field]) && gate[field].length === 0)) {
        addFinding(result, ".planning/gates/registry.json", {
          checkId: "GATE-REQUIRED-FIELD-MISSING",
          summary: `Gate ${gate.id ?? "(missing id)"} is missing required field ${field}.`,
          title: "Gate required field missing"
        });
      }
    }
  }
}

function checkObservableOutputs(result, registry) {
  for (const gate of registry.gates ?? []) {
    if (!Array.isArray(gate.observable_outputs) || gate.observable_outputs.length === 0) {
      addFinding(result, ".planning/gates/registry.json", {
        checkId: "GATE-OBSERVABLE-OUTPUT-MISSING",
        summary: `Gate ${gate.id ?? "(missing id)"} does not declare observable outputs.`,
        title: "Gate observable outputs missing"
      });
    }
  }
}

function checkInterop(result, registry) {
  const interop = registry.interop ?? {};
  const mapping = interop.field_name_mapping ?? {};
  const aliases = interop.stage_aliases ?? {};

  if (registry.interop) {
    for (const [localName, kitName] of Object.entries(REQUIRED_FIELD_MAPPINGS)) {
      if (mapping[localName] !== kitName) {
        addFinding(result, ".planning/gates/registry.json", {
          checkId: "GATE-INTEROP-MAPPING-DRIFT",
          summary: `Gate registry is missing interop field mapping ${localName} -> ${kitName}.`,
          title: "Gate registry interop mapping drift"
        });
      }
    }

    for (const [localStage, kitStage] of Object.entries(REQUIRED_STAGE_ALIASES)) {
      if (aliases[localStage] !== kitStage) {
        addFinding(result, ".planning/gates/registry.json", {
          checkId: "GATE-STAGE-ALIAS-DRIFT",
          summary: `Gate registry is missing stage alias ${localStage} -> ${kitStage}.`,
          title: "Gate registry stage alias drift"
        });
      }
    }
  }
}

function checkStalePaths(result, discovery, registry) {
  const paths = new Set();

  for (const gate of registry.gates ?? []) {
    for (const artifact of gate.required_artifacts ?? []) {
      if (isLiteralProjectPath(artifact)) {
        paths.add(artifact);
      }
    }
  }

  for (const relativePath of paths) {
    if (!pathExists(discovery.projectDir, relativePath)) {
      addFinding(result, relativePath, {
        checkId: "GATE-STALE-PATH",
        summary: `Referenced gate artifact path does not exist: ${relativePath}.`,
        title: "Gate artifact path is stale"
      });
    }
  }
}

function checkArtifactGateResolution(result, discovery, registry) {
  const gatesById = new Map((registry.gates ?? []).map((gate) => [gate.id, gate]));

  for (const artifact of discovery.phaseArtifacts) {
    const gateMatch = artifact.content.match(/Gate:\s*`?([a-z0-9-]+)`?/i);
    const mentionsGateResolution = /^## Gate Resolution\b/m.test(artifact.content);

    if (gateMatch && !mentionsGateResolution) {
      addFinding(result, artifact.projectRelativePath, {
        checkId: "GATE-RESOLUTION-MISSING",
        summary: `${artifact.projectRelativePath} names gate ${gateMatch[1]} but has no ## Gate Resolution section.`,
        title: "Gate resolution section missing"
      });
    }

    if (!mentionsGateResolution) {
      continue;
    }

    for (const [gateId, gate] of gatesById.entries()) {
      const gateBlockPattern = new RegExp(`Gate:\\s*\`?${gateId}\`?[\\s\\S]{0,500}`, "i");
      const gateBlock = artifact.content.match(gateBlockPattern)?.[0] ?? "";
      if (!gateBlock) {
        continue;
      }

      if (gate.skip_allowed === false && /Status:\s*skipped|-\s*Status:\s*skipped/i.test(gateBlock)) {
        addFinding(result, artifact.projectRelativePath, {
          checkId: "GATE-SKIP-NONSKIPPABLE",
          summary: `${artifact.projectRelativePath} marks non-skippable gate ${gateId} as skipped.`,
          title: "Non-skippable gate marked skipped"
        });
      }

      if (gate.skip_reason_required === true && /Status:\s*skipped|-\s*Status:\s*skipped/i.test(gateBlock) &&
        !/skip reason:\s*\S/i.test(gateBlock)) {
        addFinding(result, artifact.projectRelativePath, {
          checkId: "GATE-SKIP-REASON-MISSING",
          summary: `${artifact.projectRelativePath} skips gate ${gateId} without a skip reason.`,
          title: "Skipped gate missing required reason"
        });
      }
    }
  }
}

function checkDiscussModeApproval(result, discovery) {
  for (const artifact of discovery.phaseArtifacts) {
    if (/Approval source:\s*`?workflow\.discuss_mode`?/i.test(artifact.content) ||
      /workflow\.discuss_mode\s+(was\s+)?(used\s+as\s+)?approval evidence/i.test(artifact.content)) {
      addFinding(result, artifact.projectRelativePath, {
        checkId: "GATE-DISCUSS-MODE-ROUTING-ONLY",
        summary: `${artifact.projectRelativePath} uses workflow.discuss_mode as discuss-mode approval evidence.`,
        title: "Discuss mode routing treated as approval"
      });
    }
  }
}

function checkChangelogImpact(result, discovery) {
  const changelog = discovery.docs.changelog ?? "";
  if (!/gate/i.test(changelog) || !/validation/i.test(changelog) || !/compatibility impact/i.test(changelog)) {
    addFinding(result, "CHANGELOG.md", {
      checkId: "GATE-CHANGELOG-IMPACT-MISSING",
      summary: "CHANGELOG.md does not record gate/workflow change validation and compatibility impact.",
      title: "Gate changelog impact missing"
    });
  }
}

function checkUnresolvedReferences(result, discovery) {
  for (const artifact of discovery.phaseArtifacts) {
    if (/\b(TODO|unresolved|stale reference)\b/i.test(artifact.content)) {
      addFinding(result, artifact.projectRelativePath, {
        checkId: "GATE-UNRESOLVED-REFERENCE",
        severity: "low",
        summary: `${artifact.projectRelativePath} contains unresolved reference markers.`,
        title: "Unresolved gate reference marker"
      });
    }
  }
}

function checkConflictingWording(result, discovery) {
  const docs = [
    [".planning/gates/WORKFLOW-GATES.md", discovery.docs.workflowGates],
    ["AGENTS.md", discovery.docs.agents]
  ];

  for (const [source, content] of docs) {
    if (content && /must\s+.*\b(?:not|never)\b|\b(?:required|forbidden)\b.*\b(?:forbidden|required)\b/i.test(content)) {
      addFinding(result, source, {
        checkId: "GATE-CONFLICTING-WORDING",
        severity: "low",
        summary: `${source} contains mechanically conflicting required/forbidden wording that needs review.`,
        title: "Potentially conflicting gate wording"
      });
    }
  }
}

function runChecks(discovery) {
  const result = emptyCheckResult();

  for (const blocker of discovery.blockers) {
    addBlockerFinding(result, blocker);
  }

  checkRegistryPresence(result, discovery);

  const registry = discovery.gateRegistry.value;
  if (!registry) {
    return result;
  }

  checkDuplicateGateIds(result, registry);
  checkRequiredGateFields(result, registry);
  checkObservableOutputs(result, registry);
  checkInterop(result, registry);
  checkStalePaths(result, discovery, registry);
  checkArtifactGateResolution(result, discovery, registry);
  checkDiscussModeApproval(result, discovery);
  checkChangelogImpact(result, discovery);
  checkUnresolvedReferences(result, discovery);
  checkConflictingWording(result, discovery);

  return result;
}

module.exports = {
  REQUIRED_GATE_FIELDS,
  addFinding,
  emptyCheckResult,
  runChecks,
  sanitizeId
};
