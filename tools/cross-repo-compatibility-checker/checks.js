const fs = require("node:fs");
const {
  ALLOWED_ORIGINS,
  REQUEST_ID_PATTERN,
  REQUIRED_DECISION_FIELDS,
  REQUIRED_REQUEST_FIELDS,
  THREAD_ID_PATTERN,
  fieldValue,
  hasAbsolutePath,
  isRepoQualifiedPath,
  parseMirrorRequired,
  resolveRepoQualifiedPath,
  sanitizeId
} = require("./protocol");

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

function evidenceRef(result, artifact, reason) {
  const id = `ev-${result.evidence.length + 1}`;
  result.evidence.push({
    confidence: "verified",
    evidence_type: "cross_repo_protocol_artifact",
    id,
    path: artifact.repoQualifiedPath,
    path_only: true,
    reason
  });
  return id;
}

function addFinding(result, artifact, options) {
  const findingId = `${options.idPrefix}-${sanitizeId(artifact.repoQualifiedPath)}-${result.findings.length + 1}`;
  const evidenceId = evidenceRef(result, artifact, options.evidenceReason ?? options.summary);
  const actionId = `act-${findingId}`;

  result.recommended_actions.push({
    finding_refs: [findingId],
    human_review_required: options.status_contribution !== "info",
    id: actionId,
    rationale: options.actionRationale ?? options.summary,
    suggested_file: artifact.repoQualifiedPath,
    summary: options.actionSummary ?? "Review cross-repo compatibility metadata.",
    target_owner: "assistant"
  });
  result.findings.push({
    confidence: options.confidence ?? "verified",
    evidence_refs: [evidenceId],
    id: findingId,
    recommended_action_refs: [actionId],
    severity: options.severity ?? "medium",
    source_check_id: options.source_check_id,
    status_contribution: options.status_contribution ?? "human_review_required",
    summary: options.summary,
    title: options.title
  });
}

function validateRequiredFields(result, artifact) {
  const requiredFields = artifact.kind === "decision" ? REQUIRED_DECISION_FIELDS : REQUIRED_REQUEST_FIELDS;

  for (const field of requiredFields) {
    if (!fieldValue(artifact.metadata, field)) {
      addFinding(result, artifact, {
        idPrefix: "missing-field",
        severity: "medium",
        source_check_id: "protocol-required-fields",
        summary: `${artifact.repoQualifiedPath} is missing required field ${field}.`,
        title: `Missing protocol field: ${field}`
      });
    }
  }
}

function validateProtocolShape(result, artifact) {
  const protocolVersion = fieldValue(artifact.metadata, "Protocol version");
  const id = fieldValue(artifact.metadata, "ID");
  const canonicalId = fieldValue(artifact.metadata, "Canonical ID");
  const threadId = fieldValue(artifact.metadata, "Thread ID");
  const origin = fieldValue(artifact.metadata, "Origin");
  const mirrorRequired = fieldValue(artifact.metadata, "Mirror required");

  if (protocolVersion && protocolVersion !== "1.0") {
    addFinding(result, artifact, {
      idPrefix: "protocol-version",
      source_check_id: "protocol-version",
      summary: `${artifact.repoQualifiedPath} uses Protocol version ${protocolVersion}; expected 1.0.`,
      title: "Unsupported cross-repo protocol version"
    });
  }

  if (artifact.kind === "request" && id && !REQUEST_ID_PATTERN.test(id)) {
    addFinding(result, artifact, {
      idPrefix: "request-id-format",
      source_check_id: "canonical-request-id",
      summary: `${artifact.repoQualifiedPath} has non-canonical ID ${id}.`,
      title: "Non-canonical request ID"
    });
  }

  if (artifact.kind === "request" && canonicalId && !REQUEST_ID_PATTERN.test(canonicalId)) {
    addFinding(result, artifact, {
      idPrefix: "canonical-id-format",
      source_check_id: "canonical-request-id",
      summary: `${artifact.repoQualifiedPath} has non-canonical Canonical ID ${canonicalId}.`,
      title: "Non-canonical request Canonical ID"
    });
  }

  if (threadId && !THREAD_ID_PATTERN.test(threadId)) {
    addFinding(result, artifact, {
      idPrefix: "thread-id-format",
      source_check_id: "thread-id",
      summary: `${artifact.repoQualifiedPath} has invalid Thread ID ${threadId}.`,
      title: "Invalid Thread ID"
    });
  }

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    addFinding(result, artifact, {
      idPrefix: "origin",
      source_check_id: "origin",
      summary: `${artifact.repoQualifiedPath} has invalid Origin ${origin}.`,
      title: "Invalid request origin"
    });
  }

  if (mirrorRequired && parseMirrorRequired(mirrorRequired) === null) {
    addFinding(result, artifact, {
      idPrefix: "mirror-required",
      source_check_id: "mirror-required",
      summary: `${artifact.repoQualifiedPath} has invalid Mirror required value ${mirrorRequired}.`,
      title: "Invalid Mirror required value"
    });
  }
}

function validatePortablePaths(result, artifact) {
  const counterpartPath = fieldValue(artifact.metadata, "Counterpart path");

  if (counterpartPath && counterpartPath !== "none" && hasAbsolutePath(counterpartPath)) {
    addFinding(result, artifact, {
      idPrefix: "absolute-path",
      source_check_id: "portable-counterpart-path",
      summary: `${artifact.repoQualifiedPath} contains a machine-local absolute path.`,
      title: "Machine-local absolute path in protocol artifact"
    });
  }

  if (counterpartPath && counterpartPath !== "none" && !isRepoQualifiedPath(counterpartPath)) {
    addFinding(result, artifact, {
      idPrefix: "counterpart-path-format",
      source_check_id: "portable-counterpart-path",
      summary: `${artifact.repoQualifiedPath} uses non repo-qualified Counterpart path ${counterpartPath}.`,
      title: "Counterpart path is not repo-qualified"
    });
  }
}

function findMatchingDecision(discovery, request) {
  const requestId = fieldValue(request.metadata, "ID");
  const canonicalId = fieldValue(request.metadata, "Canonical ID");
  const threadId = fieldValue(request.metadata, "Thread ID");

  return discovery.artifacts.find((artifact) => {
    if (artifact.kind !== "decision" || artifact.repo !== request.repo) {
      return false;
    }
    return fieldValue(artifact.metadata, "Request ID") === requestId ||
      fieldValue(artifact.metadata, "Canonical ID") === canonicalId ||
      fieldValue(artifact.metadata, "Thread ID") === threadId;
  });
}

function validateMirroredCounterparts(result, discovery, request) {
  const mirrorRequired = parseMirrorRequired(fieldValue(request.metadata, "Mirror required"));
  if (mirrorRequired !== true) {
    return;
  }

  const counterpartId = fieldValue(request.metadata, "Counterpart ID");
  const counterpartPath = fieldValue(request.metadata, "Counterpart path");
  const threadId = fieldValue(request.metadata, "Thread ID");

  if (!counterpartId || counterpartId === "none" || !counterpartPath || counterpartPath === "none") {
    addFinding(result, request, {
      idPrefix: "missing-counterpart",
      source_check_id: "mirrored-counterpart",
      summary: `${request.repoQualifiedPath} requires a mirror but does not provide counterpart metadata.`,
      title: "Mirrored request missing counterpart metadata"
    });
    return;
  }

  const resolved = resolveRepoQualifiedPath(counterpartPath, discovery.roots);
  if (!resolved || !fs.existsSync(resolved.absolutePath)) {
    addFinding(result, request, {
      idPrefix: "missing-counterpart-file",
      source_check_id: "mirrored-counterpart",
      summary: `${request.repoQualifiedPath} points to missing counterpart ${counterpartPath}.`,
      title: "Mirrored counterpart path does not exist"
    });
    return;
  }

  const counterpart = discovery.artifacts.find((artifact) => artifact.repoQualifiedPath === resolved.relativePath);
  if (!counterpart) {
    addFinding(result, request, {
      idPrefix: "unread-counterpart",
      source_check_id: "mirrored-counterpart",
      summary: `${request.repoQualifiedPath} counterpart exists but was not discovered as a protocol artifact.`,
      title: "Counterpart artifact is not discoverable"
    });
    return;
  }

  const counterpartThread = fieldValue(counterpart.metadata, "Thread ID");
  if (threadId && counterpartThread && threadId !== counterpartThread) {
    addFinding(result, request, {
      idPrefix: "thread-mismatch",
      source_check_id: "mirrored-counterpart",
      summary: `${request.repoQualifiedPath} thread ${threadId} does not match counterpart thread ${counterpartThread}.`,
      title: "Mirrored request Thread ID mismatch"
    });
  }
}

function validateManualTransfer(result, discovery, request) {
  const origin = fieldValue(request.metadata, "Origin");
  const mirrorRequired = parseMirrorRequired(fieldValue(request.metadata, "Mirror required"));

  if (origin !== "manual-transfer" || mirrorRequired !== false) {
    return;
  }

  const decision = findMatchingDecision(discovery, request);
  if (!decision) {
    result.required_decisions.push({
      id: `decision-${sanitizeId(request.repoQualifiedPath)}`,
      reason: "Manual-transfer requests with Mirror required: false need an observable decision artifact.",
      source: request.repoQualifiedPath
    });
    addFinding(result, request, {
      idPrefix: "missing-manual-decision",
      source_check_id: "manual-transfer-decision",
      summary: `${request.repoQualifiedPath} is manual-transfer without a matching decision artifact.`,
      title: "Manual-transfer request needs a decision artifact"
    });
    return;
  }

  for (const field of ["Protocol version", "Decision", "Date", "Target phase"]) {
    if (!fieldValue(decision.metadata, field)) {
      addFinding(result, decision, {
        idPrefix: "malformed-decision",
        source_check_id: "manual-transfer-decision",
        summary: `${decision.repoQualifiedPath} is missing required decision field ${field}.`,
        title: `Decision artifact missing ${field}`
      });
    }
  }
}

function validateGateRegistryInterop(result, discovery) {
  const registry = discovery.registries.aiTools.value;
  if (!registry) {
    return;
  }

  const artifact = {
    repoQualifiedPath: "ai-tools/.planning/gates/registry.json"
  };
  const interop = registry.interop ?? {};
  const mapping = interop.field_name_mapping ?? {};
  const aliases = interop.stage_aliases ?? {};

  if (interop.kit_schema_direct_compatibility !== false) {
    addFinding(result, artifact, {
      idPrefix: "registry-direct-compatibility",
      source_check_id: "gate-registry-interop",
      summary: "AI Tools gate registry should explicitly declare that direct kit schema compatibility is false when using interop mapping.",
      title: "Gate registry direct compatibility declaration missing"
    });
  }

  for (const [snakeCase, camelCase] of Object.entries({
    required_artifacts: "requiredArtifacts",
    schema_version: "schemaVersion",
    skip_allowed: "skipAllowed"
  })) {
    if (mapping[snakeCase] !== camelCase) {
      addFinding(result, artifact, {
        idPrefix: "registry-field-mapping",
        source_check_id: "gate-registry-interop",
        summary: `AI Tools gate registry is missing mapping ${snakeCase} -> ${camelCase}.`,
        title: "Gate registry field mapping drift"
      });
    }
  }

  for (const [localStage, kitStage] of Object.entries({
    release: "phase-boundary",
    replan: "plan",
    verification: "verify"
  })) {
    if (aliases[localStage] !== kitStage) {
      addFinding(result, artifact, {
        idPrefix: "registry-stage-alias",
        source_check_id: "gate-registry-interop",
        summary: `AI Tools gate registry is missing stage alias ${localStage} -> ${kitStage}.`,
        title: "Gate registry stage alias drift"
      });
    }
  }
}

function runChecks(discovery) {
  const result = emptyCheckResult();

  for (const artifact of discovery.artifacts) {
    validateRequiredFields(result, artifact);
    validateProtocolShape(result, artifact);
    validatePortablePaths(result, artifact);
  }

  for (const request of discovery.artifacts.filter((artifact) => artifact.kind === "request")) {
    validateMirroredCounterparts(result, discovery, request);
    validateManualTransfer(result, discovery, request);
  }

  validateGateRegistryInterop(result, discovery);

  return result;
}

module.exports = {
  addFinding,
  emptyCheckResult,
  runChecks
};
