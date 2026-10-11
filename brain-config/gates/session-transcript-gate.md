# Session Transcript Gate

**Purpose:** decides WHEN the live session record opens and WHERE it lives. Capture layer.  
**Mode:** always-on, deterministic. Re-checked each turn until it fires. Bias hard toward firing.  
**Owner:** Scribe Sana. Closing Clio finalizes at close.  
**Ordered open sequence lives in `hooks/session-open.md`, NOT here.** This gate owns WHERE the record lives, the spine FORMAT, and the firing triggers.  
**Decision history:** `brain-config/gates/session-transcript-gate.decision-log.md`

---

## Canonical pointers

- **PRIMARY (deliberation + detail) — 🟢 Agent Activity Board list:** `901327879922` · https://app.clickup.com/36074068/v/li/901327879922. One task per session; deliberation and structural beats are comments on it.
- **PRIMARY (chronology) — the SPINE, the 🟢 Agent Activity Board CHANNEL:** https://app.clickup.com/36074068/chat/r/6-901327879922-8 (id `4026841195912677667`). One ROOT line per reply. Cross-session, append-only.
- **FALLBACK — #A.I. Prompts:** https://app.clickup.com/36074068/chat/r/6-901327646617-8. Home of the permanent close POINTER.

**⚠️ Resolve the spine channel by URL or ID, NEVER by name.** Name lookup returns a misleading `Insufficient access permissions`.

---

## Where the record lives

- **Task** = deliberation, structural beats (open / pickup / blocker / close), the Session Ledger, full fidelity. All agent voices land here.
- **Spine** = the channel. Chronology only: one line per reply, every session, forever. The only surface that reads ACROSS sessions.
- **Chat** = the close pointer. Not deliberation, not a transcript.

A task existing says nothing about the spine. Two surfaces, two checks.

---

## THE SPINE (per-reply) — SIMPLIFIED 2026-10-11

### The rule (verbatim with brain memory, which is the firing surface)

Every reply: **first post ONE root message** to https://app.clickup.com/36074068/chat/r/6-901327879922-8:

```
MM-DD HH:MM · <where> · what happened
```

- **Time** = the current-time block every reply already carries. Always available.
- **Where** = a link to whatever is open or being discussed (task, doc, chat). Nothing open → the literal text `no task`. **Always fillable.**
- **What happened** = one clause. Corrections and wrong turns included.
- **Never skip a field.** A field you cannot fill gets its fallback value, never becomes a reason to skip the line.
- **Fails → reply anyway** with `⚠️ spine failed`. A failed write never blocks a reply.

### Why it was simplified (Michael, 2026-10-11)

The previous spec required arming a session header post, threading every line under it, re-resolving the header after compaction, idempotency checks, and an orphan sweep. **It was ignored in practice** (a whole multi-day session posted zero lines) because every precondition was a place to stall. Michael's ruling: *"maybe it's less agent based and more explicit... post a single link to the chat in this single chat."* Then: *"what if there is not task? the agent will ignore. all fields must be deliberately accessible easily."*

**The design law this encodes: a rule that fires every reply must have zero preconditions and every field must have a fallback.** Grouping is recovered from the `<where>` link, not from threading.

### Retired (do not reintroduce)

- Session header POST as the arming switch, `parent_message` threading, header re-resolve, header idempotency, the orphan sweep, and the `tools: a, b, c` field.
- ⚠️ `hooks/session-open.md` (step C4) and `hooks/session-close.md` (orphan sweep, threaded reconciliation) still describe the header. **This gate supersedes them on the spine; treat those steps as retired until they are edited.**

### Still true

- Mobile-safe: one line, no fenced blocks, no tables, no line-leading markdown.
- Greppable: same field order every time.
- Backfilled lines carry `⚠️ BACKFILL` and are trusted by their timestamp, not scroll position.
- The channel is shared with humans; a human message is not spine content.
- Under `/session-hardcode` verbatim capture stays on the TASK; the spine keeps its single line.
- At close, compare substantive replies to spine lines and report the delta honestly. A scoreboard, not a gate. **If the same delta appears twice, fix the rule, don't keep backfilling.**

---

## Default posture: open-then-discard

- **Provisional open:** first turn that isn't a clear lookup, open silently.
- **Discard:** if the session stayed trivial, delete the stub at close.
- **Exception:** if any agent posted deliberation, the session is non-discardable.
- **Promote:** on any trigger hit, promote the stub and fire the one announcement.

---

## Triggers (whichever comes first)

1. **Deterministic action signal.** About to create a task, doc, or comparable persistent artifact.
2. **Literal trigger phrases.** "take notes" · "run it by the team" · "log this" · "start a decision log" · "decision log" · "pencil it in" · "capture this" · "tear it apart" · "convene the team" · "run it by the workshop" · "clean session" · "create the task" · "start your session task". Extensible.
3. **First real decision.**
4. **Third message during build/work.** Backstop, not a delay.

(The spine does NOT wait for these. It fires every reply regardless. These triggers govern the session TASK.)

---

## Mid-session catch-up

A late trigger opens the task record AND backfills everything since message 1.

---

## Agent expression: THREAD-ONLY

- No agent voice in the live chat. Objections, risks, alternatives all go on the task.
- Each agent posts in its own distinct voice, one agent per comment. Header = emoji badge + bold name.
- Deliberation never lands in a working doc (synthesis block + pointer only) and never on the spine.
- **Stays live:** Brain's synthesized reply and Mira's single anchor line.

Badges: Maestro Mira 🎼 · Risk Rhys ⚠️ · Breaker Beckett 🔨 · Clever Cleo 💡 · Polish Polly ✨ · Feasible Finn 🔧 · Scope Skye 📐 · Eco Enzo 🌐 · Scribe Sana ✍️ · Fold-in Frank 🧩 · Mimic Mika 🎭 · Cautious Cass 🧊 · Literal Lena 📏 · Counter Cole ↩️ · Pivot Piper 🔀 · Style Stu 😎 · Novice Nia 🐣 · Domain Dara 🎓 · Future Faye 🔮 · Handoff Hana 🏁. Extensible.

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

**Tier 2 — Agent Replies.** Each seated voice posts a THREADED reply under the parent. One agent per reply: badge + name, the take in its own voice addressing X / Y / Z, cross-talk naming at least one colleague, and a verdict where the role calls for one (pass / adjust / halt).

**Never:** a lump comment with voices bulleted inside it, a bare summary with no inline voices, or un-nested root comments.

**Single source:** these templates live here only.

### Live chat output = Mira's synthesis only

One synthesis to Michael, no per-agent recap.

---

## Hardcode Mode (`/session-hardcode`)

Per-session fidelity toggle. Default is faithful-not-verbatim; hardcode is true 1:1.

- **`/session-hardcode`** — ON, applies forward only. **`/session-hardcode=off`** / **`/session-softcode`** — OFF.
- Capture Michael's prompt verbatim only once the full thought has landed.
- Two comments per turn on the TASK: `**Michael (verbatim):**` word-for-word, then references/displayed.
- Close artifact mirrors the mode.

---

## Close

- Run the reply/line reconciliation.
- Flip the task state and confirm the deliberation is intact.
- Post the close POINTER in #A.I. Prompts per the Session Close hook.
- Hand Closing Clio the finalized task and close post.

If the gate never fired, discard the provisional stub and close normally.

---

## Rules

- The live chat is volatile and is never the record.
- Deliberation + fidelity on the session task. Chronology on the spine. Close pointer in chat.
- **Spine: one root line per reply, three always-fillable fields, zero preconditions.**
- Resolve the spine channel by URL/ID, never by name.
- Log the corrections and wrong turns, not just the wins.
- A failed spine write never blocks a reply.
- A reconciliation delta that repeats is a rule bug. Fix the rule.
- Two-tier protocol governs thread structure on the task. Templates live here only.
- Open-then-discard is the default; agent deliberation makes a session non-discardable.
- Deterministic triggers beat discretion. Announce once. Faithful, not verbatim, unless hardcode is on.

---

## Composes with

- **Brain memory** — carries the spine rule verbatim as the firing surface. If this gate and memory disagree on the spine, memory is the newer ruling; correct this file.
- **Session Open hook** (`hooks/session-open.md`) — ordered open sequence. ⚠️ Its spine-header step (C4) is retired by this gate.
- **Session Close hook** (`hooks/session-close.md`) — close pointer + reconciliation. ⚠️ Its orphan sweep is retired by this gate.
- **Scribe Sana** (`agents/scribe-sana.md`) — owner and operator.
- **Maestro Mira** — posts the Tier-1 Opening Post.
- **Agent Activity Board** — the board, its channel (the spine), and the Gold Standard.
