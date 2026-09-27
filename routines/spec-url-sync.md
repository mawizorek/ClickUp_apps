# Spec URL Sync

goal:       Every task in DOCUMENTS / TEXTS / BOOKS that is related to exactly ONE >REPO_PAGES task carries that page's verified ✍️ Edit Link in its local `Spec URL` field.
target:     ClickUp list **DOCUMENTS / TEXTS / BOOKS** (Folder: SCHEMA) · whitelisted field: `Spec URL` (URL type) ONLY, on EXISTING tasks · plus `routines/last-run/spec-url-sync.txt`
report-to:  DETAIL → the roll-up comment itself (this routine has no separate thread) · ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports (link in `routines/README.md`)

> 🧭 **Agent-agnostic by design.** Written 2026-09-27 at Michael's direction: *"write the hook as general... then it's just pointed to from Ricky... or Anna could run it, or you could run it on request."* Ricky picks it up through `schedule.md` like any other routine. **Any agent or Brain session may run it on request** by reading this file and following it literally. Nothing about the executor lives here.

> 🚫 **Not a live trigger.** Michael's original ask was "fire when `>REPO_PAGES` changes." A native ClickUp Automation cannot read a field off a related task, and this framework has no scheduler, so this is a **verify-and-merge sweep** of the whole list, as current as the last invocation. A Rollup column on the list is the zero-agent alternative for *display only*; it was declined because a rollup is not a real field.

> 🪓 **Scope cut 2026-09-27:** a second loop mirroring `🌐 Link` was proposed and **dropped** (field is effectively unpopulated on the repo pages; Michael: *"removing 🌐link cos you right"*). Do not re-add it without a fresh ask.

## Field map (names are the join keys; confirm they resolve before writing)

| Side | List | Field | Type | Role |
|---|---|---|---|---|
| Trigger | DOCUMENTS / TEXTS / BOOKS | `>REPO_PAGES` | list relationship | the mapping key (task-ID link, never name-matching) |
| Trigger | DOCUMENTS / TEXTS / BOOKS | `Spec URL` | URL | **the only field this routine writes** |
| Source | >REPO_PAGES | `✍️ Edit Link` | short text | the value copied |
| Source | >REPO_PAGES | all other fields + recent comments | — | read for sanity signals only (step 4) |

## Steps

1. **Read the current state FIRST.** Read `routines/last-run/spec-url-sync.txt`. Then pull every task in DOCUMENTS / TEXTS / BOOKS with `>REPO_PAGES` set, **including closed tasks and subtasks**, capturing: task ID, name, the related task ID(s), and the current `Spec URL`. This is the baseline. Tasks with `>REPO_PAGES` empty are **out of scope: skip silently, never report them individually.**
2. **Resolve the field map.** Confirm `>REPO_PAGES` and `Spec URL` exist on the trigger list and `✍️ Edit Link` exists on the >REPO_PAGES list. Any missing or renamed → STOP (guardrail: schema).
3. **Classify each in-scope task by relationship count.**
   - **Exactly one** related Repo Page → continue to step 4.
   - **Two or more** → do NOT pick one. Leave `Spec URL` untouched and list the task under **FLAGGED · multiple repo pages** with every related page linked.
4. **Open the single related Repo Page and read ALL of its custom fields and its recent comments** (newest ~10). You are reading for one value and three sanity signals:
   - The value: `✍️ Edit Link`.
   - Signal A: a comment saying the page was moved, renamed, superseded, deprecated, or merged → FLAG, do not write.
   - Signal B: `PageStatus` reads as retired / archived / deprecated → FLAG, do not write.
   - Signal C: the `Repo` dropdown or `GitHub Folder Name` visibly contradicts the repo/folder in the Edit Link → FLAG, do not write.
5. **If `✍️ Edit Link` is blank → skip silently.** Do not clear an existing `Spec URL` (never shrink coverage). Count it in the report's single `no edit link` tally, nothing more.
6. **Validate the Edit Link format.** It passes only if ALL are true:
   - Starts with `https://github.com/`
   - Shape is `https://github.com/<owner>/<repo>/blob/<ref>/<path>` (a `/blob/` URL; `/tree/` is a folder, not a page)
   - NOT `raw.githubusercontent.com`, NOT a `github.io` published URL, NOT a bare repo root
   - No whitespace, no wrapping `<>` or quotes, no trailing punctuation
   - `<path>` ends in a file extension (`.md`, `.html`, etc.)
   Fails → FLAG under **FLAGGED · malformed edit link** with the offending value. Never "fix" it by guessing.
7. **Compare against the trigger task's current `Spec URL`.**
   - Equal → **SAME**, no write.
   - Empty → **NEW**, write it.
   - Different → **CHANGED**, write it (the Repo Page is the source of truth) and record `was → now`.
8. **Land the product:** write `Spec URL` on every NEW and CHANGED task in one bulk update. Touch no other field. Then re-read those tasks and confirm the value stuck; any that did not → FLAG and count the run PARTIAL.
9. **STAMP** `routines/last-run/spec-url-sync.txt` with one line, `YYYY-MM-DD HH:MM` ET, **only after step 8 landed.** A completed pass where everything was SAME **is a real verification and stamps**: the verification is the product. A pass that STOPPED on a guardrail does not stamp.
10. **REPORT:** one comment on the standing Run Reports thread in the format below.

## Guardrails (STOP + flag if any is true)

- Target is app source / engine / structure, or would create / delete / move / reparent / merge a ClickUp task or list. **This routine writes one field. Duplicate Repo Pages are flagged, never merged here.**
- About to write any field other than `Spec URL` → STOP.
- A required value cannot be verified (step 4 signals, step 6 format) → flag that task, never guess, continue with the rest.
- A relationship does not resolve 1:1 → flag that task, never pick one. ClickUp writes are not git-revertible.
- Coverage would shrink: never blank a populated `Spec URL` because the source is empty.
- A field in the field map is missing or renamed → STOP the whole run; that is a build session, not a refresh.
- About to stamp before step 8 landed, or stamp a stopped run → STOP.
- About to skip step 4's comment read because "the field is right there" → STOP. Discipline rule 13.

## Report format

```
🔗 Spec URL Sync · <YYYY-MM-DD HH:MM ET> · <SUCCESS | PARTIAL | FAILURE> · catch-up: <yes/no>
In scope: <n> tasks with a repo page (prev run: <n or never>)
NEW <n> · CHANGED <n> · SAME <n> · no edit link <n>
CHANGED: <task link>: <was> → <now>   (one line each)
FLAGGED · multiple repo pages: <task link> ↔ <page links>
FLAGGED · malformed edit link: <page link>: <value>
FLAGGED · sanity signal: <page link>: <A/B/C + one-line reason>
Files touched: routines/last-run/spec-url-sync.txt · ClickUp field Spec URL on <n> tasks
```

Omit any FLAGGED line that is empty. `no edit link` is a count only, per Michael: those pages are ignored, not reported.
