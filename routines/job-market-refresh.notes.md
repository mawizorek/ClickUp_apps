# Job Market Refresh — Notes, Locked Decisions & Changelog

> **Sidecar to `job-market-refresh.md`, split out 2026-08-31 (v18).** The runbook holds **WHAT TO DO**.
> This file holds **WHY** — the locked decisions, the provenance, the failure log, the changelog.
>
> 🔴 **One claimant each.** On a disagreement about PROCEDURE the runbook wins. On a disagreement about
> PROVENANCE this file wins. 🚫 Never restate a locked decision in both files.
>
> **Why the split happened:** the runbook reached **34,668 B**. The repo's own rule is that a file you
> cannot read whole you cannot safely edit, and a whole-file rewrite at that size is a payload problem
> that grows with every pass. The v18 fixes could not be landed safely without this split, so the fix
> and the split were one job. Precedent: `brain-config/session-board.md` 30,990 B → 6,374 B.

---

## 🔴 THE 2026-08-31 FAILURE — read this before changing the search order back

**Three defects, one root cause, all found in a single session. Every v18 rule traces here.**

Michael, after watching a pass produce one lane out of eight:

> *"I feel like we should never look at yesterday's info until you've done a complete pass on what you
> can find for today. You should always start fresh and say 'Today I'm beginning my job search for
> Michael for production manager positions.' Then you go search all of these boards. Even if seven are
> down, luckily you still have six more. It's tough, but finding at least three is a start. I wonder what
> they already had in their back pocket, and you should compare that at least... I don't know why you
> would use the existing data as your starting point when the whole point is to find new things anyway!
> You should just be searching wide and deep to find jobs."*

### Defect 1 — ORDER INVERSION (the root cause)

v17.3 step 7 read the lane file FIRST, then swept. So **yesterday's inventory framed today's search**
instead of being something today's search got compared against. Consequences observed live:

- The executor reasoned *"I cannot verify the 8 rows I hold, therefore there is no point sweeping this
  lane"* — **two unrelated questions collapsed into one.** Whether an OLD row is still live and whether
  a NEW row exists today are independent, and only the second one is the job.
- ⭐ **The generalising line: the value of a pass is what it FINDS, not what it CONFIRMS.** Verification
  is a service the pass performs on the side. A pass that verifies nothing and finds three real jobs is
  a good pass. A pass that verifies everything and finds nothing is a status report.
- Proof it was method and not market: **three searches after the executor declared the PM lane
  unworkable produced ~8 qualifying finds**, including a **$150,000-175,000 VP of Operations** at the
  Hobby Center posted three days earlier — the single best-fit senior listing the routine has ever
  surfaced. It was there the whole time. Nobody looked, because the reconciliation step had already
  concluded the lane was dead.

### Defect 2 — "THE BOARD IS DOWN" WAS A CATEGORY ERROR

Seven boards' index pages failed and the executor reported *"the source layer is down."* **False.**
**Playbill and StageLync listings were fully reachable by SEARCH the entire time** — individual
listings with dates, salaries, deadlines and first-party URLs. Only the index doors were shut.

- 🔴 **An index page is a DOOR, not the board.** One door failing is not the building being closed.
- The same session had already proven the second door twice (the org+title recovery procedure) and
  **still did not think to apply it to a whole board.** A technique used on a single listing was not
  generalised to the source.
- ⚠️ This invalidated the morning's DECLARED FAILURE. The declaration itself was honest — no stamp, no
  invented rows — but its reasoning was wrong, and **an honest report of a wrong conclusion is still a
  wrong conclusion.**

### Defect 3 — A LANE WAS SKIPPED ON AN EXECUTOR JUDGMENT CALL

The no-lane-is-ever-skipped lock was written against skipping for THINNESS. The executor skipped seven
lanes for BROKEN SOURCES and did not notice it was the same act. **The lock now covers both**, plus the
rule that lane order is walked from role 1 rather than jumping to whichever lane looks easiest — on
08-31 the executor ran role 5 first because its sources were up, and never said so plainly.

### What was RIGHT and must not be "fixed"

- **The Resume Scan worked perfectly.** It derived ABANDONED at 23.9 days with checkable arithmetic.
- **Nothing was stamped, no row was invented, no URL was fabricated, no lane file was faked.** Every
  refusal was correct. The failure was in what the pass DIDN'T DO, not in anything it did.
- **A false claim was self-caught before it committed** (an "ACG doc rot" finding that was the
  executor's own misremembered URL). Keep that reflex.

---

## Locked decisions

> 🔎 **DERIVE POSITION, NEVER DECLARE IT.** (LOCKED 2026-08-04, Michael)
> *"Instead of using them as conditionals, we could use them as references… then check the middle of the
> routine to see where we are."* The artifacts a pass leaves behind — posted headers, committed lane
> files, comment timestamps, `site` codes, the stamp — ARE the position. A checkpoint is a hint.
> **The routine must resume correctly with no checkpoint at all.** That is the acceptance test.
> ⚠️ **Extended 2026-08-04:** before writing ANY status into prose, ask what artifact already implies it.
> **Only a negative result — a board swept that returned nothing — genuinely needs stating**, because
> absence leaves no trace. Everything else is a second claimant and will rot.

> 🔍 **SEARCH FIRST, RECONCILE SECOND.** (LOCKED 2026-08-31, Michael) See the failure above. The lane
> file is the thing you COMPARE TO, never the thing you START FROM.

> 🚪 **A DOOR IS NOT A BOARD.** (LOCKED 2026-08-31) An index page failing means that ENTRY POINT failed.
> Try the other doors before recording a board as unreachable.

> 💾 **COMMIT AT EVERY ROLE BOUNDARY.** (LOCKED 2026-08-04, Michael)
> A role's state file is committed the moment that role's sweep and comment block are finished — before
> the next role starts. **State is NEVER handed between sessions as text.** Michael: *"Each session
> should complete its loop fully and not try to pass TSV data between sessions for exactly the reasons
> you found."* This is also what makes E2 and E6 trustworthy: a committed lane file is proof a role
> finished, and its `site` codes are proof of which boards produced.

> 🗂️ **ONE STATE FILE PER LANE.** (LOCKED 2026-08-04, Michael)
> `routines/job-market-state/<role_id>.tsv`, filename == `role_id`, exactly. Adding a role means adding a
> file with the same stem; there is no mapping table and there must never be one. The combined file is a
> tombstone. Full design: `routines/job-market-state/_MIGRATION.md`.

> 🔗 **ONE LISTING = ONE ROW = ONE HOME FILE.** (LOCKED 2026-08-04)
> A listing matching several lanes lives in ONE file and names the others in `also_lanes`. The other
> lane's block gets an `↔️ ALSO` pointer, never a duplicated row. **Home lane = the lane whose keyword
> produced the find;** on a genuine tie the senior half of the title wins.
> ⚠️ **`also_lanes` is for dual-nature ROLES, not for unresolved CONFIG.** A title that keeps landing in
> two lanes is a keyword-placement problem — raise it once and get it ruled. `company manager` was
> carried as an `also_lanes` flag for hours before Michael simply moved the keyword. **A flag is not a
> decision.**

> 📱 **MOBILE FIRST. NO TABLES.** (LOCKED 2026-07-31, Michael)
> Markdown tables don't reflow on phones. Every listing is a stacked block of short lines. Nothing in a
> pass output may be a table. The TSVs are machine state; the thread is narrative.

> 🏘️ **STANDING INVENTORY, NOT A CHANGE LOG.** (LOCKED 2026-07-30, Michael)
> Every pass restates the entire market. Sameness is a finding. Days-on-board and disappearances are the
> highest-signal facts. ⚠️ **This is about the OUTPUT, not the METHOD** — restating the whole market is
> what the report does at the END, not permission to start from the inventory. See defect 1.

> 🕐 **PASSES = DATE AND TIME, NEVER NUMBERED.** (LOCKED 2026-07-31, Michael)
> Identity is `YYYY-MM-DD HH:MM ET`. Reference previous passes by timestamp + elapsed interval.
> ⚠️ **A multi-session pass keeps the timestamp it OPENED with**, on every role header and on the
> summary — that shared anchor is what groups them. No progress information is lost: each comment's own
> posted-at metadata records when it actually went up.

> 🔁 **LOOP, NOT SUMMARY.** (LOCKED 2026-07-31, Michael)
> Each role is its own market entity, gets a SEPARATE COMPLETE report, the same depth, the same
> template. No aggregation across roles in the output.

> 🚫 **NO LANE IS EVER SKIPPED, DEPRIORITISED OR RETIRED.** (LOCKED 2026-08-04, Michael · EXTENDED
> 2026-08-31) Two lanes were proposed for deprioritisation after one thin pass each. **Both overruled,
> and the reasoning matters more than the outcome:**
> - `drafting-design` — *"If we need to do another job search on it because we were short the first
>   time, then absolutely do that."* A thin result is a reason to sweep HARDER. **Low career value is
>   never grounds to drop coverage** — whether a lane is worth SEARCHING and whether a find is worth
>   TAKING are different questions, and only the second is Corso's.
> - `operations-safety` safety keywords — *"It is a very niche thing, but that is kind of the point."*
>   **Zero returns is evidence about your SOURCES, not about the world.** ✅ **Vindicated 2026-08-31**,
>   27 days later: the keywords they wanted to cut produced the routine's first real safety-management
>   seat (USC Colonial Life Arena — owns the venue emergency plan).
> - 🔴 **EXTENDED 2026-08-31: nor is a lane skipped because its SOURCES ARE BROKEN.** Same act, new
>   excuse. Sweep what you can reach, say what you couldn't, never skip the lane.

> 📊 **DENSITY FLOOR: 40 LIVE LISTINGS PER PASS.** (LOCKED 2026-07-31, Michael)
> Below 40 total live is a **DECLARED FAILURE** — per THE STAMP LAW it does NOT stamp.
> ⚠️ **Calibration:** the floor was set against keyword-only sweeps and is now easy to clear. Clearing
> it is NOT evidence of a good pass. Post-department-index the working baseline is 90-120. **Judge depth
> by SOURCES coverage, not by the total.**

> 🗂️ **PASS SUMMARY = TABLE OF CONTENTS.** (LOCKED 2026-07-31, Michael)
> The summary MUST include a comment index hyperlinking each ROLE HEADER comment plus SOURCES.

> 🔁 **COMPLETE LOOPS — THIS IS THE ROUTINE THAT WILL TEMPT YOU.** (LOCKED 2026-08-01, Michael)
> The longest procedure in `routines/`, and length is not a reason to hurry. Never skip a keyword, a
> board, a department index, a page of pagination, or a template section. Finish each ROLE completely —
> header, SAME, ALSO, NEW, GONE, NOTABLE, **commit** — before starting the next.

> 🧵 **THREAD FINDINGS, NEVER FLAT.** (LOCKED 2026-08-02, Michael)
> Top-level comments are ONLY role headers, checkpoints, and the pass summary. **Load-bearing twice:** a
> tight root stream keeps the thread readable on a phone AND keeps the Resume Scan's evidence unambiguous.

> 📐 **SLIM SAME/GONE, RICH NEW.** (LOCKED 2026-08-02, Michael) SAME, ALSO and GONE are
> single-line-per-listing. NEW keeps the full stacked template.

> 💬 **ONE COMMENT PER NEW LISTING.** (LOCKED 2026-08-02, Michael) So Michael can react individually.

> 🗳️ **REACTION-BASED RATING.** (LOCKED 2026-08-02, Michael)
> 🔥 hot/pursuing · 👍 solid/track it · 👎 not for me · 🤔 interesting but questions. Read forward each pass.

> ⚡ **SPOTLIGHT IN SUMMARY.** (LOCKED 2026-08-02, Michael)
> Top 3 across ALL roles: newest + highest-salary + best-fit, above the comment index.

> 🏷️ **FRICTION ICONS ON EVERY LISTING.** (LOCKED 2026-08-02, Michael)
> ✅ direct apply · 📝 email · 🔒 gated.

> 🔗 **BOARD HOMEPAGE LINKS IN SOURCES.** (LOCKED 2026-08-02, Michael) Board names are never plain text.

---

## 📍 Architecture

**One task, one conversation, three persistence layers.**

- **Standing thread:** `86ajtgbt3` — the trigger, the read surface, the checkpoint surface, **and the
  primary evidence surface for the Resume Scan**, all one task.
- **Never create a second research task.** The Applications list (`900600097138`) is a funnel, not an
  inventory. Listings become tasks there ONLY when Michael says to act.

| Layer | Holds | Evidence |
|-------|-------|----------|
| `routines/job-market-roles.json` | **The gate.** Which roles, what keywords. The loop driver and the ORDER walked. | — |
| `routines/job-market-state/<role_id>.tsv` | Structured index per lane; an organic **venue/org index**. | **E2** (committed = done) · **E6** (`site` = boards that yielded) |
| `routines/job-market-state/_unfiled.tsv` | Qualifying finds with no lane yet. | — |
| `routines/last-run/job-market.txt` | The stamp. | **E3** |
| Comment thread | Narrative + checkpoints. | **E1** headers · **E5** posted-at · **E7** zero-yield · **E4** checkpoint |

**The TSVs are source of truth. The thread is the read surface. The TSVs win disagreements.**

### State rules

- A listing enters its lane file when found AND its direct URL is captured (`status=live`).
- `gone` when it disappears. Gone rows stay one pass, then get deleted. Git preserves history.
- `acted` when Michael says to act and an Application task is created.
- **Uncommitted work did not happen** — and under the Resume Scan it will correctly be re-done.

### 🗃️ `_unfiled.tsv`

For a find that **qualifies on merit but has no lane yet.** `role_id = unfiled`, `lane = UNF`, same schema.

🚫 **NOT for rejected finds, and NOT for lane-misfits.** Overhire, below-floor, box office,
academic-teaching and out-of-industry stay as prose in NOTABLE. ⚠️ **Nor is it for a real job that no
lane covers** — on 08-31 two generic "venue technician" postings were correctly left OUT rather than
forced into `electrician` or dumped here. Miss that distinction and this becomes a junk drawer inside a
month.

**Three of a kind in `_unfiled` is evidence to add a role to `job-market-roles.json`** — Corso's
feedback loop, not the executor's call.

### Reaction data

Check emoji reactions on the previous pass's NEW listing comments: geography · salary threshold · org
type · contract type · role level. Informs Spotlight and, over time, which borderline listings qualify.

---

## 🧮 The evidence ladder — provenance

| # | Evidence | What it proves | Trust |
|---|----------|----------------|-------|
| **E1** | **Role header comments**, by pass anchor | which roles were *attempted* | 🥇 primary |
| **E2** | **Lane state files** | which roles actually *committed* | 🥇 primary |
| **E3** | **The stamp** | whether a pass *landed* | 🥈 corroborating |
| **E5** | **Comment posted-at metadata** | 🕐 elapsed, session gaps, time since last activity | 🥇 primary |
| **E6** | **`site` codes** on rows whose `first_seen` = the pass anchor | 🔌 which boards yielded | 🥇 primary |
| **E7** | **The zero-yield line** on each role header | which boards were swept and came back EMPTY | 🥈 the only stated fact |
| **E4** | **The `⏸️ CHECKPOINT` comment** | a **HINT** from a session that no longer exists | 🥉 reference only |

🩹 **E5 and E6 were added 2026-08-04 after this runbook claimed elapsed time and boards-hit "cannot be
derived" and used that claim to justify the checkpoint.** Michael: *"Literally all these comments have
metadata tagged about when they were posted... You can absolutely derive both of those things."* He was
right. **The instinct to reach for a note when the data was already sitting there is the same instinct
behind every other prose-state defect in this routine.**

🔴 **The only non-derivable fact is a negative result.** So the fix was never "write a better note" — it
was **make the negative result leave an artifact too**, which is the zero-yield line.

---

## Changelog

- **v18 (2026-08-31)** — 🔴 **SEARCH FIRST. The order inverted and the file split.** (1) The loop now
  sweeps BEFORE reading the lane file; the inventory is what you compare to, never what you start from.
  (2) **A DOOR IS NOT A BOARD** — an index page failing is not the board failing, and search is a proven
  second door (Playbill and StageLync listings were reachable all day while their indexes 404'd).
  (3) The no-lane-is-ever-skipped lock extended from THINNESS to BROKEN SOURCES, plus lane order walked
  from role 1. (4) **File split at 34,668 B** — locked decisions, architecture, evidence-ladder
  provenance and this changelog moved to `job-market-refresh.notes.md`; the runbook keeps procedure
  only. All three fixes trace to one session in which a pass produced 1 of 8 lanes and then found a
  $150-175k best-fit listing three searches after declaring the lane unworkable.
- **v17.3 (2026-08-04)** — **Elapsed and board coverage are DERIVABLE; only negative results are not.**
  E5 posted-at metadata → elapsed and the abandoned test become computed instead of felt. E6 the `site`
  column scoped by `first_seen` → which boards yielded, for free. **E7 a mandatory zero-yield line on
  every role header** — the one fact no artifact records, and conflating it with "never looked" is
  precisely what killed the safety lane for weeks. SOURCES gains ⚪ *swept, zero yield* as distinct from
  ❌ *not hit*. The checkpoint loses its last justification and becomes optional.
- **v17.2 (2026-08-04)** — **THE RESUME SCAN: derive position, don't read it.** Position derived from
  posted headers + committed lane files walking `roles[]` order; the checkpoint demoted from conditional
  to hint. Boundary verification. Abandoned passes are a fresh start. Machine anchor line.
- **v17.1 (2026-08-04)** — The Resume Test, superseded within the hour by v17.2. Consumed checkpoints
  must be edited to `✅ SPENT`; the three 08-04 rulings folded in as the no-lane-is-ever-skipped lock.
- **v17 (2026-08-04)** — **Per-role commits and per-lane state files.** COMMIT AT EVERY ROLE BOUNDARY,
  resolving a v13-era contradiction. State split into `job-market-state/<role_id>.tsv`. `also_lanes` +
  one-row-one-home. `_unfiled.tsv`. The `📋 TSV DELTA` block deleted and never to return. The
  Department-Index Law. File split into runbook + templates + sources. Promoted upward as universal
  Discipline rule 14 in `README.md`.
- **v16 (2026-08-02)** — one comment per NEW listing · reaction rating · ⚡ Spotlight · friction icons ·
  board homepage links · `friction` column.
- **v15 (2026-08-02)** — 📐 SLIM SAME/GONE, RICH NEW.
- **v14 (2026-08-02)** — 🧵 THREAD FINDINGS, NEVER FLAT, with explicit threading mechanics.
- **v13 (2026-08-01)** — standard runbook header, first Guardrails section, STAMP moved after the pass
  summary, density floor as a declared failure, complete-loops lock.
- **v12 (2026-07-31)** — loop-per-role, mobile-first, timestamped passes, density floor, comment index.

---

## 🔻 Owed

- **Five productive boards are absent from `job-market-sources.md`**, all of which returned qualifying
  listings on 2026-08-31: **artsadminjobs.com** (free-to-post arts admin board, deep) ·
  **jobs.chronicle.com** · **careers.insidehighered.com** (both strong for university-venue TD/PM) ·
  **allianceforarts.com** (BC/Canada arts) · **hiringcafe**. ⚠️ Not added in the v18 commit **because
  `sources.md` is 27,384 B after its own 08-31 edit and needs its cold-agent half split to a sidecar
  first** — adding to it now repeats the mistake v18 exists to fix. **Do that split, then add these five.**
- **The search-as-second-door technique should be written into `sources.md`'s access notes** per board,
  not just as a runbook rule. Same blocker.
