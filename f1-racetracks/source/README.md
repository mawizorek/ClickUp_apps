# f1-racetracks — source chunk set

Brain's readable rendition of `f1-racetracks/index.html`, split into sub-28KB chunks so the GitHub MCP can read each one whole. **Entry point: `source_index.md`.** Hand a fresh agent that file only.

## Contents
- `source_index.md` — the cold-agent entry point: repo header, gated-walk directive, ordered manifest.
- `f1-racetracks_partNN_of_9.txt` — the 9 ordered chunks. base64-encoded payloads.

## How Brain reads it
Read `source_index.md`, run the token-budget check, then walk the manifest one chunk per "proceed", fetching each by its repo-relative path via the GitHub MCP. Verify the per-chunk + set UUIDs and the `_of_9` count as the completeness tripwire. Mandatory pause after the last chunk: reading all parts is not permission to act.

Regenerate the whole `source/` set and drag-drop to replace on each new version. Stable filenames = clean overwrite. Set UUID: b716b55a-de01-45b1-b7f4-12c266cdf21b. File Chunker v18.