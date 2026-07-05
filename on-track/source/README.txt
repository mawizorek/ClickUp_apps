File Chunker Set
Source: index.html 2.txt
Original source file included: index.html 2.txt (unaltered, native format; renders directly if it is HTML)
Chunk file extension: .txt
Encoding: base64 (payload encoded; markers plain text; decode before verifying)
Mode: manual paste
Chunks: 7
Set UUID: 748e4539-5ad5-43d0-8e20-f900868b07df
Markers: yes
Chunk size (file target): 9.8 KB
Split mode: smart
Per-fetch read cap: ~30 KB
Chunks over read cap: 0
Total Character Count: 41,491
Completeness flag: clear (7 of max 8)
Numbering: flat sequential (grouped/sectioned is a future option)
App version: v18 (2026-07-02)
Exported: 7/5/2026, 11:44:54

CONTENTS: this set contains the original source file (above), a .txt index, and every chunk. The original is the complete unaltered object; the chunks are for the gated AI walk.

MANUAL GATED-WALK WORKFLOW:
1. Hand index.html 2_index.txt (this set's index) to a fresh agent FIRST. It is self-instructing: it carries the reading rules, the ordered manifest, and the set UUID.
2. The agent reads the index, confirms it understands the rules, and stops.
3. Send ONE chunk per turn, in manifest order. The agent DECODES the base64 payload first, then verifies sequence + START/END UUID, confirms completeness in chat, then STOPS and waits.
4. You say continue; it reads the next chunk. Repeat until the last part.
5. After the final chunk the agent ALWAYS pauses and waits for your explicit instructions. Reading every part is not permission to rebuild or act.
DECODE NOTE: each chunk file has a plain-text "ENCODING: base64" line, then a base64 blob between the directive lines. Decode that blob (strip line breaks first) to recover the exact source bytes. A decode failure is treated exactly like a UUID mismatch: STOP and report.