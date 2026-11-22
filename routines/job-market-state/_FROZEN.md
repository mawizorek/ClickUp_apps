# FROZEN · 2026-11-22

These lane TSVs are no longer the job-market database. **Do not write, append to, commit or create any file in this folder.**

State lives in ClickUp:

- **Job Census** list `1400600000006272`: one task per posting per board.
- **Lanes** list `1400600000006271`: one task per lane. `Last Pass` is the role-boundary stamp.

These files stay as read-only history, plus one job: **migrate-on-first-touch.** The first pass that reaches a lane with no census rows reads that lane's `live` rows here once, as its baseline, then writes them into the census. After that the file is never read again.

Already migrated: `production-manager.tsv` (2026-11-21).

Procedure: `routines/job-market-refresh.md` v20, "v20 CUTOVER" and "Census schema". Liveness: `brain-config/hooks/source-freshness-gate.md` Rule 7.
