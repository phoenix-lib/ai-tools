const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const {
  isSecretLikePath,
  normalizeEvidencePath,
  secretEvidenceRef
} = require("../../shared/secret-policy");
const { fixtureInputDir } = require("./fixture-helpers");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), "utf8"));
}

test("normalizeEvidencePath returns relative slash paths and rejects unsafe paths", () => {
  assert.equal(normalizeEvidencePath("config\\tokens\\service.key"), "config/tokens/service.key");
  assert.throws(() => normalizeEvidencePath("/etc/passwd"), /relative/);
  assert.throws(() => normalizeEvidencePath("C:\\secret.env"), /relative/);
  assert.throws(() => normalizeEvidencePath("../outside.env"), /inside/);
});

test("isSecretLikePath classifies conservative default secret-like names", () => {
  for (const relPath of [
    ".env",
    ".env.local",
    "config/app-secret.json",
    "config/api.token",
    "credentials/service.json",
    "keys/deploy.key",
    "certs/private.pem",
    "certs/bundle.p12",
    "certs/bundle.pfx",
    ".ssh/id_rsa",
    ".ssh/id_dsa",
    ".ssh/id_ed25519"
  ]) {
    assert.equal(isSecretLikePath(relPath), true, `${relPath} should be secret-like`);
  }

  assert.equal(isSecretLikePath("README.md"), false);
  assert.equal(isSecretLikePath("package.json"), false);
});

test("secretEvidenceRef creates path-only evidence without hashes or content", () => {
  const evidence = secretEvidenceRef({
    id: "secret.env.local",
    path: ".env.local",
    reason: "Secret-like path is path-only evidence by default."
  });

  assert.deepEqual(evidence, {
    confidence: "verified",
    evidence_type: "secret_path",
    id: "secret.env.local",
    path: ".env.local",
    path_only: true,
    reason: "Secret-like path is path-only evidence by default."
  });

  assert.equal(Object.hasOwn(evidence, "sha256"), false);
  assert.equal(Object.hasOwn(evidence, "snippet"), false);
  assert.equal(Object.hasOwn(evidence, "content"), false);
});

test("secretEvidenceRef validates against the evidence schema", () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const schema = readJson("standards/review-packet/schemas/EVIDENCE-REF.schema.json");
  const validate = ajv.compile(schema);
  const evidence = secretEvidenceRef({
    id: "secret.credentials.service",
    path: "credentials/service.json",
    reason: "Secret-like path is path-only evidence by default."
  });

  assert.equal(validate(evidence), true, ajv.errorsText(validate.errors));
});

test("secret-like fixture files are path-only without reading sentinel values into evidence", () => {
  const input = fixtureInputDir("secret-like-files");
  const secretPaths = [
    ".env.local",
    "config/api.token",
    "credentials/service.json",
    "keys/deploy.key"
  ];

  for (const relativePath of secretPaths) {
    const text = fs.readFileSync(path.join(input, relativePath), "utf8");
    assert.match(text, /SECRET_SENTINEL_DO_NOT_LEAK/);
    assert.equal(isSecretLikePath(relativePath), true);

    const evidence = secretEvidenceRef({
      id: `secret.${relativePath.replace(/[^a-z0-9]+/gi, ".").toLowerCase()}`,
      path: relativePath,
      reason: "Secret-like fixture path is path-only evidence."
    });

    assert.doesNotMatch(JSON.stringify(evidence), /SECRET_SENTINEL_DO_NOT_LEAK/);
    assert.equal(evidence.path_only, true);
    assert.equal(evidence.sha256, undefined);
  }
});
