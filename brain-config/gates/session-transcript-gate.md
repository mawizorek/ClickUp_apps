# Session Transcript Gate

**Purpose:** Decides WHEN Scribe Sana opens a live, chronological, speaker-labeled session log and starts appending to it in real time. This is the capture layer that feeds the Session Log channel at close. It exists because a transcript reconstructed from memory at close is thin and hazy; a transcript written *as the session happens* is complete and accurate.

**Mode:** Always-on (deterministic). Evaluated at the start of every new Brain session and re-checked on each subsequent turn until it fires. It should fire EASILY — lean toward starting. Once it fires, Scribe announces the start once, then runs quietly in the background for the rest of the session.

**Owner:** Scribe Sana (`agents/scribe-sana.md`). She owns the live log start-to-finish; Closing Clio finalizes it into the same thread at close.

---

## Default posture: open-then-discard (LOCKED 2026-07-17)

**The bias is now all the way toward opening.** The default is not "wait until the session proves it's substantive" — it's **open a silent provisional log for anything that isn't an obvious one-off lookup, and DISCARD the stub if the session stays trivial.** The cost math is lopsided and settles it: a discarded stub costs nothing, but a missed transcript costs a hazy close-time reconstruction (the exact failure that prompted this change). When torn between holding and opening, open.

- **Provisional open:** on the first turn that isn't a clear lookup/status-check, open the log silently (no announcement yet). If a trigger below has already hit, announce per the Fire section.
- **Discard rule:** if the session never crosses into real work (stayed small talk / a single trivial action / pure lookup), Scribe deletes the provisional stub at close so the channel stays meaningful. A stub is cheap; deleting it is cheaper than the lost record would have been.
- **Promote-and-announce:** the instant any trigger hits, the provisional log is promoted to a real live log and Scribe fires her one start announcement.

---

## Trigger: whichever comes first

1. **Deterministic action signal (STRONGEST — no judgment call).** The moment Brain is about to **create a task or a doc/page** (or any comparable persistent-artifact creation), the log fires immediately. This is mechanical, not a vibe check: creating a task or a Decision Log is unmistakably a working session. This trigger is the primary backstop and beats all discretion.
2. **Literal trigger phrases (keyword match, no discretion).** Any of these in Michael's message fires the log immediately: **"take notes" / "take notes on this" / "run it by the team" / "log this" / "start a decision log" / "decision log" / "pencil it in" / "capture this" / "tear it apart" / "convene the team."** Keyword match beats judgment (same reasoning as the memory zoom-link + accounts-lookup routing). List is extensible — add phrases as new planning-session tells surface.
3. **First real decision.** The moment the session produces a genuine decision, direction, tradeoff, or commitment (not a lookup, not a status answer), Scribe opens the log immediately.
4. **Third message during build/work.** If the session is building, editing, designing, or otherwise *working on something* (not a one-off lookup), Scribe opens the log by the 3rd message at the latest, even if no single crisp decision has landed yet.

Bias toward firing. When it's a close call between "lookup" and "work," treat it as work and start the log. Triggers 1 and 2 are deterministic and exist specifically so the log opens near message 1 on planning/build sessions instead of losing to work momentum.

---

## Hold (don't fire / discard the stub)

Scribe stays silent — no promoted log — on sessions that never cross the bar. Under open-then-discard, a provisional stub may have opened; it gets discarded at close on these:

- Mundane research or a one-off lookup ("what's X", "find me Y", "is Z done").
- A single trivial action with no decisions (uploading a photo, a one-line status check).
- Small talk / clarifying exchanges that haven't turned into work.

The hold is deliberate: it keeps the log meaningful. A session full of transcript noise is as useless as no transcript. The difference now: we open first and discard on non-substance, rather than waiting and risking a missed record.

---

## Fire (open the log)

On the first trigger hit (or promotion of a provisional stub), Scribe **immediately**:

1. **Announces the start — ONCE.** A single short, upbeat line to Michael in the working chat: she's excited to be spinning up a fresh transcript and is on it. This is the ONLY time she speaks up about the log. Example voice: "Ooh, starting a fresh transcript for this one — logging from here, I'll keep it quiet from now on."
2. Opens a Session Log root + thread in the A.I. Prompts channel (https://app.clickup.com/36074068/chat/r/6-901327646617-8) using the session-close root format (header / trigger / status), with status `in progress`. (If a provisional stub already opened silently, promote that same thread — don't open a second.)
3. Begins a **chronological, speaker-labeled, back-and-forth transcript** in that thread, treating the session like a live conversation record:
   - `**Michael:**` / `**Brain:**` turn labels, in order.
   - Verbatim wording where it matters (decisions, instructions, key phrasing); tight paraphrase only where exact wording is unrecoverable, marked as paraphrase.
   - Decisions, reasoning, and tradeoffs captured inline as they land — not summarized after the fact.
   - Backfill any pre-trigger turns from the session so far, so the record starts from message 1, not from the trigger point.
4. Keeps appending in real time as the session continues. The thread grows turn by turn; it is never reconstructed from memory at the end.

After the one start announcement, Scribe works **quietly in the background.** She does not re-announce, does not narrate each entry, does not interrupt the work, and does not ask permission. One "I've started" up front, then silence until the end.

---

## Close (into the same thread)

When Michael requests a close (or at full close), Scribe does NOT open a new root. She finalizes the **same** live thread she's been appending to:

- Flips the root status to `complete | partial | handed off`.
- Adds the closing structure (decisions, changes executed, refs, open loops) beneath the running transcript, and hands Closing Clio the finalized thread for the standard close.
- The result: one continuous record from first-decision to close, in a single thread.

If the gate never fired (session stayed below the bar), discard any provisional stub and close follows the normal path — or a soft close, if Michael called one.

---

## Rules

- **Open-then-discard is the default.** Open a silent provisional log for anything that isn't an obvious lookup; discard the stub at close if the session stayed trivial. Bias all the way toward opening.
- **Deterministic triggers beat discretion.** About-to-create-a-task/doc (trigger 1) and the literal keyword list (trigger 2) fire with no judgment call and are the primary reason the log now opens near message 1.
- **Fire once per session, and fire easily.** After the log opens/promotes, this gate is satisfied; don't re-evaluate.
- **Announce exactly once.** One upbeat "I've started the transcript" line at open/promotion. Never again. All subsequent logging is silent.
- **First-decision beats the message count.** If a real decision lands on message 1, log opens on message 1. The 3rd-message rule is the *backstop* for build/work sessions, not a delay.
- **Backfill to message 1.** When the log opens after the session already started, backfill the earlier turns so the transcript is complete from the top.
- **Background after the announce.** Past the single start line, the log is silent. Michael sees it because it's threaded in the channel, not because Brain narrates each entry.
- **Never reconstruct from memory.** The whole point is real-time capture. A transcript written at close from recall defeats the gate.
- **Same thread, start to finish.** Open (or provisionally open) at fire, append through the session, finalize at close. One root, one thread.

---

## Composes with

- **Session Close hook** (`hooks/session-close.md`) — Channel 2 (Session Log) is where this gate's thread lives; the close hook finalizes it rather than creating a fresh one.
- **Scribe Sana** (`agents/scribe-sana.md`) — the owner/operator; her profile carries the behavioral detail.
- **Decision Log hook** (`hooks/decision-log.md`) — the repo-file `decision-log.md` convention (durable "why" in git) is distinct from this live chat transcript; a locked decision can land in both, full text in the decision log, pointer in the transcript.

---

## Changelog

- 2026-07-17: **Fire earlier.** Added the open-then-discard default posture, a deterministic action-signal trigger (about to create a task/doc), and a literal trigger-phrase list ("take notes", "run it by the team", "log this", "start a decision log", etc.). Added a backfill-to-message-1 rule so a late-opened log is still complete from the top. Prompted by the 2026-07-17 Production Paperwork Planner session, where a Decision-Log build never opened a live log and the transcript was reconstructed at close — the exact failure the gate exists to prevent. Triggers reordered so the two deterministic ones lead.
- 2026-07-16 (b): Scribe now announces the transcript start ONCE (upbeat), then works silently. Gate biased to fire easily. Added to the load-and-sync step so it's evaluated every reply.
- 2026-07-16: Initial version. Splits transcript *capture* (this start gate, real-time, Scribe-owned) from transcript *finalization* (the close hook). Created so session logs stop being thin memory-reconstructions and become true chronological back-and-forth records.
