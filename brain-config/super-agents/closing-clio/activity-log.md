# Clio — Activity Log

> **LIVE per-reply session record.** Start the entry at session Commit, append one line per
> qualifying reply (delivers content, answers a question, takes action, makes a decision, or issues a correction) as you go. At close it is already done — no batch reconstruction.
> Newest session on top, append-only. Budget ~4-5KB (sliding window, last 10-15 sessions);
> quarterly cold archives go to `activity-log/YYYY-QN.md` per `hooks/memory-rotation.md`.
>
> ⚠️ Format law: `_shared/super-agent-base.md` → Per-response logging mandate (LOCKED 2026-07-25).
> ~~Previous rule: "one condensed entry per session, written at close."~~ Retired the same day
> this file was created — see the 07-25 entry below.

---

## 2026-07-25 — Graduated (lens → git-teammate)

Session task: [Fleet Build Queue](https://app.clickup.com/t/86ajmepcf) · agent: Fleet Felix (steward), building me

- ~3:40 PM · Recommended by Felix unprompted; Michael said "let's do Clio." Promoted on Constitution §6 — I already kept durable state on disk (`usage-log.json`, `agents/closing-clio/reports/`) while re-deriving my history cold at every close. Sixth graduation: Wes → Anna → Mira → Maggie → Sage → me.
- ~3:43 PM · 5-file bundle authored at `super-agents/closing-clio/`. Procedure stayed OUT: `hooks/session-close.md` remains canonical and I steward it (`decision-log.md` D2). My audit output shape kept as a condensed INCUBATING pointer (D5).
- ~3:44 PM · `agents/closing-clio.md` → redirect tombstone, metadata sidecar flipped to `retired`. The `agents/closing-clio/reports/` sidecar deliberately did NOT move: a tool path is not an agent's home.
- ~3:45 PM · Registered in `roster.json` — one row moved lens-block → teammate-block. Bare `Clio` fires a READ-ONLY health check; the write-heavy full close needs the trigger (D3, same shape as Maggie).
- ~3:46 PM · Fixed on the way through: the git-teammate audit DoD still demanded a `registry.json` row for a file retired earlier the same day. My own birth audit would have failed on a phantom check. `audit-instruction.md` → v0.5, DoD → v0.2.
- ~3:49 PM · Birth audit: 9/9 PASS, one open surface (the Hana seam). PR #526 squash-merged.
- ~4:25 PM · **Re-audit after drift.** Dexter's parallel session (2:31–4:09 PM) rewrote `_shared/super-agent-base.md` roughly 20 minutes after my bundle merged, locking a LIVE per-reply logging policy. My birth audit was true at 3:49 and stale by 4:09. This file was written to the retired "condensed entry at close" rule; reformatted to the live standard, which is why the entry you are reading is per-reply rather than one paragraph. Audit record amended rather than reissued.

**State left:** callable via `/session.agent=Clio`. `memory.md` is 100% INHERITED — nothing in it was observed by me with memory attached. My first real close converts leads into facts; re-label confirmed lines EARNED with the date.

**Open surfaces:** (1) the Handoff Hana seam on close Step 5 — FLAGGED for Michael, not resolved (D4). (2) `memory/archive/` + `activity-log/` folders not yet cut; they land on first rotation. (3) I was not in Dexter's 4:09 PM fleet rotation sweep — I did not exist as a teammate when it ran, so my first close is also my first budget check.
