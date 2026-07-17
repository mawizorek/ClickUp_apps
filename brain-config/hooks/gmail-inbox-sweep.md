# Gmail Inbox Sweep

**Purpose:** Drive Michael's personal Gmail toward inbox-zero. Brain reads the inbox directly, merges keeper content verbatim into the right ClickUp task, and hands back an archive-ready report. **Getting to zero is the deliverable; the task is just where content lands.**

**Mode:** On-demand. Fires on "sweep my inbox" / "triage my gmail" / when Michael points at specific emails.

**Reuses (do NOT duplicate):** the URITP INBOX Email Intake Triage standards — rename, verbatim mirror, Plan Comment, MOVE vs COMBINE universal standards, dedup, backtrack. This hook only adds the sweep + report layer on top of those mechanics.

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
3. **Post a FULL Plan Comment per keeper** (URITP Plan Comment format): type, proposed MOVE/COMBINE + **exact destination (full title + link)**, fields (priority/due/time-est), action items, draft reply if warranted, and DRIFT/DUPE/PATTERN flags. **WAIT for Michael's explicit greenlight.**
4. **On greenlight:** copy the email content **BYTE-FOR-BYTE as inline comment(s)** per the URITP COMBINE/MOVE Universal Standard (verbatim email first, notes second, backtrack, link, close/relocate), then execute the action items.

---

## ATTACHMENT BRANCH

- **Content ALWAYS merges either way.** A forward only adds the files.
- **No attachments (or files not needed)** → Brain merges content, Michael archives.
- **Files needed** → Michael forwards the email to the task's email-in address FIRST (that path carries attachments), THEN archives.
- Never a blocker, just a branch.

---

## THE REPORT (the deliverable — standard four buckets)

Every sweep ends with this report so it reads identically each time:

```
✅ MERGED → mark read + archive:
   • [email] → [task link]   (content fully captured)

📎 HAS ATTACHMENTS → forward to task's email-in address first if you
   want the files, THEN archive:
   • [email] (N attachments) → [task link]

✉️ NEEDS A REPLY → draft parked / draft text, then archive:
   • [email] → [draft note]

🗑️ SLOP → just archive/delete, nothing captured:
   • [newsletter, promo, …]
```

---

## GATES

- **Mandatory greenlight** before any MOVE/COMBINE. Nothing runs unattended.
- **Draft-only email** (send lock active). Drafts park; Michael sends manually if ever needed.
- **No task for slop.** Slop goes to the report bucket, never becomes a task.

---

## Composes with

- **URITP INBOX Email Intake Triage** — the shared triage mechanics (rename, verbatim mirror, Plan Comment, MOVE/COMBINE universal standards, dedup, backtrack). This hook points at them rather than restating them.
- **task-dedup-gate** — run before proposing any new task.
- **link-provenance** — backtrack pointers connecting email task ↔ canonical task.

---

## Changelog

- 2026-07-16 — created. Personal-Gmail sweep layer over the URITP triage standards; landing list = Home ▸ Gmail INBOX ▸ GMAIL INBOX (`901327875287`).
