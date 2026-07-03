# F1 Racetracks — semantic source companion

This folder is now the **preferred agent-readable/editable source surface** for F1 Racetracks.

The live app still ships from `../index.html`, but the source is no longer treated as a single opaque monolith for day-to-day work.

## What changed in this PR

- grouped data files added for rounds **10–24**
- shell, style, and logic split from the prior PR kept in place
- the remaining plaintext dependency is now limited to rounds **01–09** only

## Current transition state

- `../index.html` = shipped runtime artifact
- `source/` = semantic scaffold + preferred edit surface
- grouped round data now exists for later-season tracks and stubs
- only the early-season data still depends on the trusted plaintext handoff map

## Important rule

Read **`source_index.md` first**.

## Goal

Finish removing the runtime monolith as the only reliable source read path, one reviewable pass at a time.