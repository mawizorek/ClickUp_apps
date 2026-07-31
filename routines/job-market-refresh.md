---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
status: active
steward: routine-ricky
cadence: see routines/schedule.md
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 7
model: standing-inventory
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

## 📍 Architecture

**One task, one conversation, two persistence layers.**

- **Standing thread:** `86ajtgbt3`
- **Never create a second research task.** Applications list (`900600097138`) = funnel, not inventory. Listings become tasks there ONLY when Michael says to act.

| Layer | Holds | Read by |
|-------|-------|--------|
| `routines/job-market-state.tsv` | Structured index. Every live listing normalized. | Next pass, aggregate queries. |
| Comment thread | Narrative. Census, verdicts, commentary. | Michael on his phone. |

**TSV is source of truth.** Thread is the read surface. TSV wins disagreements.

### State rules

- A listing enters the TSV when found AND its direct URL is captured (`status=live`).
- `gone` when it disappears. Gone rows stay one pass, then get deleted. Git preserves history.
- `acted` when Michael says to act and an Application task is created.
- Uncommitted pass = didn't happen.

## 📊 State file schema (`routines/job-market-state.tsv`)

Tab-separated, header row, one listing per line.

| Column | Required | Description |
|--------|----------|-------------|
| `id` | ✅ | `JM-<BOARD>-<org-slug>-<role-slug>` |
| `lane` | ✅ | `PM` · `TD` · `SM` · `ME` (see lanes below) |
| `title` | ✅ | Role title as posted |
| `org` | ✅ | Organization name |
| `location` | ✅ | City, State (or Remote) |
| `site` | ✅ | Board code |
| `url` | ✅ | **Direct link to posting. THE validity gate: no URL = no row.** |
| `posted` | ✅ | Date posted (`YYYY-MM-DD`) |
| `first_seen` | ✅ | Pass date first found (`YYYY-MM-DD`) |
| `salary` | optional | Posted range verbatim, never estimated |
| `level` | ✅ | `senior` · `mid` · `associate` · `entry` · `contract` |
| `status` | ✅ | `live` · `gone` · `acted` |

**Normalization rules:**
- One row per listing per board. Cross-posted = two rows.
- `url` REQUIRED. No URL = no row. Log as unlinked sighting in NOTABLE.
- `salary` verbatim or empty.
- `posted` = board's date. `first_seen` = when routine captured it.

## 🔑 Listing IDs

```
JM-<BOARD>-<org-slug>-<role-slug>
```

Board codes: `OSJ` OffStageJobs · `USITT` · `PB` Playbill · `ECN` EntertainmentCareers.net · `AS` ARTSEARCH · `TAL` TheatreArtLife · `BWW` BroadwayWorld · `SB` StageBoard · `SJ` StageJobsy · `ACG` Arts Consulting Group · `TOC` TOC Arts Partners · `IND` Indeed · `LI` LinkedIn · `FL` Freelancer/Upwork

ID is permanent. Title changes don't get new IDs.

## 🎯 Target profile (UPDATED 2026-07-31, Michael)

### Lanes

| Code | Lane | Titles scanned |
|------|------|---------------|
| `PM` | Production Management | Production Manager, Director of Production, VP Production, Associate PM, Assistant PM, Production Coordinator, Production Supervisor |
| `TD` | Technical Direction | Technical Director, Associate TD, Assistant TD, Production Engineer, Facilities/Technical Manager |
| `SM` | Stage Management | Production Stage Manager, Stage Manager, Assistant Stage Manager, Deck Manager |
| `ME` | Electrician / Lighting | Master Electrician, Associate Lighting Designer, Lighting Supervisor, Board Operator, Head Electrician, Lighting Director |

### Scope

- **Geography: ANYWHERE.** Relocation live. Remote explicitly included.
- **Lane: NON-ACADEMIC** (deprioritized, not banned). Regional/LORT, commercial/touring, arena/live events, opera, production shops, corporate/broadcast, concert venues, themed entertainment.
- **Level: ALL except pure overhire/day-call.** Senior, mid, associate, part-time, contract, remote/hybrid, drafting, smaller-scale. The goal is MARKET BREADTH, not top-of-ladder only.
- **The title trap still applies:** "Production Manager" in manufacturing = different profession. Filter out factory floor roles.
- **Part-time and contract are IN.** Remote drafting, freelance TD, per-show SM: all qualify.
- **Scan adjacent titles broadly.** Director of Production, Head of Production, Production Supervisor, Operations Manager (venue), Events Production Manager.

### What's OUT

- Manufacturing/industrial/logistics
- Pure crew calls, single-day overhire, internships
- Academic tenure-track (unless genuine step up)

## 💬 Comment architecture

```
📋 PASS HEADER  ← root comment
   ├─ 🔁 SAME     ← threaded
   ├─ 🆕 NEW      ← threaded
   ├─ 🕳️ GONE     ← threaded (even if empty)
   ├─ 📌 NOTABLE  ← threaded (if content)
   └─ 🔌 SOURCES  ← threaded (always)
```

SAME, GONE, SOURCES always post. NEW and NOTABLE only if non-empty (header says so).

---

# 📐 TEMPLATES (slim, link-heavy, mobile-stacked)

## Template 1 · 📋 PASS HEADER

```
## 📋 <YYYY-MM-DD HH:MM> ET

**Prev:** <timestamp> (<elapsed>) · [TSV](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-state.tsv) · [Runbook](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md) v7

**Live:** <n> (<±n>) · New: <n> · Gone: <n> · Boards: <n>/<n>
**By lane:** PM <n> · TD <n> · SM <n> · ME <n>

### Verdict
<ONE line. Blunt.>
```

## Template 2 · 🔁 SAME

```
### 🔁 SAME · <n>

---
**[<Role>](<url>)** — <Org>
`<JM-ID>` · <lane> · <location> · **<n>d**
💵 <salary or —>

---
<repeat>
```

## Template 3 · 🆕 NEW

```
### 🆕 NEW · <n>

---
**[<Role>](<url>)** — <Org>
`<JM-ID>` · <lane> · <location>
💵 <salary or —> · 📅 <posted>
✅ <why qualifies, <10 words>

---
<repeat>
```

## Template 4 · 🕳️ GONE

```
### 🕳️ GONE · <n>

---
**<Role>** — <Org>
`<JM-ID>` · lived <n>d · <likely cause>

---
<or: "None. Full inventory carried.">
```

## Template 5 · 📌 NOTABLE

```
### 📌 NOTABLE

- <pattern or observation — one line each>
- **Unlinked:** <Role> — <Org> · <board> · <why no URL>
- **Salary:** <$range> — <org>, <role>
```

## Template 6 · 🔌 SOURCES

```
### 🔌 SOURCES

- **<Board>** `CODE` — ✅/🔒/❌ · <n> qualifying
<repeat per board>
```

---

## Steps

1. **Read `routines/job-market-state.tsv`** — current inventory. Every `status=live` row is expected on boards.
2. **Read `routines/last-run/job-market.txt`.** `never` = first pass.
3. **Read most recent PASS HEADER** on thread `86ajtgbt3` for context.
4. **Walk all source boards.** Apply target profile (ALL lanes). Capture direct URL for every qualifying listing. Verify survival of existing rows.
5. **Reconcile:** matched = SAME (days-on-board = today - `posted`) · new = NEW (assign `JM-ID`, lane, level) · TSV-but-absent = GONE.
6. **Update TSV:** append NEW rows (all required columns). GONE → `status=gone`. SAME → update salary if newly found. No empty URLs permitted.
7. **Post PASS HEADER.** Capture comment ID.
8. **Post threaded replies:** SAME · NEW · GONE · NOTABLE · SOURCES.
9. **Commit TSV + stamp in one push:**
   - `routines/job-market-state.tsv`
   - `routines/last-run/job-market.txt` (one line: `YYYY-MM-DD HH:MM ET`)
   - Message: `data(job-market): <timestamp> ET — <n> live, <±n>`
10. **Report:** census line + verdict. Thread holds detail.

## Sources

**Tier 1 (every pass):** OffStageJobs (`staging.offstagejobs.com`) · USITT Job Board · Playbill Jobs · EntertainmentCareers.net · ARTSEARCH (gated, note access)

**Tier 2 (weekly or opportunistic):** Arts Consulting Group · TOC Arts Partners · TheatreArtLife · BroadwayWorld · StageBoard · Indeed (filtered: theatre + production) · LinkedIn Jobs (filtered)

**Tier 3 (monthly sweep):** Freelancer platforms · Remote job boards (filtered for production/event roles) · Regional theatre association boards

⚠️ **OffStageJobs:** the `staging.` subdomain IS the live site. Not a typo. Filters are not simple GET params; walk the full listing index.
