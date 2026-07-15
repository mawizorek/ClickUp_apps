# Scripts

Mirrors the FileMaker solution's *Manage Scripts* tree. **Subfolders match the actual FMP script-folder names** (imports, navigation, utilities, triggers, …). One file per script; a script's path here equals where it lives in the file.

## Format (per script)

Build-ready header (SCRIPT · ROLE · CALLED BY · CALLS · INPUTS · GLOBALS IN · RETURNS · GLOBALS OUT · SIDE EFFECTS) with `# --- SECTION ---` dividers → **Current Build** → **Design Notes** → **Candidate Upgrades** → **Related** → **Changelog**. See [utilities/commitRecord.md](./utilities/commitRecord.md) as the canonical example.

## Status

Only `commitRecord` is documented so far (shared standard helper). Real HML script inventory is **pending enumeration** from the FileMaker file — populate each into its mirrored folder as scripts are built/confirmed.
