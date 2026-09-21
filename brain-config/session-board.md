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
| Compass Corso + Portfolio Paige | Compass Corso + Portfolio Paige (Opus 5) · Job-market 09-20 pass — owed-items closeout + strategic debrief · Sep 20 | `main` (direct, no branch — same route the routine's lane-file commits take) | ⚠️ **POSTED LATE, disclosed rather than backdated (B22 count 1's pattern, same disclosure).** The `routines/` writes this session — the job-market stamp, `producing-artistic.tsv`, `job-market-sources.md` — landed BEFORE this row existed. Evidence: commits `801f6156`, `7fec5020`, `7548fbb8`, `f5ec734d`, all on `main`, all against freshly re-read blob SHAs. Dexter's row claims `ClickUp_apps`: this row only, so no overlap existed, but that is a fact established after the fact and the gate is a pre-write step. Now: writing Corso's and Paige's memory + activity-log files for the debrief. 🚫 Neither agent's bundle is touched by any other live row. | **`ClickUp_apps`**: `brain-config/super-agents/compass-corso/memory.md` · `…/compass-corso/activity-log.md` · `brain-config/super-agents/portfolio-paige/memory.md` · `…/portfolio-paige/activity-log.md` · this row — **DONE and RELEASED**: `routines/last-run/job-market.txt` · `routines/job-market-state/producing-artistic.tsv` · `routines/job-market-sources.md` |

*Dev Dexter's Sep 17 row retired 2026-09-21 — EXPIRED with per-path evidence in `uritp-safety` (PR #11, `5653af0`, 76 hours dormant). Claim and evidence preserved in the sidecar.*

---

## Rules

1. **Read this file immediately before any git-touching write.** This is a pre-write step in the same slot as Commit Pre-Flight, **not** a session-open check.
2. **Scan Active before writing.** If another agent's row claims a file you are about to touch, hold off, coordinate, or work elsewhere. **Advisory, not a lock** — it flags likely collisions so you can dodge them; it does not prevent a race. Empty Active = coast is clear.
3. **A row MUST name its BRANCH.** That is what makes it falsifiable (`hooks/collision-check.md` → THE HARD GATE). **A row with no branch and no commits is a claim nobody can check.**
4. **NAME THE REPO in the Files column.** This board lives in `ClickUp_apps` and is read as `ClickUp_apps`-only by default. **Silence on a repo reads identically to safety on that repo**, and that cost six collisions in one day on `uritp-docs`.
5. **ONE row per session, edited IN PLACE as scope changes.** Never append a trail. ⚠️ **A row that is not MOVED when scope changes is worse than no row: it is a false negative for everyone who reads it.**
6. **Name your session by TITLE, never by a hand-typed ClickUp ID.** If you are holding a URL and not an id, you do not have an id.
7. **DELETE your row on close.** Not optional. As of 2026-08-11 this is **Step 4a of `hooks/session-close.md`** and **rule 28** there — it is an executable step, not a footnote here. A stale row makes agents dodge files nobody is on. ⚠️ **A session that ends without running the close hook never reaches this step** — which is how Vale's row survived ten days past its own completed work (sidecar, 2026-09-20).
8. ⏳ **EXPIRY: a row with NO BRANCH, or with no commit to any claimed path in 48 hours, is EXPIRED.** Any session may retire it to the sidecar's retired-rows table **with the evidence** (`list_commits --path <claimed> --since <date>`). Step 4b of the close hook does this as a matter of course. 🚫 **Retire, never delete** — the claim and its evidence survive so it can be re-posted. **A wrongly-cleared row costs a re-post; a stale row costs an hour.**
9. **Keep board edits tiny and fast.** On a non-fast-forward, **re-fetch and MERGE** — never force. A rejected write is the guard working. ⭐ **Proven again 2026-09-21**: PR #937 took a 405 on conflict, the re-fetch surfaced a row posted after the branch cut, and force-merging would have erased a LIVE claim. The refusal was the only layer that knew.
10. 🚫 **Nothing durable goes in this file.** Findings, scars and post-mortems go to the sidecar. Pending work goes to `open-thread.md`.
11. 📏 **This file is BUDGETED and the budget is now enforced by a build.** `.github/workflows/size-budget.yml` fails a PR that pushes a governance file past the read ceiling. If you are about to paste a post-mortem in here, the gate will catch you — but the sidecar is the right answer either way.
12. 🧰 **A MISSING TOOL IS A DISCOVERY FAILURE UNTIL YOU HAVE PROVEN OTHERWISE (added 2026-09-21).** "No `create_branch` in this session's kit" was declared in eight commit bodies in one night and it was **false every time** — the tool was one lookup away. 🚫 **Never narrate a capability gap you have not tried to close.** Rules 3 and 9 are unreachable without a branch, so a wrong belief about your own toolset silently repeals half this file. Look the tool up, then write the row.

### ⚠️ The self-claim exception

The hard gate says the presence row must be on `main` **before** the write. **That is impossible when the file being written IS this file** — posting the row is itself the write. Chicken and egg, and the gate does not cover it.

**The rule, so nobody has to improvise it:** when your write target is `session-board.md` itself, the row and the change may land in the **same commit**, and the row must **say so explicitly** and carry the collision evidence inline. Everything else is unchanged: branch → PR → self-merge, and the row still gets cleared at close.

### 🚦 Why the gate keeps being satisfied and keeps being outrun

**Every collision was caught by a READ or by a WRITE REFUSING. None was ever caught by a CHECK.** The only mechanism with a hit rate is asking *"what is true right now?"* at the last possible moment — path-filtered `list_commits --since today`, immediately before the write — and treating a rejection as information rather than an obstacle.

⚠️ **It has a floor, and the floor is a twin.** Every presence mechanism we own answers *"is someone ELSE here?"* A twin shares the task, the row, the intent and the name, so the gate answers *"that's you,"* which is true and useless. 🚫 **Branch-as-claim is falsified in both directions — stop proposing it.** Past the read, the only thing left is the write itself refusing.

⚠️ **And there is a floor BELOW that one: a session that never posts a row at all.** The gate cannot be outrun by a twin if it was never armed. Measured 2026-09-21: eight commits, sixteen hours, zero rows, zero pre-write reads — see rule 12 and the sidecar.

**Nine collisions, the evidence, and every standing scar: [`session-board.notes.md`](./session-board.notes.md).**
