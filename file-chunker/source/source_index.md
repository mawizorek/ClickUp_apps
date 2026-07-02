# File Chunker Index — file-chunker (file-chunker-v17.html)

You (a fresh ClickUp Brain agent) have been handed ONLY this `_index.md`. It is the entry point and the rulebook for reading a chunked app source out of the GitHub repo via the GitHub MCP. Read it fully, run the token-budget check, confirm the repo and chunk count, say **"ready to read chunk 1"**, then STOP and wait. Content arrives one chunk at a time.

## SET INTEGRITY HEADER
- **Repo:** mawizorek/ClickUp_apps
- **Branch:** main
- **Source folder:** file-chunker/source/
- **Set UUID:** 8a41a3e3-d66c-4693-b925-b1c5fed2cc82
- **Total chunks:** 6 (each named _partNN_of_6)
- **Total bytes (source):** 106,906
- **Total Character Count:** 106,844
- **Chars-per-token ratio:** 4
- **Est. tokens (whole set):** 26,711
- **Token-budget threshold:** 28,000
- **Encoding:** plaintext
- **Source file:** file-chunker-v17.html
- **Generated:** 7/1/2026, 22:52:24
- **App:** File Chunker v17 (2026-07-01)

## READING DIRECTIVE — obey exactly. GATED, ONE-CHUNK-AT-A-TIME walk.
0. **Token budget check FIRST.** Estimate the whole set: Total Character Count / chars-per-token = ~26,711 tokens. If that exceeds the token-budget threshold (28,000), STOP and tell the human the set is too large for a single automated walk (suggest a tighter scope or a batched read). Do not begin the walk.
1. Read this index. Confirm you understand the rules, **state the repo (`mawizorek/ClickUp_apps`) and the chunk count (6)**, then say **"ready to read chunk 1"** and STOP. Do not fetch any chunk yet.
2. When the human says **"proceed"**, fetch the NEXT chunk in the manifest below by its **repo-relative path** (resolve it against the Repo + Branch above) using the GitHub MCP. Fetch exactly ONE chunk per "proceed". These are repo paths, not URLs: do NOT use github.io or raw.githubusercontent.
3. For that chunk: verify its sequence tag (e.g. CHUNK 3/6) and that its START and END boundary UUID match. Report **"read N/6, uuid verified"** in chat. (Plaintext set: after reading, sanity-check that literal markup like `<div`, `<svg`, `<span class=` survived intact. If tags look flattened, tell the human, the set may need re-exporting base64-armored.)
4. After EACH chunk, STOP. Do NOT fetch the next path on your own. Wait for the human to say "proceed" again. Never fetch ahead or batch-fetch. This pause is mandatory.
5. If a chunk fails to fetch, its START/END UUID do not match, or a sequence number is missing or out of order, STOP and report it. Do NOT reconstruct or fill gaps from inference. The `_of_6` count + the per-chunk and set UUIDs are the completeness tripwire: if any part is missing or clipped, it is detectable here.
6. Confirm the set-level UUID in this header matches the footer before treating the read as complete.
7. **AFTER THE FINAL CHUNK: mandatory pause.** All parts read is NOT permission to act. State that the full set was read with all UUIDs verified, then wait for explicit human instructions before any rebuild, edit, or summary.

## ORDERED MANIFEST (fetch in this exact order, one repo-relative path per "proceed")

| # | repo-relative path | covers | uuid |
| --- | --- | --- | --- |
| 1/6 | `file-chunker/source/file-chunker_part1_of_6.txt` | document head / opening markup (lines 1–404) | 12ba090c-ff61-4cc2-a70f-428aa4f4124b |
| 2/6 | `file-chunker/source/file-chunker_part2_of_6.txt` | JavaScript logic (lines 405–749) | bc412ba4-9af9-433c-a9e2-f22020f49d14 |
| 3/6 | `file-chunker/source/file-chunker_part3_of_6.txt` | JavaScript logic (lines 750–1123) | e7b28f7e-ed47-44fc-b9a2-5d55fde46706 |
| 4/6 | `file-chunker/source/file-chunker_part4_of_6.txt` | JavaScript logic (lines 1124–1448) | 98f627a0-4cf7-40da-b48c-c969a2516819 |
| 5/6 | `file-chunker/source/file-chunker_part5_of_6.txt` | JavaScript logic (lines 1449–1771) | 921ceb4a-9a0b-41c1-9db3-da6bc55d9c9d |
| 6/6 | `file-chunker/source/file-chunker_part6_of_6.txt` | JavaScript logic (lines 1772–1934) | e7314df6-be1c-4233-a9c0-e6cc3ca1eb5b |

## FOOTER
- **Set UUID:** 8a41a3e3-d66c-4693-b925-b1c5fed2cc82 (must match header)
- END OF INDEX