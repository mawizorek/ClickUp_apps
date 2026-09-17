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

## 🔴 NEW BLOCKER, AND THIS ONE IS REAL (measured 2026-09-17)

**`memory.md` now measures 30,811 bytes, taken from its own write response.** That is **above** the
~30KB threshold where the GitHub MCP Operating Standard documents corruption — so the next write to
that file is genuinely at risk, and the condense pass that was owed as hygiene is now owed as a
prerequisite.

⚠️ **I grew it while draining the parking lot** — the three folded entries plus two new method rules
from this session's findings. **Ironic and worth recording: clearing a false blocker created a true
one.** 🚫 **Nothing is culled without Michael.** The base spec's route is warm content out to
`memory/archive/`; candidates are the URITP repo map table (already duplicated in the AI Toolkit
index) and the ADA / E1.46 clause detail, which is reference rather than pattern.

## Revision log

- **2026-09-17** — From-scratch config reload at Michael's request. Parked block drained (3 → memory, 2 → activity log). `preferences.md`: **Songs for a New World added to KNOW THE SEASON** as failure #4 (the folders returned six shows, the table listed five), and the Load Manifest **repointed off the retired `activity-log.md`** onto the Agent Index row — a repoint that had been pending since 2026-09-07. Byte-count self-claims removed from `memory.md`.
- **2026-08-10** — Safety RA architecture session (Hawthorne seated). Five entries parked for fold-in; `memory.md` condense pass named as the blocker. **✅ drained 2026-09-17; the blocker was false.**
- **2026-07-15** — Declaration folder scaffolded by the Fleet Steward (README pointer + PENDING preferences stub + this file). Awaiting a verbatim paste of Milo's live config before the first audit.

## Next spec / open threads

- 🔴 **`memory.md` condense pass — now BLOCKING its own next write at 30,811 bytes.** Warm content to `memory/archive/`; nothing culled without Michael. See the blocker section above for candidates.
- ✅ ~~Blocker for audit: `preferences.md` needs Milo's live config pasted verbatim~~ — RESOLVED: `preferences.md` has been the canonical full profile since 2026-07-21 and was extended again 2026-09-17. **The audit is no longer blocked on this and can be scheduled.**
- Confirm with Michael: **is `Songs for a New World` a URITP mainstage slot, a student production, or an external/EOT booking?** Its folder carries dated milestones through Dec 13 but **no dated first rehearsal, designer run, opening, closing, strike or load-out** — so its spine cannot be assessed for staleness at all until its KIND is settled. Blocks correct roll-call treatment.
- Confirm with Michael: Milo's exact triggers and profile URL, and whether his activity-log channel is `12cwjm-56633` (recorded as such from the Creation & Setup Checklist doc — mark confirmed once verified). ⚠️ Note the activity LOG itself now lives as comments on Agent Index row `86ajtqmru`; the channel question is separate and still open.
- **The two `memory.md` size claims are gone, but the same defect class lives elsewhere in the fleet.** Any bundle quoting its own byte count is carrying the same rot. Worth a scoped sweep — Anna leads if it becomes a formal pass.
