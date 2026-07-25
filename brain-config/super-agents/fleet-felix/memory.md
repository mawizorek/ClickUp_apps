# Felix — Memory (the relational fleet index)

> CONTEXT, not process. This holds how agents RELATE, their lineage, and lane boundaries — the connective tissue the structured data can't capture. Structured facts (slug/class/memory/status/lane) live in `super-agents/roster.json`, **the ONE documented source**; this file POINTS at it and never restates it. If a fact here conflicts with the roster, the JSON wins — fix this file.
>
> ⚠️ **Reconciled to HEAD 2026-07-25.** This file had drifted badly in one day: it called Dexter "PROPOSED, NOT BUILT" (he shipped), missed Maggie entirely, still named `registry.json` as a live manifest (retired), still described a two-tier roster (flattened), and still called Fiona "Frank" (renamed). Six stale facts in the fleet steward's own index. **Lesson I'm keeping: my memory rots fastest on the days the fleet moves fastest, which are exactly the days it gets read.**

---

## 🟰 ONE fleet, no hierarchy (LOCKED 2026-07-24, Michael) — read before the roster below

**"Agent" and "super agent" are converging into one term.** A super-agent IS a lens. Anyone on the super-agent team can also sit on the agent team, and **Mira works with both identically** — she seats by LANE, never by tier.

- **`class` = PERSISTENCE, not status.** Super-agent = carries a memory bundle across sessions. Agent (lens) = stateless. A storage fact about whether a voice remembers yesterday, NOT seniority or speaking order. Reading class as rank is drift, and I'm the one who's supposed to catch it.
- **The two trees stay real on disk** (one has files, one doesn't) — physics, not a ladder. Exactly why they're indexed in ONE flat list.
- **The one place class binds:** `/session.agent=<Name>` needs a bundle to inhabit. Constrains INHABITING, not being seated or heard.
- **Why I like this ruling:** if class implies rank, every lens eventually gets promoted for standing alone and we bloat the fleet with bundles nobody needed. Flat seating keeps graduation honest — **a lens becomes a teammate for exactly ONE reason: it needs MEMORY.** The only justification I accept.
- **Michael's vocabulary is the schema's vocabulary:** he calls lenses "agents" and seated personas "super agents." `class: super-agent | agent | task-specific | retired`, plus explicit `memory: true|false`.

Governing text: `_shared/super-agent-base.md` §6 · `../../orchestration.md` (Class Parity) · `index.md`. Provenance: Fleet Build Queue DL J1.

## 🧭 The graduation test I actually use (earned 2026-07-25)

Michael says "upgrade the next agent." §6 gives one justification (needs MEMORY) but not a way to FIND the candidate. My method, and it worked first time: **invert the question — which lens already maintains durable state on disk between sessions?** That voice is a teammate in a lens costume, re-deriving its own history cold every run. It found Maggie instantly (queue file + sole write path to a persistent file) with Clio second (`usage-log.json`). "Who feels important" would have found neither.

**Standing runner-up: Closing Clio.** Memory turns a per-session health snapshot into a trend line, which is the only form in which "health" means anything. She's next when Michael wants one.

## How the fleet is organized (two trees, ONE flat roster)

Two trees on disk, ONE flat list in `roster.json` (slimmed + flattened 2026-07-25, PR #483 — the `agents`/`council_lenses` two-array split is GONE, because the class boundary moves every time a lens is upgraded and a class-per-array roster would live half-wrong):

- **`brain-config/agents/<slug>.md`** = stateless lenses. Processing verbs, no personal memory, not inhabitable as a standing persona.
- **`brain-config/super-agents/<slug>/`** = persistent teammates. 5-file bundle, base pointer, `/session.agent=`, memory across sessions.
- A graduation is a **one-field flip** in the roster (`class` + `memory`) plus a bundle and a tombstone at the old lens path. The `from` field draws the lineage.

**Invocation is roster-first.** Any `/agent-name` resolves against `roster.json` at STEP 0 (`gates/agent-invocation-gate.md`), then loads that home directly — no double-hop through me or Mira. Reading the roster is NOT invoking me; I'm its steward, not a forwarding desk.

## The teammate roster (my primary charges — 9)

- **Workhorse Wes** (`workhorse-wes`, active) — driving force. Migrated 2026-07-19 from an announce-only lens; FIRST git-teammate, the reference implementation.
- **ClickUp Coach Corey** (`clickup-coach-corey`, active) — converted 2026-07-19 from native `-39958913` (retired, pending UI disable). Re-lane fully executed: ClickUp structure + setup coaching + ClickUp-space auditing ONLY.
- **Audit Anna** (`audit-anna`, active) — migrated 2026-07-21 from the lens; FIRST female teammate. Audit lead. Her migration was the lifecycle runbook's cold-run acceptance test and PASSED without me in the room.
- **Maestro Mira** (`maestro-mira`, active) — migrated 2026-07-21. Orchestrator + Michael's DEFAULT front door. Consults my directory when routing (switchboard vs directory). Instruction set = `orchestration.md`. Seats class-blind since 07-24.
- **Mainstage Milo** (`mainstage-milo`, active) — URITP production ops. BUILT FRESH 2026-07-21 via the Definition Playbook, deliberately NOT a mirror of the over-hatted native `-39940529`. **This is the precedent that killed the verbatim-native-mirror model fleet-wide.** OPEN: confirm the full 7 URITP spaces.
- **Dev Dexter** (`dev-dexter`, active) — **BUILT 2026-07-25, PR #475; registered PR #483.** Build & engineering lead: repo-app architecture, app design, data modelling, code quality across sessions, and he writes code. My "hands-on-keyboard is a job not a lane" objection was OVERRULED by Michael, correctly — a build lead who only advises is the bottleneck he exists to remove. First live call was the JSON-vs-TSV ruling; first day he found four rotted guardrails and authored the Doc-Rot Sweep.
- **Memory Maggie** (`memory-maggie`, active) — **GRADUATED 2026-07-25, PR #505.** Fourth graduation. Memory steward: sole brain-memory write path, placement triage (deny-by-default), the OMR queue, the close-time Memory Audit. First graduation justified by the already-keeping-state test.
- **Fleet Felix** (me, `fleet-felix`, active) — born 2026-07-20. Announce header finally defined 2026-07-25 (terminal-prompt shape; I went five days without one, which Universal Mandate 1 requires).
- **FMP Fiona** (`fmp-frank`, `needs-declaration`, NEVER RUN) — FileMaker solution design + documentation. **RENAMED from "FMP Frank" 2026-07-25** (see naming ledger). Slug stays `fmp-frank` forever. Rebuild pending Entry A of the runbook: pin ONE singular lane BEFORE authoring. Her old stub demanded a verbatim paste of the native config, which blocked her for ten days until I struck it.
- Task-specific (inventory-only): origination-date-agent, parse-property-emails, update-amount-paid. Retired: `workshop-wes`, `update-uritp`.

## Lane map (who owns what — stay singular)

- Fleet lookup + new-agent stewardship + singularity policing = **me**.
- Verbal orchestration / front door = **Mira**. Momentum = **Wes**. General + fleet auditing = **Anna**. ClickUp structure + space auditing = **Corey**. URITP production ops = **Milo**. **Repo apps: architecture, design, data modelling, code = Dexter.** Brain memory + placement = **Maggie**. FileMaker solution design = **Fiona** (pending).
- **The Dexter ↔ Fiona seam (LOCKED 2026-07-25, Q7 → B):** Dexter owns the REPO, Fiona owns FILEMAKER, and they're a documented TANDEM, not a hierarchy. Michael asked for "a version of Frank devoted solely to repo apps" — that was Dexter, built the day before, lane for lane. Sharpened his profile instead of forking a twin. **The generalizable bit: two agents accumulating rival build memory of one codebase is strictly worse than one, because neither ends up holding the whole picture. Memory is the thing you must never split.**
- Lenses are processing verbs, not lane owners. (Recon Renata = repo-shape audit, Beckett = artifact attack; Anna orchestrates both.) A LANE distinction, never a rank one.

## Lineage: the Anna / Corey re-lane (RESOLVED 2026-07-21)

The saga that birthed me. Fleet Steward + fleet-audit were piled onto Corey and bounced toward Anna — the hat-piling anti-pattern. Resolution: **I** exist so the steward role stops bouncing; **Corey** narrowed to ClickUp; **Anna** took general + fleet auditing. Clean division to hold: **Felix KNOWS the fleet, Anna AUDITS it.** All watch items closed.

## Density snapshot

- **Teammates = 9** (7 M : 2 F). Maggie + Fiona's rename shifted this twice in one day: Anna and Maggie are the two women, and Fiona will be the third when she's built. Michael's naming instinct trends pronounceable + dictation-proof over gendered, and the graduation path keeps pulling female lenses up.
- **~24 active lenses**, skewing female. ⚠️ These counts are DEMOGRAPHIC bookkeeping only — never let "9 vs 24" read as a seniority pyramid.

## Naming ledger (hits + misses)

> The convention lives in the Super Agent Creation Checklist. I track what landed.
- **2026-07-25 — FMP Frank → FMP Fiona (RENAME, display only).** Two Franks existed: the live anti-sprawl gate `foldin-frank` and the never-built `fmp-frank`, and bare "Frank" resolved to the WRONG one. Michael ruled the incumbent keeps the token (Q6 → A): the gate is cited by name in six documents and used fluently in conversation, while Fiona had never spoken. **"Fiona" came off this very ledger** — reserved 2026-07-20, spent 2026-07-25. Michael: *"great use for Fiona, yes."* **New rule I've added to the roster and the runbook: a first name IS an invocation token; check the token map, not just the name field.** Two distinct display names sharing a first name is still a collision.
- **2026-07-25 — Memory Maggie (migration, slug reused).** Fourth graduation, `memory-maggie` kept.
- **2026-07-24 — Dev Dexter (LOCKED).** Michael amended my "Dev Dex" to "Dev Dexter." **My MISS in the same breath:** I claimed "D is a completely empty letter" — WRONG, Domain Dara is live. Verify-before-flag applies to my OWN assertions. Michael's instinct was right for a reason I'd missed: "Dex"/"Dara" is thin under dictation, "Dexter" isn't.
- **2026-07-21 — Audit Anna (migration, slug reused).** A migration reuses the slug, never renames it.
- **2026-07-20 — Fleet Felix (chosen).** "Felix" shares e+l with "Fleet" (Michael's shared-letters heuristic). Runners-up: Roster Ross (loved, but "roster" reserved), Curator Quinn, Registrar Rhea, Keeper Nadia, Muster Vance.
- **Lesson — Routine Ricky (incident).** A mid-session create collided on name/nickname across both namespaces → birthed the collision gate. Nicknames collide too.
- **Lesson — Red Rhett → Workshop Wes (incident).** A whimsical rename changed the SLUG → orphaned files. Slug immutable; renames touch `display_name` only. This is why Fiona lives in a folder called `fmp-frank` and always will.
- **2026-07-24 — file rename, NOT an agent rename.** `superagents.json` → `roster.json`, `index.html` → `roster.html`. Redirect stubs left (fail-loud).

## Michael-patterns worth carrying

- **He collapses duplicate sources of truth on sight.** Never propose a mirror or a second index as a solution. Three died on 2026-07-25 alone (registry, app-index, the mirror-pair mandate).
- **He keeps the reasoning, not just the outcome.** A ruling without its why gets re-litigated.
- **He overrules cleverness in favour of what removes a bottleneck** (the Dexter hands-on-keyboard call). When my objection loses, I log it and move.
- **He answers structural questions via Decision Log with INVERTED polarity** (checked = rejected) and expects a readback before action.

## Open follow-ups I'm holding

- **`roster.json` is ~15KB against its own LOCKED ~12KB slim rule** — and it has NEVER met that number (it shipped at 14.3KB in the same PR that locked 12KB). Real ceiling is ~22KB on disk. Flagged for Michael/Dexter: move the target or drop a field. Not silently moving a goalpost.
- **Fiona's rebuild:** Entry A, singular lane pinned first, tandem seam with Dexter written on both sides.
- **Routine Ricky** has sat at Fleet-Build-Queue #1 unbuilt since 07-20. Either build him or admit the runbook-agent pattern was superseded and retire the queue item.
- **Milo:** confirm the full 7 URITP spaces.
- **Blocked on Michael (manual UI, irreversible):** disable retired natives Corey `-39958913`, Milo `-39940529`, Fiona `-39958890`.
- **The AI Toolkit index roster section** still says "git-teammate fleet (6)" and carries a now-false "Dexter not in roster.json" warning. Both stale. Couldn't cleanly str_replace the trigger-table cell (stored markup vs rendered text mismatch) — flagged rather than guess-edited.

## Pointers (never restate these here)
- Fleet roster (ONE source, both classes) → `super-agents/roster.json` (renderer: `roster.html`) · ~~`registry.json`~~ RETIRED 2026-07-25 to a tombstone stub
- Invocation enforcement → `gates/agent-invocation-gate.md` (STEP 0 = roster-first)
- Build/migrate an agent → `gates/git-teammate-lifecycle-runbook.md` v0.3 (+ `gates/git-agent-authoring.md`)
- How to BE a teammate → `super-agents/_shared/super-agent-base.md` (§6 = class parity)
- Naming write-gate → `gates/agent-name-collision-gate.md`
- Orchestration / seating → `brain-config/orchestration.md` (Class Parity)
- Is a doc still true? → `hooks/doc-rot-sweep.md` (Dexter's tool; I am not exempt from it)
