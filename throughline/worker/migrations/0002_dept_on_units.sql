-- 0002: Move department ownership from signal_types to fixture_types (default) and units (override).
-- signal_types.dept remains as protocol-level reference data but is no longer authoritative
-- for permission scoping on units. Department now lives where ownership lives: on the gear.
--
-- fixture_types.dept = class-level default ("Source Four" → LX, "QL5" → Audio)
-- units.dept         = per-instance override (when a specific unit is owned by a different dept)
-- Resolution order:  unit.dept  ??  fixture_type.dept  (signal_types.dept is fallback only)

ALTER TABLE fixture_types ADD COLUMN dept TEXT;
ALTER TABLE units ADD COLUMN dept TEXT;

-- Backfill: fixture_types.dept inherits from their primary_signal's current dept.
-- After this migration, fixture_types.dept is the source of truth for class-level department.
UPDATE fixture_types SET dept = (
  SELECT signal_types.dept FROM signal_types
  WHERE signal_types.id = fixture_types.primary_signal
) WHERE primary_signal IS NOT NULL;
