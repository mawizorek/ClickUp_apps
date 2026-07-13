-- Inciardi Market — catalog + machine seed (v2, 2026-07-13)
-- Regenerated against the REAL catalog columns (print_id,title,category,exclusive,retail,
-- in_print,pack_of,pack_from,source,locked,notes,created_at,updated_at). The old seed
-- inserted into series/exclusive-as-int/status columns that no longer exist and errored.
-- Apply AFTER schema.sql:
--   wrangler d1 execute inciardi-market --remote --file=inciardi-market/db/seed-catalog.sql
-- Idempotent via INSERT OR IGNORE on the print_id / (machine_id) / (machine_id,print_id) PKs.
-- source='seed' baseline stays locked=0 so the research harvest can enrich each row.
-- Data mirrors catalog.json (2026-07-10 harvest); the harvest is the growing source of truth.

PRAGMA foreign_keys = ON;

-- ---------- catalog: minis ----------
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('negroni','Negroni','mini',NULL,6,1,'vending',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('olive','Olive','mini',NULL,15,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('slice-of-cheese-1','Slice of Cheese #1','mini',NULL,13,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('slice-of-cheese-2','Slice of Cheese #2','mini',NULL,13,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('you-me-conversation-heart','You & Me Conversation Heart','mini',NULL,13,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('strawberry','Strawberry','mini',NULL,15,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('jam','Jam','mini',NULL,15,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('cornichon','Cornichon','mini',NULL,15,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('macaroni','Macaroni','mini',NULL,13,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('bird-s-eye-chili','Bird''s Eye Chili','mini',NULL,15,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('milk','Milk','mini',NULL,6,1,'vending',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('clementine','Clementine','mini',NULL,6,1,'vending',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('tinned-fish','Tinned Fish','mini',NULL,6,1,'vending',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('goldfish','Goldfish','mini',NULL,6,1,'vending',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('cheez-it','Cheez-It','mini',NULL,6,1,'vending',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');

-- ---------- catalog: bigger risograph ----------
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('metrocard-risograph','MetroCard Risograph','big-riso',NULL,70,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('on-the-road-risograph','On The Road Risograph','big-riso','richard-scarry',187,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('evening-on-the-b-train-risograph','Evening on the B Train Risograph','big-riso',NULL,187,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('jello-risograph','Jello Risograph','big-riso',NULL,117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('lowly-worm-risograph','Lowly Worm Risograph','big-riso','richard-scarry',117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('pickle-car-risograph','Pickle Car Risograph','big-riso','richard-scarry',117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('rainbow-swiss-chard-risograph','Rainbow Swiss Chard Risograph','big-riso',NULL,117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('grand-central-terminal-ceiling-risograph','Grand Central Terminal Ceiling Risograph','big-riso','grand-central',117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('grand-central-terminal-clock-risograph','Grand Central Terminal Clock Risograph','big-riso','grand-central',117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('rainbow-sprinkles-risograph','Rainbow Sprinkles Risograph','big-riso',NULL,117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('negroni-risograph','Negroni Risograph','big-riso',NULL,117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('blue-cake-risograph','Blue Cake Risograph','big-riso',NULL,117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('martini-risograph','Martini Risograph','big-riso',NULL,117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('blueberries-risograph','Blueberries Risograph','big-riso',NULL,117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('hot-dog-risograph','Hot Dog Risograph','big-riso',NULL,117,0,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');

-- ---------- catalog: linocut ----------
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('rainbow-cookie','Rainbow Cookie','linocut',NULL,15,1,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('mini-pbr-can','Mini PBR Can','linocut',NULL,15,1,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('camp-coffee','Camp Coffee','linocut',NULL,15,1,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('hot-dog','Hot Dog','linocut',NULL,15,1,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('cento-tomato-can','Cento Tomato Can','linocut',NULL,15,1,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('garlic-scapes','Garlic Scapes','linocut',NULL,15,1,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('tulip-bouquet','Tulip Bouquet','linocut',NULL,15,1,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('carrots','Carrots','linocut',NULL,15,1,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');

-- ---------- catalog: exclusives (press-sourced, retail unknown) ----------
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('grand-central-terminal-ceiling-mini','Grand Central Terminal Ceiling (mini)','exclusive','grand-central',NULL,0,'press',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('monet-s-flowers','Monet''s Flowers','exclusive','lacma',NULL,0,'press',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('pipe','Pipe','exclusive','lacma',NULL,0,'press',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('lamp-post','Lamp Post','exclusive','lacma',NULL,0,'press',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('lowly-worm','Lowly Worm','exclusive','richard-scarry',NULL,0,'press',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('pickle-car','Pickle Car','exclusive','richard-scarry',NULL,0,'press',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,source,locked,created_at,updated_at) VALUES ('holiday-edition','Holiday Edition','exclusive','holiday',NULL,0,'press',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');

-- ---------- catalog: mystery packs ----------
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,created_at,updated_at) VALUES ('richard-scarry-mystery-pack','Richard Scarry Mini Print Mystery Pack','pack','richard-scarry',15,1,7,NULL,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,created_at,updated_at) VALUES ('classics-mystery-pack','Classics Mini Print Mystery Pack','pack',NULL,15,1,10,50,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,created_at,updated_at) VALUES ('spring-mystery-pack','Spring Mini Print Mystery Pack','pack',NULL,15,0,7,15,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,created_at,updated_at) VALUES ('winter-mystery-pack','Winter Mini Print Mystery Pack','pack',NULL,10,0,5,10,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,created_at,updated_at) VALUES ('valentines-mystery-pack','Valentine''s Mini Print Mystery Pack','pack',NULL,15,0,7,13,'shop-harvest',0,'2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');

-- ---------- catalog_alias: known seller/framed variants ----------
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('olive','Framed Olive','framed olive');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('slice-of-cheese-1','Cheese #1','cheese 1');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('slice-of-cheese-1','Framed slice of cheese #1','framed slice of cheese 1');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('slice-of-cheese-2','Cheese #2','cheese 2');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('slice-of-cheese-2','Framed slice of cheese #2','framed slice of cheese 2');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('strawberry','Framed Strawberry','framed strawberry');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('jam','Mini Jam','mini jam');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('cornichon','Framed Cornichon','framed cornichon');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('macaroni','Framed Macaroni','framed macaroni');
INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES ('bird-s-eye-chili','Framed Bird''s Eye Chili','framed bird s eye chili');

-- ---------- machine: known host-shop machines (status unknown until first scrub) ----------
INSERT OR IGNORE INTO machine (machine_id,name,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('mccoy-kids-tacoma','McCoy Kids','Tacoma','WA','richard-scarry','unknown','host-shop','Quarters only','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('tidal-pages-ipswich','Tidal Pages Bookshop','Ipswich','MA','richard-scarry','unknown','press','Drew lines around the block','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('alice-ever-after-books','Alice, Ever After Books',NULL,NULL,'richard-scarry','unknown','host-shop','One of ~100 host shops','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');
INSERT OR IGNORE INTO machine (machine_id,name,city,state,collection,status,source,notes,created_at,updated_at) VALUES ('thank-you-books-birmingham','Thank You Books','Birmingham','AL','richard-scarry','unknown','store-locator','Listed on official store locator','2026-07-13T17:00:00Z','2026-07-13T17:00:00Z');

-- machine_print links are intentionally NOT seeded: which prints sit in which machine is
-- live stock data the research/scrub pass fills (see catalog-research-routine.md, machine step).
