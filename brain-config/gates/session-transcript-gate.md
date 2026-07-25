# Session Transcript Gate

**Purpose:** decides WHEN the live session record opens and WHERE it lives. Capture layer.  
**Mode:** always-on, deterministic. Re-checked each turn until it fires. Bias hard toward firing.  
**Owner:** Scribe Sana. Closing Clio finalizes at close.  
**Decision history:** `brain-config/gates/session-transcript-gate.decision-log.md`

---

## Canonical pointers

- **PRIMARY — 🟢 Agent Activity Board:** list `901327879922` · https://app.clickup.com/36074068/v/li/901327879922. One task per session; transcript and deliberation are comments on it.
- **FALLBACK — #A.I. Prompts:** https://app.clickup.com/36074068/chat/r/6-901327646617-8. Backup when no task can be created, and home of the permanent close summary.

Full task-side spec: Agent Activity Board — Gold Standard.

---

## Where the thread lives

- **Session** = one task on the Agent Activity Board.
- **Thread** = the comment stream on that task. All live agent deliberation lands there.
- **Chat** = fallback plus permanent close-summary home. Not active deliberation.

---

## Opening check (every session)

First question of every working session, run by Mira before any voice is seated:

- **Task exists?** Hand its comment stream to the team.
- **No task?** Create it, then seat agents. No agent speaks before the thread is live.

---

## Default posture: open-then-discard

- **Provisional open:** first turn that isn't a clear lookup, open silently, no announcement yet.
- **Discard:** if the session stayed trivial, delete the stub at close.
- **Exception:** if any agent posted deliberation, the session is substantive and non-discardable.
- **Promote:** on any trigger hit, promote the stub and fire the one announcement.

---

## Triggers (whichever comes first)

1. **Deterministic action signal.** About to create a task, doc, or comparable persistent artifact. No judgment call.
2. **Literal trigger phrases.** "take notes" · "run it by the team" · "log this" · "start a decision log" · "decision log" · "pencil it in" · "capture this" · "tear it apart" · "convene the team" · "run it by the workshop" · "clean session" · "create the task" · "start your session task". Extensible.
3. **First real decision.**
4. **Third message during build/work.** Backstop, not a delay.

---

## Mid-session catch-up

A late trigger opens the record AND backfills everything since message 1. Opening late never means starting the record at the open point.

---

## Agent expression: THREAD-ONLY

- No agent voice in the live chat. Objections, risks, alternatives all go on the task.
- Each agent posts in its own distinct voice.
- Deliberation never lands in a working doc. A doc gets a synthesis block plus pointer.
- **Stays live:** Brain's synthesized reply and Mira's single anchor line.

### Comment format

Header = emoji badge + bold name. Body = full markdown, not blockquoted, not code-chipped. One agent per comment.

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

Extensible. Keep agent names free of backticks and pipes.

### Thread structure: two-tier Workshop Post Protocol

**Tier 1 — Opening Post.** One parent comment, always by Mira, that prompts the team. Never a summary of conclusions.

```
🎼 Workshop convened — <topic>

On the table: <one line — what we're deciding or building>

Team, weigh in on:
1. <X> — <the specific question>
2. <Y> — <the specific question>
3. <Z> — <the specific question>

Seated: <badges + names of the voices convened>
Reply in-thread with your lens. Read what's above you before you post.
```

**Tier 2 — Agent Replies.** Each seated voice posts a THREADED reply nested under the parent. One agent per reply.

```
<badge> <Agent Name>

<the take, in the agent's own voice, addressing the X / Y / Z on the table — full markdown>

<cross-talk: name at least one colleague and agree / extend / challenge>
<verdict where the role calls for one: pass / adjust / halt>
```

**Never:** a lump comment with voices bulleted inside it, a bare summary with no inline voices, or a pile of un-nested root comments. Threading is literal, replies use the Opening Post as `parent_comment`.

**Single source:** these templates live here only. `council.md` mirrors a one-line law; profiles carry a pointer, never a copy.

### Live chat output = Mira's synthesis only

One synthesis to Michael, full formatting, no per-agent recap. She may flag a heavy thread section in a single pointer line, never a backdoor recap.

---

## Fire

1. **Announce once.** One short upbeat line, then silence for the rest of the session.
2. **Ensure the task exists** on the board. Reuse if present, promote the stub if one opened silently, create if neither.
3. **Begin the chronological, speaker-labeled record** in comments: `**Michael:**` / `**Brain:**` turn labels, verbatim only where wording matters, decisions captured inline, agent comments interleaved per the format above. Backfill pre-trigger turns.
4. **Keep appending live.**

After the announcement: no re-announcing, no narrating entries, no asking permission.

---

## Hardcode Mode (`/session-hardcode`)

Per-session fidelity toggle. Default is faithful-not-verbatim; hardcode is true 1:1.

- **`/session-hardcode`** — ON, mid-session invocable, applies forward only.
- **`/session-hardcode=off`** — OFF. Alias: **`/session-softcode`**.

**End-prompt gate:** capture Michael's prompt verbatim only once the full thought has landed. Never chop a multi-message thought into fragments.

**Two comments per turn under hardcode:**
1. `**Michael (verbatim):**` — word-for-word, typos included, no cleanup.
2. References/displayed — links loaded or emitted, artifacts created, key values shown.

**Close artifact mirrors the mode.** Hardcode-active sessions get a verbatim close `.txt` and toggle. Mixed sessions keep each turn in the mode active when it landed.

Governs Michael-to-Brain capture fidelity only. Agent deliberation format is unchanged.

---

## Backfill fallback

1. **Close-time watchdog.** At close, if the task holds no coherent transcript, reconstruct the best faithful version and post it **flagged as reconstructed**.
2. **Mid-session catch-up.** See above.

Live capture is the standard. The fallback makes a lapse recoverable, not acceptable.

---

## Close

- Run the watchdog first.
- Flip the task state and confirm the deliberation is intact.
- Produce the close summary in #A.I. Prompts per the Session Close hook: summary plus task pointer, never a re-created transcript. Honor hardcode fidelity if it was active.
- Hand Closing Clio the finalized task and close post.

If the gate never fired, discard the provisional stub and close normally.

---

## Rules

- Thread lives on the session task. Chat is fallback plus close-summary home.
- Thread-first: the task exists before any agent speaks.
- Thread-only: agents express on the task, never live, never in a working doc.
- Two-tier protocol governs thread structure. Templates live here only.
- Live chat gets Mira's synthesis only.
- Open-then-discard is the default; agent deliberation makes a session non-discardable.
- Deterministic triggers beat discretion.
- Fire once, fire easily.
- Announce exactly once.
- First decision beats the message count.
- Backfill to message 1.
- Prefer live capture; backfill rather than lose the record.
- Faithful, not verbatim, unless hardcode is on.
- Hardcode is a fidelity toggle, not a new gate.
- Silent after the announcement.

---

## Composes with

- **Session Close hook** (`hooks/session-close.md`) — produces the permanent close post; honors hardcode fidelity.
- **Session Transcript Format** (AI Toolkit) — the close artifact container spec.
- **Scribe Sana** (`agents/scribe-sana.md`) — owner and operator.
- **Maestro Mira** — runs the opening check, posts the Tier-1 Opening Post.
- **The Council** (`council.md`) — mirrors the expression law as one line.
- **Agent Activity Board** — the board and its Gold Standard.
- **Decision Log hook** — durable why, distinct from live deliberation.
