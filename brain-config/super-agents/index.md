# Agent Roster Index

> **The combined roster is the whole fleet, in two tiers, in ONE file (renamed 2026-07-24):**
> - **Data (edit here):** [`roster.json`](./roster.json) — the canonical machine-readable record of the ENTIRE fleet. TWO CLASSES in one file: `agents` (git-teammates + native/task-specific + retired) and `council_lenses` (the ephemeral Council/Workshop lenses). Every structured fact — identity, class, track, status, invocation token, lane, `graduated_from` lineage — lives here.
> - **Pretty view:** [`roster.html`](./roster.html) — renders `roster.json` in two tiers (Teammates / Council Lenses); holds no data of its own.
>
> Renamed from `superagents.json` / `index.html` on 2026-07-24 (the old name only covered teammates and undersold what the file is). Redirect stubs are left at the old paths and will fail loud rather than serve stale. Do **not** keep a duplicate table here or anywhere else — this page is a pointer only.

## Why one combined roster

The fleet is two trees of the same roster, and Felix stewards both:
- **`super-agents/<slug>/`** = persistent **git-teammates** (full bundle, session-invocable via `/session.agent=<Name>`, hold memory across sessions).
- **`brain-config/agents/<slug>.md`** = ephemeral **Council/Workshop lenses** (stateless processing verbs, NOT session-invocable as standing personas).

Three names — **Anna, Mira, Wes** — graduated lens → teammate; their `agents/` files are tombstones and the live home is `super-agents/`. The roster draws that lineage with `graduated_from`.

## Invocation is roster-first (the enforcement)

Any `/agent-name`, bare name, or nickname resolves against `roster.json` FIRST — see `brain-config/gates/agent-invocation-gate.md` **STEP 0**. The gate reads the roster as data, resolves token → slug + class + bundle, and loads that agent's home directly. **No double-hop:** a named call reaches the agent directly; it does not forward through Felix (the steward) or Mira (the switchboard). Reading the roster is not invoking Felix.

**Audit workflow:** `brain-config/super-agents/audit-instruction.md` — holds BOTH tracks: **native full-standard** (live-vs-declared mirror audit) and **git-teammate** (internal-consistency DoD). Per-agent declarations live in `brain-config/super-agents/<slug>/`.

## Structure

```
brain-config/super-agents/
  roster.json                  # DATA: the combined full-fleet roster (both classes) — hand-edit this
  roster.html                  # VIEW: renders roster.json in two tiers
  index.md                     # this pointer
  superagents.json             # REDIRECT STUB (renamed -> roster.json 2026-07-24)
  index.html                   # REDIRECT STUB (renamed -> roster.html 2026-07-24)
  audit-instruction.md         # the audit standard (native + git-teammate tracks)
  <slug>/                      # per git-teammate bundle
    README.md                  # steward pointer metadata (never mirror roster.json fields)
    preferences.md             # NATIVE: verbatim mirror of live config. GIT-TEAMMATE: canonical profile.
    memory.md                  # git-teammate: accumulated context + tool pointers
    activity-log.md            # rolling session ledger (append-only)
    decision-log.md            # git-teammate: reasoning about the agent itself
    audits/<slug>.<date>.md    # dated audit records (one per audit, via PR)
```

The council lenses themselves live at `brain-config/agents/<slug>.md`; the roster's `council_lenses` rows point at them. Full lens profiles + the exhaustive changelog live in `registry.json` (the generated manifest mirror) + git history — the roster does not restate them.

## Changelog

- 2026-07-24: **Combined roster.** `superagents.json` → `roster.json` (renamed + expanded to hold BOTH classes: added the `council_lenses` tier with full rows + `graduated_from` lineage on migrated teammates + the `invocation_resolution` token map). `index.html` → `roster.html` (two-tier renderer). Wired to the Agent Invocation Gate STEP 0 (roster-first resolution). Redirect stubs left at the old paths. `registry.json` left for clean regeneration (generated artifact).
- 2026-07-21: noted the two audit tracks + corrected the git-teammate file model (preferences is canonical for a teammate, not a live-config mirror; added memory/decision-log to the structure). Prompted by a Beckett doc-drift flag.
- 2026-07-15: index split into `superagents.json` (data) + `index.html` (renderer); this file reduced to a pointer.
- 2026-07-15: fleet index created in Git (moved off ClickUp).
