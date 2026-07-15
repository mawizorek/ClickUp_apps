# ClickUp Coach Corey — Working Notes / Revision Log

Per-agent scratch: next spec, in-flight decisions, and a running revision log. Global metadata
lives in `../superagents.json`; the near-1:1 config mirror lives in `preferences.md` (header +
config only, no changelog); formal audit records live in `audits/`. This file is the informal
thread between those, and the home for changelog-style history.

## Revision log

- **2026-07-15** — Folder created (PR #217). First self-audit (PR #218, Up to date on v1.0). Fleet
  index split to JSON+HTML (PR #219). Global metadata consolidated into `superagents.json`; README
  reduced to a pointer (PR #220). `preferences.md` rewritten as a near-1:1 verbatim mirror of the
  live config (header + config only); changelog/notes moved here per Michael.

## Next spec / open threads

- Fleet queue (one agent at a time): Mainstage Milo → FMP Frank → Update URITP. Confirm each
  full-standard track with Michael before building its folder.
- Keep `preferences.md` re-synced to a verbatim config mirror whenever the live config changes
  (its whole value is being an exact diffable copy). Timestamp the header on each resync.
- Optional future: generate `superagents.json` from per-agent metadata sidecars if the fleet grows
  large enough that the single file gets unwieldy (matches repo `registry.json` pattern).
