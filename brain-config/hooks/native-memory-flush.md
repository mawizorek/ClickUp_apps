---
slug: native-memory-flush
display_name: Native Memory Flush
type: hook
status: active
trigger: manual (Michael invokes on a native CU agent or tells Brain to pull)
owner_agents: [memory-maggie]
---

# Native Memory Flush Hook

**Purpose:** Define the pipeline for dumping raw native ClickUp agent memory/notes
into git, where Memory Maggie triages and consolidates into the agent's canonical
`memory.md` and `activity-log.md`.

**Design principle:** Native CU agents are good at accumulating live context cheaply
(DM thread history, mid-run writes, no PR gate). Git is good at versioned, portable,
diffable canonical truth. This hook bridges them: native writes hot, git stores cold,
Maggie curates the handoff.

---

## The flush target

```
brain-config/super-agents/<slug>/memory/native-flush.md
```

This file is a **write-once staging inbox**. It is NOT part of the agent's loaded
context (not read on session open). It exists solely as a landing zone for raw native
dumps that Maggie processes and empties.

---

## When this fires

**Manual only.** Michael triggers the flush by:
1. Telling the native CU agent directly: "dump your memory/notes" (the native pastes
   its full contents into a message or doc), OR
2. Telling Brain: "flush [agent name]'s native memory" (Brain reads the native's
   output and commits it to the staging file).

This is NOT automated. No schedule, no session-close trigger. Michael decides when
a native's accumulated context is worth pulling into the canonical store.

---

## The flush procedure (whoever is writing)

1. **Collect the raw output.** The native CU agent's full memory/notes, verbatim.
   No editing, no summarizing, no filtering at this stage. Paste it ALL.

2. **Commit to the staging file.** Write the raw dump to
   `<slug>/memory/native-flush.md` on a branch, PR, self-merge (standard PR-Merge
   Workflow). The file format:

   ```markdown
   # Native Flush — <Agent Name>
   
   **Source:** ClickUp native agent <name> (ID: <id if known>)
   **Flushed:** <date> by <who triggered it>
   **Status:** PENDING TRIAGE
   
   ---
   
   ## Raw Native Memory
   
   <verbatim paste of the native agent's memory/notes content>
   
   ---
   
   ## Raw Native Context (if available)
   
   <any additional context: recent DM excerpts, working state, etc.>
   ```

3. **Signal Maggie.** After the commit lands on main, flag it for Maggie's next
   pass (either in the same session or as a queued item). The signal is simply:
   the file exists and says `PENDING TRIAGE`.

---

## Maggie's triage procedure (consolidation)

When Maggie finds a `native-flush.md` with status `PENDING TRIAGE`:

1. **Read the flush file fully.**

2. **Apply the §4a test to every piece of content:**
   - Can it go stale in a day? → belongs in `activity-log.md` (LIVE STATE block
     or as a session entry).
   - Durable pattern/preference/scar? → belongs in `memory.md`.
   - Procedure/how-to? → route to a tool (Constitution §2-§3). Do NOT put in memory.
   - Already captured in the canonical files? → skip (dedupe).
   - Decision about the agent's own shape? → `decision-log.md`.

3. **Write the triaged content** to the appropriate canonical files per normal
   memory-write rules (placement test, budget check, rotation if needed).

4. **Clear the flush file.** Replace contents with:

   ```markdown
   # Native Flush — <Agent Name>
   
   **Status:** EMPTY (last processed <date> by Maggie)
   
   No pending native memory to triage. Next flush will overwrite this file.
   ```

5. **Report what was consolidated** in the same PR description or session transcript:
   what went where, what was deduped, what was discarded and why.

---

## What this does NOT do

- **Replace native memory entirely.** The native CU agent keeps accumulating its
  own context between flushes. That's fine. The flush is a periodic harvest, not
  a continuous sync.
- **Auto-fire.** No triggers, no schedules. Michael controls the cadence.
- **Touch `preferences.md`.** Preferences are authored deliberately, not extracted
  from native dumps. If the native dump contains preference-level content, Maggie
  flags it for Michael rather than auto-writing it.
- **Grant tools or access.** This is purely a content pipeline. The native agent's
  tool permissions and knowledge grants remain configured in ClickUp.

---

## For the native agent's bootstrap instructions

When converting a native CU agent to the thin-loader pattern, its ClickUp
instructions should include a clause like:

```
When Michael asks you to "dump your memory" or "flush your notes":
- Output your FULL memory/notes content verbatim in your reply.
- Include any working state, ongoing project context, or recent learnings.
- Do not summarize or filter. Paste everything.
- Brain or Michael will handle getting it into the canonical repo store.
```

This keeps the native agent's responsibility minimal: just paste. The routing
and triage intelligence lives here in Maggie's procedure, not in the native.

---

## Relationship to other hooks

- **`memory-rotation.md`:** Maggie's consolidation may trigger rotation if the
  target files go over budget. Same mechanics apply.
- **`memory-write-relay.md`:** If Maggie's write fails mid-triage, the relay
  catches it and queues the block.
- **`memory-edit-guard.md`:** Brain's `/PREFERENCES.md` is never written from
  a native flush without Michael's explicit approval.
- **`session-close.md`:** Flush triage can happen during a close pass if a
  pending flush is found, but it's not a required close-time step.

---

## Changelog

- v1 (2026-08-01) — created. Born from the fleet-felix native→git migration
  architecture discussion. Establishes the staging-file pattern so any native
  CU agent can flush to a single shared pipeline without cluttering the
  canonical memory files.
