# F1 Racetracks

> **The app plan.** Load this at the start of every build session.  
> One file answers: what screens exist, what data feeds them, and what to do next, in order.

**Live:** https://mawizorek.github.io/ClickUp_apps/f1-racetracks/  
**Source of truth:** this repo folder  
**Shell version:** v6.7 | **Data:** 2026-07-23c (9 rounds)  
**v7 status:** screens **LOCKED 2026-07-26**. Planning stage. No rebuild code written yet, by design.

📋 **Decision Log:** ClickUp ▸ Brain Reference Library ▸ Formula 1 ▸ *"F1 Racetracks App — Decision Log"*. **This file states WHAT the app is; the log holds WHY.** Read the log before changing anything below — the Screens section is a decision record, not a preference.

---

## What this app is

A browser-based 2026 F1 race-control companion. Circuit breakdowns, live weekend integration, full championship standings, and per-race deep-dive results, all driven by a structured per-round JSON store designed to grow into lap times, telemetry, and strategy data.

Not a results table. A race story told through data.

---

## Screens (the Layout tab)

**The rule that decides what gets a route (LOCKED 2026-07-26):**

> **A screen earns its own route when it owns a data shape nothing else owns. Otherwise it is a lens on an existing route.**

Four routes today. Run this test before ever adding a fifth.

```
index.html — APP SHELL (thin hash router + chrome + default-landing constant)
│
├── #/  ............................ HOME GRID           route 1
│     Context: ROUNDS (summary fields only)
│     └── Lens control (header, NOT a nav tier):
│           [Matrix] default · calendar order, result summaries
│           [History] ......... race-history framing, past winners
│           [Circuits] ........ technical reference (length/laps/type)
│         Three framings of ONE dataset. No lens changes what is reachable.
│
├── #/<slug> ....................... CIRCUIT BREAKDOWN    route 2
│     Context: ROUNDS + CIRCUITS (joined on slug)
│     ├── Weekend Center ......... Schedule / Live / Replay tabs
│     │     THE ROUND'S STATUS WIDGET — "is it happening / has it happened"
│     └── Driver Popup ........... overlay, CLASSIFICATIONS for this round
│           🟡 Arc visualization here (PLANNED)
│
├── #/weekend/<slug> ............... WEEKEND RACE DETAIL  route 3
│     Context: CLASSIFICATIONS (full round, all 20 drivers)
│     THE ROUND'S RESULT DOCUMENT — "what happened, driver by driver"
│     Reached from: Weekend Center → completed race
│     ├── Results mode (default) .. 8 static panels + driver popup
│     │     🟡 Race narrative + DNF/gap detail in popup (PLANNED)
│     ├── 🟡 Tyre mode (FUTURE) ... COMPOUNDS + STINTS. A MODE, not a route
│     └── 🅿️ Story mode (PARKED) .. chunk set built, splice at step 12
│
└── #/standings ................... CHAMPIONSHIP STANDINGS route 4
      Context: CLASSIFICATIONS aggregated across ALL rounds by driverId + team
      ⚠️ Aggregates ON ROUTE ENTRY and caches in `12_results_store.js`.
         NEVER warmed at boot — it is the only screen that fetches every
         round file, and boot-warming makes the home grid pay for standings.
```

**Center vs Weekend (the seam that was undeclared):** Weekend Center is the **status widget**; Weekend Race Detail is the **result document**. Cannot tell which owns a new thing? It belongs to the result document.

**The lenses are not peers.** Matrix and History frame finished business; **Circuits is the odd one out**, carrying the only ROUNDS data you want *before* a race. Do not force symmetry on all three.

### Standalone (deliberately outside the router)

```
live-tracker.html — LIVE SESSION COMPANION
    Context: OpenF1 API (real-time, external). ZERO dependency on our store.
    Reached from: direct link (not in main nav)
    ✅ Adopts the theme spine — THEMES.applyTheme('f1')
    ❌ Does NOT join the router — opened at a track, on a phone, on bad signal
```

Router no (load time is the whole point of this screen), theme yes (off the spine it drifts unnoticed, since it is not in the nav).

### Retired at v7

| File | Fate | Condition |
|---|---|---|
| `standings.html` | → route 4 | Redirect stub to `#/standings` |
| `circuits.html` | → the [Circuits] lens | **Field-diff first** — if it renders a field the lens does not, the lens gains it before the delete. Then a stub to `#/` |
| `weekend.html` | → route 3 | Redirect stub to `#/weekend/<slug>` |

⚠️ **Retiring a top-level file is a delete PLUS a stub, never a raw delete.** These URLs are bookmarked, pasted into ClickUp tasks, and linked from the app dashboard.

### Future screens

- 🟡 **Tyre analysis** → a **mode on route 3**, not a route. STINTS are nested inside CLASSIFICATIONS, so there is no standalone stint store to fetch. Cross-season compound comparison would be a new data shape, and the rule promotes it to a route *then*.
- 🟡 **Season history** → a **route**, not a fourth lens. Multi-year ROUNDS is a new data shape. Do not let it arrive as a lens toggle during the port.

---

## Data Model

### Tables

| Table | Stored as | Records | Key | Role |
|-------|-----------|---------|-----|------|
| **ROUNDS** | `data.json` (rounds array) | 24 per season | `slug` | Card-face summary per circuit. Cross-year, persistent. |
| **CLASSIFICATIONS** | `f1-results/2026/r<NN>-<slug>.json` | ~20 per round | `slug` + `driverId` | Per-driver race result. Time-boxed per season. |
| **CIRCUITS** | `circuits/<slug>.json` | 1 per circuit | `slug` | Track geometry, sectors, character. Static reference. |
| **INDEX_ROUNDS** | `f1-results/2026/index_rounds.json` | 1 per completed round | `slug` | Season manifest: which rounds have data, version stamps. |
| 🟡 **COMPOUNDS** | `f1-results/tyre-compounds.json` (proposed) | 7 | `key` (C1-C5, INT, WET) | Tyre reference: hardness, character, use case. |
| 🟡 **STINTS** | nested in CLASSIFICATIONS as `tyres.stints[]` | ~2-4 per driver per round | parent driverId + index | Per-stint compound + lap range. |

### Fields (CLASSIFICATIONS, the main working table)

| Field | Type | Tier | Status |
|-------|------|------|--------|
| `pos` | int (null = DNF) | 1 | ✅ |
| `driverId` | string (ClickUp task ID) | 1 | ✅ |
| `driver` · `team` | string | 1 | ✅ |
| `status` | enum (FIN/DNF/DNS/DSQ) | 1 | ✅ |
| `points` | number | 1 | ✅ |
| `grid` | int or "PL" | 1 | ✅ |
| `qualifying` | object {pos, q1, q2, q3} | 1 | ✅ |
| `onRoadPos` | int — **absent when == pos** | 1 | ✅ see absence rule |
| `fastLap` | object {time, lap} | 2 | ⚠️ r9 ONLY (1 of 9 rounds) |
| `stewardNote` | string | 1 | ✅ where relevant |
| `tyres` | object {stops, stints[]} | 3 | 🔒 design locked |
| `dnf` | object {lap, reason} | 4 | 🟡 planned |
| `finishGap` | string ("+1.611" / "+1 lap") | 4 | 🟡 planned |

### Relationships

```
ROUNDS ────< CLASSIFICATIONS      one round has many driver results   key: slug
ROUNDS ───── CIRCUITS             one round sits on one circuit       key: slug
CLASSIFICATIONS >---< ROUNDS      same driverId across rounds = the season arc
                                  key: driverId (self-join across round files)
CLASSIFICATIONS ──< STINTS        one driver result has many stints   key: parent
STINTS >---- COMPOUNDS            each stint references one compound
                                  key: compound → COMPOUNDS.key
                                  colour resolved via round-level tyreNomination
```

### Compute-once law

Store raw facts, derive the rest at render. One stored correction fixes every derived view.

- **Store:** pos, grid, qualifying, fastLap, compound + laps per stint, tyreNomination, finishGap, status, points
- **Derive:** positionsGained (`grid - pos`), stop count (`stints.length - 1`), compound colour, stint lengths, cumulative gaps, championship totals

**🚨 The absence rule (`onRoadPos`).** Stored ONLY when it differs from `pos`. **Its absence is MEANINGFUL: missing means "same as pos," NOT "unknown."** Every consumer reads it as `onRoadPos ?? pos`. This was a parenthetical for months, and the v7 port touches every consumer of it.

**⚠️ `fastLap` covers 1 of 9 rounds (r9).** Every path touching it has been exercised against 8 rounds of nulls and one round of data. Backfill r1-8 **before** porting route 3 (step 1) or the null branch ships as the reviewed case and the untested branch goes live the day the data lands.

### The story model (the arc)

**qualifying.pos → grid → onRoadPos → pos.** Four position landmarks per driver per round. The movement between them IS the story; everything else is texture on that arc.

### 🚧 Known boundary: sprint weekends

The schema is keyed **one CLASSIFICATIONS array per round**, so there is **nowhere to put a sprint result** — and 2026 has sprints. The `r<NN>-<slug>.json` rename future-proofed multiple races per circuit per season: right instinct, wrong axis. The real pressure is **two scored sessions in one weekend.** Not a v7 blocker, but route 3 is where a sprint would live, so settle the shape before that port rather than during it.

---

## Source Modules

Sizes measured at HEAD 2026-07-26.

### Top-level files are already thin loaders

`index.html` 7,509 · `weekend.html` **2,666** · `standings.html` 4,321 · `circuits.html` 8,818 · `live-tracker.html` 21,315 (the only fat one, staying standalone).

⚠️ **This app is not a monolith.** Four of five top-level files are thin loaders over `source/` chunk sets. v7 is a **four-loaders-to-one-router consolidation**, not a monolith-to-modular rebuild.

### Main app (`source/`)

| File | Concern | Size | |
|------|---------|------|---|
| `app-shell.js` | Header/footer/nav chrome | 3.9KB | |
| `09_app_bootstrap_and_home.js` | Router + home grid + lens filter | 26KB | 🔴 split is TWO jobs (steps 4-5) |
| `10_track_views_and_profile.js` | Circuit breakdown render | 18KB | 🔴 over |
| `11_weather_and_footer_exports.js` | Weather + export tools | 11KB | |
| `12_results_store.js` | Results fetch/cache | 2.9KB | standings cache lands here |
| `13_live_session_panel.js` | OpenF1 live session | 10.5KB | |
| `14_weekend_state_and_data.js` | Weekend state/schedule/replay | 11KB | |
| `15_weekend_surface_render.js` | Weekend panels + round card | 15KB | 🔴 at the line |
| `16_weekend_live_mode.js` | OpenF1 live hydration | 5.8KB | |
| `17_weekend_mount.js` | Weekend lifecycle/mount | 4.2KB | |
| `18_home_and_mobile_polish.js` | Mobile polish/table fixes | 1.5KB | |

### Sub-surfaces

- **`source/standings/`** — `panel.js` **18,033** 🔴 · `panel.css` 12,665 ⚠️ · `history.js` 12,313 ⚠️ · `base.css` 11,489 · `nav.js` 6,981 · `data.js` 6,738 · `matrix.js` 4,158 · `trajectory.js` 4,011
- **`source/weekend/`** — base.css, panels.css, story.css, data.js, render.js, nav.js, story.js

### Budget rule

~10-12KB target per module. **15KB = split now.** Over 30KB = never round-trips through a single read.

**FOUR files are over the split line today, not one:** `09` (26KB), `10` (18KB), `standings/panel.js` (18KB), `15` (15KB). Any criterion claiming "modules under budget" must cover all four.

**Standings is not a size problem** (Size Sally, 2026-07-26): `standings.html` is a 4.3KB loader, the real ~76KB lives in `source/standings/` and is fetched on demand either way because **routing does not bundle**, and the growth curve is flat (render code, not a data store). Verdict **HOLD** on the fold, **PLAN** the `panel.js` split for step 7. Reasoning in the Decision Log.

---

## Build Order

**The single authoritative ordering (LOCKED 2026-07-26).** The old "Priority Queue" and the separate "v7 phase plan" were rival orderings of overlapping work; they are merged here. `next-build-spec.md` holds the *how* and the acceptance criteria, and carries no ordering of its own.

**Sequencing principle:** data-only work can run anytime (no shell bump, no rebase risk). **Render features wait for the shell**, so nothing is built twice in tokens that are about to change.

| # | Step | Why here |
|---|---|---|
| 1 | **fastLap backfill r1-8** (data-only PR) | Retires the 1-of-9 trap before route 3 bakes in the null path |
| 2 | **Baseline capture** — v6.7 shots, every screen, 320px + desktop | 🚨 Gate. The visual-diff criterion is unfalsifiable without it: step 8 deletes what you would compare against |
| 3 | **Shell scaffold** — template-app v5, `chrome.js`, theme spine, `:root` fallback floor | Nothing ports until there is somewhere to port to |
| 4 | **Extract the router from `09`** | ⚠️ Own step. NOT a port — the new shell *replaces* this half |
| 5 | **Port the home grid** (rest of `09`) + lens control into `chrome.js` | Only safe once the router is out |
| 6 | **Port circuit breakdown** (`10`, `11`, Weekend Center from `14`-`17`) | |
| 7 | **Port standings** — lazy aggregation on entry; execute the `panel.js` split | Sally's PLAN verdict lands here |
| 8 | **Port weekend race detail**, retire satellites to stubs, `VERSIONS.md` → v7 | Consolidation completes |
| 9 | **Driver arc visualization** | Biggest UX upgrade, pure render on Tier 1 data. After the shell so it is built once |
| 10 | **Race narrative** — surface summary + `stewardNote` as visible story | |
| 11 | **Tier 4: `dnf` + `finishGap`** | Cheap data dig, high narrative payoff |
| 12 | **Story Mode splice** into the finished route 3 | 🅿️ Parked out of the v7 cycle — see below |
| 13 | **Tyres Pass B** | When Michael calls it |
| 14 | **Remaining splits:** `10`, `15` | Structural health, no user-facing change |

**🅿️ Why Story Mode is parked (LOCKED 2026-07-26).** `story-mode-reference.html` is written in `weekend.html`'s exact hue-268 tokens, and step 3 moves those tokens to the spine. Splicing before the rebuild means doing the token work twice; splicing during it means carrying a migration inside the riskiest phase. So it leaves the v7 cycle and splices once into the finished route. **Cost: it has been done-but-unshipped since v6 and this parks it longer.**

---

## Related Docs

| File | What it holds | Status |
|------|---------------|--------|
| `next-build-spec.md` | v7 directive, per-step how-to, acceptance criteria, theme join | ✅ Current (rewritten 2026-07-26) |
| `story-mode-handoff.md` | Story integration spec (toggle, data derivation, LOD, theme) | Valid; parked to step 12. Blocker language outdated |
| `story-mode-reference.html` | Working Story Mode in weekend.html's exact tokens | Splice from this at step 12. ⚠️ Token-stale after step 3 |
| `schema-shift-handoff.md` | Original JSON-shape brainstorm (Jul 7) | Superseded by the Data-Story Layer doc |
| Data-Story Layer (ClickUp) | Field scope, sources, tyre model, refresh procedure | Cleanest current data spec |
| F1 Racetracks App — Decision Log (ClickUp) | Every decision about this app + the reasoning | ✅ Current. Read before changing this plan |

---

## Architecture Rules

- **`index.html` is the shell.** Router + chrome + the default-landing constant. Nothing servable lives in it.
- **A screen earns a route only when it owns a data shape nothing else owns.** Otherwise it is a lens, a mode, or an overlay.
- **The 3 lenses are a header CONTROL on the home route, not a navigation tier.**
- **Retiring a top-level file = delete + redirect stub.** Never a raw delete.
- **Standalone is allowed when the data context is genuinely different** (live-tracker on OpenF1) — but it still adopts the theme spine.
- **Data nests inside its app.** `f1-racetracks/f1-results/<year>/` — never a loose root folder.
- **Data-only changes = no shell version bump.**
- **Two-artifact ship for over-cap files.** Running file + `source/` chunk set.
- **Mobile-first.** No overflow at 320px. Touch targets 44px. Fluid sizing.
- **Theme goes LAST.** Build on `default-theme`, apply the F1 join at the end. `var(--token)` everywhere, zero color literals.
- **Team colors (the 20-series), sector colors, and status colors are a LOCAL identity layer.** They ride on top of any theme and are never swept into a theme vector.
- **No file renames for schema alignment.** The documentation IS the translation layer.
- **This file states WHAT; the Decision Log states WHY.** Keep argumentation out of here — it is what pushed this README to 20KB and near the readable-whole ceiling once already.

---

## Links

- [Launch the app](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)
- [Live Tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- [Repo folder](https://github.com/mawizorek/ClickUp_apps/tree/main/f1-racetracks)
- [VERSIONS.md (app ledger)](https://github.com/mawizorek/ClickUp_apps/blob/main/VERSIONS.md)
