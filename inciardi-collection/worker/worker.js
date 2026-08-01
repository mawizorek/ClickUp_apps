/* Inciardi Collection — API worker
 *
 * The gate, the dispatch table, and the writes for artwork / copy / slot.
 *
 * ============================================================================
 * FIVE FILES. This one is the door; the rest are rooms.
 *
 *   worker.js  — CORS, the write-key gate, the dispatch table, artwork/copy/slot writes
 *   reads.js   — seven GETs. No auth, no mutation, no shared state
 *   images.js  — the photo pipe: upload, serve, list, assign, set-primary, archive
 *   adopt.js   — the one-off passes: the legacy 177 import, and the bucket diagnostic
 *   sheets.js  — binder mechanics: create, rename, reorder a sheet
 *
 * 📏 ~16KB against a ~22KB practical ceiling (base64 inflates 4/3 against a ~30KB read cap).
 * That is real headroom for the first time since v7 — and it was bought twice in one day.
 * ⚠️ THE RULE THAT KEEPS IT: MEASURE THIS FILE BEFORE YOU WRITE INTO IT. On 2026-08-01 it went
 * 21,169 → 24,503 bytes purely on comment weight, in the same commit that fixed `images.js` for
 * the identical mistake. Two breaches, one session, both invisible until the byte count was
 * read back. A file near the ceiling has room for a dispatch OR a header, never both.
 * ============================================================================
 *
 * DESIGN NOTES THAT MATTER (decision log J6, ladder rung 4 — "one write path"):
 *   - Every mutation goes through `write()` or `db.batch()`, so auth, timestamps and error
 *     shape are decided once. A second door is how the two surfaces in the predecessor drifted.
 *   - The database does the arguing, not this file. Constraint violations are returned
 *     verbatim rather than pre-validated here, because a JS validator that disagrees with
 *     the schema is a THIRD source of truth. If D1 says no, the answer is no.
 *   - Reads never require a key. The repo is public and the data is which prints Michael
 *     owns. Writes always require one.
 *
 * 🔴 SCHEMA DRIFT IS THIS APP'S DOCUMENTED FAILURE MODE — read before editing any SQL.
 * On 2026-08-01 migration 001 dropped `artwork.collection_id` and the code kept inserting it
 * for five hours. Every entry attempt failed. The app looked healthy the whole time because
 * `/health` is the one route that names none of the altered columns. **When the schema moves,
 * grep EVERY worker file for every column the migration touched — and smoke-test a route that
 * reads the ALTERED TABLE, never the health check.**
 *
 * SECURITY — CORRECTED 2026-07-30. This header used to say "WRITE_KEY is a wrangler secret,
 * it is NOT in the shipped bundle." That is now FALSE and was false for most of a day:
 *   - The key ships in the public front-end (`core.js` → DEFAULT_KEY) so a freshly-cleared
 *     browser can write with nothing pasted. Michael's call, exposure stated and accepted.
 *   - It also ships in `wrangler.toml` under [vars], because a Cloudflare Secret cannot be
 *     read back and the dashboard did not even list this worker when he went looking.
 *   - So: ASSUME THE KEY IS PUBLIC. The gate below stops accidents and crawlers, not a
 *     determined reader. The safety net is D1 Time Travel (30 days).
 *   - ⚠️ AND THAT NET DOES NOT COVER R2. Bytes are not restorable, which is why `images.js`
 *     has no delete route and archiving never removes an object.
 *   - Still true: AN UNSET WRITE_KEY REFUSES ALL WRITES. "No secret configured" never means open.
 *   - CORS is an allowlist, not `*`. Constrains browsers, not curl — but a wildcard on a
 *     key-authenticated API lets any page anywhere spend the key it just watched you type.
 */

import { handleRead, READ_ROUTES } from './reads.js';
import { handleImage, IMAGE_ROUTES } from './images.js';
import { handleAdopt, ADOPT_ROUTES } from './adopt.js';
import { handleSheet, SHEET_ROUTES } from './sheets.js';

const ALLOWED_ORIGINS = [
  'https://mawizorek.github.io',
  'http://localhost:8788',
  'http://127.0.0.1:8788'
];

const json = (data, status, origin) => new Response(JSON.stringify(data, null, 2), {
  status: status || 200,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',            // Fetch Honesty Law: never serve a stale write
    ...cors(origin)
  }
});

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin);
  return {
    'access-control-allow-origin': ok ? origin : ALLOWED_ORIGINS[0],
    'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type,x-write-key',
    'access-control-max-age': '86400',
    'vary': 'origin'
  };
}

/* An id is IDENTITY and permanent, so a bad one is a permanent bad one.
 * `slug('#1')` collapses to '1' for every numbered variant — the exact collision that
 * started this rebuild. So: derive, then REFUSE anything that came out useless rather
 * than quietly storing a mangled key. */
function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}
function badSlug(id) {
  if (!id || id.length < 2) return 'too short to be an identity';
  if (/^[0-9-]+$/.test(id)) return 'digits only — "#4" and "7/12" both collapse to numbers, which is the collision that broke the last app';
  return null;
}

const WRITE_ROUTES = ['POST /artwork', 'POST /copy', 'POST /slot', 'DELETE /slot?id='];

const now = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || '';
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const reply = (d, s) => json(d, s, origin);

    /* ---- write gate ---------------------------------------------------- */
    const isWrite = method === 'POST' || method === 'DELETE';
    if (isWrite) {
      if (!env.WRITE_KEY) {
        return reply({ error: 'server has no WRITE_KEY configured', fix: 'set WRITE_KEY under [vars] in wrangler.toml and re-run the deploy workflow' }, 503);
      }
      const sent = request.headers.get('x-write-key') || '';
      // length check first so a wrong-length key cannot be distinguished by timing
      let same = sent.length === env.WRITE_KEY.length;
      for (let i = 0; i < sent.length; i++) {
        if (sent.charCodeAt(i) !== env.WRITE_KEY.charCodeAt(i)) same = false;
      }
      if (!same) return reply({ error: 'bad or missing write key' }, 401);
    }

    const db = env.DB;
    const t = now();
    const all = async (sql, params) => (await db.prepare(sql).bind(...(params || [])).all()).results || [];

    /* One door for every mutation: same auth, same timestamps, same error shape. */
    async function write(sql, params) {
      try {
        const r = await db.prepare(sql).bind(...params).run();
        return reply({ ok: true, changes: r.meta ? r.meta.changes : undefined });
      } catch (e) {
        // Return the constraint message verbatim. The schema is the authority; this file does
        // not re-litigate it, and a helpful lie is worse than a blunt truth.
        return reply({ ok: false, error: String(e.message || e) }, 400);
      }
    }

    try {
      /* ================= READS — reads.js ================= */
      /* Each module returns null on no match, which is what lets the next one run. A module
       * that 404'd for itself would shadow everything below it, so the "nothing matched"
       * verdict stays HERE, in the one file that can see the whole route table. */
      if (method === 'GET') {
        const read = await handleRead({ path, url, all, reply, t });
        if (read) return read;
      }

      /* ================= IMAGES — images.js + adopt.js =================
       *
       * 🔴 THIS DISPATCH MUST STAY ABOVE THE BODY PARSE BELOW. NOT A STYLE CHOICE.
       * `await request.json()` CONSUMES THE REQUEST STREAM, and an upload's body is BYTES.
       * Dispatched after the parse, images.js would receive an already-drained body and write a
       * ZERO-LENGTH OBJECT to R2 behind a perfectly successful 200 — a silent empty file that
       * looks exactly like a working upload. The write-key gate above already fired, so auth is
       * NOT relocated by this ordering; only body handling is.
       *
       * ⚠️ `env.BUCKET` may be undefined if a deploy failed on R2 permissions. Passed through
       * as-is: images.js reports that as a deployment fact and names the Actions run, rather
       * than throwing a stack trace at a phone. */
      const ictx = { request, db, bucket: env.BUCKET, all, reply, path, url, method, t };
      const img = await handleImage(ictx);
      if (img) return img;
      const adopted = await handleAdopt(ictx);
      if (adopted) return adopted;

      /* ================= WRITES ================= */

      let body = {};
      if (isWrite) {
        try { body = await request.json(); } catch (e) { body = {}; }
      }

      // Binder mechanics — sheets.js. JSON bodies, so this dispatches AFTER the parse.
      const sheet = await handleSheet({ db, all, write, reply, body, path, method, t });
      if (sheet) return sheet;

      /* Enter a print. ONE call does the whole thing:
       *   artwork row -> trigger mints the implicit edition -> optional copy row.
       * That is J2 ruling 4 (a card is an input surface) and the acceptance test:
       * no worker logic is required for this to be true, only the schema. */
      if (path === '/artwork' && method === 'POST') {
        const name = String(body.name || '').trim();
        if (!name) return reply({ ok: false, error: 'name is required' }, 400);

        const id = String(body.artwork_id || '').trim() || slugify(name);
        const bad = badSlug(id);
        if (bad) return reply({ ok: false, error: 'artwork_id "' + id + '" rejected: ' + bad, hint: 'give an explicit id' }, 400);

        /* 🔴 `collection_id` IS NOT A COLUMN HERE ANY MORE (migration 001). It was still in this
         * INSERT for five hours after the migration and EVERY entry failed with "table artwork
         * has no column named collection_id". Membership moved to `artwork_collection`, handled
         * below — the client's `collection_id` is honoured, not dropped.
         * `medium` and `authorship` are new in 001 and had no write path at all until now. Both
         * stay OPTIONAL and entry never asks for them (the "comfortably" rule, schema.sql). */
        try {
          await db.prepare(
            `INSERT INTO artwork (artwork_id,name,category,medium,authorship,edition_type,retail,
                                  provenance,confidence,notes,created_at,updated_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
          ).bind(
            id, name,
            body.category || 'mini',              // v1 is mini prints; the column defaults too
            body.medium || null,
            body.authorship || null,
            body.edition_type || 'open',
            body.retail === '' || body.retail == null ? null : Number(body.retail),
            body.provenance || 'owned',
            body.confidence || 'named',
            body.notes || null,
            t, t
          ).run();
        } catch (e) {
          const msg = String(e.message || e);
          if (/UNIQUE/i.test(msg)) return reply({ ok: false, error: 'artwork_id "' + id + '" already exists', existing: id }, 409);
          return reply({ ok: false, error: msg }, 400);
        }

        // The trigger created <id>:e1 inside the same transaction as the artwork.
        const eds = await all('SELECT edition_id, implicit FROM edition WHERE artwork_id = ?', [id]);

        /* Membership, now many-to-many. `enter.js` still sends `collection_id`; honour it as ONE
         * join row rather than discarding it. Failure is reported, never swallowed — usually it
         * means the collection does not exist, which is the FK doing its job. */
        let collection_error = null;
        if (body.collection_id) {
          try {
            await db.prepare(
              `INSERT OR IGNORE INTO artwork_collection (artwork_id,collection_id,created_at)
               VALUES (?,?,?)`
            ).bind(id, String(body.collection_id).trim(), t).run();
          } catch (e) { collection_error = String(e.message || e); }
        }

        let copy_id = null;
        if (body.own) {
          copy_id = id + '-c1';
          try {
            await db.prepare(
              `INSERT INTO copy (copy_id,edition_id,edition_type,qty,acquired_where,acquired_at,
                                 notes,created_at,updated_at)
               VALUES (?,?,?,?,?,?,?,?,?)`
            ).bind(copy_id, id + ':e1', body.edition_type || 'open',
                   Math.max(1, parseInt(body.qty, 10) || 1),
                   body.acquired_where || null, body.acquired_at || null,
                   null, t, t).run();
          } catch (e) {
            // The artwork landed and is canonical; only the ownership claim failed. Say exactly
            // that instead of implying the whole thing rolled back.
            return reply({ ok: true, artwork_id: id, editions: eds, collection_error: collection_error, copy_error: String(e.message || e) }, 207);
          }
        }
        if (collection_error) {
          return reply({ ok: true, artwork_id: id, editions: eds, copy_id: copy_id, collection_error: collection_error }, 207);
        }
        return reply({ ok: true, artwork_id: id, editions: eds, copy_id: copy_id });
      }

      // "I have this" on an existing edition. Not a state change — a copy row (J3).
      if (path === '/copy' && method === 'POST') {
        const ed = String(body.edition_id || '').trim();
        if (!ed) return reply({ ok: false, error: 'edition_id is required' }, 400);
        const rows = await all('SELECT edition_type FROM edition WHERE edition_id = ?', [ed]);
        if (!rows.length) return reply({ ok: false, error: 'no edition "' + ed + '"' }, 404);
        return write(
          `INSERT INTO copy (copy_id,edition_id,edition_type,qty,acquired_price,acquired_where,
                             acquired_at,notes,created_at,updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [body.copy_id || (ed.replace(/:/g, '-') + '-' + Date.now().toString(36)),
           ed, rows[0].edition_type,
           Math.max(1, parseInt(body.qty, 10) || 1),
           body.acquired_price === '' || body.acquired_price == null ? null : Number(body.acquired_price),
           body.acquired_where || null, body.acquired_at || null, body.notes || null, t, t]);
      }

      /* Place something in a slot. artwork_id + OPTIONAL edition_id (Q12 = B).
       * The composite FK makes a mismatched pair unwriteable, so this does not check it —
       * the database refuses and the message comes straight back. */
      if (path === '/slot' && method === 'POST') {
        const sh = String(body.sheet_id || '').trim();
        const side = String(body.side || 'A').toUpperCase();
        const pos = parseInt(body.position, 10);
        if (!sh) return reply({ ok: false, error: 'sheet_id is required' }, 400);
        if (!(pos >= 0 && pos <= 8)) return reply({ ok: false, error: 'position must be 0-8 (nine slots a face)' }, 400);
        return write(
          `INSERT INTO slot (slot_id,sheet_id,side,position,artwork_id,edition_id,note,created_at,updated_at)
           VALUES (?,?,?,?,?,?,?,?,?)
           ON CONFLICT(sheet_id,side,position) DO UPDATE SET
             artwork_id=excluded.artwork_id, edition_id=excluded.edition_id,
             note=excluded.note, updated_at=excluded.updated_at`,
          [body.slot_id || (sh + '-' + side.toLowerCase() + pos), sh, side, pos,
           body.artwork_id || null, body.edition_id || null, body.note || null, t, t]);
      }

      // Clearing a slot DELETES the row. Sparse rows are the design: absence IS empty (J3).
      if (path === '/slot' && method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return reply({ ok: false, error: 'id is required' }, 400);
        return write('DELETE FROM slot WHERE slot_id = ?', [id]);
      }

      /* The route list spans FIVE files, so it is CONCATENATED rather than retyped. A hardcoded
       * copy here would be a second claimant on "which routes exist" and would rot the first
       * time a route is added next door. */
      return reply({ error: 'no route for ' + method + ' ' + path,
                     routes: READ_ROUTES.concat(WRITE_ROUTES, SHEET_ROUTES, IMAGE_ROUTES, ADOPT_ROUTES) }, 404);

    } catch (e) {
      // Loud, not silent. A 500 that pretends to be an empty result is the failure mode
      // this whole app was rebuilt to eliminate.
      return reply({ error: 'worker: ' + String(e.message || e) }, 500);
    }
  }
};
