# 🪦 TOMBSTONE — URITP Safety Pipeline

**This document was written here in error on 2026-08-07 and MOVED THE SAME HOUR.**

**Canonical home:**
[`mawizorek/uritp-docs` → `safety/safety-documentation-pipeline.md`](https://github.com/mawizorek/uritp-docs/blob/main/safety/safety-documentation-pipeline.md)

🚫 **Do not restore content here. Do not write URITP program documentation into `brain-config`.**

---

## Why it was wrong, kept because the failure is instructive

`brain-config` holds **the fleet's own machinery** — gates, hooks, agent bundles, orchestration. The
safety pipeline is **URITP program documentation**: it describes how a theatre department handles
standards, assessments and work-call cards. Its readers are the production office and eventually an
AHJ, not an agent. **`mawizorek/uritp-docs` already had a `safety/` tree with `programs/` in it,**
including a live `mewp-program.md` — the exact neighbourhood this belonged in.

**This is the SECOND instance of the failure the repo-referent gate exists to catch**
(`gates/repo-referent-gate.md`, born 2026-08-06 after "update the course info on the repo" silently
resolved here). The first instance produced a FERPA claim resting on the wrong repo's visibility.

**What actually went wrong, and it is not "forgot which repo exists":**

1. The gate requires the coordinate to be derived from the **SESSION SUBJECT**, restated before the
   first GitHub call. The coordinate WAS stated correctly at session open — for a session about
   agent config.
2. **The subject then moved.** It became URITP safety architecture and stayed there for hours.
   **The coordinate never moved with it, and nothing forced a re-check.**
3. Twelve consecutive writes to `brain-config` (memory, activity logs, team-standard) were all
   correct, which made the thirteenth feel correct. **A run of correct writes to one repo is not
   evidence the next one belongs there.**

⭐ **The generalized rule: the repo coordinate is re-derived when the SUBJECT changes, not when the
session opens.** Same shape as the seating rule locked hours earlier — *check at subject-turn, not at
session-open.* Two different systems, one failure mode, one afternoon.

**Provenance:** Michael, 2026-08-07, in session `86ajxa1dc`. Logged as **J8** on the Risk Assessment
CU Notes Decision Log.
