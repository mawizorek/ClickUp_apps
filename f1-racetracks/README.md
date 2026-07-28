# F1 Racetracks

> **The app plan.** Load this at the start of every build session.
> One file answers: what screens exist, what data feeds them, and what to do next, in order.

📋 **Decision Log:** ClickUp ▸ Brain Reference Library ▸ Formula 1 ▸ *"F1 Racetracks App — Decision Log"*. **This file states WHAT the app is; the log holds WHY.** Read the log before changing anything below.

📊 **Data store documentation:** [`f1-results/2026/README.md`](f1-results/2026/README.md) — row schema, canon rule, and the **per-field state table** (what is `live` vs `documented-only` vs `planned`, with the commit that proved it).

**Live:** https://mawizorek.github.io/ClickUp_apps/f1-racetracks/
**Shell version:** v6.7 ⚠️ *(the footer renders `v9` from `09_app_bootstrap_and_home.js`, and `source/standings/data.js` declares `v6.0` — three strings, one app, unreconciled)*
**Data:** 9 rounds, verified at commit `d27ce55`
**v7 status:** screens **LOCKED 2026-07-26**. Schema **VALIDATED 2026-07-28**. No rebuild code written yet, by design.

---

## 🚨 Freshness discipline (LOCKED 2026-07-28)

On 2026-07-28 a nine-lens schema pass found **this file stale in both directions**: it said `fastLap` covered 1 of 9 rounds (complete since 07-23) and it said there was nowhere to put a sprint result (four rounds have full sprint blocks). Both claims were true when written. Nothing in the file could say which of its *other* claims had expired, and the parked handoff had queued a data job that was already done — which, executed as written, would have overwritten `{time,lap}` objects with bare strings.

**Two rules came out of it:**

1. **Every Build Order row carries a freshness stamp** — the claim, the commit it was verified at, the date. **A step whose premise cannot be restated in one verified line does not run.**
2. **A documented "known boundary" does not outrank the data sitting next to it.** Open the JSON before you believe the plan.

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
│     │     🟡 On a SPRINT weekend this lists TWO scored sessions (see below)
│     └── Driver Popup ........... overlay, CLASSIFICATIONS for this round
│           🟡 Arc visualization here (PLANNED)
│
├── #/weekend/<slug> ............... WEEKEND RACE DETAIL  route 3
│     Context: CLASSIFICATIONS (full round, all 20+ drivers)
│     THE ROUND'S RESULT DOCUMENT — "what happened, driver by driver"
│     Reached from: Weekend Center → completed session
│     ├── Results mode (default) .. 8 static panels + driver popup
│     │     🟡 Race narrative + DNF/gap detail in popup (PLANNED)
│     ├── 🟡 Sprint entry (PLANNED) . its own full treatment, see below
│     ├── 🟡 Tyre mode (FUTURE) ... COMPOUNDS + STINTS. A MODE, not a route
│     └── 🅿️ Story mode (PARKED) .. chunk set built, splice at step 17
│
└── #/standings ................... CHAMPIONSHIP STANDINGS route 4
      Context: CLASSIFICATIONS aggregated across ALL rounds by driverId + team
      ⚠️ Aggregates ON ROUTE ENTRY and caches in `12_results_store.js`.
         NEVER warmed at boot — it is the only screen that fetches every
         round file, and boot-warming makes the home grid pay for standings.
      ✅ Sprint points ARE included (total = race + sprint). Verified 2026-07-28.
```

**Center vs Weekend (the seam that was undeclared):** Weekend Center is the **status widget**; Weekend Race Detail is the **result document**. Cannot tell which owns a new thing? It belongs to the result document.

**The lenses are not peers.** Matrix and History frame finished business; **Circuits is the odd one out**, carrying the only ROUNDS data you want *before* a race. Do not force symmetry on all three.

### 🏁 Sprint weekends (RULED 2026-07-28, Michael)

**A sprint gets its own full treatment — but it must feel like part of the same race weekend, entered as a different activity.** Not a separate route (it owns no data shape nothing else owns; it lives inside the round file). Not a footnote either.

So: **the Weekend Center lists two scored sessions on a sprint weekend**, and the sprint opens its own entry in the result document with its own four-landmark arc. The Center-vs-detail boundary from Q1 was drawn against non-sprint weekends only; this is the correction.

**2026 has six sprints** — Shanghai, Miami, Montreal, Silverstone, Zandvoort, Singapore. **Four are run and all four are in the store**, top eight on `8-7-6-5-4-3-2-1`. Zandvoort and Singapore are still to come, which is the natural deadline for the arc backfill.

### Standalone (deliberately outside the router)

```
live-tracker.html — LIVE SESSION COMPANION
    Context: OpenF1 API (real-time, external). ZERO dependency on our store.
    Reached from: direct link (not in main nav)
    ✅ Adopts the theme spine
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

**Schema validated 2026-07-28** against all nine round files at commit `d27ce55`. Five of the six items that had been carried as "unvalidated" since the screen lock were **already answered by the data**: the table cut holds, cardinality holds, the four-landmark model is proven by real penalty divergence, the sprint container works, and the tiers are fine.

**The per-field state table lives with the data**, in [`f1-results/2026/README.md`](f1-results/2026/README.md), because that is where it can be re-verified. Do not duplicate it here.

### Tables

| Table | Stored as | Records | Key | Role |
|-------|-----------|---------|-----|------|
| **ROUNDS** | `data.json` (rounds array) | one per race | `slug` | Card-face summary per circuit. Cross-year, persistent. |
| **CLASSIFICATIONS** | `f1-results/2026/r<NN>-<slug>.json` | ~22 per round | `slug` + `driverId` | Per-driver race result. Time-boxed per season. A sprint round carries a second array, `sprint.classification`, in the same file. |
| **CIRCUITS** | `circuits/<slug>.json` | 1 per circuit | `slug` | Track geometry, sectors, character. Static reference. |
| **INDEX_ROUNDS** | `f1-results/2026/index_rounds.json` | 1 per round | `slug` | Season manifest: round order, the `sprint` flag, points scales, the `cuTaskId` join key. **Machine-read keys only** — prose lives in the sibling README. |
| 🟡 **REFERENCE** | `f1-results/reference.json` (proposed) | — | `key` | ONE editorial-reference file: tyre compounds **plus** the three datasets currently orphaned inside JS (`CONTINENT`, `MODERN`, `TEAM_COLORS`). See step 8. |

⚠️ **`STINTS` is NOT a table.** It was listed as one for months. It is `tyres.stints[]`, a **repeating field nested inside a CLASSIFICATIONS row** — which is precisely why tyre analysis is a mode and not a route. Calling a nested field a table is what generated half the confusion in this document.

⚠️ **The ROUNDS count is unverified.** 2026 was announced at 24 rounds, then Bahrain and Saudi Arabia were cancelled after the season began; Bahrain was later reinstated at Sepang and an October round added. Third-party sources disagree (23 vs 22). **Read `data.json` before writing a number here** — the store may still carry races that were never run.

### Relationships

```
ROUNDS ────< CLASSIFICATIONS      one round has many driver results   key: slug
ROUNDS ───── CIRCUITS             one round sits on one circuit       key: slug
ROUNDS ────< SPRINT CLASSIF.      a sprint round has a second array   key: slug
CLASSIFICATIONS >---< ROUNDS      same driverId across rounds = the season arc
                                  key: driverId (self-join across round files)
CLASSIFICATIONS ──< STINTS        nested field, not a joined table
STINTS >---- COMPOUNDS            each stint references one compound
                                  colour resolved via round-level tyreNomination
```

The `driverId` self-join is **real and populated** — it is what standings, trajectory and teammate H2H all run on.

### Compute-once law

Store raw facts, derive the rest at render. One stored correction fixes every derived view.

- **Store:** pos, grid, qualifying, fastLap, compound + laps per stint, tyreNomination, finishGap, status, points
- **Derive:** positionsGained (`grid - pos`), stop count, compound colour, stint lengths, cumulative gaps, championship totals

**🚨 The absence rule (`onRoadPos`).** Stored ONLY when it differs from `pos`. **Its absence is MEANINGFUL: missing means "same as pos," NOT "unknown."** Every consumer reads it as `onRoadPos ?? pos`. Honoured even inside sprint blocks (r04 Miami).

**🚨 The law was being violated in the direction nobody checked (fixed 2026-07-28).** `positionsGained` is named above as DERIVED, and it was **hardcoded** — `source/standings/data.js` held a 7-entry `DETAIL` map with two grid values that contradicted the store, and `cellMeta` read `det.grid` instead of `r.grid`. The app was blind to every real recovery drive in the season (Verstappen P20→P6 at Albert Park among them) while rendering a grid Leclerc never started from. Deleted; `deriveDetail()` now reads the row.

**Standing rule from that fix:** *when the store cannot answer, render nothing.* A dash is free. An invented value survives for months and reaches the user as fact.

### 🚧 Known gap: three rounds cannot draw the arc

**r03 suzuka, r04 miami, r07 catalunya carry no `grid` and no `qualifying` on any row.** The story model is `qualifying.pos → grid → onRoadPos → pos`, so a third of the season renders a stump. **This gates the arc visualization (step 13), not the port.** It is data-only work with zero rebase risk.

Qualifying completeness inside the other six is **uneven, not complete** — r02 has nine rows with `pos` and no lap times, r05 has four drivers with a Q3 time and null Q1/Q2. Ruled 2026-07-28: dig it and render the difference, with the **completeness pass assigned to Routine Ricky** as a later job.

---

## Source Modules

Sizes measured at HEAD 2026-07-26 unless noted.

### Top-level files are already thin loaders

`index.html` 7,509 · `weekend.html` **2,666** · `standings.html` 4,321 · `circuits.html` 8,818 · `live-tracker.html` 21,315 (the only fat one, staying standalone).

⚠️ **This app is not a monolith.** Four of five top-level files are thin loaders over `source/` chunk sets. v7 is a **four-loaders-to-one-router consolidation**, not a monolith-to-modular rebuild.

### Main app (`source/`)

| File | Concern | Size | |
|------|---------|------|---|
| `app-shell.js` | Header/footer/nav chrome | 3.9KB | |
| `09_app_bootstrap_and_home.js` | Router + home grid + lens filter | 26KB | 🔴 split is TWO jobs (steps 9-10) |
| `10_track_views_and_profile.js` | Circuit breakdown render | 18KB | 🔴 over |
| `11_weather_and_footer_exports.js` | Weather + export tools | 11KB | |
| `12_results_store.js` | Results fetch/cache | 2.9KB | ✅ the compute-once law working correctly — derives podium/pole/FL at runtime |
| `13_live_session_panel.js` | OpenF1 live session | 10.5KB | |
| `14_weekend_state_and_data.js` | Weekend state/schedule/replay | 11KB | |
| `15_weekend_surface_render.js` | Weekend panels + round card | 15KB | 🔴 at the line |
| `16_weekend_live_mode.js` | OpenF1 live hydration | 5.8KB | |
| `17_weekend_mount.js` | Weekend lifecycle/mount | 4.2KB | |
| `18_home_and_mobile_polish.js` | Mobile polish/table fixes | 1.5KB | |

### Sub-surfaces

- **`source/standings/`** — `panel.js` 🔴 · `panel.css` 12,665 ⚠️ · `history.js` 12,313 ⚠️ · `base.css` 11,489 · `nav.js` 6,981 · `data.js` · `matrix.js` 4,158 · `trajectory.js` 4,011
- **`source/weekend/`** — base.css, panels.css, story.css, data.js, render.js, nav.js, story.js

### Budget rule

~10-12KB target per module. **15KB = split now.** The read cap is **at least 26,175 bytes** (measured 2026-07-27, not the ~22KB long asserted).

**FOUR files are over the split line, not one:** `09`, `10`, `standings/panel.js`, `15`. Any criterion claiming "modules under budget" must cover all four.

**Standings is not a size problem** (Size Sally, 2026-07-26): `standings.html` is a 4.3KB loader, the real ~76KB lives in `source/standings/` and is fetched on demand either way because **routing does not bundle**. Verdict **HOLD** on the fold, **PLAN** the `panel.js` split for step 11.

**The data store has no size problem anywhere** (re-measured 2026-07-28): round files 4.2-7.6KB, a full season ~168KB fetched per round, never whole.

---

## Build Order

**v2, LOCKED 2026-07-28** after the schema pass. Supersedes the 07-26 ordering, which had a completed job at step 1 and no step at all for two genuinely blocking pieces of work.

**Sequencing principle:** doc and data work carries zero rebase risk and runs anytime. **Render work waits for the shell.** And per the freshness rule above, **a step whose premise cannot be restated as a verified one-liner does not run.**

| # | Step | Premise verified | Status |
|---|---|---|---|
| 0 | **Schema validation pass** | 9/9 round files + 2 consumers read at `d27ce55` · 07-28 | ✅ **DONE** — Decision Log W1 |
| 1 | **Kill the fabricated `DETAIL` map**, derive `gridDelta` from `r.grid` | two grid values contradicted the store at `d27ce55` · 07-28 | ✅ **DONE** — v6.7 bug fix, shipped outside the v7 cycle |
| 2 | **Store truth pass** — slim the boot manifest, add the field state table | manifest prose contradicted the store · 07-28 | ✅ **DONE** |
| 3 | **This document** — Build Order v2 + Data Model corrected | 07-28 | ✅ **DONE** |
| 4 | **`next-build-spec.md` correction** — strike the sprint boundary, the fastLap gap, and the theme diagnosis | same findings; file not yet touched · 07-28 | ⬜ **NEXT** |
| 5 | **`grid` + `qualifying` backfill for r03, r04, r07** | absence confirmed by reading all three · 07-28 | ⬜ **needs SOURCED data** — see the note below |
| 6 | **Finish the baseline parity capture** (routes 2-4 + Center + popup) | route 1 captured, PR #566 · 07-27 | ⬜ 🚨 gate before step 7 |
| 7 | **Register the `f1` theme join** — new neutral colour entity keeping hue-268, one `_themes.json` row across all four vectors | `applyTheme('f1')` does not resolve; ruled Q8 · 07-27 | ⬜ **blocks step 8** |
| 8 | **Shell scaffold** — template-app v5, `chrome.js`, theme spine, `:root` fallback floor | | ⬜ |
| 9 | **Extract the router from `09`** | ⚠️ own step. NOT a port — the new shell *replaces* this half | ⬜ |
| 10 | **Port the home grid** (rest of `09`) + lens control into `chrome.js`, and land the REFERENCE file (compounds + the three orphaned JS datasets) | | ⬜ |
| 11 | **Port circuit breakdown** (`10`, `11`, Weekend Center from `14`-`17`) | | ⬜ |
| 12 | **Port standings** — lazy aggregation on entry; execute the `panel.js` split | | ⬜ |
| 13 | **Port weekend race detail**, retire satellites to stubs, `VERSIONS.md` → v7 | | ⬜ |
| 14 | **Driver arc visualization** | ⚠️ gated on step 5 — three rounds cannot draw it | ⬜ |
| 15 | **Sprint full treatment** — `sprintQualifying` + sprint grid, backfill the four run rounds, two-session Weekend Center | ruled 07-28; natural deadline is Zandvoort | ⬜ |
| 16 | **Race narrative** — surface summary + `stewardNote` as visible story | | ⬜ |
| 17 | **Tier 4: `dnf` + `finishGap`** | | ⬜ |
| 18 | **Story Mode splice** into the finished route 3 | 🅿️ parked out of the v7 cycle | ⬜ |
| 19 | **Tyres Pass B** · **Remaining splits** (`10`, `15`) · **version-string reconciliation** | three strings, one app | ⬜ |

**🚨 Step 5 is the one step an agent must NOT improvise.** It needs real qualifying and grid data for 66 driver-rows from official sources. The canon rule says real, cross-checked data only — and this app has just been burned by exactly one invented dataset. **Source it or leave it absent.** Queued alongside Ricky's completeness pass.

**🅿️ Why Story Mode is parked (LOCKED 2026-07-26).** `story-mode-reference.html` is written in `weekend.html`'s exact hue-268 tokens, and step 7 moves those tokens to the spine. Splicing before means doing the token work twice; splicing during means carrying a migration inside the riskiest phase.

---

## Theme: the F1 join (RULED 2026-07-27, decoded 07-28)

**`THEMES.applyTheme('f1')` does not resolve today.** `shared/themes/f1/` is a **complete COLOR vector** — eleven team palettes — not an incomplete theme. A theme is a named binding of four vectors in `_themes.json`, and no row named `f1` exists.

**What was ruled:**

1. **Register a new `f1` join on a NEW NEUTRAL colour entity** that preserves the current hue-268 identity. The port changes structure without changing how the app looks. (Rejected: `sharp-mclaren`, and binding `f1` to one of the eleven team palettes.)
2. **Per-team theming is IN, and it is CONTEXTUAL, not a settings choice.** Open a Mercedes card and the Mercedes palette swaps in on top of the neutral `f1` base. A consequence of navigation, not a menu. The settings picker stays plumbing.

**"The F1 join is complete" now means:** one new neutral colour entity + one `_themes.json` row binding it across colour × typography × forms × spacing, with the eleven team palettes riding on top as a context-swapped local layer — the pattern `on-track` already proves.

⚠️ **Build the neutral entity from the JS, not the stylesheets.** hue-268 is baked into an **injected CSS template string** (four occurrences, plus scrim and drawer shadow). A token sweep that only reads `.css` files misses it entirely.

---

## Related Docs

| File | What it holds | Status |
|------|---------------|--------|
| `f1-results/2026/README.md` | Store schema, canon rule, **field state table** | ✅ Current, verified `d27ce55` |
| `next-build-spec.md` | v7 directive, per-step how-to, acceptance criteria | ⚠️ **Stale** — still carries the sprint boundary, the fastLap gap, and the wrong theme diagnosis. Step 4 |
| `baseline-v6.7.md` | The structural parity baseline | 🟡 Route 1 captured; routes 2-4 outstanding |
| `story-mode-handoff.md` | Story integration spec | Valid; parked to step 18. Blocker language outdated |
| `story-mode-reference.html` | Working Story Mode in weekend.html's tokens | Splice from this at step 18. ⚠️ Token-stale after step 7 |
| `schema-shift-handoff.md` | Original JSON-shape brainstorm (Jul 7) | Superseded |
| F1 Racetracks App — Decision Log (ClickUp) | Every decision + the reasoning | ✅ Current. Read before changing this plan |

---

## Architecture Rules

- **`index.html` is the shell.** Router + chrome + the default-landing constant. Nothing servable lives in it.
- **A screen earns a route only when it owns a data shape nothing else owns.** Otherwise it is a lens, a mode, or an overlay.
- **The 3 lenses are a header CONTROL on the home route, not a navigation tier.**
- **Retiring a top-level file = delete + redirect stub.** Never a raw delete.
- **Standalone is allowed when the data context is genuinely different** (live-tracker on OpenF1) — but it still adopts the theme spine.
- **Data nests inside its app.** `f1-racetracks/f1-results/<year>/` — never a loose root folder.
- **Data-only changes = no shell version bump.**
- **Mobile-first.** No overflow at 320px. Touch targets 44px. Fluid sizing.
- **Theme goes LAST.** Build on `default-theme`, apply the F1 join at the end. `var(--token)` everywhere, zero colour literals.
- **Team colors (the 20-series), sector colors, and status colors are a LOCAL identity layer.** They ride on top of any theme and are never swept into a theme vector.
- **Never write an acceptance criterion the party responsible for passing it cannot execute.** Name who checks it and with what; if the answer is a human looking at it, say so. *(2026-07-27)*
- **When the store cannot answer, render nothing.** Never a placeholder that looks like data, never a hardcoded map standing in for a fetch. *(2026-07-28, from the `DETAIL` deletion.)*
- **Every Build Order row carries a freshness stamp, and an unverifiable premise blocks its step.** *(2026-07-28.)*
- **A field is not documented until its STATE is documented** — `live` / `documented-only` / `planned`. A schema that describes a never-built field in the same voice as a real one cannot be audited. *(2026-07-28.)*
- **This file states WHAT; the Decision Log states WHY.** Keep argumentation out of here.

---

## Links

- [Launch the app](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)
- [Live Tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- [Repo folder](https://github.com/mawizorek/ClickUp_apps/tree/main/f1-racetracks)
- [VERSIONS.md (app ledger)](https://github.com/mawizorek/ClickUp_apps/blob/main/VERSIONS.md)
