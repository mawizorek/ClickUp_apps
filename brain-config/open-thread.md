# Open Thread

Scratch pad for pending work items. Brain checks this at session opens via the Session Open trigger. Remove items once resolved. If it's empty, that's fine.

---

## Inciardi Market — split index.html into a router shell + market.html
**Added:** 2026-07-10

### WHAT THIS APP IS
"Inciardi Market" is a two-part collector tool for Anastasia Inciardi mini prints. Repo `mawizorek/ClickUp_apps`, folder `inciardi-market/`, Pages at https://mawizorek.github.io/ClickUp_apps/inciardi-market/. Two faces of ONE app:

1. **Market terminal** (`index.html` today) — price terminal reading live eBay listings via the Cloudflare Worker. Tabs: Deal Radar, Sell Signal, My Stock, Catalog, Machines, All, Compare. Logic in `app.js`. Surfaces underpriced buys + sell signals on exclusives. Prices from Worker `/market`; `market.json` is the sample fallback. The "should I buy/sell" lens.
2. **Collection deck** (`collection.html`) — Pokedex-style visual registry of every known print. Fixed-size trading cards, owned = full color, unowned = ghosted. Tap to catch, long-press to want. Stacking lenses (search + views + rarity/collection/subject). Reads/writes inventory live to D1 via the Worker. The "what do I own / what exists" lens.

Three data planes, ONE join key (`print_id`): catalog (D1, ~37 seeded of ~542 known), inventory (D1, print_id-keyed), market (KV snapshot rebuilt each run; trend points distilled into D1).

### THE TASK
Split `index.html` per the LOCKED index-as-router standard (GitHub MCP Operating Standard). Today `index.html` is a 24KB single-file terminal wired to `app.js` — transitional debt. Convert to:
- **`market.html`** — the terminal, MOVED verbatim from today's `index.html` (keep the `app.js` wiring; do NOT rewrite the logic).
- **`index.html`** — a THIN router shell: shared masthead nav (Market / Collection switcher, the component already in `collection.html` v0.8), a one-line default-landing constant, nothing servable itself.
- **`collection.html`** — switcher already added (v0.8); just confirm its Market link targets `market.html`, not `./`.

END STATE: one app, both-way nav. Market ⇄ Collection from inside either page.

### WHY IT'S A HANDOFF (hard blocker)
`index.html` (24KB) + `app.js` (21KB) do NOT read back whole through the current tools: blob API truncates `index.html` at ~15KB (cuts mid-CSS at `.sell-flag`), raw fetch flattens markup, `app.js` unreadable so far. Splitting safely REQUIRES a clean full read of both files first (Michael pastes/uploads them, OR a session with working full-file reads). Do NOT blind-write `market.html` from a partial read — breaks the live terminal + violates read-before-write and the "large files never through create_or_update_file" locked rules.

### ALREADY DONE (don't redo)
- D1 `inciardi-market` created; bindings live: `DB` (D1) + `SNAPSHOTS` (KV).
- Schema applied: catalog, catalog_alias, inventory, market_point, print_point, gone_event.
- Worker v0.3 deployed: `GET /market`, `GET/POST /inventory` (setState op), `POST /catalog/confirm`, cron scaffold. Gated by `x-write-key`. Endpoint is `buy/browse/v1` (correct).
- Collection deck built + live through v0.8: fixed cards, lenses, D1 sync, sync-key in Settings, Market/Collection switcher.
- Catalog seed (37 prints) in `db/seed-catalog.sql`.

### OPEN LOOPS (after the split)
- **$0.00 / -100% price-parse bug on Deal Radar** — live terminal shows listings with no price parsed (screenshot 2026-07-10). Fix the Worker/app price extraction so real landed prices render.
- eBay Cert ID rotation (treat as exposed).
- Cron trigger not attached yet (~6h) — no trend history accumulates until it is.
- Real catalog: ~37 seeded of ~542 known. Grow via `/catalog/confirm` + research passes. Full 542 list is NOT publicly harvestable (lives in miniprint.io's app) — do NOT fabricate names.
- Real card images: drop PNGs at `inciardi-market/cards/<print_id>.png`, deck auto-loads them.
- Live per-card eBay prices on the deck (currently labelled sample data).

### STANDARDS (non-negotiable)
- PR-merge workflow: branch → PR → self-merge. Never direct to main.
- Read via blob API first; re-fetch fresh before any write; never reuse a carried SHA.
- `.nojekyll` stays at repo root. Footer = JS-written stamp `<App> v<N> · PR #<n>`.
- Secrets (WRITE_KEY, eBay keys) stay Worker-side / device-side, NEVER in the repo.
- Read the session board before touching the repo; clear your entry on close.

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
