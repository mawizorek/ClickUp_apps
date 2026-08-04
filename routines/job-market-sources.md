# Job Market Refresh — Sources & Cold-Agent Intelligence

> **Split out of `job-market-refresh.md` on 2026-08-04 (v17).** The runbook holds procedure and STOP
> conditions; this file holds WHERE to look and WHAT NORMAL LOOKS LIKE. Read both before a pass.

---

## 🔴 THE DEPARTMENT-INDEX LAW (LOCKED 2026-08-04 — read this before anything else)

**Keyword search alone under-reports this market by roughly half, and it does so silently.**

On 2026-08-04, three lanes had been reporting 0-4 live listings for weeks. A single browse of
OffStageJobs' department index pages took them to 12, 9 and 4. Nothing about the market changed.
We had never opened the pages.

- `?department=Sound` → 95 listings · produced 5 salaried resident staff seats, three of them $60k+
- `?department=Administration` → 51 listings · produced **The Gamm ED at $125,000-140,000**, which
  three prior passes had reported as an unlinkable sighting while it sat there with a working URL
- `?department=Scenic / Sets` → 310 listings · produced the first rows the drafting lane ever had

**Consequences that are now rules:**

1. **Browsing every relevant department index is a REQUIRED step, not a fallback.** A pass that only
   keyword-searches is incomplete regardless of how many listings it returns.
2. **Every "this lane is thin" verdict recorded before 2026-08-04 is a METHOD ARTIFACT, not a market
   signal.** Do not cite pre-08-04 lane counts as evidence about the market.
3. ⚠️ **The department parameter must use the EXACT dropdown label.** `?department=Scenic` silently
   returns all 612 jobs instead of filtering — a wrong param looks exactly like a successful broad
   sweep, which is the worst possible failure mode. Verify the result count changed.

---

## 🦺 THE SAFETY SWEEP (added 2026-08-04, by Michael's ruling)

**The safety keywords are NOT dead. We were looking in the wrong place.**

For several passes, `safety coordinator` · `safety manager` · `health and safety officer` ·
`production safety` · `risk manager performing arts` returned **zero across every board**, and a
proposal was made to cut them from the config as dead weight. **Michael overruled it:**
*"are we no longer doing a safety sweep for roles in safety management? It is a very niche thing,
but that is kind of the point!"*

He is right, and the diagnosis was wrong. **Live event safety is a real, growing discipline with real
salaried seats — they simply do not post on theatre job boards.** A five-minute check turned up an
Ocean Center *Event Safety Coordinator* (municipal jobs portal), a Fever *Safety Coordinator* in
Chicago (corporate careers site), an S.A.F.E. Management *Security & Event Coordinator* (TeamWork
Online), and a Scottish Event Campus *Event Safety Advisor*. **Not one of those would ever appear on
Playbill, BroadwayWorld or OffStageJobs.**

> ⚠️ **The generalizable lesson, and it is the second time in one day: a lane returning zero is a
> statement about our SOURCES, not about the world.** The Department-Index Law above is the same
> mistake in a different costume. **Before proposing that a keyword be cut, prove the keyword was
> pointed somewhere it could possibly have succeeded.**

**Where safety roles actually live — sweep these for the safety keywords specifically:**

- [**TeamWork Online**](https://www.teamworkonline.com) `TWO` — arenas, stadiums, venue operators.
  The single highest-yield source for venue safety, security and event-operations roles. Filter to
  Arenas & Facilities.
- [**GovernmentJobs / NEOGOV**](https://www.governmentjobs.com) `GOV` — municipally-owned convention
  centers, civic auditoriums and PACs. Already the source for the Little Rock PM row. Search the
  safety keywords plus a venue term.
- [**Event Safety Alliance**](https://eventsafetyalliance.org) `ESA` — the industry's trade
  association for live event safety. ⚠️ **It has NO job board** (verified 2026-08-04; `/opportunities`
  is training, not hiring). Value is as a NAMING source: it tells you what these roles are actually
  called, which is how you fix keywords. Its own openings post to third-party association boards.
- **Venue-operator careers pages direct** — ASM Global, Oak View Group, Live Nation, AEG. Large
  operators staff safety centrally and post in-house.
- [**Indeed**](https://www.indeed.com) `IND` — normally low-yield here, but for safety it is better
  than the theatre boards. Pair a safety keyword with `venue`, `arena`, `theater` or `live events`.

**Calibration:** expect **0-3 qualifying safety seats per pass**, and expect many passes to return
none. **That is a correct result, not a failed sweep.** Report it as swept-and-empty, never omit it —
an unreported niche looks identical to an abandoned one. The value here is asymmetric: one genuine
live-event safety seat is worth more to Michael than another Production Manager row, because almost
nobody is qualified for both sides of it.

**Boundary:** this is SAFETY MANAGEMENT (planning, compliance, crowd management, risk), not security
guarding. A door-staff or event-security-officer posting is not a match; a role that owns safety
planning, risk assessment or life-safety compliance for a venue or event is.

---

## Sources

**Tier 1 (MANDATORY every pass, no exceptions):**

- **OffStageJobs** (`staging.offstagejobs.com`) `OSJ` — THE primary source, 29 years, ~600 listings live.
  **Browse the department indexes** (Lighting / Electrics · Scenic / Sets · Sound · Management ·
  Administration · Properties) in addition to keyword search. This board alone should produce 15-25
  qualifying listings if swept properly.
- **Playbill Jobs** (`playbill.com/jobs`) `PB` — volume source. Browse Technical + Administrative categories.
  ⚠️ The index text often strips hyperlinks; recover a direct URL with a web search on org + exact title.
- **BroadwayWorld** (`broadwayworld.com/jobs`) `BWW` — volume source, multiple category filters.
  ⚠️ Direct fetch of `/jobs/` **failed on 2026-08-04**. First observed failure; if it repeats it is broken, not unlucky.
- **StageLync** (`stagelync.com`) `SL` — weekly. Check Production Manager, Stage Management, Technical, Administration separately.
- **USITT Job Board** `USITT` — all relevant categories.
- **StageBoard** (`stageboard.app`) `SB` — aggregator, 785+ employers / 39 countries, role-taxonomy search.
- **TeamWork Online** (`teamworkonline.com`) `TWO` — **required for the OPS lane only.** Venue and arena
  operations, safety and security. Added 2026-08-04; see the Safety Sweep above.

**Tier 2 (hit at least 4 per pass, rotate through all over multiple passes):**

- **Arts Consulting Group** `ACG` — retained search, Director+ listings.
- **TOC Arts Partners** `TOC` — retained search, senior roles.
- **Skene Callboard** (`skene.pub/callboard`) `SKN` — free, open access, positions only (ignore grants/open calls).
- **League of Chicago Theatres** (`chicagoplays.com/jobs`) `LCTJ` — regional, strong for ME/SM.
- **APAP Job Bank** `APAP` — performing arts admin and production.
- **HireCulture** (`hireculture.org`) `HC` — New England arts.
- **The Stage Jobs** (`jobs.thestage.co.uk`) `TSJ` — UK-heavy, strong backstage/technical. Now the top of the ME lane by pay.
- **GovernmentJobs / NEOGOV** (`governmentjobs.com`) `GOV` — municipal venues, civic centers, PACs.
- **StageJobsy** (`stagejobsy.com`) `SJ` · **TheatreArtLife** `TAL` · **EntertainmentCareers.net** `ECN` (paywalled, search results visible)
- **ARTSEARCH** `AS` — gated (TCG); try `site:artsearch.tcg.org`.
- **Indeed** (filtered) `IND` · **LinkedIn Jobs** (industry-filtered) `LI` — low yield, one targeted sweep each.

**Tier 3 (monthly, opportunistic):** venue-operator careers pages (ASM Global, Oak View Group, Live Nation, AEG) ·
freelance/remote boards · regional theatre associations · AEA postings · IATSE local boards · SearchWide Global / MCA.

---

## 📡 Source access notes

- **OffStageJobs (`OSJ`):** `staging.offstagejobs.com` IS the live site (not a typo). Department browse is
  mandatory (see the law above). Detail pages sometimes lack an org name — if org is unknown, log as an
  unlinked sighting in NOTABLE, never invent a row. ⚠️ A listing marked **"reported for review"** is NOT
  admitted; flag it in NOTABLE instead (live case: an Ampa Events rendering-artist post at $50-60k).
- **Playbill (`PB`) + BroadwayWorld (`BWW`):** reliable URLs (PB uses UUID paths, BWW numeric IDs). Cross-posts
  between them are common — two rows, same org, NOT duplicates.
- **StageLync (`SL`):** clean category browsing, good direct URLs, updated weekly.
- **StageBoard (`SB`):** normalizes 200+ job titles; filter by Production Management, Technical Direction,
  Stage Management, Lighting/Electrics. May want sign-in for detail; listings browsable.
- **TeamWork Online (`TWO`):** venue/arena/sports-facility jobs. Browse Arenas & Facilities, and the
  Event Operations / Security categories. Many postings come from operator groups rather than the venue itself.
- **GovernmentJobs (`GOV`):** municipal postings are verbose and slow to load but carry exact salary bands
  and hard closing dates — capture the closing date, it is usually a real deadline.
- **EntertainmentCareers.net (`ECN`):** paywalled; URLs capturable from search results.
- **ARTSEARCH (`AS`):** gated behind TCG membership; sometimes surfaces via cache/aggregators.
- **Indeed (`IND`):** theatre terms drown in manufacturing/logistics. Low yield, one targeted sweep max —
  except for the safety keywords, where it beats the theatre boards.
- **APAP (`APAP`):** listings often lack posted dates. If no date, use `first_seen` for both and log the fact in NOTABLE.
- **League of Chicago Theatres (`LCTJ`):** clean URLs, Chicago-focused, good for ME and SM.
- **The Stage Jobs (`TSJ`):** filter to Backstage & Technical, Management. ⚠️ Many listings carry NO post date —
  liveness unverified means no row. A dedicated verification sweep of its PM shelf (RSC, Oxford, RCS, E1) is outstanding.
- **HireCulture (`HC`):** smaller volume, catches New England roles other boards miss.

---

## 🧊 Cold-agent intelligence

### Density expectations

**The performing arts job market is NOT sparse.** With all eight lanes swept properly, including department
indexes, expect **90-120 qualifying live listings**. The 2026-08-04 pass landed 108 and that is the working
baseline. The floor in the runbook (40) is a failure tripwire, not a target.

> ⚠️ **The 40 floor was calibrated against keyword-only sweeps and is now very easy to clear.** Clearing it
> is no longer evidence of a good pass. A pass that returns 45 with the department indexes unbrowsed is a
> shallow pass wearing a passing grade. Judge depth by SOURCES coverage, not by the total.

Approximate yield by lane (post-08-04 baseline): PM 25-35 · TD 12-18 · SM 18-25 · ME 10-15 · AUD 10-15 ·
OPS 4-8 (of which 0-3 safety) · DFT 2-6 · ADM 8-12.

Approximate yield by source when swept properly: OffStageJobs 15-25 · Playbill + BWW 10-18 · StageLync 3-8 ·
StageBoard 5-10 · retained search (ACG + TOC) 2-5 · regional boards combined 3-8.

### Where the top of market lives

- **Retained search firms (ACG, TOC, MCA/SearchWide)** carry the Director+ listings. Check them FIRST when scanning senior.
  ⚠️ But they are not the only home for executive roles — the highest-paying non-Lincoln-Center job in the
  08-04 inventory (Gamm ED, $125-140k) was an ACG search surfaced through **OffStageJobs**, not ACG's own page.
- **OffStageJobs** is the national standard for behind-the-scenes staff positions.
- **Playbill + BWW** are the volume sources for mid-level across all lanes.
- **Regional association boards (LCTJ, APAP, Skene, HC)** catch what the aggregators miss.

### Lane-specific realities

- **PM lane has the highest open-board volume** and is also the most lateral — depth here is not progress.
- **TD lane overlaps PM frequently.** "Technical Director/Production Manager" combo titles are common at
  smaller houses. Home it in TD, set `also_lanes=production-manager`.
- **SM lane is union-deadline-driven.** Equity submission deadlines cluster; a pass often finds 6-8 deadlines
  inside a two-week window. Surface the cluster, it is the highest-actionability fact in the lane.
- **ME lane's top of market is now the UK.** Both £-denominated listings out-earn every US electrics posting tracked.
- **AUD lane is NOT touring-only.** That read came from looking at Playbill alone. Half the lane is resident
  staff at $45-76k, all of it found through the OSJ Sound department.
- **OPS lane is TWO markets in one config entry.** Venue management (house/ops/facilities) posts on the theatre
  boards and produces most of the rows. Safety management posts on venue/arena/municipal boards and produces
  0-3. **Sweep both halves; do not let the first half's volume disguise a skipped second half.**
- **DFT lane is two organizations.** Every row on 08-04 came from Riverside Theatre and New London Barn.
  That is not a market, it is two theatres staffing a season. Treat the count with suspicion — but the lane
  stays swept in full (Michael, 2026-08-04).

### Org/venue data

The `org` column across the lane files is building a theatre directory organically. Let it grow. Future
integration potential: a venue list that feeds constraints back into the search (e.g. "skip orgs already applied to").

### Procedural notes

- Cross-posted listings between PB and BWW are common. Two rows, same org. Not duplicates.
- If a listing URL goes dead between passes, mark GONE. Don't hunt it elsewhere.
- Never add a row without a working URL. NOTABLE exists for unlinked sightings.
- **A listing with a URL but no post date is still a row.** Use `first_seen` for both fields and say so in
  NOTABLE (the APAP precedent). Missing DATE is not missing PROOF; missing URL is.
- **Keyword exhaustion:** don't stop at the first keyword that returns results. Try ALL keywords in the role
  config against each board — different boards index differently, and "Production Manager" and "Director of
  Production" often live in different categories on the same board.
- **A gated or thin board is a NOTABLE entry explaining the access issue**, never a reason to accept low yield
  across the whole pass. Log what was attempted.
- 🚫 **Never propose cutting a keyword because it returned nothing.** First prove it was pointed at a source
  where it could have succeeded. Both times that proposal has been made, the keyword was fine and the source
  list was wrong.
