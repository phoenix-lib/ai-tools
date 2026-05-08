const fs = require("node:fs");
const path = require("node:path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const { createFindingFingerprint } = require("../../shared/finding-fingerprint");
const { loadPackageVersion } = require("../../shared/tool-metadata");

const REVIEW_DISPOSITION_SCHEMA_VERSION = "review-disposition/v1";
const DISPOSITION_INDEX_SCHEMA_VERSION = "review-disposition-index/v1";

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function createDispositionAjv(rootDir = path.join(__dirname, "../..")) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addSchema(readJsonFile(path.join(rootDir, "standards/review-disposition/schemas/REVIEW-DISPOSITIONS.schema.json")));
  return ajv;
}

function normalizeErrors(validate, fallbackMessage) {
  if (!validate.errors || validate.errors.length === 0) return [fallbackMessage];
  return validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`.trim());
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null))].sort();
}

function sourceByFinding(normalized) {
  return new Map((normalized.finding_sources ?? []).map((source) => [source.finding_ref, source]));
}

function evidenceById(normalized) {
  return new Map((normalized.evidence ?? []).map((ref) => [ref.id, ref]));
}

function primarySourcePath(finding, evidenceMap) {
  const paths = uniqueSorted(
    (finding.evidence_refs ?? [])
      .filter((ref) => typeof ref === "string")
      .map((ref) => evidenceMap.get(ref)?.path ?? "unknown")
  );

  return {
    primary: paths[0] ?? "unknown",
    source_paths: paths.length > 0 ? paths : ["unknown"]
  };
}

function findingRecord(finding, source, evidenceMap) {
  const paths = primarySourcePath(finding, evidenceMap);
  const sourceTool = source?.source_tool ?? "unknown";
  const sourcePacketId = source?.packet_id;
  const fingerprint = createFindingFingerprint({
    source_check_id: finding.source_check_id,
    source_packet_id: sourcePacketId,
    source_path: paths.primary,
    source_tool: sourceTool,
    target: paths.primary
  });

  return {
    evidence_refs: (finding.evidence_refs ?? []).filter((ref) => typeof ref === "string").sort(),
    finding_ref: finding.id,
    finding_fingerprint: fingerprint,
    severity: finding.severity,
    source_check_id: finding.source_check_id,
    source_finding_id: source?.source_finding_id ?? null,
    source_packet_id: sourcePacketId ?? null,
    source_path: paths.primary,
    source_paths: paths.source_paths,
    source_tool: sourceTool,
    status_contribution: finding.status_contribution
  };
}

function loadDispositionFiles(dispositionFiles, options = {}) {
  const ajv = options.ajv ?? createDispositionAjv(options.rootDir);
  const validate = ajv.getSchema("https://ai-tools.local/schemas/review-disposition/REVIEW-DISPOSITIONS.schema.json");
  const dispositionRecords = [];
  const invalid_files = [];

  for (const dispositionFile of dispositionFiles ?? []) {
    const absolutePath = path.resolve(dispositionFile);
    let artifact;

    try {
      artifact = readJsonFile(absolutePath);
    } catch (error) {
      invalid_files.push({
        errors: [`REVIEW-DISPOSITIONS.json is not valid JSON: ${error.message}`],
        path: absolutePath
      });
      continue;
    }

    if (validate(artifact) !== true) {
      invalid_files.push({
        errors: normalizeErrors(validate, "REVIEW-DISPOSITIONS.json is schema-invalid."),
        path: absolutePath
      });
      continue;
    }

    for (const disposition of artifact.dispositions ?? []) {
      dispositionRecords.push({
        ...disposition,
        disposition_file: absolutePath,
        source_packet_id: disposition.source_packet_id ?? artifact.source_packet_id ?? null,
        source_packet_path: disposition.source_packet_path ?? artifact.source_packet_path ?? null,
        source_packet_sha256: disposition.source_packet_sha256 ?? artifact.source_packet_sha256 ?? null
      });
    }
  }

  return {
    disposition_records: dispositionRecords.sort((left, right) => left.id.localeCompare(right.id)),
    invalid_files: invalid_files.sort((left, right) => left.path.localeCompare(right.path))
  };
}

function groupFindingsByFingerprint(normalized) {
  const sourceMap = sourceByFinding(normalized);
  const evidenceMap = evidenceById(normalized);
  const findings = (normalized.findings ?? []).map((finding) => findingRecord(finding, sourceMap.get(finding.id), evidenceMap));
  const byFingerprint = new Map();

  for (const finding of findings) {
    const group = byFingerprint.get(finding.finding_fingerprint) ?? [];
    group.push(finding);
    byFingerprint.set(finding.finding_fingerprint, group);
  }

  return {
    byFingerprint,
    findings: findings.sort((left, right) => left.finding_ref.localeCompare(right.finding_ref))
  };
}

function dispositionEntry(disposition, findings) {
  return {
    disposition_id: disposition.id,
    evidence_refs: [...disposition.evidence_refs].sort(),
    expires_at: disposition.expires_at,
    finding_fingerprint: disposition.finding_fingerprint,
    finding_id: disposition.finding_id,
    finding_refs: findings.map((finding) => finding.finding_ref).sort(),
    owner: disposition.owner,
    reason: disposition.reason,
    reviewed_at: disposition.reviewed_at,
    source_check_id: disposition.source_check_id,
    source_packet_id: disposition.source_packet_id,
    source_path: disposition.source_path,
    source_tool: disposition.source_tool,
    status: disposition.status,
    tool_name: disposition.tool_name,
    tool_version: disposition.tool_version
  };
}

function groupCounts(records, keyName) {
  const counts = new Map();
  for (const record of records) {
    const key = record[keyName] ?? "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([key, count]) => ({ count, key }))
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count;
      return left.key.localeCompare(right.key);
    });
}

function buildDispositionIndex(normalized, options = {}) {
  const dispositionFiles = options.dispositionFiles ?? [];
  const now = options.now ?? new Date();
  const currentToolVersion = options.currentToolVersion ?? loadPackageVersion(options.rootDir);
  const loaded = loadDispositionFiles(dispositionFiles, options);
  const groupedFindings = groupFindingsByFingerprint(normalized);
  const activeMatchedFingerprints = new Set();
  const matched = [];
  const expired = [];
  const stale = [];
  const unmatched = [];

  for (const disposition of loaded.disposition_records) {
    const findings = groupedFindings.byFingerprint.get(disposition.finding_fingerprint) ?? [];
    const entry = dispositionEntry(disposition, findings);
    const isExpired = Date.parse(disposition.expires_at) <= now.getTime();
    const isStale = disposition.schema_version !== REVIEW_DISPOSITION_SCHEMA_VERSION || disposition.tool_version !== currentToolVersion;

    if (isStale) {
      stale.push({
        ...entry,
        expected_schema_version: REVIEW_DISPOSITION_SCHEMA_VERSION,
        expected_tool_version: currentToolVersion,
        schema_version: disposition.schema_version
      });
    }

    if (findings.length === 0) {
      unmatched.push(entry);
      continue;
    }

    if (isExpired) {
      expired.push(entry);
      continue;
    }

    matched.push(entry);
    activeMatchedFingerprints.add(disposition.finding_fingerprint);
  }

  const findingsWithoutDisposition = groupedFindings.findings
    .filter((finding) => !activeMatchedFingerprints.has(finding.finding_fingerprint))
    .map((finding) => ({
      evidence_refs: finding.evidence_refs,
      finding_fingerprint: finding.finding_fingerprint,
      finding_ref: finding.finding_ref,
      severity: finding.severity,
      source_check_id: finding.source_check_id,
      source_finding_id: finding.source_finding_id,
      source_packet_id: finding.source_packet_id,
      source_path: finding.source_path,
      source_tool: finding.source_tool,
      status_contribution: finding.status_contribution
    }));

  const sortByDisposition = (left, right) => left.disposition_id.localeCompare(right.disposition_id);

  matched.sort(sortByDisposition);
  expired.sort(sortByDisposition);
  stale.sort(sortByDisposition);
  unmatched.sort(sortByDisposition);

  const counts = {
    disposition_files: dispositionFiles.length,
    expired: expired.length,
    findings_total: groupedFindings.findings.length,
    findings_without_active_disposition: findingsWithoutDisposition.length,
    invalid_files: loaded.invalid_files.length,
    matched: matched.length,
    stale: stale.length,
    unmatched: unmatched.length
  };

  return {
    counts,
    dashboard: {
      expired_dispositions: counts.expired,
      findings_without_active_disposition: counts.findings_without_active_disposition,
      top_source_checks_without_active_disposition: groupCounts(findingsWithoutDisposition, "source_check_id").slice(0, 10),
      top_source_paths_without_active_disposition: groupCounts(findingsWithoutDisposition, "source_path").slice(0, 10),
      unmatched_dispositions: counts.unmatched
    },
    expired,
    findings_without_active_disposition: findingsWithoutDisposition,
    invalid_files: loaded.invalid_files,
    matched,
    review_required_context: {
      expired_dispositions: expired.length,
      invalid_disposition_files: loaded.invalid_files.length,
      stale_dispositions: stale.length,
      unmatched_dispositions: unmatched.length
    },
    schema_version: DISPOSITION_INDEX_SCHEMA_VERSION,
    stale,
    unmatched
  };
}

module.exports = {
  DISPOSITION_INDEX_SCHEMA_VERSION,
  REVIEW_DISPOSITION_SCHEMA_VERSION,
  buildDispositionIndex,
  createDispositionAjv,
  groupFindingsByFingerprint,
  loadDispositionFiles
};
