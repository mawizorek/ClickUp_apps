# Post-Build Verify — AI Toolkit

**Purpose:** Confirm a shipped app is actually live and current, closing the silent-stale-build trap (a failed Jekyll build makes Pages keep serving the LAST good build across the whole site, so a correct commit looks broken).

**Mode:** Contextual (deterministic) — fires after any commit that publishes to GitHub Pages.

**Invocation:** Automatic. ("verify the build" forces a manual run.)

**Trigger:** After a commit to `mawizorek/ClickUp_apps` that touches a Pages-served path (app `index.html`, quickfire artifact, repo root).

**Pass:**
1. Wait for the Pages build lag (~60s after commit).
2. Fetch the LIVE Pages URL (not the raw file, not the API — the actual `.github.io` render).
3. Confirm the live content matches what was just committed: check for a version marker, a known new string, or the changed element. If it still shows the old version, the build did not deploy.
4. Confirm `.nojekyll` is present at repo root (its absence is the #1 cause of a frozen/stale site).
5. On mismatch: FLAG it — "live URL is stale, not serving the new commit." Surface the likely cause (missing `.nojekyll`, Jekyll template-tag collision from `{{ }}`/`{% %}` in inline JS, or build still in flight) and the fix. Do NOT report the ship as done.
6. On match: confirm live + current in the write report.

**Output:** In the ship report, a one-line verify result: "live + current ✅" or a stale/failed FLAG with cause + fix. Never silently assumes success.

**Composes with / overrides:** Runs last in the write chain, after the commit and after Secrets/Size guards. Its FLAG does not roll back the commit (already pushed) but blocks the "shipped\u2011and\u2011done" claim until the live URL verifies.

**Examples:**
- *After:* commit correct `index.html`, live URL still shows v-prev after 90s. → FLAG: "stale build — check `.nojekyll` + inline `{{ }}` collisions; Pages is serving the last good build."
- *After:* commit new quickfire artifact, live URL renders the new countdown. → "live + current ✅."

**Changelog:**
- v1 (2026-07-03) — initial. Closes the silent-stale-build gap documented in the GitHub MCP Operating Standard.
