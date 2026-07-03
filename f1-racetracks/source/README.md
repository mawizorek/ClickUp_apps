# F1 Racetracks — semantic source companion

This folder is now the **preferred agent-readable/editable source surface** for F1 Racetracks.

The live app still ships from `../index.html`, but the source is no longer treated as a single opaque monolith for day-to-day work.

## What changed in this PR

- named shell/head/style files added
- core JS logic split into readable surfaces
- legacy plaintext handoff slices mapped explicitly for the remaining data promotion work

## Current transition state

- `../index.html` = shipped runtime artifact
- `source/` = semantic scaffold + preferred logic edit surface
- legacy `index-7_partNN_of_11.txt` files = trusted data-source migration inputs until the next cleanup PR promotes them into grouped source files

## Important rule

Read **`source_index.md` first**.

## Goal

Make future edits possible without having to depend on the 125 KB runtime monolith as the only reliable source read path.