# F1 Racetracks — Exact Source Path

This page defines the **trustworthy exact-source path** for recovering current source safely when a normal read distorts or summarizes a file body.

## Preferred working surfaces (by concern)

- **Circuit guide shell / styles / logic:** `f1-racetracks/source/` (+ `circuits.html`)
- **Standings / Matrix / History:** `f1-racetracks/source/standings/` (+ `standings.html`)
- **Router landing:** `f1-racetracks/index.html`
- **Standalone live companion:** `f1-racetracks/live-tracker.html`
- **Canonical data:** `f1-racetracks/f1-results/2026/` (results) and `f1-racetracks/circuits/` (circuit identity + per-year index). No `data.json`.

## Exact-source hierarchy

### 1. Preferred body read

Raw GitHub URL per file. Read the circuit-guide style band in order: `02 → 03 → 04 → 05 → 06 → 07`, then logic `09 → 18`. For standings, read `./standings/` (`base.css`, `panel.css`, then `data.js`, `matrix.js`, `trajectory.js`, `panel.js`, `nav.js`, `history.js`).

### 2. Exact fallback: the git blob API

HTML/JS bodies can be flattened or summarized by some read paths. When that happens, fetch the file's blob via the Git blob API, which returns **base64** and does NOT flatten markup. This is the reliable byte-exact read for `.html` files especially.

### 3. Exact fallback: commit-patch reconstruction

If a blob is still ambiguous, recover exact lines from the Git commit patch that last materially rewrote that file (`githubmcp_get_commit` with the full patch).

### 4. Runtime role

- `index.html` is the shipped router; `circuits.html` and `standings.html` are the two lens entrypoints.
- `f1-results/2026/` + `circuits/` are the canonical data surfaces.
- `source/` (+ `source/standings/`) is the canonical shell/style/logic companion.

## Why this matters

Keeps future work on the current, trustworthy surfaces and prevents falling back to retired migration notes or the deleted `data.json` monolith.
