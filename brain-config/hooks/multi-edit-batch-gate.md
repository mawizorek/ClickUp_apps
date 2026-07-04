# Multi-Edit Batch Gate

**Purpose:** When about to make 3+ sequential edits to the same document or file, pause and plan the full sequence before starting. Prevents cascading str_replace failures where edit N invalidates the old_str for edit N+1.

**Mode:** Always-on (deterministic). Fires when Brain identifies 3+ edits needed on a single file.

**Trigger:** Planning or about to execute 3+ str_replace (or equivalent edit) calls on the same file in one pass.

**Invocation:** Automatic. Brain catches this during planning, before executing the first edit.

---

## Pass

### 1. Identify the Full Scope
- Before touching the file: list ALL edits needed.
- Write them out (internally) as a sequence: what changes, in what order.

### 2. Fresh Read
- Fetch the current file content (Stale Context Reload composes here).
- Use the FRESH content to draft all old_str values.

### 3. Order for Safety
- **Bottom-up rule:** when edits are at different positions in the file, execute from bottom to top. Later-in-file edits don't shift the line positions of earlier content.
- **Non-overlapping check:** if any two edits touch overlapping text, merge them into one str_replace with a larger old_str.
- **Dependency check:** if edit B depends on the result of edit A (e.g., A creates a section that B then modifies), they CANNOT be parallelized. Execute sequentially.

### 4. Batch Emission
- If edits are independent (non-overlapping, no dependencies): emit them ALL in one function_calls block. The system batches them atomically.
- If edits have dependencies: emit in the minimum number of sequential blocks.

### 5. Verify After
- After all edits complete: read the file back (or at minimum, check the tool results for success). Confirm no edit was silently dropped.

---

## Output

- **Planning visible:** Brain may briefly note "Planning N edits to [file], executing bottom-up" in the response if it helps Michael follow along. Not required for simple cases.
- **Failure recovery:** if any edit in the batch fails (old_str not found), STOP remaining edits. Re-read the file (it's now in a partially-edited state). Re-plan remaining edits from the new content.

---

## Composes with

- **Stale Context Reload:** ensures the read is fresh before planning.
- **Memory Edit Guard:** if the file is /PREFERENCES.md, the Guard validates content. This gate validates the SEQUENCE.
- **update_document note:** ClickUp docs support atomic batching ("emit all edit calls in a single response"). Use this. The batch gate plans what goes into that single response.

---

## Examples

### Example 1: Three non-overlapping edits
Need to update a header, a mid-section, and a footer in one doc.
**Plan:** Fresh read → identify all three old_str values → emit all three str_replace calls in one block (they're independent) → verify.

### Example 2: Dependent edits
Need to add a new section (edit A), then add a cross-reference to it from an existing section (edit B).
**Plan:** Edit A first (creates the section). Then fresh-read if needed, then edit B (references the new section). Two sequential blocks.

### Example 3: Overlapping text
Two edits both touch the same paragraph (one changes the first sentence, another changes the third sentence).
**Plan:** Merge into one str_replace with old_str = the full paragraph, new_str = paragraph with both changes applied.

---

## Changelog

- 2026-07-03: Initial version.
