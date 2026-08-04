# 🔴 BLOCKER · Dropbox IMAGES are unreadable. Dropbox DOCUMENTS read fine.

**Status:** OPEN, and **narrower than first reported.** Blocks Pass 2 image classification only.
**Found:** 2026-08-04, Audit Anna, first live run. **Scoped down the same hour** after Michael asked the right question: *"Can you read Word documents and PDFs off the Dropbox, just not image files?"* **Yes. Exactly that.**

---

## 📊 MEASURED CAPABILITY MATRIX

Every row below was **exercised against a real file in this folder**, not read off a contract.

| Target | Tool | Result |
| --- | --- | --- |
| **PNG screenshot** | `get_file_content` | ❌ `"Could not extract file content. File type is not supported."` |
| **PNG screenshot** | `download_link` → `fetch_website` | ❌ Link issues fine; the fetcher extracts TEXT from web pages and cannot render an image. Also **burns the single-use link**. |
| **PNG screenshot** | `load_assets` | ❌ N/A — ClickUp / Drive / GitHub / Figma / SharePoint only. |
| **PNG screenshot** | `content_link` → `fetch_website` | ❌ The returned `dropbox.com/scl/fi/...` link is not publicly fetchable. |
| **PDF** | `get_file_content` | ✅ **CLEAN TEXT.** Verified twice: a URITP role page and a UR Tech Store quote, both fully legible including a line-item table. |
| **ZIP** | `get_file_content` | ✅ **READS THE CONTENTS.** Returned three markdown files with frontmatter intact. |
| **TSV / CSV / JSON / code** | `get_file_content` | ✅ Per contract, same text-extraction path. |
| **Word / Excel / PowerPoint** | `get_file_content` | ✅ Per contract. Not yet exercised — label INFERRED until one is. |
| **List / search / rename / move** | `list_folder` · `search` · `move` | ✅ All fine. |

<p></p>

**The honest one-liner: Dropbox is fully readable EXCEPT for pixels.** `get_file_content` is a text extractor; anything with text in it comes back. A screenshot's content is pixels, so it returns nothing. **The blocker is image-shaped, not Dropbox-shaped**, and every earlier statement that "Dropbox is a blind surface" was too broad.

<p></p>

**Cap: 5 MB** on `get_file_content`. Note that **C11's shots run 2–6 MB**, so even a hypothetical image path would clip there.

---

## 🔴 A second correction, and it is mine twice over

**`uritp-docs-base-afb7d96.zip` (624 bytes) is NOT a failed export.** I called it *"almost certainly a failed/empty export worth re-pulling"* in two separate messages, on the sole evidence of its byte count. It opened cleanly: **three markdown files** (`index.md`, `layers.md`, `classes.md`) for a Vectorworks base showfile doc tree, frontmatter intact, headings present, bodies deliberately empty scaffolding. It is 624 bytes because **the stubs are nearly empty by design**, which is exactly what a base tree looks like.

<p></p>

**The lesson generalizes and belongs in the guardrails: a file's SIZE is not evidence about its CONTENT.** Same error family as "a filename tells you nothing" — reasoning about a file from its metadata instead of opening it, when opening it was one call away and free.

---

## Why the original premise went unchecked

Five versions, a workshop, and four reviews all rested on *"open every image; a filename is not evidence."* **Nobody checked that opening was possible.** Same failure class as the never-measured 22KB ceiling and the never-measured 40-open budget: asserted at authoring time, inherited unquestioned.

**Guardrail (now in the hook): ask whether a capability has been EXERCISED or only assumed.**

---

## What still works, and it is most of the value

Pass 1 completed with **zero images**: 49 clusters across 257 files, with shapes, spans, overnight sessions, bursts and stray separation, built entirely from the index. `THE TIMESTAMP IS EVIDENCE` is currently **the only working evidence source for screenshots** — a stronger vindication of Michael's correction than anyone intended.

<p></p>

**And the strays are no longer opaque.** Every non-image in the folder can be read and routed *today*: the PDFs, the zip, the tsv. Those were the files with the clearest destinations anyway.

---

## Options (Michael 2026-08-04: pursue D, C is acceptable and not a loss)

**A · ClickUp as the eye.** Drag a cluster onto the session task; `load_assets` renders attachments. Read there, write renames back to Dropbox. Highest fidelity, costs a drag per cluster.

**B · Move the inbox into ClickUp.** One readable surface; loses the Mac auto-drop and the Dropbox rename tooling.

**C · ACCEPTED — timestamp-only clustering + session folders.** Cluster blind, then **physically reorganize the loose screenshots into dated session folders in Dropbox** so the inbox becomes browsable history rather than a wall of timestamps. Michael: *"organized sessions stored in Dropbox that I can go back to if I am ever curious. So that is not a total loss."* Images pasted on demand for the clusters he cares about.

**D · Keep hunting for a read path. STILL OPEN.** Exhausted so far: `get_file_content`, `download_link`+`fetch_website`, `content_link`+`fetch_website`, `load_assets`. Not yet tried: a genuinely public Dropbox link consumed by an image-capable tool. ⚠️ **`create_shared_link` cannot help** — its audience is hard-locked to `no_one` (ACL-only), so an unauthenticated fetcher will never reach it, **and creating one on a FOLDER converts it to a mount and changes its namespace path.**

---

## ⚠️ Session folders vs the no-subfolders guardrail — these do NOT conflict

The hook bans **topic** subfolders, because filing by topic demands a decision per item and that is where inboxes die. **A dated session folder is chronological, requires no judgement, and is derived mechanically from data the file already carries.** Different thing entirely. The ban stands; C is not an exception to it.

<p></p>

🚫 Still true regardless: **clusters and threads are reporting structures.** Only the chronological session folders become real directories.

---

## Until D is settled

- Pass 1 runs normally and is genuinely useful.
- **Documents route immediately.** No reason to wait on them.
- **Pass 2 cannot honestly assign KEEP/ROUTE to an IMAGE by content.**
- 🚫 **Never describe what a screenshot shows from its filename, its size, its cluster, or its neighbours.** A blind agent under pressure to produce a report is the most likely thing in this system to start inferring. **Report `unknown`.**
