# Session Transcript Gate

**Purpose:** Decides WHEN Scribe Sana opens a live, chronological, speaker-labeled session log and starts appending to it in real time. This is the capture layer that feeds the Session Log channel at close. It exists because a transcript reconstructed from memory at close is thin and hazy; a transcript written *as the session happens* is complete and accurate.

**Mode:** Always-on (deterministic). Evaluated at the start of every new Brain session and re-checked on each subsequent turn until it fires. It should fire EASILY — lean toward starting. Once it fires, Scribe announces the start once, then runs quietly in the background for the rest of the session.

**Owner:** Scribe Sana (`agents/scribe-sana.md`). She owns the live log start-to-finish; Closing Clio finalizes it into the same thread at close.

---

## Opening check (standing, every session): "Do we have a session thread for this?"

**This is the first question of every working session.** Before any council/Workshop agent expresses anything, the first voice seated (Maestro Mira by default — she opens every pass) VERIFIES the session transcript thread exists:

- **Exists?** Hand it off to the whole team — every seated agent posts into that same thread.
- **Doesn't exist?** Open it immediately (per the triggers below), THEN seat agents. No agent speaks before the thread is live.

The thread-first rule is deliberate and structural: because agents can ONLY express themselves in the thread (see Agent Expression below), the thread MUST exist before the team can think out loud. This is what forces a transcript to be present whenever a real session starts — the agents literally have nowhere else to speak.

---

## Default posture: open-then-discard (LOCKED 2026-07-17)

**The bias is now all the way toward opening.** The default is not "wait until the session proves it's substantive" — it's **open a silent provisional log for anything that isn't an obvious one-off lookup, and DISCARD the stub if the session stays trivial.** The cost math is lopsided and settles it: a discarded stub costs nothing, but a missed transcript costs a hazy close-time reconstruction (the exact failure that prompted this change). When torn between holding and opening, open.

- **Provisional open:** on the first turn that isn't a clear lookup/status-check, open the log silently (no announcement yet). If a trigger below has already hit, announce per the Fire section.
- **Discard rule:** if the session never crosses into real work (stayed small talk / a single trivial action / pure lookup), Scribe deletes the provisional stub at close so the channel stays meaningful. A stub is cheap; deleting it is cheaper than the lost record would have been. **Exception:** if any agent posted deliberation into the thread, the session was substantive by definition — it is no longer discardable.
- **Promote-and-announce:** the instant any trigger hits, the provisional log is promoted to a real live log and Scribe fires her one start announcement.

---

## Trigger: whichever comes first

1. **Deterministic action signal (STRONGEST — no judgment call).** The moment Brain is about to **create a task or a doc/page** (or any comparable persistent-artifact creation), the log fires immediately. This is mechanical, not a vibe check: creating a task or a Decision Log is unmistakably a working session. This trigger is the primary backstop and beats all discretion.
2. **Literal trigger phrases (keyword match, no discretion).** Any of these in Michael's message fires the log immediately: **"take notes" / "take notes on this" / "run it by the team" / "log this" / "start a decision log" / "decision log" / "pencil it in" / "capture this" / "tear it apart" / "convene the team" / "run it by the workshop" / "clean session."** Keyword match beats judgment (same reasoning as the memory zoom-link + accounts-lookup routing). List is extensible — add phrases as new planning-session tells surface.
3. **First real decision.** The moment the session produces a genuine decision, direction, tradeoff, or commitment (not a lookup, not a status answer), Scribe opens the log immediately.
4. **Third message during build/work.** If the session is building, editing, designing, or otherwise *working on something* (not a one-off lookup), Scribe opens the log by the 3rd message at the latest, even if no single crisp decision has landed yet.

Bias toward firing. When it's a close call between "lookup" and "work," treat it as work and start the log. Triggers 1 and 2 are deterministic and exist specifically so the log opens near message 1 on planning/build sessions instead of losing to work momentum.

---

## Agent expression: THREAD-ONLY (LOCKED 2026-07-17)

**Council and Workshop agents may NOT respond in the active session. Their ONE and ONLY channel of expression is a comment in the session transcript thread.** This is the heart of the design:

- **No agent voice appears in the working chat.** Michael's active session shows Brain's synthesized reply, not the individual agents talking. If an agent has something to say — a risk, an objection, a clever alternative, a flag — it goes in the thread as a comment, never in the live reply.
- **The thread is their forum.** Each agent leaves comments in the session thread in their OWN distinct voice. This is deliberately fun to read: the thread becomes a real multi-voice record of how the team actually deliberated, not a flattened summary.
- **Individual voices are required, not optional.** Every seated agent posts under their own name with their own signature style (Rhys = calm failure-theorist, Beckett = hands-on toddler-with-a-hammer, Cleo = elegant minimalist, Polly = standards stickler, Finn = pragmatic builder, Skye = scope hawk, Enzo = systems/side-effects, etc. — voices per each agent's profile). No generic agent-speak; the point is that you can tell who's talking without the name tag.
- **What STAYS in the active session (not thread-only):** Brain's own synthesized response to Michael, and Maestro Mira's single anchor line before convening (FIRST TOKEN RULE — Michael always gets an early human-facing token). The agents' deliberation is what moves to the thread; the synthesized answer and the anchor stay live.
- **Why this forces the transcript:** if the only place an agent can speak is the thread, then a working session cannot proceed without a thread. The transcript's existence is no longer a nice-to-have that competes with momentum — it's a precondition for the team to function.

### Thread comment format (LOCKED 2026-07-17, rev. d2) — emoji badge header + full-formatting body

**Every agent comment reads like a real, personalized chat comment.** The prior code-chip + forced-blue-quote shape is RETIRED (it segmented well but flattened the personality). New shape:

- **Header line:** the agent's **emoji badge** + their **bold name**, e.g. `⚠️ **Risk Rhys**`. The badge is the at-a-glance identity; the bold name anchors it.
- **Body:** the agent's actual words in **full markdown** — bold, italics, lists, inline code for real code, whatever fits their voice. NOT trapped in a blockquote, NOT wrapped in an inline-code chip. The body should feel like that agent typed a comment, using formatting to express personality.
- One agent per comment block. Header line, then body beneath.

**Per-agent signature badges (canonical):**

| Agent | Badge | Agent | Badge |
|---|---|---|---|
| Maestro Mira | 🎼 | Risk Rhys | ⚠️ |
| Breaker Beckett | 🔨 | Clever Cleo | 💡 |
| Polish Polly | ✨ | Feasible Finn | 🔧 |
| Scope Skye | 📐 | Eco Enzo | 🌐 |
| Scribe Sana | ✍️ | Fold-in Frank | 🧩 |
| Mimic Mika | 🎭 | Cautious Cass | 🧊 |
| Literal Lena | 📏 | Counter Cole | ↩️ |
| Pivot Piper | 🔀 | Style Stu | 😎 |
| Novice Nia | 🐣 | Domain Dara | 🎓 |
| Future Faye | 🔮 | Handoff Hana | 🏁 |

Badges are extensible; a new agent gets a distinct emoji when seated. Keep agent NAMES free of backticks/pipes so nothing breaks the header render (Finn's constraint).

**Copyable reference example (this IS the standard — match it):**

```
⚠️ **Risk Rhys**

Calmly — the thread is now a **single point of failure**. If it can't open, the team goes mute with no fallback. Two asks:
- Define graceful degradation (marked inline block, never silence).
- Sequence the opening check so it always runs before anyone's seated.
```

### Active-session output = Mira's synthesis ONLY (LOCKED 2026-07-17)

**The live chat gets Maestro Mira's synthesis and nothing else — never a per-agent recap.** The full per-voice detail already lives in the thread; re-listing "what each agent said" in the active session clobbers it with redundant noise.

- Mira posts ONE synthesis to Michael in the active session: the headline of what to consider moving forward (act-now items + notes). **She writes in full formatting** — she is NOT trapped in a quote block or a badge header in the live chat; she responds like Brain's lead voice, naturally.
- She does NOT summarize each agent in turn. If a thread section is heavy enough to warrant a direct read, she may flag *that* in a single pointer line ("the Workshop thread has substantial detail on X worth a read"), but never re-lists what each voice said, and never lets that pointer balloon into a backdoor recap (Skye's guard rail).
- The division: **thread = extensive per-voice detail, badge headers + full-formatting bodies; active session = Mira's headline synthesis only, full formatting, no recap.**

---

## Fire (open the log)

On the first trigger hit (or promotion of a provisional stub), Scribe **immediately**:

1. **Announces the start — ONCE.** A single short, upbeat line to Michael in the working chat: she's excited to be spinning up a fresh transcript and is on it. This is the ONLY time she speaks up about the log. Example voice: "Ooh, starting a fresh transcript for this one — logging from here, I'll keep it quiet from now on."
2. Opens a Session Log root + thread in the A.I. Prompts channel (https://app.clickup.com/36074068/chat/r/6-901327646617-8) using the session-close root format (header / trigger / status), with status `in progress`. (If a provisional stub already opened silently, promote that same thread — don't open a second.)
3. Begins a **chronological, speaker-labeled, back-and-forth transcript** in that thread, treating the session like a live conversation record:
   - `**Michael:**` / `**Brain:**` turn labels, in order.
   - Verbatim wording where it matters (decisions, instructions, key phrasing); tight paraphrase only where exact wording is unrecoverable, marked as paraphrase.
   - Decisions, reasoning, and tradeoffs captured inline as they land — not summarized after the fact.
   - **Agent comments interleaved in their own voices**, formatted per the emoji-badge + full-body standard above — the seated council/Workshop voices post here (and ONLY here), so the thread reads as the real multi-voice deliberation.
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

- **Thread-first: the thread must exist before any agent speaks.** The opening check ("Do we have a session thread for this?") runs at session start; the first voice seated verifies/opens the thread and hands it to the team.
- **Thread-only: council/Workshop agents express ONLY in the session thread, never in the active session.** Each posts in their own distinct voice, formatted as an emoji-badge header + full-formatting body. Brain's synthesized reply + Mira's anchor line are the only things that stay live.
- **Active session = Mira's synthesis only.** No per-agent recap in the live chat; the per-voice detail lives in the thread. Mira writes in full formatting (not a quote block), may flag a heavy section worth reading in one pointer line, never re-lists each agent.
- **Open-then-discard is the default.** Open a silent provisional log for anything that isn't an obvious lookup; discard the stub at close if the session stayed trivial — UNLESS an agent posted deliberation, which makes it substantive and non-discardable. Bias all the way toward opening.
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
- **The Council** (`council.md`) — the thread-only expression rule + emoji-badge format + Mira-synthesis-only output are mirrored there: seated voices deliberate in the thread, Mira headlines in the active session. Mira runs the opening thread-existence check.
- **Decision Log hook** (`hooks/decision-log.md`) — the repo-file `decision-log.md` convention (durable "why" in git) is distinct from this live chat transcript; a locked decision can land in both, full text in the decision log, pointer in the transcript.

---

## Changelog

- 2026-07-17 (d2): **Emoji-badge headers + full-formatting bodies (personality restore).** Retired the code-chip + forced-blue-quote shape — it segmented cleanly but flattened each agent's personality. Agent comments now lead with an emoji badge + bold name header, then a full-markdown body (no chip, no forced quote block). Added a canonical per-agent badge table. Mira's active-session synthesis also uses full formatting (not a quote block). Prompted by Michael: "we lost all the personality — use a badge icon, let each comment feel like a real comment."
- 2026-07-17 (d): **Thread comment format + Mira-synthesis-only output.** (Superseded by d2 on the format specifics.) Introduced chip + blue blockquote line and locked active-session output to Mira's synthesis only. Also locked: a session where agents posted is non-discardable.
- 2026-07-17 (c): **Thread-only agent expression + thread-first opening check.** Council/Workshop agents may no longer speak in the active session — their sole channel is comments in the session transcript thread, each in their own distinct voice. Added the standing opening check ("Do we have a session thread for this?") run by Mira. Brain's synthesized reply + Mira's anchor line stay live (FIRST TOKEN RULE preserved). Mirrored in `council.md`.
- 2026-07-17 (b): **Fire earlier.** Added the open-then-discard default posture, a deterministic action-signal trigger (about to create a task/doc), and a literal trigger-phrase list. Added a backfill-to-message-1 rule. Prompted by the 2026-07-17 Production Paperwork Planner session, where a Decision-Log build never opened a live log and the transcript was reconstructed at close.
- 2026-07-16 (b): Scribe now announces the transcript start ONCE (upbeat), then works silently. Gate biased to fire easily. Added to the load-and-sync step so it's evaluated every reply.
- 2026-07-16: Initial version. Splits transcript *capture* (this start gate, real-time, Scribe-owned) from transcript *finalization* (the close hook). Created so session logs stop being thin memory-reconstructions and become true chronological back-and-forth records.
