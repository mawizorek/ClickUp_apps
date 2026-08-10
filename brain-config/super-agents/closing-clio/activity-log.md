# Clio — Activity Log

> **LIVE per-reply session record.** One line per qualifying reply, appended as you go. At close it is
> already done — no batch reconstruction. Newest session on top, append-only.
> Budget **~4-5KB** (sliding window, last 10-15 sessions); quarterly archives to `activity-log/YYYY-QN.md`.
>
> ⚠️ Format law: `_shared/super-agent-base.md` → Per-response logging mandate (LOCKED 2026-07-25).
> ~~Previous rule: "one condensed entry per session, written at close."~~ Retired 07-25, see below.
>
> 🔴 **TWO ENTRIES HERE; `usage-log.json` COUNTS 31 CLOSES.** A sample, never a history. See 08-10.
> ⚠️ **Measure the returned byte count and trim in the same pass.** The 08-10 entry landed at 7,614 B
> against this budget and was cut back on the returned number — **in a session whose own finding was
> files growing past their caps.** Writing the rule does not exempt the write.

---

## 2026-08-10 — Close executed on Production MAWster (Fiona's session)

[Session task](https://app.clickup.com/t/36074068/86ajy56v3) · agent: FMP Fiona · shape A · ~3h45m

- **Handoff Artifact clean.** Spine reconciliation counted not estimated (13/13, 11 on the channel
  root). Agents-present flagged that the task TITLE names three agents who never spoke — **a title is
  not an attendance record.**
- **Maggie first, headline pulled not recomputed:** ~1953/2000 (98%), three qualified candidates
  unplaced. 🔴 The blockage MOVED — `open-memory-requests.md` is **60KB, past the write cap**, so the
  DROP door does not function. **The queue for unlandable writes became unwritable.**
- **Channel 2 pointer posted.** ⚠️ Deviation named, not hidden: **no `.txt` artifact** — the
  two-delivery rule is LOCKED and no tool in that session could attach a file.
- **Task → `done`; handoff cut** after a dedup scrub (closed + done). No match; the theme/styling
  handoff is the SCHEMA queue and stays a cross-linked sibling. ⭐ Ordered *read both Decision Logs*
  **before** the DDR diff — that is the hour this session lost.
- 🔴 **Step 6 REFUSED.** `usage-log.json` already carried tonight's flush from a parallel pass.
  **Re-flushing would double-count every tool in the one file whose value is an honest tally.**
- 🔴 **Ledger write-back: the branch already existed, finished and unmerged.** Caught by a `422`, not
  the board. Verified theirs (9,028 B, under cap, smaller than main) and shipped it as PR #789.
  ⭐ **Fifth concurrent-work signal tonight; the first one shipped instead of abandoned.**

### 🔴 The finding about THIS file

**Two entries, thirty-one closes.** `memory.md` is dense and current; the ledger its trends derive FROM
is empty. **§4a running backwards** — a row reading *"3 drifts"* cannot be checked, because those closes
left no record here. ⭐ Same shape as the night's other five: **a file that looks maintained because the
one beside it is.** Flagged, **not backfilled** — reconstructing 29 closes would manufacture a history.

### Prior open surfaces, audited not inherited

1. ⬜ **Hana seam (D4)** — open, Michael's. Untouched; Hana not seated.
2. ⬜ **`memory/archive/` + `activity-log/` not cut.** ✅ **Verified still true** by listing, not assumed.
   **Rotation has never run on me.**
3. ~~**Not in Dexter's 07-25 rotation sweep, so my first close is my first budget check.**~~ ✅ **STRUCK,
   resolved 07-26.** Fourteen days stale.

**State left:** all six close steps done. Three memory candidates unplaced, blocked on an unwritable queue.

---

## 2026-07-25 — Graduated (lens → git-teammate)

[Fleet Build Queue](https://app.clickup.com/t/86ajmepcf) · agent: Fleet Felix (steward), building me

- Recommended by Felix unprompted; Michael: "let's do Clio." Promoted on §6 — I already kept durable
  state on disk while re-deriving my history cold at every close. Sixth graduation.
- 5-file bundle at `super-agents/closing-clio/`. **Procedure stayed OUT:** `hooks/session-close.md` is
  canonical and I steward it (D2). Audit shape kept as an INCUBATING pointer (D5).
- `agents/closing-clio.md` → redirect tombstone. The `reports/` sidecar deliberately did NOT move:
  **a tool path is not an agent's home.**
- Bare `Clio` fires a READ-ONLY health check; the write-heavy close needs the trigger (D3).
- **Fixed on the way through:** the git-teammate audit DoD demanded a `registry.json` row for a file
  retired that same day. **My own birth audit would have passed on a phantom check.**
- Birth audit 9/9, PR #526 merged.
- ⚠️ **Re-audit after drift.** Dexter rewrote `_shared/super-agent-base.md` ~20 min after my bundle
  merged, locking live per-reply logging. **My audit was true at 3:49 and stale by 4:09.** This file was
  written to the retired rule and reformatted; the audit record was amended, not reissued.

**State left:** callable via `/session.agent=Clio`. `memory.md` 100% INHERITED at birth — nothing in it
observed by me with memory attached. ⚠️ *Open surfaces from this entry are audited in the 08-10 entry;
read that version.*
