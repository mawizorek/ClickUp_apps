# inbox-digest-report / data

**This folder is the ONLY source of truth for what the report renders.** `pages/report.html` is a pure renderer: it fetches `inbox-state.json` and draws it. To refresh the dashboard after a Gmail sweep, **edit `inbox-state.json` and nothing else.** Never put email data in the HTML/JS/CSS.

---

## `inbox-state.json` — the rolling sweep state

**Rolling, not append.** The file holds the CURRENT inbox only and is rewritten wholesale each sweep. It never grows into a log. Realistic sweeps are 5–30 emails (2–10KB), well under the 30KB read cap.

### Top-level shape

```json
{
  "schema_version": "1.0",
  "sweep": { ... },
  "buckets": ["TO_MERGE","NEEDS_REPLY","HAS_ATTACHMENTS","ALREADY_HANDLED","SLOP"],
  "slop_delete_query": "in:inbox from:(a OR b OR c)",
  "emails": [ { ...email record... } ]
}
```

### `sweep` object

| Field | Type | Meaning |
| --- | --- | --- |
| `swept_at` | ISO-8601 string | When the sweep ran. Drives the “swept” stamp. |
| `swept_by` | string | Who ran it (usually `Brain`). |
| `threads_reviewed` | integer | How many inbox threads were reviewed. |
| `inbox_before` | integer | Inbox count before the plan. Left side of the scoreboard. |
| `inbox_projected_after` | integer | Inbox count if every action is taken (usually 0). Right side. |
| `status` | enum | `PLAN_PENDING_GREENLIGHT` (default) or `EXECUTED`. Anything matching `PLAN` renders the PLAN banner; otherwise the EXECUTED audit banner. |

### `emails[]` — one object per inbox thread

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | string | yes | Gmail `thread_id`. |
| `message_id` | string | yes | Gmail `message_id` of the message shown (deep-link target). |
| `sender` | string | yes | Display name. Shown bold in the Email cell. |
| `sender_addr` | string | yes | Email address. Feeds the slop clear query for SLOP rows. |
| `to` | string[] | no | Recipients. |
| `cc` | string[] | no | CC. |
| `mailbox` | string | no | Always `inbox` for a sweep. |
| `subject` | string | yes | Subject line. |
| `date` | ISO-8601 | yes | Message date. |
| `gmail_url` | string | yes | Deep link; renders the “open in Gmail” link. |
| `message_count` | integer | no | Messages in the thread. |
| `read_state` | `read`\|`unread` | no | Read state at sweep time. |
| `attachments` | string[] | no | **Filenames only** (Brain cannot pull attachment bytes). |
| `snippet` | string | no | Preview, 2 lines max, never the full body. |
| `bucket` | enum | yes | One of the five buckets below. Places the row. |
| `slop_group` | string\|null | SLOP only | Type label for the SLOP grouping chips (`scam`, `newsletter`, `promo`, …). |
| `plan` | string | yes | The action sentence in the third column (for SLOP, the type description). |
| `plan_note` | string\|null | no | Secondary muted note under the plan. |
| `dest_task_url` | string\|null | no | Destination ClickUp task URL. If set with a title, renders a task link. |
| `dest_task_title` | string\|null | no | Task title. With a URL → link; **without** a URL → a “new task: …” proposed-task tag. |
| `reply_needed` | boolean | no | True for NEEDS_REPLY rows. |
| `state` | enum | yes | Drives the status pill (see below). |

### `bucket` enum (fixed render order; every header always shows, empty = `none`)

1. `TO_MERGE` — keeper content to COMBINE/MOVE into a task, then archive.
2. `NEEDS_REPLY` — draft parked / draft text, then archive.
3. `HAS_ATTACHMENTS` — forward to the task's email-in address for the files, THEN archive.
4. `ALREADY_HANDLED` — nothing to capture; safe to archive now.
5. `SLOP` — grouped by sender/type; cleared via `slop_delete_query`.

### `state` enum → status pill (color, label)

| `state` | Pill | When |
| --- | --- | --- |
| `merge_pending` | warn · merge | TO_MERGE, awaiting greenlight |
| `reply_pending` | warn · reply | NEEDS_REPLY, draft awaiting greenlight |
| `forward_pending` | warn · forward | HAS_ATTACHMENTS, awaiting your forward |
| `archive_ready` | info · archive | ALREADY_HANDLED, safe to archive |
| `delete_ready` | bad · delete | SLOP, safe to delete |
| `merged` | good · merged | post-execution audit |
| `archived` | good · archived | post-execution audit |
| `deleted` | good · deleted | post-execution audit |

### `slop_delete_query` (LOCKED format)

Always `in:inbox from:(addr OR addr OR …)`, built from the `sender_addr` of every SLOP row. **The `in:inbox` prefix is mandatory** — a bare `from:()` searches ALL mail (archive + every label) and would sweep up account records and receipts. See decision-log 2026-07-16 (v3.1 bugfix).

---

## Hard limits (carry from the sweep hook)

Brain can READ + SEARCH + DRAFT Gmail. Brain CANNOT read labels/folders, mark read, archive, move, relabel, pull attachments, or send email (send lock active). Every `*_pending` / `*_ready` state is an instruction to Michael for a click Brain cannot make; the report NEVER claims a state change already happened. The full procedure lives in `brain-config/hooks/gmail-inbox-sweep.md`.
