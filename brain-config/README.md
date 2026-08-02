# brain-config/

Versioned tool definitions for the AI Toolkit. The **concrete, diffable tool chunks** live here; the **guidance index + prose instructions** live in ClickUp (AI Toolkit page in the Brain Reference Library).

## The split

- **ClickUp = the routing layer.** The AI Toolkit index holds pointers, the trigger table, mode assignments, and prose instruction. Brain reads it on every pass. This is the source of truth for *what fires when*.
- **This repo = the runtime layer.** Each hook and subagent profile is a version-controlled markdown file. Commit history = the history of the tools we build. This is the source of truth for *what a tool actually does*.

Pointers cross-link the two. ClickUp names the tool + trigger; the repo file holds the full pass.

---

## Agent & Tool Surface Map (CANONICAL — the source-of-truth hierarchy)

**This section is the one authoritative answer to "where does an agent/tool actually live, and which copy wins?"** An agent is named or described across several surfaces. They are NOT peers. Each is exactly one of three kinds — **canonical** (authored here, wins on conflict), **generated** (mechanically derived; never hand-edit), or **projection** (a read-optimized copy that must never be the place you author). When two surfaces disagree, the canonical one is right and the other is drift.

### The layers (top wins)

| Surface | Kind | Owns / holds | Never |
|---|---|---|---|
| **Profile front-matter** — `agents/<slug>.md` YAML block | **CANONICAL (identity)** | `slug` (immutable), `display_name`, `nicknames`, `role`, `type`, `status`, `seat`, `accent` | — |
| **Metadata sidecar** — `agents/<slug>.metadata.json` | **CANONICAL (operational)** | the launcher + wiring fields the front-matter does NOT carry: `colloquialName`, `teams`, `badge`, `created`, `shortcut`, `launchPrompt`, `toggles` | re-author identity fields — those mirror the front-matter |
| **Profile body** — `agents/<slug>.md` prose | **CANONICAL (behavior)** | the full pass: Purpose, When-seated, the lens/question, Output, Personality, Standing-agent conduct, Changelog | — |
| **Bundle profile** — `super-agents/<slug>/preferences.md` | **CANONICAL (behavior)** | a git-teammate's full role, voice, lane, guardrails, load manifest | hold structured metadata the Index owns |
| **The 🤖 Agent Index** — ClickUp list `901328043244` | **CANONICAL (the fleet)** | ONE TASK per agent, both classes — `Slug` · `Class` · `Memory` · `Invoke` · `AKA` · `Home` · `Lane` · `default_runbook` · `Gate Strength` · `Instructions` + native status. What the Agent Invocation Gate reads at STEP 0. | be mirrored into a file. **A list has fields; fields refuse essays** — that is the whole reason it is not a document |
| **`council.md` / `teams/*`** | **PROJECTION (prose orchestration)** | who's seated when, seating map, verdict math, the Expression law's one-line mirror | be the place a role/status/name is *authored* |
| **ClickUp AI Toolkit index** | **PROJECTION (hot-path routing)** | trigger table, mode assignment, one-line summaries Brain reads every pass | hold a full profile; author canonical content |
| **`team-standard.md`** | **PROJECTION (behavioral floor)** | shared methodology every agent operates above | maintain its own agent roster (point at the Index instead) |
| **The viewer** — `custom-tools.html` + `source/*.js` | **GENERATED** | live UI, pulls from the GitHub API + `usage-log.json` at runtime | hand-edit agent data into it — it auto-discovers |

⚠️ **CORRECTED 2026-08-01, and the placement is the point.** This table listed ~~`super-agents/roster.json`~~ as **CANONICAL (the fleet)** with a ~12KB size budget attached, **two days after that file was retired to a tombstone stub** (2026-07-30, with `roster.html`; `registry.json` 07-25; `superagents.json` renamed then retired). **Four retired manifests.** The map that teaches this house how to reason about canonical-vs-projection was itself naming a corpse as canonical — which is exactly the drift it exists to catch, and a reader who trusted it would have registered a new agent into a file nobody reads.

### Field ownership resolves the old contradiction

The front-matter and the sidecar overlap on identity fields, and two docs used to disagree about which was canonical. **Resolved by splitting on field, not fighting over the record:**

- **Front-matter owns identity** — `slug` (immutable, = filename), `display_name`, `nicknames`, `role`, `type`, `status`, `seat`, `accent`. A rename touches `display_name` only.
- **The sidecar owns operational wiring** the front-matter never carried. On overlap fields the sidecar mirrors; it does not re-author.

### The mirror pair is RETIRED (2026-07-25, and it went further on 07-30)

**`registry.json` is retired to a tombstone stub, and the registry-to-ClickUp-index mirror mandate retires with it.** It was a bootstrap manifest generated 2026-07-04 — eleven days before `super-agents/` existed — and by the end it had grown past readable-whole, so it could be neither verified nor safely rewritten.

~~There is now ONE fleet record: `super-agents/roster.json`.~~ **→ SUPERSEDED 2026-07-30: that file was retired too.** The fleet record is the **🤖 Agent Index ClickUp list**. The deeper lesson is not "pick the right file" — it is that **a 39-record table simulated by a text file has to be read WHOLE on every lookup**, which forced a size cap the file never once met and eventually shipped an agent built-but-unregistered. Michael: *"it's a table. not a doc."*

**Consequence: there is no sanctioned full duplication anywhere.** The old text here called the mirror pair "the exception that proves the rule." The exception is gone; the rule stands alone. **Every cross-surface copy of an authored fact is drift to consolidate, not a mirror to maintain.** Do not resurrect a file to mirror the list.

### Consolidation principle (how to keep this from rotting)

**Author once at the canonical layer; every other surface points or is generated.** Concretely:

1. A fact that is *authored* (a role, a status, a trigger phrase, a verdict rule) lives in exactly ONE canonical surface. Everything else references it.
2. A projection may carry a **one-line summary + a pointer** for readability/hot-path speed (e.g. the Expression law's one-liner in `council.md` pointing at `gates/session-transcript-gate.md`). That's a pointer, not a fork — it must not grow into a second copy of the full rule.
3. If you find the same authored fact maintained in two places, one is trickle-down: delete it from the projection, point to the canonical home. The exemplar to copy is the Expression law (canonical in the transcript gate, one-line mirror in council, pointer in every profile).
4. **Two collapses on 2026-07-25 prove the cost of ignoring this:** `registry.json` vs `roster.json`, and `brain-config/app-index.md` vs `VERSIONS.md`. Both times two surfaces each declared themselves the source of truth, and both times **the duplicate was the copy that rotted** — the app-index one carried a stale destructive instruction for 32 PRs. Two claimants means one is quietly wrong.
5. 🔴 **COLLAPSING TO ONE SOURCE DOES NOT END THE WORK — every pointer AIMED at the loser has to move, in the same pass** (added 2026-08-01). When `roster.json` was retired on 07-30, **26 files were still reading it as live two days later**: the shared base spec (so every teammate's wiring check ran against nothing), the audit DoD (so its roster check auto-PASSED), the Fleet Steward's own profile, this README, and a tombstone whose redirect pointed at it. **A pointer into a tombstone fails SILENTLY — the empty read is indistinguishable from a clean pass**, which is why none of it surfaced on its own. Retiring the file is the easy half. Tools: `hooks/doc-rot-sweep.md` (test C) and `hooks/fleet-fact-sweep.md`.

### Personalization-seam exception (NOT trickle-down — do not consolidate away)

One case that LOOKS like trickle-down but is deliberate: the **4-line Standing-agent conduct block carried in every agent profile** (+ `_template.md` seeds it, `council.md` states the roster-wide version). This is NOT a fact duplicated across projections — it is a **shared starting point each agent is meant to personalize in its own voice.** The four directives (have a personality / make a comment / own your lane / read the room + reply by name) are identical *as seeds*; the value is that each profile then diverges — Rhys's "read the room" cites failure modes, Beckett's aims his hammer at a colleague's claim, Mira's is her synthesis naming voices. **That per-agent divergence is where the block earns its keep** (Michael, 2026-07-17).

- **Keep it in every profile.** An agent that loads only its own profile (Profile Load Integrity, below) must see its conduct rules without a second fetch — a pointer would break that.
- **Personalize, don't clone.** Verbatim copies are the floor, not the goal.
- **Auditors: do NOT strip these as "duplication."** Explicitly exempt from consolidation-principle rule 3.

---

## Layout

```
brain-config/
├── hooks/     # deterministic guards that fire on a condition
│   ├── secrets-pii-guard.md
│   └── source-size-budget-enforcer.md
└── agents/    # subagent profiles: workers with their own context + scoped tools
    ├── <slug>.md            # profile: front-matter (identity) + body (behavior)
    └── <slug>.metadata.json # sidecar: operational wiring
```

## File format

Every file follows the AI Toolkit tool-page skeleton: **Purpose · Mode · Invocation · Trigger · Pass · Output · Composes with / overrides · Examples · Changelog.** One tool per file. Filenames are kebab-case, stable (version lives in the header + changelog, never the filename).

## Hot-path note

Anything read here costs an MCP round-trip when it fires. Build/research-time tools (Repo Auditor, Research Runner) pay that gladly since Brain is already in the repo. Hot-path tools that fire on every build keep their **trigger + one-line summary in the ClickUp index**; the full profile lives here and is loaded only when the gate actually opens.

## Profile Load Integrity (HARD STOP)

Before executing, an agent MUST load its own profile in full and verify the read is complete. This is a gate, not a preference.

- Read the whole file. Confirm it parses end-to-end: header present, all expected sections present, Changelog reached. A read that ends mid-section = truncated = FAIL.
- If the body is missing (metadata/SHA only), clipped at ~30KB, flattened, or otherwise partial, the load FAILED.
- On any failure: STOP. Do not proceed on a partial profile. NEVER reconstruct it from the Toolkit index summary, memory, or a prior session. The index one-liner is a pointer, not a substitute.
- Surface the blocker, name the failed read path, offer the fallback.
- ⚠️ **An EMPTY read is a failure too, and it is the one that gets through** (2026-08-01). A retired stub returns valid content of zero value: the fetch succeeds, nothing parses as wrong, and the check that depended on it reports success. **Verify the target still HOLDS what you came for, not merely that it resolved.**

### Verified read path (CORRECTED 2026-07-25 — supersedes the 2026-07-04 lock)

⚠️ **The previous version of this section was stale and actively dangerous.** It named the raw githubusercontent branch URL as "the source of truth for reading any file body" and claimed `get_file_contents` returns metadata only. Both were superseded on 2026-07-09 and disproved again on 2026-07-25. **A lock date is not a freshness guarantee: on two conflicting locks, the newer one plus live evidence wins.**

**Canonical read ladder — the `GitHub MCP — Operating Standard` (LOCKED 2026-07-09) owns this. Work it in order:**

1. **Git blob API (PRIMARY, always first).** Get the blob SHA from a `get_file_contents` directory listing, then fetch `https://api.github.com/repos/<owner>/<repo>/git/blobs/<sha>` and base64-decode `content`. Content-addressed, immutable, never cache-frozen, and it does NOT flatten HTML/SVG. **Re-fetch before any decision or write; never reuse a carried SHA.**
2. **`get_file_contents`** — use for directory listings and the blob SHAs that feed step 1 (and the SHA required to commit an update). Do not depend on it for file bodies.
3. **Raw / branch fetch (LAST RESORT).** Cache-unreliable AND it flattens markup out of template literals. Never let a decision or write depend on it.

**Why raw was demoted (evidence, not theory):** a raw read of `inciardi-market/source/app-core.js` on `main` returned v10.1 / PR #174 while `main` was actually on v15 / PR #455. On 2026-07-25 a raw read of `registry.json` returned a ~10KB 2026-07-04 document while the real blob on `main` was ~29KB, and a live Pages fetch returned a layout that does not exist in the repo. **Raw is a cache, not a source.**

**Base64 inflation caveat (2026-07-25):** base64 adds ~33%, so the blob API cannot return a file much over ~22KB of real bytes inside the ~30KB response cap. A file too large to read whole **cannot be safely edited** — which is why canonical hand-maintained files carry hard size budgets (`_shared/super-agent-base.md`, `VERSIONS.md`), and why the false-audit class of incident recurs whenever a partial read is treated as a whole one.

⚠️ **And never write a size figure you have not read back** (2026-08-01): nine commit messages in one session stated a byte count that was wrong on arrival, including one claiming a trim on a file it grew 26%. **A size budget enforced by estimate is not enforced.**
