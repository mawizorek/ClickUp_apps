# Agent Invocation Gate

**Purpose:** Disambiguation layer for all subagent invocations. Prevents false-positive fires when Michael mentions a name in conversation that happens to match an agent name (Michael works with real people who may share agent names). **Also carries the invocation-mode contract** (bare name vs name+context), the per-agent soft-gate dial, and — as of 2026-07-24 — the **roster-first resolution step** (STEP 0 below).

**Mode:** Always-on (deterministic). Fires during the 🧠 Subagent evaluation step of the roster scan.

**Trigger:** Any agent name detected in user input.

---

## 📖 STEP 0 — Read the roster FIRST (LOCKED 2026-07-24, Michael)

**Before resolving ANY `/agent-name`, bare name, or nickname, READ `brain-config/super-agents/roster.json` and resolve the token against it.** This is the load-bearing first move and it is NOT optional. **The roster is ONE FLAT `agents[]` LIST covering the ENTIRE fleet** — every class in one array, each row carrying `class` (`super-agent` = holds a memory bundle · `agent` = stateless lens · `task-specific` · `retired`). Do NOT parse the `agents/` folder or guess from memory; the folder is the lens tree, not the index. **We maintain an index file for exactly this reason — use it.**

> ⚠️ **CORRECTED 2026-07-26.** This step previously told every reader to resolve via ~~`invocation_resolution.token_map`~~ and described ~~two arrays, `agents` + `council_lenses`~~. **Neither exists.** The correct field is **`invocation.tokens`**, and the two-array split was flattened into one list on 2026-07-25 (Q4 — the class boundary moves on every graduation, so class must never decide which array a row lives in). A wrong path in the FIRST move of every invocation is the worst possible place for rot: an agent following it literally finds nothing and falls back to guessing, which is precisely what STEP 0 exists to prevent.

> 📐 **THINNED 2026-07-27.** The roster is now an **index, not a directory**: it carries only what you need to decide *which record to open* — `slug`, `name`, `class`, `memory`, `status`, `invoke`, `aka`, `home`, plus `default_runbook`/`gate_strength` where they exist. **`lane`, `accent`, `from`, `seat`, `teams` were removed** because each duplicated a file that says it better (lane → the agent's own file, now the single authoritative source · seating → `council.md` + `teams/the-workshop.md` · lineage → git history). **Nothing this gate reads was touched.** Rows with NO home file (task-specific, retired) keep a one-line `lane`, because for those it is the only description anywhere.

Resolution sequence on any invocation:

1. **Read `roster.json`.** (Blob API per the GitHub read standard — never a carried-over copy.)
2. **Resolve the token** via `invocation.tokens` → the agent's `slug`, `class`, and `home`. Nicknames and dictation variants resolve here too. A **slug** is also always a valid token.
3. **Load that agent's home DIRECTLY.** `super-agent` → its bundle under `super-agents/<slug>/` via the persona load contract (`_shared/super-agent-base.md`). `agent` → its `agents/<slug>.md` profile.
4. **Then** apply the Pass rules below (name+intent vs narrative), the invocation-mode contract, and the soft gate.

**No forwarding.** Reading the roster is NOT invoking Felix, and a named call does NOT route through a steward. The roster is passive data; Felix is its steward, not a switchboard the traffic flows through. **A named call reaches the agent directly — no double-hop through Felix or Mira.** (Steward consultation is only for UNROUTED asks: structural "does an agent exist / who owns this lane" → Felix; verbal "get me the right voice now" → Mira.)

**Failure rule:** roster read fails → retry the blob API once, then say so. Token not in the roster → do NOT invent an agent; ask or treat as narrative. ~~If the roster and `registry.json` disagree, the roster wins~~ — **struck 2026-07-26: `registry.json` is a retired tombstone stub (PR #483). There is nothing left to disagree with; the roster is the only source.**

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
- **Memory Maggie** — bare name fires a read-only OMR review; writes need the explicit drain phrase. `gate_strength: auto`.
- **Closing Clio** — bare name fires a read-only mid-session health check; the write-heavy full close needs the close trigger. `gate_strength: auto`.

---

## 🔉 Soft gate — per-agent dial (`gate_strength`, LOCKED 2026-07-20, Michael)

Before auto-executing a full runbook on a bare-name call, an agent may hold a **soft gate** ("run the full routine, or are you driving?"). How hard it holds is **NOT global — it's a per-agent dial** declared in the roster row:

- **`gate_strength: auto`** — bare name runs the default runbook immediately, no confirm. Appropriate for cheap / idempotent / **read-only** routines.
- **`gate_strength: confirm`** — bare name surfaces a one-line "run the full <default> now?" before firing. The middle default for anything with cost or side effects.
- **`gate_strength: always-ask`** — never auto-runs; a bare name always asks what's wanted. For agents whose "thing" is fuzzy or whose official hat is less literally a routine.

⚠️ **`default_runbook` and `gate_strength` are READ ON EVERY BARE-NAME CALL and are not cosmetic roster decoration.** Deleting them does not error — it **silently changes behaviour** (a read-only door becomes an unguarded one). They survived the 2026-07-27 roster thinning for exactly this reason, after a Workshop pass nearly cut them; if a future slimming eyes them, that is the failure this note exists to stop.

**The spectrum is the point.** A personality running procedure sits toward `auto`; as agents get "official hats" that are less literally a fixed routine, they move toward `always-ask`. The dial makes that explicit and auditable instead of vibes. **Default when unset: `confirm`** (safe middle; never silently auto-fire a multi-step routine nobody asked to run).

**Earn `auto`, don't assume it** (added 2026-07-26): a brand-new agent's routine has no track record, and the original framing said a refresh "trends toward `auto` **once trusted**." So a new runbook-agent ships at `confirm` and graduates to `auto` after the routine has run clean a few times — unless it is READ-ONLY, which is trustworthy by construction (nothing to undo) and may start at `auto`, as Maggie and Clio both did.

---

## 🗣️ Dictation-aware resolution (Michael dictates on every device)

**Commands.** A near-miss command token resolves to the closest canonical invocation grammar rather than being read literally as a name. Canonical grammar = the three forms in `_shared/super-agent-base.md` → Command grammar, plus their literal rows in the AI Toolkit Quick-Scan table. ~~`registry.json → session_commands`~~ — **struck 2026-07-26: retired tombstone; it cannot register grammar.** Fuzzy aliases — `/command <Name>`, `/agent <Name>`, `/call <Name>` — route to `/session.agent=<Name>`, resolving `<Name>` via `roster.json` (STEP 0). Proceed with a one-line reading ("reading '/command Felix' as invoke Fleet Felix") when the name resolves; only ask when the token is genuinely unresolvable.

**Names.** A mangled NAME is also usually a transcription artifact, not a new agent — resolve it against `invocation.tokens` and state the reading. But there is one exception that matters:

> ⚠️ **A near-miss on an UNBUILT agent's name may be a RENAME, not a slip.** If the closest match is an agent that does not exist yet, its name is not locked and Michael's voice reaching for a different one is data (the naming convention requires a name that survives HIS dictation). **Resolve the referent, then ASK about the name before authoring any file** — the slug is immutable the moment it is written (Red Rhett lesson). For an agent that DOES exist, treat the near-miss as a slip and carry on (precedent: 2026-07-25, Michael said "fmp frank" twice hours after renaming her and confirmed the rename stands).

**Known live near-miss pairs** — resolve on exact spelling; if a spoken call is genuinely ambiguous between two LIVE agents, ask:
- **Clio** (`closing-clio`, session close) vs **Cleo** (`clever-cleo`, Workshop elegance lens). One vowel; homophones.
- **Dexter** (`dev-dexter`) vs **Dara** (`domain-dara`) — why "Dexter" was chosen over "Dex".
- **Sage** (`scout-sage`, research) vs **Renata** (`recon-renata`, repo audit) — separate investigator lanes; "Rita" was refused as a name to keep this map clean.

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

When a lens is migrated into a git-teammate, its old `agents/<slug>.md` becomes a **redirect tombstone** and the live agent moves to `super-agents/<slug>/`. **Resolve every live invocation to the `super-agents/` home directly** — same principle as the Wes rule: a tombstone is for historical link-resolution + context, never for routing fresh commands. (`invocation.tombstones` in the roster lists them. Per-agent lineage is **git history**, not a roster field — the `from` column was removed when the roster was thinned to an index on 2026-07-27.)

**Live migrations — all resolve to `super-agents/`:** Workhorse **Wes** (07-19) · Audit **Anna** (07-21, also auto-seizes on audit intent; her nickname "Audit" overlapping the command word is intentional) · Maestro **Mira** (07-21, also the DEFAULT front door when no agent is named) · Memory **Maggie** (07-25) · Scout **Sage** (07-25) · Closing **Clio** (07-25, also seated at every session close).

**Not a migration:** **FMP Fiona** has no tombstone — she was a native-track declaration rebuilt fresh on the git track, never a lens.

**General rule:** for any name with BOTH a tombstoned lens AND a live bundle, go straight to the `super-agents/` home.

---

## Rules

- **Roster first (STEP 0).** Every invocation resolves against `roster.json` before anything else, via `invocation.tokens`. Never parse the `agents/` folder or resolve from memory.
- **Nicknames count**, and so do slugs and dictation variants. All go through this gate.
- **Context wins.** If the conversation has been about a real person named [X] for several messages, a bare mention of [X] is almost certainly still about the person.
- **Command words are strong signals.** "run," "spin up," "deploy," "audit," "check," "review" + name = agent invocation.
- **Bare name = Mode A (context=null runbook)**, subject to `gate_strength`. No default defined → ask which routine.
- **The runbook is standalone + directly invocable.** "Run this process" pointed at the runbook doc == the bare-name call. The persona references the runbook; it never hardcodes it.
- **A migrated agent resolves to its `super-agents/` home, not its `agents/` tombstone.**
- **No double-hop.** A named call reaches the agent directly; it does not forward through Felix or Mira.
- **This gate is lightweight.** The roster read + resolution should take <1 second of reasoning. Don't turn it into a deliberation.
- **A retired/tombstoned agent is NEVER a live invocation target.**

---

## Composes with

- Fires as part of the 🧠 Subagent roster evaluation (inside the Roster Scan Planner's step 1).
- Does NOT apply to 🔄 Hooks or 🎯 Triggers (they have their own deterministic triggers).
- **Agent Name-Collision Gate** (`gates/agent-name-collision-gate.md`) is the WRITE-side counterpart: it forces a distinct invocation token when an agent is created or renamed. This gate is the read side. Opposite directions, same namespace.
- **Clarify First → Clara lens** owns the dictation-artifact reparse feeding the fuzzy-resolve above.
- **`super-agents/roster.json`** is the DATA this gate reads; **`roster.html`** renders it. ~~`registry.json` is the generated manifest mirror~~ — **struck 2026-07-26: retired tombstone stub, no mirror exists.**

---

## Changelog

- **2026-07-27: roster thinned to an index — STEP 0 note added, `from` pointer de-rotted.** The roster dropped `lane`/`accent`/`from`/`seat`/`teams` (each a lossy duplicate of a file that says it better); **nothing this gate reads changed.** Added the thinning note to STEP 0 so a reader knows the shape, repointed the migration section's lineage reference from the removed `from` field to git history, and added a ⚠️ to the soft-gate section recording that `default_runbook` + `gate_strength` are read on every bare-name call and were nearly cut in that pass — deleting them does not error, it silently un-guards a read-only door.
- **2026-07-26: STEP 0 DE-ROTTED — it was pointing at a field that does not exist.** Resolution path corrected `invocation_resolution.token_map` → **`invocation.tokens`**, and the described schema corrected from two arrays (`agents` + `council_lenses`) to the ONE flat `agents[]` list it has actually been since 2026-07-25. Also struck **three `registry.json` pointers** (failure rule, command grammar, Composes-with). Added: the six live lens→teammate migrations, the Frank/Fiona split incl. the immutable-slug token, the dictation near-miss pairs, the **unbuilt-name exception**, the live proof that the bare-name model holds (Maggie + Clio), and **earn-`auto`-don't-assume-it**.
- 2026-07-24: Added STEP 0 — roster-first resolution. Repointed the fuzzy-resolve + Composes-with from `superagents.json` to `roster.json`. Added the no-double-hop rule. Prompted by Michael ("how do we ensure that when i invoke any /agent-name that you go and read whatever ROSTER file you maintain").
- 2026-07-21: Added the Lens → git-teammate migration resolution rule (Anna). Prompted by Michael ("break it with beckett").
- 2026-07-20: Added the invocation-mode contract + per-agent soft-gate dial (`gate_strength`). Runbooks are standalone + directly invocable; the persona points at the runbook, never hardcodes it.
- 2026-07-19: Added the "Wes"/"/wes" collision resolution. Prompted by Michael (screenshot of the misfire).
- 2026-07-03: Initial version.
