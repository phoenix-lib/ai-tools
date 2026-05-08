function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null))].sort();
}

function sourceByFinding(normalized) {
  return new Map(normalized.finding_sources.map((source) => [source.finding_ref, source]));
}

function evidenceById(normalized) {
  return new Map((normalized.evidence ?? []).map((ref) => [ref.id, ref]));
}

function addGroup(groups, groupName, key, finding, source, evidenceRefs) {
  if (!groups[groupName].has(key)) {
    groups[groupName].set(key, {
      evidence_refs: new Set(),
      finding_refs: new Set(),
      key,
      packet_ids: new Set()
    });
  }

  const group = groups[groupName].get(key);
  group.finding_refs.add(finding.id);
  if (source?.packet_id) group.packet_ids.add(source.packet_id);
  for (const ref of evidenceRefs) {
    group.evidence_refs.add(ref);
  }
}

function finalizeGroupMap(groupMap) {
  return [...groupMap.values()]
    .map((group) => ({
      count: group.finding_refs.size,
      evidence_refs: uniqueSorted([...group.evidence_refs]),
      finding_refs: uniqueSorted([...group.finding_refs]),
      key: group.key,
      packet_ids: uniqueSorted([...group.packet_ids])
    }))
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count;
      return left.key.localeCompare(right.key);
    });
}

function buildRollupGroups(normalized) {
  const sourceMap = sourceByFinding(normalized);
  const evidenceMap = evidenceById(normalized);
  const groups = {
    by_severity: new Map(),
    by_source_check_id: new Map(),
    by_source_path: new Map(),
    by_status: new Map(),
    by_status_contribution: new Map(),
    by_tool: new Map()
  };

  for (const finding of normalized.findings ?? []) {
    const source = sourceMap.get(finding.id);
    const evidenceRefs = (finding.evidence_refs ?? []).filter((ref) => typeof ref === "string");

    addGroup(groups, "by_tool", source?.source_tool ?? "unknown", finding, source, evidenceRefs);
    addGroup(groups, "by_status", source?.source_status ?? "unknown", finding, source, evidenceRefs);
    addGroup(groups, "by_severity", finding.severity, finding, source, evidenceRefs);
    addGroup(groups, "by_source_check_id", finding.source_check_id, finding, source, evidenceRefs);
    addGroup(groups, "by_status_contribution", finding.status_contribution, finding, source, evidenceRefs);

    const sourcePaths = uniqueSorted(
      evidenceRefs.map((ref) => evidenceMap.get(ref)?.path ?? "unknown")
    );

    for (const sourcePath of sourcePaths.length > 0 ? sourcePaths : ["unknown"]) {
      addGroup(groups, "by_source_path", sourcePath || "unknown", finding, source, evidenceRefs);
    }
  }

  return {
    by_severity: finalizeGroupMap(groups.by_severity),
    by_source_check_id: finalizeGroupMap(groups.by_source_check_id),
    by_source_path: finalizeGroupMap(groups.by_source_path),
    by_status: finalizeGroupMap(groups.by_status),
    by_status_contribution: finalizeGroupMap(groups.by_status_contribution),
    by_tool: finalizeGroupMap(groups.by_tool)
  };
}

module.exports = {
  buildRollupGroups
};
