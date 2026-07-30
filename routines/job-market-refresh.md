---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
status: active
steward: routine-ricky
cadence: see routines/schedule.md
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 3
model: standing-inventory
---

# Job Market Refresh

**WHAT this does.** The WHEN lives in `routines/schedule.md` — that row is also the ON/OFF switch. The universal floor lives in `routines/README.md`. Neither is restated here.

> ## 🏘️ THIS IS A STANDING INVENTORY, NOT A CHANGE LOG (LOCKED 2026-07-30, Michael)
>
> Michael: *"I want it to be like a housing market search where even if nothing changes and you find the same listings, that should be the update... I am fine if it is the same things day after day. If that truly is all America is showing, then maybe we begin to explore other ways of researching."*
>
> **Every pass re-states the ENTIRE current market. Sameness is a finding, not a reason to stay quiet.** "Same 6 listings, day 12 on the Goodman post, nothing new" is a complete and valuable pass — it is evidence about the market, which is the actual thing being measured.
>
> ⚠️ **v1–v2 were delta logs and said the opposite** ("Delta only", "nothing new is a complete answer", skip-if-idempotent). Those lines are DELETED, not softened. If you find yourself writing "no changes since last pass" and stopping, you are running v2 and you are wrong.
>
> **Two things only the inventory model can see, and they are the highest-signal facts in a job market:**
> 1. **Days-on-board.** A PM role open 40 days says something real about that org. A delta log structurally cannot know this.
> 2. **Disappearances.** A listing vanishing is the single most informative event on a board, and a delta log that only reports what is NEW never notices it.

## 📍 One task. One conversation. The thread IS the database.

**Everything lives on ONE ClickUp task and nowhere else** (LOCKED, Michael: *"keep it consolidated on the one task... job hunt market research should be treated as a single task and conversation"*).

- **Standing thread:** `86ajtgbt3` · <https://app.clickup.com/t/86ajtgbt3>
- **Never create a second research task.** Never spill the inventory into the Applications list, a doc, or a repo state file. `routines/last-run/job-market.txt` holds a TIMESTAMP and nothing else.
- **Applications list** (`900600097138` · <https://app.clickup.com/36074068/v/li/900600097138>) stays a **funnel, not an inventory.** A listing becomes a task there ONLY when Michael says to act on it. The routine does not cut lead tasks. *(v2 had it cutting tasks per lead; that would have flooded the funnel with market noise the moment a catch-up ran.)*

### ⚠️ How state survives with no database (READ THIS — it is the whole trick)

There is no listings table. **The inventory is reconstructed from the MOST RECENT pass header and its threaded replies.** Which means:

> **Every pass must restate the full inventory, because the next pass will read only YOURS.**

A pass that abbreviates ("same as yesterday, see above") **breaks the chain** and forces the next agent to walk backwards through the thread. Full restatement every time is not redundancy; it is the persistence mechanism. This is the single rule most likely to be optimized away by someone trying to be concise. Do not.

## 🔑 Listing IDs (stable keys — assign once, never change)

Days-on-board and disappearance detection both need a listing to be recognizable across passes. Format:

```
JM-<BOARD>-<org-slug>-<role-slug>
```

- **Board codes:** `OSJ` OffStageJobs · `USITT` · `PB` Playbill · `ECN` EntertainmentCareers.net · `AS` ARTSEARCH · `TAL` TheatreArtLife · `BWW` BroadwayWorld · `SB` StageBoard · `SJ` StageJobsy
- Examples: `JM-OSJ-goodman-pm` · `JM-USITT-atlanta-symphony-flyman` · `JM-ECN-livenation-prod-mgr`
- **Slugs are lowercase kebab, abbreviated but readable.** Same posting on two boards = **two IDs**, cross-referenced in the row (that is itself a finding: cross-posting signals a serious search).
- ⚠️ **An ID is permanent.** If a listing's title changes wording, keep the original ID and note the retitle. A new ID for an old listing resets days-on-board to zero and silently destroys the only long-run measurement this routine produces.

## 💬 Comment architecture (one pass = one header + threaded replies)

Michael: *"a threaded header and a summary template up front, then thread actual separate replies inside that... maybe a comment for what's the same, what's new, and anything notable—followed by deeply populated threaded group columns."*

```
📋 PASS HEADER  ← root comment. Scoreboard + inventory census + verdict.
   ├─ 🔁 SAME     ← threaded reply. Full re-listing of every carried-over listing.
   ├─ 🆕 NEW      ← threaded reply. First appearances this pass.
   ├─ 🕳️ GONE     ← threaded reply. Present last pass, absent now.
   ├─ 📌 NOTABLE  ← threaded reply. Patterns, salary sightings, repeat hirers, gaps.
   └─ 🔌 SOURCES  ← threaded reply. Per-board read status. Always posted.
```

**Rules:**

- **Header first, always.** The threaded replies hang off it, so it must exist before they can be posted. Capture its comment ID and thread everything under it.
- **SAME, GONE and SOURCES post even when empty** — an empty `GONE` block is a real measurement (nothing expired) and its absence is indistinguishable from a forgotten step. `NEW` and `NOTABLE` may be omitted only if genuinely empty, and the header must then say so in the census.
- **Multiple headers per day are fine** if a second pass genuinely finds movement. Number them `Pass N.2`.
- **Style: references over prose.** Michael: *"It should not be prose; it should be mostly references."* Every listing row carries its live link, its board, its ID, its dates. No paragraphs. No summarizing sentence where a table row will do.

---

# 📐 TEMPLATES (copy verbatim, fill the brackets, delete nothing)

## Template 1 · 📋 PASS HEADER (root comment)

```
## 📋 JOB MARKET PASS #<N> · <YYYY-MM-DD HH:MM ET>

**Model:** standing inventory · **Cadence:** daily · **Prev pass:** #<N-1> (<YYYY-MM-DD>, <n> days ago) · **Runbook:** [job-market-refresh.md](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md)
**Catch-up:** <no · or: YES, covers <n> days since #<N-1>>

### Census

| | Count | vs prev |
|---|---|---|
| Carried over (SAME) | <n> | — |
| New this pass | <n> | <+n> |
| Gone since prev | <n> | <-n> |
| **Total live inventory** | **<n>** | **<±n>** |
| Boards read | <n>/<n> | <note gated/dead> |

### Oldest standing listings (days-on-board)

| Days | Listing | Org | Board |
|---|---|---|---|
| <n>d | [<role>](<url>) `<JM-ID>` | <org> | <board> |

### Verdict

<ONE line. Blunt. "Flat market, 6 listings, nothing moved in 5 days." / "Two new regionals, one expired.">

**Threads below:** 🔁 SAME · 🆕 NEW · 🕳️ GONE · 📌 NOTABLE · 🔌 SOURCES
```

## Template 2 · 🔁 SAME (threaded reply — the load-bearing one)

```
### 🔁 SAME · <n> listings carried over

*Full re-listing. This block IS the inventory — the next pass reads it to know what exists.*

| Listing | Org | Board | Located | Salary | First seen | Days | Status note |
|---|---|---|---|---|---|---|---|
| [<role>](<url>) `<JM-ID>` | <org> | <board code> | <city, ST> | <$ range or `—`> | <YYYY-MM-DD> | <n>d | <unchanged · retitled · salary added · deadline nears> |

**Aging flags:** <listings past 30d, or "none">
**Cross-posted:** <`JM-A-x` ↔ `JM-B-x` pairs, or "none">
```

## Template 3 · 🆕 NEW (threaded reply)

```
### 🆕 NEW · <n> first appearances

| Listing | Org | Board | Located | Salary | Posted | Deadline | Why it clears |
|---|---|---|---|---|---|---|---|
| [<role>](<url>) `<JM-ID>` | <org> | <board> | <city, ST> | <$ or `—`> | <date or `undated`> | <date or `—`> | <lane + level in <10 words> |

**Org lookups:** <org> — <one line: what they are, house size, season> · <link>
**Verdict per listing:** <`JM-ID`: worth acting on / inventory only / watch>
```

## Template 4 · 🕳️ GONE (threaded reply — post even if empty)

```
### 🕳️ GONE · <n> listings no longer on board

| Listing | Org | Board | First seen | Last seen | Lived | Likely reason |
|---|---|---|---|---|---|---|
| <role> `<JM-ID>` | <org> | <board> | <date> | <date> | <n>d | <filled · deadline passed · pulled · board error> |

⚠️ **A short life (<7d) usually means an internal hire or a pre-selected candidate.** Worth noting per org — it predicts whether applying there is ever real.

<If empty: "None. Full inventory carried over intact.">
```

## Template 5 · 📌 NOTABLE (threaded reply)

```
### 📌 NOTABLE

**Patterns:** <2-4 bullets max, each with the evidence attached>
**Salary sightings:** <org> — <$range> ([source](<url>)) · *posted numbers only, never estimates*
**Repeat hirers:** <org> — <n>th posting since <date>
**Qualification gaps:** <requirement that keeps appearing that Michael can't claim yet> — seen on <n> listings
**Near-misses:** <interesting but failed the profile — one line + link each>
**Market read:** <one line, only if the evidence supports it>
```

## Template 6 · 🔌 SOURCES (threaded reply — always posted)

```
### 🔌 SOURCES · <n>/<n> read

| Board | Status | Listings seen | Notes |
|---|---|---|---|
| [OffStageJobs](https://staging.offstagejobs.com/jobs.php) `OSJ` | ✅ read | <n> | — |
| [USITT](https://www.usitt.org/industry-resources/jobs) `USITT` | ✅ read | <n> | dates visible — freshness anchor |
| [Playbill](https://playbill.com/jobs) `PB` | ✅ read | <n> | — |
| [EntertainmentCareers](https://www.entertainmentcareers.net/) `ECN` | ✅ read | <n> | — |
| [ARTSEARCH](https://circle.tcg.org/resources/jobs) `AS` | 🔒 gated | — | subscription wall, NOT read |

**Tier 2 checked this pass:** <yes/no — which>
**Structural changes:** <board moved/died/paywalled, or "none">
**Freshness anchor:** USITT newest post date = <date> → <boards look current / board X looks stale>
```

---

## Steps (a cold agent can run this with nothing but this file)

1. **Open the standing thread** `86ajtgbt3` and **read the most recent PASS HEADER plus its 🔁 SAME and 🆕 NEW threads.** Those two blocks together ARE the current inventory. Note the pass number and every `JM-ID` with its first-seen date.
2. **Read `routines/last-run/job-market.txt`.** `never` = this is Pass #1, so there is no prior inventory: everything found is NEW and the SAME block says so explicitly.
3. **Walk Tier 1 in order** (see SOURCES template for the list). Apply the target profile. Discipline-check every title against the manufacturing trap.
4. **Reconcile** what you found against the prior inventory: matched → SAME (increment days) · unmatched-new → NEW (assign a `JM-ID`) · prior-but-absent → GONE.
5. **Post the PASS HEADER** (Template 1). Capture its comment ID.
6. **Post the threaded replies** under it, in order: SAME · NEW · GONE · NOTABLE · SOURCES. SAME, GONE and SOURCES go up even if empty.
7. **Stamp** `routines/last-run/job-market.txt` — one line, `YYYY-MM-DD HH:MM` ET. **An unstamped pass did not happen.**
8. **Report to Michael in chat:** the census line and the verdict, nothing more. The thread holds the detail; do not re-narrate it.

## Target profile (LOCKED 2026-07-30, Michael)

- **Geography: ANYWHERE.** No location filter. Relocation is live. Never drop a strong non-US posting.
- **Lane: NON-ACADEMIC.** Regional/LORT theatre, commercial and touring, arena and live events, opera, production shops, corporate/broadcast live production.
  - ⚠️ **Academic is DEPRIORITIZED, not banned.** Michael holds a university PM job; the point is to look outside it. A genuine step up (director of production at a major conservatory) still earns a row.
- **Level: at or above Production Manager.** PM, Director of Production, Technical Director, Production Supervisor, Project Manager (entertainment), GM (production side). Skip crew, overhire, seasonal, internships.
- ⚠️ **The title trap.** "Production Manager" outside live entertainment means FACTORY FLOOR — plastics, switchgear, packaging, food. Michael's refer.io alert has fed exactly this for months. A manufacturing PM is not a near-miss, it is a different profession.

## Sources

**Tier 1 — every pass:** OffStageJobs (⚠️ the `staging.` subdomain IS the live site; not a typo, do not "fix" it) · USITT (visible **Post Date** — the freshness anchor for the whole set) · Playbill (broadest, NYC-heavy) · EntertainmentCareers.net (commercial/corporate/broadcast, LA-weighted) · ARTSEARCH (⚠️ subscription-gated AND it moved hosts — if the wall blocks the read, report `🔒 gated`, **never infer its contents from another board**).

**Tier 2 — weekly-ish or when Tier 1 is thin:** BroadwayWorld Classifieds · AACT · TheatreArtLife: The Market (subscription, worldwide — the only real international surface pinned) · IATSE locals · LinkedIn saved searches.

**Tier 3 — UNVETTED:** StageBoard <https://faizova.com/> · StageJobsy <https://stagejobsy.com/jobs>. Both scrape Tier 1. ⚠️ **Agreeing aggregators are ONE source, not five** — count ORIGINS, never rows. Promotion out of Tier 3 goes through Scout Sage.

### 🧭 The escape hatch Michael asked for

*"If that truly is all America is showing, then maybe we begin to explore other ways of researching."*

**Trigger it, don't wait to be asked: if THREE consecutive passes show a flat inventory (no NEW, no GONE), say so in the header verdict and propose widening.** Candidate widenings, in order of expected yield: TheatreArtLife + non-US boards (geography is already ANYWHERE and the source set is not) · IATSE / USA-829 local boards · direct careers pages for a named target-org list · LinkedIn saved searches · adjacent titles (Technical Director, Operations Manager, Venue Manager). **Three flat passes is a finding about the SOURCES, not about the market.**

## Guardrails

- **Creates no tasks. Sends nothing.** No outreach, no applications, no emails. ⚠️ The standing **EMAIL SEND LOCK** applies: surface anything that wants sending, never send it.
- **Never guess a field.** Empty cell or `—`. A guessed salary band is worse than a blank one.
- **Real posted numbers only** for salary. With the org and the source link attached, or not at all.
- **Never assert a stale posting as current.** `hooks/source-freshness-gate.md` is fire-always the moment this fetches. Use USITT's dates to sanity-check the undated boards.
- **A gated source is reported gated.** `hooks/silent-fallback-law.md`: never substitute a board and report as if the pinned one answered.
- **Catch-up, don't replay.** Overdue by three weeks = ONE pass labeled a catch-up in the header. Never one pass per missed day. Days-on-board still computes correctly because it derives from first-seen, not from pass count.
- **A failed pass leaves the stamp untouched** so it stays overdue and self-heals. Report the failure in the reply, not by DM.
- **Michael's screenshot outranks anything cached.** Re-verify from scratch.

## Composes with

- **`routines/schedule.md`** — cadence AND the on/off switch (mark the row retired to stop; never delete it).
- **`routines/README.md`** — Data-Refresh Discipline, the 12-rule floor.
- **`hooks/source-freshness-gate.md`** — fire-always on any fetch. Steward: Scout Sage.
- **`hooks/silent-fallback-law.md`** — no silent source substitution.
- **Scout Sage** — lane seam: a NEW source or an open market question is hers; this routine RE-CHECKS pinned ones. The escape hatch above hands off to her.

## Changelog

- **v3 (2026-07-30) — STANDING INVENTORY + TEMPLATED COMMENT THREADS.** Michael reframed the whole thing as a housing-market search: re-state the full market every pass, sameness IS the report, dense references over prose, one task and one conversation, header comment + threaded SAME/NEW/GONE/NOTABLE/SOURCES replies. **Deleted the entire delta model** ("Delta only", "nothing new is a complete answer", idempotency-skip) — those were not tone, they were an incompatible architecture. **Added:** stable `JM-` listing IDs (without them days-on-board and disappearance detection are both impossible), six verbatim templates, the cold-pickup procedure, and the three-flat-passes escape hatch. **Also reversed v2's lead-task creation** — inventory in a funnel would flood it, so the routine now writes only to the thread. ⚠️ **The one rule most likely to be "optimized" away: every pass restates the FULL inventory, because the next pass reads only the latest one.** Abbreviating breaks the persistence chain.
- **v2 (2026-07-30) — trigger gate removed, default ON.** Michael: *"don't really need this other gate. if i want it off, ill just have it removed from the schedule md."* A mode flag in a second system made "is this on?" a two-lookup question with two possible answers. The schedule row was always the real switch. *(Its lead-task creation was itself reversed by v3, hours later.)*
- **v1 (2026-07-30)** — created. Geography ANYWHERE + lane NON-ACADEMIC locked same day. Sources verified live; two corrections carried from the old ClickUp Job Search doc (ARTSEARCH moved hosts, OffStageJobs is `staging.`-only). Shipped with a ClickUp-held OFF/ON trigger, dead within the hour. ⚠️ Its standing-task link was hand-typed and wrong. Load the task, copy the ID, never type it.
