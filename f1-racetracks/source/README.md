# F1 Racetracks — semantic source companion

This folder is now the **preferred agent-readable/editable source surface** for F1 Racetracks.

The live app still ships from `../index.html`, but the source is no longer treated as a single opaque monolith for day-to-day work.

## Current state

- shell, styles, and logic are split into named semantic source files
- grouped data files now exist for **all current rounds/stubs**
- the old migration map is no longer needed once the legacy chunk-set files are removed

## Important rule

Read **`source_index.md` first**.

## Goal

Finish removing the runtime monolith and old chunk-set artifacts as the required source read path.