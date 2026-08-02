# Sweep for Links

**Purpose:** Every linkable entity mentioned in a reply gets hyperlinked, every time it appears. Zero dead-name references. If a name appears three times, it's linked three times. The user should never have to wonder "where is that?" or copy-paste a name into search.

**Mode:** Always-on (deterministic). Fires post-draft, pre-post on EVERY user-facing response.

**Trigger:** Final pass before posting any reply (comment, chat message, DM, or artifact delivery).

**Invocation:** Automatic. Internal sweep of the composed reply before it leaves.

---

## Pass

### 1. Entity Scan

Sweep the draft reply for any of these entity types mentioned by name:

| Entity type | Link format | Source |
|---|---|---|
| ClickUp task | `[Task Name](task URL)` | Tool results, context |
| ClickUp doc / doc page | `[Doc Name](doc URL)` | Tool results, context |
| ClickUp list / folder / space | `[Name](URL)` | Tool results, context |
| ClickUp view | `[View Name](view URL)` | Tool results, context |
| ClickUp chat channel | `[Channel Name](channel URL)` | Tool results, context |
| GitHub file / directory | `[path/filename](blob URL)` | Tool results, commits |
| GitHub repo | `[owner/repo](repo URL)` | Known repos |
| Decision Log (named DL) | `[DL Name](doc URL)` | Tool results, context |
| Agent (by slug or name) | `[Agent Name](config path blob URL)` | roster.json, known paths |
| User (@mention) | `[@Name](#ID)` | Context, tool results |

### 2. Linking Rules

- **Every mention gets linked.** If "servicing-lifecycle.md" appears 4 times, it's hyperlinked 4 times. Repetition is intentional, not a mistake.
- **Prefer the most specific URL available.** Doc page > doc root. File blob > directory. Task direct link > search link.
- **Never fabricate a URL.** If you can't resolve the link from current session context (tool results, compressed URLs, memory pointers, user-provided), leave it as plain text. Do NOT guess.
- **GitHub paths use /blob/ URLs.** Never raw.githubusercontent. Format: `https://github.com/{owner}/{repo}/blob/{branch}/{path}`
- **Compressed URLs are valid.** Use them as-is from context (`https://{type}-{index}`).
- **Code blocks are exempt.** Don't linkify entity names inside fenced code blocks or inline code spans.
- **Alt-text / descriptions are exempt.** Don't nest links inside link text.

### 3. Closing Confirmation Tag

After the sweep completes, append a closing line to the reply:

```
═══ reply link-swept ═══
```

This confirms the hook fired. If the tag is missing from a reply, the hook failed or was skipped (flag for debugging).

### 4. On Failure

- If an entity name is found but no URL can be resolved from the current session: leave it as plain bold text (`**Entity Name**`) rather than unlinking silently.
- Never block a reply because a link couldn't be resolved. The tag still appears.

---

## Composes With

- **Link Provenance:** validates URL freshness. Sweep-for-Links identifies WHAT to link; Link Provenance validates that the URL is still alive. Run provenance first, then sweep.
- **Session Transcript Gate:** transcript posts also get swept.
- **Source & ID Guard:** prevents fabricated IDs. Complementary: this hook won't link what it can't resolve.

---

## Exceptions

- Replies that are pure tool confirmations ("done", "np") with no entity references: tag still appears, sweep is just a no-op.
- Progress messages / internal tool parameters: NOT swept (not user-facing).
- Reactions-only responses: no tag needed.

---

## Examples

### Example 1: Task mentioned twice
Draft says: "I updated the FileMaker build task and added a subtask under FileMaker build."
After sweep: "I updated the [FileMaker build](https://app.clickup.com/t/86ah8jdhw) task and added a subtask under [FileMaker build](https://app.clickup.com/t/86ah8jdhw)."

### Example 2: GitHub path
Draft says: "The process doc is at filemaker/hml-llc/process/servicing-lifecycle.md"
After sweep: "The process doc is at [`filemaker/hml-llc/process/servicing-lifecycle.md`](https://github.com/mawizorek/ClickUp_apps/blob/main/filemaker/hml-llc/process/servicing-lifecycle.md)"

### Example 3: Unresolvable entity
Draft mentions "the onboarding doc" but no URL exists in session context.
After sweep: "the **onboarding doc**" (bolded, not linked, not fabricated)

---

## Changelog

- 2026-08-02: Initial version. Authored by Dex at Michael's request.
