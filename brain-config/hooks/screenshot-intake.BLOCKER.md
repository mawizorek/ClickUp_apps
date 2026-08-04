# 🔴 BLOCKER · Dropbox images are UNREADABLE from this toolset

**Status:** OPEN. Blocks Pass 2 of `hooks/screenshot-intake.md`. Does **not** block Pass 1.
**Found:** 2026-08-04, Audit Anna, first live run, on the very first image.
**Evidence class: MEASURED.** Two independent read paths tried against one real file (`Screenshot 2026-08-04 at 2.26.05 PM.png`, `id:JJAxxnj1FXAAAAAAAAARqA`). Both failed.

---

## What was tried

| Path | Result |
| --- | --- |
| `dropbox.download_link` → `fetch_website` on the temp URL | **FAILED.** The link is issued correctly, but `fetch_website` extracts TEXT from web pages; it cannot render an image, and the request consumed the single-use link. |
| `dropbox.get_file_content` | **FAILED**, explicitly: `"Could not extract file content. File type is not supported."` Its own contract says images/video/audio are unsupported — it is a text extractor. |
| `load_assets` | **NOT APPLICABLE.** Resolves ClickUp, Google Drive, GitHub, Figma and SharePoint assets. A Dropbox temp URL is none of those. |

**Conclusion: Dropbox is a WRITE surface for this hook and a BLIND surface for image content.** Renaming, moving and listing all work perfectly. Seeing does not.

---

## Why the hook did not catch this earlier

Four versions were authored, reviewed by a workshop, and merged, all resting on one unexamined premise: *"open every image; a filename is not evidence."* **Nobody checked that opening was possible.** The capability was assumed at v1 and inherited unquestioned through v4.

**This is the same failure class as the never-measured 22KB ceiling and the never-measured 40-image budget:** a number or a capability asserted at authoring time and then built upon. Beckett's rule applies to capabilities, not just numbers — **ask whether a capability has been EXERCISED or only assumed.**

---

## What still works, and it is more than expected

**Pass 1 completed successfully with ZERO images opened.** A 49-cluster time skeleton across 257 files, with shapes, spans, bursts, overnight sessions and stray separation, was built entirely from the index. The `THE TIMESTAMP IS EVIDENCE` section is not just correct, it is currently **the only working evidence source** — which is a much stronger vindication of Michael's correction than anyone intended.

---

## Options for Michael (none chosen; this needs a ruling)

**A · ClickUp as the eye.** Michael drags a cluster's images onto the session task as attachments; the agent reads them via `load_assets` (which DOES render images), then writes renames back to Dropbox. Two surfaces, each doing what it can. Highest fidelity, costs Michael a drag per cluster.

**B · Move the whole inbox into ClickUp.** Screenshots become attachments on a task or list. One surface, fully readable. Loses the automatic Mac-capture drop and the Dropbox rename/move tooling.

**C · Timestamp-only clustering, images on demand.** Pass 1 stays exactly as it is (it already works blind). Michael pastes only the handful of images from clusters he actually cares about. **Cheapest, and it matches how the run actually went.**

**D · Find a real read path.** Unexplored: a Dropbox-hosted public URL that an image-capable tool can consume. Not attempted; would need one to exist.

---

## Until this is ruled

- Pass 1 runs normally and is genuinely useful.
- **Pass 2 cannot honestly assign KEEP/ROUTE by content.** Any agent that tries will be inferring from filenames, which this hook explicitly forbids.
- 🚫 **Never describe what a screenshot shows based on its cluster or its neighbours.** That is the exact failure the guardrail was written against, and a blind agent under pressure to produce a report is the most likely thing to do it.
