# next-build-spec.md - inbox-digest-report v3

**Goal:** "Gmail Clean-into-ClickUp Pipeline Report." Build a SECOND page that is the actual sweep report Michael acts on. This is a cold-pickup spec: everything you need is here + in `decision-log.md` + `README.md`.

> **HARD SCOPE FENCE:** do NOT touch `pages/matrix.html`. That page (the field-capture display) is done and Michael wants it left alone. You are ADDING `pages/report.html`, wiring it into `NAV`, and (v3 target) rendering it from `data/inbox-state.json`. Nothing else.

---

## Before you write a line (mandatory opening sequence)

1. **Reload this repo's current state via the git blob API** (blob-first, never a cached branch URL). Read `inbox-digest-report/index.html`, `chrome.js`, `styles.css`, `pages/matrix.html`.
2. **Read `decision-log.md` (this folder) top-to-bottom.** It carries every decision + why. The report format, the two-phase spine, the field set, the hard limits are all locked there - do not re-litigate them.
3. **Read the upstream hook** `brain-config/hooks/gmail-inbox-sweep.md` and the URITP triage doc it points to. The report is the render of that sweep.
4. **Check `VERSIONS.md`** for the current shell version before opening a PR; bump + stamp after.
5. **Standard:** this app was copied from `template-app`. Stay on the template: new page = `pages/report.html` using template classes (`.page`, `.callout`, `.badge`, `.tbl`), every color a `var(--token)`. No local `:root`, no hand-rolled shell. If the template lacks something, flag it as a template change, don't fork.

---

## What to build

### Page 2: `pages/report.html` (register in NAV as "Report")

The acting surface for a sweep. Renders the five locked buckets, every header always visible (empty = `none`):

1. **TO_MERGE** - keeper -> proposed MOVE/COMBINE + exact destination task (title + link). Shows the PLAN pre-greenlight, the DONE state post-greenlight (per-email `state`).
2. **NEEDS_REPLY** - draft parked / draft text, then archive.
3. **HAS_ATTACHMENTS** - forward to the task's email-in address for the files, THEN archive. (Attachments are filenames only - see hard limits.)
4. **ALREADY_HANDLED** - safe to archive now (already merged, e.g. an ingested-flag draft).
5. **SLOP** - grouped by sender/type; plus the **one-click clear** block: a `from:(a OR b OR c)` Gmail search string, copy-paste -> select all -> delete.

**Every email line:** inline live `gmail_url` link (tap opens the message) + the destination task link where applicable. Closing line: inbox-zero scoreboard (`Inbox: N -> M`).

**Two-phase spine (locked):** the report first renders as a pure PLAN. A greenlight (upstream, from Michael) is what flips per-email `state` from `pending_greenlight` to `merged`/`archived`. The page must render BOTH states clearly - a plan and a completed audit look different at a glance (e.g. a status pill per row).

### v3 target: render from data, stop hardcoding

Both pages currently hardcode the Jul 16 sweep in HTML. The v3 goal is to introduce **`data/inbox-state.json`** (schema in the ClickUp task + decision-log) and have `report.html` fetch + render it, so "update the dashboard" = Brain rewrites the JSON, not the HTML. Suggested: a small render function in the page (or a shared `data.js`) that maps each JSON email record into a bucket row. Keep the fetch resilient (graceful empty/parse-error state). Leave `matrix.html` static for now unless Michael says otherwise.

---

## `inbox-state.json` schema (draft - finalize in this build)

```json
{
  "sweep": { "swept_at": "ISO-8601", "swept_by": "Brain", "threads_reviewed": 0,
             "inbox_before": 0, "inbox_projected_after": 0,
             "status": "PLAN_PENDING_GREENLIGHT | EXECUTED" },
  "emails": [ { "id": "thread_id", "message_id": "", "sender": "", "sender_addr": "",
                "to": [], "cc": [], "mailbox": "inbox", "subject": "", "date": "",
                "gmail_url": "", "message_count": 1, "read_state": "read|unread",
                "attachments": [], "snippet": "",
                "bucket": "TO_MERGE|NEEDS_REPLY|HAS_ATTACHMENTS|ALREADY_HANDLED|SLOP",
                "slop_group": null, "plan": "", "dest_task_url": null, "dest_task_title": "",
                "reply_needed": false, "state": "pending_greenlight|merged|archived|safe_to_delete" } ],
  "slop_delete_query": "from:(a OR b OR c)",
  "buckets": ["TO_MERGE","NEEDS_REPLY","HAS_ATTACHMENTS","ALREADY_HANDLED","SLOP"]
}
```

---

## Hard limits (do not violate; carry from the hook)

Brain can READ + SEARCH + DRAFT Gmail. Brain CANNOT read labels/folders, mark read, archive, move, relabel, pull attachments into ClickUp, or send email (send lock active). The report is instructions to Michael for the clicks Brain can't do; it must NEVER claim a state change already happened. Attachments travel only when Michael forwards to the task's email-in address.

## Open question parked for Michael (do not action)

Can GitHub itself run the Gmail API pulls (e.g. a GitHub Action) to auto-refresh `inbox-state.json`? Michael asked; answer lives in the ClickUp thread. This spec assumes Brain writes the JSON during a sweep; a CI auto-pull is a SEPARATE future decision, not part of v3.
