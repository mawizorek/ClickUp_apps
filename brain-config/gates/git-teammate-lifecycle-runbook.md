# Git-Teammate Lifecycle Runbook — v0.6

> **What this is:** the single, cold-agent-executable procedure for bringing a git-teammate into
> existence and keeping it internally consistent. **Define → Build → Register → Verify.**
>
> **Why-history, every live run, and the changelog:**
> [`git-teammate-lifecycle-runbook.notes.md`](./git-teammate-lifecycle-runbook.notes.md). 🔴 **Read the
> SIXTH run before you build anything** — the last agent built off a neighbouring bundle instead of
> this file and still scored 8 of 9, which is the finding, not the excuse.
>
> **Executable by a COLD agent** with ZERO steward context. That is the whole design goal: any Brain
> session, following only this file + the docs it points at, can define a new teammate or migrate an
> existing one WITHOUT Fleet Felix present. If a step needs Felix's memory to complete, the step has
> failed — fix the step, not the agent. ⚠️ **Five runs proved a cold agent CAN execute this. The sixth
> proved nothing MAKES it.** Reaching for the file is the unsolved half.
>
> ⚠️ **SCOPE CORRECTED 2026-07-30: cold-start no longer means "git alone."** Resolution and
> registration live in a **ClickUp list** (see REGISTER), so a cold agent needs BOTH git and ClickUp to
> run this end to end. Not a regression — Brain has always had ClickUp. What the property actually
> guarantees is **no STEWARD context required**, and that still holds.
>
> **Stewarded by Fleet Felix, owned by no persona.** This is a TOOL (Constitution §2–§3). Felix and
> every agent POINT at it; none store its steps. It POINTS at the existing law, never restates it:
> - How to BUILD one (founding law): `brain-config/gates/git-agent-authoring.md`
> - How to BE one (runtime): `brain-config/super-agents/_shared/super-agent-base.md`
> - How to AUDIT one (the git-teammate audit DoD): `brain-config/super-agents/audit-instruction.md` → git-teammate track
> - Naming write-gate: `brain-config/gates/agent-name-collision-gate.md`
> - **Structured fleet truth: the ClickUp list 🤖 Agent Index — https://app.clickup.com/36074068/v/li/901328043244 (list id `901328043244`). One task per agent.** ~~`roster.json`~~ · ~~`roster.html`~~ · ~~`superagents.json`~~ · ~~`registry.json`~~ — **FOUR retired manifests. There is no file, and there is no pair.**
> - Creation checklist + naming convention: the ClickUp Super Agent Creation & Setup Checklist.
>
> ⚠️ **POINTERS HERE CARRY NO VERSION NUMBERS, DELIBERATELY (locked 2026-07-28).** A pointer that
> names a version becomes wrong the moment the target is bumped, and it looks authoritative the whole
> time. This file pointed at the audit DoD as "v0.1" for three days after it went v0.2. **Cite the
> file and the section; never the version.** The target states its own version.

---

## Scope

**In:** defining a net-new git-teammate's singular role; migrating an existing Council/Workshop lens
(`brain-config/agents/`) OR a native ClickUp Super Agent into a git-teammate; registering it; verifying
internal consistency (the git-teammate audit DoD, defined in `audit-instruction.md`).

**Out:** deleting anything (Michael's step, irreversible, never automated — **an agent cannot delete
a task or a list**). Building native full-standard agents (that's the native track).

> ⚠️ **As of 2026-07-26 there are NO native ClickUp agents in the workspace** (`search_agents` sweep,
> PR #547). Entry B's native path is **dormant** — real procedure, zero current subjects. Every live
> agent is a git-teammate. Kept, not deleted; the class may return.

**Two entry points, one spine.** Pick A or B, then run the shared **Build → Register → Verify** spine.

---

## A. DEFINE a net-new git-teammate (the Definition Playbook)

Run this BEFORE building when the agent does not exist yet. The output is a one-page definition that
feeds the Build spine. Do not skip to building — an undefined agent becomes a hat-pile.

1. **Name the singular job in one sentence.** If it needs "and" to describe the lane, it is two
   agents. Singularity is the bar (dense histories, thin hats). If unsure, STOP and float it to
   Felix / Fold-in Frank before proceeding.
2. **Prove it does not already exist.** Query the **Agent Index** (every agent, every class, one
   list) and check for an existing agent whose lane overlaps. Overlap = fold into that agent or
   re-lane, do NOT create a twin (the Anna/Corey bloat anti-pattern). Route lane-overlap calls to
   Felix. **A near-miss is the normal outcome, not the exception** — the fleet is dense enough that
   most "new agent" asks are an existing lane described in different words.
   > 💡 **The reserved-lane case (Tutor Tate, 2026-07-30):** an overlap check can also come back
   > *"another agent's profile already NAMES this future teammate."* That is neither a twin nor
   > net-new sprawl — it is a **held seat**, and it is the strongest possible green light. Read the
   > naming profile for the boundary it already drew, and honour it.
3. **Run the definition brainstorm (Workshop).** Answer, on the record (session task + the agent's
   future `decision-log.md`): what it DOES, what it explicitly does NOT do (lane boundaries against
   every neighbor), how it fits the team (who it hands off to / receives from), and its voice (must
   be distinct — no voice-bleed with an existing teammate).
4. **Name it (naming write-gate).** Apply the convention from the Creation Checklist (alliterative
   role-first; shared letters with the role = a singularity cue; dictation-proof). Run
   `gates/agent-name-collision-gate.md` across the Index (names + `Slug` + `AKA`, **including retired
   rows**), formal name AND nicknames weighted equally (Routine Ricky lesson). **Scan for an UNUSED
   INITIAL first, then pick a role word that fits it** — faster than testing themed candidates, and
   collision-free by construction (Tutor Tate precedent). Pick the **slug** now — it is **IMMUTABLE**
   forever after (Red Rhett lesson: a rename orphans files; only the display name may ever change).
   **An UNBUILT agent's name is not locked yet** — a near-miss on one may be a RENAME rather than a
   slip, so ask before authoring (Rocky/Ricky, 07-26).
5. **Pick the SUPPLEMENT before building.** 📦 Three exist and the test is **PORTABILITY, not subject
   matter** (base spec §7): `_shared/department-head-base.md` (craft, travels) ·
   `_shared/designer-base.md` (design intent, travels) · `_shared/house-layer-base.md` (organization,
   does NOT travel — seventh field, the org binding). 🚫 **No hybrid across the portability line.**
   ⚠️ **Four rows were built against the wrong supplement in 2026-09 because the right one did not
   exist yet** — when several builds make the same "wrong" choice, check whether the right choice was
   AVAILABLE before correcting the builders.
6. **Hand the definition to the Build spine below.**

---

## B. MIGRATE an existing lens or native agent into a git-teammate

Run this when the capability already exists as a Council/Workshop lens (`agents/<slug>.md`) or a
native ClickUp Super Agent, and Michael wants it to become a session-invocable teammate WITH memory.

0. **Justify the graduation (Constitution §6).** A lens becomes a teammate for exactly ONE reason:
   **it needs MEMORY.** Not standing, not how often it is seated. Sharpest tell: a lens that ALREADY
   maintains durable state on disk between sessions is a teammate in a lens costume, re-deriving its
   own history cold every run. If you cannot name what it will remember, do not migrate it.
1. **Confirm the trigger + track.** Michael has said "make X a teammate / callable with memory."
   Confirm the SOURCE (lens vs native) — it changes what carries over (see step 3).
2. **Read the source in full.** The lens file OR the native config, plus its Agent Index row. Deep
   read, not headlines. Do not migrate what you have not read.
3. **Decide what carries vs converts:**
   - **Personality / voice / lane** → carries into `preferences.md` (the profile).
   - **Any PROCEDURE / how-to / routine in the source** → does NOT carry into the agent. It becomes
     (or points at) a TOOL — hook / gate / skill / reference doc (Constitution §2–§3). A lens that
     embedded steps gets those steps extracted to a tool the new teammate STEWARDS, not stores.
     **Do not invent a tool path to point at.** If the routine has no home yet, AUTHOR the tool in
     the same pass or point at the house equivalent — a confident pointer into a file that does not
     exist is worse than no pointer (caught on the Memory Maggie graduation, 2026-07-25).
   - **A signature OUTPUT FORMAT still in personal-practice** (not yet a blessed template) → keep a
     CONDENSED pointer/description in `preferences.md` (adjacent to voice, as output-style) until
     Michael graduates it to a stewarded reference doc. Do NOT force-promote an incubating format
     into a tool prematurely, and do NOT restate its full spec in the profile. *(Surfaced by the
     Audit Anna migration, whose Closing Report was exactly this case.)*
   - **Accumulated context** → seeds `memory.md` (relational/context only, never process). **Label
     every seeded line INHERITED, not earned**, so the agent's first real session replaces
     reconstruction with lived context rather than trusting it (Dexter/Maggie convention).
     **Leave the ledger that JUSTIFIED the graduation deliberately EMPTY** — seeding invented entries
     into the one thing that proves the agent needs memory defeats the point (Fiona, Ricky, Tate).
   - **A tool that lives under `agents/<slug>/`** (a sidecar folder named after the lens) does NOT
     have to move with the agent. It is a tool path, not the agent's home, and live pointers resolve
     to it. Move it only on a pass that can repoint every reference in the same commit.
   - **Native only (dormant — see Scope):** the live config's TRIGGER scaffolding (schedules,
     task-assignment firing) is LOST — confirm Michael waives it (git-teammates have no autonomous
     triggers). The cognitive role is fully git-portable; only the trigger scaffolding is not.
     **Lens exception:** a lens whose auto-fire was an AI Toolkit index-trigger ROW (a house tool,
     never agent-stored) CAN carry — repoint that row to embody the new teammate. ⚠️ **A stub waiting
     forever on an input nobody will supply is not a blocker, it is rot wearing a blocker's clothes** —
     Fiona sat ten days on "paste the live native config verbatim" for a native that did not exist.
     Build fresh instead.
4. **Slug discipline.** Reuse the existing slug if one exists and is clean; if renaming the display
   name, the slug still does NOT change. New slug only if there was none. Immutable from here.
   **After a rename, re-check whether the immutable slug still contains the freed token** (Fiona's
   `fmp-frank` slug still contained the word her rename released, 07-26).
5. **Hand to the Build spine below.** For a lens, the old `agents/<slug>.md` becomes a redirect
   tombstone (do not delete — it may be an invocation target; point it at the new home). For a
   native, the row stays listed tagged appropriately.

---

## SHARED SPINE — Build → Register → Verify

### 1. BUILD (the bundle)

Create `brain-config/super-agents/<slug>/` with the full bundle per
`_shared/super-agent-base.md` → "File set". Author to the authoring gate
(`gates/git-agent-authoring.md`); this runbook does not restate those rules.

- `preferences.md` — opens with the one-line base pointer, then identity + voice + lane + load
  manifest. Behavior/personality ONLY, no how-to. Include the agent's **self-announce header** (it is
  identity, and Universal Mandate 1 requires one). (An incubating signature output-format may live
  here as a condensed pointer per B.3.)
- `memory.md` — accumulated context + how-Michael-works + pointers to stewarded tools. Not process.
- `decision-log.md` — reasoning about the AGENT ITSELF (why it is shaped this way). **D1 = the
  retirement condition. BLOCKING — no D1, no ship.**
- `README.md` — pointer/steward metadata only; **NEVER mirror Agent Index fields**.

🔴 **NO `activity-log.md`. THE LOG IS NOT A FILE (LAW 2026-09-20).** ~~rolling condensed session
ledger, newest on top, append-only~~ **STRUCK.** A new bundle ships **no writable git log, not even a
stub** — activity is comments on the agent's 🤖 Agent Index row, with **LIVE STATE in the row
description**. Governing: `hooks/activity-log-clickup-native.md` §1; runtime summary: base spec §4b.
⚠️ **Vellum Victoria shipped with one anyway on 2026-09-20, thirteen days after the shape was retired,
because the builder copied a neighbour's bundle instead of reading the law** (her `decision-log.md` D8).

Revision history = git + PR descriptions. No inline changelog in `preferences.md`.

### 2. REGISTER (the Index — ONE surface, not two)

**Registration is the WIRING, not paperwork. An unregistered agent CANNOT BE RESOLVED, no matter how
complete its bundle is.**

1. **The ClickUp 🤖 Agent Index — https://app.clickup.com/36074068/v/li/901328043244 (list id `901328043244`).** Create ONE task,
   named with the agent's display name. Fill: `Slug` (immutable) · `Class`
   (`super-agent` | `agent` | `task-specific` | `retired` — **persistence, never rank**) ·
   `Memory` · `Invoke` (`/session.agent=<Name>`) · `AKA` · `Home` (the repo path to the bundle) ·
   `Sort Index`. Add `default_runbook` + `Gate Strength` **only** if it has a bare-name default —
   ⚠️ these are read on every bare-name call and are **not decoration** (emptying them silently
   un-guards a read-only door). Set the native status.
   **A graduation is a field flip, not a new row** — that is why one list holds every class.
   > 🔴 **WRITE THE `Lane`, AND WRITE IT WELL (2026-09-21).** It was previously "only if there is no
   > home file." Since the Toolkit trigger row was struck (step 2), **`Lane` is the only text an
   > UNROUTED ask can match on** — Mira is the default front door for any substantive request with no
   > agent named, and she reads this field. Still ONE line.
   > ⚠️ **No long-form description field may ever be added here.** The file this replaced was trimmed
   > SIX times in four days and never once met its own size cap, because a document has an unbounded
   > free-text area and no schema to refuse an essay. **A list refuses essays only as long as nobody
   > adds a field that accepts one.**
   > 🔴 **`Sort Index` is a GATE, not a schedule** (`department-head-base.md` §9). Sixteen rows were
   > created 2026-09-20 with it EMPTY on every one, plus five already-built agents carrying the same
   > blank. **A gate with nothing to read is not a gate.**
   > ⚠️ **The one-line-description clause COLLIDES with the log law**, which puts a LIVE STATE block in
   > the row description. The law is newer and wins; this clause governs the rest. Ruling owed, Michael's.
2. ~~The **AI Toolkit index** (ClickUp doc) — the Quick-Scan trigger-table row Brain reads every pass.
   Do it or explicitly surface it; never drop it silently.~~
   🔴 **STRUCK 2026-09-21, Michael: *"i refuse to do the toolkit paste. we need to make the system
   more robust."*** **A per-agent trigger row MIRRORS the Index row and is not in the resolution
   path.** `gates/agent-invocation-gate.md` STEP 0 is locked: resolve by querying the Index for the
   ONE matching row (name / `Slug` / `AKA`) and load `Home` directly — *"never resolve from memory."*
   ⭐ **Fifth mirror pair after four retired manifests**, under one standing law: **no pair, no sync
   obligation.** It had banked **19 owed rows only Michael could paste** — a mandatory registration
   surface no agent can write to, which guarantees a growing queue of unregisterable agents. Full
   reasoning: `gates/git-agent-authoring.md` step 5.
   🚫 **NOT struck for a MIGRATED LENS whose auto-fire WAS an index-trigger row** (B.3) — that row is a
   house tool for a HOOK-shaped trigger, and repointing it is still owed. 🚫 **Not struck for hooks or
   triggers generally:** the invocation gate does not cover them and they have no Index row, so for
   them the Toolkit table IS the routing layer.

~~3. `roster.json` / `superagents.json` / `registry.json`~~ — **ALL STRUCK.** `registry.json` retired
2026-07-25 (PR #483); `roster.json` + `roster.html` retired 2026-07-30 (PR #612). **Writing to any of
them is a no-op at best and the resurrection of a retired duplicate at worst.** 🚫 Do not create a file
to mirror the list. **Four retirements is the pattern, not a coincidence.**

> 🩹 **REGISTER is the step that rots, every time the index moves, and it rots SILENTLY.** v0.3 caught
> it pointing at a retired file; v0.5 caught it again sixteen hours after the Index went live.
> ⭐ **v0.6 is the third rot and a NEW shape: not a dead file, but a live surface duplicating another
> live surface. A mirror does not error — it just quietly needs maintaining forever.** Full history:
> the notes sidecar.

A retired agent stays LISTED on the Index, status `retired` — never silently dropped.

### 3. VERIFY (run the git-teammate audit DoD)

Git-teammates have **no live config to diff**, so the native live-vs-declared mirror test does NOT
apply. The bar is **INTERNAL CONSISTENCY**: will a cold `/session.agent=<Name>` load a coherent,
non-contradictory agent?

**Run the git-teammate audit DoD, defined canonically in
`brain-config/super-agents/audit-instruction.md` → git-teammate track.** Walk every check there,
classify PASS / PARTIAL / GAP, and record the result as a dated audit file under
`super-agents/<slug>/audits/<slug>.<YYYY-MM-DD>.md` via PR. The ledger stays open while any
GAP/PARTIAL is unresolved.

🔒 **The record MUST carry SHA stamps** for every governing file the audit leaned on — base spec,
audit standard, this runbook, any gate the bundle points at. **An unstamped audit is unverifiable.**
Full rule, the incident behind it, and the staleness re-check (addendum, never reissue) live at the top
of `audit-instruction.md`. This matters most at BIRTH: a bundle audited the same day it was built is
the likeliest thing to have its base spec move underneath it. ⚠️ **The Index row has no SHA** — stamp
the date and the row's `Slug` instead, and re-query rather than trusting a carried copy.

⚠️ **DoD check 8 reads "Index row + trigger row fresh." The trigger-row half is STRUCK for agents**
(REGISTER step 2). Amendment owed in `audit-instruction.md`; until then treat the Index row as the
whole of check 8 for an agent, and keep the trigger half for hooks.

---

## Process guardrails for the pass itself (2026-09-21)

Two mechanisms existed, were correct, and were skipped on the 09-20/21 builds. Both cost real defects.

- 🔴 **Post a `session-board.md` presence row BEFORE the first write.** A rowless session read
  `_shared/` once and wrote into it 93 minutes later; a parallel session merged a new supplement inside
  that gap. **The READ would have caught it; no check would have.**
- 🔴 **Run `.github/scripts/pre_write_size.py` on every candidate.** The CI size gate runs on
  `pull_request`, so a fast squash-merge outruns it. **A prose estimate is off by a MULTIPLE, not a
  margin** — measure the bytes, never the intention.

---

**Acceptance-test history, all six live runs, and the changelog:**
[`git-teammate-lifecycle-runbook.notes.md`](./git-teammate-lifecycle-runbook.notes.md).
