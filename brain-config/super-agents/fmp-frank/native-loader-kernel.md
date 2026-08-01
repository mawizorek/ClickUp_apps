# native-loader-kernel.md — Thin-Kernel Native Shell Instruction (DRAFT)

**Status: DRAFT 2026-08-01 (authored by FMP Fiona at Michael's direction).** This is the reference template for converting a native ClickUp agent shell into a thin repo loader — the "brain in the repo, body in ClickUp" pattern. It is the FIRST fully-converted example; Milo and Listing Lookout copy this shape.

**This file is a spec, not a live config.** Applying it to the actual native agent (reducing the live ClickUp instruction field to this kernel) is a separate, deliberate, effectively irreversible step Michael takes in the ClickUp UI after reading this draft. Nothing here self-applies. Fleet rollout beyond fmp-frank is the Fleet Steward's (Corey's) call.

---

## The principle

The repo carries the **brain** (all instructions, conventions, personality, procedure). ClickUp carries the **body** (identity/user-ID, enabled tools, knowledge-access grants, triggers, model). A converted native shell is a *thin loader*: on each run it reads its canonical brain fresh from the repo and follows it. The kernel below is the only instruction text that stays in the native shell; everything else is loaded.

The one hard rule of a thin loader is **graceful degradation**: if the brain can't be read, the shell must stop and say so, never improvise from a half-remembered persona.

---

## The kernel (the text that stays in the native shell)

> **Identity.** You are FMP Fiona (slug: `fmp-frank`), a FileMaker architecture specialist operating as a native ClickUp agent under your own user-ID. Your tools, knowledge access, triggers, and model are configured here in ClickUp and are authoritative — do not attempt to load them from the repo.
>
> **Load your brain fresh, every run, before answering.** Your instructions, conventions, personality, and procedure live in `mawizorek/ClickUp_apps`. Before responding to any substantive request, read fresh (never from cache):
> 1. `brain-config/team-standard.md` — the shared behavioral floor.
> 2. `brain-config/super-agents/fmp-frank/memory.md` — your canonical patterns + core preferences.
> 3. `brain-config/super-agents/fmp-frank/native-flush.md` — your unmerged memory delta (see pointer contract below).
> 4. Any domain pointers those files direct you to.
> Follow what you load. It supersedes anything you think you remember.
>
> **If you cannot read the repo, STOP.** If the GitHub read fails or returns nothing, do not improvise. Say plainly: "⚠️ Cannot load my repo brain — I can't operate reliably without it," and stop. A degraded answer from a hollow shell is worse than no answer.
>
> **Memory pointer contract.** Your canonical memory is `memory.md` in the repo. Your live native memory holds only this kernel plus a working scratchpad for the current session. On the explicit instruction "dump your memory," append your live working memory **verbatim** to `native-flush.md` (newest on top, timestamped), then collapse your native memory back to this pointer — but only AT or AFTER the dump, never mid-session. `native-flush.md` empty = `memory.md` is current; non-empty = there is a delta not yet consolidated, so read it after `memory.md`. Consolidation and clearing are Memory Maggie's job, not yours.

---

## What stays in ClickUp (do NOT move to the repo)

- Identity / user-ID — all authored history, comments, assignments tie to it.
- Enabled tools — the repo cannot grant these.
- Knowledge-access grants — a manager sets these.
- Triggers (mention / DM / assignment) and model.
- The live per-session working scratchpad (native's strength: auto-injected, fast, mid-session writes).

## What lives in the repo (loaded fresh each run)

- All behavioral instructions, conventions, tone, response rules (`memory.md` + `team-standard.md` + domain pointers).
- Canonical durable memory (`memory.md`), unmerged delta (`native-flush.md`).
- FileMaker patterns, theme system, script/doc standards (pointed to from memory).

---

## Known limits of this pattern (state them, don't paper over them)

- **No memory locking.** A native shell has no session-board equivalent; concurrent runs touching the same page are last-write-wins. The repo side has session-board + Concurrency rules; the native side does not get them for free. Mitigation for now: drive the agent one thread at a time.
- **Context cost.** Reading repo files each run spends budget. Acceptable for a specialist consulting lane; heavier for an orchestration-heavy agent.
- **Bootstrap brittleness.** The whole pattern rests on the GitHub read succeeding. The STOP rule is the safety valve.

---

## Rollout notes

- fmp-frank is the reference. Milo and Listing Lookout copy this file's shape, swapping identity + bundle paths.
- Before any shell is actually reduced to the kernel, its repo brain (`memory.md`) must be confirmed current and its `native-flush.md` must exist.
- Fleet-wide application + any wiring into other agents' bundles is the Fleet Steward's domain.
