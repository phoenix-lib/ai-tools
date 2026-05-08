const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const schemaDir = path.join(process.cwd(), "standards/project-context-ledger/schemas");
const commonSchemaName = "LEDGER-COMMON.schema.json";
const publicSchemaNames = [
  "FACTS.schema.json",
  "COMMANDS.schema.json",
  "CONTRACTS.schema.json",
  "SKILLS.schema.json",
  "DECISIONS.schema.json",
  "CACHE-MANIFEST.schema.json"
];

const HASH = "a".repeat(64);
const TIMESTAMP = "2026-05-08T00:00:00.000Z";

function readSchema(name) {
  return JSON.parse(fs.readFileSync(path.join(schemaDir, name), "utf8"));
}

function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addSchema(readSchema(commonSchemaName));

  for (const schemaName of publicSchemaNames) {
    ajv.addSchema(readSchema(schemaName));
  }

  return ajv;
}

function validators() {
  const ajv = createAjv();
  return Object.fromEntries(publicSchemaNames.map((schemaName) => [
    schemaName,
    ajv.getSchema(`https://ai-tools.local/schemas/project-context-ledger/${schemaName}`)
  ]));
}

function assertValid(validate, value) {
  assert.equal(validate(value), true, JSON.stringify(validate.errors, null, 2));
}

function assertInvalid(validate, value, message) {
  assert.equal(validate(value), false, message);
}

function minimalCacheManifest(overrides = {}) {
  return {
    ignored_generated_packet_dirs: ["packets/generated"],
    ledger_artifacts: [
      "FACTS.json",
      "COMMANDS.json",
      "CONTRACTS.json",
      "SKILLS.json",
      "DECISIONS.json",
      "CACHE-MANIFEST.json"
    ],
    packet_artifacts: [
      "REVIEW-SUMMARY.json",
      "EVIDENCE.json",
      "FINDINGS.md",
      "RECOMMENDED-ACTIONS.md"
    ],
    path_only_secret_paths: [".env"],
    policy_hashes: {
      ignore_policy: HASH
    },
    previous_manifest: {
      compared: false,
      reason: "No previous CACHE-MANIFEST.json found in output directory."
    },
    run_timestamp: TIMESTAMP,
    scope: "current",
    scanned_sources: [
      {
        path: "package.json",
        path_only: false,
        sha256: HASH,
        source_category: "current"
      },
      {
        path: ".env",
        path_only: true,
        source_category: "secret"
      }
    ],
    schema_version: "project-context-ledger/v1",
    tool: {
      name: "project-context-ledger",
      version: "0.1.0"
    },
    ...overrides
  };
}

test("all public ledger artifact schemas compile", () => {
  const compiled = validators();
  for (const schemaName of publicSchemaNames) {
    assert.equal(typeof compiled[schemaName], "function", `${schemaName} should compile`);
  }
});

test("record artifact schemas accept minimal valid arrays", () => {
  const compiled = validators();

  assertValid(compiled["FACTS.schema.json"], [
    {
      category: "project",
      confidence: "verified",
      evidence_refs: ["ev.package"],
      id: "fact.package-name.package-json",
      last_checked: TIMESTAMP,
      source_category: "current",
      source_path: "package.json",
      source_sha256: HASH,
      text: "Package package.json declares project name ai-tools.",
      value: "ai-tools"
    }
  ]);

  assertValid(compiled["COMMANDS.schema.json"], [
    {
      command: "node --test",
      confidence: "verified",
      evidence_refs: ["ev.package"],
      id: "cmd.script.package-json.test",
      kind: "package_script",
      name: "test",
      package_path: "package.json",
      source_category: "current",
      source_path: "package.json",
      source_sha256: HASH
    }
  ]);

  assertValid(compiled["CONTRACTS.schema.json"], [
    {
      confidence: "verified",
      evidence_refs: ["ev.doc.agents-md"],
      id: "contract.agents-md",
      path: "AGENTS.md",
      source_category: "current",
      source_path: "AGENTS.md",
      source_sha256: HASH,
      type: "assistant_contract"
    }
  ]);

  assertValid(compiled["SKILLS.schema.json"], [
    {
      confidence: "verified",
      evidence_refs: ["ev.skill.gsd"],
      id: "skill.gsd",
      name: "gsd",
      path: ".codex/skills/gsd/SKILL.md",
      source_category: "current",
      source_sha256: HASH
    }
  ]);

  assertValid(compiled["DECISIONS.schema.json"], [
    {
      confidence: "verified",
      evidence_refs: ["ev.doc.context"],
      id: "decision.context.14-context.d-01",
      source_category: "history",
      source_path: ".planning/phases/14-ledger-artifact-schemas/14-CONTEXT.md",
      text: "Store ledger artifact schemas under standards/project-context-ledger/schemas/.",
      type: "context_decision",
      value: {
        label: "D-01"
      }
    }
  ]);
});

test("record artifact schemas reject loose or incomplete records", () => {
  const compiled = validators();

  assertInvalid(compiled["FACTS.schema.json"], [
    {
      category: "project",
      confidence: "verified",
      evidence_refs: ["ev.package"],
      id: "fact.package-name.package-json",
      last_checked: TIMESTAMP,
      source_path: "package.json"
    }
  ], "fact records require text, value, or both");

  assertInvalid(compiled["COMMANDS.schema.json"], [
    {
      command: "node --test",
      confidence: "certain",
      evidence_refs: ["ev.package"],
      id: "cmd.script.package-json.test",
      kind: "package_script",
      source_path: "package.json"
    }
  ], "confidence must use the review packet vocabulary");

  assertInvalid(compiled["CONTRACTS.schema.json"], [
    {
      confidence: "verified",
      evidence_refs: ["ev.doc.agents-md"],
      id: "contract.agents-md",
      path: "AGENTS.md",
      type: "assistant_contract"
    }
  ], "contract records require source_path");

  assertInvalid(compiled["SKILLS.schema.json"], [
    {
      confidence: "verified",
      evidence_refs: ["ev.skill.gsd"],
      extra: true,
      id: "skill.gsd",
      name: "gsd",
      path: ".codex/skills/gsd/SKILL.md"
    }
  ], "unknown fields should fail strict schemas");

  assertInvalid(compiled["DECISIONS.schema.json"], [
    {
      confidence: "verified",
      evidence_refs: [{ id: "ev.doc.context" }],
      id: "decision.context.14-context.d-01",
      source_path: ".planning/phases/14-ledger-artifact-schemas/14-CONTEXT.md",
      text: "Store ledger artifact schemas under standards/project-context-ledger/schemas/.",
      type: "context_decision"
    }
  ], "ledger record evidence refs are string IDs");
});

test("cache manifest schema accepts current manifest states", () => {
  const compiled = validators();

  assertValid(compiled["CACHE-MANIFEST.schema.json"], minimalCacheManifest());
  assertValid(compiled["CACHE-MANIFEST.schema.json"], minimalCacheManifest({
    previous_manifest: {
      changed_sources: [
        {
          current_sha256: "b".repeat(64),
          path: "package.json",
          previous_sha256: HASH
        }
      ],
      compared: true
    }
  }));
});

test("cache manifest schema rejects invalid version and source hash policy", () => {
  const compiled = validators();

  assertInvalid(compiled["CACHE-MANIFEST.schema.json"], minimalCacheManifest({
    schema_version: "project-context-ledger/v2"
  }), "cache manifest schema version is fixed to project-context-ledger/v1");

  assertInvalid(compiled["CACHE-MANIFEST.schema.json"], minimalCacheManifest({
    scanned_sources: [
      {
        path: "package.json",
        path_only: false
      }
    ]
  }), "readable scanned sources require sha256");

  assertInvalid(compiled["CACHE-MANIFEST.schema.json"], minimalCacheManifest({
    scanned_sources: [
      {
        path: ".env",
        path_only: true,
        sha256: HASH
      }
    ]
  }), "path-only scanned sources must not include sha256");

  assertInvalid(compiled["CACHE-MANIFEST.schema.json"], minimalCacheManifest({
    previous_manifest: {
      changed_sources: [],
      compared: false,
      reason: "Ambiguous previous manifest state."
    }
  }), "previous_manifest allows exactly one current state");
});

test("schema contract tests leave cross-artifact invariants to generated-output tests", () => {
  const compiled = validators();

  assertValid(compiled["FACTS.schema.json"], [
    {
      category: "project",
      confidence: "verified",
      evidence_refs: ["ev.missing"],
      id: "fact.example",
      last_checked: TIMESTAMP,
      source_category: "current",
      source_path: "package.json",
      text: "Schema can validate local shape only."
    }
  ]);
});
