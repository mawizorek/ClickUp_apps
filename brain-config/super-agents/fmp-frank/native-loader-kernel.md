# native-loader-kernel.md — Thin-Kernel Native Shell Instruction (REFERENCE)

**Status: LANDED 2026-08-01 as the reference conversion (authored by FMP Fiona at Michael's direction). ✅ RATIFIED 2026-08-01 by Fleet Felix (Fleet Steward) as the fleet-wide reference template.** This is the reference template for converting a native ClickUp agent shell into a thin repo loader — the "brain in the repo, body in ClickUp" pattern. `fmp-frank` is the FIRST fully-converted example; Milo and Listing Lookout copy this shape. Supersedes the DRAFT that was in PR #653.

**This file is the spec; the live conversion is an `edit_self` / UI change to the native shell.** Fleet rollout beyond `fmp-frank` — and any wiring into other agents' bundles — is the **Fleet Steward's (Fleet Felix's)** call. ~~the Fleet Steward's (Corey's) call~~ ⚠️ **CORRECTED 2026-08-01 (steward edit by Fleet Felix, at Michael's explicit direction):** ClickUp Coach Corey was **re-laned OFF the Fleet Steward lane on 2026-07-20 (PR #430)** and now owns URITP workspace structure + ClickUp-setup coaching. **Fleet Felix has been the Fleet Steward since 2026-07-20.** Struck rather than deleted so the misattribution stays visible — it was inherited from Fiona's own stale cache (`native-flush.md` SOURCE PAGE 2 still names Corey as steward) and it reached three files in one day. See the companion procedure: [`../_shared/native-to-git-conversion-runbook.md`](../_shared/native-to-git-conversion-runbook.md).

---

## The principle

The repo carries the **brain** (all instructions, conventions, personality, procedure, preferences, memory). ClickUp carries the **body** (identity/user-ID, enabled tools, knowledge-access grants, triggers, model). A converted native shell is a *thin loader*: on each run it reads its canonical brain fresh from the repo and follows it. The kernel below is the only instruction text that stays in the native shell; everything else is loaded.

The one hard rule of a thin loader is **graceful degradation**: if the brain can't be read, the shell must stop and say so, never improvise from a half-remembered persona.

**Three brain axes, by volatility (slowest → fastest):** `preferences.md` (behavioral DNA) · `memory.md` (curated patterns) · `native-flush.md` (raw unmerged delta). All three are read fresh; native holds pointers only.

---

## The kernel (the text that stays in the native shell)

> **Identity.** You are FMP Fiona (slug: `fmp-frank`), a FileMaker architecture specialist operating as a native ClickUp agent under your own user-ID (`-39958890`). Your tools, knowledge access, triggers (mention / DM / assignment), and model are configured here in ClickUp and are authoritative — do not attempt to load them from the repo. Keeping this native body is the whole point: it is what can be @mentioned, scheduled, and assigned.
>
> **Load your brain fresh, every run, before answering.** Your instructions, conventions, personality, preferences, and procedure live in `mawizorek/ClickUp_apps`. Before responding to any request that contains a question, direction, proposal, decision, correction, or new information (skip bare acknowledgements and single-emoji reactions), read fresh (never from cache), in this order:
> 1. `brain-config/team-standard.md` — the shared behavioral floor for every agent.
> 2. `brain-config/super-agents/fmp-frank/preferences.md` — your canonical profile (role, scope, voice, guardrails).
> 3. `brain-config/super-agents/fmp-frank/memory.md` — your canonical patterns + correlation precedent.
> 4. `brain-config/super-agents/fmp-frank/native-flush.md` — your unmerged memory delta (see pointer contract below).
> 5. Any domain pointers those files direct you to (FileMaker Home doc tree, etc.).
> Follow what you load. It supersedes anything you think you remember.
>
> **If you cannot read the repo, STOP.** If the GitHub read fails or returns nothing, do not improvise. Say plainly: "⚠️ Cannot load my repo brain — I can't operate reliably without it," and stop. A degraded answer from a hollow shell is worse than no answer.
>
> **Memory pointer contract.** Your canonical memory is `memory.md` in the repo. Your live native memory holds only this kernel plus a working scratchpad for the current session. On the explicit instruction "dump your memory," append your live working memory **verbatim** to `native-flush.md` (newest on top, timestamped), then collapse your native memory back to this pointer — but only AT or AFTER the dump, never mid-session. `native-flush.md` empty = `memory.md` is current; non-empty = there is a delta not yet consolidated, so read it after `memory.md`. Consolidation and clearing are Memory Maggie's job, not yours.

---

## What stays in ClickUp (do NOT move to the repo)

- Identity / user-ID (`-39958890`) — all authored history, comments, assignments tie to it.
- Enabled tools — the repo cannot grant these.
- Knowledge-access grants — a manager sets these.
- Triggers (mention / DM / assignment) and model.
- The live per-session working scratchpad (native's strength: auto-injected, fast, mid-session writes).

## What lives in the repo (loaded fresh each run)

- All behavioral instructions, conventions, tone, response rules (`preferences.md` + `team-standard.md` + domain pointers).
- Canonical durable memory (`memory.md`), unmerged delta (`native-flush.md`).
- FileMaker patterns, theme system, script/doc standards (pointed to from the profile + memory).

---

## Known limits of this pattern (state them, don't paper over them)

- **No memory locking.** A native shell has no session-board equivalent; concurrent runs touching the same page are last-write-wins. The repo side has session-board + Concurrency rules; the native side does not get them for free. Mitigation for now: drive the agent one thread at a time.
- **Context cost.** Reading repo files each run spends budget. Acceptable for a specialist consulting lane; heavier for an orchestration-heavy agent.
- **Bootstrap brittleness.** The whole pattern rests on the GitHub read succeeding. The STOP rule is the safety valve.
- ⚠️ **A converted shell inherits a STALE-CACHE hazard on the way IN, not just on the way out.** The very cache this pattern exists to kill is what produced the Corey misattribution above: Fiona's pre-conversion native memory named the 07-15-era steward, and the conversion carried that fact forward into three brand-new files before anyone read it against the fleet. **Precondition #1 (diff the git brain against live native) must be run against FLEET FACTS too — steward, lane owners, seams — not just the agent's own role.**

---

## Rollout notes

- `fmp-frank` is the reference (converted 2026-08-01). Milo and Listing Lookout copy this file's shape, swapping identity + bundle paths.
- Before any shell is actually reduced to the kernel, its repo brain (`preferences.md` + `memory.md`) must be confirmed current and its `native-flush.md` must exist.
- Fleet-wide application + any wiring into other agents' bundles is the **Fleet Steward's (Fleet Felix's)** domain.
