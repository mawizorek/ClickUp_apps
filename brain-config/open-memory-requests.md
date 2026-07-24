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

### OMR-20260722-1 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: MEMORY-WRITE ROUTING (global) — Brain NEVER performs memory writes directly. Any memory-write candidate is dropped as an entry in this file (`brain-config/open-memory-requests.md`) for another agent (Maggie) to land, OR written to Brain's personal super-agent memory only when actually embodied as that super agent. In a normal (non-embodied) session Brain has no memory-write authority at all — this queue is the only path. Do not attempt `/PREFERENCES.md` writes. Established by Michael 2026-07-22.
- Requester's guess (non-binding): gate — belongs as a hard behavioral rule (e.g. `gates/` or the memory-request protocol) rather than brain memory; it governs the memory-write mechanism itself.
- Context / why: Michael corrected Brain after it twice attempted a direct `/PREFERENCES.md` write this session (both bounced). Global standing note on how memory requests are routed; self-referential (this very drop is the correct behavior).

### OMR-20260722-2 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: Michael works OVERNIGHT shifts. Never editorialize about the time of day or suggest stopping/resting/sleeping based on the wall clock (no "it's late," "clean stopping point for the night," "getting late," etc.). His work cadence is independent of the clock hour — a 4am timestamp is mid-shift, not end-of-day. This is a correction that GENERALIZES: no clock-based life-coaching in any domain, ever. Established by Michael 2026-07-22.
- Requester's guess (non-binding): brain memory (Tone & Style / Corrections — must-fire behavioral suppression rule that applies to every response), but deny-by-default; placement is Maggie's call.
- Context / why: Michael flagged weak context-awareness after Brain twice offered a "clean stopping point, it's ~4am" wind-down; he's on overnights and the hour is irrelevant to the work.

### OMR-20260724-1 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: REPO BOOTSTRAP COORDINATE — brain-config lives at `mawizorek/ClickUp_apps` (PUBLIC repo); read file bodies via the raw path `https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main/<path>` (`githubmcp_get_file_contents` returns metadata/SHA + directory listings only, never the body). `maw-agents` is a COLLABORATOR on this repo, NOT the owner — the GitHub MCP token authenticates AS `maw-agents`, which owns only a bare `references` stub, so any owner-scoped search (`user:maw-agents`) will NOT surface brain-config; always address the repo as `mawizorek/ClickUp_apps` and never cold-guess the owner. Two agent trees: lenses in `brain-config/agents/<slug>.md`, git-teammates in `brain-config/super-agents/<slug>/` — check both before concluding an agent doesn't exist. Established by Michael 2026-07-23.
- Requester's guess (non-binding): brain memory — the load-then-think line already points at the AI Toolkit index; it should ALSO name the repo coordinate so the very first hop is self-sufficient. The full read-path law already lives canonically in `brain-config/README.md` (Verified Read Path) and was added to the AI Toolkit index top as a projection this session; brain memory needs only the one-line coordinate + raw-read fact, not the full law. Deny-by-default — placement is Maggie's call.
- Context / why: Brain cold-started this session with no repo coordinate pinned and burned ~6 turns failing to locate brain-config (kept guessing `maw-agents` as owner and hitting 404s / empty searches) before resolving it to `mawizorek/ClickUp_apps`. Root cause: memory's load-then-think line names the index and the `brain-config/...` paths but never the owner/repo or raw-read path, a bootstrap gap. Index top was patched same session; this OMR covers the memory-line half.

---

## Entry template

```
### OMR-<YYYYMMDD>-<n> · OPEN
- Requested by: <agent>
- Candidate note: <self-contained, standalone-readable; must make sense with zero session history>
- Requester's guess (non-binding): <hook | gate | agent profile | reference doc | brain memory | unsure>
- Context / why: <one line>
```
