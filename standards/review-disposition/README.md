# Review Disposition Standard

`REVIEW-DISPOSITIONS.json` records human review context for existing review
packet findings. It is a sidecar artifact: consumers may join it to findings,
but it never rewrites source findings, deletes findings, changes severity,
changes `status_contribution`, changes packet counts, or grants gate, merge, or
roadmap authority.

## Artifact

The first schema version is `review-disposition/v1`.

Disposition files are top-level objects:

- `schema_version` identifies the artifact contract.
- `dispositions` contains human-authored review records.
- Optional source packet provenance can describe the packet that was reviewed.

Disposition files may live beside a rollup output or in another explicit review
directory. Source packet directories remain read-only inputs.

## Record Fields

Each disposition record requires:

- `id`: stable disposition record id.
- `finding_id`: exact finding id reviewed at the time of review.
- `finding_fingerprint`: stable `fp.<sha256>` identity derived from evidence
  fields, not prose.
- `source_tool`: source packet tool name.
- `source_check_id`: check that emitted the finding.
- `source_path`: normalized source path bucket, or `unknown`.
- `status`: one of `accepted_current_issue`,
  `accepted_historical_noise`, `not_actionable`, `false_positive`, or
  `needs_followup`.
- `reason`: human review rationale.
- `owner`: human or team responsible for re-review.
- `reviewed_at`: review timestamp.
- `expires_at`: required re-review timestamp.
- `evidence_refs`: packet or review evidence ids supporting the disposition.
- `tool_name`: tool that produced or consumed the disposition record.
- `tool_version`: version of that tool.
- `schema_version`: record schema version.

Optional packet provenance fields are `source_packet_id`,
`source_packet_path`, and `source_packet_sha256`.

## Lifecycle

`expired` is not a stored status. Expiry is computed from `expires_at` so stale
review context remains visible to consumers.

`false_positive` and `accepted_historical_noise` are review metadata only. They
do not suppress source findings or make them safe to ignore automatically.

## Fingerprints

Finding fingerprints are derived from stable evidence fields such as source
tool, source check id, normalized source path, normalized target, and optional
source packet id.

Fingerprints must not include title, summary, severity, status contribution,
occurrence suffixes, or generated rollup finding id prefixes.

## Non-Goals

The disposition standard does not:

- add fields to `FINDING.schema.json`;
- mutate source packet directories;
- generate dispositions automatically;
- implement ledger scope or diff modes;
- implement shared CLI behavior;
- run target project commands;
- decide that any finding is safe to ignore.
