# Job Market Sources — the REMOTE segment

> **Third sibling in the sources family, split by CONCERN on 2026-09-19.** `job-market-sources.md` holds the
> THEATRE and VENUE boards. `job-market-sources-experiential.md` holds the brand-experience / exhibit /
> trade-show market. **This file holds REMOTE-FIRST routes**, which are a different animal again: the boards
> here are organised around *work arrangement* rather than around an industry.
>
> 🚫 **One claimant per fact.** Board codes, the five source states, the Department-Index Law, the
> URL-recovery procedure and the mirror rule all live in the parent file and are NOT repeated here.
> The experiential specialist boards (IAEE, EIJ, TSJB, SEGD, EDPA, Cad Crowd) are claimed by the
> experiential sibling and are NOT repeated here either — **several of them are remote-friendly, so if you are
> sweeping for remote drafting work you must read BOTH files.**
>
> 🔴 **DO NOT MERGE THIS BACK INTO THE PARENT.** That file is already 28,753 B. This repo retired
> `job-market-state.tsv` at 25,403 B specifically because *"a truncated read followed by a full-file write
> silently destroys rows."* Splitting is the fix that worked.

**Discharges `job-market-roles.json` → `global.remote_sweep.owed`**, open since 2026-09-10, and gap (3) of the
2026-09-18 pass stamp. All sources below were opened and verified live on **2026-09-19**.

⚠️ **Lane seam, named rather than hidden:** finding NEW sources is research and belongs to **Scout Sage** per
the lane seam in `hooks/data-refresh.md`, not to a refresh pass. This file was produced by a dedicated
research pass on Michael's explicit instruction. Recorded as a crossing so the seam does not quietly erode.

---

## 🔴 THE HONEST HEADLINE, BEFORE ANY BOARD LIST

**The remote gap is ASYMMETRIC, and reporting it as one gap would be wrong.**

- ✅ **`creative-admin` remote is GENUINELY CLOSABLE.** Remote development, grants, donor communications and
  nonprofit marketing are a real, live, reusable market with multiple dedicated boards. This half was never
  thin — it was **entirely unswept**, with zero documented sources.
- ⚠️ **Remote AV / CAD / technical design is REAL BUT SCARCE**, and concentrated in AV *documentation* work,
  media and broadcast, and gaming or product design — **not physical venue production.** A pass that finds
  two or three remote technical rows here is reporting the market correctly.
- 🚫 **The physical lanes stay physical.** `electrician`, `audio-sound` and `stage-manager` remote work does
  not meaningfully exist. Config already says so. **Do not spend sweep budget here and do not report its
  absence as a finding.**

⚠️ **"REMOTE" RARELY MEANS LOCATION-FREE, AND THIS IS THE TRAP IN THIS SEGMENT.** Verified live postings
attach: a required state or region, occasional travel, in-person rehearsals and events, or a named office-day
minimum. One "mostly remote" arts-admin role requires attendance at *"rehearsals, performances, and VLOC
events in the Rockville, MD area."* **Capture the qualifier in the row's `location` field.** A `remote` tag on
a row that actually requires Maryland attendance is a false positive in the tier that exists to be trusted.

🚨 **And mirrors substantially inflate the apparent remote count** — more here than anywhere else, because
remote-job SEO sites are an industry. See the mirror section below before believing a count.

---

## ✅ VERIFIED USABLE — opened and confirmed carrying relevant roles, 2026-09-19

### For `creative-admin` — the productive half

- [**Arts Admin Jobs**](https://artsadminjobs.com/) `AAJ` — ⭐ **THE STRONGEST ARTS-SPECIFIC REMOTE ROUTE FOUND.**
  Free to browse and apply; employers pay only for resume access. Arts and culture administration,
  communications, development, grantmaking.
  **Evidence today:** *Communications and Social Media Specialist*, Miami Music Project / Teaching Artists
  Training Institute, **US remote**, freelance, **$24,000/yr**, closes **Sep 25 2026** · *Grantmaking
  Associate*, Chorus America, **remote US**, **$30/hr**, ~20-25 hrs/wk.
  ⚠️ **No verified remote-only filter URL** — the homepage listing widget did not initialise on fetch. Sweep
  via site search and direct listing pages; **do not trust the homepage count.**
  📌 Already the source of the ADM lane's Atlas Performing Arts Center row, so the code `AAJ` is in use.

- [**Philanthropy News Digest / Candid**](https://jobs.philanthropy.com/jobs/fundraising/working-from-home/)
  `PND` — fundraising-specific, and the **only board in this segment whose remote filter provably applied.**
  The URL *is* the board's `Working from home` location filter; it rendered **"Found 17 jobs"** with the
  filter shown as a removable selection. Free to browse; sign-in only to save.
  **Evidence today:** *Associate Director, Donor Communications*, ClimateWorks Foundation, remote US,
  **$120,000-140,000** · *Director, Philanthropic Giving – Northeast*, US Olympic & Paralympic Committee,
  remote Northeast, **$155,000-160,000** · *Chief Development Officer*, Child Care Aware of America, 100%
  remote, band opening at **$210,000**.
  ⚠️ General nonprofit, not arts-only. High yield for development and grants; filter for arts yourself.

- [**Idealist**](https://www.idealist.org/en/remote-jobs) `ID` — high-volume nonprofit and social-impact.
  Free. Already the source of the ADM lane's Epic Theatre row, so the code `ID` is in use.
  **Evidence today:** *Director of Growth (Development, Marketing & Communications)*, **$135,000-185,000** ·
  *Grant Writer*, **$25/hr** · *Program Manager*, Armed Services Arts Partnership, **$70,000-80,000**.
  ⚠️ **Use the dedicated `/remote-jobs` page, NOT a hand-built keyword URL** — a
  `q=fundraising&locationType=REMOTE` fetch returned no rendered rows. Classic silent-filter territory.

- [**Remote Impact**](https://remoteimpact.org/remote-fundraising-jobs/) `RI` — remote development and
  fundraising aggregator. Displayed **199 open positions**.
  **Evidence today:** *Senior Development Officer*, Center for Science in the Public Interest, remote US,
  **$111,000-145,000** · *Fundraising & Communications Manager*, 10,000 Friends of Pennsylvania, **$65,000** ·
  *Senior Fundraising Manager (fully remote)*, New Left Accelerator, **$92,976-108,493**.
  ⚠️ **It is an AGGREGATOR** — 199 is the page's own displayed count, independently unaudited, and every row
  needs its employer posting recovered before it becomes a row. Also sector-wide: climate, health, advocacy.
  **Never infer an arts connection from a generic impact listing.**

- [**AFP Career Center**](https://careers.afpglobal.org/) `AFP` — the professional fundraising association's
  board. Exposes an **`Arts / Culture / Humanities` category** plus `Remote jobs`, `Grants` and `Foundation`
  as trending filters. Listings readable without an account.
  **Evidence today:** *Development Director — Fully Remote*, American Society of Health-System Pharmacists,
  **$110,000-137,500**, eligible in a named state set **including NY**.
  ⚠️ No stable remote-only search URL verified; individual listing pages are the reliable route.

- [**Victorian Lyric Opera Company**](https://www.vloc.org/marketing-manager.html) `VLOC` — not a board, a
  **direct arts employer**, listed because it is proof that remote arts-admin work exists at small companies
  that post nowhere else. Same lesson as near-home overhire: **go to the employer.**
  **Evidence today:** *Marketing & Development Manager*, **$26/hr**, "mostly remote", apply by email, due
  **Sep 25 2026** — but requires in-person attendance in **Rockville, MD**. Apply the location qualifier.

### For `drafting-design` and AV technical work — the scarce half

- [**Advanced Systems Group (ASG)**](https://jobs.ashbyhq.com/advanced-systems-group/) `ASG` — ⭐ **THE BEST
  REMOTE TECHNICAL FIND OF THIS RESEARCH.** Employer's own Ashby ATS, free, no registration friction.
  **Evidence today:** *CAD/Revit Mechanical Designer*, **$70,000-100,000/yr, fully remote, US**, covering
  media, broadcast and film AV and systems-integration projects.
  📌 Sweep the **ATS**, not [the general careers page](https://www.asgllc.com/careers/) — the careers page
  mixes remote, embedded and talent-network entries and will not tell you a role's arrangement reliably.

- [**Compass Group / Waveguide**](https://careers.compass-usa.com/) `CGW` — national AV consultancy, direct
  employer route, applications ongoing.
  **Evidence today:** *Associate AV Designer — Remote*, **$65,000-75,000 + 5% bonus**, page states **90+%
  remote anticipated** and **<10% travel**. Duties are AV drawings, models, schedules, device plans and rack
  elevations — i.e. genuine drafting output.

- [**We Work Remotely**](https://weworkremotely.com/remote-jobs) `WWR` — remote by premise, free.
  🔴 **READ THE BOUNDARY:** its verified entertainment yield is **digital and gaming product design, NOT
  physical live-event production.** Evidence today: *iGaming UI/UX Designer*, worldwide remote,
  **$50,000-74,999**, wanting 7+ years UI/UX and Figma. **Do not treat WWR as a source for venue or
  live-event technical work.** It earns its place for the adjacent digital-design market only.

- [**Remote.co**](https://remote.co/remote-jobs) `RCO` — media, film, video and broadcast production.
  ⚠️ **Its verified yield was HYBRID, not remote**, which is the honest result: *Senior Field Producer*,
  Versant Media / CNBC, **$130,000-170,000**, minimum three office days per week. Useful for hybrid
  discovery. ⚠️ Some listings sit behind a "Join Remote.co to Unlock & Apply" gate.

---

## ⚠️ LIVE BUT THIN OR UNVERIFIED — reachable, yield NOT confirmed

**These are ⚪ or unverified, NOT ❌, and the distinction is the whole point of the five source states.**

- [**NYFA Arts + Culture Jobs**](https://www.nyfa.org/jobs/) — live, clearly an arts board, but the fetch
  returned only the page shell with no listing rows. **Already the source of a standing PM row (`NYFA`), so
  it works — today's remote yield is simply unverified.**
- [**California Arts Council**](https://arts.ca.gov/jobs/) — live, and **visibly exposes a `Remote positions
  only` control** plus arts categories including Grants. Listing rows did not initialise on fetch. Worth a
  real browse; the remote control alone makes it promising.
- [**Work for Good**](https://workforgood.org/) — live, nonprofit-focused. Examples found were mostly
  in-person or hybrid, including at arts employers. **Remote arts yield thin.**
- **Indeed remote searches** — [fundraising](https://www.indeed.com/q-fundraising-l-remote-jobs.html) and
  [arts nonprofit](https://www.indeed.com/q-arts-nonprofit-l-remote-jobs.html) return remote-tagged results,
  but composition is broad and dynamic. **Discovery route only; recover the employer posting for every hit.**

---

## 🚨 MIRRORS — pointers only, and this segment is thick with them

The parent file's mirror rule applies with force here. **An ATS job id absent from the employer's live feed is
CLOSED, however current the mirror looks.**

- **CareerBuilder** carried a *Live Events Technical Production Drafting-CAD* repost (freelance remote,
  **$35-75/hr**, AutoCAD and Vectorworks, live-event floor plans). Attractive, and **no live employer
  source-of-record was confirmed.** This is the same Jack Morton role whose Greenhouse id was already proven
  absent from the live feed on 09-18. **It is a pointer and it is almost certainly closed.**
- **Remotive** mirrors the ASG CAD/Revit role. **Use ASG's Ashby listing as source of record and deduplicate.**
- **MySmartPros · Willow · Jobsy · Jobgether · Sorce** and similar SEO remote-job sites were observed
  recycling Jack Morton, Luna Lux, ASG and nonprofit postings. Leads, never rows.

### ❌ Confirmed DEAD on 2026-09-19 — recorded so nobody re-chases them

- **Luna Lux, Associate AV Designer** (SmartRecruiters) — page renders **"Sorry, this job has expired."**
  Worth noting anyway: it carried excellent AV / Vectorworks / AutoCAD requirement language at
  **$60,000-80,000**, which is market evidence even though the seat is gone.
- **Twitch, Creator Outreach Associate** (WWR) — deadline **Aug 28 2026**, passed. Kept only as proof that
  WWR does carry entertainment-adjacent remote contract work.
- **Imagination, Senior Production Manager** — deadline **Sep 14 2026**, passed; body also clarifies hybrid
  with London office days.

---

## 📌 REQUIREMENT LANGUAGE, VERBATIM — for the credential roadmap

⭐ **Why this section exists and why it is here rather than in a row:** the state-file schema has **no column
for required credentials or software**, so requirement evidence has nowhere to live in the inventory. But
`portfolio-paige`'s credential roadmap needs exactly this — *what employers literally ask for* — to justify
which certifications are worth chasing. Quote verbatim, attribute to the posting, never paraphrase a
requirement into a claim.

**AV and CAD:**
- Compass / Waveguide, *Associate AV Designer*: *"Experience with both AutoCAD and Revit design software
  preferred (not required)"* and *"AVIXA Certified Technology Specialist (CTS) certification preferred (or
  commitment to achieve certification within 12 months)."*
- ASG, *CAD/Revit Mechanical Designer*: *"Minimum of 3 years producing mechanical CAD drawings for AV,
  low-voltage, or systems integration projects"* · *"Mastery of AutoCAD and Revit"* · *"Working knowledge of
  AV systems, signal flow, and structured cabling infrastructure."*

🔑 **Read those two against the AutoCAD ruling.** Both name AutoCAD, and ASG demands *mastery* of it plus
Revit, which Michael holds neither of. **The remote AV-CAD door is gated on the exact platform he deferred to
~summer 2027.** That is not a reason to stop rowing them; it is the reason the deferral has a cost, and the
cost should be visible rather than implied. Note also that **CTS is a "preferred, or commit within 12
months"** ask — a genuinely low barrier compared with ETCP.

**Arts admin — the tooling is software, not certification:**
- VLOC: *"Use MailChimp (email campaign tool) to segment email lists, create tailored campaigns, and maintain
  an up-to-date email communication schedule."*
- Chorus America, *Grantmaking Associate*: *"Demonstrated experience with SurveyMonkey Apply or similar
  grants management software"* and *"Demonstrated experience with project management software (Monday.com,
  Asana, etc.)."*
- Miami Music Project / TATI: *"Experience with digital communications and content creation tools, including
  Canva, WordPress, Constant Contact or similar email marketing platforms, and social media management
  tools"* · *"Proficiency with Google Workspace and digital collaboration platforms."*
- AFP / ASHP, *Development Director*: *"Demonstrated ability to close six-figure plus major gifts"* ·
  *"Experience working within a donor database."*

⭐ **The pattern worth carrying to the credential roadmap: the arts-admin remote market gates on TOOL
FLUENCY and a track record, not on certifications.** No ETCP-equivalent exists on that side. The named tools
recur — MailChimp, Canva, WordPress, Constant Contact, Monday.com, Asana, Google Workspace, a donor database,
grants-management software — and every one of them is learnable in days, not semesters. **That makes this
lane's barrier a portfolio-and-evidence problem, which is a very different build from the ETCP stack.**

---

## 🧊 Cold-agent intelligence

### Which lanes to point this file at

| Lane | Use this file? | Why |
|---|---|---|
| `creative-admin` | ✅ **primary** | This is the half that was entirely unswept. Start here. |
| `drafting-design` | ✅ yes, plus the experiential sibling | ASG and Compass/Waveguide are genuine remote CAD. |
| `production-manager` | ⚠️ opportunistically | Remote.co and broadcast routes; mostly hybrid. |
| `producing-artistic` | ⚠️ narrow | Literary and programming work travels; producing generally does not. |
| `operations-safety` | 🚫 no | Venue-bound. One remote safety-consulting probe on 09-18 returned nothing. |
| `electrician` · `audio-sound` · `stage-manager` | 🚫 **no** | The work is in the room. Do not sweep. |

### Calibration

**Expect 3-8 qualifying remote rows per pass across ALL lanes combined**, weighted heavily to
`creative-admin`. The 09-18 pass produced 7 remote and 6 hybrid against a 338-row inventory — roughly 4%.
**That is the shape of this market, not a failure of the sweep.** If a pass suddenly returns thirty remote
rows, suspect a mirror or an unfiltered result set before believing the market moved.

### The standing rule this segment keeps proving

⭐ **A lane returning nothing is a statement about our SOURCES, never about the world** — now four-for-four
(Department-Index Law · the Safety Sweep · the experiential segment · this one). `include_remote` was `true`
for months while the measured remote count sat at exactly zero. **The flag was never the problem.**

⚠️ **But the converse is now also proven, and it is the harder discipline:** having swept properly, the
answer for the physical lanes really is *"this work is not remote."* **A source gap and a genuine market
absence look identical until you sweep. Once you have swept, say which one you found.**
