---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
steward: routine-ricky
cadence: pointer only — authoritative cadence is the row in routines/schedule.md
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 15
model: loop-per-role
---

> ⚠️ **Frontmatter is metadata, never a switch.** A `status:` key used to sit here. It was removed 2026-08-01: `routines/schedule.md`'s table is the ONLY on/off switch (LOCKED 2026-07-30, Michael, who cut exactly this kind of second switch the day it shipped). Never decide whether to run this from the header above.

# Job Market Refresh

goal:       every pass restates the ENTIRE live market for each configured role — same listings, new listings, disappeared listings — to one standing ClickUp thread, with the TSV as the structured index behind it.
target:     `routines/job-market-state.tsv` (source of truth) · the standing thread `86ajtgbt3` (read surface) · `routines/last-run/job-market.txt` (stamp). **Creates no tasks and sends nothing.**
report-to:  DETAIL → the standing thread `86ajtgbt3` (role blocks + pass summary). ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

**WHAT this does.** The WHEN lives in `routines/schedule.md`. The universal floor lives in `routines/README.md` — including **THE STAMP LAW** and **rule 13 (complete loops)**, both of which this routine leans on hard because it is the longest procedure we have.

## Locked decisions

> **📱 MOBILE FIRST. NO TABLES.** (LOCKED 2026-07-31, Michael)
> Markdown tables don't reflow on phones. Every listing is a stacked block of short lines. Nothing in a pass output may be a table. The TSV is machine state; the thread is narrative.

> **🏘️ STANDING INVENTORY, NOT A CHANGE LOG.** (LOCKED 2026-07-30, Michael)
> Every pass restates the entire market. Sameness is a finding. Days-on-board and disappearances are the highest-signal facts.

> **🕐 PASSES = DATE AND TIME, NEVER NUMBERED.** (LOCKED 2026-07-31, Michael)
> Identity is `YYYY-MM-DD HH:MM ET`. Reference previous pass by timestamp + elapsed interval.

> **🔁 LOOP, NOT SUMMARY.** (LOCKED 2026-07-31, Michael)
> Each role is its own market entity. The routine loops over the role config and produces a SEPARATE, COMPLETE report per role. Shared lane/TSV column does NOT mean shared summary. Every role gets the same depth, the same template, the same treatment. No aggregation across roles in the output.

> **📊 DENSITY FLOOR: 40-60 LIVE LISTINGS PER PASS.** (LOCKED 2026-07-31, Michael)
> The performing arts market is not sparse. A pass yielding fewer than 40 listings means the sweep was shallow, NOT that the market is thin. If total live drops below 40, the agent MUST: (1) re-sweep all Tier 1 sources with alternate keyword permutations, (2) expand to Tier 2 sources not yet hit, (3) try paginated/filtered views on gated boards. The density floor is a quality gate, not a stretch goal. **A pass below 40 is a DECLARED FAILURE** — per THE STAMP LAW it does NOT stamp, and it must be retried or reported as incomplete with an explanation of what blocked each source.

> **🗂️ PASS SUMMARY = TABLE OF CONTENTS.** (LOCKED 2026-07-31, Michael)
> The Pass Summary comment MUST include a comment index with hyperlinks to each ROLE HEADER comment posted during the run (plus the SOURCES comment). Threaded replies under those headers do NOT need individual links. On mobile, threaded comments collapse or get lost. The summary is the reader's navigation layer; direct links to each role header let the reader jump straight to any role's block.

> **🔁 COMPLETE LOOPS — THIS IS THE ROUTINE THAT WILL TEMPT YOU.** (LOCKED 2026-08-01, Michael)
> This is by far the longest procedure in `routines/`, and length is not a reason to hurry. **Never skip a keyword, a board, a page of pagination, or a template section because the pass feels long.** Finish each ROLE completely — header, SAME, NEW, GONE, NOTABLE — before starting the next one. If you are going to run out of room, stop at a **role boundary**, commit the TSV rows you have, and say exactly which roles were not swept. A shallow sweep is indistinguishable from a thin market, which is the entire reason the density floor exists.

> **🧵 THREAD FINDINGS, NEVER FLAT.** (LOCKED 2026-08-02, Michael)
> The top-level comment thread must be TIGHT: only role headers and the pass summary appear as root comments. ALL listing detail (SAME, NEW, GONE, NOTABLE) is posted as THREADED REPLIES under the relevant role header. A pass that posts SAME/NEW/GONE as root-level comments is STRUCTURALLY BROKEN regardless of content quality. The mechanic: post the role header, capture its comment ID, then use that ID as the parent for every subsequent reply in that role's block. If the comment tool requires a `parent` or `comment_id` parameter to thread, USE IT. A flat dump of 10+ root comments is unreadable on mobile and defeats the entire architecture.

> **📐 SLIM SAME/GONE, RICH NEW.** (LOCKED 2026-08-02, Michael)
> SAME and GONE blocks use a **single-line-per-listing** format: all info on one line, no separators, no stacking. These blocks should be tiny. NEW listings keep the full stacked template (multi-line, separators, qualification note) because those are the ones worth reading in detail. The density of SAME/GONE is the point: scan 20 listings in 20 lines.

## 📍 Architecture

**One task, one conversation, three persistence layers.**

- **Standing thread:** `86ajtgbt3`
- **Never create a second research task.** Applications list (`900600097138`) = funnel, not inventory. Listings become tasks there ONLY when Michael says to act.

| Layer | Holds | Read by |
|-------|-------|--------|
| `routines/job-market-roles.json` | **The gate.** Defines which roles to search, with what keywords, on what boards. The loop driver. | Every pass (step 1). |
| `routines/job-market-state.tsv` | Structured index. Every live listing normalized. Also an organic **venue/org index**: the `org` column is growing a theatre directory as a side effect. | Each role iteration (filtered by lane). |
| Comment thread | Narrative. One standalone header per role per pass. | Michael on his phone. |

**TSV is source of truth.** Thread is the read surface. TSV wins disagreements.

### State rules

- A listing enters the TSV when found AND its direct URL is captured (`status=live`).
- `gone` when it disappears. Gone rows stay one pass, then get deleted. Git preserves history.
- `acted` when Michael says to act and an Application task is created.
- Uncommitted pass = didn't happen.

## 🔑 The Gate: `routines/job-market-roles.json`

This file IS the loop. It defines:

- **`roles[]`**: ordered list of role objects. The routine iterates this list top to bottom. Every entry gets a full, independent search pass.
- **Per role:** `id`, `display`, `lane`, `keywords[]`, `levels[]`, `exclude_terms[]`, `constraints{}`
- **`global{}`**: settings that apply to ALL roles (geography, remote, part-time, contract, academic filter, overhire filter)

### How the gate drives execution

```
for each role in roles.json:
    1. filter TSV to this role's lane -> known inventory
    2. walk ALL source boards using this role's keywords + exclude_terms
    3. apply global constraints (geography, academic, overhire)
    4. reconcile against known inventory
    5. update TSV rows for this role
    6. post standalone comment block for this role
    7. move to next role
```

**Single-role invocation:** the routine can also be triggered for ONE specific role (e.g. "do job search for stage manager"). In that case, execute steps 1-6 for that role only, skip the rest. Same template, same depth, same output. The only difference is loop length = 1.

### Adding/removing roles

To add a new role: add an entry to `roles[]` in the JSON. Next pass picks it up automatically.
To retire a role: remove it from the JSON. Its TSV rows stay until they go `gone` naturally.
To adjust keywords/filters: edit the role object. Changes take effect next pass.

## 📊 State file schema (`routines/job-market-state.tsv`)

Tab-separated, header row, one listing per line.

| Column | Required | Description |
|--------|----------|-------------|
| `id` | yes | `JM-<BOARD>-<org-slug>-<role-slug>` |
| `role_id` | yes | Matches `id` field in `job-market-roles.json` |
| `lane` | yes | `PM` / `TD` / `SM` / `ME` |
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

**Normalization rules:**
- One row per listing per board. Cross-posted = two rows.
- `url` REQUIRED. No URL = no row. Log as unlinked sighting in NOTABLE.
- `salary` verbatim or empty.
- `posted` = board's date. `first_seen` = when routine captured it.
- `role_id` MUST match an entry in the JSON config. Orphan rows = error.

## 🔑 Listing IDs

```
JM-<BOARD>-<org-slug>-<role-slug>
```

Board codes: `OSJ` OffStageJobs / `USITT` / `PB` Playbill / `ECN` EntertainmentCareers.net / `AS` ARTSEARCH / `TAL` TheatreArtLife / `BWW` BroadwayWorld / `SB` StageBoard / `SJ` StageJobsy / `ACG` Arts Consulting Group / `TOC` TOC Arts Partners / `IND` Indeed / `LI` LinkedIn / `FL` Freelancer/Upwork / `LCTJ` League of Chicago Theatres / `APAP` APAP Job Bank / `SL` StageLync / `SKN` Skene Callboard / `TSJ` The Stage Jobs / `HC` HireCulture

ID is permanent. Title changes don't get new IDs.

## 🎯 Target profile

**Defined in `job-market-roles.json`.** The JSON is the single source for what roles to search, what keywords to use, and what to exclude. This section is documentation only.

### Scope (from `global`)

- **Geography: ANYWHERE.** Relocation live. Remote explicitly included.
- **Lane: NON-ACADEMIC** (deprioritized, not banned).
- **Level: ALL except pure overhire/day-call.** Senior, mid, associate, part-time, contract, remote/hybrid, drafting, smaller-scale.
- **Part-time and contract are IN.**

### What's OUT (from `global` + per-role `exclude_terms`)

- Manufacturing/industrial/logistics
- Pure crew calls, single-day overhire, internships
- Academic tenure-track (unless genuine step up)
- Per-role exclusions defined in each role's `exclude_terms[]`

## 💬 Comment architecture

> ⚠️ **THE THREADING RULE.** The top-level comment stream on this task must contain ONLY role headers and the pass summary. Nothing else. All listing data lives in threaded replies. This is not a suggestion. A pass that dumps SAME/NEW/GONE as root comments violates a locked decision and must be restructured.

**The top-level thread (what Michael sees when he opens the task):**

```
🎯 Production Manager · 2026-08-02 11:40 ET       <- ROOT
🎯 Technical Director · 2026-08-02 11:50 ET       <- ROOT
🎯 Stage Manager · 2026-08-02 11:52 ET            <- ROOT
🎯 Master Electrician · 2026-08-02 11:55 ET       <- ROOT
📋 PASS COMPLETE · 2026-08-02 11:55 ET            <- ROOT
```

That's IT at the top level. Five comments for a 4-role pass. Clean, scannable, tight.

**Inside each role header's thread (expanded by tapping the header):**

```
🎯 ROLE HEADER  <- the root comment (contains stats + verdict)
   ├── 🔁 SAME · <n>       <- reply to header (parent = header comment ID)
   ├── 🆕 NEW · <n>        <- reply to header
   ├── 🕳️ GONE · <n>       <- reply to header
   └── 📌 NOTABLE          <- reply to header (if content)
```

**Inside the pass summary's thread:**

```
📋 PASS COMPLETE  <- root comment
   └── 🔌 SOURCES <- reply to summary
```

### Threading mechanics (HOW to do this)

1. Post the 🎯 ROLE HEADER as a **new root comment** on task `86ajtgbt3`.
2. The post_comment response returns a **comment ID** (or URL). CAPTURE IT. This is the parent.
3. Post SAME as a **reply** to that comment ID (set `parent` / `comment_id` / `notify_all: false`).
4. Post NEW as a **reply** to that same comment ID.
5. Post GONE as a **reply** to that same comment ID.
6. Post NOTABLE (if any) as a **reply** to that same comment ID.
7. Move to the next role. Repeat.

**If you cannot figure out how to reply to a comment (tool limitation, missing parameter), STOP and flag it.** Do NOT fall back to posting flat root comments. A failed thread is visible; a flat dump looks intentional and confuses the reader.

**Key rules:**
- Each role's comment block is self-contained. Reading the Production Manager block tells you everything about the PM market without needing to read any other block.
- **Role header comment URLs are captured at post time.** The Pass Summary's comment index links to each role header and the SOURCES comment. Threaded replies under headers do NOT need individual links.

---

# 📐 TEMPLATES

## Template 1: 🎯 ROLE HEADER (root comment, one per role)

```
## 🎯 <ROLE DISPLAY NAME> · <YYYY-MM-DD HH:MM> ET

**Keywords:** <comma-separated from config>
**Live:** <n> · New: <n> · Gone: <n>
💵 Salary range across live: <low>-<high> (or "none posted")

### Verdict
<ONE line. Blunt. About THIS role's market only.>
```

## Template 2: 🔁 SAME (THREADED REPLY to role header) — SLIM FORMAT

> One line per listing. No separators, no stacking. The block should be scannable in seconds.

```
### 🔁 SAME · <n>

[<Role>](<url>) — <Org> · <location> · **<n>d** · 💵 <salary or —>
[<Role>](<url>) — <Org> · <location> · **<n>d** · 💵 <salary or —>
[<Role>](<url>) — <Org> · <location> · **<n>d** · 💵 <salary or —>
<repeat, one line per listing>
```

## Template 3: 🆕 NEW (THREADED REPLY to role header) — FULL FORMAT

> NEW listings get the rich stacked template. These are what Michael actually reads.

```
### 🆕 NEW · <n>

---
**[<Role>](<url>)** — <Org>
`<JM-ID>` · <location>
💵 <salary or —> · 📅 <posted>
✅ <why qualifies, <10 words>

---
<repeat per listing>
```

## Template 4: 🕳️ GONE (THREADED REPLY to role header) — SLIM FORMAT

> One line per listing. Same as SAME: dense, fast, no formatting overhead.

```
### 🕳️ GONE · <n>

**<Role>** — <Org> · `<JM-ID>` · lived <n>d · <likely cause>
**<Role>** — <Org> · `<JM-ID>` · lived <n>d · <likely cause>
<repeat, one line per listing>

<or if none: "None. Full inventory carried.">
```

## Template 5: 📌 NOTABLE (THREADED REPLY to role header, if content)

```
### 📌 NOTABLE

- <pattern or observation for THIS role only>
- **Unlinked:** <Role> — <Org> · <board> · <why no URL>
```

## Template 6: 📋 PASS SUMMARY (root comment, posted AFTER all role loops complete)

```
## 📋 PASS COMPLETE · <YYYY-MM-DD HH:MM> ET

**Roles searched:** <n> · **Total live:** <n> · **Total new:** <n> · **Total gone:** <n>
**Prev pass:** <timestamp> (<elapsed>)
[TSV](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-state.tsv) · [Roles config](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-roles.json) · [Runbook](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md) v15

<Density verdict: one line.>

### 🗂️ Comment index
- 🎯 [<Role 1 display>](<role header comment URL>) — <n> live, +<n>
- 🎯 [<Role 2 display>](<role header comment URL>) — <n> live, +<n>
- <repeat for each role>
- 🔌 [SOURCES](<sources comment URL>)
```

⚠️ **The comment index is MANDATORY.** Each role HEADER comment posted during the run gets a hyperlink here, plus the SOURCES comment. Threaded replies (SAME/NEW/GONE/NOTABLE) do NOT need individual links. This index lets the reader jump directly to any role's block from the summary.

## Template 7: 🔌 SOURCES (THREADED REPLY to pass summary)

```
### 🔌 SOURCES

- **<Board>** `CODE` — ✅/🔒/❌ · <n> qualifying
<repeat per board>
```

---

## Steps

### Pre-loop

1. **Read `routines/job-market-roles.json`** — the gate. This defines the loop.
2. **Read `routines/job-market-state.tsv`** — current full inventory.
3. **Read `routines/last-run/job-market.txt`.** `never` = first pass.
4. **If single-role invocation:** filter `roles[]` to the requested role only. Loop length = 1.

### The loop (for each role in config)

5. **Filter TSV** to rows matching this role's `role_id`. This is the known inventory for this role.
6. **Walk ALL source boards** using this role's `keywords[]`. **Sweep requirements:**
   - Try EACH keyword from the config independently (not just the first match).
   - For boards with pagination, go at LEAST 3 pages deep (or until results become irrelevant).
   - For boards with category/department filters, also browse the relevant department index (e.g. OffStageJobs "Management" department, Playbill "Production" category).
   - For boards with date sorting, scan both "newest" and "relevance" sorts.
   - If a board yields 0 results for all keywords, try adjacent terms and synonyms before marking it dry.
   - **Minimum board coverage per pass:** hit ALL Tier 1 sources and at least 4 Tier 2 sources. A pass that skips sources without explanation is incomplete.
   - Apply `exclude_terms[]` and `global` constraints. Capture direct URL for every qualifying listing.
7. **Reconcile:**
   - Matched to existing TSV row = SAME (compute days-on-board = today - `posted`)
   - New find with URL = NEW (assign `JM-ID`, set `role_id`, `lane`, `level`)
   - TSV row not found on boards = GONE
8. **Stage TSV updates** for this role: append NEW rows, mark GONE rows, update salary if newly found on SAME.
9. **Post 🎯 ROLE HEADER** as a ROOT comment on task `86ajtgbt3`. The response gives you a **comment ID**. **STORE this ID in a variable** (e.g. `pm_header_id`). You need it for the next step.
10. **Post threaded replies using the stored comment ID as parent:**
    - Post 🔁 SAME as a **reply** to `pm_header_id`.
    - Post 🆕 NEW as a **reply** to `pm_header_id`.
    - Post 🕳️ GONE as a **reply** to `pm_header_id`.
    - Post 📌 NOTABLE (if content) as a **reply** to `pm_header_id`.
    - ⚠️ Every one of these MUST set the parent/reply-to parameter. If you post without it, the comment lands as a root comment and the thread is broken.
11. **Repeat from step 5** for next role. **Finish each role completely before starting the next** (README rule 13) — a role that got a header but no SAME/NEW/GONE block is a broken loop, not a short one.

### Post-loop

12. **Density check:** If total live < 40, this is a **DECLARED FAILURE** (see the density floor above). List which sources were blocked/thin and what retry was attempted. Do NOT silently accept a thin pass, and do NOT stamp it.
13. **Commit the TSV:** `routines/job-market-state.tsv` (all role updates batched). Message: `data(job-market): <timestamp> ET — <n> live, <+-n>`. **Commit the TSV even on a below-floor pass** — the rows found are real and losing them helps nobody. The stamp is what gets withheld, not the data.
14. **Post 📋 PASS SUMMARY** as ROOT comment. **Capture its comment ID.**
15. **Post 🔌 SOURCES** as a **reply** to the pass summary comment ID. Capture its URL and include it in the index (post summary may need an edit to add this final link, OR post SOURCES first and then the summary).
16. **STAMP** — *last write, and only if the pass succeeded.* Write `routines/last-run/job-market.txt`, one line, `YYYY-MM-DD HH:MM` ET. **Per THE STAMP LAW** (`routines/README.md`): a complete pass stamps; a pass where a board was blocked but the inventory still landed is a PARTIAL and stamps with the gap named; **a below-floor pass or an aborted loop does NOT stamp** and stays overdue. *(Moved here 2026-08-01 — the stamp used to be written in step 13, before the pass summary existed. A stamp before the product lands is a lie with a timestamp on it.)*
17. **Post the roll-up** to 🧭 STANDING · Routine Ricky — Run Reports (https://app.clickup.com/t/86ajuhw1d): one line for this routine, linking the pass summary comment.

> ⚠️ **Ordering note:** Since SOURCES is threaded under the summary, you may either (a) post SOURCES first, capture its URL, then post the summary with all links including SOURCES; or (b) post the summary with role links, then post SOURCES and edit the summary to add the SOURCES link. Either approach is valid. What matters: the final state of the summary comment includes links to all role headers and SOURCES.

---

## Guardrails (STOP + flag if any is true)

*Added 2026-08-01 — this runbook shipped without a Guardrails section, which meant the busiest routine in the framework had no written STOP conditions at the moment a cold agent would need them.*

- **You are about to post SAME, NEW, GONE, or NOTABLE as a ROOT comment.** These are ALWAYS threaded replies. If you cannot figure out how to reply to a parent comment, STOP and ask. Never dump them flat.
- **You are about to create a ClickUp TASK.** This routine creates none. Listings become Application tasks ONLY when Michael says to act. A pass that files tasks is the failure mode that killed v2.
- **You are about to send anything** (email, DM, application). This routine transmits nothing, ever.
- **You are about to create a second research task or a second thread.** One task, one conversation. `86ajtgbt3` or nothing.
- **A listing has no working direct URL** → no TSV row. Log it as an unlinked sighting in NOTABLE. Never invent or reconstruct a URL.
- **A row's `role_id` doesn't match an entry in `job-market-roles.json`** → orphan row, STOP and flag rather than guessing a lane.
- **Total live is under 40** → DECLARED FAILURE. Re-sweep per the density floor; if still short, report incomplete and do NOT stamp.
- **You would post output containing a markdown table** → STOP. Mobile-first, stacked blocks only.
- **You would aggregate roles into one shared block** → STOP. Loop, not summary. Every role gets its own full treatment.
- **You are tempted to shorten the sweep because the pass is long** → STOP. That is the exact condition rule 13 exists for.
- **You would replay every missed day on a catch-up** → STOP. A late pass is ONE pass covering more days, never nine passes.
- **You would edit `job-market-roles.json` mid-pass to make results fit** → STOP. Config changes are a separate, explicit instruction.
- **You are about to stamp before step 16**, or stamp a below-floor pass → STOP. See THE STAMP LAW.

---

## Invocation modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Full loop** | Cadence is due, or "run job market refresh" | All roles in config, sequential |
| **Single role** | "do job search for [role name]" | One role only, same template, same depth |
| **Add role** | "add [role] to job search" | Edit JSON config, run that role immediately |

All modes produce the same output format. The only variable is loop length. *("Scheduled cadence" was removed from the trigger column 2026-08-01 — there is no scheduler; see `routines/schedule.md`.)*

## Sources

**Tier 1 (MANDATORY every pass, no exceptions):**

- OffStageJobs (`staging.offstagejobs.com`) `OSJ` — THE primary source. Browse department indexes (Management, Electrics, Stage Management) in addition to keyword search. This board alone should produce 10-20 qualifying listings if swept properly.
- Playbill Jobs (`playbill.com/jobs`) `PB` — Volume source. Browse Production/Management categories.
- BroadwayWorld Jobs (`broadwayworld.com/jobs`) `BWW` — Volume source. Check multiple category filters.
- StageLync (`stagelync.com`) `SL` — Updated weekly. Check Production Manager, Stage Management, Technical, and Administration categories separately.
- USITT Job Board `USITT` — Check all relevant categories.
- StageBoard (`stageboard.app` or `faizova.com`) `SB` — Aggregator pulling from 785+ employers/39 countries. High-yield if searched properly.

**Tier 2 (hit at least 4 per pass, rotate through all over multiple passes):**

- Arts Consulting Group `ACG` — Retained search, carries Director+ listings.
- TOC Arts Partners `TOC` — Retained search, senior roles.
- Skene Callboard (`skene.pub/callboard`) `SKN` — Performing arts positions and open calls.
- League of Chicago Theatres (`chicagoplays.com/jobs`) `LCTJ` — Regional, strong for ME/SM.
- APAP Job Bank `APAP` — Performing arts admin and production.
- HireCulture (`hireculture.org`) `HC` — New England focused arts jobs.
- The Stage Jobs (`jobs.thestage.co.uk`) `TSJ` — UK-heavy but carries international postings, strong backstage/technical section.
- StageJobsy (`stagejobsy.com`) `SJ` — Smaller board, quick scan.
- TheatreArtLife `TAL` — Occasional postings.
- EntertainmentCareers.net `ECN` — Paywalled but search results visible.
- ARTSEARCH `AS` — Gated (TCG), check Google cache/aggregators.
- Indeed (filtered: theatre + production) `IND` — Low yield but worth one targeted sweep.
- LinkedIn Jobs (filtered) `LI` — Check with theatre/performing arts industry filter.

**Tier 3 (monthly sweep, opportunistic):**

- Freelancer platforms / remote job boards (filtered for production/event)
- Regional theatre association boards
- AEA job postings (if accessible)
- IATSE local union boards (if accessible)
- SearchWide Global / MCA (retained search firms)

---

## 📡 Source access notes

Board realities an agent needs to know before scanning:

- **OffStageJobs (`OSJ`):** `staging.offstagejobs.com` IS the live site (not a typo). **This is the #1 source for behind-the-scenes live entertainment jobs nationally, celebrating 29 years.** Do NOT settle for 3 sightings. Browse the Management, Electrics, Stage Management, and Production department pages directly (`/jobs.php?department=management`, etc.) in addition to keyword search. Detail pages sometimes lack org name. If org is unknown, log as NOTABLE/unlinked, do NOT invent a row. Try multiple entry points: department browse, keyword search, and recent postings. If detail pages are gated on a given visit, log what's visible from index pages (title + org when shown) and flag the access issue, but the INDEX itself should yield titles and orgs for most listings.
- **StageLync (`SL`):** Clean category-based browsing. Check Production Manager, Stage Management, Technical Director, and Administration/Management categories individually. Updated weekly. Good direct URLs.
- **StageBoard (`SB`):** Aggregator. Use role taxonomy search (it normalizes 200+ job titles). Filter by Production Management, Technical Direction, Stage Management, Lighting/Electrics. May require sign-in for full details but listings are browsable.
- **Playbill (`PB`) + BroadwayWorld (`BWW`):** Volume sources for mid-level. Reliable URLs via UUID paths (PB) or numeric IDs (BWW). Most productive boards for PM/TD. Browse multiple categories, not just one keyword.
- **EntertainmentCareers.net (`ECN`):** Paywalled. Listings visible in search but detail/apply requires subscription. URLs are capturable from search results.
- **ARTSEARCH (`AS`):** Gated behind TCG membership. Listings sometimes surface via Google cache or third-party aggregators. Try `site:artsearch.tcg.org` Google searches.
- **Indeed (`IND`):** Does NOT surface theatre staff listings reliably through keyword search. Theatre-specific terms get drowned by manufacturing/logistics. Low yield, one targeted sweep per pass max.
- **APAP Job Bank (`APAP`):** Listings often lack posted dates. If no date, use `first_seen` for both `posted` and `first_seen`. Log date-absent fact in NOTABLE.
- **League of Chicago Theatres (`LCTJ`):** Clean URLs, Chicago-focused. Good for ME and SM roles specifically.
- **Skene Callboard (`SKN`):** Free, open access. Filter by Position type. Covers grants and open calls too (ignore those, positions only).
- **The Stage Jobs (`TSJ`):** UK-focused but lists international roles. Strong backstage/technical section (34+ listings typical). Filter to Backstage & Technical, Management.
- **HireCulture (`HC`):** New England arts organizations. Smaller volume but catches roles other boards miss.

---

## 🧊 Cold-agent intelligence

Operational knowledge for any agent picking this up cold:

### Density expectations

**The performing arts job market is NOT sparse.** At any given time there are 40-60+ qualifying postings across production management, technical direction, stage management, and electrics at the staff level nationally. If a pass finds fewer than 40, the agent swept too shallowly or too few sources. The fix is ALWAYS more thorough sweeping, never accepting a thin result.

Expected yield by lane (approximate):
- PM lane: 15-25 listings (highest open-board volume)
- TD lane: 8-15 listings (overlaps PM frequently)
- SM lane: 5-10 listings (thinner on open boards, union-heavy)
- ME lane: 5-10 listings (thinner on open boards, IATSE-heavy)

Expected yield by source (when swept properly):
- OffStageJobs: 10-20 qualifying (the national source for backstage jobs)
- Playbill + BWW combined: 8-15 qualifying
- StageLync: 3-8 qualifying
- StageBoard: 5-10 qualifying (aggregator, high coverage)
- Retained search firms (ACG + TOC): 2-5 qualifying (senior/director level)
- Regional boards (LCTJ, APAP, Skene, HC): 3-8 combined

### Where the top-of-market lives

- **Retained search firms (ACG, TOC, MCA/SearchWide Global)** carry ALL the Director+ listings. Check them first when scanning PM lane at senior level.
- **OffStageJobs** is the national standard for behind-the-scenes staff positions. 29 years running. If the sweep isn't finding volume here, the approach is wrong.
- **Playbill + BWW** are the volume sources for mid-level across all lanes.
- **StageLync** is newer but actively maintained, updated weekly, good category structure.
- **StageBoard** aggregates across 785+ employers. High signal if filtered correctly.
- **Regional association boards (LCTJ, APAP, Skene)** catch niche postings the big aggregators miss.

### Lane-specific realities

- **SM and ME lanes are THINNER on open boards** (not absent). Staff-level positions in these lanes often fill through union calls (AEA for SM, IATSE for ME) or direct solicitation. Open-board scans will always be sparser here. That's expected, not a failure. But "sparser" means 5-10, not 0-1.
- **PM lane has the highest open-board volume.** Most theatres post PM roles publicly.
- **TD lane overlaps PM frequently.** "Technical Director/Production Manager" combo titles are common at smaller houses. Tag to TD lane, cross-reference PM.

### Org/venue data

The TSV's `org` column is building a theatre directory organically. Let it grow. Every new listing adds to the venue knowledge base. Future integration potential: CRM-style company/venue list that feeds constraints back into the search (e.g. "skip orgs we've already applied to"). Not built yet, but the data is accumulating.

### Procedural notes

- Search firms carry top-of-market. Check ACG + TOC FIRST on every pass.
- Cross-posted listings are common between PB and BWW. Two rows, same org. Not duplicates.
- If a listing URL goes dead between passes, mark GONE. Don't try to find it elsewhere.
- APAP dates are unreliable. Use NOTABLE to flag.
- Never add a row without a working URL. The NOTABLE section exists for unlinked sightings.
- **When a board is "gated" or yields few results:** try alternate entry points (category browse, department pages, paginated views, Google site: searches). Log what was attempted. A gated board is a NOTABLE entry explaining the access issue, not a reason to accept low yield across the whole pass.
- **Keyword exhaustion:** don't stop at the first keyword that returns results. Try ALL keywords in the role config against each board. Different boards index differently. "Production Manager" and "Director of Production" often live in different categories on the same board.

---

## Changelog

- **v15 (2026-08-02)** — added 📐 SLIM SAME/GONE, RICH NEW locked decision. SAME and GONE templates collapsed to single-line-per-listing format (no separators, no stacking, all fields on one line). NEW keeps the full stacked rich template. Net effect: a SAME block with 15 listings is 17 lines instead of 60+. GONE similarly compressed. No info removed, just formatting density.
- **v14 (2026-08-02)** — added 🧵 THREAD FINDINGS, NEVER FLAT locked decision. Rewrote Comment Architecture section with explicit threading mechanics (capture comment ID, use as parent for replies). Updated Steps 9-10 with mechanical instructions for threading. Added template annotations ("THREADED REPLY to role header"). Added guardrail: posting SAME/NEW/GONE as root = STOP. Prior pass posted all findings flat; this version makes the threading requirement mechanically unambiguous.
- **v13 (2026-08-01)** — brought into the standard runbook shape: added the `goal:` / `target:` / `report-to:` header (it had none, so a cold agent had no way to learn where a run gets reported), added the **Guardrails** section (it had none at all), removed `status: active` from the frontmatter (a second on/off switch, which `schedule.md` forbids), moved the STAMP from step 13 to step 16 so it lands after the pass summary rather than before it, restated the density floor as a *declared failure* that withholds the stamp per THE STAMP LAW, and added the complete-loops lock. No change to sources, templates, IDs, or the TSV schema.
- v12 (2026-07-31) — loop-per-role, mobile-first, timestamped passes, density floor, comment index.
