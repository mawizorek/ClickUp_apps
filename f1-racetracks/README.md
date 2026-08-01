# F1 Racetracks

> **The app plan.** Load this at the start of every build session.
> One file answers: what screens exist, what data feeds them, and what to do next, in order.

📋 **Decision Log:** ClickUp ▸ Brain Reference Library ▸ Formula 1 ▸ *"F1 Racetracks App — Decision Log"*. **This file states WHAT the app is; the log holds WHY.** Read the log before changing anything below.

📊 **Data store documentation:** [`f1-results/2026/README.md`](f1-results/2026/README.md) — row schema, canon rule, and the **per-field state table** (what is `live` vs `documented-only` vs `planned`, with the commit that proved it).

**Live:** https://mawizorek.github.io/ClickUp_apps/f1-racetracks/
**Shell version:** v11 (`source/09`, footer) ⚠️ *(`source/standings/data.js` still declares `v6.0` and `circuits.html` declares v6.3 — three strings, one app, still unreconciled; step 19)*
**Data:** 11 rounds raced, store verified at commit `d27ce55` (rounds 1-9 only — 10 and 11 are unstamped)
**Calendar:** **23 rounds.** 24 announced, Bahrain + Saudi cancelled mid-season 2026-03-14, Bahrain reinstated at Sepang for 2-4 October.
**v7 status:** screens **LOCKED 2026-07-26**. **Results-store schema validated 2026-07-28.** Season data layer **restructured 2026-08-01**. No shell rebuild code written yet, by design.

---

## 🚨 Freshness discipline (LOCKED 2026-07-28, extended 2026-08-01)

On 2026-07-28 a nine-lens schema pass found **this file stale in both directions**: it said `fastLap` covered 1 of 9 rounds (complete since 07-23) and it said there was nowhere to put a sprint result (four rounds have full sprint blocks). Both claims were true when written. Nothing in the file could say which of its *other* claims had expired.

**Two rules came out of it:**

1. **Every Build Order row carries a freshness stamp** — the claim, the commit it was verified at, the date. **A step whose premise cannot be restated in one verified line does not run.**
2. **A documented "known boundary" does not outrank the data sitting next to it.** Open the JSON before you believe the plan.

🔴 **A THIRD RULE, 2026-08-01, and it is the one nobody had:** *the drift runs BOTH WAYS, and nothing here ever checks the return direction.* On 08-01 this file carried the **correct** calendar fact (Bahrain reinstated at Sepang, an October round added) while **both data stores carried the wrong one** — the exact inverse of 07-28. Worse, the instruction attached to it, *"Read `data.json` before writing a number here,"* pointed at a file that **has not existed for weeks**, so an agent obeying the freshness rule literally could not verify the row. **Rule 2 tells you to distrust the doc. Add: when the doc and the data disagree, find out WHICH is stale before assuming it is the doc, and verify that the file a rule names actually exists.**

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
│     Context: WEEKENDS + CIRCUITS (joined on slug)
│     └── Lens control (header, NOT a nav tier):
│           [Matrix] default · calendar order, result summaries
│           [History] ......... race-history framing, past winners
│           [Circuits] ........ technical reference (length/laps/type)
│         Three framings of ONE dataset. No lens changes what is reachable.
│
├── #/<slug> ....................... CIRCUIT BREAKDOWN    route 2
│     Context: WEEKENDS + CIRCUITS (joined on slug)
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
│     └── 🅿️ Story mode (PARKED) .. chunk set built, splice at step 18
│
└── #/standings ................... CHAMPIONSHIP STANDINGS route 4
      Context: CLASSIFICATIONS aggregated across ALL rounds by driverId + team
      ⚠️ Aggregates ON ROUTE ENTRY and caches in `12_results_store.js`.
         NEVER warmed at boot — it is the only screen that fetches every
         round file, and boot-warming makes the home grid pay for standings.
      ✅ Sprint points ARE included (total = race + sprint). Verified 2026-07-28.
```

**Center vs Weekend (the seam that was undeclared):** Weekend Center is the **status widget**; Weekend Race Detail is the **result document**. Cannot tell which owns a new thing? It belongs to the result document.

**The lenses are not peers.** Matrix and History frame finished business; **Circuits is the odd one out**, carrying the only data you want *before* a race. Do not force symmetry on all three.

**A round with no circuit file still renders** (2026-08-01) as an upcoming card with `report:false`, disabled in both the grid and the jump drawer. The calendar is the calendar whether or not the layout data has been dug. This is how Sepang appears today.

### 🏁 Sprint weekends (RULED 2026-07-28, Michael)

**A sprint gets its own full treatment — but it must feel like part of the same race weekend, entered as a different activity.** Not a separate route (it owns no data shape nothing else owns; it lives inside the round file). Not a footnote either.

So: **the Weekend Center lists two scored sessions on a sprint weekend**, and the sprint opens its own entry in the result document with its own four-landmark arc.

**2026 has six sprints** — Shanghai, Miami, Montreal, Silverstone, Zandvoort, Singapore. **Four are run and all four are in the store**, top eight on `8-7-6-5-4-3-2-1`. Zandvoort is next, which is the natural deadline for the arc backfill.

⚠️ **The `sprint` boolean in the weekend vector is authoritative; the `sess` prose labels are not.** They disagree on five circuits (labels show sprint sessions at red-bull-ring, cota, interlagos, losail and omit them at gilles-villeneuve). The labels were inherited unverified and deliberately not rewritten — sourced or absent.

### Standalone (deliberately outside the router)

```
live-tracker.html — LIVE SESSION COMPANION
    Context: OpenF1 API (real-time, external). ZERO dependency on our store.
    Reached from: direct link (not in main nav)
    ✅ Adopts the theme spine
    ❌ Does NOT join the router — opened at a track, on a phone, on bad signal
```

### Retired at v7

| File | Fate | Condition |
|---|---|---|
| `standings.html` | → route 4 | Redirect stub to `#/standings` |
| `circuits.html` | → the [Circuits] lens | **Field-diff first** — if it renders a field the lens does not, the lens gains it before the delete. Then a stub to `#/` |
| `weekend.html` | → route 3 | Redirect stub to `#/weekend/<slug>` |

⚠️ **Retiring a top-level file is a delete PLUS a stub, never a raw delete.** These URLs are bookmarked, pasted into ClickUp tasks, and linked from the app dashboard.

### Future screens

- 🟡 **Tyre analysis** → a **mode on route 3**, not a route. STINTS are nested inside CLASSIFICATIONS.
- 🟡 **Season history** → a **route**, not a fourth lens. Multi-year is a new data shape.
- 🟡 **DRIVERS as a fourth vector** (floated 2026-08-01, Michael: *"drivers are one vector"*). Today a driver exists only as three strings repeated on every classification row (`driverId`, `driver`, `team`) with no file of their own — the same shape the circuits had before they were split out. Not scoped, not built, named here so it is not re-derived from scratch.

---

## Data Model

**RESTRUCTURED 2026-08-01 into THREE VECTORS.** Michael: *"circuits are one vector. weekends are one vector. drivers are one vector. keep things separate and derived."*

⚠️ **The version of this section that stood until 2026-08-01 named a table stored in `data.json` — a file that does not exist and had not for weeks** (`12_results_store.js` calls it *"the retired data.json"* in its own header), **and it did not list the file that was actually doing the per-year join at all.** The correct model was documented, precisely, inside `circuits/index_circuits.json`'s own `schema` field and had never been promoted out of it. Decision Log J9.

### The three vectors

| Vector | Stored as | Key | Holds | Changes when |
|---|---|---|---|---|
| **CIRCUITS** | `circuits/<slug>.json`, indexed by `circuits/index_circuits.json` (a plain slug → file map) | `slug` | Timeless track identity: geometry, sectors, corners, DRS, pit, tyre allocation, character, `tz`. | the **TARMAC** changes |
| **WEEKENDS** | `season/<year>/index_weekends.json` | `slug` (+ `cuTaskId`) | The per-year join. One row per RACE WEEKEND: which circuit, the session dates, the `sprint` flag, the ClickUp task. | the **CALENDAR** changes |
| **CLASSIFICATIONS** | `f1-results/<year>/r<NN>-<slug>.json`, manifested by `index_rounds.json` | `slug` + `driverId` | Per-driver race result. A sprint round carries a second array, `sprint.classification`, in the same file. | a race is **RUN** |
| 🟡 **REFERENCE** | `f1-results/reference.json` (proposed) | `key` | ONE editorial-reference file: tyre compounds **plus** the three datasets currently orphaned inside JS (`CONTINENT`, `MODERN`, `TEAM_COLORS`). See step 10. |
| 🟡 **DRIVERS** | not built | `driverId` | Floated 2026-08-01. See Future screens. |

**The test for which vector a field belongs to is one question: does this change when the CALENDAR changes, or only when the TARMAC changes?**

⚠️ **`STINTS` is NOT a table.** It is `tyres.stints[]`, a **repeating field nested inside a CLASSIFICATIONS row** — which is precisely why tyre analysis is a mode and not a route.

⚠️ **Three fields still leak out of the circuit files** (flagged 2026-08-01, J9 ruling 2, not yet moved): **`gp`** (a Grand Prix name is a weekend's, not a track's — Sepang hosts the *Bahrain* GP; migration is one-way and in progress, the weekend row wins), **`report`** (application state), and **`record`/`poleRef`** (time-bound; Madring's reads *"New for 2026"*).

### 🚨 Nothing time-shaped is stored (2026-08-01)

`source/08_season.js` derives all of it at boot from the session dates in the weekend vector:

| Derived | From |
|---|---|
| `round` | index position in date order |
| `status` (`done`/`active`/`pending`) | the weekend window, **in the circuit's own `tz`** |
| `date` (`"04 Oct"`) | formatted from the ISO race date |
| `current_round_slug` | first weekend whose race date ≥ today |
| `last_completed_round_slug` | last weekend whose race date < today |

**Why:** Bahrain and Saudi Arabia were cancelled on 2026-03-14, *after* the season started. F1 renumbered densely to 22; the circuits index kept the original numbering with two holes, so **every entry from Miami onward was off by two for eight months.** The only thing that kept the app working was a note telling consumers to join by slug. `current_round_slug` separately pointed at a completed round for a week.

**The `active` window (ruled J9):** from `00:00` on the FIRST session date to `23:59` on the RACE date, **in the circuit's `tz`**. A weekend flips live on Friday morning at the track, not at the viewer's midnight.

🚨 **NEVER PERSIST A DERIVED ORDINAL.** Not in a filename, not in a ClickUp task title, not in a note. Inserting one round shifts every round after it. **The stable handles are `slug` and `cuTaskId`.** *(The `r<NN>` prefix on round files stays true only because insertions land in the future while files exist only for the past — safe by construction, not by design.)*

### Relationships

```
WEEKENDS ───── CIRCUITS           one weekend sits on one circuit     key: slug
                                  (a weekend may have NO circuit file yet)
WEEKENDS ────< CLASSIFICATIONS    one round has many driver results   key: slug
WEEKENDS ────< SPRINT CLASSIF.    a sprint round has a second array   key: slug
CLASSIFICATIONS >---< WEEKENDS    same driverId across rounds = the season arc
                                  key: driverId (self-join across round files)
CLASSIFICATIONS ──< STINTS        nested field, not a joined table
STINTS >---- COMPOUNDS            each stint references one compound
```

The `driverId` self-join is **real and populated** — it is what standings, trajectory and teammate H2H all run on.

### Compute-once law

Store raw facts, derive the rest at render. One stored correction fixes every derived view.

- **Store:** the ISO session dates, pos, grid, qualifying, fastLap, compound + laps per stint, tyreNomination, finishGap, status, points
- **Derive:** round, weekend status, display dates, the round pointers, positionsGained (`grid - pos`), stop count, compound colour, stint lengths, cumulative gaps, championship totals

**🚨 The absence rule (`onRoadPos`).** Stored ONLY when it differs from `pos`. **Its absence is MEANINGFUL: missing means "same as pos," NOT "unknown."** Every consumer reads it as `onRoadPos ?? pos`.

**🚨 The law was violated in the direction nobody checked (fixed 2026-07-28).** `positionsGained` was named DERIVED and was **hardcoded** — a 7-entry `DETAIL` map with two grid values contradicting the store. The app was blind to every real recovery drive in the season (Verstappen P20→P6 at Albert Park) while rendering a grid Leclerc never started from. Deleted; `deriveDetail()` now reads the row.

**Standing rule from that fix:** *when the store cannot answer, render nothing.* A dash is free. An invented value survives for months and reaches the user as fact.

### 🚧 Known gap: three rounds cannot draw the arc

**r03 suzuka, r04 miami, r07 catalunya carry no `grid` and no `qualifying` on any row.** The story model is `qualifying.pos → grid → onRoadPos → pos`, so a third of the season renders a stump. **This gates the arc visualization (step 14), not the port.** Data-only, zero rebase risk.

Qualifying completeness inside the other six is **uneven** — r02 has nine rows with `pos` and no lap times, r05 has four drivers with a Q3 time and null Q1/Q2. Ruled 2026-07-28: dig it and render the difference, with the **completeness pass assigned to Routine Ricky** as a later job.

---

## Source Modules

Sizes measured at HEAD 2026-07-26 unless noted.

### Top-level files are already thin loaders

`index.html` 7,509 · `weekend.html` **2,666** · `standings.html` 4,321 · `circuits.html` ~9KB · `live-tracker.html` 21,315 (the only fat one, staying standalone).

⚠️ **This app is not a monolith.** v7 is a **four-loaders-to-one-router consolidation**, not a monolith-to-modular rebuild.

### Main app (`source/`)

| File | Concern | Size | |
|------|---------|------|---|
| `app-shell.js` | Header/footer/nav chrome | 3.9KB | |
| `08_season.js` | **Season derivation** — loads the weekend + circuit vectors, derives round/status/date/round-pointers | ~6KB | ✅ new 2026-08-01; loads FIRST |
| `09_app_bootstrap_and_home.js` | Router + home grid + lens filter | 26KB | 🔴 split is TWO jobs (steps 9-10) |
| `10_track_views_and_profile.js` | Circuit breakdown render | 18KB | 🔴 over |
| `11_weather_and_footer_exports.js` | Weather + export tools | 11KB | |
| `12_results_store.js` | Results fetch/cache | ~3KB | ✅ the compute-once law working correctly |
| `13_live_session_panel.js` | OpenF1 live session | 10.5KB | |
| `14_weekend_state_and_data.js` | Weekend state/schedule/replay | 11KB | ⚠️ `LIVE_CIRCUIT_ALIASES` has no `sepang` entry |
| `15_weekend_surface_render.js` | Weekend panels + round card | 15KB | 🔴 at the line |
| `16_weekend_live_mode.js` | OpenF1 live hydration | 5.8KB | |
| `17_weekend_mount.js` | Weekend lifecycle/mount | 4.2KB | |
| `18_home_and_mobile_polish.js` | Mobile polish/table fixes | 1.5KB | |

### Sub-surfaces

- **`source/standings/`** — `panel.js` 🔴 18KB · `panel.css` 12,665 ⚠️ · `history.js` 12,313 ⚠️ · `base.css` 11,489 · `nav.js` 6,981 · `data.js` · `matrix.js` 4,158 · `trajectory.js` 4,011
- **`source/weekend/`** — base.css, panels.css, story.css, data.js, render.js, nav.js, story.js

### Budget rule

~10-12KB target per module. **15KB = split now.** The read cap is **at least 26,175 bytes** (measured 2026-07-27, not the ~22KB long asserted). **FOUR files are over the split line:** `09`, `10`, `standings/panel.js`, `15`.

**The data store has no size problem anywhere:** round files 4.2-7.6KB, a full season ~168KB fetched per round, never whole.

---

## Build Order

**v2, LOCKED 2026-07-28**, with steps 4b/4c inserted 2026-08-01 per Q14.

**Sequencing principle:** doc and data work carries zero rebase risk and runs anytime. **Render work waits for the shell.** And **a step whose premise cannot be restated as a verified one-liner does not run.**

| # | Step | Premise verified | Status |
|---|---|---|---|
| 0 | **Schema validation pass** (results store) | 9/9 round files + 2 consumers read at `d27ce55` · 07-28 | ✅ **DONE** — Decision Log W1 |
| 1 | **Kill the fabricated `DETAIL` map** | two grid values contradicted the store · 07-28 | ✅ **DONE** |
| 2 | **Store truth pass** — slim the boot manifest, add the field state table | 07-28 | ✅ **DONE** |
| 3 | **This document** — Build Order v2 + Data Model | 07-28 | ✅ **DONE** |
| 4 | **`next-build-spec.md` correction** — strike the sprint boundary, the fastLap gap, the theme diagnosis | same findings; file not yet touched · 07-28 | ⬜ **NEXT** |
| **4b** | **Season vectors + derived ordering** — weekend vector, circuits index reduced to a slug map, results manifest reduced to slug+file, `08_season.js`, Sepang added | all four data files + 09/12/circuits.html read at HEAD · 08-01 | ✅ **DONE** — J7-J9 |
| **4c** | **This Data Model + the validation stamp** | the `data.json` row named a file that does not exist · 08-01 | ✅ **DONE** |
| 5 | **`grid` + `qualifying` backfill for r03, r04, r07** | absence confirmed by reading all three · 07-28 | ⬜ **needs SOURCED data** |
| 6 | **Finish the baseline parity capture** (routes 2-4 + Center + popup) | route 1 captured, PR #566 · 07-27 | ⬜ 🚨 gate before step 7 |
| 7 | **Register the `f1` theme join** — new neutral colour entity keeping hue-268 | `applyTheme('f1')` does not resolve; ruled Q8 · 07-27 | ⬜ **blocks step 8** |
| 8 | **Shell scaffold** — template-app v5, `chrome.js`, theme spine, `:root` fallback floor | | ⬜ |
| 9 | **Extract the router from `09`** | ⚠️ own step. NOT a port — the new shell *replaces* this half | ⬜ |
| 10 | **Port the home grid** + lens control into `chrome.js`, land the REFERENCE file | | ⬜ |
| 11 | **Port circuit breakdown** (`10`, `11`, Weekend Center from `14`-`17`) | | ⬜ |
| 12 | **Port standings** — lazy aggregation on entry; execute the `panel.js` split | | ⬜ |
| 13 | **Port weekend race detail**, retire satellites to stubs, `VERSIONS.md` → v7 | | ⬜ |
| 14 | **Driver arc visualization** | ⚠️ gated on step 5 | ⬜ |
| 15 | **Sprint full treatment** — `sprintQualifying` + sprint grid, backfill four rounds | ruled 07-28; deadline Zandvoort | ⬜ |
| 16 | **Race narrative** — surface summary + `stewardNote` | | ⬜ |
| 17 | **Tier 4: `dnf` + `finishGap`** | | ⬜ |
| 18 | **Story Mode splice** into the finished route 3 | 🅿️ parked out of the v7 cycle | ⬜ |
| 19 | **Tyres Pass B** · **remaining splits** (`09`, `10`, `15`) · **version-string reconciliation** | three strings, one app | ⬜ |

**Open follow-ups from 4b, named so they are not lost:**

- **Finish the `gp` migration** — read all 22 circuit files, put the verified string on each weekend row, delete `gp` from the circuit files. One-way; the weekend row already wins.
- **Fill `circuits/sepang.json`** from official sources before October (turns, laps, coordinates, sectors, corners, layout). It is deliberately minimal and `report:false` until then.
- **Add `sepang` to `LIVE_CIRCUIT_ALIASES`** in `14_weekend_state_and_data.js`.
- **Reconcile the sprint `sess` labels** against the authoritative boolean on five circuits.
- **Ricky's refresh runbook moved:** `cuTaskId` now lives on the weekend row and `current_round_slug` no longer exists. Adding a round is: write the round file, add one `{slug, file}` row to the results manifest. Felix owns aligning the runbook text.

**🚨 Step 5 is the one step an agent must NOT improvise.** 66 driver-rows from official sources, cross-checked. **Source it or leave it absent.**

---

## Theme: the F1 join (RULED 2026-07-27, decoded 07-28)

**`THEMES.applyTheme('f1')` does not resolve today.** `shared/themes/f1/` is a **complete COLOR vector** — eleven team palettes — not an incomplete theme. A theme is a named binding of four vectors in `_themes.json`, and no row named `f1` exists.

**What was ruled:**

1. **Register a new `f1` join on a NEW NEUTRAL colour entity** preserving the current hue-268 identity. The port changes structure without changing how the app looks.
2. **Per-team theming is IN, and it is CONTEXTUAL, not a settings choice.** Open a Mercedes card and the Mercedes palette swaps in on top of the neutral `f1` base.

⚠️ **Build the neutral entity from the JS, not the stylesheets.** hue-268 is baked into an **injected CSS template string** (four occurrences, plus scrim and drawer shadow). A token sweep that only reads `.css` files misses it entirely.

---

## Related Docs

| File | What it holds | Status |
|------|---------------|--------|
| `season/2026/index_weekends.json` | **The season calendar** — the weekend vector | ✅ Current, 23 rounds, 2026-08-01 |
| `f1-results/2026/README.md` | Store schema, canon rule, **field state table** | ✅ Current, verified `d27ce55` (r1-9) |
| `next-build-spec.md` | v7 directive, per-step how-to, acceptance criteria | ⚠️ **Stale** — sprint boundary, fastLap gap, wrong theme diagnosis, and now the pre-vector data layer. Step 4 |
| `baseline-v6.7.md` | The structural parity baseline | 🟡 Route 1 captured; routes 2-4 outstanding |
| `story-mode-handoff.md` | Story integration spec | Valid; parked to step 18 |
| `story-mode-reference.html` | Working Story Mode in weekend.html's tokens | Splice at step 18. ⚠️ Token-stale after step 7 |
| `schema-shift-handoff.md` | Original JSON-shape brainstorm (Jul 7) | Superseded |
| F1 Racetracks App — Decision Log (ClickUp) | Every decision + the reasoning | ✅ Current. Read before changing this plan |

---

## Architecture Rules

- **`index.html` is the shell.** Router + chrome + the default-landing constant. Nothing servable lives in it.
- **A screen earns a route only when it owns a data shape nothing else owns.**
- **The 3 lenses are a header CONTROL on the home route, not a navigation tier.**
- **Retiring a top-level file = delete + redirect stub.** Never a raw delete.
- **Data nests inside its app.** `f1-racetracks/f1-results/<year>/`, `f1-racetracks/season/<year>/` — never a loose root folder.
- **Keep the vectors separate.** A field belongs to the thing it changes with: tarmac → circuit, calendar → weekend, race → classification. *(2026-08-01, Michael.)*
- **Anything time-shaped is DERIVED, never stored** — round, status, dates, round pointers. *(2026-08-01.)*
- **Never persist a derived ordinal**, anywhere, including outside the repo. Join by `slug` or `cuTaskId`. *(2026-08-01.)*
- **Data-only changes = no shell version bump.**
- **Mobile-first.** No overflow at 320px. Touch targets 44px. Fluid sizing.
- **Theme goes LAST.** Build on `default-theme`, apply the F1 join at the end. `var(--token)` everywhere, zero colour literals.
- **Team colors (the 20-series), sector colors, and status colors are a LOCAL identity layer.**
- **Never write an acceptance criterion the party responsible for passing it cannot execute.** *(2026-07-27)*
- **When the store cannot answer, render nothing.** *(2026-07-28)*
- **Every Build Order row carries a freshness stamp, and an unverifiable premise blocks its step.** *(2026-07-28)*
- **A field is not documented until its STATE is documented** — `live` / `documented-only` / `planned`. *(2026-07-28)*
- **A rule that names a file must name a file that EXISTS.** *(2026-08-01 — this document told agents to verify a number against `data.json` for weeks after it was deleted.)*
- **This file states WHAT; the Decision Log states WHY.** Keep argumentation out of here.

---

## Links

- [Launch the app](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)
- [Live Tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- [Repo folder](https://github.com/mawizorek/ClickUp_apps/tree/main/f1-racetracks)
- [VERSIONS.md (app ledger)](https://github.com/mawizorek/ClickUp_apps/blob/main/VERSIONS.md)
