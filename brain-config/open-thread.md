# Open Thread

Scratch pad for pending work items. Brain checks this at session opens via the Session Open trigger. Remove items once resolved. If it's empty, that's fine.

---

## F1 Schema-Shift — pending items
**Added:** 2026-07-07

The results schema-shift shipped its data foundation this session: `f1-results/2026/` (per-round files + `index.json`), full 20-car verified order, race + sprint, provenance, computable standings. Spec: `f1-racetracks/next-build-spec.md`. Still open:

- **(a) Driver-anchor dedup — BLOCKS the ClickUp mirror.** Rows for Colapinto, Lindblad, Bottas, Perez carry `driverId:null` + `_anchor:"UNRESOLVED-DUP"` in the round files. The F1 Drivers list has DUPLICATE tasks (two Colapinto, two Bottas, two Lindblad; Perez single but in the newer ID block), so a 1:1 resolve isn't possible and IDs were NOT guessed. ACTION: dedup the list (🗑️ + DUPLICATE label on the extras per posting hygiene), confirm canonical IDs, backfill the null anchors. Likely-canonical originals in the established 86ae52* block: Colapinto `86ae52rq5`, Bottas `86ae52rtd`, Lindblad `86ae52ryh`; Perez only `86aj1ra1z` exists.
- **(b) f1-refresh mirror rework — time-sensitive (Ricky runs Thu–Sun).** `routines/f1-refresh.md` still targets the retired per-year ClickUp result dropdown. Post-shift the mirror must: keep slim writes (status-flip, dates, notifications), and its one data write becomes appending the frozen year-line to the new slim "Race History" text field, resolved by `cuTaskId`. Full order never touches ClickUp. Rework before the next race weekend or Ricky writes to a dead field.
- **(c) ClickUp "Race History" field not yet created.** One slim year-labeled text field per track (frozen archive lens, fill-if-blank, prior years immutable). Retire the per-year result dropdowns once it's populated.
- **(d) Builds 2–4 are aesthetic (pit-wall restyle) — do WITH Michael, not solo.** Championship points matrix + computed standings, driver-brief cell interaction, then propagate the sharp-corner/tabular restyle. Backend is done; these wait for a live design session.

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
