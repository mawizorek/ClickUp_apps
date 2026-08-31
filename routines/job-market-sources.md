# Job Market Refresh — Sources & Cold-Agent Intelligence

> **Split out of `job-market-refresh.md` on 2026-08-04 (v17).** The runbook holds procedure and STOP
> conditions; this file holds WHERE to look and WHAT NORMAL LOOKS LIKE. Read both before a pass.

> 🔗 **Board homepage URLs are NOT held in this file.** They live in `job-market-templates.md` → Template 7,
> which is the single claimant. Added 2026-08-31 after an agent "remembered" an ACG URL, fetched the wrong
> page, and reported it as doc rot — while the correct documented URL was live the whole time. **Read the
> template; never derive a board URL from memory.** If you need a URL and Template 7 lacks it, add it THERE.

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
3. ⚠️ **VERIFY THE RESULT COUNT CHANGED — ON EVERY FILTERED BOARD, NOT JUST THIS ONE.** A wrong or
   unsupported filter parameter silently returns the UNFILTERED set, **which looks exactly like a
   successful broad sweep** — the worst possible failure mode, because it fails upward. Originally
   written about OSJ's exact dropdown labels (`?department=Scenic` returns all 612 instead of filtering).
   🔴 **PROMOTED to every board 2026-08-31, after it fired live on TeamWork Online:** a
   `search[query]=event safety manager` query returned **8,622 results** against an unfiltered total of
   **8,613**. The filter did not apply, the response was a plausible-looking wall of jobs, and the only
   thing that caught it was comparing the count to the known total. **Know the unfiltered count before
   you filter, so you can tell whether anything happened.**

---

## 🕐 THE FIFTH SOURCE STATE: REACHABLE BUT STALE (added 2026-08-31)

**A board that returns a stale cache is far more dangerous than a board that fails.**

We had four states: ✅ swept-and-yielded · ⚪ swept-zero-yield · ⚠️ degraded/blocked · ❌ not-hit. On
2026-08-31 **BroadwayWorld served a page 26 days old** and it had every marker of a good sweep: real
orgs, real salaries, relative dates, working pagination. Its newest listings stopped at **Aug 4**, and an
Aug 4 item read *"Posted 1 day ago"* — so the page had rendered around **Aug 5** and every *"Closes in N
days"* on it counted from then.

> 🔴 **A hard failure announces itself and lands in ❌. A stale cache is indistinguishable from success.**
> Swept blind, that pass would have captured **August 5 market state, stamped it August 31, and reported
> month-old postings as live with confident days-on-board arithmetic.** That is the *"a live URL is not a
> live opportunity"* trap (08-06, Phoenix Theatre) mechanised and silent.

**So: 🕐 = reachable, but serving content demonstrably older than this pass.** Mark it distinctly and treat
the board as UNUSABLE for capture. **Never row from a 🕐 board.**

**How to detect it — cheap, do it on every board that renders relative dates:**

1. Find the newest item and read its absolute date.
2. Find any item whose absolute date AND relative date are both shown, and solve for the render date.
3. If the render date is not ~today, everything relative on that page is wrong by the difference.

⚠️ **A 🕐 board is still worth reading for ONE thing: close dates on rows you already hold.** Solving for
the render date converts *"closes in N days"* into a real date. That is how three OPS rows became GONE
candidates on 08-31. 🚫 **But that is a CANDIDATE, never a GONE** — it is arithmetic on an estimated
render date, and marking a live row dead is worse than carrying a dead one. Flag it, let the next pass
with the primary board reachable resolve it.

⭐ **Same disease as ⚪-vs-❌ and "carried"-vs-swept: a state we could not distinguish, wearing another
state's mark.** That is now the fourth instance. When you cannot tell two source outcomes apart, the
answer is a new mark, not a judgement call.

---

## 🔓 RECOVERING A GATED OR UNLINKED URL (owed since 2026-08-07, written down 2026-08-31)

**The validity gate is the URL: no URL, no row.** But most "unrowable" sightings are recoverable, and this
procedure has now worked on **five of eight** attempts across two passes. It was flagged as owed on
08-07 and never written in — so it got re-derived from scratch. Here it is.

**The insight: aggregators and gated boards REPUBLISH.** StageLync, StageBoard, Indeed, LinkedIn and the
job-mirror sites are not employers. The listing page may be gated, but the underlying posting almost always
has a first-party home.

1. **Search `"<exact title>" "<org name>"`.** Exact-quote both. This alone resolves most of them.
2. **Prefer, in order:** the employer's own ATS or careers portal (`jobs.<org>.edu`, `<org>.icims.com`,
   `uscjobs.sc.edu`) → the primary board that board scraped from → a dated first-party press page.
3. **A mirror is NOT a first-party URL.** `sportstechjobs.com`, `career.com`, `simplyhired`, university
   career boards and `jobs-in.us` are mirrors. They go stale invisibly, they mangle locations (one listed a
   San Antonio, **Texas** job as "San Antonio, Florida"), and they publish contradictory salaries — one TD
   posting appeared at three different figures across three mirrors on 08-07. **Use a mirror as a POINTER
   to search for the real posting, never as the row's URL.**
4. **Cross-check the date.** Mirrors and first-party pages routinely disagree. Take the explicitly dated
   claim over a relative one, and **record the conflict** rather than averaging.
5. **Give up out loud.** Two failed searches → log it as an unlinked sighting in NOTABLE with what you
   tried. 🚫 Never invent a URL, never row a sighting, never let "I did not find it" read as "it does not
   exist."

**Proven:** Kentucky Performing Arts TD (SL-gated → LinkedIn) · WCU TD (SL-gated → `jobs.wcu.edu`) · USC
Colonial Life Arena Staffing/Security Manager (TWO → `uscjobs.sc.edu`) · Legends Global Century II Director
of Operations (WashU mirror → first-party TWO). **Failed:** Greenwich Theatre Technical Manager, Legends
Global Security Manager Minneapolis, ASM Allegiant Stadium Safety Representative.

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

✅ **VINDICATED 2026-08-31, and it took 27 days.** The first true safety-management seat this routine has
ever rowed: **Staffing/Security Manager, Colonial Life Arena** (University of South Carolina) — owns the
venue emergency plan, writes and audits the Security Office operations manual, reviews emergency
procedures for every event across an 18,000-seat arena plus a coliseum plus stadium gates. It came off
**TeamWork Online**, a source that only exists in this file because of Michael's ruling. **The ruling was
right and the original diagnosis would have deleted the keyword that found it.**

⚠️ **It also arrived with a lesson about WHY these seats open:** the incumbent had left ~a month earlier
for a crowd-management contractor, which was itself hiring for the same niche. **In a small discipline,
one departure is often two openings.** When a safety seat turns up, check where the last person went.

**Where safety roles actually live — sweep these for the safety keywords specifically:**

- [**TeamWork Online**](https://www.teamworkonline.com) `TWO` — arenas, stadiums, venue operators.
  The single highest-yield source for venue safety, security and event-operations roles. Filter to
  Arenas & Facilities. ⚠️ Browse the EMPLOYER indexes (Legends Global, Oak View Group, ASM Global) as well
  as searching — that is where the 08-31 safety row surfaced, and see the count-verification warning above.
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
planning, risk assessment or life-safety compliance for a venue or event is. ⚠️ **The boundary bites most
at the operator groups**, whose postings sit side by side: a *Security Manager* who owns the security plan
is IN; a *P/T Safety and Security Officer* or *Event Security* posting at the same employer is OUT.
**Read the duties, never the keyword in the title.**

---

## Sources

**Tier 1 (MANDATORY every pass, no exceptions):**

- **OffStageJobs** (`staging.offstagejobs.com`) `OSJ` — THE primary source, 29 years, ~600 listings live.
  **Browse the department indexes** (Lighting / Electrics · Scenic / Sets · Sound · Management ·
  Administration · Properties) in addition to keyword search. This board alone should produce 15-25
  qualifying listings if swept properly. ⚠️ **Returned only its nav shell with ZERO job rows on 2026-08-31**
  (re-tested twice, 7.5h apart; a known-live detail page hard-failed too). First observed outage of the
  primary source — if it repeats, this file needs a plan for a pass without OSJ, because nothing else
  covers what it covers.
- **Playbill Jobs** (`playbill.com/jobs`) `PB` — volume source. Browse Technical + Administrative categories.
  ⚠️ The index text often strips hyperlinks; recover a direct URL with a web search on org + exact title.
  ⚠️ Hard-failed 2026-08-31.
- **BroadwayWorld** (`broadwayworld.com/jobs`) `BWW` — volume source, multiple category filters.
  ⚠️ Direct fetch of `/jobs/` **failed on 2026-08-04**. First observed failure; if it repeats it is broken, not unlucky.
  🕐 **2026-08-31: reachable but served a 26-DAY-STALE CACHE.** See the fifth-source-state section above.
  **Do not capture from this board without solving for its render date first.**
- **StageLync** (`stagelync.com`) `SL` — weekly. Check Production Manager, Stage Management, Technical, Administration separately.
- **USITT Job Board** `USITT` — all relevant categories. ⚠️ Hard-failed 2026-08-31.
- **TeamWork Online** (`teamworkonline.com`) `TWO` — **required for the OPS lane only.** Venue and arena
  operations, safety and security. Added 2026-08-04; see the Safety Sweep above.

**⚠️ DEGRADED — was Tier 1, dropped from the mandatory set 2026-08-31:**

- **StageBoard** (`stageboard.app`) `SB` — aggregator, 785+ employers / 39 countries, role-taxonomy search.
  🔴 **FOUR consecutive fetch failures** (three in one day on 08-07, which already concluded *"this is now
  degraded not unlucky"*, plus 08-31). **Demoted rather than deleted:** a mandatory source that always
  fails makes every pass structurally incomplete by definition, which quietly devalues the word
  "mandatory" for every other board on the list. Try it each pass, mark ⚠️, move on. **Restore it to
  Tier 1 the moment it returns real listings** — the row stays so nobody thinks it was never registered.

**Tier 2 (hit at least 4 per pass, rotate through all over multiple passes):**

- **Arts Consulting Group** `ACG` — retained search, Director+ listings. ✅ Live and current as of 2026-08-31
  (16 active searches). ⚠️ Its listings skew executive/administrative — on 08-31 not one of the 16 was a
  venue-ops or safety seat, so a ⚪ here is normal for OPS and does not mean the board is quiet.
- **TOC Arts Partners** `TOC` — retained search, senior roles.
- **Skene Callboard** (`skene.pub/callboard`) `SKN` — free, open access, positions only (ignore grants/open calls).
  ⚠️ Genuinely mixed content — grants, residencies and open calls outnumber jobs. Filter to POSITION.
- **League of Chicago Theatres** (`chicagoplays.com/jobs`) `LCTJ` — regional, strong for ME/SM.
  🔴 **Hid TEN rows across two lanes** on 08-07 after two passes marked it *"carried, not re-swept."*
  **"Carried" is not a source state. If you did not open it, it is ❌.** ⚠️ Hard-failed 2026-08-31.
- **APAP Job Bank** `APAP` — performing arts admin and production.
- **HireCulture** (`hireculture.org`) `HC` — New England arts. ⚠️ Hard-failed 2026-08-31.
- **The Stage Jobs** (`jobs.thestage.co.uk`) `TSJ` — UK-heavy, strong backstage/technical. Now the top of the ME lane by pay.
  ⚠️ Both documented entry points hard-failed 2026-08-31.
- **GovernmentJobs / NEOGOV** (`governmentjobs.com`) `GOV` — municipal venues, civic centers, PACs.
- **StageJobsy** (`stagejobsy.com`) `SJ` · **TheatreArtLife** `TAL` · **EntertainmentCareers.net** `ECN` (paywalled, search results visible)
- **ARTSEARCH** `AS` — gated (TCG); try `site:artsearch.tcg.org`.
- **Indeed** (filtered) `IND` · **LinkedIn Jobs** (industry-filtered) `LI` — low yield, one targeted sweep each.

**Tier 3 (monthly, opportunistic):** venue-operator careers pages (ASM Global, Oak View Group, Live Nation, AEG) ·
freelance/remote boards · regional theatre associations · AEA postings · IATSE local boards · SearchWide Global / MCA.

> ⚠️ **On 2026-08-31, seven of the boards above hard-failed in one afternoon while three were fully live.**
> The dead ones were the THEATRE boards; the live ones were the VENUE/ARENA boards. **Do not report that
> shape as "the sources are down"** — it is a split, and it means a pass can still legitimately complete
> the OPS lane while being unable to touch PM/TD/SM/ME/AUD/DFT. State which half you could reach.

---

## 📡 Source access notes

- **OffStageJobs (`OSJ`):** `staging.offstagejobs.com` IS the live site (not a typo). Department browse is
  mandatory (see the law above). Detail pages sometimes lack an org name — if org is unknown, log as an
  unlinked sighting in NOTABLE, never invent a row. ⚠️ A listing marked **"reported for review"** is NOT
  admitted; flag it in NOTABLE instead (live case: an Ampa Events rendering-artist post at $50-60k).
  ⚠️ Its department indexes paginate hard (`Displaying 310 of 612`, page 1 of 16) — **an OSJ disappearance
  is undetectable from page 1**, so OSJ rows can only ever be confirmed live, never proved GONE.
- **Playbill (`PB`) + BroadwayWorld (`BWW`):** reliable URLs (PB uses UUID paths, BWW numeric IDs). Cross-posts
  between them are common — two rows, same org, NOT duplicates. ⚠️ **The cross-posting is useful in one
  direction:** a BWW copy of a PB row often publishes a close date the PB listing does not.
- **StageLync (`SL`):** clean category browsing, updated weekly. ⚠️ **Detail pages went premium-gated during
  the 08-07 pass** and the index gives no hyperlinks, so treat every SL hit as a sighting needing recovery
  (see the recovery procedure above). ⚠️ Heavily weighted to performer casting calls — the backstage and
  technical shelves are a small fraction of what it lists.
- **StageBoard (`SB`):** normalizes 200+ job titles; filter by Production Management, Technical Direction,
  Stage Management, Lighting/Electrics. ⚠️ See DEGRADED above — four straight failures.
- **TeamWork Online (`TWO`):** venue/arena/sports-facility jobs. Browse Arenas & Facilities, the
  Event Operations / Security categories, **and the operator EMPLOYER indexes**. Many postings come from
  operator groups rather than the venue itself.
  ✅ **It is the only board in this lane's set where GONE is PROVABLE:** a closed posting renders the explicit
  string *"This job is closed to new applications"* rather than 404ing or silently vanishing. Use it.
  ⚠️ **Its relative dates are unreliable as age** — operators bump postings. A row re-verified on 08-31 read
  "5 days ago" against a `posted` of 08-06 **at an unchanged job ID**, i.e. one record refreshed, not a new
  seat. **Same job ID = same listing. Keep one row, keep the original `posted`, flag the drift.**
  ⚠️ Postings often state a hard close date in the body ("This position will remain open until September 11,
  2026") that appears nowhere in the metadata. Capture it — the schema has no column for it, so it goes in
  NOTABLE.
- **GovernmentJobs (`GOV`):** municipal postings are verbose and slow to load but carry exact salary bands
  and hard closing dates — capture the closing date, it is usually a real deadline.
- **EntertainmentCareers.net (`ECN`):** paywalled; URLs capturable from search results.
- **ARTSEARCH (`AS`):** gated behind TCG membership; sometimes surfaces via cache/aggregators.
- **Indeed (`IND`):** theatre terms drown in manufacturing/logistics. Low yield, one targeted sweep max —
  except for the safety keywords, where it beats the theatre boards.
- **APAP (`APAP`):** listings often lack posted dates. If no date, use `first_seen` for both and log the fact in NOTABLE.
- **League of Chicago Theatres (`LCTJ`):** clean URLs, Chicago-focused, good for ME and SM. ⚠️ Many listings
  publish NO post date — apply the APAP precedent and say so, or their days-on-board reads 0 forever.
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

> ⚠️ **A lane can exceed its band for a reason that is not good news.** The OPS lane hit 13 on 08-31 against
> a 4-8 band — entirely from venue-ops volume on the boards that happened to be up, while the safety half
> produced exactly 1 (inside its 0-3 band). **Read the composition, not the total.** Same disease as the
> 90-120 baseline: a count that measures our sweep rather than the market.

### Where the top of market lives

- **Retained search firms (ACG, TOC, MCA/SearchWide)** carry the Director+ listings. Check them FIRST when scanning senior.
  ⚠️ But they are not the only home for executive roles — the highest-paying non-Lincoln-Center job in the
  08-04 inventory (Gamm ED, $125-140k) was an ACG search surfaced through **OffStageJobs**, not ACG's own page.
- **OffStageJobs** is the national standard for behind-the-scenes staff positions.
- **Playbill + BWW** are the volume sources for mid-level across all lanes.
- **Regional association boards (LCTJ, APAP, Skene, HC)** catch what the aggregators miss.
- **Venue operator groups (Legends Global, Oak View Group, ASM Global) are the top of the OPS market**, and
  they out-pay the theatre boards for the same work: Navy Pier Director of Event Operations at
  $114,000-134,000 is the highest-paid OPS row this routine has tracked.

### Lane-specific realities

- **PM lane has the highest open-board volume** and is also the most lateral — depth here is not progress.
- **TD lane overlaps PM frequently.** "Technical Director/Production Manager" combo titles are common at
  smaller houses. Home it in TD, set `also_lanes=production-manager`.
- **SM lane is union-deadline-driven.** Equity submission deadlines cluster; a pass often finds 6-8 deadlines
  inside a two-week window. Surface the cluster, it is the highest-actionability fact in the lane.
  ⚠️ It also absorbs low-stipend contract work ($600-1,400/run). Rowed per config, but an open question
  stands with Michael about a compensation floor — see the 08-07 NOTABLE. **Not the executor's call.**
- **ME lane's top of market is now the UK.** Both £-denominated listings out-earn every US electrics posting tracked.
- **AUD lane is NOT touring-only.** That read came from looking at Playbill alone. Half the lane is resident
  staff at $45-76k, all of it found through the OSJ Sound department.
- **OPS lane is TWO markets in one config entry.** Venue management (house/ops/facilities) posts on the theatre
  boards and produces most of the rows. Safety management posts on venue/arena/municipal boards and produces
  0-3. **Sweep both halves; do not let the first half's volume disguise a skipped second half.**
  🔴 **And the two halves fail INDEPENDENTLY** — proven 08-31, when every theatre board was down and every
  venue board was up. **Report the halves separately or a half-swept lane reads as a full one.**
- **DFT lane is two organizations.** Every row on 08-04 came from Riverside Theatre and New London Barn.
  That is not a market, it is two theatres staffing a season. Treat the count with suspicion — but the lane
  stays swept in full (Michael, 2026-08-04).

### Org/venue data

The `org` column across the lane files is building a theatre directory organically. Let it grow. Future
integration potential: a venue list that feeds constraints back into the search (e.g. "skip orgs already applied to").

### Procedural notes

- Cross-posted listings between PB and BWW are common. Two rows, same org. Not duplicates.
- If a listing URL goes dead between passes, mark GONE. Don't hunt it elsewhere.
  ⚠️ **But a board you could not REACH is not a listing that went dead.** Unreachable means the row is
  carried and unverified — say which rows those are. **"Carried" and "verified" must never share a mark**,
  the same rule that cost us ten rows on LCTJ.
- Never add a row without a working URL. NOTABLE exists for unlinked sightings.
- **A listing with a URL but no post date is still a row.** Use `first_seen` for both fields and say so in
  NOTABLE (the APAP precedent). Missing DATE is not missing PROOF; missing URL is.
- **A re-post is not a new seat.** Same job ID or same URL with a refreshed date = one record. Keep one row,
  keep the original `posted`, flag it (Carson Center TD 08-07, Raising Cane's River Center 08-31).
- **Keyword exhaustion:** don't stop at the first keyword that returns results. Try ALL keywords in the role
  config against each board — different boards index differently, and "Production Manager" and "Director of
  Production" often live in different categories on the same board.
- **A gated or thin board is a NOTABLE entry explaining the access issue**, never a reason to accept low yield
  across the whole pass. Log what was attempted.
- 🚫 **Never propose cutting a keyword because it returned nothing.** First prove it was pointed at a source
  where it could have succeeded. Both times that proposal has been made, the keyword was fine and the source
  list was wrong — and on 2026-08-31 the keyword set they wanted to cut produced the best find of the pass.
- ⏰ **The cost of not running shows up as expired deadlines, and it should be reported.** The 24-day gap
  before 08-31 cost a $43,750-50,000 in-lane venue-management seat whose deadline passed by ONE day. Name
  those in NOTABLE. A catch-up pass that hides what it missed is selling the routine as more current than it is.
