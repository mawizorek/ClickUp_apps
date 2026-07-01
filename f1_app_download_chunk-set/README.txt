File Chunker Set
Source: f1_app_download.html
Chunk format: native (.html)
Mode: self-navigating (hosted URLs)
Base URL: https://mawizorek.github.io/ClickUp_apps/
Chunks: 7
Set UUID: c30d68e2-55fa-449c-a613-3a76bbd9fa64
Markers: yes
Chunk size: 21.5 KB
Split mode: smart
Per-fetch read cap: ~30 KB
Chunks over read cap: 0
Completeness flag: clear (7 of max 8)
Numbering: flat sequential (grouped/sectioned is a future option)
App version: v13 (2026-06-30)
SELF-NAVIGATING WORKFLOW:
1. Host these chunk files at the base URL above, then hand f1_app_download_index.txt (or its URL) to a fresh agent. It is self-instructing: it carries the reading rules, the ordered manifest, and the set UUID.
2. The agent reads the index, confirms it understands the rules, and stops.
3. Say "proceed". The agent fetches ONE chunk from its URL, verifies sequence + START/END UUID, confirms completeness in chat, then STOPS and waits.
4. Say "proceed" again for the next chunk. One fetch per "proceed", never reading ahead.
5. After the final chunk the agent ALWAYS pauses and waits for your explicit instructions. Reading every part is not permission to rebuild or act.