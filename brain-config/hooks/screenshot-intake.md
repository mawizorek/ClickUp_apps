# Screenshot Intake Triage · AI Toolkit

**Purpose:** Turn a flat Dropbox screenshot dump into routed, named, owned reference material — so a shot Michael took as a note reaches the teammate whose lane it belongs to instead of rotting in a folder of 200 timestamps.

**Steward:** **OWNERLESS tool**, same as the Doc-Rot Sweep and the Fleet-Fact Sweep. Any agent fires a one-off pass mid-task with no persona seated. Three qualifications: the **routing decision** (which shot reaches which teammate) is a fleet fact and resolves through **Fleet Felix**'s ground-truth ladder, never from a table in this file · the **destination** doc/task is owned by whoever owns that domain · a **formal, scoped, reported full-inbox pass IS an audit and SEIZES to Audit Anna**.

**Mode:** On-demand routine (batched). Never automatic — a folder that empties itself unattended is a folder Michael stops trusting.

**Invocation:** `/screenshot-intake` · `/shot-intake` · "sort my screenshots" · "triage the screenshot inbox" · "what's in my screenshots folder"

**Trigger:** Michael names it, OR he references a screenshot he took without attaching it ("the shot I took of the light board") — in which case run a SEARCH-ONLY pass against the inbox and propose nothing.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-04** by Fleet Felix, at Michael's direction, scoped as a **sibling of the INBOX Email Intake Triage** rather than a net-new invention (Fold-in Frank: NET-NEW, sibling shape). Same skeleton, different input: an inbox, a classification, a routing decision, a mandatory greenlight, a disposition.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Inbox (drop zone)** | Dropbox `/MAW/zSCREENSHOTS/manual_input` |
| **Keepers** | Dropbox `/MAW/zSCREENSHOTS/_keep` |
| **Aged-out keepers** | Dropbox `/MAW/zSCREENSHOTS/_archive` |
| **Owner resolution** | 🤖 **Agent Index** list — filter by `Lane`. NEVER a hardcoded routing table (see Guardrails). |
| **Sibling routine** | INBOX Email Intake Triage — Agent Reference (URITP ▸ INBOX) |
| **Read/write tools** | `dropboxmcp_list_folder` · `dropboxmcp_search` · `dropboxmcp_download_link` · `dropboxmcp_move` (rename = move) |

---

## Procedure

### 0 — Frame the batch (permission-free)

1. `list_folder` the inbox, `recursive: false`. Paginate to `has_more: false` before claiming a count.
2. **Separate STRAYS first, before looking at a single image.** Anything that is not a screenshot — PDF, zip, tsv, `.crwebloc`, UUID-named file, a real photo — is a **routing** problem, not a triage problem. It never enters image classification. List it and move on.
3. **Detect BURSTS.** Consecutive timestamps inside ~2 minutes are ONE capture event, almost always one sequence of a single thing. Judge a burst as a unit; a burst usually resolves to one keeper plus culls.
4. Cap the pass. **Never open more than ~25 images in one run.** Oldest-first by default (the old ones are the rot); `--recent` reverses it. Say which end you worked.

### 1 — Read (read-only)

Pull temporary download links in batches (`download_link`, max 25) and actually LOOK at each image. A filename tells you nothing; that is the entire reason this hook exists.

### 2 — Classify into four buckets

| Bucket | Meaning | Disposition |
| --- | --- | --- |
| **REFERENCE** | Durable value, no work implied (a schema, a rig plot, a rate card, a UI pattern) | → `_keep`, renamed |
| **ACTIONABLE** | Implies work or a decision (an error state, a quote, a deadline, a bug) | → propose the task/comment on the canonical record FIRST, then `_keep` or cull |
| **STRAY** | Not a screenshot | → route to its real home; never image-classified |
| **CULL** | Superseded, duplicate-in-burst, illegible, or a shot whose content is already captured in the workspace | → flagged in place, never moved |

**Default to CULL on a tie.** A screenshot's value decays fast and `_keep` earns its name only if it stays small. If a shot's content already lives in a task, a doc, or the repo, the shot is a redundant second claimant — flag it.

### 3 — Resolve the owner (do NOT guess, do NOT hardcode)

For every REFERENCE and ACTIONABLE item, name the domain owner by querying the **Agent Index** `Lane` field at read time. Production ops, FileMaker schema, repo architecture, ClickUp structure, real-estate, course delivery, professional history — each has a live owner and **this file must never state who.** A routing table written here is a fleet fact copied into a neighbouring file, which is exactly the class of rot the Known-Drift Register exists to catch (D14: the author of a tool is not automatically its owner).

If no lane matches, say so. An unowned screenshot is a real finding, not a filing failure.

### 4 — Rename on promotion (MANDATORY for anything entering `_keep`)

`Screenshot 2026-07-13 at 12.04.25 PM.png` is unsearchable and that is the whole problem. Anything promoted gets renamed via `dropboxmcp_move`:

```
YYYY-MM-DD · <owner-lane> · <what it actually shows>.png
```

Capture date comes from the ORIGINAL filename/`modified_time`, never today. Never invent content that is not visibly in the image.

### 5 — Flag the culls (rename in place, never move, never delete)

Deletion-Flag Gate verbatim: rename to `🔴 DELETE ME — <what it was> (<why>)`. The file stays exactly where it is, so one name-sort surfaces the entire cull block for a single sweep. **The agent renames. Michael deletes. Always.**

### 6 — Plan Comment + MANDATORY GREENLIGHT

Inherited from the sibling routine and non-negotiable. Post the plan, then **stop**:

> **SCREENSHOT INTAKE PLAN**
> **Batch:** `<n>` files, `<oldest date>` → `<newest date>` (of `<total>` in inbox)
> **Bursts detected:** `<n>` · **Strays:** `<n>`
> **→ _keep:** `<count>` — each with proposed new name + resolved owner
> **→ ACTIONABLE:** `<count>` — each with the exact destination task/doc, full title + link
> **→ 🔴 CULL:** `<count>` — each with the reason
> **→ STRAY:** `<count>` — each with its real home
> **Watch-outs:** DRIFT / DUPES / PATTERNS — `<or "none">`
> Greenlight to execute?

**Name every destination explicitly — full title AND link.** Never "the production task." Same rule, same reason, as the sibling: a wrong-destination mishap gets caught in the plan or not at all.

### 7 — On greenlight, execute

RELOAD this file that turn (the greenlight message is not the procedure), then run steps 3–5 in order. Batch the renames into one `dropboxmcp_move` call where possible. Report what moved, what was renamed, and what was already handled.

---

## Guardrails

- 🚫 **NEVER delete a file.** Not one, not ever, not on request. Flag and hand it to Michael.
- 🚫 **NEVER create a shared link on these folders.** `create_shared_link` converts a plain folder into a shared-folder mount and changes its namespace path. Serve `dropbox.com/home/<path>` navigation URLs instead.
- 🚫 **NEVER add topic subfolders.** Three folders is the design, not a starting point. An inbox that demands a filing decision per item stops getting filed, and the images are readable, so folders would be a strictly worse index than reading them.
- 🚫 **NEVER hardcode the fleet routing table into this file** (step 3). Resolve at read time.
- ⚠️ **Never assert what a screenshot shows without having opened it.** A filename is not evidence.
- ⚠️ **Volatile content inside a shot is still volatile.** Hours, prices, availability, staffing read off an image go through the Source Freshness Gate before being stated as fact — and a screenshot Michael took is itself often the FRESHEST source, outranking what you already committed to.
- ⚠️ **PII/credentials.** Screenshots catch inboxes, DMs, student data, and logins by accident. Anything with a credential or identifiable student data never leaves Dropbox into the repo, a public channel, or a shipped artifact. Flag it and say why.
- The inbox is allowed to be messy. That is its job. Do not tidy it unasked.

---

## Composes with

- **INBOX Email Intake Triage** — the sibling. Same skeleton (classify → route → mandatory greenlight → disposition), different input. Divergences are deliberate: no transcription step, no MOVE/COMBINE binary, culls flagged rather than closed.
- **Attachment Router** — fires when a shot is pasted into chat. This hook is the FOLDER-scale counterpart; the Router handles one file in flight.
- **Deletion-Flag Gate** — owns the cull rename format. Step 5 is a pointer, not a copy.
- **Task Dedup Gate / Doc Dedup & Placement Gate** — fire before anything promoted becomes a new task or page.
- **Source Freshness Gate** — fires on any volatile fact read off an image.
- **Secrets / PII Guard** — fires before any shot's content crosses into the repo.

---

## Changelog

- **v1 (2026-08-04)** — Established by Fleet Felix at Michael's direction ("sibling of INBOX triage, write it"). Scoped deliberately as a sibling of the email intake routine rather than a net-new gate; ownership resolved as owned-at-the-edges but ownerless at the tool (routing → Felix's ladder, destination → domain owner, formal pass → Anna). Built against a real 205-file backlog, which is where the burst rule, the stray-first rule, and the mandatory rename came from.
