# Agent Invocation Gate

**Purpose:** Disambiguation layer for all subagent invocations. Prevents false-positive fires when Michael mentions a name in conversation that happens to match an agent name (Michael works with real people who may share agent names). **Also carries the invocation-mode contract** (bare name vs name+context), the per-agent soft-gate dial, and the **index-first resolution step** (STEP 0 below).

**Mode:** Always-on (deterministic). Fires during the 🧠 Subagent evaluation step of the roster scan.

**Trigger:** Any agent name detected in user input.

---

## 📖 STEP 0 — Resolve against the AGENT INDEX first (LOCKED 2026-07-24, RE-HOMED 2026-07-30)

**Before resolving ANY `/agent-name`, bare name, or nickname, look the token up in the ClickUp list 🤖 Agent Index — https://app.clickup.com/36074068/v/li/901328043244 — and resolve against that row.** This is the load-bearing first move and it is NOT optional.

**Query for the ONE row you need. Do not pull the whole list.** Match the token against the task name, the `Slug` field, or the `AKA` field. The row carries everything resolution needs: `Slug` · `Class` · `Memory` · `Invoke` · `AKA` · `Home` · `Lane` · `default_runbook` · `Gate Strength` · `Instructions`. **Class** means PERSISTENCE, never rank (`super-agent` = holds a memory bundle · `agent` = stateless lens · `task-specific` · `retired`). **Status** is the list's native status, so a retired agent is visibly retired without a field to misread.

> 🪦 **RE-HOMED 2026-07-30, Michael: *"it's a table. not a doc."*** Resolution previously read ~~`brain-config/super-agents/roster.json`~~, now a **tombstone stub**. It was a 39-record table simulated by a text file that had to be read WHOLE on every lookup — no range read exists — which forced a ~12KB ceiling **the file never once met in its entire life** (24.8 → 14.4 → 21.1 → 18.4 → 13.18 → 13.67KB, six trim actions in four days, +6.7KB regrowth in a single day). At ~25KB it became unreadable-whole and **shipped Dev Dexter built-but-unregistered.** A list has fields; fields refuse essays. ~~`invocation.tokens`~~, ~~`invocation.tombstones`~~ and ~~`roster.html`~~ go with it. **Do not restore any of them** — that is the third retired manifest, and a file alongside the list is the mirror-pair rot two retirements already killed.

> ⚠️ **Historical correction, kept because the lesson outlives the file.** STEP 0 once told every reader to resolve via a field path that **did not exist** (`invocation_resolution.token_map`) and described a two-array schema that had been flattened weeks earlier. **A wrong path in the FIRST move of every invocation is the worst possible place for rot:** an agent following it literally finds nothing and falls back to guessing, which is precisely what STEP 0 exists to prevent. If the lookup below ever stops matching reality, fix it the same day.

Resolution sequence on any invocation:

1. **Query the Agent Index** for the single matching row (name / `Slug` / `AKA`). Never resolve from memory, and never parse the `agents/` folder — that is the lens tree, not the index.
2. **Read the row** → `Slug`, `Class`, `Home`, plus `default_runbook` / `Gate Strength` where set. Nicknames, slugs and dictation variants all resolve here.
3. **Load that agent's home DIRECTLY.** `super-agent` → its bundle under `super-agents/<slug>/` via the persona load contract (`_shared/super-agent-base.md`). `agent` → its `agents/<slug>.md` profile. **Bundles are still git** — only resolution moved.
4. **Then** apply the Pass rules below (name+intent vs narrative), the invocation-mode contract, and the soft gate.

**No forwarding.** Reading the index is NOT invoking Felix, and a named call does NOT route through a steward. The index is passive data; Felix is its steward, not a switchboard the traffic flows through. **A named call reaches the agent directly — no double-hop through Felix or Mira.** (Steward consultation is only for UNROUTED asks: structural "does an agent exist / who owns this lane" → Felix; verbal "get me the right voice now" → Mira.)

**Failure rule:** lookup fails → retry once, then say so. Token not in the index → do NOT invent an agent; ask or treat as narrative. **A row that exists but is missing `Home` is a real finding, not a reason to guess a path.**

---

## Pass

### 1. Name + Intent (fire)
Fire the agent when the name appears with:
- A command: "Renata, audit the repo" / "run [name]" / "spin up [name]"
- A function reference: "have [name] check this" / "what would [name] say"
- Standalone invocation: "[Name]." (just the name, clearly addressing the agent)
- Explicit phrasing: "call [name]" / "ask [name]" / "deploy [name]"

### 2. Name in Narrative (don't fire)
Do NOT fire when the name appears:
- In a story/update about a real person: "I was talking to Renata about the schedule"
- As a reference to someone: "Renata said she'll be late"
- In a list of people: "cc Renata and Mike on that"
- In any context where the surrounding sentence implies a human being doing human things

### 3. Ambiguous (ask)
If genuinely unclear whether the user is invoking the agent or referencing a person:
- Ask ONE short question: "You mean audit-Renata or human-Renata?"
- Don't overthink it. If there's any agent-function context in the sentence, it's the agent.

---

## 🎛️ Invocation modes: bare name vs name + context (LOCKED 2026-07-20, Michael)

Invoking an agent has two shapes. They are the SAME agent invoked two ways, NOT two kinds of agent.

**Mode A — bare name (context = null): "run your thing."** A naked invocation (a bare name with no situation attached) means: **run the agent's documented DEFAULT runbook, with no other input, and proceed through it.** The agent points at a standalone, separately-documented runbook; the bare name is a convenience alias that fires that runbook at `context=null`.

**Mode B — name + context: "here's the situation, apply yourself."** The persona is applied to Michael's supplied input, the normal way every lens/agent already runs.

**The runbook is decoupled from the persona (the core principle).** A routine an agent runs is a STANDALONE documented hook/runbook (in the repo, or a linked ClickUp doc), directly invocable on its own — Michael can open any session, point at that document, and say "run this process," and it executes identically to the bare-name call. The agent name is just a friendly door to it. The routine is NEVER baked INTO the persona as a hardcoded "pull this, run this" pipeline — that's too procedural and it's not what a Super Agent is. **Super Agents are personalities; this is a convenience layer for accessing dense routines that happens to share an agent's name.**

**Default vs menu (the runbook-agent problem).** An agent with MANY routines cannot run all of them on a bare call. Such a profile MUST declare, explicitly:
- **`default_runbook`** — the ONE routine that fires on a naked name invocation.
- **the menu** — the named routines invoked with an explicit target ("<Name>, run the weather pull").
If no `default_runbook` is defined, a bare call does NOT auto-execute — it asks which routine (see the soft gate).

**Live proof (2026-07-25/26): the model holds.** Two teammates now run it in production, and both landed on the same shape independently — **bare name → the SAFE READ-ONLY door; anything that WRITES needs an explicit instruction.** Treat that as house precedent, not a hypothesis:
- **Memory Maggie** — bare name fires a read-only OMR review; writes need the explicit drain phrase. `Gate Strength: auto`.
- **Closing Clio** — bare name fires a read-only mid-session health check; the write-heavy full close needs the close trigger. `Gate Strength: auto`.

---

## 🔉 Soft gate — per-agent dial (`Gate Strength`, LOCKED 2026-07-20, Michael)

Before auto-executing a full runbook on a bare-name call, an agent may hold a **soft gate** ("run the full routine, or are you driving?"). How hard it holds is **NOT global — it's a per-agent dial** declared on the agent's Index row:

- **`auto`** — bare name runs the default runbook immediately, no confirm. Appropriate for cheap / idempotent / **read-only** routines.
- **`confirm`** — bare name surfaces a one-line "run the full <default> now?" before firing. The middle default for anything with cost or side effects.
- **`always-ask`** — never auto-runs; a bare name always asks what's wanted. For agents whose "thing" is fuzzy or whose official hat is less literally a routine.

⚠️ **`default_runbook` and `Gate Strength` are READ ON EVERY BARE-NAME CALL and are not cosmetic decoration.** Emptying them does not error — it **silently changes behaviour** (a read-only door becomes an unguarded one). They survived the 2026-07-27 thinning for exactly this reason, after a Workshop pass nearly cut them, and they survived the 2026-07-30 move to the list as real fields. If a future tidy-up eyes them, that is the failure this note exists to stop.

**The spectrum is the point.** A personality running procedure sits toward `auto`; as agents get "official hats" that are less literally a fixed routine, they move toward `always-ask`. The dial makes that explicit and auditable instead of vibes. **Default when unset: `confirm`** (safe middle; never silently auto-fire a multi-step routine nobody asked to run).

**Earn `auto`, don't assume it** (added 2026-07-26): a brand-new agent's routine has no track record, and the original framing said a refresh "trends toward `auto` **once trusted**." So a new runbook-agent ships at `confirm` and graduates to `auto` after the routine has run clean a few times — unless it is READ-ONLY, which is trustworthy by construction (nothing to undo) and may start at `auto`, as Maggie and Clio both did.

---

## 🗣️ Dictation-aware resolution (Michael dictates on every device)

**Commands.** A near-miss command token resolves to the closest canonical invocation grammar rather than being read literally as a name. Canonical grammar = the three forms in `_shared/super-agent-base.md` → Command grammar, plus their literal rows in the AI Toolkit Quick-Scan table. Fuzzy aliases — `/command <Name>`, `/agent <Name>`, `/call <Name>` — route to `/session.agent=<Name>`, resolving `<Name>` against the Agent Index (STEP 0). Proceed with a one-line reading ("reading '/command Felix' as invoke Fleet Felix") when the name resolves; only ask when the token is genuinely unresolvable.

**Names.** A mangled NAME is also usually a transcription artifact, not a new agent — resolve it against the Index (name / `Slug` / `AKA`) and state the reading. But there is one exception that matters:

> ⚠️ **A near-miss on an UNBUILT agent's name may be a RENAME, not a slip.** If the closest match is an agent that does not exist yet, its name is not locked and Michael's voice reaching for a different one is data (the naming convention requires a name that survives HIS dictation). **Resolve the referent, then ASK about the name before authoring any file** — the slug is immutable the moment it is written (Red Rhett lesson). For an agent that DOES exist, treat the near-miss as a slip and carry on (precedent: 2026-07-25, Michael said "fmp frank" twice hours after renaming her and confirmed the rename stands).

**Known live near-miss pairs** — resolve on exact spelling; if a spoken call is genuinely ambiguous between two LIVE agents, ask. **This list is the READ-SIDE HOME for these warnings** (the write-side twin is check 6 of the name-collision gate). It is no longer duplicated in a data file:
- **Clio** (`closing-clio`, session close) vs **Cleo** (`clever-cleo`, Workshop elegance lens). One vowel; homophones.
- **Dexter** (`dev-dexter`) vs **Dara** (`domain-dara`) — why "Dexter" was chosen over "Dex".
- **Sage** (`scout-sage`, research) vs **Renata** (`recon-renata`, repo audit) — separate investigator lanes; "Rita" was refused as a name to keep this map clean.
- **Rocky → Ricky** (`routine-ricky`). A known dictation variant; Michael ruled the spelling 2026-07-26. Also distinct from Renata and Rhys.
- **Tate** (`tutor-tate`, teaching) — no near-miss; T was deliberately chosen because it was the only unused initial in the fleet.

---

## 🚨 Name-collision resolution: "Wes" / "/wes" (LOCKED 2026-07-19)

**There are two agents whose name is "Wes." Resolve EVERY live "Wes" / "/wes" invocation to the LIVE one:**

- ✅ **`workhorse-wes` (Workhorse Wes) — ACTIVE.** Any live invocation — `/wes`, "Wes," "run Wes," "Wes here" — routes HERE.
- 🪦 **`workshop-wes` (Workshop Wes) — RETIRED/NULL, NEVER invocable.** Decomposed 2026-07-04 into The Workshop (7 lenses) + Future Faye. It is a tombstone. **"/wes" MUST NOT resolve to it, and MUST NOT trigger "Mira convenes the Workshop."** The Workshop is invoked by its OWN tokens only: "workshop this," "run it by the team," "convene the team."

**Why this rule exists (the misfire it fixes):** on 2026-07-19 a live `/wes` resolved to the retired Workshop Wes and fired "Mira convenes the Workshop" instead of Workhorse Wes. Root cause: the tombstone carried an "inbound 'Wes' references resolve here" note that a fresh invocation token matched. Corrected: only historical PROSE mentions point at the tombstone; the live token belongs to Workhorse Wes.

## 🚨 The Frank/Fiona split (LOCKED 2026-07-25/26)

- **Bare "Frank" → `foldin-frank`**, the anti-sprawl gate. This is why the FileMaker teammate was renamed.
- **"Fiona" / "FMP" → `fmp-frank`** (display name **FMP Fiona**, live 2026-07-26).
- ⚠️ **Her SLUG is `fmp-frank` and slugs are immutable**, so `/session-start=fmp-frank` is a legal token containing the exact word the rename freed. **It resolves to HER, never to the gate.** Sixth instance of this failure family and the first caused by two of our own rules colliding — the write-side lesson (after a rename, check whether the slug still carries the freed token) is check 7 of `gates/agent-name-collision-gate.md`.

---

## 🔁 Lens → git-teammate migrations (resolve to the LIVE home, never the tombstone)

When a lens is migrated into a git-teammate, its old `agents/<slug>.md` becomes a **redirect tombstone** and the live agent moves to `super-agents/<slug>/`. **Resolve every live invocation to the `super-agents/` home directly** — same principle as the Wes rule: a tombstone is for historical link-resolution + context, never for routing fresh commands. The Agent Index row's `Home` field always names the LIVE home, so STEP 0 lands you correctly by default. Per-agent lineage is **git history**, not an index field.

**Live migrations — all resolve to `super-agents/`:** Workhorse **Wes** (07-19) · Audit **Anna** (07-21, also auto-seizes on audit intent; her nickname "Audit" overlapping the command word is intentional) · Maestro **Mira** (07-21, also the DEFAULT front door when no agent is named) · Memory **Maggie** (07-25) · Scout **Sage** (07-25) · Closing **Clio** (07-25, also seated at every session close).

**Not migrations — no tombstone exists:** **FMP Fiona** (native-track declaration rebuilt fresh on the git track), **Routine Ricky**, and **Tutor Tate** (built net-new 2026-07-30). None was ever a lens.

**General rule:** for any name with BOTH a tombstoned lens AND a live bundle, go straight to the `super-agents/` home.

---

## Rules

- **Index first (STEP 0).** Every invocation resolves against the 🤖 Agent Index list before anything else. Never parse the `agents/` folder and never resolve from memory.
- **Query one row, not the whole list.** That is the entire reason the index is a list; pulling all of it rebuilds the problem the file had.
- **Nicknames count**, and so do slugs and dictation variants. All go through this gate.
- **Context wins.** If the conversation has been about a real person named [X] for several messages, a bare mention of [X] is almost certainly still about the person.
- **Command words are strong signals.** "run," "spin up," "deploy," "audit," "check," "review" + name = agent invocation.
- **Bare name = Mode A (context=null runbook)**, subject to `Gate Strength`. No default defined → ask which routine.
- **The runbook is standalone + directly invocable.** "Run this process" pointed at the runbook doc == the bare-name call. The persona references the runbook; it never hardcodes it.
- **A migrated agent resolves to its `super-agents/` home, not its `agents/` tombstone.**
- **No double-hop.** A named call reaches the agent directly; it does not forward through Felix or Mira.
- **This gate is lightweight.** The lookup + resolution should take <1 second of reasoning. Don't turn it into a deliberation.
- **A retired/tombstoned agent is NEVER a live invocation target.**

---

## Composes with

- Fires as part of the 🧠 Subagent roster evaluation (inside the Roster Scan Planner's step 1).
- Does NOT apply to 🔄 Hooks or 🎯 Triggers (they have their own deterministic triggers).
- **Agent Name-Collision Gate** (`gates/agent-name-collision-gate.md`) is the WRITE-side counterpart: it forces a distinct invocation token when an agent is created or renamed. This gate is the read side. Opposite directions, same namespace.
- **Clarify First → Clara lens** owns the dictation-artifact reparse feeding the fuzzy-resolve above.
- **The 🤖 Agent Index list** is the DATA this gate reads, and a ClickUp view is its renderer. ~~`super-agents/roster.json` + `roster.html`~~ — **struck 2026-07-30: retired to tombstone stubs.** ~~`registry.json`~~ — struck 2026-07-26.

---

## Changelog

- **2026-07-30: STEP 0 RE-HOMED to the ClickUp Agent Index; `roster.json` retired.** Michael: *"it's a table. not a doc"* → *"declare this index the sole truth."* Resolution is now a single-row query instead of a whole-file read, which removes the size ceiling that the roster violated continuously for its entire existence and that once shipped an agent unregistered. Folded the dictation near-miss list into this gate as its **sole** home (it was duplicated in the retired data file), added Rocky→Ricky and Tate, added Ricky + Tate to the never-was-a-lens list, and added the query-one-row rule. `roster.html` retired alongside — a ClickUp view is the renderer now.
- **2026-07-27: roster thinned to an index — STEP 0 note added, `from` pointer de-rotted.** The roster dropped `lane`/`accent`/`from`/`seat`/`teams` (each a lossy duplicate of a file that says it better); **nothing this gate reads changed.** Added a ⚠️ to the soft-gate section recording that `default_runbook` + `gate_strength` are read on every bare-name call and were nearly cut in that pass — deleting them does not error, it silently un-guards a read-only door.
- **2026-07-26: STEP 0 DE-ROTTED — it was pointing at a field that does not exist.** Resolution path corrected `invocation_resolution.token_map` → `invocation.tokens`, and the described schema corrected from two arrays to one flat list. Also struck three `registry.json` pointers. Added: the six live lens→teammate migrations, the Frank/Fiona split incl. the immutable-slug token, the dictation near-miss pairs, the **unbuilt-name exception**, the live proof that the bare-name model holds (Maggie + Clio), and **earn-`auto`-don't-assume-it**.
- 2026-07-24: Added STEP 0 — roster-first resolution. Added the no-double-hop rule. Prompted by Michael ("how do we ensure that when i invoke any /agent-name that you go and read whatever ROSTER file you maintain").
- 2026-07-21: Added the Lens → git-teammate migration resolution rule (Anna). Prompted by Michael ("break it with beckett").
- 2026-07-20: Added the invocation-mode contract + per-agent soft-gate dial. Runbooks are standalone + directly invocable.
- 2026-07-19: Added the "Wes"/"/wes" collision resolution. Prompted by Michael (screenshot of the misfire).
- 2026-07-03: Initial version.
