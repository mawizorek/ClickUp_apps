# GCal Reconcile — ClickUp ▸ Google calendar reconciliation

> **PROPOSE-ONLY. This hook NEVER writes to Google Calendar.** Phase 1 is manual-fire and
> report-only against the calendars; the only ClickUp write it may make is the `GCal STATUS`
> flip-back, and only on Michael's explicit go-ahead per run.

**Status:** v1, born 2026-08-11, authored live during a ride-along on Michael's own manual
reconciliation pass. Steward: **Mainstage Milo** (URITP calendar is house context, and house
context is his). The TOOL is ownerless in the Doc-Rot-Sweep sense — any agent may fire a one-off
pass with no persona seated. A **formal, scoped, reported full-space pass IS an audit and seizes
to Audit Anna.**

## Invocation + Trigger

- `/gcal-reconcile` · `/cal-reconcile` · `/reconcile-calendar`
- Scoped forms: `/gcal-reconcile <calendar-name>` · `/gcal-reconcile <list>` · `/gcal-reconcile --window <n>d`
- Plain language: "reconcile the calendar," "what's out of sync with Google," "what needs pushing
  to the calendar," "check the production calendar against ClickUp"
- ⚠️ **Does NOT fire on:** "put this on the calendar" (that is a single publish, do it by hand),
  or any bare mention of a calendar in production talk.

---

## What already exists — DO NOT REBUILD IT

🔴 **A live ClickUp automation already detects ClickUp-side drift.** Michael's own description,
2026-08-11, and it is TESTIMONY not verified config: *"when i edit start or due date and the cal
status is not 'n/a' it flips it to OUTDATED."* A second automation defaults new tasks to `NEW`.

⚠️ **NO AGENT IN THIS FLEET CAN READ CLICKUP AUTOMATIONS.** There is no tool that lists or
inspects them. Everything above is Michael's account of his own recipe. **Never state an
automation's trigger conditions as verified.** If a run depends on the exact conditions (does it
fire on `CONFIRMING`? on a duration-only edit? on an automation-driven date change?), ask him to
read the recipe out. Unknown is an answer.

**Consequence for this hook: ClickUp-side drift detection is DONE. This hook exists for the three
things the automation structurally cannot do** — see Passes C, D and E.

---

## The field model (URITP PRODUCTIONS, space `901313768203`)

`GCal STATUS` (dropdown, space-scoped) is the reconciliation lifecycle. It is BOTH a queue and a
stamp depending on the value:

| Value | Means | Role |
|---|---|---|
| `NEW` | never published; may or may not be scheduled yet | QUEUE |
| `CONFIRMING` | published, but the underlying plan is not settled | QUEUE (soft) |
| `CURRENT` | published and believed accurate | STAMP |
| `OUTDATED` | ClickUp moved under a published event | QUEUE |
| `CLOSED (N/A)` | **will never be a calendar event** | TERMINAL |

🔴 **THE N/A TRAP — the single most damaging mistake available on this surface.** The drift
automation **excludes `N/A`**. So the moment a row is marked `N/A`, later date edits flip nothing
and it goes silent **permanently**.

- 🚫 **NEVER infer `N/A` from "has no dates."** A dateless row is very often a real future event
  that is simply not scheduled yet (`SND Hang`, `LX Strike`, `Production Photos` were all live
  examples on 2026-08-11). **`NEW` is the correct parking state for those** — it is the waiting
  room, and it stays instrumented.
- ✅ **The `N/A` test is about KIND, never about SCHEDULING:** *will this object EVER be a calendar
  event?* Paperwork, contact sheets, artifacts and tracking rows are `N/A`. An unscheduled event
  is not.
- **`N/A` means "never publishes." `NEW` means "not yet."** Collapsing those two is how an event
  disappears.

**Other fields, so nobody re-derives them:**

- `Calendar COLOR` — 🚫 **NOT routing.** It is PDF export styling for the FileMaker production
  calendar render (Michael, 2026-08-11). Colour questions route to **FMP Fiona**, not here.
  ⚠️ That render carries a live `RGB($R;$G;$R)` bug — blue takes red's value.
- `Special Calendar` (labels: `SND Lab` · `LX Lab` · `RUN CREW`) — lab/crew tagging, not a
  destination.
- `🌐 PUBLIC` (checkbox) — publish flag.
- `BASELINE_start_date` / `BASELINE_due_date` / `BASELINE_duration` / `BASELINE_status`,
  plus `Event Begins` / `Event Ends` — the frozen-mirror family. Same species as `BEGIN`/`END`:
  a deliberate hard copy that does NOT move when the native date moves. **Useful as a second
  opinion on what a row USED to say.**

---

## Routing: home list → target Google calendar

**Michael's rule, 2026-08-11: the destination is derivable from HOME LIST.** Multi-calendar
publication is RARE; the canonical exception is One Acts **performances**, which land on both the
OA calendar and the Production calendar. Default assumption: **one row, one calendar, and mostly
Production.**

| Home list | Target calendar | Confidence |
|---|---|---|
| `Production Calendar` · `Production Cal (BL)` · `Prod Cal (TIME)` | URITP Production | HIGH |
| `Rehearsals (KL)` · `Rehearsals (TIME)` · `[BL] Rehearsals` | URITP Rehearsals | HIGH |
| `Events (OA)` · `Other Events (OA)` · `One Acts 2026` | OA Play Festival (+ Production for performances) | HIGH |
| `SPAC EVENTS` | SPAC Use Calendar | MED |
| `Recurring Academic Events` · `[123] Course Schedule` | URITP Classes | MED |
| `DANCE Dept shows` · `Other Events (KF)` | URITP Other Events | LOW |
| **`TRIPS`** | **a travel calendar this fleet CANNOT SEE** | 🔴 blocked |
| `Prod Cal & Reh (TIM-D)` | **splits by KIND** — one list holds both cal and rehearsal rows | 🔴 unresolved |
| `Info Sheet (BL)` · `Paperwork (<SHOW>)` | not a calendar at all | — |

🔴 **THE TRAVEL BLIND SPOT — declare it on every run, never paper over it.** A travel calendar
exists (Michael, 2026-08-11) and is **not reachable from either connected Google account.** Force
resolution by name failed on `URITP Travel` · `Travel` · `URITP TRIPS` · `Designer Travel`,
including the direct-ID path that finds unsubscribed calendars. Most likely home is Michael's
`rochester.edu` account, which is not a connected credential — **candidate, not a finding.**

⚠️ **`TRIPS` was 25 of 63 actionable rows (40%) on the day this hook was written.** A run that
reports clean while silently skipping the biggest slice of the queue is the exact failure this
fleet keeps re-learning (a check reading an empty list passes everything). **TRIPS rows are
reported as `UNVERIFIABLE`, with the reason, and they are counted separately from clean.**

⚠️ **`26-27 PRODUCTION CALENDAR` is a SECOND production calendar** with no list obviously pointing
at it. Do not route to it on a guess.

### Multi-home rows

Multi-home is the SAME OBJECT in several lists, so **one `GCal STATUS` covers what may be several
publications.** Live examples reach six lists (`Fall Break`, `Thanksgiving Recess`). A row that is
current on one calendar and stale on another **has no way to say so** — the status is an attribute
of the PUBLICATION and a multi-homed row has more than one.

🚫 **Do not resolve this by guessing a precedence.** Report multi-homed rows as `AMBIGUOUS ROUTE`
with all candidate lists named. It is a schema gap, and naming it is the correct output.

---

## ⚠️ Normalization rules — apply BEFORE comparing anything

**1 · ALL-DAY EVENTS COME BACK SHIFTED. This will fake drift on every one of them.**

Google all-day events return through the agent read path as **8:00pm the previous day → 8:00pm the
end day** (UTC midnight rendered at EDT). A one-day all-day event on Aug 17 reads
`Sun 08-16 8:00pm → Mon 08-17 8:00pm`.

- **Detection:** a span whose start and end both land exactly on UTC midnight.
- **The real date is the END side's calendar date.**
- 🚫 **Never key on the literal string "8:00pm"** — it becomes 7:00pm in EST. Key on the
  UTC-midnight boundary.

**2 · AN AGENT DATE-WRITE IS INDISTINGUISHABLE FROM A HUMAN ONE.**

The drift automation cannot tell who moved a date. **Any batch date correction against `CURRENT`
rows manufactures reconciliation work as a side effect** — a ten-row date cleanup becomes ten
Google events Michael hand-edits. **Before any batch date write: read the rows' `GCal STATUS`
first and state how many `CURRENT` rows the edit will knock to `OUTDATED`.** That number is the
real price of the cleanup and it is a decision, not a surprise.

**3 · SUBTASKS AND CLOSED TASKS ARE IN SCOPE.** ClickUp query defaults exclude both. Rehearsal
rows in particular live as subtasks under a parent. **Every comparison query must carry
`is_subtask IN (true, false) AND is_closed IN (true, false)`** or the pass under-reports and looks
clean. This was caught live on the first pass.

---

## The passes

Run in order. **A, B and C are cheap. D is the point. Stop at a pass boundary, never mid-pass.**

### Pass A — the publish queue (ClickUp only, no calendar read)

Group every `NEW` · `OUTDATED` · `CONFIRMING` row by predicted target calendar. Report counts per
calendar plus the per-row old→new values. **This is the work order Michael executes from** — it
turns hunting into typing. No Google read required, so it is always available even on a
blocked/unverifiable calendar.

### Pass B — collapse candidates (proposal only)

Rows sharing **production + identical dates + same occasion** are usually ONE Google event. Michael
already does this by hand for designer trips: `[TS] SITE Visit` served both the Director trip and
the Scenic trip on 2026-08-13.

- Propose ONE keeper (`CURRENT`) and mark the siblings `N/A`.
- ✅ Safe against the N/A trap **specifically because** the surviving row still trips the drift
  automation when dates move.
- ⚠️ **A collapse is invisible once made** — the N/A'd sibling stops reporting. **Propose, name the
  keeper explicitly, never automate.**

### Pass C — verify the STAMP (this is what the automation cannot do)

For rows at `CURRENT`, read the target calendar and compare title, start, end. The automation only
watches ClickUp edits, so **a `CURRENT` row whose Google event was edited or deleted on the Google
side reports clean forever.** Verdicts: `VERIFIED` · `DRIFTED (field, both values)` ·
`MISSING ON GOOGLE` · `UNVERIFIABLE (reason)`.

### Pass D — 🎯 ORPHAN DETECTION (the reason this hook exists)

**Every Google event in the window with no ClickUp row behind it.** Three showed up in a single
two-week sample on the first run: `[TS] Site Visit - Time in SPAC`, `[TS] Stage Management
meeting`, `[BC] Site Visit`.

🔴 **Drift runs in two directions and only one is instrumented.** An orphan is an event the program
is actually running with no task, no owner, no paperwork and no place in any report. **That is a
strictly worse failure than a stale stamp**, and nothing in the workspace looks for it.

Matching ladder, in order, stop at first confident hit:

1. **Production short code in the title** (`[BL]` · `[TS]` · `[OA]` · `[KL]` · `[TIME]` · `[TIM-D]`)
   narrowed by date. Codes are FIXED VOCABULARY — never invent one.
2. **Exact/near title match** on any row in the window, any list, subtasks and closed included.
3. **Date + occasion match** (a site visit on the same day as a site-visit row).
4. **UNMATCHED** — say so plainly.

⚠️ **An unknown short code is a FINDING, not a typo to correct.** `[BC]` was unknown on the first
run and resolved to *Becoming Curious* (Kaylee's show, living in the `Kali` list) out of Michael's
own staff-meeting notes. **Surface it, name your candidate, ask.**

🚫 **NEVER create a ClickUp task for an orphan automatically.** An orphan may be someone else's
event, a personal hold, or a duplicate. Report it with a proposed home list; Michael decides.

### Pass E — the flip-back (the ONLY write, and it is gated)

After Michael confirms he has hand-edited Google, bulk-set the worked rows to `CURRENT` in one
write. **This is the half of his manual pass that is pure bookkeeping and the half worth
automating first.** Requires explicit per-run go-ahead. Preview the target list before applying.

---

## Output shape

One report per run. Lead with the counts, then the four blocks in pass order. **Every row carries
its target calendar and its verdict; a row with no verdict is a bug in the run, not an empty row.**

```
GCAL RECONCILE — <scope> — <window> — <timestamp ET>
Queue:      NEW <n> · OUTDATED <n> · CONFIRMING <n>
Verified:   <n> clean · <n> drifted · <n> missing on Google
Orphans:    <n> Google events with no ClickUp row
Unverifiable: <n> (<reason per group>)

A · PUBLISH QUEUE      (grouped by target calendar, old→new values)
B · COLLAPSE CANDIDATES (keeper named per cluster)
C · DRIFT               (field, ClickUp value, Google value)
D · ORPHANS             (event, date, calendar, best-guess home list, confidence)
```

**Reconcile the counts.** Queue + verified + unverifiable must account for every row in scope. An
unexplained gap means the query filters lied — most likely the subtask/closed default.

---

## Guardrails

- 🚫 **NEVER write to Google Calendar.** Not create, not edit, not delete. Standing rule, and
  Michael restated it explicitly on 2026-08-11: *"i don't trust you to hand edit the calendar yet.
  absolutely not."* Graduation is **earned per scope, on small event batches**, from accumulated
  run reports — never assumed, never fleet-wide.
- 🚫 **Never mark `N/A` on inference.** See the N/A trap.
- 🚫 **Never cull, merge or rename a row** found during a pass. Duplicates can be the only record
  of something; an unexplained suffix is a lineage clue. Report and move on.
- ⚠️ **Never state an automation's behaviour as verified** — it is testimony until Michael reads
  the recipe.
- ⚠️ **Declare unverifiable scope loudly.** A pass that cannot see a calendar says so in the
  header, not in a footnote.
- **Batch cap:** ~40 rows per pass. Stop on a calendar boundary, never mid-calendar, and hand off
  with an `↪️ HANDOFF ·` Activity Board task.

## Seams

- **FMP Fiona** — `Calendar COLOR` and the PDF render. Same colour vocabulary, different runtime.
- **Audit Anna** — a formal full-space reported pass IS an audit and seizes to her.
- **ClickUp Coach Corey** — any schema change this hook argues for (the multi-home publication
  gap is the live one) is stated here and BUILT by him.
- **Callboard Quinn** — stage management practice travels with her; **this show's calendar stays
  with Milo.**

## Known gaps (v1, honest list)

1. Travel calendar unreachable → 40% of the queue unverifiable.
2. Multi-homed rows have one status for possibly several publications. Schema gap, unsolved.
3. `Prod Cal & Reh (TIM-D)` splits by kind and the discriminator is unwritten.
4. `26-27 PRODUCTION CALENDAR` unaccounted for.
5. Automations are invisible to the fleet; all automation behaviour here is testimony.
6. **Never run end to end.** Passes C and D have one real sample each (URITP Production,
   Aug 11–25, 2026-08-11). Everything else is designed, not proven. A cold session that finds no
   run history **says so** rather than inferring the hook works.
