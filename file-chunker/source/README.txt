File Chunker Set
Source: file-chunker-v17.html
Original source file included: file-chunker-v17.html (unaltered, native format; renders directly if it is HTML)
Chunk file extension: .txt
Encoding: base64 (payload encoded; markers plain text; decode before verifying)
Mode: self-navigating (hosted URLs)
Base URL: https://mawizorek.github.io/ClickUp_apps/file-chunker/
Chunks: 10
Set UUID: e3d6c535-1f48-49e6-bfa3-558c42acdd4c
Markers: yes
Chunk size (file target): 16.6 KB
Split mode: smart
Per-fetch read cap: ~30 KB
Chunks over read cap: 0
Total Character Count: 106,844
Completeness flag: TRIPPED (10 chunks, over 8)
Numbering: flat sequential (grouped/sectioned is a future option)
App version: v17 (2026-07-01)
Exported: 7/1/2026, 23:10:35

CONTENTS: this set contains the original source file (above), a .txt index, and every chunk. The original is the complete unaltered object; the chunks are for the gated AI walk.

SELF-NAVIGATING WORKFLOW:
1. Host these chunk files at the base URL above, then hand file-chunker-v17_index.txt (or its URL) to a fresh agent. It is self-instructing: it carries the reading rules, the ordered manifest, and the set UUID.
2. The agent reads the index, confirms it understands the rules, and stops.
3. Say "proceed". The agent fetches ONE chunk from its URL, DECODES the base64 payload first, then verifies sequence + START/END UUID, confirms completeness in chat, then STOPS and waits.
4. Say "proceed" again for the next chunk. One fetch per "proceed", never reading ahead.
5. After the final chunk the agent ALWAYS pauses and waits for your explicit instructions. Reading every part is not permission to rebuild or act.
DECODE NOTE: each chunk file has a plain-text "ENCODING: base64" line, then a base64 blob between the directive lines. Decode that blob (strip line breaks first) to recover the exact source bytes. A decode failure is treated exactly like a UUID mismatch: STOP and report.