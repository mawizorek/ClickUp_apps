# Cross-Space Research Gate

**Type:** HARD STOP — fires before ANY task action, proposal, or recommendation.  
**Trigger:** Agent is about to act on, update, create within, or advise about a task or production context.  
**Created:** 2026-07-18 (Michael directive after repeated narrow-research failures).

---

## Why this exists

Michael's workspace is deeply cross-ranging. Tasks are multi-homed, production contexts span multiple spaces/folders/lists, and action items live in dedicated production lists that are NOT the same list as the planning/canonical task. Anchoring research on one list and calling it done produces wrong answers, missed context, and useless proposals. This has happened repeatedly and is unacceptable.

---

## The gate (execute in order, EVERY time)

### 1. Follow every association

Load ALL `associatedListIDs` on the task. For EACH one:
- What is this list? What's its purpose?
- What siblings/subtasks exist in it?
- What's the production context, status, structure?

Do NOT skip this. A task with `associatedListIDs` is literally telling you it lives in multiple contexts.

### 2. Chase every link

Load ALL `relatedTasks` (linked tasks). For EACH one:
- Load it fully.
- Follow ITS `associatedListIDs` and home list.
- Check ITS parent hierarchy.
- One hop is NOT enough. If a linked task points to another context, follow that too.

### 3. Domain-expand (contextual search)

Based on the topic/domain of the task, actively search adjacent surfaces:
- **Production tasks** → check production lists, budget lists, staffing lists, SPAC events, CRM people records, production calendars, reservation tasks
- **Season planning** → check show-specific lists, designer/director hires, SPAC reservations
- **People** → check CRM lists, staffing tasks, show assignments
- **Events/calendar** → check SPAC EVENTS, Meetings & Events, Recurring External Events

Don't wait for explicit pointers. If the domain implies adjacent surfaces exist, go find them.

### 4. Map before acting

For EACH context found, inventory what already exists:
- Tasks, subtasks, checklists (items + completion state)
- Current statuses (are any stale? already done?)
- Existing action items that overlap with what you'd propose
- Structure and hierarchy (where would new items belong?)

Understand the full picture BEFORE proposing anything into it.

### 5. Channel deep-dive energy

Think like Audit Anna auditing a list:
- What is the PURPOSE of each surface?
- What is the cross-reference web between them?
- What would a senior operator check before acting?
- What connections exist that aren't explicit but are implied by domain, timing, or personnel?

---

## Failure modes this prevents

- Proposing to create subtasks on a Season Planning task when a dedicated production list with 17 existing tasks already exists for that show
- Missing budget tasks, reservation tasks, or staffing tasks because they live in a different list than the canonical planning task
- Suggesting action items that already exist elsewhere in the workspace
- Anchoring on email/INBOX captures instead of finding the real production workstream
- Treating linked library-status captures as "the full picture" when they're just archived email threads

---

## When is this gate satisfied?

Only when you can answer ALL of these:
- I have checked every list this task is multi-homed into
- I have loaded and investigated every linked/related task
- I have searched adjacent surfaces relevant to this domain
- I have mapped existing tasks/subtasks/checklists in each context
- I know where action items ALREADY live vs. where new ones should go

If you cannot answer all five, you are not done researching. Go back.

---

## Integration with existing hooks

- Fires BEFORE `task-dedup-gate` (you can't check for dupes if you haven't found all the surfaces)
- Fires BEFORE any task creation, update, or action proposal
- Compatible with the URITP Production audit index (when built, the index accelerates step 3; this gate remains mandatory regardless)
