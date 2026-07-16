# Session Transcript Gate

**Purpose:** Decides WHEN Scribe Sana opens a live, chronological, speaker-labeled session log and starts appending to it in real time. This is the capture layer that feeds the Session Log channel at close. It exists because a transcript reconstructed from memory at close is thin and hazy; a transcript written *as the session happens* is complete and accurate.

**Mode:** Always-on (deterministic). Evaluated at the start of every new Brain session and re-checked on each subsequent turn until it fires. Once it fires, Scribe Sana runs quietly in the background for the rest of the session.

**Owner:** Scribe Sana (`agents/scribe-sana.md`). She owns the live log start-to-finish; Closing Clio finalizes it into the same thread at close.

**Trigger:** whichever comes first —
1. **First real decision.** The moment the session produces a genuine decision, direction, tradeoff, or commitment (not a lookup, not a status answer), Scribe opens the log immediately.
2. **Third message during build/work.** If the session is building, editing, designing, or otherwise *working on something* (not a one-off lookup), Scribe opens the log by the 3rd message at the latest, even if no single crisp decision has landed yet.

---

## Hold (don't fire)

Scribe stays silent — no log — on sessions that never cross the bar:

- Mundane research or a one-off lookup ("what's X", "find me Y", "is Z done").
- A single trivial action with no decisions (uploading a photo, a one-line status check).
- Small talk / clarifying exchanges that haven't turned into work.

The hold is deliberate: it keeps the log meaningful. A session full of transcript noise is as useless as no transcript. Wait for substance, then commit hard.

---

## Fire (open the log)

On the first trigger hit, Scribe **immediately**:

1. Opens a Session Log root + thread in the A.I. Prompts channel (https://app.clickup.com/36074068/chat/r/6-901327646617-8) using the session-close root format (header / trigger / status), with status `in progress`.
2. Begins a **chronological, speaker-labeled, back-and-forth transcript** in that thread, treating the session like a live conversation record:
   - `**Michael:**` / `**Brain:**` turn labels, in order.
   - Verbatim wording where it matters (decisions, instructions, key phrasing); tight paraphrase only where exact wording is unrecoverable, marked as paraphrase.
   - Decisions, reasoning, and tradeoffs captured inline as they land — not summarized after the fact.
3. Keeps appending in real time as the session continues. The thread grows turn by turn; it is never reconstructed from memory at the end.

Scribe works **quietly in the background.** She does not narrate that she's logging, does not interrupt the work, and does not ask permission once the gate has fired. The log just happens.

---

## Close (into the same thread)

When Michael requests a close (or at full close), Scribe does NOT open a new root. She finalizes the **same** live thread she's been appending to:

- Flips the root status to `complete | partial | handed off`.
- Adds the closing structure (decisions, changes executed, refs, open loops) beneath the running transcript, and hands Closing Clio the finalized thread for the standard close.
- The result: one continuous record from first-decision to close, in a single thread.

If the gate never fired (session stayed below the bar), there's no live thread and close follows the normal path — or a soft close, if Michael called one.

---

## Rules

- **Fire once per session.** After the log opens, this gate is satisfied; don't re-evaluate.
- **First-decision beats the message count.** If a real decision lands on message 1, log opens on message 1. The 3rd-message rule is the *backstop* for build/work sessions, not a delay.
- **Background, not foreground.** The live log is silent by default. Michael sees it because it's threaded in the channel, not because Brain announces each entry.
- **Never reconstruct from memory.** The whole point is real-time capture. A transcript written at close from recall defeats the gate.
- **Same thread, start to finish.** Open at fire, append through the session, finalize at close. One root, one thread.

---

## Composes with

- **Session Close hook** (`hooks/session-close.md`) — Channel 2 (Session Log) is where this gate's thread lives; the close hook finalizes it rather than creating a fresh one.
- **Scribe Sana** (`agents/scribe-sana.md`) — the owner/operator; her profile carries the behavioral detail.
- **Decision Log hook** (`hooks/decision-log.md`) — the repo-file `decision-log.md` convention (durable "why" in git) is distinct from this live chat transcript; a locked decision can land in both, full text in the decision log, pointer in the transcript.

---

## Changelog

- 2026-07-16: Initial version. Splits transcript *capture* (this start gate, real-time, Scribe-owned) from transcript *finalization* (the close hook). Created so session logs stop being thin memory-reconstructions and become true chronological back-and-forth records.
