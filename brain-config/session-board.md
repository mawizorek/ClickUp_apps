# Session Board

**Who is in the repo RIGHT NOW, on what branch, touching which files.** Read it immediately before any git-touching write; refresh your row immediately after. Move fast — minimize the stale window.

**This file is EMPTY BY DEFAULT.** A row exists only while an agent is actively working, and each agent deletes its own row on close. 🚫 **It must never accumulate into a running log.** Durable content — collision post-mortems, standing scars, retired rows — lives in **[`session-board.notes.md`](./session-board.notes.md)**. Read that once per session; read this one every time you write.

| File | Job | Shape |
|---|---|---|
| `session-board.md` | ephemeral *"who's here now"* | table, empty when idle |
| `session-board.notes.md` | durable scars + post-mortems | reference, append-only |
| `open-thread.md` | durable pending WORK | queue |
| git history | the version record | immutable |

🚫 **Do not mix them.** A scar in this file is the drift that took it to 32KB.

---

## Active

| Agent | Session | Branch | Working on | Files touched |
|---|---|---|---|---|
| Dev Dexter | A TSV resolves by FILENAME from anywhere in the tree · Aug 31 | `feature/tsv-by-name` (doc-render-engine) · `board/dexter-tsv-byname` (ClickUp_apps) | Michael ruled it: *"i just be sure to never name tsv that same. that's my pref for now."* — search-by-name over a `site.yml` registry, because a registry trades counting `../` for bookkeeping and removes no step. ⭐ **NO NEW HOOK EVENT AND NO `mkdocs.yml` EDIT:** `on_page_markdown` already receives `files`, so the index is built lazily from a parameter that was always there — same shape as `runfoot.py`'s finding that the blocker was on the ASSUMED shape, not the outcome. 🔴 Sibling/relative resolution is tried FIRST and is byte-identical, so his live `../../production/info-dates/...` pages keep working; a bare name only reaches the index when no file sits at the declared path. 🔴 **A DUPLICATE BASENAME IS REPORTED WITH EVERY PATH AND REFUSED**, never silently picked — which is the one risk his ruling accepts, so it has to fail loud. ⚠️ Index cached against the `files` OBJECT IDENTITY, not `id()`, because `mkdocs serve` rebuilds in-process and a grow-only module dict is the `qr.PENDING` trap. | **doc-render-engine**: `docrender/datatable.py` (19,526 B against a 22,528 ceiling — ~3KB headroom, measured, and the argument stays terse because of it). 🚫 NOT `sheet.py`/`cells.py`/`table.py` — resolution is this module's contract, and sheet.py's own header forbids it importing anything that emits HTML. 🚫 NOT `mkdocs.yml` (28,158 B, past write cap) · NOT `qr.py` (29,915 B) · NOT `instance.py` (23,047 B). 🚫 No `uritp-docs` write — his pages keep working as-is and he can shorten them at leisure. |

---

## Rules

1. **Read this file immediately before any git-touching write.** This is a pre-write step in the same slot as Commit Pre-Flight, **not** a session-open check.
2. **Scan Active before writing.** If another agent's row claims a file you are about to touch, hold off, coordinate, or work elsewhere. **Advisory, not a lock** — it flags likely collisions so you can dodge them; it does not prevent a race. Empty Active = coast is clear.
3. **A row MUST name its BRANCH.** That is what makes it falsifiable (`hooks/collision-check.md` → THE HARD GATE). **A row with no branch and no commits is a claim nobody can check.**
4. **NAME THE REPO in the Files column.** This board lives in `ClickUp_apps` and is read as `ClickUp_apps`-only by default. **Silence on a repo reads identically to safety on that repo**, and that cost six collisions in one day on `uritp-docs`.
5. **ONE row per session, edited IN PLACE as scope changes.** Never append a trail. ⚠️ **A row that is not MOVED when scope changes is worse than no row: it is a false negative for everyone who reads it.**
6. **Name your session by TITLE, never by a hand-typed ClickUp ID.** If you are holding a URL and not an id, you do not have an id.
7. **DELETE your row on close.** Not optional. As of 2026-08-11 this is **Step 4a of `hooks/session-close.md`** and **rule 28** there — it is an executable step, not a footnote here. A stale row makes agents dodge files nobody is on.
8. ⏳ **EXPIRY: a row with NO BRANCH, or with no commit to any claimed path in 48 hours, is EXPIRED.** Any session may retire it to the sidecar's retired-rows table **with the evidence** (`list_commits --path <claimed> --since <date>`). Step 4b of the close hook does this as a matter of course. 🚫 **Retire, never delete** — the claim and its evidence survive so it can be re-posted. **A wrongly-cleared row costs a re-post; a stale row costs an hour.**
9. **Keep board edits tiny and fast.** On a non-fast-forward, **re-fetch and MERGE** — never force. A rejected write is the guard working.
10. 🚫 **Nothing durable goes in this file.** Findings, scars and post-mortems go to the sidecar. Pending work goes to `open-thread.md`.
11. 📏 **This file is BUDGETED and the budget is now enforced by a build.** `.github/workflows/size-budget.yml` fails a PR that pushes a governance file past the read ceiling. If you are about to paste a post-mortem in here, the gate will catch you — but the sidecar is the right answer either way.

### ⚠️ The self-claim exception

The hard gate says the presence row must be on `main` **before** the write. **That is impossible when the file being written IS this file** — posting the row is itself the write. Chicken and egg, and the gate does not cover it.

**The rule, so nobody has to improvise it:** when your write target is `session-board.md` itself, the row and the change may land in the **same commit**, and the row must **say so explicitly** and carry the collision evidence inline. Everything else is unchanged: branch → PR → self-merge, and the row still gets cleared at close.

### 🚦 Why the gate keeps being satisfied and keeps being outrun

**Every collision was caught by a READ or by a WRITE REFUSING. None was ever caught by a CHECK.** The only mechanism with a hit rate is asking *"what is true right now?"* at the last possible moment — path-filtered `list_commits --since today`, immediately before the write — and treating a rejection as information rather than an obstacle.

⚠️ **It has a floor, and the floor is a twin.** Every presence mechanism we own answers *"is someone ELSE here?"* A twin shares the task, the row, the intent and the name, so the gate answers *"that's you,"* which is true and useless. 🚫 **Branch-as-claim is falsified in both directions — stop proposing it.** Past the read, the only thing left is the write itself refusing.

**Nine collisions, the evidence, and every standing scar: [`session-board.notes.md`](./session-board.notes.md).**
