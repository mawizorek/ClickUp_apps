# Memory Write Relay — AI Toolkit

**Purpose:** When a memory write fails (no memory manager, path error, contention), don't lose the intended change and don't nag. Flag it ONCE, hand over a clean copy-paste block for the memory agent, and track it as a deferred confirm so it can be re-surfaced on demand or when the change is finalized later in the conversation.

**Mode:** Contextual (deterministic) — fires the instant a memory write fails.

**Invocation:** Automatic on failure. ("give me the memory block" re-surfaces the pending write at any time.)

**Trigger:** Any failed attempt to persist to memory (`/memory/PREFERENCES.md` or other memory files). Fires ONCE per distinct pending change — NOT on every subsequent turn.

**Pass:**
1. Catch the failure. Do NOT claim the memory was saved (hard rule: never tell the user something persisted when it didn't).
2. Flag it lightly + reassuringly: "that memory write didn't land — nbd, happens — here's a block for the memory agent when you're ready."
3. Emit a **bare copy-paste block** (no language tag) with the EXACT intended memory change, framed as an instruction to the memory agent: what to add/condense/replace, and where. If memory is over budget, write it as a condense-or-replace, not a blind append.
4. Mark the change **pending / unconfirmed**. Hold it. Do NOT re-emit it every turn.
5. Only re-surface when: (a) the user asks, (b) the underlying change gets edited/finalized later in the conversation (emit the UPDATED block, note it supersedes the earlier one), or (c) at session close as part of the memory audit.
6. If several writes fail across a session, batch them into ONE block at the next natural checkpoint rather than many.

**Output:** A one-line light flag + a single bare copy-paste block addressed to the memory agent. Then silence on it until re-surfaced per step 5.

**Composes with / overrides:** Feeds the Session Close memory audit (pending blocks roll into the close). Coordinates with Memory Hygiene Review (over-budget → condense framing). Overrides any "saved to memory" phrasing — a pending write is never reported as done.

**Examples:**
- *Fail:* protected-mirror rule won't write (no memory manager). → light flag + one copy-paste block for the memory agent, marked pending; not repeated next turn.
- *Later:* user refines that rule mid-conversation. → emit UPDATED block, note it replaces the earlier pending one.

**Changelog:**
- v1 (2026-07-03) — initial. Graduated from a 🎯 roster line to a full hook profile: fire-once, defer-confirm, batch-at-checkpoint semantics.
