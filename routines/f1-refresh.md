# F1 Refresh

goal: after each 2026 race weekend, the canonical JSON results store reflects the new round, ClickUp's slim mirror is updated, and every derived pointer is repointed — WITHOUT putting finishing-order data into ClickUp.

targets:
- **DATA (canonical):** `f1-racetracks/f1-results/2026/` — one file per round (`r<NN>-<slug>.json`) + `index_rounds.json`. This is the source of truth for results AND for each round's race story.
- **CALENDAR (canonical):** `f1-racetracks/season/2026/index_weekends.json` — the season's race weekends. Round numbers are DERIVED from it (date order), never stored in it.
- **MIRROR (slim):** the track task's **"Race History"** text field in ClickUp — ONE frozen year-line, resolved by `cuTaskId`. Plus the derived `Round` number field and any `(Round N)` text in the task description, both repointed from the calendar.
- **STAMP:** `routines/last-run/f1.txt`.

report-to: DETAIL → the JSON commit + the touched track tasks (see Report format). ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

> `report-to:` used to read `#A.I. Prompts (thread: F1 refreshes)`. **Repointed 2026-08-01:** run records belong on the standing thread where triage can find them, not scattered across chat. Chat is a banner-pointer surface, never the record. See `routines/README.md` → Run reports.

> Follows the UNIVERSAL Data-Refresh Discipline in `routines/README.md` (including THE STAMP LAW and rule 13, complete loops). Cadence lives in `routines/schedule.md`, never here.

## 🔁 Repointing is maintenance, not a decision (Michael, 2026-10-03)

> *"All the fixes, edits, and updates you need to repoint things should be part of the repo hook, not a ClickUp formula. You don't need to ask or point it out — just fix it and make it normal."*

Any value that is a FUNCTION of a canonical file (a round number, a `cuTaskId` back-fill, a `(Round N)` line in a task description, a stale filename in this runbook) is repointed by the executor on every run, silently, as routine upkeep. **Do not ask. Do not propose a ClickUp formula or automation. Do not raise it as a finding.** Report it as one line in the run report (`repointed: N tasks`) and move on. The only STOP is a value with two canonical claimants that disagree.

## What changed (schema shift, Jul 2026)

Full race data now lives ONLY in the per-round JSON store. **ClickUp no longer stores finishing order.** The old per-year result dropdown/field is RETIRED — do not write to it. The executor updates the JSON; the ClickUp results write is a single fill-if-blank year-line, nothing more.

> Prereq: the slim **"Race History"** text field must exist on the track tasks. If it isn't there yet, STOP and flag — do not recreate a per-year field or write order anywhere in ClickUp.

## Step 0 — Calendar repoint (EVERY invocation, including a no-op)

Runs before the session-aware check, because a calendar change (an inserted, cancelled or moved race) is not a session and would otherwise never trigger anything. It is cheap: one file read, one list query.

1. Read `season/2026/index_weekends.json`. Sort `weekends[]` by the date of each row's FIRST session; **derived round = index + 1.**
2. **Missing task:** any row with no `cuTaskId` → create its task in the ClickUp **F1 Races** list (`4026829812583044279`) in the house format (circuit header · Location/Length/Turns/Race Distance · 2026 Race Date `(Round N)` · History · Notable Races · Last 5 Winners · Recommended race; `Circuit Name` + `Located` fields). Research-first: web-verify every fact, sources at the foot. Then write the new `cuTaskId` back onto the row (data-only PR, self-merge). Precedent: sepang, 2026-10-02.
3. **Round mirror:** for every row, resolve its task by `cuTaskId` and set the `Round` number field to the derived round where it differs. In the same write, repoint the description's `(Round N)` text (`find_replace`, never a full description rewrite). Abu Dhabi's line reads `(Round N, Season Finale)`: keep the suffix.
4. **Orphans:** a race task in F1 Races with no calendar row (cancelled round) → clear its `Round` field and report it. Never delete or close it.
5. A repoint alone does NOT stamp. It is not a refresh.

⚠️ The ClickUp `Round` field is a MIRROR of a derived value. It exists for ClickUp views and sorting; nothing reads it as truth. **Never read it back as authoritative — derive from the calendar.** Why this step exists: on 2026-08-01 sepang was inserted between baku and marina-bay and seven ClickUp Round values sat one off for two months because the repoint was nobody's step. First run of this step: 2026-10-03, 8 tasks repointed.

## Is there anything to do? (session-aware check — run this after Step 0)

Read `routines/last-run/f1.txt`. **If no F1 session (Practice / Qualifying / Sprint / Race) has FINISHED since that timestamp, this is a clean no-op: report "nothing new," write nothing beyond Step 0, and do NOT stamp.** Only proceed when a session has actually completed.

This check is why the routine survived the retirement of the scheduler untouched: the *"is there new data?"* decision has always lived here in the runbook rather than in a wake timer, so removing the timer changed nothing. Keep it that way.

⚠️ **A no-op is still worth a sentence.** Triage should report F1 as *eligible, runbook checked, nothing new* — never silently omit it, and never stamp it.

## Steps

1. Read the CURRENT `index_rounds.json` + the most recent round file in `f1-racetracks/f1-results/2026/` to learn the exact schema. Match it precisely — do NOT redesign. A schema change is a build session, not a refresh → STOP.
2. Research the weekend: full classification (P1 → last + DNFs), pole, fastest lap, the sprint block if it was a sprint round, **and the race story**: every retirement's cause, Safety Cars / VSCs / red flags, penalties, the big recoveries and drops. Read at least two full race reports, not just a results table.
3. **Verify EVERY finishing position against a primary source** (formula1.com / FIA). Do NOT trust any existing value. (Three silent errors were found pre-shift, all favoring one narrative — stay suspicious. The 2026-10-03 story pass found three more, on r06-r08.)
4. Add the round to JSON:
   - Create `f1-racetracks/f1-results/2026/r<NN>-<slug>.json` in the existing round schema: `points` on every classification row; `sprint` as an optional block reusing the classification shape.
   - **Write the race story per `f1-racetracks/f1-results/2026/README.md` → Race story standard.** Round `summary` + a `stewardNote` on every row the standard requires (every non-finisher with its cause word, the podium, every penalty, every ±5-place mover) + the `sources_<date>` provenance key. **A round with a bare DNF row is an incomplete refresh**, not a style choice.
   - Add its entry to `index_rounds.json` (slug / round / name / date / cuTaskId / sprint / file).
   - Anchors: round `cuTaskId`, row `driverId` — resolve by ID, never by name.
5. ClickUp slim write, per track task resolved by its `cuTaskId`:
   - status-flip (e.g. upcoming → complete), date fields, and weekend notifications — as before.
   - **ONE results write only:** append this year's frozen line to the **"Race History"** text field. Format: `2026 · <Winner>, <P2>, <P3>` (podium summary, not full order).
   - **Fill-if-blank:** if a 2026 line already exists and matches, leave it; if it exists and differs, **STOP-and-flag** — never clobber. Prior years are immutable.
   - Do NOT write finishing order, per-position fields, or the retired dropdown. Full order and the race story stay in JSON only.
6. Commit the JSON (branch → PR → self-merge) — **data-only, do NOT touch engine / source / render.** Then apply the ClickUp writes.
7. **STAMP** — *only after step 6 landed.* Write `routines/last-run/f1.txt` — one line, `YYYY-MM-DD HH:MM` ET, nothing else. Only this file; never a shared log, never another routine's file. **Stamp only on an actual refresh** (a clean no-op does not stamp), and **a FAILED run does not stamp** so the routine stays overdue and self-heals. A run where the JSON landed but a ClickUp mirror write was blocked is a PARTIAL — stamp it and name the gap. *(Added 2026-07-26: this step was missing. With no scheduler the stamp is the ONLY input to the due-math — and here it is doubly load-bearing, because the session-aware check above reads it as its own input.)*
8. Post the run report: detail per the format below, plus the one-line roll-up on the standing thread.

## Guardrails (STOP + flag if any is true)

- You'd have to invent a JSON field or change the schema → STOP, build session.
- A result/standing can't be primary-source verified → don't guess, flag it.
- A race-story fact (a retirement cause, a penalty) can't be sourced → use `Retired.` / leave that note absent and list it as unsourced. Never fill it from inference.
- A `cuTaskId` or `driverId` won't resolve → STOP, never guess or create a filling object. *(Exception: Step 0.2, a calendar row with NO `cuTaskId` at all, is a missing task and gets created.)*
- The "Race History" field already has a 2026 line that differs from yours → STOP-and-flag, never overwrite.
- Any urge to write finishing order into ClickUp → that's the retired pattern. JSON only.
- The engine/source/render is what needs changing → not a refresh. The executor never touches engine/source.
- You are about to stamp a shared log file instead of `routines/last-run/f1.txt` → STOP, that shape is forbidden (see `schedule.md`).
- You are about to stamp a clean no-op → STOP. No session finished means no run happened.
- You are about to ASK Michael whether to repoint a derived value, or suggest a ClickUp formula for it → don't. Step 0 does it.

## Report format

JSON commit link + live URL (https://mawizorek.github.io/ClickUp_apps/f1-racetracks/) + round added + race-story coverage (rows noted / rows the standard required / unsourced) + ClickUp tracks touched (year-line appended / skipped-already-present) + `repointed: N tasks` from Step 0 + anything unverifiable + **whether this run was a catch-up** (sessions that finished more than one invocation ago).
