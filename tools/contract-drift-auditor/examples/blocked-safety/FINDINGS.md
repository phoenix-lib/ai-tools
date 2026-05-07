# Findings

Status: blocked
Total findings: 1
Required decisions: 0

## safety.output.target_local

Severity: high
Confidence: verified
Status contribution: blocked

Unsafe output path is blocked

Example packet shape for an unsafe target-local output request. Real runs reject this path before writing packet files.

Evidence refs: ev.path-guard
Recommended action refs: act.use-external-out
