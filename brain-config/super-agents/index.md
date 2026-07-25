# Agent Roster Index

> **The combined roster is the whole fleet, in two tiers, in ONE file (renamed 2026-07-24):**
> - **Data (edit here):** [`roster.json`](./roster.json) — the canonical machine-readable record of the ENTIRE fleet. TWO CLASSES in one file: `agents` (git-teammates + native/task-specific + retired) and `council_lenses` (the ephemeral Council/Workshop lenses). Every structured fact — identity, class, track, status, invocation token, lane, `graduated_from` lineage — lives here.
> - **Pretty view:** [`roster.html`](./roster.html) — renders `roster.json` in two tiers (Teammates / Council Lenses); holds no data of its own.
>
> Renamed from `superagents.json` / `index.html` on 2026-07-24 (the old name only covered teammates and undersold what the file is). Redirect stubs are left at the old paths and will fail loud rather than serve stale. Do **not** keep a duplicate table here or anywhere else — this page is a pointer only.

## 🚨 REGISTRATION BLOCKED — `roster.json` has outgrown a safe whole-file edit (2026-07-25)

**`roster.json` (~25KB) cannot currently be read back whole by ANY available read path**, so it cannot be safely rewritten — and because `create_or_update_file` needs the complete file body, **new-agent registration into the roster is blocked.**

- Blob API (the trustworthy path): base64 encoding inflates ~25KB to ~33KB, past the ~30KB per-fetch cap → truncates.
- Raw fetch: also truncated, and it's cache-unreliable besides.
- Rewriting from a truncated read means reconstructing the tail from inference. That is the exact regression class the read-body ladder exists to prevent. **Do not do it.**

**Currently unregistered:** `dev-dexter` (Dev Dexter, built 2026-07-25 — full bundle exists at `dev-dexter/`, reachable only via the AI Toolkit index trigger row, NOT via Agent-Invocation-Gate STEP 0 roster resolution).

**Proposed fix (queued on the Fleet Build Queue, not yet executed):** split `roster.json` by class (e.g. `roster.agents.json` + `roster.lenses.json`, with `roster.html` reading both) so every canonical lookup file sits comfortably under the safe single-pass read cap. Alternative: Michael pastes the roster via the GitHub UI (the byte-safe path for over-cap files).

**The generalized lesson:** a file that cannot be read whole cannot be safely edited — **size is a correctness constraint, not a tidiness preference.** Seat Size Sally before a canonical data file grows, not after it blocks a build. This is the second file in the fleet to hit this wall (`registry.json` at ~29KB was already awaiting clean regeneration).

## 🟰 The two tiers are STORAGE, not a hierarchy (LOCKED 2026-07-24, Michael)

**Read this before you read the roster.** "Agent" and "super agent" are converging into one term.
A super-agent IS a lens; anyone on the super-agent team can also sit on the agent team, and
**Maestro Mira works with both identically** — she seats by LANE, never by tier.

- **`class` means PERSISTENCE, not status.** A teammate carries a memory bundle across sessions; a
  lens is stateless. That is a fact about whether a voice remembers yesterday. It is NOT seniority,
  authority, or speaking order. **If you read the two tiers as a ladder, that's drift.**
- **The tiers exist because one class has files and the other doesn't** — nothing more. That is
  exactly why they are indexed together in ONE record.
- **The one place class binds:** a bare `/session.agent=<Name>` needs a bundle to inhabit, so only a
  teammate can be worn for a whole session. That constrains INHABITING, not being seated, heard, or
  weighted. Any voice on this roster can speak AS ITSELF at full volume.
- **Graduation lens → teammate has exactly one justification: the voice needs MEMORY.** Not stature,
  not seating frequency. Promoting for standing alone is how a fleet bloats with bundles nobody needed.

Governing text: `_shared/super-agent-base.md` (Constitution §6) + `../orchestration.md` (Class Parity).
Provenance: Fleet Build Queue Decision Log J1.

## Why one combined roster

The fleet is two trees of the same roster, and Felix stewards both:
- **`super-agents/<slug>/`** = persistent **git-teammates** (full bundle, session-invocable via `/session.agent=<Name>`, hold memory across sessions).
- **`brain-config/agents/<slug>.md`** = ephemeral **Council/Workshop lenses** (stateless processing verbs, NOT session-invocable as standing personas — no bundle to inhabit).

Three names — **Anna, Mira, Wes** — graduated lens → teammate; their `agents/` files are tombstones and the live home is `super-agents/`. The roster draws that lineage with `graduated_from`.

## Invocation is roster-first (the enforcement)

Any `/agent-name`, bare name, or nickname resolves against `roster.json` FIRST — see `brain-config/gates/agent-invocation-gate.md` **STEP 0**. The gate reads the roster as data, resolves token → slug + class + bundle, and loads that agent's home directly. **No double-hop:** a named call reaches the agent directly; it does not forward through Felix (the steward) or Mira (the switchboard). Reading the roster is not invoking Felix.

⚠️ Corollary of the registration block above: an agent whose row is missing from `roster.json` **cannot be resolved by STEP 0**, no matter how complete its bundle is. Registration is not paperwork — it is the wiring.

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

- 2026-07-25: **Dev Dexter (`dev-dexter`) built** — Build & Engineering Lead teammate (architecture + code quality with memory, writes code, review folded in; seated through Mira). Bundle complete at `dev-dexter/`. **Roster row NOT written** — see the REGISTRATION BLOCKED section above; the read-cap wall was hit for the first time on a live registration and is now the fleet's top structural bug. Provenance: Fleet Build Queue Decision Log Q1/Q2/Q3 + `dev-dexter/decision-log.md` D1–D5.
- 2026-07-24: **Class parity.** Added the "two tiers are STORAGE, not a hierarchy" section — `class` means persistence (holds a memory bundle), never rank; Mira seats by lane, not tier; graduation requires exactly one justification (the voice needs MEMORY). Michael's ruling, Fleet Build Queue Decision Log J1. Governing text lives in `_shared/super-agent-base.md` §6 + `orchestration.md`; this page points, never restates. ⚠️ Still pending: `roster.json`'s `$schema_note` and `registry.json` both describe the two classes without the parity framing — both need the note folded in on their next clean regeneration.
- 2026-07-24: **Combined roster.** `superagents.json` → `roster.json` (renamed + expanded to hold BOTH classes: added the `council_lenses` tier with full rows + `graduated_from` lineage on migrated teammates + the `invocation_resolution` token map). `index.html` → `roster.html` (two-tier renderer). Wired to the Agent Invocation Gate STEP 0 (roster-first resolution). Redirect stubs left at the old paths. `registry.json` left for clean regeneration (generated artifact).
- 2026-07-21: noted the two audit tracks + corrected the git-teammate file model (preferences is canonical for a teammate, not a live-config mirror; added memory/decision-log to the structure). Prompted by a Beckett doc-drift flag.
- 2026-07-15: index split into `superagents.json` (data) + `index.html` (renderer); this file reduced to a pointer.
- 2026-07-15: fleet index created in Git (moved off ClickUp).
