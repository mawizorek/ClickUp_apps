# Job Market Refresh — Sources & Cold-Agent Intelligence

> **Split out of `job-market-refresh.md` on 2026-08-04 (v17).** The runbook holds procedure and STOP
> conditions; this file holds WHERE to look and WHAT NORMAL LOOKS LIKE. Read both before a pass.

> 🔗 **Board homepage URLs are NOT held in this file.** They live in `job-market-templates.md` → Template 7,
> which is the single claimant. Added 2026-08-31 after an agent "remembered" an ACG URL, fetched the wrong
> page, and reported it as doc rot — while the correct documented URL was live the whole time. **Read the
> template; never derive a board URL from memory.** If you need a URL and Template 7 lacks it, add it THERE.
>
> 🔴 **2026-09-20: THAT RULE HAS A SECOND HALF IT WAS MISSING, AND IT COST FOUR PASSES.** A documented URL
> is not a correct URL. This file carried `chicagoplays.com/jobs` for LCTJ, four passes logged LCTJ as a
> hard failure, and the board was live the whole time at a different host. **A URL that fails repeatedly is
> a suspect, not a victim.** After the second consecutive failure of any board, search for its current home
> before recording a third outage. See the LCTJ entry below.

> 🧩 **THIS FILE HAS TWO SIBLING SEGMENTS, AND IT IS ONLY THE THEATRE/VENUE THIRD OF THE SOURCES FAMILY.**
> The family is split by CONCERN because this file outgrew safe whole-file editing. **A sweep that reads
> only this file is structurally incomplete no matter how thorough it is within it.**
>
> 🌐 **`routines/job-market-sources-remote.md`** (added 2026-09-19) — REMOTE-FIRST routes, organised by work
> arrangement rather than industry. Ten sources verified live with named roles and salaries as evidence.
> Its headline is ASYMMETRIC and changes how two lanes get swept: **remote `creative-admin` work
> (development, grants, donor communications, arts marketing) is a real, reusable market that this routine
> had NEVER swept** — that half was unswept, not thin. Remote AV/CAD is genuine but scarce, and the
> physical lanes have no remote market at all. It also carries **verbatim requirement language** (CTS,
> AutoCAD, Revit, MailChimp, grants-management software) that no state-file column can hold.
> ✅ **The state files can now hold some of it:** the 17th column `requirements` landed 2026-09-20 in eight
> of nine lane files. It holds SHORT verbatim requirement quotes per row. This segment is still the home for
> requirement language that describes a MARKET rather than a listing.
>
> 🧩 **`routines/job-market-sources-experiential.md`** (added 2026-09-18). It covers the **experiential /
> brand-experience / trade-show / themed-entertainment** market, which none of the boards listed below
> index: specialist boards, an employer map split by CAD platform, the drafting-service subcontract route,
> verbatim pay evidence, and the rule that an ATS job ID absent from the employer's live feed is CLOSED
> however current a mirror looks. It is the primary source set for the DFT lane's remote/freelance half.
>
> ⚠️ **Several experiential boards are also remote-friendly, so a remote drafting sweep must read BOTH
> siblings.** They do not overlap: one is organised by industry, the other by work arrangement.

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
   ✅ **SOLVED for OSJ on 2026-09-19 and the working query strings are in Template 7.** The label is
   lowercase with the slash encoded: `?department=scenic+%2F+sets` returns 339 of 602. `?department=Scenic`
   returns the whole board. **Read Template 7; do not re-derive it.**

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

> 🔴 **THE SIXTH SOURCE STATE, added 2026-09-20: WRONG DOOR.** A board recorded as ❌ across four passes
> that is in fact LIVE at a host this file did not know about. It wears ❌'s mark exactly, it accumulates a
> failure history that reads like evidence of decay, and each new outage makes the diagnosis look *better
> confirmed*. LCTJ sat in this state from 08-07 to 09-20 while one lane enumerated it freely off the
> correct host. **Detection: a board that fails for every agent except one is not a flaky board, it is two
> different URLs.** When one lane reaches a source another lane calls dead, reconcile the URLs before you
> reconcile the rows. **Fifth instance of the same disease: a state we could not distinguish from another,
> wearing its mark.**

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
   🔴 **AND A MIRROR NEVER OUTRANKS THE EMPLOYER ON LIVENESS** (locked 2026-09-20). Turning Stone
   Entertainment Technician: a mirror showed it live, the employer's own portal showed it FILLED. The
   employer wins, every time, without deliberation. A mirror saying live against an employer saying closed
   is not a conflict to record — it is a stale mirror.
4. **Cross-check the date.** Mirrors and first-party pages routinely disagree. Take the explicitly dated
   claim over a relative one, and **record the conflict** rather than averaging.
5. **Give up out loud.** Two failed searches → log it as an unlinked sighting in NOTABLE with what you
   tried. 🚫 Never invent a URL, never row a sighting, never let "I did not find it" read as "it does not
   exist."

**Proven:** Kentucky Performing Arts TD (SL-gated → LinkedIn) · WCU TD (SL-gated → `jobs.wcu.edu`) · USC
Colonial Life Arena Staffing/Security Manager (TWO → `uscjobs.sc.edu`) · Legends Global Century II Director
of Operations (WashU mirror → first-party TWO). **Failed:** Greenwich Theatre Technical Manager, Legends
Global Security Manager Minneapolis, ASM Allegiant Stadium Safety Representative.

⚠️ **Three recoveries are OWED from the 2026-09-20 pass and all three are near-home**, which is the one
category where an unrecovered sighting actually costs something: Syracuse University *Event & Technical
Services Coordinator* ($28.93-31.68/hr), Seneca Niagara *Production Services Technician*, and Argyle
Theatre's two *Mary Poppins* electrician cards. Run the procedure on these first next pass.

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

✅ **VINDICATED AGAIN, HARDER, 2026-09-18:** the safety half produced **FIVE manager-level seats in one
pass** — above its own documented 0-3 band — from Regions Arena, Target Center, SNHU Arena and Delta
Center alongside the standing Colonial Life Arena row. **The keyword set that was proposed for deletion is
now the lane's most productive half.**

✅ **AND AGAIN 2026-09-20: SIX.** OPS composition was 39 venue / **6 safety** — the safety half's best
pass on record, twice its documented ceiling. ⭐ **The most useful single fact the sweep has ever produced
came with it:** London Stadium *Safety Coordinator* (£30,784-33,000) names, in its own body text,
**no OSHA-30, no ETCP, and no degree floor.** Every other high-value row in the 09-20 inventory was gated
by a credential Michael does not hold. This one is not gated at all. **The niche is enterable as-is, and
that is a strategic fact, not a listing.** Route it to Compass Corso, not just to the report.

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
- **UK stadium and major-venue careers pages direct** (added 2026-09-20) — the London Stadium row came
  off one. UK venues write safety duties more explicitly than US ones and state their credential floor in
  the body, which makes them the best source in the set for **reading what the discipline actually
  requires**, independent of whether Michael would take the job.

**Calibration:** expect **0-3 qualifying safety seats per pass**, and expect many passes to return
none. **That is a correct result, not a failed sweep.** Report it as swept-and-empty, never omit it —
an unreported niche looks identical to an abandoned one. The value here is asymmetric: one genuine
live-event safety seat is worth more to Michael than another Production Manager row, because almost
nobody is qualified for both sides of it.

> ⚠️ **The 0-3 band has now been beaten twice running (5 on 09-18, 6 on 09-20) and should be read as
> 0-6 with a wide variance.** Do not rewrite it to 5-6 and turn it into a target — the band exists to stop
> a zero being treated as failure, not to set a quota. Same failure mode as the 40 floor and the 90-120
> baseline below.

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
  ⚠️ **Its pagination is broken past page 2** (verified 2026-09-19, unchanged 2026-09-20: Scenic/Sets
  advertises 17 pages, pages 3-17 return page-1 content). **Every OSJ department harvest is structurally
  partial.** And the board is **not snapshot-consistent** — two correct requests minutes apart returned
  310 of 612 and 339 of 602, so **a changed count between passes is not market movement.**
  ⚠️ **Many OSJ rows now point at the EMPLOYER's ATS rather than at `jobdetail.php`** (Workday, Oracle
  Cloud, iCIMS, ApplyToJob). That is correct and preferred — OSJ is the discovery layer, the ATS is the
  first-party home. See the ATS families below.
- **Playbill Jobs** (`playbill.com/jobs`) `PB` — volume source. Browse Technical + Administrative categories.
  ⚠️ The index text often strips hyperlinks; recover a direct URL with a web search on org + exact title.
  ⚠️ Hard-failed 2026-08-31.
- **BroadwayWorld** (`broadwayworld.com/jobs`) `BWW` — volume source, multiple category filters.
  ⚠️ Direct fetch of `/jobs/` **failed on 2026-08-04**. First observed failure; if it repeats it is broken, not unlucky.
  🕐 **2026-08-31: reachable but served a 26-DAY-STALE CACHE.** See the fifth-source-state section above.
  **Do not capture from this board without solving for its render date first.**
  🕐 **Stale AGAIN on 2026-09-18.** Two occurrences a fortnight apart: treat staleness as this board's
  normal condition and check the render date every single time.
- **StageLync** (`stagelync.com`) `SL` — weekly. Check Production Manager, Stage Management, Technical, Administration separately.
- **USITT Job Board** `USITT` — all relevant categories. ⚠️ Hard-failed 2026-08-31.
- **TeamWork Online** (`teamworkonline.com`) `TWO` — **required for the OPS lane only.** Venue and arena
  operations, safety and security. Added 2026-08-04; see the Safety Sweep above.

**⚠️ DEGRADED — was Tier 1, dropped from the mandatory set 2026-08-31:**

- **StageBoard** (`stageboard.app`) `SB` — aggregator, 785+ employers / 39 countries, role-taxonomy search.
  🔴 **FIVE consecutive fetch failures** (three in one day on 08-07, which already concluded *"this is now
  degraded not unlucky"*, plus 08-31, plus 09-20). **Demoted rather than deleted:** a mandatory source that
  always fails makes every pass structurally incomplete by definition, which quietly devalues the word
  "mandatory" for every other board on the list. Try it each pass, mark ⚠️, move on. **Restore it to
  Tier 1 the moment it returns real listings** — the row stays so nobody thinks it was never registered.
  🔴 **2026-09-20: THE CAUSE IS NOW KNOWN AND IT IS NOT AN OUTAGE.** The board has moved behind a PROFILE
  WALL (reachable surface at `faizova.com`); there is no anonymous listing view left to fetch. So this is
  not the WRONG DOOR state above — the door is real and it is locked. **That changes the decision from
  "keep retrying" to "retire or authenticate," and it is Michael's call, not the executor's.** Surfaced
  2026-09-20, unresolved. Until he rules: attempt once per pass, one line, no recovery effort.

**Tier 2 (hit at least 4 per pass, rotate through all over multiple passes):**

- **Arts Consulting Group** `ACG` — retained search, Director+ listings. ✅ Live and current as of 2026-08-31
  (16 active searches). ⚠️ Its listings skew executive/administrative — on 08-31 not one of the 16 was a
  venue-ops or safety seat, so a ⚪ here is normal for OPS and does not mean the board is quiet.
- **TOC Arts Partners** `TOC` — retained search, senior roles.
- **Management Consultants for the Arts** `MCA` — retained search, Artistic Director / executive. Added
  2026-09-20 (source of the Florida Studio Theatre AD row, $160,000+). Third member of the retained-search
  set alongside ACG and TOC. ⚠️ **Retained-search firms cross-post to Playbill under the firm's name**
  ("...working with Management Consultants for the Arts"), which produces a legitimate two-row cross-post,
  not a duplicate.
- **Skene Callboard** (`skene.pub/callboard`) `SKN` — free, open access, positions only (ignore grants/open calls).
  ⚠️ Genuinely mixed content — grants, residencies and open calls outnumber jobs. Filter to POSITION.
- **League of Chicago Theatres** `LCTJ` — regional, strong for ME/SM.
  🔴 **HOST CORRECTED 2026-09-20. The live board is `jobs.leagueofchicagotheatres.org`.** This file
  carried `chicagoplays.com/jobs`, which is a broken door, and **four passes recorded LCTJ as a hard
  failure against it (08-07, 08-31, and two lanes on 09-18/09-20) while the SM lane enumerated the board
  freely off the correct host in the same pass.** Every LCTJ outage on record is a WRONG-URL artifact, not
  a board problem. The board has been healthy throughout. See the sixth source state above.
  🔴 **This is the second time LCTJ has cost us rows for a reason that was not the board's fault** — it
  **hid TEN rows across two lanes** on 08-07 after two passes marked it *"carried, not re-swept."*
  **"Carried" is not a source state. If you did not open it, it is ❌.** Between the wrong host and the
  carried-not-swept era, this single source has the worst evidence-quality record in the file. Sweep it
  deliberately for the next two passes and confirm the yield.
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

> 🌐 **"freelance/remote boards" above is no longer a vague gesture.** Ten remote routes are named and
> live-verified in `job-market-sources-remote.md`. Sweep that file rather than improvising a remote search.

> ⚠️ **On 2026-08-31, seven of the boards above hard-failed in one afternoon while three were fully live.**
> The dead ones were the THEATRE boards; the live ones were the VENUE/ARENA boards. **Do not report that
> shape as "the sources are down"** — it is a split, and it means a pass can still legitimately complete
> the OPS lane while being unable to touch PM/TD/SM/ME/AUD/DFT. State which half you could reach.

---

## 🆕 SOURCES WRITTEN IN 2026-09-20 (owed since 09-18, and the shape of them is the finding)

**The 09-18 stamp owed "eleven verified remote sources not written into this file." It was worse than
eleven, and it was not really about remote.** The 09-20 pass banked +113 rows and the new ones came
disproportionately from things that **are not job boards at all.** That is the generalization worth more
than the list: **this routine's source model was board-shaped, and the market is increasingly ATS-shaped.**

🔴 **Consequence, and it is a method change, not a note: a board sweep finds the POSTING, but the ATS is
the RECORD.** When a board row and an ATS row describe the same seat, the ATS URL is the row's URL. It
carries the requisition ID (which makes a re-post detectable), it carries the real close state, and it
does not go stale the way a mirror does.

**⚙️ ATS families — the single biggest gap this file had. Recognise them on sight:**

- **Workday** `WD` — `<org>.wd*.myworkdayjobs.com`. Higher ed and large nonprofits. (Holy Cross
  Production Operations Coordinator, $55,700-59,000.)
- **Oracle Cloud / HCM** `ORA` — `fa-*.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/...`. Big
  universities. (Stanford TAPS VSO Production Manager, $87,000-91,000.)
- **SmartRecruiters** `SR` — `jobs.smartrecruiters.com/<org>/<id>`. (Harvard OFA Production Manager.)
- **PageUp** `PU` — `careers.pageuppeople.com/...`. CSU system and similar. (CSUN Lead Production
  Coordinator, $5,274-6,689/month.)
- **Paylocity** `PAY` — `recruiting.paylocity.com/...`. Mid-size nonprofits. (TUTS Production Manager.)
- **ApplyToJob / JazzHR** `ATJ` — `<org>.applytojob.com/apply/<id>`. (Apollo Theater Director of
  Production, $150,000-170,000 — the FIRST-PARTY home of a row this routine had previously only held via
  Playbill and StageLync.)
- **iCIMS** `ICM` — `<org>.icims.com`. Already named in the URL-recovery procedure above; now a source in
  its own right.
- **JobTarget** `JT` — `jobtarget.com/jobs/jt-*`. Syndication layer, treat as a POINTER to first-party.
  (Hobby Center VP of Operations, $150,000-175,000.)

⚠️ **How to actually use them:** you cannot "browse" an ATS family. Use them in two ways only — (1) as the
recovery target when a board row lacks a first-party URL, and (2) by going direct to the ATS of a NAMED
employer you care about. The second is how near-home sweeping works, and see the warning about it below.

**🏛️ First-party employer and venue portals — go direct, they out-detail every board:**

- **Employer careers pages** `CS` — the catch-all code for an organisation's own jobs page. Produced the
  Clear Space Theatre AD row and Canadian Stage's Director of Production and Facilities
  ($125,000-135,000/year). ⭐ **Canadian Stage is also the reminder that this routine has never
  deliberately swept CANADA**, and Toronto pays at the top of the PM band.
- **`arshtcenter.org`** `ARSHT` · **`prax.oregonstate.edu/jobs-at-prax`** `PRAX` ·
  **`networkstours.com/job/...`** `NET` · **`apollotheater.applytojob.com`** `APOLLO` — named because each
  one is the first-party home of a row this routine already held second-hand. 🔴 **PRAx appeared FIVE
  times in the PM lane across OSJ, PB, SL, APAP and its own site.** That is correct per the cross-posting
  rule, but it is also a signal: **a seat posted on five boards is a seat being pushed hard.** Worth
  noticing as a market fact.
- **State government portals** — `jobs.virginia.gov` and equivalents, distinct from NEOGOV/`GOV`. (George
  Mason Event Services and Production Supervisor, $65,000.)

**🗾 Regional and discipline boards new this pass:**

- **Dance/NYC** (`dance.nyc/for-artists/listings`) `DNYC` — dance-sector production and management roles
  that none of the theatre boards index. (Ballet Hispánico Production Manager, $37-42/hour.)
- **NYFA** (`nyfa.org/jobs`) `NYFA` — New York Foundation for the Arts. Arts-wide, strong on senior
  production. (Second Stage Director of Production, $145,000-160,000.)
- **HERC** (`hercjobs.org`) `HERC` — Higher Education Recruitment Consortium. ⭐ **The best single source
  for university-venue production seats**, which are a large and previously under-swept slice of this
  market and tend to carry real salary bands and real benefits.
- **Jobs in the Valley** (`jobsinthevalley.com`) `JIV` — hyper-regional (Western Mass). Named as the
  PATTERN, not for its own sake: **hyper-regional general job boards carry IATSE-house technical seats
  that no arts board lists** (Academy of Music Theatre TD, $65,000-68,000, an IATSE Local 232 house).
  Sweep the equivalent board for any geography Michael actually cares about.
- **LVI Associates** `LVI` — recruiting agency, live-events practice. ⚠️ Agency listings are
  client-anonymous ("LVI Associates client") and they go GONE fast — this one already has. Row them, but
  expect churn and do not treat a disappearance as market movement.

> 🔴 **THE NEAR-HOME WARNING, and it is the most honest thing in this section.** The ME lane hand-checked
> **21 near-home employers** on 09-20 and **exactly one yielded** (Geva, Rochester). Going direct to named
> local employers is the right method — it is the only way to find near-home work, and proximity is worth
> real money to Michael — but **the hit rate is roughly 1 in 20 and the cost per check is high.** Budget
> it deliberately as its own task with its own time box. Do not let it eat a lane's sweep, and do not read
> a 1-in-20 return as a failure: that is what this sub-market looks like.

---

## 📡 Source access notes

- **OffStageJobs (`OSJ`):** `staging.offstagejobs.com` IS the live site (not a typo). Department browse is
  mandatory (see the law above). Detail pages sometimes lack an org name — if org is unknown, log as an
  unlinked sighting in NOTABLE, never invent a row. ⚠️ A listing marked **"reported for review"** is NOT
  admitted; flag it in NOTABLE instead (live case: an Ampa Events rendering-artist post at $50-60k).
  ⚠️ Its department indexes paginate hard (`Displaying 310 of 612`, page 1 of 16) — **an OSJ disappearance
  is undetectable from page 1**, so OSJ rows can only ever be confirmed live, never proved GONE.
  ✅ **Working department query strings live in Template 7** (verified 2026-09-19). Use them; do not guess.
  ⚠️ **Its JM-IDs collide.** On 09-20 an hourly drafting row and a salaried Seattle U/Cornish TD row both
  hashed to `JM-OSJ-cornish-td`. Patched by suffixing the hourly row `-hourly`. **Check for an existing ID
  before minting one, and when two listings collide, ask whether it is one requisition described twice
  before you rename anything** — that question is still open on Cornish.
- **Playbill (`PB`) + BroadwayWorld (`BWW`):** reliable URLs (PB uses UUID paths, BWW numeric IDs). Cross-posts
  between them are common — two rows, same org, NOT duplicates. ⚠️ **The cross-posting is useful in one
  direction:** a BWW copy of a PB row often publishes a close date the PB listing does not.
- **StageLync (`SL`):** clean category browsing, updated weekly. ⚠️ **Detail pages went premium-gated during
  the 08-07 pass** and the index gives no hyperlinks, so treat every SL hit as a sighting needing recovery
  (see the recovery procedure above). ⚠️ Heavily weighted to performer casting calls — the backstage and
  technical shelves are a small fraction of what it lists. 🔴 **It is the single largest source of carried
  UNVERIFIED rows in the inventory** — of the 51 rows carrying an unverified `live` after the 09-18 pass,
  the majority are SL paywalls. A paywall is not a dead posting, but it is not a verified one either.
  🔴 **After 09-20 the carried-unverified population is roughly 200, not 51** — that pass spent its budget
  on breadth and the new `requirements` column and did not re-run a liveness sweep. SL is still the
  largest single contributor, but it is no longer the main reason. **Next pass owes verification, not
  breadth.**
- **StageBoard (`SB`):** normalizes 200+ job titles; filter by Production Management, Technical Direction,
  Stage Management, Lighting/Electrics. ⚠️ See DEGRADED above — five straight failures, now known to be a
  profile wall rather than an outage. Retirement is awaiting Michael's ruling.
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
  🔴 **A CLOSE DATE IN THE FUTURE IS NOT A REASON TO REFUSE A ROW.** On 09-20 a lane refused Clark State
  College GM Venue Operations as "closed 9/21 5:00 PM ET" against a 09-20 anchor. **That listing was open
  when it was refused, with a deadline Michael could still have met.** Closing soon is the most
  actionable state a row can be in. Row it and flag the deadline.
- **EntertainmentCareers.net (`ECN`):** paywalled; URLs capturable from search results.
- **ARTSEARCH (`AS`):** gated behind TCG membership; sometimes surfaces via cache/aggregators.
- **Indeed (`IND`):** theatre terms drown in manufacturing/logistics. Low yield, one targeted sweep max —
  except for the safety keywords, where it beats the theatre boards.
- **APAP (`APAP`):** listings often lack posted dates. If no date, use `first_seen` for both and log the fact in NOTABLE.
- **League of Chicago Theatres (`LCTJ`):** 🔴 **the host is `jobs.leagueofchicagotheatres.org`, NOT
  `chicagoplays.com/jobs`** — see the corrected Tier 2 entry above and fix Template 7 if it still carries
  the old one. Clean URLs, Chicago-focused, good for ME and SM. ⚠️ Many listings
  publish NO post date — apply the APAP precedent and say so, or their days-on-board reads 0 forever.
- **The Stage Jobs (`TSJ`):** filter to Backstage & Technical, Management. ⚠️ Many listings carry NO post date —
  liveness unverified means no row. A dedicated verification sweep of its PM shelf (RSC, Oxford, RCS, E1) is outstanding.
- **HireCulture (`HC`):** smaller volume, catches New England roles other boards miss.
- **ATS families, first-party portals and the 09-20 regional boards:** see the 🆕 section above for
  recognition patterns and the rule that the ATS URL beats the board URL.
- **Experiential / trade-show / themed-entertainment boards:** NOT listed here. See the sibling segment
  `job-market-sources-experiential.md` — it holds the board list, the employer map, and the access notes
  for that market, including the CAD-platform split that decides which employers are reachable at all.
- **Remote-first boards and arts-admin remote routes:** NOT listed here either. See
  `job-market-sources-remote.md` — ten verified routes with access friction noted, plus the warning that
  **"remote" in this industry rarely means location-free** (required states, travel, in-person rehearsals)
  and that remote-job SEO mirrors inflate the apparent count more than anywhere else.
  🔴 **09-20 refused THREE false remote claims** (Capitol Civic Centre, Global Elite, Peninsula Women's
  Chorus) and Maven refused again. **The refusals are the evidence that the accessibility column means
  something.** Body text or no tag.

---

## 🧊 Cold-agent intelligence

### Density expectations

**The performing arts job market is NOT sparse.** With all eight lanes swept properly, including department
indexes, expect **90-120 qualifying live listings**. The 2026-08-04 pass landed 108 and that is the working
baseline. The floor in the runbook (40) is a failure tripwire, not a target.

> ⚠️ **The 40 floor was calibrated against keyword-only sweeps and is now very easy to clear.** Clearing it
> is no longer evidence of a good pass. A pass that returns 45 with the department indexes unbrowsed is a
> shallow pass wearing a passing grade. Judge depth by SOURCES coverage, not by the total.

> 🔴 **THE 90-120 BASELINE IS NOW ITSELF OBSOLETE, and it was obsolete for the same reason as the 40 floor.**
> The 2026-09-18 pass landed **345 live across nine lanes** — roughly triple the baseline — with no change in
> the market. It re-verified every standing row individually instead of carrying stale `live` values, and it
> swept two source segments that did not previously exist. **Every density figure in this file measures our
> sweep, not the world.** Judge a pass by whether it verified what it claims and named what it could not
> reach, never by whether it hit a number.

> 🔴 **448 on 2026-09-20 (+113), and READ THE COMPOSITION BEFORE YOU ADMIRE THE NUMBER.** That pass reported
> **0 GONE** — which is not a finding that nothing closed, it is **the absence of a liveness sweep.** Roughly
> 200 rows were carried unverified. A rising total with a flat GONE count is the signature of a breadth pass,
> and breadth and verification are different jobs that this routine must stop conflating. **A pass that
> cannot say what died has not measured the market, it has measured its own reach.**

Approximate yield by lane (post-08-04 baseline): PM 25-35 · TD 12-18 · SM 18-25 · ME 10-15 · AUD 10-15 ·
OPS 4-8 (of which 0-3 safety) · DFT 2-6 · ADM 8-12.

> ⚠️ **Post-09-18 actuals, for contrast, and note every lane exceeded its band:** PM 59 · TD 50 · SM 48 ·
> AUD 45 · DFT 44 · ME 33 · ADM 31 · OPS 25 (20 venue / 5 safety) · PRD 10. **Do not treat the bands above
> as targets or ceilings.** They were measured on shallower sweeps.

> ⚠️ **Post-09-20 actuals (448 total):** TD 68 · PM 65 · SM 62 · ADM 61 · DFT 53 · AUD 51 · OPS 45
> (39 venue / **6 safety**) · ME 43 · PRD 10. Biggest movers were **ADM +30** (the remote half finally being
> swept, two passes after it was identified) and **OPS +20**. ⭐ **PRD banked +0 and that is the most
> informative lane result of the pass:** senior artistic/producing seats are genuinely scarce and turn over
> slowly, so a flat PRD is a market fact rather than a sweep failure — the first time that sentence has been
> true of any lane in this file.

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
  ⚠️ **Superseded 2026-09-20:** Adventist Health Arena **Assistant GM at $155,000-180,000** is now the top
  of the OPS market, and it is the same story one tier up — an operator seat, not a theatre seat.
- 🔻 **KNOWN KEYWORD GAP, recorded 2026-09-19, and it has now produced evidence in TWO CONSECUTIVE PASSES:**
  **no lane asks for `CEO`, `President`, `COO` or `Chief`.**
  So the highest-paying row ever tracked — LA Master Chorale *President & CEO*, **$275,000-350,000** — was
  found by accident on a source browse, not by the config. Michael declined a dedicated c-suite lane
  (*"it is just a filter of existing things in a tab"*), so this stays a **keyword** gap, not a lane gap.
  🔴 **09-20 fired it again:** Seaview **COO, $150,000-225,000**, found ONLY by hand-sweeping the four words
  the config does not ask for. Also Gallo Center ED $190-220k. **Two passes, two six-figure finds, zero
  config coverage.** The open question for Michael is narrow and is NOT the lane he already declined:
  **add these four words to `creative-admin`'s keyword list?** Until he rules, hand-sweep them every pass
  and say so in SOURCES.

### Lane-specific realities

- **PM lane has the highest open-board volume** and is also the most lateral — depth here is not progress.
- **TD lane overlaps PM frequently.** "Technical Director/Production Manager" combo titles are common at
  smaller houses. Home it in TD, set `also_lanes=production-manager`.
  ⚠️ **And the pointer is owed in the other direction too:** `JM-GOV-rancho-tps` (Rancho Cucamonga Theatre
  Production Supervisor) reads as TD work and still needs `technical-director` appended to its
  `also_lanes`. Deliberately deferred 2026-09-20 rather than hand-rewriting a 70-row TSV for one field —
  **do it on the next pass that rewrites `production-manager.tsv` anyway.**
- **SM lane is union-deadline-driven.** Equity submission deadlines cluster; a pass often finds 6-8 deadlines
  inside a two-week window. Surface the cluster, it is the highest-actionability fact in the lane.
  ⚠️ It also absorbs low-stipend contract work ($600-1,400/run). Rowed per config, but an open question
  stands with Michael about a compensation floor — see the 08-07 NOTABLE. **Not the executor's call.**
  🔴 **09-20 BROKE THIS LANE'S CEILING AND IT MATTERS FOR REASONS THAT ARE NOT PAY:** Magic Mike Live NYC
  PSM (Free Association Live), **$125,000-130,000 SALARIED** — in a lane previously characterised by
  stipends. Its body requires **OSHA-30**, which Michael wants and does not hold. **The top of the SM lane
  is a credential away, not a career away.**
- **ME lane's top of market is now the UK.** Both £-denominated listings out-earn every US electrics posting tracked.
- **AUD lane is NOT touring-only.** That read came from looking at Playbill alone. Half the lane is resident
  staff at $45-76k, all of it found through the OSJ Sound department. ✅ Re-confirmed 09-18: 21 resident-staff
  versus 24 touring/contract.
- **OPS lane is TWO markets in one config entry.** Venue management (house/ops/facilities) posts on the theatre
  boards and produces most of the rows. Safety management posts on venue/arena/municipal boards and produces
  0-3. **Sweep both halves; do not let the first half's volume disguise a skipped second half.**
  🔴 **And the two halves fail INDEPENDENTLY** — proven 08-31, when every theatre board was down and every
  venue board was up. **Report the halves separately or a half-swept lane reads as a full one.**
- **ADM lane has a REMOTE half that was never swept**, which is different from thin. 🌐 Its sources now exist
  in `job-market-sources-remote.md` (Arts Admin Jobs, Philanthropy News Digest, Idealist, AFP, Remote
  Impact). ⭐ And the barrier there is **TOOL FLUENCY, not certification** — postings name MailChimp, Canva,
  WordPress, Monday.com, donor databases and grants-management software, all learnable in days. That is a
  fundamentally different build from the ETCP stack the technical lanes demand.
  ✅ **Closed 2026-09-20: swept, and it was the biggest mover in the pass (+30, to 61).** The "unswept, not
  thin" diagnosis was correct.
- **DFT lane is two organizations.** Every row on 08-04 came from Riverside Theatre and New London Barn.
  That is not a market, it is two theatres staffing a season. Treat the count with suspicion — but the lane
  stays swept in full (Michael, 2026-08-04).
  🔴 **2026-09-18: that diagnosis was a SOURCE artifact, same as the safety lane's.** The drafting market is
  largely EXPERIENTIAL, not theatrical, and none of the boards above index it. The lane's real source set is
  the sibling segment `job-market-sources-experiential.md`. **Sweep it before calling this lane thin.**
  ✅ Proven the same day: the lane went 23 → 44 live, **14 of them experiential**, and the two genuine remote
  CAD employers (ASG, Compass/Waveguide) came from the remote segment. **Three files, one lane.**
  🔴 **2026-09-20, and this is the lane's real constraint, now visible because the `requirements` column
  exists: BOTH verified remote CAD seats require AutoCAD** (ASG $70-100k, AutoCAD + Revit;
  Compass/Waveguide $65-75k, AutoCAD, Revit preferred, CTS "preferred or commitment to achieve within 12
  months"). Michael holds Vectorworks and deferred AutoCAD to ~summer 2027. **The deferral is the gate on
  the entire remote half of this lane, and that is a plan, not a rejection.**
  ⭐ **The counter-example is the most valuable row in the file:** Upstaging *Rigging Designer*, $60-90k,
  **Vectorworks + Braceworks, AutoCAD not named**, still live two months after first capture. **Rare +
  technically deep + already-tooled beats broad + certified.** When a row like that appears, flag it hard.

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
  🔴 **Third instance, 2026-09-20, and this one was not even a keyword:** LCTJ was about to be written off
  after a fourth outage. The board was fine. **The source list was wrong AGAIN.** Extend the rule: never
  write off a SOURCE on failure evidence alone either. Prove the URL before you blame the board.
- ⏰ **The cost of not running shows up as expired deadlines, and it should be reported.** The 24-day gap
  before 08-31 cost a $43,750-50,000 in-lane venue-management seat whose deadline passed by ONE day. Name
  those in NOTABLE. A catch-up pass that hides what it missed is selling the routine as more current than it is.
  ⏰ **Again on 09-18, at nine days:** University at Buffalo Scene Shop Supervisor, $57,500-61,500, **75 miles
  from home**, deadline passed by six days. **Proximity does not survive a gap.**
  ✅ **09-20 ran at a two-day interval and lost nothing to a deadline.** That is the argument for the daily
  cadence, stated as evidence rather than as a preference.
- 🔴 **A cross-lane duplicate is one listing in two LANES, which is a defect. A cross-POSTED listing is one
  job on two BOARDS, which is correct and stays as two rows.** Do not conflate them. Two cross-lane
  duplicates were resolved by Michael's rulings on 09-19 (Confluence President & EP, PAC NYC Associate
  Producer — both homed in `producing-artistic` with an ADM pointer). **Precedent: an artistic or producing
  title rowed in ADM homes in PRD.**
- 🔴 **THE REQUIREMENTS COLUMN IS FOR VERBATIM QUOTES ONLY** (17th column, landed 2026-09-20). Quote the
  posting's own words in double quotes, semicolon-separated; never paraphrase a requirement and never infer
  one from a title. An empty `requirements` field means the body was not read or named nothing, and that is
  a truthful state — **an invented requirement corrupts the one column Corso's career planning depends on.**
- ⭐ **Two open home-lane rulings from 09-20, both the same shape — title says one lane, duties read another:**
  Joshua Warner Studios (titled PM, reads TD) and Pepperdine ATPM (rowed AUD, reads ME). **Read the duties**
  is already the rule for the safety boundary; it applies to lane assignment too. Michael's call, not the
  executor's.
