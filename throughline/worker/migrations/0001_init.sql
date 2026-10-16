-- Throughline D1 schema v1: 14 domain tables + 4 system tables.
-- Every domain row carries: rev (optimistic concurrency), created_by, updated_at (server sync cursor),
-- updated_by, deleted_at (soft delete tombstone so deletes sync).
-- FKs are DEFERRABLE INITIALLY DEFERRED so a batch can insert parent + child in any order;
-- they are checked at commit.
PRAGMA foreign_keys = ON;

-- ================= LIBRARY (shared across venues + shows) =================
CREATE TABLE signal_types (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, protocol TEXT, connector TEXT,
  dept TEXT,                                  -- department grouping (Audio, Lighting, Video, Infra, Control)
  notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE fixture_types (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, mfr TEXT, model TEXT,
  wattage REAL, weight REAL,
  primary_signal TEXT REFERENCES signal_types(id) DEFERRABLE INITIALLY DEFERRED,
  notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE type_interfaces (
  id TEXT PRIMARY KEY,
  type_id TEXT NOT NULL REFERENCES fixture_types(id) DEFERRABLE INITIALLY DEFERRED,
  label TEXT NOT NULL,
  signal_type TEXT REFERENCES signal_types(id) DEFERRABLE INITIALLY DEFERRED,
  direction TEXT, connector TEXT, required INTEGER NOT NULL DEFAULT 0, sort INTEGER, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);

-- ================= VENUE (outlives any show) =================
CREATE TABLE venues (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, abbr TEXT, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE shows (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, season TEXT,
  venue_id TEXT REFERENCES venues(id) DEFERRABLE INITIALLY DEFERRED,
  opening TEXT, designer_snd TEXT, designer_lx TEXT, designer_vid TEXT,
  locked INTEGER NOT NULL DEFAULT 0,          -- 1 = frozen for everyone but admin
  is_template INTEGER NOT NULL DEFAULT 0, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE positions (
  id TEXT PRIMARY KEY,
  venue_id TEXT REFERENCES venues(id) DEFERRABLE INITIALLY DEFERRED,
  show_id TEXT REFERENCES shows(id) DEFERRABLE INITIALLY DEFERRED,   -- NULL = venue position; set = show position
  name TEXT NOT NULL, type TEXT,              -- pipe | room | floor | catwalk | mount | wall | person
  notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE endpoints (
  id TEXT PRIMARY KEY, class TEXT NOT NULL,   -- physical (unit) | virtual (control point) | infra (tie line, circuit)
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE infrastructure (
  id TEXT PRIMARY KEY,
  venue_id TEXT REFERENCES venues(id) DEFERRABLE INITIALLY DEFERRED,
  endpoint_id TEXT REFERENCES endpoints(id) DEFERRABLE INITIALLY DEFERRED,
  label TEXT NOT NULL, type TEXT,             -- audio tie | data tie | power ckt | DMX home run
  endpoint_a TEXT, endpoint_b TEXT, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE networks (
  id TEXT PRIMARY KEY,
  venue_id TEXT REFERENCES venues(id) DEFERRABLE INITIALLY DEFERRED,
  name TEXT NOT NULL, protocol TEXT, subnet TEXT, vlan TEXT, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);

-- ================= SHOW (cloned per production) =================
CREATE TABLE units (
  id TEXT PRIMARY KEY,
  show_id TEXT NOT NULL REFERENCES shows(id) DEFERRABLE INITIALLY DEFERRED,
  endpoint_id TEXT REFERENCES endpoints(id) DEFERRABLE INITIALLY DEFERRED,
  type_id TEXT REFERENCES fixture_types(id) DEFERRABLE INITIALLY DEFERRED,
  unit_num REAL,
  position_id TEXT REFERENCES positions(id) DEFERRABLE INITIALLY DEFERRED,
  direction TEXT, purpose TEXT, channel TEXT, dimmer TEXT, dmx_addr TEXT,
  role TEXT, asset_tag TEXT, label TEXT, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE control_points (
  id TEXT PRIMARY KEY,
  show_id TEXT REFERENCES shows(id) DEFERRABLE INITIALLY DEFERRED,
  endpoint_id TEXT REFERENCES endpoints(id) DEFERRABLE INITIALLY DEFERRED,
  parent_unit_id TEXT NOT NULL REFERENCES units(id) DEFERRABLE INITIALLY DEFERRED,
  label TEXT NOT NULL, cp_type TEXT,
  signal_type TEXT REFERENCES signal_types(id) DEFERRABLE INITIALLY DEFERRED,
  direction TEXT, channel_num TEXT, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE network_interfaces (
  id TEXT PRIMARY KEY,
  show_id TEXT REFERENCES shows(id) DEFERRABLE INITIALLY DEFERRED,
  unit_id TEXT NOT NULL REFERENCES units(id) DEFERRABLE INITIALLY DEFERRED,
  network_id TEXT REFERENCES networks(id) DEFERRABLE INITIALLY DEFERRED,
  ip TEXT, hostname TEXT, port_label TEXT, mac TEXT, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE connections (
  id TEXT PRIMARY KEY,
  show_id TEXT NOT NULL REFERENCES shows(id) DEFERRABLE INITIALLY DEFERRED,
  source_endpoint TEXT NOT NULL REFERENCES endpoints(id) DEFERRABLE INITIALLY DEFERRED,
  dest_endpoint TEXT NOT NULL REFERENCES endpoints(id) DEFERRABLE INITIALLY DEFERRED,
  connection_type TEXT,
  signal_type TEXT REFERENCES signal_types(id) DEFERRABLE INITIALLY DEFERRED,
  cable_label TEXT, cable_color TEXT, length TEXT, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);
CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  show_id TEXT NOT NULL REFERENCES shows(id) DEFERRABLE INITIALLY DEFERRED,
  source_endpoint TEXT NOT NULL REFERENCES endpoints(id) DEFERRABLE INITIALLY DEFERRED,
  dest_endpoint TEXT REFERENCES endpoints(id) DEFERRABLE INITIALLY DEFERRED,   -- NULL = pure group membership
  level TEXT, pre_post TEXT, group_name TEXT, notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1, created_by TEXT, updated_at TEXT NOT NULL, updated_by TEXT, deleted_at TEXT
);

CREATE INDEX ix_units_show ON units(show_id);
CREATE INDEX ix_cp_parent ON control_points(parent_unit_id);
CREATE INDEX ix_conn_src ON connections(source_endpoint);
CREATE INDEX ix_conn_show ON connections(show_id);
CREATE INDEX ix_asg_src ON assignments(source_endpoint);
CREATE INDEX ix_ni_unit ON network_interfaces(unit_id);
CREATE INDEX ix_units_upd ON units(updated_at);
CREATE INDEX ix_conn_upd ON connections(updated_at);
CREATE INDEX ix_asg_upd ON assignments(updated_at);
CREATE INDEX ix_cp_upd ON control_points(updated_at);

-- ================= SYSTEM (not domain; access + audit) =================
CREATE TABLE _roles (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  perms TEXT NOT NULL,                        -- JSON permission matrix, editable by admin (see README)
  updated_at TEXT NOT NULL, updated_by TEXT
);
CREATE TABLE _users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT,
  key_hash TEXT NOT NULL UNIQUE,              -- SHA-256 of the invite key; plaintext is shown once, never stored
  created_at TEXT NOT NULL, created_by TEXT, revoked_at TEXT, last_seen_at TEXT
);
CREATE TABLE _grants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES _users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES _roles(id),
  show_id TEXT NOT NULL DEFAULT '*',          -- '*' = every show
  dept TEXT,                                  -- dept-scoped roles: matches signal_types.dept
  created_at TEXT NOT NULL, created_by TEXT
);
CREATE INDEX ix_grants_user ON _grants(user_id);
CREATE TABLE _changes (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL, actor TEXT, tbl TEXT NOT NULL, row_id TEXT NOT NULL,
  op TEXT NOT NULL,                           -- insert | update | delete
  before TEXT, after TEXT
);
CREATE INDEX ix_changes_row ON _changes(tbl, row_id);

-- Default roles. Scope values: true = all rows, false = none, "show" = rows in a granted show,
-- "dept" = rows whose signal type belongs to the grant's dept (and in a granted show when show-scoped).
-- hidden = tables this role never receives on read.
INSERT INTO _roles (id, name, perms, updated_at) VALUES
('admin', 'Admin', '{"admin":true}', strftime('%Y-%m-%dT%H:%M:%fZ','now')),
('dept_head', 'Department Head', '{"admin":false,"hidden":[],"write":{"units":"dept","control_points":"dept","connections":"dept","assignments":"dept","network_interfaces":"dept","fixture_types":"dept","type_interfaces":"dept","positions":"show","endpoints":"show"},"delete":{"units":"dept","control_points":"dept","connections":"dept","assignments":"dept","network_interfaces":"dept","type_interfaces":"dept","positions":"show"}}', strftime('%Y-%m-%dT%H:%M:%fZ','now')),
('guest', 'Guest Viewer', '{"admin":false,"hidden":["networks","network_interfaces"],"write":{},"delete":{}}', strftime('%Y-%m-%dT%H:%M:%fZ','now'));
