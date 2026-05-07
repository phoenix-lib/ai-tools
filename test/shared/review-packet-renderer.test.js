const assert = require("node:assert/strict");
const test = require("node:test");
const {
  REQUIRED_ARTIFACTS,
  renderFindingsMarkdown,
  renderPacketArtifacts,
  renderReviewSummaryJson
} = require("../../shared/review-packet-renderer");

function minimalSummary() {
  return {
    blockers: [],
    counts: {
      blockers: 0,
      findings_by_severity: {
        critical: 0,
        high: 0,
        info: 0,
        low: 0,
        medium: 1
      },
      preserved_stricter_local_rules: 0,
      rejected_assumptions: 0,
      required_decisions: 0,
      total_findings: 1
    },
    evidence_file: "EVIDENCE.json",
    findings: [
      {
        confidence: "verified",
        evidence_refs: ["ev.agents"],
        id: "drift.example",
        recommended_action_refs: ["act.example"],
        severity: "medium",
        source_check_id: "drift.example",
        status_contribution: "human_review_required",
        summary: "Example summary.",
        title: "Example finding"
      }
    ],
    generated_artifacts: REQUIRED_ARTIFACTS,
    preserved_stricter_local_rules: [],
    recommended_actions: [
      {
        finding_refs: ["drift.example"],
        human_review_required: true,
        id: "act.example",
        rationale: "Example rationale.",
        suggested_file: "AGENTS.md",
        summary: "Review the example.",
        target_owner: "project maintainer"
      }
    ],
    recommended_actions_file: "RECOMMENDED-ACTIONS.md",
    rejected_assumptions: [],
    required_decisions: [],
    schema_version: "review-packet/v1",
    status: "human_review_required",
    target_project: {
      path: "fixture"
    },
    tool: {
      generated_files: [],
      input: {
        target_path: "fixture"
      },
      policy_hashes: {},
      run_timestamp: "2026-05-07T00:00:00Z",
      safety_profile: {
        review_only: true,
        secret_policy: "path-only-secret-evidence",
        target_mutation: "none"
      },
      schema_versions: {
        review_packet: "review-packet/v1"
      },
      tool_name: "contract-drift-auditor",
      tool_version: "0.1.0"
    }
  };
}

test("renders canonical summary JSON with one trailing newline", () => {
  const output = renderReviewSummaryJson(minimalSummary());

  assert.equal(output.endsWith("\n"), true);
  assert.equal(output.endsWith("\n\n"), false);
  assert.equal(Object.keys(JSON.parse(output))[0], "blockers");
});

test("renders all required artifacts from one model", () => {
  const artifacts = renderPacketArtifacts({
    summary: minimalSummary(),
    evidence: []
  });

  assert.deepEqual(Object.keys(artifacts).sort(), [...REQUIRED_ARTIFACTS].sort());
  assert.match(artifacts["FINDINGS.md"], /Total findings: 1/);
  assert.match(artifacts["RECOMMENDED-ACTIONS.md"], /Required decisions: 0/);
});

test("markdown projection uses summary finding data", () => {
  const markdown = renderFindingsMarkdown(minimalSummary());

  assert.match(markdown, /## drift\.example/);
  assert.match(markdown, /Example finding/);
  assert.match(markdown, /Evidence refs: ev\.agents/);
});

test("renderer fails when summary counts diverge from findings", () => {
  const summary = minimalSummary();
  summary.counts.total_findings = 2;

  assert.throws(() => renderReviewSummaryJson(summary), /counts diverge/);
});
