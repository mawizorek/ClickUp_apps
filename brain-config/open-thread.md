# Open Thread

Scratch pad for pending work items. Brain checks this at session opens via the Session Open trigger. Remove items once resolved. If it's empty, that's fine.

---

## Three-Shelf Reconciliation
**Added:** 2026-07-03

AI Toolkit index (ClickUp doc) has stale two-shelf scaffolding that doesn't match the three-shelf model (Hooks / Triggers / Subagents):

- Subpages still named "Every-Run Tools" + "Triggered Tools" (rename to match)
- "Activation state" section still uses two-shelf language (rewrite)

Reconcile naming + content on the next Toolkit-doc pass.

---

## Agent-Name Single-Source-of-Truth Migration
**Added:** 2026-07-04 · **Updated:** 2026-07-04 (v3.3)

Goal: profile header + metadata sidecar = the one source of truth for an agent's name; every surface reads from it, nothing hand-copies it.

**RESOLVED in v3.3:**
- ~~Three fighting identity files (`.metadata.json` sidecar vs `<slug>/agent.json` vs `.md` front-matter).~~ Ruling: **sidecar wins.** `agent.json` folded into each sidecar (kept `initials` + `blurb` + `reportsIndex`) and deleted.
- ~~Report folders keyed by legacy slugs (`research-runner`, `red-team-reviewer`).~~ Renamed to current slugs (`scout-sage`, `workshop-wes`). Everything now keys off one slug.

**STILL OPEN:**
- **(a) ClickUp AI Toolkit doc** — Subagent roster + Quick-Scan trigger table hard-code display names + nicknames, and the roster still points at the deleted `repo-auditor.md`/old paths. Fix on the next Toolkit-doc pass.
- **(b) Viewer NICKNAMES map** — `source/data.js` still carries a hard-coded `NICKNAMES` map. Ideal fix: drop it and read `nicknames` from each sidecar at load time (the viewer already fetches them). Now easy since all 22 sidecars carry identity.

---

## Report Schema Lock + Reports Tab Build
**Added:** 2026-07-04 (v3.3)

Prior art confirmed (Workshop Wes's 2026-07-04 seven-lens review): reports are **per-agent JSON**, NOT stored HTML. Viewer renders JSON -> formatted view on the fly; HTML is an on-demand export, never a second stored copy (avoids source-of-truth drift + the 30KB write-cap clip).

**Locked design (A/A/A + fold, per Michael 2026-07-04):**
- `makesReports` flag lives in the sidecar `toggles` bag. TRUE for seat audit/close/research: Renata, Clio, Hana, Sage. Empty `reports/index.json` seeded for all four.
- Clicking an agent lands on **Reports first**, Settings second tab. Report-maker with no reports -> "No reports yet" empty state. Non-report-maker (lens) -> land straight on Settings, no Reports tab shown.
- Report folder: `brain-config/agents/<slug>/reports/` with `index.json` (list metadata) + per-report `<ts>.json`.

**TO BUILD:**
1. **Lock the report JSON schema** as a committed doc (`brain-config/report-schema.md`, sibling to `metadata-schema.md`). Shared envelope: `id, type, ts, target, verdictWord, verdictPill, pillText, delta, summary, tally[]`. Type-specific body: `findings[]` + `apps[]` + `clean[]` (audit), `lenses[]` + `call` (review), research shape TBD (question/confidence/sources[]).
2. **Build the Reports tab.** Likely a NEW `source/reports.js` module (detail.js is ~26KB, near the 30KB cap — do NOT cram the tab + per-type renderers into it; mirror the detail.js-out-of-app.js split). Per-`type` renderer, tab switcher, on-demand HTML export.
3. **detail.js:** add `initials` / `blurb` / `reportsIndex` to `KEY_ORDER` so the copy-block ordering stays clean for the reconciled sidecars (currently they append after `toggles`, cosmetic only).
