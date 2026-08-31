---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
steward: routine-ricky
cadence: pointer only — authoritative cadence is the row in routines/schedule.md
state_dir: routines/job-market-state/
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 18
model: search-first, loop-per-role, commit-per-role, resumable-by-derivation
---

> ⚠️ **Frontmatter is metadata, never a switch.** `routines/schedule.md`'s table is the ONLY on/off switch
> (LOCKED 2026-07-30, Michael). Never decide whether to run this from the header above.

# Job Market Refresh

goal:       **find the jobs that are open today.** Every pass searches wide and deep for each configured
            role, then restates the entire live market — same, new, disappeared — to one standing ClickUp
            thread, with per-lane TSV files as the structured index behind it.
target:     `routines/job-market-state/<role_id>.tsv` (source of truth, one per lane) · the standing
            thread `86ajtgbt3` (read surface) · `routines/last-run/job-market.txt` (stamp).
            **Creates no tasks and sends nothing.**
report-to:  DETAIL → the standing thread `86ajtgbt3`. ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports
            · https://app.clickup.com/t/86ajuhw1d

**This runbook is 1 of 4 files. Read all four before a pass:**

| File | Holds |
|------|-------|
| `job-market-refresh.md` | **this file** — the Resume Scan, the steps, the guardrails. **Procedure only.** |
| `job-market-refresh.notes.md` | **WHY** — locked decisions, architecture, the failure log, the changelog |
| `job-market-templates.md` | comment architecture, the pass anchor, templates 1-9, board URLs |
| `job-market-sources.md` | the source list, board access notes, density expectations |

**WHAT this does.** The WHEN lives in `routines/schedule.md`. The universal floor lives in
`routines/README.md` — including **THE STAMP LAW**, **rule 13 (complete loops)** and **rule 14 (commit at
the boundary)**.

---

## 🔴 THE THREE RULES v18 EXISTS FOR (2026-08-31)

Read these before the steps. Full failure log: `job-market-refresh.notes.md`.

### 1. 🔍 SEARCH FIRST, RECONCILE SECOND

**Open every role by searching, not by reading what you already have.** Say it out loud and mean it:
*"Today I am beginning my job search for Michael for production manager positions."* Then go find jobs.

🔴 **The lane file is what you COMPARE TO at the end. It is never what you START FROM.** Michael:
*"I don't know why you would use the existing data as your starting point when the whole point is to find
new things anyway! You should just be searching wide and deep to find jobs."*

- ⭐ **The value of a pass is what it FINDS, not what it CONFIRMS.** Verification is a side-service.
  Three real new jobs and zero verifications is a good pass; total verification and no finds is a status
  report.
- 🔴 **"I cannot verify my old rows" NEVER decides whether to search.** Those are two unrelated
  questions and collapsing them cost a full pass on 08-31.
- ⚠️ **Unverifiable carries are a REPORTING problem, not a search problem.** Mark them unverified, name
  the board, move on. Never let them gate the sweep.

### 2. 🚪 A DOOR IS NOT A BOARD

**An index page failing means that ENTRY POINT failed.** Before recording a board unreachable, try:

1. **A web search scoped to that board** — `site:` or `"<board name>" "<role keyword>"`. 🔴 **On 08-31
   Playbill and StageLync listings were fully reachable this way, with dates, salaries and first-party
   URLs, while both index pages hard-failed.** The pass reported "the source layer is down." It was not.
2. **A different documented entry point** (department index vs keyword search vs employer index).
3. **The employer's own careers page**, once a sighting names the org.

⚠️ **Only after the other doors fail is a board ❌.** And say which door you tried — "unreachable" with
no method named is indistinguishable from not looking.

### 3. 🚫 NO LANE IS SKIPPED FOR BROKEN SOURCES

The lock already forbade skipping a lane for being THIN. **It now equally forbids skipping one because
its boards are down.** Same act, new excuse.

- **Walk `roles[]` from role 1.** If you genuinely must deviate, **say so in the first line** — on 08-31
  the executor silently ran role 5 first because its sources were up.
- **A lane with 6 of 13 boards reachable still gets swept and reported.** Michael: *"Even if seven are
  down, luckily you still have six more. It's tough, but finding at least three is a start."*
- **A lane you could barely sweep gets a header, a block and a commit like any other**, with the dead
  boards named on the zero-yield line.

---

## 🔀 THE RESUME SCAN — derive where you are, never be told

**A pass may span several sessions.** Work out whether you are starting one or continuing one **by
looking at what happened, not by reading a note that says what happened.** Evidence ladder + provenance:
`job-market-refresh.notes.md`.

1. **Read the standing thread's ROOT comments** — text AND posted-at timestamps. Role headers carry
   `` `<role_id>` · pass `<YYYY-MM-DD HH:MM>` `` as their last line.
2. **CURRENT PASS** = the newest pass anchor among role headers.
3. **Is there a `📋 PASS COMPLETE` with that same anchor?** Yes → ▶️ **FRESH PASS**, start at role 1.
   No → continue.
4. **Walk `roles.json` in order.** The **first role with no header under the current anchor** is your
   resume point.
5. **Verify the boundary role** — the last one that DOES have a header. Does it have its threaded block
   (SAME / ALSO / NEW / GONE / NOTABLE), and do its rows exist in its lane file? **If either is missing,
   THAT role is the resume point.** *(Three orphan headers happened for real on 2026-08-04.)*
6. **Cross-check the stamp.** Stamp NEWER than the current anchor = contradiction. **Say so and ask.**
7. **Staleness — compute it (E5).** Newest comment in this pass vs now. Older than one cadence interval
   (>24h) = **ABANDONED, not resumable.** ▶️ Fresh pass, and **name the orphaned roles.**
   🔴 **A NEW CALENDAR DAY IS ALWAYS A FRESH PASS** — never inherit yesterday's half-finished loop
   (`schedule.md`, LOCKED 2026-08-06). "Ground one" restarts the LOOP; it never wipes committed files.
8. **Reconstruct coverage for free (E6 + E7).** Boards that yielded = distinct `site` codes on rows whose
   `first_seen` matches the anchor. Boards swept with zero yield = the zero-yield lines.
9. **Now read the checkpoint (E4)**, if one exists. Its only unique content is *why* the pass stopped.
   Agreement → proceed. Disagreement → **trust your scan and edit the checkpoint** (Template 9).

**State the outcome in your first line, with the arithmetic**, e.g. *"RESUME at `operations-safety` —
pass 2026-08-04 13:20 has headers for 4 of 8 roles, no PASS COMPLETE, newest comment 41 minutes ago so
it is live not abandoned."* The reader must be able to check your work.

🚫 **Never resume from a checkpoint's CONTENT.** What is captured lives in the lane files.
⚠️ **The scan tells you WHERE to start. It never tells you WHETHER to search** — see rule 1.

---

## 🔑 The gate: `routines/job-market-roles.json`

This file IS the loop, **and its `roles[]` ORDER is what you walk.** Per role: `id`, `display`, `lane`,
`keywords[]`, `levels[]`, `exclude_terms[]`, `constraints{}`. `_meta._rulings` carries dated provenance —
read it before proposing a change someone already settled.

⚠️ **Reordering `roles[]` mid-pass would corrupt a resume.** Config changes are a separate action.

```
RESUME SCAN -> fresh, or resume at role N?
for each role in roles.json (from the resume point, IN ORDER):
    1. SEARCH WIDE AND DEEP                <- FIRST. every keyword, every board, every door
    2. read this role's lane file           <- NOW. the thing you compare to
    3. apply global constraints
    4. reconcile -> SAME / NEW / GONE
    5. post the role's comment block        <- leaves E1 (anchor), E5 (timestamp), E7 (zero-yield)
    6. COMMIT this lane's file              <- leaves E2 + E6, and is the boundary
    7. move to next role
```

**Single-role invocation:** *"do job search for stage manager"* → filter `roles[]` to that role. Same
template, same depth, same commit. Does NOT stamp and does NOT satisfy the density floor.
**Mark its header `top-up`** so the Resume Scan does not mistake it for an abandoned pass.

**Adding a role:** add to `roles[]` AND create `routines/job-market-state/<id>.tsv` with the header row.
**Retiring a role:** requires Michael. See the no-lane-is-ever-skipped lock.

---

## 📊 State file schema

Tab-separated, header row, one listing per line, identical in every lane file.

`id` · `role_id` · `lane` · `title` · `org` · `location` · `site` · `url` · `posted` · `first_seen` ·
`salary` · `level` · `status` · `friction` · `also_lanes`

- **`url` is THE validity gate. No URL = no row** — log an unlinked sighting in NOTABLE instead.
- `id` = `JM-<BOARD>-<org-slug>-<role-slug>`, **permanent**; a title change does not get a new ID.
- `role_id` MUST match the config AND the filename. Orphan rows = STOP and flag.
- `salary` verbatim or empty. **Never estimated.**
- `posted` = the board's date. `first_seen` = when the routine captured it. No date published → use
  `first_seen` for both and say so in NOTABLE (the APAP precedent).
- `level` = `senior`/`mid`/`associate`/`entry`/`contract` · `status` = `live`/`gone`/`acted` ·
  `friction` = `direct`/`email`/`gated`.
- One row per listing per board. Cross-posted between boards = two rows. Cross-LANE = one row + `also_lanes`.
- ⚠️ **The schema may only change in a BUILD session, never inside a pass** (README rule 7).

Board codes: `OSJ` · `USITT` · `PB` · `ECN` · `AS` · `TAL` · `BWW` · `SB` · `SJ` · `ACG` · `TOC` · `IND` ·
`LI` · `FL` · `LCTJ` · `APAP` · `SL` · `SKN` · `TSJ` · `HC` · `TWO` · `GOV`

---

## 🎯 Target profile

**Defined in `job-market-roles.json`.** Evaluation (what makes a listing INTERESTING rather than
QUALIFYING) lives in `routines/job-market-evaluation.md` — Corso's, not the executor's.

- **Geography: ANYWHERE.** Relocation live. Remote included. Part-time and contract are IN.
- **Level: ALL** except pure overhire/day-call.
- **OUT:** manufacturing/industrial/logistics · crew calls, single-day overhire, internships · academic
  tenure-track (unless a genuine step up) · per-role `exclude_terms[]`.

---

## Steps

### Pre-loop

1. 🔀 **RUN THE RESUME SCAN.** State FRESH or RESUME-at-`<role_id>` in your first line, with the arithmetic.
2. **Read `routines/job-market-roles.json`** — the gate, including `_meta._rulings`.
3. **If RESUMING:** start at the derived role. Do NOT re-sweep a role with a header AND a committed lane
   file. Keep the ORIGINAL pass anchor on every remaining header. Edit any stale checkpoint to `✅ SPENT`.
4. **If single-role invocation:** filter `roles[]` to that role and mark the header `top-up`.
5. **Check reactions** on the previous pass's NEW listing comments; they inform Spotlight.

🚫 **Do NOT read the lane files yet.** That is step 7, deliberately, and moving it earlier is the exact
defect v18 fixes.

### The loop — for each role, IN CONFIG ORDER, from the resume point

6. 🔍 **SEARCH WIDE AND DEEP. This is the first act of every role and the whole point of the routine.**
   - Try **EACH keyword** from the config independently, not just the first that returns hits.
   - 🔴 **Browse the department/category INDEX pages, not only keyword search.** Required, not a fallback
     (the Department-Index Law, `job-market-sources.md`). Verify the filter actually applied — **know the
     unfiltered count first**, because a wrong param returns the whole set and looks like a great sweep.
   - Paginated boards: at least 3 pages deep, or until results go irrelevant. Date-sorted boards: scan
     both "newest" and "relevance".
   - 🚪 **If a board's index fails, try the other doors** (rule 2) before recording it ❌.
   - 0 results on all keywords → try adjacent terms and synonyms before marking a board dry. For
     `operations-safety`, also sweep the venue/arena/municipal boards — thin is expected, empty means
     you looked in the wrong place.
   - **Minimum coverage:** ALL Tier 1 sources reachable that day, and at least 4 Tier 2.
   - **📝 Keep a running list of boards you swept that returned NOTHING.** That list goes on the role
     header and it is the only fact in this routine no artifact records for you.
   - Capture a **direct URL** and friction type for every qualifier. Recover gated/unlinked URLs per the
     recovery procedure in `job-market-sources.md`.
7. **NOW read this role's lane file** — the known inventory you are comparing against. Also collect every
   row in OTHER lane files whose `also_lanes` names this role; those are the `↔️ ALSO` pointers.
8. **Apply `exclude_terms[]` and `global` constraints.**
9. **Reconcile:** matched = SAME (days-on-board = today − `posted`) · new find with URL = NEW · existing
   row not found = GONE · qualifies but no lane fits = `_unfiled.tsv`.
   ⚠️ **A board you could not REACH does not make its rows GONE.** Carry them, mark them **unverified**,
   and name the board. **"Carried" and "verified" must never share a mark.**
   🚫 **Never mark GONE off arithmetic on a stale cache** — that is a GONE *candidate* for NOTABLE.
10. **Post the role's comment block** per `job-market-templates.md`: header as ROOT **including the
    zero-yield line and the machine anchor** (capture its comment ID), then SAME · ALSO · each NEW
    individually · GONE · NOTABLE as threaded replies. If the sweep turns up more after the header goes
    up, **edit the header.**
11. 💾 **COMMIT this lane's file now.** Message `data(job-market): <pass anchor> ET — <role_id>, <n> live,
    <+-n>`. **Re-read the file's SHA immediately before writing;** never write from a SHA captured
    earlier in the pass.
12. **Repeat from step 6.** **A role with a header but no block, or a block but no commit, is a broken
    loop** — and the Resume Scan will correctly send the next session back to redo it.

### Post-loop

13. **Density check.** Under 40 total live = **DECLARED FAILURE**: name which sources were blocked or
    thin and what retry was attempted, and do NOT stamp. Committed lane files stay committed.
14. **Commit `_unfiled.tsv`** if it gained rows.
15. **Post 📋 PASS SUMMARY** as a ROOT comment (Template 6) **carrying the pass anchor** — that anchor is
    what tells the next Resume Scan the pass is closed. Compute `Sessions` and both elapsed figures from
    comment timestamps. Include ⚡ Spotlight and 🗃️ Unfiled if any.
16. **Post 🔌 SOURCES** as a reply to the summary, then edit the summary to add the link. Build it by
    rolling up E6 (`site` codes) and E7 (zero-yield lines), not from memory. Keep ✅ yielded · ⚪
    swept-zero · 🕐 reachable-but-stale · ⚠️ degraded · ❌ not-hit **all distinct.**
17. **Edit any checkpoint from this pass to `✅ SPENT`** (Template 9).
18. **STAMP** — *last write, only if the pass succeeded.* `routines/last-run/job-market.txt`, one line,
    `YYYY-MM-DD HH:MM` ET **of when it landed.** Per THE STAMP LAW: a complete pass stamps · a blocked
    board with the inventory still landed is a PARTIAL and stamps with the gap named · **a below-floor
    pass, an aborted loop or a single-role top-up does NOT stamp.**
19. **Post the roll-up** to 🧭 STANDING · Routine Ricky — Run Reports (https://app.clickup.com/t/86ajuhw1d), linking the pass
    summary and the commits. Include the `Ledger:` line.

### If you must stop mid-loop

Stop at a **role boundary**, never inside one. Every finished lane is already committed and its header
posted, so **the next session can find its place with or without your note.** A `⏸️ CHECKPOINT`
(Template 8) is **optional and for humans** — the one thing worth writing is *why* you stopped.
**Do not stamp.** 🚫 Never paste row data into a checkpoint; commit it instead.

---

## Guardrails (STOP + flag if any is true)

**The v18 three — the ones that cost a whole pass:**

- 🔴 **You are about to read a lane file before you have searched.** Wrong order. Search first.
- 🔴 **You are reasoning "I cannot verify what I hold, so there is no point searching."** Two unrelated
  questions. Search anyway.
- 🔴 **You are about to record a board unreachable because its INDEX failed.** Try a scoped web search,
  another entry point, and the employer's own page first. Name the door you tried.
- 🔴 **You are about to skip a lane because its sources are down**, or to jump to an easier lane without
  saying so. Walk the order; sweep what you can reach; report the gap.

**Standing:**

- **You are about to write a status into prose.** Ask what artifact already implies it. Only a board
  swept with zero yield needs stating.
- **You are about to trust a checkpoint instead of deriving position.** E4 is a hint.
- **You are about to skip the Resume Scan** because a checkpoint looks clear, or because there is none.
- **The stamp is newer than the newest pass anchor** → contradiction. Say so and ask. Never guess.
- **You are about to resume a pass whose newest comment is more than a cadence interval old**, or to
  inherit an unfinished pass from a previous CALENDAR DAY. Both are ABANDONED → fresh pass, name the
  orphaned roles.
- **You are about to re-sweep a role that has a header AND a committed lane file.** Done.
- **You are about to skip a role that has a header but NO block or NO commit.** Not done.
- **You are about to post a role header without the anchor line or the zero-yield line.** Both mandatory.
- **You are about to record a board as "not hit" when you swept it and found nothing** (or vice versa),
  or to let "carried" wear a ✅. Four distinct states, four distinct marks.
- **You are about to mark a row GONE because a board was unreachable or a cache was stale.** Carry it,
  mark it unverified, name the reason.
- **You are about to stamp a pass you only partly ran**, or a single-role top-up. Neither stamps.
- **You are about to post SAME, ALSO, NEW, GONE or NOTABLE as a ROOT comment.** Always threaded replies.
- **You are about to lump multiple NEW listings into one comment.** Each is its own reply.
- **You are about to leave a role header with no block under it.**
- **You are about to start the next role without committing the current one.** That is the boundary.
- **You are about to write a lane file using a SHA read earlier in the pass.** Re-read it.
- **You are about to put the same listing in two lane files.** One listing = one row = one home file.
- **You are about to put a REJECTED find, or a real job that no lane covers, in `_unfiled.tsv`.**
  Rejects are prose in NOTABLE; lane-misfits are NOTABLE too, with the config gap named.
- **You are about to paste TSV rows into a ClickUp comment** for a later session to apply. Commit them.
- **You are about to reorder or edit `roles.json` mid-pass.** That corrupts a resume.
- **You are about to conclude a role "does not exist" because a keyword returned zero.** Zero is a fact
  about your sources. Name the boards you checked first.
- **You are about to propose cutting a keyword that returned nothing.** Ruled twice, wrong both times —
  and on 08-31 the keyword set proposed for cutting produced the best find of the pass.
- **You are about to change the schema mid-pass.** Build session only (README rule 7).
- **You are about to create a ClickUp TASK**, or **send anything.** This routine creates none and
  transmits nothing, ever.
- **You are about to create a second research task or thread.** `86ajtgbt3` or nothing.
- **A listing has no working direct URL** → no row. Never invent a URL.
- **A listing is flagged "reported for review" on its board** → not admitted. NOTABLE only.
- **Total live is under 40** → DECLARED FAILURE. Re-sweep; if still short, do NOT stamp.
- **You would post a markdown table** → STOP. Mobile-first, stacked blocks only.
- **You would aggregate roles into one shared block** → STOP. Loop, not summary.
- **You are tempted to shorten the sweep because the pass is long** → STOP. Rule 13.
- **You would skip the department indexes** because keyword search returned plenty → volume is not coverage.
- **You would replay every missed day on a catch-up** → a late pass is ONE pass covering more days.
- **A board name in SOURCES is plain text** → every board name links to its homepage.
- **You are about to quote a byte cap you have not measured** → README rule 14. If a file did not come
  back whole, STOP; never write from a partial read.

---

## Invocation modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Pick this up** | "pick this up" on the standing task | Resume Scan first, then a fresh full loop or a resume. The primary door. |
| **Full loop** | "run job market refresh", or the cadence is due | All roles in config order, sequential, committed per role |
| **Single role** | "do job search for [role name]" | One role, same template and depth. Marked `top-up`; does not stamp. |
| **Add role** | "add [role] to job search" | Edit the JSON config, create the lane file, run that role immediately |

---

## Error posture

- **A failure on one board never stops the role. A failure in one role never stops the pass.**
- **Best-effort + flag** rather than aborting: capture what is reachable, name what is not.
- **A failed/stopped run leaves the last-run file untouched** so it stays overdue and self-heals.
- **Report failures in the reply, not by DM.** Invocation means Michael is right there.
- ⚠️ **A BLOCKER IS A CLAIM, AND CLAIMS EXPIRE.** Before citing a previously-recorded blocker as the
  reason something did not run, **re-test it.** A 30KB write cap was quoted across three triages and
  sixteen days without one measurement, and it was false the whole time. **Carrying a blocker forward is
  not the same act as verifying one.**
