# F1 Results Schema-Shift — Handoff Brief

> **Status:** PRE-BRAINSTORM. This is scratch intake for a NEXT session. Do NOT start writing engine code or the spec until the Brainstorm Gate (7 lenses, see Apps/Artifacts reference) has fired on clean context. This is a schema + engine change = a full build session, NOT a routine tweak.
> **Created:** 2026-07-07 by Brain, at end of a long session, at Michael's request.
> **Note:** a separate `next-build-spec.md` already exists in this folder and was intentionally left untouched (couldn't be read back this session). Reconcile with it at the start of the build; do not blindly overwrite it.

## ⚠️ DISCUSS BEFORE BUILDING (Michael, explicit)

**Do NOT open the next session by jumping straight into building.** Michael wants to TALK THROUGH the approach first — the per-season JSON shape, the migration plan, the season-history render, and the ClickUp-history decision are all things to hash out WITH him before any code or spec is written. Open with the brainstorm conversation: surface options and trade-offs, get his direction, THEN build. Building-first is the wrong move here; the discussion is the point.

## The decision already made (locked, don't re-litigate)

Michael's standing architectural call (now in the Apps/Artifacts reference, “Slim ClickUp / JSON-canonical data”):

- **Structured/historical data → per-year JSON histories in the repo.** This is the real data store, built to grow into lap times / telemetry / full detail.
- **ClickUp stays slim → events, triggers, statuses, dates, notifications, mirrors only. Never a data store.**
- The full 24-car finishing-order custom field currently in ClickUp is the anti-pattern to retire: field-per-year doesn't scale, can't be queried or rendered.

## Scope of the build (what the brainstorm should shape, then spec)

1. **Design the per-season results JSON shape.** e.g. `f1-results/2026.json` (or a `seasons` block). Each round holds FULL classification (P1 → last / DNFs), pole, fastest lap, and be explicitly designed to GROW into: per-driver times/gaps, grid vs finish, pit stops, later telemetry. Times are coming — architect for them now, don't retrofit.
2. **Keep the racetracks JSON as the persistent cross-year reference.** Two sources of truth, lensed differently (per Michael): season-results files (time-boxed, per year) + racetracks file (persistent). Both carry the `cuTaskId` anchor convention.
3. **Migrate the existing 9 completed 2026 rounds** into the new shape. Podium data exists in current `f1-racetracks/data.json`; full order will need sourcing/verifying (see the data-integrity warning below).
4. **Build the season-history render** in the F1 artifact (the “previous winners / season history” view Michael wants). This is the engine change that makes it a build session.
5. **Decide the ClickUp-history question:** either (a) collapse the per-year result fields into ONE consolidated, year-labeled “Race History” text field per track (a slim human-readable lens), or (b) drop ClickUp history entirely and let JSON + the history view be the record. Michael leaning slim — confirm in the brainstorm. Either way, the full finishing order LEAVES ClickUp.

## Data-integrity warning (IMPORTANT — carry this into the build)

While adding anchors this session, TWO 2026 results were found silently WRONG in `f1-racetracks/data.json` and corrected:
- **red-bull-ring (Austria):** had Antonelli winning; actually Russell won (pole+FL), P2 Verstappen, P3 Antonelli.
- **catalunya (Spain):** had Antonelli winning a Mercedes 1-2; actually Hamilton’s maiden Ferrari win, P2 Russell, P3 Norris, Antonelli RETIRED from P2.
Both errors erased the same storyline (Antonelli’s streak ending). Verified-clean: albert-park, shanghai, suzuka, miami, gilles-villeneuve, monaco, silverstone. **Lesson: do NOT trust the existing store as ground truth during migration — re-verify every finishing position against a primary source (formula1.com / FIA) when expanding podium → full order.**

## Current state of the surrounding system (all shipped this session)

- **ClickUp Anchor Convention** locked in Apps/Artifacts reference: Git records carry an inline `cuTaskId`; mirror resolves by ID not name; unresolved = STOP-and-flag.
- **Time-horizon truth model** locked: live lens canonical in-season, frozen archive lens canonical for closed periods; fill-if-blank + conflict-flag, never clobber.
- **F1 mirror is LIVE** in `routines/f1-refresh.md` (keyed by `cuTaskId`, status-flip + fill-if-blank result field, STOP-and-flag on conflict to protect ClickUp notes). Ricky runs it Thu–Sun. NOTE: this mirror targets the CURRENT ClickUp per-year field; when the schema shift moves data to JSON, revisit what (if anything) the mirror still writes to ClickUp.
- **`f1-racetracks/data.json`** now carries `cuTaskId` on all 9 completed rounds and has both corrections applied.
- **World Cup** is the reference implementation of the full two-surface pattern (`world-cup-bracket/data.json` + World Cup list mirror).

## First moves for the next session

1. Re-read this brief + the Apps/Artifacts reference (Anchor Convention + Slim-ClickUp principle + Data Separation Pattern).
2. Reconcile with the existing `next-build-spec.md` in this folder.
3. **Open a DISCUSSION with Michael** (per the note at the top) — run the Brainstorm Gate (all 7 lenses) on the JSON shape + migration + render + ClickUp-history decision AS A CONVERSATION, surfacing options and trade-offs, not as a prelude to immediately building.
4. ONLY AFTER that discussion resolves direction: write/overwrite `next-build-spec.md` and build.
