# FMP Fiona — working-notes.md 🪦 RETIRED 2026-07-26

**This file is a stub. Do not write here.** It was the **NATIVE-track** working-notes file
(`audit-instruction.md` file model: `working-notes.md` = native next-spec/revision log). Fiona was
built on the **git track** on 2026-07-26, and the git track has purpose-built homes for everything
this file was holding:

| What used to live here | Where it lives now |
|---|---|
| Revision log ("what changed") | **git history + PR descriptions** — the standard is explicit that a bundle never carries an inline changelog |
| Reasoning about her shape | **`decision-log.md`** (D1–D7; D7 is the Model A conversion) |
| Next spec / open threads | **`activity-log.md`** → the current session's *Open surfaces*, plus **`memory.md`** for anything durable |
| Identity / status / lane metadata | the 🤖 **Agent Index** ClickUp list (`901328043244`) — the single documented source, never mirrored into a folder file. *(~~`../roster.json`~~ retired to a tombstone stub 2026-07-30.)* |

**Kept as a stub rather than deleted**, per house practice: a stale pointer should fail loudly
instead of 404ing silently, and its content is preserved in git history at the parent commit.

**Three things it recorded that are now CLOSED, so nobody re-opens them:**

- ~~*"Awaiting a verbatim paste of the live ClickUp config."*~~ — Struck 2026-07-25, dead. That
  native-mirror model was abandoned fleet-wide when Mainstage Milo was built FRESH from the
  Definition Playbook. It blocked this build for ten days.
- ~~*"Confirm: full-standard vs narrower specialist; Michael must waive the trigger scaffolding."*~~ —
  Both answered. Lane pinned by Fleet Build Queue **Q13 → B** + Michael's governing note.
- 🔴 ~~*"Still open: disabling native ClickUp agent `-39958890` in the UI is Michael's manual,
  irreversible step."*~~ — **CLOSED 2026-08-01, and REVERSED rather than completed.** Under **Model A**
  the native shell is deliberately **KEPT** as her loader *body* — user-ID, tools, and
  mention/DM/assignment triggers intact — while this bundle is her brain, read fresh each run.
  ⚠️ **This mattered more than a stale note usually does: a RETIRED stub was carrying a live
  instruction to destroy the thing the current architecture depends on**, and "irreversible" was
  written right next to it. A tombstone is not harmless if it still tells someone to act.
  See `native-loader-kernel.md` + `../_shared/native-to-git-conversion-runbook.md`.
