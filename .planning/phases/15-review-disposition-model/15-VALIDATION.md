---
phase: 15
name: Review Disposition Model
status: validation-plan
created: "2026-05-08"
requirements:
  - DISP-01
  - DISP-02
  - DISP-03
  - DISP-04
  - DISP-05
---

# Phase 15: Validation Plan

## Coverage Matrix

| Requirement | Covered By | Evidence Expected |
|-------------|------------|-------------------|
| DISP-01 | 15-01, 15-02 | Sidecar schema, docs, tests proving source findings are not rewritten |
| DISP-02 | 15-01 | `REVIEW-DISPOSITIONS.schema.json` required fields and invalid cases |
| DISP-03 | 15-02 | Expired/stale disposition tests and visible `DISPOSITION-INDEX.json` buckets |
| DISP-04 | 15-02 | Rollup join tests preserving severity, status contribution, evidence refs, and counts |
| DISP-05 | 15-01, 15-02 | Fingerprint helper tests and join tests surviving occurrence-normalized finding IDs |

## Required Commands

- `npm.cmd test -- test/review-disposition/schema-contract.test.js test/review-disposition/finding-fingerprint.test.js`
- `npm.cmd test -- test/review-packet-rollup/dispositions.test.js test/review-packet-rollup/integration.test.js test/review-packet-rollup/schema-output.test.js test/review-packet-rollup/normalize.test.js`
- `npm.cmd test -- test/planning/tool-registry.test.js`
- `npm.cmd test`

## Self-Use Evidence

After 15-02 is implemented, run `review-packet-rollup` over two or more real
AI Tools packet outputs with a small explicit disposition file and external
`--out`, for example under
`C:\Users\suppo\.codex\memories\ai-tools-review-dispositions-phase15`.

Record:

- command used;
- output directory;
- status and counts;
- number of matched dispositions;
- number of expired dispositions;
- number of unmatched dispositions;
- proof that source packet directories were not mutated.

Self-use output is verification evidence only. Synthetic fixtures remain the
oracle for exact behavior.

## Plan Checker Notes

The plans must preserve these constraints:

- no changes to `FINDING.schema.json` fields;
- no disposition fields embedded in source findings;
- no change to packet status derivation from active dispositions;
- no target-project mutation;
- no automatic disposition generation;
- no Phase 16 scope/diff behavior;
- no Phase 17 shared CLI migration beyond the narrow `--dispositions` input;
- no portfolio scanning.

## Validation Result

Pending execution.
