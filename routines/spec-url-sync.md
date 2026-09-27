# Spec URL Sync (v2: two loops)

goal:       Every task in DOCUMENTS / TEXTS / BOOKS related to exactly ONE >REPO_PAGES task carries that page's verified links in two local fields: ✍️ Edit Link → `Spec URL`, and 🌐 Published Link → `🌐 Link`.
target:     ClickUp list **DOCUMENTS / TEXTS / BOOKS** (Folder: SCHEMA) · whitelisted fields: `Spec URL` and `🌐 Link` (both URL type) ONLY, on EXISTING tasks · plus `routines/last-run/spec-url-sync.txt`
report-to:  DETAIL → the roll-up comment itself (no separate thread) · ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports (link in `routines/README.md`)

> 🧭 **Agent-agnostic by design.** Written 2026-09-27 at Michael's direction: *"write the hook as general... then it's just pointed to from Ricky... or Anna could run it, or you could run it on request."* Ricky picks it up through `schedule.md`. **Any agent or Brain session may run it on request** by reading this file and following it literally.

> 🚫 **Not a live trigger.** Original ask was "fire when `>REPO_PAGES` changes." A native ClickUp Automation cannot read a field off a related task and this framework has no scheduler, so this is a **verify-and-merge sweep** of the whole list, as current as the last invocation.

> 🩹 **v1 → v2 correction (2026-09-27).** v1 shipped with ONE loop and a banner claiming the second loop was cut. **That was a mis-read.** Michael's *"removing 🌐link cos you right"* meant: don't source from the repo page's own `🌐 Link` field (it is empty/duplicative there). It did NOT mean drop the published-link loop. The executor also wrongly claimed the trigger list had no field to receive it; it does (`🌐 Link`, URL). Michael: *"that's literally the hook. to do both."* **Both loops are the product. Never ship one without the other.**

## Field map (names are the join keys; confirm they resolve before writing)

| Loop | Source field (>REPO_PAGES) | Type | → Target field (DOCUMENTS / TEXTS / BOOKS) | Type |
|---|---|---|---|---|
| — | `>REPO_PAGES` (on trigger) | list relationship | mapping key: task-ID link, never name-matching | — |
| **A** | `✍️ Edit Link` | short text | `Spec URL` | URL |
| **B** | `🌐 Published Link` | short text | `🌐 Link` | URL |
| — | all other fields + recent comments | — | read for sanity signals only (step 4) | — |

🚫 **Never source Loop B from the repo page's `🌐 Link` field.** It is not the published URL.

## Steps

1. **Read the current state FIRST.** Read `routines/last-run/spec-url-sync.txt`. Pull every task in DOCUMENTS / TEXTS / BOOKS with `>REPO_PAGES` set, **including closed tasks and subtasks**: task ID, name, related task ID(s), current `Spec URL`, current `🌐 Link`. Tasks with `>REPO_PAGES` empty are **out of scope: skip silently.**
2. **Resolve the field map.** All four fields in the table must exist. Any missing or renamed → STOP (schema guardrail).
3. **Classify by relationship count.**
   - **Exactly one** related Repo Page → step 4.
   - **Two or more** → do NOT pick one. Touch neither field. List under **FLAGGED · multiple repo pages** with every related page linked.
4. **Open the single Repo Page. Read ALL its custom fields and its recent comments** (newest ~10). Sanity signals apply to BOTH loops:
   - A: a comment says the page was moved, renamed, superseded, deprecated, or merged → FLAG, write neither.
   - B: `PageStatus` reads retired / archived / deprecated → FLAG, write neither. (`draft`, `private`, `public` are all fine.)
   - C: the `Repo` dropdown or `GitHub Folder Name` contradicts the repo/folder in either link → FLAG that loop, do not write it.
5. **Run each loop independently.** A blank or failing value in one loop never blocks the other.
   - **Source blank → skip silently** for that loop. Never clear an existing target value (never shrink coverage). Count only.
   - **Validate.**
     - **Loop A (Edit Link):** `https://github.com/<owner>/<repo>/blob/<ref>/<path>` · `/blob/` not `/tree/` · NOT raw.githubusercontent, NOT github.io, NOT a repo root · path ends in a file extension.
     - **Loop B (Published Link):** `https://<owner>.github.io/<repo>/<path>` · NOT github.com, NOT raw.githubusercontent · `<repo>` matches the page's `Repo` field.
     - Both: no whitespace, no wrapping `<>`/quotes, no trailing punctuation.
     - Fail → FLAG under **FLAGGED · malformed link** (name the loop + value). Never fix by guessing.
   - **Compare** to the current target: equal → **SAME** · empty → **NEW** · different → **CHANGED** (source wins; record `was → now`).
6. **Land the product:** write every NEW/CHANGED value, touching only `Spec URL` and `🌐 Link`. Then **re-read the targets and confirm each value stuck**; any that did not → FLAG, run is PARTIAL.
7. **STAMP** `routines/last-run/spec-url-sync.txt` (`YYYY-MM-DD HH:MM` ET) **only after step 6 landed.** An all-SAME pass is a real verification and stamps. A pass stopped on a guardrail does not.
8. **REPORT:** one comment on the standing Run Reports thread.

## Guardrails (STOP + flag if any is true)

- Would create / delete / move / reparent / merge a task or list, or touch app source → STOP. Duplicate Repo Pages are flagged, never merged here.
- About to write any field other than `Spec URL` or `🌐 Link` → STOP.
- A value cannot be verified (step 4 signals, step 5 format) → flag that task/loop, never guess, continue.
- A relationship does not resolve 1:1 → flag, never pick one.
- Never blank a populated target because the source is empty.
- A field-map field is missing or renamed → STOP the whole run (build session, not a refresh).
- About to ship or run only one loop → STOP. v1 did exactly this.
- About to stamp before step 6 landed, or stamp a stopped run → STOP.
- About to skip the comment read or the post-write re-read → STOP. Discipline rule 13.

## Report format

```
🔗 Spec URL Sync · <YYYY-MM-DD HH:MM ET> · <SUCCESS | PARTIAL | FAILURE> · catch-up: <yes/no>
In scope: <n> tasks with a repo page (prev run: <n or never>)
A · Spec URL:  NEW <n> · CHANGED <n> · SAME <n> · no source <n>
B · 🌐 Link:   NEW <n> · CHANGED <n> · SAME <n> · no source <n>
CHANGED: <task link> [A|B]: <was> → <now>   (one line each)
FLAGGED · multiple repo pages: <task link> ↔ <page links>
FLAGGED · malformed link: <page link> [A|B]: <value>
FLAGGED · sanity signal: <page link>: <A/B/C + reason>
Files touched: routines/last-run/spec-url-sync.txt · Spec URL on <n> · 🌐 Link on <n>
```

Omit empty FLAGGED lines. `no source` is a count only: those pages are ignored, not reported.
