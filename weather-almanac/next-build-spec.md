# Weather Almanac — v1 Build Spec

> **Working title only.** The real name is undecided (Decision Log Q15 open). Folder slug `weather-almanac` is a working slug; rename at ship if a real name lands. This file is the SINGLE SOURCE OF TRUTH for the v1 render handoff.
>
> **STATUS: PLANNING / SPEC ONLY. No render exists yet.** A separate designer/render agent picks this up cold in its own session. Everything a cold agent needs to build v1 is in this file + the linked Decision Log + session task.
>
> **Provenance:** brainstormed 2026-07-18 with the full Council + Workshop. Decision Log: `Weather Almanac — Decision Log` (ClickUp). Session task: Agent Activity Board `Brain (Opus 4.8) · Weather Almanac … brainstorm · Jul 18`. APPS project task: `Weather Almanac — forecast-vs-history viewer app`.

---

## 1. What it is (one line)

A multi-location dashboard that shows **today's forecast against the historical record for this exact calendar day** (the anomaly / departure-from-normal), plus a per-location and global **“on this day” almanac** (events, holidays, births/deaths, weather records, time-machine). The emotional core: *“was today weird?”* answered honestly and credibly.

---

## 2. Locked decisions (from the Decision Log — do NOT re-litigate)

| # | Decision | Detail |
|---|---|---|
| Scope | **Multi-location switcher IS in v1** | Q13 override of Q8. Flip between all seeded locations at launch; each renders its full dashboard. |
| Seed locations | Current location (geolocate w/ permission) + **Rochester NY**, **Chattanooga TN**, **Ogunquit ME** | All editable / deletable / addable by the user; persisted. |
| Normal (Q2) | **BOTH** the exact-calendar-day value AND a ±window spread | Show the exact-day figure and a smoothed ±N-day band (default ±3). |
| Depth (Q3) | **20–30yr baseline as the headline “normal”** | Sample DEEPER (toward 1940) for the spread/records where data exists. Always show sample size. Never fabricate a baseline from thin data. |
| Variables (Q11) | **All of them, behind a toggle** | Temp high/low (default), precipitation, wind, humidity/feels-like, snowfall. Snow matters for Rochester. |
| Almanac (Q7) | **All layers EXCEPT live news** | Historical events, holidays/observances, notable births & deaths, weather records, “N-years-ago” time-machine. Live headlines are OUT (not free/historical). |
| Almanac scope | **Per-location AND global** | Events/holidays stored PER LOCATION (“on this day in Rochester…”) AND the current-location home dashboard also carries a GLOBAL pull of the same feed types. Both layers. |
| Weather twin (Q12) | **IN v1** | Name the single past year whose this-day most resembles today (“today is basically Jul 18, 2012”). Cheap computation off stored data. |
| Voice (Q9) | **Factual + meteorologist-serious. NO playful copy, NO personality toggle.** | Straight, credible. Records, percentiles, confidence. This is a deliberate call — do not inject wit. |
| Freshness (Q10) | **Blended** | Daily auto-pull per location + refresh-on-open + a manual refresh button, ALWAYS with a visible “as of <date>” stamp. |
| Storage (Q14) | **Repo-owned files + client cache (B+C)** | See §4. App ALWAYS reads OUR OWN stored table, never the API directly at render. |
| Name (Q15) | **OPEN** | Ship under the working title; do not block on it. |

---

## 3. Data sources (all free, no API key, CORS-ready)

1. **Open-Meteo Geocoding** — `https://geocoding-api.open-meteo.com/v1/search?name=<q>` → lat/lng + timezone + country. Used when adding a location. Returns a LIST → disambiguate duplicates (two “Springfield”s) in the add-location UI.
2. **Open-Meteo Archive (ERA5 reanalysis)** — `https://archive-api.open-meteo.com/v1/archive` — the HISTORY. Hourly/daily back to 1940. **~5-day lag** (recent days are NOT in the archive). This feeds the baseline + spread + records.
3. **Open-Meteo Forecast** — `https://api.open-meteo.com/v1/forecast` — TODAY's value + recent days the archive hasn't caught up on. **Separate endpoint AND separate model from the archive — never blur them.** Today = forecast; history = archive.
4. **Wikimedia “On this day” feed** — `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/<MM>/<DD>` → events, births, deaths, holidays. Free, no key, CORS. Keyed by month-day only (year-agnostic). NOTE: “notable per Wikipedia,” English-centric — present as “on this day in history,” not authoritative truth.
5. **Nager.Date** — `https://date.nager.at/api/v4/Holidays/<CountryCode>/<Year>` → public holidays, 200+ countries, no key, no rate limits, CORS. Country code from the location's geocode (all 3 seeds = US).

**Attribution owed (Polish Polly):** Open-Meteo is CC BY 4.0 → credit line in the footer/settings drawer. Credit Wikimedia + Nager too.

**Rate reality (Cautious Cass):** Open-Meteo free tier is fair-use (~10k calls/day, non-commercial). Fine for personal use. The stored-table architecture (§4) keeps call volume near-zero after first load. If ever shared publicly, revisit.

---

## 4. Storage architecture (the Q14 decision, locked) — read carefully

**The app NEVER reads an external API directly at render. It reads our own stored table.** Two tiers:

### Tier 1 — durable repo-owned files (the baseline + fallback)
Committed in-repo, nested UNDER this app folder (never repo root). Format by data shape (CSV-vs-JSON gate):

- **Weather baseline = TSV** (uniform grid). One file per location: `weather-almanac/data/<location-slug>/baseline.tsv`.
  - Rows = 366 calendar days (MM-DD). Columns: `mmdd, tempHigh_normal, tempLow_normal, precip_normal, wind_normal, humidity_normal, snow_normal, tempHigh_spread, tempLow_spread, …, sampleYears, recordHigh, recordHighYear, recordLow, recordLowYear, …`.
  - `sampleYears` per row is load-bearing (Domain Dara): a Feb-29 or sparse row honestly reports “based on 22 years” instead of faking confidence.
- **Almanac (events/holidays/births/deaths) = JSON** (ragged/nested). Global file: `weather-almanac/data/almanac-global.json` keyed by `MM-DD` → `{ events:[], births:[], deaths:[], holidays:[] }`. Per-location holiday/notable overlays: `weather-almanac/data/<location-slug>/almanac.json` if/when a location has local events (v1 may seed holidays-by-country here; local historical events are a fill-later slot).
- Almanac is keyed by MM-DD ALONE → the global file is fetched ONCE and shared across every location (Clever Cleo). Only the weather baseline multiplies per location.

### Tier 2 — client cache (fresh pulls on top)
- On load: read the repo file (baseline/almanac) as the durable floor.
- Live-fetch only what the repo file is missing (today's forecast value; recent days inside the 5-day archive lag; a location the repo doesn't have baked yet).
- Write fetched data into `localStorage` (or IndexedDB) keyed by `location + mmdd`. App reads from that merged table. Re-fetch only when the local date rolls over (per-location local date) or on manual refresh.
- **The cache is also the outage fallback (Breaker Beckett):** API down/rate-limited → render from cache/repo file, show the “as of” stamp so staleness is honest, never a blank ghost.

### The refresh helper (the “import step,” not baked into the app)
- A separate helper (a Routine-Ricky-style data job or a small build script) refreshes the repo TSV/JSON on a schedule. The APP never writes repo files; it only reads them + its own cache. This is Michael's “live fetch into our current data table, reference our own stored data, not hardcoded external calls” instinct. Spec the helper as `weather-almanac/routines/almanac-refresh.md` (agent-agnostic runbook) in a later pass; v1 render does NOT need it built — it can seed the 3 locations' baselines once and rely on cache for the rest.

**Data lives nested under the app (LOCKED repo rule), never at repo root. Shared/global data in the app's own `data/` dir is fine.**

---

## 5. The unified `Day` object (the core abstraction)

Everything renders off one normalized object per (location, date), assembled behind a thin provider adapter (Future Faye — so swapping/adding a data source later is one file, not a rewrite):

```
Day = {
  date,                 // the location's LOCAL date (see §7 timezone rule)
  location: { name, slug, lat, lng, tz, country },
  weather: {
    today:   { tempHigh, tempLow, precip, wind, humidity, snow },   // from FORECAST endpoint
    normal:  { …same keys… , sampleYears },                         // from ARCHIVE, exact-day
    spread:  { …same keys as ±band… },                              // from ARCHIVE, ±N-day window
    records: { recordHigh, recordHighYear, recordLow, … },
    anomaly: { …today minus normal, per variable… },
    twin:    { year, similarityScore }                              // closest-matching past year
  },
  almanac: {            // per-location + global, per §2
    events: [], births: [], deaths: [], holidays: []
  }
}
```

Provider adapter returns this shape no matter the underlying source. UI binds only to `Day`.

---

## 6. v1 screen layout (what the render agent builds)

Single home dashboard for the ACTIVE location + a location switcher. Top to bottom:

1. **Location switcher** (masthead) — flip between seeded locations; “+ add location” (geocode search w/ duplicate disambiguation); edit/delete. Persist list + active location to localStorage.
2. **Departure hero** — the big anomaly read for the active location: `+6°` warmer/cooler than the <20–30yr> normal, with a WORD (“warmer”) + sign, never color-only (Polish Polly: redundant encoding for colorblind users). Factual voice.
3. **Credibility line** (under hero) — quiet: `based on <sampleYears> years · ERA5 reanalysis · as of <date>`. This is the honesty/“as of” feature; leans into the serious voice.
4. **This-day history chart** — today's value against the historical spread/ghosts for this calendar day. Keep v1 simpler than the full “ghost trace” dream; the band + today's marker is enough. Variable toggle (temp default; precip/wind/humidity/snow selectable).
5. **Weather twin** — “Closest match: <year>” line/card.
6. **“On this day” ribbon** — horizontal cards: holidays, historical events, births/deaths, weather records, “N years ago it was…”. Per-location where available + a global strip on the current-location home. Cap giant days (Jul 4) with “show more”; design the SPARSE day gracefully (Beckett).
7. **Settings drawer** (standard chrome) — F/C units toggle, theme toggle, refresh cadence note + manual refresh button, attribution, honest data note.
8. **Footer** — standard stamp `<name> v1 · PR #<n>` (from `chrome.js`).

---

## 7. Edge cases + failure modes to handle (from Rhys/Beckett/Cass)

- **Two-endpoint truth:** today from FORECAST, history from ARCHIVE. Never cross them. Label which is which where it matters.
- **Local-date identity:** “today” and “this day” anchor to the LOCATION's local date (its tz), not the browser's. One date drives the whole `Day` object (weather + almanac), or the almanac strip goes off-by-one vs the weather.
- **Feb 29:** decide once for the whole object. Recommended: treat Feb 29 as its own row with its true (small) sampleYears; for non-leap current years, fall back to a Feb-28/Mar-1 blended normal, labeled.
- **Sparse / deep-history days:** show sampleYears; never fabricate. A 22-year baseline is fine if labeled 22 years.
- **Sparse vs giant almanac days:** design both the near-empty day and the Jul-4 wall (cap + show-more).
- **Per-channel half-load:** weather, events, holidays are 3 independent fetches → per-section loading/empty/error states, never all-or-nothing (Cass). Every fetch needs a designed loading/empty/error screen (Polish Polly), not a spinner that never resolves.
- **Geocoding duplicates:** the add-location search returns a list → make the user pick the right one.
- **Outage:** render from cache/repo, honest “as of” stamp.

---

## 8. Build conventions (inherit the repo standard — non-negotiable)

- **Start from `template-app/`.** Copy the whole folder: slim `index.html` router shell + `pages/` partials + `styles.css` (structure only; all color via theme tokens) + `chrome.js` (header/nav/settings-drawer/footer) + `config.json` (access gate, default `gated`) + `manifest.webmanifest` + `icon.svg`. Swap the `APP_*` constants + name/slug placeholders.
- **Modular multi-file, hard ~12KB per-file gate.** Never a monolith. Slim `index.html` loader + concern-separated modules/pages. Split by default, no asking.
- **Data Separation Pattern.** Engine renders; data files (§4) hold living data. A refresh helper touches data only, never engine.
- **Dark theme default** fits this tool's identity; ship the light/dark toggle in the settings drawer regardless.
- **Mobile-first AND desktop.** No horizontal overflow at 320px; ≥44px touch targets; `clamp()/min()/%`; `env(safe-area-inset-*)`. Test 320–390px.
- **Interaction-State Standard:** every control (location switcher, variable toggle, ribbon expand, add-location) needs entry + exit/reset + rest + collision designed. Tap-background-to-clear, Esc, toggle-off.
- **Pro-Polish gate:** head block (theme-color, viewport-fit, noindex, OG/Twitter w/ `og.png`, emoji favicon), PWA scaffold, reduced-motion guard, `:focus-visible`, `<noscript>`. `og.png` (1200x630, <300KB) + `icon.png` (512, <100KB) hand-dropped later.
- **README** per standard: launch button at top → Pages URL, Infrastructure table, Architecture section, etc.
- **Ship path:** branch → PR → self-merge → verify live Pages serves the new build (footer stamp readout) → report the trio (file link, commit link, Pages URL). `.nojekyll` at root is load-bearing.

---

## 9. Cold-agent render instructions (for the pickup session)

1. Read THIS file end to end. Read the linked Decision Log (all Q blocks + S1/S2/S3 synthesis) and the session task's Workshop comments for rationale.
2. Run the Brainstorm Gate / Persistent Review layer per the Apps standard if you touch architecture; the scope itself is LOCKED above — do not re-open decided items, but Red/Dev/Scope may still HARD-STOP on a genuine implementation flaw.
3. Build from `template-app/`. Respect the ~12KB file gate and the modular structure.
4. Implement the `Day` object + provider adapter FIRST (data layer before UI), multi-location from the start even though only one renders at a time.
5. Seed the 3 locations' weather baselines + the global almanac file as committed data; rely on client cache for today's forecast + recent days.
6. Do NOT block on the name — use the working title.
7. Honesty is a feature here: sample-size line, “as of” stamp, “notable per Wikipedia” framing, CC BY 4.0 attribution. Factual voice, NO injected wit.
8. Handle every edge case in §7. Design loading/empty/error for all 3 feeds.

---

## 10. Explicitly OUT of v1 (Futures)

- Live news headlines (keyed/paid, not historical) — struck.
- Shareable “day card” screenshot export — Phase 2.
- Streak line (“4th warmer-than-normal day running”) — Phase 2.
- Two-place side-by-side compare — Phase 2/3.
- The full animated “ghost trace” / filmstrip visual — simplify for v1, elevate later.
- The scheduled refresh helper as a live cron — spec later; v1 seeds + caches.
