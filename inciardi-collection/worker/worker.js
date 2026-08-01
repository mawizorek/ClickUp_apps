/* Inciardi Collection — API worker
 *
 * The only write path into D1. Fourteen routes, two files.
 *
 * ============================================================================
 * 🔴 SPLIT 2026-08-01. The seven GET routes moved to `worker/reads.js`.
 *
 * This file was **29,326 bytes against a ~30KB hard read cap** — 674 bytes of headroom, so it
 * was one careless paragraph away from being unreadable-whole, and a file that cannot be read
 * whole cannot be safely edited. Three consecutive version notes promised this split "before the
 * next route," and `worker/images.js` is the next route.
 *
 * THE SEAM IS PURE/IMPURE, not size-for-size. Reads need no auth, write nothing, and share no
 * state — the original file already had them under their own banner comment. **The writes stayed
 * here on purpose:** the one-write-path rule (J6 rung 4) should live in the file called
 * `worker.js`, and the dangerous half should be where every reader looks first.
 *
 * 📏 ⚠️ ~21KB AFTER THE 08-01 P0 FIX, against a ~22KB practical ceiling. THE NEXT ROUTE DOES NOT
 * GO IN THIS FILE. The seam is already obvious: `/sheet`, `/sheet/rename` and `/sheet/reorder`
 * are ~6KB of binder mechanics with nothing to do with entering a print — they become
 * `worker/sheets.js` the moment anything else needs to land here.
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
 * 🔴 SCHEMA DRIFT IS THIS FILE'S DOCUMENTED FAILURE MODE — read before editing any SQL here.
 * On 2026-08-01 migration 001 dropped `artwork.collection_id` and this file kept inserting it
 * for five hours. Every entry attempt failed. The app looked healthy the whole time because
 * `/health` is the one route that names none of the altered columns. **When the schema moves,
 * grep BOTH worker files for every column the migration touched — and smoke-test a route that
 * reads the altered table, never the health check.**
 *
 * SECURITY — CORRECTED 2026-07-30. This header used to say "WRITE_KEY is a wrangler secret,
 * it is NOT in the shipped bundle." That is now FALSE and was false for most of a day before
 * anyone fixed the comment:
 *   - The key ships in the public front-end (`core.js` → DEFAULT_KEY) so a freshly-cleared
 *     browser can write with nothing pasted. Michael's call, exposure stated and accepted.
 *   - It also ships in `wrangler.toml` under [vars], because a Cloudflare Secret cannot be
 *     read back and the dashboard did not even list this worker when he went looking.
 *   - So: ASSUME THE KEY IS PUBLIC. The gate below still matters — it stops accidents and
 *     crawlers, not a determined reader. The real safety net is D1 Time Travel (30 days).
 *   - Still true, and still the reason the gate exists at all: AN UNSET WRITE_KEY REFUSES
 *     ALL WRITES. "No secret configured" must never mean "open."
 *   - CORS is an allowlist, not `*`. Constrains browsers, not curl — but a wildcard on a
 *     key-authenticated API lets any page anywhere spend the key it just watched you type.
 */

import { handleRead, READ_ROUTES } from './reads.js';

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

const WRITE_ROUTES = [
  'POST /artwork', 'POST /copy', 'POST /sheet', 'POST /sheet/rename',
  'POST /sheet/reorder', 'POST /slot', 'DELETE /slot?id='
];

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

    let body = {};
    if (isWrite) {
      try { body = await request.json(); } catch (e) { body = {}; }
    }

    const db = env.DB;
    const t = now();

    /* One door for every mutation: same auth, same timestamps, same error shape. */
    async function write(sql, params) {
      try {
        const r = await db.prepare(sql).bind(...params).run();
        return reply({ ok: true, changes: r.meta ? r.meta.changes : undefined });
      } catch (e) {
        // Return the constraint message verbatim. The schema is the authority; this file
        // does not re-litigate it, and a helpful lie is worse than a blunt truth.
        return reply({ ok: false, error: String(e.message || e) }, 400);
      }
    }
    const all = async (sql, params) => (await db.prepare(sql).bind(...(params || [])).all()).results || [];

    try {
      /* ================= READS — worker/reads.js ================= */
      /* Returns null on no match, which is what lets the writes below run. A read module that
       * 404'd for itself would shadow every POST, so the "nothing matched" verdict stays here,
       * in the one file that can see both halves of the route table. */
      if (method === 'GET') {
        const read = await handleRead({ path, url, all, reply, t });
        if (read) return read;
      }

      /* ================= WRITES ================= */

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

      if (path === '/sheet' && method === 'POST') {
        const bid = String(body.binder_id || 'mini-binder');
        await db.prepare('INSERT OR IGNORE INTO binder (binder_id,name,created_at,updated_at) VALUES (?,?,?,?)')
          .bind(bid, body.binder_name || 'Mini Prints', t, t).run();
        const nxt = await all('SELECT COALESCE(MAX(sheet_order)+1,0) AS n FROM sheet WHERE binder_id = ?', [bid]);
        const order = body.sheet_order == null ? nxt[0].n : parseInt(body.sheet_order, 10);
        return write(
          `INSERT INTO sheet (sheet_id,binder_id,title,collection_id,sheet_order,created_at,updated_at)
           VALUES (?,?,?,?,?,?,?)`,
          [body.sheet_id || (bid + '-s' + order), bid, body.title || null,
           body.collection_id || null, order, t, t]);
      }
      /* ⚠️ YES, `sheet.collection_id` IS STILL REAL and the line above is correct. 001 dropped the
       * column from `artwork`, NOT from `sheet` — a sheet's collection is an optional HINT about
       * what it holds (schema.binder.sql). Two different columns, one name. Do not "fix" this one
       * while sweeping for the other. */

      /* ============================================================ /sheet/rename
       * Title only. `title` is free text and deliberately nullable — a sheet with no title
       * falls back to its id in the UI, so clearing the box is a real choice rather than an
       * error. Nothing else about the sheet is touched, and NOTHING inside it moves.
       */
      if (path === '/sheet/rename' && method === 'POST') {
        const id = String(body.sheet_id || '').trim();
        if (!id) return reply({ ok: false, error: 'sheet_id is required' }, 400);
        const rows = await all('SELECT sheet_id FROM sheet WHERE sheet_id = ?', [id]);
        if (!rows.length) return reply({ ok: false, error: 'no sheet "' + id + '"' }, 404);
        const title = body.title == null ? null : String(body.title).trim();
        return write('UPDATE sheet SET title = ?, updated_at = ? WHERE sheet_id = ?',
                     [title || null, t, id]);
      }

      /* ============================================================ /sheet/reorder
       * Rearrange the binder. Takes the COMPLETE desired order of sheet_ids, not a swap or a
       * single move.
       *
       * WHY A WHOLE-ORDER PAYLOAD: a "move sheet X up one" API has to reason about neighbours
       * server-side, and every off-by-one lives in that arithmetic. A full permutation is
       * idempotent, trivially verifiable, and lets the client express any rearrangement —
       * including a future drag-and-drop — through the same one route.
       *
       * 🔴 THE TRAP, AND THE SCHEMA COMMENT THAT WOULD HAVE WALKED ME INTO IT.
       * `sheet` carries UNIQUE (binder_id, sheet_order), so a naive one-by-one renumber
       * collides mid-flight. `schema.binder.sql` said to fix that with "a temporary
       * NEGATIVE-offset pass" — and the very same table has CHECK (sheet_order >= 0), which
       * makes every negative value UNWRITEABLE. Following the documented remedy would fail
       * 100% of the time. Corrected there too, 2026-07-30.
       * So the park pass goes HIGH, not negative: MAX(sheet_order) + 1 and up, which cannot
       * collide with any live value.
       *
       * Both passes go through db.batch(), which D1 runs as ONE transaction. A half-applied
       * reorder — some sheets parked at 900-something, others renumbered — is not a state this
       * app is willing to leave behind.
       *
       * FREE SIDE EFFECT worth knowing: pass two writes 0..n-1, so any gap in sheet_order
       * (from a deleted sheet, say) is compacted. And because slots reference sheet_id and
       * never sheet_order, NOT ONE SLOT ROW IS TOUCHED — a whole sheet travels with both its
       * faces, which is exactly the physical gesture of lifting it out of the rings.
       * Downstream, `v_binder_spread` derives side_index/spread_index from sheet_order, so
       * page numbering renumbers itself. Nothing to keep in sync.
       */
      if (path === '/sheet/reorder' && method === 'POST') {
        const bid = String(body.binder_id || 'mini-binder');
        const want = Array.isArray(body.order) ? body.order.map(v => String(v)) : null;
        if (!want || !want.length) {
          return reply({ ok: false, error: 'order must be a non-empty array of sheet_id, in the desired binder order' }, 400);
        }

        const have = (await all('SELECT sheet_id FROM sheet WHERE binder_id = ? ORDER BY sheet_order', [bid]))
                       .map(r => r.sheet_id);
        if (!have.length) return reply({ ok: false, error: 'binder "' + bid + '" has no sheets' }, 404);

        /* A PERMUTATION CHECK, and it is not pedantry. A SHORT array would renumber the sheets
         * it names and leave the rest parked wherever they were — a scrambled binder that
         * still looks entirely plausible on screen. Refuse the write instead, and say which
         * ids were wrong, because "invalid order" sends you nowhere. */
        const dupes = [...new Set(want.filter((id, i) => want.indexOf(id) !== i))];
        if (dupes.length) {
          return reply({ ok: false, error: 'the same sheet appears more than once in order: ' + dupes.join(', ') }, 400);
        }
        const unknown = want.filter(id => !have.includes(id));
        const missing = have.filter(id => !want.includes(id));
        if (unknown.length || missing.length) {
          return reply({ ok: false,
            error: 'order must list every sheet in this binder exactly once (got ' + want.length + ', binder has ' + have.length + ')',
            unknown: unknown, missing: missing }, 400);
        }

        const parked = Number((await all(
          'SELECT COALESCE(MAX(sheet_order), 0) AS m FROM sheet WHERE binder_id = ?', [bid]))[0].m) + 1;

        const stmts = [];
        const SQL = 'UPDATE sheet SET sheet_order = ?, updated_at = ? WHERE sheet_id = ? AND binder_id = ?';
        // pass 1 — park every sheet above the live range so nothing can collide
        want.forEach((id, i) => stmts.push(db.prepare(SQL).bind(parked + i, t, id, bid)));
        // pass 2 — land them on their final 0-based positions
        want.forEach((id, i) => stmts.push(db.prepare(SQL).bind(i, t, id, bid)));

        try {
          await db.batch(stmts);
        } catch (e) {
          return reply({ ok: false, error: String(e.message || e) }, 400);
        }
        return reply({ ok: true, order: want, sheets: want.length });
      }

      /* Place something in a slot. artwork_id + OPTIONAL edition_id (Q12 = B).
       * The composite FK makes a mismatched pair unwriteable, so this does not check it —
       * the database refuses and the message comes straight back. */
      if (path === '/slot' && method === 'POST') {
        const sheet = String(body.sheet_id || '').trim();
        const side = String(body.side || 'A').toUpperCase();
        const pos = parseInt(body.position, 10);
        if (!sheet) return reply({ ok: false, error: 'sheet_id is required' }, 400);
        if (!(pos >= 0 && pos <= 8)) return reply({ ok: false, error: 'position must be 0-8 (nine slots a face)' }, 400);
        return write(
          `INSERT INTO slot (slot_id,sheet_id,side,position,artwork_id,edition_id,note,created_at,updated_at)
           VALUES (?,?,?,?,?,?,?,?,?)
           ON CONFLICT(sheet_id,side,position) DO UPDATE SET
             artwork_id=excluded.artwork_id, edition_id=excluded.edition_id,
             note=excluded.note, updated_at=excluded.updated_at`,
          [body.slot_id || (sheet + '-' + side.toLowerCase() + pos), sheet, side, pos,
           body.artwork_id || null, body.edition_id || null, body.note || null, t, t]);
      }

      // Clearing a slot DELETES the row. Sparse rows are the design: absence IS empty (J3).
      if (path === '/slot' && method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return reply({ ok: false, error: 'id is required' }, 400);
        return write('DELETE FROM slot WHERE slot_id = ?', [id]);
      }

      /* The route list spans two files, so it is CONCATENATED rather than retyped. A hardcoded
       * copy here would be a second claimant on "which routes exist" and would rot the first
       * time a read is added next door. */
      return reply({ error: 'no route for ' + method + ' ' + path,
                     routes: READ_ROUTES.concat(WRITE_ROUTES) }, 404);

    } catch (e) {
      // Loud, not silent. A 500 that pretends to be an empty result is the failure mode
      // this whole app was rebuilt to eliminate.
      return reply({ error: 'worker: ' + String(e.message || e) }, 500);
    }
  }
};
