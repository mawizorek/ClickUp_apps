# On Track Refresh

goal:       on-track/data.json holds the current week + next ~4 weeks of real US motorsport TV listings, verified and honest, WITHOUT losing series coverage that was already there.
target:     on-track/data.json
report-to:  #A.I. Prompts (thread: On Track refreshes)

## Steps
1. **Read the CURRENT on-track/data.json first.** Treat it as the baseline you are EXTENDING and CORRECTING — never a blank slate you rebuild from scratch.
2. Build the fresh window (current week + next ~4 weeks) for every series in the On Track registry: F1, F2, F3, NASCAR, IndyCar, MotoGP, Moto2, Moto3, IMSA, WEC, NHRA, MotoAmerica, MXGP, WSBK, British Superbike, FIM Speedway, Formula E, Supercars.
3. **Merge, don't replace.** Add newly-found events, correct times/channels on existing ones, and drop only events that have truly aged out of the window. A series that was represented last run must not silently vanish this run — if you can't find its events, KEEP the prior ones and flag the gap in the report rather than deleting coverage.
4. For each event capture: series, kind, title, detail (track), start + end in US Eastern with -04:00/-05:00 offset, platforms.
5. Verify each start time in US Eastern and confirm the US channel/streamer from a primary/reputable source. If a series has no confirmed US TV, set its platform to "Stream" — never invent a channel.
6. Rebuild on-track/data.json in the exact existing schema. Bump the top-level "version" to today (YYYY-MM-DD).
7. Commit on-track/data.json to main. Data-only — do NOT touch index.html or bump the engine version.
8. Post the run report.

## Guardrails (STOP + flag if any is true)
- Target is anything other than on-track/data.json.
- A start time or channel can't be verified from a real source (mark "Stream" / keep the prior value, don't guess).
- **Series coverage would shrink vs the current file** — keep the prior events and flag, never silently drop a series.
- The event schema would need to change (new field) → that's an engine change, STOP and flag for a build session.

## Report format
- Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/on-track/)
- Event count: previous → new (call out any drop and why)
- Series covered this run (so a dropped series is obvious at a glance)
- Anything marked "Stream" / dropped / unverifiable
- **Files touched this sweep** (exact repo paths) — the self-audit line.
