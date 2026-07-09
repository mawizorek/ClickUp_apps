# World Cup Refresh

goal: keep both World Cup surfaces current — `world-cup-bracket/data.json` (SOURCE OF TRUTH) AND the ClickUp “World Cup” list (thin event mirror for notifications/automations) — each in its own existing schema.
target:
  - `world-cup-bracket/data.json` (primary data store)
  - ClickUp list `4026855117172647364` “World Cup” (event mirror; whitelisted task fields only, existing tasks only)
report-to: #A.I. Prompts (thread: World Cup refreshes)

## READ RULE (LOCKED 2026-07-09 — global GitHub standard)

Read `data.json` via the **git blob API FIRST, always**: get the blob SHA from a `get_file_contents` directory listing on `world-cup-bracket/`, then fetch `https://api.github.com/repos/mawizorek/ClickUp_apps/git/blobs/<sha>` and Base64-decode. Branch/raw URLs and `get_file_contents` file bodies are cache-unreliable and have repeatedly served stale copies — never build a refresh on them. Re-fetch fresh before every write; never reuse a SHA/value carried over from earlier.

## FACTS-ONLY CONTRACT (LOCKED 2026-07-09)

**Ricky writes FACTS. The app DERIVES presentation.** Ricky never writes a `status` string — the app derives `upcoming`/`live`/`done` (`ft`/`aet`/`pso`) at load from the facts. This keeps the schedule real-time and makes off-contract values impossible.

Per-match FACT fields Ricky may write in `data.json` (match the existing schema exactly; never redesign it):
- `home`, `away` — team names; `null` (or absent) until known. Write real teams the moment they are known (see team-reveal below).
- `hs`, `as` — integer scores; `null` until the match is played. Presence of both = the app marks it done.
- `psoNote` — e.g. `"Egypt 4-2 pens"`, ONLY on a shootout. Its presence = the app derives `pso`.
- `aet: true` — ONLY when decided in extra time (no shootout). Its presence = the app derives `aet`.
- `winner` — `"home"`/`"away"` when decided; the app also backfills from decisive scores, but write it when known.
- `day` (YYYY-MM-DD), `dayLabel` (e.g. `"Sat Jul 11"`), `time` (ET, e.g. `"9:00 PM"` — NO offset text; the app converts to the viewer's local zone), `venue`.
- `feedsTo` — the match id this winner advances into. NEVER change the bracket wiring; only swap team/score facts.
- `cuTaskId` — the ClickUp join key (see below). PRESERVE on every rebuild.
- **NEVER write `status`.** If the current schema still carries stray `status` strings, drop them; the app ignores them and derives its own.
- Top-level `version` — bump to the refresh date.

## Mapping (data ↔ ClickUp) — cuTaskId is the ONLY join key

Each match object carries **`cuTaskId`** = the ID of its ClickUp task in the World Cup list. This is the ONLY join key. NEVER match tasks by name (names change as results land). If a match has no `cuTaskId`, or the ID doesn't resolve 1:1 to a task, STOP and flag — do not guess, do not create a task.

Current map (31 bracket matches; verified 2026-07-09 against the list):
```
 1 86aj8z594   2 86aj8z595   3 86aj8z599   4 86aj8z59b   5 86aj8z59h   6 86aj8z59d
 7 86aj8z59r   8 86aj8z59x  17 86aj8z5a1  18 86aj8z5a4  19 86aj8z5a7  20 86aj8z5ab
21 86aj8z5ae  22 86aj8z5am  23 86aj8z5ak  24 86aj8z5ap   9 86aj8z5ba  10 86aj8z5bf
11 86aj8z5bk  12 86aj8z5bm  13 86aj8z5bq  14 86aj8z5bt  15 86aj8z5bx  16 86aj8z5c0
25 86aj8z5c7  26 86aj8z5cb  27 86aj8z5cd  28 86aj8z5cf  29 86aj8z5ck  30 86aj8z5cn
31 86aj8z5cr  (Final)
32 86aj8z5cq  (3rd Place Match — SF losers, Sat Jul 18)
```

Whitelisted ClickUp task fields (nothing else may be written):
- **Name** (task title)
- **Status**
- **Due date** (with time)
- Custom fields (all type `short_text`): Home Team `7c3933ab-c91f-483e-b0fe-af759473c1ee`, Away Team `71cd20b9-e5bc-4298-88bd-154f67a7d4b3`, Hype Level `0e665e1f-48c7-434d-8ab7-e07c9f008dfc`

## Steps
1. Read the CURRENT `world-cup-bracket/data.json` via the git blob API (see READ RULE). Learn its exact schema; match it precisely. **Preserve every `cuTaskId`.**
2. Research the latest results, upcoming fixtures, and bracket progression. Verify scores/times against a primary/reputable source (FIFA, ESPN, BBC, Yahoo). Kickoff times in ET, schema's existing convention.
3. Rebuild `data.json` in the same schema, writing FACTS only (no `status`). Bump the top-level `version`/datestamp. Keep every `cuTaskId` and all `feedsTo` wiring intact.
4. Commit `data.json` via branch → PR → self-merge. Data-only — do NOT touch index.html, the source/ modules, or any engine file.
5. **Mirror to ClickUp (event layer).** For each match that changed this run, resolve its task via `cuTaskId` and update ONLY the whitelisted fields:
   - **Name:** upcoming → `Home vs Away (Round)`; completed → `Winner S-S Loser — Winner advances (Round)` (AET/PSO in parens, e.g. `Egypt 1-1 Australia (PSO 4-2) — Egypt advances (R32)`).
   - **TEAM-REVEAL RENAME (LOCKED 2026-07-09):** the moment a match's teams become known (SF/Final/3rd-place slots resolving as earlier rounds finish), rename the task from its placeholder (`Semifinal 1 (TBD vs TBD)`, `World Cup Final (TBD vs TBD)`, `3rd Place Match (TBD vs TBD)`) to `Home vs Away (Round)` AND set the Home/Away Team custom fields. Do not merely confirm the date/time on a slot whose teams just filled — reveal the teams.
   - **Status:** completed match → `complete`. Otherwise leave as-is.
   - **Due date:** kickoff date + time (ET, `-04:00` offset) when known; leave prior value if still TBD.
   - **Custom fields:** set Home/Away Team once teams are known; set/refresh Hype Level; never leave a literal `TBD` in Hype Level on a resolved match.
   Skip matches that didn't change (idempotent). NEVER create, delete, move, or reparent tasks or lists.
6. Post the run report (both surfaces).

## Guardrails (STOP + flag if any is true)
- Target is anything other than `world-cup-bracket/data.json` or the named ClickUp World Cup list.
- You'd write app source/engine/structure (index.html, JS, CSS), OR create/delete/move/reparent any ClickUp task or list.
- A match is missing its `cuTaskId`, or the ID doesn't resolve 1:1 to a task → STOP, flag (ClickUp writes are not git-revertible; never guess the mapping, never create).
- You'd write a `status` string into `data.json` (the app derives status — facts only).
- The current data.json schema is unclear or you'd have to invent fields → STOP, that's a build session.
- A result/fixture can't be verified → don't guess, flag it.
- No upcoming fixtures / past the window → report “nothing to refresh” and make no commit or ClickUp write.

## Report format
Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/) + ClickUp tasks touched (count + notable renames/status flips/team-reveals) + what changed (matches resolved, bracket advanced) + anything unverifiable.
