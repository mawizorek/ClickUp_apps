# Link Provenance

**Purpose:** Before emitting a ClickUp URL in a response, verify it came from a tool result THIS session. Prevents dead links from stale memory, renamed pages, or moved assets.

**Mode:** Always-on (deterministic). Fires before including any ClickUp URL in a user-facing response.

**Trigger:** About to output a ClickUp URL (task, doc, view, list, chat, or comment link) in a response to the user.

**Invocation:** Automatic. Internal check before finalizing the response.

---

## Pass

### 1. Source Check
- Where did this URL come from?
  - **Tool result this session** (search_workspace, retrieve_tasks, load_assets, etc.): PASS.
  - **Memory / PREFERENCES.md pointers**: PASS (these are maintained and validated).
  - **User provided it in this conversation**: PASS.
  - **Context sidebar (recents, favorites, pinned)**: PASS (system-provided, current).
  - **Recalled from earlier sessions / general knowledge**: FAIL.

### 2. On Failure
- Do NOT output the URL.
- Instead: either search for the asset by name to get a fresh URL, or refer to it by name without a link.
- If the URL is critical to the response: run a quick `search_workspace` to verify it's still live, then use the returned URL.

### 3. Compressed URL Awareness
- All ClickUp URLs in context are compressed (`https://{type}-{index}`).
- These are ALWAYS valid for the current session (system-managed). PASS by default.
- Never invent a compressed URL. Only use ones present in your context.

---

## Output

- **Valid provenance:** include the link normally.
- **Invalid provenance:** omit the link, reference by name, or verify first. No broken links in responses.

---

## Composes with

- **Source & ID Guard** (existing hook): catches fabricated IDs. Link Provenance catches STALE but once-real URLs. Different failure mode, complementary.
- **Stale Context Reload:** if a URL came from a stale read, reload will refresh it. But Link Provenance catches URLs that were never loaded this session at all.

---

## Exceptions

- External URLs (GitHub, web links, etc.) are NOT covered by this hook. Only ClickUp workspace URLs.
- URLs used as tool INPUT (passing to load_assets, etc.) don't need provenance checking; the tool will fail gracefully if the URL is dead.

---

## Examples

### Example 1: Memory pointer
Brain references "the Session Close spec" and links to https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-74173 (from PREFERENCES.md).
**Result:** PASS. Memory pointers are maintained.

### Example 2: Recalled from last week
Brain "remembers" a task URL from a previous session that isn't in current context.
**Result:** FAIL. Search for the task by name, use the fresh URL.

### Example 3: Tool result
Brain just ran search_workspace and got a doc URL in the results.
**Result:** PASS. Use it.

---

## Changelog

- 2026-07-03: Initial version.
