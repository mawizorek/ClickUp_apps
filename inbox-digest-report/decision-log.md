# inbox-digest-report - Decision Log

Newest on top. Each entry = a decision made + why, so a cold agent reconstructs the reasoning, not just the outcome. Companion to `README.md` (what it is) and `next-build-spec.md` (what's next).

---

## 2026-07-17 - v5: report reskinned as a mobile-primary VIEWER (no table)

- **Decision:** the report renders each email as a stacked ROW UNIT (status pill → sender/subject → plan), not a `<table>`. On phone the row stacks; at `>=720px` the same DOM reflows into three aligned columns (status / email / plan) via CSS grid. Drill-in `matrix.html` stays device-specific (wide horizontal-scroll grid), unedited.
- **Why:** Michael runs sweeps mostly on mobile and wanted a VIEWER, not a toy activity app. The v3.2 `<table>` fought phones (fixed columns, cramped) and read app-y. A single responsive row unit merges cleanly across phone/desktop from one DOM, so there's no second layout to maintain, and it reads like a data viewer.
- **What shipped (renderer + CSS only; JSON + data-only lock untouched):**
  - `pages/report.html`: render emits `.bucket` sections of `.row` units (`.cell-status`/`.cell-email`/`.cell-plan`), no `<table>`. Still a pure renderer of `data/inbox-state.json`; copy tightened.
  - `styles.css`: REPORT ADDITIONS block replaced with the v5 viewer (mobile-first; `@media (min-width:720px)` promotes rows to aligned columns; status strip 2x2→row-of-4; headline scoreboard number). Calmer framing (surface borders, small radius), dropped the squared-everything spreadsheet look. Matrix block untouched.
  - `index.html` styles.css cache token → `?v=4`; shell v4 → v5.
- **Locked:** report is mobile-primary and responsive from one DOM; drill-ins may stay device-specific. This is still a pure renderer — a sweep edits only `data/inbox-state.json`.

## 2026-07-17 - v4: app is a PURE RENDERER; data lives ONLY in inbox-state.json

- **Decision:** `pages/report.html` no longer contains any email data. It fetches `data/inbox-state.json` and renders it. **A sweep refresh edits ONLY that JSON — never the renderer, index, or CSS.** This is the ONLY Gmail workflow we're building right now.
- **Why:** v3–v3.2 hardcoded each sweep into the HTML, so “refresh the dashboard” kept meaning “re-edit the renderer.” That's backwards and error-prone. The renderer is a fixed view; the inbox state is data. Separating them means a refresh is a single small JSON rewrite with zero HTML risk, and the data file doubles as the handoff-safe audit trail.
- **What shipped:**
  - `pages/report.html` = pure renderer (fetch + build the five buckets from the JSON; graceful empty/parse-error state). A loud header comment forbids hardcoding data in it.
  - `data/inbox-state.json` = the rolling sweep state (seeded with the Jul 17 8-thread sweep).
  - `data/README.md` = standalone FIELD SPEC dictating every available field, the bucket enum, the `state`→pill map, and the locked `in:inbox` slop-query format. This is the component to read before editing the JSON.
  - `index.html` router now re-executes page `<script>` tags after injecting a fragment (innerHTML doesn't run scripts). Shell bumped v3.2 → v4. This router capability is generic and should fold back into `template-app`.
  - `brain-config/hooks/gmail-inbox-sweep.md` gained a DATA WRITE PROTOCOL: the sweep's only artifact is the JSON, edited per `data/README.md`; the renderer is never touched.
- **Locked:** the app is a renderer of `inbox-state.json`, period. Available fields are dictated in `data/README.md`. Touching the Gmail read tool for a sweep = rewrite the JSON, nothing else.

## 2026-07-16 - Slop clear query MUST be scoped to `in:inbox` (v3.1 bugfix)

- **Decision:** the one-click slop clear block is always `in:inbox from:(a OR b OR c)`, never a bare `from:(...)`. This scoping is now part of the locked report format.
- **Why:** a bare `from:(sender)` searches ALL mail (archive + every label), not the inbox. In the Jul 16 sweep the unscoped query surfaced ~15 results per sender's full history - archived newsletters, **ACCOUNTS-labeled Lightwright license/renewal records, and a Payment Confirmation with an attachment** - all keepers, none of them the 3 inbox slop threads the sweep flagged. Handing Michael a "select all -> delete" on that set would have destroyed account records and a receipt. Michael caught it from the live Gmail result count.
- **Rule cemented:** any Gmail delete/clear string the report hands over is inbox-scoped by default. The sweep acts on the LIVE INBOX only; a sender's historical mail in other labels/archive is out of scope and must never be swept up. `in:inbox` prefix is mandatory on the slop clear.
- Result: v3.1. Only `pages/report.html`'s slop clear block changed (+ this log); shell bumped v3 -> v3.1.

## 2026-07-16 - Report becomes the LANDING page; matrix demoted to page 2 (unedited)

- **Decision:** when the Report page (v3) ships, it becomes the DEFAULT landing page (`DEFAULT_PAGE=report`). The existing field-capture matrix stays **exactly as-is** and lives on as the second page, pointed to by index/NAV as the direct raw read-out.
- **Why:** the report is what Michael acts on; the matrix is the underlying data proof. Lead with the actionable surface, keep the raw grid one click away.
- **Fence:** `pages/matrix.html` is NOT edited. The v3 build only ADDS `pages/report.html`, flips `DEFAULT_PAGE`, and reorders NAV. Nothing else on the matrix side moves.

## 2026-07-16 - Auth deferred: bot-run on a dictated plan, NOT a GitHub Action (for now)

- **Decision:** do NOT set up Gmail API auth / a GitHub Action to auto-pull `inbox-state.json` yet. Brain runs the sweep + dedup + historical-log checks on a dictated plan, in-session. Leave the built-in Gmail API pulls for in-app tricks (live "open in Gmail" links, on-demand refresh a page might want).
- **Why:** a sweep is on-demand (Michael initiates "clean my inbox"), not a background heartbeat, so the Action's only advantage (unattended refresh) isn't needed. Auth is fragile: needs a Google Cloud project, OAuth consent, a one-time refresh-token mint, and secrets in the repo; refresh tokens rot (~6mo unused, or on password/re-auth change) and the cron then fails silently -> stale data nobody's watching. The dedup + historical-log logic is JUDGMENT, which is Brain's strength and cron's weakness.
- **Reliability path chosen:** document the process crisply (hook + this log + next-build-spec) so any agent runs it the same way. The repeatable process is the DICTATED PLAN, not a CI pipeline.
- **Not closed forever:** revisit only if sweeps ever need to run unattended. Auth setup steps are captured in `next-build-spec.md`'s parked section if that day comes.

## 2026-07-16 - v2: rebuilt as a true template copy (CORRECTION)

- **Decision:** scrap the hand-rolled shell; copy `template-app` wholesale, then skin. Standard going forward: **every new app copies the gold-standard template folder verbatim (index shell + chrome.js + styles.css + manifest + icon + pages/), then adds pages. Never hand-roll a shell.**
- **Why:** v1 cherry-picked only the router idea and rebuilt a stripped-down page with a local `:root` block. That threw away the template's chrome (header, left nav drawer, right settings drawer + live theme picker, footer stamp) and the whole point of having a standard. Michael flagged it as "functionally useless."
- **Rule cemented:** if the template is missing something an app needs, flag it as a **template change** to the steward, don't fork a private variant.
- Result: v2 (PR #312). `pages/matrix.html` reskinned onto template classes (`.page`, `.callout`, `.badge`, `.tbl` + `.matrix-*`), every color a theme token, `NAV` = Field Matrix + About.

## 2026-07-16 - v1: first app scaffold + field-capture matrix

- **Decision:** ship the app with the **field-capture matrix as the default landing page**, index as a pointer (`DEFAULT_PAGE=matrix`, flip to `dashboard` later, one line, no rebuild).
- **Why:** prove the captured field set on a real render before designing the dashboard, so the dashboard is built on validated data, not a guess.
- **Field set decided (what Brain can scrub per Gmail thread):**
  - **Captured (10):** thread_id, sender name + address, subject, date, message_count, read_state, attachments (FILENAMES ONLY), snippet (preview, 2 lines max, never full body), gmail_url, participants.
  - **Add next (available, not yet columns):** message_id (deep-link one message), to/cc (split from participants), mailbox (inbox/sent).
  - **Confirmed NOT readable (do not chase):** labels/folder, star/importance, Gmail category tabs (Promotions/Social).

## 2026-07-16 - Storage: JSON, rolling (not CSV, not a growing log)

- **Decision:** the dashboard renders a **rolling** `data/inbox-state.json` that Brain rewrites atomically each sweep. Not CSV, not an append log.
- **Why (Workshop):** records nest (attachments arrays, slop-groups, per-email state history) - CSV can't hold that without escaping hell + a second file. "Rolling" = holds the CURRENT inbox only, overwritten each sweep, so it never grows unbounded.
- **Capacity (Size Sally):** ~300-400 bytes/email record -> ~85 emails/sweep under the 30KB cap; realistic sweeps are 5-30 emails (2-10KB). Verdict HOLD, no split architecture needed. Optional dated archive (`sweeps/YYYY-MM-DD.json`) only if history is ever wanted.
- **The data file IS the audit trail** - handoff-safe: if a session dies mid-sweep, the next agent reads the file and continues.

## 2026-07-16 - Two-phase spine: PLAN then GREENLIGHT then EXECUTE

- **Decision:** first render = pure PLAN (nothing executed). Michael's greenlight triggers (a) byte-for-byte merges into ClickUp tasks and (b) reply drafts, in parallel with Michael forwarding attachments + clearing slop.
- **Why:** Brain cannot mark-read/archive/send. The report must never claim a state change happened; it tells Michael exactly what to click. Greenlight gates the writes.

## 2026-07-16 - Report format locked

- **Buckets:** TO_MERGE, NEEDS_REPLY, HAS_ATTACHMENTS, ALREADY_HANDLED, SLOP. Every header always renders (empty = `none`) so nothing looks silently dropped.
- **Inline live Gmail links** on every email line (tap opens the actual message), same treatment as task links.
- **Slop grouped** by sender/type (`Domino's (2) - Zillow (2) - scam (3)`), not one row each.
- **One-click slop clear:** an `in:inbox from:(a OR b OR c)` Gmail search block (inbox-scoped - see the 2026-07-16 v3.1 bugfix entry), copy-paste into mobile/desktop Gmail -> select all -> delete. Built fresh each sweep from the actual slop senders. This is the workaround for "can't mark read."
- **Closing line:** inbox-zero scoreboard (`Inbox: N -> M`).

## 2026-07-16 - The pipeline it renders (upstream context)

- **Hook:** `brain-config/hooks/gmail-inbox-sweep.md` - on-demand personal Gmail sweep. Reuses the URITP INBOX triage standards (rename, verbatim mirror, Plan Comment, MOVE/COMBINE, dedup, backtrack) rather than duplicating them.
- **Landing list:** Home > Gmail INBOX > GMAIL INBOX (`901327875287`) - where forwarded emails land for pickup.
- **Hard limits (carry everywhere):** Brain can READ + SEARCH + DRAFT Gmail. Brain CANNOT: read labels/folders, mark read, archive, move, relabel, pull attachments into ClickUp, or send email (send lock active). Attachments only travel when MICHAEL forwards to the task's email-in address.
- **Fold-in Frank verdict:** the dashboard app is NET-NEW (nothing renders live inbox state) but registers in the existing Apps index - not a parallel one.
