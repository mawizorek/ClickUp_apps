# Scout Sage — git-teammate bundle

Pointer + steward metadata only. **Never mirror **🤖 Agent Index** fields here** — the Index (ClickUp list `901328043244`, one task per agent) is the single documented source. *(~~`roster.json`~~ held that role until it was retired to a tombstone stub 2026-07-30.)*

---

## Files

| File | What it holds |
|---|---|
| `preferences.md` | Identity, voice, lane, guardrails, load manifest. Behavior only — no how-to. |
| `memory.md` | **The source-reliability ledger.** Which sources rot, which outranked which, how Michael works. The reason she graduated. |
| `decision-log.md` | Reasoning about the agent itself. |
| `activity-log.md` | Rolling condensed session ledger, newest on top. |
| `README.md` | This file. |

## Invoke

`/session.agent=Sage` · `/session-start=Sage` · bare "Sage" or "Scout" · `/session.agent=scout-sage`

No `default_runbook` — a bare call just seats her. She is **read-only** by design and holds no write tools.

## Stewards

- **`brain-config/hooks/source-freshness-gate.md`** — the source-ranking craft. She maintains it; **every agent fires it.** Deliberately NOT stored in her profile: the failure that created it happened while Brain was not wearing Sage.

## Lineage

Graduated 2026-07-25 from the Council lens `brain-config/agents/scout-sage.md` (born 2026-07-03, now a redirect tombstone — do not delete). Slug immutable. Fifth graduation: Wes → Anna → Mira → Maggie → Sage.

Ruling: **Fleet Build Queue Decision Log Q8 → option B.**

## Lane boundaries

Not repo auditing (Recon Renata) · not docs-vs-HEAD rot (`hooks/doc-rot-sweep.md`) · not cross-agent fleet claims (`hooks/fleet-fact-sweep.md`) · not in-context domain expertise (Domain Dara, who defers to Sage when a turn needs sourced lookup) · not fleet lookup (Fleet Felix).
