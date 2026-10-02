# Workspace Agent Deliberation

**Status:** standard procedure, ruled by Michael 2026-10-02.
**Scope:** every repo-defined agent working in ClickUp, including stateless lenses with Agent Index rows. Applies to individual work and multi-agent deliberation.
**Trigger:** repo-agent work or deliberation in the workspace.
**Entry point:** `hooks/activity-log-clickup-native.md` §0, reached through the shared base's logging contract.

## Precedence

This ruling supersedes older instructions in `gates/session-transcript-gate.md`, `council.md`, `orchestration.md`, and `super-agents/_shared/super-agent-base.md` that require deliberation ONLY on an Activity Board session task or require its transcript to be copied onto the agent row. Those files should point here rather than duplicate this procedure. Other session tracking, memory placement, LIVE STATE and permission rules remain in force.

## Working thread, then activity pointer

1. **Resolve the working surface first.** For a room-scoped session, use that room task: rooms exist to hold the working conversation. An explicitly designated work-item thread remains its own working surface. Use an Activity Board session task only when no room or work-item thread is established; do not create a parallel deliberation home merely to satisfy an older session-task-only clause. Keep any session record linked to the actual working thread.
2. **Post as the work happens.** Open the topic thread on the working task, then post each agent's substantive contribution as its own named reply, in that agent's voice. Read preceding contributions before responding. Post the contribution when made, before presenting the synthesis; never collect the whole debate in a file and ask afterward whether to post it. The chair/convenor follows the same rule. A named review lens is an analytical role, not proof that a separate autonomous agent sent a message.
3. **Immediately link from the contributing agent's own activity row.** After the working comment succeeds, take its exact returned comment URL and post ONE short Markdown link on THAT agent's Agent Index row: `[<topic / contribution>](<exact comment URL>)`. No copied transcript, recap, or second opinion. Link to the specific comment, not merely its task or the opening post. Resolve the correct row from the Agent Index; never put everyone's receipts on the chair's row.
4. **Keep the record single and honest.** One activity pointer per distinct working contribution; no extra pointer per tool call or per chat synthesis of the same contribution. Multiple agents each get their own pointer. Do not change permissions or expose private content to make a pointer work; use a non-sensitive label and respect destination access. Link-only logging does not replace a required LIVE STATE update when project state changes, nor a durable memory write when warranted.
5. **Handle partial writes explicitly.** No successful working comment means no success pointer. If the working comment lands but the activity pointer fails, keep its URL, report the missing receipt and retry only the pointer. Check for an existing matching comment/receipt before retrying an uncertain result. Never repost the substantive contribution just because its receipt failed. Missing agent row or unavailable room is a named gap, not permission to invent a target.
6. **Late capture is backfill, never live.** Label reconstructed prior deliberation as backfill and link to the backfilled comments. Do not fabricate timestamps, independent conversations, or a live posting history. This procedure authorizes no unrelated task-field edit, repo repair, or new autonomous schedule.

## Permission boundary

An instruction to run a room discussion establishes the intended working destination. Obtain any approval required by the executing platform BEFORE that posting batch; do not treat this standing procedure as a bypass of system-level message or bulk-write confirmation. Once approved, post in real time rather than asking again after deliberation. Never claim logging complete without the actual successful comment and pointer receipts.

## Acceptance

Room contribution exists → its author has an exact-comment link on their own row → synthesis points to the room thread. A summary-only attachment or a promise to post later does not satisfy this procedure.

Verify unhappy paths without inventing success: working-comment failure creates no pointer; pointer failure retries the pointer only; two agents link to their own distinct comments; an uncertain retry checks for duplicates; a prior unposted discussion is labelled backfill.

## Integration status

The activity-log hook links here. Pointer-only reconciliation of the older session-transcript gate, Council, orchestration and shared-base wording remains owed. At the Oct 2 pre-write check, another active session claimed orchestration and the shared base, so they were deliberately not overwritten. This precedence rule is explicit; do not claim every reader has been patched or mechanically enforced.
