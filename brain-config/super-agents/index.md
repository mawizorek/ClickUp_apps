# Agent Roster Index

> ## 🎯 [`roster.json`](./roster.json) is THE single source of truth for every agent.
>
> **One flat list. One row per agent. One line each.** Super-agents, lenses, task-specific automations, and retirees all live in the same `agents[]` array, distinguished by a `class` field — never by living in different files. The Agent Invocation Gate reads it first on every named call ([STEP 0](../gates/agent-invocation-gate.md)).
>
> - **Data (edit here):** [`roster.json`](./roster.json)
> - **Pretty view:** [`roster.html`](./roster.html) — renders the flat list, grouped by class *in the view only*. Holds no data.
> - **`registry.json` is RETIRED** (2026-07-25) → a loud tombstone stub. It was a 2026-07-04 bootstrap manifest that predated git-teammates by eleven days, and by the end it couldn't be read whole at all. There is no second manifest. There is no mirror pair.

## Why ONE list and not two (LOCKED 2026-07-25, Michael)

**"I don't want agents to have to parse TWO lists to see all our agents. Our agents are not that different."**

A class split was proposed and **rejected**, for a reason worth keeping: Michael expects to **upgrade lenses to seated super-agents steadily** as memory and interaction mature. That makes the class boundary a *moving* line. If class determined which FILE a row lived in, every upgrade would be a file migration — and the roster would spend its life half-wrong. With one flat list, **an upgrade is a one-field edit.**

So the rule is: **one list, and keep it slim enough to stay editable forever.**

### Vocabulary (Michael's words, now the schema's words)

| `class` | What Michael calls it | Means |
|---|---|---|
| `super-agent` | "super agent" | Seated persona with a memory bundle under `super-agents/<slug>/`. Invocable, remembers across sessions. |
| `agent` | "agent" | A lens under `agents/<slug>.md`. Stateless — no memory yet. |
| `task-specific` | — | Narrow single-job ClickUp automation. Inventory only. |
| `retired` | — | Tombstone. Listed forever, never a live invocation target. |

**`class` = PERSISTENCE, never rank** (`_shared/super-agent-base.md` §6). Mira seats by LANE, not by class. An agent is upgraded for exactly one reason: **it needs memory.**

## 📏 The slim rule (non-negotiable — this is what broke)

**Keep `roster.json` under ~12KB. Lane is ONE line.**

No migration prose, no changelog, no full role text, no per-agent essays. Deep detail lives in the agent's own files (`super-agents/<slug>/` or `agents/<slug>.md`) and in git history. The roster is an **index**, not an archive.

**Why this is a correctness rule, not tidiness:** on 2026-07-25 the roster hit ~25KB and could no longer be read back whole by ANY path — base64 inflates past the ~30KB blob-API cap, and the raw path truncates and serves cache-frozen copies. Since a safe write requires the complete file body, **the roster became unwriteable, which blocked the agent-registration flow it exists to serve.** Dev Dexter shipped fully built but unregistered because of it. `registry.json` (~29KB) hit the same wall and could not even be verified.

> **A file that cannot be read whole cannot be safely edited.** The roster IS the registration path, so its size is load-bearing. Slimming to one-liners took it 25KB → ~14KB. Seat **Size Sally** before this file grows, not after it blocks a build.

If the roster ever approaches the cap again, the fix is **trimming prose**, not splitting the list.

## Invocation is roster-first (the enforcement)

Any named call — `/session.agent=X`, `/x`, a bare name, a nickname — resolves against `roster.json` FIRST (`../gates/agent-invocation-gate.md` STEP 0), then loads that agent's home directly. **No double-hop:** a named call reaches the agent, not Felix (steward) or Mira (switchboard). Reading the roster is not invoking Felix.

⚠️ **Corollary:** an agent missing from `roster.json` cannot be resolved, no matter how complete its bundle is. **Registration is not paperwork — it is the wiring.**

Three names — **Anna, Mira, Wes** — graduated lens → super-agent; their `agents/` files are tombstones and the live home is `super-agents/`. The roster draws that with `from`.

**Audit workflow:** [`audit-instruction.md`](./audit-instruction.md) — both tracks (native live-vs-declared mirror audit; git-teammate internal-consistency DoD). Per-agent declarations live in each bundle.

## Structure

```
brain-config/super-agents/
  roster.json                  # ★ THE single source — one flat list, one line per agent. Hand-edit this.
  roster.html                  # VIEW: renders roster.json, groups by class visually
  index.md                     # this pointer
  superagents.json             # REDIRECT STUB (renamed -> roster.json 2026-07-24)
  index.html                   # REDIRECT STUB (renamed -> roster.html 2026-07-24)
  audit-instruction.md         # the audit standard
  <slug>/                      # per super-agent bundle (only agents WITH memory get one)
    README.md                  # steward pointer metadata (never mirror roster.json fields)
    preferences.md             # canonical profile: identity + voice + lane. NO how-to.
    memory.md                  # accumulated context + tool pointers
    activity-log.md            # rolling session ledger (append-only)
    decision-log.md            # reasoning about the agent itself
    audits/<slug>.<date>.md    # dated audit records (via PR)
```

Lenses live at `../agents/<slug>.md`; the roster points at them. **Nothing duplicates the roster** — not this page, not a bundle README, not a doc.

## Adding an agent (the whole flow)

1. **Name-collision gate** (`../gates/agent-name-collision-gate.md`) — both namespaces, nicknames weighted equally.
2. **Authoring gate** (`../gates/git-agent-authoring.md`) — full bundle if it needs memory; a single `agents/<slug>.md` if it's a lens.
3. **One row in `roster.json`.** One line. This is the wiring — without it, STEP 0 can't find it.
4. **A trigger row in the AI Toolkit index** if it has firing behavior worth routing on.
5. Branch → PR → self-merge.

That's it. No mirror, no second manifest, no sync obligation.

## Changelog

- 2026-07-25: **SINGLE SOURCE.** `roster.json` slimmed 25KB → ~14KB and restructured into ONE flat `agents[]` list of one-liners (the two-array `agents`/`council_lenses` split is gone; `roster.html` now groups by class in the view only). **`registry.json` RETIRED** to a tombstone stub — it was a 2026-07-04 bootstrap manifest predating git-teammates, and was unreadable/unverifiable by the end. **The 2026-07-17 Mirror-Pair Sync Mandate retires with it.** Class vocabulary aligned to Michael's words (`super-agent` / `agent`). **Dev Dexter registered** (the registration the read-cap wall had blocked). Slim rule locked. Michael's Q4 ruling, Fleet Build Queue Decision Log.
- 2026-07-25: Dev Dexter built (Build & Engineering Lead) — bundle merged PR #475, roster row initially blocked by the read-cap wall, landed here.
- 2026-07-24: **Class parity** — `class` means persistence, never rank; Mira seats by lane, not tier; graduation requires exactly one justification (needs MEMORY). Governing text: `_shared/super-agent-base.md` §6 + `../orchestration.md`.
- 2026-07-24: **Combined roster.** `superagents.json` → `roster.json`, expanded to hold both classes + the invocation token map. `index.html` → `roster.html`. Redirect stubs left at the old paths.
- 2026-07-21: noted the two audit tracks + corrected the git-teammate file model (preferences is canonical for a teammate, not a live-config mirror).
- 2026-07-15: index split into data + renderer; this file reduced to a pointer. Fleet index created in Git (moved off ClickUp).
