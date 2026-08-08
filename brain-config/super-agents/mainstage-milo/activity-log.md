# Mainstage Milo — Activity Log

_Live project state + rolling session ledger. Newest on top._
_Hot window: the LIVE STATE block + the last ~2 closes. Older entries: `activity-log/2026-Q3.md`._

> 📌 **THIS FILE IS WHERE MY ONGOING PROJECTS LIVE** (Michael's ruling, 2026-07-30). `memory.md` holds patterns, preferences and durable workspace knowledge; **anything with a count, a status, a frontier, a park or an owed answer belongs here.** Read the LIVE STATE block FIRST on any pickup.

---

## ➡️ LIVE STATE — what I'm carrying right now

### 🦺 SAFETY PROGRAM BUILD-OUT — Phase 1 LIVE (4 items), Phases 2–4 documented and CLOSED to discussion

**Roadmap documented 2026-08-06** as a comment on MAWLIB-1038 (`86ajxa1dc`), derived from Reynolds Ch.7. ⚠️ **Michael read PHASE 1 ONLY and said so.** Phases 2–4 are written down at his request but **NOT open.** **Do not re-litigate or re-propose them. Wait for him to open them.**

**PHASE 1, as it stands 2026-08-07:**

1. **The prelim-receipt trigger** — still owed, still unbuilt. Ten gates recorded in the 08-06 entry.
2. **The species sort** — 🔒 **PRECONDITION for everything else** (Q5: clean-as-we-go was struck). Four species in `gen PRODUCTION Hazards`; ~10 mitigation rows to re-parent; duplicate pairs to RECLASSIFY, never merge.
3. **MEWP as the first FileMaker form** (J5). Scaffolding already exists — `{ MEWP Part 1/2/3 }` in `URITP Programs ▸ FORMS ▸ TEMPLATE from submissions`.
4. 🆕 **NEAR-MISS CAPTURE — PROMOTED FROM PHASE 2 on 2026-08-07** (J6). **ANSI E1.46-2016 §4.4.3 requires review "whenever a fall occurs or almost occurs."** It is a condition of a compliant plan, not a maturity milestone. 🔴 **Ships with a stated no-blame policy or it does not ship** — an empty log reads as evidence of safety. Two things now de-risk it: the single-operator year means nobody to blame yet, and Hawthorne's ledger discipline (record what happened, never who) is a no-blame policy already written down. ⚠️ **Where the record LIVES inherits Q8 and is unresolved.**

**Michael's architecture rulings so far:** LIBRARY vs INSTANCE (hazard reusable, control per-show) · **SAFETY STASIS** (reusing a control without re-assessment IS a hazard) · **forms built in FileMaker now, form = deliverable, digital and print are one artifact** · **single-operator year** (he fills every form; crew is not a user) · **public-service posture, private release.**

**Open on the DL:** Q8 (instance runtime) · Q7 (FMP's job — largely superseded by Q8/J5) · scope of the species sort (Q5 A/B/D all live).

### 🎭 Big Love (F26) — scenic package MID-REDESIGN; assessment deliberately homeless

**Prelims received 8/6** (Frank Oliva, rev 4 AUG 2026, 3 plates, FOR BID ONLY / DO NOT BUILD). 1p Zoom with Frank + Charlie Lawlor + Kevaughn Harvey + Mary Reiser. **The package did not survive the meeting.**

- 🔴 **Charlie: the ceiling as drawn is not buildable** — *"too big… immensely outside the realm of possibility… I can't and I won't commit to something that I know I can't accomplish."* Fabric at 40′ × 50′ eats most of the budget; rigging alone consumes the one week before the set must be primarily in place.
- ✅ **Agreed direction: SEAM IT AND MAKE THE SEAMS A DESIGN ELEMENT.** ✅ **WATER IS STRUCK.**
- **Frank redesigning**, floating cutting ALL exterior walls for a bowl/amphitheater and one fabric piece instead of two.
- **Budget $5,500, in-house build, URITP is the bidder.** ⚠️ **Never said out loud in the meeting.** Now reframed by Michael as the **Budget at a Glance** document rather than an email.
- 🔴 **Seat count unresolved: 92 logged vs 108 counted.** Owed from Frank in writing or from the `.vwx`.
- **ADA hardcoded** on ITP-4187: 51–150 band → 4 wheelchair + 4 companion, 5% aisle seats, 36″/33″. 2010 Standards §221/§802.
- ⚠️ **EH&S and the fire marshal: still ZERO contact** across two meetings with audience-on-built-platforming live. **Code lane is MICHAEL's; I supply citation + paper trail. Charlie owns buildability.**
- 🔴 **NO `Risk Assessment (BL)` — and that is now DELIBERATE** (Q6 answered 08-07: nothing structural). Scored precedents go to meetings as talking points; Big Love gets assessed on its own terms. **This expires the day the scenic package locks.**
- ⚠️ **8/7 full design team meeting has happened** (Seth on LX, Padra on sound). **I have not read the outcome — do not assume the riser decision.**

**Element tree, 9 standalone Design Elements in `Show Design (BL)`:** `EXTERIOR WALLS` · `AUDIENCE RISERS` · `ACTING PLATFORM` · `CEILING` · `ENTRANCES + WALKWAYS` · `MASKING + BACKSTAGE` · `REP RISER PARK POSITION` · `EXIT SIGNS + AISLE LIGHTING` · `PSM CAMERA`. All stamped with `Production Note` departments.

### 💵 Budget at a Glance — task enriched 08-06, artifact still not produced

[`| budget at a glance |`](https://app.clickup.com/t/86ah4r5r1) (ITP-3243, `Paperwork (BL)`) is now a full reference surface: master at `/PROGRAM/Guest Artist Documents/BUDGETS-At-a-Glance.Template.F22.doc`, seven precedent PDFs mapped, destination `/PRODUCTIONS/URITP 26-27/1 Big Love/` confirmed. ⚠️ **Filename convention drifted between seasons; 26-27 needs one picked.** Also owed by Michael: **share Rebecca into Dropbox** to unblock costumes (Prelim Costume was due 7/27 and is open while Final Costume + Props List were due 8/10).

### 🗄️ PRODUCTION MAWSTER — the calendar app is being REBUILT (new 2026-08-08, not mine to build)

Michael and **FMP Fiona** spent ~4h on the v1 schema of a fresh FileMaker app that replaces `ProductionCalendarFormat`. **This is MY operational surface** — the 11×17 production calendars and the contact sheets — so I carry the state even though the build is hers.

- 🔴 **The legacy calendar app holds exactly ONE production at a time.** `SETUP` was 20 fields / 1 record / almost entirely GLOBAL storage, with six hardcoded scripts swapping the globals per show. **Every calendar I have ever printed came out of a file that could not hold two shows.**
- **Docs live in the REPO** (`mawizorek/maw-prose` → `apps/production-mawster/`), decisions in *Production MAWster FMP — Decision Log*. Not a ClickUp-canonical build.
- 🔴 **Two doc-page corrections owed on** [URITP Production Calendars FMP](https://app.clickup.com/36074068/docs/12cwjm-52833/12cwjm-61333): it says **11 tables (it is 9)** and claims multi-production support via SETUP records (**false**). I have quoted that page.
- 🔴 **Five live bugs found in the RUNNING file, reported not fixed.** The one that matters operationally: `RGB ( $R ; $G ; $R )` appears in two scripts, so **blue takes red's value and every status colour on every calendar I have printed is wrong.** Also three overlap-flag scripts with no resolution, a shipped debug dialog, `One Acts INFO` carrying TIME's course number, two `<Missing Field>` entries in the import map.
- ⚠️ **Q5 on that DL is a fold-in question in MY domain:** is Production MAWster the same app as [URITP Production Build FMP](https://app.clickup.com/36074068/docs/12cwjm-52833/12cwjm-80793), which was spec'd and LOCKED 08-07 to the same scope and never started? **Two pages, one app.** Michael's ruling owed.
- ⚠️ **Relevant to the calendar-surface sprawl park below** — this is a sixth+ surface unless it absorbs others.

### The URITP list audit (Anna leads; I hold the workspace knowledge)

🌟 **ALL SEVEN SPACES PASS-1 COMPLETE.** **Index: 236 rows**, verified **2026-08-04 2:58 PM ET** against `901327881037`. 🔴 **This block said 154 for five days and I quoted it as fact** — a stamp proves WHEN, not that it is still true. **Re-query before quoting.**

**Remaining non-Confirmed: 12 rows + 1 blank** across five spaces (main hub 4 · CRM 6 · PRODUCTIONS 1 · MAW Documents 1 · DAD LLC 1). **A straggler sweep, not a space-sized gap.**

**Machinery:** standing thread `86ajknmmk` (**reopen, never spawn**) · **List Index `901327881037`** ⚠️ NOT `901327854042` · Roadmap banner has drifted 3× · List Audit DoD `12cwjm-76573` · `/council=uritp-audit`. **`Confirmed` is MICHAEL's word only.**

### 🎯 My standing assignments (owed, not parked)

**1 · The availability-tracking problem** (his, 07-25). Diagnosis settled — recurring weekly availability is well-built; the **time-boxed poll** has no mechanism, so every poll mints a list plus permanent hard-coded date fields. **The PROPOSAL is what's owed.** Corey is the call-in.

**2 · ROLES cluster Q1 — Corey and I owe a RECOMMENDATION** (his, 07-27). **Not a park.** ⚠️ **Now twinned with risk-assessment Q3/Q5** — same dual-expression defect, and one ruling should close both.

**3 · The ARCHIVE verb** (08-04). Three nouns, no verb. 🔴 **Now confirmed in a SECOND domain** (safety, 08-07) — that promotes it from a course-side gap to a general one. Still unowned.

**4 · The prelim-receipt trigger.** Phase 1 item 1. Michael has neither greenlit nor refused the hook across three offers.

**5 · Transcript speaker attribution** (08-06). Method kept, tool unbuilt.

**6 · `Risk Assessment (BL)`** — ✅ **CLOSED 08-07: deliberately not built** (Q6). Reopens when the package locks.

**7 · 🆕 CREW CALLS — a document that does not exist anywhere** (surfaced 08-08 in the Production MAWster schema session, and it is MINE). **A call carries person, role, call time, report LOCATION and who called it. A calendar event drops all but the time.** So it is a library-vs-instance question of exactly the shape I already argued for hazards: third document, or a view of the production calendar? ⚠️ **The FMP build has deliberately left room for it** — `WORKDAYS` is not closed as the only day surface, and `LOCATIONS` now exists so a report location can resolve. **Nothing is blocked on it, which is why it will keep not happening.** Owed: a recommendation, not a build.

### 🅿️ Parked / scheduled — carry, do not force

- **Reynolds Phases 2–4** — documented, explicitly NOT open. **Michael opens them, not me.**
- **CRM projection-fan shape — OPEN.** *"you're seeing growing pains."* Never read a verdict into it.
- **📅 Gen-1 going forward = SCHEDULED:** a session with **Corey + FMP Fiona**. Four queued conversations, no home. ⚠️ **08-08: Michael ran a Corey-and-Fiona-shaped session WITHOUT me in it** (Production MAWster). Neither was formally seated — both were consulted by profile — so this is not the Gen-1 session, but it is evidence the pairing happens whether or not it is scheduled.
- **One Acts format** + **the three umbrella folders' placement** → Pass 2 by decision. ⚠️ **08-08 ruling, narrow but real:** `One Acts F26` is simply the production's NAME — season-in-title is intentional, not drift. Does not settle the grain question.
- **SHOW TEMPLATE Q7 open:** three fields (`Department`, `Phase`, `Venue`) no production uses.
- **Space-4 Q4:** where the stalled-pilot / superseded line falls.
- **Calendar-surface sprawl** (6 surfaces) · **Routines ↔ Season Planning line** · **access control across 5 surfaces / 3 spaces.**
- **`| DEFINITIONS FOR PROGRAMS |`** — `researching` since **Jan 2025.**
- 🔴 **`cancelled` is a DONE-type status on `Course List`.** Blocks any automated archive step. Corey's.
- 🔴 **`memory.md` is ~21KB against a ~10KB hot target.** Past owed, into defect. Condense pass required; nothing culled without Michael.

---

## 2026-08-08 · Production MAWster — consulted, not seated; one owed item earned

Not my session. Fiona drove the v1 schema of the production calendar rebuild ([task](https://app.clickup.com/t/86ajy1neb)) with Michael building the FMP file in parallel. **My profile was read in so the production-convention half could be weighed, and two findings landed in my lane.** Full state in the LIVE STATE block above.

- **What I contributed, via the consult:** the One Acts grain concern (ruled moot — the season is in the name on purpose) and **crew calls**, which became standing assignment 7. The crew-call shape is the same library-vs-instance argument I made for hazards, one domain over.
- 🔴 **The operational headline: every production calendar I have printed came out of a single-production file with a colour bug.** `RGB ( $R ; $G ; $R )` in two scripts means blue renders with red's value. Nobody noticed because nobody had a reason to check a colour against a spec that was never written down — the calendars have no legend.
- ⚠️ **Two doc-page facts I have quoted are wrong** (11 tables, multi-production support). Corrections owed on *URITP Production Calendars FMP*.
- ⚠️ **A locked spec in my domain named a blocker that was already cleared:** Production Build FMP step 0 says Corey owes `calls` and `R` on the Contact Sheet list; Michael's correction was flat — they exist. **A locked page recorded work as OWED and nobody was watching whether it had been done.**

**State left:** nothing built, nothing changed on my surfaces. Crew calls is a recommendation I owe.

---

## 2026-08-06 → 08-07 · Reynolds Ch.7 → a safety architecture, four rulings, and a voice I forgot to seat

One continuous session, `86ajxa1dc` (MAWLIB-1038). Started as "find me more on Chapter 7," became the safety program architecture.

### 🌟 The research method, and it generalizes

**A paywalled academic book leaks its structure through the publisher's free preview PDF — specifically the LIST OF FIGURES.** Captions carry page numbers, so a figure list is a page-by-page skeleton, and the captions name the sources being adapted. Got Ch.7's whole spine with no body text. **Chapter TOCs give titles; figure lists give the argument.** Reusable on any Routledge/T&F title (`api.pageplace.de/preview/...`). Second half: **a "borrowing" chapter's citations ARE the free-shopping list.** Confirmed free: ANSI E1.46 · Gawande's Checklist for Checklists · NIOSH PtD · OSHA Recommended Practices · Routledge's full Ch.5 sampler.

### 🔴 Four corrections I earned, in order

**1 · I recommended building a tool URITP built in Oct 2024.** Checked for a PROCEDURE (absent), concluded the TOOL was absent. **`URITP ▸ Risk Assessments` already holds the matrix and it exceeds the book** — the post-control re-score set is what Reynolds argues hardest for. **"No process for X" does not license "no X."**

**2 · I described the library off its schema and had never read the rows.** His catch: *"Have you even read all the hazards?"* Reading all 85 found four species in one list, ~42 unscored rows, four duplicate pairs, an uncomputed rating, and the `Waning signage` typo that IS the whole control on four rows. **A schema says what CAN be stored; only rows say what IS.**

**3 · I called the duplicate rows sloppiness. They were competence.** A multi-home is the SAME OBJECT — editing `Controls` for a new show retroactively rewrites the closed show's record. **Cloning was the only move that preserved audit integrity.** ⚠️ **A dedupe pass would have destroyed history. Reclassify, never cull.**

**4 · I fed Michael his own point back as analysis.** *"You are repeating exactly what I just agreed to… We are talking through the plan together."* Produced `team-standard.md` v1.8's **DO NOT RESTATE** rule.

### 🔴 And the one he shouldn't have had to catch

**Hazard Hawthorne was never seated.** Twelve hours on hazard libraries, risk matrices, ANSI E1.46, NIOSH PtD and a near-miss log, and the safety head — **built 08-01 out of a gate that named his own absence** — was not refused, just **not thought of.** Michael: *"That is your job to catch, not mine!"*

**Within minutes of being seated he re-sequenced the roadmap:** §4.4.3 requires review *"whenever a fall occurs or almost occurs,"* which makes near-miss capture a **requirement**, not the Phase 2 improvement we'd scheduled. He also flagged that the 100 psf figure had been repeated all session with **no cited edition**. 🔴 **A craft head is easiest to omit exactly when the generalists are doing well.**

### 🔨 Shipped this session

- **`team-standard.md` v1.7 → v1.9:** Spoken Voice (converse as if speaking) → DO NOT RESTATE + No-Restate hook → **Seating Is The Fleet's Job** + Empty-Chair hook + the dictation clause (*"Nick Greene" in a seating context = Hawthorne; the real Nick Greene is never culled*).
- **Mira: HARD RULE 6** — she ENFORCES spoken voice on seated voices rather than restating it. *A lens with nothing new says so in one line.*
- **Hawthorne: Ledgers A, B, C-standards and E opened.** First cited standard (ANSI E1.46-2016, clause-level). **Incident memory still genuinely empty and labelled so.**
- **Decision Log J1–J6 + Q2–Q8** on `Risk Assessment CU Notes`.
- **Budget at a Glance** (ITP-3243) built into a reference surface, Dropbox paths mapped.
- **Corey + Fiona seated and logged.** Fiona's correlation ledger got its **first entry since she was built** (ClickUp multi-home ↔ FMP join table; breaks at the archive boundary and when the relationship must carry a value).

### ⚠️ Process, named not hidden

- ✅ Spine posted before every reply after the 08-06 afternoon gap.
- ⚠️ **Two self-inflicted doc errors:** careless `str_replace` bounds clobbered the J4 and Q4 headings on the DL. Both repaired in-pass. **Feed ordering on that log is now scrambled (J5/J6 sit mid-feed) — named, not silently left.**
- ⚠️ **New tooling defect:** `search_workspace` silently scopes to the focused task when a request-scope is set. Use `query_tasks` for anything workspace-wide.
- Direct commits to `main` on append-only files rather than branch→PR.

---

## 2026-08-06 · Big Love prelim scenic review — the procedure that should have existed

Session `86ajx3kzj`. Invoked `/milo` on `[ prelim Scenic Design ]` (ITP-4187) at 12:33, ~25 min before the 1p design Zoom.

🔴 **THERE IS NO PRELIM-REVIEW PROCEDURE ANYWHERE.** Swept the Operations Manual SOP tree, `Paperwork (BL)`, `Show Design (BL)` and `(P0)`, and my own bundle. **The only one that exists is the comment Michael wrote himself at 11:16 that morning, ninety minutes before the meeting.** ⚠️ **AMENDED 08-07: the PROCEDURE is missing; the risk-assessment APPARATUS is not.**

**The ten gates, recorded so they are not re-derived** (they belong in `hooks/`): 1 provenance · 2 completeness-for-costing · 3 occupancy + load · 4 egress + fire · 5 electrical · 6 trip/slip/marking · 7 overhead · 8 accessibility · 9 operations · 10 money + schedule. **Every gate closes as open / resolved / N-A with a NAME, or it does not close.**

**Safety content that generalizes:** audience on built platforming is **occupancy at 100 psf**, not scenery at 50 *(⚠️ uncited — Hawthorne flagged this 08-07)* · **uniform riser heights** is the number-one fall control · exit-sign visibility is what a portal and a ceiling break · aisle lighting and exit signs need standby power · **overhead load over an AUDIENCE is a different risk class** (secondary safeties, no single-point failure, no flying moves over the house) · nosings, gaps, glow tape at vom mouths · NFPA 701 on every soft good · **in a four-sided house the audience is within arm's reach**, so combat, intimacy, haze and thrown objects get re-evaluated for PROXIMITY.

🌟 **The design element tree convention** — I flagged the bracketed `[ SCENIC DESIGN ]` tasks as drift; his answer was *"it's deliberate drift. those [ ] tasks are representative global stand-ins."* Moved to `memory.md`. **And the field he wanted already existed** — `Production Note`, whose NAME says "Note" and whose JOB is "Dept."

🔴 **Two corrections:** four hours of advisory work with **nothing written to the repo until he asked** (*"are you updating your activity or your memory at all?"*) · and I reported a `load_assets` tooling artifact as a workspace state.

**Built:** 6 Design Element tasks · full inline notes on Michael's three · the hardcoded ADA comment on ITP-4187 · an attributed 5-speaker transcript over 9 raw comments · a one-page printable meeting sheet before 1p · *Big Love* script research (the repeated body-to-floor action lands on the deck spec, not rehearsal PPE — Kevaughn independently offered knee pads, so the flag landed).

---

## 2026-08-04 · The course binder — ClickUp canon moves to the repo

Session `86ajw170r`. Seated first, handed to Tutor Tate, then Mira convened Fiona + Corey + me; Dexter took the build questions.

- 🌟 **The three-system treaty, and it is my transient-state thesis, eighth instance.** Repo = permanently TRUE · ClickUp = true NOW · FileMaker = what WAS true. **Every field has exactly one owning system.** Join key is `slug`, digit-free. Filed as **J3 on the `Course List` Decision Log.**
- **Shipped:** `02-courses/` = 43 course pages + canonical `course-index.tsv` + 6 requirement pages. uritp-doc-archive PRs #17–#36 · doc-render-engine #53, #56 · template-docs #23.
- ⚠️ **NOTHING HAS BEEN RENDERED.** Unverified until Michael publishes.
- **The ARCHIVE verb** entered my owed list here.

---

## 2026-08-04 · INBOX intake: Scenic Design + PM meeting time (Frank Oliva) — COMPLETE ✅

URITP-12713 merged → ITP-4187 (`Show Design (BL)`). Relationships wired: blocks → ITP-2040 · linked → URITP-4474 · linked → CRM-234. Frank's availability logged (Thu after 11:30a preferred, Fri 10a).

🌟 **Key correction:** I routed to template tasks (`Show Design (P0)`) instead of the production instance. **Template ≠ production. The LIST NAME is the disambiguation.** ⚠️ `SCENIC Draftings` (ITP-4158) still has show-specific language in a template list — **still flagged.**

---

_(2026-08-03 Faculty Council intake, 2026-07-30 memory reshaping, and the Space 3 / CRM / Spaces 4–5 close entries rotated to `activity-log/2026-Q3.md`. The 07-30 lesson that still binds: **memory = patterns; project state = here** — and on 08-04 I broke it from the other direction by quoting a stale count. **The file is not the fix; re-querying is.**)_
