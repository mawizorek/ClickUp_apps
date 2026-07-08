# Open Thread

Scratch pad for pending work items. Brain checks this at session opens via the Session Open trigger. Remove items once resolved. If it's empty, that's fine.

---

## Prism v1 — beta test + hardening (NEVER shakedown-tested in the repo)
**Added:** 2026-07-07

Prism shipped v1 this session (`prism/`, live at https://mawizorek.github.io/ClickUp_apps/prism/, build PR #54) but we went straight from build to ship without a real beta test against actual files. It's the unified Data App Viewer: one shell, two lenses (JSON + Markdown), split-by-table default, single-record auto-pivot, flag panel, CSV/Excel export. NEXT SESSION: put it through real use before calling it done.

**Beta-test pass (do with real files, not just the built-in samples):**
- Drop actual ClickUp JSON backup exports (task lists, docs). Confirm flatten + split-by-table reads sanely on real nesting depth, and the flag panel catches the real irregularities (irregular schema, numbers-as-text, mixed types).
- Drop real `.md` files (e.g. a Brain reference doc) through the Markdown lens; confirm tables/code/nested lists render.
- Exercise every export: CSV (comma AND the tab delimiter), Excel `.xls`, Markdown-to-HTML. Open the outputs in Excel/Sheets and verify columns/rows survive.
- Edge cases: giant file (perf), deeply nested JSON, arrays-of-arrays, empty file, invalid JSON (error state), a single-object file (pivot view).

**Known open items carried from build:**
- **(a) Tab CSV delimiter bug.** Passes a literal `\t` escape instead of a real tab char. Comma (default) is fine. Fix in the JSON lens export fn.
- **(b) Excel export is `.xls` HTML-table, not true `.xlsx`.** Roadmap: SheetJS for real xlsx. Decide if worth it after beta.
- **(c) og.png / icon.png binaries not dropped** via GitHub UI yet (referenced in head + manifest; unfurls/install degrade gracefully until added).
- **(d) Big-file table perf** — no virtualization yet; flagged as a v2 item. See if beta actually stresses it.
- **(e) App is gated** (`config.json`, code 2026). Flip to `open` if/when it should be shareable.

**Cold-pickup pointers:** source `prism/` (modular: `index.html` loader + `prism.css` + `prism.core.js`/`prism.json.js`/`prism.md.js`). Ledger row: `VERSIONS.md` → `prism` = v1. ClickUp APPS task repurposed from Markdown Viewer (title now "Prism — Data App Viewer").

---

## F1 Schema-Shift — pending items
**Added:** 2026-07-07 · **Updated:** 2026-07-08

The results schema-shift shipped its data foundation: `f1-racetracks/f1-results/2026/` (per-round files + `index.json`, RELOCATED 2026-07-08 from repo root to under the app so the root lists only apps), full 20-car verified order, race + sprint, provenance, computed standings. The standings lens (`f1-racetracks/standings.html` + `source/standings/`) is live with the 3-metric trajectory + teammate overlay. Spec: `f1-racetracks/next-build-spec.md`. Still open:

- **(a) Driver-anchor dedup — ✅ RESOLVED (2026-07-08, PR #61).** Colapinto/Lindblad/Bottas/Perez now carry canonical `driverId`s (86aj1ra0h / 86aj1ra31 / 86aj1ra1g / 86aj1ra1z); no UNRESOLVED-DUP remain in the round files. (Michael to delete the three December placeholder driver-task stubs in ClickUp: 86ae52rq5, 86ae52ryh, 86ae52rtd.)
- **(b) f1-refresh mirror rework — time-sensitive (Ricky runs Thu–Sun).** `routines/f1-refresh.md` still targets the retired per-year ClickUp result dropdown. Post-shift the mirror must: keep slim writes (status-flip, dates, notifications), and its one data write becomes appending the frozen year-line to the new slim "Race History" text field, resolved by `cuTaskId`. Full order never touches ClickUp. Rework before the next race weekend or Ricky writes to a dead field.
- **(c) ClickUp "Race History" field not yet created.** One slim year-labeled text field per track (frozen archive lens, fill-if-blank, prior years immutable). Retire the per-year result dropdowns once it's populated.
- **(d) Pit-wall restyle propagation (build 4) — do WITH Michael.** The standings lens is shipped in the pit-wall language; the OTHER pages (index.html circuit views, live-tracker) still carry the old OnTrack aesthetic and will mismatch until propagated. Aesthetic session, with Michael.
- **(e) OpenF1 sourcing** for the granular per-cell fields (grid, best lap, pits, tyres, story tags) to replace the illustrative `DETAIL` preview data in `source/standings/data.js`.

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
