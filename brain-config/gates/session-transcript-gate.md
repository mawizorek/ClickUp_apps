# Session Transcript Gate

**Purpose:** decides WHEN the live session record opens and WHERE it lives. Capture layer.  
**Mode:** always-on, deterministic. Re-checked each turn until it fires. Bias hard toward firing.  
**Owner:** Scribe Sana. Closing Clio finalizes at close.  
**Ordered open sequence lives in `hooks/session-open.md` (Commit C1–C6), NOT here.** This gate owns WHERE the record lives, the spine FORMAT, and the firing triggers. It does not restate the open sequence — see the note under Opening check.  
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

🚨 **TWO SURFACES MEANS TWO INDEPENDENT CHECKS.** A task existing tells you the deliberation surface is live. It tells you **nothing** about the chronology surface. Never let finding one satisfy the other — that conflation is exactly how four consecutive sessions ran with zero spine lines (see Opening check).

---

## THE SPINE (per-reply, write-ahead)

### Why it exists

**The live chat is VOLATILE. The spine is not.** Context compacts, sessions end, replies get lost on mobile — anything that exists only in the conversation is gone. Every other durable surface is siloed per session: decision logs answer *why* per item, the Session Ledger answers *what shipped* this session, handoff tasks answer *what next*, one hop out. Nothing answered **"what have I already tried across the last twenty sessions,"** which is where repeated work and self-contradiction come from.

So the posture is: **you are a surfacing member of this workspace, not a chat window.** The chat is a view of the record, never the record itself. Post the line, then speak.

### Arming (this IS the switch)

At session open, post the **session header POST** to the spine channel (root level, `create_as_post: true`, `post_type: update`). Every spine line for the session threads under it as `parent_message`.

**Executed as `hooks/session-open.md` → Commit step C4.** That is the ordered home; this section is the format and the rules.

Header post body:

```
**Session:** <agent> (<model>) · <scope>
**Opened:** <date> <time> ET
**Scope:** <lists / docs / repos in play>
**Session task:** <URL>

Spine lines thread under this post, one per reply, written ahead of the reply.
```

🚨 **A PICKUP IS AN OPEN. ARM IT ANYWAY (HARD — LOCKED 2026-07-28, Michael).** Opening on a task that already exists — a parked `↪️ HANDOFF ·`, a `🧧 STANDING ·` thread, a reopened session — is a session OPEN and needs its own header for THIS session. **A task carrying twenty prior comments looks exactly like an armed record and is not one.** The standing thread is the worst case: it is deliberately never closed, so it is always open and always full of history.

**Why this is a hard rule and not a nicety:** four consecutive sessions (Jul 25, 26, 27, 27) posted **zero spine lines**, and every one opened by picking up an existing task. Scored B19 twice. The mechanism is a plausible feeling, not laziness — which is why the durable fix was putting the step in the executable list (`session-open.md` C4) and why this clause exists next to the format.

**⚠️ RE-RESOLVE THE HEADER, NEVER TRUST THE CACHE (HARD — the S1 fix).** Hold the header's message ID for convenience, but **the ID is not the source of truth; the channel is.** Before any spine write where the cached ID is not verifiably in hand, re-resolve it: read the channel's recent root posts, find the header whose body names THIS session task, thread under that.

**Why this is non-negotiable:** context compaction silently evicts the cached ID on any long session. The write then **succeeds** as a root-level message instead of a threaded reply — no error, no gap marker, nothing for the never-block rule to catch, because nothing failed. The session's tail silently detaches from its head and the roots-are-the-session-index property dies. **This is the default outcome of any session long enough to need a spine**, so it is the single most likely way the spine breaks. A cheap extra read at the moment the cache is gone is the whole fix.

**Idempotency (HARD).** Before posting a header, check the channel's recent roots for one already naming this session task. Found → thread under it, do NOT post a second header. This covers same-day second sessions and resumed handoffs, where the arming step would otherwise split one session across two roots.

### Write-ahead ordering (HARD)

Write-ahead means **ahead of the REPLY, not ahead of the work**:

```
anchor line (first token)  →  tool work  →  SPINE LINE  →  prose reply
```

That is the only point in a turn where the outcome is known and nothing has been said yet. Logging before the work logs intentions, which go stale the moment a tool fails. Logging after the reply is the afterthought this replaces. Turns with no tool work still write the line before the reply; same rule, no special case.

**Never ahead of the first token.** The FIRST TOKEN RULE wins: emit visible text to Michael before the spine write, always.

**Known limit, stated honestly:** order is **unobservable after the fact** — a line and a reply in the same minute are indistinguishable from a line written afterward. Nothing verifies this rule; it holds on discipline alone, and the close-time count will pass a session that logged in the wrong order. Do not mistake a clean reconciliation for proof the ordering held.

### Line format (fixed fields, no improvisation)

```
MM-DD HH:MM · <session task URL> · <one clause: what happened> · tools: a, b, c
```

- ONE line. Never a paragraph, never bullets. Depth belongs on the task.
- The date prefix is mandatory: sessions cross midnight and bare `HH:MM` breaks chronology.
- Two lines inside one minute may carry `HH:MM:SS` to stay individually greppable.
- Mobile-safe: no fenced blocks, no tables, no line-leading markdown markers.
- Greppable, not prose. Same field order every time. A spine you cannot grep is a diary.

### Completeness (HARD)

Every reply gets a line, **including corrections, wrong turns, and walked-back claims.** Those are precisely the turns that cause an agent to walk on top of itself, so a spine that only logs wins is worthless.

**Skip conditions (exhaustive list):** a reply is logged UNLESS it is:
1. A bare one-word acknowledgement ('np', 'yep', 'got it', 'thanks') with no additional content.
2. A pure data lookup that returns results without any decision, recommendation, or action.
3. A clarifying question that changed nothing and took no action.

**When in doubt, log it** — the bias is identical to the open-then-discard bias, and for the same asymmetric-cost reason. A line you didn't need costs nothing; a missing line costs the next session's context.

### Never-block (HARD)

A failed spine write **NEVER blocks a reply.** If the write fails: ship the reply anyway with a visible `⚠️ spine write failed` marker, then backfill the line when the surface returns. An unbackfilled gap stays marked — a record that lies about being complete is worse than a visible hole. Capture matters; it does not matter more than answering.

**Scope of the safety net:** never-block catches LOUD failures only. A write that succeeds in the wrong place (see the re-resolve rule) is invisible to it. That is why re-resolve is a hard rule and not an optimization.

### Backfill

A spine armed late backfills to message 1, flagged `⚠️ BACKFILL — reconstructed, not live`. Arming late never means starting the record at the arming point.

**Backfilled lines land out of post order.** The channel is chronological by post time; the lines are chronological by their own timestamp. After any backfill those two disagree, so **every backfilled line carries the `⚠️ BACKFILL` marker** and a reader trusts the timestamp field, never the scroll position.

### Hardcode seam

Under `/session-hardcode` the two-comments-per-turn verbatim capture stays on the TASK. The spine keeps its single line, pointing at it. Fidelity on the task, chronology on the spine — so the one-line format survives hardcode instead of breaking under it.

### Shared surface caution

The spine channel is the board's list channel, so humans may post there too. Machine lines thread under session headers; a human root message is not spine content and is never treated as one.

### Superseded by the spine

- **The per-reply task transcript comment.** The spine REPLACES it, one write per reply, not two. Structural beats (open, pickup, blocker, close) still go on the task.
- **The A.I. Prompts close summary prose.** Shrinks to a pointer (see `hooks/session-close.md`). The close `.txt` artifact and its toggle are unaffected.
- **The clickbot task-activity automation on the board channel.** Contentless duplicate of this job; retired by Michael (manual, admin-gated).

---

## Opening check (every session) — ⚠️ THE SEQUENCE LIVES IN `session-open.md`

**Run `hooks/session-open.md` → Commit C1–C6.** Both surfaces are resolved there, in order, as numbered steps: C1–C3 the task, **C4 the spine header**, C5 the backfill, C6 presence.

🚨 **This section used to restate the open sequence as three prose bullets, and that is the defect that was fixed on 2026-07-28.** The bullets read as session-open ceremony, the first one ("task exists? hand its comment stream to the team") fires and *feels* like the record is live, and **the spine bullet was never reached** — while `session-open.md`'s Commit checklist, the list agents actually execute, had no spine step in it at all. So the instruction lived in the document nobody runs step-by-step and was missing from the one they do. **Four consecutive sessions posted zero lines while following the procedure correctly.**

**Two rules survive here because they are about this gate's subject, not about sequencing:**

- **A found task NEVER satisfies "spine armed."** Two surfaces, two independent checks. The one that already exists is the one that fools you.
- **A PICKUP IS AN OPEN.** Reopening a handoff or a standing thread fires every open-time step, including a fresh header for this session.

**One ordered list, one claimant.** If sequencing and this gate ever disagree, `session-open.md` wins and this pointer gets corrected.

---

## Default posture: open-then-discard

- **Provisional open:** first turn that isn't a clear lookup, open silently, no announcement yet.
- **Discard:** if the session stayed trivial, delete the stub at close.
- **Exception:** if any agent posted deliberation, the session is non-discardable by definition and the record survives.
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
| Mimic Mika | 🎭 | Cautious Cass | 🧶 |
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
2. **Run `session-open.md` Commit C1–C6** — the task (reuse / promote the stub / create), **the spine header (C4)**, the scratch backfill, presence. A reopen runs all of it.
3. **Record structural beats + deliberation on the task**; record chronology on the spine, one line per reply, write-ahead, re-resolving the header whenever the cached ID is not in hand. Backfill pre-trigger turns on both.
4. **Keep appending live.**

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
3. **Reply/line reconciliation.** At close, compare total reply count (excluding bare acks) to spine line count and report the delta honestly (`14 replies, 14 lines` or `14 replies, 9 lines — 5 missed`). A scoreboard, not a gate.
4. **Orphan sweep.** At close, check the channel for spine lines sitting at ROOT level that should have threaded under this session's header (the compaction symptom). Found → note them in the close pointer. They cannot be re-parented after the fact, so the record says so rather than pretending the thread is whole.

Live capture is the standard. The fallback makes a lapse recoverable, not acceptable.

⚠️ **A fallback that keeps firing is a spec bug, not a save.** Four consecutive sessions were rescued by the close-time watchdog while the missing step sat unwritten. **If the same reconciliation delta appears twice, stop backfilling and go fix the sequence.**

---

## Close

- Run the watchdog, the reply/line reconciliation, and the orphan sweep first.
- Flip the task state and confirm the deliberation is intact.
- Post the close POINTER in #A.I. Prompts per the Session Close hook. Pointer, not a second chronology. Honor hardcode fidelity for the `.txt` artifact if it was active.
- Hand Closing Clio the finalized task and close post.

If the gate never fired, discard the provisional stub and close normally.

---

## Rules

- The live chat is volatile and is never the record. Post the line, then speak.
- Deliberation + fidelity live on the session task. Chronology lives on the spine. Chat holds the close pointer.
- **Two surfaces, two independent checks. A found task NEVER satisfies "spine armed."**
- **A PICKUP IS AN OPEN.** A reopened handoff or standing thread fires every open-time step, including a fresh header.
- **The ordered open sequence is `hooks/session-open.md` C1–C6. This gate does not restate it.**
- Thread-first: the task exists before any agent speaks.
- Thread-only: agents express on the task, never live, never in a working doc, never on the spine.
- Spine is armed by posting the header. The header IS the switch.
- **Re-resolve the header from the channel whenever the cached ID is not in hand. The channel is the source of truth, not the cache.**
- One header per session task. Check before posting a second one.
- Resolve the spine channel by URL/ID, never by name.
- Write-ahead: spine line before the reply, after the first token.
- One line per reply, fixed fields, dated, mobile-safe.
- Log the corrections and the wrong turns, not just the wins. When in doubt, log it.
- A failed spine write never blocks a reply. Mark the gap; backfill it.
- Never-block catches loud failures only; a misplaced successful write is invisible to it.
- Backfilled lines are marked and trusted by timestamp, not scroll position.
- **A fallback firing repeatedly is a spec bug. Fix the sequence, don't keep backfilling.**
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

- **Session Open hook** (`hooks/session-open.md`) — ⭐ **owns the ordered open sequence, including C4 ARM THE SPINE.** Read it for WHEN and in what order; read this gate for WHERE and in what format.
- **Session Close hook** (`hooks/session-close.md`) — close pointer, reply/line reconciliation, orphan sweep, honors hardcode fidelity.
- **Session Transcript Format** (AI Toolkit) — the close `.txt` artifact container spec.
- **Scribe Sana** (`agents/scribe-sana.md`) — owner and operator.
- **Maestro Mira** — posts the Tier-1 Opening Post.
- **The Council** (`council.md`) — mirrors the expression law as one line.
- **Agent Activity Board** — the board, its channel (the spine), and the Gold Standard.
- **Decision Log hook** — durable why, distinct from live deliberation.
