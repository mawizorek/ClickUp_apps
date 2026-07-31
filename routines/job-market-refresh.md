---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
status: active
steward: routine-ricky
cadence: see routines/schedule.md
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 6
model: standing-inventory
---

# Job Market Refresh

**WHAT this does.** The WHEN lives in `routines/schedule.md` — that row is also the ON/OFF switch. The universal floor lives in `routines/README.md`. Neither is restated here.

> ## 📱 MOBILE FIRST. NO TABLES. (LOCKED 2026-07-31, Michael)
>
> Michael: *"assume i'll read on mobile. the tables don't land well."* Sent with a screenshot of this thread on a phone: a two-column table where the second column was **cut off at the screen edge**, every row inflated to four times its natural height, and the listing titles and `JM-` IDs sliced in half mid-word.
>
> **Markdown tables do not reflow. They scroll sideways, and sideways is where information goes to die on a phone.** A wide table on mobile is not "slightly worse" than on desktop — it is actively lossy, because the reader cannot see that anything is missing.
>
> **The rule: every listing is a STACKED BLOCK of short lines. Vertical scroll is native and free; horizontal scroll is a bug.** Bold labels carry the structure a table's headers used to carry. Counts are bullets. Nothing in a pass output may be a table, ever.
>
> ⚠️ **v1–v3 were table-first and every template in them was a grid.** Those templates are DELETED, not softened. If you find yourself typing a pipe character into a pass, you are running v3 and you are wrong.
>
> **Why this will be re-broken if the reason is not written down:** tables look *tidier to the author*. They align in the composer, they feel dense and organized, and the cost lands entirely on the reader on a different device. **The author's screen is not the delivery surface.**
>
> ⚠️ **This rule applies to the THREAD, not the TSV.** The state file (`routines/job-market-state.tsv`) is machine state: tab-separated, one row per listing, never rendered on a phone. It exists so the thread doesn't have to be a database. The thread is the narrative; the TSV is the index.

> ## 🏘️ THIS IS A STANDING INVENTORY, NOT A CHANGE LOG (LOCKED 2026-07-30, Michael)
>
> Michael: *"I want it to be like a housing market search where even if nothing changes and you find the same listings, that should be the update... I am fine if it is the same things day after day. If that truly is all America is showing, then maybe we begin to explore other ways of researching."*
>
> **Every pass re-states the ENTIRE current market. Sameness is a finding, not a reason to stay quiet.** "Same 6 listings, day 12 on the Goodman post, nothing new" is a complete and valuable pass — it is evidence about the market, which is the actual thing being measured.
>
> **Two things only the inventory model can see, and they are the highest-signal facts in a job market:**
> 1. **Days-on-board.** A PM role open 40 days says something real about that org. A delta log structurally cannot know this.
> 2. **Disappearances.** A listing vanishing is the single most informative event on a board, and a delta log that only reports what is NEW never notices it.

## 🕐 Passes are identified by DATE AND TIME. They are not numbered. (LOCKED 2026-07-31, Michael)

Michael: *"no need to number the passes. just date and time the pass."*

- **Pass identity is `YYYY-MM-DD HH:MM ET`.** That is the whole name.
- **Never write "Pass #3", "Pass N", or "Pass 3.2".** A counter is a second thing to maintain, it can only be derived by walking the whole thread backwards, and it goes wrong silently the first time a pass is missed or posted twice.
- **Multiple passes in one day need no special handling** — the clock time already distinguishes them. That is the counter's entire former job, done for free.
- **Reference the previous pass by its timestamp**, e.g. *"prev pass: 2026-07-31 13:45 ET (18 hours ago)."* The elapsed interval is the useful part, not the ordinal.
- The stamp file already speaks this language, so pass identity and `routines/last-run/job-market.txt` are now the same fact in the same format.

## 📍 One task. One conversation. Two persistence layers.

**Everything lives on ONE ClickUp task and nowhere else** (LOCKED, Michael: *"keep it consolidated on the one task... job hunt market research should be treated as a single task and conversation"*).

- **Standing thread:** `86ajtgbt3`
- **Never create a second research task.** Never spill the inventory into the Applications list or a doc.
- **Applications list** (`900600097138`) stays a **funnel, not an inventory.** A listing becomes a task there ONLY when Michael says to act on it. The routine does not cut lead tasks.

### The two layers

| Layer | What it holds | Who reads it |
|-------|--------------|-------------|
| **`routines/job-market-state.tsv`** | The structured index. Every live listing as a normalized row. | The next pass (primary), aggregate queries, days-on-board math. |
| **The comment thread** | The narrative. Census, verdicts, org lookups, salary analysis, source problems, near-misses. | Michael on his phone. The human read surface. |

**The TSV is the source of truth for what listings exist.** The thread is where meaning gets made. Neither replaces the other: the TSV can't carry a retraction or an org lookup, and the thread can't answer "what's the median days-on-board" without walking backwards through months of comments.

### ⚠️ How state persists

**The TSV is the inventory database.** A pass reads it to know the current market, reconciles against the boards, and writes back. Git history provides the snapshot archive for free: every commit is a dated record of what the market looked like that day.

**The thread still gets the full restatement** — for mobile reading, for the narrative, for the commentary that makes raw listings useful. But the next pass reads the TSV, not the previous comment. This breaks the "comment as API" fragility where reconstruction errors compounded across passes.

**Rules:**
- A listing enters the TSV the moment it is found **and its direct URL is captured** (status `live`).
- A listing moves to `gone` when it disappears from the board. Gone rows stay in the TSV for one full pass after disappearance (so the GONE thread can reference them), then get deleted. Git history preserves them permanently.
- A listing moves to `acted` when Michael says to act on it and an Application task is created.
- The TSV is committed as part of the pass. An uncommitted pass did not happen.

## 📊 State file schema (`routines/job-market-state.tsv`)

Tab-separated, header row, one listing per line. **Fully normalized: one fact per column, no compound fields.**

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `id` | ✅ | string | `JM-<BOARD>-<org>-<role>` — the permanent key |
| `title` | ✅ | string | Role title as posted |
| `org` | ✅ | string | Organization name |
| `location` | ✅ | string | City, State (or City, Country for non-US) |
| `site` | ✅ | string | Board code where found: `OSJ` `PB` `ECN` `USITT` `AS` `ACG` `TOC` `TAL` `BWW` `SB` `SJ` |
| `url` | ✅ | string | **Direct link to the posting. THE validation gate: no URL = no row.** |
| `posted` | ✅ | date | Date posted on the board (`YYYY-MM-DD`) |
| `first_seen` | ✅ | date | Pass date when first found (`YYYY-MM-DD`) |
| `salary` | optional | string | Posted salary range or empty (never estimated) |
| `status` | ✅ | enum | `live` \| `gone` \| `acted` |

> ⚠️ **URL IS THE VALIDITY GATE (LOCKED 2026-07-31, Michael)**
>
> Michael: *"url for posting is required always. that's the only thing that makes a row valid."*
>
> A qualifying listing found on a board **without** a capturable direct link does NOT enter the TSV. It gets logged in the thread under 📌 NOTABLE as an "unlinked sighting" with whatever identifying info was visible. It becomes a real row only when the next pass (or a targeted re-fetch) captures the URL.
>
> **Why:** a row without a URL cannot be verified, cannot be clicked through, and cannot be acted on. It is a rumor, not a datum. The TSV is an index of actionable postings, not a list of things that might exist.

**Normalization rules:**
- One row per listing per board. Cross-posted = two rows, two IDs, same org.
- `site` is the board code matching the ID prefix. Redundant by design: the column is filterable/sortable without parsing the ID.
- `url` is **REQUIRED** for every row. The link must be to the individual posting detail page, not the board's index or search results page. A listing found without a stable direct link does not enter the TSV.
- `salary` uses the posted range verbatim (e.g. `$67,000-80,000`). Never estimated, never converted.
- `posted` is the board's own date. `first_seen` is when this routine first captured it. Both are useful: `posted` gives days-on-board, `first_seen` gives coverage gaps.

**Capacity:** ~60 bytes per row average at 10 columns. The practical read ceiling (~22KB) supports ~350+ listings before the file needs pruning. The realistic live market is 15–40, so this is not a constraint.

## 🔑 Listing IDs (stable keys — assign once, never change)

Days-on-board and disappearance detection both need a listing to be recognizable across passes. Format:

```
JM-<BOARD>-<org-slug>-<role-slug>
```

- **Board codes:** `OSJ` OffStageJobs · `USITT` · `PB` Playbill · `ECN` EntertainmentCareers.net · `AS` ARTSEARCH · `TAL` TheatreArtLife · `BWW` BroadwayWorld · `SB` StageBoard · `SJ` StageJobsy · `ACG` Arts Consulting Group · `TOC` TOC Arts Partners
- Examples: `JM-OSJ-goodman-pm` · `JM-ECN-livenation-prod-mgr`
- **Slugs are lowercase kebab, abbreviated but readable.** Same posting on two boards = **two IDs**, cross-referenced in the entry (that is itself a finding: cross-posting signals a serious search).
- ⚠️ **An ID is permanent.** If a listing's title changes wording, keep the original ID and note the retitle. A new ID for an old listing resets days-on-board to zero and silently destroys the only long-run measurement this routine produces.

## 💬 Comment architecture (one pass = one header + threaded replies)

```
📋 PASS HEADER  ← root comment. Census + oldest standing + verdict.
   ├─ 🔁 SAME     ← threaded reply. Full re-listing of every carried-over listing.
   ├─ 🆕 NEW      ← threaded reply. First appearances this pass.
   ├─ 🕳️ GONE     ← threaded reply. Present last pass, absent now.
   ├─ 📌 NOTABLE  ← threaded reply. Patterns, salary sightings, repeat hirers, gaps.
   └─ 🔌 SOURCES  ← threaded reply. Per-board read status. Always posted.
```

**Rules:**

- **Header first, always.** The threaded replies hang off it, so it must exist before they can be posted. Capture its comment ID and thread everything under it.
- **SAME, GONE and SOURCES post even when empty** — an empty `GONE` block is a real measurement (nothing expired) and its absence is indistinguishable from a forgotten step. `NEW` and `NOTABLE` may be omitted only if genuinely empty, and the header must then say so in the census.
- **Style: references over prose, stacked never gridded.** Every listing carries its live link, board, ID and dates. No paragraphs where a labelled line will do — and no table where a stacked block will do.

---

# 📐 TEMPLATES (copy verbatim, fill the brackets, delete nothing)

## Template 1 · 📋 PASS HEADER (root comment)

```
## 📋 JOB MARKET PASS · <YYYY-MM-DD HH:MM> ET

**Prev pass:** <YYYY-MM-DD HH:MM> ET (<n> <hours/days> ago) · **Model:** standing inventory · **Cadence:** daily
**Catch-up:** <no · or: YES, covers <n> days>
**Runbook:** [job-market-refresh.md](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md) v6

### Census

- **Carried over (SAME):** <n>
- **New this pass:** <n>
- **Gone since prev:** <n>
- **Live inventory:** **<n>** (<±n>)
- **Unlinked sightings (no URL):** <n>
- **Near-misses logged:** <n>
- **Boards read:** <n> of <n> Tier 1 <note gated/dead>
- **Raw scanned:** ~<n>

### Oldest standing

**<n>d** · [<role>](<url>) · <org> · `<JM-ID>`
**<n>d** · [<role>](<url>) · <org> · `<JM-ID>`
<top 5>

### Verdict

<ONE line. Blunt. "Flat market, 6 listings, nothing moved in 5 days.">

**Threads below:** 🔁 SAME · 🆕 NEW · 🕳️ GONE · 📌 NOTABLE · 🔌 SOURCES
```

## Template 2 · 🔁 SAME (threaded reply — the load-bearing one)

**The stacked entry shape. Five short lines. Use it in SAME and NEW identically.**

```
### 🔁 SAME · <n> carried over — THIS BLOCK + 🆕 NEW = THE INVENTORY

*Full re-listing. The next pass reads this to know what exists.*

---

**[<Role>](<url>)** — <Org>
`<JM-ID>` · <board> · <city, ST>
💵 <$range or "none posted"> · 📅 <posted date> · **<n>d on board**
→ <unchanged · retitled · salary added · deadline nears>

---

<repeat per listing>

---

**Aging:** <listings past 30d, or "none">
**Cross-posted:** <`JM-A-x` ↔ `JM-B-x` pairs, or "none">
```

⚠️ **The `---` rules between entries are load-bearing on mobile.** Without them the blocks run together into a single grey wall and the reader loses the entry boundaries.

## Template 3 · 🆕 NEW (threaded reply)

```
### 🆕 NEW · <n> first appearances

---

**[<Role>](<url>)** — <Org>
`<JM-ID>` · <board> · <city, ST>
💵 <$ or "none posted"> · 📅 posted <date or "undated"> · **<n>d**
✅ <why it clears: lane + level, under 10 words>

---

<repeat>

---

### Org lookups

**<org>** — <one line: what they are, house size, season> <link>

### Verdict per listing

- **Act on now:** `<JM-ID>`
- **Strong watch:** `<JM-ID>`
- **Inventory only:** `<JM-ID>`
```

## Template 4 · 🕳️ GONE (threaded reply — post even if empty)

```
### 🕳️ GONE · <n> no longer on board

---

**<Role>** — <Org>
`<JM-ID>` · <board>
📅 first seen <date> · last seen <date> · **lived <n>d**
→ <filled · deadline passed · pulled · board error>

---

⚠️ **A short life (<7d) usually means an internal hire or a pre-selected candidate.** Worth noting per org — it predicts whether applying there is ever real.

<If empty: "None. Full inventory carried over intact.">
```

## Template 5 · 📌 NOTABLE (threaded reply)

```
### 📌 NOTABLE

**Patterns:** <2-4 bullets max, each with the evidence attached>

**Unlinked sightings** *(qualifying listings found without a direct URL — cannot enter TSV until link is captured)*

- **<Role>** — <Org> · <board> · <city, ST> · <why no URL: gated/index-only/JS-rendered>

**Salary sightings** *(posted numbers only, never estimates)*

- **<$range>** — <org>, <role> — <✅ inventory / near-miss / below level>

**Repeat hirers:** <org> — <n>th posting since <date>
**Qualification gaps:** <requirement that keeps appearing that Michael can't claim yet> — seen on <n>
**Near-misses:** <one line + link each>
**Market read:** <one line, only if the evidence supports it>
```

## Template 6 · 🔌 SOURCES (threaded reply — always posted)

```
### 🔌 SOURCES · <n> of <n> Tier 1 read

- **OffStageJobs** `OSJ` — ✅ read · <n> raw · <n> qualifying · <note>
- **USITT** `USITT` — ✅ read · <n> raw · <n> qualifying · dates visible, freshness anchor
- **Playbill** `PB` — ✅ read · <n> raw · <n> qualifying · <note>
- **EntertainmentCareers** `ECN` — ✅ read · <n> raw · <n> qualifying · <note>
- **ARTSEARCH** `AS` — 🔒 gated / ❌ dead · — · — · <note>

**Tier 2 checked:** <yes/no — which>
**Structural changes:** <board moved/died/paywalled, or "none">
**Freshness anchor:** USITT newest = <date> → <boards look current / board X looks stale>

<Then, if any: numbered source PROBLEMS, each with its status against the prior pass —
fixed / unfixed / newly found. A problem carried across passes must say how many.>
```

---

## Steps (a cold agent can run this with nothing but this file)

1. **Read `routines/job-market-state.tsv`** — this is the current inventory. Every row with `status=live` is a listing you expect to find on the boards. Note each `id`, `posted` date, and `first_seen` date. If the file is empty (header only), this is the first pass and everything found is NEW.
2. **Read `routines/last-run/job-market.txt`.** `never` = first pass.
3. **Open the standing thread** `86ajtgbt3` and **read the most recent PASS HEADER** for context (verdict, source problems, open questions). You do NOT need to reconstruct inventory from the thread — the TSV already has it.
4. **Walk Tier 1 in order** (see SOURCES template). Apply the target profile. Discipline-check every title against the manufacturing trap. **Capture the direct URL for every qualifying listing found.**
5. **Reconcile** against the TSV inventory: matched → SAME (days-on-board = today minus `posted`) · unmatched-new → NEW (assign a `JM-ID`) · in-TSV-but-absent-from-board → GONE. **Verify survival by an actual read, and say how you verified it** — an index listing, a detail-page fetch, or a search result. A listing assumed alive is not measured alive.
6. **Update `routines/job-market-state.tsv`:**
   - NEW listings: append a row with all columns filled. **`url` is REQUIRED.** A listing without a verifiable direct URL does not get a row. Log it in the NOTABLE thread as an unlinked sighting.
   - GONE listings: set `status` to `gone`.
   - SAME listings: update `salary` if newly discovered on a detail page. No other fields change.
   - **No empty `url` fields are permitted.** If a board renders listings without stable direct links (JS-only, session-gated), report the structural problem in SOURCES and log the sighting in NOTABLE, but do not create a row.
7. **Post the PASS HEADER** (Template 1). Capture its comment ID.
8. **Post the threaded replies** under it, in order: SAME · NEW · GONE · NOTABLE · SOURCES. SAME, GONE and SOURCES go up even if empty.
9. **Commit the TSV + stamp in one push:**
   - `routines/job-market-state.tsv` — the updated inventory.
   - `routines/last-run/job-market.txt` — one line, `YYYY-MM-DD HH:MM` ET.
   - Commit message: `data(job-market): <YYYY-MM-DD HH:MM> ET — <n> live, <±n>`
   - **An uncommitted pass did not happen.**
10. **Report to Michael in chat:** the census line and the verdict, nothing more. The thread holds the detail; do not re-narrate it.

### ⚠️ TSV is the source of truth. Thread is the read surface.

The thread still gets the full restatement every pass — Michael reads it on his phone and it needs to stand alone. But the NEXT PASS reads the TSV, not the previous comment. This breaks the "comment as API" fragility where one abbreviated pass could corrupt everything downstream.

If the TSV and the thread ever disagree, **the TSV wins.** Fix the thread to match, not the other way around.

## Target profile (LOCKED 2026-07-30, Michael)

- **Geography: ANYWHERE.** No location filter. Relocation is live. Never drop a strong non-US posting.
- **Lane: NON-ACADEMIC.** Regional/LORT theatre, commercial and touring, arena and live events, opera, production shops, corporate/broadcast live production.
  - ⚠️ **Academic is DEPRIORITIZED, not banned.** Michael holds a university PM job; the point is to look outside it. A genuine step up (director of production at a major conservatory) still earns an entry.
- **Level: at or above Production Manager.** PM, Director of Production, Senior Director of Production, Technical Director, Production Supervisor, VP Production, GM (production side). Skip crew, overhire, seasonal, internships.
- ⚠️ **The title trap.** "Production Manager" outside live entertainment means FACTORY FLOOR — plastics, switchgear, packaging, food. Michael's refer.io alert has fed exactly this for months. A manufacturing PM is not a near-miss, it is a different profession.
- ⚠️ **Scan adjacent titles by default.** Verified across two passes: the better jobs are titled **Director of Production**, not Production Manager. Searching the literal title systematically misses the top of the market.

## Sources

**Tier 1 — every pass:** OffStageJobs (⚠️ the `staging.` subdomain IS the live site; not a typo, do not "fix" it — and its filters are NOT simple GET parameters, the working URL must be captured from the form) · USITT (visible **Post Date** — the freshness anchor for the whole set) · Playbill (broadest, NYC-heavy; ⚠️ **its category taxonomy is inconsistent and verified so on two samples — scan in full, never category-filter**) · EntertainmentCareers.net (commercial/corporate/broadcast, LA-weighted) · ARTSEARCH (⚠️ subscription-gated AND it moved hosts — if the wall blocks the read, report `🔒 gated`, **never infer its contents from another board**).

**Tier 2 — weekly-ish or when Tier 1 is thin:** BroadwayWorld Classifieds · AACT · TheatreArtLife: The Market (subscription, worldwide — the only real international surface pinned) · IATSE locals · LinkedIn saved searches.

**Tier 3 — UNVETTED:** StageBoard <https://faizova.com/> · StageJobsy <https://stagejobsy.com/jobs>. Both scrape Tier 1. ⚠️ **Agreeing aggregators are ONE source, not five** — count ORIGINS, never rows. Promotion out of Tier 3 goes through Scout Sage.

### 🧭 The escape hatch Michael asked for

*"If that truly is all America is showing, then maybe we begin to explore other ways of researching."*

**Trigger it, don't wait to be asked: if THREE consecutive passes show a flat inventory (no NEW, no GONE), say so in the header verdict and propose widening.** Candidate widenings, in order of expected yield: **retained search firms** (Arts Consulting Group, TOC Arts Partners and peers — they produced two of the three best listings in the first two passes while unpinned) · TheatreArtLife + non-US boards (geography is already ANYWHERE and the source set is not) · IATSE / USA-829 local boards · direct careers pages for a named target-org list · LinkedIn saved searches. **Three flat passes is a finding about the SOURCES, not about the market.**

## Guardrails

- **Creates no tasks. Sends nothing.** No outreach, no applications, no emails. ⚠️ The standing **EMAIL SEND LOCK** applies: surface anything that wants sending, never send it.
- **Never guess a field.** Say "none posted". A guessed salary band is worse than a blank one.
- **Real posted numbers only** for salary, with the org and the source attached, or not at all.
- **Never assert a stale posting as current.** `hooks/source-freshness-gate.md` is fire-always the moment this fetches. Use USITT's dates to sanity-check the undated boards.
- **A gated source is reported gated.** `hooks/silent-fallback-law.md`: never substitute a board and report as if the pinned one answered.
- **Catch-up, don't replay.** Overdue by three weeks = ONE pass labeled a catch-up in the header. Never one pass per missed day. Days-on-board still computes correctly because it derives from `posted`, not from pass count.
- **A failed pass leaves the stamp untouched** so it stays overdue and self-heals. Report the failure in the reply, not by DM.
- **Michael's screenshot outranks anything cached.** Re-verify from scratch.
- **A conclusion drawn from a thin sample gets RETRACTED in the open when the sample grows**, struck through rather than deleted. The first pass's salary read reversed inside 24 hours on one new datapoint; that reversal is the routine working, and hiding it would make the thread untrustworthy.

## Composes with

- **`routines/schedule.md`** — cadence AND the on/off switch (mark the row retired to stop; never delete it).
- **`routines/README.md`** — Data-Refresh Discipline, the 12-rule floor.
- **`hooks/source-freshness-gate.md`** — fire-always on any fetch. Steward: Scout Sage.
- **`hooks/silent-fallback-law.md`** — no silent source substitution.
- **Scout Sage** — lane seam: a NEW source or an open market question is hers; this routine RE-CHECKS pinned ones. The escape hatch above hands off to her.

## Changelog

- **v6 (2026-07-31) — URL IS REQUIRED, NOT OPTIONAL (LOCKED).** Michael: *"url for posting is required always. that's the only thing that makes a row valid."* Purged 12 of 16 rows that lacked verifiable direct URLs. Kept 4 with confirmed links (TUTS PM, Apollo DOP, Hanover VP, EST Prod/Fac Mgr). The removed listings will re-enter on the next pass when board-walking captures their URLs. Schema updated: `url` column marked REQUIRED with a validity-gate callout. Added "Unlinked sightings" category to NOTABLE template for qualifying listings found without capturable links. Step 6 rewritten: no-URL = no row, period. Also backfilled Apollo DOP salary ($150,000-170,000) from productionondeck.com.
- **v5 (2026-07-31) — TSV STATE FILE IS NOW THE SOURCE OF TRUTH.** Michael: *"i want to implement this... data store so you've got a definitive index... the goal is always full normalization of the table."* Created `routines/job-market-state.tsv` (tab-separated, 10 columns, fully normalized). Seeded with all 16 listings from passes 2026-07-30 14:10 and 2026-07-31 13:45 ET. **The thread is no longer the database** — it is the narrative and the mobile read surface. The TSV is the structured index, and each pass reads it, reconciles, and commits back. Steps rewritten: read TSV first, commit TSV as part of the pass, TSV wins any disagreement with the thread. Added columns `site` (board code) and `url` (direct posting link) per Michael's normalization requirement. Broke the "comment as API" fragility: a pass no longer reconstructs from the previous comment.
- **v4 (2026-07-31) — DATE-TIME PASS IDS + MOBILE FIRST, TABLES DELETED.** Two corrections from Michael, both arriving after reading a real pass on a phone. (1) *"no need to number the passes. just date and time the pass"* — the ordinal counter is gone; a pass is its timestamp, which also retires the `Pass N.2` same-day convention for free and aligns pass identity with the stamp file. (2) *"assume i'll read on mobile. the tables don't land well,"* sent with a screenshot showing a column cut off at the screen edge and titles sliced mid-word. **All six templates rewritten from grids to stacked blocks; a pass may no longer contain a table at all.** Added the reason both rules exist, because a table looks tidier to the AUTHOR and the cost lands on the reader's device — the failure will be re-introduced by anyone who does not know that. **Also folded in findings the first two passes earned:** scan adjacent titles by default, Playbill's taxonomy is unreliable (2 samples), OSJ filters are not GET params, retained search firms are the top widening candidate, and survival must be verified by an actual read rather than assumed.
- **v3 (2026-07-30) — STANDING INVENTORY + TEMPLATED COMMENT THREADS.** Michael reframed the whole thing as a housing-market search: re-state the full market every pass, sameness IS the report, dense references over prose, one task and one conversation, header comment + threaded SAME/NEW/GONE/NOTABLE/SOURCES replies. **Deleted the entire delta model.** **Added:** stable `JM-` listing IDs, verbatim templates, the cold-pickup procedure, and the three-flat-passes escape hatch. **Also reversed v2's lead-task creation.** ⚠️ Its templates were all tables and were deleted by v4.
- **v2 (2026-07-30) — trigger gate removed, default ON.** Michael: *"don't really need this other gate. if i want it off, ill just have it removed from the schedule md."* A mode flag in a second system made "is this on?" a two-lookup question with two possible answers. The schedule row was always the real switch.
- **v1 (2026-07-30)** — created. Geography ANYWHERE + lane NON-ACADEMIC locked same day. Sources verified live; two corrections carried from the old ClickUp Job Search doc (ARTSEARCH moved hosts, OffStageJobs is `staging.`-only). Shipped with a ClickUp-held OFF/ON trigger, dead within the hour. ⚠️ Its standing-task link was hand-typed and wrong. Load the task, copy the ID, never type it.
