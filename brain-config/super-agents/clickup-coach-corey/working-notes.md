# ClickUp Coach Corey — Working Notes / Revision Log

Per-agent scratch: next spec, in-flight decisions, and a running revision log. Global metadata
lives in `../superagents.json`; the canonical profile lives in `preferences.md`; formal audit
records live in `audits/`. This file is the informal thread between those, and the home for
changelog-style history. (Reasoning-level decisions now also live in `decision-log.md`.)

## Revision log

- **2026-07-19** — CONVERTED to git-only git-teammate (native CU agent -39958913 retired, pending
  manual disable by Michael). preferences.md reframed from live-config mirror → canonical profile
  (base pointer + load manifest added); scheduled AM/PM triggers retired, audit method kept as
  on-demand; continuity moved from native channels to the session model (session task +
  activity-log.md + session-board); §6.6 steward model updated to the hybrid fleet (native =
  live-vs-declared audit, git-teammate = git-canonical). Added memory.md + activity-log.md +
  decision-log.md. superagents.json row flipped track/status; git_teammate_standard note updated.
- **2026-07-15** — Folder created (PR #217). First self-audit (PR #218, Up to date on v1.0). Fleet
  index split to JSON+HTML (PR #219). Global metadata consolidated into `superagents.json`; README
  reduced to a pointer (PR #220). `preferences.md` rewritten as a near-1:1 verbatim mirror of the
  live config (superseded 2026-07-19 by the git-only conversion above).

## Next spec / open threads

- Fleet queue (one agent at a time): Mainstage Milo → FMP Frank → Update URITP. For each, confirm
  with Michael whether it stays native (mirror model) or converts to git-teammate like Corey.
- Michael to disable/delete the native ClickUp Corey (-39958913) in the ClickUp UI to complete the
  retirement; until then the native agent may still fire its old triggers.
- Optional future: generate `superagents.json` from per-agent metadata sidecars if the fleet grows large.
