# On Track Refresh

schedule:   0 9 * * 4   # Thursday 09:00 America/New_York, weekly
goal:       on-track/data.json holds the current week + next ~4 weeks of real US motorsport TV listings, verified and honest.
target:     on-track/data.json
report-to:  #A.I. Prompts (thread: On Track refreshes)

## Steps
1. Research current + next ~4 weeks of US motorsport TV listings for every series in the On Track registry: F1, F2, F3, NASCAR, IndyCar, MotoGP, Moto2, Moto3, IMSA, WEC, NHRA, MotoAmerica, MXGP, WSBK, British Superbike, FIM Speedway, Formula E, Supercars.
2. For each event capture: series, kind (Practice/Qualifying/Sprint/Race/etc), title, detail (track), start + end in US Eastern with -04:00/-05:00 offset, and platforms.
3. Verify each start time in US Eastern and confirm the US channel or streamer from a primary/reputable source.
4. If a series has no confirmed US TV, set its platform to "Stream" — never invent a channel.
5. Rebuild on-track/data.json using the exact existing schema. Bump the top-level "version" to today (YYYY-MM-DD).
6. Commit on-track/data.json to main. Data-only — do NOT touch index.html or bump the engine version.
7. Post the run report.

## Guardrails (STOP + flag if any is true)
- Target is anything other than on-track/data.json.
- A start time or channel can't be verified from a real source (drop or mark "Stream", don't guess).
- The event schema would need to change (new field) → that's an engine change, STOP and flag for a build session.

## Report format
Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/on-track/) + event count (new total) + any events dropped/flagged for unverifiable data.
