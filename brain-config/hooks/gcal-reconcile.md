# GCal Reconcile — ClickUp ▸ Google calendar reconciliation

> **PROPOSE-ONLY against Google. This hook NEVER writes to Google Calendar.** It MAY write ClickUp
> dates and `GCal STATUS` when Michael has ruled on a specific row.

**v2, 2026-08-11** — twelve corrections from the first live run, same day as v1. **v1 was written
BEFORE the hook had ever run; v2 is written from evidence.** Every ⭐ below replaced a v1 claim
that was wrong. Steward: **Mainstage Milo.** The tool is ownerless for a one-off pass; a formal,
scoped, reported full-space pass IS an audit and seizes to **Audit Anna**.

## Invocation + Trigger

- `/gcal-reconcile` · `/cal-reconcile` · `/reconcile-calendar`
- Scoped: `/gcal-reconcile <calendar>` · `<list>` · `--window <n>d`
- Plain language: "reconcile the calendar," "what's out of sync with Google," "what needs pushing
  to the calendar"
- 🚫 Does NOT fire on "put this on the calendar" (a single publish, done by hand).

---

## 🔴 THE FRESHNESS PAIR (v2 #11 — read this before anything else)

**A reconciliation compares two MOVING surfaces. Freshness is a property of the PAIR, not of a
read.**

- **Read Google FIRST, ClickUp LAST, inside the same pass.** Michael edits ClickUp while the pass
  runs, so the stale side is ALWAYS ClickUp and the false verdict is ALWAYS `DRIFTED`.
- **Any verdict from a prior pass is VOID, not stale-but-usable.** Never carry a figure forward.
- 🔴 **Why this is rule #1:** on the first live run, three of four verdicts in one report were
  already dead on arrival — the report sent Michael to fix rows he had fixed minutes earlier.
  **Inventing work is a worse failure than missing drift.**

---

## The automations — VERIFIED 2026-08-11 (7 active on URITP PRODUCTIONS)

⭐ **v1 said "no agent can read ClickUp automations, treat all of this as testimony." Still true
that you cannot READ them — Michael had to screenshot them. But these seven are now CONFIRMED
CONFIG, not hearsay.**

| Automation | Trigger | Condition | Action |
|---|---|---|---|
| `if on GCal, watch DUE DATE` | due date changed | **`GCal STATUS` = `CURRENT`** | → `OUTDATED` |
| `if on GCal, watch START TIME` | start date changed | **`GCal STATUS` = `CURRENT`** | → `OUTDATED` |
| `if CAL COLOR, then add to gCAL` | `Calendar COLOR` changed | **`GCal STATUS` NOT SET** | → `NEW` |
| `if on INFO SHEET, watch DUE DATE` | due date changed | `Info Sheet Status` set | → `OUT OF DATE` |
| `if on INFO SHEET, watch START DATE` | start date changed | `Info Sheet Status` set | → `OUT OF DATE` |
| `if is EVENT and DUE DATE changes` | due date changed | is EVENT | updates `Event Ends` |
| `if is EVENT and START DATE changes` | start date changed | is EVENT | updates `Event Begins` |

**ClickUp-side drift detection is DONE. Do not rebuild it.** This hook exists for what those
seven structurally cannot see: Passes C and D.

⚠️ **A parallel lifecycle exists.** `Info Sheet Status` has its own staleness pair on the same
date fields. Two independent systems, one set of triggers. Out of scope here; do not be surprised
by it.

### ⭐ v2 #12 — THE WRITE-THEN-RESTORE PAIR (verified by accident, 2026-08-11)

**The automation does NOT distinguish an agent write from a human one.** Proven live: a date write
to a `CURRENT` row flipped it to `OUTDATED` before the flip-back landed.

**Therefore a reconciliation date write on a `CURRENT` row is INHERENTLY TWO OPERATIONS.** The
flip-back is not bookkeeping, it is the second half of the same edit. **An unpaired date write
abandons a correct row in the queue as a false positive.** Treat as atomic; verify the final state
by re-read.

⚠️ **Before any BATCH date write, count how many `CURRENT` rows it will knock to `OUTDATED` and
state the number first.** That is the real price of a cleanup and it is a decision, not a surprise.
⭐ **Corollary worth keeping: the safe place to test a costly behaviour is inside work that was
already going to pay that cost.**

---

## The field model (URITP PRODUCTIONS, space `901313768203`)

| `GCal STATUS` | Means | Role |
|---|---|---|
| `NEW` | in the lifecycle, not yet confirmed against Google | QUEUE |
| `CONFIRMING` | published, plan not settled | QUEUE (soft) |
| `CURRENT` | published and believed accurate | STAMP |
| `OUTDATED` | ClickUp moved under a published event | QUEUE |
| `CLOSED (N/A)` | **will never be a calendar event** | TERMINAL |

### 🔴 THE N/A TRAP (unchanged from v1, still the most damaging mistake available)

The drift automations are conditioned on `CURRENT`; `N/A` can never reach it. **Marking a row
`N/A` silences it permanently.**

- 🚫 **NEVER infer `N/A` from "has no dates."** Live examples of dateless rows that are real
  future events: `SND Hang`, `LX Strike`, `Production Photos`.
- ✅ **The test is KIND, never scheduling:** *will this object EVER be a calendar event?*
  Paperwork and artifacts are `N/A`. An unscheduled event is not.
- **`N/A` = never publishes. `NEW` = not yet.**

### ⭐ v2 #6 — `Calendar COLOR` IS THE ADMISSION GATE

**v1 called it "PDF export styling, not routing, ignore it." Half wrong, and the wrong half
matters.** The VALUE is styling for the FileMaker render (→ **FMP Fiona**; that render carries a
live `RGB($R;$G;$R)` bug). **But SETTING it is what admits a task to the lifecycle at all** —
`if CAL COLOR, then add to gCAL` stamps `NEW` on any row with no status.

🔴 **This resolves the 99-row empty-status group and inverts it.** Those rows are **PRE-ADMISSION
BY DESIGN**, not a neglected backlog — nothing has declared them calendar-relevant. ⚠️ One field
is doing two jobs (style token + "belongs on a calendar" boolean). **Design smell, Michael's call,
not the hook's to fix.**

### ⭐ v2 #7 — `Event Begins` / `Event Ends` are LIVE mirrors

**v1 filed them with the `BASELINE_` family as frozen copies. Wrong** — two automations re-sync
them on every date change for EVENT-type tasks. 🚫 **They cannot tell you what a row USED to say.**
Whether the `BASELINE_` fields are still frozen is now **UNVERIFIED**, not known.

---

## Routing: home list → target calendar

Destination derives from **HOME LIST** (Michael's ruling). Most rows land on **URITP Production**.

| Home list | Target | Confidence |
|---|---|---|
| `Production Calendar` · `Production Cal (BL)` · `Prod Cal (TIME)` | URITP Production | HIGH |
| `Rehearsals (KL)` · `Rehearsals (TIME)` · `[BL] Rehearsals` | URITP Rehearsals | HIGH |
| `Events (OA)` · `Other Events (OA)` · `One Acts 2026` | **see the OA grain rule** | — |
| `SPAC EVENTS` | SPAC Use Calendar | MED |
| `Recurring Academic Events` · `[123] Course Schedule` | URITP Classes | MED |
| `DANCE Dept shows` · `Other Events (KF)` | URITP Other Events | LOW |
| **`TRIPS`** | **a travel calendar this fleet CANNOT SEE** | 🔴 blocked |
| `Prod Cal & Reh (TIM-D)` | splits by KIND, discriminator unwritten | 🔴 |
| `Info Sheet (BL)` · `Paperwork (<SHOW>)` | not a calendar | — |

⚠️ **`Production Calendar` (`list-159`) is BECOMING CURIOUS, not Big Love.** Short code **`BC`**,
the third name on that slot (Kayfabe → Kali → Becoming Curious), and its trips still live in the
`Kali` list. **Not in the fixed short-code vocabulary — add it.**

### ⭐ v2 #5 — THE OA GRAIN RULE (v1 had this backwards)

v1 scored `Events (OA)` → OA Play Festival as HIGH confidence. **Wrong: `[OA] Riser SET` and
`[OA] Designer's Run` both live on URITP Production.**

**The rule, in Michael's terms:** an OA item publishes to **URITP Production** when a production
department must ACT on it (riser set, designer run, tech, strike, performances). It stays
**OA-only** when it is festival-organizer grain (submission deadlines, reading nights, admin).
*"Charlie sets up the risers and may go to DR but doesn't need to know when play submissions are
due."*

⭐ **This is not duplication, it is a deliberate AUDIENCE FAN-OUT: one event serving two job
functions, so a department head never has to leave the Production calendar.**

### Multi-home rows

Multi-home is the SAME OBJECT in several lists, so **one `GCal STATUS` covers what may be several
publications** (live rows reach six lists). 🚫 **Do not guess a precedence.** Report as
`AMBIGUOUS ROUTE` naming every candidate. It is a schema gap; naming it IS the output.

### 🔴 The travel blind spot — declare it in the HEADER, never a footnote

A travel calendar exists and is **not reachable from either connected Google account** (force
resolution by name failed on four candidates including the direct-ID path). Likely
`rochester.edu`, not a connected credential — **candidate, not finding.** `TRIPS` was **25 of 63
actionable rows (40%)** on day one. **Report those as `UNVERIFIABLE` with the reason, counted
SEPARATELY from clean.** A pass that reads an empty surface and passes everything is the failure
this fleet keeps re-learning.

⚠️ **`26-27 PRODUCTION CALENDAR` is a SECOND production calendar** with no list pointing at it.

---

## ⚠️ Normalization — apply BEFORE comparing

**1 · ⭐ v2 #9 — ALL-DAY EVENTS RETURN SHIFTED, and the v1 rule was incomplete.**

All-day events come back as UTC midnight rendered locally: **8:00pm in EDT, 7:00pm in EST.**
🚫 **Never key on a literal time string.** Detect the UTC-midnight boundary.

- **Shift BOTH displayed boundaries forward one day. First day = displayed start + 1. Last day =
  displayed end.**
- Single-day check: displayed `Nov 6 7pm → Nov 7 7pm` = **Nov 7 only.** ✅
- Multi-day check: displayed `Nov 14 7pm → Nov 16 7pm` = **Nov 15–16.** ✅ *(v1 said "the real date
  is the END side," which is right for one day and silently wrong for a span.)*

**2 · ⭐ v2 #4 — WRITE-SIDE TIMEZONE. Every timed date write carries an EXPLICIT offset.**

A bare time string in `query_tasks` is interpreted as **UTC**, not workspace time — a silent 4–5
hour shift with no error. Caught only because the preview prints UTC. Use `-05:00` (EST) /
`-04:00` (EDT), season-correct. **Read and write both bite on timezone; one problem, two
directions.**

**3 · SUBTASKS AND CLOSED TASKS ARE IN SCOPE.** ClickUp defaults exclude both, so a pass
under-reports and looks clean. **Every query carries
`is_subtask IN (true, false) AND is_closed IN (true, false)`.** Hit twice in one session; the
default is the trap, not the exception.

**4 · ⭐ v2 #2 — STRIP THE SHORT-CODE PREFIX BEFORE COMPARING TITLES.** Google carries `[BC] `,
`[OA] `, `[TS] `; ClickUp does not. **A naive title comparison scores ZERO matches.** ⚠️ Prefix
typos are live and break a strict parser: `[BX]`, `[OA}`, `[BC}`.

**5 · ⭐ v2 #10 — `eventId` IS THE JOIN KEY. Titles get renamed.** Proven: `[BC] Light & Sound
Strike` was renamed to `[BC] LX Strike`, same id. **A title-only matcher would have reported one
deletion plus one new event.** ⚠️ There is no `eventId` stored in ClickUp (a manual-fill field was
proposed and REJECTED as unmaintainable), so the id joins WITHIN a pass, not across runs.

---

## The passes

### ⭐ Pass A — BACKFILL / publish queue (v2 #1: v1 got this backwards)

v1 called this "the publish queue" and assumed `NEW` meant unpublished. **On a real backlog, most
`NEW` rows ALREADY EXIST on Google** — the events were built first and the ClickUp rows are a later
template instantiation auto-stamped `NEW` by the colour automation. **`NEW` means NOT YET
CONFIRMED, not NOT YET PUBLISHED.**

**So: for every `NEW` row, LOOK FOR AN EXISTING EVENT BEFORE ASSUMING ABSENCE.** Group by target
calendar, report old→new values. Needs no Google read to produce the work order, so it survives a
blocked calendar.

### Pass B — collapse candidates (proposal only)

Same production + identical dates + same occasion = usually ONE Google event. **Michael already
does this by hand** (`[TS] SITE Visit` served both the Director and Scenic trips). Propose ONE
keeper (`CURRENT`), siblings `N/A`. ✅ Safe against the N/A trap because the survivor still trips
the automation. ⚠️ **A collapse is invisible once made. Propose, name the keeper, never automate.**

### Pass C — verify the STAMP

For `CURRENT` rows, compare title/start/end against the target calendar. **The automations only
watch ClickUp edits, so a `CURRENT` row edited or deleted on the GOOGLE side reports clean
forever.** Verdicts: `VERIFIED` · `DRIFTED (field, both values)` · `MISSING ON GOOGLE` ·
`UNVERIFIABLE (reason)`.

⭐ **First live hit:** `Show strike` sat at `CURRENT` reading 4–6p while Google said 5–8p. **Nothing
in the workspace would ever have surfaced it.**

⚠️ **On a drift, the hook does NOT decide which side is right.** Present both values and the
context; Michael rules. *Plausible is not authority.*

### Pass D — 🎯 ORPHAN DETECTION (the reason this hook exists)

Every Google event in the window with no ClickUp row. **Three in a single two-week sample on the
first run.** 🔴 **Drift runs two directions and only one is instrumented.** An orphan is an event
the program is actually running with no task, no owner and no paperwork — **strictly worse than a
stale stamp.**

Ladder, stop at first confident hit: **short code + date** (`BL` · `TS` · `TIM-D` · `TIME` · `OA` ·
`KL` · `BC`; never invent one) → **title match after prefix strip** → **date + occasion** →
**UNMATCHED, said plainly.**

⚠️ **An unknown short code is a FINDING, not a typo.** `[BC]` was unknown on the first run and
resolved out of Michael's own meeting notes. 🚫 **NEVER auto-create a task for an orphan** — it may
be someone else's event or a personal hold. Report with a proposed home list.

### Pass E — the flip-back

After Michael confirms the Google side, bulk-set worked rows to `CURRENT` in one write. **The pure
bookkeeping half, and the first thing worth automating.** ⚠️ See #12: when the pass also wrote
dates, this is not optional.

---

## Output shape

```
GCAL RECONCILE — <scope> — <window> — <timestamp ET>
Reads: Google <time> · ClickUp <time>   (same pass, ClickUp last)
Queue:        NEW <n> · OUTDATED <n> · CONFIRMING <n>
Verified:     <n> clean · <n> drifted · <n> missing on Google
Orphans:      <n> Google events with no ClickUp row
Unverifiable: <n> (<reason per group>)

A · BACKFILL / PUBLISH QUEUE   (by target calendar, old→new)
B · COLLAPSE CANDIDATES        (keeper named per cluster)
C · DRIFT                      (field · ClickUp value · Google value)
D · ORPHANS                    (event · date · times · calendar · best-guess list · confidence)
```

### ⭐ v2 #3 — A VERDICT MUST CARRY ITS PAYLOAD

Michael, on v1's output: *"woulda been helpful for you to list the dates and times in your report."*
**Correct, and structural.** A `MISSING` verdict IS a work order, and a work order with no values
in it is useless — he should never have to open the task to get what the report already had.

- **`MISSING ON GOOGLE` prints:** title **with the target prefix already applied** · date · start
  time · end time · target calendar. Everything needed to create the event without leaving the
  report.
- **`DRIFTED` prints BOTH values**, never just the flag.

**Reconcile the counts.** Queue + verified + unverifiable must account for every row in scope. An
unexplained gap means a query filter lied — most likely the subtask/closed default.

---

## Guardrails

- 🚫 **NEVER write to Google Calendar.** Michael, 2026-08-11: *"i don't trust you to hand edit the
  calendar yet. absolutely not."* Graduation is earned **per scope, on small event batches**, from
  run reports.
- ✅ **Read-only verification NEVER needs permission.** Michael, 2026-08-11: *"i don't need to say
  the word on that."* **Offering to look is not work; looking is.** Do the pass, report it.
- 🚫 Never mark `N/A` on inference. Never cull, merge or rename a row found during a pass.
- ⚠️ Never carry a figure between passes (#11).
- **Batch cap ~40 rows.** Stop on a calendar boundary, hand off with an `↪️ HANDOFF ·` task.

## Known gaps (v2, honest list)

1. Travel calendar unreachable → ~40% of the queue unverifiable.
2. Multi-homed rows: one status, possibly several publications. Schema gap → **Corey**.
3. `Prod Cal & Reh (TIM-D)` splits by kind; discriminator unwritten.
4. `26-27 PRODUCTION CALENDAR` unaccounted for.
5. **Milestone vs timed event has no convention.** `SPAC Reservations End` is an all-day marker on
   Google and a zero-length 5:00p point in ClickUp. Same day, different semantics, **unverifiable
   as a match** until Michael rules.
6. `Calendar COLOR` carries two jobs (style + admission).
7. Whether the `BASELINE_` fields are genuinely frozen is UNVERIFIED.
8. **Passes A, C, D have one real sample: URITP Production, Nov 2026, run 2026-08-11 (~12 rows
   reconciled). Pass B has never run. Pass E has only ever run one row at a time.** A cold session
   that finds no further run history **says so.**
