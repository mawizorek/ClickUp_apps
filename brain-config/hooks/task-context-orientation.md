# Task-Context Orientation Gate · AI Toolkit

**Purpose:** When a session is invoked WITH a task attached, orient to that task's place in the workspace and its history BEFORE parsing the prompt, so the reply answers from the broader picture instead of from the four corners of the task card.

**Steward:** UNASSIGNED at authoring. Seat Fleet Felix to assign one before this hook's first amendment. (Do not infer a steward from this file; a guessed owner is the exact class the Fleet-Fact Sweep exists to catch.)

**Mode:** Always-on, gated on structure. It fires on EVERY invocation where task context is present, and is silently inert where it is not. No naming required, no discretion.

**Invocation:** Automatic. Handed off from `hooks/invocation-context.md` when that hook resolves **comment mode**. Manual re-run: `/orient`.

**Trigger:** Task metadata is present in the assembled prompt (task comment invocation, task-scoped Brain button, agent assigned to a task, a task URL that IS the subject rather than a passing reference).

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-03** by Brain, at Michael's direction.

---

## Why this exists (read once, it is the whole design)

Michael, 2026-08-03: *"It reads the context, but it doesn't see how that fits into the broader picture... it's not enough to just sit on the task; Michael needs you to understand the history behind it."*

The defect is not missing context. A comment-mode session receives MORE context than a chat session, and still answers worse, because it treats the task card as the entire world. It knows the title, the description and the prompt, and it does not know what the list is FOR, whether the thread it is joining is two hours old or three weeks cold, or whether it is resuming a conversation or starting one.

**The fix is ORDER, not volume.** Orient first, parse second. A prompt read before orientation gets re-interpreted through whatever the task card happens to say; a prompt read after orientation gets interpreted through what the work actually is.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **This hook** | `brain-config/hooks/task-context-orientation.md` |
| **Upstream detector** | `brain-config/hooks/invocation-context.md` (comment-mode branch) |
| **List Index (URITP binding)** | ClickUp list **`List Index`**, id `901327881037` — one task per list, carries `Purpose` + audit judgment fields + the `Doc Page` pointer |
| **List Index doc page** | ClickUp doc page titled **`List Index`** (URITP audit docset) |
| **Audit machinery** | `AI Toolkit ▸ List Audit` (ClickUp doc page) — the procedure that POPULATES what this hook reads |
| **Escalation sink for undocumented lists** | The global list-documentation initiative (Audit Anna). See ESCALATION below. |

---

## Procedure

### O0 · Gate

Task context present? No → this hook is inert, emit nothing, continue. Yes → run O1–O4 **before reading the prompt for intent**.

Orientation is bounded: **~3 reads, hard ceiling 5.** This is orientation, not an audit. If you find yourself wanting a sixth read, you have drifted into `List Audit` territory, which is a different tool with a different mandate. Stop and orient with what you have.

### O1 · WHERE AM I

Resolve the containment path, not just the task: **task → List → Folder/Subfolder → Space.**

Name it. A task in `URITP ▸ Risk Assessments ▸ GENERAL Shop Hazards` is a different animal from an identically-titled task in a personal list, and nothing on the task card tells you which one you are holding.

### O2 · WHAT IS THIS LIST FOR — the documentation ladder

Work the rungs **in order** and **stop at the first hit that answers the prompt in front of you**. You are looking for the list's purpose, not its complete documentation.

1. **The List Index row for this list.** This is the intended fast path and it is designed for exactly this moment: the `Purpose` field is a one-sentence statement *"a routing agent parses BEFORE opening the doc page"* (List Audit, Step 6). Also read `Audit Status`, `Vitality`, `Cadence`, `Task Residency`, `Source-of-Truth`, and the `Doc Page` pointer. One read, six facts.
2. **The list's documentation page**, via the row's `Doc Page` field. Open this only when the `Purpose` one-liner is not enough for the prompt at hand. It carries the narrative: true-purpose prose, field census, quirks, Pass-2 flags.
3. **The list's Agent Interaction subpage**, if one exists. Tells you which agents and automations already operate here, so you do not duplicate a pipeline that is already running.
4. **The Folder page, then Space-level documentation.** A folder defines cascading fields, statuses and automations; if the list is undocumented, the folder often explains the grouping it lives in.
5. **FALLBACK — the list is undocumented.** Read the list's own description, then skim **three sibling tasks** in the same list (titles, statuses, one description). Infer the purpose from the pattern and **label the inference as an inference.**

⚠️ **`Audit Status: Queued` means the list is undocumented BY DESIGN, not that you failed to find the page.** Do not burn reads hunting for a page that has not been written. Drop to rung 5 immediately.

⚠️ **The List Index is currently a URITP-bound surface.** Other Spaces may have no index at all. When a list sits outside the indexed tree, rungs 1–3 simply miss and you land on 4 or 5 — that is the ladder working, not the ladder failing.

### O3 · WHAT IS THE HISTORY OF THIS TASK

Read the task's activity, and classify its recency into exactly one bucket:

| Bucket | Condition | What it changes about your reply |
| --- | --- | --- |
| 🔥 **WARM** | Last activity within **7 days** | You are CONTINUING a thread. Read the last exchange. Do not re-explain what was already settled, do not re-propose what was already rejected. |
| 🧊 **COLD** | Last activity **8+ days** ago | Say how long it has been and what the last thing was. Re-establish the thread before acting on it; assume Michael does not have it loaded either. |
| ⬜ **COLD-START** | No activity beyond creation | There is nothing to resume. **Say so** rather than manufacturing continuity out of the description. |

Alongside the bucket, capture four things:

- **Who spoke last** — Michael, another agent (which one), or an automation. An agent's last word is a claim, not a decision.
- **Whether the last comment left an open question unanswered.** If it did, that question is probably more relevant than the prompt you were just handed.
- **Status + assignee**, and whether either is obviously stale against the activity.
- **What KIND of task this is** — a session task, a `↪️ HANDOFF ·`, a `🧭 STANDING ·` thread, an INBOX intake item, or ordinary work. Each has its own downstream routine and a session task in particular means you are joining a transcript, not starting one.

### O4 · STAMP IT, THEN PARSE THE PROMPT

Emit **one line**, before the reply body:

```
🧭 <Space ▸ Folder ▸ List> · <list purpose, compressed to a clause or "undocumented — inferred"> · <🔥 WARM | 🧊 COLD | ⬜ COLD-START> (<N>d, last: <who/what>)
```

One line. Not a report, not a section, not a preamble. Then read the prompt and answer it.

---

## Guardrails

- **READ-ONLY.** Orientation never writes, never sets a field, never advances a status. It is a lens on existing state.
- **The stamp is the falsifiable artifact.** No stamp means the gate did not fire, exactly like a missing spine line. This is deliberate: the whole failure mode this hook addresses is a session that *has* the context and cannot be bothered to place it, and a rule with no visible output is a rule nobody can tell you skipped.
- **Name the rung you landed on.** "Undocumented — inferred from siblings" is an honest, useful answer. A confidently stated purpose that was actually guessed is the worst possible output of this hook, because it enters the record looking like documentation.
- **Never invent a list purpose.** If rungs 1–5 all miss, say the list is unreadable and ask. One question beats a fabricated frame.
- **Bounded, always.** ~3 reads, ceiling 5. Orientation that costs more than the answer is a failure of this hook, not a thorough application of it.
- **Do not let orientation eat the reply.** Michael asked a question. The stamp is one line; the answer is the deliverable.

---

## Escalation — undocumented lists

When O2 lands on rung 5, that list is a gap in the workspace, not just a gap in this session. **Note it in the reply in a single clause** ("this list has no index row") so the gaps surface where work is actually happening instead of only in a sweep.

The standing remediation is the global list-documentation initiative led by **Audit Anna** — every Space and every Folder documented, which in turn articulates which lists should exist at all. ⚠️ **As of 2026-08-03 that initiative is agreed in principle and not yet stood up as a task.** Do not point a user at a task that does not exist; surface the gap and let it be routed. Update this section with the real anchor the moment it exists, and strike this warning rather than deleting it.

---

## Composes with

- **`hooks/invocation-context.md`** — the DETECTOR. It decides comment-mode vs chat-mode; this hook is what comment-mode *does*. Detection and procedure stay in separate files on purpose (procedure-is-a-tool).
- **`AI Toolkit ▸ List Audit`** — the producer/consumer seam. The audit WRITES the index rows and doc pages; this hook READS them. Every list the audit confirms makes this hook cheaper and sharper. If orientation keeps landing on rung 5, that is the audit's backlog talking.
- **INBOX Triage Trigger** — a SPECIALIZATION of this gate, not a rival. If O1 resolves the list to `URITP ▸ INBOX ▸ Default`, finish orienting and then hand off to the triage doc and run it verbatim.
- **`hooks/session-open.md`** — if O3 identifies the task as a session task or handoff, a pickup is an open; run the open, arm the spine.
- **`hooks/stale-context-reload.md`** — a WARM task you already read earlier in this session still needs a freshness check before you edit anything it points at.
- **`gates/agent-invocation-gate.md`** — orientation runs BEFORE persona resolution. Knowing which list you are standing in is often what tells you which lane, and therefore which agent, the work belongs to.

---

## Known limits (stated so nobody re-discovers them as bugs)

- **This hook cannot make a session care.** Michael, at authoring: *"we are still always going to be at the mercy of how lazy a brain session actually is in the moment."* That is true and the design accepts it. The stamp is the mitigation: it converts laziness from invisible into obvious.
- **Doc-comment and chat-channel invocations are not covered.** `invocation-context.md` flags that context shape as TBD; until it is characterized, this hook only claims task context.
- **The ladder assumes the index is honest.** A `Purpose` field that rotted will mis-orient the whole reply, silently and confidently. The counterweight is List Audit step 7b (keep the row current), not anything in this file.

---

## Changelog

- **v1 (2026-08-03)** — Established by Brain at Michael's direction. Four-step orientation (containment path → documentation ladder → recency classifier → one-line stamp), fired from the comment-mode branch of `invocation-context.md`. Fold-in triage: NET-NEW procedure, but wired into the existing `invocation-context.md` placeholder rather than duplicating its detection logic.
