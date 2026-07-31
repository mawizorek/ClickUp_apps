# Git-Teammate Lifecycle Runbook — v0.5

> **What this is:** the single, cold-agent-executable procedure for bringing a git-teammate into
> existence and keeping it internally consistent. **Define → Build → Register → Verify.**
>
> **Executable by a COLD agent** with ZERO steward context. That is the whole design goal: any Brain
> session, following only this file + the docs it points at, can define a new teammate or migrate an
> existing one WITHOUT Fleet Felix present. If a step needs Felix's memory to complete, the step has
> failed — fix the step, not the agent.
>
> ⚠️ **SCOPE CORRECTED 2026-07-30: cold-start no longer means "git alone."** Resolution and
> registration now live in a **ClickUp list** (see REGISTER), so a cold agent needs BOTH git and
> ClickUp to run this runbook end to end. That is not a regression — Brain has always had ClickUp,
> and the AI Toolkit index (a ClickUp doc) has always been a mandatory every-turn read. What the
> property actually guarantees is **no STEWARD context required**, and that still holds.
>
> **Stewarded by Fleet Felix, owned by no persona.** This is a TOOL (Constitution §2–§3). Felix and
> every agent POINT at it; none store its steps. It POINTS at the existing law, never restates it:
> - How to BUILD one (founding law): `brain-config/gates/git-agent-authoring.md`
> - How to BE one (runtime): `brain-config/super-agents/_shared/super-agent-base.md`
> - How to AUDIT one (the git-teammate audit DoD): `brain-config/super-agents/audit-instruction.md` → git-teammate track
> - Naming write-gate: `brain-config/gates/agent-name-collision-gate.md`
> - **Structured fleet truth: the ClickUp list 🤖 Agent Index — https://app.clickup.com/36074068/v/li/901328043244 (list id `901328043244`). One task per agent.** ~~`roster.json` — THE single documented source~~ — **STRUCK 2026-07-30: RETIRED to a tombstone stub.** ~~`superagents.json` (SSOT) + `registry.json` (manifest mirror)~~ — struck 2026-07-25. **Three retired manifests; there is no file, and there is no pair.**
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
5. **Hand the definition to the Build spine below.**

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

### 1. BUILD (the 5-file bundle)

Create `brain-config/super-agents/<slug>/` with the full bundle per
`_shared/super-agent-base.md` → "File set". Author to the authoring gate
(`gates/git-agent-authoring.md`); this runbook does not restate those rules.

- `preferences.md` — opens with the one-line base pointer, then identity + voice + lane + load
  manifest. Behavior/personality ONLY, no how-to. Include the agent's **self-announce header** (it is
  identity, and Universal Mandate 1 requires one). (An incubating signature output-format may live
  here as a condensed pointer per B.3.)
- `memory.md` — accumulated context + how-Michael-works + pointers to stewarded tools. Not process.
- `activity-log.md` — rolling condensed session ledger, newest on top, append-only.
- `decision-log.md` — reasoning about the AGENT ITSELF (why it is shaped this way).
- `README.md` — pointer/steward metadata only; **NEVER mirror Agent Index fields**.

Revision history = git + PR descriptions. No inline changelog in `preferences.md`.

### 2. REGISTER (the Index + the AI Toolkit, same session)

**Registration is the WIRING, not paperwork. An unregistered agent CANNOT BE RESOLVED, no matter how
complete its bundle is.** Register across:

1. **The ClickUp 🤖 Agent Index — https://app.clickup.com/36074068/v/li/901328043244 (list id `901328043244`).** Create ONE task,
   named with the agent's display name. Fill: `Slug` (immutable) · `Class`
   (`super-agent` | `agent` | `task-specific` | `retired` — **persistence, never rank**) ·
   `Memory` · `Invoke` (`/session.agent=<Name>`) · `AKA` · `Home` (the repo path to the bundle) ·
   `Sort Index`. Add `default_runbook` + `Gate Strength` **only** if it has a bare-name default —
   ⚠️ these are read on every bare-name call and are **not decoration** (emptying them silently
   un-guards a read-only door). Add `Lane` **only** if there is no home file, where it is the sole
   description that exists anywhere. Set the native status. Keep the task description to ONE line.
   **A graduation is a field flip, not a new row** — that is why one list holds every class.
   > ⚠️ **`Lane` is ONE LINE, hard rule, and no long-form description field may be added here.**
   > The file this replaced was trimmed SIX times in four days and never once met its own size cap,
   > because a document has an unbounded free-text area and no schema to refuse an essay. A list
   > refuses essays only as long as nobody adds a field that accepts one.
2. The **AI Toolkit index** (ClickUp doc) — the Quick-Scan trigger-table row Brain reads every pass,
   plus any existing rows that pointed at the old lens path. Do it or explicitly surface it; never
   drop it silently.

~~3. `roster.json` / `superagents.json` / `registry.json`~~ — **ALL STRUCK.** `registry.json` retired
2026-07-25 (PR #483); `roster.json` + `roster.html` retired 2026-07-30 (PR #612). **Writing to any of
them is a no-op at best and the resurrection of a retired duplicate at worst.** The Mirror-Pair Sync
Mandate died with the first one: **no pair, no sync obligation.** 🚫 Do not create a file to mirror
the list. Three retirements is the pattern, not a coincidence.

> 🩹 **Why this step was urgent (2026-07-30):** for sixteen hours after the Index went live, this
> runbook still told a cold agent to register into `roster.json` — by then a tombstone whose
> `agents[]` array is empty. A guardrail that instructs you to write to a tombstone is the exact rot
> class this fleet keeps getting burned by, and it sat in the file that governs how agents are born.

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

---

## Acceptance test for THIS runbook (the cold-start proof)

The runbook is only real if a context-free agent can run it. **Standing test: migrating Audit Anna**
(lens → git-teammate) by a cold agent following ONLY this file passes end to end — defines nothing
from Felix's head, orphans no files, lands registered, and clears the Verify DoD. A stall that
requires steward context = a runbook bug to fix here. **RESULT (2026-07-21): PASS.**
The cold run surfaced two clarifications now folded in: the lens index-trigger carry-over exception
(B.3) and the incubating-output-format nuance (B.3), plus graduated the audit DoD into
`audit-instruction.md`.

**Second live run (2026-07-25, Memory Maggie): PASS with three runbook bugs found and fixed in v0.3** —
the REGISTER step still instructed writing to a retired file, the §6 graduation justification was
nowhere in Entry B, and nothing warned against pointing a fresh profile at a tool that does not exist.

**Third + fourth live runs (2026-07-26, FMP Fiona and Routine Ricky): PASS.** Both built fresh from
Entry A, both cleared the DoD 9/9, both stamped. Findings folded into v0.4.

**Fifth live run (2026-07-30, Tutor Tate): PASS on Define/Build/Register, VERIFY NOT RUN** (open).
Surfaced the reserved-lane case (A.2) and the unused-initial naming shortcut (A.4). ⚠️ **It also
exposed the REGISTER rot that v0.5 fixes** — the run registered into `roster.json` hours before that
file was retired, so the very next agent to follow this runbook would have written to a tombstone.
**Twice now the REGISTER step has pointed at a dead file** (v0.3 caught the first). That is a pattern:
**whenever the index moves, this step is the thing that rots, and it rots silently because writing to
a stub does not error.**

---

## Changelog

- **v0.5 (2026-07-30) — REGISTER writes to the ClickUp Agent Index.** `roster.json` retired to a
  tombstone (PR #612), so the previous instruction sent cold agents to write into an empty file that
  fails silently. Full field list spelled out, with the one-line-`Lane` rule and the no-new-text-field
  warning carried across so the failure that killed the file cannot follow it into the list.
  **Cold-start scope corrected in the header** — it means "no steward context," not "git alone," now
  that registration is a ClickUp write. Also: the SHA-stamp rule adapted (an Index row has no SHA),
  the reserved-lane case added to A.2, the unused-initial naming shortcut to A.4, the
  leave-the-justifying-ledger-empty convention to B.3, and "an agent cannot delete" moved into Scope.
- **v0.4 (2026-07-28) — VERSION NUMBERS REMOVED FROM POINTERS.** VERIFY had been citing the audit DoD
  as "v0.1" since 2026-07-21. **Fixed by DELETING the version number rather than bumping it:** a
  pointer that names a version rots silently while looking authoritative. Also struck the duplicated
  pointers-must-resolve check (it graduated into the DoD), surfaced the SHA-stamp requirement in
  VERIFY, flagged the native path dormant, and folded in three findings from the Fiona + Ricky runs.
- v0.3 (2026-07-25) — **REGISTER de-rotted.** `superagents.json` (renamed 07-24) and `registry.json`
  (retired 07-25) struck through rather than deleted, because a guardrail that decayed into the
  opposite of its rule teaches the next reader that authoritative text can be wrong. Added: Entry B
  step 0 (the §6 "needs MEMORY" justification), the do-not-invent-a-tool-path rule, the
  label-inherited-memory convention, the sidecar-tool-stays-put rule, the announce-header build
  requirement, and a token-collision check in DEFINE step 4. Found while running this runbook on
  Maggie — the file that governs graduations was telling agents to write to a tombstone.
- v0.2 (2026-07-21) — GRADUATED the inline git-teammate audit DoD into `audit-instruction.md`;
  VERIFY now points there instead of restating it. Folded in two findings from the Audit Anna cold
  run. Marked the acceptance test PASSED.
- v0.1 (2026-07-20) — created. Merges the Definition Playbook (net-new) + Migration Runbook
  (convert) onto one Build→Register→Verify spine. Workshop-passed (Frank NET-NEW + fold-in
  constraint; 7 lenses). Detailed history lives in git.
