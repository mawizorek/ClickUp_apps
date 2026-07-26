# Session Transcript Gate — Decision Log

> Why this gate is shaped the way it is. Reversals, scars, rejected options, and Michael rulings live here so the runtime gate stays lean. Newest on top of each cluster; the gate itself carries no changelog.
>
> Sibling runtime file: `brain-config/gates/session-transcript-gate.md`

---

## 2026-07-25/26 · D11 · The Session Spine (write-ahead per-reply log)

**Decision:** a per-reply, cross-session, append-only chronological log lives on the Agent Activity Board CHANNEL (https://app.clickup.com/36074068/chat/r/6-901327879922-8). One header POST per session; one line per reply threaded under it. It REPLACES the per-reply task transcript comment. Write-ahead of the reply.

**The problem, in Michael's words:** "you keep walking on top of yourself, and it would be nice to have one place where each reply is stored."

**Root cause, and it is not what it looked like.** The opening question was about WRITE cost (chat vs task comment vs doc vs git commit). Writes turned out to be a red herring: a chat message and a task comment cost the same, one call, no read. The actual defect was READS. Every existing surface is siloed per session — decision logs answer *why* per item, the Session Ledger answers *what shipped* this session, handoff tasks answer *what next* one hop out. **Nothing answered "what have I already tried across the last twenty sessions,"** which is exactly where self-contradiction comes from. The spine is the first cross-session read surface.

**Swap, not addition (the load-bearing constraint).** Two writes per reply means the cheaper-to-skip one gets skipped, and the spine is the skippable one because nothing downstream breaks without it. Precedent: the `Follow Up` tag and the three Agent Activity Board custom fields, all specced, all live, **0 of 11 tasks populated any of them**. So the spine REPLACES the per-reply task comment rather than joining it. Cost stays flat at one write per turn.

**Write-ahead means ahead of the REPLY, not ahead of the work.** Michael ruled "definitely write-ahead"; Rhys narrowed it. A true WAL logs intent before the mutation, which here would mean logging what the turn is *about to* do — wrong every time a tool fails or the work changes shape. The seam is `anchor line → tool work → spine line → prose reply`: the one point where the outcome is known and nothing has been said yet. Never ahead of the first token (FIRST TOKEN RULE wins).

**Never-block, and it was validated on turn two of real use.** A failed spine write ships the reply anyway with a visible gap marker. Rhys's argument: a log that can refuse writes is a lock, and locks do not belong on the reply path. This fired for real on 07-26 when the original channel went unreachable mid-session — reply shipped, gap marked, line backfilled. Specced one day, proven the next.

**Enforcement is the whole question; three tiers, only two work.** (1) An index row alone is worthless — that is the Follow Up tag's grave. (2) **Self-arming**: posting the session header returns the parent message ID, so the target exists and there is no flag to remember. This is the same property that makes the existing task gate work (opening the task IS the switch). (3) **Make it load-bearing** — the eventual boot-read (v2) turns a missing line from a compliance failure into a visible cold start. Consequence beats discipline. Plus a close-time reply/line count as a scoreboard, because we had been measuring nothing.

**What LOSES to the spine (Enzo's rule: name it before shipping, or you get split-brain).**
1. **The per-reply task transcript comment** — superseded outright.
2. **The A.I. Prompts close summary prose** — shrinks to a pointer. It was a second chronological record of the same sessions keyed differently. The `.txt` artifact + toggle SURVIVE: "pointer" governs prose, not the artifact.
3. **The clickbot task-activity automation on the board channel** — retired. Evidence: 3 days of history, 100 messages, every one an identical contentless `[object_type:task](url)` ping with no verb, no field, no actor, one task firing ~15 times. Same job as the spine, zero information. Michael: "not super helpful."

**Rejected: a dedicated new channel (`ai-sessions-log`).** Built and armed first, then abandoned. Three reasons: it was attached to the wrong parent list (`AME 292 - Acoustics Portfolio`, an unrelated course list); it added a fifth capture surface when the board channel already existed and is list-attached to the actual session list; and **it proved unreliable** — wrote fine at 19:58, then every path (URL, raw ID, read and write) failed the next morning while the board channel accepted a write first try. Frank's self-correction is the lesson: he ruled the CONCEPT a fold-in but let a net-new CONTAINER through without checking for an existing home. **A fold-in check applies to the container, not just the idea.**

**Scar: `Insufficient access permissions` is a lying error.** The chat tool returns it for a channel it cannot RESOLVE BY NAME, not only for one it cannot access. This cost most of a session chasing "private channel" and then "indexing lag," both wrong — the channel was public with a fresh message in it. **Resolve the spine by URL/ID, never by name.** Now a hard rule in the gate.

**Format rulings.** One line, never a paragraph (Polly: the moment an entry becomes three bullets, the channel is unscannable and you are reading transcripts again). Fixed field order, greppable, because the difference between an index and a diary is whether the lines have the same shape (Cleo). Mobile-safe, no fences or wide tables. **Date prefix mandatory** — this very session crossed midnight and the original bare `HH:MM` format broke chronology on day one.

**Session header = a POST, turns = plain threaded messages.** Posts are root-only, titled, and render collapsed-prominent, which makes the channel's ROOT LEVEL a scannable session index. A post per reply would be catastrophic: prominence on every routine turn destroys scannability, and posts cannot thread, so the session grouping would collapse. Named honestly as legibility, not capability.

**Seams held deliberately.** Fidelity on the TASK, chronology on the SPINE — so hardcode's two-comments-per-turn does not break the one-line format. Chronology only, never inventory: the Session Ledger overlaps at ~40% and stays separate; if the spine ever carries built/changed inventory it crosses Frank's 60% merge line and one of them must die.

**Scope fenced (Skye).** v1 = channel + arming + line format + gate edit + close reconciliation. **The boot-read is v2** — Finn showed the read cost is the only thing that grows (writing to a 5,000-message channel is free; reading it back is not), so mitigation is never read the whole spine, read the last N or the header roots only. Building the consumer before the producer has real volume is designing against a guess. Cleo's derive-the-task-transcript-from-the-spine idea is v3 at the earliest, and Sana objected on merit: a stalled session's task must not go blank, because the task-IS-the-record-of-where-it-stalled property is load-bearing.

**Status:** locked. Source: Michael. Workshop: Frank, Rhys, Cleo, Finn, Skye, Enzo, Polly, Sana, conducted by Mira.

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

**Status:** locked. Source: Michael. *(Partially superseded by D11: per-reply chronology moved to the spine; deliberation stays here.)*

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
