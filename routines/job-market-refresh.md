---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
steward: routine-ricky
cadence: pointer only — authoritative cadence is the row in routines/schedule.md
state_dir: routines/job-market-state/
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 17.1
model: loop-per-role, commit-per-role, resumable
---

> ⚠️ **Frontmatter is metadata, never a switch.** `routines/schedule.md`'s table is the ONLY on/off switch
> (LOCKED 2026-07-30, Michael). Never decide whether to run this from the header above.

# Job Market Refresh

goal:       every pass restates the ENTIRE live market for each configured role — same listings, new listings, disappeared listings — to one standing ClickUp thread, with per-lane TSV files as the structured index behind it.
target:     `routines/job-market-state/<role_id>.tsv` (source of truth, one file per lane) · the standing thread `86ajtgbt3` (read surface) · `routines/last-run/job-market.txt` (stamp). **Creates no tasks and sends nothing.**
report-to:  DETAIL → the standing thread `86ajtgbt3` (role blocks + pass summary). ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

**This runbook is 1 of 3 files. Read all three before a pass:**

| File | Holds |
|------|-------|
| `job-market-refresh.md` | **this file** — locked decisions, architecture, schema, steps, guardrails |
| `job-market-templates.md` | comment architecture, threading mechanics, output templates 1-8 |
| `job-market-sources.md` | the source list, board access notes, density expectations, cold-agent intelligence |

*(Split 2026-08-04 at v17: the single runbook had reached 41KB against a ~30KB read cap, which meant the
file carrying the STOP conditions could not be guaranteed to load whole. Per-concern split, no duplication.)*

**WHAT this does.** The WHEN lives in `routines/schedule.md`. The universal floor lives in `routines/README.md` —
including **THE STAMP LAW**, **rule 13 (complete loops)** and **rule 14 (commit at the boundary)**.

---

## 🔀 THE RESUME TEST — run this BEFORE anything else

**This routine does not assume it is starting fresh.** A pass may span several sessions. The FIRST thing any
invocation does is work out which situation it is in, and the answer is arithmetic on two values, never a vibe
and never the date on a comment.

**The two values:**

1. **The stamp** — `routines/last-run/job-market.txt`, one line, `YYYY-MM-DD HH:MM` ET (or `never`).
2. **The newest `⏸️ CHECKPOINT` comment** on the standing thread `86ajtgbt3`, by the timestamp in its heading.

**The test:**

| Condition | Meaning | Do this |
|---|---|---|
| No checkpoint exists, or the **stamp is NEWER** than the newest checkpoint | The pass that checkpoint belonged to has since completed and landed. The checkpoint is **spent**. | ▶️ **FRESH PASS.** Start at role 1. |
| The newest **checkpoint is NEWER** than the stamp | A pass is **mid-flight**. It stopped at a role boundary and never landed, so per THE STAMP LAW it correctly did not stamp. | ⏭️ **RESUME** at the role the checkpoint names. |
| Stamp is `never` and a checkpoint exists | First pass, mid-flight. | ⏭️ **RESUME.** |
| Stamp is `never`, no checkpoint | Never run. | ▶️ **FRESH PASS.** |

**Why the stamp is the arbiter and "is the checkpoint from today?" is not:** a checkpoint and its completing
pass usually share the same calendar day, so a same-day test says RESUME on a pass that already finished. That
is a live misfire, not a hypothetical — on 2026-08-04 a 13:20 checkpoint sat in the thread after the 16:20
resume completed and stamped. **The stamp is written only when the product lands, so "stamp newer than
checkpoint" is exactly the statement "that work is done."** The test composes with THE STAMP LAW for free:
an aborted pass does not stamp, so its checkpoint stays newer and correctly reads as resume.

**On consuming a checkpoint:** the session that resumes from one **must EDIT that comment** to `✅ CHECKPOINT ·
<time> — SPENT` with a pointer to the pass that completed it. A spent checkpoint left reading as live is the
same prose-state defect v17 was written to kill, just wearing a different hat. Belt and braces — the arithmetic
is the rule, the edit is the courtesy to the next reader.

🚫 **Never resume from a checkpoint's CONTENT.** It carries position only. What is captured lives in the state
files; read those.

---

## Locked decisions

> **💾 COMMIT AT EVERY ROLE BOUNDARY.** (LOCKED 2026-08-04, Michael)
> A role's state file is committed the moment that role's sweep and comment block are finished — before the
> next role starts. **State is NEVER handed between sessions as text.** Michael: *"Each session should complete
> its loop fully and not try to pass TSV data between sessions for exactly the reasons you found."*
> This resolves a contradiction that had been live since v13: the complete-loops lock said *"stop at a role
> boundary, commit the rows you have"* while step 13 said commit once, post-loop. Every mid-loop stop fell
> into that gap.

> **🗂️ ONE STATE FILE PER LANE.** (LOCKED 2026-08-04, Michael)
> `routines/job-market-state/<role_id>.tsv`, filename == `role_id`, exactly. Adding a role to the config means
> adding a file with the same stem; there is no mapping table and there must never be one. The combined file is
> a tombstone. Full design + rationale: `routines/job-market-state/_MIGRATION.md`.

> **🔗 ONE LISTING = ONE ROW = ONE HOME FILE.** (LOCKED 2026-08-04)
> A listing matching several lanes lives in ONE file and names the others in `also_lanes`. The other lane's
> block gets an `↔️ ALSO` pointer (Template 2b), never a duplicated row. Two claimants on one row means the day
> it goes GONE you update one and miss the other. **Home lane = the lane whose keyword produced the find;** on a
> genuine tie the senior half of the title wins.
> ⚠️ **`also_lanes` is for dual-nature ROLES, not for unresolved CONFIG.** A title that keeps landing in two
> lanes is a keyword-placement problem — raise it once and get it ruled, never re-adjudicate it every pass.
> Reference case: `company manager` was carried as an `also_lanes` flag for hours before Michael simply moved
> the keyword. **A flag is not a decision.**

> **📱 MOBILE FIRST. NO TABLES.** (LOCKED 2026-07-31, Michael)
> Markdown tables don't reflow on phones. Every listing is a stacked block of short lines. Nothing in a pass
> output may be a table. The TSVs are machine state; the thread is narrative.

> **🏘️ STANDING INVENTORY, NOT A CHANGE LOG.** (LOCKED 2026-07-30, Michael)
> Every pass restates the entire market. Sameness is a finding. Days-on-board and disappearances are the
> highest-signal facts.

> **🕐 PASSES = DATE AND TIME, NEVER NUMBERED.** (LOCKED 2026-07-31, Michael)
> Identity is `YYYY-MM-DD HH:MM ET`. Reference previous passes by timestamp + elapsed interval.
> ⚠️ **A multi-session pass keeps the timestamp it OPENED with**, on every role header and on the summary, so
> the whole pass reads as one event. The stamp records when it LANDED. Those two differing is normal.

> **🔁 LOOP, NOT SUMMARY.** (LOCKED 2026-07-31, Michael)
> Each role is its own market entity, gets a SEPARATE COMPLETE report, the same depth, the same template.
> No aggregation across roles in the output.

> **🚫 NO LANE IS EVER SKIPPED, DEPRIORITISED OR RETIRED FOR BEING THIN.** (LOCKED 2026-08-04, Michael)
> Two lanes were proposed for deprioritisation after one thin pass each. **Both proposals were overruled, and
> the reasoning matters more than the outcome:**
> - `drafting-design` — *"If we need to do another job search on it because we were short the first time, then
>   absolutely do that."* A thin result is a reason to sweep HARDER, not a reason to stop looking. **Low career
>   value is never grounds to drop coverage** — whether a lane is worth SEARCHING and whether a find is worth
>   TAKING are different questions, and only the second is Corso's.
> - `operations-safety` safety keywords — *"It is a very niche thing, but that is kind of the point."*
>   **Zero returns is evidence about your SOURCES, not about the world.** Live-event safety is a real discipline
>   with real seats; it does not post on theatre boards because it is not a theatre job. Keywords were EXPANDED,
>   and venue/arena/municipal boards added. Expect this lane THIN, not EMPTY. A rare find in a niche Michael is
>   qualified for outranks another Production Manager row.

> **📊 DENSITY FLOOR: 40 LIVE LISTINGS PER PASS.** (LOCKED 2026-07-31, Michael)
> Below 40 total live is a **DECLARED FAILURE** — per THE STAMP LAW it does NOT stamp. The agent must
> (1) re-sweep Tier 1 with alternate keyword permutations, (2) expand to unhit Tier 2 sources,
> (3) try paginated/filtered/department views on gated boards.
> ⚠️ **Calibration note added v17:** the floor was set against keyword-only sweeps and is now easy to clear.
> Clearing it is NOT evidence of a good pass. Post-department-index the working baseline is 90-120.
> **Judge depth by SOURCES coverage, not by the total.** See `job-market-sources.md`.

> **🗂️ PASS SUMMARY = TABLE OF CONTENTS.** (LOCKED 2026-07-31, Michael)
> The summary MUST include a comment index hyperlinking each ROLE HEADER comment plus SOURCES. On mobile,
> threaded comments collapse; the index is the reader's navigation layer.

> **🔁 COMPLETE LOOPS — THIS IS THE ROUTINE THAT WILL TEMPT YOU.** (LOCKED 2026-08-01, Michael)
> The longest procedure in `routines/`, and length is not a reason to hurry. Never skip a keyword, a board, a
> department index, a page of pagination, or a template section. Finish each ROLE completely — header, SAME,
> ALSO, NEW, GONE, NOTABLE, **commit** — before starting the next. A shallow sweep is indistinguishable from a
> thin market, which is the entire reason the density floor exists.

> **🧵 THREAD FINDINGS, NEVER FLAT.** (LOCKED 2026-08-02, Michael)
> Top-level comments are ONLY role headers, checkpoints, and the pass summary. ALL listing detail is threaded
> under the relevant role header. A pass that posts SAME/NEW/GONE as root comments is STRUCTURALLY BROKEN
> regardless of content quality. If the comment tool requires a `parent_comment` parameter, USE IT.

> **📐 SLIM SAME/GONE, RICH NEW.** (LOCKED 2026-08-02, Michael)
> SAME, ALSO and GONE are single-line-per-listing. NEW keeps the full stacked template.

> **💬 ONE COMMENT PER NEW LISTING.** (LOCKED 2026-08-02, Michael)
> Each NEW listing is its own threaded reply so Michael can react to it individually. 5 new PM listings =
> 5 separate comments. SAME/ALSO/GONE stay as single compressed blocks.

> **🗳️ REACTION-BASED RATING.** (LOCKED 2026-08-02, Michael)
> 🔥 = hot/pursuing · 👍 = solid/track it · 👎 = not for me · 🤔 = interesting but questions.
> Reactions are read on subsequent passes to build preference patterns and train Spotlight selection.

> **⚡ SPOTLIGHT IN SUMMARY.** (LOCKED 2026-08-02, Michael)
> Top 3 across ALL roles: newest + highest-salary + best-fit, above the comment index.

> **🏷️ FRICTION ICONS ON EVERY LISTING.** (LOCKED 2026-08-02, Michael)
> ✅ = direct apply (online form/portal) · 📝 = email submission · 🔒 = gated (membership, login, or agent).

> **🔗 BOARD HOMEPAGE LINKS IN SOURCES.** (LOCKED 2026-08-02, Michael)
> Board names are never plain text.

---

## 📍 Architecture

**One task, one conversation, three persistence layers.**

- **Standing thread:** `86ajtgbt3` — the trigger, the read surface, and the checkpoint surface, all one task.
- **Never create a second research task.** The Applications list (`900600097138`) is a funnel, not an
  inventory. Listings become tasks there ONLY when Michael says to act.

| Layer | Holds | Read by |
|-------|-------|--------|
| `routines/job-market-roles.json` | **The gate.** Which roles to search, with what keywords, on what boards. The loop driver. | Every pass (step 2). |
| `routines/job-market-state/<role_id>.tsv` | Structured index, one file per lane. Also an organic **venue/org index** — the `org` column is growing a theatre directory as a side effect. | All read at pre-loop (step 3); one written per role boundary (step 11). |
| `routines/job-market-state/_unfiled.tsv` | Qualifying finds with no lane yet. | Pre-loop + post-loop. |
| `routines/last-run/job-market.txt` | The stamp — **and the arbiter of the Resume Test.** | Step 1, and written at step 17. |
| Comment thread | Narrative + checkpoints. One header per role per pass, individual NEW comments as the reaction surface. | Michael, on his phone. |

**The TSVs are source of truth. The thread is the read surface. The TSVs win disagreements.**

### State rules

- A listing enters its lane file when found AND its direct URL is captured (`status=live`).
- `gone` when it disappears. Gone rows stay one pass, then get deleted. Git preserves history.
- `acted` when Michael says to act and an Application task is created.
- **Uncommitted work did not happen.** Under v17 that window is one role long, never a whole pass.

### 🗃️ `_unfiled.tsv`

For a find that **qualifies on merit but has no lane yet.** `role_id = unfiled`, `lane = UNF`, same schema.
It has no role block, so it is reported in the Pass Summary's Unfiled section.

🚫 **NOT for rejected finds.** Overhire, below-floor, box office, academic-teaching and out-of-industry stay as
prose in NOTABLE. Miss that distinction and this becomes a junk drawer inside a month.

**Three of a kind in `_unfiled` is evidence to add a role to `job-market-roles.json`** — that routes to Corso's
feedback loop, it is not the executor's call.

### Reaction data

Before sweeping, check emoji reactions on the previous pass's individual NEW listing comments. Patterns to
track: geography (which cities get 🔥 vs 👎) · salary threshold (lowest-paying listing that still got 👍) ·
org type (LORT vs touring vs commercial vs dance) · contract type · role level. These inform Spotlight and,
over time, which borderline listings qualify vs get logged as NOTABLE only.

---

## 🔑 The gate: `routines/job-market-roles.json`

This file IS the loop. `roles[]` is an ordered list; the routine iterates it top to bottom and every entry gets
a full, independent pass. Per role: `id`, `display`, `lane`, `keywords[]`, `levels[]`, `exclude_terms[]`,
`constraints{}`. `global{}` applies to all roles. `_meta._rulings` carries dated provenance for keyword moves —
read it before proposing a keyword change someone already settled.

```
RESUME TEST -> fresh or resume?
for each role in roles.json (from the resume point):
    1. read this role's lane file          -> known inventory
    2. walk ALL source boards with this role's keywords AND department indexes
    3. apply global constraints (geography, academic, overhire)
    4. reconcile against known inventory
    5. post the role's comment block
    6. COMMIT this lane's file             <- the boundary
    7. move to next role
```

**Single-role invocation:** *"do job search for stage manager"* → filter `roles[]` to that role. Loop length 1,
same template, same depth, same commit. A single-role run does NOT stamp the routine and does NOT satisfy the
density floor — it is a targeted top-up, not a pass. Say so in the report.

**Adding a role:** add an entry to `roles[]` AND create `routines/job-market-state/<id>.tsv` with the header row.
**Retiring a role:** requires Michael. See the no-lane-is-ever-skipped lock above.

---

## 📊 State file schema

Tab-separated, header row, one listing per line, identical in every lane file.

| Column | Required | Description |
|--------|----------|-------------|
| `id` | yes | `JM-<BOARD>-<org-slug>-<role-slug>` |
| `role_id` | yes | Matches `id` in `job-market-roles.json`, and matches the filename |
| `lane` | yes | `PM` / `TD` / `SM` / `ME` / `AUD` / `OPS` / `DFT` / `ADM` / `UNF` |
| `title` | yes | Role title as posted |
| `org` | yes | Organization name |
| `location` | yes | City, State (or Remote) |
| `site` | yes | Board code |
| `url` | yes | **Direct link to posting. THE validity gate: no URL = no row.** |
| `posted` | yes | Date posted (`YYYY-MM-DD`) |
| `first_seen` | yes | Pass date first found (`YYYY-MM-DD`) |
| `salary` | optional | Posted range verbatim, never estimated |
| `level` | yes | `senior` / `mid` / `associate` / `entry` / `contract` |
| `status` | yes | `live` / `gone` / `acted` |
| `friction` | yes | `direct` / `email` / `gated` |
| `also_lanes` | optional | Pipe-separated `role_id`s this listing ALSO matches. Added v17. |

**Normalization rules:**
- One row per listing per board. Cross-posted between boards = two rows (different `site`, different `id`).
  This is distinct from cross-LANE, which is one row + `also_lanes`.
- `url` REQUIRED. No URL = no row; log as an unlinked sighting in NOTABLE.
- `salary` verbatim or empty. Never estimated.
- `posted` = the board's date. `first_seen` = when the routine captured it.
- `role_id` MUST match an entry in the JSON and the filename. Orphan rows = STOP and flag.
- ⚠️ **The schema may only change in a BUILD session, never inside a pass** (`README.md` Discipline rule 7).

### Listing IDs

```
JM-<BOARD>-<org-slug>-<role-slug>
```

Board codes: `OSJ` OffStageJobs · `USITT` · `PB` Playbill · `ECN` EntertainmentCareers.net · `AS` ARTSEARCH ·
`TAL` TheatreArtLife · `BWW` BroadwayWorld · `SB` StageBoard · `SJ` StageJobsy · `ACG` Arts Consulting Group ·
`TOC` TOC Arts Partners · `IND` Indeed · `LI` LinkedIn · `FL` Freelancer/Upwork · `LCTJ` League of Chicago
Theatres · `APAP` APAP Job Bank · `SL` StageLync · `SKN` Skene Callboard · `TSJ` The Stage Jobs · `HC` HireCulture

**The ID is permanent.** A title change does not get a new ID.

---

## 🎯 Target profile

**Defined in `job-market-roles.json`.** That file is the single source for what to search and what to exclude.
This section is documentation only. Evaluation (what makes a listing INTERESTING rather than QUALIFYING) is a
separate concern and lives in `routines/job-market-evaluation.md`, read by Corso, not by the executor.

- **Geography: ANYWHERE.** Relocation live. Remote explicitly included.
- **Lane: NON-ACADEMIC** (deprioritized, not banned).
- **Level: ALL except pure overhire/day-call.** Senior, mid, associate, part-time, contract, remote/hybrid, drafting, smaller-scale.
- **Part-time and contract are IN.**

**What's OUT:** manufacturing/industrial/logistics · pure crew calls, single-day overhire, internships ·
academic tenure-track (unless a genuine step up) · per-role `exclude_terms[]`.

---

## Steps

### Pre-loop

1. 🔀 **RUN THE RESUME TEST.** Read `routines/last-run/job-market.txt` and the newest `⏸️ CHECKPOINT` on the
   standing thread. Decide FRESH or RESUME per the table at the top of this file. **Say which, out loud, in the
   first line of the reply**, with both timestamps — the reader must be able to check your arithmetic.
2. **Read `routines/job-market-roles.json`** — the gate. This defines the loop. Read `_meta._rulings` too.
3. **Read ALL lane files in `routines/job-market-state/`, including `_unfiled.tsv`** — one read, the full
   inventory. You need the whole picture to dedup by URL and to spot cross-lane hits, even though you will
   only WRITE one file at a time.
4. **If RESUMING:** the checkpoint names the next role. Skip to it — do NOT re-sweep completed lanes, they are
   already committed and already posted. Keep the ORIGINAL pass timestamp on every remaining header.
   Edit the checkpoint comment to `✅ … SPENT` once you have consumed it.
5. **If single-role invocation:** filter `roles[]` to that role. Loop length = 1.
6. **Check reactions on the previous pass's NEW listing comments.** Note 🔥 vs 👎 patterns; they inform Spotlight.

### The loop — for each role in config

7. **Filter to this role's lane file.** That is the known inventory. Also collect every row in OTHER lane files
   whose `also_lanes` names this role — those are the `↔️ ALSO` pointers, not this lane's rows.
8. **Walk ALL source boards** per `job-market-sources.md`. Sweep requirements:
   - Try EACH keyword from the config independently, not just the first that returns hits.
   - 🔴 **Browse the department/category INDEX pages, not only keyword search.** This is required, not a
     fallback — see the Department-Index Law in `job-market-sources.md`. Verify the filter actually applied.
   - Paginated boards: at least 3 pages deep, or until results go irrelevant.
   - Date-sorted boards: scan both "newest" and "relevance".
   - 0 results on all keywords → try adjacent terms and synonyms before marking a board dry. For
     `operations-safety`, also sweep the venue/arena/municipal boards — thin is expected, empty means you
     looked in the wrong place.
   - **Minimum coverage:** ALL Tier 1 sources and at least 4 Tier 2. A skipped source without an explanation
     makes the pass incomplete.
   - Apply `exclude_terms[]` and `global` constraints. Capture a direct URL and a friction type for every qualifier.
9. **Reconcile:**
   - Matched to an existing row = SAME (days-on-board = today − `posted`)
   - New find with URL = NEW (assign `JM-ID`, `role_id`, `lane`, `level`, `friction`, and `also_lanes` if it spans lanes)
   - Existing row not found on any board = GONE
   - Qualifies but no lane fits = a row in `_unfiled.tsv`
10. **Post the role's comment block** per `job-market-templates.md`: header as ROOT (capture its comment ID),
    then SAME · ALSO · each NEW individually · GONE · NOTABLE as threaded replies to that ID.
    If the sweep turned up anything after the header went up, **edit the header's counts.**
11. 💾 **COMMIT this lane's file now.** `routines/job-market-state/<role_id>.tsv`, message
    `data(job-market): <timestamp> ET — <role_id>, <n> live, <+-n>`. Re-read the file's SHA immediately before
    writing; never write from a SHA captured earlier in the pass.
12. **Repeat from step 7** for the next role. **A role that got a header but no block, or a block but no commit,
    is a broken loop, not a short one.**

### Post-loop

13. **Density check.** Total live under 40 = **DECLARED FAILURE**: name which sources were blocked or thin and
    what retry was attempted, and do NOT stamp. Lane files already committed stay committed — the rows are real
    and losing them helps nobody. The stamp is what is withheld, never the data.
14. **Commit `_unfiled.tsv`** if it gained rows.
15. **Post 📋 PASS SUMMARY** as a ROOT comment (Template 6), including ⚡ Spotlight and the 🗃️ Unfiled section
    if any. Capture its comment ID. On a multi-session pass, use the ORIGINAL pass timestamp.
16. **Post 🔌 SOURCES** as a reply to the summary (Template 7), then edit the summary to add the SOURCES link.
    On a multi-session pass, SOURCES must cover EVERY session's board coverage, not just this session's.
17. **STAMP** — *last write, and only if the pass succeeded.* Write `routines/last-run/job-market.txt`, one line,
    `YYYY-MM-DD HH:MM` ET **of when it landed**, not the pass identity timestamp. Per THE STAMP LAW: complete
    pass stamps · a blocked board with the inventory still landed is a PARTIAL and stamps with the gap named ·
    **a below-floor pass or an aborted loop does NOT stamp.** ⚠️ **The stamp is also what retires the pass's
    checkpoint** under the Resume Test — stamping is what tells the next session not to resume.
18. **Post the roll-up** to 🧭 STANDING · Routine Ricky — Run Reports (https://app.clickup.com/t/86ajuhw1d): one entry for this
    routine, linking the pass summary comment and the commits. Include the `Ledger:` line.

### If you must stop mid-loop

Stop at a **role boundary**, never inside one. Every finished lane is already committed, so post a
⏸️ CHECKPOINT (Template 8) carrying **position only** — roles complete, next role, commit SHA.
**Do not stamp.** The absence of a stamp is precisely what makes the next session resume instead of restart.
🚫 **Never paste row data into a checkpoint.** If you want the next session to have a row, commit it.

---

## Guardrails (STOP + flag if any is true)

- **You are about to start sweeping without having run the Resume Test.** That is step 1 for a reason: the cost
  of getting it wrong is either re-sweeping four finished lanes or silently dropping them.
- **You are about to resume based on a checkpoint being "from today."** Wrong test. Compare it to the STAMP.
- **You are about to stamp a pass you only partly ran** because it "feels finished." An aborted loop does not
  stamp — that is what makes it resumable.
- **You are about to post SAME, ALSO, NEW, GONE or NOTABLE as a ROOT comment.** These are ALWAYS threaded
  replies. If you cannot reply to a parent, STOP and ask. Never dump them flat.
- **You are about to lump multiple NEW listings into one comment.** Each is its own reply. Split them.
- **You are about to leave a role header with no block under it.** Attach the block or correct the header —
  never leave an orphan, never open a second header for the same role in the same pass.
- **You are about to start the next role without committing the current one.** That is the boundary. Commit first.
- **You are about to write a lane file using a SHA read earlier in the pass.** Re-read it. A stale SHA is how
  a write silently clobbers a sibling's rows.
- **You are about to put the same listing in two lane files.** One listing = one row = one home file. Use `also_lanes`.
- **You are about to put a REJECTED find in `_unfiled.tsv`.** Unfiled means qualifies-but-no-lane. Rejects are prose in NOTABLE.
- **You are about to paste TSV rows into a ClickUp comment for a later session to apply.** Commit them instead.
- **You are about to skip, deprioritise or retire a lane because it is thin.** Not your call, and the answer has
  already been no twice. Sweep harder and say what you tried.
- **You are about to conclude a role "does not exist" because a keyword returned zero.** Zero is a fact about
  your sources. Name the boards you checked before you draw any conclusion about the world.
- **You are about to change the schema mid-pass.** Not allowed here — that is a build session (README rule 7).
- **You are about to create a ClickUp TASK.** This routine creates none. Listings become Application tasks ONLY
  when Michael says to act. A pass that files tasks is the failure mode that killed v2.
- **You are about to send anything** (email, DM, application). This routine transmits nothing, ever.
- **You are about to create a second research task or a second thread.** `86ajtgbt3` or nothing.
- **A listing has no working direct URL** → no row. Log it as an unlinked sighting in NOTABLE. Never invent or
  reconstruct a URL.
- **A row's `role_id` doesn't match an entry in the config, or doesn't match its filename** → STOP and flag,
  never guess a lane.
- **A listing is flagged "reported for review" on its board** → not admitted. NOTABLE only.
- **Total live is under 40** → DECLARED FAILURE. Re-sweep per the density floor; if still short, report
  incomplete and do NOT stamp.
- **You would post output containing a markdown table** → STOP. Mobile-first, stacked blocks only.
- **You would aggregate roles into one shared block** → STOP. Loop, not summary.
- **You are tempted to shorten the sweep because the pass is long** → STOP. That is exactly what rule 13 exists for.
- **You would skip the department indexes because keyword search already returned plenty** → STOP. Read the
  Department-Index Law. Volume is not coverage.
- **You would replay every missed day on a catch-up** → STOP. A late pass is ONE pass covering more days.
- **You would edit `job-market-roles.json` mid-pass to make results fit** → STOP. Config changes are separate
  and explicit.
- **A board name in SOURCES is plain text** → STOP. Every board name links to its homepage.

---

## Invocation modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Pick this up** | "pick this up" / "let's pick this up" on the standing task | **Run the Resume Test first**, then either a fresh full loop or a resume from the checkpointed role. This is the primary door. |
| **Full loop** | "run job market refresh", or the cadence is due | All roles in config, sequential, committed per role |
| **Single role** | "do job search for [role name]" | One role only, same template, same depth, same commit. Does not stamp. |
| **Add role** | "add [role] to job search" | Edit the JSON config, create the lane file, run that role immediately |

All modes produce the same output format. The only variable is loop length.
*("Scheduled cadence" was removed from the trigger column 2026-08-01 — there is no scheduler.)*

---

## Changelog

- **v17.1 (2026-08-04)** — **The Resume Test.** (1) 🔀 A deterministic fresh-vs-resume decision as step 1,
  arbitrated by **stamp vs newest checkpoint** rather than "is the checkpoint from today" — the same-day test
  misfired live, telling a session to resume from a pass that had already completed and stamped hours earlier.
  (2) A consumed checkpoint must be edited to `✅ SPENT`. (3) The three 2026-08-04 rulings folded in as the
  no-lane-is-ever-skipped lock, plus the `also_lanes`-is-not-a-decision note. (4) Multi-session passes keep
  their opening timestamp; the stamp records landing time. (5) "Pick this up" named as the primary invocation.
- **v17 (2026-08-04)** — **Per-role commits and per-lane state files.** (1) 💾 COMMIT AT EVERY ROLE BOUNDARY:
  a lane's file is committed as soon as its block is posted, resolving a v13-era contradiction between the
  complete-loops lock and the single post-loop commit. (2) 🗂️ State split from one 25KB file into
  `job-market-state/<role_id>.tsv` — the combined file had passed the ~22KB read-truncation line, where a
  truncated read + full-file write silently destroys rows; it is now a tombstone. (3) 🔗 `also_lanes` column +
  the one-row-one-home rule + Template 2b `↔️ ALSO` pointers. (4) 🗃️ `_unfiled.tsv` holding pen with an explicit
  not-for-rejects rule. (5) ⏸️ CHECKPOINT rewritten to carry POSITION only — the `📋 TSV DELTA` block is deleted
  and must never return. (6) 🔴 The OffStageJobs Department-Index Law, after three lanes were found to have been
  under-reported for weeks by keyword-only sweeps. (7) Density floor annotated as a tripwire, not a target;
  working baseline restated as 90-120. (8) File split into `job-market-refresh.md` + `job-market-templates.md`
  + `job-market-sources.md` — the runbook had reached 41KB against a ~30KB read cap. Migration record:
  `routines/job-market-state/_MIGRATION.md`. Promoted upward as universal Discipline rule 14 in `README.md`.
- **v16 (2026-08-02)** — one comment per NEW listing (reaction surface) · reaction-based rating read forward ·
  ⚡ Spotlight in the summary · friction icons on every listing · board homepage links in SOURCES ·
  `friction` column added to the schema.
- **v15 (2026-08-02)** — 📐 SLIM SAME/GONE, RICH NEW. SAME and GONE collapsed to one line per listing.
- **v14 (2026-08-02)** — 🧵 THREAD FINDINGS, NEVER FLAT. Explicit threading mechanics; posting findings as root
  comments became a STOP condition.
- **v13 (2026-08-01)** — standard runbook header (`goal:`/`target:`/`report-to:`), the first Guardrails section,
  `status:` removed from frontmatter, STAMP moved from step 13 to after the pass summary, density floor restated
  as a declared failure, complete-loops lock added.
- **v12 (2026-07-31)** — loop-per-role, mobile-first, timestamped passes, density floor, comment index.
