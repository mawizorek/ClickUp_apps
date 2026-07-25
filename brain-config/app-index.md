# 🪦 app-index.md — RETIRED 2026-07-25

> # ➡️ Read [`VERSIONS.md`](../VERSIONS.md) (repo root) instead.
>
> **It is now THE single source of truth for every app** — current version, status, live warnings, and the App Verify Gate procedure. This file has no data.

## Why it was retired

This file and `VERSIONS.md` **both opened by declaring themselves the source of truth for app versions.** Two claimants, one job.

The duplicate is what rotted. On 2026-07-25 this file still carried a remediation instruction dated **2026-07-07**: *"app-dashboard regressed; restore via revert of PR #59 + #57 pending."* Both reverts had landed on 07-08 and the feature was rebuilt cleanly afterward. The note had gone **32 PRs stale**, and an agent sent to "restore the dashboard" nearly executed it — **which would have destroyed 18 days of working code.**

That is the whole argument. A second index doesn't add redundancy, it adds a place for instructions to go bad quietly. Same failure class as the `roster.json` / `registry.json` split retired the same day.

## Where its content went

All of it merged into `VERSIONS.md`, nothing dropped:

- the app table (plus 4 apps that had never been indexed anywhere: `retrocast`, `report-normalizer`, `squash`, `Vectorworks`)
- the **App Verify Gate** procedure, including the **both-ways clause** (when the ledger and HEAD disagree, HEAD wins and the ledger gets corrected — a warning note rots exactly like a version number)
- the **version-stamp convention** (a real `APP_VERSION` or `?v=`, never a PR number, never "live")
- the **coverage rule** (every root folder is in the table or in the not-apps line — nothing invisible)
- the `f1-results` tombstone (it is f1-racetracks' nested data store, never a root app)

**Per-app version history is NOT in the ledger by design** — it lives in git history + PR descriptions + each app's own `README.md` / `next-build-spec.md`. The ledger stays under ~12KB so it remains readable-whole, and therefore writeable. It had already grown past that line, which is how this cleanup started.

## Do not

Do not resurrect this file, mirror the ledger here, or add app data below. If something still points at `brain-config/app-index.md`, **repoint it at `VERSIONS.md`.** Kept as a loud stub rather than deleted so a stale pointer fails visibly instead of silently serving a July-7 view of the world.
