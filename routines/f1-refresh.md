# F1 Refresh

goal: keep the F1 surfaces current — `f1-racetracks/data.json` (source of truth for the app) AND the ClickUp “F1 Races” list (event mirror for notifications/automations) — each in its own existing schema.
target:
  - `f1-racetracks/data.json` (primary data store)
  - ClickUp list `4026829812583044279` “F1 Races” (event mirror; whitelisted task fields only, existing tasks only)
report-to: #A.I. Prompts (thread: F1 refreshes)

## Mapping (data → ClickUp)

Each `raceResults` entry in `data.json` carries a **`cuTaskId`** — the ID of that round's ClickUp task in the F1 Races list. This is the ONLY join key. Never match tasks by circuit name or slug. If a completed round has no `cuTaskId`, or the ID doesn't resolve to a task, STOP and flag — do not guess, do not create a task.

**F1 IS NOT WORLD CUP — the mirror here is deliberately conservative.** In the World Cup list the task name/status is purely derived data, so the mirror owns it. In F1 Races the per-year result field is **human-authored and richer than `data.json`** (podium + pole + fastest lap + a multi-sentence “Notable” with battles, upgrades, conditions). ClickUp holds MORE than Git here, so the mirror must NEVER clobber it. (This exact divergence was proven on 2026-07-07: the Austrian GP result in `data.json` was wrong while the ClickUp 2026 field was right.)

Whitelisted ClickUp task fields (nothing else may be written):
- **Status** — flip to `complete` once the race has run. Safe/mechanical.
- **Current-season result field** — the custom field NAMED FOR THE SEASON YEAR (2026 = id `83baa444-d7ac-48f9-92b1-55b194c1620a`, type `text`). **FILL-IF-BLANK ONLY** (see rules). Next season, target that year's field.

Do NOT touch: task **Name** (static GP name), **due/start dates** (human-set race-weekend schedule), **Round**, **Circuit Name**, **Located**, or any prior-year field.

## Steps
1. Read the CURRENT `f1-racetracks/data.json` first to learn its exact schema. Match it precisely — do not redesign it. **Preserve every `cuTaskId`** on rebuild; it is the mirror's join key.
2. Research the latest F1 results, standings, and upcoming-race data that the schema expects.
3. Verify against a primary source (formula1.com or equivalent). Times in the schema's existing convention. **Verify results before writing either surface** — the Austria incident was a wrong winner sitting unnoticed in the store.
4. Rebuild `f1-racetracks/data.json` in the same schema. Bump the schema's version/datestamp field. Keep every `cuTaskId` intact.
5. Commit `f1-racetracks/data.json` to main. Data-only — do NOT touch index.html or the engine.
6. **Mirror to ClickUp (event layer).** For each completed round that changed this run, resolve its task via `cuTaskId` and update ONLY the whitelisted fields:
   - **Status → `complete`** for a race that has run. Idempotent (skip if already complete).
   - **Result field (fill-if-blank):** if the season-year field is EMPTY, write the result in the existing convention:
     `Winner: <Last> (<Team>) | P2: <Last> (<Team>) | P3: <Last> (<Team>)`
     newline `Pole: <Last> | Fastest Lap: <Last> | Notable: <summary>`
     (Last names only, matching the existing entries.) If the field is NOT empty, DO NOT overwrite it.
   - Never create, delete, move, or reparent tasks. Never touch dates or the GP name.
7. Post the run report (both surfaces).

## Guardrails (STOP + flag if any is true)
- Target is anything other than `f1-racetracks/data.json` or the named ClickUp F1 Races list.
- You'd write app source/engine/structure, OR create/delete/move/reparent any ClickUp task, OR touch a non-whitelisted field (name, dates, Round, prior-year fields).
- A completed round is missing its `cuTaskId`, or the ID doesn't resolve 1:1 to a task → STOP, flag (ClickUp writes are not git-revertible; never guess, never create).
- **The season-year result field is already populated AND its content materially disagrees with `data.json` (different winner/podium)** → STOP and flag the conflict. Do NOT overwrite. A human-authored field winning a disagreement usually means `data.json` is the one that's wrong (see Austria 2026). Reconcile the store, don't flatten the notes.
- A result/standing can't be verified → don't guess, flag it.
- The current data.json schema is unclear or you'd have to invent fields → STOP, that's a build session.

## Report format
Commit link + live URL (https://mawizorek.github.io/ClickUp_apps/f1-racetracks/) + ClickUp tasks touched (count + which flipped to complete / which result fields were filled) + any fields SKIPPED because already populated + any STOP-flagged conflicts + what changed in the data + anything unverifiable.
