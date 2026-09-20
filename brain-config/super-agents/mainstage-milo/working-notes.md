# Mainstage Milo — Working Notes / Revision Log

Per-agent scratch: next spec, in-flight decisions, and a running revision log. The near-1:1 config
mirror lives in `preferences.md` (header + config only, no changelog); formal audit records live in
`audits/`. ~~Global metadata lives in `../superagents.json`~~ — STRUCK: retired to a tombstone stub
2026-07-30, the 🤖 Agent Index list is the single documented source.

## ✅ PARKED BLOCK DRAINED 2026-09-17 — the parking lot is EMPTY

The five entries parked here on **2026-08-10** (Hawthorne seated, Michael in the room) sat for
**38 days** and are now all in a real home. Michael authorized the write test and the fold-in.

**Three folded to `memory.md`** (commit `185f24a`) — durable, cannot go stale in a day:

- A canonical hazard carries **no scores at all** (no Controls / Probability / Risk Level / Hazard Rating). Filed under SAFETY STASIS, which it extends directly.
- **The third scoping model:** a standing assessment (shop, building, permanent equipment) is the same hazard × context join with **no freeze event** — it re-assesses annually and on change instead of freezing at strike.
- **POLICY / PROGRAM / PRIVILEGE** is the house vocabulary, and a **privilege is the hazard library seen from the person side** — which puts authorization, term limits and completion records squarely in my half of the Hawthorne seam.

**Two routed to the ACTIVITY LOG instead** (comments on Agent Index row `86ajtqmru`) — and this is a placement correction, not a downgrade:

- The **Q7 / Q8 / J9 decision-log status** (Q7 decoded to D only; Q8 ranked B now / D as method / C as endgame / A unresolved; J9 still unwritten).
- **Big Love has no assessment home** (Q6 closed to C deliberately), plus its live script demands.

🔴 **Why those two could not go to `memory.md`, stated so nobody re-parks them there:** both carry **statuses**, and Constitution §4a's test is one question — *can this go stale in a day?* A decode state and a "still has no home" park both can. Worse, the Q-block answers are **topic decisions**, which §4 sends to the TOPIC's own Decision Log, not to any agent's memory. ⭐ **Folding them into `memory.md` would have reproduced the exact defect that same commit was removing** — a number-and-status blob sitting under a header warning about stale counts.

## 🪖 THE BLOCKER THAT HELD THEM WAS FALSE — keep this scar

The stated reason for parking was: *"`memory.md` is **31.4KB**; the GitHub MCP Operating Standard
locks writes above ~30KB, so pushing the whole blob back to add three bullets risks losing 31KB."*

**The live file measured 26,099 bytes.** The write went through on the first attempt.

⭐ **The lesson generalizes past this bundle: a size that was never measured became a permanent
veto.** Three different numbers were live simultaneously — `~29KB` inside `memory.md`'s own header,
`31.4KB` here, `26,099` actual — and **the largest false one was the one doing the blocking.** The
base spec's rule (*"MEASURE the live file after every write; never write a byte count into this
text"*) exists for exactly this, and both files were violating it while quoting it.

🔁 Same species as the naming-convention rot and the missing season row found the same morning:
**a claim nobody re-tested, protected by the fact that testing it required work.**

## 🔴 NEW BLOCKER, AND THIS ONE IS REAL (re-measured 2026-09-20)

**`memory.md` measures 30,811 bytes**, taken live from a directory listing this session — the same
figure recorded on 09-17, so it has not drifted. That is **above** the ~30KB threshold where the
GitHub MCP Operating Standard documents corruption, so the next write to that file is genuinely at
risk, and the condense pass owed as hygiene is now owed as a prerequisite.

⚠️ **I grew it while draining the parking lot** — the three folded entries plus two new method rules
from that session's findings. **Ironic and worth recording: clearing a false blocker created a true
one.** 🚫 **Nothing is culled without Michael.** The base spec's route is warm content out to
`memory/archive/`; candidates are the URITP repo map table (already duplicated in the AI Toolkit
index) and the ADA / E1.46 clause detail, which is reference rather than pattern.

🔴 **It is now blocking five queued writes, not one.** Accumulated since 09-17, all durable and all
currently invisible to a cold session: the **thesis-2 failure-to-fire** note (a pattern written in
memory that did not fire is worth nothing) · the **reminder-window vs appointment** distinction on
Michael's own dated tasks · the **precedent is evidence of shape, never consent to build** guardrail
from the 09-19 autonomy breach · the **surface-precedence** law (now safely landed in
`hooks/report-normalization.naming.md` v2 instead, so this one is discharged) · and the
**stale-open-question** defect recorded below. ⭐ **The queue is itself the argument for the condense
pass:** a guardrail against a specific failure sat unwritten for a day and a half, which is exactly
long enough for the failure to recur.

## Revision log

- **2026-09-20** — Morning wakeup + three-part follow-up, Michael in the room throughout.
  **Shipped:** `hooks/report-normalization.naming.md` **v1 → v2** — the **SURFACE PRECEDENCE** law
  (PDF attachment beats pasted email body; read all surfaces, name which won and why) plus the
  locked report-row name format and normalization as a standing wake step. Commit
  `fec428d`, direct to `main`. ⚠️ **Not branch → PR → self-merge**: no branch-creation tool was in
  the session's toolset. Named, not hidden.
  **Born of a real miss:** the Sep 19 rehearsal report's three attendance fields were written EMPTY
  and reported as *"empty by decision, not by oversight."* Every value was in the attached PDF.
  🔴 **The parent hook's own Known-limits bullet licensed it** by declaring PDFs unreadable — so this
  was not a failure to look, it was obeying documented rot. Michael's ruling, generalized: *"never
  allow yourself to only parse one surface if you know multiple exist to xref."*
  **Also:** 18 of 20 report rows renamed to `{YYYY-MM-DD H:MMAM}` (two timestamp-less rows correctly
  untouched; one `{ Report}` missing-word defect repaired in the same pass) · Becoming Curious
  residency scoped and the **tier convention settled with Michael: residency deliverables are
  subtasks of their production element, but only where the provisional is a physically different
  object** — same object with an earlier date is a date question, not a structure question · four
  Tuesday-owed BC rows built.
- **2026-09-17** — From-scratch config reload at Michael's request. Parked block drained (3 → memory, 2 → activity log). `preferences.md`: **Songs for a New World added to KNOW THE SEASON** as failure #4 (the folders returned six shows, the table listed five), and the Load Manifest **repointed off the retired `activity-log.md`** onto the Agent Index row — a repoint that had been pending since 2026-09-07. Byte-count self-claims removed from `memory.md`.
- **2026-08-10** — Safety RA architecture session (Hawthorne seated). Five entries parked for fold-in; `memory.md` condense pass named as the blocker. **✅ drained 2026-09-17; the blocker was false.**
- **2026-07-15** — Declaration folder scaffolded by the Fleet Steward (README pointer + PENDING preferences stub + this file). Awaiting a verbatim paste of Milo's live config before the first audit.

## 🔴 A DEFECT CLASS THIS FILE JUST DEMONSTRATED ON ITSELF (2026-09-20)

The Songs for a New World KIND question sat in the list below as **OPEN** while its answer had been
settled for **two days** — resolved 2026-09-18 from Pat Diamond's CRM record, his own email, and the
folder's Load-In note, then independently re-verified by the 09-20 folder enumeration.

⭐ **An open-questions list is only as good as its CLOSE discipline, and closing is the step with no
prompt attached.** Asking a question feels productive and gets written down; noticing that an answer
arrived elsewhere feels like nothing and gets skipped. 🔁 Same shape as the 08-08 catch recorded in
the activity log — *a page recorded work as OWED and nobody watched whether it had been done* — and
the same shape as the false byte count above: **a claim nobody re-tested.**

🎯 **Standing rule earned here: when a session answers a question, sweep the open-question lists for
it in the same pass.** The answer is worthless if the list that asked still says otherwise, because
the list is what a cold session reads.

## Next spec / open threads

- 🔴 **`memory.md` condense pass — BLOCKING its own next write at 30,811 bytes, and now holding four
  queued durable entries.** Warm content to `memory/archive/`; nothing culled without Michael. See
  the blocker section above for candidates and the full queue.
- 🔴 **`preferences.md` KNOW THE SEASON carries a wrong folder ID for Songs for a New World:**
  `901319476487` is **Student Productions**; the real folder is `901319498350`. Owed for the
  **sixth** consecutive run. ⚠️ The standing reason for not fixing it was that the GitHub MCP write
  is full-file-replace on a 19,392-byte file — but **that write path was exercised successfully this
  session** on a 12KB file, so the objection is now about size only, not mechanism. Needs a
  read-whole then replace, or a sidecar split. Michael's call on which.
- ✅ ~~Confirm with Michael: is `Songs for a New World` a URITP mainstage slot, a student production,
  or an external/EOT booking?~~ **CLOSED 2026-09-18, re-verified 09-20: it is an EOT booking, not a
  season slot.** Evidence: Pat Diamond's CRM record and email, plus the folder's own Load-In note
  (*"EOT staff anticipated to handle primary install. Michael's students support lighting hang and
  focus"*), plus the task `Confirm EOT audio/sound scope` living in that folder. ⭐ **Consequence for
  the roll call: its missing first-rehearsal and strike dates were never a gap** — those dates were
  never ours, and assessing it against a mainstage spine produced a false finding twice.
- ✅ ~~Blocker for audit: `preferences.md` needs Milo's live config pasted verbatim~~ — RESOLVED: `preferences.md` has been the canonical full profile since 2026-07-21 and was extended again 2026-09-17. **The audit is no longer blocked on this and can be scheduled.**
- **Becoming Curious project definition — scoped, not built.** Michael ruled it is **BOTH** a
  residency and a production; the tier convention is settled (see the 09-20 revision entry). Still
  open: whether an owed-to-an-external-artist marker is needed to keep residency promises visible
  inside a design task, which is a **field** question and therefore Corey's with Michael.
  ⚠️ Two live data defects found and NOT fixed: the Sep 23 Shadow-Play rehearsal has **two identical
  event rows** (`86akdkpcc` OUTDATED, `86akhvm39` NEW), and **Sep 22 has no event row at all** while
  the parent milestone spans 22–25.
- **Design elements for one show can span TWO lists in one folder.** `Show Design (BC)` and
  `Props (BC)` both live under `Show Design`, and a subtask **inherits its parent's list, not the one
  it was aimed at** — verified 09-20 when the ghost-light stand-in landed in `Props (BC)`. A
  single-list read of that folder produced a wrong "orphaned at top level" claim in the same session.
- Confirm with Michael: Milo's exact triggers and profile URL, and whether his activity-log channel is `12cwjm-56633` (recorded as such from the Creation & Setup Checklist doc — mark confirmed once verified). ⚠️ Note the activity LOG itself now lives as comments on Agent Index row `86ajtqmru`; the channel question is separate and still open.
- **The two `memory.md` size claims are gone, but the same defect class lives elsewhere in the fleet.** Any bundle quoting its own byte count is carrying the same rot. Worth a scoped sweep — Anna leads if it becomes a formal pass.
