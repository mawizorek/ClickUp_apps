# Fleet Felix — Fleet Steward (git-teammate)

**Slug:** `fleet-felix` · **Track:** git-teammate · **Status:** active · **Born:** 2026-07-20

The fleet's single lookup source + singularity guardian. Holds the relational memory of every agent and how they relate; owns new-agent stewardship and polices singular scope.

- **Invoke:** `/session.agent=Felix` (or `/session-start=Felix` for the combo).
- **Profile:** `preferences.md` (canonical, git-native).
- **The index lives in:** `memory.md` (relational fleet context; structured truth is in the 🤖 **Agent Index** ClickUp list).
- **Structured metadata:** the 🤖 **Agent Index** ClickUp list is THE single documented source for every agent — **one TASK per agent**, both classes, fields `Slug` · `Class` · `Memory` · `Invoke` · `AKA` · `Home` · `Lane` · `default_runbook` · `Gate Strength` · `Instructions`. Never hand-mirrored here. Resolve a token by querying that list, never by reading a file.

> ⚠️ **Corrected 2026-08-01 (doc rot).** This file used to name <s>`../roster.json`</s> as the single structured source. **It was retired to a tombstone stub on 2026-07-30** (Michael: *"it's a table. not a doc."*), alongside `roster.html`; `registry.json` went on 07-25. **Three retired manifests.** A stub returns empty, so a naming or wiring check run against it clears every collision silently — which is exactly the failure the Agent Name-Collision Gate exists to prevent. The slim rule that used to govern that file is retired with it: **a list has fields, a document has an unbounded free-text area.** Do not create a file alongside the list to mirror it.

Bundle: `preferences.md` · `memory.md` · `activity-log.md` · `decision-log.md` · `README.md`.
