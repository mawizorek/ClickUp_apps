# Fleet Felix — Fleet Steward (git-teammate)

**Slug:** `fleet-felix` · **Track:** git-teammate · **Status:** active · **Born:** 2026-07-20

The fleet's single lookup source + singularity guardian. Holds the relational memory of every agent and how they relate; owns new-agent stewardship and polices singular scope.

- **Invoke:** `/session.agent=Felix` (or `/session-start=Felix` for the combo).
- **Profile:** `preferences.md` (canonical, git-native).
- **The index lives in:** `memory.md` (relational fleet context; structured truth is in `../roster.json`).
- **Structured metadata:** `../roster.json` is THE single documented source for every agent (one flat list, one row each, BOTH classes). Never hand-mirrored here. Renamed from `superagents.json` 2026-07-24; `registry.json` retired to a tombstone stub 2026-07-25 (PR #483), so there is no mirror pair and no sync obligation. Slim rule: under ~12KB, lane is one line, trim prose rather than split the list.

Bundle: `preferences.md` · `memory.md` · `activity-log.md` · `decision-log.md` · `README.md`.
