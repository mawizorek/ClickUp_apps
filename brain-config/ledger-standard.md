# App Ledger — the Standard

**Companion to [`VERSIONS.md`](../VERSIONS.md) at the repo root.** That file is the DATA: one row per app, current state. This file is the PROCEDURE: how the ledger is maintained, why its rules exist, and what has gone wrong.

> **Split 2026-08-03 (Size Sally).** The seam is **read frequency**, not size. `VERSIONS.md` is read on the way IN to every app touch, and the rows are what that read needs. Everything here is read once, argued about occasionally, and never during the read that matters — while consuming roughly a third of a file whose entire job is to be scannable.
>
> ⚠️ **The IMPERATIVE stayed behind.** Only the JUSTIFICATION moved. A procedure relocated to a second file is a procedure people stop running, so `VERSIONS.md` keeps the four numbered steps in full and this file holds the reasoning behind them.
>
> 🚫 **This is not a second claimant on one truth.** No fact lives in both files. Versions and warnings live there; rules and history live here. If you ever find yourself copying a row into this file, stop — that is the failure mode this split was designed to avoid.

---

## 📏 Size (target **~16KB**, ceiling **22KB** — LOCKED 2026-07-26, Michael)

**Each row is CURRENT STATE, not version history.** Per-version narrative lives in git history, the PR description, and that app's own `README.md` / `next-build-spec.md`. **The ledger cites the PR and stops.**

- **Ceiling ~22KB.** Past it the file cannot be read whole, and **a file that cannot be read whole cannot be safely edited.** ⚠️ **This was called "physics" and it is not.** `maw-agents/uritp-docs` J5 measured 30.6KB reading whole and 34.9KB clipping; the range between is uncharacterised. It is a **BUDGET**. Do not quote physics without a measurement.
- **Target ~16KB** = floor plus real headroom. It replaced a ~12KB target that was never once met (Floor Rule, `hooks/source-size-budget-enforcer.md`).
- **Trim prose, never the table.** ⚠️ **2026-08-03: that instruction is now understood to have been part of the problem.** It made the table untouchable and pointed every trim at prose that was already dense, so seven consecutive edits shaved sentences while the ROWS grew unchecked. The rows are the payload; the correct question is not "can I cut prose" but **"does this belong in the ledger at all, or in the app's own README."**

### 🔴 The add-and-trim failure — SEVEN instances

**EVERY EDIT THAT ADDS MUST ALSO TRIM, IN THE SAME COMMIT, AND READ THE SIZE BACK.**

⭐ **The 08-03 instance explains the other six: a commit whose message claimed a structural trim shipped +87 B.** It cut ~1.8KB of changelog prose and added ~2KB of new row in the same pass. **The failure is not laziness about trimming — it is that the addition and the trim get judged SEPARATELY, so you feel virtuous about the deletion and never subtract.** Read the size back; the number is the only thing that cannot flatter you.

### The growth curve (Size Sally, 2026-08-03)

Measured, not estimated: **~20.0KB on 07-28 → 24,140 B on 08-02 → 26,843 B on 08-03 → 23,922 B after a hand trim → 24,637 B hours later.** Roughly **+1.5KB per active build day**, and the additions are **always rows, never prose**.

**Forecast:** the prose extraction below buys roughly **four active build days** of headroom, not months. **The second seam is already needed and is named below.** A split that is not forecast past its own horizon is a delay, not a fix.

### 🅿️ The second seam — PLANNED, not executed

Two rows (`f1-racetracks`, `inciardi-collection`) are **~5.5KB together, roughly a quarter of the ledger.** Both hold per-app detail that the ledger's own rule assigns to the app README: module maps, route lists, defended-behaviour warnings, data-layer architecture.

**The move is correct and it is not this session's to make.** Those rows carry load-bearing warnings, and relocating a warning without verifying it landed is how one gets lost — a failure this repo has already measured. When it happens: move the detail into each app's `README.md`, leave a one-line pointer plus the warnings that a *reader of the ledger* needs before touching the app, and **verify each landed before deleting the source.**

---

## Why the procedure is shaped the way it is

### Step 1 is the enforcement mechanism

> ⭐ **"Try harder at step 3" is retired as a remedy.** Step 3 fires at the END of work, when the thing you came to do is already done, so it has the least momentum behind it. **Read the ledger on the way IN and the gap is unmissable.** Every gap listed below was caught by step 1; none by step 3.

### The gate cuts BOTH ways

**The ledger is a CLAIM about reality, not reality. HEAD wins; the ledger gets corrected.** Five measured rot classes:

| Class | Instance |
|---|---|
| **WARNING** | 07-25 — an `app-dashboard` "restore pending" note **32 PRs stale**, nearly triggering a destructive revert |
| **OPEN-ITEM** | 07-28 — a completed `f1-racetracks` backfill left listed as open. *A done job in an open list is an instruction to redo it.* |
| **CLASSIFICATION** | 07-30 — `inciardi-collection` called "probably a data/spec folder" while live on a phone |
| **STRUCTURAL CLAIM** | 08-02 — "the worker is two files" when it was six, carrying a split instruction for a split already done twice. **The worst class: it reads as architecture rather than as state.** |
| **SIZE CLAIM** | 08-03 — `git-grab`'s `styles.css` asserted "under the 15KB split line" when it had crossed it. False within one day, caught by its own author. |

**Verify before acting on any ⚠️.**

### 🔴 A row goes stale by DEFAULT, not by accident — SEVEN measurements in four days

`inciardi-collection` v3-vs-v16 (07-31) · `f1-racetracks` eight versions behind (08-01) · `inciardi-collection` four behind **again**, 24 hours after a hand correction (08-02) · `prism` at v1 against a documented v2.2 (08-03) · `git-grab` size claim false within a day (08-03) · **and 08-03, the one worth keeping: an agent told Michael the `git-grab` row was "four versions stale" while reading its own cached copy — the row had already been corrected. A staleness complaint can itself be stale.**

### Conventions

- **Data-separated apps carry TWO version facts:** the *shell* build and the *data* date. A data refresh does NOT bump the shell.
- **Version stamps** quote a version the app itself declares (`APP_VERSION`, or the `?v=` cache-bust) — **not a PR number, not the word "live."**
- ⚠️ **When an app declares its version in more than one place, say WHICH ONE the row quotes** and name the others as disagreeing.
- ⚠️ **Never write a version, or a byte count, you have not READ BACK at HEAD.**

### Coverage

**Every folder in the repo root is either in the ledger table or on the not-apps line. Nothing gets to be invisible.** Four apps were found in the root tree on 07-25 in NEITHER former index, and a fifth (`inciardi-collection`) on 07-26 missing from the ledger itself. **An app nobody indexes is an app nobody verifies.**

⚠️ **Coverage proves an app is LISTED — never that it is still NEEDED, never that the row is TRUE.** `routines` was correctly indexed, freshly versioned and actively maintained on the day it was deleted as redundant: **every duplicate-check we own runs at creation time and none re-run when the world changes.** **A maintained row is not a verified row.**

---

## Changelog

**Findings live in the PR descriptions; this list cites and stops.**

- **08-03 — the ledger split in two** (Size Sally). Standard extracted here; `VERSIONS.md` keeps the table and the imperative steps.
- **08-03 — `git-grab` v0.1 → v1.2**, Waves 0-4 (PRs #713, #714, #718, #719, #720, #722). New app, functional, verified end-to-end by Michael.
- **08-03 — `shared/themes`: `flush` + `database` spacing rows and the `database` join** (PRs #714, #717).
- **08-02 — `cast-grid` v0.1-poc added.**
- **08-02 — `inciardi-collection` v19 → v23** (PRs #689, #692); "worker is two files" corrected to six.
- **08-01 — `shared/themes`: `paddock` entity + `f1-racetracks` join; F1 accent board reworked** (PR #696).
- **08-01 — `f1-racetracks` v11 → v19.1** (PRs #664 → #690).
- **08-01 — `f1-racetracks` v6.7.1 → v11** (PR #654). Season data split into vectors.
- **08-01 — `inciardi-collection` → v19** (PRs #637, #638).
- **07-31 — `inciardi-collection` v3 → v17.**
- **07-30 — write key baked into the public bundle** (deliberate, Michael's call).
- **07-27 — `routines` DELETED** (PR #562).
- **07-26 — target reset to ~16KB.**
- **07-25 — COLLAPSED TO ONE LEDGER** (Michael's call, Dev Dexter). `app-index.md` retired to a stub.
- Earlier history: git log + PR descriptions. Per-app history: that app's `README.md` + `next-build-spec.md`.

---

## Verification log

`unverified` rows carry the last value visible without a fresh read; each gets confirmed the next time that app is touched.

- **07-25:** agentglass, app-dashboard, markdown-viewer, world-cup-bracket, on-track, inciardi-market.
- **08-01:** f1-racetracks at v19.1.
- **08-02:** inciardi-collection at v23.
- **08-03:** git-grab at v1.2 from its own `APP_VERSION`, every byte count read back from its write response. **prism's 07-25 confirmation WITHDRAWN** — it confirmed v1 and the app was already past it.
