# Mainstage Milo — Activity Log

_Live project state + rolling session ledger. Newest on top._
_Hot window: the LIVE STATE block + the last ~2 closes. Older entries: `activity-log/2026-Q3.md`._

> 📌 **THIS FILE IS WHERE MY ONGOING PROJECTS LIVE** (Michael's ruling, 2026-07-30). `memory.md` holds patterns, preferences and durable workspace knowledge; **anything with a count, a status, a frontier, a park or an owed answer belongs here.** Read the LIVE STATE block FIRST on any pickup.

> 🔄 **ROTATED 2026-08-11 ~10:25 AM ET, forced not scheduled.** The Big Love seating backfill grew this file to **33,565 B (measured)** — over the ~30KB write cap the operating standard LOCKS, and past the ~22KB read-whole ceiling. **I had made my own ledger unreadable.** Four entries moved WHOLE to `activity-log/2026-Q3.md`. Nothing condensed, nothing dropped.
> 🔴 **AND THE ROOT CAUSE IS NOT THE ENTRIES — IT IS THIS LIVE STATE BLOCK.** A permanent fixture OUTSIDE the sliding window by design, now the largest thing in the file, and **rotation cannot touch it.** ⭐ **A sliding window cannot control a file whose growth happens in the part that does not slide.** Needs a ruling from Michael, not another sweep.

---

## ➡️ LIVE STATE — what I'm carrying right now

### 🦺 SAFETY PROGRAM BUILD-OUT — Phase 1 LIVE (4 items), Phases 2–4 documented and CLOSED to discussion

**Roadmap documented 2026-08-06** as a comment on MAWLIB-1038 (`86ajxa1dc`), derived from Reynolds Ch.7. ⚠️ **Michael read PHASE 1 ONLY and said so.** Phases 2–4 are written down at his request but **NOT open.** **Do not re-litigate or re-propose them. Wait for him to open them.**

**PHASE 1, as it stands 2026-08-07:**

1. **The prelim-receipt trigger** — still owed, still unbuilt. Ten gates recorded in the rotated 08-06 entry (`activity-log/2026-Q3.md`).
2. **The species sort** — 🔒 **PRECONDITION for everything else** (Q5: clean-as-we-go was struck). Four species in `gen PRODUCTION Hazards`; ~10 mitigation rows to re-parent; duplicate pairs to RECLASSIFY, never merge.
3. **MEWP as the first FileMaker form** (J5). Scaffolding already exists — `{ MEWP Part 1/2/3 }` in `URITP Programs ▸ FORMS ▸ TEMPLATE from submissions`.
4. **NEAR-MISS CAPTURE — PROMOTED FROM PHASE 2 on 2026-08-07** (J6). **ANSI E1.46-2016 §4.4.3 requires review "whenever a fall occurs or almost occurs."** A condition of a compliant plan, not a maturity milestone. 🔴 **Ships with a stated no-blame policy or it does not ship** — an empty log reads as evidence of safety. De-risked by the single-operator year (nobody to blame yet) and by Hawthorne's ledger discipline (record what happened, never who). ⚠️ **Where the record LIVES inherits Q8, unresolved.**

**Michael's architecture rulings so far:** LIBRARY vs INSTANCE (hazard reusable, control per-show) · **SAFETY STASIS** (reusing a control without re-assessment IS a hazard) · **forms built in FileMaker now, form = deliverable, digital and print are one artifact** · **single-operator year** (he fills every form; crew is not a user) · **public-service posture, private release.**

**Open on the DL:** Q8 (instance runtime) · Q7 (FMP's job — largely superseded by Q8/J5) · scope of the species sort (Q5 A/B/D all live).

### 🎭 Big Love (F26) — scenic package MID-REDESIGN; assessment deliberately homeless

**Prelims received 8/6** (Frank Oliva, rev 4 AUG 2026, 3 plates, FOR BID ONLY / DO NOT BUILD). 1p Zoom with Frank + Charlie Lawlor + Kevaughn Harvey + Mary Reiser. **The package did not survive the meeting.**

- 🔴 **Charlie: the ceiling as drawn is not buildable** — *"too big… immensely outside the realm of possibility… I can't and I won't commit to something that I know I can't accomplish."* Fabric at 40′ × 50′ eats most of the budget; rigging alone consumes the one week before the set must be primarily in place.
- ✅ **Agreed direction: SEAM IT AND MAKE THE SEAMS A DESIGN ELEMENT.** ✅ **WATER IS STRUCK.**
- **Frank redesigning**, floating cutting ALL exterior walls for a bowl/amphitheater and one fabric piece instead of two.
- **Budget $5,500, in-house build, URITP is the bidder.** ⚠️ **Never said out loud in the meeting.** Reframed by Michael as the **Budget at a Glance** document rather than an email.
- 🔴 **Seat count unresolved: 92 logged vs 108 counted.** Owed from Frank in writing or from the `.vwx`.
- **ADA hardcoded** on ITP-4187: 51–150 band → 4 wheelchair + 4 companion, 5% aisle seats, 36″/33″. 2010 Standards §221/§802.
- 🔴 **EH&S and the fire marshal: still ZERO contact — now across THREE touchpoints** with audience-on-built-platforming live. **Code lane is MICHAEL's; I supply citation + paper trail. Charlie owns buildability.**
- 🔴 **NO `Risk Assessment (BL)` — DELIBERATE** (Q6, 08-07: nothing structural). **Expires the day the scenic package locks.** ⚠️ **Hawthorne's 08-11 consequence: everything the demand read produced is ANALYSIS ON A LEDGER, not a scored assessment.**
- 🔴 **8/7 full design team meeting has happened** (Seth on LX, Padra on sound) and **I still have not read the outcome — four days.** **Do not assume the riser decision.** ⚠️ **Five heads flagged on 08-11 that their reads are script-only because of this.**

#### THE SCRIPT DEMAND LEDGER — `Script Demands (BL)`, list `901328148330`

Mira seated all eleven heads on it 2026-08-11 ~01:37–01:42 ET; I chaired. **First surface read, onboarding context, not verdicts.** ⚠️ **Rows are at `raised`, and Kevaughn is mid-cut on the stage directions — this is the PLAY AS WRITTEN.** Correct for pricing and scheduling; **never quote it as final.**

🚦 **MICHAEL'S THREE BLOCKING DECISIONS, unchanged and still open:** **the tableaux selection** · **the crowd solution** · **the deck finish.**

🔴 **CORRECTED 2026-08-11 ~10:40 AM ET — AND THIS IS THE MOST IMPORTANT LINE IN THIS BLOCK.** This section previously read *"FOUR ROWS THE SESSION SURFACED THAT DO NOT EXIST YET… STILL NOT CREATED,"* and it shipped to `main` in PR #806 that way. **Every one of them already existed.** Michael built them himself at **01:45–01:46 ET — three to four minutes after I closed the meeting saying they needed to be created.** Verified against the live list, 38 rows read:

| What I recorded as owed | Actual state |
|---|---|
| The deck finish as its own demand | ✅ `DECISION: what is the deck finish, given five contaminants and two barefoot dances?` — created **01:45**, 💰 Money, `Scenic · Safety · Paints · Production Management`, **body fully written** |
| The laundry / garment-reset plan | ✅ `Garment maintenance and reset — the recurring costume cost nobody has priced` — **01:46**, 💰 Money, `Costumes & Wardrobe · Production Management · Stage Management`, **body fully written** |
| Reinforced or acoustic | ✅ `DECISION: is the live singing reinforced or acoustic?` — **01:46**, 💰 Money, five departments incl. `Cast` and `Costumes & Wardrobe`, **body fully written** |
| Two mislabelled `Rigging` rows | ✅ Corrected the same session (DL J1) |
| **The flashbulb electrics tag** | ✅ **ALREADY TAGGED `Lighting (LX)`** (with `FOH · Accessibility · Props`). **DL J1's *"Related and NOT fixed"* note is STALE and so is what I wrote into Vinny's and Gable's ledgers.** |

⭐ **The failure, and it is one I have already been corrected on twice: I wrote my LIVE STATE from the MEETING TRANSCRIPT instead of from the LIST.** *"Read the rows, not just the schema"* has an outer layer — **read the rows, not just the ROOM.** A meeting tells you what was said; only the list tells you what exists. 🔴 **And this is the exact shape of the 08-08 catch I recorded against a locked spec: *a page recorded work as OWED and nobody was watching whether it had been done.* I then did it to myself, in a file I wrote to prove I write things down.**

⭐ **Second-order, and it is a real pattern about Michael rather than about me: he closes gaps in MINUTES and does not announce it.** Three richly-written rows appeared four minutes after a chat message. **Anything I carry as *owed by Michael* has a shelf life measured in minutes, not days. Re-read before reporting.**

⚠️ **Two ledger findings from that read, neither of them mine to fix alone:**

- 🔴 **`waived` IS A LIVE STATUS ON THIS LIST** and it is in use — `WAIVED: the script's Bella/Eleanor and Piero/Leo doubling` sits at `waived`. **My memory file says *"`waived` is the status most of our surfaces lack"* and this surface has it.** ⚠️ **AND THE SCHEMA READ DID NOT REPORT IT:** `DESCRIBE` returned five statuses (`raised`/`confirmed`/`covered`/`cut`/`complete`) totalling 37 against 38 live rows. **The status census dropped a status that a row is actively using.** ⭐ **Belongs in `memory.md`'s proven-defects list; parked here because that file is 26,099 B against a ~10KB target and the condense pass is owed.** Flagged, not smuggled.
- ⚠️ **`new demands` (created 08-10 23:12) is a BARE row in the ledger** — no description, no `Demand Type`, no `Production Note`. It is scratch, and it is inflating the row count by one. **Not deleted; duplicates and strays are reclassified, never culled, and this one may be a deliberate marker.** Ask before touching.

✅ **HOUSE RULINGS MICHAEL GAVE THE ROOM (08-11 ~09:12–09:37) — mine to propagate:**

- 🔴 **THERE IS NO FIRE OR FLAME IN OUR THEATER.** He flagged it at me by name. **Fireworks *probably* not happening · throne circus given way · cigars NOT lit, possibly faked.** ⚠️ **"Probably" is not a ruling — Hawthorne will not close the row, and fireworks is still an AHJ question.** ⚠️ **A fake cigar is usually a practical (LED, battery, switch) on the props/electrics border. Unscoped.**
- ✅ **THE FIGHT CHOREOGRAPHER IS ON BOARD** and **already meeting with Kevaughn.** ⭐ **DISCHARGES the call Hawthorne handed me — the question is GONE rather than answered.** ⚠️ **Scope unverified, and the tableaux menu is still open above it.**
- ✅ **The wheeled building and the body disposal become STAGING changes**; the rolling unit *"probably won't be a thing."* **The wedding cake goes to PROPS.**
- ✅ **COMMS WILL BE STANDARD FOR OUR SHOWS.** ⭐ **Settles Quinn's claim by PRECEDENT and names NO spectrum owner.** Live contest is mics (Allison) vs wireless DMX (Vinny).
- ✅ **Find the real PUBLISHED source, not the retyped copy.** ⚠️ **Two stacked source problems: the degraded retype AND Kevaughn's pending cut. Different problems; neither resolved.**
- ⚠️ **Music licensing: *"from other songs and our university does cover it, i'm told"*** — **hearsay about a blanket arrangement.** Verification routed to KT, back next week. 🔴 **Courtney's third clock — PD compositions with LICENSED RECORDINGS — was never addressed** *(and the row for it exists: `Nine music cues — PD compositions, but the RECORDINGS are not`)*.
- ⚠️ **Still uncertain per Michael: the ~200 flashbulbs and the deck contamination.**

### 🪚 THE SHOP INVENTORY ANSWER I OWED RANDY — ✅ DELIVERED 2026-08-11 ~10:45 AM ET

Measured against `URITP Inventories` (space `901313771647`), **1,536 items across 43 lists**, read live. **This was owed since 09:13 and it gates the deck finish.**

🌟 **THE HEADLINE, AND IT IS A STRUCTURAL FINDING RATHER THAN A STOCK LIST: OUR INVENTORY TRACKS ASSETS, NOT MATERIALS.** Every one of the 43 lists holds countable, reusable, serialized things — `LX Inventory` 349 · `RIGGING Itemized` 557 · `SPAC Relays` 110 · `Accounts` 85 · `SCENIC Inventory` 64 · `AUDIO Fixtures` 48 · `RIGGING Fixtures` 40. **Randy asked what MATERIAL the shop holds, and the system has no concept of material stock.** ⭐ **So "is it in stock?" is unanswerable for four of his five asks — not because the shop is empty, but because raw stock is not a thing this workspace models.** Pairs with thesis 1: another transient state with no mechanism.

**What `SCENIC Inventory` (64 rows) actually is:**

| Item | Count | State |
|---|---|---|
| **Wenger platform, full** | **26** | **17 `in stock`**, 9 `in use` |
| SPAC Side Tab | 21 | 19 in use, 2 in stock |
| SPAC leg curtain | 8 | in stock |
| SPAC Border | 4 | in stock |
| SPAC Main drape | 2 | in stock |
| SPAC traveller curtain | 2 | in use |
| SCENE SHOP "go/no-go" gauge | 1 | in stock |

**Against Randy's five asks:**

1. **Modular platforms with REPLACEABLE tops → HALF YES, and the half that fails is the half he cared about.** 26 Wenger platforms exist, 17 in stock. 🔴 **But a Wenger deck is 3/4″ plywood with the wear surface BONDED to it** — Moroccan slip-resistant overlay, Quadripple heavy-duty textured, tempered hard-ply, or carpet, on a 3″ aluminium extrusion frame ([Wenger Versalite spec](https://www.wengercorp.com/Lit/Wenger_Versalite%20Platforms_TS.pdf)). **The top does not come off.** ⭐ **So the building owns RISER stock, not a swappable dance floor — which means "replace per run" cannot be done by swapping lids. It has to be a sacrificial LAYER over the platforms, or a shop-built deck.** ⚠️ **That is a material fact about the deck-finish decision and it arrived from an inventory query, not from a design meeting.** Whether Big Love's acting platform sits on Wengers at all is Charlie's read against the new plates.
2. **A cast-iron or steel bathtub → NOT IN INVENTORY.** The bathtub is a live prop demand on the ledger and `PROP Inventory` has **exactly one row in it.** 🔴 **That list is scaffolded and empty — which reads as "we own nothing" and actually means "nobody has itemized props."**
3. **Welding setup + steel stock (1″ tube, angle, flat bar) → NOT MODELLED.** Not absent, unmodelled. See the headline.
4. **4″ locking swivel casters, 300 lb → NOT MODELLED.** Same.
5. **Paint and sealer stock → NOT MODELLED.** Same. *(A `Paints` department label exists on the demand ledger, so the DEPARTMENT is real even though its stock is not tracked.)*

⚠️ **THE HONEST BOTTOM LINE FOR HIM: I can confirm the platforms and the soft goods, and I cannot confirm or deny a single consumable or raw material, because we do not track them anywhere.** ⭐ **His wish list is not answerable as an inventory query. It is answerable as a walk-the-shop-with-Charlie task, and that is a real owed item rather than a data lookup.** 🔴 **There is also a `wish list` STATUS already in use in that space** (`Scene shop hose reels` sits at it) — **so a wants-vs-has mechanism exists and the scene shop is already using it.** That is where his list should land.

### 💵 Budget at a Glance — task enriched 08-06, artifact still not produced

[`| budget at a glance |`](https://app.clickup.com/t/86ah4r5r1) (ITP-3243, `Paperwork (BL)`) is a full reference surface: master at `/PROGRAM/Guest Artist Documents/BUDGETS-At-a-Glance.Template.F22.doc`, seven precedent PDFs mapped, destination `/PRODUCTIONS/URITP 26-27/1 Big Love/` confirmed. ⚠️ **Filename convention drifted between seasons; 26-27 needs one picked.** Also owed by Michael: **share Rebecca into Dropbox** to unblock costumes (Prelim Costume due 7/27 and open; Final Costume + Props List were due 8/10).

🔴 **THE BUDGET SHAPE IS A FINDING, DERIVED BY TWO HEADS INDEPENDENTLY IN ONE ROOM — and BOTH now have rows.** Tully priced the weekly consumable line (`Consumables — the per-performance restock line nobody has priced`, 💰 Money, high) and Wren priced the per-performance garment reset (`Garment maintenance and reset`, 💰 Money). ⭐ **A $5,500 build budget is a ONE-TIME number and both of those are RATES. This document prices the one-time half only.** Michael endorsed the framing.

### 🗄️ PRODUCTION MAWSTER — the calendar app is being REBUILT (2026-08-08, not mine to build)

Michael + **FMP Fiona**, ~4h on the v1 schema of a fresh FileMaker app replacing `ProductionCalendarFormat`. **MY operational surface** (the 11×17 calendars, the contact sheets), so I carry the state even though the build is hers.

- 🔴 **The legacy app holds exactly ONE production at a time.** `SETUP` was 20 fields / 1 record / almost entirely GLOBAL storage, six hardcoded scripts swapping globals per show. **Every calendar I have printed came out of a file that could not hold two shows.**
- **Docs in the REPO** (`mawizorek/maw-prose` → `apps/production-mawster/`), decisions in *Production MAWster FMP — Decision Log*. Not a ClickUp-canonical build.
- 🔴 **Two doc-page corrections owed on** [URITP Production Calendars FMP](https://app.clickup.com/36074068/docs/12cwjm-52833/12cwjm-61333): it says **11 tables (it is 9)** and claims multi-production support via SETUP records (**false**). I have quoted that page.
- 🔴 **Five live bugs in the RUNNING file, reported not fixed.** The operational one: `RGB ( $R ; $G ; $R )` in two scripts, so **blue takes red's value and every status colour on every calendar I have printed is wrong.** Plus three overlap-flag scripts with no resolution, a shipped debug dialog, `One Acts INFO` carrying TIME's course number, two `<Missing Field>` import-map entries.
- ⚠️ **Q5 is a fold-in question in MY domain:** is Production MAWster the same app as [URITP Production Build FMP](https://app.clickup.com/36074068/docs/12cwjm-52833/12cwjm-80793), spec'd and LOCKED 08-07 to the same scope and never started? **Two pages, one app.** Michael's ruling owed.

### The URITP list audit (Anna leads; I hold the workspace knowledge)

🌟 **ALL SEVEN SPACES PASS-1 COMPLETE.** **Index: 236 rows**, verified **2026-08-04 2:58 PM ET** against `901327881037`. 🔴 **This block said 154 for five days and I quoted it as fact** — a stamp proves WHEN, not that it is still true. **Re-query before quoting.**

**Remaining non-Confirmed: 12 rows + 1 blank** across five spaces (main hub 4 · CRM 6 · PRODUCTIONS 1 · MAW Documents 1 · DAD LLC 1). **A straggler sweep, not a space-sized gap.**

**Machinery:** standing thread `86ajknmmk` (**reopen, never spawn**) · **List Index `901327881037`** ⚠️ NOT `901327854042` · Roadmap banner has drifted 3× · List Audit DoD `12cwjm-76573` · `/council=uritp-audit`. **`Confirmed` is MICHAEL's word only.**

### 🎯 My standing assignments (owed, not parked)

**1 · The availability-tracking problem** (his, 07-25). Diagnosis settled — recurring weekly availability is well-built; the **time-boxed poll** has no mechanism, so every poll mints a list plus permanent hard-coded date fields. **The PROPOSAL is what's owed.** Corey is the call-in.

**2 · ROLES cluster Q1 — Corey and I owe a RECOMMENDATION** (his, 07-27). **Not a park.** ⚠️ **Twinned with risk-assessment Q3/Q5** — one ruling should close both.

**3 · The ARCHIVE verb** (08-04). Three nouns, no verb. 🔴 **Confirmed in a SECOND domain** (safety, 08-07). Still unowned.

**4 · The prelim-receipt trigger.** Phase 1 item 1. Neither greenlit nor refused across three offers. 🔴 **08-11 is the strongest evidence yet: five heads read the SCRIPT because the PLATES never routed to them.**

**5 · Transcript speaker attribution** (08-06). Method kept, tool unbuilt.

**6 · `Risk Assessment (BL)`** — ✅ **CLOSED 08-07: deliberately not built** (Q6). Reopens when the package locks.

**7 · CREW CALLS — a document that does not exist anywhere** (08-08, MINE). **A call carries person, role, call time, report LOCATION and who called it. A calendar event drops all but the time.** Library-vs-instance, the shape I already argued for hazards: third document, or a view of the production calendar? ⚠️ **The FMP build left room** — `WORKDAYS` is not closed as the only day surface, `LOCATIONS` exists so a report location can resolve. **Nothing is blocked on it, which is why it will keep not happening.** Owed: a recommendation, not a build.

**8 · The shop inventory answer to Randy** — ✅ **DELIVERED 08-11 ~10:45.** See the block above. 🔴 **It converted into a NEW owed item rather than closing: a walk-the-shop pass with Charlie for the four unmodelled material categories, landing on the existing `wish list` status.** That is the real deliverable and it is not a data lookup.

**9 · The four missing ledger rows** — ❌ **WITHDRAWN 08-11: they were never missing.** Michael built three of them 3–4 minutes after I closed, the label fixes were already applied, and the flashbulb tag was already on. **The assignment was an artifact of my own bad read.** ⭐ **Kept in this list rather than deleted, because a withdrawn assignment teaches more than an absent one.**

**10 · A1 or board op** (08-11). Michael's question, gated on his own reinforced-or-acoustic fork — **which now has a row carrying five departments.** **The staffing half is mine.** ⚠️ **Quinn's console-and-operator-position question, unchecked since November, is the same physical question arriving as a staffing one.**

### 🅿️ Parked / scheduled — carry, do not force

- **Reynolds Phases 2–4** — documented, explicitly NOT open. **Michael opens them.**
- **CRM projection-fan shape — OPEN.** *"you're seeing growing pains."* Never read a verdict into it.
- **📅 Gen-1 going forward = SCHEDULED:** a session with **Corey + FMP Fiona**. Four queued conversations, no home. ⚠️ **08-08: Michael ran a Corey-and-Fiona-shaped session WITHOUT me in it.** Not the Gen-1 session, but evidence the pairing happens whether or not it is scheduled.
- **One Acts format** + **the three umbrella folders' placement** → Pass 2 by decision. ⚠️ **08-08: `One Acts F26` is simply the production's NAME — season-in-title is intentional.** Does not settle the grain question.
- **SHOW TEMPLATE Q7 open:** three fields (`Department`, `Phase`, `Venue`) no production uses.
- **Space-4 Q4:** where the stalled-pilot / superseded line falls.
- **Calendar-surface sprawl** (6 surfaces) · **Routines ↔ Season Planning line** · **access control across 5 surfaces / 3 spaces.**
- **`| DEFINITIONS FOR PROGRAMS |`** — `researching` since **Jan 2025.**
- 🔴 **`cancelled` is a DONE-type status on `Course List`.** Blocks any automated archive step. Corey's.
- 🔴 **`memory.md` is 26,099 B, MEASURED 2026-08-11**, against a ~10KB hot target. ⚠️ **This line previously said "~21KB" and was wrong; a parking commit recorded it at 31KB.** ⭐ **Three numbers for one file inside a week — read the byte count the API returns** (drift-register D15). **Past owed, into defect.** 🔴 **AND IT IS NOW BLOCKING A REAL WRITE:** the dropped-status tooling defect found 08-11 belongs in its defects list and is parked in this file instead. **Nothing culled without Michael.**

---

## 2026-08-11 (second pass) · The rows I said were missing had existed for nine hours

Michael: *"hit it milo."* Went to execute the owed items from the seating close. **Read the live list first and found that almost nothing was actually owed.**

🔴 **THE CORRECTION, AND IT IS AGAINST MYSELF, ON MAIN.** PR #806 — the write-back PR whose entire point was that we do not record things — shipped a **false claim** into my LIVE STATE and into Vinny's and Gable's ledgers: that four ledger rows *"still do not exist"* and the flashbulb row *"still has no electrics tag."* **All of it was already done.** The three demand rows were created by Michael at **01:45–01:46 ET, three to four minutes after I closed the meeting listing them as owed**, and they are not stubs — each carries a full body with the fork, the boundaries and the department split. The flashbulb row already carried `Lighting (LX)`.

⭐ **THE LESSON, one layer out from a correction I have already taken twice: READ THE ROWS, NOT JUST THE ROOM.** *Read the rows not the schema* (08-07) · *read the production not the script* (08-10) · **and now read the LIST not the MEETING.** A meeting tells you what was SAID. Only the list tells you what EXISTS. 🔴 **I closed a room by naming what was owed, and then reported that owed state as fact nine hours later without opening the container. That is the same species every time and the container keeps changing.**

⭐ **AND A PATTERN ABOUT MICHAEL THAT CHANGES HOW I REPORT: he closes gaps in MINUTES and does not announce it.** Three fully-written rows appeared four minutes after a chat message. **Anything I carry as *owed by Michael* has a shelf life measured in minutes. Re-read before reporting, every time.**

✅ **WHAT I ACTUALLY DELIVERED:** the shop inventory answer Randy has been waiting on since 09:13 — and it turned into a structural finding rather than a stock list. **Our inventory models ASSETS, not MATERIALS**, so four of his five asks are unanswerable as queries. The one that IS answerable changes the deck decision: **26 Wenger platforms, 17 in stock, and their wear surface is BONDED to the plywood**, so replace-per-run cannot be a lid swap. Full detail in the LIVE STATE block.

⚠️ **Two ledger findings recorded, neither fixed:** `waived` is a live status on this list **and the schema census did not report it** (37 reported against 38 live rows) · and a bare `new demands` row is sitting in the ledger inflating the count. **Not touched — strays get reclassified, never culled.**

**State left:** DL J1's *"NOT fixed"* note on the flashbulb row is stale and needs correcting; Vinny's and Gable's ledgers carry the same stale claim. The walk-the-shop pass with Charlie is a new owed item. **Three blocking decisions still with Michael: tableaux, crowd, deck finish.**

---

## 2026-08-11 · Big Love demand ledger — I chaired eleven heads and closed a room that recorded nothing

Big Love (F26) production channel, ~01:37–01:42 ET. **Mira seated all eleven department heads**; I chaired and closed; Michael ruled ~09:12–09:37.

🌟 **THE GATE PASSED AND I SAID SO WITH EVIDENCE: five real disagreements, none smoothed over.** Gable vs the ledger's own `Rigging` labels · Randy pushing back on Gable about a rolling load · Vinny vs Pierce on whether the crowd is video or light · Tully vs Wren on the apron · Allison vs Ulla on spectrum weighting. **That's a room, not a chorus.** ⭐ **Three of the five landed on borders Mira named in the Opening Post — naming the likely seams up front is a reusable conducting move.**

🌟 **THE HOUSE HALF HELD PERFECTLY AND IT IS THE PART I WAS MOST WORRIED ABOUT.** All eleven refused inventory, people and calendar **out loud** rather than quietly skipping it, and routed all of it to me. Quinn's was sharpest — *"when is the call, when's tech, who's calling this show — I do not know and I will not learn"* — on the seam that sounds most like her job and is the house's. **No adjudication needed anywhere.**

✅ **AND ONE OF THE TWO CALLS I REFUSED TO MAKE IN A CHANNEL WAS DISSOLVED BY THE HOUSE WITHIN HOURS.** Hawthorne handed me *do we rehearse the collapse sequences before a movement director is engaged?* — **the fight choreographer is on board and already meeting with Kevaughn, so the question is GONE rather than answered.** ⭐ **Not making a call in a channel is sometimes correct because the call EVAPORATES once the house speaks.** ⚠️ **The other one (tableaux selection before or after Kevaughn's cut) is still mine and still unmade.**

🔴 **AND HERE IS WHAT I GOT WRONG, AND IT IS THE CHAIR'S FAILURE SPECIFICALLY.** I closed with what was *now owed, and by whom* — and **never told a single head to write it down.** Eleven first reads, five disagreements, **and not one of the eleven wrote a line to its own `activity-log.md`.** Every bundle sat at build weight for ~8.5 hours. **Four of them still read `Owed: the Wave 3 gate` while that gate was being passed in the same session.** Michael caught it, not me.

⭐ **A POST IS NOT A WRITE.** Speaking and recording both feel like composing prose, and only one survives the session. **Same failure I earned on 08-06** — four hours of advisory work with nothing written until he asked *"are you updating your activity or your memory at all?"* 🔴 **Second instance in five days: a missing STEP, not a habit.** ⚠️ **A write-back clause in `_shared/department-head-base.md` plus a chair-side duty in `council.md` is PROPOSED and is Michael's call.** Mira carries the same finding from the seating side.

⚠️ **SECOND-ORDER, WORTH MORE THAN THE FIRST: the Wave gates were being discharged and nobody noticed.** This session cleared **Wave 3 cleanly** and **Wave 2 only PARTIALLY** — its condition names **tech week**, and this was a script read ~17 days out. ⭐ **Hawthorne refused to round his up, which is the discipline that makes a gate worth having.** 🔴 **A satisfied-but-unrecorded gate is worse than an unmet one.**

⚠️ **AND FIVE HEADS FLAGGED THE SAME STRUCTURAL GAP AT ME:** they read the **script** because the **plates** never routed to them. 🔴 **Standing assignment 4 earning itself again.**

🔧 **PROCESS:** ✅ the backfill went **branch → PR → self-merge**. 🔴 **And the write overflowed this file to 33,565 B, forcing a rotation.** ⭐ **I fixed a missing-write problem by creating an unreadable-file problem, in one pass.** ⚠️ **And the content I wrote was partly WRONG — see the correction entry above. A fast write-back is not a substitute for a read.**

---

_Cold archive → `activity-log/2026-Q3.md`: **08-06 → 08-07** (Reynolds Ch.7 → safety architecture; the research method, four earned corrections, the Hawthorne seating miss) · **08-06** (Big Love prelim scenic review; the ten prelim gates, the proximity findings) · **08-04** (course binder / three-system treaty) · **08-04** (INBOX intake, Frank Oliva; template ≠ production) · **07-25** (URITP audit context-keeper) · **07-21** (build). The 07-30 lesson that still binds: **memory = patterns; project state = here** — and on 08-04 I broke it from the other direction by quoting a stale count. **The file is not the fix; re-querying is.**_
