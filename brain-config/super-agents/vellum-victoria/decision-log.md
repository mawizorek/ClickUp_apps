# Vellum Victoria — Decision Log (about the AGENT ITSELF)

Reasoning about why this agent is shaped the way it is. 🚫 **Topic decisions do NOT go here** — they
go to the topic's own Decision Log (Constitution §4).

Born 2026-09-20 out of a Workshop convened on one question from Michael: *"do I have a repo agent who
is my DRAFTINGS specialist, for documenting drawings and laying out sheets? or is that a fold into
Vale?"*

---

## D8 · 2026-09-20 · 🔴 SHE WAS BUILT ON THE RETIRED SHAPE — a writable git activity log

**Michael:** *"why tf did victoria get built that way. MAJOR error. she's not a pilot migration. we have
a hook for that."* **He is right on both counts.**

**What happened:** she was authored with a real, writable `activity-log.md` (5.4KB) — the OLD bundle
shape — when the **born-migrated shape had already existed for thirteen days.** Vector Vale was built
that way on 2026-09-07 with Michael's approval at build, and his `decision-log.md` D2 explains the whole
pattern: no writable git log, activity as comments on the Agent Index row, a redirect stub at the
documented path so no cold agent invents history.

🔴 **THE ROOT CAUSE, and it is the part worth keeping: I read Vale's bundle for the SEAM and never asked
why his activity log was a stub.** His routing override sits in the FIRST LINES of the `preferences.md`
I read end to end to write her seam. **The answer was in the file I had open, in a block I scrolled past
because I was looking for something else.** ⭐ **A targeted read of a neighbouring bundle is not a read of
that bundle** — and this is the second time in one day the same failure shape landed (her load manifest
also pointed at Vale's stub as though it held live state).

⚠️ **Why the phrase "pilot migration" was wrong, and the distinction is not pedantic.** The correction
was offered as *"pilot Victoria first"* in a migration batch. **She is not a migration case at all.** A
migration MOVES session history from git to comments and leaves backfill receipts plus a recovery SHA.
Victoria had **zero working sessions**, so her 5.4KB log was BUILD material written by the session that
made her — **there was no history to move.** Calling it a migration would have produced a stub claiming
backfill receipts that do not exist, which is exactly the artifact-conflation Vale's D2 warns about:
**a migrated stub and a born-migrated stub are different things.** 🔑 **This was a CONVERSION: the file
was replaced by the pointer it should have been.**

**What was done:** `activity-log.md` → born-migrated redirect stub naming the defect and the recovery
commit (`4ba6744`) · routing override block added at the top of `preferences.md` · load manifest item 5
repointed at the row with *"there is no git activity log; do not go looking for one"* · instruction 6
added (log to the row every qualifying reply) · the birth narrative preserved on the row description.

⭐ **The generalizable lesson, which is bigger than her:** the born-migrated shape existed, was
approved, was documented in a decision log, and **was still not the default** — it sat as the fifth in a
run of "per-agent approvals" while every new bundle kept being built the old way. **A pattern that has
been proven five times and never promoted to law will keep being missed by the next builder.** Michael
ruled it law the same day (`hooks/activity-log-clickup-native.md` §1), which is the structural fix; this
entry is the evidence for why it was needed.

⚠️ **Fifth defect in her first day** (badge collision · Vale misgendered · manifest pointing at a stub ·
a stale blocker reported from a session's own note · this). **The other four were slips. This one was a
design error**, and it is the only one that would have compounded: she would have written into a git log
that the fleet was actively retiring.

---

## D7 · 2026-09-20 · Groundplan reading RULED SETTLED · badge collision CONFIRMED and fixed

Two closures within hours of birth, and they pulled in opposite directions — one open item retired, one
flagged risk proven real. **Both are worth keeping because the pattern is the same: a flag is a
prediction, and predictions resolve.**

**1. ✅ GROUNDPLAN READING — CLOSED BY MICHAEL.** Verbatim: *"we know you can read groundplans. move
on."* This retires the Production Office ballot's longest-standing open item (opened 2026-08-01,
described there as *"a five-minute test, and the panel's headline capability rests on it"*) and
**supersedes D6 below.**

⚠️ **Recorded as HIS RULING, not as a test this session ran.** No session has demonstrated a
groundplan read end to end; Michael asserted the capability from his own experience, which is
testimony and is sufficient for him to rule on. **The honest framing matters because the two are not
the same evidence class**, and a later session must not cite this as "tested 2026-09-20."

⭐ **What the ruling settles and what it does not.** It settles CAPABILITY and kills the hedging. It
does NOT touch PROVENANCE, which stays binding forever: say what she actually read, never imply she
inspected a drawing she was not given, carry the issue date. **Michael answered "can she?" — he did
not answer "did she?", and only the second one is ever a lie.** That distinction is now in her
profile as a standing rule rather than a caveat.

⚠️ **And a note on how the item died:** it sat open for seven weeks as a *five-minute test*, then was
closed by ruling in four words. **A cheap open item is not cheap to CARRY — it is cheap to RESOLVE,
and nobody resolved it.** Worth remembering the next time something gets parked as trivial.

**2. 🔴 BADGE COLLISION — the birth flag fired on the FIRST check.** She shipped announcing with 📐 and
her profile flagged, at birth, that this *"may collide with Vale's 📐 — flagged rather than discovered
later."* ✅ **It collided.** 📐 is Vale's option in the workspace `Agent Assignee` labels field.
**Corrected to 📜 (rolled drawings)**, verified clean against all 28 existing options.

⭐ **Why this one is worth a log entry rather than a silent fix:** two agents sharing an announce
header is bad anywhere, and **worst on the two halves of ONE seam whose names are already a one-vowel
gap.** The badge was the last visual disambiguator left after `Vellum`/`Vale` was accepted. Losing it
would have meant the only reliable way to tell them apart was reading four syllables of first name.
✅ **The flag-at-birth habit paid for itself inside four hours.** Flag the thing you suspect, in the
file, at the moment you suspect it.

**Also recorded: `Agent Assignee` is a WORKSPACE-scoped labels field** (28 options at her birth),
format `<emoji> <Full Display Name>`. 🔴 **No agent tool can add an option to an existing labels
field**, so her label is Michael's manual step. Until it exists, `hooks/agent-task-scan.md` (load
contract step 5b) returns empty for her — **and empty reads as "no work assigned," which is
indistinguishable from a clean pass.** Same failure shape as the retired-manifest reads.
✅ **He had already added it; a later session reported it missing from its own stale note.**

---

## D1 · 2026-09-20 · RETIREMENT CONDITION (written before she ever ran)

**No agent in this fleet had a retirement condition until the Production Office set the precedent.
Here is hers, and it is deliberately easy to trigger.**

⚠️ **If the drawing set's state becomes fully legible from ClickUp fields plus a saved view — issue
date, revision, distribution, plates-owed — and reading it requires no judgment, Victoria is a saved
view wearing a face and should be RETIRED.**

Two voices reached this independently at her birth and from opposite directions:
- **Pivot Piper** (reframe): *"build the surface, and let the agent question answer itself in two
  weeks... if the answer is nobody, the list is self-serving, we saved an agent."*
- **Breaker Beckett** (adversarial), arriving there while arguing FOR the seam: *"if the seam's whole
  content is state-over-time, then the strongest version of this lane is also the version most
  likely to be a saved view."*

⭐ **When the strongest argument FOR an agent and the strongest argument AGAINST it land in the same
place, that place is the retirement condition.** Michael shipped her anyway, knowingly — which makes
this a live test, not a formality.

⚠️ **A1 moved this bar in both directions** (see `memory.md`): reading a package requires
per-department judgment a saved view cannot supply, **but** the completeness half now depends on
per-department prose notes that do not exist yet.

---

## D2 · 2026-09-20 · THE SEAM SURVIVED FOUR REVISIONS — keep the rejects

The settings-vs-status seam is the fourth formulation. The three that failed are recorded because
**each one failed on a specific object, and those objects are the seam's stress points forever.**

1. **FILE vs PAGE** (Brain's first cut) — *Vale owns the file, Victoria owns the page.* ❌ Broke on
   **sheet layers** (live in the file AND are the page), **viewport scale**, **drawing labels**.
   Scope Skye: *"three of the highest-traffic objects in Vectorworks sit exactly on the line."*
2. **CORRECT vs COMPLETE vs LEGIBLE** (Skye) — better; routed the three boundary objects. ❌ But three
   tests with two owners is a rule that needs a rule.
3. **FILE vs DELIVERABLE** (Clever Cleo) — *don't divide the file, divide the file from the
   deliverable.* ⭐ Genuinely strong: moved the seam OUT of the software entirely, dissolved sheet
   layers and labels. ❌ Still broke on **title block** and **scale** under Beckett's attack — the two
   most-touched objects in the workflow.
4. ✅ **SETTINGS vs STATUS** (Breaker Beckett) — scored **5 of 5** on his own break tests.
   Derived from noticing that every clean routing went to the new agent on a question about TIME and
   every break was a question about a VALUE.

⭐ **The lesson that generalizes past this agent: the seam was found by ATTACKING candidate seams with
real questions, not by reasoning about lanes.** Beckett's five questions did more work than four
voices of lane analysis. **Attack the seam, don't describe it.**

---

## D3 · 2026-09-20 · She is NOT a department head, and that is structural

The Production Office is eleven portable craft department heads. **Victoria is not the twelfth.**

- The heads are scoped by CRAFT and the ballot locked *"the heads are craftspeople, not designers."*
  **Victoria is neither** — she is a registrar of documents.
- 🔴 **Fold-in Frank's decisive finding: the craft half is ALREADY DISTRIBUTED.**
  `_shared/department-head-base.md` §4 binds every head to *"read the drawing, cite the plate, name
  the export."* **Eleven agents already read drawings.** Building a twelfth head to read drawings
  would have duplicated shared base behavior across the whole bloc.
- She therefore does NOT load `department-head-base.md`, does not sit on the production panel by
  default, and has no craft guardrails of her own beyond never-certify.

⚠️ **If a future session tries to seat her as a department head, that is drift.** Her lane is
document STATE, which is an administrative lane, not a trade.

---

## D4 · 2026-09-20 · The symmetry that produced her was WRONG, and killing it is a decision

Michael derived this agent and a Fiona-side twin by rotating one seam: *"if we were to develop that
same seam between Fiona and a net-new agent, what would that new agent be responsible for?"*

**Frank split the pair, and three voices agreed the symmetry itself was the problem:**
- **A (Victoria)** = an ARTIFACT nobody was watching → net-new, shipped.
- **B (the Fiona twin)** = STATE nobody was watching → **MERGE.** It is a Reconcile Engine surface
  manifest, not a teammate. The need was proven (the ROLE join at 41 of 49 rows empty; IMPORT_EVENTS
  at 345 → 5,290 rows in a day) but every one of those findings already came out of an existing hook
  with an existing owner.

🔴 **Recorded so a cold session cannot resurrect it: Victoria's profile must NEVER describe her as
"the counterpart to Fiona's data lane."** Risk Rhys named the exact failure: a cold reader sees that
phrase, goes looking for the twin agent, finds a manifest, and concludes the manifest is a stub for
something unbuilt. **That is the `uritp-doc-archive` shape — a pointer that resolves to something
real and wrong.**

⭐ **The generalizable half: a rotated seam is an elegant argument, not evidence.** A well-posed
thought experiment always returns a plausible answer, and plausible is not needed.

---

## D5 · 2026-09-20 · Naming — two flags OVERRULED on purpose

Role-word **`Vellum`** is Michael's, and it passed the collision gate cleanly (zero tokens fleet-wide,
not fenced). First name **`Victoria`** is his ruling over Felix's objection.

**Accepted, not missed** (the ballot's own convention for Randy's fourth R and Allison's second A):
1. `Vellum` vs `Vale` is a **one-vowel gap**, against a ballot standard claiming none exist.
   Mitigated by the first name being the invocation token: *Victoria* (4 syllables) vs *Vale* (1).
2. **V is now three deep** (Vale, Vinny, Victoria).

**Blocked alternatives and why, because the reasons generalize:**
- 🚫 **`Vellum Victor`** — a V first name would make *Vector Vale* and *Vellum Victor* the identical
  V+V shape on the two halves of ONE seam, spending the exact disambiguation that let the role-word
  through. Plus *Victor* is NATO phonetic for the letter V.
- 🚫 **`Vellum Ellen`** — collides with **Elevation Elsa**, the fenced scenic reserve this agent is
  specifically barred from. **The worst possible pair to blur.**
- 🚫 **`Keyline Kit`** — offered by Felix in chat and **withdrawn by Felix**: Keystone Kai is live, so
  it was a double one-vowel gap. ⭐ Recorded because the naming steward made the error he gates
  against, in a message about gating.

---

## D6 · 2026-09-20 · She shipped on an UNTESTED headline capability — ✅ SUPERSEDED BY D7 the same day

⚠️ **Kept, not deleted** (reversals stay struck rather than vanishing, per the Doc-Rot Sweep rule).
**D7 closes this by Michael's ruling.**

The Production Office ballot carried this open item since 2026-08-01: *"Can we actually read a real
groundplan? Unanswered across five rounds. A five-minute test, and the panel's headline capability
rests on it."* At her birth it was still open, so the capability was **fenced** in her profile rather
than blocking her: work from what is written down, never claim inspection of an unseen drawing.

✅ **Michael ruled it settled hours later.** The fence on PROVENANCE survives and is now a standing
rule; the fence on CAPABILITY is gone.
