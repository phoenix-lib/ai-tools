# Review Packet Rollup

`review-packet-rollup` is a mechanical consumer for existing AI Tools review
packet directories. It validates packet JSON, preserves source findings, groups
findings by stable evidence dimensions, and writes a new review packet plus
rollup-specific provenance artifacts.

It does not run source tools, scan target projects, mutate input packets, or
decide that any finding can be ignored.

## Usage

```bash
review-packet-rollup --packets <dir-a> <dir-b> [dir-c ...] [--dispositions <file...>] --out <dir>
```

`--packets` requires two or more existing packet directories. Each input packet
must provide:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`

`--out` must be outside every input packet directory.

## Outputs

The command writes the standard review packet artifacts:

- `REVIEW-SUMMARY.json`
- `EVIDENCE.json`
- `FINDINGS.md`
- `RECOMMENDED-ACTIONS.md`

It also writes rollup artifacts:

- `PACKET-INDEX.json`
- `ROLLUP-GROUPS.json`
- `DISPOSITION-INDEX.json`

`REVIEW-SUMMARY.json` remains schema-valid against the shared packet schema.
The rollup artifacts are listed in the tool manifest requested/generated files,
not in the summary `generated_artifacts` enum.

## Packet Index

`PACKET-INDEX.json` records one entry per input packet:

- deterministic packet id;
- input packet path;
- input artifact hashes;
- validation status and validation errors;
- source tool name and version;
- source status, schema version, counts, and generated artifacts.

Invalid source packets are not hidden. They produce index entries and blocked
rollup findings, while valid packets are still included in the aggregate.
Duplicate source finding ids inside a packet are occurrence-normalized so group
counts still represent every source finding.

## Groups

`ROLLUP-GROUPS.json` groups findings mechanically by:

- source tool;
- source packet status;
- severity;
- `source_check_id`;
- `status_contribution`;
- source path derived from validated evidence refs.

Group records contain counts, packet ids, finding refs, and evidence refs. They
do not contain priority, disposition, suppression, or safe-to-ignore labels.

## Dispositions

`--dispositions <file...>` accepts explicit `REVIEW-DISPOSITIONS.json` files
validated against the review disposition standard. Dispositions are human review
metadata. They do not change source finding severity, status contribution,
evidence refs, blockers, required decisions, packet counts, or rollup status
derivation.

`DISPOSITION-INDEX.json` records:

- matched active dispositions;
- unmatched dispositions;
- expired dispositions;
- stale schema or tool-version context;
- invalid disposition files;
- findings without an active disposition.

The index also includes a small mechanical dashboard of counts and top source
checks/paths without active dispositions. It is a review surface only, not a
priority ranking, safe-to-ignore decision, merge gate, roadmap decision, or
suppression policy. The full index remains the source of truth.

Future portfolio-wide scans can use rollup output as a review surface after
source tools have produced packets elsewhere. Portfolio manifests, tool
execution, and source-project scanning are outside this command's scope.

## Status

Rollup status is derived from normalized findings and copied decision arrays:

- `blocked` if any blocker exists or any finding contributes `blocked`;
- `human_review_required` if any finding contributes `human_review_required`;
- `info` if only informational findings exist;
- `pass` when no findings require attention.

## Safety

- Reads packet output directories only.
- Does not read target files referenced by packet evidence.
- Does not execute source tools.
- Does not install, fetch, pull, or run project commands.
- Rejects output inside any input packet directory.
- Reads disposition files only when explicitly provided and never writes to
  those input files.
- Treats findings as evidence for human or assistant review, not as automatic
  gate, merge, roadmap, or disposition decisions.
