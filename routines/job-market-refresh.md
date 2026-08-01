---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
status: active
steward: routine-ricky
cadence: see routines/schedule.md
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 12
model: loop-per-role
---

# Job Market Refresh

**WHAT this does.** The WHEN lives in `routines/schedule.md`. The universal floor lives in `routines/README.md`.

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
> The performing arts market is not sparse. A pass yielding fewer than 40 listings means the sweep was shallow, NOT that the market is thin. If total live drops below 40, the agent MUST: (1) re-sweep all Tier 1 sources with alternate keyword permutations, (2) expand to Tier 2 sources not yet hit, (3) try paginated/filtered views on gated boards. The density floor is a quality gate, not a stretch goal. A pass below 40 is a FAILED pass and must be retried or flagged as incomplete with an explanation of what blocked each source.

> **🗂️ PASS SUMMARY = TABLE OF CONTENTS.** (LOCKED 2026-07-31, Michael)
> The Pass Summary comment MUST include a comment index with hyperlinks to each ROLE HEADER comment posted during the run (plus the SOURCES comment). Threaded replies under those headers do NOT need individual links. On mobile, threaded comments collapse or get lost. The summary is the reader's navigation layer; direct links to each role header let the reader jump straight to any role's block.

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

**Each role gets its own standalone root comment.** Not threaded under a shared header. Independent blocks, one per role, posted sequentially during the loop.

```
FOR EACH ROLE:
  🎯 ROLE HEADER  <- root comment (standalone)
     |-- 🔁 SAME     <- threaded under this role's header
     |-- 🆕 NEW      <- threaded
     |-- 🕳️ GONE     <- threaded
     +-- 📌 NOTABLE  <- threaded (if content)

AFTER ALL ROLES:
  📋 PASS SUMMARY  <- root comment (the only cross-role output)
     +-- 🔌 SOURCES  <- threaded
```

**Key rules:**
- Each role's comment block is self-contained. Reading the Production Manager block tells you everything about the PM market without needing to read any other block.
- **Role header comment URLs are captured at post time.** The Pass Summary's comment index links to each role header and the SOURCES comment. Threaded replies under headers don't need individual links.

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

## Template 2: 🔁 SAME (threaded under role header)

```
### 🔁 SAME · <n>

---
**[<Role>](<url>)** — <Org>
`<JM-ID>` · <location> · **<n>d**
💵 <salary or —>

---
<repeat per listing>
```

## Template 3: 🆕 NEW (threaded under role header)

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

## Template 4: 🕳️ GONE (threaded under role header)

```
### 🕳️ GONE · <n>

---
**<Role>** — <Org>
`<JM-ID>` · lived <n>d · <likely cause>

---
<or: "None. Full inventory carried.">
```

## Template 5: 📌 NOTABLE (threaded under role header, if content)

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
[TSV](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-state.tsv) · [Roles config](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-roles.json) · [Runbook](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md) v12

<Density verdict: one line.>

### 🗂️ Comment index
- 🎯 [<Role 1 display>](<role header comment URL>) — <n> live, +<n>
- 🎯 [<Role 2 display>](<role header comment URL>) — <n> live, +<n>
- <repeat for each role>
- 🔌 [SOURCES](<sources comment URL>)
```

⚠️ **The comment index is MANDATORY.** Each role HEADER comment posted during the run gets a hyperlink here, plus the SOURCES comment. Threaded replies (SAME/NEW/GONE/NOTABLE) do NOT need individual links. This index lets the reader jump directly to any role's block from the summary.

## Template 7: 🔌 SOURCES (threaded under pass summary)

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
9. **Post 🎯 ROLE HEADER** as root comment. **Capture comment URL.**
10. **Post threaded replies** under role header: SAME / NEW / GONE / NOTABLE (if content).
11. **Repeat from step 5** for next role.

### Post-loop

12. **Density check:** If total live < 40, flag pass as BELOW FLOOR. List which sources were blocked/thin and what retry was attempted. Do NOT silently accept a thin pass.
13. **Commit TSV + stamp in one push:**
    - `routines/job-market-state.tsv` (all role updates batched)
    - `routines/last-run/job-market.txt` (one line: `YYYY-MM-DD HH:MM ET`)
    - Message: `data(job-market): <timestamp> ET — <n> live, <+-n>`
14. **Post 📋 PASS SUMMARY** as root comment. **Build the 🗂️ Comment index** from the role header URLs captured in step 9 across every role iteration, plus the SOURCES comment URL from step 15. Each role header and the SOURCES comment get a hyperlink. Threaded replies do not.
15. **Post 🔌 SOURCES** threaded under summary. Capture its URL and include it in the index (post summary may need an edit to add this final link, OR post SOURCES first and then the summary).

> ⚠️ **Ordering note:** Since SOURCES is threaded under the summary, you may either (a) post SOURCES first, capture its URL, then post the summary with all links including SOURCES; or (b) post the summary with role links, then post SOURCES and edit the summary to add the SOURCES link. Either approach is valid. What matters: the final state of the summary comment includes links to all role headers and SOURCES.

---

## Invocation modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Full loop** | Scheduled cadence or "run job market refresh" | All roles in config, sequential |
| **Single role** | "do job search for [role name]" | One role only, same template, same depth |
| **Add role** | "add [role] to job search" | Edit JSON config, run that role immediately |

All modes produce the same output format. The only variable is loop length.

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
