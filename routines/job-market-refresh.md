---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
status: active
steward: routine-ricky
cadence: see routines/schedule.md
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 9
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

## 🚪 The Gate: `routines/job-market-roles.json`

This file IS the loop. It defines:

- **`roles[]`**: ordered list of role objects. The routine iterates this list top to bottom. Every entry gets a full, independent search pass.
- **Per role:** `id`, `display`, `lane`, `keywords[]`, `levels[]`, `exclude_terms[]`, `constraints{}`
- **`global{}`**: settings that apply to ALL roles (geography, remote, part-time, contract, academic filter, overhire filter)

### How the gate drives execution

```
for each role in roles.json:
    1. filter TSV to this role's lane → known inventory
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
| `id` | ✅ | `JM-<BOARD>-<org-slug>-<role-slug>` |
| `role_id` | ✅ | Matches `id` field in `job-market-roles.json` |
| `lane` | ✅ | `PM` · `TD` · `SM` · `ME` |
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
- `role_id` MUST match an entry in the JSON config. Orphan rows = error.

## 🔑 Listing IDs

```
JM-<BOARD>-<org-slug>-<role-slug>
```

Board codes: `OSJ` OffStageJobs · `USITT` · `PB` Playbill · `ECN` EntertainmentCareers.net · `AS` ARTSEARCH · `TAL` TheatreArtLife · `BWW` BroadwayWorld · `SB` StageBoard · `SJ` StageJobsy · `ACG` Arts Consulting Group · `TOC` TOC Arts Partners · `IND` Indeed · `LI` LinkedIn · `FL` Freelancer/Upwork · `LCTJ` League of Chicago Theatres · `APAP` APAP Job Bank

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
  🎯 ROLE HEADER  ← root comment (standalone)
     ├─ 🔁 SAME     ← threaded under this role's header
     ├─ 🆕 NEW      ← threaded
     ├─ 🕳️ GONE     ← threaded
     └─ 📌 NOTABLE  ← threaded (if content)

AFTER ALL ROLES:
  📋 PASS SUMMARY  ← root comment (the only cross-role output)
     └─ 🔌 SOURCES  ← threaded
```

**Key rule:** each role's comment block is self-contained. Reading the Production Manager block tells you everything about the PM market without needing to read any other block. Same depth, same template, same treatment for every role regardless of how many listings it has.

---

# 📐 TEMPLATES

## Template 1 · 🎯 ROLE HEADER (root comment, one per role)

```
## 🎯 <ROLE DISPLAY NAME> · <YYYY-MM-DD HH:MM> ET

**Keywords:** <comma-separated from config>
**Live:** <n> · New: <n> · Gone: <n>
💵 Salary range across live: <low>-<high> (or "none posted")

### Verdict
<ONE line. Blunt. About THIS role's market only.>
```

## Template 2 · 🔁 SAME (threaded under role header)

```
### 🔁 SAME · <n>

---
**[<Role>](<url>)** — <Org>
`<JM-ID>` · <location> · **<n>d**
💵 <salary or —>

---
<repeat per listing>
```

## Template 3 · 🆕 NEW (threaded under role header)

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

## Template 4 · 🕳️ GONE (threaded under role header)

```
### 🕳️ GONE · <n>

---
**<Role>** — <Org>
`<JM-ID>` · lived <n>d · <likely cause>

---
<or: "None. Full inventory carried.">
```

## Template 5 · 📌 NOTABLE (threaded under role header, if content)

```
### 📌 NOTABLE

- <pattern or observation for THIS role only>
- **Unlinked:** <Role> — <Org> · <board> · <why no URL>
```

## Template 6 · 📋 PASS SUMMARY (root comment, posted AFTER all role loops complete)

```
## 📋 PASS COMPLETE · <YYYY-MM-DD HH:MM> ET

**Roles searched:** <n> · **Total live:** <n> · **Total new:** <n> · **Total gone:** <n>
**Prev pass:** <timestamp> (<elapsed>)
[TSV](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-state.tsv) · [Roles config](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-roles.json) · [Runbook](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md) v9

Role headers above: <link each>
```

## Template 7 · 🔌 SOURCES (threaded under pass summary)

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
6. **Walk ALL source boards** using this role's `keywords[]`. Apply `exclude_terms[]` and `global` constraints. Capture direct URL for every qualifying listing.
7. **Reconcile:**
   - Matched to existing TSV row = SAME (compute days-on-board = today - `posted`)
   - New find with URL = NEW (assign `JM-ID`, set `role_id`, `lane`, `level`)
   - TSV row not found on boards = GONE
8. **Stage TSV updates** for this role: append NEW rows, mark GONE rows, update salary if newly found on SAME.
9. **Post 🎯 ROLE HEADER** as root comment. Capture comment ID.
10. **Post threaded replies** under role header: SAME · NEW · GONE · NOTABLE (if content).
11. **Repeat from step 5** for next role.

### Post-loop

12. **Commit TSV + stamp in one push:**
    - `routines/job-market-state.tsv` (all role updates batched)
    - `routines/last-run/job-market.txt` (one line: `YYYY-MM-DD HH:MM ET`)
    - Message: `data(job-market): <timestamp> ET — <n> live, <±n>`
13. **Post 📋 PASS SUMMARY** as root comment with links to each role header.
14. **Post 🔌 SOURCES** threaded under summary.

---

## Invocation modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Full loop** | Scheduled cadence or "run job market refresh" | All roles in config, sequential |
| **Single role** | "do job search for [role name]" | One role only, same template, same depth |
| **Add role** | "add [role] to job search" | Edit JSON config, run that role immediately |

All modes produce the same output format. The only variable is loop length.

## Sources

**Tier 1 (every pass):** OffStageJobs (`staging.offstagejobs.com`) · USITT Job Board · Playbill Jobs · EntertainmentCareers.net · ARTSEARCH (gated, note access)

**Tier 2 (weekly or opportunistic):** Arts Consulting Group · TOC Arts Partners · TheatreArtLife · BroadwayWorld · StageBoard · Indeed (filtered: theatre + production) · LinkedIn Jobs (filtered) · League of Chicago Theatres (`LCTJ`) · APAP Job Bank (`APAP`)

**Tier 3 (monthly sweep):** Freelancer platforms · Remote job boards (filtered for production/event roles) · Regional theatre association boards · AEA job postings (if accessible) · IATSE local union boards (if accessible)

---

## 📡 Source access notes

Board realities an agent needs to know before scanning:

- **OffStageJobs (`OSJ`):** `staging.offstagejobs.com` IS the live site (not a typo). Filters are not simple GET params. Detail pages sometimes lack org name. If org is unknown, log as NOTABLE/unlinked, do NOT invent a row.
- **EntertainmentCareers.net (`ECN`):** Paywalled. Listings visible in search but detail/apply requires subscription. URLs are capturable from search results.
- **ARTSEARCH (`AS`):** Gated behind TCG membership. Listings sometimes surface via Google cache or third-party aggregators.
- **Indeed (`IND`):** Does NOT surface theatre staff listings reliably through keyword search. Theatre-specific terms get drowned by manufacturing/logistics. Low yield, don't spend excessive time here.
- **APAP Job Bank (`APAP`):** Listings often lack posted dates. If no date, use `first_seen` for both `posted` and `first_seen`. Log date-absent fact in NOTABLE.
- **OffStageJobs detail pages:** some use non-GET filters (interactive browsing required). If a listing is visible in the index but the detail URL isn't capturable, log as NOTABLE/unlinked.
- **Playbill (`PB`) + BroadwayWorld (`BWW`):** Volume sources for mid-level. Reliable URLs via UUID paths (PB) or numeric IDs (BWW). Most productive boards for PM/TD.
- **League of Chicago Theatres (`LCTJ`):** Clean URLs, Chicago-focused. Good for ME and SM roles specifically.

---

## 🧊 Cold-agent intelligence

Operational knowledge for any agent picking this up cold:

### Where the top-of-market lives

- **Retained search firms (ACG, TOC, MCA/SearchWide Global)** carry ALL the Director+ listings. Check them first when scanning PM lane at senior level.
- **Playbill + BWW** are the volume sources for mid-level across all lanes.
- **Regional association boards (LCTJ, APAP)** catch niche postings the big aggregators miss.

### Lane-specific realities

- **SM and ME lanes are THIN on open boards.** Staff-level positions in these lanes mostly fill through union calls (AEA for SM, IATSE for ME) or direct solicitation. Open-board scans will always be sparse here. That's expected, not a failure.
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
