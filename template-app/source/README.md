# Source Chunks

This folder holds Brain's readable rendition of the app: a base64-armored chunk set produced by the File Chunker.

## Contents (after chunking)

- `source_index.html` — the cold-agent entry point (gated-walk directive + ordered manifest)
- `<app-slug>_partNN_of_NN.txt` — the ordered chunks (base64-encoded payloads, markers plain text)
- `README.md` — this file

## How to populate

1. Run the app's `index.html` through the File Chunker (base64 armor ON, repo mode ON).
2. Export the zip.
3. Drag only the `source/` folder contents into this directory via GitHub "Add files".
4. The source index + chunks overwrite cleanly on each new version (stable filenames).

## How Brain reads it

A fresh agent is handed only `source_index.html`. It reads the index, confirms the rules, then walks the manifest one chunk at a time (auto-advance up to 5 per pass, hard stop on any error). After the final chunk: mandatory pause, no action without explicit human instruction.
