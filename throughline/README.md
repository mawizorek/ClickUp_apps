# Throughline — app plan

One schema for every signal in the building: audio, lighting, video, network, power. Replaces the
Lightwright + Minotaur + spreadsheet stack with a single traceable model, local-first in the browser
and synced to Cloudflare D1.

**Live:** `https://mawizorek.github.io/ClickUp_apps/throughline/` · **Backend:** `https://throughline.mawizorek-online.workers.dev`
**Was `signal-doc/`** through PR #1021; that folder is now a redirect stub that preserves the hash, so old invite links still land.

---

## 1 · Page Hierarchy

```
index.html ................. shell + hash router (template-app chrome, theme join soft-utility)
├── #home → screens/units.js ...... UNITS grid, the primary working surface
│   ├── detail panel .............. unit fields + expected ports + related rows (quick-add)
│   ├── trace panel ............... live signal trace, computed per open
│   └── reports ................... Input Patch · Output Patch · Equipment Pull · Channel Hookup
├── #tables → screens/tables.js ... generic editor for all 14 tables (schema-driven)
├── #access → screens/access.js ... sign-in, bootstrap, users, roles matrix, clone, backups, audit
└── #about → pages/about.html ..... what it is, how sync behaves, roles

FUTURE (placed where they will live)
├── #plot → screens/plot.js ....... 🟡 PLANNED · positions on a plan view
└── #labels → screens/labels.js ... 🟡 PLANNED · cable + fixture label printing
```

---

## 2 · Data Model

14 normalized tables. `schema.js` is the client mirror; `worker.js TABLES` is authoritative; DDL lives in
`worker/migrations/0001_init.sql`.

**Library** (shared across venues and shows) — `signal_types` · `fixture_types` · `type_interfaces`
**Venue** (outlives any show) — `venues` · `shows` · `positions` · `endpoints` · `infrastructure` · `networks`
**Show** (cloned per production) — `units` · `control_points` · `network_interfaces` · `connections` · `assignments`

Load-bearing shapes:

- **Equipment-centric.** A `fixture_type` declares expected ports via `type_interfaces`; a `unit` is one
  physical instance in a show. The detail panel diffs declared ports against actual connections, which is
  what produces the "required, unpatched" list.
- **`control_points` are the virtual things inside a device** — input channels, mix buses, matrices, DCAs,
  multiview slots. They carry their own `endpoint_id`, so a patch can land on a channel, not just a box.
- **`endpoints` is the join everything connects through.** Classes: physical (unit), virtual (control point),
  infra (tie line, circuit). `infrastructure` owns an `endpoint_id` for exactly this reason — tie lines were
  being used as endpoints with no endpoint row, which was a real foreign-key defect.
- **`connections` and `assignments` are one table each, never per-department.** Connections are physical or
  network patches; assignments cover bus sends and group membership (`dest_endpoint` NULL = group only).
- **Signal type is the department.** `signal_types.dept` is what `dept_head` permissions scope on, so the
  access model and the signal vocabulary are the same vocabulary.
- **People are `positions` of type `person`.** A body-pack mic hangs off an actor, not a pipe.
- **A trace is never stored.** Server walks it with a recursive CTE, client mirrors the same walk in `ui.js`;
  parity between the two is covered by the e2e suite.
- **A show template is a clone, not inheritance.** `POST /shows/clone` copies show-scoped rows and remaps
  every id; library and venue rows are shared.

Every domain row carries `rev` (optimistic concurrency), `created_by`, `updated_at` (the sync cursor),
`updated_by`, `deleted_at` (tombstone, so deletes sync).

---

## 3 · Source Modules

| File | Bytes | Note |
| --- | --- | --- |
| `index.html` | 5,992 | shell + router only |
| `schema.js` | 6,418 | table registry, drives every form |
| `db.js` | 8,691 | local store, outbox, shadow, export |
| `sync.js` | 10,325 | /me /sync /batch, client permission mirror |
| `ui.js` | 12,956 | kit: panel, form, endpoint labels, trace |
| `styles.css` | 13,795 | app layer over `template-app/styles.css` |
| `seed.js` | 10,849 | Big Love F26 sample (SPAC) |
| `screens/tables.js` | 4,564 | generic table editor |
| `screens/access.js` | 17,381 | ⚠️ over the 15KB line |
| `screens/units.js` | 19,616 | ⚠️ over the 15KB line |
| `worker/worker.js` | 30,571 | 🔴 double the line; splitting it is queued |

⚠️ **Three files are over budget and that is the top structural debt.** `units.js` splits cleanly at
grid / detail / reports; `access.js` at connection / users+roles / ops; `worker.js` at auth+perms / sync+batch /
admin. Nothing else is close.

---

## 4 · Priority Queue

One ordering per app, and this is it.

1. **`VERSIONS.md` row for `throughline`.** Owed since PR #1019 and still unwritten: the ledger is at
   21,590 B against its own ~22KB ceiling, so the row needs a trim pass in the same commit. Seat Size Sally.
2. **Split the three over-budget modules** along the seams named in section 3.
3. **Decide what owns power and ethernet.** `signal_types.dept` currently groups them as `Infra`, which is a
   signal grouping and not a department anyone is hired into. Open question, Michael's call.
4. **Per-pairing state the renderer needs** — a connection or assignment can answer *whether*, never
   *where-at*. No status, owner or due date on the pairing rows yet.
5. **Plot view** (`#plot`) — positions on a plan.
6. **Label printing** (`#labels`) — cable and fixture labels off `units` + `connections`.

---

## 5 · Related Docs

| Doc | Holds | Status |
| --- | --- | --- |
| `worker/README.md` | Cloudflare setup, roles as data, sync model, backups | current, setup verified end to end 2026-10-15 |
| `worker/console-init.sql` | comment-free DDL for the D1 Console | current |
| `worker/migrations/0001_init.sql` | canonical DDL, commented | current |

🅿️ No Decision Log page yet. Rationale for the model (why equipment-centric, why traces are computed, why
assignments and connections are separate tables) still lives in the build session and should move to one.

---

## 6 · Architecture Rules

- **Local-first, always.** Every edit writes to `localStorage` first and queues in an outbox. The UI never
  waits on the network. `Throughline_v1` is the store key; it auto-migrates from the legacy `SignalDoc_v2`.
- **First save to reach the server wins, and the loser is told.** Stale writes come back `conflict` with the
  server row; `db.js` rolls the local copy back from its shadow. Silent loss is the one unacceptable outcome.
- **The worker is authoritative on permissions.** `sync.js` mirrors the role matrix only to grey out controls.
  Never trust the client mirror for anything but UI.
- **Roles are data, not code.** `_roles.perms` JSON, edited in the Access matrix, applied on next sync. Adding
  a role or re-scoping one must never require a deploy.
- **Locked shows are admin-only**, enforced server-side regardless of grant.
- **Thin router, one module per screen.** A new screen is a new file in `screens/`, registered in `index.html`.
- **Forms are schema-driven.** Add a field to `schema.js` and it appears in the form, the FK pickers and the
  table editor. Never hand-build a form.
- 🔴 **Never read a form field with `form.elements.<name>`.** A field named `length` collides with
  `form.elements.length` and crashed every connection save in v2. Use `querySelector('[name="x"]')`.
- **Three backups, by design:** nightly R2 snapshot (keeps 60), D1 Time Travel (30 days), JSON/Excel export
  from the Units toolbar. The export is the one that works with no Cloudflare account at all.
- **Secrets never land in the repo.** `ADMIN_KEY` lives in the Cloudflare dashboard; user keys are stored as
  SHA-256 only and the plaintext invite is shown exactly once.
