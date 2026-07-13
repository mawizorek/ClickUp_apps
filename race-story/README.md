# Race Story Map

**Status:** v1 prototype (built-in demo race) · **Source of truth:** this repo folder

A scrubbable Formula 1 race **replay** told as a living story. Sibling to [On Track](../on-track/) (that's the live TV schedule; this is race replay + telemetry).

One timeline scrubber drives everything in sync: the position **ladder** animates, the **timing tower** updates, per-driver **telemetry** moves, the **starting-grid** cards slide as positions swap, cars drop into the **pit lane**, and **team radio** drops in like a story-time group chat.

## What it does

- **Timing tower** (left, persistent): position, team-color bar, DRS, tyre compound + stint age, gap to leader, interval, last-lap time (purple = fastest overall, green = personal best).
- **Tab card** (right): swaps between three lenses so nothing overlaps.
  - **Positions** — the step ladder: 22 drivers, P1 top to P22 bottom, laps left to right. Overtakes, pit drops, and DNFs read as story beats. 2025 winner ghost overlay (stub for the history feature).
  - **Grid** — a starting-grid formation of mini steering-wheel cards (speed, gear, rpm, DRS, delta) that **stay mounted and slide** into new positions on an overtake. A steering-wheel focus strip up top (shift lights, gear, speed, wheel settings) for the selected driver. Pit lane sidebar: cards slide in on a stop.
  - **Radio** — team radio as a group chat, timestamped to the lap, with driver vs pit-wall roles and system messages (safety car, green flag, chequered).
- **Continuous-time scrubbing** with a **Lap / Sector / Sec** resolution toggle. Default snaps to sector chunks with a tick at every lap; flip to Sec for fine scrubbing. Pause mid-overtake to freeze a battle.

## Architecture

- Single self-contained engine file, dark theme, Chivo Mono + Inter.
- **Continuous timeline** `T` in [1, TOTAL laps]. Integer-lap views (tower, radio) render on lap change; continuous views (ladder dot, grid cards, telemetry) render per frame. This split is what keeps it smooth and flash-free.
- Grid cards are **persistent DOM nodes** that only transform; the pit lane rebuilds only when the set of pitting cars changes.
- **Next:** Data Separation (engine + `data.json`), three-tier LOD, Cloudflare R2 for heavy telemetry, OpenF1 ingest. See `next-build-spec.md`.

## Related
- Sibling app: On Track (live motorsport TV schedule)
- Data: OpenF1 (positions, telemetry, team radio), Jolpica/Ergast (results)
