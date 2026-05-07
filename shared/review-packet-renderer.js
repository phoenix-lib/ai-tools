const fs = require("node:fs");
const path = require("node:path");
const { canonicalJson, sortValue } = require("./canonical-json");
const { REQUIRED_PACKET_ARTIFACTS } = require("./tool-metadata");

const REQUIRED_ARTIFACTS = REQUIRED_PACKET_ARTIFACTS;

const EMPTY_SEVERITY_COUNTS = {
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
  info: 0
};

function deriveCounts(summary) {
  const findingsBySeverity = { ...EMPTY_SEVERITY_COUNTS };

  for (const finding of summary.findings ?? []) {
    if (!Object.prototype.hasOwnProperty.call(findingsBySeverity, finding.severity)) {
      throw new Error(`Unknown finding severity: ${finding.severity}`);
    }
    findingsBySeverity[finding.severity] += 1;
  }

  return {
    total_findings: (summary.findings ?? []).length,
    findings_by_severity: findingsBySeverity,
    blockers: (summary.blockers ?? []).length,
    required_decisions: (summary.required_decisions ?? []).length,
    rejected_assumptions: (summary.rejected_assumptions ?? []).length,
    preserved_stricter_local_rules: (summary.preserved_stricter_local_rules ?? []).length
  };
}

function validateCounts(summary) {
  const expected = deriveCounts(summary);
  const actual = summary.counts;

  if (!actual) {
    throw new Error("Review summary counts are required.");
  }

  if (JSON.stringify(sortValue(actual)) !== JSON.stringify(sortValue(expected))) {
    throw new Error(`Review summary counts diverge from packet model. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`);
  }
}

function renderReviewSummaryJson(summary) {
  validateCounts(summary);
  return canonicalJson(summary);
}

function renderEvidenceJson(evidence) {
  return canonicalJson(evidence ?? []);
}

function renderFindingsMarkdown(summary) {
  validateCounts(summary);

  const lines = [
    "# Findings",
    "",
    `Status: ${summary.status}`,
    `Total findings: ${summary.counts.total_findings}`,
    `Required decisions: ${summary.counts.required_decisions}`,
    ""
  ];

  if ((summary.findings ?? []).length === 0) {
    lines.push("No findings.");
  } else {
    for (const finding of summary.findings) {
      lines.push(`## ${finding.id}`);
      lines.push("");
      lines.push(`Severity: ${finding.severity}`);
      lines.push(`Confidence: ${finding.confidence}`);
      lines.push(`Status contribution: ${finding.status_contribution}`);
      lines.push("");
      lines.push(finding.title);
      lines.push("");
      lines.push(finding.summary);
      lines.push("");
      lines.push(`Evidence refs: ${(finding.evidence_refs ?? []).join(", ") || "none"}`);
      lines.push(`Recommended action refs: ${(finding.recommended_action_refs ?? []).join(", ") || "none"}`);
      lines.push("");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function renderRecommendedActionsMarkdown(summary) {
  validateCounts(summary);

  const lines = [
    "# Recommended Actions",
    "",
    `Status: ${summary.status}`,
    `Total findings: ${summary.counts.total_findings}`,
    `Required decisions: ${summary.counts.required_decisions}`,
    ""
  ];

  if ((summary.recommended_actions ?? []).length === 0) {
    lines.push("No recommended actions.");
  } else {
    for (const action of summary.recommended_actions) {
      lines.push(`## ${action.id}`);
      lines.push("");
      lines.push(`Owner: ${action.target_owner}`);
      lines.push(`Human review required: ${action.human_review_required}`);
      if (action.suggested_file) {
        lines.push(`Suggested file: ${action.suggested_file}`);
      }
      if (action.suggested_command) {
        lines.push(`Suggested command: ${action.suggested_command}`);
      }
      lines.push("");
      lines.push(action.summary);
      lines.push("");
      lines.push(action.rationale);
      lines.push("");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function renderPacketArtifacts(packet) {
  const { summary, evidence } = packet;

  return {
    "REVIEW-SUMMARY.json": renderReviewSummaryJson(summary),
    "EVIDENCE.json": renderEvidenceJson(evidence),
    "FINDINGS.md": renderFindingsMarkdown(summary),
    "RECOMMENDED-ACTIONS.md": renderRecommendedActionsMarkdown(summary)
  };
}

function writePacketArtifacts(packet, outDir) {
  const artifacts = renderPacketArtifacts(packet);
  fs.mkdirSync(outDir, { recursive: true });

  for (const [fileName, content] of Object.entries(artifacts)) {
    fs.writeFileSync(path.join(outDir, fileName), content, "utf8");
  }

  return artifacts;
}

module.exports = {
  REQUIRED_ARTIFACTS,
  deriveCounts,
  renderEvidenceJson,
  renderFindingsMarkdown,
  renderPacketArtifacts,
  renderRecommendedActionsMarkdown,
  renderReviewSummaryJson,
  validateCounts,
  writePacketArtifacts
};
