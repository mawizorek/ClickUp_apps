# Runbook — Converting a Native ClickUp Agent into a Thin Git Loader

**Status: ✅ RATIFIED 2026-08-01 by Fleet Felix (Fleet Steward). Governs fleet-wide rollout.** Authored by FMP Fiona at Michael's direction, having run it on herself first. ~~PROPOSED 2026-08-01 … Pending Fleet Steward (ClickUp Coach Corey) ratification before it governs fleet-wide rollout.~~ ⚠️ **CORRECTED 2026-08-01 (steward edit by Fleet Felix, at Michael's explicit direction): the Fleet Steward is FLEET FELIX, not Corey.** Corey was re-laned OFF that lane on **2026-07-20 (PR #430)** and now owns URITP workspace structure + ClickUp-setup coaching. The misattribution traces to Fiona's pre-conversion native cache (`../fmp-frank/native-flush.md`, SOURCE PAGE 2), which still names the 07-15-era steward; it reached three files in one day. Struck rather than deleted, per house rule — a silently deleted reversal teaches nobody.

`fmp-frank` is the reference conversion; this runbook is the generalized procedure derived from doing it.

**Companion spec:** [`../fmp-frank/native-loader-kernel.md`](../fmp-frank/native-loader-kernel.md) (the kernel text a converted shell holds). This runbook is the *how*; that file is the *what*.

---

## Why this exists

A native ClickUp agent and a git teammate are NOT a one-to-one file relationship. Git is fine-grained (`preferences.md`, `memory.md`, `activity-log.md`, `decision-log.md`, `native-flush.md`, …). Native is coarse (one profile-config bucket + one memory directory) plus a **body** (user-ID, tools, triggers, model) that cannot live in a repo at all. The conversion makes the repo the single source of truth for the **brain** while the native shell keeps being the **body** — the thing that can be @mentioned, scheduled, and assigned. The flush pipeline is the granularity adapter between the two.

**The invariant that keeps it honest:** one authoritative writer per file; arrows never bidirectional. Brain files flow git→native (read-only each run). The flush intake flows native→git (append-only). Memory Maggie reconciles git-internally. No file is ever authored from both sides, so the two runtimes cannot drift into a fight.

---

## Preconditions — do NOT strip a native shell until ALL are true

1. **The git brain is complete and current.** `preferences.md` fully expresses the agent's role, scope, voice, guardrails; `memory.md` holds its durable patterns. If the git profile was built fresh (not mirrored), diff it against the live native definition and close any gaps FIRST. Stripping native into an incomplete git target is the one irreversible mistake. ⚠️ **DIFF THE FLEET FACTS TOO, not just the agent's own role** (added 2026-08-01 by the Steward, from this conversion's own failure): a native shell's cache carries stale claims about OTHER agents — who the steward is, who owns a lane, who reviews what — and the conversion will laundry them straight into brand-new canonical files. Check every named agent against the 🤖 **Agent Index** list before landing.
2. **`native-flush.md` exists** in the agent's bundle (bare, with its contract header).
3. **Any live native memory has been flushed** (or is trivial). Run one "dump your memory" → verbatim into `native-flush.md` → a Maggie consolidation, so nothing live is lost when native collapses to pointers.
4. **The kernel text is finalized** for this agent (identity + load list + STOP rule + flush contract), with the correct bundle paths.
5. **The agent actually HAS a live native shell.** Obvious, and it is exactly what the original fleet order got wrong: a git-only teammate whose native was retired has nothing to convert.

## The one sanctioned native→git merge (Michael's rule, 2026-08-01)

When folding two native sources into a single git file, **only auto-merge the immutable fact-header** — user-ID, slug, display name, "body is authoritative in ClickUp" — onto the body of `preferences.md`. Those don't change, so consolidating them is safe. **Everything volatile stays in its own file.** If a merge is anything more than fact-header-onto-preferences, stop and consider it deliberately; do not let a curator auto-collapse volatile content across files.

---

## The steps

1. **Confirm preconditions** (above). Read the git brain fresh; do not trust a cache.
2. **Finalize the kernel** for this agent from the reference template — swap identity, user-ID, and bundle paths. Ensure the load list names all three brain axes: `preferences.md`, `memory.md`, `native-flush.md` (plus `team-standard.md`).
3. **Land the kernel + this runbook** in the repo.
4. **Flush + consolidate** so `native-flush.md` is bare and `memory.md` is current.
5. **Run the conversion** — reduce the live native instruction field to the kernel text (via `edit_self` where the agent can self-edit, or the ClickUp UI). **Preserve the body unchanged:** identity/user-ID, all enabled tools, all knowledge-access grants, all triggers, model. Replace ONLY the behavioral definition.
6. **Verify pointer-pull** (below) before trusting the converted shell.
7. **Record the conversion** in the agent's `activity-log.md` / decision log with the reasoning, not just the fact.
8. **Reconcile the shell's UI surface** — display name and description. A kernel that self-identifies as one name while the profile UI shows another is a live identity split (this is open surface #1 on the reference conversion).

## Verification — prove the loader before you trust it

- On the next run, the shell must successfully read all four load-list files fresh. Evidence during the converting session that the GitHub read path works (a clean file read) is the pre-flight signal.
- Deliberately reason about the STOP rule: if the read failed, would the shell halt rather than improvise? The kernel text must make that unambiguous.
- Check the flush signal: `native-flush.md` empty ⇒ `memory.md` is the whole truth; non-empty ⇒ the shell must also read the delta.

## Rollback

The conversion is reversible from the ClickUp side: restore the prior native definition in the profile UI (and/or re-`edit_self`). The pre-conversion definition is preserved in git history + the agent's bundle, so a restore is a paste, not a reconstruction. This is why preconditions #1–#3 matter — they guarantee a clean restore point exists.

---

## Per-agent checklist (copy per conversion)

- [ ] agent has a LIVE native shell to convert
- [ ] git `preferences.md` complete + current (diffed vs live native)
- [ ] every OTHER agent named in the bundle checked against the 🤖 Agent Index
- [ ] git `memory.md` current
- [ ] `native-flush.md` exists
- [ ] live memory flushed + consolidated (intake bare)
- [ ] kernel finalized with correct identity + paths + 3-axis load list
- [ ] kernel + runbook landed
- [ ] native definition reduced to kernel; body preserved
- [ ] pointer-pull verified; STOP rule unambiguous
- [ ] UI display name + description reconciled with the kernel identity
- [ ] conversion recorded in activity/decision log

**Fleet order:** `fmp-frank` (reference, done 2026-08-01) → **next targets: Mainstage Milo, Listing Lookout.** ~~→ Corey (next, and he ratifies this runbook on his own pass) → Milo, Listing Lookout~~ ⚠️ **CORRECTED 2026-08-01 (Steward): Corey CANNOT be converted — he has been GIT-ONLY since 2026-07-19, when his native ClickUp agent was retired.** There is no shell to reduce, so his slot was doubly wrong (wrong steward, impossible conversion). 🚩 **Michael's call before either remaining conversion runs:** confirm Milo and Listing Lookout each still have a live native shell, and confirm the order — precondition #5 exists precisely because this list assumed one that did not.
