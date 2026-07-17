# Gmail Inbox Sweep

**Purpose:** Drive Michael's personal Gmail toward inbox-zero. Brain reads the inbox directly, merges keeper content verbatim into the right ClickUp task, and hands back an archive-ready report. **Getting to zero is the deliverable; the task is just where content lands.**

**Mode:** On-demand. Fires on "sweep my inbox" / "triage my gmail" / when Michael points at specific emails.

**Reuses (do NOT duplicate):** the URITP INBOX Email Intake Triage standards — rename, verbatim mirror, Plan Comment, MOVE vs COMBINE universal standards, dedup, backtrack. This hook only adds the sweep + report layer on top of those mechanics.

---

## ⚡ THE SWEEP OUTPUT IS ONE FILE (read this first, no room for interpretation)

**A sweep produces exactly one artifact: a rewrite of `inbox-digest-report/data/inbox-state.json`.** The dashboard app (`inbox-digest-report`) is a PURE RENDERER of that file. When you touch the Gmail read tool to run a sweep, the deliverable is the JSON, nothing else.

- **NEVER edit `pages/report.html`, `index.html`, `styles.css`, or any other app file to change what the report shows.** They contain zero email data by design. If you are about to put a sender, subject, bucket, or slop query into HTML, STOP — it goes in the JSON.
- **The available fields, bucket enum, `state`→pill map, and the locked `in:inbox` slop-query format are dictated in `inbox-digest-report/data/README.md`.** Read that spec before writing the JSON. Do not invent fields.
- **How to refresh:** rewrite `inbox-state.json` wholesale (it is ROLLING — current inbox only, never an append log), following `data/README.md`. Set `sweep.status` to `PLAN_PENDING_GREENLIGHT` on a fresh plan; `EXECUTED` only after the greenlit actions have run. Build `slop_delete_query` as `in:inbox from:(...)` from the SLOP rows' addresses.
- This is the ONLY Gmail workflow being built right now. There is no second surface, no parallel report, no hardcoded fallback.

---

## ⚠️ EDIT DISCIPLINE — how to change this hook (read before editing ANYTHING)

This hook is dictated by Michael and honed deliberately. When updating it, **edit exactly what was decided; never improvise structure, scope, or wording beyond the instruction.**

- **Follow the dictated change literally.** If Michael says "add X to the report," add X. Do not also reword the buckets, re-order sections, or "improve" adjacent copy. One decision = one surgical edit.
- **Never invent capability.** The HARD LIMITS below are ground truth. Do not add a step that implies Brain can mark-read/archive/label/send just because it would make the flow neater. If a desired step needs a capability Brain lacks, write it as an instruction to MICHAEL, not an action Brain takes.
- **Preserve the locked pieces** unless Michael explicitly says to change them: the HARD LIMITS, the two-phase spine (PLAN → greenlight → EXECUTE), the mandatory greenlight gate, the report bucket set, the JSON-is-the-only-output rule, and the "reuses URITP standards, don't duplicate" rule.
- **Log every change.** Add a dated line to the Changelog here AND, if it's a real decision (not a typo fix), a matching entry in `inbox-digest-report/decision-log.md`. The reasoning lives in the decision-log; this hook stays the crisp procedure.
- **When the instruction is ambiguous, ask before writing.** A hook that drifts on a guess is worse than a hook that waits one turn for clarity. Do not fill gaps by improvising.
- **This is a living, honed doc.** Expect iterative tightening. Each pass should leave it clearer and more literal, never more clever.

---

## LANDING LIST (default capture home)

**`Home ▸ Gmail INBOX ▸ GMAIL INBOX`** (list id `901327875287`). This is the personal-Gmail equivalent of URITP's INBOX ▸ Default. When Michael forwards an email into ClickUp for an agent to pick up, it lands here. New captures with no clearer canonical home default to this list; from here they get triaged (MOVE to a real destination, or COMBINE onto an existing task).

---

## HARD LIMITS (what Brain CANNOT do — never fake it)

- Cannot read Gmail labels/folders. Cannot mark read, archive, move, or relabel.
- Cannot pull Gmail attachments into ClickUp. Cannot send email (send lock active).
- Every state change (mark read / archive) is **Michael's manual step**. The report tells him exactly what to click; it NEVER claims the click already happened.
- Read + search + draft are the only Gmail capabilities. Scope the routine to those; do not imply otherwise.

---

## PASS

1. **Read the active inbox.** Sort signal from slop.
2. **For each KEEPER:** run the task-dedup-gate → find the right task (existing) or propose a new one. NEVER auto-create a task for slop.
3. **Write the plan into `inbox-state.json`** (per `data/README.md`): one email record per thread, bucketed, with plan text, destination task, and `state`. This JSON rewrite IS the Plan Comment surface for the sweep. **WAIT for Michael's explicit greenlight.**
4. **On greenlight:** copy the email content **BYTE-FOR-BYTE as inline comment(s)** per the URITP COMBINE/MOVE Universal Standard (verbatim email first, notes second, backtrack, link, close/relocate), then execute the action items. Update the affected records' `state` in the JSON (e.g. `merge_pending` → `merged`) and flip `sweep.status` to `EXECUTED` when the plan is fully run.

---

## ATTACHMENT BRANCH

- **Content ALWAYS merges either way.** A forward only adds the files.
- **No attachments (or files not needed)** → Brain merges content, Michael archives.
- **Files needed** → Michael forwards the email to the task's email-in address FIRST (that path carries attachments), THEN archives.
- Never a blocker, just a branch.

---

## THE REPORT (the deliverable — rendered from the JSON)

The report is `inbox-digest-report` rendering `data/inbox-state.json`. You produce it by writing that JSON; the app draws the five buckets. Every header always renders (empty = `none`):

- **TO_MERGE** — keeper → COMBINE/MOVE into a task, then archive.
- **NEEDS_REPLY** — draft parked / draft text, then archive.
- **HAS_ATTACHMENTS** — forward to the task's email-in address for the files, THEN archive.
- **ALREADY_HANDLED** — nothing to capture; safe to archive now.
- **SLOP** — grouped by sender/type + the one-click `in:inbox from:(...)` clear block, built from the SLOP rows' addresses.

Field definitions and the `state`→pill map live in `inbox-digest-report/data/README.md`. Do not restate them here.

---

## GATES

- **Mandatory greenlight** before any MOVE/COMBINE. Nothing runs unattended.
- **Draft-only email** (send lock active). Drafts park; Michael sends manually if ever needed.
- **No task for slop.** Slop goes to the SLOP bucket, never becomes a task.
- **Data-only refresh.** A sweep edits `inbox-state.json` and nothing else. Never touch the renderer.

---

## Companion app

- **`inbox-digest-report`** (repo app) is a PURE RENDERER of `data/inbox-state.json`. Its `decision-log.md`, `next-build-spec.md`, and `data/README.md` carry the app-side decisions (JSON-rolling storage, report-as-landing-page, auth-deferred, field spec). This hook is the PROCEDURE; that app is the RENDER surface. Keep them consistent when either changes.

---

## Composes with

- **URITP INBOX Email Intake Triage** — the shared triage mechanics (rename, verbatim mirror, Plan Comment, MOVE/COMBINE universal standards, dedup, backtrack). This hook points at them rather than restating them.
- **task-dedup-gate** — run before proposing any new task.
- **link-provenance** — backtrack pointers connecting email task ↔ canonical task.

---

## Changelog

- 2026-07-17 — added THE SWEEP OUTPUT IS ONE FILE section + folded the data-only rule into PASS, GATES, THE REPORT, and Companion app. The sweep's sole artifact is `inbox-digest-report/data/inbox-state.json` (field spec: that folder's `README.md`); the app is a pure renderer, never edited on a sweep. Matches decision-log 2026-07-17 (v4).
- 2026-07-16 — added EDIT DISCIPLINE section (edit literally, never improvise; preserve locked pieces; log every change) + companion-app pointer. No change to the procedure itself.
- 2026-07-16 — created. Personal-Gmail sweep layer over the URITP triage standards; landing list = Home ▸ Gmail INBOX ▸ GMAIL INBOX (`901327875287`).
