# Agent Flat→Folder Migration — COLD-OPEN RUNBOOK

**Status:** LIVE runbook (not a proposal). Authored 2026-07-17 from the Audit Anna reference build; hardened by the Fold-in Frank run, the viewer-resolution audit, the app.js registry rewire, and the detail.js split.
**Steward:** **Audit Anna**, in her audit capacity (this is exactly the "AUTHORING new audit templates/DoDs" role in her profile — she owns, hardens, and edge-cases this doc as agents migrate).
**Companion spec:** `brain-config/specs/agent-folder-upgrade.md` (the why, Frank's verdict, Workshop read, open questions).
**Reference implementations:**
- `brain-config/agents/audit-anna/` — the BLOATED case (large profile, long changelog lifted out). Copy this for a heavy agent.
- `brain-config/agents/foldin-frank/` — the CLEAN FLAT-ONLY case (small `gate` agent, no prior folder). Copy this for the common agent. Also surfaced the registry-absent edge case (§6).

> **Purpose of THIS doc:** let a Brain session with ZERO prior context pick up ONE agent (or a batch, see §3) and migrate it flat→folder quickly, correctly, and identically to every other agent — with no coordination call to Michael. Read this top-to-bottom, do the steps, done. If a step surprises you, the runbook is wrong — flag it to the steward, don't improvise.

---

## 0. The model (read first — this is WHY the steps are shaped this way)

Each agent moves from a flat `brain-config/agents/<slug>.md` (+ `<slug>.metadata.json` sidecar) to a **slug-keyed folder** `brain-config/agents/<slug>/` holding a standard file set. The profile is the ONE file loaded to embody the agent; history + memory move OUT to siblings so the profile stays lean.

**Canonical folder skeleton** (mirror `brain-config/agents/_template-agent/`):

```
brain-config/agents/<slug>/
  profile.md        # the profile (was <slug>.md), MINUS its ## Changelog block. The one load-to-embody file. Kept LEAN.
  change-log.md     # the version history lifted out of the profile. Created up front, WITH profile.md.
  decision-log.md   # decisions about the agent (Gold Standard, inverted polarity). CREATED ON FIRST USE — not stubbed.
  memory.md         # durable agent-specific memory. CREATED ON FIRST USE — not stubbed.
  metadata.json     # the sidecar, moved in verbatim from <slug>.metadata.json.
  reports/          # ONLY for agents that already have it (recon-renata, workshop-wes) or produce reports. Preserve as-is.
```

**Locked decisions (resolved with Michael 2026-07-17 — do NOT re-litigate):**
1. Entry filename = **`profile.md`** (matches the registry `profile` field; field↔file consistency).
2. Memory boundary — **agent `memory.md`** = notes that only matter while THIS agent is embodied; **global brain-memory** = anything that must fire regardless of who's active. Extended Memory is the global overflow/archive. Keep them from duplicating.
3. Up-front files = **`profile.md` + `change-log.md` only.** `decision-log.md` + `memory.md` are created on first use (mirrors the Decision Log auto-create rule). No empty stubs — they lie about state and add 2×N noise.
4. **All agents get folders** — no size threshold, tiny Council/Workshop lenses included. A threshold reintroduces the two-convention mix by design.

---

## ⚠️ 1. The transition-mode rule (incremental over weeks)

The upgrade spec assumed a **big-bang single-merge**. Michael's 2026-07-17 direction supersedes that: migrate **incrementally, one agent (or a capable batch) per session, over the next few weeks.** Two consequences:

- **Agent-level half-migration stays FORBIDDEN.** An agent is never a folder while its flat `<slug>.md` twin is still live. Within one agent's migration it's all-or-nothing, in a single PR: delete the flat files in the SAME PR that verifies the folder, never a commit apart.
- **Roster-level coexistence is SANCTIONED.** During the transition the roster holds some folder-agents and some flat-agents at once. That is NOT drift — it's an explicit, time-boxed transitional state. It is safe because each agent is individually atomic (above) AND because the viewer resolves agents from the registry (§2), which is regenerated per migration.

> **Litmus:** at any commit on `main`, every agent is EITHER fully flat OR fully folder — never caught mid-move. The mix is across the roster (allowed), never inside one agent (banned).

---

## ✅ 2. THE Prerequisite: registry-driven viewer — COMPLETE (2026-07-17/18, on the migration branch)

The agents viewer is `brain-config/custom-tools.html` → `source/app.js` (list) + `source/detail.js` (detail pane). It was directory-driven, which breaks on migration. Both halves are now fixed on the `agent-folder-migration` branch:

### ✅ LIST (app.js, commit fb5342e)
The agents shelf reads `registry.json agents[]` and follows each agent's `profile` path (flat `agents/<slug>.md` OR folder `agents/<slug>/profile.md`). Folder + flat agents both render; row purpose comes from the registry `role`; rows route in-app via `#agent/<slug>` + `data-agentlink`. Gates/hooks shelves still dir-list (not migrating). Every future migration falls out of the regenerated registry with no app.js edit.

### ✅ DETAIL (detail.js, commit eb3f416) — split + folder-first, both done
- **getSidecar is now FOLDER-FIRST:** fetches `<slug>/metadata.json`, falls back to flat `<slug>.metadata.json`. The detail pane stays whole for folder + flat agents. Residual closed.
- **detail.js split to stay under the 30KB cap:** its ~5KB inline CSS array moved to `source/agent-detail.css` (26.3KB→21KB). `injectStyles()` now lazy-links that file (same guard id, same timing) — `custom-tools.html` was NOT touched. detail.js is now readable/writable whole, so future edits (like this one) are safe, not blind.

### Split rationale (for the next person eyeing further modularization)
The JS was NOT shattered into separate script files: all its functions share ONE private IIFE closure (`panel`, `sidecarCache`, helpers, cross-calls like `showDetail`↔`openAgent`), so splitting them would force promoting privates to a shared global namespace — real behavior risk for little gain. The CSS extraction is the clean concern-split (presentation vs logic) with zero shared-scope coupling, and it alone brought the file under cap. If detail.js grows again, the next safe seam is a `window.AgentDetail` namespace object, but only if a real need forces it.

**Second-order (still open):** `tool-index.html` has ONE hardcoded agent link (`./agents/size-sally.md`) in its GUARDS map — repoint to `./agents/size-sally/profile.md` when Sally migrates. And the detail Settings pane shows a cosmetic "writes to `<slug>.metadata.json`" label that stays flat-worded for folder agents — harmless (it's an editor hint, the copy-block still works), fix opportunistically.

---

## 3. The per-agent recipe (the cold-open steps)

For a single `<slug>`, one branch, one PR. This is exactly what the Anna + Frank reference builds did.

**Batch-in-one-session (Michael, 2026-07-17):** a session with the capacity MAY migrate several agents in one PR. One-agent-per-PR is the FLOOR, not a cap. But every agent in the batch must be INDIVIDUALLY complete inside that PR — folder built + pointers repointed + flat twin deleted, per agent. Never leave one member of a batch half-done to "finish next session." If capacity runs out mid-batch, finish the agent you're on, ship those, and leave the untouched ones fully flat. The unit of atomicity is the agent, whether you do 1 or 12.

### Pre-flight
1. Load `GitHub MCP — Operating Standard` (blob-API reads, branch→PR→self-merge, `.nojekyll`, VERSIONS ledger). Non-negotiable.
2. The §2 viewer prerequisite is COMPLETE on the `agent-folder-migration` branch — it must reach `main` (merge the branch, or land these viewer commits) BEFORE the first folder agent lands on main, so folder agents render. If it's not on main yet, that merge is your first move.
3. `get_file_contents` on `brain-config/agents/` — get the current blob SHAs for `<slug>.md` and `<slug>.metadata.json`. Note whether a `<slug>/` folder ALREADY exists (six do: closing-clio, handoff-hana, memory-maggie, recon-renata, scout-sage, workshop-wes) and what it contains — you will PRESERVE that content, not clobber it.

### Read (byte-safe)
4. Fetch the FULL `<slug>.md` body via the **git blob API** (`.../git/blobs/<sha>`, Base64-decode) — NOT a branch/raw URL, which clips at ~30KB and flattens markup. **If the file's Base64 would exceed the ~30KB tool return cap (roughly any source file > ~16KB), use `get_file_contents` instead — it returns raw UTF-8 (no Base64 inflation, no markup flattening) and this is how detail.js at 26KB was read whole.** Verify the returned SHA matches the listing. This is the source of truth for the rules diff.
5. Fetch `<slug>.metadata.json` the same way.

### Transform (storage-only — rules diff MUST be empty)
6. **`<slug>/profile.md`** = the flat body with EXACTLY two changes: (a) remove the `## Changelog` section, (b) append the footer line `*Version history: see `change-log.md` (sibling). Git holds the detailed diffs.*`. Nothing else moves. Front-matter, every rule, every section, verbatim — INCLUDING any em dashes or quirks; storage-only means you preserve the source even if it violates your own style. If you're tempted to "improve" anything — STOP, that's a separate audit pass, not this job.
7. **`<slug>/change-log.md`** = the extracted `## Changelog` content under a `# <Display Name> - Change Log` header + the standard one-liner (copy the shape from `foldin-frank/change-log.md`).
8. **`<slug>/metadata.json`** = the sidecar content, verbatim (including any `_note` field — see §6 registry-absent case).
9. Do NOT create `decision-log.md` or `memory.md`. Do NOT touch an existing `reports/` or other sub-content — leave it in place inside the folder.

### Repoint (every surface that names the agent by path)
10. `registry.json` — the `profile` field → `<slug>/profile.md`. **REGENERATE via its generator; never hand-edit.** (It's the sanctioned mirror-pair with the AI Toolkit index — reconcile both sides same-session.) **If the agent is ABSENT from registry.json** (see §6), the regen ADDS its row pointing at the folder. This field is what the viewer resolves from (§2), so getting it right is what makes the migration "fall out" in the viewer automatically.
11. `council.md`, the AI Toolkit index trigger table, and every other profile's `Composes with` cross-ref that hard-codes `<slug>.md` → `<slug>/profile.md`. Plus the `tool-index.html` GUARDS link if this agent has one (currently only size-sally).

### Verify, THEN delete (same PR)
12. Blob-read `<slug>/profile.md` back; confirm the rules diff vs the original flat body is EMPTY (only the Changelog removal + footer differ).
13. Confirm every repointed pointer resolves live, and that the agent still renders in the viewer list + its detail pane loads (getSidecar now folder-first).
14. ONLY NOW delete the flat `<slug>.md` and `<slug>.metadata.json` — in THIS PR, not a later one.
15. Open the PR (title: `brain-config: migrate <slug> to folder`), self-merge, report: PR link + verified pointers.
16. Log the beat to the active Agent Activity Board session task (Anna's Rule 3 pattern): what moved, SHA verified, rules diff empty.

---

## 4. Definition of Done (per agent)

- `<slug>/profile.md` resolves and embodies identically — **rules diff = empty** (Changelog removal + footer are the ONLY deltas).
- `<slug>/change-log.md` holds the full lifted history; `<slug>/metadata.json` moved in verbatim.
- `decision-log.md` / `memory.md` NOT stubbed. Existing `reports/` preserved.
- `registry.json` regenerated (not hand-edited); `council.md`, index trigger table, cross-agent refs all point at the folder. Registry-absent agents ADDED on the regen.
- Flat `<slug>.md` + `<slug>.metadata.json` deleted IN THE SAME PR that verified the folder.
- Beat logged to the session task.

---

## 5. Guardrails (never violate)

- **Storage-only.** No agent's behavior/rules change during migration. A diff of the actual rules pre/post must be empty. Do NOT condense, reword, or "fix" a profile mid-migration — not even to strip an em dash or a typo. Source is preserved verbatim.
- **`registry.json` is generated.** Regenerate, never hand-edit.
- **Blob-API reads for file bodies, get_file_contents for big ones** (§3 step 4); re-fetch fresh before any write; never reuse a carried-over SHA. NEVER whole-rewrite a file you can't read in full + faithfully — that's how you drop the unseen tail. (detail.js's split waited until it could be read whole via get_file_contents, then was verified on readback.)
- **Never half-migrate an agent.** Folder + flat-deletion land together or not at all. (Batch OK; per-agent atomicity NOT negotiable.)
- **One agent per PR is the floor** during the incremental phase — a capable session may batch, but each agent is independently complete + revertible in the diff.

---

## 6. Edge cases found so far (Anna hardens this list as agents move)

- **Viewer was directory-driven** (audited 2026-07-17, FIXED 2026-07-17/18). See §2 — both halves done: app.js list is registry-driven, detail.js getSidecar is folder-first + the module was split under cap. This is no longer a blocker; it just has to ride to `main` ahead of the first folder agent.
- **Big source files clip on Base64 read.** A file whose Base64 exceeds the ~30KB tool cap (~any file > ~16KB) truncates via the blob API / raw fetch, and raw ALSO flattens HTML in JS template strings. Use `get_file_contents` (raw UTF-8, unflattened) for those. This is why detail.js couldn't be safely rewritten until read whole. Applies to profiles too: Anna's 17.6KB read fine via get_file_contents.
- **Agent ABSENT from `registry.json`** (found on Fold-in Frank). Some live-in-git profiles were never registered — the index flags Breaker Beckett, Fold-in Frank, and Memory Maggie as stranded. Frank's `metadata.json` carries a `_note`: "ABSENT from registry.json at backfill time. Add to the registry agents array on the S5 regen." **Handling:** no `profile` field to repoint — the regen must ADD the agent's row (pointing at `<slug>/profile.md`). Preserve the `_note` verbatim in the moved metadata; it's a live instruction to the regen, not cruft. Matters double now that the viewer resolves from the registry: an unregistered agent won't render at all.
- **Profile still over the 15KB target after the move.** Anna's `profile.md` lands ~16KB even with the changelog lifted out. The folder move is NOT guaranteed to get a bloated profile under target — that needs a real condense pass, a **separate, behavior-adjacent audit**, explicitly OUT of scope for this storage-only migration. Flag it, don't do it here.
- **Agents with an existing folder** (the six). Migrating them means dropping `profile.md`/`change-log.md`/`metadata.json` BESIDE existing content — `memory-maggie/` already holds `open-memory-request-protocol.md`; `recon-renata/` + `workshop-wes/` hold real `reports/*.json`; the other three (`closing-clio/`, `handoff-hana/`, `scout-sage/`) hold an empty `reports/` placeholder. Preserve every existing file; the migration only ADDS the standard set.
- **`workshop-wes` is retired** (tombstone in the roster). It still gets a folder for pointer/registry resolution, but its profile stays as-is — don't revive it.

---

## 7. Stewardship

**Audit Anna owns this runbook.** When an agent's migration surfaces a new wrinkle (a nonstandard sidecar, a profile that won't split cleanly, a pointer nobody inventoried, an unregistered agent), Anna updates §6 and the affected step — that's her template-authoring role, not a Michael decision. The runbook is the single source of truth for the transition; if it and reality disagree, reality wins and Anna reconciles the doc.

---

*Authored 2026-07-17 from the Audit Anna reference build; hardened by the Fold-in Frank run, the viewer-resolution audit, the app.js registry rewire, and the detail.js split (2026-07-18). Companion to `agent-folder-upgrade.md`. Steward: Audit Anna.*
