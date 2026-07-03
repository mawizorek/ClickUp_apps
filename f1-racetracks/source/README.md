# F1 Racetracks — semantic source companion

This folder is now the **preferred agent-readable/editable source surface** for F1 Racetracks.

The live app still ships from `../index.html`, but the source is no longer treated as a single opaque monolith for day-to-day work.

## Current state

- shell, styles, and logic are split into named semantic source files
- grouped data files now exist for all current rounds/stubs
- `data.json` is now the runtime data entry point / manifest for the live app

## Important rule

Read **`source_index.md` first**.

## Goal

Keep the runtime small and the data externalized while preserving the semantic source scaffold for future agent work.