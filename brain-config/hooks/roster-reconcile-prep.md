# Roster Reconcile Prep · AI Toolkit — 🚧 STUB, BUILD LATER

**Purpose:** Parse the messy Default Inbox for enrollment-bearing threads (permission requests, professor class lists) and produce a CLEAN student/enrollment report that feeds INTO `hooks/roster-reconcile.md`. The prep hook does the domain-messy reading; the reconcile hook does the mechanical join. Two verbs, one seam — do NOT merge them.

**Steward:** Mainstage Milo (owns the inbox-reading seam).

**Mode:** On-demand routine (to be specced).

**Invocation (planned):** "prepare a roster reconcile handoff" · "prep the inbox for roster reconcile" · `/roster-reconcile-prep`.

**Trigger (planned):** Michael points Milo at the current Default Inbox and wants students + enrollments extracted before running the reconcile.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-31** by Brain as a registered stub. Floated alongside `roster-reconcile.md` and deliberately kept separate (the Sana/Milo prepare-vs-execute split).

---

## Status

🚧 **NOT YET BUILT.** Registered so the seam is documented and the reconcile hook can point at it. Build after `roster-reconcile.md` has real runs and the report shape it needs is known.

## Intended shape (to spec)

1. Sweep Default Inbox for enrollment-bearing threads.
2. Extract per student: name, email, pronouns, course named or inferred, requested vs registered signal.
3. Emit a clean report (the structured input `roster-reconcile.md` step 1 expects) and hand it over.
4. Never writes to STUDENTS/Enrollments itself — it only prepares. The reconcile hook owns all writes.

---

## Composes with

- `hooks/roster-reconcile.md` — the executor this feeds. This prepares structured input; that reconciles and writes.
- `EMAIL-TRIAGE` skill — the inbox operator method.

---

## Changelog

- **v0 (2026-08-31)** — Stub created by Brain. Seam documented; build deferred until the reconcile hook's report needs are proven in real runs.
