# next-build-spec.md - inbox-digest-report v4

**Goal:** "Gmail Clean-into-ClickUp Pipeline Report." Build the sweep report Michael acts on, and make it the app's **landing page**. This is a cold-pickup spec: everything you need is here + in `decision-log.md` + `README.md`.

> **STATUS (2026-07-16):** v3 SHIPPED (PR #316). `pages/report.html` is live and is the landing page (`DEFAULT_PAGE=report`, NAV = Report → Field Matrix → About), seeded with the Jul 16 sweep hardcoded. `pages/matrix.html` untouched, now page 2. **Remaining work = the JSON-render target below + the v4 open items directly under this line.**

> **HARD SCOPE FENCE:** do NOT touch `pages/matrix.html`. That page (the field-capture display) is done and Michael wants it left EXACTLY as-is. You are ADDING `pages/report.html`, making it the landing page, and reordering NAV. The matrix lives on as the second page (the direct raw read-out), pointed to by index/NAV, unedited.

---

## v4 OPEN ITEMS — template/theme hurdles + a slop-query safety fix (for agent discussion)

*Dictated by Brain after the v3 build (2026-07-16), at Michael's request, for discussion with other agents before the next build. These are NOT yet decided — they are the friction hit while building `report.html` on the template + theme spine, plus one live bug Michael's own search surfaced. Nothing here is locked; the Workshop/Council should weigh in.*

### A. Did the template objects / theme tokens limit the report? (partly — yes)

The report was built 100% on existing template classes + the app's `.matrix-*` helpers, no fork, no local `:root`. It works, but it leaned on primitives that weren't designed for an *acting* surface. Candidate **template changes** (promote into `template-app`, do not fork a private variant):

1. **No status-pill primitive.** The two-phase spine needs a per-row state indicator (pending / merged / archived / delete). There is no `.pill` in the template, so I reused `.badge` (`good/warn/bad/info`). It renders, but a badge is semantically a *label chip*, not a *state machine*. Worse: I had to borrow `.badge.warn` (amber) for the "pending" state, which visually reads as a warning, not a neutral hold. **Proposal:** add a real `.pill` with explicit state modifiers to the template, backed by tokens.
2. **No neutral / "pending" theme token.** The spine has `--good/--warn/--bad/--info` but no distinct *neutral-hold* color, so "pending greenlight" has to hijack `warn`. **Proposal:** add a `--neutral`/`--pending` token to the theme spine so a hold state doesn't look like an alert.
3. **`.chip` / `.coverage` / `.matrix-meta` / `.tag` live in the app-local MATRIX block, not the template base.** The report reuses all four (slop groups, phase legend, meta line). That means two pages now depend on "matrix-scoped" helpers, which per the fence should be **promoted to generic template primitives** (renamed off the `matrix-` prefix) rather than silently shared. Flagging as a template change, not a fork. **Proposal:** lift chip/tag/meta into the template proper as neutral primitives; matrix + report both consume them.
4. **No bucket/section primitive.** Each of the five buckets is an ad-hoc `<h2>` + `.badges` + `.tbl`. Fine for v3, but a `.bucket` wrapper (header + count + optional collapse + empty-state) would make the five render identically and cut copy-paste. **Proposal:** a lightweight `.bucket` component.
5. **No page-level two-phase state hook.** Telling PLAN from EXECUTED is currently per-row pills only. A `data-phase="plan|executed"` attribute on `.page` that the theme keys off (recolor pills, swap the top callout) would let the JSON's `sweep.status` flip the whole page's read in one line. **Proposal:** a `data-phase` hook the theme responds to.

**Net:** none of these blocked v3, but all five are the seam where an acting dashboard outgrows a doc-display template. Decide which become template primitives vs. app-local before the JSON-render build, so the render function targets stable classes.

### B. Slop-clear query is UNSCOPED — live safety bug (Michael-surfaced 2026-07-16)

The locked one-click clear emits `from:(a OR b OR c)` with **no mailbox scope**. Michael ran it: it returned **~16 messages**, but only **3 were actually in the inbox**. The rest were already archived/filed (`ACCOUNTS`, `to sort/2024`) and included **keepers** — "Lightwright Payment Confirmation" (with an attachment), multiple "Renewed/New License Info," "Activate Account." A `select-all → delete` on that query **destroys license + payment records**, the opposite of the intent.

- **Fix (proposed):** scope every slop-clear query to **`in:inbox`**, e.g. `in:inbox from:(a OR b OR c)`. The clear block only ever exists to empty the *inbox*; it must never span archived mail. This is a build correction to the report's query generator, not a re-litigation of the bucket format.
- **Second miss:** the Jul 16 sweep bucketed 3 slop senders, but the same search shows a **second Plex promo** ("See what's trending...", Jun 9, unread) that belongs in SLOP. The sweep should catch repeat-sender promos already sitting in the inbox, not just the newest.
- **Open question for discussion:** should the report show a live **count/preview** of what the clear query will match ("this deletes N in-inbox threads") before Michael runs it, as a guardrail against exactly this? Ties into the built-in Gmail search capability that's already allowed for in-app tricks.

### C. TO_MERGE destination is a real list, not a new task

v3's TO_MERGE row (Maya / OP CoMa onsite) proposed a *new* task with no link because no single pre-existing task was verifiable. Search shows the canonical home is the **Theater gigs** list (`4026829220088752929`), where the identical 2025-season OP CoMa travel thread already lives as email comments. **Proposal:** the sweep's dedup step should resolve OP CoMa threads to Theater gigs (COMBINE onto the existing gig content) rather than defaulting to a new task; the report should carry that real list/task link, not a placeholder.

---

## Page structure after this build (the swap)

- **`DEFAULT_PAGE = "report"`** — report is the landing page (what Michael acts on).
- **`pages/matrix.html`** — UNCHANGED, demoted to the second page (raw data read-out), still reachable via NAV.
- **NAV order:** Report (first) → Field Matrix → About.
- The swap is: add `report.html`, flip `DEFAULT_PAGE` from `matrix` to `report`, reorder `NAV`. That's the whole index change. Do not edit matrix.html's contents. **(DONE in v3, PR #316.)**

---

## Before you write a line (mandatory opening sequence)

1. **Reload this repo's current state via the git blob API** (blob-first, never a cached branch URL). Read `inbox-digest-report/index.html`, `chrome.js`, `styles.css`, `pages/matrix.html`, and now `pages/report.html`.
2. **Read `decision-log.md` (this folder) top-to-bottom.** It carries every decision + why. The report format, the two-phase spine, the field set, the hard limits, report-as-landing, and auth-deferred are all locked there - do not re-litigate them.
3. **Read the upstream hook** `brain-config/hooks/gmail-inbox-sweep.md` (note its EDIT DISCIPLINE section) and the URITP triage doc it points to. The report is the render of that sweep. Edit literally, never improvise.
4. **Check `VERSIONS.md`** for the current shell version before opening a PR; bump + stamp after.
5. **Standard:** this app was copied from `template-app`. Stay on the template: new page = `pages/report.html` using template classes (`.page`, `.callout`, `.badge`, `.tbl`), every color a `var(--token)`. No local `:root`, no hand-rolled shell. If the template lacks something, flag it as a template change, don't fork. **(See v4 open item A — several such template-change flags are now on the table.)**

---

## What to build

### `pages/report.html` (register in NAV as "Report", set as landing) — SHIPPED v3

The acting surface for a sweep. Renders the five locked buckets, every header always visible (empty = `none`):

1. **TO_MERGE** - keeper -> proposed MOVE/COMBINE + exact destination task (title + link). Shows the PLAN pre-greenlight, the DONE state post-greenlight (per-email `state`).
2. **NEEDS_REPLY** - draft parked / draft text, then archive.
3. **HAS_ATTACHMENTS** - forward to the task's email-in address for the files, THEN archive. (Attachments are filenames only - see hard limits.)
4. **ALREADY_HANDLED** - safe to archive now (already merged, e.g. an ingested-flag draft).
5. **SLOP** - grouped by sender/type; plus the **one-click clear** block: a `from:(a OR b OR c)` Gmail search string, copy-paste -> select all -> delete. **⚠️ v4 open item B: this query MUST be scoped `in:inbox` — unscoped it matches archived keepers.**

**Every email line:** inline live `gmail_url` link (tap opens the message) + the destination task link where applicable. Closing line: inbox-zero scoreboard (`Inbox: N -> M`).

**Two-phase spine (locked):** the report first renders as a pure PLAN. A greenlight (upstream, from Michael) is what flips per-email `state` from `pending_greenlight` to `merged`/`archived`. The page must render BOTH states clearly - a plan and a completed audit look different at a glance (e.g. a status pill per row).

### v4 target: render from data, stop hardcoding

The matrix + the v3 report both hardcode the Jul 16 sweep in HTML. The next goal is to introduce **`data/inbox-state.json`** (schema below) and have `report.html` fetch + render it, so "update the dashboard" = Brain rewrites the JSON, not the HTML. Suggested: a small render function in the page (or a shared `data.js`) that maps each JSON email record into a bucket row. Keep the fetch resilient (graceful empty/parse-error state). **Leave `matrix.html` static** — do not wire it to the JSON in this build unless Michael says so.

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
  "slop_delete_query": "in:inbox from:(a OR b OR c)",
  "buckets": ["TO_MERGE","NEEDS_REPLY","HAS_ATTACHMENTS","ALREADY_HANDLED","SLOP"]
}
```

*(Note: `slop_delete_query` now carries the `in:inbox` scope per v4 open item B.)*

---

## Hard limits (do not violate; carry from the hook)

Brain can READ + SEARCH + DRAFT Gmail. Brain CANNOT read labels/folders, mark read, archive, move, relabel, pull attachments into ClickUp, or send email (send lock active). The report is instructions to Michael for the clicks Brain can't do; it must NEVER claim a state change already happened. Attachments travel only when Michael forwards to the task's email-in address.

## Data refresh model (RESOLVED - do not build auth)

Brain writes `inbox-state.json` during an in-session sweep on a dictated plan. **No GitHub Action, no Gmail API auth, no secrets** — decided 2026-07-16 (see decision-log: on-demand not background, judgment not cron, no token rot). The built-in Gmail API pulls stay available for in-app tricks (live "open in Gmail" links, an on-demand refresh control), NOT for a CI auto-pull. Revisit only if sweeps ever need to run unattended.
