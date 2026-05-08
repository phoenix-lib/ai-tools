const { canonicalJson } = require("../../shared/canonical-json");

const RECORD_ARTIFACTS = Object.freeze([
  "FACTS.json",
  "COMMANDS.json",
  "CONTRACTS.json",
  "SKILLS.json",
  "DECISIONS.json"
]);

function stableRecord(record) {
  const copy = { ...record };
  delete copy.last_checked;
  return copy;
}

function hashRecord(record) {
  const crypto = require("node:crypto");
  return crypto.createHash("sha256").update(canonicalJson(stableRecord(record))).digest("hex");
}

function snapshotRecord(artifact, record) {
  const snapshot = {
    artifact,
    confidence: record.confidence ?? "unknown",
    evidence_refs: record.evidence_refs ?? [],
    id: record.id,
    record_sha256: hashRecord(record),
    source_category: record.source_category ?? "unknown",
    source_path: record.source_path ?? record.path ?? "."
  };

  if (record.path) {
    snapshot.path = record.path;
  }

  return snapshot;
}

function createLedgerRecordSnapshots(ledgerArtifacts) {
  return RECORD_ARTIFACTS.flatMap((artifact) => {
    const records = Array.isArray(ledgerArtifacts[artifact]) ? ledgerArtifacts[artifact] : [];
    return records.map((record) => snapshotRecord(artifact, record));
  }).sort((left, right) => `${left.artifact}:${left.id}`.localeCompare(`${right.artifact}:${right.id}`));
}

function keyFor(snapshot) {
  return `${snapshot.artifact}:${snapshot.id}`;
}

function countByArtifact(groups) {
  const artifactMap = new Map();
  for (const [name, entries] of Object.entries(groups)) {
    for (const entry of entries) {
      const artifact = entry.artifact;
      if (!artifactMap.has(artifact)) {
        artifactMap.set(artifact, {
          added: 0,
          artifact,
          changed: 0,
          removed: 0,
          stale: 0,
          unchanged: 0
        });
      }
      artifactMap.get(artifact)[name] += 1;
    }
  }

  return [...artifactMap.values()].sort((left, right) => left.artifact.localeCompare(right.artifact));
}

function sourceChanged(snapshot, changedSources) {
  return changedSources.some((source) => source.path === snapshot.source_path);
}

function buildLedgerDiff(options) {
  const previousRecords = options.previousManifest?.ledger_records;
  if (!Array.isArray(previousRecords)) {
    throw new Error("--since-manifest must reference a CACHE-MANIFEST.json with ledger_records.");
  }

  const currentRecords = options.currentRecords ?? [];
  const previousByKey = new Map(previousRecords.map((record) => [keyFor(record), record]));
  const currentByKey = new Map(currentRecords.map((record) => [keyFor(record), record]));
  const added = [];
  const removed = [];
  const changed = [];
  const unchanged = [];
  const stale = [];
  const changedSources = options.changedSources ?? [];

  for (const current of currentRecords) {
    const previous = previousByKey.get(keyFor(current));
    if (!previous) {
      added.push(current);
    } else if (previous.record_sha256 !== current.record_sha256) {
      changed.push({
        artifact: current.artifact,
        current_record_sha256: current.record_sha256,
        evidence_refs: current.evidence_refs,
        id: current.id,
        previous_record_sha256: previous.record_sha256,
        source_category: current.source_category,
        source_path: current.source_path
      });
    } else {
      unchanged.push(current);
    }

    if (current.confidence === "stale" || sourceChanged(current, changedSources)) {
      stale.push({
        ...current,
        stale_reason: current.confidence === "stale"
          ? "Current record confidence is stale."
          : "Record source changed since previous manifest."
      });
    }
  }

  for (const previous of previousRecords) {
    if (!currentByKey.has(keyFor(previous))) {
      removed.push(previous);
    }
  }

  const groups = {
    added: added.sort((left, right) => keyFor(left).localeCompare(keyFor(right))),
    changed: changed.sort((left, right) => keyFor(left).localeCompare(keyFor(right))),
    removed: removed.sort((left, right) => keyFor(left).localeCompare(keyFor(right))),
    stale: stale.sort((left, right) => keyFor(left).localeCompare(keyFor(right))),
    unchanged: unchanged.sort((left, right) => keyFor(left).localeCompare(keyFor(right)))
  };

  return {
    added: groups.added,
    by_artifact: countByArtifact(groups),
    changed: groups.changed,
    counts: {
      added: groups.added.length,
      changed: groups.changed.length,
      removed: groups.removed.length,
      stale: groups.stale.length,
      total_current: currentRecords.length,
      total_previous: previousRecords.length,
      unchanged: groups.unchanged.length
    },
    previous_manifest: {
      path: options.previousManifestPath,
      schema_version: options.previousManifest.schema_version,
      sha256: options.previousManifestSha256
    },
    removed: groups.removed,
    run_timestamp: options.timestamp,
    schema_version: "project-context-ledger-diff/v1",
    stale: groups.stale,
    unchanged: groups.unchanged
  };
}

module.exports = {
  RECORD_ARTIFACTS,
  buildLedgerDiff,
  createLedgerRecordSnapshots,
  hashRecord
};
