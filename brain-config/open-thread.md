# Open Thread

Scratch pad for pending work items. Brain checks this at session opens via the Session Open trigger. Remove items once resolved. If it's empty, that's fine.

---

## Three-Shelf Reconciliation
**Added:** 2026-07-03

AI Toolkit index has stale two-shelf scaffolding that doesn't match the three-shelf model (🔄 Hooks / 🎯 Triggers / 🧠 Subagents):

- Subpages still named "🔄 Every-Run Tools" + "🎯 Triggered Tools" (rename to match)
- "Activation state" section still uses two-shelf language (rewrite)

Reconcile naming + content next session.

---

## Agent-Name Single-Source-of-Truth Migration
**Added:** 2026-07-04

Agent name is now defined ONCE, in each profile's front-matter identity block (`slug` / `display_name` / `nicknames`), starting with `workshop-wes.md`. The `slug` is immutable = filename; renames change `display_name` only. See the Tool Authoring Guidebook for the rule.

Every surface below still HAND-COPIES agent names and should be re-pointed to read from the profile header. Until then they drift on rename (this is what left the red-rhett / repo-renata orphans):

- **(a) ClickUp AI Toolkit doc** -- Subagent roster + Quick-Scan trigger table hard-code display names + nicknames, and the roster still points at the now-deleted `brain-config/agents/repo-renata.md` (should be `recon-renata.md` / "Recon Renata"). STALE POINTER -- fix on next Toolkit-doc pass.
- **(b) brain-config/index.html** -- hard-coded `NICKNAMES` map + a stale `repo-renata.md` pointer. NOTE: this file is 37KB (over the ~30KB read/write cap), so it must NOT be edited via create_or_update_file -- upload via GitHub UI or a blob-SHA path. Ideal fix: drop the hard-coded map and read `slug`/`display_name`/`nicknames` from each profile's front-matter at load time (it already fetches the .md files).
- **(c) Report manifests** -- reports live at `brain-config/agents/<slug>/reports/index.json`, keyed by the FOLDER slug (there is no top-level `agent-reports/manifest.json`). The report folder names are themselves hard-coded identity and have already drifted: folders `red-team-reviewer/` and `research-runner/` no longer match their current profile slugs (`workshop-wes`, `scout-sage`). Reconcile folder slugs to profile slugs, or add a slug alias map read from the header.

Goal: profile header = the one source of truth for an agent's name; every surface reads from it, nothing copies it.
