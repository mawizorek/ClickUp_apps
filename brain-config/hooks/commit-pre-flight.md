# Commit Pre-Flight

**Purpose:** Meta-checklist wrapping all pre-commit validation into one pass. Catches the small procedural mistakes that individual guards don't cover: missing blob SHAs, active PR collisions, .nojekyll presence, commit message format, and correct branch targeting.

**Mode:** Always-on (deterministic). Fires before ANY commit to a GitHub repo via MCP.

**Trigger:** About to call `githubmcp_push_files` or `githubmcp_create_or_update_file`.

**Invocation:** Automatic. Brain runs this checklist internally before executing the commit tool.

---

## Pass (ordered checklist)

### 1. Blob SHA (update-only)
- If updating an existing file (not creating new): do I have the current blob SHA?
- SHA comes from a `get_file_contents` call THIS session (not from memory or a stale read).
- If missing or stale: fetch the file first, get the SHA, then proceed.
- Note: `push_files` does NOT require SHA. `create_or_update_file` DOES for updates.

### 2. Active PR / Collision Check
- Is there an open PR or known active work (by Patch Penelope or another agent) touching the same file(s)?
- If yes: HALT. Surface the conflict. Coordinate before committing.
- Check method: recall session context. If uncertain, check open PRs.

### 3. .nojekyll Presence (app repos)
- For commits to `mawizorek/ClickUp_apps` (or any GitHub Pages repo): confirm `.nojekyll` exists at repo root.
- If missing: HALT. Commit `.nojekyll` first, then proceed with the original commit.
- This prevents the silent Jekyll build failure that freezes Pages on stale content.

### 4. Commit Message Format
- App commits: `<app-slug> v<N> — <one-line what changed>` (subject ≤70 chars, imperative)
- Non-app/infra: `<area>: <what changed>`
- brain-config: `brain-config: <what changed>`
- If the message doesn't conform: fix it before committing. Don't ask, just format correctly.

### 5. Branch Target
- Default: `main` for new apps, new hooks/agents, infra.
- Confirm: is this the right branch? If the work is structural/large, should it be a PR instead?
- Brain direct-commits for live conversation work. PR for larger structural changes.

### 6. Large File Gate
- Is any file in this commit >~30KB?
- If yes: HALT. Large files NEVER go through the MCP write tools (locked rule, 2026-07-02). Route to user upload via GitHub UI.

### 7. Fire Existing Guards
- After this checklist passes, the individual guards still fire on content:
  - Secrets / PII Guard (scan for keys/tokens/PII)
  - Source-Size Budget Enforcer (check file size vs budget)
  - Skill-Ban Guard (if UI under a skill with hard bans)
- This checklist handles PROCEDURAL pre-flight. Those guards handle CONTENT validation.

---

## Output

- **All checks pass:** proceed silently to the content guards, then commit.
- **HALT:** do NOT commit. Surface the failing check and resolution path.
- **Auto-fix:** commit message formatting is auto-fixed without asking.

---

## Composes with

- **Secrets/PII Guard, Source-Size Budget Enforcer, Skill-Ban Guard:** these fire AFTER Pre-Flight passes. Pre-Flight is procedural; those are content-level.
- **Post-Build Verify:** fires AFTER commit. Pre-Flight → Content Guards → Commit → Post-Build Verify is the full chain.
- **Stale Context Reload:** ensures the blob SHA / file content is fresh before Pre-Flight even evaluates.

---

## Examples

### Example 1: Missing SHA
Brain is about to update `f1-app/index.html` using create_or_update_file.
**Check 1 fails:** No SHA fetched this session. Action: fetch file, get SHA, then retry.

### Example 2: Collision
Patch Penelope has an open PR touching `ddr-explorer/source/_index.md`. Brain is about to commit to the same file on main.
**Check 2 HALTs:** Surface the PR, ask Michael how to proceed.

### Example 3: Clean pass
New hook file, fresh session, main branch, message format correct, under 30KB.
**Result:** All checks pass. Fire content guards, commit.

---

## Changelog

- 2026-07-03: Initial version.
