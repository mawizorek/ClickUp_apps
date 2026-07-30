# Agent Roster Index

> ## 🎯 The ClickUp list **🤖 Agent Index** is THE single source of truth for every agent.
>
> **Open it: https://app.clickup.com/36074068/v/li/901328043244** (list id `901328043244` — the query handle; everything an agent READS is keyed on name + slug). One task per agent. Super-agents, lenses, task-specific automations and retirees all live in the same list, distinguished by the `Class` field and the native status, never by living in different places. The Agent Invocation Gate queries it first on every named call ([STEP 0](../gates/agent-invocation-gate.md)).
>
> - **Data (edit here):** the Agent Index list. Add a row, fill the fields, done.
> - **Renderer:** a ClickUp view. There is no HTML renderer to maintain any more.
> - **Bundles stay in git**, under `super-agents/<slug>/`. Only RESOLUTION moved. The row's `Home` field points back here.

## 🪦 Retired 2026-07-30: `roster.json` — because it was a table pretending to be a document

> Michael: *"it's a table. not a doc."* → *"declare this index the sole truth."*

**~~`roster.json`~~ and ~~`roster.html`~~ are now tombstone stubs. Do not read them for resolution, do not add an agent to them, do not restore them.**

The reason is not preference, it is arithmetic. A 39-record table was being simulated by a text file that had to be read **whole** on every lookup, because no range read exists. That forced a ~12KB ceiling, and here is the file's entire life against its own rule:

| Date | Size | Event |
|---|---|---|
| 07-25 | 24.8 → **14.4KB** | PR #483 — "slim to ONE flat list of one-liners." The trim that created the 12KB rule. Already over it. |
| 07-26 | **21.1KB** | Regrew **+6.7KB in one day** under normal fleet work. Trimmed again (`5c3a8cc`). |
| 07-26 | — | Trimmed again (`66fdb06` — names-not-numbers note → pointer). |
| 07-26 | — | Trimmed twice more in one commit (`78d1c92` — slim_rule prose; the file storing its own size). |
| 07-27 | 18.4 → **13.18KB** | PR #559 — "thin to an INDEX." Still over. |
| 07-30 | **13.67KB** | One row added. Still over. Retired. |

**Six trim actions, five commits, four days, and it was NEVER ONCE under its own cap.** Trimming a document does not hold, because a document has an unbounded free-text area and no schema to refuse an essay. The next agent with context to record always fills it back in.

**This is the third retired manifest** (`registry.json` 07-25, `superagents.json` renamed 07-24 then orphaned). Michael's standing ruling holds: **no pair means no sync obligation.** 🚫 **Never create a file alongside the list to mirror it.**

## Why ONE index and not two (LOCKED 2026-07-25, Michael)

**"I don't want agents to have to parse TWO lists to see all our agents. Our agents are not that different."**

A class split was proposed and **rejected**, for a reason worth keeping: Michael expects to **upgrade lenses to seated super-agents steadily** as memory and interaction mature. That makes the class boundary a *moving* line. If class determined where a row lived, every upgrade would be a migration. In one list, **an upgrade is a one-field edit.** That reasoning survived the move to ClickUp intact.

### Vocabulary (Michael's words, now the schema's words)

| `Class` | What Michael calls it | Means |
|---|---|---|
| `super-agent` | "super agent" | Seated persona with a memory bundle under `super-agents/<slug>/`. Invocable, remembers across sessions. |
| `agent` | "agent" | A lens under `agents/<slug>.md`. Stateless — no memory yet. |
| `task-specific` | — | Narrow single-job automation. Inventory only. |
| `retired` | — | Tombstone. Listed forever, never a live invocation target. |

**`Class` = PERSISTENCE, never rank** (`_shared/super-agent-base.md` §6). Mira seats by LANE, not by class. An agent is upgraded for exactly one reason: **it needs memory.**

## 📏 The slim rule — RETIRED, and that is the whole point

**There is no size ceiling any more, because nothing is read whole.** A single-row query costs a fraction of what pulling the file cost, and adding the 100th agent costs the same as adding the 40th.

The ceiling was never tidiness — it was the bug. At ~25KB the roster could not be read back whole by ANY path (base64 inflates past the ~30KB blob cap; the raw path truncates and serves cache-frozen copies), and a safe write requires the complete body. **The roster became unwriteable, which blocked the registration flow it existed to serve, and Dev Dexter shipped fully built but unregistered because of it.**

⚠️ **The failure mode did not disappear, it MOVED.** A list cannot bloat, but a single field can: **`Lane` is one line, hard rule**, and no long-form description field may be added. If prose starts appearing in task descriptions beyond a one-line pointer, the problem has been rebuilt inside ClickUp and this entire migration was theatre. Seat **Size Sally** if anyone proposes a new text field here.

## Invocation is index-first (the enforcement)

Any named call — `/session.agent=X`, `/x`, a bare name, a nickname — resolves against the **Agent Index** FIRST (`../gates/agent-invocation-gate.md` STEP 0), then loads that agent's home directly. **Query the ONE row you need**; pulling the whole list rebuilds the problem. **No double-hop:** a named call reaches the agent, not Felix (steward) or Mira (switchboard).

⚠️ **Corollary, unchanged and now cheaper to satisfy:** an agent missing from the Index cannot be resolved, no matter how complete its bundle is. **Registration is not paperwork — it is the wiring.**

Six names — **Anna, Mira, Wes, Maggie, Sage, Clio** — graduated lens → super-agent; their `agents/` files are tombstones and the live home is `super-agents/`. The row's `Home` field always names the LIVE home. **Fiona, Ricky and Tate have no tombstone** — none was ever a lens. Lineage is git history, not a field.

**Audit workflow:** [`audit-instruction.md`](./audit-instruction.md) — both tracks (native live-vs-declared mirror audit, currently dormant; git-teammate internal-consistency DoD). Per-agent declarations live in each bundle.

## Structure

```
brain-config/super-agents/
  index.md                     # this pointer
  roster.json                  # 🪦 TOMBSTONE STUB (retired 2026-07-30) — do not restore
  roster.html                  # 🪦 TOMBSTONE STUB (retired 2026-07-30) — a ClickUp view is the renderer
  superagents.json             # 🪦 REDIRECT STUB (renamed -> roster.json 2026-07-24, orphaned 07-30)
  index.html                   # 🪦 REDIRECT STUB (renamed -> roster.html 2026-07-24, orphaned 07-30)
  audit-instruction.md         # the audit standard
  _shared/super-agent-base.md  # how to BE a teammate (the runtime contract)
  <slug>/                      # per super-agent bundle (only agents WITH memory get one)
    README.md                  # steward pointer metadata (never mirror Index fields)
    preferences.md             # canonical profile: identity + voice + lane. NO how-to.
    memory.md                  # accumulated context + tool pointers
    activity-log.md            # rolling session ledger (append-only)
    decision-log.md            # reasoning about the agent itself
    audits/<slug>.<date>.md    # dated audit records (via PR)
```

Lenses live at `../agents/<slug>.md`; the Index points at them. **Nothing duplicates the Index** — not this page, not a bundle README, not a doc.

## Adding an agent (the whole flow)

1. **Name-collision gate** (`../gates/agent-name-collision-gate.md`) — the Index namespace, nicknames weighted equally.
2. **Authoring gate** (`../gates/git-agent-authoring.md`) — full bundle if it needs memory; a single `agents/<slug>.md` if it's a lens.
3. **One row in the Agent Index.** This is the wiring — without it, STEP 0 can't find it.
4. **A trigger row in the AI Toolkit index** if it has firing behavior worth routing on.
5. Branch → PR → self-merge for the bundle.

That's it. No mirror, no second manifest, no sync obligation.

## Changelog

- **2026-07-30: THE INDEX IS A CLICKUP LIST.** `roster.json` + `roster.html` retired to tombstone stubs; resolution is a single-row query against 🤖 Agent Index. Michael: *"it's a table. not a doc."* The slim rule is retired because the ceiling it enforced no longer exists — replaced with a one-line-Lane rule and a standing warning that prose can still colonize a field. Third retired manifest; the never-mirror ruling restated.
- 2026-07-25: **SINGLE SOURCE.** `roster.json` slimmed 25KB → ~14KB and restructured into ONE flat list of one-liners. **`registry.json` RETIRED** to a tombstone stub. **The 2026-07-17 Mirror-Pair Sync Mandate retires with it.** Class vocabulary aligned to Michael's words. **Dev Dexter registered** (the registration the read-cap wall had blocked). Michael's Q4 ruling, Fleet Build Queue Decision Log.
- 2026-07-25: Dev Dexter built (Build & Engineering Lead) — PR #475, roster row initially blocked by the read-cap wall.
- 2026-07-24: **Class parity** — `class` means persistence, never rank; Mira seats by lane, not tier; graduation requires exactly one justification (needs MEMORY).
- 2026-07-24: **Combined roster.** `superagents.json` → `roster.json`, expanded to hold both classes. `index.html` → `roster.html`.
- 2026-07-21: noted the two audit tracks + corrected the git-teammate file model.
- 2026-07-15: index split into data + renderer; this file reduced to a pointer. Fleet index created in Git (moved off ClickUp).
