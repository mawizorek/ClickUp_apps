# gcal-reconcile.md — 🪦 TOMBSTONE (renamed 2026-08-31)

**This file is retired.** Its content split into two live files during the reconcile-engine refactor:

- **`brain-config/hooks/reconcile-engine.md`** — the domain-blind loop, the four findings, the
  passes, and every guardrail.
- **`brain-config/hooks/prod-cal-reconcile.md`** — the CALENDAR manifest (ClickUp · Google · Info
  Sheet): surfaces, routing, automations, normalization, declared source-of-truth.

**Why renamed:** the hook reconciles ClickUp + Google + the Info Sheet — it was never just gcal.
The `/gcal-reconcile` slash command survives as a LEGACY ALIAS on the calendar manifest, so old
invocations still resolve. Provenance: Reconcile Engine Decision Log (2026-08-31), Q3.

🚫 Do not add content here. Do not resurrect this as a working hook — three retired manifests are
the evidence that a tombstone that grows content back is a trap.
