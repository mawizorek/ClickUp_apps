# F1 Racetracks — semantic source companion

This folder is the **preferred agent-readable/editable source surface** for F1 Racetracks.

The live app still ships from `../index.html`, but this folder is the canonical source layout for understanding and updating the app without relying on the monolithic runtime file alone.

## Current state

- current live runtime target: **v5**
- runtime architecture: `index.html` engine + `data.json` externalized payload
- shell, styles, grouped data, and logic are split into named semantic source files
- grouped data files are still the main budget risk and need a future split pass

## Important rule

Read **`source_index.md` first** before editing.

## Documentation rule

When runtime structure, shell behavior, or live architecture changes, update the corresponding README / spec / runtime header comments in the same pass as the code change.

## Goal

Keep the runtime, source layout, and documentation surfaces aligned so future app work starts from the semantic source files, not from guesswork over the monolith.
