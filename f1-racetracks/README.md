# F1 Racetracks

> **The app plan.** Load this at the start of every build session.  
> One file answers: what screens exist, what data feeds them, and what to do next, in order.

**Live:** https://mawizorek.github.io/ClickUp_apps/f1-racetracks/  
**Source of truth:** this repo folder  
**Shell version:** v6.7 | **Data:** 2026-07-23c (9 rounds)  
**v7 status:** screens **LOCKED 2026-07-26**. Planning stage. No rebuild code written yet, by design.

📋 **Decision Log:** ClickUp ▸ Brain Reference Library ▸ Formula 1 ▸ *"F1 Racetracks App — Decision Log"*. Every call about this app and the reasoning behind it. **Read it before changing the plan below** — the Screens section is a decision record, not a preference.

---

## What this app is

A browser-based 2026 F1 race-control companion. Circuit breakdowns, live weekend integration, full championship standings, and per-race deep-dive results, all driven by a structured per-round JSON store designed to grow into lap times, telemetry, and strategy data.

Not a results table. A race story told through data.

---

## Screens (the Layout tab)

**The rule that decides what gets a route (LOCKED 2026-07-26, Decision Log J1):**

> **A screen earns its own route when it owns a data shape nothing else owns. Otherwise it is a lens on an existing route.**

Apply that and v7 has exactly **four routes**. Anything else is a lens, an overlay, or a mode. Use this test before ever adding a fifth.

```
index.html — APP SHELL (thin hash router + chrome + default-landing constant)
│
├── #/  ............................ HOME GRID          route 1
│     Context: ROUNDS (summary fields only)
│     │
│     └── Lens control (header, NOT a nav tier):
│           [Matrix] default — calendar order, result summaries
│           [History] ........ race-history framing, past winners
│           [Circuits] ....... technical reference (length/laps/type)
│     Three framings of ONE dataset. No lens changes what you can reach.
│
├── #/<slug> ....................... CIRCUIT BREAKDOWN   route 2
│     Context: ROUNDS + CIRCUITS (joined on slug)
│     │
│     ├── Weekend Center ......... Schedule / Live / Replay tabs
│     │     THE ROUND'S STATUS WIDGET — "what is happening / has it happened"
│     │
│     └── Driver Popup ........... overlay, CLASSIFICATIONS filtered to this round
│           🟡 Arc visualization here (PLANNED)
│
├── #/weekend/<slug> ............... WEEKEND RACE DETAIL route 3
│     Context: CLASSIFICATIONS (full round, all 20 drivers)
│     THE ROUND'S RESULT DOCUMENT — "here is what happened, driver by driver"
│     Reached from: Weekend Center → completed race
│     │
│     ├── Results mode (default) .. 8 static panels + driver popup
│     │     🟡 Race narrative in popup (PLANNED)
│     │     🟡 DNF/gap detail in popup (PLANNED)
│     ├── 🟡 Tyre mode (FUTURE) ... COMPOUNDS + STINTS, a MODE not a route
│     └── 🅿️ Story mode (PARKED) .. chunk set built, splice deferred (see Build Order)
│
└── #/standings ................... CHAMPIONSHIP STANDINGS route 4
      Context: CLASSIFICATIONS aggregated across ALL rounds by driverId + team
      ⚠️ Aggregation runs ON ROUTE ENTRY and caches. NEVER warmed at boot —
         it is the only screen that fetches every round file, and boot-warming
         makes the home grid pay for standings on every cold load.
```

**The Center vs Weekend boundary (LOCKED — this seam was undeclared and caused the confusion):** two surfaces are both "the weekend" and both reachable from the same round card. Weekend Center is the **status widget** (is it happening, has it happened, what's the schedule). Weekend Race Detail is the **result document** (what happened, per driver). If you are adding something and cannot tell which one owns it, it belongs to the result document.

**The lenses are not peers.** Matrix and History are framings of finished business. **Circuits is the odd one out** — it carries technical reference, the only ROUNDS data you want *before* a race rather than after. Expect it to drift from the other two, and do not force symmetry on all three.

### Standalone (deliberately outside the router)

```
live-tracker.html — LIVE SESSION COMPANION
    Context: OpenF1 API (real-time, external). ZERO dependency on our store.
    Reached from: direct link (not in main nav)
    ✅ Adopts the theme spine — THEMES.applyTheme('f1')
    ❌ Does NOT join the router — it is opened at a track, on a phone, on bad
       signal. Booting the full shell to show a timing feed is a regression in
       the one context where load time actually matters.
```

This is the answer to two separate questions, which is why it kept reading as unresolved: **router no, theme yes.** Off the router for load time; on the spine so it does not silently drift every time the F1 theme changes (it is not in the main nav, so nobody would notice until it looked broken).

### Retired at v7

| File | Fate | Condition |
|---|---|---|
| `standings.html` | → route 4 | Replaced by a **redirect stub** to `#/standings` |
| `circuits.html` | → the [Circuits] lens | **Field-diff first** (it is older; if it renders a field the lens does not, the lens gains it before the delete), then a **redirect stub** to `#/` |
| `weekend.html` | → route 3 | Replaced by a **redirect stub** to `#/weekend/<slug>` |

⚠️ **Retiring a top-level file is a delete PLUS a stub, never a raw delete.** These URLs are bookmarked, pasted into ClickUp tasks, and linked from the app dashboard. A two-line forwarding stub costs nothing and keeps every saved link alive.

### Future screens

- 🟡 **Tyre analysis** → a **mode on Weekend Race Detail**, not a route. STINTS are nested inside CLASSIFICATIONS as `tyres.stints[]`; there is no standalone stint store to fetch, so a dedicated page would re-fetch round files to re-derive what the weekend route already holds in memory. If it ever needs cross-season compound comparison, that is a new data shape and the rule promotes it to a route *then*.
- 🟡 **Season history** → a **route**, not a fourth lens. Multi-year ROUNDS is a new data shape. Do not let it sneak in as a lens toggle during the port.

---

## Schema (the Relationship Graph)

### Tables

| Table | Stored as | Records | Key | Role |
|-------|-----------|---------|-----|------|
| **ROUNDS** | `data.json` (rounds array) | 24 per season | `slug` | Card-face summary per circuit. Cross-year, persistent. |
| **CLASSIFICATIONS** | `f1-results/2026/r<NN>-<slug>.json` (classification array) | ~20 per round | `slug` + `driverId` | Per-driver race result. Time-boxed per season. |
| **CIRCUITS** | `circuits/<slug>.json` | 1 per circuit | `slug` | Track geometry, sectors, character. Static reference. |
| **INDEX_ROUNDS** | `f1-results/2026/index_rounds.json` | 1 per completed round | `slug` | Season manifest: which rounds have data, version stamps. |
| 🟡 **COMPOUNDS** | `f1-results/tyre-compounds.json` (proposed) | 7 | `key` (C1-C5, INT, WET) | Tyre reference: hardness, character, use case. Season-keyed. |
| 🟡 **STINTS** | nested in CLASSIFICATIONS as `tyres.stints[]` | ~2-4 per driver per round | (parent driverId + stint index) | Per-stint compound + lap range. |

### Fields (CLASSIFICATIONS, the main working table)

| Field | Type | Tier | Status |
|-------|------|------|--------|
| `pos` | int (null = DNF) | 1 | ✅ |
| `driverId` | string (ClickUp task ID) | 1 | ✅ |
| `driver` | string | 1 | ✅ |
| `team` | string | 1 | ✅ |
| `status` | enum (FIN/DNF/DNS/DSQ) | 1 | ✅ |
| `points` | number | 1 | ✅ |
| `grid` | int or "PL" | 1 | ✅ |
| `qualifying` | object {pos, q1, q2, q3} | 1 | ✅ |
| `onRoadPos` | int (**absent when == pos** — see the absence rule) | 1 | ✅ |
| `fastLap` | object {time, lap} | 2 | ⚠️ r9 only — see the coverage warning |
| `stewardNote` | string | 1 | ✅ (where relevant) |
| `tyres` | object {stops, stints[]} | 3 | 🔒 design locked |
| `dnf` | object {lap, reason} | 4 | 🟡 planned |
| `finishGap` | string ("+1.611" / "+1 lap") | 4 | 🟡 planned |

### Relationships

```
ROUNDS ────< CLASSIFICATIONS     (one round has many driver results)
  key: slug

ROUNDS ───── CIRCUITS            (one round sits on one circuit)
  key: slug

CLASSIFICATIONS >---< ROUNDS      (same driverId across rounds = season arc)
  key: driverId (self-join across round files)

CLASSIFICATIONS ──< STINTS       (one driver result has many stints)
  key: parent record

STINTS >---- COMPOUNDS             (each stint references one compound)
  key: compound → COMPOUNDS.key
  Resolved via round-level tyreNomination for display colour
```

### Screen Contexts

| Screen | Primary table | Joins |
|--------|--------------|-------|
| Home grid (all 3 lenses) | ROUNDS | none (summary fields only) |
| Circuit breakdown | ROUNDS | CIRCUITS (track detail), CLASSIFICATIONS (race results) |
| Driver popup | CLASSIFICATIONS | filtered to one round + one driver |
| Weekend race detail | CLASSIFICATIONS | full round, joined to ROUNDS for round-level fields |
| Standings | CLASSIFICATIONS | aggregated across all rounds by driverId and team |
| Live tracker | (external: OpenF1) | none |
| 🟡 Tyre mode | COMPOUNDS + STINTS | joined via compound key |

### Compute-once law

Store raw facts, derive everything else at render. A correction to one stored field fixes every derived view.

- **Store:** pos, grid, qualifying, fastLap, compound + laps per stint, tyreNomination (round-level), finishGap, status, points
- **Derive:** positionsGained (`grid - pos`), stop count (`stints.length - 1`), compound colour (via tyreNomination lookup), stint lengths, cumulative gaps, championship points totals

#### 🚨 The absence rule (`onRoadPos`)

**`onRoadPos` is stored ONLY when it differs from `pos`. Its absence is MEANINGFUL: missing means "same as pos," NOT "unknown."**

Every consumer must read it as `onRoadPos ?? pos`. This was a parenthetical for months and it is exactly the kind of implicit contract that lives in one developer's head and dies in a port — and the v7 port touches every consumer of it. It is a stated rule now.

#### ⚠️ `fastLap` coverage warning

`fastLap` exists for **1 of 9 rounds** (r9). Every render path that touches it has been exercised against 8 rounds of nulls and one round of data. **Do the r1-8 backfill BEFORE porting the weekend route** (it is step 1 of the Build Order) or the null branch gets built and reviewed as the normal case, and the moment the backfill lands the untested branch becomes the live one.

### The story model (the arc)

**qualifying.pos → grid → onRoadPos → pos**

Four position landmarks per driver per round. The movement between them IS the story. Everything else (fast lap, strategy, DNF, penalties) is texture on that arc.

### 🚧 Known boundary: sprint weekends

The schema is keyed **one CLASSIFICATIONS array per round**, so there is **nowhere to put a sprint result** — and 2026 has sprints. The `r<NN>-<slug>.json` rename future-proofed *multiple races per circuit per season*, which is the right instinct pointed at the wrong axis: the real pressure is **two scored sessions in one weekend**, not two Grands Prix at one track.

Not a v7 blocker. But the weekend route is where a sprint would have to live, so settle the shape before that port rather than during it.

---

## Status Key

- **LIVE** = shipped, working
- 🟡 **PLANNED** = data or spec exists, not built
- 🅿️ **PARKED** = built, deliberately not shipped yet
- 🔒 **HELD** = design locked, execution waiting on Michael's call
- **FUTURE** = needs new data + a new screen

---

## Source Modules

All sizes measured at HEAD, 2026-07-26 (commit `ecfdc81`).

### The top-level files are already thin loaders

| File | Bytes | Role |
|---|---|---|
| `index.html` | 7,509 | Shell + router |
| `weekend.html` | **2,666** | Loader over `source/weekend/` |
| `standings.html` | 4,321 | Loader over `source/standings/` |
| `circuits.html` | 8,818 | Satellite (retiring) |
| `live-tracker.html` | 21,315 | The only genuinely fat file — staying standalone |

⚠️ **Do not describe this app as a monolith.** Four of the five top-level files are thin loaders booting chunk sets from `source/`. v7 is a **four-loaders-to-one-router consolidation**, not a monolith-to-modular rebuild. The job is materially smaller than that framing implies, and the framing kept overstating it.

### Main app (`source/`)

| File | Concern | Size | Notes |
|------|---------|------|-------|
| `app-shell.js` | Header/footer/nav chrome | 3.9KB | |
| `09_app_bootstrap_and_home.js` | Router + home grid + lens filter | 26KB | 🔴 Over budget. Split is TWO jobs, see Build Order |
| `10_track_views_and_profile.js` | Circuit breakdown render | 18KB | 🔴 Over budget |
| `11_weather_and_footer_exports.js` | Weather + export tools | 11KB | |
| `12_results_store.js` | Results data fetch/cache | 2.9KB | Standings cache lands here |
| `13_live_session_panel.js` | OpenF1 live session | 10.5KB | |
| `14_weekend_state_and_data.js` | Weekend state/schedule/replay | 11KB | |
| `15_weekend_surface_render.js` | Weekend panels + current-round card | 15KB | 🔴 At the split line |
| `16_weekend_live_mode.js` | OpenF1 live hydration | 5.8KB | |
| `17_weekend_mount.js` | Weekend lifecycle/mount | 4.2KB | |
| `18_home_and_mobile_polish.js` | Mobile polish/table fixes | 1.5KB | |

### Standings (`source/standings/`)

| File | Bytes | Notes |
|---|---|---|
| `panel.js` | **18,033** | 🔴 Over budget. Split seam: render vs row-building |
| `panel.css` | 12,665 | ⚠️ Over target |
| `history.js` | 12,313 | ⚠️ Over target |
| `base.css` | 11,489 | ⚠️ At target |
| `data.js` | 6,738 | |
| `nav.js` | 6,981 | |
| `matrix.js` | 4,158 | |
| `trajectory.js` | 4,011 | |

### Weekend (`source/weekend/`)

`base.css`, `panels.css`, `story.css`, `data.js`, `render.js`, `nav.js`, `story.js`

### Budget rule

~10-12KB target per module. **15KB = split now.** Over 30KB = never round-trips through a single read.

**There are FOUR files over the split line today, not one:** `09` (26KB), `10` (18KB), `standings/panel.js` (18KB), `15` (15KB). Any acceptance criterion claiming "modules under budget" must cover all four or it is a criterion written to be passed rather than checked.

**Standings size verdict (Size Sally, 2026-07-26):** file size is **not** a reason to keep standings out of the router. `standings.html` is a 4.3KB loader; folding it deletes a file and costs a route-table line. The real ~76KB lives in `source/standings/` and is fetched on demand either way, because **routing does not bundle**. Growth curve is flat: that is render code, not a data store, and a 24-round season adds rows at runtime, not bytes on disk. The per-round data split already closed the store-growth risk. Verdict **HOLD** on the fold, **PLAN** the `panel.js` split for when the standings port touches it.

---

## Build Order

**This is the single authoritative ordering (LOCKED 2026-07-26, Decision Log Q7).** The old "Priority Queue" and the separate "v7 phase plan" were two rival orderings of overlapping work; they are merged here. `next-build-spec.md` holds the *how* and the acceptance criteria for these steps, and carries no ordering of its own.

**Sequencing principle:** data-only work can run anytime (no shell bump, no rebase risk). **Render features wait for the shell**, so nothing gets built twice in tokens that are about to change.

| # | Step | Why here |
|---|---|---|
| 1 | **fastLap backfill r1-8** (data-only PR) | Independent of the rebuild, and it retires the 1-of-9 coverage trap before the weekend port bakes in the null path |
| 2 | **Baseline capture** — v6.7 reference shots, every screen, 320px + desktop | 🚨 Gate. The visual-diff criterion is unfalsifiable without it: step 8 deletes the very files you would compare against |
| 3 | **Shell scaffold** — template-app v5 pattern, `chrome.js`, theme spine, `:root` fallback floor | Nothing ports until there is somewhere to port to |
| 4 | **Extract the router from `09`** | ⚠️ Its own step. NOT a port — the new shell *replaces* this half of `09` |
| 5 | **Port the home grid** (the rest of `09`) + lens control into `chrome.js` | Only safe once the router is out |
| 6 | **Port circuit breakdown** (`10` + `11`, Weekend Center from `14`-`17`) | |
| 7 | **Port standings** — lazy aggregation on route entry; execute the `panel.js` split here | Sally's PLAN verdict lands in this step |
| 8 | **Port weekend race detail**, then retire the satellites to redirect stubs; `VERSIONS.md` → v7 | The consolidation completes |
| 9 | **Driver arc visualization** | The biggest UX upgrade, and pure render on existing Tier 1 data. After the shell so it is built once |
| 10 | **Race narrative section** — surface summary + `stewardNote` as visible story | |
| 11 | **Tier 4: `dnf` + `finishGap`** | Cheap data dig, high narrative payoff |
| 12 | **Story Mode splice** into the final weekend route | 🅿️ Parked out of the v7 cycle deliberately — see below |
| 13 | **Tyres Pass B** | When Michael calls it |
| 14 | **Remaining splits:** `10`, `15` | Structural health, no user-facing change |

### 🅿️ Why Story Mode is parked (LOCKED 2026-07-26, Decision Log Q6)

The v6 chunk set is built and `story-mode-reference.html` is written in `weekend.html`'s **exact hardcoded hue-268 tokens**. Step 3 moves those tokens to theme-spine variables. So splicing it *before* the rebuild means writing it in tokens that are about to change and then migrating them during the port: the work gets done twice. Splicing it *during* the rebuild means carrying a token migration inside the riskiest phase.

So it comes out of the v7 cycle entirely and splices once, cleanly, into the finished weekend route. **Honest cost:** Story Mode has been done-but-unshipped since v6 and this parks it longer.

---

## Related Docs

| File | What it holds | Status |
|------|---------------|--------|
| `next-build-spec.md` | v7 directive, per-step how-to, acceptance criteria, theme join | ✅ Current (rewritten 2026-07-26 for the screen lock) |
| `story-mode-handoff.md` | Story integration spec (toggle, data derivation, LOD, theme) | Valid; parked until Build Order step 12. Blocker language outdated |
| `story-mode-reference.html` | Working Story Mode in weekend.html's exact tokens | Splice from this at step 12. ⚠️ Token-stale after step 3 |
| `schema-shift-handoff.md` | Original JSON-shape brainstorm (Jul 7) | Superseded by the Data-Story Layer doc |
| Data-Story Layer (ClickUp doc) | Field scope, sources, tyre model, refresh procedure | Cleanest current data spec |
| F1 Racetracks App — Decision Log (ClickUp) | Every decision about this app + the reasoning | ✅ Current. Read before changing this plan |

---

## Architecture Rules

- **`index.html` is the shell.** Router + chrome + the default-landing constant. Nothing servable lives in it.
- **A screen earns a route only when it owns a data shape nothing else owns.** Otherwise it is a lens, a mode, or an overlay. Four routes today.
- **The 3 lenses are a header CONTROL on the home route, not a navigation tier.** They reframe one dataset; none changes what is reachable.
- **Retiring a top-level file = delete + redirect stub.** Never a raw delete; the old URLs are saved and pasted everywhere.
- **Standalone is allowed when the data context is genuinely different** (live-tracker on OpenF1) — but it still adopts the theme spine.
- **Data nests inside its app.** `f1-racetracks/f1-results/<year>/` — never a loose root folder.
- **Data-only changes = no shell version bump.**
- **Two-artifact ship for over-cap files.** Running file + `source/` chunk set.
- **Mobile-first.** No overflow at 320px. Touch targets 44px. Fluid sizing.
- **Theme goes LAST.** Build on `default-theme`, apply the F1 join at the end. `var(--token)` everywhere, zero color literals.
- **Team colors (the 20-series), sector colors, and status colors are a LOCAL identity layer.** They ride on top of any theme and are never swept into a theme vector.
- **No file renames for schema alignment.** The documentation IS the translation layer. `data.json` = ROUNDS, stated once, understood everywhere.

---

## Links

- [Launch the app](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)
- [Live Tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- [Repo folder](https://github.com/mawizorek/ClickUp_apps/tree/main/f1-racetracks)
- [VERSIONS.md (app ledger)](https://github.com/mawizorek/ClickUp_apps/blob/main/VERSIONS.md)
