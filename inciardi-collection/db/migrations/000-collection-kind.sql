-- Inciardi Collection — migration 000 · collection.kind + the roster trigger
--
-- ============================================================================
-- 🔴 ALREADY APPLIED. DO NOT RUN THIS FILE.
--
-- Applied by hand in the Cloudflare D1 console on 2026-07-31 at 23:33 ET, before
-- the migration workflow existed. Verified immediately after:
--     kind_col = 1 · trg = 1
--
-- Re-running it WILL fail: SQLite has no `ADD COLUMN IF NOT EXISTS`, so the first
-- statement errors on a duplicate column and — because a D1 batch is atomic — takes
-- the whole file down with it. `applied.log` already lists this file, so the
-- workflow refuses it too. Both guards agree on purpose.
--
-- WHY IT IS COMMITTED AT ALL, GIVEN IT CAN NEVER BE RUN:
-- a migrations directory that starts at 001 is a lie about the schema's history.
-- Anyone reading 001 alone would conclude `collection.kind` does not exist, and the
-- next person to need it would add it a second time. The record IS the value here.
--
-- ⚠️ A FRESH DATABASE MUST NOT BE BUILT FROM THIS DIRECTORY. Migrations describe a
-- TRANSITION from one specific state to another; `db/schema.sql` describes the
-- destination. Rebuild from the canonical schema, never by replaying this folder.
-- ============================================================================
--
-- Scope: Q21 / Q22a → the official-vs-personal split the `collection` table already
-- implied but never named. `roster_size` was documented as "how many artworks SHOULD
-- be in the set" — an external truth an official release has and a pile you invented
-- does not. `kind` says that out loud instead of leaving it inferred from a NULL.

ALTER TABLE collection ADD COLUMN kind TEXT NOT NULL DEFAULT 'personal'
  CHECK (kind IN ('release','exclusive','collab','personal'));

-- 🔴 A personal collection has no external truth about its size, so it must not be
-- able to claim one. SQLite cannot ADD a table-level CHECK to an existing table, so
-- this is the trigger-shaped equivalent — rung 3, used exactly where rung 2 is
-- unavailable rather than as a first resort.
CREATE TRIGGER IF NOT EXISTS trg_collection_roster
BEFORE INSERT ON collection
WHEN NEW.kind = 'personal' AND NEW.roster_size IS NOT NULL
BEGIN SELECT RAISE(ABORT, 'a personal collection has no roster_size'); END;
