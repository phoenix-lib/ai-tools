const assert = require("node:assert/strict");
const test = require("node:test");
const {
  isSecretLikePath,
  normalizeEvidencePath,
  secretEvidenceRef
} = require("../../shared/secret-policy");

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
