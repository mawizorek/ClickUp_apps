# Race Story Map — Next Build Spec

One file per app, overwritten each version cycle. Current shipped: **v1** (prototype engine, built-in demo race).

A scrubbable race REPLAY story map: timing tower + position ladder + a starting-grid formation of wheel-key cards + pit lane + team-radio group chat, all driven by one continuous timeline. Sibling to `on-track` (that's the live TV schedule; this is race replay). Reuses on-track's Data Separation pattern (engine + data feed) and series/team color-token approach.

## Next build

### 1. Data-feed wiring (Data Separation, on-track pattern)
Split the engine from the data. `index.html` renders immediately from built-in demo, then enhances from `data.json` when served (never blocks on fetch). Lock the **story-file JSON schema** as the contract ClickUp notes + Cloudflare R2 both speak.

**Three LOD tiers (the scrub-resolution architecture):**
- **Lap** (coarse, always loaded, KBs): per-lap order, gaps, intervals, lap times, sector colors, tyre/stint, DRS, pit events. Powers tower + ladder + grid. This is the light layer that lives in the repo `data.json` / ClickUp note.
- **Sector** (mid): ~3 chunks/lap. Default scrubber snap, with a tick/break at every lap line. Derived or lightly sampled.
- **Second** (fine, heavy, MBs): full telemetry (speed, throttle, brake, gear, rpm, DRS, x/y). **Does NOT go in notes.** One object per race in **Cloudflare R2**, lazy-loaded per selected driver only (f1-dash RAM discipline).

**Storage split (Size Sally forecast):** ~1M telemetry points/race (~5-15MB raw, 1-3MB gzip) => R2. Light lap/sector/radio layer (KBs) => repo `data.json` + ClickUp note. D1/KV optional later for a race index + hot cache.

### 2. OpenF1 ingest
Write the most-recent completed race into the story-file schema first, then backfill history into the same shape. Sources: OpenF1 (positions, laps, pits, car telemetry, team_radio audio) + Jolpica/Ergast for results. Transcribe radio once, cache text, tag to lap/driver.

## Futures

### 🎛️ Customizable driver steering wheels (Michael, requested v1)
Each grid card is a mini steering-wheel display. Future: let the user CUSTOMIZE the wheel per driver, choose which readouts show (speed/gear/rpm/delta/ers/brake-bias/diff/tyre-temp), reorder them, pick a wheel skin/layout per team or per driver. Needs: a per-driver wheel-config object in the data model + a render layer that reads it. Card render is already isolated (buildCards/updateGrid) so the layout is swappable. Capture as a config schema when the data feed lands.

### 👻 Historical ghost overlays
Ghost line is stubbed (2025 winner). Future: overlay any prior year's same-circuit line, or a "historical average winner" line, from the growing R2 archive. This is the "race vs entire race history" spine of the original concept.

### 🏁 Season / championship ladder
Zoom out from single-race to a season-long ladder that drills into each race. Build the single-race unit first (done), then aggregate.

### 🔊 Radio audio playback
Radio is text bubbles now. Future: play the actual OpenF1 team_radio audio clip on tap, synced to the lap.

## Known guardrails
- Data updates = commit `data.json` only, no engine bump (once Data Separation lands).
- Telemetry is R2, never inline in notes/data.json (size).
- Continuous-time model (`T` in [1,TOTAL]) drives everything: keep tower/radio on integer-lap render, ladder-dot/grid/telemetry on per-frame. Prevents flashing.
- Grid cards stay mounted (persistent DOM nodes) and transform; never rebuild per frame. Pit lane rebuilds only on pit-set signature change.
