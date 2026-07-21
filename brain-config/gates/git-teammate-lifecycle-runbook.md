# Git-Teammate Lifecycle Runbook — v0.1

> **What this is:** the single, cold-agent-executable procedure for bringing a git-teammate into
> existence and keeping it internally consistent. **Define → Build → Register → Verify.**
>
> **Executable by a COLD agent** with ZERO steward context. That is the whole design goal: any Brain
> session, following only this file + the docs it points at, can define a new teammate or migrate an
> existing one WITHOUT Fleet Felix present. If a step needs Felix's memory to complete, the step has
> failed — fix the step, not the agent.
>
> **Stewarded by Fleet Felix, owned by no persona.** This is a TOOL (Constitution §2–§3). Felix and
> every agent POINT at it; none store its steps. It POINTS at the existing law, never restates it:
> - How to BUILD one (founding law): `brain-config/gates/git-agent-authoring.md`
> - How to BE one (runtime): `brain-config/super-agents/_shared/super-agent-base.md`
> - Naming write-gate: `brain-config/gates/agent-name-collision-gate.md`
> - Structured fleet truth: `brain-config/super-agents/superagents.json` (SSOT) + `brain-config/registry.json` (manifest mirror)
> - Creation checklist + naming convention: the ClickUp Super Agent Creation & Setup Checklist.

---

## Scope

**In:** defining a net-new git-teammate's singular role; migrating an existing Council/Workshop lens
(`brain-config/agents/`) OR a native ClickUp Super Agent into a git-teammate; registering across the
mirror pair; verifying internal consistency (the git-teammate audit DoD).

**Out:** manually disabling/deleting a retired native ClickUp agent in the ClickUp UI (Michael's
step, irreversible, never automated). Building native full-standard agents (that's the native track).

**Two entry points, one spine.** Pick A or B, then run the shared **Build → Register → Verify** spine.

---

## A. DEFINE a net-new git-teammate (the Definition Playbook)

Run this BEFORE building when the agent does not exist yet. The output is a one-page definition that
feeds the Build spine. Do not skip to building — an undefined agent becomes a hat-pile.

1. **Name the singular job in one sentence.** If it needs "and" to describe the lane, it is two
   agents. Singularity is the bar (dense histories, thin hats). If unsure, STOP and float it to
   Felix / Fold-in Frank before proceeding.
2. **Prove it does not already exist.** Read `superagents.json` + `registry.json`; check for an
   existing agent whose lane overlaps. Overlap = fold into that agent or re-lane, do NOT create a
   twin (the Anna/Corey bloat anti-pattern). Route lane-overlap calls to Felix.
3. **Run the definition brainstorm (Workshop).** Answer, on the record (session task + the agent's
   future `decision-log.md`): what it DOES, what it explicitly does NOT do (lane boundaries against
   every neighbor), how it fits the team (who it hands off to / receives from), and its voice (must
   be distinct — no voice-bleed with an existing teammate).
4. **Name it (naming write-gate).** Apply the convention from the Creation Checklist (alliterative
   role-first; shared letters with the role = a singularity cue; dictation-proof). Run
   `gates/agent-name-collision-gate.md` across BOTH namespaces (live Super Agents + repo
   registry/sidecars), formal name AND nicknames (Routine Ricky lesson). Pick the **slug** now — it
   is **IMMUTABLE** forever after (Red Rhett lesson: a rename orphans files; only `display_name`
   may ever change).
5. **Hand the definition to the Build spine below.**

---

## B. MIGRATE an existing lens or native agent into a git-teammate

Run this when the capability already exists as a Council/Workshop lens (`agents/<slug>.md`) or a
native ClickUp Super Agent, and Michael wants it to become a session-invocable teammate WITH memory.

1. **Confirm the trigger + track.** Michael has said "make X a teammate / callable with memory."
   Confirm the SOURCE (lens vs native) — it changes what carries over (see step 3).
2. **Read the source in full.** The lens file OR the native config, plus its `registry.json` /
   `superagents.json` row. Deep read, not headlines. Do not migrate what you have not read.
3. **Decide what carries vs converts:**
   - **Personality / voice / lane** → carries into `preferences.md` (the profile).
   - **Any PROCEDURE / how-to / routine in the source** → does NOT carry into the agent. It becomes
     (or points at) a TOOL — hook / gate / skill / reference doc (Constitution §2–§3). A lens that
     embedded steps gets those steps extracted to a tool the new teammate STEWARDS, not stores.
   - **Accumulated context** → seeds `memory.md` (relational/context only, never process).
   - **Native only:** the live config's TRIGGER scaffolding (schedules, task-assignment firing) is
     LOST — confirm Michael waives it (git-teammates have no autonomous triggers). The cognitive role
     is fully git-portable; only the trigger scaffolding is not.
4. **Slug discipline.** Reuse the existing slug if one exists and is clean; if renaming the display
   name, the slug still does NOT change. New slug only if there was none. Immutable from here.
5. **Hand to the Build spine below.** For a lens, the old `agents/<slug>.md` becomes a redirect
   tombstone (do not delete — it may be an invocation target; point it at the new home). For a
   native, the row stays listed tagged appropriately; Michael disables the live agent in the UI.

---

## SHARED SPINE — Build → Register → Verify

### 1. BUILD (the 5-file bundle)

Create `brain-config/super-agents/<slug>/` with the full bundle per
`_shared/super-agent-base.md` → "File set". Author to the authoring gate
(`gates/git-agent-authoring.md`); this runbook does not restate those rules.

- `preferences.md` — opens with the one-line base pointer, then identity + voice + lane + load
  manifest. Behavior/personality ONLY, no how-to.
- `memory.md` — accumulated context + how-Michael-works + pointers to stewarded tools. Not process.
- `activity-log.md` — rolling condensed session ledger, newest on top, append-only.
- `decision-log.md` — reasoning about the AGENT ITSELF (why it is shaped this way).
- `README.md` — pointer/steward metadata only; NEVER mirror superagents.json fields.

Revision history = git + PR descriptions. No inline changelog in `preferences.md`.

### 2. REGISTER (the mirror pair — all surfaces, same session)

The mirror-pair mandate is LOCKED: touch one surface, reconcile all in the SAME session, or it is
drift. Register across:

1. `super-agents/superagents.json` — the SSOT row: slug, display_name, track (`git-teammate`),
   status (`active`), invocation (`/session.agent=<Name>`), lane, declaration_folder, notes.
2. `brain-config/registry.json` — the manifest mirror row (type `git-teammate`).
3. The **AI Toolkit index** (ClickUp doc) — roster + the Quick-Scan trigger-table row (the hot-path
   surface Brain reads every pass). This is a ClickUp-doc edit, not a git edit — do it or explicitly
   surface it; never drop it silently.

A retired agent stays LISTED on every surface, tagged retired — never silently dropped.

### 3. VERIFY (the git-teammate audit DoD — v0.1, authored here per Anna's meta-finding)

Git-teammates have **no live config to diff**, so the native live-vs-declared mirror test does NOT
apply. The bar is **INTERNAL CONSISTENCY**: will a cold `/session.agent=<Name>` load a coherent,
non-contradictory agent? Walk each check, classify PASS / PARTIAL / GAP:

1. **Base pointer present** — `preferences.md` opens with the `_shared/super-agent-base.md` pointer line.
2. **Load manifest valid** — the manifest lists real, present files in load order; deep-steep default.
3. **superagents.json row accurate** — slug/track/status/invocation/lane match reality; `last_audit`
   + standard version stamped.
4. **registry.json row present + agreeing** — no contradiction with superagents.json.
5. **Bundle files present + in-format** — all five exist; each holds ONLY its kind (no procedure in
   memory; no metadata mirrored into folder files; no topic-decisions in the agent's decision-log).
6. **No cross-file contradiction** — memory.md, preferences.md, and the manifests tell ONE story.
   (The classic miss: a stripped role still asserted in memory. This is the highest-value check.)
7. **Voice is distinct** — self-announce header + tone do not bleed into another teammate.
8. **Index mirror fresh** — the AI Toolkit roster/trigger row matches the JSON.

Record the result as a dated audit file under `super-agents/<slug>/audits/<slug>.<YYYY-MM-DD>.md`
via PR. Ledger stays open while any GAP/PARTIAL is unresolved. (Graduation follow-up: promote this
DoD into `super-agents/audit-instruction.md` as the formal git-teammate track alongside the native
v1.0 checklist — Anna + Felix.)

---

## Acceptance test for THIS runbook (the cold-start proof)

The runbook is only real if a context-free agent can run it. **Standing test: migrating Audit Anna**
(lens → git-teammate) by a cold agent following ONLY this file passes end to end — defines nothing
from Felix's head, orphans no files, lands registered across the mirror pair, and clears the Verify
DoD. A stall that requires steward context = a runbook bug to fix here.

---

## Changelog

- v0.1 (2026-07-20) — created. Merges the Definition Playbook (net-new) + Migration Runbook
  (convert) onto one Build→Register→Verify spine; authored the git-teammate audit DoD inline
  (closes Anna's meta-finding that audit-instruction.md v1.0 is native-only). Workshop-passed
  (Frank NET-NEW + fold-in constraint; 7 lenses). Detailed history lives in git.
