File Chunker Set
Source: index.html 3.txt
Original source file included: index.html 3.txt (unaltered, native format; renders directly if it is HTML)
Chunk file extension: .txt
Encoding: base64 (payload encoded; markers plain text; decode before verifying)
Mode: manual paste
Chunks: 6
Set UUID: 847878af-77f9-41a9-aeed-7e97f96014d3
Markers: yes
Chunk size (file target): 11.7 KB
Split mode: smart
Per-fetch read cap: ~30 KB
Chunks over read cap: 0
Total Character Count: 37,496
Completeness flag: clear (6 of max 8)
Numbering: flat sequential (grouped/sectioned is a future option)
App version: v18 (2026-07-02)
Exported: 7/6/2026, 14:03:43

CONTENTS: this set contains the original source file (above), a .txt index, and every chunk. The original is the complete unaltered object; the chunks are for the gated AI walk.

MANUAL GATED-WALK WORKFLOW:
1. Hand index.html 3_index.txt (this set's index) to a fresh agent FIRST. It is self-instructing: it carries the reading rules, the ordered manifest, and the set UUID.
2. The agent reads the index, confirms it understands the rules, and stops.
3. Send ONE chunk per turn, in manifest order. The agent DECODES the base64 payload first, then verifies sequence + START/END UUID, confirms completeness in chat, then STOPS and waits.
4. You say continue; it reads the next chunk. Repeat until the last part.
5. After the final chunk the agent ALWAYS pauses and waits for your explicit instructions. Reading every part is not permission to rebuild or act.
DECODE NOTE: each chunk file has a plain-text "ENCODING: base64" line, then a base64 blob between the directive lines. Decode that blob (strip line breaks first) to recover the exact source bytes. A decode failure is treated exactly like a UUID mismatch: STOP and report.