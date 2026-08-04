# Portfolio Paige — Memory

> NAVIGATION MAP + CONVERSATIONAL MEMORY ONLY (§4a). No raw data, no counts, no statuses.
> Other agents needing Michael's professional background load THIS FILE for navigation
> guidance: where to look, how Michael frames it, what workflow assembles the answer.
> The raw data lives at its source.

---

## Ledger A: Source Map (where portfolio data lives)

| Data type | Where it lives (SOT) | How to traverse | Last verified |
|-----------|---------------------|-----------------|---------------|
| Show credits (83) | Production History list in Networking & Apps space | Query tasks including closed; fields: position, venue, dates | 2026-08-02 |
| Employment history (9 positions) | Employment History list in Networking & Apps space | Query all statuses | 2026-08-02 |
| Professional development (10 items) | Professional Development list in Networking & Apps space | Mostly aspirational targets from job postings; verify earned vs. goal | 2026-08-02 |
| Portfolio / narrative | Portfolio list in Networking & Apps space | 3 tasks: CV, LinkedIn, website | 2026-08-02 |
| Job search funnel | Applications list in Networking & Apps space | Corso's lane, not Paige's | 2026-08-02 |
| Resume PDFs (5 versions) | Attachments on Portfolio Paige agent task (86ajurr21) | Load attachments; .docx files don't render text | 2026-08-02 |
| URITP current productions | URITP PRODUCTIONS space (one folder per show) | Show folders: Big Love, Thought/Crime, KALI, The Secretary, T.I.M.E. | 2026-08-02 |
| Dropbox production archives | ur dropbox (kham): show folders + productions/ | Metamorphoses, The Crucible, Orlando, One Acts, NPGC, The Memo, etc. | 2026-08-02 |
| CRM (operational, URITP-scoped) | CRM space: Show Roles (51 records), Companies, Venues, Adults/Students | Junction table: Person x Role x Production | 2026-08-02 |
| Teaching (reference syllabi only) | URITP Courses space | Michael only teaches at Rochester; other syllabi are reference examples | 2026-08-02 |
| Networking & Apps space (home base) | app.clickup.com/36074068/v/s/90131716605 | Private space; all personal career data lives here | 2026-08-02 |
| Org chart + team composition | Milo's memory.md (confirmed 2026-08-04) | 4 direct reports, 2 peers, 1 superior. See Ledger B for framing. | 2026-08-04 |
| Budget (production spend) | Milo's memory.md (confirmed 2026-08-04) | ~$50K/production × 4–5 shows = $200–250K/yr | 2026-08-04 |

---

## Ledger B: Conversational Memory (how Michael talks about his work)

| Context | What Michael emphasizes | What framing resonates | What he downplays |
|---------|------------------------|----------------------|-------------------|
| Professional identity | Blend of two frames: "production leader who came up through every department" + "technical specialist who scaled into leadership" | Full-stack + engineering-first angles together | The "theatre maker who moved into management" (artist-administrator) angle |
| Career arc | Three phases: Performer (2013-2019) → Engineer/Designer (2020-2022) → Production Leadership (2023-present) | The progression and breadth | Early performance credits (treats as backstory, not current identity) |
| Teaching | Only taught at Rochester (UR/ITP). Courses: lighting design/technology (2 per semester) | Scale of production management + team coordination | Does NOT lead with artistic design decisions |
| Credentials | OSHA 30 target (not yet earned); VWX Spotlight cert identified. Most Professional Development items are aspirational targets pulled from job postings, not earned certs | What he's aiming for alongside what he has | N/A |
| Correction (hard rule) | Never attribute Fredonia or Alabama teaching to him | Those syllabi in workspace are reference examples from other schools, not his courses | N/A |
| Data philosophy | "ClickUp holds NOW. FileMaker holds OVER TIME." Career archive = over-time data. | Structured, queryable lists in ClickUp as interim; FMP eventual | Prose in markdown (DL Q1: rejected git bundle AND task descriptions for data) |
| Role scope (confirmed 2026-08-04) | Full back-of-house institutional operation: 7 management domains, 10 craft disciplines, $200–250K/yr production spend, 4 direct reports + 25–40 student crew | **"Director of Production" framing over "Production Manager"** — title undersells scope. Real scope ≈ DoP / Assoc. Managing Director (Production) | The academic side of the dual-track (leads with production leadership, not teaching) |
| CAD proficiency (confirmed 2026-08-04) | Professional Vectorworks drafter: external contract work + U of R productions. Verifiable deliverables (plots exist). Clean doc trees = systems-thinking evidence | "Proficient in Vectorworks; drafted lighting plots for [X] productions and as external contract drafter." | Doesn't lead with drafting; positions it as one tool in the PM toolkit |
| Team structure (confirmed 2026-08-04) | 4 direct reports: Charlie (TD), Mary (Props), Casey (Company Mgr), Katie (Costumes). 2 peers: Sara (Acting Coach), Chris (Facility). Nigel (AD) above. ~9 staff total + 19-person production leadership team | Span of control + production disciplines under it (10) | Does not claim all ~9 staff as direct reports when some are peers |
| Certifications to pursue (confirmed 2026-08-04) | Two targets: **Vectorworks Spotlight Professional Certification** (entertainment-specific, on-demand, EDU40 code = 40% off for edu) + **OSHA 30-Hour General Industry** (supervisor-level, DOL wallet card). Both are keyword-scannable resume lines | Credential lines that scan as keywords for HR screening. The VWX cert turns "look at my plots" into a resume line | Not interested in inflating aspirational certs as earned |

---

## Ledger C: Integration Patterns (earned workflows)

| Pattern | Source | Workflow |
|---------|--------|----------|
| Home base for all personal career data | DL Q1 + onboarding session | Networking & Apps space. NOT CRM (that's URITP ops). NOT git (that's prose/procedure). |
| Resume reading | Onboarding session | 4 PDFs readable from task attachments on 86ajurr21. 2 .docx files won't render. The May 2026 + Mar 2026 versions are the most current. Don't chase the .docx gap (Michael said move on). |
| Show credits are already populated | Correction mid-session | Don't propose populating lists; check existing content (including closed tasks) FIRST. 83 credits already exist. |
| CRM vs personal career space | Mid-session correction | CRM = URITP operational (Show Roles tracks current assignments). Personal professional history = Networking & Apps space. Different audiences, different scopes. |
| Research before interrogation | Phase 0 correction (patched into new-agent-onboard hook) | Always parse existing workspace content before asking Michael questions. "Do your homework first." |
| Gap-closure via bench (2026-08-04) | Job Market Research task thread | Milo + Paige + the full bench closed 4 gaps in one session: budget, direct reports, CAD, OSHA. The bench (especially Milo) guessed correctly from workspace context; Michael confirmed with minimal correction. |

---

## Lane Relationships

- **Corso** loads Ledgers A + B + C for navigation + framing context when assessing market fit. He is a consumer, not a dependency.
- **Milo** holds URITP production ops context. Paige discovers show credits through his operational surface. **Also now holds the confirmed org chart + budget data** (his memory.md, deposited 2026-08-04).
- **Tate** holds classroom memory. Same show event, different lens. Paige's map may point AT his context for the "learning" dimension.
- **Corey** collaborates on pointer/naming standardization as the map grows.
- **Fiona** is the integration layer IF portfolio data touches FileMaker.
- **Application tasks** pull from Paige for navigation guidance (which sources to tap, how Michael frames things).
