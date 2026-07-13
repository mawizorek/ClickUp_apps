-- Inciardi Market — vending machine research seed (2026-07-13)
-- ADDITIVE to seed-catalog.sql, which already seeds 4 Richard Scarry machines
-- (McCoy Kids, Tidal Pages, Alice Ever After, Thank You Books). This file adds
-- 10 net-new machines surfaced in a web research pass. Do NOT re-list the base 4.
--
-- Apply AFTER schema.sql + seed-catalog.sql:
--   wrangler d1 execute inciardi-market --remote --file=inciardi-market/db/seed-machines.sql
--
-- Idempotent via INSERT OR IGNORE on the machine_id PK.
-- status='unknown': each machine is press/locator-CONFIRMED as installed, but live
--   stock state (active/empty/out-of-stock) is not verified here — the scrub pass sets it.
-- locked=0: seed baseline, so the catalog-research harvest can enrich (addresses, lat/lng,
--   status, machine_print links) without a hand-lock guard blocking it.
-- collection: NULL = general food-minis machine; 'richard-scarry' = Busy World exclusive host.
--
-- SOURCES (per machine, cited in notes):
--   Boston General Store          bostongeneralstore.com/blogs/news (2026-05)
--   Mermaid Books                 ctpost.com + vendingtimes.com (2025-09)
--   Good Deeds Market             gooddeedsmarket.com blog (2026-03)
--   Soleil / Wild Oats            downeast.com Maine-made feature (2024) — older, verify current
--   Tulsa Lit Co                  instagram/@inciardimachines + shop post
--   A Shop of Things / Albany and Avers / All The Feels   official Stockist store locator

PRAGMA foreign_keys = ON;

-- ---------- general food-mini machines ----------
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('boston-general-store-brookline','Boston General Store (Coolidge Corner)',NULL,'Brookline','MA',NULL,'unknown','press','Coolidge Corner shop; machines added spring 2026. src: bostongeneralstore.com','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('boston-general-store-dedham','Boston General Store (Dedham Square)',NULL,'Dedham','MA',NULL,'unknown','press','Dedham Square shop; machines added spring 2026. src: bostongeneralstore.com','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('good-deeds-market-cape-may','Good Deeds Market',NULL,'Cape May','NJ',NULL,'unknown','host-shop','Zero-waste market host. src: gooddeedsmarket.com (2026-03)','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('soleil-portland','Soleil',NULL,'Portland','ME',NULL,'unknown','press','Home-goods boutique. src: downeast.com (2024) — older sighting, verify still active','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('wild-oats-brunswick','Wild Oats Bakery',NULL,'Brunswick','ME',NULL,'unknown','press','Bakery host. src: downeast.com (2024) — older sighting, verify still active','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('a-shop-of-things-nashville','A Shop of Things Nashville','3239 Gallatin Pike','Nashville','TN',NULL,'unknown','store-locator','Listed on official Stockist store locator (37216)','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('albany-and-avers-omaha','Albany and Avers','5011 Underwood Ave','Omaha','NE',NULL,'unknown','store-locator','Listed on official Stockist store locator','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('all-the-feels-houston','All The Feels','3223 Milam Street','Houston','TX',NULL,'unknown','store-locator','Listed on official Stockist store locator (Milam St, Midtown Houston)','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');

-- ---------- Richard Scarry (Busy World) exclusive machines ----------
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('mermaid-books-milford','Mermaid Books',NULL,'Milford','CT','richard-scarry','unknown','press','Only Richard Scarry machine in CT; carries 11 prints. src: ctpost.com + vendingtimes.com (2025-09)','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,address,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('tulsa-lit-co-tulsa','Tulsa Lit Co',NULL,'Tulsa','OK','richard-scarry','unknown','host-shop','Richard Scarry prints in in-store machine. src: @inciardimachines / shop post','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
