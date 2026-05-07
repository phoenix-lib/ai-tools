const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function listFiles(relativeDir, predicate) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      return listFiles(relativePath, predicate);
    }
    return entry.isFile() && predicate(relativePath) ? [relativePath] : [];
  });
}

function assertIncludesAll(content, values, label) {
  for (const value of values) {
    assert.ok(content.includes(value), `${label} missing ${value}`);
  }
}

function phaseNumber(relativePath) {
  const match = relativePath.match(/\/(\d{2})-CONTEXT\.md$/);
  return match ? Number(match[1]) : 0;
}

test("AGENTS documents discuss-mode preflight before discuss artifacts", () => {
  const agents = read("AGENTS.md").replace(/\s+/g, " ");

  assertIncludesAll(
    agents,
    [
      "Before any `$gsd-discuss-phase` gray-area analysis",
      "checkpoint writes",
      "`*-CONTEXT.md`",
      "`*-DISCUSSION-LOG.md`",
      "resolve gate id `discuss-mode`",
      "`workflow.discuss_mode` is routing only",
      "present a plain-text numbered list and stop",
      "Do not write phase discussion artifacts until the user answers",
      "selected mode, selected_by, approval source, evidence",
      "self-questioning cycle limits or skip reason"
    ],
    "AGENTS discuss-mode preflight"
  );
});

test("discuss-mode gate blocks all pre-artifact discuss work", () => {
  const registry = JSON.parse(read(".planning/gates/registry.json"));
  const gate = registry.gates.find((candidate) => candidate.id === "discuss-mode");

  assert.ok(gate, "discuss-mode gate must exist");
  assert.equal(gate.skip_allowed, false);
  assert.equal(gate.skip_reason_required, true);
  assertIncludesAll(gate.stages, ["discuss"], "discuss-mode stages");
  assertIncludesAll(
    gate.blocks_before,
    [
      "gray-area analysis",
      "user questions",
      "checkpoint writes",
      "*-CONTEXT.md",
      "*-DISCUSSION-LOG.md"
    ],
    "discuss-mode preflight blockers"
  );
  assertIncludesAll(
    gate.required_fields,
    [
      "mode",
      "selected_by",
      "approval_source",
      "evidence",
      "cycle_limits_or_skip_reason",
      "workflow_discuss_mode_is_routing_only"
    ],
    "discuss-mode required fields"
  );
  assert.match(gate.description, /workflow\.discuss_mode is routing only/);
});

test("existing discuss contexts preserve discuss-mode evidence", () => {
  const contexts = listFiles(".planning/phases", (relativePath) => relativePath.endsWith("-CONTEXT.md"));

  assert.ok(contexts.length > 0, "expected existing phase contexts");

  for (const relativePath of contexts) {
    const content = read(relativePath);
    const label = `${relativePath} discuss-mode evidence`;

    assert.match(content, /(Discuss Mode Gate|## Discuss Mode)/, label);
    assert.match(content, /(Trusted Self-Questioning|Trusted self-questioning|Manual Questions|Manual)/, label);
    assert.match(content, /(Approved by: user|Selected by: user|selected_by)/, label);
    assert.match(content, /(Evidence:|Cycles run|cycle)/, label);

    if (phaseNumber(relativePath) >= 4) {
      assert.match(content, /## Gate Resolution/, label);
      assert.match(content, /Discuss Mode Gate/, label);
      assert.match(content, /(Approval source|Approved by|approval_source)/, label);
      assert.match(content, /(cycle limits|skip reason|Cycles run)/i, label);
    }
  }
});
