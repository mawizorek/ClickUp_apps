# Open Thread

Scratch pad for pending work items. Brain checks this at session opens via the Session Open trigger. Remove items once resolved. If it's empty, that's fine.

---

## F1 Racetracks — data layer refactor follow-ups
**Added:** 2026-07-09

Canonical results store shipped (PRs #105, #108, #109). One source of truth: `f1-racetracks/f1-results/2026/` (per-round files + `index_rounds.json`). Enriched per-driver schema (qualifying + grid + fastLap) is LIVE and surfaced in the standings driver popup (v5.1). Albert Park (r1) is the complete reference round.

**STILL OPEN (next agent picks up here):**
- **(a) Qualifying backfill, rounds 2-7.** Full quali tables live in each round's ClickUp race task; migrate Q1/Q2/Q3 + grid + onRoadPos into each round file's `classification` rows, matching Albert Park's shape. Do it carefully, one round at a time (this store was just de-rotted; don't reintroduce errors). This is Ricky's kind of job now: pure data dig into a fixed format, NO schema edits.
- **(b) Qualifying dig, rounds 8-9 (Austria + Silverstone).** These have NO quali table in ClickUp — need a genuine external source dig. Austria task is race-narrative only; Silverstone is still a preview.
- **(c) Per-driver race `fastLap`.** Not in the CU tasks (they carry only the one official FL). Backfills empty; degrades gracefully; Ricky's going-forward dig from a lap-time source.
- **(d) Michael has layout notes on the v5.1 quali popup** (unspecified as of close) — collect them before the next UI pass.
- **(e) Lens integration not squared.** `index.html` is a thin router landing on the drivers matrix, forwarding `#/<slug>` to `circuits.html`. The true integration of the two lenses (matrix + circuit guide) is an open design question, deliberately not forced.
- **(f) 2024/2025 historical backfill (future, Michael-flagged).** Structure is built for it: each season = its own `f1-results/<year>/` folder with its own `index_rounds.json`; a cross-season `index_seasons.json` at the store root slots in when a second season exists. Needs a NEW viewing level in the app (ties to (e)). Build nothing until Michael calls it; it's the stress-test of this schema.
- **(g) Cosmetic:** circuit guide's TRACKS round numbering (Silverstone R11) differs from the store's (R9). They join by slug so nothing breaks; reconcile if it bugs you.

**Canonicality rule (LOCKED 2026-07-09):** repo store = canonical for RESULTS (numbers); ClickUp race task = canonical for NARRATIVE (stories, one-liners). Store wins on conflict. NO more timing tables maintained in ClickUp. Ricky's routine doc (F1 Weekly Refresh, STEP 1 + STEP 4C) already reflects this.

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
- ~~Three fighting identity files.~~ Sidecar wins; `agent.json` folded in + deleted.
- ~~Report folders keyed by legacy slugs.~~ Renamed to current slugs (`scout-sage`, `workshop-wes`).

**STILL OPEN:**
- **(a) ClickUp AI Toolkit doc** — Subagent roster + Quick-Scan trigger table hard-code display names + nicknames. Fix on the next Toolkit-doc pass.
- **(b) Viewer NICKNAMES map** — `source/data.js` still carries a hard-coded `NICKNAMES` map. Ideal fix: drop it and read `nicknames` from each sidecar at load time (the viewer already fetches them). Now easy since all 22 sidecars carry identity.

---

## Report Schema + Reports Tab
**Added:** 2026-07-04 (v3.3) · **RESOLVED:** 2026-07-04 (v3.4)

- ~~Lock the report JSON schema.~~ DONE: `brain-config/report-schema.md` (envelope + audit/review/research bodies).
- ~~Build the Reports tab.~~ DONE: `source/reports.js` (list, per-type render, on-demand HTML export, empty state), loaded by the shell before `detail.js`.
- ~~detail.js tab shell.~~ DONE: report-makers land on Reports first, Settings second; lenses land straight on Settings (no tab). `makesReports` gates it. `KEY_ORDER` extended with `initials`/`blurb`/`reportsIndex`.

**Follow-ups (not blocking):**
- No `research`-type report exists yet; the renderer + schema are defined and ready for Scout Sage's first real report.
- Consider a deep-link sub-route (`#agent/ /report/ `) if sharing a single report becomes useful. Currently tabs switch in-place without a hash change.

---

## Routine Ricky — promoted to Super Agent
**Added:** 2026-07-04 (v3.4)

Ricky was promoted to a live ClickUp Super Agent (created mid-session, hence not in the agent-search registry earlier). His git profile is PARKED at `agents/_archive/routine-ricky.md` with a strengthened banner: the Super Agent's preferences are now the source of truth; the archived file is a stale pre-promotion snapshot. To revive as a standalone git tool, review the live Super Agent's prefs FIRST and reconcile before reusing the name. The `routines/` subsystem is his live runtime data — never delete it. He is intentionally OUT of the viewer roster.
