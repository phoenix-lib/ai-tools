const path = require("node:path");
const { REVIEW_PACKET_SCHEMA_VERSION } = require("../../shared/tool-metadata");
const { deriveCounts } = require("../../shared/review-packet-renderer");
const { slug } = require("./packet-loader");

function packetSource(packet) {
  return `${packet.packet_id}:${packet.source_tool_name ?? "unknown"}`;
}

function prefixedId(packet, sourceId) {
  return `${packet.packet_id}.${sourceId}`;
}

function decisionItem(packet, item) {
  return {
    id: prefixedId(packet, item.id),
    reason: `${item.reason} Source packet: ${packet.packet_id}.`,
    source: `${packetSource(packet)}:${item.source}`
  };
}

function mapRecommendedAction(packet, action, findingIdMap) {
  const mapped = {
    ...action,
    id: prefixedId(packet, action.id)
  };

  if (Array.isArray(action.finding_refs)) {
    mapped.finding_refs = action.finding_refs.map((ref) => findingIdMap.get(ref) ?? prefixedId(packet, ref));
  }

  return mapped;
}

function evidenceLookup(packet) {
  return new Map((packet.evidence ?? []).map((ref) => [ref.id, ref]));
}

function copyEvidenceRef(packet, evidenceRef) {
  return {
    ...evidenceRef,
    id: prefixedId(packet, evidenceRef.id)
  };
}

function unknownEvidenceRef(packet, sourceRef) {
  return {
    confidence: "unknown",
    evidence_type: "missing_source_evidence",
    id: `${packet.packet_id}.ev.unknown.${slug(sourceRef)}`,
    path: "unknown",
    path_only: true,
    reason: `Source finding referenced evidence '${sourceRef}' that was not present in EVIDENCE.json.`,
    unknown_detail: `Missing evidence ref ${sourceRef} in ${packet.packet_id}.`
  };
}

function packetInputEvidence(packet, suffix, reason) {
  const fileName = suffix === "summary" ? "REVIEW-SUMMARY.json" : "EVIDENCE.json";
  return {
    confidence: "unknown",
    evidence_type: "packet_input",
    id: `${packet.packet_id}.ev.packet.${suffix}`,
    path: `packet-inputs/${packet.packet_id}/${fileName}`,
    path_only: true,
    reason,
    unknown_detail: packet.validation_errors.join("; ")
  };
}

function addEvidence(result, ref) {
  if (!result.evidence.some((existing) => existing.id === ref.id)) {
    result.evidence.push(ref);
  }
  return ref.id;
}

function validationFinding(packet) {
  const evidenceId = `${packet.packet_id}.ev.packet.summary`;
  return {
    confidence: "unknown",
    evidence_refs: [evidenceId],
    id: `rollup.packet.invalid.${packet.packet_id}`,
    recommended_action_refs: [],
    severity: "high",
    source_check_id: "rollup.packet.validation",
    status_contribution: "blocked",
    summary: `Packet ${path.basename(packet.input_path)} could not be fully validated: ${packet.validation_errors.join("; ")}`,
    title: "Input review packet is invalid"
  };
}

function unresolvedEvidenceFinding(packet, sourceFinding, sourceRef, evidenceId) {
  return {
    confidence: "unknown",
    evidence_refs: [evidenceId],
    id: `rollup.evidence.unresolved.${packet.packet_id}.${slug(sourceFinding.id)}.${slug(sourceRef)}`,
    recommended_action_refs: [],
    severity: ["critical", "high", "medium"].includes(sourceFinding.severity) ? "medium" : "low",
    source_check_id: "rollup.evidence_ref.unresolved",
    status_contribution: "human_review_required",
    summary: `Source finding ${sourceFinding.id} references evidence ${sourceRef}, but the source packet does not define that evidence ref.`,
    title: "Source finding evidence ref could not be resolved"
  };
}

function packetIndexEntry(packet) {
  return {
    artifact_hashes: packet.artifact_hashes,
    generated_artifacts: packet.generated_artifacts,
    input_path: packet.input_path,
    packet_id: packet.packet_id,
    schema_version: packet.schema_version,
    source_counts: packet.source_counts,
    source_status: packet.source_status,
    source_tool_name: packet.source_tool_name,
    source_tool_version: packet.source_tool_version,
    validation_errors: packet.validation_errors,
    validation_status: packet.validation_status
  };
}

function packetStatus(findings, blockers) {
  if ((blockers ?? []).length > 0 || findings.some((finding) => finding.status_contribution === "blocked")) {
    return "blocked";
  }
  if (findings.some((finding) => finding.status_contribution === "human_review_required")) {
    return "human_review_required";
  }
  if (findings.some((finding) => finding.status_contribution === "info")) {
    return "info";
  }
  return "pass";
}

function normalizeLoadedPackets(packetRecords) {
  const result = {
    blockers: [],
    evidence: [],
    finding_sources: [],
    findings: [],
    packet_index: [],
    preserved_stricter_local_rules: [],
    recommended_actions: [],
    rejected_assumptions: [],
    required_decisions: []
  };

  for (const packet of packetRecords) {
    result.packet_index.push(packetIndexEntry(packet));

    if (packet.validation_status !== "valid") {
      addEvidence(result, packetInputEvidence(packet, "summary", "Invalid packet summary or missing required input artifact."));
      addEvidence(result, packetInputEvidence(packet, "evidence", "Invalid packet evidence or missing required input artifact."));
      const finding = validationFinding(packet);
      result.findings.push(finding);
      result.finding_sources.push({
        finding_ref: finding.id,
        packet_id: packet.packet_id,
        source_finding_id: null,
        source_status: "invalid",
        source_tool: "invalid-packet"
      });
      continue;
    }

    const sourceEvidence = evidenceLookup(packet);
    for (const ref of packet.evidence ?? []) {
      addEvidence(result, copyEvidenceRef(packet, ref));
    }

    const findingIdMap = new Map();
    for (const sourceFinding of packet.summary.findings ?? []) {
      findingIdMap.set(sourceFinding.id, prefixedId(packet, sourceFinding.id));
    }

    for (const sourceAction of packet.summary.recommended_actions ?? []) {
      result.recommended_actions.push(mapRecommendedAction(packet, sourceAction, findingIdMap));
    }

    for (const sourceFinding of packet.summary.findings ?? []) {
      const evidenceRefs = [];
      const actionRefs = (sourceFinding.recommended_action_refs ?? []).map((ref) => {
        if (typeof ref === "string") return prefixedId(packet, ref);
        return ref.id ? prefixedId(packet, ref.id) : ref;
      });

      for (const sourceRef of sourceFinding.evidence_refs ?? []) {
        if (typeof sourceRef !== "string") {
          const copied = copyEvidenceRef(packet, sourceRef);
          evidenceRefs.push(addEvidence(result, copied));
          continue;
        }

        const existing = sourceEvidence.get(sourceRef);
        if (existing) {
          evidenceRefs.push(prefixedId(packet, sourceRef));
        } else {
          const unknownRef = unknownEvidenceRef(packet, sourceRef);
          const unknownId = addEvidence(result, unknownRef);
          evidenceRefs.push(unknownId);
          const unresolved = unresolvedEvidenceFinding(packet, sourceFinding, sourceRef, unknownId);
          result.findings.push(unresolved);
          result.finding_sources.push({
            finding_ref: unresolved.id,
            packet_id: packet.packet_id,
            source_finding_id: sourceFinding.id,
            source_status: packet.source_status,
            source_tool: packet.source_tool_name
          });
        }
      }

      const finding = {
        confidence: sourceFinding.confidence,
        evidence_refs: evidenceRefs,
        id: prefixedId(packet, sourceFinding.id),
        recommended_action_refs: actionRefs,
        severity: sourceFinding.severity,
        source_check_id: sourceFinding.source_check_id,
        status_contribution: sourceFinding.status_contribution,
        summary: sourceFinding.summary,
        title: sourceFinding.title
      };
      result.findings.push(finding);
      result.finding_sources.push({
        finding_ref: finding.id,
        packet_id: packet.packet_id,
        source_finding_id: sourceFinding.id,
        source_status: packet.source_status,
        source_tool: packet.source_tool_name
      });
    }

    for (const item of packet.summary.blockers ?? []) {
      result.blockers.push(decisionItem(packet, item));
    }
    for (const item of packet.summary.required_decisions ?? []) {
      result.required_decisions.push(decisionItem(packet, item));
    }
    for (const item of packet.summary.rejected_assumptions ?? []) {
      result.rejected_assumptions.push(decisionItem(packet, item));
    }
    for (const item of packet.summary.preserved_stricter_local_rules ?? []) {
      result.preserved_stricter_local_rules.push(decisionItem(packet, item));
    }
  }

  for (const key of ["blockers", "evidence", "findings", "preserved_stricter_local_rules", "recommended_actions", "rejected_assumptions", "required_decisions"]) {
    result[key].sort((left, right) => left.id.localeCompare(right.id));
  }
  result.finding_sources.sort((left, right) => left.finding_ref.localeCompare(right.finding_ref));
  result.packet_index.sort((left, right) => left.packet_id.localeCompare(right.packet_id));

  const summaryModel = {
    blockers: result.blockers,
    findings: result.findings,
    preserved_stricter_local_rules: result.preserved_stricter_local_rules,
    recommended_actions: result.recommended_actions,
    rejected_assumptions: result.rejected_assumptions,
    required_decisions: result.required_decisions
  };

  return {
    ...result,
    summary_model: {
      ...summaryModel,
      counts: deriveCounts(summaryModel),
      schema_version: REVIEW_PACKET_SCHEMA_VERSION,
      status: packetStatus(result.findings, result.blockers)
    }
  };
}

module.exports = {
  normalizeLoadedPackets,
  packetStatus,
  prefixedId
};
