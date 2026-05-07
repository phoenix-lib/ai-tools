const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assertIncludesAll(content, values, label) {
  for (const value of values) {
    assert.ok(content.includes(value), `${label} missing ${value}`);
  }
}

const requiredRequestFields = [
  "ID:",
  "From:",
  "To:",
  "Status:",
  "Severity:",
  "Requested by phase/gate:",
  "Boundary classification:"
];

const requiredRequestHeadings = [
  "## Need",
  "## Why",
  "## Evidence",
  "## Boundary",
  "## Expected Output",
  "## Compatibility Impact",
  "## Acceptance Criteria",
  "## Non-Goals",
  "## Decision Needed",
  "## Review / Expiry"
];

const requiredDecisionFields = [
  "Request ID:",
  "Decision:",
  "Decided by:",
  "Date:",
  "Target phase:",
  "Reason:"
];

const requiredDecisionHeadings = [
  "## Outcome",
  "## Scope Accepted",
  "## Scope Rejected",
  "## Required Follow-Up",
  "## Compatibility Notes"
];

const boundaryClassifications = [
  "kit-owned infrastructure",
  "interop contract",
  "recommendation guidance",
  "external ai-tools capability",
  "unclear boundary"
];

const decisionStatuses = [
  "proposed",
  "needs-clarification",
  "accepted",
  "planned",
  "implemented",
  "deferred",
  "rejected",
  "superseded",
  "stale"
];

const requiredGateIds = [
  "discuss-mode",
  "upstream-freshness",
  "cross-repo-outgoing",
  "cross-repo-incoming",
  "changelog",
  "self-use",
  "new-tool-intake",
  "git-baseline",
  "future-gate-review"
];

test("cross-repo protocol directories exist", () => {
  for (const relativePath of [
    ".planning/cross-repo/inbox",
    ".planning/cross-repo/outbox",
    ".planning/cross-repo/decisions",
    ".planning/cross-repo/templates"
  ]) {
    assert.equal(exists(relativePath), true, `${relativePath} must exist`);
  }
});

test("capability request template contains required fields and vocabulary", () => {
  const content = read(".planning/cross-repo/templates/CAPABILITY-REQUEST.md");

  assertIncludesAll(content, requiredRequestFields, "request template fields");
  assertIncludesAll(content, requiredRequestHeadings, "request template headings");
  assertIncludesAll(content, boundaryClassifications, "boundary classifications");
});

test("capability decision template contains required fields and statuses", () => {
  const content = read(".planning/cross-repo/templates/CAPABILITY-DECISION.md");

  assertIncludesAll(content, requiredDecisionFields, "decision template fields");
  assertIncludesAll(content, requiredDecisionHeadings, "decision template headings");
  assertIncludesAll(content, decisionStatuses, "decision statuses");
});

test("playbook documents gate routing and non-automation boundaries", () => {
  const content = read(".planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md");

  assertIncludesAll(
    content,
    [
      "Outgoing Need Gate",
      "Incoming Review Gate",
      "ai-workspace-kit owns",
      "AI Tools owns",
      "not an automatic obligation",
      "Do not auto-run tools",
      "Do not auto-create phases",
      "Do not copy `.planning` state",
      "Mechanical output is evidence only"
    ],
    "playbook"
  );
});

test("gate registry contains required gate IDs and fields", () => {
  const registry = JSON.parse(read(".planning/gates/registry.json"));
  const gates = new Map(registry.gates.map((gate) => [gate.id, gate]));

  assert.equal(registry.schema_version, "1.0");

  for (const id of requiredGateIds) {
    assert.equal(gates.has(id), true, `missing gate ${id}`);
    const gate = gates.get(id);

    for (const field of [
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
    ]) {
      assert.ok(Object.hasOwn(gate, field), `${id} missing ${field}`);
    }

    assert.ok(Array.isArray(gate.stages) && gate.stages.length > 0, `${id} must define stages`);
    assert.ok(
      Array.isArray(gate.observable_outputs) && gate.observable_outputs.length > 0,
      `${id} must define observable outputs`
    );
  }
});

test("example and real capability requests are complete", () => {
  for (const relativePath of [
    ".planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md",
    ".planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md",
    ".planning/cross-repo/outbox/REQ-20260507-ai-tools-to-ai-workspace-kit-review-packet-contract.md"
  ]) {
    const content = read(relativePath);

    assertIncludesAll(content, requiredRequestFields, `${relativePath} fields`);
    assertIncludesAll(content, requiredRequestHeadings, `${relativePath} headings`);
    assert.match(content, /Status: proposed/);
    assert.match(content, /Boundary classification: (external ai-tools capability|interop contract)/);
    assert.match(content, /REVIEW-SUMMARY\.json/);
    assert.match(content, /## Non-Goals[\s\S]+Do not/);
  }
});

test("real incoming request has a planned mixed decision", () => {
  const content = read(
    ".planning/cross-repo/decisions/DEC-REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md"
  );

  assertIncludesAll(content, requiredDecisionFields, "real decision fields");
  assertIncludesAll(content, requiredDecisionHeadings, "real decision headings");
  assert.match(content, /Request ID: REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review/);
  assert.match(content, /Decision: planned/);
  assert.match(content, /Scope Accepted/);
  assert.match(content, /Scope Rejected/);
  assert.match(content, /evidence, not the final decision/);
});

test("phase artifacts contain gate resolution evidence", () => {
  const context = read(".planning/phases/03-cross-repo-capability-request-gate/03-CONTEXT.md");
  assert.match(context, /## Gate Resolution/);
  assert.match(context, /Trusted self-questioning/);

  for (const relativePath of [
    ".planning/phases/03-cross-repo-capability-request-gate/03-RESEARCH.md",
    ".planning/phases/03-cross-repo-capability-request-gate/03-01-PLAN.md",
    ".planning/phases/03-cross-repo-capability-request-gate/03-02-PLAN.md",
    ".planning/phases/03-cross-repo-capability-request-gate/03-03-PLAN.md"
  ]) {
    assert.match(read(relativePath), /## Gate Resolution/, `${relativePath} needs gate evidence`);
  }
});
