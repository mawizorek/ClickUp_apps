# Collision Check

**Type:** MANDATORY gate. Fires before starting a WORK ITEM, not once per session.
**Purpose:** Stop two sessions from building the same thing, or writing the same files, at the same time.
**Created:** 2026-07-31, after two sessions built the batch-import feature simultaneously.
**Requires:** `githubmcp_list_commits`, `githubmcp_get_file_contents`
**Companion:** `hooks/session-open.md` C6 (the presence POST — this hook is the READ that used to be welded to it).

---

## Why this exists when C6 already existed

C6 has mandated a presence post since 2026-07-28. It is numbered, it sits inside the sequence that executes, and other agents demonstrably use it — the board carried four live rows on the day this was written.

**Both sessions that collided on 2026-07-31 skipped it.** So the useful question is not *what rule was missing*, it is *why an existing rule was not reached*. Three answers, and each is a design fault rather than a lapse:

**1. THE CHECK WAS A PASSENGER ON THE ANNOUNCEMENT.** C6 reads: *Read `session-board.md` (who else is live), then add ONE Active entry.* One step, two acts. Reading protects **you**; writing protects **everyone else**. Bundled, skipping the step loses both — and the cheap self-interested act is gated behind the expensive altruistic one. **They are now two steps: this hook is the read, C6 is the write.**

**2. IT FIRED ONCE, AT SESSION START, WHEN SCOPE WAS SMALLEST.** Commit fires on the first side-effecting action. On 07-31 that was a task comment, at which point the session's scope was *add a link to the settings panel*. A presence row written then would have been true and useless — the collision came four asks later, over files nobody had named yet. Fiona's row moved **four times in one session** as her scope grew, and the board documents that as necessary practice. A one-shot check known to require manual repetition is not a check. **This hook fires per WORK ITEM.**

**3. THE SIGNAL THAT DID FIRE WAS RATIONALISED.** See Halt Signals.

---

## 🔴 What does NOT work in this repo, measured

Both surfaces below look like claim ledgers. Both are graveyards. **Measured against the live repo, not assumed** — and the first draft of this hook was built on the second one before the numbers came in.

| Surface | Reality on 2026-07-31 | Verdict |
|---|---|---|
| **Branch list** | 100+ branches; the first page is alphabetical and still inside the `f`s. Branches are never deleted after merge. A dozen dead `inciardi-collection-*`, plus `audit-anna-v1` through `v11`. | **Useless.** No way to tell live from long-dead. |
| **Open PRs** | **12 open. Newest six days old, oldest from July 7. Every one abandoned.** | **Worse than useless.** It has the exact shape of a claim ledger and every entry is a lie. |

⚠️ **Do not build a collision check on either.** They are noise, and noise shaped like signal is how a check gets trusted while returning nothing.

> Live finding for Michael: **12 abandoned PRs and hundreds of undeleted branches are themselves a hazard.** Not cleaned up here — closing another agent's PR is destructive and outside this hook's business — but somebody should sweep them.

---

## The check

### 1. Recent commits on the path you are about to touch

    githubmcp_list_commits(owner, repo, path: '<app-or-dir>', since: '<today>')

One call. **Self-maintaining** — a commit exists because work happened, nobody has to remember to file it, and it cannot go stale because it is timestamped. Run it against the **directory**, not a single file: a parallel session will be in the same *area*, rarely the same file.

Verified 07-31: returns four commits on `inciardi-collection`, correctly ordered, zero noise, and the fourth is the parallel session's.

**Anything you did not write, landed today, in your area → STOP and tell Michael before building.**

⚠️ **Honest limit, stated because a check with an unstated blind spot gets over-trusted:** this sees work that has *landed*. It cannot see a session mid-flight that has not pushed. On 07-31 the parallel session's commit landed four minutes *after* this session started building, so **this check alone would have passed at start time.** It would have caught the collision mid-build — an hour of waste avoided rather than none, which is precisely why step 4 exists.

### 2. The board

Read `brain-config/session-board.md`. It is the only surface carrying **intent** — work declared before it produces a commit — so it covers step 1's blind spot.

**Treat rows as suspect, never authoritative.** The board's own record: a row sat stale for four days claiming two files, and *every collision check run between then and now read a false claim*. Its own diagnosis: **the enforcement gap is that nothing checks.**

- Row names your files **and** there is matching recent commit activity → **real. Stop.**
- Row names your files, no commits for days → **probably stale.** Say so out loud and proceed carefully; do not silently disbelieve it.
- **No row at all means nothing.** An empty board is indistinguishable from nobody having posted (Concurrency rule 5). Neither session on 07-31 had a row.

### 3. Then claim — `session-open.md` C6

Post or **move** your row before the write. A row is only true until your scope changes.

### 4. Re-run step 1 immediately before you merge

The cheapest step and the one that pays. On 07-31 it would have turned an hour of duplicated work into five minutes.

---

## 🚨 Halt signals — errors that are already telling you

**These fire on their own. The failure is treating them as friction to route around instead of information.** This repo has already named the pattern, in the deploy workflow: *the secrets step PRINTED 50 chars and carried a comment saying 32 was expected. The evidence was emitted and not acted on.* **AN OBSERVATION IS NOT A CHECK.**

| Signal | What it means | Do NOT |
|---|---|---|
| **`create_branch` → Reference already exists** | Someone chose your branch name for your work — probably because it is the obvious name for it. | **Adopt the branch and carry on.** |
| `merge_pull_request` → merge conflicts, on a branch cut minutes ago | Someone landed in your files while you worked. | Rebase and force it through. |
| `create_or_update_file` → 409 / SHA mismatch | The file changed under you since you read it. | Re-fetch and re-apply blind. |
| File content not matching the SHA you are holding | Same. | Trust the carried SHA. |

### 🔴 The one that actually happened

**2026-07-31, ~17:17.** `create_branch('inciardi-collection-v16-batch-json')` returned **Reference already exists**. I wrote *that branch already exists — checking what's on it*, listed its files, saw they matched `main`, and built for an hour. The other session's PR merged at **17:19**. Mine hit conflicts at **17:28**.

**That was the only signal available before any work was wasted, and it fired perfectly.** I even investigated it — and checked the wrong thing. I asked *does this branch have content?* The question was **who made this, and are they still working?** One `list_commits` against the ref would have answered it.

> **A branch you did not create, named for the work you are about to do, is another session's claim.** Investigate the WHY; never adopt the branch. If you cannot establish who cut it and when, stop and ask Michael.

---

## When this fires

**Per work item, not per session.** A work item is any coherent chunk you would describe to Michael as a thing you are doing: a feature, a version, an audit pass, a doc rewrite.

- Session starts → fires before the first build
- Michael asks for something new mid-session → **fires again**
- Scope grows into files you had not claimed → **fires again, and move your board row**
- About to merge → step 1 only

Skip it for: reads, a one-line typo fix in a file you already hold, workspace-only work touching no repo files.

---

## Does NOT

- Close or clean up anyone else's branch or PR — destructive, and not this hook's business. Surface it to Michael.
- Replace C6. This is the read; C6 is the write. **Both fire.**
- Block on a stale-looking row. Name the doubt out loud and proceed with care.
- Fire for pure reads.

---

## Composes with

- **`hooks/session-open.md`** — C6 is the claim half; this is the check half
- **`hooks/stale-context-reload.md`** — a SHA mismatch is both a staleness problem and a collision signal
- **`hooks/commit-pre-flight.md`** — runs after this, on the write itself

---

## Failure modes this prevents

- **Two sessions building one feature.** 07-31, batch-import, ~1 hour duplicated. Third collision in a week.
- **Two sessions writing one file.** 07-25, `_shared/super-agent-base.md` rewritten under a live audit while the board read *No active sessions* for 98 minutes.
- **A collision signal explained away.** The halt-signals table, and the worked example above.
- **A check that only runs when someone also remembers to announce.** Split in two.
- **A check that runs once, at the moment scope is least predictive.** Per work item.
- **A check built on a surface that looks authoritative and is dead.** The measured table at the top.

---

## Changelog

- **2026-07-31 — created.** Two sessions built the batch-import feature simultaneously; discovered at merge. Third collision this week — [PR #602](https://github.com/mawizorek/ClickUp_apps/pull/602) shipped `/summary` one minute before the request for it arrived, and the 07-25 base-spec rewrite landed under a live audit. **C6 existed and neither session reached it.** The three design faults are at the top of this file. The two dead surfaces were measured rather than assumed — and the first draft of this hook was built on one of them before the numbers came in.
