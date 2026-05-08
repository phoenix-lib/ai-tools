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

function packetStatus(findings, blockers) {
  if ((blockers ?? []).length > 0 || findings.some((finding) => finding.status_contribution === "blocked")) {
    return "blocked";
  }

  if (findings.some((finding) => finding.status_contribution === "human_review_required")) {
    return "human_review_required";
  }

  if (findings.length > 0) {
    return "info";
  }

  return "pass";
}

function finding({ id, title, summary, evidenceRefs, actionRefs = [], severity = "low", confidence = "verified", status = "human_review_required", sourceCheckId }) {
  return {
    confidence,
    evidence_refs: evidenceRefs,
    id,
    recommended_action_refs: actionRefs,
    severity,
    source_check_id: sourceCheckId,
    status_contribution: status,
    summary,
    title
  };
}

function action({ id, summary, rationale, suggestedFile, findingRefs }) {
  const result = {
    finding_refs: findingRefs,
    human_review_required: true,
    id,
    rationale,
    summary,
    target_owner: "project maintainer"
  };

  if (suggestedFile) {
    result.suggested_file = suggestedFile;
  }

  return result;
}

module.exports = {
  action,
  emptyCheckResult,
  finding,
  packetStatus
};
