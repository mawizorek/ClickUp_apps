---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
steward: routine-ricky
cadence: pointer only — authoritative cadence is the row in routines/schedule.md
state_dir: routines/job-market-state/
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 17.2
model: loop-per-role, commit-per-role, resumable-by-derivation
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
| `job-market-refresh.md` | **this file** — the Resume Scan, locked decisions, architecture, schema, steps, guardrails |
| `job-market-templates.md` | comment architecture, threading mechanics, output templates 1-9 |
| `job-market-sources.md` | the source list, board access notes, density expectations, cold-agent intelligence |

**WHAT this does.** The WHEN lives in `routines/schedule.md`. The universal floor lives in `routines/README.md` —
including **THE STAMP LAW**, **rule 13 (complete loops)** and **rule 14 (commit at the boundary)**.

---

## 🔀 THE RESUME SCAN — derive where you are, never be told

**A pass may span several sessions.** Before anything else, work out whether you are starting one or continuing
one — **by looking at what actually happened, not by reading a note that says what happened.**

> 📌 **The principle is already law in this repo: DERIVE, DON'T DECLARE.** It was written in the Routines Viewer
> defect history (`routines/next-build-spec.md`) after six bugs, every one caused by a renderer trusting a
> declared value instead of computing it — including three weeks of *"Last run: never"* on routines that had run
> fine. **A status written in prose is a snapshot that starts rotting the instant it is saved.** The 2026-08-04
> `TSV DELTA` incident is the same bug in a comment instead of a parser.

### The evidence ladder — strongest first

| # | Evidence | What it proves | Trust |
|---|----------|----------------|-------|
| **E1** | **Role header comments** on the standing thread, by pass anchor | which roles were *attempted* in this pass | 🥇 primary |
| **E2** | **Lane state files** in `routines/job-market-state/` | which roles actually *committed* | 🥇 primary |
| **E3** | **The stamp** `routines/last-run/job-market.txt` | whether a pass *landed* | 🥈 corroborating |
| **E4** | **The `⏸️ CHECKPOINT` comment** | a **HINT** left by a previous session | 🥉 **reference only** |

🔴 **E4 is never a conditional.** Read it LAST, use it to speed up or sanity-check the answer you already
derived, and **if it disagrees with E1/E2, the artifacts win and the checkpoint gets corrected.** A checkpoint
is a courtesy note from a session that no longer exists; it cannot know what happened after it was written.
This routine must produce the right answer with **no checkpoint at all** — if it can't, the scan is broken.

### The scan

1. **Read the standing thread's ROOT comments.** Every role header carries a machine anchor line
   (Template 1): `` `<role_id>` · pass `<YYYY-MM-DD HH:MM>` ``.
2. **Identify the CURRENT PASS** = the newest pass anchor found among role headers.
3. **Is there a `📋 PASS COMPLETE` carrying that same anchor?**
   - **Yes** → that pass finished. ▶️ **FRESH PASS**, start at role 1.
   - **No** → a pass is unfinished. Continue.
4. **List the roles that have a header under the current pass anchor.** Walking `roles.json` in order, the
   **first role with no header is your resume point.**
5. **Verify the boundary role** — the last one that DOES have a header. Two checks, because a header is not a
   finished role:
   - Does it have its threaded block (SAME / NEW / GONE / NOTABLE) underneath?
   - Does its lane file in `routines/job-market-state/` contain the rows that block describes?
   - **If either is missing, THAT role is the resume point**, not the next one. *(This is not hypothetical:
     on 2026-08-04 three role headers were posted with no children when threading failed mid-pass.)*
6. **Cross-check the stamp (E3).** If the stamp is NEWER than the current pass anchor, the pass landed but its
   summary is missing from the thread. **That is a contradiction — say so out loud and ask.** Do not guess.
7. **Staleness.** If the current pass anchor is older than one cadence interval (>24h for a daily routine), the
   pass is **ABANDONED, not resumable.** ▶️ **FRESH PASS** — and name the orphaned roles in the report, because
   half an inventory a day older than the other half is worse than a clean restart.
8. **Now read the checkpoint (E4)**, if one exists. Agreement → proceed, and it saves you the board list and
   elapsed time, which are genuinely not derivable. Disagreement → **trust your scan, and edit the checkpoint**
   (Template 9) so the next reader isn't misled.

**State the outcome in your first line**, with the evidence: *"FRESH — newest pass 2026-08-04 13:20 has a PASS
COMPLETE and the stamp reads 16:20"* or *"RESUME at `operations-safety` — pass 2026-08-04 13:20 has headers for
4 of 8 roles, no PASS COMPLETE, no stamp since."* The reader must be able to check your work.

🚫 **Never resume from a checkpoint's CONTENT.** It carries position, not data. What is captured lives in the
lane files.

---

## Locked decisions

> **🔎 DERIVE POSITION, NEVER DECLARE IT.** (LOCKED 2026-08-04, Michael)
> *"Instead of using them as conditionals, we could use them as references… then check the middle of the routine
> to see where we are."* The artifacts a pass leaves behind — posted headers, committed lane files, the stamp —
> ARE the position. A checkpoint is a hint about the position. **The routine must resume correctly with no
> checkpoint at all.** Anything else makes a prose note load-bearing, which is the exact defect class that
> produced the TSV-delta incident and, before it, six Routines Viewer bugs.

> **💾 COMMIT AT EVERY ROLE BOUNDARY.** (LOCKED 2026-08-04, Michael)
> A role's state file is committed the moment that role's sweep and comment block are finished — before the
> next role starts. **State is NEVER handed between sessions as text.** Michael: *"Each session should complete
> its loop fully and not try to pass TSV data between sessions for exactly the reasons you found."*
> This is also what makes E2 trustworthy: a committed lane file is proof a role finished.

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
> the whole pass reads as one event — **and so the Resume Scan can group headers by pass.** The stamp records
> when it LANDED. Those two differing is normal and expected.

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
> ⚠️ **Calibration note:** the floor was set against keyword-only sweeps and is now easy to clear. Clearing it
> is NOT evidence of a good pass. Post-department-index the working baseline is 90-120.
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
> regardless of content quality. **This is now load-bearing twice over:** a tight root stream is also what makes
> the Resume Scan cheap and unambiguous.

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

- **Standing thread:** `86ajtgbt3` — the trigger, the read surface, the checkpoint surface, **and the primary
  evidence surface for the Resume Scan**, all one task.
- **Never create a second research task.** The Applications list (`900600097138`) is a funnel, not an
  inventory. Listings become tasks there ONLY when Michael says to act.

| Layer | Holds | Read by |
|-------|-------|--------|
| `routines/job-market-roles.json` | **The gate.** Which roles to search, with what keywords. The loop driver, and the ORDER the Resume Scan walks. | Every pass. |
| `routines/job-market-state/<role_id>.tsv` | Structured index, one file per lane. Also an organic **venue/org index**. **Evidence E2.** | All read at pre-loop; one written per role boundary. |
| `routines/job-market-state/_unfiled.tsv` | Qualifying finds with no lane yet. | Pre-loop + post-loop. |
| `routines/last-run/job-market.txt` | The stamp. **Evidence E3.** | Pre-loop, and written at step 18. |
| Comment thread | Narrative + checkpoints. **Evidence E1 (role headers) and E4 (checkpoint).** | Michael, on his phone. |

**The TSVs are source of truth. The thread is the read surface. The TSVs win disagreements.**

### State rules

- A listing enters its lane file when found AND its direct URL is captured (`status=live`).
- `gone` when it disappears. Gone rows stay one pass, then get deleted. Git preserves history.
- `acted` when Michael says to act and an Application task is created.
- **Uncommitted work did not happen** — and under the Resume Scan, it will correctly be re-done.

### 🗃️ `_unfiled.tsv`

For a find that **qualifies on merit but has no lane yet.** `role_id = unfiled`, `lane = UNF`, same schema.
It has no role block, so it is reported in the Pass Summary's Unfiled section.

🚫 **NOT for rejected finds.** Overhire, below-floor, box office, academic-teaching and out-of-industry stay as
prose in NOTABLE. Miss that distinction and this becomes a junk drawer inside a month.

**Three of a kind in `_unfiled` is evidence to add a role to `job-market-roles.json`** — that routes to Corso's
feedback loop, it is not the executor's call.

### Reaction data

Before sweeping, check emoji reactions on the previous pass's individual NEW listing comments. Patterns to
track: geography · salary threshold · org type · contract type · role level. These inform Spotlight and, over
time, which borderline listings qualify vs get logged as NOTABLE only. *(You are already reading the thread for
the Resume Scan, so this costs nothing extra.)*

---

## 🔑 The gate: `routines/job-market-roles.json`

This file IS the loop, **and its `roles[]` ORDER is what the Resume Scan walks** to find the first role with no
header. Per role: `id`, `display`, `lane`, `keywords[]`, `levels[]`, `exclude_terms[]`, `constraints{}`.
`global{}` applies to all roles. `_meta._rulings` carries dated provenance for keyword moves — read it before
proposing a keyword change someone already settled.

⚠️ **Reordering `roles[]` mid-pass would corrupt a resume.** Config changes are a separate, explicit action.

```
RESUME SCAN -> fresh, or resume at role N?
for each role in roles.json (from the resume point):
    1. read this role's lane file          -> known inventory
    2. walk ALL source boards with this role's keywords AND department indexes
    3. apply global constraints (geography, academic, overhire)
    4. reconcile against known inventory
    5. post the role's comment block       <- leaves EVIDENCE E1
    6. COMMIT this lane's file             <- leaves EVIDENCE E2, and is the boundary
    7. move to next role
```

**Single-role invocation:** *"do job search for stage manager"* → filter `roles[]` to that role. Loop length 1,
same template, same depth, same commit. A single-role run does NOT stamp and does NOT satisfy the density floor
— it is a targeted top-up, not a pass. **Mark its header `top-up` on the anchor line so the Resume Scan does not
mistake it for an abandoned full pass.**

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
| `also_lanes` | optional | Pipe-separated `role_id`s this listing ALSO matches |

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
This section is documentation only. Evaluation (what makes a listing INTERESTING rather than QUALIFYING) lives
in `routines/job-market-evaluation.md`, read by Corso, not by the executor.

- **Geography: ANYWHERE.** Relocation live. Remote explicitly included.
- **Lane: NON-ACADEMIC** (deprioritized, not banned).
- **Level: ALL except pure overhire/day-call.**
- **Part-time and contract are IN.**

**What's OUT:** manufacturing/industrial/logistics · pure crew calls, single-day overhire, internships ·
academic tenure-track (unless a genuine step up) · per-role `exclude_terms[]`.

---

## Steps

### Pre-loop

1. 🔀 **RUN THE RESUME SCAN** (top of this file). Read the thread's root comments, derive the current pass and
   the resume point from E1/E2, corroborate with E3, then read the checkpoint E4 as a hint only.
   **State FRESH or RESUME-at-`<role_id>` in your first line, with the evidence.**
2. **Read `routines/job-market-roles.json`** — the gate. Read `_meta._rulings` too.
3. **Read ALL lane files in `routines/job-market-state/`, including `_unfiled.tsv`** — one read, the full
   inventory. Needed to dedup by URL, to catch cross-lane hits, and as Resume Scan evidence E2.
4. **If RESUMING:** start at the derived role. Do NOT re-sweep roles that have a header AND a committed lane
   file. Keep the ORIGINAL pass anchor on every remaining header. Edit any stale checkpoint to `✅ SPENT`.
5. **If single-role invocation:** filter `roles[]` to that role and mark the header `top-up`.
6. **Check reactions** on the previous pass's NEW listing comments; they inform Spotlight.

### The loop — for each role from the resume point

7. **Filter to this role's lane file.** That is the known inventory. Also collect every row in OTHER lane files
   whose `also_lanes` names this role — those are the `↔️ ALSO` pointers, not this lane's rows.
8. **Walk ALL source boards** per `job-market-sources.md`:
   - Try EACH keyword from the config independently, not just the first that returns hits.
   - 🔴 **Browse the department/category INDEX pages, not only keyword search.** Required, not a fallback — see
     the Department-Index Law. Verify the filter actually applied.
   - Paginated boards: at least 3 pages deep, or until results go irrelevant.
   - Date-sorted boards: scan both "newest" and "relevance".
   - 0 results on all keywords → try adjacent terms and synonyms before marking a board dry. For
     `operations-safety`, also sweep the venue/arena/municipal boards — thin is expected, empty means you
     looked in the wrong place.
   - **Minimum coverage:** ALL Tier 1 sources and at least 4 Tier 2.
   - Apply `exclude_terms[]` and `global` constraints. Capture a direct URL and friction type for every qualifier.
9. **Reconcile:** matched = SAME (days-on-board = today − `posted`) · new find with URL = NEW · existing row not
   found = GONE · qualifies but no lane fits = `_unfiled.tsv`.
10. **Post the role's comment block** per `job-market-templates.md`: header as ROOT **including the machine
    anchor line** (capture its comment ID), then SAME · ALSO · each NEW individually · GONE · NOTABLE as
    threaded replies. If the sweep turned up more after the header went up, **edit the header's counts.**
11. 💾 **COMMIT this lane's file now.** Message `data(job-market): <pass anchor> ET — <role_id>, <n> live, <+-n>`.
    Re-read the file's SHA immediately before writing; never write from a SHA captured earlier in the pass.
12. **Repeat from step 7.** **A role with a header but no block, or a block but no commit, is a broken loop** —
    and the Resume Scan will correctly send the next session back to redo it.

### Post-loop

13. **Density check.** Under 40 total live = **DECLARED FAILURE**: name which sources were blocked or thin and
    what retry was attempted, and do NOT stamp. Committed lane files stay committed.
14. **Commit `_unfiled.tsv`** if it gained rows.
15. **Post 📋 PASS SUMMARY** as a ROOT comment (Template 6) **carrying the pass anchor** — that anchor is what
    tells the next Resume Scan the pass is closed. Include ⚡ Spotlight and 🗃️ Unfiled if any.
16. **Post 🔌 SOURCES** as a reply to the summary, then edit the summary to add the link. On a multi-session
    pass, SOURCES covers EVERY session's coverage, not just the last one's.
17. **Edit any checkpoint from this pass to `✅ SPENT`** (Template 9).
18. **STAMP** — *last write, only if the pass succeeded.* `routines/last-run/job-market.txt`, one line,
    `YYYY-MM-DD HH:MM` ET **of when it landed**. Per THE STAMP LAW: complete pass stamps · a blocked board with
    the inventory still landed is a PARTIAL and stamps with the gap named · **a below-floor pass or an aborted
    loop does NOT stamp.**
19. **Post the roll-up** to 🧭 STANDING · Routine Ricky — Run Reports (https://app.clickup.com/t/86ajuhw1d), linking the pass summary
    and the commits. Include the `Ledger:` line.

### If you must stop mid-loop

Stop at a **role boundary**, never inside one. Every finished lane is already committed and its header is
already posted, so **the next session can find its place with or without your note.** Post a ⏸️ CHECKPOINT
(Template 8) as a courtesy — position, SHA, boards hit, elapsed. **Do not stamp.**
🚫 **Never paste row data into a checkpoint.** If you want the next session to have a row, commit it.

---

## Guardrails (STOP + flag if any is true)

- **You are about to trust a checkpoint instead of deriving position.** E4 is a hint. Derive first, then compare.
- **You are about to skip the Resume Scan** because a checkpoint looks clear, or because there is no checkpoint
  at all. The scan runs either way — its whole point is working without one.
- **Your scan and the checkpoint disagree and you are about to follow the checkpoint.** The artifacts win.
  Correct the checkpoint.
- **The stamp is newer than the newest pass anchor** → contradiction. Say so and ask. Never guess.
- **You are about to resume a pass more than a cadence interval old.** That is ABANDONED. Start fresh and name
  the orphaned roles.
- **You are about to re-sweep a role that has a header AND a committed lane file.** That work is done.
- **You are about to skip a role that has a header but NO block or NO commit.** That work is not done.
- **You are about to stamp a pass you only partly ran** because it "feels finished." An aborted loop does not
  stamp — that is what makes it resumable.
- **You are about to post a role header without the machine anchor line.** The next Resume Scan needs it.
- **You are about to post SAME, ALSO, NEW, GONE or NOTABLE as a ROOT comment.** Always threaded replies. If you
  cannot reply to a parent, STOP and ask — a flat dump also corrupts the Resume Scan's root-comment evidence.
- **You are about to lump multiple NEW listings into one comment.** Each is its own reply.
- **You are about to leave a role header with no block under it.** Attach the block or correct the header.
- **You are about to start the next role without committing the current one.** That is the boundary.
- **You are about to write a lane file using a SHA read earlier in the pass.** Re-read it.
- **You are about to put the same listing in two lane files.** One listing = one row = one home file.
- **You are about to put a REJECTED find in `_unfiled.tsv`.** Rejects are prose in NOTABLE.
- **You are about to paste TSV rows into a ClickUp comment** for a later session to apply. Commit them instead.
- **You are about to reorder or edit `roles.json` mid-pass.** That corrupts a resume. Separate, explicit action.
- **You are about to skip, deprioritise or retire a lane because it is thin.** Not your call; ruled twice.
- **You are about to conclude a role "does not exist" because a keyword returned zero.** Zero is a fact about
  your sources. Name the boards you checked first.
- **You are about to change the schema mid-pass.** Build session only (README rule 7).
- **You are about to create a ClickUp TASK.** This routine creates none.
- **You are about to send anything** (email, DM, application). This routine transmits nothing, ever.
- **You are about to create a second research task or thread.** `86ajtgbt3` or nothing.
- **A listing has no working direct URL** → no row. Unlinked sighting in NOTABLE. Never invent a URL.
- **A row's `role_id` doesn't match the config or its filename** → STOP and flag.
- **A listing is flagged "reported for review" on its board** → not admitted. NOTABLE only.
- **Total live is under 40** → DECLARED FAILURE. Re-sweep; if still short, report incomplete and do NOT stamp.
- **You would post a markdown table** → STOP. Mobile-first, stacked blocks only.
- **You would aggregate roles into one shared block** → STOP. Loop, not summary.
- **You are tempted to shorten the sweep because the pass is long** → STOP. Rule 13.
- **You would skip the department indexes** because keyword search returned plenty → STOP. Volume is not coverage.
- **You would replay every missed day on a catch-up** → STOP. A late pass is ONE pass covering more days.
- **A board name in SOURCES is plain text** → STOP. Every board name links to its homepage.

---

## Invocation modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Pick this up** | "pick this up" / "let's pick this up" on the standing task | **Run the Resume Scan first**, then either a fresh full loop or a resume at the derived role. The primary door. |
| **Full loop** | "run job market refresh", or the cadence is due | All roles in config, sequential, committed per role |
| **Single role** | "do job search for [role name]" | One role only, same template and depth. Marked `top-up`; does not stamp. |
| **Add role** | "add [role] to job search" | Edit the JSON config, create the lane file, run that role immediately |

---

## Changelog

- **v17.2 (2026-08-04)** — **THE RESUME SCAN: derive position, don't read it.** Michael: *"Instead of using them
  as conditionals, we could use them as references… then check the middle of the routine to see where we are."*
  (1) Position is now DERIVED from posted role headers + committed lane files, walking `roles[]` order; the
  checkpoint is demoted from conditional to **hint (E4)**, verified and never obeyed. **The routine now resumes
  correctly with no checkpoint at all.** (2) Boundary verification added — a header without its block or commit
  means that role is the resume point, catching the orphan-header failure seen 2026-08-04. (3) Abandoned-pass
  rule: an unfinished pass older than one cadence interval is a fresh start, not a resume. (4) Contradiction
  handling: stamp newer than the newest pass anchor = stop and ask. (5) Role headers now carry a machine anchor
  line (`role_id` + pass) so the scan is exact rather than fuzzy-matching display names. (6) Single-role runs
  marked `top-up` so they are never mistaken for an abandoned pass.
- **v17.1 (2026-08-04)** — The Resume Test: a deterministic fresh-vs-resume decision arbitrated by stamp vs
  newest checkpoint, replacing "is the checkpoint from today" (which misfired live). Superseded within the hour
  by v17.2, which removed the dependence on the checkpoint entirely. Consumed checkpoints must be edited to
  `✅ SPENT`; the three 08-04 rulings folded in as the no-lane-is-ever-skipped lock.
- **v17 (2026-08-04)** — **Per-role commits and per-lane state files.** (1) 💾 COMMIT AT EVERY ROLE BOUNDARY,
  resolving a v13-era contradiction between the complete-loops lock and the single post-loop commit. (2) 🗂️
  State split into `job-market-state/<role_id>.tsv`. (3) 🔗 `also_lanes` + the one-row-one-home rule + Template
  2b. (4) 🗃️ `_unfiled.tsv` with an explicit not-for-rejects rule. (5) ⏸️ CHECKPOINT rewritten to carry POSITION
  only — the `📋 TSV DELTA` block deleted and never to return. (6) 🔴 The Department-Index Law. (7) Density floor
  annotated as a tripwire, not a target. (8) File split into runbook + templates + sources. Migration record:
  `routines/job-market-state/_MIGRATION.md`. Promoted upward as universal Discipline rule 14 in `README.md`.
- **v16 (2026-08-02)** — one comment per NEW listing (reaction surface) · reaction-based rating read forward ·
  ⚡ Spotlight · friction icons · board homepage links · `friction` column added.
- **v15 (2026-08-02)** — 📐 SLIM SAME/GONE, RICH NEW.
- **v14 (2026-08-02)** — 🧵 THREAD FINDINGS, NEVER FLAT, with explicit threading mechanics.
- **v13 (2026-08-01)** — standard runbook header, first Guardrails section, `status:` removed from frontmatter,
  STAMP moved after the pass summary, density floor as a declared failure, complete-loops lock.
- **v12 (2026-07-31)** — loop-per-role, mobile-first, timestamped passes, density floor, comment index.
