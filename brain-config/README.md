# brain-config/

Versioned tool definitions for the AI Toolkit. The **concrete, diffable tool chunks** live here; the **guidance index + prose instructions** live in ClickUp (AI Toolkit page in the Brain Reference Library).

## The split

- **ClickUp = the routing layer.** The AI Toolkit index holds pointers, the trigger table, mode assignments, and prose instruction. Brain reads it on every pass. This is the source of truth for *what fires when*.
- **This repo = the runtime layer.** Each hook and subagent profile is a version-controlled markdown file. Commit history = the history of the tools we build. This is the source of truth for *what a tool actually does*.

Pointers cross-link the two. ClickUp names the tool + trigger; the repo file holds the full pass.

---

## Agent & Tool Surface Map (CANONICAL — the source-of-truth hierarchy)

**This section is the one authoritative answer to "where does an agent/tool actually live, and which copy wins?"** An agent is currently named or described across several surfaces. They are NOT peers. Each is exactly one of three kinds — **canonical** (authored here, wins on conflict), **generated** (mechanically derived; never hand-edit), or **projection** (a read-optimized copy that must never be the place you author). When two surfaces disagree, the canonical one is right and the other is drift.

### The layers (top wins)

| Surface | Kind | Owns / holds | Never |
|---|---|---|---|
| **Profile front-matter** — `agents/<slug>.md` YAML block | **CANONICAL (identity)** | `slug` (immutable), `display_name`, `nicknames`, `role`, `type`, `status`, `seat`, `accent` | — |
| **Metadata sidecar** — `agents/<slug>.metadata.json` | **CANONICAL (operational)** | the launcher + wiring fields the front-matter does NOT carry: `colloquialName`, `teams`, `badge`, `created`, `shortcut`, `launchPrompt`, `toggles` | must NOT re-author identity fields — those mirror the front-matter |
| **Profile body** — `agents/<slug>.md` prose | **CANONICAL (behavior)** | the full pass: Purpose, When-seated, the lens/question, Output, Personality, Standing-agent conduct, Changelog | — |
| **`registry.json`** | **GENERATED** | the concatenated manifest (identity from front-matter + operational from sidecars + team `members[]`) | hand-edit (regenerate from the two canonical sources) |
| **`council.md` / `teams/the-workshop.md`** | **PROJECTION (prose orchestration)** | who's seated when, seating map, verdict math, the Expression law's one-line mirror | be the place a role/status/name is *authored* — those derive from front-matter |
| **ClickUp AI Toolkit index** | **PROJECTION (hot-path routing)** | trigger table, mode assignment, the scannable status roster, one-line summaries Brain reads every pass | hold a full profile; author canonical content |
| **`team-standard.md`** | **PROJECTION (behavioral floor)** | shared methodology every agent operates above | maintain its own agent roster (point to registry/council instead) |
| **The viewer** — `custom-tools.html` + `source/*.js` | **GENERATED** | live UI, pulls from the GitHub API + `usage-log.json` at runtime | hand-edit agent data into it — it auto-discovers |

### Field ownership resolves the old contradiction

The front-matter and the sidecar overlap on identity fields, and two docs used to disagree about which was canonical (`metadata-schema.md` said "sidecar is source of truth"; the Tool Authoring Guidebook + this README said "front-matter is canonical"). **Resolved by splitting on field, not fighting over the record:**

- **Front-matter owns identity** — `slug` (immutable, = filename), `display_name`, `nicknames`, `role`, `type`, `status`, `seat`, `accent`. A rename touches `display_name` only. This is the newer immutable-slug lock and it WINS for these fields.
- **The sidecar owns operational wiring** the front-matter never carried — `colloquialName`, `teams`, `badge`, `created`, `shortcut`, `launchPrompt`, `toggles`. On the overlap fields the sidecar mirrors the front-matter; it does not re-author them.
- **`registry.json` is generated** from both. Never the author.

### The mirror pair (sanctioned duplication)

`registry.json` ↔ the ClickUp AI Toolkit index status roster are the ONE place git↔ClickUp duplication is required and correct (different readers: generated manifest vs. hot-path roster). Touch one, reconcile the other same-session, byte-for-byte where the field allows. Full mandate: the AI Toolkit index banner + `registry.json` `sync_mandate`. This is the exception that proves the rule — every OTHER cross-surface copy is drift to consolidate, not a mirror to maintain.

### Consolidation principle (how to keep this from rotting)

**Author once at the canonical layer; every other surface points or is generated.** Concretely:

1. A fact that is *authored* (a role, a status, a trigger phrase, a verdict rule) lives in exactly ONE canonical surface. Everything else references it.
2. A projection may carry a **one-line summary + a pointer** for readability/hot-path speed (e.g. the Expression law's one-liner in `council.md` pointing at `gates/session-transcript-gate.md`). That's a pointer, not a fork — it must not grow into a second copy of the full rule.
3. If you find the same authored fact maintained in two non-mirror places, one is trickle-down: delete it from the projection, point to the canonical home. The exemplar to copy is the Expression law (canonical in the transcript gate, one-line mirror in council, pointer in every profile).
4. The ONLY sanctioned full duplication is the registry ↔ ClickUp-index mirror pair above.

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

Anything read here costs an MCP round-trip when it fires. Build/research-time tools (Repo Auditor, Research Runner) pay that gladly since Brain is already in the repo. Hot-path tools that fire on every build (Red-Team Reviewer) keep their **trigger + one-line summary in the ClickUp index**; the full profile lives here and is loaded only when the gate actually opens.

## Profile Load Integrity (HARD STOP)

Before executing, an agent MUST load its own profile in full and verify the read is complete. This is a gate, not a preference.

- Read the whole file. Confirm it parses end-to-end: header present, all expected sections present, Changelog reached. A read that ends mid-section = truncated = FAIL.
- If the body is missing (metadata/SHA only), clipped at ~30KB, flattened, or otherwise partial, the load FAILED.
- On any failure: STOP. Do not proceed on a partial profile. NEVER reconstruct it from the Toolkit index summary, memory, or a prior session. The index one-liner is a pointer, not a substitute.
- Surface the blocker, name the failed read path, offer the fallback.

### Verified read path (LOCKED, 2026-07-04)

- **File bodies:** fetch the raw githubusercontent URL (`https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main/<path>`). The repo is PUBLIC; raw fetch works. This is the source of truth for reading any file body back.
- **`githubmcp_get_file_contents` returns metadata/SHA only on a file path, NOT the file body.** Use it for directory listings and blob SHAs, never as a body-read path. Assuming it returns a body is what caused the 2026-07-04 Renata false-audit incident.
