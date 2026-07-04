# _template-tool

The canonical starting point for a new brain tool's metadata. Copy the relevant default block out of `template.metadata.json`, drop it next to the tool as `<slug>.metadata.json`, and fill it in.

- **Agent:** copy `_defaults.agent`. Lives at `agents/<slug>.metadata.json` beside the `<slug>.md` profile.
- **Hook:** copy `_defaults.hook`. Lives at `hooks/<slug>.metadata.json`.
- **Trigger:** copy `_defaults.trigger`. Triggers have no profile prose, so the sidecar stands alone (target folder decided in the trigger-file-backing segment).

Field meanings live in `../metadata-schema.md`. The `toggles` object on agents is open-ended: add a boolean and it shows up as a checkbox in the config UI, no schema change needed.

This file mirrors the app-level `template-app/` idea one layer down: `template-app/` scaffolds an APP; `_template-tool/` scaffolds a TOOL's metadata record.
