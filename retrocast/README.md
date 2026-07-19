# Retrocast

[**\u25B6 Launch Retrocast \u2192**](https://mawizorek.github.io/ClickUp_apps/retrocast/)

> A multi-location dashboard that shows today's weather against the historical record for this exact calendar day (the departure from normal), plus an “on this day” almanac. The question it answers, honestly: *was today weird?*

**Status:** v1 render pass. Built from `template-app/` on the shared theme spine. Access-gated (see `config.json`).

---

## Infrastructure

| Piece | Detail |
|---|---|
| Hosting | GitHub Pages, `mawizorek.github.io/ClickUp_apps/retrocast/` (root `.nojekyll` load-bearing) |
| Shell | Gold-standard router: slim `index.html` + `pages/` partials, hash router, theme spine |
| Theme | Default `maw-dark-utility` (dark); full light/dark picker in the settings drawer via `shared/themes` |
| Data sources | Open-Meteo Forecast + Archive (ERA5), Wikimedia “on this day”, Nager.Date holidays — all free, keyless, CORS |
| Storage | Client cache (`localStorage`) fronting our own data table; app never hits an API directly at render |

## Architecture

Data layer is built before UI and the UI binds only to one normalized **`Day`** object.

- **`js/store.js`** — seed locations (Rochester NY, Chattanooga TN, Ogunquit ME) + active-location + the `localStorage` cache that fronts the data table. Cache is the outage fallback.
- **`js/providers.js`** — thin adapters over each source. **Two-endpoint truth: today = Forecast endpoint, history = Archive endpoint, never blurred.** Geocoding returns a list to disambiguate duplicates.
- **`js/day.js`** — assembles the `Day`: today's values, the 20–30yr normal + spread + records, the departure/anomaly, and the weather twin (closest-matching past year). `sampleYears` travels with every normal so a sparse day reports its true confidence.
- **`js/dashboard.js`** — pure render functions off a `Day`: departure hero, credibility line, this-day range band, weather twin, on-this-day ribbon. Factual voice; redundant sign+word encoding (colorblind-safe).
- **`js/app.js`** — orchestration: location switcher, Day load, shared almanac hydration (MM-DD keyed, fetched once), variable toggle, refresh, add/remove location. Per-feed loading/empty/error states.

### Local-date rule
“Today” and “this day” anchor to each **location's** local date (its timezone), not the browser's, so the weather and the almanac never drift off-by-one.

## Shared-library objects

Three new objects were added to the shared theme library (`shared/themes/_objects.json` + `OBJECT-COVERAGE.md` + `preview.objects.css`) rather than one-offing them here: **`stat_hero_departure`** (departure hero), **`viz_range_band`** (this-day range band), and **`card_ribbon`** (horizontal on-this-day ribbon). They reskin from the 4-vector spine like every other object.

## Attribution

Weather data by [Open-Meteo](https://open-meteo.com) (CC BY 4.0). “On this day” by Wikimedia (notable per Wikipedia, English-centric). Public holidays by [Nager.Date](https://date.nager.at).

## Not in v1 (Futures)

Live news headlines, shareable day-card export, streak line, side-by-side compare, the full animated ghost-trace visual, and a scheduled server-side refresh helper (v1 seeds + caches). See `next-build-spec.md` §10.
