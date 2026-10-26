-- 0003_split_infrastructure.sql
-- Split infrastructure into panels + tie_lines (Fiona ruling, 2026-10-26)
--
-- infrastructure held two structurally different entities discriminated by
-- a type column: panels (location, no connections) and tie lines (path
-- between two panels). This migration normalises them into two tables.

CREATE TABLE panels (
  id TEXT PRIMARY KEY,
  venue_id TEXT,
  endpoint_id TEXT,
  label TEXT NOT NULL,
  notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1,
  created_by TEXT,
  updated_at TEXT,
  updated_by TEXT,
  deleted_at TEXT
);

CREATE TABLE tie_lines (
  id TEXT PRIMARY KEY,
  venue_id TEXT,
  endpoint_id TEXT,
  label TEXT NOT NULL,
  signal_type TEXT,
  endpoint_a TEXT,
  endpoint_b TEXT,
  notes TEXT,
  rev INTEGER NOT NULL DEFAULT 1,
  created_by TEXT,
  updated_at TEXT,
  updated_by TEXT,
  deleted_at TEXT
);

-- Migrate panels (type = 'panel')
INSERT INTO panels (id, venue_id, endpoint_id, label, notes, rev, created_by, updated_at, updated_by, deleted_at)
SELECT id, venue_id, endpoint_id, label, notes, rev, created_by, updated_at, updated_by, deleted_at
FROM infrastructure WHERE type = 'panel';

-- Migrate tie lines (everything else)
INSERT INTO tie_lines (id, venue_id, endpoint_id, label, signal_type, endpoint_a, endpoint_b, notes, rev, created_by, updated_at, updated_by, deleted_at)
SELECT id, venue_id, endpoint_id, label, type, endpoint_a, endpoint_b, notes, rev, created_by, updated_at, updated_by, deleted_at
FROM infrastructure WHERE type != 'panel';

-- Drop the old table
DROP TABLE infrastructure;
