# Tables

One file per table, mirroring *Manage Database → Tables*. Machine mirror lives in `../schema/tables.json`; each `.md` here is the human-editable per-table doc. Keep `_index.json` in sync on every change.

## Format

Header (Role · Status · App) → description → **Fields** table → **Relationships** → **Open Items** → **Changelog**.

See [../../DOCUMENTATION-STANDARD.md](../../DOCUMENTATION-STANDARD.md) for the full standard.

> This app is a first-pass migration documented **as-built** from the ClickUp source doc; field names/types are unverified against the live FMP file. Statuses read `under-review`/`pending` until the live-file reconciliation pass.
