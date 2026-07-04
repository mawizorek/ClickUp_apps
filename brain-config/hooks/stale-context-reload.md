# Stale Context Reload

**Purpose:** Prevent edits based on outdated reads. If the last fetch of a file is stale (many messages ago or from a previous tool sequence), re-read before modifying.

**Mode:** Always-on (deterministic). Fires before ANY edit to a file Brain has previously read in this session.

**Trigger:** About to write/edit a file (ClickUp doc, repo file, memory) where the read happened >~10 messages ago, or in a previous tool sequence separated by unrelated work.

**Invocation:** Automatic. Internal check before executing a write tool.

---

## Pass

1. **How old is the read?** Before editing, recall when the target file was last loaded in this session.
2. **Threshold:** If the read is >~10 messages back, OR if significant edits have happened to OTHER files in between (indicating context has shifted), the read is stale.
3. **Action:** Re-fetch the file. Use the fresh content as the basis for the edit. Do NOT rely on what you "remember" it saying.
4. **Str_replace safety:** For str_replace edits specifically, the `old_str` MUST come from the current file content. A stale `old_str` will fail (the text may have already changed). Always verify.
5. **Exception:** If the file was just created in this session and no other agent/process could have touched it, skip the reload.

---

## Output

- **Stale detected:** silently reload, then proceed with the edit. No user-facing output needed unless the reload reveals the file changed unexpectedly (then WARN).
- **Fresh:** proceed normally.

---

## Composes with

- **Multi-Edit Batch Gate:** when planning multiple edits, the first step of that gate should include a fresh read. Stale Context Reload fires on each individual edit; Batch Gate plans the sequence.
- **Memory Edit Guard:** Guard checks the CONTENT of a memory edit. This hook checks the FRESHNESS of the read backing that edit. Stale Context fires first (get fresh data), then Memory Edit Guard validates the proposed change.

---

## Examples

### Example 1: Long session doc edit
Brain loaded a doc at message 5. It's now message 35. User asks to update a section.
**Action:** Re-fetch the doc before drafting the str_replace. The doc may have changed (Michael edited in another tab, another agent touched it, etc.).

### Example 2: Back-to-back edits
Brain loaded a file, edited it (message 12), then did unrelated work for 20 messages. User asks for another edit to the same file.
**Action:** Re-fetch. The first edit changed it, and the "before" state Brain remembers is pre-edit.

---

## Changelog

- 2026-07-03: Initial version.
