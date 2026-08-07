# Hazard Hawthorne — CRAFT LEDGER

**PATTERNS + CORE PREFERENCES ONLY** (base spec §4a), narrowed to the five entry kinds allowed by
`_shared/department-head-base.md` §2: technique · failure modes · standards that keep mattering ·
arguments already lost · what Michael has refused to change.

🚫 **No calendar. No house inventory. No people.** ⚠️ **And for this head specifically: no incident
ever records a person.** An incident is remembered as *what happened and what the trade learned*,
stamped with the house — never as who did it. Student data never leaves the workspace at all.

---

## Ledger A — Technique & practice (how a hazard is actually analysed)

**FIRST ENTRY 2026-08-07** (seated late into the Reynolds Ch.7 session; everything below was read,
not recalled).

- 🌟 **A CONTROL IS NOT REUSABLE. A HAZARD IS.** Michael's ruling, 2026-08-07: *"I definitely like
  the ability to reuse the tasks, but the controls definitely switch per show."* The hazard is a
  permanent noun (*water onstage*); what was done about it is a fact about ONE production and will
  never be true again. **A system that stores both on one record will produce duplicate hazards, and
  those duplicates are the only surviving per-show control records.** Reclassify them, never merge
  them — a dedupe pass destroys the assessment history.
- 🔴 **SAFETY STASIS (Michael's term, and it is the governing principle of this lane):** *"we
  actually get into safety stasis if we rely on existing things and assume they cover our bases."*
  **Reusing a CONTROL without re-assessment is itself a hazard. Reusing a hazard DEFINITION is not**
  — that is just remembering. Practical consequence for anything I am asked to review or design:
  **a pre-filled assessment is more dangerous than a blank one, because a blank row gets filled in
  and a filled row gets skipped.** A prior show's score arriving on a new show's record LOOKS like
  analysis and is not. Re-assessment must be structurally mandatory, never merely available.
- **Name the hazard before ranking it** (profile instruction 1) has a corollary found in live data:
  **a rating with no named hazard behind it is arithmetic, not analysis.** See Ledger B.

## Ledger B — Failure modes

**FIRST ENTRIES 2026-08-07**, all observed in the live URITP hazard library (85 rows read in full
by Milo, 2026-08-07). These are TRADE failure modes, not a picture of that house.

- 🔴 **A HAND-ENTERED RISK RATING IS AN UNVERIFIED RATING.** Where `Probability`, `Severity` and the
  resulting band are three independent inputs, nothing multiplies the first two to produce the
  third — every rating is a human doing arithmetic in their head, and no system knows whether it is
  right. **Ask how the band is produced before trusting any matrix.** This is the strongest
  argument for a calculated field anywhere in a safety system.
- 🔴 **A HAZARD LIBRARY LOOKS COMPLETE LONG BEFORE IT IS.** Roughly half the rows in a mature,
  six-season library carried no rating, no area, no affected-parties value — including live
  exposures (live electrical power used by performers, atmospheric haze, objects scattered across a
  deck). **A row count is not a coverage measure. Count SCORED rows.**
- **MITIGATIONS GET FILED AS HAZARDS.** *"Add railings,"* *"source another exit sign,"* *"glow tape
  the bases"* are CONTROLS wearing a hazard's clothes. They inflate the library, they never get a
  rating (correctly, they have no risk of their own), and they make the unscored fraction look
  worse than it is. **Controls nest under the hazard they control.**
- **CONTROL STATE GETS ENCODED IN THE ROW NAME.** *"Steps onstage (no railing)"* and *"Steps
  onstage (railing)"* are one hazard at two control states, stored as two hazards. The moment you
  see a parenthetical in a hazard name, check whether it is describing a CONTROL.
- ⚠️ **A TYPO IN A CONTROL FIELD IS A CONTROL FAILURE.** Four rows in that library list `Waning
  signage` as the ENTIRE mitigation for lasers, blinders, loud effects and strobe. It means
  WARNING. **On those four rows the typo IS the whole control**, and it was copied three times.
  Read control text as text, not as a checked box.

## Ledger C — 🎯 INCIDENT MEMORY + standards that keep mattering

⚠️ **INCIDENT MEMORY IS STILL GENUINELY EMPTY.** No incident has been recorded to me. Say so; do not
infer one. The standards section below is now open.

⚠️ **Every standard entered here needs BODY + DESIGNATION + CLAUSE + EDITION or it is written as
`unverified`** (`gates/craft-guardrails.md` §1). **A remembered edition is an unverified edition.**
A fabricated clause reads exactly like a real one and will be repeated to a fire marshal.

### ✅ ANSI E1.46 — *Standard for the Prevention of Falls from Theatrical Stages and Raised Performance Platforms*

**Body:** ESTA Technical Standards Program, ANSI-accredited · **Designation:** ANSI E1.46 ·
**Edition READ:** 2016 (approved by the ANSI BSR 29 February 2016, doc FL/2012-8002r7) ·
**Source:** full PDF read 2026-08-06 at `tsp.esta.org/tsp/documents/docs/ANSI_E1-46_2016.pdf`.
⚠️ **A 2018 REVISION EXISTS** (revised for the OSHA fall-protection rule changes) and **I have not
read it** — free at `tsp.esta.org/freestandards`. **Cite 2016 only for what is quoted below; verify
against 2018 before it goes to an AHJ.**

**Clauses that keep mattering:**

- **§3.4.1.1 (mandatory)** — the duty to develop, document, implement and evaluate a fall
  protection plan sits on **the management of the performance venue or production company**. Not on
  the TD, not on the designer. **This is the clause that answers "whose problem is this."**
- **§3.4.1.3 (mandatory)** — the plan **shall cover EVERY operating mode**, and the enumerated list
  is broader than anyone assumes: unoccupied with production in residence · move-in · strike ·
  rehearsal · tech · dress · performance · maintenance and work calls · visitors · facility tours ·
  **public/audience access (award shows, on-stage receptions)**. 🌟 **The audience-access mode is
  the one that gets missed, and it is the one that bites the moment an audience is on built
  platforming.**
- **§3.4.1.4** — the plan is in effect 24 hours a day, every day of the year.
- **§3.4.2** — implementation is enumerated: equipment installed · people trained · tasks assigned ·
  **assigned people actually perform them.** A written plan with no assignment is not implemented.
- **§3.4.3 / §4.4** — evaluate annually, whenever conditions change, and **whenever a fall occurs
  OR ALMOST OCCURS.** 🌟 **That is a near-miss reporting requirement stated as a standard**, which
  is the strongest available argument for a near-miss log.
- **§3.4.4.2** — revisions implemented within **14 days** for non-critical changes, and **before the
  next authorized use** if the risk needing mitigation is extreme.
- **§4.1 (informative)** — the four-step risk assessment: identify the affected parties → identify
  the hazards → **assess and rank** → record. **§4.2** applies the hierarchy of controls.
- **Annex B** — a worked example of an orchestra lift safety program. **Annex C** — a worked plan
  for installing an apron extension. Both are copyable models rather than prose.
- ⚠️ **§3.1: the standard explicitly states it is NOT written as a compliance or enforcement
  document.** Quote it as guidance and a duty framework, never as "code requires."

### 📌 Cross-reference, not mine to certify

- **Audience on built platforming is an OCCUPANCY load, not a scenery load** — Milo carries this as
  house knowledge (100 psf vs the 50 a performance deck gets) and it re-opens occupant load, egress,
  posted house capacity and AHJ signoff. **I have not verified the psf figures against a cited code
  edition and will not repeat them as a citation until I have.** Flagged `unverified` deliberately:
  it is almost certainly right and that is exactly why it needs a source.
- **ADA 2010 Standards §221 / §802** assembly seating scoping is likewise carried by Milo and is
  the ORGANIZATIONAL compliance half. Accessibility scoping is not my craft lane.

## Ledger D — Arguments already lost

**EMPTY.** No argument of mine has been overruled yet, because until 2026-08-07 I had never been
seated.

## Ledger E — What Michael has refused to change

**FIRST ENTRY 2026-08-07.**

- 🔴 **THE CODE LANE IS MICHAEL'S, and he claimed it explicitly** (2026-08-06): *"I would like to be
  the code guy through support and documentation from you."* **He is the authority; the agents are
  the apparatus.** What that obliges me to do every time: bring **body, designation, clause,
  edition, live link**, state plainly where the source stops, name the open question, and build a
  paper trail he can hand to EH&S or a fire marshal. ⚠️ **Never let my own no-certify guardrail read
  as a limit on HIM.** A guardrail on my authority is not a hole in his — that exact confusion was
  corrected once already and it is the fastest way to be useless to him.

---

## ⚠️ TO A COLD SESSION READING THIS FILE

**Ledgers A, B, C-standards and E now have real content, all of it dated 2026-08-07 and all of it
read rather than recalled. INCIDENT MEMORY and Ledger D remain genuinely EMPTY — say so.** Do not
infer a pattern, do not import one from another agent, and **do not generate generic safety cautions
to fill the space** — a plausible safety ledger is the single most dangerous fabrication this fleet
can produce, because it will be believed.

🎯 **Kill criterion (D1):** two real productions with no cited standard and an empty Ledger C means
Hawthorne was a vocabulary, not a memory. ✅ **First cited standard landed 2026-08-07 (ANSI E1.46).
The criterion is no longer trending toward retirement — but ONE citation is not a memory either.**

**One inherited LEAD, labelled a lead and not a fact** — from the Wave 1 gate meeting on
Thought/Crime (URITP, 2026-08-01), raised by Grid Gable and **STILL never answered:**

> *Does a UL listing on a luminaire survive that luminaire being installed inside a shop-built,
> non-listed plywood enclosure?* Gable flagged it `unverified` and declined to guess. **It is a
> real standards question with a real answer and nobody has looked it up.** It has now been open
> six days across two sessions. **Still the cheapest genuine craft entry available.**
