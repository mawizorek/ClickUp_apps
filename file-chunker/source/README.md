# file-chunker — source chunk set

Brain's readable rendition of `file-chunker/index.html`, split into sub-28KB chunks so the GitHub MCP can read each one whole. **Entry point: `_index.md`.** Hand a fresh agent that file only.

## Contents
- `_index.md` — the cold-agent entry point: repo header, gated-walk directive, ordered manifest.
- `file-chunker_partNN_of_6.txt` — the 6 ordered chunks. plaintext.

## How Brain reads it
Read `_index.md`, run the token-budget check, then walk the manifest one chunk per "proceed", fetching each by its repo-relative path via the GitHub MCP. Verify the per-chunk + set UUIDs and the `_of_6` count as the completeness tripwire. Mandatory pause after the last chunk: reading all parts is not permission to act.

Regenerate the whole `source/` set and drag-drop to replace on each new version. Stable filenames = clean overwrite. Set UUID: 8a41a3e3-d66c-4693-b925-b1c5fed2cc82. File Chunker v17.