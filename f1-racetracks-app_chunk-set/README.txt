File Chunker Set
Source: f1-racetracks-app.html
Chunk format: native (.html)
Mode: self-navigating (hosted URLs)
Base URL: https://mawizorek.github.io/ClickUp_apps/
Chunks: 9
Set UUID: cb56ba3b-c2f4-4ee4-8fef-ebebbff590a6
Markers: yes
Chunk size: 18.6 KB
Split mode: smart
Per-fetch read cap: ~30 KB
Chunks over read cap: 0
Completeness flag: TRIPPED (9 chunks, over 8)
Numbering: flat sequential (grouped/sectioned is a future option)
App version: v13 (2026-06-30)
SELF-NAVIGATING WORKFLOW:
1. Host these chunk files at the base URL above, then hand f1-racetracks-app_index.txt (or its URL) to a fresh agent. It is self-instructing: it carries the reading rules, the ordered manifest, and the set UUID.
2. The agent reads the index, confirms it understands the rules, and stops.
3. Say "proceed". The agent fetches ONE chunk from its URL, verifies sequence + START/END UUID, confirms completeness in chat, then STOPS and waits.
4. Say "proceed" again for the next chunk. One fetch per "proceed", never reading ahead.
5. After the final chunk the agent ALWAYS pauses and waits for your explicit instructions. Reading every part is not permission to rebuild or act.