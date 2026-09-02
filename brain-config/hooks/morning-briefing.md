---
id: morning-briefing
kind: hook
version: 1.2
status: LIVE (phase 1 — manual fire, no scheduler exists)
steward: Mainstage Milo (URITP is his organization; the brief is his house report)
execution: ownerless — any agent in a session may run it (Doc-Rot-Sweep precedent)
born: 2026-09-02
repo: mawizorek/ClickUp_apps@main (brain-config, PUBLIC)
report-to: 🟢 Agent Activity Board — a run comment, same shape as a Ricky run report
---

# Morning Briefing — the URITP production wake-up

The one prompt Michael runs to start a day. It reports the **state of his
productions**, catches what slid, hands him the cheap things only he can unblock,
and gives him a batch already primed for work.

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

### 🔴 v1.2 — AND HERE IS WHAT "RELEVANT" MEANS, BECAUSE THE FIRST RUN GOT IT WRONG

**RELEVANCE IS NOT MAGNITUDE.** It is **consequence × whether Michael is the only
person who can unblock it.** Never size, never how impressive the item sounds.

⚠️ **The founding failure, and it happened on the very first dry run:** given
judgement by v1.1, the brief immediately used it to filter by importance-as-size.
It surfaced the costume plot and the scenic build, then wrote *"deliberately left
out: pens, tissues, hole-punch"* as if that were discipline. **Michael pushed
back in the next turn and he was right.** Verbatim:

> *"those things you deliberately left out—like the purchase requests—are actually
> a high priority. Since I am the gatekeeper of purchases, those are easy things to
> get checked off and ordered. That is the exact kind of thing I tend to slip up on
> and forget because I am busy thinking about the big production requests and the
> work we still haven't even dug into. If I need to hop on Staples and order pens
> real quick, that is exactly what you should be reminding me when we sit down to
> begin work in the morning!"*

⭐ **The lesson, stated so no cold session re-derives it:** a two-minute task that
**only Michael can close** outranks a large task that cannot move today. The big
production problems are the ones he is *already* thinking about — they do not need
a reminder. **The brief's unique value is the cheap, closeable, easily-forgotten
thing with somebody waiting on the other end of it.**

🚫 **"Too small to mention" is not a category this hook recognizes.** The only test
is whether it is closeable and whether anyone is blocked. A crew without pens is
blocked. Trivia is what nobody is waiting on.

---

## 🛒 THE GATEKEEPER BLOCK — cheap, closeable, only-Michael

**Its own block, and it ships near the TOP of the brief, not the bottom.** These
are the items where Michael is the sole gate and the close is minutes.

**What qualifies:**

- **Purchase Requests** — he is the gatekeeper of purchases, full stop. Every open
  row is a decision only he can make.
- **Approvals and sign-offs** waiting on him specifically.
- Anything where the next action is literally *place the order / say yes / send the
  form* and no one else in the building can do it.

**How to present it — this block breaks the one-line rule ON PURPOSE:**

- **GROUP BY ERRAND, not by task.** "Six Staples-able rows, one order" is one
  decision; six separate lines is six decisions and he will make none of them.
  This is the one place where collapsing beats enumerating, and it is still LINKS —
  every row in the group is hyperlinked, just gathered under one action.
- **Lead with the errand and the elapsed age.** *"One Staples run clears five rows,
  oldest 12 days."*
- **Separate the errands that are genuinely different.** An office-supply order, a
  capital request (Mary's iMac), and a safety-stock item are three errands, not one.
- **Say what is blocked downstream** when something is: tape measures during a
  scenic build, ice packs during rehearsals, a first-aid kit at all.
- **Sort by age within the group.** An item aging quietly is the whole point.

⚠️ **This is the block most likely to rot into a nag.** Guard: it names the ERRAND
and the AGE, never "any update on this?" And when a row has been open for months
with no downstream block, the honest move is to ask whether it should exist — the
same kill question the slide block asks.

🚫 **The brief never orders anything, never spends money, never marks a request
approved.** It puts the errand in front of him. He is the gate; that is the point.

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
  ✅ **Documented exception: the Gatekeeper Block groups by errand** (above).
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
and that habit IS the input signal. **Plus every surface where he is the sole
gate** — Purchase Requests, approvals, FACILITIES tickets he owns.

**OUT, and each for a reason:**

- **Ricky's data routines** (F1 · On Track · Job Market) get **exactly one pointer
  line**: how many are due, and a link to his standing thread. They are not
  production work and they will eat the brief if invited in.
- **Craft hazard analysis and cited standards** → Hazard Hawthorne. The brief may
  say *a hazard is unassessed*; it never states what the hazard IS or cites a clause.
- **Season shape.** Michael decides what a season is. The brief reports what is
  happening inside it.
- **Anything requiring a decision the brief then acts on.** See Authority below.

⚠️ **"Small" is NOT an exclusion criterion.** See the Prime Directive § v1.2. The
WISH LIST is the honest edge case: it is a someday-shelf, not a gate, so it does
not ship as gatekeeper work — but an item on it that a live production needs this
week does.

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
   - 🔴 **Activity reads cap at 7 days per call AND TRUNCATE FURTHER WITHOUT
     WARNING.** Measured on the first dry run: a 7-day request returned **2.5
     days**. At that width the 2-move slide threshold is unprovable — everything
     shows one move. **CHAIN 2-3 CALLS** to reach a usable window, and **DECLARE
     the width you actually got**, never the width you asked for.
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

⭐ **CHAIN THE DEPENDENCIES, because that is the finding no single list can show.**
The first dry run's best catch was a pair, not an item: prelim costume design was
37 days overdue while first costume fittings were due that same day. **You cannot
fit costumes that were never designed.** Hunt that shape deliberately — a
deliverable overdue upstream of an event already on the calendar.

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
Directive, the threshold decides what is *eligible*; relevance decides what ships —
and relevance means consequence × sole-gatekeeper, not size.
⚠️ **A one-move slide is a CANDIDATE, labelled as one.** Say the window was too
narrow to prove a pattern rather than promoting it or silently dropping it.

**Carry the SLIDE COUNT on every one you do surface**, because the count is the
whole message: two is a pattern, four is a decision he has not made yet.

**Ask ONE blunt question, never a list of gentle observations:**
> *is this actually happening, or are we killing it?*

⭐ **Why that question and not "why is this late":** a repeat slide is almost never
laziness. It is a task that never had a real owner or a real next action. The
question that unblocks it is the one that lets him kill it.

**Founding-run examples (illustrative, will be stale):** `coordinate ECM calls for
load-in and strike` and `get new roadcases for lustrs and D40s` both slid 8/31 →
9/2. `Biometric Screening` and `Online Health Surveys` both pushed ~6 days. All
four showed ONE move at the 2.5-day width actually returned.

🚫 **Never mark a slide off a date you did not read this run.** A cleared date is
not a slide. A date set for the first time is not a slide.

---

## 🎯 THE BATCH DRILL — the part that makes it an assistant instead of a report

Michael, 2026-09-02: *"for like a batch of them you could say 'let's go drill into
these 5-10 right now and i've already left a single comment on each to try and
bump their next steps'."*

**This is the hook's one WRITE, and it is authorized.** Order matters:

1. **Pick the tasks worth drilling — 5-10 is the usual shape, not a quota.**
   Selection rule, in order: closest to a milestone → **sole-gatekeeper items he
   can close today** → highest slide count → blocking somebody else → oldest
   unowned. **Never a random sample, and never a filler pick to reach a number.**
   Four real ones beat ten with six passengers, because a batch with passengers
   teaches him to skim the block.
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
· change a date · place an order or approve a purchase · decide a season ·
adjudicate a craft disagreement · declare something safe to proceed.

⚠️ **A date change by an agent is indistinguishable from one by Michael**, which is
exactly why this hook does not make them: it would manufacture its own slide
signal and corrupt the next run's arithmetic.

---

## Output shape

Header line: date · lookback window ACTUALLY RETURNED · days since last brief ·
source health. Then these blocks, **omitting any that are empty**:

1. **🎭 TODAY** — what is on the boards, what is called tonight, what is due.
2. **🛒 GATEKEEPER** — cheap, closeable, only-Michael. Grouped by errand, aged.
   **High in the brief on purpose:** it is the block he forgets and the fastest
   value in the whole report.
3. **⏰ PRESSURE** — dated items landing before the next milestone, grouped by show,
   pressure order not date order. Chained dependencies called out as pairs.
4. **🔴 SLID** — slide counts and the one question. Candidates labelled as such.
5. **🕳️ GAPS** — unowned, unassessed, undated things a milestone is about to need.
6. **🎯 DRILL BATCH** — the already-commented tasks. Last, because it is the block
   he acts on.
7. **Routines** — one line. Count due, link to Ricky's thread. Never more.

Close with ONE question. Not a summary, not a recommendation list.

⚠️ **The block list is the ORDER, not a form to fill.** A day with no slides has no
SLID block and that is a clean brief, not an incomplete one.

---

## Known limits, stated because a cold session will not find them

- **ONE dry run, zero fired runs.** The 2026-09-02 preview produced findings and
  two corrections but posted no comments. A session that finds no prior run report
  SAYS SO instead of assuming this works.
- It cannot see a conversation. Only artifacts.
- It cannot read ClickUp automations. Any automation behaviour is testimony.
- It cannot tell a task with no date from a task that does not need one.
- **It cannot know what Michael already has in his head**, which is precisely why
  it must not filter for the impressive-sounding items: those are the ones he is
  already carrying.
- **It cannot make a slide matter.** Same limit the Task-Context Orientation Gate
  names about itself: the hook can surface the pattern; only Michael can break it.

## Provenance

Scoped 2026-09-02 08:16-09:10 ET, Mainstage Milo seated, QUESTION-ME loaded.
**Fold-in verdict: FOLD-IN, not net-new** — the Routine Ricky standing task
(`86ajuhw1d`) already carried *"save the ONE prompt Michael can run once a day to
kickstart procedures and routines and agents and comments and threads"* with one
unticked checklist item open since 2026-08-01. That task is a RECORD surface by
its own law, so the spec landed here and the checklist item became a pointer.

Six rulings by Michael, each traceable to a turn: **URITP production management,
not a cross-tool digest** ("you're my uritp guy") · **links over prose, 20-40
tasks** · **two slides qualifies for a callout** · **the brief pre-comments the
drill batch** · **v1.1: the numbers are scale and scope, NOT a checklist** ·
**v1.2: relevance is CONSEQUENCE × SOLE-GATEKEEPER, never magnitude** — earned by
pushback on the first dry run, where the brief used its new judgement to discard
exactly the work Michael most needs reminding of.

⭐ **The two corrections are a matched pair and belong read together:** v1.1 stopped
the brief padding to a number; v1.2 stopped it filtering by size. Both are the same
underlying error — substituting a proxy for judgement.
