const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertIncludesAll(content, values, label) {
  for (const value of values) {
    assert.ok(content.includes(value), `${label} missing ${value}`);
  }
}

test("workflow gates doc preserves moved gate policy", () => {
  const docs = read(".planning/gates/WORKFLOW-GATES.md");

  assertIncludesAll(
    docs,
    [
      "Discuss Mode Gate",
      "Kit Update Self-Check",
      "Project Changelog Gate",
      "AI Tools Self-Use Gate",
      "New Tool Intake and Placement Gate",
      "Git Baseline Gate",
      "Cross-Repo Incoming and Outgoing Gates",
      "Future ai-workspace-kit Gate Review Hook",
      "ai-workspace-kit Tandem Boundary",
      "Tool output is evidence only",
      "Do not auto-run tools",
      "Do not auto-create phases"
    ],
    "workflow gate docs"
  );
});

test("upstream freshness gate has update-impact self-check fields", () => {
  const registry = JSON.parse(read(".planning/gates/registry.json"));
  const upstreamGates = registry.gates.filter((gate) => gate.id === "upstream-freshness");

  assert.equal(upstreamGates.length, 1, "must keep a single upstream-freshness gate id");
  const gate = upstreamGates[0];

  assertIncludesAll(
    gate.required_fields,
    [
      "old_commit",
      "new_commit",
      "update_action",
      "changelog_reviewed",
      "changed_source_layers",
      "usable_ideas",
      "boundary_classification",
      "current_repo_impact",
      "current_phase_impact",
      "consumer_practice_impact",
      "self_use_check_output",
      "cross_repo_request_needed",
      "decision",
      "evidence",
      "no_install_run_dependency"
    ],
    "upstream freshness required fields"
  );

  assert.ok(
    gate.observable_outputs.some((output) => output.includes("upstream update review")),
    "upstream-freshness should mention phase-local upstream update review output"
  );
});

test("root AGENTS is a concise entrypoint with critical gate links", () => {
  const agents = read("AGENTS.md");
  const lineCount = agents.split(/\r?\n/).length;

  assert.ok(lineCount < 180, `AGENTS.md should stay concise, got ${lineCount} lines`);
  assertIncludesAll(
    agents,
    [
      ".planning/gates/registry.json",
      ".planning/gates/WORKFLOW-GATES.md",
      ".planning/cross-repo/CROSS-REPO-CAPABILITY-REQUESTS.md",
      "tools/registry.json",
      "Before any `$gsd-discuss-phase` gray-area analysis",
      "`workflow.discuss_mode` is routing only",
      "Tool output is evidence only",
      "Do not copy `.planning` state"
    ],
    "root AGENTS"
  );
});
