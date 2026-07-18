# Agent Flat→Folder Migration — COLD-OPEN RUNBOOK

**Status:** LIVE runbook (not a proposal). Authored 2026-07-17 from the Audit Anna reference build; hardened same day by a second run (Fold-in Frank).
**Steward:** **Audit Anna**, in her audit capacity (this is exactly the "AUTHORING new audit templates/DoDs" role in her profile — she owns, hardens, and edge-cases this doc as agents migrate).
**Companion spec:** `brain-config/specs/agent-folder-upgrade.md` (the why, Frank's verdict, Workshop read, open questions).
**Reference implementations:**
- `brain-config/agents/audit-anna/` — the BLOATED case (large profile, long changelog lifted out). Copy this for a heavy agent.
- `brain-config/agents/foldin-frank/` — the CLEAN FLAT-ONLY case (small `gate` agent, no prior folder). Copy this for the common agent. Also the first to surface the registry-absent edge case (§6).

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

## ⚠️ 1. The transition-mode rule (the guardrail that changed)

The upgrade spec assumed a **big-bang single-merge** (all ~27 agents flip in one atomic PR, main never mixed). Michael's 2026-07-17 direction supersedes that: migrate **incrementally, one agent (or a capable batch) per session, over the next few weeks.** That reversal has one hard consequence you MUST honor:

- **Agent-level half-migration stays FORBIDDEN.** An agent is never a folder while its flat `<slug>.md` twin is still live. Within one agent's migration it's all-or-nothing, in a single PR. Delete the flat files in the SAME PR that verifies the folder pointers live — never a commit apart.
- **Roster-level coexistence is now SANCTIONED** (this is the part that changed). During the transition the roster will hold some folder-agents and some flat-agents at once. That is NOT drift — it is an explicit, documented, time-boxed transitional state, made safe by dual-resolution below.

**Dual-resolution (the prerequisite that makes incremental safe):** every reader of an agent profile must resolve **folder-first, flat-fallback** — try `<slug>/profile.md`, fall back to `<slug>.md`. This applies to the AI Toolkit index pointers, `registry.json` consumers, `council.md`, cross-agent `Composes with` refs, and the viewer read paths (`index.html` / `tool-index.html` / `custom-tools.html`). Until dual-resolution is live everywhere, incremental migration is UNSAFE — see § Prerequisite.

> **Litmus:** at any commit on `main`, every agent is EITHER fully flat OR fully folder, and every pointer resolves both. No agent is ever caught mid-move. The mix is across the roster (allowed), never inside one agent (banned).

---

## 2. Prerequisite (ONE-TIME, before ANY further agent migrates on main)

Before agent #2 lands ON MAIN, dual-resolution must be live in the viewer read paths and the pointer conventions. This is the single build task gating the whole incremental run. Do it once, on its own PR:

- Viewer (`brain-config/index.html`, `tool-index.html`, `custom-tools.html`): read path tries `<slug>/profile.md`, falls back to `<slug>.md`. Same for `<slug>/metadata.json` vs `<slug>.metadata.json`.
- Document in `registry.json`'s generator that a `profile` field may point at either shape during transition; the generator resolves folder-first.
- AI Toolkit index trigger table + `council.md`: note the folder-first/flat-fallback convention once, at the top of the agent-pointer section, so every pointer inherits it without per-line edits.

Until this PR merges, the migrated agents (Anna, Frank) live ONLY on the `agent-folder-migration` branch as reference builds, with their flat twins still live as the fallback. **Do not merge a folder agent to main before the prerequisite lands.**

---

## 3. The per-agent recipe (the cold-open steps)

For a single `<slug>`, one branch, one PR. This is exactly what the Anna + Frank reference builds did.

**Batch-in-one-session (Michael, 2026-07-17):** a session with the capacity MAY migrate several agents in one PR. The one-agent-per-PR rule is the FLOOR, not a cap. But every agent in the batch must be INDIVIDUALLY complete inside that PR — folder built + pointers repointed + flat twin deleted, per agent. Never leave one member of a batch half-done to "finish next session." If capacity runs out mid-batch, finish the agent you're on, ship those, and leave the untouched ones fully flat. The unit of atomicity is the agent, whether you do 1 or 12.

### Pre-flight
1. Load `GitHub MCP — Operating Standard` (blob-API reads, branch→PR→self-merge, `.nojekyll`, VERSIONS ledger). Non-negotiable.
2. Confirm the prerequisite (§2) is live on main (or that you're working the reference branch). If neither, STOP — you're the wrong task.
3. `get_file_contents` on `brain-config/agents/` — get the current blob SHAs for `<slug>.md` and `<slug>.metadata.json`. Note whether a `<slug>/` folder ALREADY exists (six do: closing-clio, handoff-hana, memory-maggie, recon-renata, scout-sage, workshop-wes) and what it contains — you will PRESERVE that content, not clobber it.

### Read (byte-safe)
4. Fetch the FULL `<slug>.md` body via the **git blob API** (`.../git/blobs/<sha>`, Base64-decode) — NOT a branch/raw URL, which clips at ~30KB and flattens markup. Verify the returned SHA matches the listing. This is the source of truth for the rules diff.
5. Fetch `<slug>.metadata.json` the same way.

### Transform (storage-only — rules diff MUST be empty)
6. **`<slug>/profile.md`** = the flat body with EXACTLY two changes: (a) remove the `## Changelog` section, (b) append the footer line `*Version history: see `change-log.md` (sibling). Git holds the detailed diffs.*`. Nothing else moves. Front-matter, every rule, every section, verbatim — INCLUDING any em dashes or quirks; storage-only means you preserve the source even if it violates your own style. If you're tempted to "improve" anything — STOP, that's a separate audit pass, not this job.
7. **`<slug>/change-log.md`** = the extracted `## Changelog` content under a `# <Display Name> - Change Log` header + the standard one-liner (copy the shape from `foldin-frank/change-log.md`).
8. **`<slug>/metadata.json`** = the sidecar content, verbatim (including any `_note` field — see §6 registry-absent case).
9. Do NOT create `decision-log.md` or `memory.md`. Do NOT touch an existing `reports/` or other sub-content — leave it in place inside the folder.

### Repoint (every surface that names the agent by path)
10. `registry.json` — the `profile` field → `<slug>/profile.md`. **REGENERATE via its generator; never hand-edit.** (It's the sanctioned mirror-pair with the AI Toolkit index — reconcile both sides same-session.) **If the agent is ABSENT from registry.json** (see §6), the regen ADDS its row pointing at the folder — there's no existing field to repoint.
11. `council.md`, the AI Toolkit index trigger table, and every other profile's `Composes with` cross-ref that hard-codes `<slug>.md` → `<slug>/profile.md`. (With dual-resolution live, these keep resolving even before you touch them — but update them so the canonical pointer is the folder.)

### Verify, THEN delete (same PR)
12. Blob-read `<slug>/profile.md` back; confirm the rules diff vs the original flat body is EMPTY (only the Changelog removal + footer differ).
13. Confirm every repointed pointer resolves live.
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
- **Blob-API reads only** for file bodies; re-fetch fresh before any write; never reuse a carried-over SHA.
- **Never half-migrate an agent.** Folder + flat-deletion land together or not at all. (Batch OK; per-agent atomicity NOT.)
- **One agent per PR is the floor** during the incremental phase — a capable session may batch, but each agent is independently complete + revertible in the diff.

---

## 6. Edge cases found so far (Anna hardens this list as agents move)

- **Agent ABSENT from `registry.json`** (found on Fold-in Frank, 2026-07-17). Some live-in-git profiles were never registered — the index itself flags Breaker Beckett, Fold-in Frank, and Memory Maggie as stranded. Frank's `metadata.json` even carries a `_note`: "ABSENT from registry.json at backfill time. Add to the registry agents array on the S5 regen." **Handling:** there's no `profile` field to repoint — the regen must ADD the agent's row (pointing at `<slug>/profile.md`). Preserve the `_note` verbatim in the moved metadata; it's a live instruction to the registry regen, not migration cruft. Do NOT drop it.
- **Profile still over the 15KB target after the move.** Anna's `profile.md` lands ~16KB even with the changelog lifted out. The folder move is NOT guaranteed to get a bloated profile under target — that needs a real condense pass, which is a **separate, behavior-adjacent audit**, explicitly OUT of scope for this storage-only migration. Flag it, don't do it here.
- **Agents with an existing folder** (the six). Migrating them means dropping `profile.md`/`change-log.md`/`metadata.json` BESIDE existing content — `memory-maggie/` already holds `open-memory-request-protocol.md`; `recon-renata/` + `workshop-wes/` hold real `reports/*.json`; the other three (`closing-clio/`, `handoff-hana/`, `scout-sage/`) hold an empty `reports/` placeholder. Preserve every existing file; the migration only ADDS the standard set.
- **`workshop-wes` is retired** (tombstone in the roster). It still gets a folder for pointer resolution, but its profile stays as-is — don't revive it.

---

## 7. Stewardship

**Audit Anna owns this runbook.** When an agent's migration surfaces a new wrinkle (a nonstandard sidecar, a profile that won't split cleanly, a pointer nobody inventoried, an unregistered agent), Anna updates §6 and the affected step — that's her template-authoring role, not a Michael decision. The runbook is the single source of truth for the transition; if it and reality disagree, reality wins and Anna reconciles the doc.

---

*Authored 2026-07-17 from the Audit Anna reference build; hardened same day by the Fold-in Frank run. Companion to `agent-folder-upgrade.md`. Steward: Audit Anna.*
