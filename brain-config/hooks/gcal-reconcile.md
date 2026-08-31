# GCal Reconcile — production CALENDAR SURFACE reconciliation (ClickUp ▸ Google ▸ Info Sheet)

> **PROPOSE-ONLY against Google. This hook NEVER writes to Google Calendar and NEVER writes an Info
> Sheet DOCX.** It MAY write ClickUp dates, `GCal STATUS`, and `Info Sheet Status` when Michael has
> ruled on a specific row.

**v3, 2026-08-31** — **Info Sheet brought IN SCOPE as the THIRD calendar surface** (Michael: this
hook reconciles production CALENDAR surfaces, which include ClickUp, Google, AND the Info Sheet).
The v2 "parallel lifecycle, out of scope" note is REVERSED below; see **Pass F**. Everything v2
verified about the Google↔ClickUp pair stands unchanged — Pass F ADDS a surface, it does not alter
Passes A–E. 🪧 Filename kept `gcal-reconcile.md` to avoid a fleet-wide pointer break; a rename to
`prod-cal-reconcile` is flagged for Michael, not taken unilaterally.

**v2, 2026-08-11** — twelve corrections from the first live run, same day as v1. **v1 was written
BEFORE the hook had ever run; v2 is written from evidence.** Every ⭐ below replaced a v1 claim
that was wrong. Steward: **Mainstage Milo.** The tool is ownerless for a one-off pass; a formal,
scoped, reported full-space pass IS an audit and seizes to **Audit Anna**.

## Invocation + Trigger

- `/gcal-reconcile` · `/cal-reconcile` · `/reconcile-calendar`
- Scoped: `/gcal-reconcile <calendar>` · `<list>` · `--window <n>d`
- Plain language: "reconcile the calendar," "what's out of sync with Google," "what needs pushing
  to the calendar," **"align the info sheet dates," "do the info sheet dates match the calendar."**
- 🚫 Does NOT fire on "put this on the calendar" (a single publish, done by hand).

---

## 🔴 THE FRESHNESS PAIR (v2 #11 — read this before anything else)

**A reconciliation compares MOVING surfaces. Freshness is a property of the PAIR, not of a read.**

- **Read Google FIRST, ClickUp LAST, inside the same pass.** Michael edits ClickUp while the pass
  runs, so the stale side is ALWAYS ClickUp and the false verdict is ALWAYS `DRIFTED`.
- **Any verdict from a prior pass is VOID, not stale-but-usable.** Never carry a figure forward.
- 🔴 **Why this is rule #1:** on the first live run, three of four verdicts in one report were
  already dead on arrival — the report sent Michael to fix rows he had fixed minutes earlier.
  **Inventing work is a worse failure than missing drift.**
- ⭐ **v3 nuance — the Info Sheet is a STATIC surface, not a moving one.** A DOCX does not edit
  itself, so its freshness = its export/term stamp, full stop. When the Info Sheet disagrees with
  the ClickUp↔Google pair, the DOCX is almost always the stale side (re-export by hand) — but
  "almost always" is not "always," and Pass F still prints all three and lets Michael rule.

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
seven structurally cannot see: Passes C, D, and F.

⭐ **v3 — A parallel lifecycle exists, and it is now IN SCOPE.** `Info Sheet Status` has its own
staleness pair (the two `if on INFO SHEET, watch DUE/START DATE` rows above) on the SAME date
fields as `GCal STATUS`. Two independent automations, one set of date triggers: **a single date
move can flip BOTH `GCal STATUS` → `OUTDATED` AND `Info Sheet Status` → `OUT OF DATE`.** A pass
that reads one flag and not the other under-reports. But those automations only watch the ClickUp
edit — they cannot see the DOCX itself, which is exactly the gap Pass F closes.

### ⭐ v2 #12 — THE WRITE-THEN-RESTORE PAIR (verified by accident, 2026-08-11)

**The automation does NOT distinguish an agent write from a human one.** Proven live: a date write
to a `CURRENT` row flipped it to `OUTDATED` before the flip-back landed.

**Therefore a reconciliation date write on a `CURRENT` row is INHERENTLY TWO OPERATIONS.** The
flip-back is not bookkeeping, it is the second half of the same edit. **An unpaired date write
abandons a correct row in the queue as a false positive.** Treat as atomic; verify the final state
by re-read. ⚠️ **v3: a date write also trips `Info Sheet Status` → `OUT OF DATE` on any row that
carries it — so a date cleanup now manufactures BOTH a `GCal` and an `Info Sheet` queue. Count and
state BOTH before writing.**

⚠️ **Before any BATCH date write, count how many `CURRENT` rows it will knock to `OUTDATED` (and
how many will flip to `OUT OF DATE`) and state the numbers first.** That is the real price of a
cleanup and it is a decision, not a surprise.
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

| `Info Sheet Status` | Means | Role |
|---|---|---|
| `Key Date` | a headline date printed on the Info Sheet | STAMP (Info Sheet surface) |
| `Other Date` | a secondary/deliverable date on the Info Sheet | STAMP (Info Sheet surface) |
| `OUT OF DATE` | ClickUp moved under an Info-Sheet date | QUEUE (Info Sheet surface) |
| `n/a` | not tracked on the Info Sheet | TERMINAL |

### 🔴 THE N/A TRAP (unchanged from v1, still the most damaging mistake available)

The drift automations are conditioned on `CURRENT`; `N/A` can never reach it. **Marking a row
`N/A` silences it permanently.** ⚠️ **The same trap applies to `Info Sheet Status = n/a`:** it
removes the row from the Info-Sheet staleness pair. Never infer either `n/a` from "has no dates."

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

## The surfaces (v3 — THREE, not two)

| Surface | Home | Role |
|---|---|---|
| **ClickUp event tasks** | URITP PRODUCTIONS space `901313768203`, home-list → calendar routing below | the SoT the automations watch |
| **Google Calendar** | the target calendars below | the published, human-facing calendar |
| **Info Sheet** | `…/PRODUCTIONS/URITP 26-27/<Show>/<CODE>.Info Sheet.<TERM>.docx` at each show root | the EARLIEST published schedule (Key Dates + Other Dates); a static DOCX designers read |

**The Info Sheet carries the show's dates before an event may even exist in ClickUp** (design
deliverable deadlines, audition/callback, first reh, designer's run, tech, dress, opening, runs,
strike). It is the calendar analog of what the contact sheet is for people — same shape, and it is
why `contact-reconcile.md` and this hook are twins.

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

## Normalization — apply BEFORE comparing

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

**6 · ⭐ v3 — INFO SHEET DATES ARE PROSE. Parse to absolute before comparing.** Info Sheet lines
read `Fri & Sat, December 11 & 12`, `Mon, February 1`, `Sat–Sun, March 6 – March 14` — weekday +
month + day, often a RANGE, often no year. Resolve the year against the Info Sheet's TERM header
(`Spring 2027`, `Fall 2026`). Match a date line to a ClickUp occasion by **KIND** (audition,
callback, first reh, meet & greet, designer's run, tech, dress, opening, run, pickup, strike,
deliverable due), never by string. `(all dates tentative)`, `TBD`, `?` = carry as tentative,
never compare as firm.

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
dates, this is not optional. ⚠️ v3: the same batch may need an `Info Sheet Status` reset for rows
that flipped to `OUT OF DATE`.

### ⭐ v3 — Pass F — INFO SHEET DATE ALIGNMENT (the third surface)

The Info Sheet (`<CODE>.Info Sheet.<TERM>.docx` at the show root) carries the **Key Dates** and
**Other Dates** blocks. It is the earliest published schedule and the document a designer reads, so
a drift between it and ClickUp/Google is a real wrong-date-in-someone's-hands failure, not cosmetic.

**What it reconciles:** each Info Sheet date line ↔ the matching ClickUp event task (by
show + occasion KIND) ↔ that event's Google entry. The Info Sheet is a static DOCX snapshot: it
goes stale the instant a date moves in ClickUp, exactly like a stale contact-sheet PDF.

**Direction:** the Info Sheet is NOT authority (freshness rule, v3 nuance). On drift, print the
Info-Sheet date, the ClickUp date, and the Google date with the Info Sheet's term stamp; Michael
rules. Usually ClickUp+Google agree and the DOCX is the stale one (re-export by hand), but not
always.

**Verdicts:** `ALIGNED` · `DRIFTED (surface: date)` · `MISSING EVENT (on Info Sheet, no ClickUp
task)` · `EXTRA EVENT (in ClickUp/Google, absent from the Info Sheet)` · `UNVERIFIABLE
(unparseable / tentative)`.

🔴 **`MISSING EVENT` outranks a drift in severity:** a date printed on the designer-facing Info
Sheet that was never built as an event has no task, no owner, and no calendar entry — the calendar
analog of a contact-sheet orphan. Report with a proposed home list; **never auto-create.**

🚫 **NEVER writes the DOCX.** The `Info Sheet Status` field write (marking a row current, or
flagging `OUT OF DATE`) is gated on Michael's ruling, same as the `GCal STATUS` flip-back.
⚠️ Two Info-Sheet automations already flip `Info Sheet Status` → `OUT OF DATE` on a ClickUp date
move — so a row already marked `OUT OF DATE` is a LEAD (ClickUp moved under the sheet), and Pass F
confirms it against the actual DOCX rather than trusting the flag.

---

## Output shape

```
GCAL RECONCILE — <scope> — <window> — <timestamp ET>
Reads: Google <time> · ClickUp <time> · Info Sheet <export/term stamp>   (same pass, ClickUp last)
Queue:        NEW <n> · OUTDATED <n> · CONFIRMING <n>
Verified:     <n> clean · <n> drifted · <n> missing on Google
Orphans:      <n> Google events with no ClickUp row
Info Sheet:   <n> aligned · <n> drifted · <n> missing event · <n> extra
Unverifiable: <n> (<reason per group>)

A · BACKFILL / PUBLISH QUEUE   (by target calendar, old→new)
B · COLLAPSE CANDIDATES        (keeper named per cluster)
C · DRIFT                      (field · ClickUp value · Google value)
D · ORPHANS                    (event · date · times · calendar · best-guess list · confidence)
F · INFO SHEET DATES           (occasion · info-sheet date · ClickUp date · Google date · verdict)
```

### ⭐ v2 #3 — A VERDICT MUST CARRY ITS PAYLOAD

Michael, on v1's output: *"woulda been helpful for you to list the dates and times in your report."*
**Correct, and structural.** A `MISSING` verdict IS a work order, and a work order with no values
in it is useless — he should never have to open the task to get what the report already had.

- **`MISSING ON GOOGLE` prints:** title **with the target prefix already applied** · date · start
  time · end time · target calendar. Everything needed to create the event without leaving the
  report.
- **`DRIFTED` prints BOTH values**, never just the flag. **v3: a Pass F drift prints all THREE**
  (Info Sheet · ClickUp · Google).

**Reconcile the counts.** Queue + verified + info-sheet + unverifiable must account for every row
in scope. An unexplained gap means a query filter lied — most likely the subtask/closed default.

---

## Guardrails

- 🚫 **NEVER write to Google Calendar.** Michael, 2026-08-11: *"i don't trust you to hand edit the
  calendar yet. absolutely not."* Graduation is earned **per scope, on small event batches**, from
  run reports.
- 🚫 **NEVER write an Info Sheet DOCX** (v3). A stale Info Sheet is re-exported by hand, never
  patched by an agent — same rule as the contact-sheet PDF in `contact-reconcile.md`.
- ✅ **Read-only verification NEVER needs permission.** Michael, 2026-08-11: *"i don't need to say
  the word on that."* **Offering to look is not work; looking is.** Do the pass, report it.
- 🚫 Never mark `N/A` (or `Info Sheet Status = n/a`) on inference. Never cull, merge or rename a
  row found during a pass. Never auto-create a task for an orphan or a missing Info-Sheet event.
- ⚠️ Never carry a figure between passes (#11).
- **Batch cap ~40 rows.** Stop on a calendar boundary, hand off with an `↪️ HANDOFF ·` task.

## Composes with

- **`contact-reconcile.md`** — its structural twin (this reconciles CALENDAR surfaces, that
  reconciles CONTACT surfaces). Same steward, same propose-only contract, same three-surface shape
  (the Info Sheet is a surface in BOTH).

## Known gaps (v3, honest list)

1. Travel calendar unreachable → ~40% of the queue unverifiable.
2. Multi-homed rows: one status, possibly several publications. Schema gap → **Corey**.
3. `Prod Cal & Reh (TIM-D)` splits by kind; discriminator unwritten.
4. `26-27 PRODUCTION CALENDAR` unaccounted for.
5. **Milestone vs timed event has no convention.** `SPAC Reservations End` is an all-day marker on
   Google and a zero-length 5:00p point in ClickUp. Same day, different semantics, **unverifiable
   as a match** until Michael rules.
6. `Calendar COLOR` carries two jobs (style + admission).
7. Whether the `BASELINE_` fields are genuinely frozen is UNVERIFIED.
8. Passes A, C, D have one real sample: URITP Production, Nov 2026, run 2026-08-11 (~12 rows
   reconciled). Pass B has never run. Pass E has only ever run one row at a time.
9. **⭐ v3 — Pass F has NEVER run live.** The TS / TIME / OA Info Sheets were READ 2026-08-31 (for
   the contact reconcile), but no Info-Sheet date has been reconciled against a ClickUp event yet.
   The prose-date parser and the occasion-KIND matcher are unproven; a cold session finding no run
   history **says so**. Founding read: those three Info Sheets carry full Key Dates + Other Dates
   blocks in Spring-2027 / Fall-2026 terms.
