# Task Dedup Gate

**Purpose:** Prevent creating duplicate tasks. Before creating any new task, actively search for existing tasks with similar names or purposes in the target location and nearby. When duplicates are discovered post-creation, resolve them atomically via `merge_tasks`.

**Mode:** Always-on (deterministic). Fires before ANY task creation, and governs dupe resolution after the fact.

**Trigger:** About to call `create_task` or equivalent. Also governs any "this is a dupe" finding mid-session.

**Invocation:** Automatic. Brain runs this check before executing the create.

---

## Pass (3-step search)

### 1. Search Target List
- Search the target list (where the task would be created) for tasks with similar names.
- "Similar" = same core noun/verb, synonyms, abbreviations, or substring matches.
- Use `retrieve_tasks` with keyword search or `search_workspace` as appropriate.

### 2. Search Parent Container
- Search one level up: the folder or space containing the target list.
- A task might exist in a sibling list that covers the same work.

### 3. Evaluate Matches
- **Exact match (same name, same list):** HALT. Surface it. Ask: "This already exists. Update it instead?"
- **Near match (similar name, same or sibling list):** WARN. Surface it with a link. Ask: "Is this the same thing, or genuinely different?"
- **No match:** proceed with creation.

---

## Post-Creation Dupe Resolution (merge-first)

When a duplicate is discovered AFTER creation (batch triage, inbox sweep, manual discovery), resolve with `merge_tasks` rather than manual label-and-cull:

1. **Identify canonical** (the keeper): the task with richer history, more comments, correct location, or the one that IS the work.
2. **Merge** via `merge_tasks`: source = the dupe, destination = the canonical. Content, comments, and attachments transfer atomically. The source task is deleted.
3. **Cull post-merge** (optional): review the merged content on the canonical task. Remove redundant/duplicate information to keep the best of both.

This replaces the prior workflow of tagging dupes with a DUPLICATE label and flagging for manual delete. `merge_tasks` is atomic and irreversible, so confirm the keeper/dupe distinction before executing.

---

## Output

- **Match found (pre-creation):** HALT or WARN (see above). Show the existing task with its status, list, and URL.
- **No match:** proceed silently.
- **Dupe found post-creation:** propose merge (name source + destination), confirm, then execute.

---

## Composes with

- **Stale Context Reload:** if Brain "remembers" a task existing from earlier in the session, still run the search (it might have been moved, closed, or renamed since).
- **INBOX Triage Trigger:** the COMBINE disposition now uses `merge_tasks` as its atomic operation.
- **Gmail Inbox Sweep:** COMBINE actions in the sweep use `merge_tasks`.
- Does NOT fire on subtask creation (subtasks are inherently scoped to a parent; duplication is less risky).

---

## Exceptions

- Batch creation (user explicitly requests 5+ tasks at once): run dedup on the first 2-3 as a spot check, don't gate every single one.
- Templates/recurring: if the user says "create another" or references a template pattern, skip the gate.

---

## Examples

### Example 1: Exact dupe
User: "Create a task called Chicago Trip in the Travel list."
Search finds: "Chicago Trip" already exists in Travel, status: Open.
**Result:** HALT. "That task already exists (Open). Want me to update it instead?" + link.

### Example 2: Near match
User: "Create 'Ocoee River Rafting' in Activities."
Search finds: "Ocoee River Whitewater Rafting" in Activities.
**Result:** WARN. "Found a similar task: 'Ocoee River Whitewater Rafting'. Same thing, or separate?"

### Example 3: Clean
User: "Create 'Brewery Tour' in Activities."
Search: nothing similar.
**Result:** Proceed.

### Example 4: Post-creation dupe (merge-first)
During inbox triage, an email task arrives for "OA Info Sheet update" but "🟡 | info sheet |" already exists in Paperwork (OA 2026).
**Result:** Propose merge: DELETE the inbox task → KEEP the info sheet task. On greenlight, call `merge_tasks`. Content lands on canonical; inbox task disappears.

---

## Changelog

- 2026-08-03: Added **Post-Creation Dupe Resolution** section. `merge_tasks` is now available as an atomic tool. Dupes merge into canonical instead of being tagged DUPLICATE for manual delete. Updated Composes-with to reflect COMBINE using merge.
- 2026-07-03: Initial version.
