# World Cup Refresh

schedule:   0 10 * * 1   # Monday 10:00 America/New_York, weekly during the tournament window
goal:       world-cup-bracket/data.json reflects the latest results/fixtures/bracket state per the app's existing schema.
target:     world-cup-bracket/data.json
report-to:  #A.I. Prompts (thread: World Cup refreshes)

## Steps
1. Read the CURRENT world-cup-bracket/data.json first to learn its exact schema. Match it precisely — do not redesign it.
2. Research the latest World Cup results, upcoming fixtures, and bracket progression the schema expects.
3. Verify against a primary/reputable source. Kickoff times in the schema's existing convention.
4. Rebuild world-cup-bracket/data.json in the same schema. Bump the schema's version/datestamp field.
5. Commit world-cup-bracket/data.json to main. Data-only — do NOT touch index.html or the engine.
6. Post the run report.

## Guardrails (STOP + flag if any is true)
- Target is anything other than world-cup-bracket/data.json.
- The current data.json schema is unclear or you'd have to invent fields → STOP, that's a build session.
- A result/fixture can't be verified → don't guess, flag it.
- Tournament is over / no upcoming fixtures → report "nothing to refresh" and make no commit.

## Report format
Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/) + what changed (matches resolved, bracket advanced) + anything unverifiable.
