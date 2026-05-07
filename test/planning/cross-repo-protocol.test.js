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
  "Protocol version:",
  "Canonical ID:",
  "Counterpart ID:",
  "Counterpart path:",
  "Legacy ID:",
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
  "Protocol version:",
  "Request ID:",
  "Canonical ID:",
  "Counterpart ID:",
  "Counterpart path:",
  "Legacy ID:",
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

const requestPaths = [
  ".planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md",
  ".planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-changelog-gate-review.md",
  ".planning/cross-repo/outbox/REQ-20260507-ai-tools-to-ai-workspace-kit-review-packet-contract.md"
];

function fieldValue(content, field) {
  const match = content.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

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

test("gate registry declares kit compatibility mapping", () => {
  const registry = JSON.parse(read(".planning/gates/registry.json"));

  assert.equal(registry.interop.compatibility, "ai-tools-specific");
  assert.equal(registry.interop.kit_schema_direct_compatibility, false);
  assert.equal(registry.interop.field_name_mapping.schema_version, "schemaVersion");
  assert.equal(registry.interop.field_name_mapping.required_artifacts, "requiredArtifacts");
  assert.equal(registry.interop.field_name_mapping.skip_allowed, "skipAllowed");
  assert.equal(registry.interop.stage_aliases.verification, "verify");
  assert.equal(registry.interop.stage_aliases.release, "phase-boundary");
  assert.equal(registry.interop.stage_aliases.replan, "plan");
});

test("example and real capability requests are complete", () => {
  for (const relativePath of requestPaths) {
    const content = read(relativePath);

    assertIncludesAll(content, requiredRequestFields, `${relativePath} fields`);
    assertIncludesAll(content, requiredRequestHeadings, `${relativePath} headings`);
    assert.equal(fieldValue(content, "Protocol version"), "1.0");
    assert.match(
      fieldValue(content, "ID"),
      /^REQ-\d{8}-[a-z0-9-]+-to-[a-z0-9-]+-[a-z0-9-]+$/,
      `${relativePath} must use canonical REQ ID`
    );
    assert.match(content, /Status: proposed/);
    assert.match(content, /Boundary classification: (external ai-tools capability|interop contract)/);
    assert.match(content, /REVIEW-SUMMARY\.json/);
    assert.match(content, /## Non-Goals[\s\S]+Do not/);
  }
});

test("mirrored capability requests have counterpart metadata", () => {
  for (const relativePath of [
    ".planning/cross-repo/inbox/REQ-20260507-ai-workspace-kit-to-ai-tools-contract-drift-auditor.md",
    ".planning/cross-repo/outbox/REQ-20260507-ai-tools-to-ai-workspace-kit-review-packet-contract.md"
  ]) {
    const content = read(relativePath);
    const id = fieldValue(content, "ID");
    const counterpartId = fieldValue(content, "Counterpart ID");
    const counterpartPath = fieldValue(content, "Counterpart path");
    const legacyId = fieldValue(content, "Legacy ID");

    assert.notEqual(counterpartId, "", `${relativePath} needs counterpart ID`);
    assert.notEqual(counterpartPath, "", `${relativePath} needs counterpart path`);
    assert.notEqual(legacyId, "", `${relativePath} needs legacy ID`);
    assert.notEqual(counterpartId, "none", `${relativePath} mirrors a real counterpart`);
    assert.notEqual(counterpartPath, "none", `${relativePath} mirrors a real counterpart path`);
    assert.notEqual(legacyId, "none", `${relativePath} mirrors a real legacy ID`);
    assert.match(counterpartId, /^REQ-\d{8}-[a-z0-9-]+-to-[a-z0-9-]+-[a-z0-9-]+$/);
    assert.ok(
      id === counterpartId || legacyId.startsWith("2026-"),
      `${relativePath} must use matching canonical IDs or explicit legacy pairing`
    );
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
