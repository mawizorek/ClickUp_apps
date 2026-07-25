# Session Transcript Gate — Decision Log

> Why this gate is shaped the way it is. Reversals, scars, rejected options, and Michael rulings live here so the runtime gate stays lean. Newest on top of each cluster; the gate itself carries no changelog.
>
> Sibling runtime file: `brain-config/gates/session-transcript-gate.md`

---

## 2026-07-25 · D10 · Runtime gate trimmed; history moved here

**Decision:** the gate is reduced to runtime-critical procedure. Rationale prose, drift post-mortems, rejected options, cost analysis, and the full changelog move into this file.

**Why:** the gate had reached 34,351 bytes, effectively tied with `session-close.md` (34,741) before its own trim the same day. Both are sibling files from the same 07-16 to 07-21 amendment burst, and both grew the same way: every new rule got a narrative section, a Rules-list entry, and a repeat inside Composes-with or the changelog. Past roughly 22KB on disk a file stops being safely editable, because it can no longer be guaranteed to read back whole, and a file you cannot read whole you cannot safely rewrite.

**The pattern worth naming:** two sibling files independently hit the same wall within days of each other. That is not coincidence, it is the amendment habit. Any tool that accepts frequent rulings will do this unless provenance has somewhere else to live.

**Status:** locked.

---

## 2026-07-21 · D9 · Hardcode Mode (`/session-hardcode`)

**Decision:** added an opt-in, mid-session-toggleable fidelity flag. ON gives true 1:1 verbatim capture, two comments per turn. OFF, the default, keeps faithful-not-verbatim.

**Why:** some stretches genuinely deserve a court record, most do not. A permanent verbatim posture would roughly double per-turn writes and bloat every task thread.

**Cost, named and accepted:** doubled comment writes and faster thread growth during hardcode stretches. That is exactly why it is opt-in rather than default.

**Companion ruling:** the close artifact mirrors the mode. If hardcode was active, the close `.txt` and its in-chat toggle go verbatim too. Mixed sessions keep each turn in whichever mode was live when it landed.

**Boundary:** governs Michael-to-Brain capture fidelity only. Agent deliberation still follows the two-tier protocol unchanged.

**Status:** locked. Source: Michael.

---

## 2026-07-17 (i) · D8 · Two-tier Workshop Post Protocol

**Decision:** deliberation is always two tiers. Tier 1 is a single Opening Post by Mira that prompts the team. Tier 2 is one threaded reply per seated voice, nested under that parent.

**Why:** the gate governed how one comment looked but never how the whole deliberation was shaped, so output drifted three ways across runs: a lump comment with voices bulleted inside it, a proper header plus threaded replies, and a bare summary with no inline voices at all. Only the middle one was ever correct. Locking the container kills all three drift variants at once.

**Rejected option:** copying the templates into each agent profile. That is twenty files drifting out of sync. Templates live in the gate; profiles carry a pointer.

**Status:** locked. Source: Michael, decision 1A / Mira / Ship.

---

## 2026-07-17 (h) · D7 · Phantom list id corrected

**Decision:** the canonical board is `901327879922`. The previously hardcoded `901328269587` referenced no existing list.

**Why:** a hardcoded id that resolves to nothing fails silently and sends every downstream instruction into a void. Added an explicit canonical-pointers block with direct URLs so the id is verifiable at a glance rather than trusted.

**Status:** locked. Source: Michael.

---

## 2026-07-17 (f) · D6 · "Never reconstruct from memory" retired

**Decision:** retired the absolute. A lapse now degrades to a flagged reconstructed transcript rather than a blank task.

**Why:** the old rule was right that live capture beats reconstruction, and wrong that reconstruction is worse than nothing. A blank session task is the actual worst outcome. Two fallbacks replace the absolute: a close-time watchdog, and mid-session catch-up that backfills to message 1.

**Important nuance:** this must never be read as permission to skip live capture. Real-time is still the standard; the fallback exists so a failure is recoverable, not so it is acceptable.

**Status:** locked. Source: Michael.

---

## 2026-07-17 (e) · D5 · The thread moved onto the session task

**Decision:** the live thread is the comment stream on the session's Agent Activity Board task. The A.I. Prompts channel is demoted to fallback plus permanent close-summary home.

**Why:** deliberation belongs where the work is, accruing turn by turn, not in a separate channel that has to be reconciled later. This also defined three words that had been left to guess: session, thread, and chat.

**Status:** locked. Source: Michael.

---

## 2026-07-17 (d2) · D4 · Badge headers replace the code-chip format

**Decision:** each agent comment is an emoji badge plus bold name, then a full-markdown body.

**Why:** the prior code-chip plus forced blockquote shape segmented well but flattened personality into uniform gray text. The whole value of multi-voice deliberation is that you can tell who is talking without reading the name tag.

**Status:** locked, supersedes the d format.

---

## 2026-07-17 (d) · D3 · A session with agent deliberation is non-discardable

**Decision:** the open-then-discard rule gets a hard exception. If any agent posted deliberation, the session was substantive by definition and the record survives.

**Why:** without this, a cleanup pass could delete a real multi-voice reasoning record on a technicality.

**Status:** locked.

---

## 2026-07-17 (c) · D2 · Thread-only agent expression

**Decision:** Council and Workshop agents express only as comments on the session task, never in the live chat and never in a working doc. Brain's synthesized reply and Mira's anchor line are the only live output.

**Why, and this is the load-bearing part:** if the only place an agent can speak is the session task, then a working session structurally cannot proceed without that task existing. The record stops competing with momentum and becomes a precondition. This is the single most important design choice in the gate.

**Status:** locked. Source: Michael.

---

## 2026-07-17 (b) · D1 · Fire earlier, open-then-discard

**Decision:** bias all the way toward opening. Open a silent provisional record for anything that is not an obvious lookup, and discard the stub at close if the session stayed trivial. Added deterministic triggers that require no judgment call.

**Why the cost math settles it:** a discarded stub costs nothing. A missed transcript costs a hazy close-time reconstruction. Asymmetric cost means the bias belongs on the open side, and discretion is the thing that keeps losing to work momentum.

**Status:** locked.

---

## 2026-07-16 · D0 · Capture split from finalization

**Decision:** transcript capture is its own gate, separate from the close hook that finalizes it.

**Why:** capture is a live, always-on concern; finalization is an end-of-session event. Merging them meant the capture rules only got read at close, which is exactly too late to capture anything.

**Status:** locked. Owner: Scribe Sana, with Closing Clio finalizing.
