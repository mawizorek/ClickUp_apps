# Task Dedup Gate

**Purpose:** Prevent creating duplicate tasks. Before creating any new task, actively search for existing tasks with similar names or purposes in the target location and nearby.

**Mode:** Always-on (deterministic). Fires before ANY task creation.

**Trigger:** About to call `create_task` or equivalent.

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

## Output

- **Match found:** HALT or WARN (see above). Show the existing task with its status, list, and URL.
- **No match:** proceed silently.

---

## Composes with

- **Stale Context Reload:** if Brain "remembers" a task existing from earlier in the session, still run the search (it might have been moved, closed, or renamed since).
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

---

## Changelog

- 2026-07-03: Initial version.
