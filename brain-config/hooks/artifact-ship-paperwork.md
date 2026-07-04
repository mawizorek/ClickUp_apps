# Artifact Ship Paperwork

**Purpose:** After committing an app to the repo, ensure all follow-up paperwork is completed. Prevents the "shipped but forgot to update the task/index/comment" problem.

**Mode:** Always-on (deterministic). Fires AFTER any app commit to `mawizorek/ClickUp_apps`.

**Trigger:** Just committed a new version of an app (file in an app-slug folder, not brain-config or infra). Fires after Post-Build Verify confirms the live URL is serving.

**Invocation:** Automatic. Brain runs this checklist after confirming the commit is live.

---

## Pass (checklist, all items)

### 1. APPS Task Description
- Find the corresponding task in the APPS list for this app.
- Update the task description with: current version, one-line pointer to repo file, live Pages URL.
- If no APPS task exists: create one (fires Task Dedup Gate first).

### 2. Version Comment
- Post a comment on the APPS task: what changed, link to the commit, any heads-up or next ideas.
- This IS the version history (commit log + task comments). No artifact blocks, no .txt twins for repo apps.

### 3. Quickfire Index (if applicable)
- If this app lives in `quickfire/`: update `quickfire/index.html` with the new entry or version bump.
- If not a quickfire app: skip.

### 4. Source Rendition (if over-cap)
- If the committed file is >30KB: verify the `/source` set exists and is current.
- If it's a new version and the source set is stale: flag it. (Don't regenerate automatically; the File Chunker workflow is manual.)

### 5. Report Back
- Surface to Michael: committed file link + commit link + live Pages URL + confirmation of paperwork done.
- If any paperwork step was skipped (no APPS task found, quickfire N/A, etc.), note what was skipped and why.

---

## Output

- **All done:** brief report. "Shipped + paperwork done. [links]"
- **Partial:** report what's done, flag what's pending. "Committed and live. APPS task updated. Quickfire index still needs a bump (couldn't find the current index)."

---

## Composes with

- **Post-Build Verify:** fires first (confirms the live URL). Artifact Ship Paperwork fires after verification passes.
- **Task Dedup Gate:** if creating an APPS task, dedup fires first.
- **Commit Pre-Flight → Content Guards → Commit → Post-Build Verify → Artifact Ship Paperwork** is the full chain.

---

## Examples

### Example 1: New quickfire app
Just committed `quickfire/countdown-timer/index.html` v1.
**Paperwork:** Create APPS task (dedup first), post version comment, update quickfire/index.html, report links.

### Example 2: Version bump to existing app
Just committed `f1-app/index.html` v4.
**Paperwork:** Update existing APPS task description (bump version), post version comment ("v4: added constructor standings view"), skip quickfire, report links.

---

## Changelog

- 2026-07-03: Initial version.
