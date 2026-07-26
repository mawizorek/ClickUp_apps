# Session Transcript Gate

**Purpose:** decides WHEN the live session record opens and WHERE it lives. Capture layer.  
**Mode:** always-on, deterministic. Re-checked each turn until it fires. Bias hard toward firing.  
**Owner:** Scribe Sana. Closing Clio finalizes at close.  
**Decision history:** `brain-config/gates/session-transcript-gate.decision-log.md`

---

## Canonical pointers

- **PRIMARY (deliberation + detail) — 🟢 Agent Activity Board list:** `901327879922` · https://app.clickup.com/36074068/v/li/901327879922. One task per session; deliberation and structural beats are comments on it.
- **PRIMARY (chronology) — the SPINE, the 🟢 Agent Activity Board CHANNEL:** https://app.clickup.com/36074068/chat/r/6-901327879922-8 (id `4026841195912677667`). One header post per session; one line per reply threaded under it. Cross-session, append-only.
- **FALLBACK — #A.I. Prompts:** https://app.clickup.com/36074068/chat/r/6-901327646617-8. Home of the permanent close POINTER (no longer a second chronological record).

Full task-side spec: Agent Activity Board — Gold Standard.

**⚠️ Resolve the spine channel by URL or ID, NEVER by name.** Name lookup fails and returns `Insufficient access permissions`, which reads like a permissions problem and is not one. Do not diagnose it as private, do not diagnose it as too new. Use the URL.

---

## Where the record lives (two surfaces, one job each)

- **Session** = one task on the Agent Activity Board.
- **Task** = deliberation, structural beats (open / pickup / blocker / close), the Session Ledger, and full fidelity. All agent voices land here.
- **Spine** = the channel. Chronology only: one line per reply, every session, forever. This is the only surface that reads ACROSS sessions.
- **Chat** = the close pointer. Not deliberation, not a transcript.

**The seam:** fidelity lives on the TASK, chronology lives on the SPINE. The spine carries no inventory (that is the Session Ledger) and no deliberation (that is the task).

---

## THE SPINE (per-reply, write-ahead)

### Why it exists

Every other surface is siloed per session. Decision logs answer *why* per item; the Ledger answers *what shipped* this session; handoff tasks answer *what next*, one hop. Nothing answered **"what have I already tried across the last twenty sessions,"** which is where repeated work and self-contradiction come from. The spine is that surface.

### Arming (this IS the switch)

At session open, post the **session header POST** to the spine channel (root level, `create_as_post: true`, `post_type: update`). The returned message ID is the `parent_message` for every spine line for the rest of the session. There is no flag to remember and nothing to opt into: if the header exists, the target exists.

Header post body:

```
**Session:** <agent> (<model>) · <scope>
**Opened:** <date> <time> ET
**Scope:** <lists / docs / repos in play>
**Session task:** <URL>

Spine lines thread under this post, one per reply, written ahead of the reply.
```

### Write-ahead ordering (HARD)

Write-ahead means **ahead of the REPLY, not ahead of the work**:

```
anchor line (first token)  →  tool work  →  SPINE LINE  →  prose reply
```

That is the only point in a turn where the outcome is known and nothing has been said yet. Logging before the work logs intentions, which go stale the moment a tool fails. Logging after the reply is the afterthought this replaces. Turns with no tool work still write the line before the reply; same rule, no special case.

**Never ahead of the first token.** The FIRST TOKEN RULE wins: emit visible text to Michael before the spine write, always.

### Line format (fixed fields, no improvisation)

```
MM-DD HH:MM · <session task URL> · <one clause: what happened> · tools: a, b, c
```

- ONE line. Never a paragraph, never bullets. Depth belongs on the task.
- The date prefix is mandatory: sessions cross midnight and bare `HH:MM` breaks chronology.
- Mobile-safe: no fenced blocks, no tables, no line-leading markdown markers.
- Greppable, not prose. Same field order every time. A spine you cannot grep is a diary.

### Completeness (HARD)

Every substantive reply gets a line, **including corrections, wrong turns, and walked-back claims.** Those are precisely the turns that cause an agent to walk on top of itself, so a spine that only logs wins is worthless. A trivial turn ("np", a bare lookup) does not need one.

### Never-block (HARD)

A failed spine write **NEVER blocks a reply.** If the write fails: ship the reply anyway with a visible `⚠️ spine write failed` marker, then backfill the line when the surface returns. An unbackfilled gap stays marked — a record that lies about being complete is worse than a visible hole. Capture matters; it does not matter more than answering.

### Backfill

A spine armed late backfills to message 1, flagged `⚠️ BACKFILL — reconstructed, not live`. Arming late never means starting the record at the arming point.

### Hardcode seam

Under `/session-hardcode` the two-comments-per-turn verbatim capture stays on the TASK. The spine keeps its single line, pointing at it. Fidelity on the task, chronology on the spine — so the one-line format survives hardcode instead of breaking under it.

### Superseded by the spine

- **The per-reply task transcript comment.** The spine REPLACES it, one write per reply, not two. Structural beats (open, pickup, blocker, close) still go on the task.
- **The A.I. Prompts close summary prose.** Shrinks to a pointer (see `hooks/session-close.md`). The close `.txt` artifact and its toggle are unaffected.
- **The clickbot task-activity automation on the board channel.** Contentless duplicate of this job; retired.

---

## Opening check (every session)

First question of every working session, run by Mira before any voice is seated:

- **Task exists?** Hand its comment stream to the team.
- **No task?** Create it, then seat agents. No agent speaks before the thread is live.
- **Spine armed?** Post the header. Do this at open, not at first substantive turn.

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

A late trigger opens the record AND backfills everything since message 1. Opening late never means starting the record at the open point. Applies to the task and the spine alike.

---

## Agent expression: THREAD-ONLY

- No agent voice in the live chat. Objections, risks, alternatives all go on the task.
- Each agent posts in its own distinct voice.
- Deliberation never lands in a working doc. A doc gets a synthesis block plus pointer.
- Deliberation never lands on the SPINE either. The spine gets one line saying it happened.
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
3. **Arm the spine.** Post the session header, hold the message ID.
4. **Record structural beats + deliberation on the task**; record chronology on the spine, one line per reply, write-ahead. Backfill pre-trigger turns on both.
5. **Keep appending live.**

After the announcement: no re-announcing, no narrating entries, no asking permission.

---

## Hardcode Mode (`/session-hardcode`)

Per-session fidelity toggle. Default is faithful-not-verbatim; hardcode is true 1:1.

- **`/session-hardcode`** — ON, mid-session invocable, applies forward only.
- **`/session-hardcode=off`** — OFF. Alias: **`/session-softcode`**.

**End-prompt gate:** capture Michael's prompt verbatim only once the full thought has landed. Never chop a multi-message thought into fragments.

**Two comments per turn under hardcode (on the TASK):**
1. `**Michael (verbatim):**` — word-for-word, typos included, no cleanup.
2. References/displayed — links loaded or emitted, artifacts created, key values shown.

**Close artifact mirrors the mode.** Hardcode-active sessions get a verbatim close `.txt` and toggle. Mixed sessions keep each turn in the mode active when it landed.

Governs Michael-to-Brain capture fidelity only. Agent deliberation format and the spine line format are unchanged.

---

## Backfill fallback

1. **Close-time watchdog.** At close, if the task or spine holds no coherent record, reconstruct the best faithful version and post it **flagged as reconstructed**.
2. **Mid-session catch-up.** See above.
3. **Reply/line reconciliation.** At close, compare substantive reply count to spine line count and report the delta honestly (`14 replies, 14 lines` or `14 replies, 9 lines — 5 missed`). A scoreboard, not a gate. You cannot fix a compliance problem you cannot measure.

Live capture is the standard. The fallback makes a lapse recoverable, not acceptable.

---

## Close

- Run the watchdog + the reply/line reconciliation first.
- Flip the task state and confirm the deliberation is intact.
- Post the close POINTER in #A.I. Prompts per the Session Close hook. Pointer, not a second chronology. Honor hardcode fidelity for the `.txt` artifact if it was active.
- Hand Closing Clio the finalized task and close post.

If the gate never fired, discard the provisional stub and close normally.

---

## Rules

- Deliberation + fidelity live on the session task. Chronology lives on the spine. Chat holds the close pointer.
- Thread-first: the task exists before any agent speaks.
- Thread-only: agents express on the task, never live, never in a working doc, never on the spine.
- Spine is armed by posting the header. The header IS the switch.
- Resolve the spine channel by URL/ID, never by name.
- Write-ahead: spine line before the reply, after the first token.
- One line per reply, fixed fields, dated, mobile-safe.
- Log the corrections and the wrong turns, not just the wins.
- A failed spine write never blocks a reply. Mark the gap; backfill it.
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

- **Session Close hook** (`hooks/session-close.md`) — close pointer, reply/line reconciliation, honors hardcode fidelity.
- **Session Transcript Format** (AI Toolkit) — the close `.txt` artifact container spec.
- **Scribe Sana** (`agents/scribe-sana.md`) — owner and operator.
- **Maestro Mira** — runs the opening check, posts the Tier-1 Opening Post.
- **The Council** (`council.md`) — mirrors the expression law as one line.
- **Agent Activity Board** — the board, its channel (the spine), and the Gold Standard.
- **Decision Log hook** — durable why, distinct from live deliberation.
