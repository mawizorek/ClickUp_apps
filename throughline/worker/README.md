# Throughline backend (Cloudflare Worker + D1)

Local-first sync server for `throughline/`. 14 domain tables + 4 system tables (`_roles`, `_users`, `_grants`, `_changes`).
Frontend stays on GitHub Pages; this folder is a deploy target only.

## One-time setup (about 10 minutes)

1. **Create the database.** Cloudflare dashboard > Storage & Databases > D1 > Create > name it `throughline`. Copy its **Database ID**.
2. **Paste the ID** into `wrangler.toml` (`database_id`), replacing `REPLACE_WITH_D1_DATABASE_ID`. Commit to main (or have Brain do it).
3. **Create the tables.** In the D1 database > Console, paste the whole of `console-init.sql` and run it (comment-free copy of
   `migrations/0001_init.sql`; the Console flattens pastes to one line, so `--` comments would swallow everything).
   (CLI alternative: `wrangler d1 migrations apply throughline --remote` from this folder.)
4. **Create the backup bucket.** R2 > Create bucket > `throughline-backups`. Must exist before the first deploy.
5. **Connect the Worker to the repo.** Workers & Pages > Create > Import a repository > `mawizorek/ClickUp_apps`.
   Project name `throughline`, **root directory `throughline/worker`**, branch `main`. Deploy.
6. **Set the admin key.** Worker > Settings > Variables and Secrets > Add > type **Secret**, name `ADMIN_KEY`,
   value = a long random string (password manager). This is your break-glass root login. Never commit it.
7. **Copy the Worker URL** (`https://throughline.<your-subdomain>.workers.dev`) and set it as `"api"` in `throughline/config.json`.
8. **Sign in.** Open the app > Access > paste `ADMIN_KEY` > Sign in. If this browser has sample/offline data you'll be asked
   to upload it or discard it.

Check it's alive: open `<worker url>/health` and you should see `{"ok":true,...}`.

## Roles (data, not code)

Stored in `_roles.perms` and editable on the Access screen. Scopes: `show` (rows in a granted show), `dept` (rows whose
signal type's `dept` matches the grant's dept), `true` (all), absent = none. `hidden` tables never reach that role.

- **Admin**: `{"admin": true}`. Everything, plus users/roles/clone/snapshots. Locked shows are admin-only.
- **Department head**: writes units, control points, connections, assignments, IPs, fixture types, type interfaces by dept;
  show positions by show. A connection counts as theirs if either end is one of their units.
- **Guest viewer**: read-only, no networks or IPs.

A grant = user + role + show (`*` = all) + dept. Users get an invite link (`#invite=KEY`); keys are stored as SHA-256 only.

## Sync model

- Client writes locally, queues an outbox, `POST /batch` with each row's `base_rev`.
- Server rejects stale writes with `conflict` + the current row: first save to reach the server wins, the other device is told.
- `GET /sync?since=` pulls changes (tombstones included). Full resync whenever a user's grants change.
- Every write is logged in `_changes` with before/after JSON.

## Backups

- Nightly cron (08:00 UTC) JSON snapshot to R2 `snapshots/`, keeps 60. Manual: Access > Backups > Snapshot now.
- D1 Time Travel, 30 days, no code: `wrangler d1 time-travel restore throughline --timestamp=<ISO8601>`.
- JSON / Excel export from the Units screen.
