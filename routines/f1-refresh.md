# F1 Refresh

goal: f1-racetracks/data.json reflects current F1 season standings/results/next-race state per the app's existing schema, kept current session-by-session across a race weekend (not just once a day). Secondary: flag (never edit) when the ClickUp F1 space has fallen behind.
target: f1-racetracks/data.json
report-to: (per executor's reporting standard)

> Follows the UNIVERSAL Data-Refresh Discipline in `routines/README.md` (verify-and-merge, never shrink, schema stability). The steps below add F1's session-aware behavior on top of that floor.

## Session-aware refresh (the point of this routine)

F1 weekends run multiple sessions across Fri/Sat/Sun (Practice, Qualifying, Sprint, Race). Waiting once a day feels slow. Instead:

- On each due wake, determine the **most recent F1 session that has FINISHED** (from formula1.com or equivalent) and compare its finish time to `routines/last-run/f1.txt`.
- **If a session has completed since the last run → refresh now**: pull that session's result/standings into the data file. This is what lets a Sunday feature race that ended this morning show up when Ricky fires at noon, without waiting for tomorrow.
- **If no new session has finished since last-run → nothing to do**: don't rewrite the data, don't bump the stamp, just no-op. (Idempotency: a wake with no newly-finished session is a clean skip.)
- Only stamp `last-run/f1.txt` when you actually committed a new session's data. A wake that finds nothing new leaves the stamp untouched.

## Steps
1. Read the CURRENT f1-racetracks/data.json first to learn its exact schema. Match it precisely — do not redesign it.
2. Read `routines/last-run/f1.txt`. Identify the most recent F1 session that has finished per a primary source (formula1.com or equivalent).
3. **If that session finished at/after the last-run stamp is already reflected in the data, STOP — nothing new, no-op wake.** Otherwise continue.
4. Merge the newly-finished session's result + any standings changes into f1-racetracks/data.json, in the same schema. Also correct the next-session / next-race state so the app points at what's up next. Verify all values against the primary source; never guess a result.
5. Bump the schema's version/datestamp field. Commit f1-racetracks/data.json to main. Data-only — do NOT touch index.html or the engine.
6. Stamp `routines/last-run/f1.txt` with the completion time (`YYYY-MM-DD HH:MM` ET).
7. **ClickUp-drift check (DETECT + FLAG ONLY — never edit ClickUp).** See below.
8. Post the run report, naming which session was caught (e.g. "British GP Race result added").

## ClickUp-drift check (Path A — flag, don't fix)

After a successful data refresh, do a lightweight read-only comparison between the fresh result you just committed and the ClickUp F1 space, and RAISE A FLAG if it's behind. You do NOT edit ClickUp — you only notice and point. This stays fully inside the data-only rail (your only writes remain data.json + last-run).

- **What to compare:** the session/result you just added vs. what the ClickUp F1 space reflects. Primary signal: the **F1 Races list** (list `901323758500`) task for the just-completed round still shows `active` / lacks the result, or standings in the F1 Drivers / Constructors lists are a round behind. The canonical procedure + all field IDs live in the **F1 Weekly Refresh — Brain Operations Guide** (`doc:12cwjm-67313`) — reference it to know WHAT would need updating, but do not perform those updates.
- **If drift is detected:** include a clearly-labeled **⚠️ CLICKUP DRIFT** block in your run report naming exactly what's stale and what a human/Brain session would need to update (e.g. "F1 Races → British GP task still `active`, needs race classification + status→complete; Drivers standings a round behind"). Point at the Brain Ops guide as the how.
- **If no drift:** say nothing about ClickUp (background-quiet).
- **Hard rail:** detection is read-only. You never write to any ClickUp list, task, or field. This is a nudge to a human, not an edit. (Path B — auto-firing a ClickUp-writer agent — is a future build; for now the flag reaches Michael.)

## Guardrails (STOP + flag if any is true)
- Target is anything other than f1-racetracks/data.json (your only writes are data.json + routines/last-run/f1.txt).
- The current data.json schema is unclear or you'd have to invent fields → STOP, that's a build session.
- A result/standing can't be verified → don't guess, flag it, keep the prior value.
- A session is still in progress (not finished) → do NOT enter partial/live results; wait for it to finish.
- Any step would require WRITING to ClickUp → STOP; the ClickUp-drift check is detect-and-flag only, never an edit.

## Report format
Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/f1-racetracks/) + which session was caught + what changed (result added, standings updated, next-race repointed) + a **⚠️ CLICKUP DRIFT** block if the ClickUp F1 space is behind (what's stale + pointer to the Brain Ops guide) + anything unverifiable. If a wake found no newly-finished session, no report (clean no-op).
