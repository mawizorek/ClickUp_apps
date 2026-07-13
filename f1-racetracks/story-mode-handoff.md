# Weekend → Story Mode — Integration Handoff

**Status:** Design + working reference DONE. Live integration BLOCKED on the monolith (see below). Hand to a new agent to chunk + splice.
**Decided approach:** Option A — a **Results / Story** mode toggle INSIDE `weekend.html` (the Race Detail page). One page, one data load, no new lens.
**Reference build:** `f1-racetracks/story-mode-reference.html` in this repo (full working Story mode in weekend.html's exact hue-268 tokens + chrome). Splice FROM this, do not reinvent.

---

## 🛑 BLOCKER: weekend.html is a monolith with no source chunk set

`weekend.html` is a single self-contained file **larger than the ~30KB fetch cap**, and there is **no `source/weekend/` chunk set** (unlike `source/standings/`, which is chunked). The full render engine + router **cannot be read whole** through a single fetch. Per the standing repo rule in `next-build-spec.md` ("do NOT commit if source could not be read whole"), the live splice was NOT performed. Blind-editing a 30KB+ live race-detail file is how you corrupt it.

**Unblock (assigned to a new agent, per Michael):**
1. Generate the `f1-racetracks/source/weekend/` chunk set (mirror how `source/standings/` is split: base.css / panel.css / data.js / render chunks / nav.js). Base64-armored per repo convention.
2. Reassemble-verify the current weekend.html round-trips from chunks with zero diff BEFORE adding anything.
3. THEN splice Story mode (below) as new chunks and reassemble.

> Do not attempt the integration until the chunk set exists and round-trips clean.

---

## Integration spec (once chunked)

### 1. The toggle
Add a **Results / Story** segmented toggle in the race mast (`.mast-row`, right side), same `.seg`/`aria-selected` grammar already used app-wide. `Results` = the existing weekend render (podium / pole / FL / grid / qualifying tiers / sprint / classification / championship swing) UNTOUCHED. `Story` = the replay surface from the reference build.

### 2. Mechanism (from reference)
- Wrap the current weekend body in a `#results` container; add a `#story` container beside it. Toggle flips `.hidden` between them.
- `mode` state var. On leaving Story: `pause()`. On entering Story: re-run `renderLadderBase()` + dyn (SVG needs a live layout box; it measures 0 while hidden, so the reference guards with a `LB.w<20` rAF retry — keep that).
- Story internals: continuous-time `T` in [1, laps]; integer-lap views (tower, radio) render on lap change, continuous views (ladder dot, grid cards, telemetry) render per frame. This split is what keeps it flash-free.
- Grid cards are **persistent DOM nodes** that only `transform` (never rebuilt per frame). Pit lane rebuilds ONLY on pit-set signature change (kills the drag flicker). Both already handled in the reference.

### 3. Data derivation (same round file feeds both modes)
Story hydrates from the SAME `f1-results/2026/<round>.json` the Weekend render already reads. Nothing stored twice.
- **Already in the round file** (drives tower + ladder immediately): final classification, grid, qualifying, sprint, pole, fastest lap, teams. Start order + finish order alone give a usable position ladder.
- **MISSING, needs sourcing** for full fidelity:
  - **Per-lap positions** (the true ladder path, not just start→finish interpolation). Source: OpenF1 / Jolpica lap + position data.
  - **Per-second telemetry** (the wheel-key readouts: speed, gear, rpm, throttle, brake, DRS). Source: OpenF1 car_data. **HEAVY — see LOD.**
  - **Team radio** (the group-chat feed). Source: OpenF1 `team_radio` (audio + timestamp); transcribe once, cache text, tag to lap/driver.

### 4. Three LOD tiers (the scrub-resolution architecture)
Scrubber already ships Lap / Sector / Sec, snapping to sector chunks with a tick at every lap.
- **Lap** (coarse, KBs, always loaded): per-lap order, gaps, lap times, tyre/stint, pit events → lives in the round `.json` / could sit in a ClickUp note.
- **Sector** (mid): ~3 chunks/lap, default snap.
- **Second** (fine, MBs): full telemetry. ~1M points/race (~5-15MB raw, 1-3MB gz). **Does NOT go in the round json or a ClickUp note.** One object per race in **Cloudflare R2**, lazy-loaded per selected driver only.

### 5. Theme
Reference already uses weekend.html's exact hue-268 tokens (`--bg/--s1..s3/--red/--gold/--silver/--bronze/--green/--purple/--amber`, `--t-*` team colors), Chakra Petch + Inter + JetBrains Mono, 1px lines, ease `cubic-bezier(0.16,1,0.3,1)`. Reads as the same page.

---

## Futures (capture, do not build now)

- **🎎 Customizable driver steering wheels** (Michael, requested): each grid card is a mini wheel display. Let the user choose which readouts show per driver, reorder them, pick a wheel skin per team/driver. Card render is already isolated (`buildCards`/`updateGrid`), so it's a swappable layer. Needs a per-driver wheel-config object in the data model.
- **👻 Historical ghost overlays** (the original "race vs entire race history" spine): ghost line is stubbed (2025 winner). Overlay any prior-year same-circuit line, or a historical-average-winner line, from the growing results store.
- **🔊 Radio audio playback**: radio is text bubbles now; play the actual OpenF1 clip on tap, synced to the lap.

## Guardrails
- Data updates = round `.json` only, no engine bump (once chunked).
- Telemetry is R2, never inline in the round json or a note (size).
- Keep the continuous-time model + persistent grid cards + signature-guarded pit lane; those three are what make it smooth and flicker-free.
- Mobile: the reference collapses to a single column under 1080px; carry weekend.html's responsive discipline through (no horizontal overflow at 320px).