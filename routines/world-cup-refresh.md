# World Cup Refresh

goal: keep both World Cup surfaces current — `world-cup-bracket/data.json` (source of truth) AND the ClickUp “World Cup” list (thin event mirror for notifications/automations) — each in its own existing schema.
target:
  - `world-cup-bracket/data.json` (primary data store)
  - ClickUp list `4026855117172647364` “World Cup” (event mirror; whitelisted task fields only, existing tasks only)
report-to: #A.I. Prompts (thread: World Cup refreshes)

## Mapping (data → ClickUp)

Each match object in `data.json` carries a **`cuTaskId`** — the ID of its ClickUp task in the World Cup list. This is the ONLY join key. Never match tasks by name (names change as results land). If a match has no `cuTaskId`, or the ID doesn't resolve to a task, STOP and flag — do not guess and do not create a task.

Whitelisted ClickUp task fields (nothing else may be written):
- **Name** (task title)
- **Status**
- **Due date** (with time)
- Custom fields (all type `short_text`): Home Team `7c3933ab-c91f-483e-b0fe-af759473c1ee`, Away Team `71cd20b9-e5bc-4298-88bd-154f67a7d4b3`, Hype Level `0e665e1f-48c7-434d-8ab7-e07c9f008dfc`

## Steps
1. Read the CURRENT `world-cup-bracket/data.json` first to learn its exact schema. Match it precisely — do not redesign it. **Preserve every `cuTaskId`** on rebuild; it is the mirror's join key.
2. Research the latest World Cup results, upcoming fixtures, and bracket progression the schema expects.
3. Verify against a primary/reputable source. Kickoff times in the schema's existing convention.
4. Rebuild `world-cup-bracket/data.json` in the same schema. Bump the schema's version/datestamp field. Keep every `cuTaskId` intact.
5. Commit `world-cup-bracket/data.json` to main. Data-only — do NOT touch index.html or the engine.
6. **Mirror to ClickUp (event layer).** For each match that changed this run, resolve its task via `cuTaskId` and update ONLY the whitelisted fields:
   - **Name:** upcoming → `Home vs Away (Round)`; completed → `Winner S-S Loser — Winner advances (Round)` (AET/PSO in parens, e.g. `Egypt 1-1 Australia (PSO 4-2) — Egypt advances (R32)`).
   - **Status:** completed match → `complete`. Otherwise leave the status as-is.
   - **Due date:** kickoff date + time (ET, `-04:00` offset) when known; leave prior value if still TBD.
   - **Custom fields:** set Home Team / Away Team once teams are known; set/refresh Hype Level; never leave a literal `TBD` sitting in Hype Level on a resolved match.
   Skip matches that didn't change (idempotent). NEVER create, delete, move, or reparent tasks or lists.
7. Post the run report (both surfaces).

## Guardrails (STOP + flag if any is true)
- Target is anything other than `world-cup-bracket/data.json` or the named ClickUp World Cup list.
- You'd write app source/engine/structure (index.html, JS, CSS), OR create/delete/move/reparent any ClickUp task or list.
- A match is missing its `cuTaskId`, or the ID doesn't resolve 1:1 to a task → STOP, flag (ClickUp writes are not git-revertible; never guess the mapping, never create).
- The current data.json schema is unclear or you'd have to invent fields → STOP, that's a build session.
- A result/fixture can't be verified → don't guess, flag it.
- No upcoming fixtures / past the window → report “nothing to refresh” and make no commit or ClickUp write.

## Report format
Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/) + ClickUp tasks touched (count + notable renames/status flips) + what changed (matches resolved, bracket advanced) + anything unverifiable.
