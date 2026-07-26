# Open Memory Requests

_Public queue for memory-write candidates that an agent cannot or should not land itself. **Empty by default.** Maggie processes it on "run your thing on the open memory requests" and clears processed entries. Protocol: `brain-config/agents/memory-maggie/open-memory-request-protocol.md`._

**Two doors:**
- **DROP (any agent, mid-session):** "add that to the open memory log" → the current agent appends ONE entry below. That's it.
- **DRAIN (fresh session):** "open as Memory Maggie" → "run your thing on the open memory requests" → Maggie triages + places the whole batch, then clears it.

**How to use (any agent, Door 1):** append ONE entry under Open. Do not place it yourself, do not touch `/PREFERENCES.md`. Maggie decides where it lands.

**Placement is NOT yours to assume:** "preference" earns nothing. Deny-by-default for brain memory. Your suggested destination is a hint only. Most requests land in `brain-config/` (hooks / gates / agent profiles) or the Brain Reference Library, not in brain memory.

**Neighbors, don't mix:** this = memory-write candidates · `open-thread.md` = durable pending work · `session-board.md` = live presence.

---

## Open

### OMR-20260726-1 · OPEN · ⚠️ MICHAEL EXPLICITLY ORDERED THIS INTO BRAIN MEMORY
- Requested by: Brain (Opus 4.6)
- Candidate note: **SPINE = THE RECORD (must-fire-every-response).** Michael's framing, near-verbatim: *"you are to be a surfacing member in the space. session chats are volatile and thus you must always post your reply as a thread in the session chat before pasting it back in the chat. always post a comment before replying."* Operationally: the live chat is a VIEW of the record, never the record itself. On EVERY substantive reply, post the one-line spine entry to the 🟢 Agent Activity Board channel (https://app.clickup.com/36074068/chat/r/6-901327879922-8), threaded under this session's header post, **BEFORE** sending the prose reply. Order: anchor line (first token) → tool work → spine line → prose reply. Re-resolve the header from the channel; never trust a cached message ID (context compaction evicts it and the write then silently lands at root). A failed spine write never blocks the reply — ship it with a `⚠️ spine write failed` marker and backfill. Full spec: `brain-config/gates/session-transcript-gate.md` → THE SPINE. Established by Michael 2026-07-26.
- Requester's guess (non-binding): brain memory, and this one has an unusually strong claim — it is the definition of a must-fire-every-response behavior, which is the ONE category the Edit Guard admits, and Michael named the destination explicitly ("drop a line in real memory"). Suggested shape: ONE compact line near the LOAD-THEN-THINK block, pointing at the gate rather than restating it. Budget note for Maggie: memory sat at ~1762/2000 before this; a trim is needed in the same pass (candidate: collapse the two Maggie-placement bullets under Memory-First into one). **FOLD-IN, not net-new: `OMR-20260725-1` already covers "chat is ephemeral, the task is the durable record, post as you go." This is the same principle with a new destination and a hard ordering rule — amend that entry rather than land two overlapping ones.** Deny-by-default still applies; placement is Maggie's call.
- Context / why: the spine shipped 2026-07-26 (PRs #539, #541) as a per-reply, cross-session, append-only write-ahead log, built specifically because Michael observed Brain "keeps walking on top of itself." The behavioral machinery is live in git, but the must-fire trigger has no memory anchor, so a cold session would ship the gate and never fire it — the exact failure mode that produced the `Follow Up` tag (0 of 11 tasks) and three zero-fill custom fields. ⚠️ **Also logging a self-correction:** Brain attempted a direct `/PREFERENCES.md` write this session before dropping here, which `OMR-20260722-1` already forbids. That entry is still unlanded, which is precisely why the mistake recurred — evidence that the queue itself needs draining, not just appending.

### OMR-20260725-3 · OPEN · 🔴 READ BEFORE LANDING OMR-20260724-1
- Requested by: Brain (Opus 5)
- Candidate note: CORRECTION to a queued entry, not a new rule. `OMR-20260724-1` (above) is broadly right about the repo coordinate but carries one **false** fact in its candidate note: that `githubmcp_get_file_contents` "returns metadata/SHA + directory listings only on a file path — NOT the body; never read a body through it." **That is wrong.** `githubmcp_get_file_contents` returns faithful file BODIES, and it has been the single most reliable read path in the repo — it resolves at an immutable commit SHA. The path that actually lies is the **branch raw URL**: `raw.githubusercontent.com/.../main/<path>` has repeatedly served content many versions stale (a v10.1 body while `main` held v15). So the corrected rule is the inverse of what the entry says: **read bodies via the MCP tool or a commit-SHA-pinned raw URL; treat a branch raw URL as untrustworthy for anything you are about to edit.** Land `OMR-20260724-1`'s repo/owner coordinate, but not its read-path clause. The same wrong claim is currently mirrored at the top of the AI Toolkit index and in `brain-config/README.md`'s Verified Read Path, so those need the same correction wherever they say it.
- Requester's guess (non-binding): amend `OMR-20260724-1` in place rather than land two conflicting entries; the read-path law itself belongs in `brain-config/README.md` + the GitHub MCP Operating Standard, NOT brain memory. Brain memory needs only the owner/repo coordinate.
- Context / why: caught 2026-07-25 while reading `shared/themes/resolve.js` and four `inciardi-collection` files — all read whole and faithfully through `githubmcp_get_file_contents`, on the same day the index insists that's impossible. A memory entry that inverts a read-path law is worse than no entry: it would push every future agent onto the one path that demonstrably serves stale bodies, which is exactly how three misdiagnoses happened earlier this week.

### OMR-20260725-2 · OPEN
- Requested by: Brain (Opus 5)
- Candidate note: SILENT-FALLBACK LAW (generalizes) — **a fallback that does not announce itself is not graceful degradation, it is a lie.** Any cache, retry, default, placeholder, or degraded path in ANY app or shared module must surface its own activation in the UI, with an age or a reason where one exists. This is currently documented as the "Fetch Honesty Law" inside one app's README (`inciardi-market`), but it is not app-specific: it is a standing engineering law for every build, and it applies equally to shared infrastructure. Corollary learned the hard way: **resilience features are the prime suspects** — every silent-fallback bug found so far was originally added to make something more robust. Established by Michael's frustration 2026-07-25 ("this just isn't reliable or something idk man") and the four instances that produced it.
- Requester's guess (non-binding): a reference-doc law (the `When Coding` gate, or a repo-law section) rather than brain memory — it's a build-time standard, not a must-fire-every-response rule. Deny-by-default; placement is Maggie's call.
- Context / why: four silent fallbacks surfaced in a single day, all of them added as "resilience": (1) an HTTP cache serving a stale `/catalog`, (2) a stylesheet cache defeating a CSS-only fix, (3) a localStorage fallback quietly serving days-old data with no banner, (4) `shared/themes/resolve.js` applying a half-broken theme in total silence (fixed in PR #502). Three of the four cost multiple misdiagnosis rounds each because the code chose to look fine instead of looking broken.

### OMR-20260725-1 · OPEN · ⚠️ see OMR-20260726-1 (same principle, new destination — fold together)
- Requested by: Brain (Opus 5)
- Candidate note: The Agent Activity Board session task is a **RUNNING log, updated frequently DURING the session** — after each meaningful decision, finding, correction, or commit — not a writeup composed at session close. Chat is ephemeral and gets compacted; the task is the durable record, so anything that only exists in chat is effectively lost. Post as you go, in flight, without being asked. Established by Michael 2026-07-25 ("be sure to keep your session task updated frequently").
- Requester's guess (non-binding): brain memory (Workflow Defaults — amend the existing Agent Activity Board / active-project-work line rather than adding a new bullet, to hold the token budget), with the fuller cadence rule in the Agent Activity Board Gold Standard. Deny-by-default; placement is Maggie's call.
- Context / why: Michael asked for this mid-session after a long build session where several findings (a root-cause diagnosis, three superseded plans, a decoded decision-log readback) existed only in chat for an hour before reaching the task. Pairs with, and strengthens, `OMR-20260717-1` (auto-open the session task without asking) — that entry covers OPENING the task, this one covers KEEPING it current.

### OMR-20260717-1 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: Auto-open an Agent Activity Board session task WITHOUT asking whenever project work begins (any time a project conversation starts). Opening the task is a standing default, not a permission gate. Established by Michael 2026-07-17.
- Requester's guess (non-binding): brain memory (update the existing Agent Activity Board pointer line rather than adding a new bullet, to avoid file growth); the fuller rule already lives in the Agent Activity Board Gold Standard startup gate.
- Context / why: memory write bounced this session (no memory manager available); Michael directed dropping it here for a later agent to land. Pairs with the session-close fix also made 2026-07-17.

### OMR-20260717-2 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: NEVER touch Michael's real/external calendar (Google Calendar, etc). All scheduling is done as ClickUp tasks with start/due times that render in the ClickUp calendar. Multi-day or multi-event schedules are built as subtask events nested under the parent/anchor task. Established by Michael 2026-07-17.
- Requester's guess (non-binding): brain memory (Workflow Defaults) — must-fire behavioral default; possibly also a brain-config gate to hard-block external-calendar tools.
- Context / why: memory write bounced this session (no memory manager available). Rule set while building the City of Angels changeover schedule as ClickUp subtask events under the changeover task.

### OMR-20260721-1 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: TERMINOLOGY DEFAULT — when Michael says "super agent" (unqualified) he means a GIT-TEAMMATE (the `/session.agent=<Name>` kind under `brain-config/super-agents/`). He will say "ClickUp super agent" or "cu agent" ONLY when he means a NATIVE ClickUp Super Agent. Parse every agent build/convert/invoke request through this default; do not assume the native surface unless he uses the qualified term. Established by Michael 2026-07-21.
- Requester's guess (non-binding): brain memory (must-fire interpretation rule affecting how every agent request is parsed) — but deny-by-default; could instead live as a one-line terminology note in `gates/agent-invocation-gate.md` or a fleet-terminology pointer.
- Context / why: clarified mid-session while converting Maestro Mira to a git-teammate ("i meant git super agent…. ill always say clickup super agent or cu agen if i actually mean that").

### OMR-20260722-1 · OPEN · 🔴 STILL UNLANDED, AND THE LAPSE RECURRED 2026-07-26
- Requested by: Brain (Opus 4.8)
- Candidate note: MEMORY-WRITE ROUTING (global) — Brain NEVER performs memory writes directly. Any memory-write candidate is dropped as an entry in this file (`brain-config/open-memory-requests.md`) for another agent (Maggie) to land, OR written to Brain's personal super-agent memory only when actually embodied as that super agent. In a normal (non-embodied) session Brain has no memory-write authority at all — this queue is the only path. Do not attempt `/PREFERENCES.md` writes. Established by Michael 2026-07-22.
- Requester's guess (non-binding): gate — belongs as a hard behavioral rule (e.g. `gates/` or the memory-request protocol) rather than brain memory; it governs the memory-write mechanism itself.
- Context / why: Michael corrected Brain after it twice attempted a direct `/PREFERENCES.md` write this session (both bounced). Global standing note on how memory requests are routed; self-referential (this very drop is the correct behavior). **2026-07-26: happened AGAIN** — a fresh session attempted a `/PREFERENCES.md` str_replace and got `No memory manager available`, because this entry has sat unlanded for four days. Priority candidate on the next drain: an unlanded routing rule reproduces the exact mistake it was written to stop.

### OMR-20260722-2 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: Michael works OVERNIGHT shifts. Never editorialize about the time of day or suggest stopping/resting/sleeping based on the wall clock (no "it's late," "clean stopping point for the night," "getting late," etc.). His work cadence is independent of the clock hour — a 4am timestamp is mid-shift, not end-of-day. This is a correction that GENERALIZES: no clock-based life-coaching in any domain, ever. Established by Michael 2026-07-22.
- Requester's guess (non-binding): brain memory (Tone & Style / Corrections — must-fire behavioral suppression rule that applies to every response), but deny-by-default; placement is Maggie's call.
- Context / why: Michael flagged weak context-awareness after Brain twice offered a "clean stopping point, it's ~4am" wind-down; he's on overnights and the hour is irrelevant to the work.

### OMR-20260724-1 · OPEN · ⚠️ see OMR-20260725-3 before landing
- Requested by: Brain (Opus 4.8)
- Candidate note: REPO BOOTSTRAP COORDINATE — brain-config lives at `mawizorek/ClickUp_apps` (PUBLIC repo); read file bodies via the raw path `https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main/<path>` (`githubmcp_get_file_contents` returns metadata/SHA + directory listings only, never the body). `maw-agents` is a COLLABORATOR on this repo, NOT the owner — the GitHub MCP token authenticates AS `maw-agents`, which owns only a bare `references` stub, so any owner-scoped search (`user:maw-agents`) will NOT surface brain-config; always address the repo as `mawizorek/ClickUp_apps` and never cold-guess the owner. Two agent trees: lenses in `brain-config/agents/<slug>.md`, git-teammates in `brain-config/super-agents/<slug>/` — check both before concluding an agent doesn't exist. Established by Michael 2026-07-23.
- Requester's guess (non-binding): brain memory — the load-then-think line already points at the AI Toolkit index; it should ALSO name the repo coordinate so the very first hop is self-sufficient. The full read-path law already lives canonically in `brain-config/README.md` (Verified Read Path) and was added to the AI Toolkit index top as a projection this session; brain memory needs only the one-line coordinate + raw-read fact, not the full law. Deny-by-default — placement is Maggie's call.
- Context / why: Brain cold-started this session with no repo coordinate pinned and burned ~6 turns failing to locate brain-config (kept guessing `maw-agents` as owner and hitting 404s / empty searches) before resolving it to `mawizorek/ClickUp_apps`. Root cause: memory's load-then-think line names the index and the `brain-config/...` paths but never the owner/repo or raw-read path, a bootstrap gap. Index top was patched same session; this OMR covers the memory-line half.

### OMR-20260724-2 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: CAPABILITY HONESTY — Brain must never offer or imply it can perform an action its tools cannot do. Known hard gaps: (1) cannot create Doc-type Relationships — task tools only wire task↔task links (linked / blocking / waiting); a Doc relationship must be added by Michael via the task's `... → Relationships → Relate a Task or Doc` UI; (2) cannot DELETE anything (tasks, docs, custom fields, views, lists, relationships, etc.); (3) cannot convert / merge / move a Relationship custom field; (4) cannot create chat channels. When a request hits a gap, state the limit plainly and hand Michael the manual UI steps instead of offering to do it. This GENERALIZES to any newly-discovered capability gap, not just the four listed. Established by Michael 2026-07-24.
- Requester's guess (non-binding): brain memory (Corrections & Safety — a must-fire behavioral suppression that shapes every offer Brain makes), but deny-by-default; could instead live as a gate. Placement is Maggie's call.
- Context / why: Brain twice offered to "make the Doc relationship" on the SLACK Participants task before confirming it couldn't do Doc-type relationships; Michael asked for a standing note so Brain stops offering actions unavailable to it, calling out deletion as the other recurring example.

---

## Entry template

```
### OMR-<YYYYMMDD>-<n> · OPEN
- Requested by: <agent>
- Candidate note: <self-contained, standalone-readable; must make sense with zero session history>
- Requester's guess (non-binding): <hook | gate | agent profile | reference doc | brain memory | unsure>
- Context / why: <one line>
```
