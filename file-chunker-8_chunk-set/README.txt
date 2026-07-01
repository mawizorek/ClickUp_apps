File Chunker Set
Source: file-chunker-8.html
Chunk format: native (.html)
Mode: self-navigating (hosted URLs)
Base URL: https://mawizorek.github.io/ClickUp_apps/
Chunks: 5
Set UUID: 9c149e65-d03d-4e55-a65c-a07d742f2d0d
Markers: yes
Chunk size: 15.6 KB
Split mode: smart
Per-fetch read cap: ~30 KB
Chunks over read cap: 0
Completeness flag: clear (5 of max 8)
Numbering: flat sequential (grouped/sectioned is a future option)
App version: v13 (2026-06-30)
SELF-NAVIGATING WORKFLOW:
1. Host these chunk files at the base URL above, then hand file-chunker-8_index.txt (or its URL) to a fresh agent. It is self-instructing: it carries the reading rules, the ordered manifest, and the set UUID.
2. The agent reads the index, confirms it understands the rules, and stops.
3. Say "proceed". The agent fetches ONE chunk from its URL, verifies sequence + START/END UUID, confirms completeness in chat, then STOPS and waits.
4. Say "proceed" again for the next chunk. One fetch per "proceed", never reading ahead.
5. After the final chunk the agent ALWAYS pauses and waits for your explicit instructions. Reading every part is not permission to rebuild or act.