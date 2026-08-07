# URITP Safety Pipeline — the workflow, end to end

**Status: SPEC. Described, not built.** Layers 1 and 2 exist. Everything from the assessment instance
rightward is proposed, and the open questions are named at the bottom rather than assumed away.

**Canonical home for this procedure.** ClickUp surfaces point here; they do not restate it
(Constitution §2–§3 — an agent triggers a tool, it does not store the how-to).

- **Decision history + open questions:** `Risk Assessment CU Notes — Decision Log` (ClickUp doc page `12cwjm-80553`) — J1–J6, Q5, Q8.
- **Diagram:** `uritp-safety-standards-architecture.html` (artifact, 2026-08-07).
- **Roadmap it serves:** the Reynolds Ch.7 four-phase plan, MAWLIB-1038 (`86ajxa1dc`).

**Authored 2026-08-07** from Michael's rulings in one continuous session. Every quoted line below is his.

---

## The one sentence

**A standard is cited once, a program is written once, an assessment is written once per show, a card
is filled once per work call, and the whole thing freezes at strike.** Four different lifespans, four
different objects. Storing any two of them on one record is the defect this pipeline exists to fix.

---

## 1 · STANDARD → the Standards Register

**Lifespan: permanent, until superseded. Owner: Hazard Hawthorne. Runtime: ClickUp (proposed list).**

The only layer where an outside authority speaks. One row per standard per edition.

- Body · designation · **edition as its own field** · clause · live link · `Superseded by`.
- 🚫 **No body + designation + clause + edition = the row is written `unverified` and stops there.**
  A fabricated clause reads exactly like a real one and will be repeated to a fire marshal.
- ⚠️ `Superseded by` ships on **day one**, not later. Live reason: every E1.46 citation currently in
  the workspace is the **2016** edition and **the 2018 revision is unread.**
- ⚠️ **Enforceable is a real distinction.** E1.46 §3.1 states it is not a compliance or enforcement
  document. Quote it as a duty framework, never as "code requires."

**🔴 The code lane is MICHAEL's** (his ruling, 2026-08-06): *"I would like to be the code guy through
support and documentation from you."* Hawthorne supplies citation, edition, clause and paper trail.
Michael makes the call. **Hawthorne never certifies; that guardrail limits HIM, not Michael.**

---

## 2 · PROGRAM → `URITP ▸ PROGRAMS ▸ SAFETY Programs` (`901321668271`)

**Lifespan: permanent, revisited when the STANDARD changes — never when the show changes.**
**Owner: Michael. Runtime: ClickUp. ✅ ALREADY EXISTS.**

~25 records, task type `Paperwork`: SCAFFOLD · PPE · HOT WORK · ELECTRICAL SAFETY · WORKING AT HEIGHT ·
CHEMICAL HAZARDS · FIRST AID · **AUDIENCE Program** · GENERAL SAFETY FOR ALL · URITP EMERGENCY HANDBOOK ·
MEWP. Mostly at `new` / `researching`.

**This is where URITP decides what it actually DOES about a standard.** The register says what the world
requires; the program says what this organization does.

**Proposed wiring:** `Standards cited` (relationship → Register, many-to-many) · `Citation status`
(`Cited` / `Unverified` / **`Internal practice only`** — the third value is honest and load-bearing) ·
`Last verified` (when someone last checked it against the live standard, not when it was written).

🔴 **BLOCKED, and deliberately:** the list already carries **ten department checkboxes** beside
`Who's Affected`, which expresses the same fact better. That is the **third instance** of one defect
(hazard label-vs-multi-home · ROLES cluster · this). **Corey adds nothing until one ruling closes all
three.**

---

## 3 · TRIGGER → at PRELIM, not at load-in

**🔴 This is the gap the whole pipeline was built to close.** Michael, 2026-08-06: *"I should have
opened a risk assessment as soon as I got those prelims; that is where I should have centered a bunch
of my notes."*

A design package arrives → the assessment opens. Ten gates, recorded so they are not re-derived:
**1 provenance · 2 completeness-for-costing · 3 occupancy + load · 4 egress + fire · 5 electrical ·
6 trip/slip/marking · 7 overhead · 8 accessibility · 9 operations · 10 money + schedule.**
**Every gate closes as open / resolved / N-A with a NAME attached, or it does not close.**

**The apparatus is excellent and the ignition is manual.** Transient-state thesis, tenth instance:
steady state is well-built, the moment of transition has no mechanism.

---

## 4 · ASSESSMENT INSTANCE → one per hazard, per production

**Lifespan: one season. Owner: Michael (the desk). Runtime: 🔴 UNRESOLVED — Decision Log Q8.**

The hazard library is pulled in **as a prompt, never as an answer.**

> 🌟 **SAFETY STASIS** (Michael, 2026-08-07): *"We actually get into safety stasis if we rely on
> existing things and assume they cover our bases."*

**Reusing a CONTROL without re-assessment is itself a hazard. Reusing a hazard DEFINITION is not** —
that is just remembering. **Therefore a pre-filled assessment is more dangerous than a blank one: a
blank row gets filled in and a filled row gets skipped.** Re-assessment is structurally mandatory,
never merely available.

⚠️ **Why a ClickUp multi-home cannot be the mechanism:** a multi-home is the SAME OBJECT in two lists.
Editing `Controls` for a new show **retroactively rewrites the closed show's safety record.** The
duplicate rows already in the library were somebody protecting audit integrity against exactly that.
**Reclassify them; a dedupe pass destroys history.**

**🖊️ THE DESK STEP — the irreducible one.** Michael sits with the package and the prompts and writes
**this show's** controls. Everything upstream is reference; everything downstream is execution.
**No tool replaces this, and none should try.**

---

## 5 · OUTPUTS → two, with different audiences

**A · The document handed OUTSIDE.** DPS, EH&S, the fire marshal, insurance, an incoming guest
director. The library named this itself — the blank-firing-gun record reads *"DPS is informed of the
use of the weapon w/ dates, times, and visuals… DPS is invited to visit the production venue and
inspect the weapon."* **You cannot hand somebody a saved view. This is why the assessment needs a
container.**

**B · The internal actions.** Glow tape, railings, added signage, a training call, a preshow check.
These are CONTROLS and they nest under their hazard — they are not hazards themselves. ~10 rows in the
live library are currently misfiled this way.

---

## 6 · THE CARD → FLHA, at the work call

**Lifespan: one call. Owner: whoever is on the deck. Runtime: FileMaker form.**

> Michael, 2026-08-07: *"I propose we build these forms in FileMaker right now; they can serve as the
> printouts we eventually provide for the staff to complete."*

**Digital record and printed handout are the SAME artifact rendered two ways.** That retires the
paper-vs-iPad argument: the form is the deliverable, and the screen and the page come off one
definition.

- **The only layer that happens with people standing up.** Forty-five seconds, one thumb. Longer than
  that and it gets signed after the fact, which is worse than not having it.
- **The back of the card is a query against the hazard library.** It is already written.
- **What a digital card can do that paper cannot: a one-tap near-miss button, mid-call, no form.**

---

## 7 · NEAR-MISS → and it loops BACKWARD

**🔴 PHASE 1 as of 2026-08-07. Promoted from Phase 2 the day Hawthorne was first seated.**

> **ANSI E1.46-2016 §4.4.3:** review and revise the plan whenever a fall occurs **or almost occurs.**

**Not a maturity milestone — a condition of having a compliant plan at all.** A near-miss with no
capture path is a plan that cannot satisfy its own review trigger. **A near-miss re-opens the
assessment**, which is the only loop that keeps this from being a binder.

🔴 **Ships with a stated no-blame policy or it does not ship.** An empty log reads as evidence of
safety. Two things de-risk it right now: **the single-operator year means there is nobody to blame
yet**, and **Hawthorne's ledger discipline is already the policy in writing** — record what happened
and what the trade learned, stamped with the house, **never who did it.**

📌 **Building the capture path does NOT populate Hawthorne's incident ledger.** It stays empty until a
real incident. Nothing back-filled, nothing inferred.

---

## 8 · ARCHIVE → frozen at strike

**Lifespan: forever. Runtime: FileMaker.**

The closed-out assessment freezes and never changes again: calculated `Hazard Rating`, a real 5×5
matrix, and a **computed delta showing how far each control actually moved the risk** — the number
Reynolds cares about and nobody can currently see, because the rating is three independent hand-picked
dropdowns with nothing multiplying them.

**The archival set:** closed-out assessments · completed forms · near-miss records · the show-specific
hazards that were only ever true once. **All stamped with the show. None editable.**

🔴 **BLOCKED: the ARCHIVE VERB DOES NOT EXIST.** Three nouns, no verb — nothing moves a record from
current to historical. Confirmed missing in **two** domains now (courses 08-04, safety 08-07), which
promotes it from a course-side gap to a general one. **Unowned.**

🚫 **The reusable library never archives.** It is a live definition, not history.

---

## Handover — what leaves Michael's hands, and when

> *"The crew doesn't do anything, so I'm the person building this from the ground up because we need to
> establish a system first… At least for this year, I think I'm the only one touching this."*
> *"I'll run the process as if it were public until we are sure it works."*

**Year one: single operator.** 🌟 **This removes adoption from the variable set.** Every prior URITP
engine had to survive a build AND a rollout simultaneously, so when one died you could never tell which
half killed it. **One operator means a failure is a design failure, and it is legible.**

⚠️ **The cost, stated:** a form only Michael fills out is never tested against the person it was
written for. **The single-operator year proves the SYSTEM. It cannot prove the FORM is usable.** That
test arrives at handover and **should be planned as an event, not discovered.**

**Handover order, easiest first:**

1. **The FLHA card** — leaves first, plausibly next season. A crew fills one in five minutes without
   understanding the system behind it.
2. **Internal actions** — already delegable; they are ordinary tasks with names on them.
3. **Programs** — a department head can draft one against a cited standard.
4. **The assessment** — leaves LAST, and may never fully leave. Writing controls is judgment.
   **Intermediate step worth designing: a TD or PSM PROPOSES controls, Michael ratifies.**

---

## Who collaborates on what

| Layer | Who |
|---|---|
| Standards + citation | **Hawthorne** supplies · **Michael** rules (the code lane is his) |
| Buildability | **Charlie Lawler** — a different question from code, and never conflated with it |
| ClickUp structure + fields | **Corey** builds · **Michael** approves options first (Custom Field Gate) |
| FileMaker forms, matrix, archive | **Fiona** builds · she **consults** and never edits repo apps |
| The trigger, the chase, what's owed | **Milo** |
| Welfare, training status, THE CALL | **Milo** — the people half. **Hawthorne owns the hazard; Milo owns whether we stop.** |
| Seating any of the above | **Mira** decides · **Felix** owns the directory. **Never Michael** (`team-standard.md` v1.9) |

**The seam that will bite: the desk step is where system and judgment meet, and no tool can hold it.**

---

## Open, and NOT settled by this spec

1. **Q8 — where the assessment instance runs.** ClickUp task + relationship, FileMaker join record, or
   born-in-ClickUp-frozen-to-FMP. **This spec works under any of the three.**
2. **Q5 scope — the species sort is a hard precondition.** Four kinds of row are mixed in the hazard
   library and ~10 are controls filed as hazards. **Nothing below layer 2 moves until it is sorted.**
   Michael struck clean-as-we-go.
3. **The archive verb.** Unowned, blocks layer 8.
4. **The dual-expression ruling.** Blocks Corey on layer 2. One ruling should close all three instances.
5. **The no-blame policy for when the operator is no longer Michael.** Unwritten.
6. **ANSI E1.46-2018 is unread.** Every citation in the workspace is 2016.
