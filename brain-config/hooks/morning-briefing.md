---
id: morning-briefing
kind: hook
version: 1.1
status: LIVE (phase 1 — manual fire, no scheduler exists)
steward: Mainstage Milo (URITP is his organization; the brief is his house report)
execution: ownerless — any agent in a session may run it (Doc-Rot-Sweep precedent)
born: 2026-09-02
repo: mawizorek/ClickUp_apps@main (brain-config, PUBLIC)
report-to: 🟢 Agent Activity Board — a run comment, same shape as a Ricky run report
---

# Morning Briefing — the URITP production wake-up

The one prompt Michael runs to start a day. It reports the **state of his
productions**, catches what slid, and hands him a batch already primed for work.

**Invocation:** `/morning` · `/wake` · `/briefing` · "morning briefing" ·
"wake me up" · "what's the state of the shows."
🚫 **No autonomous trigger.** There is no scheduler in this workspace. Michael
fires it, which means it must survive being skipped for four days and being run
at 4am. It never assumes yesterday ran.

---

## 🔴 THE PRIME DIRECTIVE — read this before any number below

Michael, verbatim, 2026-09-02, one turn after giving the numbers:

> *"I'm giving you these estimated numbers and ranges, but I don't want you to feel
> like you just have to checklist everything. This is supposed to be you acting as
> my assistant and surfacing what's relevant. I'm just giving you scale and scope,
> not a checklist!"*

**EVERY NUMBER IN THIS FILE IS A SCALE CUE, NOT A QUOTA.** 20-40, 5-10, 2 slides,
cap 10 — all of them describe the *shape* of a useful brief. None of them is a
target to hit.

**RELEVANCE OUTRANKS EVERY THRESHOLD IN THIS DOCUMENT.** When the honest answer is
11 tasks, the brief is 11 tasks. When three things genuinely matter, it is three
things and it is a **better** brief than a padded one.

⚠️ **This clause exists because v1 was one turn from the exact opposite failure of
Rule 0.** Rule 0 kills prose bloat; unchecked, it invites *list* bloat — padding
to 20-40, filling the batch to 10, dumping every 2-move slide. A brief that hits
its numbers and buries the one thing that mattered has failed just as hard as a
brief made of paragraphs. **The job is an assistant exercising judgement, not a
report generator satisfying a spec.**

🔥 **GENERALIZES:** a range from Michael is scope-setting, never a checklist. This
applies to every hook, every runbook and every report surface in this repo, not
just this one.

---

## 🔴 RULE 0 — LINKS, NOT PROSE

Michael, verbatim, 2026-09-02: *"the update i'm going to want is going to be far
LESS prose from you and more LINKS to tasks. so i don't mind hearing about 20-40
tasks, cos that'll be the brunt of the update."*

- **20-40 linked tasks describes the expected WEIGHT of a normal day**, so a brief
  that size is not too long. 🚫 It is not a floor and not a ceiling. See the Prime
  Directive.
- **Every task named is a markdown hyperlink.** A task mentioned without a link
  is a task he has to go find, which is the exact work this hook exists to remove.
- **One line per task. Max.** `[name](url) · <status> · <the one fact that makes it
  actionable>`. No second sentence. No "this suggests."
- **Prose is capped at the section headers plus the closing question.** Nothing else.
- ⚠️ **This inverts the house Spoken Voice floor and does so deliberately.** The
  floor says converse as if speaking; a scannable link list is the ONE surface
  where Michael has ruled the opposite. It does not generalize past this hook.
- ⚠️ **If the brief feels too long, the fix is RAISING THRESHOLDS, never compressing
  the writing.** A shorter brief must mean fewer things qualified. Compressing
  prose to fit is how a brief goes unread by week six.

---

## Scope — what this is and is not

**IN:** the URITP spaces. Productions, their calendars, their people, their
paperwork, the building, welfare and training status. Michael's own dated tasks
across the workspace, because he smashes active thoughts into days around today
and that habit IS the input signal.

**OUT, and each for a reason:**

- **Ricky's data routines** (F1 · On Track · Job Market) get **exactly one pointer
  line**: how many are due, and a link to his standing thread. They are not
  production work and they will eat the brief if invited in.
- **Craft hazard analysis and cited standards** → Hazard Hawthorne. The brief may
  say *a hazard is unassessed*; it never states what the hazard IS or cites a clause.
- **Season shape.** Michael decides what a season is. The brief reports what is
  happening inside it.
- **Anything requiring a decision the brief then acts on.** See Authority below.

---

## Conditions that must be true, or the brief is worse than nothing

A brief that looks complete and is not is the most expensive output in this
workspace. Every condition below is a named failure that already happened here.

1. 🔴 **REACHABILITY IS REPORTED SEPARATELY FROM FINDINGS.** "Nothing due" and "I
   could not see it" must never render the same. Every section states whether its
   source read clean. Precedent, and it is a brutal one: BroadwayWorld served a
   26-day-old cache with real orgs, real salaries and real pagination, and a pass
   run blind would have stamped August 5 market state as current.
2. ⚠️ **NAMED BLIND SPOTS, IN THE BRIEF, EVERY TIME.** Three are known and standing:
   - **Brain sessions are not readable.** No session can read another session's
     chat. Continuity is ONLY what was written down (Activity Board, repo, task
     comments). A brief must never imply it remembers a conversation.
   - **The EVERYTHING WEEK calendar view is not readable** (access denied,
     verified 2026-09-02). The dated tasks beneath it read fine, and that is the
     data that matters — but say so rather than implying the view was consulted.
   - **Activity reads cap at 7 days per call** and silently truncate. The brief
     DECLARES its lookback window. An undeclared window reads as total coverage.
3. **Every line carries a next action or an owner.** Otherwise it is a diary entry.
4. **"Nothing to report" is a SUCCESSFUL run** and ships as one. A brief that
   manufactures content to look useful trains him to skip it.
5. **Sections with nothing in them are OMITTED**, not printed empty.
6. **Catch-up is labelled.** State days since the last brief. Four days missed is
   ONE brief with a wider window, never four replayed briefs.

---

## 🔴 STALE KEYS ON DISTANCE-TO-MILESTONE, NEVER ON THE CLOCK

The single most important judgement in the file, and the one a generic briefing
tool gets wrong every time.

**"No movement in N days" is meaningless in a theatre.** A props list untouched
for three weeks is perfectly healthy if load-in is in November. A contact-sheet
gap two days old is already a problem if the designer starts Monday.

**So: pressure = distance from the item to the milestone it feeds.** Read the
show's milestone spine FIRST, then judge everything against it.

**Verified spine state, 2026-09-02 (re-verify, never quote this):**

- **Big Love (F26)** — spine is STRONG. ~35 dated rows built in May, running Meet
  & Greet → costume fittings → prelim/final LX + SND plots → designer run 9/14 →
  hang 9/25-27 → tech setup → put-ins → dress → ASL performance → performances
  → strike 10/19. Home: Production Cal (BL) + Info Sheet (BL). **This is the
  model spine. Judge against it.**
- **The November show** — spine present: load-ins 11/2-11/6, hangs, focus 11/8,
  tech and dress 11/8-12, performances 11/13-15, strike 11/16.
- 🔴 **TIM-D — spine is THIN and this is a real gap, not a briefing feature.** Four
  dated rows: Meet & Greet + First Rehearsal both 10/20, designers in residence,
  stage reading 12/6. **`[TIME] ?TECH?` carries question marks in the task name
  itself and `[TIME] Strike` has NO DATE.** A devised show 7 weeks out with no
  critical path. Surface it until it is fixed; do not silently treat absence of
  dates as absence of pressure.

⚠️ **A show with no spine cannot be assessed for staleness at all.** Say that
plainly. Never substitute clock-staleness as a fallback — it produces confident
nonsense, which is worse than the gap.

---

## 🔴 SLIDE DETECTION — the anti-complacency pass

Michael's actual ask: *"tasks that are just being moved and not actually worked
on... looking for patterns of work and breaking cycles of complacency."*

**Mechanism (proven live 2026-09-02, not theorised):** read activity filtered to
`due_date` · `start_date` · `status` for Michael over the lookback window, then
split it two ways.

- **A date moved AND status changed = HEALTHY MOTION.** Leave it completely alone.
  It is being worked. Six tasks landed here on the founding run and none of them
  belonged in the brief.
- 🔴 **A date moved with ZERO status change = A SLIDE.** This is the signal.

**THRESHOLD, ruled by Michael 2026-09-02: TWO moves with no status change QUALIFIES
for a callout.** Not three. Two is already a pattern.
⚠️ **Qualifying is not the same as belonging in the brief.** Per the Prime
Directive, the threshold decides what is *eligible*; relevance decides what ships.
A slide on something that genuinely does not matter this week is noise wearing a
pattern's clothes — hold it, do not pad with it.

**Carry the SLIDE COUNT on every one you do surface**, because the count is the
whole message: two is a pattern, four is a decision he has not made yet.

**Ask ONE blunt question, never a list of gentle observations:**
> *is this actually happening, or are we killing it?*

⭐ **Why that question and not "why is this late":** a repeat slide is almost never
laziness. It is a task that never had a real owner or a real next action. The
question that unblocks it is the one that lets him kill it.

**Founding-run examples (illustrative, will be stale):** `coordinate ECM calls for
load-in and strike` and `get new roadcases for lustrs and D40s` both slid 8/31 →
9/2. `Biometric Screening` and `Online Health Surveys` both pushed ~6 days.

🚫 **Never mark a slide off a date you did not read this run.** A cleared date is
not a slide. A date set for the first time is not a slide.

---

## 🎯 THE BATCH DRILL — the part that makes it an assistant instead of a report

Michael, 2026-09-02: *"for like a batch of them you could say 'let's go drill into
these 5-10 right now and i've already left a single comment on each to try and
bump their next steps'."*

**This is the hook's one WRITE, and it is authorized.** Order matters:

1. **Pick the tasks worth drilling — 5-10 is the usual shape, not a quota.**
   Selection rule, in order: closest to a milestone → highest slide count →
   blocking somebody else → oldest unowned. **Never a random sample, and never a
   filler pick to reach a number.** Four real ones beat ten with six passengers,
   because a batch with passengers teaches him to skim the block.
2. **Post ONE comment per task, BEFORE reporting.** Past tense in the brief
   ("already commented") must be TRUE when he reads it.
3. **The comment names the next step and who owns it.** One or two lines. It is a
   bump, not an essay, and it is the thing he would otherwise have typed himself.
   🚫 Never a status request, never "any update on this?" — that is noise wearing
   a work costume.
4. **Report the batch as links**, with what each comment asked for.
5. **Close with the invitation:** *drill these now?*

⚠️ **Never exceed 10.** Eleven is a work session, not a brief, and a batch he
cannot finish trains him to ignore the whole block. This one IS a hard ceiling —
it bounds his effort, not the brief's completeness.
⚠️ **If a comment write fails, say so on that line and keep the brief.** A failed
write never blocks the report.

---

## Authority

**Two writes, both narrow, both self-evidencing:**

1. **The drill-batch comments** (above). Explicitly authorized by Michael.
2. **Reopening / re-stamping**: flipping a plainly-stale status, ticking a
   checklist item, parking a pickup line.

🚫 **NEVER:** create a task · send anything (the email send lock stands) · touch
any external calendar (scheduling is ClickUp tasks with start/due dates, always)
· change a date · decide a season · adjudicate a craft disagreement · declare
something safe to proceed.

⚠️ **A date change by an agent is indistinguishable from one by Michael**, which is
exactly why this hook does not make them: it would manufacture its own slide
signal and corrupt the next run's arithmetic.

---

## Output shape

Header line: date · lookback window · days since last brief · source health.
Then these blocks, **omitting any that are empty**, each a bare list of links:

1. **🎭 TODAY** — what is on the boards, what is called tonight, what is due.
2. **⏰ INSIDE THE WINDOW** — dated items landing before the next milestone,
   grouped by show. Pressure order, not date order.
3. **🔴 SLID** — the anti-complacency block, with slide counts and the one question.
4. **🕳️ GAPS** — unowned, unassessed, undated things that a milestone is about to
   need. TIM-D's missing critical path lives here until it is fixed.
5. **🎯 DRILL BATCH** — the already-commented tasks. Always last, because it is the
   block he acts on.
6. **Routines** — one line. Count due, link to Ricky's thread. Never more.

Close with ONE question. Not a summary, not a recommendation list.

⚠️ **The block list is the ORDER, not a form to fill.** A day with no slides has no
SLID block and that is a clean brief, not an incomplete one.

---

## Known limits, stated because a cold session will not find them

- **Generalized from ZERO live runs.** v1 was scoped in conversation and grounded
  against real workspace state, but never fired end to end. A session that finds
  no prior run report SAYS SO instead of assuming this works.
- It cannot see a conversation. Only artifacts.
- It cannot read ClickUp automations. Any automation behaviour is testimony.
- It cannot tell a task with no date from a task that does not need one.
- **It cannot make a slide matter.** Same limit the Task-Context Orientation Gate
  names about itself: the hook can surface the pattern; only Michael can break it.

## Provenance

Scoped 2026-09-02 08:16-08:55 ET, Mainstage Milo seated, QUESTION-ME loaded.
**Fold-in verdict: FOLD-IN, not net-new** — the Routine Ricky standing task
(`86ajuhw1d`) already carried *"save the ONE prompt Michael can run once a day to
kickstart procedures and routines and agents and comments and threads"* with one
unticked checklist item open since 2026-08-01. That task is a RECORD surface by
its own law, so the spec landed here and the checklist item became a pointer.

Five rulings by Michael, each traceable to a turn: **URITP production management,
not a cross-tool digest** ("you're my uritp guy") · **links over prose, 20-40
tasks** · **two slides qualifies for a callout** · **the brief pre-comments the
drill batch** · **v1.1: the numbers are scale and scope, NOT a checklist** — given
one turn after the numbers themselves, which is why the Prime Directive sits above
Rule 0 rather than inside it.
