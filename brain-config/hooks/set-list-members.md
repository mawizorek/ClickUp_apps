# Set List Members · AI Toolkit

**Status: 🟡 PROPOSED — NOT LIVE.** Do not execute this hook. It carries three unanswered questions (see Open Questions) and has not been through The Workshop. A cold agent finding this file should treat it as a design document, run the two calls by hand, and say so.

**Purpose:** Reconcile a reference list's membership to a declared set of tasks in one operation — remove who should not be there, add who should, leave the rest alone — without ever touching a task's home list.

**Steward:** Unassigned at authoring. Seat Fleet Felix to assign before merge. Candidate: **ClickUp Coach Corey** (URITP workspace structure + list connections is his lane); the CRM/people-domain half consults **Mainstage Milo**.

**Mode:** On-demand routine. Preview-then-apply.

**Invocation:** `/set-members` · `/swap-member` · `/set-working-set`

**Trigger:** Michael hands over one or more task links plus a target reference list and wants that list's membership to *become* exactly that set. Also fires on the shorthand "make X the current student," "swap the current student to X," "make the scene shop crew the active set."

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-09-04** by Maestro Mira (seating) and Dev Dexter (spec), from a live single-student swap on `Current Student`.

---

## Why this is one tool and not two

The request arrived as *"swap the current student."* It was tempting to build exactly that: a tool hardcoded to one list that evicts one task and seats another.

Fold-in Frank ruled **NET-NEW, scoped as one primitive.** The reason is in Michael's own follow-up (2026-09-04): *"once we get it reliable, I'll likely want to take all the students in the scene shop and make them the active working set."*

Those are not two features. **"Swap the current student" is the N=1 case of "set the membership of list L to set S."** Same read, same diff, same two write calls. A tool built around the singular case has to be rewritten to serve the plural case; a tool built around the set serves both on day one and costs nothing extra to build.

**Consequence for v1: the target list is a PARAMETER, never hardcoded.** `Current Student` is the first caller, not the tool's identity. This is the single design decision that separates a throwaway from a primitive, and it is the one most likely to get quietly reversed by someone optimizing for a shorter v1.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **First caller (target list `L`)** | `Current Student` — list id `901328984066`, URITP CRM ▸ PEOPLE |
| **Canonical home for people records** | `STUDENTS` — the home list of every task this tool moves *references* to |
| **Space** | URITP CRM (`4026867983835587579`) |
| **Underlying calls** | `add_task_to_list` with `operation: add_to_list` / `remove_from_list` |
| **Never used by this hook** | `move_task_to_list` — see Guardrails |

---

## The primitive

```
setListMembers(L, S) -> { added[], removed[], kept[], refused[] }
```

Declarative and **idempotent**: running it twice with the same `S` produces no second change. The caller states the desired end state, not the steps.

### Procedure

1. **Resolve `L`.** Confirm it is a list, not a folder or view. Record its id and name in the preview.
2. **Resolve `S`.** Each input link resolves to exactly one task. A link that resolves to zero, or to something that is not a task, is a **refusal**, not a skip — name it and stop.
3. **Read current membership of `L`.** This is the step the manual method skips and the reason the manual method is unsafe at N>1: you cannot compute a correct removal set without it.
4. **Diff.** `removed = current \ S` · `added = S \ current` · `kept = current ∩ S`.
5. **Home-list check.** For every task in `removed`, verify `L` is not that task's home list. Any hit is a hard **refusal** for that task (see Guardrails).
6. **Present the diff and STOP.** Counts plus named, linked tasks. Never skip straight to apply, even at N=1 — the preview is where a wrong link gets caught, and a wrong link at N=20 is a mess to unwind.
7. **On confirmation, apply.** Removals first, then adds. Order matters only for lists carrying a cardinality constraint (Q1).
8. **Report what actually landed**, read back, not assumed.

---

## Input forms

**v1 — the only form that ships first.** One or more task links plus the target list. `S` is written out literally.

**v2 — deferred, explicitly designed for.** `S` supplied by reference rather than enumeration: a source list, a saved view, or a filter ("every Person task with `SCENE SHOP` presence"). This is the form that makes the scene-shop case a single sentence instead of twenty links, and v1's shape must not foreclose it. Concretely: `S` is a resolved array of task ids at the point the diff runs, and *how it got resolved* is upstream of the primitive. Keep that seam clean.

---

## Guardrails

- 🔴 **NEVER `move_task_to_list`.** This hook operates only on *additional* list membership. A task's home list is where its status set and field values live; moving it is a different, destructive operation governed by the Task Move Impact Gate. Multi-homing and moving get conflated constantly in conversation, and the whole safety story of this tool rests on the distinction.
- 🔴 **Refuse to remove a task from its own home list.** Removing a task from its home list is not a dereference, it is closer to an orphaning, and this tool has no business doing it. Name the refusal, apply the rest of the batch, report both.
- 🚫 **Never creates a task.** A link in `S` that does not resolve is a refusal, not an invitation to create the person.
- 🚫 **Never edits a task's fields, status, assignees or name.** Membership only.
- ⚠️ **Preview is mandatory at every N,** including 1. Confirmation covers the whole batch, not per row.
- ⚠️ **Partial application must be reported as partial.** If three of twenty adds fail, the report says three failed and names them. A silent partial success is the worst outcome this tool can produce, because the list *looks* correct.
- ⚠️ **Cap the batch.** Provisional ~30 tasks per run, **CALCULATED NOT MEASURED** — the first live plural run replaces this number with an observed one.
- ⚠️ **State the count before writing, then read it back after.** Per the standing never-write-an-unread-number rule.

---

## Open Questions (these block v1)

**Q1 · Cardinality — what is the rule when `L` already holds zero, or more than one?** Asked 2026-09-04, unanswered. Three candidate rules:
- *Set semantics* (recommended): whatever is there, make it `S`. Zero occupants is fine, twelve is fine.
- *Singleton enforcement*: `L` is declared max-one and the tool refuses `S` of size >1.
- *Refuse on surprise*: if `current` is not exactly size 1, stop and ask.

  Dexter's take: **set semantics on the primitive, with an optional per-list `max_members` declaration.** The singular behavior Michael wants on `Current Student` is then a property of that list, not of the tool. If cardinality is baked into the tool, the scene-shop case needs a second tool, and we are back to the thing Frank just refused.

**Q2 · Operator identity — who runs this?** Michael's greenlight names *"Mimi"* as the intended operator. **That token does not resolve** against the 🤖 Agent Index or workspace users (checked 2026-09-04). Closest candidates: `mimic-mika` (Mimic Mika, lens class), or plain dictation for *"me."* Per the name-resolution rule this was NOT guessed. It matters here and is not cosmetic: an operator who is not Michael changes whether the apply step needs its own permission check, and whether the preview goes to the operator or to Michael.

**Q3 · Validation scope for Phase 2.** Michael deferred "peeper record home list" validation (dictation; read as *Person record home list*). Confirmed deferred, not dropped. Open sub-question: is the check *task type is `Person`*, *home list is inside PEOPLE*, or both? They fail differently — a Person task homed outside PEOPLE is a data problem worth flagging; a non-Person task is a wrong link worth refusing.

---

## Phasing

| Phase | Scope | Gate |
| --- | --- | --- |
| **v1** | `setListMembers(L, S)` with `S` enumerated. Parameterized `L`. Preview-then-apply. | Q1 + Q2 answered; Workshop run |
| **v2** | `S` by reference (source list / view / filter). Unlocks the scene-shop case in one sentence. | v1 proven on a real plural run |
| **Phase 2 validation** | Type + home-list validation on every link in `S` (Q3). | Independent of v1/v2; bolt-on |
| **Phase 3 — SEPARATE TOOL** | The button: spawn an assignment program per member of the active set. | v2 reliable |

🔴 **Phase 3 is a different tool and must not be folded in.** It *reads* the set this hook maintains and *writes* program/assignment tasks. Folding a create-many operation into a membership-reconciler gives you one tool whose blast radius is unpredictable from its name, and no way to re-run the membership half without re-running the creation half. The clean seam is exactly what makes the button safe to click twice.

---

## Composes with

- **Multi-Home Gate** — fires on every add this hook performs. The gate asks *should this task be multi-homed at all*; this hook asks *is the membership set correct*. The gate's question is answered once when a reference list is designed, not per run, so a run of 20 adds does not mean 20 gate evaluations. Confirm that reading with Corey before merge.
- **Task Move Impact Gate** — deliberately NOT in scope, and the boundary is load-bearing. See Guardrails.
- **Task Dedup Gate** — not in scope; this hook never creates.
- **Reconcile Engine** (`hooks/reconcile-engine.md`) — adjacent but distinct. The engine compares two surfaces and *proposes*; this hook is handed the answer and *writes*. Do not route this through the engine: propose-only is the engine's defining constraint and writing is this hook's entire purpose.
- **Derived Field Pattern** — worth reading before anyone proposes making `Current Student` a *field* instead of a list. That is a real alternative design and it was not evaluated. Flagged for the Workshop.

---

## Known limits

- Generalized from **ONE manual run at N=1** (Bia Lage → Alex Sapounov on `Current Student`, 2026-09-04). Every plural claim in this file is a prediction. A session finding no prior plural run **says so**.
- Cannot see ClickUp automations. If an automation watches membership of `L`, this tool will trip it and cannot tell you in advance.
- The batch cap is arithmetic, not evidence.

---

## Changelog

- **v1-proposed (2026-09-04)** — Spec written by Dev Dexter, seated via Maestro Mira, after Fold-in Frank returned NET-NEW-as-one-primitive. Born from a live `Current Student` swap done by hand. Three open questions block build; Workshop not yet run.
