# On Track Refresh

goal:       on-track/data.json holds the current week + next ~4 weeks of real US motorsport TV listings, verified and honest, WITHOUT losing series coverage or omitting confirmed events for missing metadata.
target:     on-track/data.json
report-to:  (per executor's reporting standard)

> Follows the UNIVERSAL Data-Refresh Discipline in `routines/README.md` (verify-and-merge, never shrink coverage, Stream vs Unknown, confirmed-event/TBD-time, schema stability). The steps below are the On Track specifics on top of that floor.

## Steps
1. **Read the CURRENT on-track/data.json first.** Treat it as the baseline you are EXTENDING and CORRECTING — never a blank slate you rebuild from scratch.
2. Build the fresh window (current week + next ~4 weeks) for every series in the On Track registry: F1, F2, F3, NASCAR, IndyCar, MotoGP, Moto2, Moto3, IMSA, WEC, NHRA, MotoAmerica, MXGP, WSBK, British Superbike, FIM Speedway, Formula E, Supercars.
3. **Merge, don't replace.** Add newly-found events, correct times/channels on existing ones, and drop only events that have truly aged out of the window. A series represented last run must not silently vanish — if you can't find its events, KEEP the prior ones and flag the gap.
4. **Keep confirmed events even when metadata is incomplete** (per README rule 5): a confirmed date is eligible for inclusion even if platform or exact time is still open. Exact time confirmed → normal `start`/`end`. Time TBD (far-out event, e.g. MotoGP-family rounds) → include honestly with the existing schema's TBD handling; never invent a time.
5. For each event capture: series, kind, title, detail (track), start + end in US Eastern (-04:00/-05:00), platforms.
6. **Platform honesty** (per README rule 6): confirmed streaming-only source → `Stream`; event confirmed but no verified viewing source → `Unknown`. These are distinct; never invent a channel, never collapse one into the other.
7. Rebuild on-track/data.json in the exact existing schema. Bump the top-level "version" to today (YYYY-MM-DD). Do NOT change the schema (per README rule 7) — if a confirmed-date/TBD-time or `Unknown`-platform event can't be represented cleanly, STOP and flag it as a build task.
8. Commit on-track/data.json to main. Data-only — do NOT touch index.html or bump the engine version.
9. Post the run report.

## Guardrails (STOP + flag if any is true)
- Target is anything other than on-track/data.json.
- Series coverage would shrink vs the current file (keep prior events, flag).
- A confirmed event would be dropped solely because platform or exact time is missing (keep it; use `Unknown` / TBD).
- The event schema would need to change to represent something → STOP, flag as a build session.

## Report format
- Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/on-track/)
- Event count: previous → new (call out any drop and why)
- Series covered this run (so a dropped series is obvious)
- Anything marked `Stream` / `Unknown` / TBD-time / dropped / unverifiable
- Files touched this sweep (exact repo paths) — the self-audit line.
