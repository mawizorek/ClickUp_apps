# Mainstage Milo — Declaration Folder

**Slug:** `mainstage-milo` · **Track:** git-teammate (session-invocable, NOT a native ClickUp Super Agent)
**Status:** active · **Lane:** URITP Production Manager Assistant — knows the URITP workspace, runs its productions day-to-day.

Canonical metadata lives in [`../superagents.json`](../superagents.json). Do not mirror fields here.

## Files
- `preferences.md` — profile (base pointer + identity + voice + lane + load manifest). His whole role.
- `memory.md` — accumulated URITP + how-Michael-works context (not process).
- `activity-log.md` — rolling session ledger (newest on top).
- `decision-log.md` — reasoning about the agent itself.
- `working-notes.md` — legacy pre-rebuild scratch (superseded by the build; kept for provenance).
- `audits/<slug>.<date>.md` — dated audit records.

## Invocation
`/session.agent=Milo` (or `/session-start=Milo`) → loads the shared base + this bundle (deep steep) → announces `🎭 ═══ MILO · ON HEADSET ═══` → inhabits for the session. Runtime contract: [`../_shared/super-agent-base.md`](../_shared/super-agent-base.md). Built (not mirrored) via [`../../gates/git-teammate-lifecycle-runbook.md`](../../gates/git-teammate-lifecycle-runbook.md) from the [Definition Decision Log](https://app.clickup.com/36074068/docs/12cwjm-56933).

> Native ClickUp agent `-39940529` is superseded by this git-teammate — pending manual disable by Michael in the ClickUp UI.
