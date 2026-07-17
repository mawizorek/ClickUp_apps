# next-build-spec.md - inbox-digest-report v3

**Goal:** "Gmail Clean-into-ClickUp Pipeline Report." Build the **Report** page and make it the NEW LANDING PAGE. This is a cold-pickup spec: everything you need is here + in `decision-log.md` + `README.md`. Follow it exactly. Do not improvise; if something is ambiguous, STOP and ask Michael rather than inventing.

> **HARD SCOPE FENCE (do not cross):**
> - **DO NOT edit `pages/matrix.html`.** It is the finished, direct field read-out. It stays byte-for-byte as-is and simply becomes the second page.
> - You are ADDING `pages/report.html`, adding it to `NAV`, and repointing `DEFAULT_PAGE` to `report` in `index.html`. That is the whole surface area of this build.
> - Do NOT set up any Gmail/GitHub-Action auth. Locked decision: no auth (see decision-log). Brain writes the data in-session.

---

## The page swap (exact edits, do not improvise)

In `inbox-digest-report/index.html`, change exactly two things:

1. `var DEFAULT_PAGE = "matrix";`  ->  `var DEFAULT_PAGE = "report";`
2. `NAV` array: add the report route FIRST so it leads the menu. Result:
   ```js
   var NAV = [
     { route: "report",  label: "Report" },
     { route: "matrix",  label: "Field Matrix" },
     { route: "about",   label: "About" }
   ];
   ```
3. Bump `APP_VERSION` and `APP_PR` to this build's values.

Everything else in `index.html` stays. `matrix.html` is not touched. `report` becomes the index-pointed landing; `matrix` lives on as the direct read-out at `#matrix`.

---

## Before you write a line (mandatory opening sequence)

1. **Reload this repo's current state via the git blob API** (blob-first, never a cached branch URL). Read `inbox-digest-report/index.html`, `chrome.js`, `styles.css`, `pages/matrix.html`.
2. **Read `decision-log.md` (this folder) top-to-bottom.** Report format, two-phase spine, field set, hard limits, and the no-auth call are all LOCKED there. Do not re-litigate them.
3. **Read the upstream hook** `brain-config/hooks/gmail-inbox-sweep.md` and the URITP triage doc it points to. The report is the render of that sweep.
4. **Check `VERSIONS.md`** for the current shell version before opening a PR; bump + stamp after.
5. **Standard:** this app was copied from `template-app`. Stay on it: `pages/report.html` uses template classes (`.page`, `.callout`, `.badge`, `.tbl`), every color a `var(--token)`. No local `:root`, no hand-rolled shell. If the template lacks something, flag it as a template change, don't fork.

---

## What to build: `pages/report.html`

The acting surface for a sweep. Renders the five locked buckets; **every header always renders** (empty = `none`) so nothing looks silently dropped:

1. **TO_MERGE** - keeper -> proposed MOVE/COMBINE + exact destination task (title + link). Shows the PLAN pre-greenlight, the DONE state post-greenlight (per-email `state`).
2. **NEEDS_REPLY** - draft parked / draft text, then archive.
3. **HAS_ATTACHMENTS** - forward to the task's email-in address for the files, THEN archive. (Attachments are filenames only - see hard limits.)
4. **ALREADY_HANDLED** - safe to archive now (already merged, e.g. an ingested-flag draft).
5. **SLOP** - grouped by sender/type; plus the **one-click clear** block: a `from:(a OR b OR c)` Gmail search string, copy-paste -> select all -> delete.

**Every email line:** inline live `gmail_url` link (tap opens the message) + the destination task link where applicable. Closing line: inbox-zero scoreboard (`Inbox: N -> M`).

**Two-phase spine (locked):** the report first renders as a pure PLAN. A greenlight (upstream, from Michael) flips per-email `state` from `pending_greenlight` to `merged`/`archived`. The page must render BOTH states clearly - a plan and a completed audit look different at a glance (e.g. a status pill per row).

**Seed data:** hardcode the Jul 16 sweep (same 5 threads as `matrix.html`) into `report.html` for this build so the page renders real content. The move to a fetched `data/inbox-state.json` is the NEXT build (below), NOT this one. Do not introduce the JSON fetch yet unless Michael says so.

---

## AFTER this build (v4 target, do not start without a new greenlight): render from data

Introduce **`data/inbox-state.json`** (schema below) and have `report.html` fetch + render it, so "update the report" = Brain rewrites the JSON, not the HTML. Small render function maps each JSON email record into a bucket row; keep the fetch resilient (graceful empty/parse-error state). `matrix.html` stays static unless Michael says otherwise.

### `inbox-state.json` schema (draft - finalize when v4 starts)

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
