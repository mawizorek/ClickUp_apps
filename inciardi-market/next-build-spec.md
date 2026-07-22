# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Version target:** front-end **v15** + worker **v1.4** (backups + soft two-person login)
**Status:** SHIPPED. v13 swipe page + v14 catalog rename are live. This build adds data backups and a soft identity switcher, in that order (backups first — Michael's call: don't add write convenience without an undo under it).

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME).

---

## Why (Michael, 2026-07-22)

Michael + Nick clear/refresh browsers constantly, so the per-browser write key never sticks and the app is effectively read-only for them. He wants a soft "account login" that just applies a key. He correctly judged the security exposure as low (public 2-person, no-personal-data app; the real risk is a fat-finger wipe, not an attacker) — **on the condition that backups/snapshots exist to reinstate a prior state.** So: backups first, login second.

---

## Shipped in this build

### 1. Backups (worker v1.4) — the safety net, built FIRST
- `POST /snapshot` (gated) → dumps catalog + aliases + inventory + image metadata to R2 `snapshots/<ts>_<actor>.json`.
- `GET /snapshots` (gated) → lists saved snapshots, newest first.
- `POST /restore {key}` (gated) → **SOFT restore**: full-replaces `inventory`, UPSERTs `catalog`, adds aliases. Deliberately never `DELETE`s catalog (would cascade-wipe `print_image` + `machine_print`). Auto-takes a `pre-restore` snapshot first, so a restore is itself undoable.
- **D1 Time Travel** is the deeper net (platform-level point-in-time restore, up to 30 days, no code). Documented in `wrangler.toml` + README. This is the true "reinstate a previous rendition" for a catastrophic wipe; the in-app snapshots are the convenient everyday save-points.
- UI: Settings drawer → **Back up now** + **Show backups** (list with per-snapshot **Restore**). Injected once in `app-core.js` → present on every page.

### 2. Soft login (front-end v15)
- `LOGINS = { michael, nick }` config at the top of `app-core.js`. Tapping a name applies that person's baked-in write key + remembers the identity. **Survives browser clears** because the key comes from source, not localStorage — that's the whole point.
- Manual key paste still works (and now clears the remembered identity).
- Multi-key worker auth: `gate()` accepts `WRITE_KEY` (→ actor `michael`) or optional `WRITE_KEY_NICK` (→ `nick`) and returns the actor. `/snapshot` stamps who took it.

---

## ⚠️ ACCEPTED SECURITY TRADEOFF (Michael, 2026-07-22) — load-bearing, don't silently undo

Baking write keys into `LOGINS` puts them in a **public GitHub Pages** bundle (readable in view-source). This is a **deliberately accepted** low risk for a 2-person, no-personal-data print tracker. Worst case: a corrupted catalog/collection — fully covered by the in-app backups + D1 Time Travel above. **Do NOT treat baked-in keys as a bug to “fix” in a later pass without checking with Michael.** If the app ever grows personal data or more users, revisit (real auth / server-side sessions). Logged in the Inciardi Decision Log.

---

## One-time setup Michael still owes (documented, not code)

1. Paste his key (and Nick's, or reuse his) into `LOGINS` in `app-core.js`, commit. Until then the identity buttons hide and it falls back to manual paste.
2. (Optional, for a separate Nick key + attribution) `wrangler secret put WRITE_KEY_NICK` on the Worker.
3. Confirm D1 Time Travel is available: `wrangler d1 time-travel info inciardi-market`.

---

## Guardrails honored

- Reuses `app-core.js` (`apiGet/apiPost`, `canWrite`, `toast`, `initChrome`); backup/login UI injected in one place (DRY across all 5 pages).
- Restore is non-destructive to images/machines; auto pre-restore snapshot; confirm() before firing.
- Keys stay server-side secrets on the worker; the `LOGINS` baking is the one accepted client exposure, scoped + documented.
- Mobile-safe, dark default.

---

## Futures (deferred)

- Per-write actor column on `inventory`/`catalog` (“added by Nick” provenance) — worker already knows the actor; needs a schema add + write plumbing.
- Scheduled auto-snapshot (daily cron → `/snapshot`) so there's always a recent save even if nobody taps it.
- Real auth if the app ever grows beyond the two of them / gains personal data.
- Swipe: D1 skip-state for cross-device sync; `first_seen` for true “recently released” ordering; smart-order feed; card-back market value.
