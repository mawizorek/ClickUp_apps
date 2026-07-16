# Open Thread

Scratch pad for pending work items. Brain checks this at session opens via the Session Open trigger. Remove items once resolved. If it's empty, that's fine.

---

## FileMaker calc externalization (HML_LLC) — SHIPPED this session (2026-07-16), follow-ups open
**Added:** 2026-07-16

Big structural change to how FileMaker calc fields are documented. Reversed a locked rule with Michael's explicit go. **If picking this up cold: read `filemaker/DOCUMENTATION-STANDARD.md` (now v1.3) first — it is the source of truth for the model below.**

**What changed (all merged to main):**
- **PR #260** — Externalized every calc formula body to `filemaker/hml-llc/calculations/`, one `.fmcalc` file per calc field (19 files: 11 Loans, 4 ExpectedTransactions, 4 GLOBAL_USE_VARIABLES). Each file = 2 `//` header lines + blank + verbatim FileMaker formula, round-trippable (paste straight into the calc dialog). `schema/tables.json` bumped to v1.2: each calc field carries `calcRef` + `returns` + `stored`, formula bodies removed. Added `calculations/_index.json` manifest (owning table, return, stored, purpose, `reads` dependency hints). GLOBAL calc names reconciled to canonical camelCase.
- **PR #261** — Retired the inline `Calculations` sections from the three table markdown files. NO pointer list retained (Michael: markdown is fully replaced, a pointer list is just a second index to drift). Calc fields still appear as ROWS in each Fields table; each file keeps one prose line pointing at `../calculations/`. Standard bumped to v1.3.

**The locked model now (v1.3):** formula body lives ONLY in `calculations/*.fmcalc`; structural metadata in `schema/tables.json`; dependency hints in `calculations/_index.json`; presentation via the renderer. Table markdown carries zero calc bodies. One definition, one home.

**Rendering/tooling artifacts (ClickUp run.clickup.ai artifacts, NOT in repo yet):**
- Schema Renderer v2 — reads live schema + fetches `.fmcalc` bodies, FileMaker syntax highlighting, copy-to-clipboard, `reads` dependency graph (D3). 
- Calc Linter — validates calculations/ against the schema (orphan/missing calcRef, balanced parens/brackets/quotes, unused Let vars, same-table + cross-table `reads` resolution, manifest↔schema coverage, header match). Built with an embedded offline snapshot fallback so it runs even if the raw fetch is cache-lagged.

**STILL OPEN (next agent picks up here):**
- **(a) Promote the renderer + linter into the repo.** They live as ClickUp artifacts right now. Per the locked standard they should become the shared `filemaker/_viewer/` (app-agnostic, param-driven by app slug) so every FMP app gets docs the moment its JSON exists. Modular shell + source/, not a monolith.
- **(b) The `reads` dependency hints are HAND-AUTHORED** in `_index.json`. The linter validates them but does not GENERATE them. Consider a real parser that derives `reads` from each formula so the hint can't drift from the body. Until then, treat `reads` as advisory.
- **(c) Fold the calc linter into the Schema Linter tool** (AI Toolkit) rather than a standalone artifact, so it fires on the normal FileMaker doc-edit path.
- **(d) Markdown generation.** Table markdown Fields tables are still hand-maintained and duplicate `schema/tables.json`. The endgame (discussed, not started) is to GENERATE the markdown from the JSON so there's nothing to keep in sync. Separate pass.
- **(e) Live-file name confirmation (pre-existing, still open):** schema names `OriginalPrincipal`/`InterestRateAnnual`/`ClosingDate`/`GraceDays`/`fkCurrentPayoff` are reconciled in docs but NOT yet confirmed against the live FMP file. File is the tiebreaker if they differ.
- **(f) Apply the model to the other FMP app** (`filemaker/maw-budget`) once the viewer is promoted. HML_LLC is the reference implementation.

**Convention reference (for a cold pickup):** filename `<Table>__<FieldName>.fmcalc` (double-underscore namespace sep, kills cross-table collisions since calc names aren't globally unique). Ext `.fmcalc` = plain text.

---

## Inciardi Market — full catalog HARVEST PASS (do first next session)
**Added:** 2026-07-13

The catalog-research-routine is written and good; execution is the gap. Catalog is ~37 of ~542 known prints after one partial pass. **Next session: run a full deep-excavation harvest per `inciardi-market/catalog-research-routine.md`.** Do NOT reinvent the routine — it already has the Shopify unlock, the 3-layer explode, classification, image sourcing, scrub rules, and a resumable Progress Log. Just run it cold from step 1.

- **Primary source (the unlock):** `inciardiprints.com/products.json?limit=250&page=N` (page until empty). Clean structured JSON, zero scraping. Three layers of prints: products, variants, and print-name lists buried in mystery-pack `body_html`.
- **Classify** via `/collections/<handle>/products.json` membership (category + exclusive/series).
- **Images:** variant-level `featured_image.src` -> per-print art; write the canonical Shopify CDN URL into each row's `image` field (LOCKED: reference the CDN URL, do NOT self-host blobs). `image: null` + provisional when none.
- **Reconcile** against existing `catalog.json`: match -> add alias + refresh; no match -> new canonical (sourced) OR provisional if uncertain. Merge, don't delete. Official names win; seller/eBay titles become aliases.
- **Secondary sweeps:** Instagram drop history, press, host shops, store-locator (machines) for retired/seasonal/exclusive prints the store no longer lists.
- **NEVER** copy miniprint.io (competitor) — answer-key only ("they claim 500, we have N"). Never fabricate names.
- **On finish:** log the pass in the routine's Progress Log (before/after count, sources hit, image coverage, gaps), then commit `catalog.json` data-only (no app shell/version bump) via branch->PR->self-merge.
- Fresh-read the current `catalog.json` first (its blob failed to load 2026-07-13 late-night; re-pull clean).

## Inciardi Market — NEW print viewer (after the harvest)
**Added:** 2026-07-13

After the catalog is fat with real prints, Michael wants **the best app to view / sort / filter / find / interact with the available prints.** This is a rebuild of the lens, not a patch.

- **Michael's direction (verbatim intent):** the prior version was buggy and "kind of cheesy." Wants **sharp corners** and a **database / search-field feel** for this lens (think fast queryable table/registry, not a soft card toy). Sharp, dense, precise.
- **Workshop team INVOLVED** — explicit ask. Run The Workshop (6 lenses) on the design before committing source; this is committed-source work so it gates through the pre-build stress-test.
- **NO monolith files** — explicit ask, and it matches the locked modular standard. Thin HTML shell + `source/` modules (the app is already modular post-v10: `base.css` + per-page css/js). Extend that pattern, don't regress it.
- Lives in the existing three-page app (Catalog / Market / Collection). Decide whether this sharp "database" viewer replaces/reskins `catalog.html` (the gallery) or is a distinct lens. Open design question for the Workshop.
- Reads the harvested `catalog.json`; cross-refs live market status the way the current catalog does. Per-print detail view (history + details about a specific available print) is part of the ask.

## Inciardi Market — DONE this session (2026-07-12/13, don't redo)
- **index-as-router reconcile (PR #156):** `index.html` -> thin router (1.8KB, one-line `DEFAULT_LANDING = market.html` + JS redirect + noscript). Market terminal moved verbatim to `market.html`. catalog/collection Market-nav links repointed to `./market.html`.
- **Worker v0.4 price fix (PR #157):** the $0.00 / -100% Deal Radar bug was AUCTION listings — `normalize()` only read `it.price.value` (absent on auctions); now falls back to `it.currentBidPrice`.
- **Ledger (PR #158):** inciardi-market row = shell v10 (index=router) · worker v0.4. Stale PR #155 closed (its content already landed + it regressed the f1 row).
- **wrangler.toml + git-connect (PRs #159, #166):** Worker now connected to the repo (root dir `inciardi-market`, prod branch main, cron `0 */6 * * *`). **Workers Builds auto-deploy is LIVE** — merge to main now auto-ships the Worker. Confirmed: active deployment flipped to a fresh git build, retired the 2-day-old v0.3. KV `SNAPSHOTS`=`9780d264...`, D1 `DB`=`18f3459f-8273-44d6-8380-6971d6173b3e`. Secrets stay dashboard-side.
- **Cron now live** — was an open loop ("no trend history until cron attached"). `market_point` + `print_point` now accumulate every 6h.

## Inciardi Market — scoring backbone (PAUSED by Michael, revisit after harvest+viewer)
**Added:** 2026-07-13

Move scoring off the flat `14` retail constant. Two layers:
1. **Per-print retail** (cheap, no new data): `verdict`/`deltaFor` read `catalog.retail` for the print, fall back to `14` only when unknown. Kills most of the noise (a $6 Negroni judged against $14).
2. **Market-anchored baseline** (needs accumulated `print_point` history): fair value = the print's own median landed over time, not a retail guess.
- **Undecided fork (Michael must call):** is "fair value" retail-anchored ("cheaper than she sold it") or market-anchored ("cheaper than it trades")? Diverges hard on exclusives (retail $6, trades $80). Defines what BUY means. Spec both into `next-build-spec.md` before building.

---

## F1 Racetracks — data layer refactor follow-ups
**Added:** 2026-07-09

Canonical results store shipped (PRs #105, #108, #109). One source of truth: `f1-racetracks/f1-results/2026/` (per-round files + `index_rounds.json`). Enriched per-driver schema (qualifying + grid + fastLap) is LIVE and surfaced in the standings driver popup (v5.1). Albert Park (r1) is the complete reference round. **Rounds 2-7 qualifying + grid backfill SHIPPED 2026-07-09 (PRs #116, #117, #118), matched by driverId; Q1/Q2/Q3 present where the CU task tabulated them, grid penalties + pit-lane starts captured.**

**STILL OPEN (next agent picks up here):**
- **(a) Qualifying dig, rounds 8-9 (Austria + Silverstone).** These have NO quali table in ClickUp — need a genuine external source dig. Austria task is race-narrative only; Silverstone is still a preview. Left ABSENT on purpose pending a source that matches this season's canon (fields degrade gracefully); do NOT fill from real-world 2026 data, which diverges from this season.
- **(b) Per-driver race `fastLap`.** Not in the CU tasks (they carry only the one official FL). Backfills empty; degrades gracefully; Ricky's going-forward dig from a lap-time source.
- **(c) v5.1 quali popup layout notes (Michael, 2026-07-09) — CAPTURED, ready for the next UI pass.** The popup is organized around the driver's position landmarks (qualifying → race start/grid → race finish). Restructure so each block carries only what belongs to it:
    - **Qualifying block (first, under the qualifying position):** the qualifying lap time (Q1/Q2/Q3) lives HERE and ONLY here. Currently the quali time repeats under every race-story block — pull it out of the later blocks.
    - **Race start (grid) + race finish (pos) blocks:** go deeper on the race itself — this driver's fastest-lap detail + more tire-strategy info (compounds, stops) for that driver.
    - **DATA DEPENDENCY (flag before build):** the fastest-lap detail needs per-driver `fastLap` (item (b), still null pending a lap-time source), and per-driver tire strategy is NOT in the store schema at all — that's a NET-NEW field (schema was locked this pass; adding it needs a Fold-in/Size pass + Michael's go). The UI can ship the layout restructure now (relocating the quali time) and degrade the race-detail section until the data lands. Data diff and UI diff = separate PRs.
- **(d) Lens integration not squared.** `index.html` is a thin router landing on the drivers matrix, forwarding `#/<slug>` to `circuits.html`. The true integration of the two lenses (matrix + circuit guide) is an open design question, deliberately not forced.
- **(e) 2024/2025 historical backfill (future, Michael-flagged).** Structure is built for it: each season = its own `f1-results/<year>/` folder with its own `index_rounds.json`; a cross-season `index_seasons.json` at the store root slots in when a second season exists. Needs a NEW viewing level in the app (ties to (d)). Build nothing until Michael calls it; it's the stress-test of this schema.
- **(f) Cosmetic:** circuit guide's TRACKS round numbering (Silverstone R11) differs from the store's (R9). They join by slug so nothing breaks; reconcile if it bugs you.

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
