# Scripts

Mirrors the FileMaker solution's *Manage Scripts* tree. **Subfolders match the actual FMP script-folder names** (imports, navigation, utilities, triggers, …). A script's path here equals where it lives in the file.

## The model (standard v1.4)

Scripts ride the calc externalization model:

- **Body:** `<folder>/<ScriptName>.fmscript` — lean plain text: the exact steps to dictate into *Manage Scripts*, with narrative carried as native `#` comment lines (role, when-to-use, design notes, changelog). No prose markdown per script.
- **Master index:** `_index.json` — ONE manifest for the whole tree, a flat `scripts[]` array. Minimal rows only: `name`, `folder`, `calls[]`, `scriptRef`. The renderer builds the folder tree from each row's `folder` and the CALLS / CALLED-BY graph from `calls[]`. `calledBy` is DERIVED at render time (inverting `calls[]`), never stored.
- **Renderer (build-session work):** reads `_index.json` to list + graph; lazy-loads one `.fmscript` body only when you drill into that script. Adding scripts or folders is data-only — never a renderer change.

**Dictation, not paste-round-trip.** Unlike a `.fmcalc` (which pastes back into the calc dialog verbatim), FileMaker's script clipboard is an XML snippet, so a `.fmscript` is the human-legible reference you TYPE/dictate into *Manage Scripts*, not a paste-back artifact. Legibility over round-trip is the deliberate trade.

See [utilities/commitRecord.fmscript](./utilities/commitRecord.fmscript) as the canonical example.

## Status

Only `commitRecord` is documented so far (shared standard helper). Real HML script inventory is **pending enumeration** from the FileMaker file (a live-file DDR pass) — add each into its mirrored folder as a `.fmscript` body + a row in `_index.json`.
