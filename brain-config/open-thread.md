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
- **(b) brain-config/index.html** -- NOTE (2026-07-04): the old hard-coded `NICKNAMES` map + stale `repo-renata.md` pointer now live in `source/data.js` + `source/app.js` (viewer was split; the shell is ~2KB, no longer 37KB and no longer over-cap). Ideal fix unchanged: drop the hard-coded map and read `slug`/`display_name`/`nicknames` from each profile's front-matter (or the metadata sidecar) at load time.
- **(c) Report manifests** -- reports live at `brain-config/agents/<slug>/reports/index.json`, keyed by the FOLDER slug (there is no top-level `agent-reports/manifest.json`). The report folder names are themselves hard-coded identity and have already drifted: folders `red-team-reviewer/` and `research-runner/` no longer match their current profile slugs (`workshop-wes`, `scout-sage`). Reconcile folder slugs to profile slugs, or add a slug alias map read from the header.

Goal: profile header = the one source of truth for an agent's name; every surface reads from it, nothing copies it.

---

## Thin Agent Profiles Need a Tightening Pass
**Added:** 2026-07-04

**What:** All 22 agents now carry a lightweight shorthand `launchPrompt` in their metadata sidecar (e.g. "Rhys, what breaks?", "Renata, audit the repo."). The design intent is that the SHORT prompt is only the invocation, and the agent's `.md` profile carries the actual operating instructions the shorthand resolves against. Renata's profile does this well (full audit checklist + output format). Several profiles are too thin for their shorthand to resolve against anything substantial.

**Why it matters:** when you launch "Rhys, what breaks?", Rhys needs a profile that defines his lens, the questions he asks, and his output shape, otherwise the shorthand is a name with no body behind it. Thin profile = weak/inconsistent agent behavior on invocation.

**How to do it:** bring each thin profile up to the Renata/Cass depth. Required sections: Purpose, The lens / the question(s), When seated, Output shape, Composes with / suppressed by, Personality, Changelog. Keep the sidecar as the structured control surface; the `.md` is the human narrative. Do NOT touch the sidecar's `launchPrompt` (already set).

**Which profiles (flagged thin, workshop lenses especially):**
- `risk-rhys.md` (role one-liner only)
- `clever-cleo.md`
- `polish-polly.md`
- `feasible-finn.md`
- `scope-skye.md`
- `eco-enzo.md`
- Re-check the core lenses (`counter-cole`, `literal-lena`, `mimic-mika`, `pivot-piper`, `domain-dara`, `novice-nia`, `future-faye`) for output-shape sections; Cass is the reference standard.

**Affects:** agent invocation quality, and the future detail-page "Reports" tab (a thin profile with no output-shape section has nothing to describe what its report should contain). Also feeds the `makesReports` decision (parked): report-makers = seats audit/close/research; core/workshop lenses = no reports.

**Effort:** one profile at a time, ~10-15 min each. Not blocking; agents function today, this raises the floor.
