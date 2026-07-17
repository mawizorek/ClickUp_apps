# Agent Folder Upgrade — SPEC (proposal, NOT built)

**Status:** SPEC ONLY — nothing built. Authored 2026-07-17 for handoff to a clean agent session.
**Author:** Brain (Opus 4.8), with Workshop (6 lenses) + Fold-in Frank.
**Origin:** Michael — after Audit Anna's profile ballooned to ~35KB across one session, single-file agent profiles proved fragile. Proposal: promote each agent from a standalone `.md` to a **folder keyed by slug** holding a standard working document set.

---

## The proposal (Michael's framing)

Each agent becomes a folder named by its slug, containing an identical file set:

- **Preferences** — the agent's behavioral profile (what `<slug>.md` is today).
- **Decision log** — decisions about the agent itself (inverted-polarity Gold Standard), the thing Anna's evolution had nowhere to live.
- **Change log** — the version history (what the bloated in-file changelog should have been).
- **Memory file** — durable agent memory, mirroring ClickUp's Super Agent memory-file direction.

Each agent gets a working set of documents instead of one overloaded file.

---

## 🧩 Fold-in Frank verdict: **FOLD-IN / PARTIALLY-EXISTS → formalize, don't invent**

This is NOT net-new. The pattern has already started informally:
- Several agents ALREADY have slug folders in `brain-config/agents/` (`closing-clio/`, `handoff-hana/`, `memory-maggie/`, `recon-renata/`, `scout-sage/`, `workshop-wes/`).
- `closing-clio/` already contains a `reports/` subfolder — so "agent folder with working docs" is a live, undocumented convention.
- The **Decision Logs Gold Standard** and **Change log** patterns already exist workspace-wide; this just gives each agent its own instance.
- `registry.json` + `metadata.json` sidecars already hold per-agent structured data.

**Frank's ruling:** formalize and standardize the folder pattern that's already half-adopted; do NOT design a brand-new system. The work is (a) a canonical folder skeleton, (b) migrating the ~24 flat profiles into it, (c) updating every pointer. Merge candidate: the existing `reports/` subfolders fold into the standard skeleton rather than living as ad-hoc.

---

## 🛠️ The Workshop (6 lenses)

- **Risk Rhys (failure/risk):** the migration itself is the risk — ~24 agents × pointer updates (`registry.json`, `council.md`, the AI Toolkit index, cross-agent `Composes with` refs, the viewer's read paths). A half-done migration where some agents are folders and some are files is worse than either end state. Mitigation: migrate ALL in one pass, or add a resolver that accepts both `<slug>.md` and `<slug>/preferences.md`. Also: the loader must know which file IS the profile — define the canonical entry filename and never rename it.
- **Clever Cleo (elegance/alternative):** the elegant unlock is that **preferences becomes the ONLY file an agent must load to embody itself**, while decision-log / change-log / memory are load-on-demand. That directly fixes the Anna problem: the profile stays lean because history + memory move OUT to sibling files, not deleted. The folder is what makes "condense the profile" sustainable instead of a recurring fight.
- **Polish Polly (quality/standards):** needs a `_template-agent/` skeleton (mirroring the existing `_template.md` + `_template-tool/`) so every folder is identical. Canonical filenames must be fixed and boring: `preferences.md`, `decision-log.md`, `change-log.md`, `memory.md`. A `README.md` per folder is optional sprawl — skip it; the preferences file's header self-describes.
- **Feasible Finn (can we build it):** very feasible, purely mechanical. Phase it: (1) author the skeleton + write the migration convention; (2) migrate ONE agent end-to-end as the reference (Anna is the obvious pilot — she's the one who needed it); (3) batch-migrate the rest; (4) update the manifest generator + viewer read paths; (5) delete the flat files only after pointers verify. Blob-API reads + PR-per-batch keep it safe.
- **Scope Skye (boundaries/creep):** hard scope line — this is a STORAGE reorg, not a behavior change. No agent's rules change during migration; bytes move, behavior is identical. Resist the urge to "improve" profiles mid-migration (that's a separate audit pass per agent, Anna's job later). One creep risk: not every agent needs a memory file on day one — create the folder + preferences + change-log for all, but let decision-log and memory be created-on-first-use (like the Decision Log auto-create rule) rather than 24 empty stubs.
- **Eco Enzo (integration/side-effects):** the blast radius is every surface that references an agent by path. Inventory before touching: `registry.json` (`profile` field → repoint to `<slug>/preferences.md`), `council.md`, `brain-config/index.html` + `tool-index.html` + `custom-tools.html` (viewer read paths), the AI Toolkit index trigger table (points at `brain-config/agents/<slug>.md`), and every profile's `Composes with` cross-refs. The metadata sidecars (`<slug>.metadata.json`) should move INTO the folder too (`<slug>/metadata.json`). Memory files must NOT duplicate brain-memory — define the boundary (agent-memory = agent-specific durable notes; brain-memory = global). 

---

## Proposed canonical skeleton

```
brain-config/agents/<slug>/
  preferences.md      # the profile (was <slug>.md). The ONE file to embody the agent. Kept LEAN.
  change-log.md       # version history (was the in-file changelog)
  decision-log.md     # decisions about the agent (Gold Standard, inverted polarity) — created on first use
  memory.md           # durable agent-specific memory (Super Agent memory-file style) — created on first use
  metadata.json       # the sidecar, moved in from <slug>.metadata.json
  reports/            # (agents that produce reports, e.g. closing-clio) — already exists for some
```

**Canonical entry file = `preferences.md`.** Loaders/pointers resolve `<slug>/preferences.md`. `_template-agent/` holds the empty skeleton.

---

## Open questions for Michael (resolve before build)

1. **Entry filename:** `preferences.md` (Michael's term) vs `profile.md` vs keep `<slug>.md` inside the folder? (Spec assumes `preferences.md`.)
2. **Memory boundary:** what lives in agent `memory.md` vs the global brain-memory / Extended Memory? Needs a one-line rule so they don't drift into duplication.
3. **Empty stubs vs create-on-use:** create all four files for every agent now, or (Scope Skye's rec) only preferences + change-log up front, decision-log + memory on first use?
4. **Big-bang vs dual-resolver:** migrate all ~24 in one PR, or ship a resolver that accepts both flat + folder and migrate gradually? (Rhys prefers all-at-once; Finn is fine either way.)
5. **Council/Workshop lenses too?** They're agents in `registry.json` but very small — do the tiny lens profiles earn a full folder, or stay flat until they grow? (Possible rule: folder-on-demand when a profile crosses a size line.)

---

## Definition of done (when built)

- `_template-agent/` skeleton exists.
- Every migrated agent resolves via `<slug>/preferences.md`; no dead pointers in `registry.json`, `council.md`, the AI Toolkit index, or the viewer.
- `registry.json` `profile` fields repointed; regenerated, not hand-edited.
- Flat `<slug>.md` + `<slug>.metadata.json` removed only after pointers verify.
- Anna migrated first as the reference implementation; her change-log + (future) decision-log now live as siblings so `preferences.md` stays lean.
- No agent's BEHAVIOR changed by the migration (storage-only; verify a diff of rules = empty).

---

*Spec authored 2026-07-17. Not built. Handoff prompt delivered to Michael for a clean agent session.*
