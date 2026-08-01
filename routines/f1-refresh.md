# F1 Refresh

goal: after each 2026 race weekend, the canonical JSON results store reflects the new round, and ClickUp's slim mirror is updated — WITHOUT putting finishing-order data into ClickUp.

targets:
- **DATA (canonical):** `f1-racetracks/f1-results/2026/` — one file per round + `index.json`. This is the source of truth for results.
- **MIRROR (slim):** the track task's **"Race History"** text field in ClickUp — ONE frozen year-line, resolved by `cuTaskId`.
- **STAMP:** `routines/last-run/f1.txt`.

report-to: DETAIL → the JSON commit + the touched track tasks (see Report format). ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

> `report-to:` used to read `#A.I. Prompts (thread: F1 refreshes)`. **Repointed 2026-08-01:** run records belong on the standing thread where triage can find them, not scattered across chat. Chat is a banner-pointer surface, never the record. See `routines/README.md` → Run reports.

> Follows the UNIVERSAL Data-Refresh Discipline in `routines/README.md` (including THE STAMP LAW and rule 13, complete loops). Cadence lives in `routines/schedule.md`, never here.

## What changed (schema shift, Jul 2026)

Full race data now lives ONLY in the per-round JSON store. **ClickUp no longer stores finishing order.** The old per-year result dropdown/field is RETIRED — do not write to it. The executor updates the JSON; the ClickUp write is now a single fill-if-blank year-line, nothing more.

> Prereq: the slim **"Race History"** text field must exist on the track tasks. If it isn't there yet, STOP and flag — do not recreate a per-year field or write order anywhere in ClickUp.

## Is there anything to do? (session-aware check — run this FIRST)

Read `routines/last-run/f1.txt`. **If no F1 session (Practice / Qualifying / Sprint / Race) has FINISHED since that timestamp, this is a clean no-op: report "nothing new," write nothing, and do NOT stamp.** Only proceed when a session has actually completed.

This check is why the routine survived the retirement of the scheduler untouched: the *"is there new data?"* decision has always lived here in the runbook rather than in a wake timer, so removing the timer changed nothing. Keep it that way.

⚠️ **A no-op is still worth a sentence.** Triage should report F1 as *eligible, runbook checked, nothing new* — never silently omit it, and never stamp it.

## Steps

1. Read the CURRENT `index.json` + the most recent round file in `f1-racetracks/f1-results/2026/` to learn the exact schema. Match it precisely — do NOT redesign. A schema change is a build session, not a refresh → STOP.
2. Research the weekend: full classification (P1 → last + DNFs), pole, fastest lap, and the sprint block if it was a sprint round.
3. **Verify EVERY finishing position against a primary source** (formula1.com / FIA). Do NOT trust any existing value. (Three silent errors were found pre-shift, all favoring one narrative — stay suspicious.)
4. Add the round to JSON:
   - Create `f1-racetracks/f1-results/2026/<slug>.json` in the existing round schema: `points` on every classification row; `sprint` as an optional block reusing the classification shape.
   - Add its entry to `index.json` (slug / round / name / date / cuTaskId / sprint / file).
   - Anchors: round `cuTaskId`, row `driverId` — resolve by ID, never by name.
5. ClickUp slim write, per track task resolved by its `cuTaskId`:
   - status-flip (e.g. Scheduled → Complete), date fields, and weekend notifications — as before.
   - **ONE data write only:** append this year's frozen line to the **"Race History"** text field. Format: `2026 · <Winner>, <P2>, <P3>` (podium summary, not full order).
   - **Fill-if-blank:** if a 2026 line already exists and matches, leave it; if it exists and differs, **STOP-and-flag** — never clobber. Prior years are immutable.
   - Do NOT write finishing order, per-position fields, or the retired dropdown. Full order stays in JSON only.
6. Commit the JSON to `main` — **data-only, do NOT touch engine / source / render.** Then apply the ClickUp writes.
7. **STAMP** — *only after step 6 landed.* Write `routines/last-run/f1.txt` — one line, `YYYY-MM-DD HH:MM` ET, nothing else. Only this file; never a shared log, never another routine's file. **Stamp only on an actual refresh** (a clean no-op does not stamp), and **a FAILED run does not stamp** so the routine stays overdue and self-heals. A run where the JSON landed but a ClickUp mirror write was blocked is a PARTIAL — stamp it and name the gap. *(Added 2026-07-26: this step was missing. With no scheduler the stamp is the ONLY input to the due-math — and here it is doubly load-bearing, because the session-aware check above reads it as its own input.)*
8. Post the run report: detail per the format below, plus the one-line roll-up on the standing thread.

## Guardrails (STOP + flag if any is true)

- You'd have to invent a JSON field or change the schema → STOP, build session.
- A result/standing can't be primary-source verified → don't guess, flag it.
- A `cuTaskId` or `driverId` won't resolve → STOP, never guess or create a filling object.
- The "Race History" field already has a 2026 line that differs from yours → STOP-and-flag, never overwrite.
- Any urge to write finishing order into ClickUp → that's the retired pattern. JSON only.
- The engine/source/render is what needs changing → not a refresh. The executor never touches engine/source.
- You are about to stamp a shared log file instead of `routines/last-run/f1.txt` → STOP, that shape is forbidden (see `schedule.md`).
- You are about to stamp a clean no-op → STOP. No session finished means no run happened.

## Report format

JSON commit link + live URL (https://mawizorek.github.io/ClickUp_apps/f1-racetracks/) + round added + ClickUp tracks touched (year-line appended / skipped-already-present) + anything unverifiable + **whether this run was a catch-up** (sessions that finished more than one invocation ago).
