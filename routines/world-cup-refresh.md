# World Cup Refresh

goal: world-cup-bracket/data.json reflects the latest results/fixtures/bracket state per the app's existing schema.
target: world-cup-bracket/data.json
report-to: #A.I. Prompts (thread: World Cup refreshes)

## Ownership: the bracket skeleton is PRE-SEEDED (never created at refresh time)
data.json permanently carries the FULL bracket skeleton, every round wired end to end:
R32 -> R16 -> QF (ids 25-28) -> SF (ids 29-30) -> Final (id 31). Forward-round rows that
aren't decided yet ship as TBD placeholders (home/away "TBD", null scores, status
"upcoming", correct feedsTo) and STAY in the file until results land.

The refresh FILLS existing rows in place. It does NOT create, delete, reorder, or
re-seed forward-round rows, and it never strips TBD placeholders. The engine renders
forward into these rows; if they vanish, QF+/Quarters/Semis/Final go blank (the
"No matches" bug). Treat the skeleton as structural, not refresh output.

## Steps
1. Read the CURRENT world-cup-bracket/data.json first to learn its exact schema AND confirm the full skeleton is present (R32, R16, QF 25-28, SF 29-30, Final 31). Match it precisely - do not redesign it.
2. Research the latest World Cup results, upcoming fixtures, and bracket progression the schema expects.
3. Verify against a primary/reputable source. Kickoff times in the schema's existing convention.
4. FILL existing rows in place: update results (hs/as/status/winner/psoNote), and as teams become known set home/away/venue/time + drop the tbd flag on the affected rows. Preserve every feedsTo value and keep all forward-round rows even while still TBD. Do NOT rebuild the file from scratch or regenerate the skeleton. Bump the schema's version/datestamp field.
5. Commit world-cup-bracket/data.json to main. Data-only - do NOT touch index.html or the engine.
6. Post the run report.

## Guardrails (STOP + flag if any is true)
- Target is anything other than world-cup-bracket/data.json.
- The current data.json schema is unclear or you'd have to invent fields -> STOP, that's a build session.
- The forward-round skeleton (QF 25-28, SF 29-30, Final 31) is missing or partial -> STOP and re-seed the skeleton as TBD placeholders; that's a seed/build fix, not a routine refresh.
- A result/fixture can't be verified -> don't guess, flag it.
- No upcoming fixtures / past the window -> report "nothing to refresh" and make no commit.

## Report format
Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/) + what changed (matches resolved, bracket advanced) + anything unverifiable.
