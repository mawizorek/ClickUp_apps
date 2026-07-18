# Email Chain Parse

**Type:** trigger
**Purpose:** Decompose a raw email chain into structured, chronological comment chunks posted to a target task.
**Invocation:** Automation trigger fires on new email task, or manual `/email-chain-parse` call.
**Requires:** `post_comment`, `load_assets`

---

## Input Contract

The caller MUST provide:

| Parameter | Source | Required |
|-----------|--------|----------|
| `target_task` | The task ID or URL where comments will be posted | Yes |
| `email_body` | The full email chain (HTML or plain text) from the task description or attachment | Yes |
| `source_context` | Where this email came from (inbox list, forwarded, automation) | No (informational) |

If `target_task` is not explicitly provided, use the task that triggered the automation. Never infer from ambient context beyond the triggering entity.

---

## Steps

1. **Read the full email body.** Load `email_body` from the target task's description or the provided content. If HTML, parse it; if plain text, work with reply markers.

2. **Split by reply boundaries.** Identify each discrete message in the chain using standard markers:
   - `From:` / `Date:` / `Subject:` header blocks
   - `On [date], [name] wrote:` patterns
   - `>` quote-prefix blocks (attribute to the previous sender)
   - `---------- Forwarded message ----------` boundaries
   - Visual separators (`---`, `___`, `===`)

3. **Attribute each chunk.** For every split message, extract:
   - **Sender** (name + email if available)
   - **Timestamp** (date/time of that message, normalize to readable format)
   - **Direction** (inbound, outbound, forwarded)

4. **Order chronologically.** Oldest message first, newest last. Email chains are typically reverse-chronological; flip them.

5. **Extract action items.** Scan each chunk for:
   - Explicit asks ("can you...", "please...", "need you to...")
   - Deadlines mentioned
   - Questions awaiting response
   - Commitments made ("I'll...", "we will...")
   Tag these with `[ACTION]` inline.

6. **Format each chunk per output template.** (See below.)

7. **Post as sequential comments.** One comment per message in the chain, posted in chronological order to `target_task`. If the chain is 3+ messages deep, post a summary comment FIRST, then the individual chunks.

8. **Self-check.** Verify:
   - [ ] Every message in the chain has a corresponding comment
   - [ ] Chronological order is correct (oldest first)
   - [ ] No content was dropped or summarized without the full text also appearing
   - [ ] Action items are tagged
   - [ ] Sender attribution is on every chunk

---

## Output Template

### Summary comment (if chain depth >= 3)

```
📧 Email Chain Parsed — [subject line]

Participants: [list of senders]
Thread depth: [N] messages
Date range: [oldest] → [newest]
Action items found: [count]

[One-line summary of the thread arc]
```

### Per-message comment

```
📨 [Sender Name] · [timestamp] · [direction badge: ⬅️ inbound / ➡️ outbound / ↪️ forwarded]

---

[Full message body, preserved verbatim]

---

[ACTION] items (if any):
- [extracted action item]
- [extracted action item]
```

---

## Edge Cases

- **Single email (no chain):** Skip the summary. Post one comment with the full body + attribution.
- **Unattributable chunks:** If a reply boundary is detected but sender can't be extracted, use `[Unknown sender]` and flag in the comment: `⚠️ Could not attribute this segment.`
- **Inline replies:** If someone replied inline (between quoted lines), break those out as their own attributed chunks.
- **Attachments referenced:** Note `📎 [filename] referenced` but do NOT attempt to fetch or process the attachment. That's a separate trigger (`attachment-intake`).

---

## Does NOT

- Decide what to do with the email (that's triage, not parsing)
- Create new tasks
- Move or relabel anything
- Summarize instead of preserving verbatim content
- Send replies or drafts

---

## Composes With

- **gmail-inbox-sweep** — sweep identifies keepers, this trigger parses them into comments
- **task-dedup-gate** — may fire before this to find the right target task
- **attachment-intake** — handles any files referenced in the chain

---

## Changelog

- 2026-07-18 — created. First trigger-type hook. Replaces inline automation prompt for email chain decomposition.
