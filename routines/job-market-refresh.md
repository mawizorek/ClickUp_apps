---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
steward: routine-ricky
cadence: pointer only — authoritative cadence is the row in routines/schedule.md
state: ClickUp Job Census list (1400600000006272) + Lanes list (1400600000006271) + Job Sources list (901328152493), space CV and Applications
lane_contracts: ClickUp Lanes tasks (one per role_id; description begins `Lane id: <role_id>`)
legacy_state_dir: routines/job-market-state/ (FROZEN 2026-11-22, read-only, migrate-on-first-touch)
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 21
model: search-first, loop-per-role, write-per-role, resumable-by-derivation
---

> ⚠️ **Frontmatter is metadata, never a switch.** `routines/schedule.md`'s table is the ONLY on/off switch
> (LOCKED 2026-07-30, Michael). Never decide whether to run this from the header above.

# Job Market Refresh

goal:       **find the jobs that are open today.** Every pass searches wide and deep for each lane, then
            restates the entire live market (same, new, disappeared) to one standing ClickUp thread, with
            the ClickUp **Job Census** as the structured database behind it.
target:     **Job Census** list `1400600000006272` (source of truth, one task per posting per board) ·
            **Lanes** list `1400600000006271` (one task per lane: the lane's search contract + `Last Pass`) ·
            **Job Sources** list `901328152493` (one task per board) · the standing thread `86ajtgbt3`
            (read surface) · `routines/last-run/job-market.txt` (stamp).
            **Writes census rows, lane stamps and source sweep fields only. Sends nothing.**
report-to:  DETAIL → the standing thread `86ajtgbt3`. ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports
            · https://app.clickup.com/t/86ajuhw1d

**What a cold executor reads. Nothing else.**

- **This file**: the procedure, global constraints, sweep laws, evidence ladder, census schema, guardrails.
- **`job-market-templates.md`**: output shape only.
- **ClickUp, at run time**: each lane's task in [Lanes](https://app.clickup.com/36074068/v/li/1400600000006271) (keywords, levels, exclude terms,
  constraints) and the boards in [Job Sources](https://app.clickup.com/36074068/v/li/901328152493) that link that lane.
- **Liveness**: `brain-config/hooks/source-freshness-gate.md` Rule 7.

🪦 **Tombstoned 2026-11-22, never read for procedure or state:** `job-market-roles.json`,
`job-market-sources.md`, `job-market-sources-remote.md`, `job-market-sources-experiential.md`,
`job-market-refresh.notes.md`, `job-market-schema.md`, `job-market-state.tsv`,
`job-market-state/_MIGRATION.md`, `job-market-state/_unfiled.tsv`. Their history lives in git and their
rulings in the Job Market Decision Log (https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-81593), J1 through J36.

**WHAT this does.** The WHEN lives in `routines/schedule.md`. The universal floor lives in
`routines/README.md`, including **THE STAMP LAW**, **rule 13 (complete loops)** and **rule 14 (commit at
the boundary)**.

---

## 🗄️ v20 CUTOVER: the repo is no longer the database (2026-11-22, Michael)

Michael: *"merge it so the next run doesn't try and store long for repo indexes."*

- 🔴 **Pass state lives in ClickUp.** Census rows are tasks in **Job Census**. Lane coverage is the
  `Last Pass` date on that lane's task in **Lanes**. The thread and the stamp file are unchanged.
- 🧊 **`routines/job-market-state/*.tsv` is FROZEN.** Read-only history. **Never write, append to, commit
  or re-create a lane TSV.** No new TSV for a new lane, no `_unfiled.tsv` rows.
- 🔁 **Migrate on first touch.** A lane whose census has no rows yet (every lane except
  `production-manager` at cutover) loads its frozen TSV's `live` rows **once**, as the comparison
  baseline, the first time a pass reaches it. Reconcile the sweep against those rows, then write the
  result into the census. Graves (`gone` rows) do not migrate. After that, the TSV is never read again.
- ✅ **`production-manager` is migrated** (2026-11-21; strict recheck 2026-11-22).
- Provenance: Decision Log **J9** and **J10**.

## 🧩 v21: Lanes tasks ARE the lane config (2026-11-22, Michael)

Michael: *"make the lane task the actual definition of keywords and such."* Procedure stays here in the
repo; ClickUp holds every piece of data the loop fills or reads.

- 🔴 **Each lane's search contract lives in its Lanes task description**: `Lane id`, display name,
  `Keywords`, `Levels`, `Exclude terms`, `Constraints`, source seams, dated ruling notes. Read it at the
  top of that lane. **Never read `roles.json`**; it is a tombstone.
- 🔴 **Boards live in Job Sources.** A lane's board set = Job Sources tasks whose `Lane` relationship
  links that lane (general boards link all nine). Entry URL, access, tier, alternate doors and yield notes
  are on the source task.
- **Global constraints, sweep laws and the evidence ladder** moved into this file (below).
- **Contract edits** (keywords, levels, excludes) happen on the Lanes task, between passes, never mid-pass.
  A dated one-line note on the task names who ruled and when; the ruling itself goes in the Decision Log.

---

## 🔴 THE THREE RULES v18 EXISTS FOR (2026-08-31)

### 1. 🔍 SEARCH FIRST, RECONCILE SECOND

**Open every role by searching, not by reading what you already have.** Say it out loud and mean it:
*"Today I am beginning my job search for Michael for production manager positions."* Then go find jobs.

🔴 **The lane's census rows are what you COMPARE TO at the end. They are never what you START FROM.**
Michael: *"I don't know why you would use the existing data as your starting point when the whole point
is to find new things anyway! You should just be searching wide and deep to find jobs."*

- ⭐ **The value of a pass is what it FINDS, not what it CONFIRMS.** Verification is a side-service.
  Three real new jobs and zero verifications is a good pass; total verification and no finds is a status
  report.
- 🔴 **"I cannot verify my old rows" NEVER decides whether to search.** Two unrelated questions;
  collapsing them cost a full pass on 08-31.
- ⚠️ **Unverifiable carries are a REPORTING problem, not a search problem.** Leave `Last Verified` blank,
  name the board, move on. Never let them gate the sweep.

### 2. 🚪 A DOOR IS NOT A BOARD

**An index page failing means that ENTRY POINT failed.** Before recording a board unreachable, try:

1. **A web search scoped to that board**: `site:` or `"<board name>" "<role keyword>"`. 🔴 **On 08-31
   Playbill and StageLync listings were fully reachable this way while both index pages hard-failed.**
2. **A different documented entry point** (department index vs keyword search vs employer index; the
   source task lists them).
3. **The employer's own careers page**, once a sighting names the org.

⚠️ **Only after the other doors fail is a board ❌.** And say which door you tried.

### 3. 🚫 NO LANE IS SKIPPED FOR BROKEN SOURCES

The lock already forbade skipping a lane for being THIN. **It equally forbids skipping one because its
boards are down.**

- **Walk the fixed lane order from lane 1.** If you genuinely must deviate, **say so in the first line**.
- **A lane with 6 of 13 boards reachable still gets swept and reported.** Michael: *"Even if seven are
  down, luckily you still have six more. It's tough, but finding at least three is a start."*
- **A lane you could barely sweep gets a header, a block and its census write like any other**, with the
  dead boards named on the zero-yield line.

---

## 🔢 The fixed lane order

This list IS the loop. Each `role_id` maps to exactly one Lanes task (description begins
`Lane id: <role_id>`).

1. `production-manager`
2. `technical-director`
3. `stage-manager`
4. `electrician`
5. `operations-safety`
6. `audio-sound`
7. `drafting-design`
8. `creative-admin`
9. `producing-artistic`

⚠️ **Changing this order mid-pass corrupts a resume.** Order changes happen in a build session only.

**Adding a lane:** Michael approves it. Create one Lanes task (status `active`, description
`Lane id: <role_id>` + the contract fields), link its boards in Job Sources, add the id to this list in a
build session. **No TSV, no JSON.**
**Retiring a lane:** requires Michael. See the no-lane-is-ever-skipped lock.

```
RESUME SCAN -> fresh, or resume at lane N?
for each lane in the fixed order (from the resume point):
    0. read the lane's Lanes task contract + its Job Sources boards
    1. SEARCH WIDE AND DEEP                <- FIRST. every keyword, every board, every door
    2. read this lane's census rows         <- NOW. the thing you compare to (frozen TSV on first touch)
    3. apply exclude terms + global constraints
    4. reconcile -> SAME / NEW / GONE       <- liveness by Rule 7 only
    5. post the lane's comment block        <- leaves E1 (anchor), E5 (timestamp), E7 (zero-yield)
    6. WRITE the census, then set Last Pass <- leaves E2 + E6, and is the boundary
    7. move to next lane
```

**Single-lane invocation:** *"do job search for stage manager"* → resolve the name against Lanes task
names. Same template, same depth, same census write. Does NOT stamp and does NOT satisfy the density
floor. **Mark its header `top-up`.** A top-up sets that lane's `Last Pass` only if the sweep was complete.

---

## 🔀 THE RESUME SCAN: derive where you are, never be told

**A pass may span several sessions.** Work out whether you are starting one or continuing one **by
looking at what happened, not by reading a note that says what happened.**

1. **Read the standing thread's ROOT comments**, text AND posted-at timestamps. Role headers carry
   `` `<role_id>` · pass `<YYYY-MM-DD HH:MM>` `` as their last line.
2. **CURRENT PASS** = the newest pass anchor among role headers.
3. **Is there a `📋 PASS COMPLETE` with that same anchor?** Yes → ▶️ **FRESH PASS**, start at lane 1.
   No → continue.
4. **Walk the fixed lane order.** The **first lane with no header under the current anchor** is your
   resume point.
5. **Verify the boundary lane**, the last one that DOES have a header. Does it have its threaded block
   (SAME / ALSO / NEW / GONE / NOTABLE), **and does its Lanes task carry `Last Pass` = the current
   anchor?** **If either is missing, THAT lane is the resume point.**
6. **Cross-check the stamp.** Stamp NEWER than the current anchor = contradiction. **Say so and ask.**
7. **Staleness: compute it (E5).** Newest comment in this pass vs now. Older than one cadence interval
   (>24h) = **ABANDONED, not resumable.** ▶️ Fresh pass, and **name the orphaned lanes.**
   🔴 **A NEW CALENDAR DAY IS ALWAYS A FRESH PASS** (`schedule.md`, LOCKED 2026-08-06). "Ground one"
   restarts the LOOP; it never wipes census rows.
8. **Reconstruct coverage for free (E6 + E7).** Boards that yielded = distinct `Source` links on census
   rows **created at or after the anchor** for that lane. Boards swept with zero yield = the zero-yield
   lines.
9. **Now read the checkpoint (E4)**, if one exists. Its only unique content is *why* the pass stopped.
   Disagreement → **trust your scan and edit the checkpoint** (Template 9).

**State the outcome in your first line, with the arithmetic**, e.g. *"RESUME at `operations-safety`:
pass 2026-08-04 13:20 has headers for 4 of 9 lanes, no PASS COMPLETE, newest comment 41 minutes ago so
it is live not abandoned."*

🚫 **Never resume from a checkpoint's CONTENT.** What is captured lives in the census.
⚠️ **The scan tells you WHERE to start. It never tells you WHETHER to search** (rule 1).

### Evidence ladder

- **E1, role headers:** root comments carrying `<role_id> · pass <YYYY-MM-DD HH:MM>` prove which lanes
  were attempted under the current anchor.
- **E2, Census + Lanes boundary:** census rows written for the lane, together with its Lanes task's
  `Last Pass`, prove the lane landed. Blank `Last Pass` or no census write = the boundary did not land.
- **E3, stamp:** `routines/last-run/job-market.txt` corroborates a complete pass. Written last.
- **E4, checkpoint:** optional human courtesy saying why work stopped. A hint, never resume authority,
  never row data.
- **E5, comment timestamps:** derive elapsed time, session gaps and abandoned-vs-resumable. Never
  remember these in prose.
- **E6, `Source` relationships:** `Source` links on rows created at or after the anchor show which boards
  yielded.
- **E7, zero-yield line:** the one negative result that otherwise leaves no artifact. `swept-zero` is not
  `not-hit`, stale, degraded or carried.

**The only non-derivable fact is a negative result.** Make it explicit on the role header.

---

## 🌐 Global constraints (apply to every lane)

**Search scope.** Geography anywhere · relocation live · remote, part-time and contract IN · academic
not excluded (tenure-track only if a genuine step up) · internships OUT · overhire, day-call and
show-by-show crew work OUT by default.

**Overhire exception (Michael, 2026-09-10).** Inside the home radius, show-by-show work QUALIFIES and
gets rowed: no relocation, no notice, availability income Michael can take. Rate is not the test and
there is no floor (*"open to far less esp if it's nearby,"* 2026-09-02). Mark these `Level` = `contract`
and `Accessibility` = `home`.

**Home base.** Rochester, NY, radius **90 miles** (reaches Buffalo ~75mi and Syracuse ~87mi). Not a
preference: it only defines `home`. ⚠️ Ask Michael before widening it; never grow it to make a find
qualify.

**Accessibility tiers** (reporting tiers, not filters; a row may carry several):

- `remote`: the posting body explicitly says remote or fully distributed. **Quote the words.** A board
  card reading "(Remote)" over a body reading "Work Location: In-office" is refused; the BODY wins.
  Capture required states, travel and in-person obligations in the location line. 🔴 A CONDITIONAL
  arrangement ("Fridays may be remote with approval", "option to be fully remote") is `hybrid`.
  "Fully remote" or "100% remote" is the bar.
- `hybrid`: body states hybrid or partial remote with a named onsite anchor. Never inferred.
- `home`: inside the 90-mile radius. The ONE derivable tier (arithmetic on a stated location).
- `immediate`: start now/ASAP/open-until-filled AND rolling applications. Speed to work, never geography.
- Open question, platform-structural remote (Upwork, Cad Crowd): until ruled, tag it and write
  *"platform-structural, NOT a body quote"* in the description.
- The pass summary carries an ACCESSIBLE block listing every tagged row; empty → say so.

**Remote reality.** Remote never appeared because no keyword asked for it and the venue boards are
venue-bound; the fix was sources, not a flag. Plausible remote lanes: drafting-design (strongest),
creative-admin, producing-artistic (partial). Electrician has only a narrow show-programming exception
(show files, timecoded pixel/LED, previz). Audio has a file-deliverable exception. Stage-manager and
operations-safety are in-room (one narrow safety-planning probe per pass). Calibration: **3-8** remote
rows across all lanes in a venue-board sweep.

**Portfolio breadth** (secondary; must not eat the nine-lane budget). Teaching targets: online adjunct,
curriculum/instructional design, course authoring, software training, portfolio review, SME/AI
training. Gate: Michael holds a BS and a BA, no MFA/PhD; terminal-degree postings are flagged, never
presented as fit. Audio/writing targets: remote audio post, audio QA/listening evaluation, annotation,
technical writing, audio SME/AI training. Gate is portfolio, not credentials. Production paperwork as a
service and paid trade editorial returned no real market; do not re-sweep them.

**Candidate credentials (for requirement matching, never for invention).**

- Education: BS Audio and Music Engineering (2023) + BA English: Theatre (2023), University of Rochester.
- Software held: Vectorworks (Spotlight, 3D drafting, Braceworks calculations) · ETC Eos · Lightwright 6
  · KiCad · Logic Pro · Mainstage · C/C++ · 3D print design.
- **Not held:** AutoCAD (deferred to ~summer 2027, not excluded), Revit. AutoCAD-required postings still
  get rowed with the requirement named.
- Safety training held: Introduction to Safety and Health Management (OTI Education Center, RIT, Feb
  2026); Principles of Emergency Planning for Live Events (Risky Business Resources, Oct 2025).
- Wanted, not held: ETCP · OSHA 30 · formal crowd-management certification.
- Braceworks is held: sweep rigging vendors against it as its own target.

**Live-window rule.** A posting has up to three time facts: posted · application close (or soft hiring
window) · engagement window. Capture all three in the description. If the hiring or engagement window
has passed, it is NOTABLE prose, never a live row. Undetermined → *"open status unconfirmed"*.

**Density floor.** Under **40** total live = DECLARED FAILURE, no stamp. A tripwire, not a target; judge
depth by source coverage. Old counts measure sweep reach, never the market.

---

## 🧭 Sweep laws (cross-board procedure)

**Department-index law.** Keyword search alone under-reports. **Browse every relevant department or
category index**, not only keyword search. Know the unfiltered count first and confirm the filter
changed it; a wrong parameter returns the whole board and looks like a great sweep. Paginated boards: at
least 3 pages or until irrelevant. Exact index paths live on the board's Job Sources task.

**Source states.** Tier 1 mandatory · Tier 2 rotated · Tier 3 opportunistic (tier is on the source
task). Tiers do not predict lane yield. Keep `swept-zero`, `not-hit`, stale and degraded distinct.
Correct a wrong URL on the source task before blaming the board.

**Recovery for a gated or unlinked sighting.** Search `"<title>" "<org>"`; prefer the employer ATS or
careers page, then the primary board, then a dated first-party page. Mirrors are pointers only and
never outrank the employer. Two failed recoveries → NOTABLE. No working direct URL → no row.

**Cross-posts and source of record.** One census task **per board**. Multi-lane seat = one task, several
`Lane` links. Board + employer ATS for one seat: the ATS wins. Same job id/URL with refreshed metadata =
re-post, not a new seat.

**Lane source seams.**

- **Operations & Safety:** theatre/venue operations AND the separate venue/arena/municipal safety half
  (TeamWork Online, GovernmentJobs/NEOGOV, venue careers, UK major venues). Security guarding is not
  safety management; read the duties.
- **Drafting / Design:** read theatre, experiential and remote boards before calling it thin. Sweep
  rigging vendors, employer ATSs and drafting-service routes.
- **Creative Administration:** sweep the remote development/grants/marketing routes before calling it
  thin. Remote is not location-free.
- **Producing / Artistic:** remote is narrow: literary/programming and explicit remote contract-producer
  routes only.
- **Electrician / Audio / Stage Manager:** no general remote sweep; only the explicit exceptions above.

**Source upkeep (the one ClickUp write besides census and lanes).** After sweeping a board, set its
Job Sources `Last Swept` (date) and `Last Yield` (qualifying rows this pass). If a door changed, fix
`Entry URL` or `Access` on the source task and say so in SOURCES. A new board found mid-pass gets a Job
Sources task with its `Lane` links; never a markdown list.

---

## 📊 Census schema (ClickUp), canonical

**One task per listing per board, in Job Census.** Cross-posted between boards = two tasks.
Cross-LANE = one task with several `Lane` links. **Fields are defined once at the Space level** (CV and
Applications) and inherited.

**Task name:** `Org · Title`. Add `(Board)` only to tell apart two board rows of the same seat.

**Statuses:** `live` (open) · `filled` (done; known filled) · `expired` (done; close date passed or
the posting says closed) · `gone` (closed type; vanished or no longer open). ⚠️ If `gone` is missing
from the list, use `expired` and flag it in NOTABLE; never invent a status.

**Fields:**

- `Posting URL` (url): **THE validity gate AND the dedupe key. No URL = no row.** Before creating a
  row, query the census for that URL; a match is SAME, never a second row.
- `Lane` (relationship → Lanes, multi): the home lane first, plus every other lane it serves. A real
  job no lane covers = no row; it goes in NOTABLE with the config gap named.
- `Source` (relationship → Job Sources): the board it was found on. Blank for employer-direct routes;
  the board is still named in the description.
- `Application` (relationship → Applications): set when Michael acts on it.
- `Company` (short text): the org, verbatim.
- `Salary` (number): the annualized USD floor, **only** when a USD annual or monthly figure is stated.
  Blank otherwise. **Never estimated.** The verbatim text lives in the description.
- `Level` (dropdown): `senior` / `mid` / `associate` / `entry` / `contract`.
- `Friction` (dropdown): `direct` / `email` / `gated`.
- `Accessibility` (labels): `remote` / `hybrid` / `home` / `immediate`, per **Global constraints**.
- `Close Date` (date): the posting's deadline. 🚫 **Never the native due date.**
- `Last Verified` (date): 🔴 **set ONLY on a Rule 7 OPEN verdict** (data feed, cache-busted body plus
  action route, or Michael's browser). A plain fetch never earns it. UNCONFIRMED leaves it blank, and a
  stale date is **cleared**. Blank = never verified.

**Description, a clean reference surface, in this order:** `**Salary (verbatim):**` · `**Location:**` ·
`**Posted:** <board date> · **First seen:** <date>` · `**Board:**` · `**Requirements:**` (quoted,
semicolon-separated, platforms named: `AutoCAD; Revit`, never `CAD software`) · any remote/hybrid quote ·
live-window facts · status notes · `Legacy id: <JM-…>` for migrated rows. Empty requirements means
**NOT CAPTURED**, never *none required*.

**Lanes task:** `Last Pass` (date + time) = the pass anchor of the last pass that **fully** swept and
reported that lane. Never set it for a partial sweep. The description is the lane contract.

**Old TSV → census mapping (migrate-on-first-touch):** `id` → `Legacy id:` line · `role_id` +
`also_lanes` → `Lane` · `title` + `org` → name + `Company` · `location` / `posted` / `first_seen` /
`requirements` → description · `site` → `Source` (+ board named in the description) · `url` →
`Posting URL` · `salary` → verbatim in the description + `Salary` floor · `level` / `friction` /
`accessibility` → the same-named fields · `status` `live` → `live`, `acted` → `live` + `Application`,
`gone` → not migrated. **`Last Verified` stays blank on migration** unless a Rule 7 check is run.

- ⚠️ **The schema and the lane contracts may only change in a BUILD session, never inside a pass**
  (README rule 7).

Board codes (descriptions and legacy ids) are the `Code` field on each Job Sources task.

---

## 🎯 Target profile

**Per lane:** the Lanes task contract. **Across lanes:** Global constraints above. Evaluation (what makes
a listing INTERESTING rather than QUALIFYING) lives in `routines/job-market-evaluation.md`, Corso's, not
the executor's.

- **Geography: ANYWHERE.** Relocation live. Remote included. Part-time and contract are IN.
- **Level: ALL** except pure overhire/day-call (outside the home exception).
- **OUT:** manufacturing/industrial/logistics · crew calls, single-day overhire, internships · academic
  tenure-track (unless a genuine step up) · each lane's `Exclude terms`.

---

## Steps

### Pre-loop

1. 🔀 **RUN THE RESUME SCAN.** State FRESH or RESUME-at-`<role_id>` in your first line, with the arithmetic.
2. **Read the nine Lanes tasks in the fixed order** (one query on the Lanes list; descriptions are the
   contracts). Dated rulings: the Decision Log, only when proposing a change someone may have settled.
3. **If RESUMING:** start at the derived lane. Do NOT re-sweep a lane with a header AND `Last Pass` =
   the current anchor. Keep the ORIGINAL pass anchor on every remaining header. Edit any stale checkpoint
   to `✅ SPENT`.
4. **If single-lane invocation:** that lane only; mark the header `top-up`.
5. **Check reactions** on the previous pass's NEW listing comments; they inform Spotlight.

🚫 **Do NOT read the census rows yet.** That is step 7, deliberately.

### The loop: for each lane, IN THE FIXED ORDER, from the resume point

6. 🔍 **SEARCH WIDE AND DEEP. This is the first act of every lane and the whole point of the routine.**
   - Pull the lane's boards: Job Sources tasks whose `Lane` links this lane.
   - Try **EACH keyword** from the Lanes task independently, not just the first that returns hits.
   - 🔴 **Browse the department/category INDEX pages** (Sweep laws). Know the unfiltered count first.
   - Paginated boards: at least 3 pages deep. Date-sorted boards: scan both "newest" and "relevance".
   - 🚪 **If a board's index fails, try the other doors** (rule 2) before recording it ❌.
   - 0 results on all keywords → try adjacent terms and synonyms before marking a board dry.
   - **Minimum coverage:** ALL Tier 1 sources reachable that day, and at least 4 Tier 2.
   - **📝 Keep a running list of boards you swept that returned NOTHING.** It goes on the lane header.
   - Capture a **direct URL** and friction type for every qualifier. Recover gated/unlinked URLs per
     Sweep laws.
   - 🏷️ **Capture `Accessibility`, requirements and live-window facts AT THE SOURCE**, while the posting
     is open. None can be reconstructed later, and `remote` cannot be inferred at all.
7. **NOW read this lane's census rows**: `query_tasks` on Job Census where `Lane` links this lane's
   task and status = `live`. Every row with more than one `Lane` link is an `↔️ ALSO` pointer.
   **First touch** (no census rows for the lane): read its frozen TSV's `live` rows once instead.
8. **Apply the lane's `Exclude terms` and the Global constraints.**
9. **Reconcile, with liveness by Rule 7:**
   - Matched AND Rule 7 OPEN = **SAME**, verified (days-on-board = today − posted).
   - Matched but not OPEN-proven = **SAME, unverified**. "Carried" and "verified" never share a mark.
   - New find with URL (no URL match in the census) = **NEW**.
   - Existing row Rule 7 CLOSED (404, closed banner, close date passed) = **GONE**.
   - Existing row simply not re-found = a GONE *candidate* for NOTABLE. **Never GONE off a missed
     search, an unreachable board or a stale cache.**
   - Qualifies but no lane fits = NOTABLE, with the config gap named. **No row.**
10. **Post the lane's comment block** per `job-market-templates.md`: header as ROOT **including the
    zero-yield line and the machine anchor** (capture its comment ID), then SAME · ALSO · each NEW
    individually · GONE · NOTABLE as threaded replies. Each NEW reply links its census task. If the sweep
    turns up more after the header goes up, **edit the header.**
11. 💾 **WRITE THE CENSUS, then stamp the lane.** In this order:
    a. **NEW** → one Job Census task per row, status `live`, every field the posting supports. Check the
       `Posting URL` dedupe first.
    b. **First touch only** → create the baseline's still-live rows the same way, with a `Legacy id:`
       line. Graves stay in the TSV.
    c. **SAME verified** → `Last Verified` = today. **SAME unverified** → leave it, or clear a stale one.
    d. **GONE** → status `gone` (or `expired` if the close date passed), dated one-line closure-proof
       note in the description, `Last Verified` cleared.
    e. **Sources** → `Last Swept` and `Last Yield` on every board swept for this lane.
    f. Bulk changes go through `query_tasks UPDATE` (preview, then apply; inside a scheduled pass the
       routine's own write authority applies; interactively, follow the 5+ confirmation rule).
    g. **Only after a-e land:** set this lane's `Last Pass` = the pass anchor, and only if the sweep was
       complete. That stamp IS the boundary.
12. **Repeat from step 6.** **A lane with a header but no block, or a block but no `Last Pass`, is a
    broken loop**, and the Resume Scan will correctly send the next session back to redo it.

### Post-loop

13. **Density check.** Under 40 total live = **DECLARED FAILURE**: name which sources were blocked or
    thin and what retry was attempted, and do NOT stamp. Written census rows stay written.
14. **Lane-misfits**: list them in the PASS SUMMARY with the config gap named.
15. **Post 📋 PASS SUMMARY** as a ROOT comment (Template 6) **carrying the pass anchor**. Compute
    `Sessions` and both elapsed figures from comment timestamps. Include ⚡ Spotlight and ACCESSIBLE.
16. **Post 🔌 SOURCES** as a reply to the summary, then edit the summary to add the link. Build it from
    E6 and E7, not from memory. Keep ✅ yielded · ⚪ swept-zero · 🕐 stale · ⚠️ degraded · ❌ not-hit
    **all distinct.**
17. **Edit any checkpoint from this pass to `✅ SPENT`** (Template 9).
18. **STAMP**, *last write, only if the pass succeeded.* `routines/last-run/job-market.txt`, one line,
    `YYYY-MM-DD HH:MM` ET **of when it landed.** Per THE STAMP LAW: complete pass stamps · blocked board
    with the inventory landed is a PARTIAL and stamps with the gap named · **below-floor, aborted or
    top-up does NOT stamp.** This one-line file is the only repo write a pass makes.
19. **Post the roll-up** to 🧭 STANDING · Routine Ricky — Run Reports (https://app.clickup.com/t/86ajuhw1d), linking the pass
    summary and the Job Census. Include the `Ledger:` line.

### If you must stop mid-loop

Stop at a **lane boundary**, never inside one. Every finished lane already has its census rows written,
its `Last Pass` set and its header posted. A `⏸️ CHECKPOINT` (Template 8) is **optional and for humans**:
the one thing worth writing is *why* you stopped. **Do not stamp.** 🚫 Never paste row data into a
checkpoint; write it to the census.

---

## Guardrails (STOP + flag if any is true)

**The v18 three:**

- 🔴 **You are about to read the census before you have searched.** Search first.
- 🔴 **You are reasoning "I cannot verify what I hold, so there is no point searching."** Search anyway.
- 🔴 **You are about to record a board unreachable because its INDEX failed.** Try the other doors; name
  the door you tried.
- 🔴 **You are about to skip a lane because its sources are down**, or jump to an easier lane without
  saying so.

**The v20/v21 storage rules:**

- 🔴 **You are about to open `job-market-roles.json`, a `job-market-sources*.md`, the notes file or the
  schema file for procedure or config.** Tombstones. Lanes tasks, Job Sources tasks and this file.
- 🔴 **You are about to write, append to, commit or create a file under `routines/job-market-state/`.**
  FROZEN. The only repo write a pass makes is the stamp.
- 🔴 **You are about to read a lane's frozen TSV when that lane already has census rows.**
- 🔴 **You are about to set `Last Verified` from a plain page fetch**, or leave a stale one on a row you
  could not prove.
- 🔴 **You are about to create a census row without checking `Posting URL` for a duplicate.**
- **You are about to set a lane's `Last Pass` before its rows are written**, or for a partial sweep.
- **You are about to use the native due date for a close date.** `Close Date` field only.
- **You are about to edit a Lanes contract or the lane order mid-pass.** That corrupts a resume.

**Standing:**

- **You are about to write a status into prose.** Only a board swept with zero yield needs stating.
- **You are about to trust a checkpoint instead of deriving position**, or skip the Resume Scan.
- **The stamp is newer than the newest pass anchor** → contradiction. Say so and ask.
- **You are about to resume a pass more than a cadence interval old**, or inherit one from a previous
  CALENDAR DAY. Both are ABANDONED → fresh pass, name the orphaned lanes.
- **You are about to re-sweep a lane that has a header AND `Last Pass` = the current anchor.** Done.
- **You are about to skip a lane that has a header but NO block or NO `Last Pass`.** Not done.
- **You are about to post a lane header without the anchor line or the zero-yield line.**
- **You are about to blur yielded / swept-zero / stale / not-hit**, or let "carried" wear a ✅.
- **You are about to mark a row GONE because a board was unreachable, a search missed it or a cache was
  stale.**
- **You are about to tag `remote` or `hybrid` from anything other than the posting body's own words.**
- **You are about to fold `immediate` into geography**, or treat empty requirements as "none required".
- **You are about to stamp a partial pass or a top-up.**
- **You are about to post SAME, ALSO, NEW, GONE or NOTABLE as a ROOT comment**, or lump NEWs together.
- **You are about to start the next lane without writing the current one and setting its `Last Pass`.**
- **You are about to create a ClickUp task anywhere other than Job Census (rows) or Job Sources (a new
  board)**, or **send anything.**
- **You are about to create a census row for a REJECTED find or a lane-misfit.** NOTABLE prose.
- **You are about to paste row data into a comment** for a later session to apply. Write the row.
- **You are about to create a second research task or thread.** `86ajtgbt3` or nothing.
- **You are about to conclude a role "does not exist" because a keyword returned zero.**
- **You are about to propose cutting a keyword that returned nothing.** Ruled twice, wrong both times.
- **A listing has no working direct URL** → no row. Never invent a URL.
- **A listing is flagged "reported for review" on its board** → NOTABLE only.
- **Total live is under 40** → DECLARED FAILURE.
- **You would post a markdown table** → STOP. Mobile-first, stacked blocks only.
- **You would aggregate lanes into one shared block** → STOP. Loop, not summary.
- **You are tempted to shorten the sweep because the pass is long** → STOP. Rule 13.
- **You would skip the department indexes** because keyword search returned plenty → volume is not
  coverage.
- **You would replay every missed day on a catch-up** → a late pass is ONE pass covering more days.
- **A board name in SOURCES is plain text** → every board name links to its Job Sources entry.
- **You are about to quote a byte cap you have not measured** → README rule 14.

---

## Invocation modes

- **Pick this up** ("pick this up" on the standing task): Resume Scan first, then a fresh full loop or a
  resume. The primary door.
- **Full loop** ("run job market refresh", or the cadence is due): all nine lanes in the fixed order.
- **Single lane** ("do job search for [lane]"): one lane, same depth, `top-up`, no stamp.
- **Add lane** ("add [lane] to job search"): Michael approves → create the Lanes task + Job Sources
  links → add to the fixed order in a build session → run that lane.

---

## Error posture

- **A failure on one board never stops the lane. A failure in one lane never stops the pass.**
- **Best-effort + flag**: capture what is reachable, name what is not.
- **A failed/stopped run leaves the last-run file untouched** so it stays overdue and self-heals.
- **Report failures in the reply, not by DM.**
- ⚠️ **A BLOCKER IS A CLAIM, AND CLAIMS EXPIRE.** Re-test a recorded blocker before citing it.

---

## Changelog

- **v21 (2026-11-22):** Lanes tasks own lane contracts (keywords, levels, excludes, constraints); Job
  Sources owns boards, with `Last Swept`/`Last Yield` upkeep per pass; fixed nine-lane order lives here.
  Global constraints, sweep laws and the evidence ladder ported in. `roles.json`, the three sources files,
  notes, schema, `job-market-state.tsv`, `_MIGRATION.md` and `_unfiled.tsv` tombstoned. Rulings J11-J36
  ported to the Decision Log.
- **v20 (2026-11-22):** ClickUp Job Census is the database; lane TSVs frozen; migrate-on-first-touch.
- **v18-v19:** search-first, door-is-not-a-board, no-lane-skipped. Earlier history: git log.
