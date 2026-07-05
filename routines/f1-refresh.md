# F1 Refresh

schedule:   0 10 * * 1   # Monday 10:00 America/New_York, weekly
goal:       f1-racetracks/data.json reflects current F1 season standings/results/next-race state per the app's existing schema.
target:     f1-racetracks/data.json
report-to:  #A.I. Prompts (thread: F1 refreshes)

## Steps
1. Read the CURRENT f1-racetracks/data.json first to learn its exact schema. Match it precisely — do not redesign it.
2. Research the latest F1 results, standings, and upcoming-race data that the schema expects.
3. Verify against a primary source (formula1.com or equivalent). Times in the schema's existing convention.
4. Rebuild f1-racetracks/data.json in the same schema. Bump the schema's version/datestamp field.
5. Commit f1-racetracks/data.json to main. Data-only — do NOT touch index.html or the engine.
6. Post the run report.

## Guardrails (STOP + flag if any is true)
- Target is anything other than f1-racetracks/data.json.
- The current data.json schema is unclear or you'd have to invent fields → STOP, that's a build session.
- A result/standing can't be verified → don't guess, flag it.

## Report format
Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/f1-racetracks/) + what changed (round added, standings updated) + anything unverifiable.
