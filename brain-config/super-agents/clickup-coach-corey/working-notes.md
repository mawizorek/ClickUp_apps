# ClickUp Coach Corey — Working Notes / Revision Log

Per-agent scratch: next spec, in-flight decisions, and a running revision log. Global metadata
lives in `../superagents.json`; durable config mirror lives in `preferences.md`; formal audit
records live in `audits/`. This file is the informal thread between those.

## Revision log

- **2026-07-15** — Folder created (PR #217). First self-audit run (PR #218, Up to date on v1.0).
  Fleet index split to JSON+HTML (PR #219). Global metadata consolidated into `superagents.json`;
  README de-duplicated to a pointer so no field is hand-mirrored (this PR).

## Next spec / open threads

- Fleet queue (one agent at a time): Mainstage Milo → FMP Frank → Update URITP. Confirm each
  full-standard track with Michael before building its folder.
- Optional future: consider generating `superagents.json` from per-agent metadata sidecars if the
  fleet grows large enough that the single file gets unwieldy (matches repo `registry.json`
  pattern). Not needed at current fleet size.
