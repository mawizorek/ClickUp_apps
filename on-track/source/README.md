# On Track — TEMP source chunk set (for v1.7 read-back)

**Why this exists:** `on-track/index.html` is ~41 KB, over the ~30 KB read cap, so an agent can't read it whole to edit it safely. This folder holds the live engine split into 3 readable chunks so the v1.7 fixes (sticky-hover border + collapsible filter sections) can be applied without guessing at the unread portion.

**This folder is temporary.** Once v1.7 ships it can be deleted (or regenerated on the next engine change). It is NOT the app and is NOT served.

---

## What to do (paste map)

Split the CURRENT live `on-track/index.html` into 3 consecutive parts and paste each into the matching file. On the GitHub app: open the file → pencil/edit → select-all → paste → commit.

| Order | File | Gets |
|-------|------|------|
| 1 | `on-track/source/chunk-01.txt` | The **first third** of `index.html` |
| 2 | `on-track/source/chunk-02.txt` | The **middle third** |
| 3 | `on-track/source/chunk-03.txt` | The **final third** |

## Rules (so I can reassemble byte-perfect)

1. **Consecutive, no overlap, no gaps.** Chunk 2 starts on the exact line chunk 1 ended. Nothing skipped, nothing repeated.
2. **Raw text, no edits.** Don't reformat, don't "fix" anything, don't add or remove lines. Paste exactly what's in the file. I apply the v1.7 edits, not you.
3. **Any split point is fine.** Mid-tag, mid-function, doesn't matter, I stitch them back together as one file. Just keep the order.
4. **Replace the placeholder line entirely.** Each chunk file currently has one marker line; overwrite it completely with your paste.
5. **Keep them under ~13 KB each** (41 KB / 3). If the app grew, add a chunk-04 and note it here.

When all three are filled, tell me "chunks are in" and I'll read them, apply both fixes, and commit v1.7.

_Reference: Apps / HTML Artifacts → "TWO artifacts per app" (engine + readable rendition)._
